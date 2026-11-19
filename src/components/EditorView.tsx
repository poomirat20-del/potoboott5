import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenterHorizontal,
  ArrowLeft,
  Check,
  Crosshair,
  Download,
  Frame as FrameIcon,
  Palette,
  Plus,
  Printer,
  QrCode,
  Sparkles,
  Sticker as StickerIcon,
  Trash2,
  Type,
} from 'lucide-react';
import { PHOTOBOOTH_FRAMES } from '../constants/frames';
import { PHOTOBOOTH_LAYOUTS } from '../constants/layouts';
import { LOY_KRATHONG_STICKERS } from '../constants/stickers';
import { BACKGROUND_TONES, darkenHex, isHexLight } from '../constants/tones';
import {
  BackgroundTone,
  FontFamilyId,
  LayoutId,
  PlacedSticker,
  TextOverlay,
} from '../types';
import {
  exportPhotoboothImage,
  renderPhotoboothCanvas,
} from '../utils/canvasRenderer';
import { PrintPreview } from './PrintPreview';
import { QRCodeModal } from './QRCodeModal';

interface EditorViewProps {
  layoutId: LayoutId;
  photos: string[];
  onBackToCamera: () => void;
  onSetPrintImage: (dataUrl: string) => void;
}

type StudioTab = 'frames' | 'tones' | 'stickers' | 'text';
type StickerCategory = 'all' | 'krathong' | 'festival' | 'temple' | 'flora';

const TEXT_COLOR_PRESETS = [
  '#FEF08A',
  '#FFFFFF',
  '#F59E0B',
  '#F472B6',
  '#38BDF8',
  '#4ADE80',
  '#1E293B',
  '#991B1B',
];

const STROKE_PRESETS = [
  { id: '#000000', label: 'ขอบดำ' },
  { id: '#FFFFFF', label: 'ขอบขาว' },
  { id: '#78350F', label: 'ขอบน้ำตาลทอง' },
  { id: 'none', label: 'ไม่มีขอบ' },
];

export const EditorView: React.FC<EditorViewProps> = ({
  layoutId,
  photos,
  onBackToCamera,
  onSetPrintImage,
}) => {
  const layout = PHOTOBOOTH_LAYOUTS[layoutId];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageBoxRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<StudioTab>('frames');
  const [frameId, setFrameId] = useState<string>(PHOTOBOOTH_FRAMES[0].id);
  const [tone, setTone] = useState<BackgroundTone>(BACKGROUND_TONES[0]);
  const [customColor, setCustomColor] = useState<string>('#0A1428');
  const [showSparkles, setShowSparkles] = useState<boolean>(true);

  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(null);
  const [stickerCategory, setStickerCategory] = useState<StickerCategory>('all');

  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [selectedTextUid, setSelectedTextUid] = useState<string | null>(null);

  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: layout.canvasWidth,
    height: layout.canvasHeight,
  });

  const [snapGuide, setSnapGuide] = useState<{ x: boolean; y: boolean }>({
    x: false,
    y: false,
  });

  const [dragging, setDragging] = useState<{
    type: 'sticker' | 'text';
    uid: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const [exportBusy, setExportBusy] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [qrPayload, setQrPayload] = useState<{ jpeg: string; png: string } | null>(null);
  const [printPng, setPrintPng] = useState<string | null>(null);

  // Measure live canvas size for accurate pointer drag mapping
  useEffect(() => {
    const el = stageBoxRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Re-render live WYSIWYG canvas whenever any state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    renderPhotoboothCanvas(canvas, {
      layoutId,
      photos,
      tone,
      frameId,
      stickers,
      texts,
      showSparkles,
      pixelRatio: 1.5,
    }).catch((err) => {
      if (!cancelled) console.error('Render error:', err);
    });
    return () => {
      cancelled = true;
    };
  }, [layoutId, photos, tone, frameId, stickers, texts, showSparkles]);

  const selectedSticker = useMemo(
    () => stickers.find((s) => s.uid === selectedStickerUid) ?? null,
    [stickers, selectedStickerUid]
  );

  const selectedText = useMemo(
    () => texts.find((t) => t.uid === selectedTextUid) ?? null,
    [texts, selectedTextUid]
  );

  const filteredStickers = useMemo(() => {
    if (stickerCategory === 'all') return LOY_KRATHONG_STICKERS;
    return LOY_KRATHONG_STICKERS.filter((s) => s.category === stickerCategory);
  }, [stickerCategory]);

  const handleSelectCustomColor = (hex: string) => {
    setCustomColor(hex);
    const light = isHexLight(hex);
    setTone({
      id: 'custom',
      name: 'สีกำหนดเอง',
      primaryColor: hex,
      secondaryColor: darkenHex(hex, 0.35),
      accentColor: light ? '#B45309' : '#F5B041',
      sparkleColor: light ? '#D97706' : '#FDE68A',
      isLight: light,
    });
  };

  const handleAddSticker = (stickerId: string) => {
    const uid = `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const next: PlacedSticker = {
      uid,
      stickerId,
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
    };
    setStickers((prev) => [...prev, next]);
    setSelectedStickerUid(uid);
    setSelectedTextUid(null);
  };

  const handleAddText = () => {
    const uid = `txt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const next: TextOverlay = {
      uid,
      text: 'สุขสันต์วันลอยกระทง',
      x: 0.5,
      y: 0.5,
      fontSize: 22,
      color: '#FEF08A',
      strokeColor: '#000000',
      fontFamily: 'Kanit',
      rotation: 0,
    };
    setTexts((prev) => [...prev, next]);
    setSelectedTextUid(uid);
    setSelectedStickerUid(null);
    setActiveTab('text');
  };

  const updateSelectedSticker = useCallback(
    (patch: Partial<PlacedSticker>) => {
      if (!selectedStickerUid) return;
      setStickers((prev) =>
        prev.map((s) => (s.uid === selectedStickerUid ? { ...s, ...patch } : s))
      );
    },
    [selectedStickerUid]
  );

  const updateSelectedText = useCallback(
    (patch: Partial<TextOverlay>) => {
      if (!selectedTextUid) return;
      setTexts((prev) =>
        prev.map((t) => (t.uid === selectedTextUid ? { ...t, ...patch } : t))
      );
    },
    [selectedTextUid]
  );

  // Dragging handlers on stage overlay
  const handlePointerDownItem = (
    e: React.PointerEvent,
    type: 'sticker' | 'text',
    uid: string,
    origX: number,
    origY: number
  ) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (type === 'sticker') {
      setSelectedStickerUid(uid);
      setSelectedTextUid(null);
      setActiveTab('stickers');
    } else {
      setSelectedTextUid(uid);
      setSelectedStickerUid(null);
      setActiveTab('text');
    }
    setDragging({
      type,
      uid,
      startX: e.clientX,
      startY: e.clientY,
      origX,
      origY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || stageSize.width === 0 || stageSize.height === 0) return;
    const dx = (e.clientX - dragging.startX) / stageSize.width;
    const dy = (e.clientY - dragging.startY) / stageSize.height;

    let nx = Math.min(0.96, Math.max(0.04, dragging.origX + dx));
    let ny = Math.min(0.96, Math.max(0.04, dragging.origY + dy));

    const snapX = Math.abs(nx - 0.5) < 0.025;
    const snapY = Math.abs(ny - 0.5) < 0.025;
    if (snapX) nx = 0.5;
    if (snapY) ny = 0.5;
    setSnapGuide({ x: snapX, y: snapY });

    if (dragging.type === 'sticker') {
      setStickers((prev) =>
        prev.map((s) => (s.uid === dragging.uid ? { ...s, x: nx, y: ny } : s))
      );
    } else {
      setTexts((prev) =>
        prev.map((t) => (t.uid === dragging.uid ? { ...t, x: nx, y: ny } : t))
      );
    }
  };

  const handlePointerUp = () => {
    setDragging(null);
    setSnapGuide({ x: false, y: false });
  };

  const renderOptions = {
    layoutId,
    photos,
    tone,
    frameId,
    stickers,
    texts,
    showSparkles,
  };

  const handleDownloadPng = async () => {
    setExportBusy(true);
    try {
      const pngDataUrl = await exportPhotoboothImage(renderOptions, 'image/png', 1, 2);
      const link = document.createElement('a');
      link.href = pngDataUrl;
      link.download = `loy-krathong-photobooth-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2400);
    } finally {
      setExportBusy(false);
    }
  };

  const handleOpenQR = async () => {
    setExportBusy(true);
    try {
      const [jpeg, png] = await Promise.all([
        exportPhotoboothImage(renderOptions, 'image/jpeg', 0.92, 2),
        exportPhotoboothImage(renderOptions, 'image/png', 1, 2),
      ]);
      setQrPayload({ jpeg, png });
    } finally {
      setExportBusy(false);
    }
  };

  const handleOpenPrint = async () => {
    setExportBusy(true);
    try {
      const png = await exportPhotoboothImage(renderOptions, 'image/png', 1, 2);
      onSetPrintImage(png);
      setPrintPng(png);
    } finally {
      setExportBusy(false);
    }
  };

  const handleTriggerPrintNow = () => {
    if (!printPng) return;
    onSetPrintImage(printPng);
    requestAnimationFrame(() => {
      window.print();
    });
  };

  const aspectRatio = `${layout.canvasWidth} / ${layout.canvasHeight}`;
  const previewScale = stageSize.width / layout.canvasWidth;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToCamera}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 text-sm font-medium flex items-center gap-2 transition whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ถ่ายรูปใหม่</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={exportBusy}
            onClick={handleDownloadPng}
            className="min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] disabled:opacity-60 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
          >
            {savedToast ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{savedToast ? 'บันทึกแล้ว!' : 'บันทึกรูป'}</span>
          </button>

          <button
            type="button"
            disabled={exportBusy}
            onClick={handleOpenQR}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 disabled:opacity-60 text-amber-100 font-medium text-sm flex items-center gap-2 transition whitespace-nowrap"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>สแกน QR</span>
          </button>

          <button
            type="button"
            disabled={exportBusy}
            onClick={handleOpenPrint}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 disabled:opacity-60 text-amber-100 font-medium text-sm flex items-center gap-2 transition whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>พิมพ์รูป</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
        {/* Left: Live WYSIWYG Canvas Stage */}
        <div
          className="bg-slate-900/50 border border-slate-800/90 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[420px] lg:min-h-[calc(100vh-160px)]"
          onClick={() => {
            setSelectedStickerUid(null);
            setSelectedTextUid(null);
          }}
        >
          <div
            ref={stageBoxRef}
            style={{ aspectRatio }}
            className="relative max-h-[66vh] lg:max-h-[calc(100vh-200px)] w-auto max-w-full shadow-2xl rounded-lg overflow-hidden select-none touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Golden Snap Center Guidelines (visible only while dragging near center) */}
            {snapGuide.x && (
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-amber-400/90 pointer-events-none" />
            )}
            {snapGuide.y && (
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-amber-400/90 pointer-events-none" />
            )}

            {/* Transparent Interactive Hitboxes for Stickers */}
            {stickers.map((stk) => {
              const isSelected = stk.uid === selectedStickerUid;
              const boxPx = Math.max(44, 88 * (layout.canvasWidth / 650) * stk.scale * previewScale);
              return (
                <div
                  key={stk.uid}
                  onPointerDown={(e) => handlePointerDownItem(e, 'sticker', stk.uid, stk.x, stk.y)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    left: `${stk.x * 100}%`,
                    top: `${stk.y * 100}%`,
                    width: `${boxPx}px`,
                    height: `${boxPx}px`,
                    transform: `translate(-50%, -50%) rotate(${stk.rotation}deg)`,
                  }}
                  className={`absolute cursor-move touch-none rounded-lg transition-shadow ${
                    isSelected
                      ? 'border-2 border-dashed border-amber-400 bg-amber-400/10'
                      : 'border border-transparent hover:border-amber-400/40'
                  }`}
                />
              );
            })}

            {/* Transparent Interactive Hitboxes for Custom Texts */}
            {texts.map((txt) => {
              const isSelected = txt.uid === selectedTextUid;
              const scaledFont = txt.fontSize * (layout.canvasWidth / 650) * previewScale;
              const estWidth = Math.min(
                stageSize.width * 0.9,
                Math.max(80, txt.text.length * scaledFont * 0.68 + 24)
              );
              const estHeight = Math.max(38, scaledFont * 1.55 + 12);

              return (
                <div
                  key={txt.uid}
                  onPointerDown={(e) => handlePointerDownItem(e, 'text', txt.uid, txt.x, txt.y)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    left: `${txt.x * 100}%`,
                    top: `${txt.y * 100}%`,
                    width: `${estWidth}px`,
                    height: `${estHeight}px`,
                    transform: `translate(-50%, -50%) rotate(${txt.rotation}deg)`,
                  }}
                  className={`absolute cursor-move touch-none rounded-lg ${
                    isSelected
                      ? 'border-2 border-dashed border-amber-400 bg-amber-400/10'
                      : 'border border-transparent hover:border-amber-400/40'
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-3 text-xs text-slate-400 text-center">
            แตะและลากสติกเกอร์หรือข้อความบนภาพเพื่อย้ายตำแหน่งได้อิสระ · ภาพที่บันทึกและสั่งพิมพ์ตรงตามหน้าจอ 100%
          </p>
        </div>

        {/* Right: Studio Controls Panel */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl overflow-hidden flex flex-col max-h-[680px] lg:max-h-[calc(100vh-160px)]">
          {/* 4 Studio Tabs */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
            {(
              [
                { id: 'frames', label: 'กรอบรูป', Icon: FrameIcon },
                { id: 'tones', label: 'โทนสี', Icon: Palette },
                { id: 'stickers', label: 'สติกเกอร์', Icon: StickerIcon },
                { id: 'text', label: 'ข้อความ', Icon: Type },
              ] as const
            ).map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition whitespace-nowrap ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto studio-scroll flex-1 space-y-5">
            {/* FRAMES TAB */}
            {activeTab === 'frames' && (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-amber-100">เลือกกรอบรูปวันลอยกระทง</h3>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {PHOTOBOOTH_FRAMES.length} แบบ
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {PHOTOBOOTH_FRAMES.map((frame) => {
                    const active = frame.id === frameId;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => setFrameId(frame.id)}
                        className={`w-full min-h-[58px] p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                          active
                            ? 'bg-amber-500/15 border-amber-400 text-amber-50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 text-slate-200'
                        }`}
                      >
                        <span
                          className="w-4 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: frame.badgeColor }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold truncate">{frame.name}</div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">
                            {frame.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TONES TAB */}
            {activeTab === 'tones' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-amber-100">เลือกโทนสีพื้นหลัง</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {BACKGROUND_TONES.map((item) => {
                      const active = tone.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTone(item)}
                          className={`min-h-[52px] p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                            active
                              ? 'bg-amber-500/15 border-amber-400 text-amber-50'
                              : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 text-slate-200'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg border border-white/20 shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${item.primaryColor}, ${item.secondaryColor})`,
                            }}
                          />
                          <span className="text-xs font-medium truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Picker */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-amber-100">ผสมสีพื้นหลังเอง</div>
                      <div className="text-xs text-slate-400">เลือกสีอิสระตามธีมงาน</div>
                    </div>
                    <label className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2 cursor-pointer">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => handleSelectCustomColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-xs font-mono text-amber-200 uppercase">
                        {customColor}
                      </span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSparkles((s) => !s)}
                    className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center justify-between transition ${
                      showSparkles
                        ? 'bg-amber-500/15 border-amber-400/60 text-amber-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>ประกายแสงดาวพื้นหลัง</span>
                    </span>
                    <span>{showSparkles ? 'เปิดอยู่' : 'ปิดอยู่'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STICKERS TAB */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-amber-100">คลังสติกเกอร์ลอยกระทง</h3>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {LOY_KRATHONG_STICKERS.length} ชิ้น
                  </span>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(
                    [
                      { id: 'all', label: 'ทั้งหมด' },
                      { id: 'krathong', label: 'กระทง' },
                      { id: 'festival', label: 'เทศกาล' },
                      { id: 'temple', label: 'วัด/ไทย' },
                      { id: 'flora', label: 'ดอกไม้' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setStickerCategory(cat.id)}
                      className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap shrink-0 ${
                        stickerCategory === cat.id
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:text-amber-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sticker Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {filteredStickers.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => handleAddSticker(stk.id)}
                      title={stk.name}
                      className="aspect-square p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-400 hover:bg-slate-800/80 flex flex-col items-center justify-center gap-1 transition"
                    >
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(stk.previewSvg)}`}
                        alt={stk.name}
                        className="w-10 h-10 object-contain pointer-events-none"
                      />
                    </button>
                  ))}
                </div>

                {/* Active Sticker Inspector */}
                {selectedSticker && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/35 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-200">
                        ปรับแต่งสติกเกอร์ที่เลือก
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setStickers((prev) =>
                            prev.filter((s) => s.uid !== selectedSticker.uid)
                          );
                          setSelectedStickerUid(null);
                        }}
                        className="min-h-[34px] px-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบ</span>
                      </button>
                    </div>

                    <label className="block space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>ขนาด</span>
                        <span className="tabular-nums">{selectedSticker.scale.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="2.2"
                        step="0.1"
                        value={selectedSticker.scale}
                        onChange={(e) =>
                          updateSelectedSticker({ scale: Number(e.target.value) })
                        }
                        className="w-full accent-amber-400"
                      />
                    </label>

                    <label className="block space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>หมุนองศา</span>
                        <span className="tabular-nums">{selectedSticker.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={selectedSticker.rotation}
                        onChange={(e) =>
                          updateSelectedSticker({ rotation: Number(e.target.value) })
                        }
                        className="w-full accent-amber-400"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => updateSelectedSticker({ x: 0.5, y: 0.5 })}
                      className="w-full min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>จัดวางกึ่งกลางภาพ</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TEXT TAB */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-amber-100">ข้อความขยับ & เปลี่ยนสีได้</h3>
                  <button
                    type="button"
                    onClick={handleAddText}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มข้อความ</span>
                  </button>
                </div>

                {texts.length === 0 ? (
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <p className="text-sm text-slate-300">ยังไม่มีข้อความบนภาพ</p>
                    <p className="text-xs text-slate-400">
                      กดปุ่ม &ldquo;เพิ่มข้อความ&rdquo; เพื่อพิมพ์ชื่อ คำอวยพร เปลี่ยนสี ฟอนต์ และลากย้ายตำแหน่งได้อิสระ
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {texts.map((t, idx) => (
                      <button
                        key={t.uid}
                        type="button"
                        onClick={() => {
                          setSelectedTextUid(t.uid);
                          setSelectedStickerUid(null);
                        }}
                        className={`min-h-[36px] max-w-[160px] px-3 py-1 rounded-lg text-xs font-medium truncate transition ${
                          t.uid === selectedTextUid
                            ? 'bg-amber-500 text-slate-950 font-semibold'
                            : 'bg-slate-800 text-slate-300 hover:text-amber-200'
                        }`}
                      >
                        {t.text || `ข้อความ ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                {selectedText && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/35 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-200">แก้ไขข้อความ</span>
                      <button
                        type="button"
                        onClick={() => {
                          setTexts((prev) =>
                            prev.filter((t) => t.uid !== selectedText.uid)
                          );
                          setSelectedTextUid(null);
                        }}
                        className="min-h-[34px] px-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบ</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={selectedText.text}
                      onChange={(e) => updateSelectedText({ text: e.target.value })}
                      placeholder="พิมพ์ข้อความที่นี่..."
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-sm text-amber-50"
                    />

                    {/* Font Family */}
                    <div className="space-y-1.5">
                      <div className="text-xs text-slate-300">รูปแบบตัวอักษร</div>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: 'Charm', label: 'ลายไทย', cls: 'font-charm' },
                            { id: 'Kanit', label: 'ทันสมัย', cls: 'font-kanit' },
                            { id: 'Sarabun', label: 'ทางการ', cls: 'font-sarabun' },
                          ] as { id: FontFamilyId; label: string; cls: string }[]
                        ).map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => updateSelectedText({ fontFamily: f.id })}
                            className={`min-h-[40px] rounded-xl border text-xs font-medium transition ${
                              f.cls
                            } ${
                              selectedText.fontFamily === f.id
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Color Picker + Presets */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">สีข้อความ</span>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-amber-200">
                          <input
                            type="color"
                            value={selectedText.color}
                            onChange={(e) => updateSelectedText({ color: e.target.value })}
                            className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                          />
                          <span>เลือกสีอิสระ</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TEXT_COLOR_PRESETS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => updateSelectedText({ color: c })}
                            aria-label={`สี ${c}`}
                            style={{ backgroundColor: c }}
                            className={`w-8 h-8 rounded-full border-2 transition ${
                              selectedText.color.toLowerCase() === c.toLowerCase()
                                ? 'border-amber-400 scale-110'
                                : 'border-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stroke Color */}
                    <div className="space-y-1.5">
                      <div className="text-xs text-slate-300">สีขอบตัวอักษร</div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {STROKE_PRESETS.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => updateSelectedText({ strokeColor: st.id })}
                            className={`min-h-[36px] px-1.5 rounded-lg border text-[11px] font-medium transition whitespace-nowrap ${
                              selectedText.strokeColor === st.id
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size & Rotation */}
                    <div className="space-y-3">
                      <label className="block space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>ขนาดตัวอักษร</span>
                          <span className="tabular-nums">{selectedText.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="11"
                          max="36"
                          step="1"
                          value={selectedText.fontSize}
                          onChange={(e) =>
                            updateSelectedText({ fontSize: Number(e.target.value) })
                          }
                          className="w-full accent-amber-400"
                        />
                      </label>

                      <label className="block space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>หมุนเอียง</span>
                          <span className="tabular-nums">{selectedText.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={selectedText.rotation}
                          onChange={(e) =>
                            updateSelectedText({ rotation: Number(e.target.value) })
                          }
                          className="w-full accent-amber-400"
                        />
                      </label>
                    </div>

                    {/* Center Alignment Helpers */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSelectedText({ x: 0.5 })}
                        className="min-h-[38px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <AlignCenterHorizontal className="w-3.5 h-3.5" />
                        <span>จัดกึ่งกลางแนวนอน</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSelectedText({ x: 0.5, y: 0.5 })}
                        className="min-h-[38px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-medium flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>กึ่งกลางภาพ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {qrPayload && (
        <QRCodeModal
          jpegDataUrl={qrPayload.jpeg}
          pngDataUrl={qrPayload.png}
          onClose={() => setQrPayload(null)}
        />
      )}

      {printPng && (
        <PrintPreview
          pngDataUrl={printPng}
          onPrintNow={handleTriggerPrintNow}
          onClose={() => setPrintPng(null)}
        />
      )}
    </div>
  );
};
