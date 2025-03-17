import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, title, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-h-[80vh] object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}