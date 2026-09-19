import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceTab } from './sidebar.component';

export interface DocItem {
  id: string;
  category: string;
  title: string;
  version: string;
  status: 'Approved' | 'Drafting' | 'Hold';
  author: string;
  source: string;
  commit: string;
  summary: string;
  content: string;
}

export interface DriveVolume {
  id: string;
  name: string;
  type: string;
  size: string;
  mountPath: string;
  files: { name: string; size: string; modified: string; type: string }[];
}

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="canvas-layout" role="main">
      <!-- Left Panel: Context Navigator / Workspace Explorer -->
      <section class="explorer-pane" aria-label="Explorer Pane">
        <div class="pane-header">
          <div class="pane-header-top">
            <span class="pane-title">
              @switch (activeTab()) {
                @case ('canon') { CANONICAL KNOWLEDGE }
                @case ('drive') { XDRIVE STORAGE FABRIC }
                @case ('files') { XFILES MASTER REGISTER }
                @case ('graph') { ENTITY GRAPH FABRIC }
              }
            </span>
            <span class="count-badge">
              @switch (activeTab()) {
                @case ('canon') { {{ filteredDocs().length }} Docs }
                @case ('drive') { {{ volumes.length }} Volumes }
                @case ('files') { 4 Registered }
                @case ('graph') { 12 Nodes }
              }
            </span>
          </div>

          <!-- Intuitive Filter Bar -->
          <div class="explorer-filter-box">
            <svg class="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="filter-input" 
              [value]="searchQuery()" 
              (input)="onSearchInput($event)"
              placeholder="Filter items..." 
            />
            @if (searchQuery()) {
              <button type="button" class="clear-filter" (click)="searchQuery.set('')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>
        </div>

        <div class="pane-content">
          @if (activeTab() === 'canon' || activeTab() === 'files') {
            <div class="explorer-tree">
              @for (cat of docCategories(); track cat) {
                <div class="tree-category">
                  <div class="category-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{{ cat }}</span>
                  </div>

                  <div class="item-list">
                    @for (doc of getDocsByCategory(cat); track doc.id) {
                      <button 
                        type="button" 
                        class="item-card" 
                        [class.active]="selectedDoc().id === doc.id"
                        (click)="selectDoc(doc)"
                      >
                        <div class="item-header">
                          <span class="item-id">{{ doc.id }}</span>
                          <span class="status-chip" [class]="doc.status.toLowerCase()">
                            {{ doc.status }}
                          </span>
                        </div>
                        <div class="item-title">{{ doc.title }}</div>
                        <div class="item-meta">{{ doc.version }} · {{ doc.author }}</div>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          } @else if (activeTab() === 'drive') {
            <!-- Intuitive Drive Volumes & File Explorer -->
            <div class="drive-explorer">
              <div class="section-label">STORAGE VOLUMES</div>
              <div class="item-list">
                @for (vol of volumes; track vol.id) {
                  <button 
                    type="button" 
                    class="item-card" 
                    [class.active]="selectedVolume().id === vol.id"
                    (click)="selectedVolume.set(vol)"
                  >
                    <div class="item-header">
                      <span class="item-id">{{ vol.id }}</span>
                      <span class="status-chip ok">{{ vol.type }}</span>
                    </div>
                    <div class="item-title">{{ vol.name }}</div>
                    <div class="item-meta">{{ vol.size }} · {{ vol.mountPath }}</div>
                  </button>
                }
              </div>
            </div>
          } @else {
            <div class="item-list">
              <div class="item-card active">
                <div class="item-header">
                  <span class="item-id">node_root_tenant</span>
                  <span class="status-chip ok">Tenant</span>
                </div>
                <div class="item-title">Tenant Zero: Evergreen AI</div>
                <div class="item-meta">Edges: 8 outgoing · 0 incoming</div>
              </div>

              <div class="item-card">
                <div class="item-header">
                  <span class="item-id">node_workspace_core</span>
                  <span class="status-chip draft">Volume</span>
                </div>
                <div class="item-title">Cloudflare R2 Fabric Node</div>
                <div class="item-meta">Relation: MOUNTED_AT -> /volumes/core</div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Right Panel: Composition Canvas -->
      <section class="document-pane" aria-label="Document Canvas">
        @if (activeTab() === 'drive') {
          <!-- Intuitive File Explorer View for XDRIVE -->
          <div class="document-content">
            <header class="doc-header">
              <div class="doc-breadcrumbs">
                <span>XDRIVE</span>
                <span class="separator">/</span>
                <span>Volumes</span>
                <span class="separator">/</span>
                <span class="current">{{ selectedVolume().id }}</span>
              </div>

              <div class="doc-meta-row">
                <span class="provenance-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  target: r2://xtnd-drive-storage
                </span>
                <span class="policy-pill ok">Zero Egress Active</span>
                <span class="policy-pill info">Local Daemon Connected</span>
              </div>
            </header>

            <div class="file-explorer-table-card">
              <div class="table-toolbar">
                <div class="table-path">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>{{ selectedVolume().mountPath }}</span>
                </div>
                <button type="button" class="btn btn-secondary btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Upload File
                </button>
              </div>

              <table class="file-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Modified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (file of selectedVolume().files; track file.name) {
                    <tr>
                      <td class="file-name-cell">
                        <svg class="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span>{{ file.name }}</span>
                      </td>
                      <td class="code-font">{{ file.size }}</td>
                      <td>{{ file.modified }}</td>
                      <td>
                        <button type="button" class="table-action-btn" title="Download">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <!-- Document Canvas for Canonical Knowledge & Master Register -->
          <div class="document-content">
            <header class="doc-header">
              <div class="doc-breadcrumbs">
                <span>Evergreen AI</span>
                <span class="separator">/</span>
                <span>XD | XWORKSPACE</span>
                <span class="separator">/</span>
                <span>{{ selectedDoc().category }}</span>
                <span class="separator">/</span>
                <span class="current">{{ selectedDoc().id }}.md</span>
              </div>

              <div class="doc-meta-row">
                <span class="provenance-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  source: {{ selectedDoc().source }} · commit: {{ selectedDoc().commit }}
                </span>
                <span class="policy-pill ok">Write-back enabled</span>
                <span class="policy-pill info">XDS v0.1.0 Compliant</span>
              </div>
            </header>

            <article class="doc-body">
              <div class="doc-xds-spec">
                <span class="spec-tag">XDS-v0.1.0</span>
                <span class="spec-id">{{ selectedDoc().id }}</span>
                <span class="spec-version">{{ selectedDoc().version }}</span>
                <span class="spec-status" [class]="selectedDoc().status.toLowerCase()">{{ selectedDoc().status }}</span>
              </div>

              <h1 class="doc-main-title">{{ selectedDoc().title }}</h1>
              <p class="doc-summary-lead">{{ selectedDoc().summary }}</p>

              <hr class="doc-divider" />

              <div class="doc-rendered-markdown" [innerHTML]="selectedDoc().content"></div>

              <section class="doc-projections-section">
                <h3 class="proj-title">Connected Platform Projections</h3>
                <div class="proj-card">
                  <div class="proj-card-header">
                    <div class="proj-brand">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span class="proj-name">XDS Document Register</span>
                      <span class="proj-sub">XFILES Platform · files.xgi.io</span>
                    </div>
                    <span class="policy-pill ok">Synchronized</span>
                  </div>
                  <div class="proj-meta-table">
                    <div class="meta-row">
                      <span class="meta-label">Sidecar File</span>
                      <span class="meta-value code-font">{{ selectedDoc().id }}.meta.json</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">Cryptographic Hash</span>
                      <span class="meta-value code-font">sha256:7f48b...29ac</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">Storage Binding</span>
                      <span class="meta-value code-font">r2://xtnd-drive-storage/canon/{{ selectedDoc().id }}.md</span>
                    </div>
                  </div>
                </div>
              </section>
            </article>
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    .canvas-layout {
      display: flex;
      flex: 1;
      height: 100%;
      overflow: hidden;
      background: #FBFBFA;
    }
    .explorer-pane {
      width: 320px;
      min-width: 280px;
      height: 100%;
      background: #FFFFFF;
      border-right: 1px solid #E8EBEF;
      display: flex;
      flex-direction: column;
      flex: none;
    }
    .pane-header {
      padding: 14px 16px 12px;
      border-bottom: 1px solid #E8EBEF;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .pane-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pane-title {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #8A97A2;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .count-badge {
      font-size: 0.6875rem;
      font-weight: 600;
      color: #13328C;
      background: #F2F5FE;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .explorer-filter-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #FBFBFA;
      border: 1px solid #D7DCE0;
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .explorer-filter-box:focus-within {
      background: #FFFFFF;
      border-color: #13328C;
      box-shadow: 0 0 0 2px rgba(19, 50, 140, 0.1);
    }
    .filter-icon {
      color: #8A97A2;
      flex: none;
    }
    .filter-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.8125rem;
      color: #10233A;
      width: 100%;
    }
    .filter-input::placeholder {
      color: #8A97A2;
    }
    .clear-filter {
      background: transparent;
      border: none;
      color: #8A97A2;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 2px;
    }
    .pane-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .explorer-tree {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tree-category {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .category-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.6875rem;
      font-weight: 700;
      color: #51616F;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 4px;
    }
    .section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #8A97A2;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      padding: 0 4px;
    }
    .item-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .item-card {
      display: flex;
      flex-direction: column;
      padding: 10px 12px;
      background: #FFFFFF;
      border: 1px solid #E8EBEF;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
      width: 100%;
    }
    .item-card:hover {
      background: #F4F3F0;
      border-color: #D7DCE0;
    }
    .item-card.active {
      background: #EBF1F5;
      border-color: #13328C;
      box-shadow: 0 1px 3px rgba(19, 50, 140, 0.1);
    }
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .item-id {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #13328C;
      font-family: ui-monospace, monospace;
    }
    .status-chip {
      font-size: 0.625rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .status-chip.approved, .status-chip.ok {
      background: #EAF7F1;
      color: #0F8A5F;
    }
    .status-chip.draft, .status-chip.drafting {
      background: #FDF4E7;
      color: #B26B00;
    }
    .status-chip.hold {
      background: #FDF0EF;
      color: #D0342C;
    }
    .item-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #10233A;
      line-height: 1.3;
      margin-bottom: 4px;
    }
    .item-meta {
      font-size: 0.6875rem;
      color: #8A97A2;
    }
    .document-pane {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      background: #FFFFFF;
      padding: 32px 48px;
    }
    .document-content {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .doc-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-bottom: 16px;
      border-bottom: 1px solid #E8EBEF;
    }
    .doc-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8125rem;
      color: #51616F;
    }
    .doc-breadcrumbs .separator {
      color: #A9B4BE;
    }
    .doc-breadcrumbs .current {
      color: #10233A;
      font-weight: 600;
    }
    .doc-meta-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .provenance-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.6875rem;
      color: #51616F;
      background: #F4F3F0;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #E2E0D8;
      font-family: ui-monospace, monospace;
    }
    .policy-pill {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .policy-pill.ok {
      background: #EEF6F4;
      color: #1A6354;
      border: 1px solid #C8E5DF;
    }
    .policy-pill.info {
      background: #F2F5FE;
      color: #13328C;
      border: 1px solid #C5D5FB;
    }
    .doc-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .doc-xds-spec {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-family: ui-monospace, monospace;
    }
    .spec-tag {
      background: #F2F5FE;
      color: #13328C;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .spec-id {
      font-weight: 700;
      color: #10233A;
    }
    .spec-version {
      color: #51616F;
    }
    .spec-status {
      font-size: 0.6875rem;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .spec-status.approved { background: #EAF7F1; color: #0F8A5F; }
    .spec-status.drafting { background: #FDF4E7; color: #B26B00; }
    .doc-main-title {
      font-size: 2rem;
      font-weight: 800;
      color: #10233A;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin: 0;
    }
    .doc-summary-lead {
      font-size: 1.0625rem;
      color: #51616F;
      line-height: 1.5;
    }
    .doc-divider {
      border: none;
      height: 1px;
      background: #E8EBEF;
      margin: 8px 0;
    }
    .doc-rendered-markdown {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: #1C2128;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .file-explorer-table-card {
      border: 1px solid #E8EBEF;
      border-radius: 10px;
      overflow: hidden;
      background: #FFFFFF;
    }
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #FBFBFA;
      border-bottom: 1px solid #E8EBEF;
    }
    .table-path {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8125rem;
      font-family: ui-monospace, monospace;
      color: #10233A;
      font-weight: 600;
    }
    .file-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .file-table th {
      text-align: left;
      padding: 10px 16px;
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8A97A2;
      border-bottom: 1px solid #E8EBEF;
      background: #FAFAFA;
    }
    .file-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #E8EBEF;
      color: #1C2128;
    }
    .file-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .file-icon {
      color: #13328C;
      flex: none;
    }
    .table-action-btn {
      background: transparent;
      border: 1px solid #D7DCE0;
      border-radius: 6px;
      padding: 4px 8px;
      color: #51616F;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .table-action-btn:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .btn-secondary {
      background: #FFFFFF;
      border: 1px solid #D7DCE0;
      color: #10233A;
    }
    .doc-projections-section {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .proj-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #10233A;
    }
    .proj-card {
      border: 1px solid #E8EBEF;
      border-radius: 10px;
      padding: 16px;
      background: #FBFBFA;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .proj-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .proj-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #13328C;
    }
    .proj-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #10233A;
    }
    .proj-sub {
      font-size: 0.6875rem;
      color: #8A97A2;
    }
    .proj-meta-table {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }
    .meta-label {
      color: #8A97A2;
    }
    .meta-value {
      color: #10233A;
      font-weight: 500;
    }
    .code-font {
      font-family: ui-monospace, SFMono-Regular, monospace;
    }
  `]
})
export class CanvasComponent {
  readonly activeTab = input.required<WorkspaceTab>();

  readonly searchQuery = signal('');

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  readonly docs: DocItem[] = [
    {
      id: 'XW-001',
      category: '00-Foundation',
      title: 'XWORKSPACE Vision and Mission',
      version: 'v0.1.0',
      status: 'Approved',
      author: 'Peter A. Moelgaard',
      source: 'files.xgi.io',
      commit: 'c7b41e',
      summary: 'Fix the scope of XWORKSPACE before implementation begins.',
      content: `
        <h3>1. Vision</h3>
        <p>An organisation's knowledge is one body, not a pile of tools. Documents, assets, data and the relations between them are held as a single navigable structure that people and AI agents work from directly — wherever the material physically lives, and without moving it first.</p>
        <h3>2. Mission</h3>
        <p>Build a multi-tenant knowledge fabric that connects a customer's existing systems bidirectionally, models everything in them as a typed entity graph, and exposes that graph equally to a human portal and to AI agents.</p>
      `
    },
    {
      id: 'XW-002',
      category: '01-Design',
      title: 'XWORKSPACE Design System Brief',
      version: 'v0.2.0',
      status: 'Drafting',
      author: 'Peter A. Moelgaard',
      source: 'files.xgi.io',
      commit: 'e28a91',
      summary: 'Ergonomics copied from Google Workspace with Multi-Color Product Family construction.',
      content: `
        <h3>1. Ergonomic Foundation</h3>
        <p>Calm, expansive light surfaces, generous 12px card radii, pill-shaped global search bar with keyboard shortcut, and an authentic 9-dot Google Workspace App Switcher for the suite.</p>
        <h3>2. Multi-Color Family Palette</h3>
        <p>Unifies XDRIVE (Obsidian Navy #0A1B44), XFILES (Sapphire Blue #13328C), XTRANSFER (Cobalt #1F4FE0), XVANTAGE (Emerald #059669), XMAIL (Indigo #4F46E5), and XEIDOS (Purple #7C3AED).</p>
      `
    },
    {
      id: 'XW-003',
      category: '01-Design',
      title: 'XFILES Design System Brief',
      version: 'v0.1.0',
      status: 'Approved',
      author: 'Peter A. Moelgaard',
      source: 'files.xgi.io',
      commit: 'd89c20',
      summary: 'Ergonomic twin of XTRANSFER with Deep Sapphire Blue (#13328C) branding.',
      content: `
        <h3>1. Architectural Role</h3>
        <p>Authoritative runtime implementation of the XTND Document Standard (XDS). Validates document frontmatter, generates cryptographic SHA-256 sidecar manifests, and maintains the master document register.</p>
      `
    },
    {
      id: 'XW-004',
      category: '01-Design',
      title: 'XDRIVE Design System Brief',
      version: 'v0.1.0',
      status: 'Approved',
      author: 'Peter A. Moelgaard',
      source: 'files.xgi.io',
      commit: 'f40b12',
      summary: 'Ergonomic twin of XTRANSFER with Deep Obsidian Navy (#0A1B44) branding.',
      content: `
        <h3>1. Enterprise Storage Fabric</h3>
        <p>Petabyte-scale binary object storage built on Cloudflare R2 with zero egress fees, virtual drive mounts, and continuous bidirectional sync bridges.</p>
      `
    }
  ];

  readonly selectedDoc = signal<DocItem>(this.docs[0]);

  readonly volumes: DriveVolume[] = [
    {
      id: 'vdrive_workspace_core',
      name: 'System Runtime Volume',
      type: 'R2 Zero Egress',
      size: '14.2 GB',
      mountPath: '/volumes/core',
      files: [
        { name: 'manifest.json', size: '2.4 KB', modified: '2 min. ago', type: 'json' },
        { name: 'schema-v0.2.0.sql', size: '18.9 KB', modified: '10 min. ago', type: 'sql' },
        { name: 'assets-bundle.tar.gz', size: '14.1 GB', modified: '1 hour ago', type: 'archive' }
      ]
    },
    {
      id: 'vdrive_shared_design',
      name: 'Shared Design Assets & DAM',
      type: 'Dropbox Mirror',
      size: '48.9 GB',
      mountPath: '/volumes/design',
      files: [
        { name: 'XWORKSPACE-Design-Tokens.json', size: '8.4 KB', modified: 'Today 11:30', type: 'json' },
        { name: 'XFILES-Brief-v0.1.0.pdf', size: '4.2 MB', modified: 'Today 10:15', type: 'pdf' },
        { name: 'brand-palette-vectors.svg', size: '120 KB', modified: 'Yesterday', type: 'svg' }
      ]
    },
    {
      id: 'vdrive_personal_vault',
      name: 'Personal Vault (PM)',
      type: 'Encrypted',
      size: '2.1 GB',
      mountPath: '/volumes/vault',
      files: [
        { name: 'keys.vault.enc', size: '512 B', modified: 'Sep 18', type: 'enc' },
        { name: 'executive-summary.md', size: '12 KB', modified: 'Sep 17', type: 'md' }
      ]
    }
  ];

  readonly selectedVolume = signal<DriveVolume>(this.volumes[0]);

  readonly docCategories = computed(() => {
    const cats = new Set(this.filteredDocs().map(d => d.category));
    return Array.from(cats);
  });

  filteredDocs() {
    const query = this.searchQuery().trim();
    if (!query) return this.docs;
    const q = query.toLowerCase();
    return this.docs.filter(d => 
      d.id.toLowerCase().includes(q) || 
      d.title.toLowerCase().includes(q) || 
      d.category.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q)
    );
  }

  getDocsByCategory(category: string) {
    return this.filteredDocs().filter(d => d.category === category);
  }

  selectDoc(doc: DocItem) {
    this.selectedDoc.set(doc);
  }
}
