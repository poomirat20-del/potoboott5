import React, { useState } from 'react';
import { ExternalLink, Printer, Share2, X } from 'lucide-react';

interface PrintPreviewProps {
  pngDataUrl: string;
  onPrintNow: () => void;
  onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  pngDataUrl,
  onPrintNow,
  onClose,
}) => {
  const [sharing, setSharing] = useState(false);

  const handleAirPrintShare = async () => {
    setSharing(true);
    try {
      const res = await fetch(pngDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `loy-krathong-photobooth-${Date.now()}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'ลอยกระทงโฟโต้บูท',
        });
        return;
      }
      // Fallback to standard print if Web Share files is not supported on this browser
      onPrintNow();
    } catch {
      // User canceled share sheet or browser unsupported -> fallback to direct print
    } finally {
      setSharing(false);
    }
  };

  const handleOpenCleanPrintTab = () => {
    const html = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <title>พิมพ์ภาพถ่าย</title>
  <style>
    @page { margin: 0; size: auto; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100vw;
      max-height: 100vh;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
    }
  </style>
</head>
<body>
  <img src="${pngDataUrl}" alt="ภาพถ่ายลอยกระทง" onload="setTimeout(function(){ window.print(); }, 250);" />
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const supportsFileShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-label="ตัวอย่างก่อนพิมพ์รูปภาพ"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-100">สั่งพิมพ์เฉพาะรูปภาพ</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="min-h-[40px] min-w-[40px] rounded-xl text-slate-400 hover:text-amber-200 hover:bg-slate-800 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* White paper preview showing ONLY the photo */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-[240px] flex-1">
          <img
            src={pngDataUrl}
            alt="ตัวอย่างภาพที่จะพิมพ์"
            className="max-h-[46vh] w-auto object-contain shadow-sm"
          />
        </div>

        <p className="text-xs text-slate-300 text-center leading-relaxed">
          ระบบจะพิมพ์เฉพาะรูปภาพโฟโต้บูทบนพื้นขาว ตัดแถบเมนูและปุ่มกดทั้งหมดออก 100%
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onPrintNow}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
          >
            <Printer className="w-5 h-5" />
            <span>สั่งพิมพ์รูปภาพทันที</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {supportsFileShare && (
              <button
                type="button"
                disabled={sharing}
                onClick={handleAirPrintShare}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-100 text-sm font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>พิมพ์ผ่าน AirPrint / แชร์</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenCleanPrintTab}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-100 text-sm font-medium flex items-center justify-center gap-2 transition whitespace-nowrap ${
                supportsFileShare ? '' : 'sm:col-span-2'
              }`}
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>เปิดแท็บสำหรับพิมพ์</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
