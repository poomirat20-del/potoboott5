import { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { EditorView } from './components/EditorView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AppStep, LayoutId } from './types';

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [layoutId, setLayoutId] = useState<LayoutId>('strip3');
  const [photos, setPhotos] = useState<string[]>([]);
  const [printImageUrl, setPrintImageUrl] = useState<string>('');

  const handleUploadPhotosFromWelcome = (uploaded: string[]) => {
    setPhotos(uploaded);
    setStep('editor');
  };

  const handleCaptureComplete = (captured: string[]) => {
    setPhotos(captured);
    setStep('editor');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-amber-50 flex flex-col">
      {/* Clean Single-Row Centered Brand Header */}
      <header className="no-print sticky top-0 z-30 h-16 px-4 sm:px-6 bg-[#070B14]/90 backdrop-blur-md border-b border-amber-500/15 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setStep('welcome')}
          className="text-center font-semibold text-sm sm:text-base text-amber-100 hover:text-amber-300 transition truncate max-w-full"
        >
          ลอยกระทงโฟโต้บูท By เทศบาล ๕ วัดพระปฐมเจดีย์
        </button>
      </header>

      <main className="no-print flex-1">
        {step === 'welcome' && (
          <WelcomeScreen
            selectedLayout={layoutId}
            onSelectLayout={setLayoutId}
            onStartCamera={() => setStep('camera')}
            onUploadPhotos={handleUploadPhotosFromWelcome}
          />
        )}

        {step === 'camera' && (
          <CameraCapture
            layoutId={layoutId}
            onBack={() => setStep('welcome')}
            onComplete={handleCaptureComplete}
          />
        )}

        {step === 'editor' && (
          <EditorView
            layoutId={layoutId}
            photos={photos}
            onBackToCamera={() => setStep('camera')}
            onSetPrintImage={setPrintImageUrl}
          />
        )}
      </main>

      {/* Hidden Photo-Only Print Root (revealed exclusively during @media print) */}
      {printImageUrl && (
        <div className="print-only-root" aria-hidden="true">
          <img src={printImageUrl} alt="ภาพถ่ายลอยกระทง" />
        </div>
      )}
    </div>
  );
}
