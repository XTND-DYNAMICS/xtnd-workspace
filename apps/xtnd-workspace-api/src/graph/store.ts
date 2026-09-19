import type { Node, Relation, AuditLog } from '@xtnd-dynamics/xworkspace-core';
import type { Env } from '../env.js';

export async function createNode(env: Env, node: Node): Promise<Node> {
  const query = `
    INSERT INTO nodes (
      guid, tenant_guid, space_guid, source_guid, external_id, external_version_hash,
      type, title, summary, mime_type, native_content, metadata, write_policy,
      created_by, updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await env.DB.prepare(query)
    .bind(
      node.guid,
      node.tenantGuid,
      node.spaceGuid,
      node.sourceGuid || null,
      node.externalId || null,
      node.externalVersionHash || null,
      node.type,
      node.title,
      node.summary || null,
      node.mimeType || null,
      node.nativeContent || null,
      JSON.stringify(node.metadata || {}),
      node.writePolicy,
      node.createdBy,
      node.updatedBy,
      node.createdAt,
      node.updatedAt
    )
    .run();
  return node;
}

export async function getNode(env: Env, guid: string, tenantGuid: string): Promise<Node | null> {
  const query = `SELECT * FROM nodes WHERE guid = ? AND tenant_guid = ?`;
  const row = await env.DB.prepare(query).bind(guid, tenantGuid).first<any>();
  if (!row) return null;
  return mapNodeRow(row);
}

export async function updateNode(
  env: Env,
  guid: string,
  tenantGuid: string,
  updates: Partial<Node>
): Promise<Node | null> {
  const existing = await getNode(env, guid, tenantGuid);
  if (!existing) return null;

  const title = updates.title ?? existing.title;
  const summary = updates.summary !== undefined ? updates.summary : existing.summary;
  const nativeContent = updates.nativeContent !== undefined ? updates.nativeContent : existing.nativeContent;
  const externalVersionHash = updates.externalVersionHash !== undefined ? updates.externalVersionHash : existing.externalVersionHash;
  const metadata = updates.metadata ? JSON.stringify(updates.metadata) : JSON.stringify(existing.metadata || {});
  const updatedBy = updates.updatedBy ?? existing.updatedBy;
  const updatedAt = new Date().toISOString();

  const query = `
    UPDATE nodes SET
      title = ?, summary = ?, native_content = ?, external_version_hash = ?,
      metadata = ?, updated_by = ?, updated_at = ?
    WHERE guid = ? AND tenant_guid = ?
  `;
  await env.DB.prepare(query)
    .bind(title, summary, nativeContent, externalVersionHash, metadata, updatedBy, updatedAt, guid, tenantGuid)
    .run();

  return getNode(env, guid, tenantGuid);
}

export async function deleteNode(env: Env, guid: string, tenantGuid: string): Promise<boolean> {
  const query = `DELETE FROM nodes WHERE guid = ? AND tenant_guid = ?`;
  const result = await env.DB.prepare(query).bind(guid, tenantGuid).run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function listNodes(
  env: Env,
  tenantGuid: string,
  options: { spaceGuid?: string; sourceGuid?: string; type?: string; limit?: number; offset?: number } = {}
): Promise<Node[]> {
  let query = `SELECT * FROM nodes WHERE tenant_guid = ?`;
  const params: any[] = [tenantGuid];

  if (options.spaceGuid) {
    query += ` AND space_guid = ?`;
    params.push(options.spaceGuid);
  }
  if (options.sourceGuid) {
    query += ` AND source_guid = ?`;
    params.push(options.sourceGuid);
  }
  if (options.type) {
    query += ` AND type = ?`;
    params.push(options.type);
  }

  query += ` ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
  params.push(options.limit ?? 50, options.offset ?? 0);

  const { results } = await env.DB.prepare(query).bind(...params).all<any>();
  return (results || []).map(mapNodeRow);
}

export async function createRelation(env: Env, relation: Relation): Promise<Relation> {
  const query = `
    INSERT INTO relations (
      guid, tenant_guid, from_node_guid, to_node_guid, relation_type, origin, metadata, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await env.DB.prepare(query)
    .bind(
      relation.guid,
      relation.tenantGuid,
      relation.fromNodeGuid,
      relation.toNodeGuid,
      relation.relationType,
      relation.origin,
      JSON.stringify(relation.metadata || {}),
      relation.createdBy,
      relation.createdAt
    )
    .run();
  return relation;
}

export async function deleteRelation(env: Env, guid: string, tenantGuid: string): Promise<boolean> {
  const query = `DELETE FROM relations WHERE guid = ? AND tenant_guid = ?`;
  const result = await env.DB.prepare(query).bind(guid, tenantGuid).run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function getNodeRelations(
  env: Env,
  nodeGuid: string,
  tenantGuid: string
): Promise<{ outgoing: Array<Relation & { targetNode: Node }>; incoming: Array<Relation & { sourceNode: Node }> }> {
  // Outgoing relations
  const outQuery = `
    SELECT r.*, n.title as target_title, n.type as target_type, n.write_policy as target_write_policy
    FROM relations r
    JOIN nodes n ON r.to_node_guid = n.guid
    WHERE r.from_node_guid = ? AND r.tenant_guid = ?
  `;
  const { results: outResults } = await env.DB.prepare(outQuery).bind(nodeGuid, tenantGuid).all<any>();

  // Incoming relations
  const inQuery = `
    SELECT r.*, n.title as source_title, n.type as source_type, n.write_policy as source_write_policy
    FROM relations r
    JOIN nodes n ON r.from_node_guid = n.guid
    WHERE r.to_node_guid = ? AND r.tenant_guid = ?
  `;
  const { results: inResults } = await env.DB.prepare(inQuery).bind(nodeGuid, tenantGuid).all<any>();

  const outgoing = (outResults || []).map(r => ({
    ...mapRelationRow(r),
    targetNode: {
      guid: r.to_node_guid,
      tenantGuid: r.tenant_guid,
      spaceGuid: '',
      type: r.target_type,
      title: r.target_title,
      writePolicy: r.target_write_policy,
      createdBy: '',
      updatedBy: '',
      createdAt: '',
      updatedAt: ''
    } as Node
  }));

  const incoming = (inResults || []).map(r => ({
    ...mapRelationRow(r),
    sourceNode: {
      guid: r.from_node_guid,
      tenantGuid: r.tenant_guid,
      spaceGuid: '',
      type: r.source_type,
      title: r.source_title,
      writePolicy: r.source_write_policy,
      createdBy: '',
      updatedBy: '',
      createdAt: '',
      updatedAt: ''
    } as Node
  }));

  return { outgoing, incoming };
}

export async function queryGraphTraversal(
  env: Env,
  startNodeGuid: string,
  tenantGuid: string,
  maxDepth = 2
): Promise<{ nodes: Node[]; relations: Relation[] }> {
  const visitedNodeIds = new Set<string>([startNodeGuid]);
  const collectedNodes: Node[] = [];
  const collectedRelations: Relation[] = [];

  let currentLevelIds = [startNodeGuid];

  const root = await getNode(env, startNodeGuid, tenantGuid);
  if (root) collectedNodes.push(root);

  for (let depth = 0; depth < maxDepth; depth++) {
    if (currentLevelIds.length === 0) break;

    const placeholders = currentLevelIds.map(() => '?').join(',');
    const query = `
      SELECT * FROM relations
      WHERE tenant_guid = ? AND (from_node_guid IN (${placeholders}) OR to_node_guid IN (${placeholders}))
    `;
    const params = [tenantGuid, ...currentLevelIds, ...currentLevelIds];
    const { results } = await env.DB.prepare(query).bind(...params).all<any>();

    const nextLevelIds: string[] = [];
    for (const r of results || []) {
      const rel = mapRelationRow(r);
      if (!collectedRelations.some(cr => cr.guid === rel.guid)) {
        collectedRelations.push(rel);
      }

      for (const targetId of [rel.fromNodeGuid, rel.toNodeGuid]) {
        if (!visitedNodeIds.has(targetId)) {
          visitedNodeIds.add(targetId);
          nextLevelIds.push(targetId);
          const node = await getNode(env, targetId, tenantGuid);
          if (node) collectedNodes.push(node);
        }
      }
    }
    currentLevelIds = nextLevelIds;
  }

  return { nodes: collectedNodes, relations: collectedRelations };
}

export async function searchFtsNodes(
  env: Env,
  tenantGuid: string,
  searchQuery: string,
  limit = 20
): Promise<Array<Node & { snippet: string }>> {
  const cleanQuery = searchQuery.replace(/[^\w\s]/g, ' ').trim();
  if (!cleanQuery) return [];

  // Match words with prefix wildcard
  const formattedQuery = cleanQuery.split(/\s+/).map(w => `${w}*`).join(' ');

  const sql = `
    SELECT n.*, snippet(fts_nodes, 4, '<mark>', '</mark>', '...', 15) as snippet
    FROM fts_nodes f
    JOIN nodes n ON f.node_guid = n.guid
    WHERE fts_nodes MATCH ? AND f.tenant_guid = ?
    ORDER BY rank
    LIMIT ?
  `;

  try {
    const { results } = await env.DB.prepare(sql).bind(formattedQuery, tenantGuid, limit).all<any>();
    return (results || []).map(r => ({
      ...mapNodeRow(r),
      snippet: r.snippet || ''
    }));
  } catch {
    // Fallback to LIKE query if FTS syntax error
    const fallbackSql = `
      SELECT *, title as snippet FROM nodes
      WHERE tenant_guid = ? AND (title LIKE ? OR summary LIKE ?)
      LIMIT ?
    `;
    const { results } = await env.DB.prepare(fallbackSql).bind(tenantGuid, `%${cleanQuery}%`, `%${cleanQuery}%`, limit).all<any>();
    return (results || []).map(r => ({
      ...mapNodeRow(r),
      snippet: r.snippet || ''
    }));
  }
}

export async function recordAudit(env: Env, audit: AuditLog): Promise<void> {
  const query = `
    INSERT INTO audit_log (
      guid, tenant_guid, node_guid, actor_guid, actor_type, action, previous_state, new_state, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await env.DB.prepare(query)
    .bind(
      audit.guid,
      audit.tenantGuid,
      audit.nodeGuid || null,
      audit.actorGuid,
      audit.actorType,
      audit.action,
      audit.previousState ? JSON.stringify(audit.previousState) : null,
      audit.newState ? JSON.stringify(audit.newState) : null,
      audit.createdAt
    )
    .run();
}

function mapNodeRow(r: any): Node {
  return {
    guid: r.guid,
    tenantGuid: r.tenant_guid,
    spaceGuid: r.space_guid,
    sourceGuid: r.source_guid,
    externalId: r.external_id,
    externalVersionHash: r.external_version_hash,
    type: r.type,
    title: r.title,
    summary: r.summary,
    mimeType: r.mime_type,
    nativeContent: r.native_content,
    metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata || {},
    writePolicy: r.write_policy,
    createdBy: r.created_by,
    updatedBy: r.updated_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function mapRelationRow(r: any): Relation {
  return {
    guid: r.guid,
    tenantGuid: r.tenant_guid,
    fromNodeGuid: r.from_node_guid,
    toNodeGuid: r.to_node_guid,
    relationType: r.relation_type,
    origin: r.origin,
    metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata || {},
    createdBy: r.created_by,
    createdAt: r.created_at
  };
}
