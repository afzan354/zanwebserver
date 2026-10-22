import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface StorageBannerProps {
  isVisible: boolean;
  onRequestPermission: () => void;
}

export const StorageBanner: React.FC<StorageBannerProps> = ({
  isVisible,
  onRequestPermission,
}) => {
  if (!isVisible) return null;

  return (
    <div className="mx-5 my-2.5 p-3 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <AlertTriangle className="w-4 h-4 text-[#F5A623] shrink-0" />
        <span className="text-[#EDF1F7] leading-tight">
          Diperlukan akses semua file untuk document root
        </span>
      </div>
      <button
        onClick={onRequestPermission}
        className="px-2.5 py-1.5 rounded-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#101418] font-semibold text-[11px] whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
        aria-label="Beri izin akses file"
      >
        <span>Beri izin</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
