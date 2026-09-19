import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';

export type WorkspaceTab = 'canon' | 'drive' | 'files' | 'graph';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sidebar" aria-label="Knowledge Spaces & Adapters">
      <div class="nav-group">
        <div class="group-title">WORKSPACE SPACES</div>
        <button 
          class="nav-link" 
          [class.active]="activeTab() === 'canon'" 
          (click)="tabSelected.emit('canon')"
        >
          <span class="nav-icon">📖</span>
          <span class="nav-label">Canonical Knowledge</span>
          <span class="badge xds">XDS</span>
        </button>

        <button 
          class="nav-link" 
          [class.active]="activeTab() === 'drive'" 
          (click)="tabSelected.emit('drive')"
        >
          <span class="nav-icon">🗄️</span>
          <span class="nav-label">XDRIVE Storage</span>
          <span class="badge drive">R2</span>
        </button>

        <button 
          class="nav-link" 
          [class.active]="activeTab() === 'files'" 
          (click)="tabSelected.emit('files')"
        >
          <span class="nav-icon">📑</span>
          <span class="nav-label">XFILES Register</span>
          <span class="badge files">DAM</span>
        </button>

        <button 
          class="nav-link" 
          [class.active]="activeTab() === 'graph'" 
          (click)="tabSelected.emit('graph')"
        >
          <span class="nav-icon">🕸️</span>
          <span class="nav-label">Entity Graph</span>
        </button>
      </div>

      <div class="nav-group">
        <div class="group-title">INFRASTRUCTURE BRIDGES</div>
        <div class="source-item">
          <span class="source-status active">●</span>
          <span class="source-name">Dropbox Sync Bridge</span>
          <span class="source-meta">EAI Canon</span>
        </div>
        <div class="source-item">
          <span class="source-status active">●</span>
          <span class="source-name">Cloudflare R2 Bucket</span>
          <span class="source-meta">Zero Egress</span>
        </div>
        <div class="source-item">
          <span class="source-status active">●</span>
          <span class="source-name">Cloudflare D1 Databases</span>
          <span class="source-meta">D1 Relational</span>
        </div>
        <div class="source-item">
          <span class="source-status active">●</span>
          <span class="source-name">GitHub Repositories</span>
          <span class="source-meta">XTND-DYNAMICS</span>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="ecosystem-card">
          <div class="eco-title">Federated Suite</div>
          <div class="eco-text">
            Integrated via XAUTH SSO across XDRIVE, XFILES, XTRANSFER, XMAIL & XEIDOS.
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 256px;
      height: calc(100vh - 64px);
      background: var(--surface-raised, #FFFFFF);
      border-right: 1px solid var(--border-subtle, #E5E7EB);
      display: flex;
      flex-direction: column;
      padding: 16px 12px;
      gap: 24px;
      overflow-y: auto;
    }
    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .group-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--text-tertiary, #9CA3AF);
      padding: 0 10px 6px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-secondary, #4B5563);
      cursor: pointer;
      text-align: left;
      width: 100%;
      transition: background 120ms ease, color 120ms ease;
    }
    .nav-link:hover {
      background: var(--surface-hover, #F3F4F6);
      color: var(--text-primary, #111827);
    }
    .nav-link.active {
      background: #EFF6FF;
      color: #1D4ED8;
      font-weight: 600;
    }
    .nav-icon {
      font-size: 16px;
    }
    .nav-label {
      flex: 1;
    }
    .badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .badge.xds { background: #E0E7FF; color: #4338CA; }
    .badge.drive { background: #EAEEF7; color: #0A1B44; }
    .badge.files { background: #EDF2FC; color: #13328C; }

    .source-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      font-size: 12.5px;
      color: var(--text-secondary, #4B5563);
    }
    .source-status.active {
      color: #059669;
      font-size: 10px;
    }
    .source-name {
      flex: 1;
    }
    .source-meta {
      font-size: 10px;
      color: var(--text-tertiary, #9CA3AF);
      font-family: monospace;
    }
    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle, #E5E7EB);
    }
    .ecosystem-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .eco-title {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 2px;
    }
    .eco-text {
      font-size: 11px;
      color: #64748B;
      line-height: 1.4;
    }
  `]
})
export class SidebarComponent {
  readonly activeTab = input<WorkspaceTab>('canon');
  readonly tabSelected = output<WorkspaceTab>();
}
