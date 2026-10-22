import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePort,
  validateDocRoot,
  getInitialPhpRuntimes,
  switchPhpRuntime,
  uninstallPhpRuntime,
  formatStatusLabel,
  generateSampleLogs,
} from './serverLogic.ts';

test('validatePort rejects empty, non-integers, out of bounds', () => {
  assert.equal(validatePort('').valid, false);
  assert.equal(validatePort('abc').valid, false);
  assert.equal(validatePort(-1).valid, false);
  assert.equal(validatePort(70000).valid, false);
  assert.equal(validatePort(22).valid, false); // < 1024 without root
});

test('validatePort accepts valid ports like 8080, 80, 8000', () => {
  const p8080 = validatePort('8080');
  assert.equal(p8080.valid, true);
  assert.equal(p8080.sanitizedValue, 8080);

  const p80 = validatePort(80);
  assert.equal(p80.valid, true);
  assert.equal(p80.sanitizedValue, 80);
});

test('validateDocRoot verifies starting slash and path traversal safety', () => {
  assert.equal(validateDocRoot('').valid, false);
  assert.equal(validateDocRoot('sdcard/htdocs').valid, false); // Missing leading slash
  assert.equal(validateDocRoot('/sdcard/../etc/passwd').valid, false); // traversal
  assert.equal(validateDocRoot('/sdcard/htdocs').valid, true);
  assert.equal(validateDocRoot('/sdcard/htdocs/mysite').sanitizedValue, '/sdcard/htdocs/mysite');
});

test('getInitialPhpRuntimes has 7.3 selected by default according to stitch spec', () => {
  const runtimes = getInitialPhpRuntimes();
  assert.equal(runtimes.length, 5);
  const active = runtimes.find((r) => r.isActive);
  assert.ok(active);
  assert.equal(active?.version, '7.3');
});

test('switchPhpRuntime toggles active state only for installed versions', () => {
  const runtimes = getInitialPhpRuntimes();

  // Try switching to 8.3 which is not installed initially
  const failResult = switchPhpRuntime(runtimes, '8.3');
  assert.ok(failResult.error);

  // Switch to installed 7.4
  const okResult = switchPhpRuntime(runtimes, '7.4');
  assert.equal(okResult.error, undefined);
  const active74 = okResult.runtimes.find((r) => r.version === '7.4');
  const active73 = okResult.runtimes.find((r) => r.version === '7.3');
  assert.equal(active74?.isActive, true);
  assert.equal(active73?.isActive, false);
});

test('uninstallPhpRuntime prevents deleting active version and handles uninstalled state', () => {
  const runtimes = getInitialPhpRuntimes();
  // 7.3 is active, should fail uninstall
  const activeFail = uninstallPhpRuntime(runtimes, '7.3');
  assert.ok(activeFail.error);

  // 7.4 is installed & not active, should succeed
  const okUninstall = uninstallPhpRuntime(runtimes, '7.4');
  assert.equal(okUninstall.error, undefined);
  const target74 = okUninstall.runtimes.find((r) => r.version === '7.4');
  assert.equal(target74?.isInstalled, false);
  assert.equal(target74?.isActive, false);
});

test('formatStatusLabel correctly handles all server statuses', () => {
  assert.equal(formatStatusLabel('idle'), 'idle');
  assert.equal(formatStatusLabel('starting'), 'starting');
  assert.equal(formatStatusLabel('running'), 'running');
  assert.equal(formatStatusLabel('error'), 'error');
});

test('generateSampleLogs creates structured Apache and MariaDB logs', () => {
  const logs = generateSampleLogs(8080, '7.3', '10.4');
  assert.ok(logs.length >= 8);
  const apacheLogs = logs.filter((l) => l.service === 'apache');
  const mariadbLogs = logs.filter((l) => l.service === 'mariadb');
  assert.ok(apacheLogs.length > 0);
  assert.ok(mariadbLogs.length > 0);
  assert.ok(apacheLogs.some((l) => l.message.includes('8080')));
});
