// makeHeadshotImage: makes ONE headshot using Base44's built-in AI (no outside AI account needed).
// Only the Render workflow calls this, over the web, using a shared password.
//
// Base44 secret needed:
//   LARPEDIN_SECRET   any long random password you make up. Must match the one on Render.
//
// Input (JSON):  { selfie, outfitImage, backdropImage, hairPhoto?, ratio? }
// Output (JSON): { url } or { error }

import { createClientFromRequest } from "npm:@base44/sdk";

const MODEL = "nano_banana_2_1"; // Google's Nano Banana, through Base44
const RATIOS = ["4:5", "1:1", "16:9"];

function buildPrompt(hasHair: boolean) {
  // Image order: 1 selfie, 2 outfit, 3 backdrop, 4 hair (optional)
  return [
    "Create a professional LinkedIn headshot of the person in image 1.",
    "Keep the person's face exactly as it is in image 1: same facial features, face shape, skin tone, skin texture, eyes, expression, facial hair, glasses, age and head angle.",
    "Do not beautify, retouch, slim, smooth or change the face or identity in any way.",
    hasHair
      ? "Give the person the exact hair from image 4 (same color, length, texture, parting and style), blended naturally at the hairline. Use image 4 only as a hair reference and ignore everything else in it."
      : "Keep the person's hair exactly as it is in image 1.",
    "Dress the person in the outfit shown in image 2, matching its color, fabric, lapels and shirt. Fit it naturally to their neck, shoulders and posture. Ignore any person or face in image 2.",
    "Place them in front of the backdrop shown in image 3, softly out of focus.",
    "Soft, even studio lighting that matches the face. Head and shoulders framing, centered, eye level, photorealistic, sharp focus on the face.",
    "No text, no watermark, no extra people, no accessories that are not in image 1.",
  ].join(" ");
}

Deno.serve(async (req) => {
  try {
    // Only our Render workflow knows this password.
    const expected = Deno.env.get("LARPEDIN_SECRET");
    if (!expected || req.headers.get("x-larpedin-secret") !== expected) {
      return Response.json({ error: "Not allowed" }, { status: 401 });
    }

    const { selfie, outfitImage, backdropImage, hairPhoto, ratio = "4:5" } = await req.json();
    if (!selfie || !outfitImage || !backdropImage) {
      return Response.json({ error: "selfie, outfitImage and backdropImage are required" }, { status: 400 });
    }

    const references = [selfie, outfitImage, backdropImage];
    if (hairPhoto) references.push(hairPhoto);

    const base44 = createClientFromRequest(req);
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();

    const res = await fetch(`${baseURL}/images/edits`, {
      method: "POST",
      headers: { ...headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: buildPrompt(Boolean(hairPhoto)),
        reference_image_urls: references, // https URLs or data: URLs both work
        aspect_ratio: RATIOS.includes(ratio) ? ratio : "4:5",
        n: 1,
        response_format: "url",
      }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("AI gateway error", res.status, body);
      // 402 means the app is out of Base44 credits
      return Response.json({ error: body?.error?.message || `AI gateway error ${res.status}` }, { status: res.status });
    }

    const url = body?.data?.[0]?.url;
    if (!url) return Response.json({ error: "No image returned" }, { status: 502 });
    return Response.json({ url });
  } catch (err) {
    console.error("makeHeadshotImage failed", err);
    return Response.json({ error: String((err as Error)?.message ?? err) }, { status: 500 });
  }
});
