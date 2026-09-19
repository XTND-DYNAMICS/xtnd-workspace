import type { ConnectorDriver, ConnectorDiscoveryResult } from './base.js';
import { parseXDSHeader, parseXDSRegister, extractInternalLinks } from '@xtnd-dynamics/xds-runtime';

export class DropboxConnector implements ConnectorDriver {
  async testConnection(config: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> {
    if (!config.accessToken && !config.localPath) {
      return { ok: false, message: 'Missing access token or local path' };
    }
    return { ok: true, message: 'Connected to storage source' };
  }

  async discover(config: Record<string, unknown>): Promise<ConnectorDiscoveryResult> {
    const nodes: ConnectorDiscoveryResult['nodes'] = [];
    const relations: ConnectorDiscoveryResult['relations'] = [];

    // When sampleFiles is passed (e.g. from local scan or mock test)
    const files = (config.sampleFiles as Array<{ path: string; content: string }>) || [];

    for (const file of files) {
      const isXdsRegister = file.path.endsWith('DOCUMENT-REGISTER.md');
      const isMarkdown = file.path.endsWith('.md');

      if (isXdsRegister) {
        const entries = parseXDSRegister(file.content);
        nodes.push({
          externalId: file.path,
          type: 'document',
          title: 'Document Register',
          summary: `XDS Register with ${entries.length} registered documents`,
          writePolicy: 'bidirectional_writeback',
          nativeContent: file.content,
          metadata: { registerEntries: entries }
        });

        for (const entry of entries) {
          relations.push({
            fromExternalId: file.path,
            toExternalId: entry.path,
            relationType: 'references',
            origin: 'structural_derived',
            metadata: { registeredId: entry.id, status: entry.status }
          });
        }
      } else if (isMarkdown) {
        const header = parseXDSHeader(file.content);
        const internalLinks = extractInternalLinks(file.content);

        nodes.push({
          externalId: file.path,
          type: 'markdown',
          title: header.title || file.path.split('/').pop() || 'Untitled',
          summary: header.purpose || null,
          writePolicy: 'bidirectional_writeback',
          nativeContent: file.content,
          metadata: {
            xdsDocumentId: header.documentId,
            xdsVersion: header.version,
            author: header.author,
            status: header.status,
            organisation: header.organisation
          }
        });

        for (const link of internalLinks) {
          relations.push({
            fromExternalId: file.path,
            toExternalId: link.targetPath,
            relationType: 'references',
            origin: 'structural_derived',
            metadata: { anchorText: link.text, line: link.line }
          });
        }
      } else {
        nodes.push({
          externalId: file.path,
          type: 'file_asset',
          title: file.path.split('/').pop() || 'File',
          writePolicy: 'read_only',
          metadata: { assetPath: file.path }
        });
      }
    }

    return { nodes, relations };
  }

  async fetchLiveProjection(externalId: string, config: Record<string, unknown>): Promise<Record<string, unknown> | string> {
    return {
      type: 'dropbox_preview',
      externalId,
      renderedAt: new Date().toISOString()
    };
  }
}
