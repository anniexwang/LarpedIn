// LarpedIn headshot WORKFLOW (Render Workflow service, start command: npm start)
//
// generateHeadshots (main task)
//   starts one renderOne task per headshot, all at the same time,
//   then returns { images: [...] }
// renderOne (small task)
//   asks Base44's built-in AI (Core.GenerateImage) to put the person in the outfit.
//   (The phone then pastes the real face back on and adds the backdrop.)
//   If it fails, Render automatically retries just that one.
//
// Env vars on this Render service:
//   BASE44_APP_ID   your Base44 app's ID (6ae7690b968888ad1ecb8786)

import { task } from '@renderinc/sdk/workflows';
import { createClient } from '@base44/sdk';

function buildPrompt({ hasHair, clothingStyle }) {
  // Reference image order: 1 selfie, 2 outfit, 3 hair (optional).
  // The phone pastes the REAL face back on afterwards and swaps the backdrop,
  // so the AI's only job is the clothes, with the framing kept identical.
  return [
    'Edit the FIRST reference image. Change ONLY the clothing.',
    `Dress the person in the ${clothingStyle === 'female' ? "women's" : "men's"} outfit shown in the SECOND reference image, matching its color, fabric, lapels, shirt and tie. Fit it naturally to their neck, shoulders and posture with realistic folds. Ignore any person or face in the second image.`,
    hasHair
      ? 'Restyle the hair to exactly match the hair in the THIRD reference image (color, length, texture, parting and style). Use the third image only as a hair reference.'
      : 'Keep the hair exactly as it is.',
    'Keep the exact same camera framing, crop, zoom, head position, head size, head angle and pose as the first image, so the edited photo lines up perfectly with the original.',
    'Keep the face completely unchanged. Do not retouch, smooth, slim or beautify anything.',
    'Replace the background with a plain, evenly lit light grey studio wall.',
    'Photorealistic. No text, no watermark, no extra people.',
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
    const { selfie, outfitImage, hairPhoto, clothingStyle = 'male', numImages = 1, token } = input;
    for (const [name, value] of Object.entries({ selfie, outfitImage })) {
      if (!/^https?:\/\//.test(value || '')) throw new Error(`${name} must be an https URL`);
    }

    const imageUrls = [selfie, outfitImage];
    if (hairPhoto) imageUrls.push(hairPhoto);

    const job = { imageUrls, prompt: buildPrompt({ hasHair: Boolean(hairPhoto), clothingStyle }), token };
    const count = Math.min(Math.max(Number(numImages) || 1, 1), 4);

    // Run them side by side instead of one after another.
    const images = await Promise.all(Array.from({ length: count }, () => ctx.run(renderOne, job)));
    return { images };
  }
);
