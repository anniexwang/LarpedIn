// LarpedIn headshot workflow, running on Render Workflows.
//
// Render's job here is reliability: it runs the headshots in parallel and
// automatically retries any one that fails. The actual AI image is made by
// the Base44 function "makeHeadshotImage" (Base44's built-in AI, no extra account).
//
// generateHeadshots (main task)
//   starts one renderOne task per headshot, all at the same time,
//   then returns { images: [...] }
// renderOne (small task)
//   asks Base44 for one headshot. If it fails, Render retries just that one.
//
// Env vars on the Render workflow service:
//   BASE44_APP_URL    your live app's address, e.g. https://larpedin.base44.app
//   LARPEDIN_SECRET   same password you put in Base44's secrets

import { task } from '@renderinc/sdk/workflows';

const renderOne = task(
  {
    name: 'renderOne',
    retry: { maxRetries: 2, waitDurationMs: 2000, backoffScaling: 2 },
    timeoutSeconds: 180,
  },
  async function renderOne(ctx, input) {
    const appUrl = process.env.BASE44_APP_URL?.replace(/\/$/, '');
    if (!appUrl || !process.env.LARPEDIN_SECRET) {
      throw new Error('BASE44_APP_URL and LARPEDIN_SECRET must be set on Render');
    }

    const res = await fetch(`${appUrl}/functions/makeHeadshotImage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-larpedin-secret': process.env.LARPEDIN_SECRET,
      },
      body: JSON.stringify(input),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok || !body.url) throw new Error(body.error || `Base44 returned ${res.status}`);
    return body.url;
  }
);

export const generateHeadshots = task(
  { name: 'generateHeadshots', timeoutSeconds: 600 },
  async function generateHeadshots(ctx, input) {
    const {
      selfie,
      outfitImage,
      backdropImage,
      hairPhoto,
      clothingStyle = 'male',
      ratio = '4:5',
      numImages = 2,
      token,
    } = input;

    for (const [name, value] of Object.entries({ selfie, outfitImage, backdropImage })) {
      if (!/^(https?:\/\/|data:image\/)/.test(value || '')) {
        throw new Error(`${name} must be an https URL or image data URL`);
      }
    }

    if (hairPhoto && !/^(https?:\/\/|data:image\/)/.test(hairPhoto)) {
      throw new Error('hairPhoto must be an https URL or image data URL');
    }

    const job = { selfie, outfitImage, backdropImage, hairPhoto, clothingStyle, ratio, token };
    const count = Math.min(Math.max(Number(numImages) || 1, 1), 4);

    // Run them side by side instead of one after another.
    const images = await Promise.all(Array.from({ length: count }, () => ctx.run(renderOne, job)));
    return { images };
  }
);
