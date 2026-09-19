import type { Node, Relation } from '@xtnd-dynamics/xworkspace-core';

export interface ConnectorDiscoveryResult {
  nodes: Array<Omit<Node, 'guid' | 'tenantGuid' | 'spaceGuid' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>>;
  relations: Array<{
    fromExternalId: string;
    toExternalId: string;
    relationType: Relation['relationType'];
    origin: Relation['origin'];
    metadata?: Record<string, unknown>;
  }>;
}

export interface ConnectorDriver {
  testConnection(config: Record<string, unknown>): Promise<{ ok: boolean; message?: string }>;
  discover(config: Record<string, unknown>): Promise<ConnectorDiscoveryResult>;
  fetchLiveProjection(externalId: string, config: Record<string, unknown>): Promise<Record<string, unknown> | string>;
}
