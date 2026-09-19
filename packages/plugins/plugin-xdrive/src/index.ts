import type { Node } from '@xtnd-dynamics/xworkspace-core';

export interface XDriveFileRecord {
  guid: string;
  volume_guid: string;
  name: string;
  path: string;
  size_bytes: number;
  mime_type: string;
  r2_key?: string;
  version: number;
  created_by: string;
  updated_at: string;
}

export class XDrivePlugin {
  static readonly SOURCE_NAME = 'XDRIVE';

  mapFileToNode(file: XDriveFileRecord, tenantGuid = 'tenant_eai_001', spaceGuid = 'space_eai_canon'): Node {
    return {
      guid: `xdrive_${file.guid}`,
      tenantGuid,
      spaceGuid,
      sourceGuid: `source_xdrive_${file.volume_guid}`,
      externalId: file.path,
      externalVersionHash: `v${file.version}`,
      type: 'file_asset',
      title: file.name,
      summary: `Storage Asset in XDRIVE (${(file.size_bytes / 1024).toFixed(1)} KB)`,
      mimeType: file.mime_type,
      metadata: {
        r2Key: file.r2_key,
        volumeGuid: file.volume_guid,
        sizeBytes: file.size_bytes,
        sourcePlatform: XDrivePlugin.SOURCE_NAME
      },
      writePolicy: 'read_only',
      createdBy: file.created_by,
      updatedBy: file.created_by,
      createdAt: file.updated_at,
      updatedAt: file.updated_at
    };
  }

  renderFileProjection(file: XDriveFileRecord): string {
    return `
      <div class="projected-card xdrive-asset" role="region" aria-label="XDRIVE Storage Asset">
        <div class="projected-card-header">
          <span>${file.name}</span>
          <span class="provenance-badge">XDRIVE · R2 Storage</span>
        </div>
        <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 13px; color: var(--text-muted);">${file.mime_type} · ${(file.size_bytes / 1024).toFixed(1)} KB</span>
          <a href="https://drive.xgi.io/files/${file.guid}" class="tenant-badge" target="_blank" rel="noopener">Open in XDRIVE ↗</a>
        </div>
      </div>
    `;
  }
}
