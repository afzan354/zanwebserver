import React from 'react';
import { Pencil, Folder, Hash, Database } from 'lucide-react';

interface SettingsRowsProps {
  docRoot: string;
  port: number;
  mariaDbVersion: string;
  mariaDbRunning: boolean;
  onEditDocRoot: () => void;
  onEditPort: () => void;
  onToggleMariaDb: () => void;
}

export const SettingsRows: React.FC<SettingsRowsProps> = ({
  docRoot,
  port,
  mariaDbVersion,
  mariaDbRunning,
  onEditDocRoot,
  onEditPort,
  onToggleMariaDb,
}) => {
  return (
    <section className="px-5 py-2 space-y-2">
      {/* 1. Document Root Row */}
      <button
        type="button"
        onClick={onEditDocRoot}
        aria-label={`Ubah document root: ${docRoot}`}
        className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Folder className="w-4 h-4 text-[#7C8794] shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] text-[#7C8794] block uppercase tracking-wider font-semibold">
              document root
            </span>
            <span className="font-mono text-xs text-[#EDF1F7] truncate block">
              {docRoot}
            </span>
          </div>
        </div>
        <div className="p-1 text-[#7C8794] group-hover:text-[#7C6CF0] transition-colors">
          <Pencil className="w-4 h-4 stroke-[1.75]" />
        </div>
      </button>

      {/* 2. Port Row */}
      <button
        type="button"
        onClick={onEditPort}
        aria-label={`Ubah port: ${port}`}
        className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <Hash className="w-4 h-4 text-[#7C8794] shrink-0" />
          <div>
            <span className="text-[11px] text-[#7C8794] block uppercase tracking-wider font-semibold">
              port
            </span>
            <span className="font-mono text-xs text-[#EDF1F7]">
              {port}
            </span>
          </div>
        </div>
        <div className="p-1 text-[#7C8794] group-hover:text-[#7C6CF0] transition-colors">
          <Pencil className="w-4 h-4 stroke-[1.75]" />
        </div>
      </button>

      {/* 3. MariaDB Row */}
      <button
        type="button"
        onClick={onToggleMariaDb}
        aria-label={`Status MariaDB ${mariaDbVersion}: ${mariaDbRunning ? 'Hidup' : 'Mati'}`}
        className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-[#7C8794] shrink-0" />
          <div>
            <span className="text-[11px] text-[#7C8794] block uppercase tracking-wider font-semibold">
              Database
            </span>
            <span className="font-mono text-xs text-[#EDF1F7]">
              MariaDB {mariaDbVersion}
            </span>
          </div>
        </div>

        {/* MariaDB status dot: amber=hidup, dim=mati */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#7C8794]">
            {mariaDbRunning ? '3306 ON' : 'OFF'}
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              mariaDbRunning
                ? 'bg-[#F5A623] shadow-[0_0_8px_#F5A623]'
                : 'bg-[#7C8794]/40'
            }`}
            title={mariaDbRunning ? 'MariaDB aktif' : 'MariaDB nonaktif'}
          />
        </div>
      </button>
    </section>
  );
};
