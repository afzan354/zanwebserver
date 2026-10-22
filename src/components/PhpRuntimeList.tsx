import React from 'react';
import { PhpRuntime } from '../types/server.ts';
import { Trash2, Check, DownloadCloud, Loader2 } from 'lucide-react';

interface PhpRuntimeListProps {
  runtimes: PhpRuntime[];
  onSelectRuntime: (version: string) => void;
  onRequestDelete: (version: string) => void;
}

export const PhpRuntimeList: React.FC<PhpRuntimeListProps> = ({
  runtimes,
  onSelectRuntime,
  onRequestDelete,
}) => {
  const activeCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <section className="px-5 py-2 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-[12px] text-[#7C8794]">
          Runtime PHP
        </h2>
        <span className="text-[11px] font-mono text-[#7C8794]">
          {runtimes.filter((r) => r.isInstalled).length} terpasang
        </span>
      </div>

      {/* Scrollable list of 5 PHP runtime cards */}
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1 pb-1">
        {runtimes.map((runtime) => {
          const isActive = runtime.isActive;
          const isInstalled = runtime.isInstalled;
          const isInstalling = runtime.isInstalling;
          const canDelete = isInstalled && !isActive && !isInstalling;

          return (
            <div
              key={runtime.version}
              ref={isActive ? activeCardRef : undefined}
              onClick={() => onSelectRuntime(runtime.version)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRuntime(runtime.version);
                }
              }}
              aria-label={`PHP versi ${runtime.version} - ${
                isActive
                  ? 'Aktif'
                  : isInstalling
                  ? 'Sedang menginstal'
                  : isInstalled
                  ? 'Terpasang'
                  : 'Belum terpasang, tap untuk pasang'
              }`}
              className={`relative rounded-xl transition-all cursor-pointer select-none overflow-hidden group border ${
                isActive
                  ? 'bg-[#1F2836] border-[#7C6CF0]/40 shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                  : 'bg-[#182029] hover:bg-[#182029]/80 border-[#232C38]'
              }`}
            >
              {/* 3dp violet rail on left edge for selected card */}
              {isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#7C6CF0]"
                  aria-hidden="true"
                />
              )}

              <div className="pl-4 pr-3 py-2.5 flex items-center justify-between">
                {/* Left side: HUGE monospace version number 40sp bold (design moment) */}
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-mono font-extrabold text-[38px] leading-none tracking-tight ${
                      isActive
                        ? 'text-[#7C6CF0]'
                        : isInstalled
                        ? 'text-[#EDF1F7]'
                        : 'text-[#7C8794]/50'
                    }`}
                  >
                    {runtime.version}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7C6CF0]/20 text-[#7C6CF0] font-semibold border border-[#7C6CF0]/30">
                      AKTIF
                    </span>
                  )}
                </div>

                {/* Right side: technical labels & status */}
                <div className="flex items-center gap-3">
                  {/* Inline installation progress */}
                  {isInstalling ? (
                    <div className="flex flex-col items-end gap-1 min-w-[130px]">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#F5A623]">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>mengekstrak…</span>
                        <span>{runtime.installProgress || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#101418] rounded-full overflow-hidden border border-[#232C38]">
                        <div
                          className="h-full bg-[#7C6CF0] transition-all duration-300 rounded-full"
                          style={{ width: `${runtime.installProgress || 10}%` }}
                        />
                      </div>
                    </div>
                  ) : isInstalled ? (
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-mono text-[12px] text-[#7C8794] leading-tight block">
                          {runtime.libName}
                        </span>
                        {/* 7dp status dot: violet = terpasang */}
                        <span
                          className={`w-[7px] h-[7px] rounded-full ${
                            isActive
                              ? 'bg-[#7C6CF0] shadow-[0_0_6px_#7C6CF0]'
                              : 'bg-[#7C6CF0]/70'
                          }`}
                          title="Terpasang"
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#7C8794]/70 leading-tight block">
                        {runtime.apacheModule}
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-mono text-[12px] text-[#F5A623] font-medium leading-tight block group-hover:underline">
                          tap untuk pasang
                        </span>
                        {/* 7dp status dot: garis abu = belum */}
                        <span
                          className="w-[7px] h-[7px] rounded-full border border-[#7C8794]/60 bg-transparent"
                          title="Belum terpasang"
                        />
                      </div>
                      <span className="font-mono text-[11px] text-[#7C8794]/50 leading-tight block">
                        unduh ~14MB
                      </span>
                    </div>
                  )}

                  {/* Trash icon: MUNCUL HANYA jika terpasang & bukan versi aktif */}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDelete(runtime.version);
                      }}
                      className="p-1.5 rounded-lg text-[#7C8794] hover:text-[#E5544B] hover:bg-[#E5544B]/10 transition-colors ml-1 cursor-pointer"
                      title={`Hapus PHP ${runtime.version}`}
                      aria-label={`Hapus PHP versi ${runtime.version}`}
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.75]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
