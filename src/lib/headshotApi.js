import { getAccessToken } from '@base44/sdk';
import { base44 } from '@/api/base44Client';

// Address of the Render Web Service (render-workflow/server.js).
// After you create it on Render, copy its address from the top of its page
// and paste it here if it's different.
export const HEADSHOT_API_URL = 'https://larpedin-headshots-api.onrender.com';

// The AI needs real web links to the photos, so photos taken on the phone
// (data: URLs) get uploaded to Base44 storage first.
async function toPublicUrl(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  const blob = await (await fetch(src)).blob();
  const file = new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' });
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  return file_url;
}

// Asks Render for the AI outfit image(s). The backdrop is added later on the phone.
export async function generateHeadshots({ selfie, outfitImage, clothingStyle, hairPhoto, numImages = 1 }) {
  const [selfieUrl, outfitUrl, hairUrl] = await Promise.all([selfie, outfitImage, hairPhoto].map(toPublicUrl));

  const res = await fetch(`${HEADSHOT_API_URL}/headshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      selfie: selfieUrl,
      outfitImage: outfitUrl,
      hairPhoto: hairUrl,
      clothingStyle,
      numImages,
      token: getAccessToken(), // lets Render use Base44's AI as you
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) throw new Error(body.error || `Headshot service error ${res.status}`);
  return body.images;
}
