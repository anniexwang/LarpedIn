// LarpedIn headshot WORKFLOW (Render Workflow service, start command: npm start)
//
// generateHeadshots (main task)
//   starts one renderOne task per headshot, all at the same time,
//   then returns { images: [...] }
// renderOne (small task)
//   asks Base44's built-in AI (Core.GenerateImage, Nano Banana) for one headshot.
//   If it fails, Render automatically retries just that one.
//
// Env vars on this Render service:
//   BASE44_APP_ID   your Base44 app's ID (6ae7690b968888ad1ecb8786)

import { task } from '@renderinc/sdk/workflows';
import { createClient } from '@base44/sdk';

const RATIO_WORDS = {
  '4:5': 'a vertical 4:5 portrait',
  '1:1': 'a square 1:1',
  '16:9': 'a wide 16:9 landscape',
};

function buildPrompt({ hasHair, ratio }) {
  // Reference image order: 1 selfie, 2 outfit, 3 backdrop, 4 hair (optional)
  return [
    'Create a professional LinkedIn headshot of the person in the FIRST reference image.',
    "Keep the person's face exactly as it is in the first image: same facial features, face shape, skin tone, skin texture, eyes, expression, facial hair, glasses, age and head angle.",
    'Do not beautify, retouch, slim, smooth or change the face or identity in any way.',
    hasHair
      ? 'Give the person the exact hair from the FOURTH reference image (same color, length, texture, parting and style), blended naturally at the hairline. Use the fourth image only as a hair reference.'
      : "Keep the person's hair exactly as it is in the first image.",
    'Dress the person in the outfit shown in the SECOND reference image, matching its color, fabric, lapels and shirt. Fit it naturally to their neck, shoulders and posture. Ignore any person or face in the second image.',
    'Place them in front of the backdrop shown in the THIRD reference image, softly out of focus.',
    `Compose it as ${RATIO_WORDS[ratio] || RATIO_WORDS['4:5']} image. Soft, even studio lighting that matches the face. Head and shoulders framing, centered, eye level, photorealistic, sharp focus on the face.`,
    'No text, no watermark, no extra people, no accessories that are not in the first image.',
  ].join(' ');
}

const renderOne = task(
  {
    name: 'renderOne',
    retry: { maxRetries: 2, waitDurationMs: 2000, backoffScaling: 2 },
    timeoutSeconds: 240,
  },
  async function renderOne(ctx, { imageUrls, prompt, token }) {
    if (!process.env.BASE44_APP_ID) throw new Error('BASE44_APP_ID is not set on Render');

    // Acts as the logged-in user, so it uses the app's normal Base44 AI credits.
    const base44 = createClient({ appId: process.env.BASE44_APP_ID, token: token || undefined });
    const { url } = await base44.integrations.Core.GenerateImage({
      prompt,
      existing_image_urls: imageUrls,
    });

    if (!url) throw new Error('Base44 returned no image'); // throwing = Render retries
    return url;
  }
);

export const generateHeadshots = task(
  { name: 'generateHeadshots', timeoutSeconds: 600 },
  async function generateHeadshots(ctx, input) {
    const { selfie, outfitImage, backdropImage, hairPhoto, ratio = '4:5', numImages = 2, token } = input;
    for (const [name, value] of Object.entries({ selfie, outfitImage, backdropImage })) {
      if (!/^https?:\/\//.test(value || '')) throw new Error(`${name} must be an https URL`);
    }

    const imageUrls = [selfie, outfitImage, backdropImage];
    if (hairPhoto) imageUrls.push(hairPhoto);

    const job = { imageUrls, prompt: buildPrompt({ hasHair: Boolean(hairPhoto), ratio }), token };
    const count = Math.min(Math.max(Number(numImages) || 1, 1), 4);

    // Run them side by side instead of one after another.
    const images = await Promise.all(Array.from({ length: count }, () => ctx.run(renderOne, job)));
    return { images };
  }
);
