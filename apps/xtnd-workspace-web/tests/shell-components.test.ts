
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test('XWORKSPACE Web: verifies built Angular bundle and Google Workspace ergonomics', () => {
  const distDir = join(process.cwd(), 'dist', 'xtnd-workspace-web', 'browser');
  assert.ok(existsSync(distDir), 'Distribution browser directory should exist');

  const htmlPath = join(distDir, 'index.html');
  assert.ok(existsSync(htmlPath), 'index.html should exist');
  const html = readFileSync(htmlPath, 'utf8');
  assert.match(html, /XWORKSPACE/i, 'HTML must contain XWORKSPACE product branding');

  const files = readdirSync(distDir);
  const mainBundle = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
  assert.ok(mainBundle, 'Compiled main-*.js bundle must exist');

  const bundleCode = readFileSync(join(distDir, mainBundle), 'utf8');
  assert.match(bundleCode, /global-search-input/i, 'Bundle must contain centered search pill input');
  assert.match(bundleCode, /app-switcher-btn/i, 'Bundle must contain Google-style app switcher');
  assert.match(bundleCode, /XDRIVE/i, 'Bundle must list XDRIVE');
  assert.match(bundleCode, /XFILES/i, 'Bundle must list XFILES');
  assert.match(bundleCode, /auth\.xgi\.io/i, 'Bundle must reference XAUTH federated SSO gateway');
  assert.match(bundleCode, /provenance-badge/i, 'Bundle must contain provenance badge');
  assert.match(bundleCode, /Write-back enabled/i, 'Bundle must contain writeback signal');
});
