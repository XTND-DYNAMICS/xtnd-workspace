import { test } from 'node:test';
import assert from 'node:assert/strict';
import { XFOLIO_REQUIRED_TOKENS, XWORKSPACE_EXTENSION_TOKENS } from '../src/tokens.ts';
import type { Node } from '../src/types.ts';

test('XFOLIO required tokens contain essential brand and typography categories', () => {
  assert.ok(XFOLIO_REQUIRED_TOKENS.type.includes('--font-core'));
  assert.ok(XFOLIO_REQUIRED_TOKENS.colour.includes('--brand-accent'));
  assert.ok(XFOLIO_REQUIRED_TOKENS.colour.includes('--brand-primary'));
  assert.ok(XFOLIO_REQUIRED_TOKENS.space.includes('--gutter'));
  assert.ok(XFOLIO_REQUIRED_TOKENS.shape.includes('--radius-card'));
});

test('XWORKSPACE extension tokens satisfy Q-13, Q-14 and Q-11', () => {
  assert.ok(XWORKSPACE_EXTENSION_TOKENS.provenance.includes('--provenance-bg'));
  assert.ok(XWORKSPACE_EXTENSION_TOKENS.writePolicy.includes('--policy-writeback-fg'));
  assert.ok(XWORKSPACE_EXTENSION_TOKENS.appSwitcher.includes('--app-switcher-surface'));
});

test('Node type conforms to graph model', () => {
  const sampleNode: Node = {
    guid: 'node_test_123',
    tenantGuid: 'tenant_eai',
    spaceGuid: 'space_canon',
    type: 'markdown',
    title: 'EAI Vision',
    writePolicy: 'bidirectional_writeback',
    createdBy: 'user_pam',
    updatedBy: 'user_pam',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  assert.equal(sampleNode.title, 'EAI Vision');
  assert.equal(sampleNode.writePolicy, 'bidirectional_writeback');
});
