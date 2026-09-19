import type { Node, WriteBackPayload, WriteBackResult, AuditLog } from '@xtnd-dynamics/xworkspace-core';
import type { Env } from '../env.ts';
import { getNode, updateNode, recordAudit } from '../graph/store.ts';

export async function computeHash(content: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function handleWriteBack(
  env: Env,
  payload: WriteBackPayload,
  tenantGuid: string,
  actorGuid: string,
  actorType: 'user' | 'agent'
): Promise<WriteBackResult> {
  const node = await getNode(env, payload.nodeGuid, tenantGuid);
  if (!node) {
    return { ok: false, error: 'Node not found' };
  }

  if (node.writePolicy === 'read_only') {
    return { ok: false, error: 'Node is marked read-only. Edits cannot be written back.' };
  }

  // Optimistic concurrency control check
  if (node.externalVersionHash && node.externalVersionHash !== payload.baseVersionHash) {
    const audit: AuditLog = {
      guid: crypto.randomUUID(),
      tenantGuid,
      nodeGuid: node.guid,
      actorGuid,
      actorType,
      action: 'writeback_conflict',
      previousState: { versionHash: node.externalVersionHash },
      newState: { attemptedBaseHash: payload.baseVersionHash },
      createdAt: new Date().toISOString()
    };
    await recordAudit(env, audit);

    return {
      ok: false,
      conflict: {
        currentExternalHash: node.externalVersionHash,
        message: 'The node has been modified externally since you loaded it. Please resolve conflicts.'
      }
    };
  }

  const nextContent = payload.changes.content ?? node.nativeContent ?? '';
  const newHash = await computeHash(nextContent);

  const updatedNode = await updateNode(env, node.guid, tenantGuid, {
    title: payload.changes.title ?? node.title,
    nativeContent: nextContent,
    externalVersionHash: newHash,
    metadata: {
      ...(node.metadata || {}),
      ...(payload.changes.properties || {})
    },
    updatedBy: actorGuid
  });

  const audit: AuditLog = {
    guid: crypto.randomUUID(),
    tenantGuid,
    nodeGuid: node.guid,
    actorGuid,
    actorType,
    action: 'writeback_success',
    previousState: { versionHash: node.externalVersionHash, title: node.title },
    newState: { versionHash: newHash, title: updatedNode?.title },
    createdAt: new Date().toISOString()
  };
  await recordAudit(env, audit);

  return {
    ok: true,
    newVersionHash: newHash
  };
}
