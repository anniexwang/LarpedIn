// LarpedIn headshot workflow, deployed on Render Workflows.
//
// generateHeadshots (parent task)
//   1. uploads the photos to fal storage
//   2. fans out one renderOne task per headshot, in parallel
//   3. returns { images: [...] }
// renderOne (child task)
//   calls the AI model once. If it fails, Render retries just that one.
//
// Env var on the Render workflow service: FAL_KEY

import { task } from '@renderinc/sdk/workflows';
import { fal } from '@fal-ai/client';

// Swap to 'fal-ai/nano-banana/edit' for cheaper/faster testing.
const MODEL = 'fal-ai/nano-banana-2/edit';
const RATIOS = ['4:5', '1:1', '16:9'];

function buildPrompt({ hasHair }) {
  // Image order: 1 selfie, 2 outfit, 3 backdrop, 4 hair (optional)
  return [
    'Create a professional LinkedIn headshot of the person in image 1.',
    "Keep the person's face exactly as it is in image 1: same facial features, face shape, skin tone, skin texture, eyes, expression, facial hair, glasses, age and head angle.",
    'Do not beautify, retouch, slim, smooth or change the face or identity in any way.',
    hasHair
      ? 'Give the person the exact hair from image 4 (same color, length, texture, parting and style), blended naturally at the hairline. Use image 4 only as a hair reference and ignore everything else in it.'
      : "Keep the person's hair exactly as it is in image 1.",
    'Dress the person in the outfit shown in image 2, matching its color, fabric, lapels and shirt. Fit it naturally to their neck, shoulders and posture. Ignore any person or face in image 2.',
    'Place them in front of the backdrop shown in image 3, softly out of focus.',
    'Soft, even studio lighting that matches the face. Head and shoulders framing, centered, eye level, photorealistic, sharp focus on the face.',
    'No text, no watermark, no extra people, no accessories that are not in image 1.',
  ].join(' ');
}

function setupFal() {
  if (!process.env.FAL_KEY) throw new Error('FAL_KEY is not set on the Render workflow');
  fal.config({ credentials: process.env.FAL_KEY });
}

// https URLs pass through, data URLs get uploaded to fal storage.
async function toFalUrl(src) {
  if (/^https?:\/\//.test(src)) return src;
  if (!src?.startsWith('data:')) throw new Error('Images must be https or data: URLs (not blob:)');
  const blob = await (await fetch(src)).blob();
  return fal.storage.upload(blob);
}

const renderOne = task(
  {
    name: 'renderOne',
    retry: { maxRetries: 2, waitDurationMs: 2000, backoffScaling: 2 },
    timeoutSeconds: 180,
  },
  async function renderOne(ctx, { imageUrls, prompt, ratio, seed }) {
    setupFal();
    const result = await fal.subscribe(MODEL, {
      input: {
        prompt,
        image_urls: imageUrls,
        num_images: 1,
        aspect_ratio: ratio,
        output_format: 'png',
        seed,
      },
    });
    const url = result.data?.images?.[0]?.url;
    if (!url) throw new Error('Model returned no image'); // triggers a retry
    return url;
  }
);

export const generateHeadshots = task(
  { name: 'generateHeadshots', timeoutSeconds: 600 },
  async function generateHeadshots(ctx, input) {
    const { selfie, outfitImage, backdropImage, hairPhoto, ratio = '4:5', numImages = 2 } = input;
    if (!selfie || !outfitImage || !backdropImage) {
      throw new Error('selfie, outfitImage and backdropImage are required');
    }
    setupFal();

    // Order matters, the prompt refers to images by position.
    const sources = [selfie, outfitImage, backdropImage];
    if (hairPhoto) sources.push(hairPhoto);
    const imageUrls = await Promise.all(sources.map(toFalUrl));

    const payload = {
      imageUrls,
      prompt: buildPrompt({ hasHair: Boolean(hairPhoto) }),
      ratio: RATIOS.includes(ratio) ? ratio : '4:5',
    };

    const count = Math.min(Math.max(Number(numImages) || 1, 1), 4);
    const images = await Promise.all(
      Array.from({ length: count }, () =>
        ctx.run(renderOne, { ...payload, seed: Math.floor(Math.random() * 1e9) })
      )
    );

    return { images };
  }
);
