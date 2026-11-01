// generatePortrait: the Studio page calls this. It hands the job to the Render workflow
// (/render-workflow/index.js), which makes the headshots in parallel with retries by calling
// the makeHeadshotImage function, which uses Base44's built-in AI.
//
// Base44 secrets needed:
//   RENDER_API_KEY        from Render dashboard > Account settings > API keys
//   RENDER_WORKFLOW_SLUG  optional, defaults to "larpedin-headshots" (your workflow's name on Render)
//
// No auth check on purpose: the headshot flow works without login.
//
// Frontend call:
//   const res = await base44.functions.invoke("generatePortrait", {
//     selfie,          // required. data URL or https URL
//     outfitImage,     // required. https URL or data URL
//     backdropImage,   // required. https URL or data URL
//     hairPhoto,       // optional. data URL
//     ratio,           // optional. "4:5" | "1:1" | "16:9"
//     numImages,       // optional. 1 to 4 (default 2)
//   });
//   res.data -> { images: string[] } or { error: string }

import { Render } from "npm:@renderinc/sdk";

Deno.serve(async (req) => {
  try {
    const input = await req.json();
    if (!input.selfie || !input.outfitImage || !input.backdropImage) {
      return Response.json({ error: "selfie, outfitImage and backdropImage are required" }, { status: 400 });
    }

    if (!Deno.env.get("RENDER_API_KEY")) {
      return Response.json({ error: "RENDER_API_KEY not set" }, { status: 500 });
    }

    const slug = Deno.env.get("RENDER_WORKFLOW_SLUG") || "larpedin-headshots";
    const render = new Render({ token: Deno.env.get("RENDER_API_KEY") });

    const run = await render.workflows.startTask(`${slug}/generateHeadshots`, [input]);
    const finished = await run.get(); // waits until the workflow is done

    if (finished.status !== "succeeded" && finished.status !== "completed") {
      console.error("Render run did not succeed", finished);
      return Response.json({ error: finished.error || `Headshot job ${finished.status}` }, { status: 502 });
    }

    // results is an array of the task's return values
    const output = Array.isArray(finished.results) ? finished.results[0] : finished.results;
    const images = output?.images ?? [];
    if (!images.length) return Response.json({ error: "No image returned" }, { status: 502 });

    return Response.json({ images });
  } catch (err) {
    console.error("generatePortrait failed", err);
    return Response.json({ error: String((err as Error)?.message ?? err) }, { status: 500 });
  }
});
