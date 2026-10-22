import React from 'react';
import { Power, ExternalLink, Database, FileText } from 'lucide-react';
import { ServerStatus } from '../types/server.ts';

interface QuickActionsProps {
  status: ServerStatus;
  port: number;
  onToggleServer: () => void;
  onOpenBrowser: () => void;
  onOpenDatabase: () => void;
  onOpenLogs: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  status,
  port,
  onToggleServer,
  onOpenBrowser,
  onOpenDatabase,
  onOpenLogs,
}) => {
  const isRunning = status === 'running';
  const isStarting = status === 'starting';

  return (
    <div className="px-5 py-3">
      <div className="grid grid-cols-4 gap-3">
        {/* 1. Power Action */}
        <button
          onClick={onToggleServer}
          disabled={isStarting}
          aria-label={isRunning ? 'Quick action: Stop server' : 'Quick action: Start server'}
          className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all cursor-pointer active:scale-95 group ${
            isRunning
              ? 'bg-[#F5A623] text-[#101418] hover:bg-[#F5A623]/90 shadow-[0_0_12px_rgba(245,166,35,0.35)]'
              : 'bg-[#7C6CF0] text-[#EDF1F7] hover:bg-[#7C6CF0]/90 shadow-[0_0_12px_rgba(124,108,240,0.35)]'
          } ${isStarting ? 'opacity-70 animate-pulse' : ''}`}
          title={isRunning ? 'Stop server' : 'Start server'}
        >
          <Power className="w-6 h-6 stroke-[2.5]" />
          <span className="text-[11px] font-medium mt-1 font-mono">
            {isRunning ? 'Stop' : isStarting ? 'Starting' : 'Start'}
          </span>
        </button>

        {/* 2. External Browser Link */}
        <button
          onClick={onOpenBrowser}
          aria-label={`Buka 127.0.0.1:${port} di browser`}
          className="flex flex-col items-center justify-center h-20 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] text-[#7C8794] hover:text-[#EDF1F7] transition-all cursor-pointer active:scale-95"
          title={`Buka http://127.0.0.1:${port}`}
        >
          <ExternalLink className="w-6 h-6 stroke-2" />
          <span className="text-[11px] font-medium mt-1 font-mono">
            Browser
          </span>
        </button>

        {/* 3. Database phpMyAdmin */}
        <button
          onClick={onOpenDatabase}
          aria-label="Buka phpMyAdmin MariaDB"
          className="flex flex-col items-center justify-center h-20 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] text-[#7C8794] hover:text-[#EDF1F7] transition-all cursor-pointer active:scale-95"
          title="Buka phpMyAdmin (root/root)"
        >
          <Database className="w-6 h-6 stroke-2" />
          <span className="text-[11px] font-medium mt-1 font-mono">
            Database
          </span>
        </button>

        {/* 4. Document / Log */}
        <button
          onClick={onOpenLogs}
          aria-label="Buka log server Apache dan MariaDB"
          className="flex flex-col items-center justify-center h-20 rounded-xl bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] text-[#7C8794] hover:text-[#EDF1F7] transition-all cursor-pointer active:scale-95"
          title="Buka log server"
        >
          <FileText className="w-6 h-6 stroke-2" />
          <span className="text-[11px] font-medium mt-1 font-mono">
            Log
          </span>
        </button>
      </div>
    </div>
  );
};
