import React, { useState } from 'react';
import { X, Database, Play, CheckCircle, RefreshCw, KeyRound, Server } from 'lucide-react';

interface PhpMyAdminModalProps {
  isOpen: boolean;
  mariaDbRunning: boolean;
  mariaDbVersion: string;
  onToggleMariaDb: () => void;
  onClose: () => void;
}

export const PhpMyAdminModal: React.FC<PhpMyAdminModalProps> = ({
  isOpen,
  mariaDbRunning,
  mariaDbVersion,
  onToggleMariaDb,
  onClose,
}) => {
  const [activeDb, setActiveDb] = useState('zan_db');
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunQuery = () => {
    if (!mariaDbRunning) {
      setQueryResult('ERROR 2002 (HY000): Can\'t connect to local MySQL server through socket \'/data/data/com.zan.server/run/mysqld.sock\'');
      return;
    }
    setQueryResult('2 baris dikembalikan dalam 0.0014 detik.\n[id: 1, username: "admin", email: "admin@localhost", role: "superadmin"]\n[id: 2, username: "alfin", email: "alfin@example.com", role: "developer"]');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#182029] rounded-2xl border border-[#232C38] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#101418] border-b border-[#232C38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#EDF1F7]">
                phpMyAdmin
              </h3>
              <p className="text-[11px] font-mono text-[#7C8794]">
                MariaDB {mariaDbVersion} (Login: root / root)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1F2836] text-[#7C8794] hover:text-[#EDF1F7] cursor-pointer"
            aria-label="Tutup phpMyAdmin"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto bg-[#101418] text-[#EDF1F7]">
          {/* MariaDB Service Card */}
          <div className="p-3 bg-[#182029] rounded-xl border border-[#232C38] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  mariaDbRunning
                    ? 'bg-[#F5A623] shadow-[0_0_8px_#F5A623]'
                    : 'bg-[#7C8794]/40'
                }`}
              />
              <div>
                <span className="text-xs font-bold text-[#EDF1F7] block">
                  Service MariaDB 10.4
                </span>
                <span className="text-[11px] font-mono text-[#7C8794]">
                  {mariaDbRunning ? 'Port 3306 • Status Active' : 'Status: Stopped'}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleMariaDb}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                mariaDbRunning
                  ? 'bg-[#F5A623] text-[#101418] font-bold'
                  : 'bg-[#7C6CF0] text-[#EDF1F7]'
              }`}
            >
              {mariaDbRunning ? 'Stop MariaDB' : 'Start MariaDB'}
            </button>
          </div>

          {/* Database Selector & Tables */}
          <div className="grid grid-cols-3 gap-2">
            {['zan_db', 'wordpress', 'mysql', 'testdb', 'information_schema'].map((db) => (
              <button
                key={db}
                onClick={() => setActiveDb(db)}
                className={`p-2 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
                  activeDb === db
                    ? 'bg-[#1F2836] border-[#7C6CF0] text-[#7C6CF0]'
                    : 'bg-[#182029] border-[#232C38] text-[#7C8794] hover:text-[#EDF1F7]'
                }`}
              >
                📁 {db}
              </button>
            ))}
          </div>

          {/* Query Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#7C8794]">
              <span>SQL Query Console ({activeDb}):</span>
              <button
                onClick={handleRunQuery}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-[#7C6CF0] hover:bg-[#7C6CF0]/90 text-[#EDF1F7] cursor-pointer font-semibold shadow"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Kirim SQL</span>
              </button>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full bg-[#182029] border border-[#232C38] focus:border-[#7C6CF0] text-[#EDF1F7] font-mono text-xs p-3 rounded-xl outline-none resize-none"
              placeholder="SELECT * FROM table;"
            />
          </div>

          {/* Result view */}
          {queryResult && (
            <div className="p-3 bg-[#182029] border border-[#232C38] rounded-xl text-xs font-mono">
              <span className="text-[10px] text-[#7C8794] uppercase tracking-wider block mb-1">
                Hasil Eksekusi:
              </span>
              <pre className="text-[#EDF1F7] whitespace-pre-wrap leading-relaxed">
                {queryResult}
              </pre>
            </div>
          )}

          {/* Default Credentials Info */}
          <div className="p-2.5 rounded-lg bg-[#182029]/60 border border-[#232C38] flex items-center justify-between text-xs font-mono text-[#7C8794]">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#7C6CF0]" />
              <span>Kredensial Default:</span>
            </span>
            <span className="text-[#EDF1F7]">
              user: <code className="text-[#7C6CF0]">root</code> | pass: <code className="text-[#7C6CF0]">root</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
