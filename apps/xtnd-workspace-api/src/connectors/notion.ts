import type { ConnectorDriver, ConnectorDiscoveryResult } from './base.js';

export class NotionConnector implements ConnectorDriver {
  async testConnection(config: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> {
    if (!config.apiKey) {
      return { ok: false, message: 'Missing Notion API Key' };
    }
    return { ok: true, message: 'Notion integration active' };
  }

  async discover(config: Record<string, unknown>): Promise<ConnectorDiscoveryResult> {
    const nodes: ConnectorDiscoveryResult['nodes'] = [];
    const relations: ConnectorDiscoveryResult['relations'] = [];

    const mockPages = (config.samplePages as Array<{ id: string; title: string; parentId?: string; isDatabase?: boolean }>) || [];

    for (const page of mockPages) {
      nodes.push({
        externalId: page.id,
        type: page.isDatabase ? 'db_table' : 'notion_page',
        title: page.title,
        writePolicy: 'bidirectional_writeback',
        metadata: { notionId: page.id, isDatabase: !!page.isDatabase }
      });

      if (page.parentId) {
        relations.push({
          fromExternalId: page.parentId,
          toExternalId: page.id,
          relationType: 'contains',
          origin: 'structural_derived'
        });
      }
    }

    return { nodes, relations };
  }

  async fetchLiveProjection(externalId: string, config: Record<string, unknown>): Promise<Record<string, unknown>> {
    return {
      type: 'notion_live_projection',
      pageId: externalId,
      status: 'synced',
      syncedAt: new Date().toISOString()
    };
  }
}
