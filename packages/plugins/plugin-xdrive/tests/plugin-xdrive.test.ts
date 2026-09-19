import { test } from 'node:test';
import assert from 'node:assert/strict';
import { XDrivePlugin, type XDriveFileRecord } from '../src/index.ts';

test('XDrivePlugin: maps XDRIVE file records into XWORKSPACE graph nodes', () => {
  const plugin = new XDrivePlugin();
  const sampleFile: XDriveFileRecord = {
    guid: 'file_123',
    volume_guid: 'vol_canon',
    name: 'system-blueprint.pdf',
    path: '/architecture/system-blueprint.pdf',
    size_bytes: 2048576,
    mime_type: 'application/pdf',
    r2_key: 'volumes/vol_canon/files/file_123/v1',
    version: 1,
    created_by: 'pm@xgi.io',
    updated_at: new Date().toISOString()
  };

  const node = plugin.mapFileToNode(sampleFile);
  assert.equal(node.guid, 'xdrive_file_123');
  assert.equal(node.type, 'file_asset');
  assert.equal(node.title, 'system-blueprint.pdf');
  assert.equal(node.metadata?.sourcePlatform, 'XDRIVE');

  const html = plugin.renderFileProjection(sampleFile);
  assert.ok(html.includes('XDRIVE · R2 Storage'));
  assert.ok(html.includes('system-blueprint.pdf'));
});
