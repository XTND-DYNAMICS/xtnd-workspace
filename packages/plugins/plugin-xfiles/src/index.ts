import type { Node, Relation } from '@xtnd-dynamics/xworkspace-core';

export interface XFilesDocumentRecord {
  guid: string;
  xds_id?: string;
  version: string;
  title: string;
  purpose?: string;
  author: string;
  status: string;
  raw_markdown: string;
  path: string;
  updated_at: string;
}

export interface XFilesRegisterRecord {
  guid: string;
  title: string;
  path: string;
  entries: Array<{
    id: string;
    document: string;
    path: string;
    purpose: string;
    status: string;
    owner?: string;
  }>;
}

export class XFilesPlugin {
  static readonly SOURCE_NAME = 'XFILES';

  mapDocumentToNode(doc: XFilesDocumentRecord, tenantGuid = 'tenant_eai_001', spaceGuid = 'space_eai_canon'): Node {
    return {
      guid: `xfiles_${doc.guid}`,
      tenantGuid,
      spaceGuid,
      sourceGuid: 'source_xfiles_canon',
      externalId: doc.path,
      externalVersionHash: doc.version,
      type: 'markdown',
      title: doc.title,
      summary: doc.purpose || `Canonical document under XDS (${doc.xds_id || 'unversioned'})`,
      nativeContent: doc.raw_markdown,
      metadata: {
        xdsId: doc.xds_id,
        version: doc.version,
        status: doc.status,
        author: doc.author,
        sourcePlatform: XFilesPlugin.SOURCE_NAME
      },
      writePolicy: 'bidirectional_writeback',
      createdBy: doc.author,
      updatedBy: doc.author,
      createdAt: doc.updated_at,
      updatedAt: doc.updated_at
    };
  }

  mapRegisterToGraph(register: XFilesRegisterRecord, tenantGuid = 'tenant_eai_001'): { registerNode: Node; relations: Relation[] } {
    const registerNode: Node = {
      guid: `xfiles_reg_${register.guid}`,
      tenantGuid,
      spaceGuid: 'space_eai_canon',
      sourceGuid: 'source_xfiles_canon',
      externalId: register.path,
      type: 'document',
      title: register.title,
      summary: `XDS Document Register with ${register.entries.length} entries`,
      writePolicy: 'bidirectional_writeback',
      createdBy: 'XFILES',
      updatedBy: 'XFILES',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const relations: Relation[] = register.entries.map(entry => ({
      guid: crypto.randomUUID(),
      tenantGuid,
      fromNodeGuid: registerNode.guid,
      toNodeGuid: `xfiles_${entry.id}`,
      relationType: 'references',
      origin: 'structural_derived',
      metadata: { registeredId: entry.id, status: entry.status },
      createdBy: 'XFILES',
      createdAt: new Date().toISOString()
    }));

    return { registerNode, relations };
  }

  renderRegisterProjection(register: XFilesRegisterRecord): string {
    const rows = register.entries.map(e => `
      <tr>
        <td><code>${e.id}</code></td>
        <td><strong>${e.document}</strong></td>
        <td><code>${e.path}</code></td>
        <td><span class="tenant-badge">${e.status}</span></td>
      </tr>
    `).join('');

    return `
      <div class="projected-card xfiles-register" role="region" aria-label="XDS Document Register from XFILES">
        <div class="projected-card-header">
          <span>${register.title}</span>
          <span class="provenance-badge">XFILES · XDS Canon</span>
        </div>
        <table class="projected-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Document</th>
              <th>Path</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }
}
