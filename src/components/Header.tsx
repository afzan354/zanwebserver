import React, { useState } from 'react';
import { ServerStatus } from '../types/server.ts';
import { Copy, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  appName: string;
  port: number;
  status: ServerStatus;
  onOpenStitchSpec?: () => void;
  onStatusClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appName,
  port,
  status,
  onOpenStitchSpec,
  onStatusClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    const url = `127.0.0.1:${port}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Status configuration based on design spec
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          label: 'idle',
          dotClass: 'bg-[#7C8794]',
          chipBorder: 'border-[#232C38]',
          textColor: 'text-[#7C8794]',
        };
      case 'starting':
        return {
          label: 'starting',
          dotClass: 'bg-[#F5A623] animate-pulse-amber',
          chipBorder: 'border-[#F5A623]/40',
          textColor: 'text-[#F5A623]',
        };
      case 'running':
        return {
          label: 'running',
          dotClass: 'bg-[#F5A623] shadow-[0_0_8px_#F5A623]',
          chipBorder: 'border-[#F5A623]/50',
          textColor: 'text-[#F5A623]',
        };
      case 'error':
        return {
          label: 'error',
          dotClass: 'bg-[#E5544B] shadow-[0_0_8px_#E5544B]',
          chipBorder: 'border-[#E5544B]/50',
          textColor: 'text-[#E5544B]',
        };
      default:
        return {
          label: 'idle',
          dotClass: 'bg-[#7C8794]',
          chipBorder: 'border-[#232C38]',
          textColor: 'text-[#7C8794]',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <header className="px-5 pt-3 pb-3 bg-[#182029]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#EDF1F7]">
              {appName}
            </h1>
            {onOpenStitchSpec && (
              <button
                onClick={onOpenStitchSpec}
                title="Buka Google Stitch Prompt & Spec"
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#7C6CF0]/20 text-[#7C6CF0] hover:bg-[#7C6CF0]/30 transition-colors cursor-pointer font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Stitch Spec</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-[#7C8794]">
              port {port}
            </span>
            <span className="text-[#232C38]">•</span>
            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1 text-xs font-mono text-[#7C8794] hover:text-[#EDF1F7] transition-colors cursor-pointer active:scale-95 px-1.5 py-0.5 rounded bg-[#101418]/60 border border-[#232C38]"
              title="Salin alamat IP localhost"
              aria-label="Salin URL localhost"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#7C6CF0]" />
                  <span className="text-[#7C6CF0] font-medium">✓ tersalin</span>
                </>
              ) : (
                <>
                  <span>127.0.0.1:{port}</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status chip with LED dot */}
        <button
          onClick={onStatusClick}
          aria-label={`Status server: ${statusConfig.label}`}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101418] border ${statusConfig.chipBorder} transition-all hover:bg-[#1F2836] cursor-pointer`}
          title="Klik untuk melihat detail status"
        >
          <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
          <span className={`text-xs font-mono font-medium ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </button>
      </div>

      {/* 1px divider */}
      <div className="mt-3 -mx-5 h-[1px] bg-[#232C38]" />
    </header>
  );
};
