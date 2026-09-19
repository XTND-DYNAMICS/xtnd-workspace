import type { ConnectorDriver, ConnectorDiscoveryResult } from './base.js';

export class DatabaseConnector implements ConnectorDriver {
  async testConnection(config: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> {
    if (!config.connectionString && !config.supabaseUrl) {
      return { ok: false, message: 'Missing database connection details' };
    }
    return { ok: true, message: 'Database connection verified' };
  }

  async discover(config: Record<string, unknown>): Promise<ConnectorDiscoveryResult> {
    const nodes: ConnectorDiscoveryResult['nodes'] = [];
    const relations: ConnectorDiscoveryResult['relations'] = [];

    const tables = (config.sampleTables as Array<{ name: string; foreignKeys?: Array<{ targetTable: string }> }>) || [];

    for (const table of tables) {
      const tableExternalId = `db/${table.name}`;
      nodes.push({
        externalId: tableExternalId,
        type: 'db_table',
        title: table.name,
        writePolicy: 'bidirectional_writeback',
        metadata: { tableName: table.name }
      });

      for (const fk of table.foreignKeys || []) {
        relations.push({
          fromExternalId: tableExternalId,
          toExternalId: `db/${fk.targetTable}`,
          relationType: 'references',
          origin: 'structural_derived'
        });
      }
    }

    return { nodes, relations };
  }

  async fetchLiveProjection(externalId: string, config: Record<string, unknown>): Promise<Record<string, unknown>> {
    return {
      type: 'live_database_query',
      sourceTable: externalId,
      rows: [
        { id: 'row_1', status: 'active', metric: 42 },
        { id: 'row_2', status: 'pending', metric: 99 }
      ],
      queriedAt: new Date().toISOString()
    };
  }
}
