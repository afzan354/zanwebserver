import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Share2, FileText, Trash2, Search, Check } from 'lucide-react';
import { LogEntry, ServerStatus } from '../types/server.ts';

interface LogScreenProps {
  logs: LogEntry[];
  serverStatus: ServerStatus;
  onBack: () => void;
  onRefreshLogs: () => void;
  onClearLogs: () => void;
}

export const LogScreen: React.FC<LogScreenProps> = ({
  logs,
  serverStatus,
  onBack,
  onRefreshLogs,
  onClearLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'apache' | 'mariadb'>('apache');
  const [filterQuery, setFilterQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter logs for selected tab
  const tabLogs = logs.filter((log) => log.service === activeTab);
  const filteredLogs = tabLogs.filter((log) =>
    filterQuery ? log.message.toLowerCase().includes(filterQuery.toLowerCase()) : true
  );

  const handleShareLogs = () => {
    const textToShare = tabLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToShare).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmpty = tabLogs.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-[#101418] min-h-0 select-text">
      {/* Top App Bar */}
      <div className="px-4 py-3 bg-[#182029] border-b border-[#232C38] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[#1F2836] text-[#EDF1F7] transition-colors cursor-pointer"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 stroke-2" />
          </button>
          <h1 className="text-base font-bold text-[#EDF1F7] tracking-tight">
            Log server
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefreshLogs}
            className="p-2 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] transition-colors cursor-pointer"
            title="Muat ulang log"
            aria-label="Muat ulang log"
          >
            <RefreshCw className="w-4 h-4 stroke-[1.75]" />
          </button>
          <button
            onClick={handleShareLogs}
            className="p-2 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] transition-colors cursor-pointer relative"
            title="Bagikan / salin log"
            aria-label="Bagikan log"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#7C6CF0] stroke-2" />
            ) : (
              <Share2 className="w-4 h-4 stroke-[1.75]" />
            )}
          </button>
          {!isEmpty && (
            <button
              onClick={onClearLogs}
              className="p-2 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#E5544B] transition-colors cursor-pointer"
              title="Bersihkan log"
              aria-label="Bersihkan log"
            >
              <Trash2 className="w-4 h-4 stroke-[1.75]" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Chips: Apache & MariaDB */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-[#232C38] bg-[#101418]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('apache')}
            aria-pressed={activeTab === 'apache'}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'apache'
                ? 'bg-[#7C6CF0] text-[#EDF1F7] shadow-[0_0_10px_rgba(124,108,240,0.3)]'
                : 'bg-[#182029] text-[#7C8794] hover:bg-[#1F2836] border border-[#232C38]'
            }`}
          >
            Apache
          </button>
          <button
            onClick={() => setActiveTab('mariadb')}
            aria-pressed={activeTab === 'mariadb'}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === 'mariadb'
                ? 'bg-[#7C6CF0] text-[#EDF1F7] shadow-[0_0_10px_rgba(124,108,240,0.3)]'
                : 'bg-[#182029] text-[#7C8794] hover:bg-[#1F2836] border border-[#232C38]'
            }`}
          >
            MariaDB
          </button>
        </div>

        {/* Search within log */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#7C8794] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari..."
            aria-label="Cari log"
            className="w-28 focus:w-36 text-xs bg-[#182029] border border-[#232C38] rounded-full pl-7 pr-2.5 py-1 text-[#EDF1F7] placeholder-[#7C8794]/60 font-mono transition-all outline-none focus:border-[#7C6CF0]"
          />
        </div>
      </div>

      {/* Body: Monospace 12sp log text on panel #182029, full width, scrollable, dim gray text */}
      <div className="flex-1 p-3 min-h-0 overflow-y-auto">
        {isEmpty ? (
          /* Empty state variant as per prompt specification */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#182029] border border-[#232C38] flex items-center justify-center text-[#7C8794]">
              <FileText className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-xs font-mono text-[#7C8794] max-w-[240px]">
              log belum ada — server belum dijalankan
            </p>
            {serverStatus !== 'running' && (
              <span className="text-[11px] text-[#7C8794]/60">
                Jalankan server dari Beranda untuk mulai merekam log Apache & MariaDB.
              </span>
            )}
          </div>
        ) : (
          <div className="w-full bg-[#182029] rounded-xl p-3 border border-[#232C38] space-y-2 font-mono text-[12px] leading-relaxed select-text overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-[#7C8794] text-xs">
                Tidak ada log yang cocok dengan &quot;{filterQuery}&quot;
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 text-[#7C8794] hover:text-[#EDF1F7] hover:bg-[#1F2836]/50 p-1 rounded transition-colors"
                >
                  <span className="text-[#7C8794]/60 shrink-0 select-none text-[11px]">
                    {log.timestamp}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1 rounded uppercase tracking-wider shrink-0 select-none ${
                      log.level === 'error'
                        ? 'bg-[#E5544B]/20 text-[#E5544B]'
                        : log.level === 'warn'
                        ? 'bg-[#F5A623]/20 text-[#F5A623]'
                        : log.level === 'notice'
                        ? 'bg-[#7C6CF0]/20 text-[#7C6CF0]'
                        : 'bg-[#7C8794]/20 text-[#7C8794]'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="break-all text-[#EDF1F7]/85 font-mono">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {copied && (
        <div className="mx-5 mb-3 p-2 rounded-lg bg-[#7C6CF0] text-[#EDF1F7] text-xs text-center font-mono animate-in fade-in">
          ✓ Log berhasil disalin ke papan klip!
        </div>
      )}
    </div>
  );
};
