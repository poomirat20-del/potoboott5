import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  FlipHorizontal2,
  ImagePlus,
  RefreshCw,
  RotateCcw,
  SwitchCamera,
} from 'lucide-react';
import { PHOTOBOOTH_LAYOUTS } from '../constants/layouts';
import { LayoutId } from '../types';
import { playCountdownBeep, playShutterSound } from '../utils/audio';

interface CameraCaptureProps {
  layoutId: LayoutId;
  onBack: () => void;
  onComplete: (photos: string[]) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  layoutId,
  onBack,
  onComplete,
}) => {
  const layout = PHOTOBOOTH_LAYOUTS[layoutId];
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [mirror, setMirror] = useState<boolean>(true);
  const [countdownSec, setCountdownSec] = useState<number>(3);
  const [activeCountdown, setActiveCountdown] = useState<number | null>(null);
  const [isCapturingSequence, setIsCapturingSequence] = useState<boolean>(false);
  const [flashVisible, setFlashVisible] = useState<boolean>(false);
  const [photos, setPhotos] = useState<(string | null)[]>(
    () => Array.from({ length: layout.shotCount }, () => null)
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraError(
        'ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตสิทธิ์การใช้กล้อง หรือเลือกรูปภาพจากคลังในเครื่อง'
      );
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const captureSingleFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const targetRatio = 4 / 3;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const videoRatio = vw / vh;

    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (videoRatio > targetRatio) {
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    playShutterSound();
    setFlashVisible(true);
    setTimeout(() => setFlashVisible(false), 180);

    return canvas.toDataURL('image/jpeg', 0.92);
  }, [mirror]);

  const runCountdownAndCapture = useCallback(
    async (slotIndex: number) => {
      if (countdownSec > 0) {
        for (let c = countdownSec; c >= 1; c--) {
          setActiveCountdown(c);
          playCountdownBeep(c === 1);
          await new Promise((r) => setTimeout(r, 900));
        }
      }
      setActiveCountdown(null);
      const frame = captureSingleFrame();
      if (frame) {
        setPhotos((prev) => {
          const next = [...prev];
          next[slotIndex] = frame;
          return next;
        });
      }
    },
    [countdownSec, captureSingleFrame]
  );

  const handleStartSequence = async () => {
    if (isCapturingSequence) return;
    setIsCapturingSequence(true);

    try {
      if (retakeIndex !== null) {
        await runCountdownAndCapture(retakeIndex);
        setRetakeIndex(null);
      } else {
        for (let i = 0; i < layout.shotCount; i++) {
          if (photos[i] !== null) continue;
          await runCountdownAndCapture(i);
          if (i < layout.shotCount - 1) {
            await new Promise((r) => setTimeout(r, 550));
          }
        }
      }
    } finally {
      setActiveCountdown(null);
      setIsCapturingSequence(false);
    }
  };

  const handleResetAll = () => {
    if (isCapturingSequence) return;
    setPhotos(Array.from({ length: layout.shotCount }, () => null));
    setRetakeIndex(null);
  };

  const handleRetakeSlot = (idx: number) => {
    if (isCapturingSequence) return;
    setRetakeIndex(idx);
    setPhotos((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  const handleUploadFromGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const readDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const loaded = await Promise.all(files.map(readDataUrl));
    setPhotos((prev) => {
      const next = [...prev];
      let fileIdx = 0;
      for (let i = 0; i < next.length && fileIdx < loaded.length; i++) {
        if (next[i] === null) {
          next[i] = loaded[fileIdx++];
        }
      }
      // If all slots were already full, replace from start
      if (fileIdx === 0) {
        for (let i = 0; i < next.length; i++) {
          next[i] = loaded[i % loaded.length];
        }
      }
      return next;
    });
    e.target.value = '';
  };

  const capturedCount = photos.filter(Boolean).length;
  const isComplete = capturedCount === layout.shotCount;

  const handleProceed = () => {
    const valid = photos.filter((p): p is string => Boolean(p));
    if (valid.length === layout.shotCount) {
      stopCamera();
      onComplete(valid);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>เปลี่ยนเลย์เอาต์</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200 font-medium">
          <span>{layout.name}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums text-amber-400">
            ถ่ายแล้ว {capturedCount}/{layout.shotCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            {[0, 3, 5].map((sec) => (
              <button
                key={sec}
                type="button"
                disabled={isCapturingSequence}
                onClick={() => setCountdownSec(sec)}
                className={`min-h-[34px] px-2.5 sm:px-3 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  countdownSec === sec
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-amber-200'
                }`}
              >
                {sec === 0 ? 'ถ่ายทันที' : `${sec} วิ`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Camera & Filmstrip Grid (2 columns from iPad md: 768px+) */}
      <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] lg:grid-cols-[1.45fr_1fr] gap-4 sm:gap-5 items-start">
        {/* Live Camera Viewport */}
        <div className="flex flex-col gap-3">
          <div
            style={{ maxWidth: 'min(100%, calc((100dvh - 220px) * 4 / 3))' }}
            className="relative w-full mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/25 shadow-2xl"
          >
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center gap-3">
                <Camera className="w-10 h-10 text-amber-400/70" />
                <p className="text-xs sm:text-sm text-slate-300 max-w-md">{cameraError}</p>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>ลองเปิดกล้องอีกครั้ง</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs sm:text-sm font-semibold flex items-center gap-2"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>เลือกรูปจากเครื่อง</span>
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${mirror ? 'scale-x-[-1]' : ''}`}
              />
            )}

            {/* Countdown Big Overlay */}
            {activeCountdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 pointer-events-none">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center text-5xl sm:text-6xl font-bold shadow-2xl tabular-nums">
                  {activeCountdown}
                </div>
              </div>
            )}

            {/* Shutter Flash */}
            {flashVisible && (
              <div className="absolute inset-0 bg-white/90 pointer-events-none transition-opacity duration-150" />
            )}
          </div>

          {/* Camera Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isCapturingSequence}
                onClick={() => {
                  const nextMode = facingMode === 'user' ? 'environment' : 'user';
                  setFacingMode(nextMode);
                  setMirror(nextMode === 'user');
                }}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <SwitchCamera className="w-4 h-4 text-amber-400" />
                <span>{facingMode === 'user' ? 'กล้องหน้า' : 'กล้องหลัง'}</span>
              </button>

              <button
                type="button"
                disabled={isCapturingSequence}
                onClick={() => setMirror((m) => !m)}
                className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-1.5 transition whitespace-nowrap ${
                  mirror
                    ? 'bg-amber-500/15 border-amber-400/60 text-amber-200'
                    : 'bg-slate-900 border-slate-700/80 text-slate-300'
                }`}
              >
                <FlipHorizontal2 className="w-4 h-4" />
                <span>กลับด้าน</span>
              </button>

              <button
                type="button"
                disabled={isCapturingSequence}
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <ImagePlus className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">อัปโหลดรูป</span>
              </button>
            </div>

            {!isComplete ? (
              <button
                type="button"
                disabled={isCapturingSequence || Boolean(cameraError)}
                onClick={handleStartSequence}
                className="min-h-[46px] flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
              >
                <Camera className="w-5 h-5" />
                <span>
                  {isCapturingSequence
                    ? 'กำลังถ่ายภาพ...'
                    : retakeIndex !== null
                      ? `ถ่ายช่องที่ ${retakeIndex + 1}`
                      : 'เริ่มถ่ายภาพ'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceed}
                className="min-h-[46px] flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
              >
                <span>ไปตกแต่งภาพ</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Captured Shots Tray - Fitted cleanly for iPad portrait & landscape */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 md:max-h-[calc(100dvh-148px)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-amber-100">ภาพที่ถ่ายไว้</h3>
            {capturedCount > 0 && (
              <button
                type="button"
                disabled={isCapturingSequence}
                onClick={handleResetAll}
                className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-slate-800 flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ถ่ายใหม่ทั้งหมด</span>
              </button>
            )}
          </div>

          <div
            className={`grid gap-2.5 overflow-y-auto studio-scroll ${
              layout.shotCount === 1
                ? 'grid-cols-1 max-w-[320px] w-full mx-auto'
                : layout.shotCount === 4
                  ? 'grid-cols-2'
                  : 'grid-cols-3 md:grid-cols-2'
            }`}
          >
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group"
              >
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`ช็อตที่ ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      disabled={isCapturingSequence}
                      onClick={() => handleRetakeSlot(idx)}
                      className="absolute bottom-1.5 right-1.5 min-h-[30px] px-2 py-1 rounded-lg bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-[11px] font-medium flex items-center gap-1 border border-amber-500/30 transition whitespace-nowrap"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>ถ่ายซ่อม</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    ช็อตที่ {idx + 1}
                  </span>
                )}
              </div>
            ))}
          </div>

          {isComplete && (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full min-h-[46px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition whitespace-nowrap shrink-0"
            >
              <span>ตกแต่งกรอบและสติกเกอร์</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadFromGallery}
      />
    </div>
  );
};
