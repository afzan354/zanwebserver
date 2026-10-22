import React, { useState, useEffect } from 'react';
import { validatePort, validateDocRoot } from '../utils/serverLogic.ts';
import { AlertCircle, Folder, ShieldCheck } from 'lucide-react';

/* 1. Edit Port Bottom Sheet */
interface EditPortSheetProps {
  isOpen: boolean;
  initialPort: number;
  onClose: () => void;
  onSave: (newPort: number) => void;
}

export const EditPortSheet: React.FC<EditPortSheetProps> = ({
  isOpen,
  initialPort,
  onClose,
  onSave,
}) => {
  const [portInput, setPortInput] = useState(String(initialPort));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPortInput(String(initialPort));
    setError(null);
  }, [initialPort, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePort(portInput);
    if (!result.valid) {
      setError(result.error || 'Port tidak valid');
      return;
    }
    onSave(result.sanitizedValue as number);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#182029] rounded-t-[24dp] rounded-t-3xl border-t border-[#232C38] p-6 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#232C38] rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#EDF1F7] mb-1">Edit port</h3>
        <p className="text-xs text-[#7C8794] mb-4">
          Tentukan port jaringan untuk server HTTP lokal Android (disarankan 8080 atau 8000).
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="number"
              value={portInput}
              onChange={(e) => {
                setPortInput(e.target.value);
                setError(null);
              }}
              autoFocus
              className="w-full bg-[#101418] border border-[#232C38] focus:border-[#7C6CF0] text-[#EDF1F7] caret-[#7C6CF0] font-mono text-base px-4 py-3 rounded-xl outline-none transition-colors"
              placeholder="Contoh: 8080"
              aria-label="Port server"
            />
            {error && (
              <p className="text-xs text-[#E5544B] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Buttons row right-aligned: ghost "Batal" and filled violet "Simpan" */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-[#7C8794] hover:text-[#EDF1F7] hover:bg-[#101418]/60 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#7C6CF0] hover:bg-[#7C6CF0]/90 text-[#EDF1F7] shadow-[0_2px_12px_rgba(124,108,240,0.35)] transition-all cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 2. Edit Document Root Bottom Sheet */
interface EditDocRootSheetProps {
  isOpen: boolean;
  initialDocRoot: string;
  onClose: () => void;
  onSave: (newDocRoot: string) => void;
}

export const EditDocRootSheet: React.FC<EditDocRootSheetProps> = ({
  isOpen,
  initialDocRoot,
  onClose,
  onSave,
}) => {
  const [docRootInput, setDocRootInput] = useState(initialDocRoot);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDocRootInput(initialDocRoot);
    setError(null);
  }, [initialDocRoot, isOpen]);

  if (!isOpen) return null;

  const quickPaths = [
    '/sdcard/htdocs',
    '/sdcard/Download/www',
    '/sdcard/htdocs/wordpress',
    '/storage/emulated/0/htdocs',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDocRoot(docRootInput);
    if (!result.valid) {
      setError(result.error || 'Document root tidak valid');
      return;
    }
    onSave(result.sanitizedValue as string);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#182029] rounded-t-[24dp] rounded-t-3xl border-t border-[#232C38] p-6 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#232C38] rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#EDF1F7] mb-1">Edit document root</h3>
        <p className="text-xs text-[#7C8794] mb-4">
          Direktori di penyimpanan internal perangkat Android tempat file website disimpan.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={docRootInput}
              onChange={(e) => {
                setDocRootInput(e.target.value);
                setError(null);
              }}
              autoFocus
              className="w-full bg-[#101418] border border-[#232C38] focus:border-[#7C6CF0] text-[#EDF1F7] caret-[#7C6CF0] font-mono text-sm px-4 py-3 rounded-xl outline-none transition-colors"
              placeholder="/sdcard/htdocs"
              aria-label="Path document root"
            />
            {error && (
              <p className="text-xs text-[#E5544B] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="mb-4">
            <span className="text-[11px] text-[#7C8794] block mb-1.5 font-medium">Saran direktori:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPaths.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDocRootInput(p)}
                  className="px-2 py-1 rounded-md bg-[#101418] hover:bg-[#1F2836] border border-[#232C38] text-[11px] font-mono text-[#7C8794] hover:text-[#EDF1F7] transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-[#7C8794] hover:text-[#EDF1F7] hover:bg-[#101418]/60 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#7C6CF0] hover:bg-[#7C6CF0]/90 text-[#EDF1F7] shadow-[0_2px_12px_rgba(124,108,240,0.35)] transition-all cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 3. Confirmation Dialog: Hapus PHP {versi}? */
interface DeletePhpDialogProps {
  version: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePhpDialog: React.FC<DeletePhpDialogProps> = ({
  version,
  onClose,
  onConfirm,
}) => {
  if (!version) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-[#182029] rounded-2xl border border-[#232C38] p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h3 id="dialog-title" className="text-base font-bold text-[#EDF1F7] mb-2">
          Hapus PHP {version}?
        </h3>
        <p className="text-xs text-[#7C8794] leading-relaxed mb-6">
          Runtime tidak bisa dikembalikan otomatis. File binary dan modul Apache terkait akan dihapus dari sistem Android.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#7C8794] hover:text-[#EDF1F7] hover:bg-[#101418] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E5544B] hover:bg-[#E5544B]/90 text-[#EDF1F7] shadow-[0_2px_10px_rgba(229,84,75,0.3)] transition-all cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

/* 4. Error Dialog: "Gagal: {pesan}" */
interface ErrorDialogProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-[#182029] rounded-2xl border border-[#232C38] p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="p-3 rounded-xl bg-[#E5544B]/15 border border-[#E5544B]/30 mb-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#E5544B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#E5544B]">
                Gagal
              </h4>
              <p className="text-xs text-[#EDF1F7] mt-1 font-mono leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-[#7C6CF0] hover:bg-[#7C6CF0]/90 text-[#EDF1F7] transition-all cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* 5. Storage Permission Dialog */
interface StoragePermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
}

export const StoragePermissionDialog: React.FC<StoragePermissionDialogProps> = ({
  isOpen,
  onClose,
  onGrant,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-[#182029] rounded-2xl border border-[#232C38] p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C6CF0]/20 flex items-center justify-center text-[#7C6CF0]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#EDF1F7]">Izin Penyimpanan Android</h3>
            <span className="text-[11px] text-[#7C8794]">MANAGE_EXTERNAL_STORAGE</span>
          </div>
        </div>

        <p className="text-xs text-[#EDF1F7]/80 leading-relaxed mb-5">
          ZAN WEB SERVER memerlukan izin untuk membaca dan menulis script PHP, HTML, dan aset di direktori <code className="text-[#7C6CF0] font-mono">/sdcard/htdocs</code>.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#7C8794] hover:text-[#EDF1F7] transition-colors cursor-pointer"
          >
            Nanti Saja
          </button>
          <button
            onClick={onGrant}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#7C6CF0] hover:bg-[#7C6CF0]/90 text-[#EDF1F7] shadow-[0_2px_10px_rgba(124,108,240,0.3)] transition-all cursor-pointer"
          >
            Beri Izin Akses
          </button>
        </div>
      </div>
    </div>
  );
};
