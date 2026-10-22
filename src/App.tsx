import React, { useState } from 'react';
import {
  ServerStatus,
  PhpRuntime,
  ServerConfig,
  LogEntry,
} from './types/server.ts';
import {
  getInitialPhpRuntimes,
  switchPhpRuntime,
  uninstallPhpRuntime,
  generateSampleLogs,
} from './utils/serverLogic.ts';
import { AndroidStatusBar, AndroidNavBar } from './components/AndroidBars.tsx';
import { Header } from './components/Header.tsx';
import { StorageBanner } from './components/StorageBanner.tsx';
import { QuickActions } from './components/QuickActions.tsx';
import { PhpRuntimeList } from './components/PhpRuntimeList.tsx';
import { SettingsRows } from './components/SettingsRows.tsx';
import { FixedBottomBar } from './components/FixedBottomBar.tsx';
import { LogScreen } from './components/LogScreen.tsx';
import {
  EditPortSheet,
  EditDocRootSheet,
  DeletePhpDialog,
  ErrorDialog,
  StoragePermissionDialog,
} from './components/BottomSheets.tsx';
import { WebPreviewModal } from './components/WebPreviewModal.tsx';
import { PhpMyAdminModal } from './components/PhpMyAdminModal.tsx';
import { StitchSpecModal } from './components/StitchSpecModal.tsx';
import { Smartphone, Monitor, Info, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'logs'
  const [activeScreen, setActiveScreen] = useState<'home' | 'logs'>('home');

  // Device display mode: 'phone' (framed) or 'full' (fluid responsive)
  const [displayMode, setDisplayMode] = useState<'phone' | 'full'>('phone');

  // Server state
  const [status, setStatus] = useState<ServerStatus>('idle');
  const [runtimes, setRuntimes] = useState<PhpRuntime[]>(getInitialPhpRuntimes());
  const [config, setConfig] = useState<ServerConfig>({
    appName: 'ZAN WEB SERVER',
    port: 8080,
    docRoot: '/sdcard/htdocs',
    activePhpVersion: '7.3',
    mariaDbVersion: '10.4',
    mariaDbRunning: true,
    storagePermissionGranted: false, // shows banner as requested
  });

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    generateSampleLogs(8080, '7.3', '10.4')
  );

  // Modals & Bottom Sheets state
  const [isEditPortOpen, setIsEditPortOpen] = useState(false);
  const [isEditDocRootOpen, setIsEditDocRootOpen] = useState(false);
  const [deletingVersion, setDeletingVersion] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [isWebPreviewOpen, setIsWebPreviewOpen] = useState(false);
  const [isPhpMyAdminOpen, setIsPhpMyAdminOpen] = useState(false);
  const [isStitchSpecOpen, setIsStitchSpecOpen] = useState(false);

  // Current active PHP runtime
  const activeRuntime = runtimes.find((r) => r.isActive) || runtimes[4];

  // Server Toggle Action (Start / Stop)
  const handleToggleServer = () => {
    if (status === 'running') {
      // Stop server
      setStatus('idle');
      const stopLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        service: 'apache',
        level: 'notice',
        message: 'AH00452: Apache/2.4.58 stopped gracefully. Shutting down worker threads.',
      };
      setLogs((prev) => [stopLog, ...prev]);
    } else if (status === 'idle' || status === 'error') {
      // Check for permission or port conflicts
      setStatus('starting');

      setTimeout(() => {
        setStatus('running');
        const startLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          service: 'apache',
          level: 'notice',
          message: `AH00094: Apache/2.4.58 running on port ${config.port} with PHP ${activeRuntime.version} (${activeRuntime.libName})`,
        };
        setLogs((prev) => [startLog, ...prev]);
      }, 1200);
    }
  };

  // PHP Runtime Selection / Installation simulation
  const handleSelectRuntime = (version: string) => {
    const target = runtimes.find((r) => r.version === version);
    if (!target) return;

    if (target.isInstalled) {
      // Already installed: activate directly
      const result = switchPhpRuntime(runtimes, version);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }
      setRuntimes(result.runtimes);
      setConfig((prev) => ({ ...prev, activePhpVersion: version }));

      // Add log
      const switchLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        service: 'apache',
        level: 'notice',
        message: `PHP runtime switched to ${version} (${target.libName}). Reloading mod_php.`,
      };
      setLogs((prev) => [switchLog, ...prev]);
    } else {
      // Not installed: run installation simulation with progress bar
      setRuntimes((prev) =>
        prev.map((r) =>
          r.version === version ? { ...r, isInstalling: true, installProgress: 15 } : r
        )
      );

      // Simulation steps: 15% -> 50% -> 85% -> 100%
      setTimeout(() => {
        setRuntimes((prev) =>
          prev.map((r) =>
            r.version === version ? { ...r, installProgress: 45 } : r
          )
        );
      }, 400);

      setTimeout(() => {
        setRuntimes((prev) =>
          prev.map((r) =>
            r.version === version ? { ...r, installProgress: 85 } : r
          )
        );
      }, 800);

      setTimeout(() => {
        setRuntimes((prev) =>
          prev.map((r) =>
            r.version === version
              ? {
                  ...r,
                  isInstalled: true,
                  isActive: true,
                  isInstalling: false,
                  installProgress: 100,
                }
              : { ...r, isActive: false }
          )
        );
        setConfig((prev) => ({ ...prev, activePhpVersion: version }));

        const installLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          service: 'apache',
          level: 'info',
          message: `Package php-${version}-zan-android installed successfully. Module ${target.libName} registered.`,
        };
        setLogs((prev) => [installLog, ...prev]);
      }, 1200);
    }
  };

  // Uninstall PHP Runtime
  const handleConfirmDelete = () => {
    if (!deletingVersion) return;
    const result = uninstallPhpRuntime(runtimes, deletingVersion);
    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setRuntimes(result.runtimes);
      const delLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        service: 'apache',
        level: 'warn',
        message: `Package php-${deletingVersion} uninstalled. Binary purged from system.`,
      };
      setLogs((prev) => [delLog, ...prev]);
    }
    setDeletingVersion(null);
  };

  // Port update
  const handleSavePort = (newPort: number) => {
    setConfig((prev) => ({ ...prev, port: newPort }));
    if (status === 'running') {
      const portLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        service: 'apache',
        level: 'notice',
        message: `Apache listener rebound to 127.0.0.1:${newPort}`,
      };
      setLogs((prev) => [portLog, ...prev]);
    }
  };

  // DocRoot update
  const handleSaveDocRoot = (newDocRoot: string) => {
    setConfig((prev) => ({ ...prev, docRoot: newDocRoot }));
    if (status === 'running') {
      const docLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        service: 'apache',
        level: 'notice',
        message: `Apache DocumentRoot updated to "${newDocRoot}"`,
      };
      setLogs((prev) => [docLog, ...prev]);
    }
  };

  // MariaDB toggle
  const handleToggleMariaDb = () => {
    const nextState = !config.mariaDbRunning;
    setConfig((prev) => ({ ...prev, mariaDbRunning: nextState }));
    const dbLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      service: 'mariadb',
      level: nextState ? 'notice' : 'warn',
      message: nextState
        ? `mysqld: ready for connections on port 3306.`
        : `mysqld: received shutdown signal. Terminated socket connections.`,
    };
    setLogs((prev) => [dbLog, ...prev]);
  };

  // Refresh logs
  const handleRefreshLogs = () => {
    const sample = generateSampleLogs(config.port, config.activePhpVersion, config.mariaDbVersion);
    setLogs(sample);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#EDF1F7] flex flex-col items-center justify-start p-0 md:p-4 selection:bg-[#7C6CF0]/40">
      {/* Top Utility Bar for Web Viewer / Showcase */}
      <aside aria-label="Control bar mockup" className="w-full max-w-md md:max-w-xl mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-[#7C8794]">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-[#EDF1F7] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C6CF0]" />
            ZAN WEB SERVER
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#7C8794]">
            (control panel localhost Android)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame mode toggle */}
          <button
            onClick={() => setDisplayMode(displayMode === 'phone' ? 'full' : 'phone')}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#182029] hover:bg-[#1F2836] border border-[#232C38] text-[#EDF1F7] transition-colors cursor-pointer"
            title="Toggle Tampilan Frame Android / Fullscreen"
          >
            {displayMode === 'phone' ? (
              <>
                <Monitor className="w-3 h-3 text-[#7C6CF0]" />
                <span>Layar Penuh</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-[#7C6CF0]" />
                <span>Bingkai HP</span>
              </>
            )}
          </button>

          {/* Stitch Spec Button */}
          <button
            onClick={() => setIsStitchSpecOpen(true)}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#7C6CF0]/20 hover:bg-[#7C6CF0]/30 text-[#7C6CF0] border border-[#7C6CF0]/30 transition-colors cursor-pointer font-medium"
            title="Lihat Prompt Google Stitch"
          >
            <Sparkles className="w-3 h-3" />
            <span>Stitch Prompts</span>
          </button>
        </div>
      </aside>

      {/* Main Container: Either Framed Android Phone on desktop or edge-to-edge on mobile */}
      <div
        className={`w-full transition-all duration-300 ${
          displayMode === 'phone'
            ? 'max-w-[412px] h-screen sm:h-[860px] sm:max-h-[95vh] sm:rounded-[38px] sm:border-[6px] border-[#232C38] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col bg-[#101418] relative'
            : 'max-w-md w-full min-h-[820px] rounded-none sm:rounded-2xl border-0 sm:border border-[#232C38] overflow-hidden flex flex-col bg-[#101418] shadow-2xl relative'
        }`}
      >
        {/* Android Hardware Notch Camera (Only in Phone mode on sm+ screens) */}
        {displayMode === 'phone' && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#101418] rounded-full z-30 items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#182029] border border-[#232C38]" />
          </div>
        )}

        {/* Android Status Bar (Time, Wifi, Battery) */}
        <AndroidStatusBar />

        {/* Screen Switcher Body */}
        {activeScreen === 'home' ? (
          <div className="flex-1 flex flex-col bg-[#101418] overflow-hidden">
            {/* Header: Title, Subtitle, Status Chip, URL Chip, 1px Divider */}
            <Header
              appName={config.appName}
              port={config.port}
              status={status}
              onOpenStitchSpec={() => setIsStitchSpecOpen(true)}
              onStatusClick={() => {
                if (status === 'error') {
                  setErrorMessage('Port 8080 telah digunakan oleh proses lain atau izin jaringan ditolak.');
                }
              }}
            />

            {/* Conditional Storage Permission Banner */}
            <StorageBanner
              isVisible={!config.storagePermissionGranted}
              onRequestPermission={() => setIsStorageDialogOpen(true)}
            />

            {/* Quick Actions Row: power, external-link, database, document */}
            <QuickActions
              status={status}
              port={config.port}
              onToggleServer={handleToggleServer}
              onOpenBrowser={() => setIsWebPreviewOpen(true)}
              onOpenDatabase={() => setIsPhpMyAdminOpen(true)}
              onOpenLogs={() => setActiveScreen('logs')}
            />

            {/* Middle Section: PHP Runtime List (Scrollable area) */}
            <PhpRuntimeList
              runtimes={runtimes}
              onSelectRuntime={handleSelectRuntime}
              onRequestDelete={(version) => setDeletingVersion(version)}
            />

            {/* Bottom Section: Settings Rows (DocRoot, Port, MariaDB) */}
            <SettingsRows
              docRoot={config.docRoot}
              port={config.port}
              mariaDbVersion={config.mariaDbVersion}
              mariaDbRunning={config.mariaDbRunning}
              onEditDocRoot={() => setIsEditDocRootOpen(true)}
              onEditPort={() => setIsEditPortOpen(true)}
              onToggleMariaDb={handleToggleMariaDb}
            />

            {/* Fixed Bottom: 56dp Pill Button (Start server / Stop server) */}
            <FixedBottomBar
              status={status}
              onToggleServer={handleToggleServer}
            />
          </div>
        ) : (
          /* Layar 2: Log Screen */
          <LogScreen
            logs={logs}
            serverStatus={status}
            onBack={() => setActiveScreen('home')}
            onRefreshLogs={handleRefreshLogs}
            onClearLogs={() => setLogs([])}
          />
        )}

        {/* Android Gesture Navigation Bar */}
        <AndroidNavBar
          onHome={() => setActiveScreen('home')}
          onBack={() => {
            if (activeScreen === 'logs') setActiveScreen('home');
          }}
        />
      </div>

      {/* Quick Interactive Info Footer */}
      <footer className="mt-3 text-center text-xs text-[#7C8794] max-w-md px-4">
        <span>ZAN WEB SERVER • Palet warna: ink <code className="text-[#EDF1F7]">#101418</code>, panel <code className="text-[#EDF1F7]">#182029</code>, accent <code className="text-[#7C6CF0]">#7C6CF0</code>, amber <code className="text-[#F5A623]">#F5A623</code></span>
      </footer>

      {/* Layar 3: Bottom Sheets & Dialogs */}
      <EditPortSheet
        isOpen={isEditPortOpen}
        initialPort={config.port}
        onClose={() => setIsEditPortOpen(false)}
        onSave={handleSavePort}
      />

      <EditDocRootSheet
        isOpen={isEditDocRootOpen}
        initialDocRoot={config.docRoot}
        onClose={() => setIsEditDocRootOpen(false)}
        onSave={handleSaveDocRoot}
      />

      <DeletePhpDialog
        version={deletingVersion}
        onClose={() => setDeletingVersion(null)}
        onConfirm={handleConfirmDelete}
      />

      <ErrorDialog
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />

      <StoragePermissionDialog
        isOpen={isStorageDialogOpen}
        onClose={() => setIsStorageDialogOpen(false)}
        onGrant={() => {
          setConfig((prev) => ({ ...prev, storagePermissionGranted: true }));
          setIsStorageDialogOpen(false);
        }}
      />

      {/* Auxiliary In-App Web Browser Preview */}
      <WebPreviewModal
        isOpen={isWebPreviewOpen}
        port={config.port}
        phpVersion={activeRuntime.version}
        docRoot={config.docRoot}
        serverStatus={status}
        mariaDbRunning={config.mariaDbRunning}
        onClose={() => setIsWebPreviewOpen(false)}
      />

      {/* Auxiliary In-App phpMyAdmin Modal */}
      <PhpMyAdminModal
        isOpen={isPhpMyAdminOpen}
        mariaDbRunning={config.mariaDbRunning}
        mariaDbVersion={config.mariaDbVersion}
        onToggleMariaDb={handleToggleMariaDb}
        onClose={() => setIsPhpMyAdminOpen(false)}
      />

      {/* Stitch Spec & Prompts Modal */}
      <StitchSpecModal
        isOpen={isStitchSpecOpen}
        onClose={() => setIsStitchSpecOpen(false)}
      />
    </div>
  );
}
