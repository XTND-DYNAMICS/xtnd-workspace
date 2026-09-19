import type { Node, Relation } from '@xtnd-dynamics/xworkspace-core';

export interface ComposedDocumentModel {
  node: Node;
  outgoingRelations: Array<Relation & { targetNode: Node }>;
  incomingRelations: Array<Relation & { sourceNode: Node }>;
  projections?: Array<{
    type: 'live_table' | 'notion_block' | 'file_asset';
    title: string;
    sourceName: string;
    writePolicy: 'bidirectional_writeback' | 'read_only';
    data: any;
  }>;
}

export function renderCompositionCanvas(model: ComposedDocumentModel): string {
  const { node, outgoingRelations, incomingRelations, projections } = model;

  // Q-13 Quiet Provenance Signal
  const sourceName = node.sourceGuid ? 'Dropbox · EAI Canon' : 'Native Platform Document';
  const provenanceIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`;

  // Q-14 Write Policy Dual Signal (Icon + Label + Styling)
  const isWriteback = node.writePolicy === 'bidirectional_writeback';
  const policyClass = isWriteback ? 'writeback' : 'readonly';
  const policyIcon = isWriteback
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
  const policyLabel = isWriteback ? 'Write-back enabled' : 'Read-only source';

  // Format relations
  const relationChips = outgoingRelations.map(rel => `
    <a href="/?node=${rel.toNodeGuid}" class="relation-chip" title="${rel.relationType} -> ${rel.targetNode.title}">
      <span style="color: var(--text-muted); font-size: 10px;">${rel.relationType}</span>
      <strong>${rel.targetNode.title}</strong>
    </a>
  `).join('');

  // Format projected data blocks (Q-15)
  const projectedBlocksHtml = (projections || []).map(p => {
    if (p.type === 'live_table') {
      const rows = Array.isArray(p.data.rows) ? p.data.rows : [];
      return `
        <div class="projected-card" role="region" aria-label="Projected Live Data Table">
          <div class="projected-card-header">
            <span>${p.title} (${p.sourceName})</span>
            <span class="policy-badge ${p.writePolicy === 'bidirectional_writeback' ? 'writeback' : 'readonly'}">
              ${p.writePolicy === 'bidirectional_writeback' ? 'Live Editable' : 'Live Read-Only'}
            </span>
          </div>
          <table class="projected-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Status</th>
                <th>Metric / Value</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((r: any) => `
                <tr>
                  <td><code>${r.id}</code></td>
                  <td><span class="tenant-badge">${r.status}</span></td>
                  <td>${r.metric}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    return '';
  }).join('');

  return `
    <article class="document-sheet">
      <header class="document-header">
        <h1 class="document-title">${node.title}</h1>
        <div class="document-meta-bar">
          <!-- Q-13 Quiet Provenance Badge -->
          <div class="provenance-badge" title="Origin Source: ${sourceName}">
            ${provenanceIcon}
            <span>${sourceName}</span>
          </div>

          <!-- Q-14 Write Policy Dual Signal -->
          <div class="policy-badge ${policyClass}" title="${policyLabel}">
            ${policyIcon}
            <span>${policyLabel}</span>
          </div>

          <span class="tenant-badge" style="margin-left: auto;">Type: ${node.type}</span>
        </div>

        ${relationChips.length > 0 ? `
          <div class="relation-chip-list">
            ${relationChips}
          </div>
        ` : ''}
      </header>

      <section class="document-content">
        <div class="markdown-body" style="white-space: pre-wrap; line-height: 1.6;">
${node.nativeContent || node.summary || 'No document content available.'}
        </div>

        <!-- Live Third-Party Data Projections (Q-15) -->
        ${projectedBlocksHtml}
      </section>
    </article>
  `;
}
