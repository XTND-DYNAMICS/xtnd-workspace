import { test } from 'node:test';
import assert from 'node:assert/strict';
import { XFilesPlugin, type XFilesDocumentRecord, type XFilesRegisterRecord } from '../src/index.ts';

test('XFilesPlugin: maps XFILES canonical document into XWORKSPACE graph node', () => {
  const plugin = new XFilesPlugin();
  const sampleDoc: XFilesDocumentRecord = {
    guid: 'doc_xw001',
    xds_id: 'XW-001',
    version: '0.1.0',
    title: 'XWORKSPACE — Vision and Mission',
    purpose: 'Fix the scope of XWORKSPACE before implementation begins',
    author: 'Peter A. Moelgaard',
    status: 'Draft for review',
    raw_markdown: '# XWORKSPACE — Vision and Mission',
    path: '00-Foundation/XWORKSPACE-Vision-and-Mission.md',
    updated_at: new Date().toISOString()
  };

  const node = plugin.mapDocumentToNode(sampleDoc);
  assert.equal(node.guid, 'xfiles_doc_xw001');
  assert.equal(node.type, 'markdown');
  assert.equal(node.metadata?.xdsId, 'XW-001');
  assert.equal(node.writePolicy, 'bidirectional_writeback');
});

test('XFilesPlugin: maps document register into graph nodes and references relations', () => {
  const plugin = new XFilesPlugin();
  const sampleRegister: XFilesRegisterRecord = {
    guid: 'reg_001',
    title: 'XWORKSPACE Document Register',
    path: 'DOCUMENT-REGISTER.md',
    entries: [
      { id: 'XW-001', document: 'Vision', path: '00-Foundation/XW-001.md', purpose: 'Vision', status: 'Draft' },
      { id: 'XW-002', document: 'Design System', path: '01-Design/XW-002.md', purpose: 'Design', status: 'Draft' }
    ]
  };

  const { registerNode, relations } = plugin.mapRegisterToGraph(sampleRegister);
  assert.equal(registerNode.guid, 'xfiles_reg_reg_001');
  assert.equal(relations.length, 2);
  assert.equal(relations[0].relationType, 'references');

  const html = plugin.renderRegisterProjection(sampleRegister);
  assert.ok(html.includes('XFILES · XDS Canon'));
  assert.ok(html.includes('XW-001'));
  assert.ok(html.includes('XW-002'));
});
