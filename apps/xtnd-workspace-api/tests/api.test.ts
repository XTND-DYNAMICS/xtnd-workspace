import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestD1 } from './mock-d1.ts';
import {
  createNode,
  getNode,
  updateNode,
  listNodes,
  createRelation,
  getNodeRelations,
  queryGraphTraversal,
  searchFtsNodes
} from '../src/graph/store.ts';
import { handleWriteBack, computeHash } from '../src/writeback/concurrency.ts';
import type { Env } from '../src/env.ts';
import type { Node, Relation } from '@xtnd-dynamics/xworkspace-core';

test('D1 Graph Store: can create, fetch and list typed nodes', async () => {
  const db = createTestD1();
  const env: Env = { DB: db };

  const node1: Node = {
    guid: 'node_vision_001',
    tenantGuid: 'tenant_eai_001',
    spaceGuid: 'space_eai_canon',
    type: 'markdown',
    title: 'XWORKSPACE Vision and Mission',
    summary: 'Fix the scope of XWORKSPACE',
    nativeContent: '# XWORKSPACE Vision and Mission',
    writePolicy: 'bidirectional_writeback',
    createdBy: 'pm@xgi.io',
    updatedBy: 'pm@xgi.io',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await createNode(env, node1);
  const fetched = await getNode(env, 'node_vision_001', 'tenant_eai_001');
  assert.ok(fetched);
  assert.equal(fetched.title, 'XWORKSPACE Vision and Mission');
  assert.equal(fetched.writePolicy, 'bidirectional_writeback');

  const list = await listNodes(env, 'tenant_eai_001');
  assert.equal(list.length, 1);
  assert.equal(list[0].guid, 'node_vision_001');
});

test('D1 Graph Store: creates typed relations and traverses graph edges', async () => {
  const db = createTestD1();
  const env: Env = { DB: db };

  const rootNode: Node = {
    guid: 'node_register',
    tenantGuid: 'tenant_eai_001',
    spaceGuid: 'space_eai_canon',
    type: 'document',
    title: 'DOCUMENT-REGISTER.md',
    writePolicy: 'bidirectional_writeback',
    createdBy: 'pm@xgi.io',
    updatedBy: 'pm@xgi.io',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const targetNode: Node = {
    guid: 'node_doc_xw001',
    tenantGuid: 'tenant_eai_001',
    spaceGuid: 'space_eai_canon',
    type: 'markdown',
    title: 'XW-001 Vision',
    writePolicy: 'bidirectional_writeback',
    createdBy: 'pm@xgi.io',
    updatedBy: 'pm@xgi.io',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await createNode(env, rootNode);
  await createNode(env, targetNode);

  const rel: Relation = {
    guid: 'rel_reg_001',
    tenantGuid: 'tenant_eai_001',
    fromNodeGuid: 'node_register',
    toNodeGuid: 'node_doc_xw001',
    relationType: 'references',
    origin: 'structural_derived',
    createdBy: 'pm@xgi.io',
    createdAt: new Date().toISOString()
  };
  await createRelation(env, rel);

  const relations = await getNodeRelations(env, 'node_register', 'tenant_eai_001');
  assert.equal(relations.outgoing.length, 1);
  assert.equal(relations.outgoing[0].targetNode.title, 'XW-001 Vision');

  const traversal = await queryGraphTraversal(env, 'node_register', 'tenant_eai_001', 2);
  assert.equal(traversal.nodes.length, 2);
  assert.equal(traversal.relations.length, 1);
});

test('Write-Back Engine: enforces optimistic concurrency and detects conflicts', async () => {
  const db = createTestD1();
  const env: Env = { DB: db };

  const initialContent = 'Initial Notion Page Content';
  const initialHash = await computeHash(initialContent);

  await env.DB.prepare(`
    INSERT INTO sources (guid, tenant_guid, space_guid, connector_type, name)
    VALUES (?, ?, ?, ?, ?)
  `).bind('source_notion_01', 'tenant_eai_001', 'space_eai_canon', 'notion', 'Notion Workspace').run();

  const federatedNode: Node = {
    guid: 'node_notion_01',
    tenantGuid: 'tenant_eai_001',
    spaceGuid: 'space_eai_canon',
    sourceGuid: 'source_notion_01',
    externalId: 'notion_page_123',
    externalVersionHash: initialHash,
    type: 'notion_page',
    title: 'Evergreen Roadmap',
    nativeContent: initialContent,
    writePolicy: 'bidirectional_writeback',
    createdBy: 'pm@xgi.io',
    updatedBy: 'pm@xgi.io',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await createNode(env, federatedNode);

  // 1. Successful write-back when base hash matches
  const successResult = await handleWriteBack(
    env,
    {
      nodeGuid: 'node_notion_01',
      baseVersionHash: initialHash,
      changes: { content: 'Updated Notion Content by User' }
    },
    'tenant_eai_001',
    'pm@xgi.io',
    'user'
  );

  assert.ok(successResult.ok);
  assert.ok(successResult.newVersionHash);
  assert.notEqual(successResult.newVersionHash, initialHash);

  // 2. Conflict detected when someone attempts to write back with stale base hash
  const conflictResult = await handleWriteBack(
    env,
    {
      nodeGuid: 'node_notion_01',
      baseVersionHash: initialHash, // Stale!
      changes: { content: 'Conflicting edit from agent' }
    },
    'tenant_eai_001',
    'agent_claude',
    'agent'
  );

  assert.equal(conflictResult.ok, false);
  assert.ok(conflictResult.conflict);
  assert.equal(conflictResult.conflict.currentExternalHash, successResult.newVersionHash);
});

test('Search Service: returns nodes matching query terms', async () => {
  const db = createTestD1();
  const env: Env = { DB: db };

  await createNode(env, {
    guid: 'node_search_1',
    tenantGuid: 'tenant_eai_001',
    spaceGuid: 'space_eai_canon',
    type: 'markdown',
    title: 'Federation Architecture Brief',
    summary: 'Explains live projections without stale copying',
    writePolicy: 'bidirectional_writeback',
    createdBy: 'pm@xgi.io',
    updatedBy: 'pm@xgi.io',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const results = await searchFtsNodes(env, 'tenant_eai_001', 'Federation');
  assert.ok(results.length >= 1);
  assert.equal(results[0].title, 'Federation Architecture Brief');
});
