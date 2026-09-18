import React from 'react';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-2xl bg-[#14283d] border border-white/20 text-white text-xs sm:text-sm font-medium shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2.5 animate-bounce-short"
      role="status"
    >
      <CheckCircle2 className="w-4 h-4 text-[#26d39b] shrink-0" />
      <span className="flex-1">{message}</span>
    </div>
  );
};
