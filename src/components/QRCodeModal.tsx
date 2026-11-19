import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Maximize2,
  QrCode,
  RefreshCw,
  X,
} from 'lucide-react';
import { uploadPhotoForQR } from '../utils/uploadPhoto';

interface QRCodeModalProps {
  jpegDataUrl: string;
  pngDataUrl: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  jpegDataUrl,
  pngDataUrl,
  onClose,
}) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [fullScreenOpen, setFullScreenOpen] = useState<boolean>(false);

  const generateQR = useCallback(async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await uploadPhotoForQR(jpegDataUrl);
      const qrData = await QRCode.toDataURL(result.url, {
        width: 520,
        margin: 3,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#070B14',
          light: '#FFFFFF',
        },
      });
      setShareUrl(result.url);
      setQrImageUrl(qrData);
      setStatus('ready');
    } catch (err) {
      console.error('QR upload failed:', err);
      setErrorMsg(
        'ไม่สามารถอัปโหลดรูปเพื่อสร้าง QR Code ได้ในขณะนี้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่ หรือกดบันทึกรูปลงเครื่องโดยตรง'
      );
      setStatus('error');
    }
  }, [jpegDataUrl]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const handleDownloadDirect = () => {
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `loy-krathong-photobooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be restricted on insecure contexts
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="สแกน QR Code เพื่อรับรูปภาพ"
      >
        <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-amber-100">สแกน QR รับรูปภาพ</h2>
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

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[280px] text-center gap-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-100">
                    กำลังสร้าง QR Code สำหรับรับรูป...
                  </p>
                  <p className="text-xs text-slate-400">
                    รองรับการสแกนจากกล้อง iPhone, iPad, Android และ LINE
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-sm text-rose-300 leading-relaxed">{errorMsg}</p>
                <button
                  type="button"
                  onClick={generateQR}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm inline-flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>ลองอัปโหลดใหม่</span>
                </button>
              </div>
            )}

            {status === 'ready' && (
              <>
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                  <img
                    src={qrImageUrl}
                    alt="QR Code สำหรับดาวน์โหลดรูปภาพ"
                    className="w-52 h-52 sm:w-56 sm:h-56 object-contain block"
                  />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  เปิดกล้องมือถือหรือกล้อง LINE สแกนเพื่อเปิดและบันทึกรูปภาพได้ทันที
                </p>
                <div className="w-full flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    aria-label="ลิงก์ดาวน์โหลดรูปภาพ"
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="เปิดลิงก์รูปภาพ"
                    className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 flex items-center justify-center transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadDirect}
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>บันทึกเครื่องนี้ทันที</span>
            </button>

            <button
              type="button"
              onClick={() => setFullScreenOpen(true)}
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-100 font-medium text-sm flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Maximize2 className="w-4 h-4 text-amber-400" />
              <span>ดูรูปขนาดเต็ม</span>
            </button>
          </div>
        </div>
      </div>

      {fullScreenOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 gap-4"
          onClick={() => setFullScreenOpen(false)}
        >
          <button
            type="button"
            onClick={() => setFullScreenOpen(false)}
            className="self-end min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 text-amber-100 text-sm font-medium flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>ปิด</span>
          </button>
          <img
            src={pngDataUrl}
            alt="ภาพถ่ายลอยกระทงขนาดเต็ม"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
          <p className="text-xs text-slate-300 text-center">
            บน iPad หรือ iPhone สามารถแตะค้างที่รูปภาพแล้วเลือก &ldquo;บันทึกไปยังรูปภาพ&rdquo; ได้ทันที
          </p>
        </div>
      )}
    </>
  );
};
