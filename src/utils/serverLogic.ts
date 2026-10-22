import { PhpRuntime, ServerStatus, ValidationResult, LogEntry } from '../types/server.ts';

export function validatePort(portInput: string | number): ValidationResult {
  const str = String(portInput).trim();
  if (!str) {
    return { valid: false, error: 'Port tidak boleh kosong' };
  }
  const num = Number(str);
  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Port harus berupa bilangan bulat' };
  }
  if (num < 1 || num > 65535) {
    return { valid: false, error: 'Port harus berada di antara 1 dan 65535' };
  }
  if (num < 1024 && num !== 80 && num !== 443) {
    return {
      valid: false,
      error: 'Port di bawah 1024 membutuhkan hak akses root Android (disarankan 8080 atau 8000)',
    };
  }
  return { valid: true, sanitizedValue: num };
}

export function validateDocRoot(pathInput: string): ValidationResult {
  const str = String(pathInput).trim();
  if (!str) {
    return { valid: false, error: 'Document root tidak boleh kosong' };
  }
  if (!str.startsWith('/')) {
    return { valid: false, error: 'Path harus diawali dengan tanda garis miring (/)' };
  }
  if (str.includes('..')) {
    return { valid: false, error: 'Path tidak boleh mengandung traversal (..)' };
  }
  return { valid: true, sanitizedValue: str };
}

export function getInitialPhpRuntimes(): PhpRuntime[] {
  return [
    {
      version: '8.3',
      majorMinor: '8.3.16',
      libName: 'libphp8.3.so',
      apacheModule: 'apache2_64',
      isInstalled: false,
      isActive: false,
    },
    {
      version: '8.2',
      majorMinor: '8.2.27',
      libName: 'libphp8.2.so',
      apacheModule: 'apache2_64',
      isInstalled: false,
      isActive: false,
    },
    {
      version: '8.1',
      majorMinor: '8.1.31',
      libName: 'libphp8.1.so',
      apacheModule: 'apache2_64',
      isInstalled: true,
      isActive: false,
    },
    {
      version: '7.4',
      majorMinor: '7.4.33',
      libName: 'libphp7.4.so',
      apacheModule: 'apache2_64',
      isInstalled: true,
      isActive: false,
    },
    {
      version: '7.3',
      majorMinor: '7.3.33',
      libName: 'libphp7.so',
      apacheModule: 'apache2_64',
      isInstalled: true,
      isActive: true, // Default active as per stitch spec ("selected card 7.3 has violet number")
    },
  ];
}

export function switchPhpRuntime(
  runtimes: PhpRuntime[],
  targetVersion: string
): { runtimes: PhpRuntime[]; error?: string } {
  const target = runtimes.find((r) => r.version === targetVersion);
  if (!target) {
    return { runtimes, error: `Versi PHP ${targetVersion} tidak ditemukan` };
  }
  if (!target.isInstalled) {
    return { runtimes, error: `Versi PHP ${targetVersion} belum terpasang` };
  }

  const updated = runtimes.map((r) => ({
    ...r,
    isActive: r.version === targetVersion,
  }));

  return { runtimes: updated };
}

export function uninstallPhpRuntime(
  runtimes: PhpRuntime[],
  targetVersion: string
): { runtimes: PhpRuntime[]; error?: string } {
  const target = runtimes.find((r) => r.version === targetVersion);
  if (!target) {
    return { runtimes, error: `Versi PHP ${targetVersion} tidak ditemukan` };
  }
  if (target.isActive) {
    return {
      runtimes,
      error: `Tidak bisa menghapus PHP ${targetVersion} yang sedang aktif digunakan.`,
    };
  }
  if (!target.isInstalled) {
    return { runtimes, error: `PHP ${targetVersion} memang belum terpasang.` };
  }

  const updated = runtimes.map((r) =>
    r.version === targetVersion
      ? { ...r, isInstalled: false, isActive: false, isInstalling: false, installProgress: 0 }
      : r
  );

  return { runtimes: updated };
}

export function formatStatusLabel(status: ServerStatus): string {
  switch (status) {
    case 'idle':
      return 'idle';
    case 'starting':
      return 'starting';
    case 'running':
      return 'running';
    case 'error':
      return 'error';
    default:
      return 'idle';
  }
}

export function generateSampleLogs(
  port: number,
  phpVersion: string,
  mariaDbVersion: string
): LogEntry[] {
  const now = new Date();
  const timeStr = (offsetSec: number) => {
    const d = new Date(now.getTime() - offsetSec * 1000);
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  return [
    {
      id: 'log-1',
      timestamp: timeStr(28),
      service: 'apache',
      level: 'notice',
      message: `AH00451: Apache/2.4.58 (Unix) OpenSSL/3.0.12 configured -- resuming normal operations`,
    },
    {
      id: 'log-2',
      timestamp: timeStr(27),
      service: 'apache',
      level: 'info',
      message: `AH00094: Command line: 'httpd -D FOREGROUND -f /data/data/com.zan.server/conf/httpd.conf'`,
    },
    {
      id: 'log-3',
      timestamp: timeStr(25),
      service: 'apache',
      level: 'notice',
      message: `PHP ${phpVersion} Handler loaded: /data/data/com.zan.server/modules/libphp${phpVersion.startsWith('7') ? '7' : phpVersion}.so`,
    },
    {
      id: 'log-4',
      timestamp: timeStr(20),
      service: 'apache',
      level: 'info',
      message: `AH00163: Apache/2.4.58 listening on 127.0.0.1:${port} (IPv4) [DocumentRoot: /sdcard/htdocs]`,
    },
    {
      id: 'log-5',
      timestamp: timeStr(14),
      service: 'apache',
      level: 'info',
      message: `127.0.0.1 - - [GET /index.php HTTP/1.1] 200 4812 "Mozilla/5.0 (Linux; Android)"`,
    },
    {
      id: 'log-6',
      timestamp: timeStr(35),
      service: 'mariadb',
      level: 'notice',
      message: `mysqld (server ${mariaDbVersion}-MariaDB) starting as process 14209 ...`,
    },
    {
      id: 'log-7',
      timestamp: timeStr(34),
      service: 'mariadb',
      level: 'info',
      message: `InnoDB: Mutexes and rw_locks done, OS event done, Memory alloc done`,
    },
    {
      id: 'log-8',
      timestamp: timeStr(32),
      service: 'mariadb',
      level: 'info',
      message: `InnoDB: Initializing buffer pool, total size = 64M, chunk size = 64M`,
    },
    {
      id: 'log-9',
      timestamp: timeStr(30),
      service: 'mariadb',
      level: 'notice',
      message: `mysqld: ready for connections. Version: '${mariaDbVersion}-MariaDB' socket: '/data/data/com.zan.server/run/mysqld.sock' port: 3306`,
    },
    {
      id: 'log-10',
      timestamp: timeStr(12),
      service: 'mariadb',
      level: 'info',
      message: `Connect root@localhost as anonymous on testdb using socket`,
    },
  ];
}
