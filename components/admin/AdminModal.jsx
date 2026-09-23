import { useEffect } from "react";
import { BsX } from "react-icons/bs";

export default function AdminModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white shadow-[0_40px_80px_-30px_rgba(11,29,58,0.5)] flex flex-col max-h-[90vh] animate-slide-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line shrink-0">
          <h3 className="font-display font-bold text-2xl leading-none text-primary">{title}</h3>
          <button 
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 border border-line flex items-center justify-center text-ink-soft hover:text-white hover:bg-primary hover:border-primary transition-colors"
          >
            <BsX size={24} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {children}
        </div>
        
      </div>
    </div>
  );
}
