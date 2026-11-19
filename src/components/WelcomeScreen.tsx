import React, { useRef } from 'react';
import { Camera, ImagePlus, Sparkles } from 'lucide-react';
import { LAYOUT_LIST } from '../constants/layouts';
import { LayoutId } from '../types';

interface WelcomeScreenProps {
  selectedLayout: LayoutId;
  onSelectLayout: (id: LayoutId) => void;
  onStartCamera: () => void;
  onUploadPhotos: (photos: string[]) => void;
}

function LayoutDiagram({ layoutId, active }: { layoutId: LayoutId; active: boolean }) {
  const slotClass = active
    ? 'bg-amber-400/25 border-amber-400/70'
    : 'bg-slate-700/40 border-slate-600/60';

  if (layoutId === 'single') {
    return (
      <div className="w-12 h-16 rounded-md border border-slate-600/60 bg-slate-900/70 p-1.5 flex items-center justify-center shrink-0">
        <div className={`w-full h-full rounded-sm border ${slotClass}`} />
      </div>
    );
  }

  if (layoutId === 'grid4') {
    return (
      <div className="w-12 h-16 rounded-md border border-slate-600/60 bg-slate-900/70 p-1.5 grid grid-cols-2 grid-rows-2 gap-1 shrink-0">
        <div className={`rounded-[2px] border ${slotClass}`} />
        <div className={`rounded-[2px] border ${slotClass}`} />
        <div className={`rounded-[2px] border ${slotClass}`} />
        <div className={`rounded-[2px] border ${slotClass}`} />
      </div>
    );
  }

  const count = layoutId === 'strip4' ? 4 : 3;
  return (
    <div className="w-12 h-16 rounded-md border border-slate-600/60 bg-slate-900/70 p-1.5 flex flex-col gap-1 shrink-0">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`w-full flex-1 rounded-[2px] border ${slotClass}`} />
      ))}
    </div>
  );
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedLayout,
  onSelectLayout,
  onStartCamera,
  onUploadPhotos,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeLayout = LAYOUT_LIST.find((l) => l.id === selectedLayout) ?? LAYOUT_LIST[0];

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const dataUrls = await Promise.all(files.slice(0, activeLayout.shotCount).map(readAsDataUrl));
    // Repeat last photo if fewer images were selected than slots
    const filled: string[] = [];
    for (let i = 0; i < activeLayout.shotCount; i++) {
      filled.push(dataUrls[i % dataUrls.length]);
    }
    e.target.value = '';
    onUploadPhotos(filled);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 sm:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Left Hero Column */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>เทศกาลวันลอยกระทง · เทศบาล ๕ วัดพระปฐมเจดีย์</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 leading-tight text-balance">
            ลอยกระทงโฟโต้บูท
            <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-amber-400 mt-2">
              By เทศบาล ๕ วัดพระปฐมเจดีย์
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            บันทึกความทรงจำคืนวันเพ็ญเดือนสิบสอง เลือกเลย์เอาต์ถ่ายภาพหลายช็อต ตกแต่งกรอบลายไทย 12 แบบ สติกเกอร์ 24 ชิ้น ปรับโทนสีและข้อความได้ตามใจ พร้อมสแกน QR รับภาพหรือสั่งพิมพ์ทันที
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              type="button"
              onClick={onStartCamera}
              className="min-h-[48px] px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-semibold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
            >
              <Camera className="w-5 h-5" />
              <span>เปิดกล้องถ่ายรูป</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-amber-500/25 text-amber-100 font-medium text-base flex items-center justify-center gap-2.5 transition whitespace-nowrap"
            >
              <ImagePlus className="w-5 h-5 text-amber-400" />
              <span>เลือกรูปจากเครื่อง</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>รองรับมือถือ iPad และคอมพิวเตอร์</span>
            <span aria-hidden="true">·</span>
            <span>กรอบรูป 12 แบบ</span>
            <span aria-hidden="true">·</span>
            <span>สติกเกอร์ 24 ชิ้น</span>
            <span aria-hidden="true">·</span>
            <span>สแกน QR และพิมพ์ภาพ</span>
          </div>
        </div>

        {/* Right Layout Picker Panel */}
        <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-100">เลือกรูปแบบภาพถ่าย</h2>
            <span className="text-xs text-amber-400 tabular-nums">
              {activeLayout.shotCount} ช็อต
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {LAYOUT_LIST.map((layout) => {
              const isSelected = layout.id === selectedLayout;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => onSelectLayout(layout.id)}
                  className={`w-full min-h-[72px] p-3.5 rounded-xl border text-left flex items-center gap-4 transition ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-amber-50 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 hover:border-amber-500/40 text-slate-200'
                  }`}
                >
                  <LayoutDiagram layoutId={layout.id} active={isSelected} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm sm:text-base truncate">
                      {layout.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {layout.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
