import type { Node, Relation, WriteBackPayload } from '@xtnd-dynamics/xworkspace-core';
import type { Env } from './env.ts';
import { verifyToken } from './auth/jwt.ts';
import {
  createNode,
  getNode,
  updateNode,
  deleteNode,
  listNodes,
  createRelation,
  deleteRelation,
  getNodeRelations,
  queryGraphTraversal,
  searchFtsNodes,
  recordAudit
} from './graph/store.ts';
import { handleWriteBack } from './writeback/concurrency.ts';

function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders
    }
  });
}

function handleCors(request: Request, env: Env): Headers {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.CORS_ORIGINS || 'https://workspace.xgi.io')
    .split(',')
    .map(s => s.trim());
  
  const headers = new Headers();
  if (allowed.includes(origin) || allowed.includes('*') || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  return headers;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = handleCors(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health') {
      return json({ status: 'ok', service: 'xworkspace-api', timestamp: new Date().toISOString() }, 200, corsHeaders);
    }

    // Authenticate all /api routes
    let session;
    try {
      session = await verifyToken(request.headers.get('Authorization'), env);
    } catch (err: any) {
      return json({ error: err.message || 'Unauthorized' }, 401, corsHeaders);
    }

    const tenantGuid = session.tenantId;

    try {
      // GET /api/session
      if (path === '/api/session' && request.method === 'GET') {
        return json(session, 200, corsHeaders);
      }

      // GET /api/nodes
      if (path === '/api/nodes' && request.method === 'GET') {
        const spaceGuid = url.searchParams.get('space') || undefined;
        const sourceGuid = url.searchParams.get('source') || undefined;
        const type = url.searchParams.get('type') || undefined;
        const limit = Number(url.searchParams.get('limit')) || 50;
        const offset = Number(url.searchParams.get('offset')) || 0;

        const nodes = await listNodes(env, tenantGuid, { spaceGuid, sourceGuid, type, limit, offset });
        return json({ nodes }, 200, corsHeaders);
      }

      // POST /api/nodes
      if (path === '/api/nodes' && request.method === 'POST') {
        if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
        const body = (await request.json()) as Partial<Node>;
        if (!body.title || !body.type) {
          return json({ error: 'Title and type are required' }, 400, corsHeaders);
        }

        const now = new Date().toISOString();
        const newNode: Node = {
          guid: body.guid || crypto.randomUUID(),
          tenantGuid,
          spaceGuid: body.spaceGuid || 'space_eai_canon',
          sourceGuid: body.sourceGuid || null,
          externalId: body.externalId || null,
          externalVersionHash: body.externalVersionHash || null,
          type: body.type,
          title: body.title,
          summary: body.summary || null,
          mimeType: body.mimeType || null,
          nativeContent: body.nativeContent || null,
          metadata: body.metadata || {},
          writePolicy: body.writePolicy || 'native_only',
          createdBy: session.email,
          updatedBy: session.email,
          createdAt: now,
          updatedAt: now
        };

        const created = await createNode(env, newNode);
        await recordAudit(env, {
          guid: crypto.randomUUID(),
          tenantGuid,
          nodeGuid: created.guid,
          actorGuid: session.email,
          actorType: 'user',
          action: 'create',
          newState: created as unknown as Record<string, unknown>,
          createdAt: now
        });

        return json(created, 201, corsHeaders);
      }

      // GET /api/nodes/:id
      const nodeMatch = path.match(/^\/api\/nodes\/([^/]+)$/);
      if (nodeMatch) {
        const nodeId = decodeURIComponent(nodeMatch[1]);

        if (request.method === 'GET') {
          const node = await getNode(env, nodeId, tenantGuid);
          if (!node) return json({ error: 'Node not found' }, 404, corsHeaders);
          return json(node, 200, corsHeaders);
        }

        if (request.method === 'PUT') {
          if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
          const body = (await request.json()) as Partial<Node>;
          const updated = await updateNode(env, nodeId, tenantGuid, {
            ...body,
            updatedBy: session.email
          });
          if (!updated) return json({ error: 'Node not found' }, 404, corsHeaders);
          return json(updated, 200, corsHeaders);
        }

        if (request.method === 'DELETE') {
          if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
          const success = await deleteNode(env, nodeId, tenantGuid);
          if (!success) return json({ error: 'Node not found' }, 404, corsHeaders);
          return json({ ok: true }, 200, corsHeaders);
        }
      }

      // GET /api/nodes/:id/relations
      const nodeRelationsMatch = path.match(/^\/api\/nodes\/([^/]+)\/relations$/);
      if (nodeRelationsMatch && request.method === 'GET') {
        const nodeId = decodeURIComponent(nodeRelationsMatch[1]);
        const relations = await getNodeRelations(env, nodeId, tenantGuid);
        return json(relations, 200, corsHeaders);
      }

      // POST /api/relations
      if (path === '/api/relations' && request.method === 'POST') {
        if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
        const body = (await request.json()) as Partial<Relation>;
        if (!body.fromNodeGuid || !body.toNodeGuid || !body.relationType) {
          return json({ error: 'fromNodeGuid, toNodeGuid, and relationType are required' }, 400, corsHeaders);
        }

        const relation: Relation = {
          guid: body.guid || crypto.randomUUID(),
          tenantGuid,
          fromNodeGuid: body.fromNodeGuid,
          toNodeGuid: body.toNodeGuid,
          relationType: body.relationType,
          origin: body.origin || 'user_asserted',
          metadata: body.metadata || {},
          createdBy: session.email,
          createdAt: new Date().toISOString()
        };

        const created = await createRelation(env, relation);
        return json(created, 201, corsHeaders);
      }

      // DELETE /api/relations/:id
      const relationMatch = path.match(/^\/api\/relations\/([^/]+)$/);
      if (relationMatch && request.method === 'DELETE') {
        if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
        const relId = decodeURIComponent(relationMatch[1]);
        const deleted = await deleteRelation(env, relId, tenantGuid);
        return json({ ok: deleted }, 200, corsHeaders);
      }

      // GET /api/graph/traverse
      if (path === '/api/graph/traverse' && request.method === 'GET') {
        const startNode = url.searchParams.get('start');
        const depth = Number(url.searchParams.get('depth')) || 2;
        if (!startNode) return json({ error: 'start parameter required' }, 400, corsHeaders);

        const subgraph = await queryGraphTraversal(env, startNode, tenantGuid, depth);
        return json(subgraph, 200, corsHeaders);
      }

      // GET /api/search
      if (path === '/api/search' && request.method === 'GET') {
        const q = url.searchParams.get('q') || '';
        const limit = Number(url.searchParams.get('limit')) || 20;
        const results = await searchFtsNodes(env, tenantGuid, q, limit);
        return json({ results }, 200, corsHeaders);
      }

      // POST /api/writeback
      if (path === '/api/writeback' && request.method === 'POST') {
        if (!session.canWrite) return json({ error: 'Write permission required' }, 403, corsHeaders);
        const body = (await request.json()) as WriteBackPayload;
        const result = await handleWriteBack(env, body, tenantGuid, session.email, 'user');
        if (!result.ok && result.conflict) {
          return json(result, 409, corsHeaders);
        }
        return json(result, 200, corsHeaders);
      }

      return json({ error: 'Not Found' }, 404, corsHeaders);
    } catch (err: any) {
      return json({ error: err.message || 'Internal Server Error' }, 500, corsHeaders);
    }
  }
};
