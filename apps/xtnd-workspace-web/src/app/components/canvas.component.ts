import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { WorkspaceTab } from './sidebar.component';

@Component({
  selector: 'app-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="canvas-layout" role="main">
      <!-- Left Panel: Context Navigator -->
      <section class="explorer-pane" aria-label="Explorer Pane">
        <div class="pane-header">
          @switch (activeTab()) {
            @case ('canon') {
              <div class="pane-title">CANONICAL KNOWLEDGE</div>
              <span class="count-badge">4 Docs</span>
            }
            @case ('drive') {
              <div class="pane-title">XDRIVE VOLUMES</div>
              <span class="count-badge">3 Mounted</span>
            }
            @case ('files') {
              <div class="pane-title">XFILES DOCUMENT REGISTER</div>
              <span class="count-badge">XDS v0.1.0</span>
            }
            @case ('graph') {
              <div class="pane-title">ENTITY GRAPH EDGES</div>
              <span class="count-badge">12 Nodes</span>
            }
          }
        </div>

        <div class="pane-content">
          @if (activeTab() === 'canon' || activeTab() === 'files') {
            <div class="item-list">
              <div class="item-card active">
                <div class="item-header">
                  <span class="item-id">XW-001</span>
                  <span class="status-chip approved">Approved</span>
                </div>
                <div class="item-title">XWORKSPACE Vision and Mission</div>
                <div class="item-meta">v0.1.0 · Foundation · Peter A. Moelgaard</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">XW-002</span>
                  <span class="status-chip draft">Drafting</span>
                </div>
                <div class="item-title">XWORKSPACE Design System Brief</div>
                <div class="item-meta">v0.2.0 · Design · Google Ergonomics</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">XW-003</span>
                  <span class="status-chip approved">Approved</span>
                </div>
                <div class="item-title">XFILES Design System Brief</div>
                <div class="item-meta">v0.1.0 · Deep Sapphire Blue (#13328C)</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">XW-004</span>
                  <span class="status-chip approved">Approved</span>
                </div>
                <div class="item-title">XDRIVE Design System Brief</div>
                <div class="item-meta">v0.1.0 · Deep Obsidian Navy (#0A1B44)</div>
              </div>
            </div>
          } @else if (activeTab() === 'drive') {
            <div class="item-list">
              <div class="item-card active">
                <div class="item-header">
                  <span class="item-id">vdrive_workspace_core</span>
                  <span class="status-chip ok">R2 Zero Egress</span>
                </div>
                <div class="item-title">System Runtime Volume</div>
                <div class="item-meta">14.2 GB · Mount: /volumes/core</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">vdrive_shared_design</span>
                  <span class="status-chip ok">Dropbox Mirror</span>
                </div>
                <div class="item-title">Shared Design Assets & DAM</div>
                <div class="item-meta">48.9 GB · Mount: /volumes/design</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">vdrive_personal_vault</span>
                  <span class="status-chip ok">Encrypted</span>
                </div>
                <div class="item-title">Personal Vault (PM)</div>
                <div class="item-meta">2.1 GB · Mount: /volumes/vault</div>
              </div>
            </div>
          } @else {
            <div class="item-list">
              <div class="item-card active">
                <div class="item-header">
                  <span class="item-id">GRAPH-ROOT</span>
                  <span class="status-chip approved">Connected</span>
                </div>
                <div class="item-title">Evergreen AI Canonical Cluster</div>
                <div class="item-meta">Bi-directional writeback enabled</div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Right Panel: Composition Canvas Document Inspector -->
      <section class="document-pane" aria-label="Document Canvas">
        <div class="canvas-chrome">
          <div class="breadcrumb">
            <span>Evergreen AI</span>
            <span class="sep">/</span>
            <span>XD | XWORKSPACE</span>
            <span class="sep">/</span>
            <span class="current">00-Foundation/XWORKSPACE-Vision-and-Mission.md</span>
          </div>

          <div class="canvas-signals">
            <span class="provenance-badge">
              <span class="dot"></span>
              <span>source: files.xgi.io · commit: c7b41e</span>
            </span>

            <span class="policy-badge writeback">
              <span class="dot"></span>
              <span>Write-back enabled</span>
            </span>
          </div>
        </div>

        <div class="canvas-document">
          <header class="doc-header">
            <div class="doc-badge-row">
              <span class="doc-tag">XDS-v0.1.0</span>
              <span class="doc-id-pill">XW-001</span>
              <span class="doc-version">v0.1.0</span>
            </div>
            <h1 class="doc-heading">XWORKSPACE — Vision and Mission</h1>
            <p class="doc-summary">Fix the scope of XWORKSPACE before implementation begins</p>
          </header>

          <article class="doc-body markdown-prose">
            <h2>1. Vision</h2>
            <p>
              An organisation's knowledge is one body, not a pile of tools. Documents, assets, data and 
              the relations between them are held as a single navigable structure that people and AI agents 
              work from directly — wherever the material physically lives, and without moving it first.
            </p>

            <h2>2. Mission</h2>
            <p>
              Build a multi-tenant knowledge fabric that connects a customer's existing systems bidirectionally, 
              models everything in them as a typed entity graph, and exposes that graph equally to a human portal 
              and to AI agents.
            </p>

            <h2>3. Multi-Color Product Family Topology</h2>
            <p>
              Following the Google Workspace architectural pattern, XWORKSPACE unifies our specialized platform tools 
              via single sign-on (XAUTH) and dedicated plugin adapters:
            </p>
            <ul>
              <li><strong>XDRIVE</strong> (<code>drive.xgi.io</code>): Deep Obsidian Navy (<code>#0A1B44</code>) — Zero-egress Cloudflare R2 binary storage fabric.</li>
              <li><strong>XFILES</strong> (<code>files.xgi.io</code>): Deep Sapphire Blue (<code>#13328C</code>) — Canonical document registers & DAM.</li>
              <li><strong>XTRANSFER</strong> (<code>transfer.xgi.io</code>): Vibrant Cobalt Blue (<code>#1F4FE0</code>) — Secure file delivery.</li>
              <li><strong>XAUTH</strong> (<code>auth.xgi.io</code>): Emerald Green (<code>#059669</code>) — Central SSO & Identity Gateway.</li>
            </ul>
          </article>

          <!-- Projected Live Tables -->
          <section class="projections-section">
            <h3 class="projections-title">Connected Platform Projections</h3>

            <div class="projection-block">
              <div class="projection-header">
                <div class="proj-left">
                  <span class="proj-icon">📑</span>
                  <span class="proj-title">XDS Document Register</span>
                  <span class="proj-source">XFILES Platform · files.xgi.io</span>
                </div>
                <span class="policy-badge writeback">Write-back enabled</span>
              </div>

              <table class="proj-table">
                <thead>
                  <tr>
                    <th>Doc ID</th>
                    <th>Status</th>
                    <th>Metric / Title</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>XW-001</code></td>
                    <td><span class="status-chip approved">Approved</span></td>
                    <td>Vision and Mission (v0.1.0)</td>
                  </tr>
                  <tr>
                    <td><code>XW-002</code></td>
                    <td><span class="status-chip draft">Draft for issue</span></td>
                    <td>Design System Brief (v0.2.0)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="projection-block">
              <div class="projection-header">
                <div class="proj-left">
                  <span class="proj-icon">📊</span>
                  <span class="proj-title">Projected Execution Telemetry</span>
                  <span class="proj-source">XVANTAGE Platform · vantage.xgi.io</span>
                </div>
                <span class="policy-badge readonly">Read-only</span>
              </div>

              <table class="proj-table">
                <thead>
                  <tr>
                    <th>Action ID</th>
                    <th>Status</th>
                    <th>Metric</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>EAI1-A010</code></td>
                    <td><span class="status-chip ok">Active</span></td>
                    <td>AP Networks Proposal Review</td>
                  </tr>
                  <tr>
                    <td><code>EAI1-A012</code></td>
                    <td><span class="status-chip ok">Verified</span></td>
                    <td>XAuth Integration Deployed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .canvas-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      height: calc(100vh - 64px);
      background: var(--surface-canvas, #F8F9FA);
    }
    .explorer-pane {
      background: #FFFFFF;
      border-right: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .pane-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pane-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #64748B;
    }
    .count-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      background: #F1F5F9;
      border-radius: 4px;
      color: #475569;
    }
    .pane-content {
      padding: 12px;
    }
    .item-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item-card {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid var(--border-subtle, #E5E7EB);
      background: #FFFFFF;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 120ms ease;
    }
    .item-card:hover {
      border-color: #CBD5E1;
      background: #F8FAFC;
    }
    .item-card.active {
      border-color: #3B82F6;
      background: #EFF6FF;
    }
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-id {
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      color: #1E293B;
    }
    .status-chip {
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .status-chip.approved, .status-chip.ok {
      background: #DCFCE7;
      color: #15803D;
    }
    .status-chip.draft {
      background: #FEF3C7;
      color: #B45309;
    }
    .item-title {
      font-size: 13px;
      font-weight: 600;
      color: #0F172A;
    }
    .item-meta {
      font-size: 11px;
      color: #64748B;
    }

    /* Document Canvas Pane */
    .document-pane {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: #FFFFFF;
    }
    .canvas-chrome {
      padding: 14px 28px;
      background: #FFFFFF;
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .breadcrumb {
      font-size: 12.5px;
      color: #64748B;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sep { color: #CBD5E1; }
    .current { font-weight: 600; color: #1E293B; }
    .canvas-signals {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .provenance-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-family: monospace;
      padding: 3px 8px;
      background: #F1F5F9;
      color: #475569;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
    }
    .provenance-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #64748B;
    }
    .policy-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .policy-badge.writeback {
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
    }
    .policy-badge.writeback .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2563EB;
    }
    .policy-badge.readonly {
      background: #F1F5F9;
      color: #64748B;
      border: 1px solid #E2E8F0;
    }
    .canvas-document {
      padding: 36px 48px;
      max-width: 860px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .doc-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
    }
    .doc-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .doc-tag {
      font-size: 10px;
      font-family: monospace;
      font-weight: 700;
      background: #EDE9FE;
      color: #6D28D9;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .doc-id-pill {
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      color: #1E293B;
    }
    .doc-version {
      font-size: 11px;
      color: #64748B;
      font-family: monospace;
    }
    .doc-heading {
      font-size: 28px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .doc-summary {
      font-size: 15px;
      color: #475569;
    }
    .markdown-prose {
      font-size: 15px;
      line-height: 1.7;
      color: #334155;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .markdown-prose h2 {
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 12px;
    }
    .markdown-prose ul {
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .markdown-prose code {
      font-family: monospace;
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    /* Projections */
    .projections-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .projections-title {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
    }
    .projection-block {
      border: 1px solid var(--border-subtle, #E5E7EB);
      border-radius: 8px;
      overflow: hidden;
    }
    .projection-header {
      padding: 10px 16px;
      background: #F8FAFC;
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .proj-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .proj-title {
      font-size: 13px;
      font-weight: 700;
      color: #1E293B;
    }
    .proj-source {
      font-size: 11px;
      color: #64748B;
    }
    .proj-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .proj-table th {
      text-align: left;
      padding: 8px 16px;
      background: #FFFFFF;
      color: #64748B;
      font-weight: 600;
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
    }
    .proj-table td {
      padding: 10px 16px;
      border-bottom: 1px solid #F1F5F9;
    }
    .proj-table tr:last-child td {
      border-bottom: none;
    }
    .proj-table code {
      font-family: monospace;
      font-weight: 600;
    }
  `]
})
export class CanvasComponent {
  readonly activeTab = input<WorkspaceTab>('canon');
}
