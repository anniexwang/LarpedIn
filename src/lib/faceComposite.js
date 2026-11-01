// Keeps your REAL face in the final headshot.
//
// The AI only changes the clothes, and in doing so it redraws the whole photo,
// which subtly changes the face. So after the AI is done, this file runs on the
// phone and:
//   1. finds the face in the original selfie and in the AI image (face tracking),
//   2. lines the AI image up with the original (same eye positions),
//   3. cuts the person out of the AI image (body in the new outfit),
//   4. cuts the face (and hair) out of the ORIGINAL selfie,
//   5. stacks: backdrop -> AI body -> original face, with soft edges,
//   6. crops to the chosen size (4:5, 1:1, 16:9).
//
// Uses Google's free MediaPipe models, loaded from a CDN the first time.

import { HEADSHOT_API_URL } from '@/lib/headshotApi';

const MP_VERSION = '1.1.0';
const MP_BUNDLE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`;
const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const SEG_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite';
const FACE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// Classes from the multiclass selfie model
const BG = 0, HAIR = 1, BODY_SKIN = 2, FACE_SKIN = 3, OTHERS = 5;

let toolsPromise = null;

function getTools() {
  if (!toolsPromise) {
    toolsPromise = (async () => {
      const { FilesetResolver, ImageSegmenter, FaceLandmarker } = await import(/* @vite-ignore */ MP_BUNDLE);
      const fileset = await FilesetResolver.forVisionTasks(MP_WASM);
      const [segmenter, landmarker] = await Promise.all([
        ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: SEG_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        }),
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          numFaces: 1,
        }),
      ]);
      return { segmenter, landmarker };
    })().catch((err) => {
      toolsPromise = null;
      throw err;
    });
  }
  return toolsPromise;
}

// Start downloading the face tools early so Generate feels faster.
export function preloadFaceTools() {
  getTools().catch(() => {});
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

// Web images go through our Render server so the browser is allowed to read their pixels.
async function loadImage(src, maxSide = 1280) {
  const url = /^https?:\/\//.test(src) ? `${HEADSHOT_API_URL}/image?url=${encodeURIComponent(src)}` : src;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load image (${res.status})`);
  const bitmap = await createImageBitmap(await res.blob());
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const c = makeCanvas(bitmap.width * scale, bitmap.height * scale);
  c.getContext('2d').drawImage(bitmap, 0, 0, c.width, c.height);
  bitmap.close?.();
  return c;
}

function faceInfo(landmarker, canvas) {
  const lm = landmarker.detect(canvas).faceLandmarks?.[0];
  if (!lm) return null;
  const P = (i) => ({ x: lm[i].x * canvas.width, y: lm[i].y * canvas.height });
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of lm) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  return {
    leftEye: mid(P(33), P(133)),
    rightEye: mid(P(362), P(263)),
    box: {
      x: minX * canvas.width,
      y: minY * canvas.height,
      w: (maxX - minX) * canvas.width,
      h: (maxY - minY) * canvas.height,
    },
  };
}

function drawCover(ctx, img, W, H) {
  const s = Math.max(W / img.width, H / img.height);
  const w = img.width * s, h = img.height * s;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

// Redraw the AI image so its eyes land exactly where the original's eyes are.
function alignTo(original, generated, fo, fg) {
  const out = makeCanvas(original.width, original.height);
  const ctx = out.getContext('2d');
  if (!fo || !fg) {
    drawCover(ctx, generated, out.width, out.height);
    return out;
  }
  const vo = { x: fo.rightEye.x - fo.leftEye.x, y: fo.rightEye.y - fo.leftEye.y };
  const vg = { x: fg.rightEye.x - fg.leftEye.x, y: fg.rightEye.y - fg.leftEye.y };
  const scale = Math.hypot(vo.x, vo.y) / Math.hypot(vg.x, vg.y);
  const angle = Math.atan2(vo.y, vo.x) - Math.atan2(vg.y, vg.x);
  ctx.translate(fo.leftEye.x, fo.leftEye.y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.translate(-fg.leftEye.x, -fg.leftEye.y);
  ctx.drawImage(generated, 0, 0);
  return out;
}

function segment(segmenter, canvas) {
  const result = segmenter.segment(canvas);
  const mask = result.categoryMask;
  const data = { w: mask.width, h: mask.height, cats: mask.getAsUint8Array().slice() };
  result.close();
  return data;
}

// Softens mask edges so the cut-outs blend instead of looking pasted on.
function blurAlpha(a, w, h, r) {
  if (r < 1) return a;
  const tmp = new Float32Array(w * h);
  const out = new Uint8ClampedArray(w * h);
  const win = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = -r; x <= r; x++) sum += a[y * w + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = sum / win;
      sum += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / win;
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

function alphaCanvas(alpha, w, h) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < alpha.length; i++) {
    img.data[i * 4] = 255;
    img.data[i * 4 + 1] = 255;
    img.data[i * 4 + 2] = 255;
    img.data[i * 4 + 3] = alpha[i];
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function cutOut(source, maskCanvas) {
  const c = makeCanvas(source.width, source.height);
  const ctx = c.getContext('2d');
  ctx.drawImage(source, 0, 0);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0, c.width, c.height);
  return c;
}

const RATIOS = { '4:5': 4 / 5, '1:1': 1, '16:9': 16 / 9 };

function cropToRatio(canvas, ratio, box) {
  const r = RATIOS[ratio] || RATIOS['4:5'];
  const W = canvas.width, H = canvas.height;
  let cw = W, ch = W / r;
  if (ch > H) { ch = H; cw = H * r; }
  const cx = box ? box.x + box.w / 2 : W / 2;
  const cy = box ? box.y + box.h / 2 : H * 0.4;
  const x = Math.min(Math.max(cx - cw / 2, 0), W - cw);
  const y = Math.min(Math.max(cy - ch * 0.42, 0), H - ch); // face a bit above center
  const longSide = 1280;
  const s = Math.min(1, longSide / Math.max(cw, ch));
  const out = makeCanvas(cw * s, ch * s);
  out.getContext('2d').drawImage(canvas, x, y, cw, ch, 0, 0, out.width, out.height);
  return out.toDataURL('image/jpeg', 0.92);
}

/**
 * Builds the final headshot: original face + AI outfit + chosen backdrop.
 * Returns a JPEG data URL.
 */
export async function compositeHeadshot({ selfie, generated, backdrop, ratio, keepOriginalHair = true }) {
  const { segmenter, landmarker } = await getTools();
  const [O, G, B] = await Promise.all([loadImage(selfie), loadImage(generated), loadImage(backdrop)]);

  const fo = faceInfo(landmarker, O);
  if (!fo) throw new Error('No face found in the selfie');
  const fg = faceInfo(landmarker, G);
  const Ga = alignTo(O, G, fo, fg);

  const so = segment(segmenter, O);
  const sg = segment(segmenter, Ga);
  if (so.w !== sg.w || so.h !== sg.h) throw new Error('Mask sizes do not match');
  const { w, h } = so;
  const sx = w / O.width, sy = h / O.height;
  const fb = {
    x0: (fo.box.x - fo.box.w * 0.15) * sx,
    x1: (fo.box.x + fo.box.w * 1.15) * sx,
    y0: (fo.box.y - fo.box.h * 0.2) * sy,
    y1: (fo.box.y + fo.box.h * 1.05) * sy,
  };

  const body = new Uint8ClampedArray(w * h);
  const head = new Uint8ClampedArray(w * h);
  for (let i = 0; i < w * h; i++) {
    const co = so.cats[i];
    const cg = sg.cats[i];
    // AI person (new outfit). If we keep the real hair, drop the AI's hair.
    body[i] = cg !== BG && !(keepOriginalHair && cg === HAIR) ? 255 : 0;
    // Real face from the original. Real neck only where the AI also shows neck.
    const x = i % w, y = (i / w) | 0;
    const inFace = x >= fb.x0 && x <= fb.x1 && y >= fb.y0 && y <= fb.y1;
    head[i] =
      co === FACE_SKIN ||
      (keepOriginalHair && co === HAIR) ||
      (co === BODY_SKIN && cg === BODY_SKIN) ||
      (co === OTHERS && inFace) // glasses, earrings
        ? 255
        : 0;
  }

  const blur = Math.max(1, Math.round(Math.min(w, h) / 300));
  const bodyMask = alphaCanvas(blurAlpha(body, w, h, blur), w, h);
  const headMask = alphaCanvas(blurAlpha(head, w, h, blur + 1), w, h);

  const out = makeCanvas(O.width, O.height);
  const ctx = out.getContext('2d');
  drawCover(ctx, B, out.width, out.height);
  ctx.drawImage(cutOut(Ga, bodyMask), 0, 0);
  ctx.drawImage(cutOut(O, headMask), 0, 0);

  return cropToRatio(out, ratio, fo.box);
}
