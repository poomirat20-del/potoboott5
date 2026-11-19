export type LayoutId = 'single' | 'strip3' | 'strip4' | 'grid4';

export type FontFamilyId = 'Charm' | 'Kanit' | 'Sarabun';

export type AppStep = 'welcome' | 'camera' | 'editor';

export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoboothLayout {
  id: LayoutId;
  name: string;
  subtitle: string;
  shotCount: number;
  canvasWidth: number;
  canvasHeight: number;
  topPadding: number;
  bottomPadding: number;
  sidePadding: number;
  gap: number;
  slots: PhotoSlot[];
}

export interface BackgroundTone {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sparkleColor: string;
  isLight?: boolean;
}

export interface StickerDefinition {
  id: string;
  name: string;
  category: 'krathong' | 'festival' | 'temple' | 'flora';
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
  previewSvg: string;
}

export interface PlacedSticker {
  uid: string;
  stickerId: string;
  /** Normalized 0..1 center X on canvas */
  x: number;
  /** Normalized 0..1 center Y on canvas */
  y: number;
  /** Scale multiplier relative to base sticker size (default 1.0) */
  scale: number;
  /** Rotation in degrees (-180..180) */
  rotation: number;
}

export interface TextOverlay {
  uid: string;
  text: string;
  /** Normalized 0..1 center X on canvas */
  x: number;
  /** Normalized 0..1 center Y on canvas */
  y: number;
  /** Font size in canvas reference pixels (11..36) */
  fontSize: number;
  color: string;
  strokeColor: string;
  fontFamily: FontFamilyId;
  rotation: number;
}

export interface FrameMetrics {
  canvasWidth: number;
  canvasHeight: number;
  topAreaHeight: number;
  bottomAreaY: number;
  bottomAreaHeight: number;
  contentTop: number;
  contentBottom: number;
  contentLeft: number;
  contentRight: number;
  scale: number;
}

export interface PhotoboothFrame {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    metrics: FrameMetrics,
    tone: BackgroundTone
  ) => void;
}
