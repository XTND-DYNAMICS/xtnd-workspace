import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InfraBridge {
  id: string;
  name: string;
  type: 'dropbox' | 'r2' | 'd1' | 'github' | 'custom';
  targetUri: string;
  status: 'active' | 'paused' | 'syncing';
  meta: string;
  lastSync: string;
}

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="settings-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
        <div class="settings-modal-card">
          <div class="settings-header">
            <div class="header-titles">
              <h2 id="settings-modal-title" class="title">Workspace Settings</h2>
              <span class="sub">Configure infrastructure connectors, bridges, and tenancy</span>
            </div>
            <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="settings-nav-tabs" role="tablist">
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'bridges'" 
              (click)="activeTab.set('bridges')"
              role="tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
              Infrastructure Bridges
            </button>

            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'tenant'" 
              (click)="activeTab.set('tenant')"
              role="tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Tenant & Workspace
            </button>

            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'diagnostics'" 
              (click)="activeTab.set('diagnostics')"
              role="tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Diagnostics
            </button>
          </div>

          <div class="settings-body">
            @if (activeTab() === 'bridges') {
              <div class="bridges-pane">
                <div class="pane-action-bar">
                  <div class="pane-action-text">
                    <span class="pane-section-title">Connected Storage & Data Fabrics</span>
                    <span class="pane-section-sub">External volume synchronization bridges and relational D1 bindings</span>
                  </div>

                  <button type="button" class="btn btn-primary" (click)="toggleAddForm()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Bridge
                  </button>
                </div>

                @if (showAddForm()) {
                  <div class="add-bridge-form card">
                    <div class="form-title">{{ editingBridgeId() ? 'Edit Bridge' : 'Configure New Infrastructure Bridge' }}</div>
                    <div class="form-grid">
                      <div class="form-field">
                        <label>Bridge Name</label>
                        <input type="text" [value]="formName()" (input)="formName.set($any($event.target).value)" placeholder="e.g. Dropbox Legal Archives" />
                      </div>
                      <div class="form-field">
                        <label>Fabric Type</label>
                        <select [value]="formType()" (change)="formType.set($any($event.target).value)">
                          <option value="dropbox">Dropbox Sync Bridge</option>
                          <option value="r2">Cloudflare R2 Bucket</option>
                          <option value="d1">Cloudflare D1 Database</option>
                          <option value="github">GitHub Repository</option>
                          <option value="custom">S3 / Object Store</option>
                        </select>
                      </div>
                      <div class="form-field full-width">
                        <label>Target URI / Mount Point</label>
                        <input type="text" [value]="formUri()" (input)="formUri.set($any($event.target).value)" placeholder="e.g. /Users/pmoelgaard/Dropbox/XD | XWORKSPACE or bucket://name" />
                      </div>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
                      <button type="button" class="btn btn-primary" (click)="saveBridge()">Save Bridge</button>
                    </div>
                  </div>
                }

                <div class="bridge-list">
                  @for (bridge of bridges(); track bridge.id) {
                    <div class="bridge-card">
                      <div class="bridge-main">
                        <div class="bridge-icon-box" [class]="bridge.type">
                          @switch (bridge.type) {
                            @case ('dropbox') {
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              </svg>
                            }
                            @case ('r2') {
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                              </svg>
                            }
                            @case ('d1') {
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                              </svg>
                            }
                            @case ('github') {
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                            }
                            @default {
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                            }
                          }
                        </div>

                        <div class="bridge-details">
                          <div class="bridge-top">
                            <span class="bridge-name">{{ bridge.name }}</span>
                            <span class="bridge-status-chip" [class]="bridge.status">
                              <span class="status-indicator"></span>
                              {{ bridge.status === 'active' ? 'Active' : 'Paused' }}
                            </span>
                          </div>
                          <span class="bridge-uri">{{ bridge.targetUri }}</span>
                          <span class="bridge-meta">{{ bridge.meta }} · Last synced: {{ bridge.lastSync }}</span>
                        </div>
                      </div>

                      <div class="bridge-controls">
                        <button 
                          type="button" 
                          class="action-icon-btn" 
                          (click)="toggleBridgeStatus(bridge.id)" 
                          [title]="bridge.status === 'active' ? 'Pause sync' : 'Resume sync'"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            @if (bridge.status === 'active') {
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            } @else {
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            }
                          </svg>
                        </button>

                        <button 
                          type="button" 
                          class="action-icon-btn" 
                          (click)="editBridge(bridge)" 
                          title="Edit connection settings"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        <button 
                          type="button" 
                          class="action-icon-btn danger" 
                          (click)="deleteBridge(bridge.id)" 
                          title="Remove bridge"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            } @else if (activeTab() === 'tenant') {
              <div class="tenant-pane">
                <div class="tenant-card">
                  <div class="tenant-card-header">
                    <span class="tenant-name-lg">Evergreen AI</span>
                    <span class="badge-accent">Tenant Zero</span>
                  </div>
                  <div class="tenant-specs">
                    <div class="spec-row">
                      <span class="spec-label">Domain Scope</span>
                      <span class="spec-val">.xgi.io (Universal SSO)</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-label">Identity Gateway</span>
                      <span class="spec-val">https://auth.xgi.io</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-label">Federation Provider</span>
                      <span class="spec-val">Google Workspace (OpenID Connect)</span>
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <div class="diagnostics-pane">
                <div class="diag-table">
                  <div class="diag-row">
                    <span class="diag-key">Edge Runtime</span>
                    <span class="diag-val">Cloudflare Workers · V8 Isolates</span>
                  </div>
                  <div class="diag-row">
                    <span class="diag-key">Relational D1</span>
                    <span class="diag-val">xtnd-workspace (d5d08a03...)</span>
                  </div>
                  <div class="diag-row">
                    <span class="diag-key">Storage R2</span>
                    <span class="diag-val">xtnd-drive-storage (Zero Egress)</span>
                  </div>
                  <div class="diag-row">
                    <span class="diag-key">Framework</span>
                    <span class="diag-val">Angular 22.1.7 (Zoneless Signal Engine)</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .settings-backdrop {
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(16, 35, 58, 0.45);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.15s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .settings-modal-card {
      position: relative;
      background: #FFFFFF;
      width: 720px;
      max-width: 94vw;
      height: 640px;
      max-height: 90vh;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 48px rgba(16, 35, 58, 0.2), 0 4px 12px rgba(16, 35, 58, 0.08);
      border: 1px solid #D7DCE0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #10233A;
      margin: 0;
    }
    .sub {
      font-size: 0.8125rem;
      color: #51616F;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #8A97A2;
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .settings-nav-tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #E8EBEF;
      padding-bottom: 8px;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #51616F;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab-btn:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .tab-btn.active {
      background: #EBF1F5;
      color: #13328C;
      font-weight: 600;
    }
    .settings-body {
      flex: 1;
      overflow-y: auto;
      padding-right: 4px;
    }
    .pane-action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .pane-action-text {
      display: flex;
      flex-direction: column;
    }
    .pane-section-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #10233A;
    }
    .pane-section-sub {
      font-size: 0.75rem;
      color: #8A97A2;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: #0A1B44;
      border: 1px solid #0A1B44;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: #13328C;
    }
    .btn-secondary {
      background: #FBFBFA;
      border: 1px solid #D7DCE0;
      color: #1C2128;
    }
    .bridge-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bridge-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: 10px;
      background: #FBFBFA;
      border: 1px solid #E8EBEF;
      transition: border-color 0.15s ease;
    }
    .bridge-card:hover {
      border-color: #A9B4BE;
    }
    .bridge-main {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .bridge-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: #EBF1F5;
      color: #13328C;
    }
    .bridge-icon-box.dropbox { background: #EBF3FF; color: #1F4FE0; }
    .bridge-icon-box.r2 { background: #F0F4FA; color: #0A1B44; }
    .bridge-icon-box.d1 { background: #EDFDF5; color: #059669; }
    .bridge-icon-box.github { background: #F4F3F0; color: #10233A; }
    .bridge-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .bridge-top {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bridge-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #10233A;
    }
    .bridge-status-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .bridge-status-chip.active {
      background: #EAF7F1;
      color: #0F8A5F;
    }
    .bridge-status-chip.paused {
      background: #FDF4E7;
      color: #B26B00;
    }
    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .bridge-uri {
      font-size: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, monospace;
      color: #51616F;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 2px;
    }
    .bridge-meta {
      font-size: 0.6875rem;
      color: #8A97A2;
      margin-top: 1px;
    }
    .bridge-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .action-icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid #D7DCE0;
      color: #51616F;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .action-icon-btn:hover {
      background: #F4F3F0;
      color: #10233A;
      border-color: #A9B4BE;
    }
    .action-icon-btn.danger:hover {
      background: #FDF0EF;
      color: #D0342C;
      border-color: #D0342C;
    }
    .add-bridge-form {
      padding: 16px;
      border-radius: 10px;
      background: #FFFFFF;
      border: 1px solid #13328C;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .form-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #10233A;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-field.full-width {
      grid-column: 1 / -1;
    }
    .form-field label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #51616F;
    }
    .form-field input, .form-field select {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #D7DCE0;
      font-size: 0.8125rem;
      color: #10233A;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .tenant-card {
      padding: 20px;
      background: #FBFBFA;
      border-radius: 10px;
      border: 1px solid #E8EBEF;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tenant-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tenant-name-lg {
      font-size: 1.125rem;
      font-weight: 700;
      color: #10233A;
    }
    .badge-accent {
      font-size: 0.6875rem;
      font-weight: 600;
      color: #B23A48;
      background: #FDF0EF;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .spec-row, .diag-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #E8EBEF;
      font-size: 0.8125rem;
    }
    .spec-label, .diag-key {
      color: #51616F;
    }
    .spec-val, .diag-val {
      color: #10233A;
      font-weight: 500;
      font-family: ui-monospace, monospace;
    }
  `]
})
export class SettingsModalComponent {
  readonly open = input<boolean>(false);
  readonly initialTab = input<string>('bridges');
  readonly close = output<void>();

  readonly activeTab = signal<string>('bridges');
  readonly showAddForm = signal<boolean>(false);
  readonly editingBridgeId = signal<string | null>(null);

  readonly formName = signal('');
  readonly formType = signal<InfraBridge['type']>('dropbox');
  readonly formUri = signal('');

  readonly bridges = signal<InfraBridge[]>([
    {
      id: 'bridge_dropbox',
      name: 'Dropbox Sync Bridge',
      type: 'dropbox',
      targetUri: '/Users/pmoelgaard/Dropbox/XD | XWORKSPACE',
      status: 'active',
      meta: 'EAI Canon · Bidirectional',
      lastSync: 'Just now'
    },
    {
      id: 'bridge_r2',
      name: 'Cloudflare R2 Bucket',
      type: 'r2',
      targetUri: 'r2://xtnd-drive-storage',
      status: 'active',
      meta: 'Zero Egress · Petabyte Scale',
      lastSync: '2 min. ago'
    },
    {
      id: 'bridge_d1',
      name: 'Cloudflare D1 Relational DB',
      type: 'd1',
      targetUri: 'd1://xtnd-workspace (d5d08a03...)',
      status: 'active',
      meta: 'SQLite Edge · FTS5 Indexing',
      lastSync: 'Continuous'
    },
    {
      id: 'bridge_github',
      name: 'GitHub Suite Repositories',
      type: 'github',
      targetUri: 'https://github.com/XTND-DYNAMICS/xtnd-workspace',
      status: 'active',
      meta: 'CI/CD Automated Deployments',
      lastSync: '5 min. ago'
    }
  ]);

  toggleAddForm() {
    this.editingBridgeId.set(null);
    this.formName.set('');
    this.formType.set('dropbox');
    this.formUri.set('');
    this.showAddForm.set(!this.showAddForm());
  }

  cancelForm() {
    this.showAddForm.set(false);
    this.editingBridgeId.set(null);
  }

  editBridge(bridge: InfraBridge) {
    this.editingBridgeId.set(bridge.id);
    this.formName.set(bridge.name);
    this.formType.set(bridge.type);
    this.formUri.set(bridge.targetUri);
    this.showAddForm.set(true);
  }

  saveBridge() {
    if (!this.formName().trim()) return;

    if (this.editingBridgeId()) {
      this.bridges.update(list => list.map(b => {
        if (b.id === this.editingBridgeId()) {
          return { ...b, name: this.formName(), type: this.formType(), targetUri: this.formUri() };
        }
        return b;
      }));
    } else {
      const newId = `bridge_${Date.now()}`;
      this.bridges.update(list => [
        ...list,
        {
          id: newId,
          name: this.formName(),
          type: this.formType(),
          targetUri: this.formUri(),
          status: 'active',
          meta: 'Custom Bridge',
          lastSync: 'Pending'
        }
      ]);
    }
    this.showAddForm.set(false);
    this.editingBridgeId.set(null);
  }

  toggleBridgeStatus(id: string) {
    this.bridges.update(list => list.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'active' ? 'paused' : 'active' };
      }
      return b;
    }));
  }

  deleteBridge(id: string) {
    this.bridges.update(list => list.filter(b => b.id !== id));
  }
}
