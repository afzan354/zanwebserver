import React, { useState } from 'react';
import { X, RefreshCw, Globe, ArrowLeft, ExternalLink, CheckCircle2, AlertOctagon } from 'lucide-react';
import { ServerStatus } from '../types/server.ts';

interface WebPreviewModalProps {
  isOpen: boolean;
  port: number;
  phpVersion: string;
  docRoot: string;
  serverStatus: ServerStatus;
  mariaDbRunning: boolean;
  onClose: () => void;
}

export const WebPreviewModal: React.FC<WebPreviewModalProps> = ({
  isOpen,
  port,
  phpVersion,
  docRoot,
  serverStatus,
  mariaDbRunning,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'index' | 'phpinfo'>('index');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const isRunning = serverStatus === 'running';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#182029] rounded-2xl border border-[#232C38] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Browser Top Bar */}
        <div className="px-3 py-2 bg-[#101418] border-b border-[#232C38] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Globe className="w-3.5 h-3.5 text-[#7C8794] shrink-0" />
            <div className="flex-1 bg-[#182029] px-2.5 py-1 rounded-full border border-[#232C38] flex items-center justify-between text-xs font-mono text-[#EDF1F7] truncate">
              <span className="truncate">http://127.0.0.1:{port}/</span>
              <span className="text-[10px] text-[#7C6CF0] ml-2 shrink-0">localhost</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] cursor-pointer ${
                isRefreshing ? 'animate-spin text-[#7C6CF0]' : ''
              }`}
              title="Refresh"
              aria-label="Muat ulang halaman"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] cursor-pointer"
              title="Tutup"
              aria-label="Tutup browser"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#101418] text-[#EDF1F7] select-text">
          {!isRunning ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#E5544B]/10 border border-[#E5544B]/30 flex items-center justify-center text-[#E5544B]">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#EDF1F7]">
                Situs ini tidak dapat dijangkau
              </h4>
              <p className="text-xs font-mono text-[#7C8794] max-w-xs">
                ERR_CONNECTION_REFUSED: Server Apache di port {port} sedang nonaktif. Tekan &quot;Start server&quot; di Beranda.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Site Header */}
              <div className="p-4 rounded-xl bg-[#182029] border border-[#232C38]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7C6CF0]/20 flex items-center justify-center font-mono font-bold text-[#7C6CF0] text-sm">
                      Z
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#EDF1F7]">
                        ZAN WEB SERVER
                      </h3>
                      <p className="text-[11px] font-mono text-[#7C8794]">
                        Apache 2.4.58 • PHP {phpVersion}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5A623]/20 text-[#F5A623] font-mono border border-[#F5A623]/40">
                    ● running
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#232C38] grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#101418] p-2 rounded-lg border border-[#232C38]">
                    <span className="text-[#7C8794] text-[10px] block">DOCUMENT ROOT</span>
                    <span className="text-[#EDF1F7] text-[11px] truncate block">{docRoot}</span>
                  </div>
                  <div className="bg-[#101418] p-2 rounded-lg border border-[#232C38]">
                    <span className="text-[#7C8794] text-[10px] block">MARIADB 10.4</span>
                    <span className={mariaDbRunning ? 'text-[#F5A623] text-[11px]' : 'text-[#7C8794] text-[11px]'}>
                      {mariaDbRunning ? 'Connected (:3306)' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-2 border-b border-[#232C38] pb-2">
                <button
                  onClick={() => setActiveTab('index')}
                  className={`text-xs font-mono px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'index'
                      ? 'bg-[#7C6CF0] text-[#EDF1F7]'
                      : 'text-[#7C8794] hover:text-[#EDF1F7]'
                  }`}
                >
                  index.php
                </button>
                <button
                  onClick={() => setActiveTab('phpinfo')}
                  className={`text-xs font-mono px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'phpinfo'
                      ? 'bg-[#7C6CF0] text-[#EDF1F7]'
                      : 'text-[#7C8794] hover:text-[#EDF1F7]'
                  }`}
                >
                  phpinfo()
                </button>
              </div>

              {activeTab === 'index' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#182029] rounded-xl border border-[#232C38] text-xs font-mono">
                    <p className="text-[#7C6CF0] font-bold mb-1">
                      &lt;?php echo &quot;Halo dari ZAN WEB SERVER di Android!&quot;; ?&gt;
                    </p>
                    <p className="text-[#7C8794] text-[11px]">
                      File ini dimuat dari <span className="text-[#EDF1F7]">{docRoot}/index.php</span>
                    </p>
                  </div>

                  {/* Sample directory files */}
                  <div className="bg-[#182029] rounded-xl border border-[#232C38] p-3 text-xs font-mono">
                    <span className="text-[10px] text-[#7C8794] uppercase tracking-wider block mb-2 font-bold">
                      Isi Direktori {docRoot}:
                    </span>
                    <ul className="space-y-1 text-[#EDF1F7]">
                      <li className="flex justify-between py-1 border-b border-[#232C38]/60">
                        <span>📄 index.php</span>
                        <span className="text-[#7C8794]">1.2 KB</span>
                      </li>
                      <li className="flex justify-between py-1 border-b border-[#232C38]/60">
                        <span>📄 test_db.php</span>
                        <span className="text-[#7C8794]">840 B</span>
                      </li>
                      <li className="flex justify-between py-1 border-b border-[#232C38]/60">
                        <span>📁 assets/</span>
                        <span className="text-[#7C8794]">--</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span>📁 wordpress/</span>
                        <span className="text-[#7C8794]">--</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-[#182029] rounded-xl border border-[#232C38] p-3 font-mono text-xs space-y-2">
                  <div className="text-center font-bold text-sm text-[#7C6CF0] pb-2 border-b border-[#232C38]">
                    PHP Version {phpVersion}.0-zan-android
                  </div>
                  <table className="w-full text-[11px]">
                    <tbody>
                      <tr className="border-b border-[#232C38]/60">
                        <td className="py-1 text-[#7C8794]">System</td>
                        <td className="py-1 text-[#EDF1F7]">Linux localhost 5.15.0-android-arm64</td>
                      </tr>
                      <tr className="border-b border-[#232C38]/60">
                        <td className="py-1 text-[#7C8794]">Server API</td>
                        <td className="py-1 text-[#EDF1F7]">Apache 2.0 Handler (mod_php)</td>
                      </tr>
                      <tr className="border-b border-[#232C38]/60">
                        <td className="py-1 text-[#7C8794]">Configuration File</td>
                        <td className="py-1 text-[#EDF1F7]">/data/data/com.zan.server/etc/php.ini</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-[#7C8794]">Loaded Extensions</td>
                        <td className="py-1 text-[#EDF1F7]">mysqli, pdo_mysql, curl, mbstring, openssl, json</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
