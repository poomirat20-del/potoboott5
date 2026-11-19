import { FRAME_MAP } from '../constants/frames';
import { PHOTOBOOTH_LAYOUTS } from '../constants/layouts';
import { STICKER_MAP } from '../constants/stickers';
import {
  BackgroundTone,
  FrameMetrics,
  LayoutId,
  PlacedSticker,
  TextOverlay,
} from '../types';

const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const existing = imageCache.get(src);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  radius: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = dw / dh;

  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(dx, dy, dw, dh, radius);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
}

function drawSparkles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  scale: number
) {
  ctx.save();
  // Deterministic starlight points around the border & background
  const count = 42;
  for (let i = 0; i < count; i++) {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const rx = seed1 - Math.floor(seed1);
    const ry = seed2 - Math.floor(seed2);
    const x = rx * width;
    const y = ry * height;
    const r = (1.5 + (i % 4) * 1.1) * scale;
    const alpha = 0.25 + (i % 5) * 0.12;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function getFrameMetrics(layoutId: LayoutId): FrameMetrics {
  const layout = PHOTOBOOTH_LAYOUTS[layoutId];
  const minY = Math.min(...layout.slots.map((s) => s.y));
  const maxY = Math.max(...layout.slots.map((s) => s.y + s.height));
  const minX = Math.min(...layout.slots.map((s) => s.x));
  const maxX = Math.max(...layout.slots.map((s) => s.x + s.width));

  return {
    canvasWidth: layout.canvasWidth,
    canvasHeight: layout.canvasHeight,
    topAreaHeight: minY,
    bottomAreaY: maxY,
    bottomAreaHeight: layout.canvasHeight - maxY,
    contentTop: minY,
    contentBottom: maxY,
    contentLeft: minX,
    contentRight: maxX,
    scale: layout.canvasWidth / 650,
  };
}

function drawFittedCustomText(
  ctx: CanvasRenderingContext2D,
  overlay: TextOverlay,
  canvasWidth: number,
  canvasHeight: number
) {
  const baseScale = canvasWidth / 650;
  let fontPx = overlay.fontSize * baseScale;
  const maxWidth = canvasWidth * 0.88;
  const fontFamilyStack =
    overlay.fontFamily === 'Charm'
      ? '"Charm", cursive'
      : overlay.fontFamily === 'Sarabun'
        ? '"Sarabun", sans-serif'
        : '"Kanit", sans-serif';

  ctx.save();
  const cx = overlay.x * canvasWidth;
  const cy = overlay.y * canvasHeight;
  ctx.translate(cx, cy);
  ctx.rotate((overlay.rotation * Math.PI) / 180);

  ctx.font = `700 ${fontPx}px ${fontFamilyStack}`;
  const measured = ctx.measureText(overlay.text);
  if (measured.width > maxWidth && measured.width > 0) {
    fontPx = Math.max(10 * baseScale, fontPx * (maxWidth / measured.width));
    ctx.font = `700 ${fontPx}px ${fontFamilyStack}`;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';

  // Soft legibility shadow + crisp outline
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 6 * baseScale;
  ctx.shadowOffsetY = 2 * baseScale;

  if (overlay.strokeColor && overlay.strokeColor !== 'none') {
    ctx.strokeStyle = overlay.strokeColor;
    ctx.lineWidth = Math.max(2, fontPx * 0.14);
    ctx.strokeText(overlay.text, 0, 0);
  }

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = overlay.color;
  ctx.fillText(overlay.text, 0, 0);
  ctx.restore();
}

export interface RenderOptions {
  layoutId: LayoutId;
  photos: string[];
  tone: BackgroundTone;
  frameId: string;
  stickers: PlacedSticker[];
  texts: TextOverlay[];
  showSparkles: boolean;
  pixelRatio?: number;
}

export async function renderPhotoboothCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const layout = PHOTOBOOTH_LAYOUTS[options.layoutId];
  const pixelRatio = options.pixelRatio ?? 2;

  const targetW = Math.round(layout.canvasWidth * pixelRatio);
  const targetH = Math.round(layout.canvasHeight * pixelRatio);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Ensure web fonts are loaded before drawing custom text
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed cleanly
    }
  }

  const loadedImages = await Promise.all(
    layout.slots.map((_, idx) => {
      const src = options.photos[idx];
      if (!src) return Promise.resolve(null);
      return loadImage(src).catch(() => null);
    })
  );

  ctx.save();
  ctx.scale(pixelRatio, pixelRatio);

  const w = layout.canvasWidth;
  const h = layout.canvasHeight;
  const metrics = getFrameMetrics(options.layoutId);

  // 1. Background tone gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, options.tone.primaryColor);
  bgGrad.addColorStop(0.5, options.tone.secondaryColor);
  bgGrad.addColorStop(1, options.tone.primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Ambient festival starlight sparkles
  if (options.showSparkles) {
    drawSparkles(ctx, w, h, options.tone.sparkleColor, metrics.scale);
  }

  // 3. User photo slots
  const cornerRadius = 12 * metrics.scale;
  layout.slots.forEach((slot, idx) => {
    const img = loadedImages[idx];

    // Subtle slot frame shadow & border
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 14 * metrics.scale;
    ctx.shadowOffsetY = 4 * metrics.scale;
    ctx.fillStyle = options.tone.isLight ? '#E2E8F0' : '#0F172A';
    ctx.beginPath();
    ctx.roundRect(slot.x, slot.y, slot.width, slot.height, cornerRadius);
    ctx.fill();
    ctx.restore();

    if (img) {
      drawCoverImage(ctx, img, slot.x, slot.y, slot.width, slot.height, cornerRadius);
    }

    ctx.save();
    ctx.strokeStyle = options.tone.isLight
      ? 'rgba(180, 83, 9, 0.35)'
      : 'rgba(253, 230, 138, 0.35)';
    ctx.lineWidth = 2 * metrics.scale;
    ctx.beginPath();
    ctx.roundRect(slot.x, slot.y, slot.width, slot.height, cornerRadius);
    ctx.stroke();
    ctx.restore();
  });

  // 4. Decorative Frame (12 themes, zero baked-in text)
  const frame = FRAME_MAP[options.frameId];
  if (frame) {
    frame.draw(ctx, metrics, options.tone);
  }

  // 5. Placed Stickers
  const baseStickerPx = 88 * metrics.scale;
  for (const placed of options.stickers) {
    const def = STICKER_MAP[placed.stickerId];
    if (!def) continue;
    ctx.save();
    ctx.translate(placed.x * w, placed.y * h);
    ctx.rotate((placed.rotation * Math.PI) / 180);
    def.draw(ctx, baseStickerPx * placed.scale);
    ctx.restore();
  }

  // 6. Custom Movable Texts
  for (const textItem of options.texts) {
    if (!textItem.text.trim()) continue;
    drawFittedCustomText(ctx, textItem, w, h);
  }

  ctx.restore();
}

export async function exportPhotoboothImage(
  options: Omit<RenderOptions, 'pixelRatio'>,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.94,
  pixelRatio = 2
): Promise<string> {
  const offscreen = document.createElement('canvas');
  await renderPhotoboothCanvas(offscreen, { ...options, pixelRatio });
  return offscreen.toDataURL(format, quality);
}
