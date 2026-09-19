import { test } from 'node:test';
import assert from 'node:assert/strict';
import { XTND_FAMILY_APPS, renderAppSwitcher } from '../src/components/shell/app-switcher.ts';
import { renderTopBar } from '../src/components/shell/top-bar.ts';
import { renderCompositionCanvas } from '../src/components/canvas/composition-canvas.ts';

test('App Switcher: lists all 8 family products including XDRIVE and XFILES', () => {
  assert.equal(XTND_FAMILY_APPS.length, 8);
  const slugs = XTND_FAMILY_APPS.map(a => a.slug);
  assert.ok(slugs.includes('workspace'));
  assert.ok(slugs.includes('drive'));
  assert.ok(slugs.includes('files'));
  assert.ok(slugs.includes('meridian'));
  assert.ok(slugs.includes('transfer'));
  assert.ok(slugs.includes('vantage'));
  assert.ok(slugs.includes('mail'));
  assert.ok(slugs.includes('eidos'));

  const html = renderAppSwitcher();
  assert.ok(html.includes('XWORKSPACE'));
  assert.ok(html.includes('XDRIVE'));
  assert.ok(html.includes('XFILES'));
  assert.ok(html.includes('XMERIDIAN'));
  assert.ok(html.includes('XEIDOS'));
});

test('Top Bar: contains X glyph, product wordmark and accessible search input', () => {
  const topBarHtml = renderTopBar('Evergreen AI');
  assert.ok(topBarHtml.includes('<span class="brand-glyph">X</span>'));
  assert.ok(topBarHtml.includes('WORKSPACE'));
  assert.ok(topBarHtml.includes('global-search-input'));
  assert.ok(topBarHtml.includes('app-switcher-btn'));
});

test('Composition Canvas: renders quiet provenance badge and write-policy signal', () => {
  const html = renderCompositionCanvas({
    node: {
      guid: 'node_test_01',
      tenantGuid: 'tenant_eai_001',
      spaceGuid: 'space_eai_canon',
      type: 'markdown',
      title: 'Test Canon Page',
      writePolicy: 'bidirectional_writeback',
      createdBy: 'pm@xgi.io',
      updatedBy: 'pm@xgi.io',
      createdAt: '',
      updatedAt: ''
    },
    outgoingRelations: [],
    incomingRelations: [],
    projections: [
      {
        type: 'live_table',
        title: 'XDS Document Register',
        sourceName: 'XFILES Platform',
        writePolicy: 'bidirectional_writeback',
        data: { rows: [{ id: 'XW-001', status: 'Draft', metric: 'Vision' }] }
      }
    ]
  });

  assert.ok(html.includes('provenance-badge'));
  assert.ok(html.includes('policy-badge writeback'));
  assert.ok(html.includes('Write-back enabled'));
  assert.ok(html.includes('XDS Document Register'));
  assert.ok(html.includes('XFILES Platform'));
});
