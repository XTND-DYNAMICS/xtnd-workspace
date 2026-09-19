/**
 * XWORKSPACE Core Domain Types
 * Conforming to XW-001 (Vision and Mission) and XW-002 (Design System Brief)
 */

export type TenantStatus = 'active' | 'suspended' | 'archived';

export interface Tenant {
  guid: string;
  slug: string;
  name: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  guid: string;
  tenantGuid: string;
  slug: string;
  name: string;
  isPrivate: boolean;
  createdAt: string;
}

export type SourceConnectorType = 'dropbox' | 'filesystem' | 'notion' | 'github' | 'database';

export type SourceStatus = 'active' | 'syncing' | 'degraded' | 'error';

export type WritePolicy = 'bidirectional_writeback' | 'read_only' | 'native_only';

export interface Source {
  guid: string;
  tenantGuid: string;
  spaceGuid: string;
  connectorType: SourceConnectorType;
  name: string;
  status: SourceStatus;
  writePolicy: WritePolicy;
  syncCursor?: string;
  lastSyncedAt?: string;
  config: Record<string, unknown>;
}

export type NodeType =
  | 'document'
  | 'markdown'
  | 'file_asset'
  | 'notion_page'
  | 'github_repo'
  | 'github_issue'
  | 'db_table'
  | 'db_record'
  | 'person'
  | 'decision'
  | 'task'
  | 'concept';

export interface Node {
  guid: string;
  tenantGuid: string;
  spaceGuid: string;
  sourceGuid?: string | null;
  externalId?: string | null;
  externalVersionHash?: string | null;
  type: NodeType;
  title: string;
  summary?: string | null;
  mimeType?: string | null;
  nativeContent?: string | null;
  metadata?: Record<string, unknown>;
  writePolicy: WritePolicy;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RelationType =
  | 'references'
  | 'contains'
  | 'implements'
  | 'derived_from'
  | 'authored_by'
  | 'documents'
  | 'blocks'
  | 'supersedes'
  | 'relates_to';

export type RelationOrigin = 'structural_derived' | 'user_asserted' | 'agent_asserted';

export interface Relation {
  guid: string;
  tenantGuid: string;
  fromNodeGuid: string;
  toNodeGuid: string;
  relationType: RelationType;
  origin: RelationOrigin;
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
}

export type OverlayType = 'annotation' | 'tag' | 'semantic_label' | 'relation_anchor';

export interface Overlay {
  guid: string;
  tenantGuid: string;
  nodeGuid: string;
  overlayType: OverlayType;
  content: Record<string, unknown>;
  authorGuid: string;
  createdAt: string;
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'relation_add'
  | 'relation_remove'
  | 'writeback_success'
  | 'writeback_conflict';

export interface AuditLog {
  guid: string;
  tenantGuid: string;
  nodeGuid?: string | null;
  actorGuid: string;
  actorType: 'user' | 'agent' | 'system_sync';
  action: AuditAction;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  createdAt: string;
}

export interface Session {
  subject: string;
  email: string;
  roles: string[];
  canWrite: boolean;
  tenantId: string;
  contractVersion: string;
}

export interface LiveProjection {
  nodeGuid: string;
  sourceGuid: string;
  externalId: string;
  contentType: string;
  versionHash: string;
  data: Record<string, unknown> | string;
  renderedAt: string;
  isStale: boolean;
}

export interface WriteBackPayload {
  nodeGuid: string;
  baseVersionHash: string;
  changes: {
    content?: string;
    properties?: Record<string, unknown>;
    title?: string;
  };
}

export interface WriteBackResult {
  ok: boolean;
  newVersionHash?: string;
  conflict?: {
    currentExternalHash: string;
    message: string;
  };
  error?: string;
}
