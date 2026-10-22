import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Palette, CheckSquare, Layers } from 'lucide-react';

interface StitchSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StitchSpecModal: React.FC<StitchSpecModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompts' | 'tokens' | 'checklist'>('prompts');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    icons: true,
    states: true,
    status_chip: true,
    primary_btn: true,
    banner: true,
    bottom_sheet: true,
    log_screen: true,
    splash_dark: true,
  });

  if (!isOpen) return null;

  const copyText = (key: string, text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const prompts = [
    {
      id: 'screen1',
      title: 'LAYAR 1 — Beranda (PROMPT STITCH)',
      content: `Android app screen, dark mission-control dashboard, near-black background #101418.
Header: big bold title "MejaPHP", small monospace subtitle "port 8080", right side a pill status chip with glowing amber LED dot and text "running". Below a 1px divider.
Quick actions row: 4 rounded icon buttons (power, external-link, database, document). Power button is prominent filled violet.
Middle section titled "Runtime PHP": vertical list of 5 large cards on #182029 panels, each card has a huge monospace version number (8.3, 8.2, 8.1, 7.4, 7.3); the selected card 7.3 has violet number, a 3dp violet rail on its left edge, slightly lighter background; small monospace technical labels on the right ("libphp7.so", "apache2_64") with a status dot.
Bottom section: rows "document root /sdcard/htdocs" and "port 8080" with pencil icons, a row "MariaDB 10.4" with status dot.
Fixed bottom: full-width pill button "Stop server" filled amber.
Flat modern, generous spacing, no gradients.`,
    },
    {
      id: 'screen2',
      title: 'LAYAR 2 — Log (PROMPT STITCH)',
      content: `Same dark theme #101418. Top app bar with back arrow and title "Log server".
Two pill tab chips: "Apache" and "MariaDB" (active chip violet).
Body: monospace 12sp log text on panel #182029, full width, scrollable, dim gray text.
Top-right icon buttons: refresh and share. Empty state variant: centered dim text "log belum ada — server belum dijalankan" with a small document icon.`,
    },
    {
      id: 'screen3',
      title: 'LAYAR 3 — Bottom Sheets & Dialog (PROMPT STITCH)',
      content: `Same dark theme. Bottom sheet on #182029 rounded top 24dp: title "Edit port", monospace text input filled #101418 with violet cursor, buttons row right-aligned: ghost "Batal" and filled violet "Simpan".
Second variant: confirmation dialog "Hapus PHP 7.4?" body "Runtime tidak bisa dikembalikan otomatis." ghost "Batal" red filled "Hapus".`,
    },
  ];

  const tokens = [
    { name: 'ink', hex: '#101418', desc: 'background layar' },
    { name: 'panel', hex: '#182029', desc: 'kartu, header' },
    { name: 'panelSel', hex: '#1F2836', desc: 'kartu terpilih' },
    { name: 'text', hex: '#EDF1F7', desc: 'teks utama' },
    { name: 'dim', hex: '#7C8794', desc: 'teks sekunder/info teknis' },
    { name: 'accent (violet)', hex: '#7C6CF0', desc: 'angka versi terpilih, rail, tombol Start, dot installed' },
    { name: 'amber', hex: '#F5A623', desc: 'KHUSUS status server: running, tombol Stop, tap pasang' },
    { name: 'error', hex: '#E5544B', desc: 'gagal start, dialog error' },
    { name: 'line', hex: '#232C38', desc: 'garis pembatas 1dp' },
  ];

  const checklistItems = [
    { id: 'icons', label: '8 ikon 24dp stroke 2dp outline: power, external-link, database, document, pensil, trash, refresh, back' },
    { id: 'states', label: '3 state kartu versi (belum aktif / aktif / belum terpasang) + 1 progress inline' },
    { id: 'status_chip', label: '4 state status chip (idle / starting / running / error)' },
    { id: 'primary_btn', label: '2 state tombol primary (Start violet / Stop amber)' },
    { id: 'banner', label: 'Banner izin akses file (Diperlukan akses semua file...)' },
    { id: 'bottom_sheet', label: 'Bottom sheet edit + dialog konfirmasi + dialog error' },
    { id: 'log_screen', label: 'Layar log + state kosongnya' },
    { id: 'splash_dark', label: 'Splash background gelap (anti-kilat putih #101418)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-[#182029] rounded-2xl border border-[#232C38] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#101418] border-b border-[#232C38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7C6CF0]/20 flex items-center justify-center text-[#7C6CF0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#EDF1F7]">
                Google Stitch Spec & Prompts
              </h3>
              <p className="text-[11px] text-[#7C8794]">
                ZAN WEB SERVER (MejaPHP) Desain UI Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] cursor-pointer"
            aria-label="Tutup stitch spec"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-[#101418] border-b border-[#232C38] flex gap-2">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-[#7C6CF0] text-[#EDF1F7]'
                : 'bg-[#182029] text-[#7C8794] hover:text-[#EDF1F7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Prompt Stitch (3 Layar)</span>
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-[#7C6CF0] text-[#EDF1F7]'
                : 'bg-[#182029] text-[#7C8794] hover:text-[#EDF1F7]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Token Warna</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#7C6CF0] text-[#EDF1F7]'
                : 'bg-[#182029] text-[#7C8794] hover:text-[#EDF1F7]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist Aset</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#101418] text-[#EDF1F7]">
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <p className="text-xs text-[#7C8794]">
                Setiap prompt di bawah dapat langsung disalin dan ditempelkan ke Google Stitch untuk generasi desain:
              </p>
              {prompts.map((p) => (
                <div key={p.id} className="p-3.5 bg-[#182029] rounded-xl border border-[#232C38] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#7C6CF0]">{p.title}</h4>
                    <button
                      onClick={() => copyText(p.id, p.content)}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-[#7C6CF0]/20 hover:bg-[#7C6CF0] text-[#7C6CF0] hover:text-[#EDF1F7] transition-all cursor-pointer font-mono"
                    >
                      {copiedKey === p.id ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] bg-[#101418] p-3 rounded-lg text-[#EDF1F7]/90 whitespace-pre-wrap leading-relaxed border border-[#232C38]">
                    {p.content}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-3">
              <p className="text-xs text-[#7C8794]">
                Identitas visual: dark &quot;ruang kontrol&quot; / mission-control, teknis tapi hangat.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-3 bg-[#182029] rounded-xl border border-[#232C38] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg border border-[#232C38] shrink-0"
                        style={{ backgroundColor: t.hex }}
                      />
                      <div>
                        <span className="text-xs font-bold text-[#EDF1F7] block">{t.name}</span>
                        <span className="text-[10px] text-[#7C8794] block">{t.desc}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyText(t.name, t.hex)}
                      className="text-xs font-mono px-2 py-1 rounded bg-[#101418] text-[#7C8794] hover:text-[#EDF1F7] border border-[#232C38] cursor-pointer"
                    >
                      {copiedKey === t.name ? '✓' : t.hex}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-2">
              <p className="text-xs text-[#7C8794] mb-3">
                Checklist kelengkapan aset desain ZAN WEB SERVER:
              </p>
              {checklistItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-[#182029] rounded-xl border border-[#232C38] cursor-pointer hover:bg-[#1F2836] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={(e) =>
                      setChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="mt-0.5 accent-[#7C6CF0] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className={`text-xs ${checklist[item.id] ? 'text-[#EDF1F7]' : 'text-[#7C8794]'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
