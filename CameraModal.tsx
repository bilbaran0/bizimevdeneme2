import React, { useRef, useState } from 'react';
import { X, Camera, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
  taskTitle: string;
  labels: {
    title: string;
    desc: string;
    btnCamera: string;
    btnGallery: string;
    btnSkip: string;
  };
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture, taskTitle, labels }) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleConfirm = () => {
    if (preview) {
      onCapture(preview);
      setPreview(null);
    }
  };

  const handleSkipPhoto = () => {
    onCapture('');
    setPreview(null);
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerGallery = () => {
    galleryInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
      {/* Inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="relative p-4 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute left-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-white font-bold text-lg">{taskTitle}</h2>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 relative bg-gray-900 rounded-3xl mx-4 overflow-hidden flex items-center justify-center border border-gray-800">
        {preview ? (
          <img src={preview} alt="Proof" className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-2 animate-pulse">
               <Camera size={48} className="text-gray-600" />
            </div>
            <p className="font-medium text-lg text-gray-400">{labels.title}</p>
            <p className="text-sm text-gray-600">{labels.desc}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="min-h-[180px] flex items-center justify-center pb-8 pt-6 px-6">
        {preview ? (
          <div className="flex items-center gap-8">
            <button
              onClick={handleRetake}
              className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors border border-gray-700"
            >
              <RefreshCw size={24} />
            </button>
            <button
              onClick={handleConfirm}
              className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_30px_rgba(124,58,237,0.5)] border-4 border-black"
            >
              <Check size={40} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="grid grid-cols-2 gap-4 w-full">
                <button
                    onClick={triggerCamera}
                    className="flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-2xl border border-gray-700 transition-all active:scale-95"
                >
                    <Camera size={32} className="text-brand-primary" />
                    <span className="font-bold text-sm">{labels.btnCamera}</span>
                </button>
                <button
                    onClick={triggerGallery}
                    className="flex flex-col items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-2xl border border-gray-700 transition-all active:scale-95"
                >
                    <ImageIcon size={32} className="text-brand-secondary" />
                    <span className="font-bold text-sm">{labels.btnGallery}</span>
                </button>
            </div>
            <button
                onClick={handleSkipPhoto}
                className="text-gray-500 text-xs font-bold hover:text-white transition-colors py-3 w-full text-center hover:bg-white/5 rounded-xl uppercase tracking-widest"
            >
                {labels.btnSkip}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;