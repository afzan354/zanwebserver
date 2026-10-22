import React from 'react';
import { ServerStatus } from '../types/server.ts';
import { Power, Loader2 } from 'lucide-react';

interface FixedBottomBarProps {
  status: ServerStatus;
  onToggleServer: () => void;
}

export const FixedBottomBar: React.FC<FixedBottomBarProps> = ({
  status,
  onToggleServer,
}) => {
  const isRunning = status === 'running';
  const isStarting = status === 'starting';

  return (
    <div className="p-5 pt-2 pb-4 bg-gradient-to-t from-[#101418] via-[#101418] to-transparent">
      <button
        onClick={onToggleServer}
        disabled={isStarting}
        aria-label={isRunning ? 'Stop server utama' : 'Start server utama'}
        className={`w-full h-14 rounded-full font-medium text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer active:scale-[0.98] ${
          isRunning
            ? 'bg-[#F5A623] text-[#101418] hover:bg-[#F5A623]/90 shadow-[0_4px_20px_rgba(245,166,35,0.35)] font-semibold'
            : isStarting
            ? 'bg-[#F5A623]/80 text-[#101418] cursor-wait'
            : 'bg-[#7C6CF0] text-[#EDF1F7] hover:bg-[#7C6CF0]/90 shadow-[0_4px_20px_rgba(124,108,240,0.35)] font-semibold'
        }`}
      >
        {isStarting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Menjalankan server…</span>
          </>
        ) : isRunning ? (
          <>
            <Power className="w-5 h-5 stroke-[2.5]" />
            <span>Stop server</span>
          </>
        ) : (
          <>
            <Power className="w-5 h-5 stroke-[2.5]" />
            <span>Start server</span>
          </>
        )}
      </button>
    </div>
  );
};
