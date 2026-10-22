export type ServerStatus = 'idle' | 'starting' | 'running' | 'error';

export interface PhpRuntime {
  version: string;
  majorMinor: string;
  libName: string;
  apacheModule: string;
  isInstalled: boolean;
  isActive: boolean;
  isInstalling?: boolean;
  installProgress?: number;
}

export interface ServerConfig {
  appName: string;
  port: number;
  docRoot: string;
  activePhpVersion: string;
  mariaDbVersion: string;
  mariaDbRunning: boolean;
  storagePermissionGranted: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  service: 'apache' | 'mariadb';
  level: 'info' | 'notice' | 'warn' | 'error';
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedValue?: string | number;
}
