import { Component, ChangeDetectionStrategy, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type WorkspaceTab = 'canon' | 'drive' | 'files' | 'graph';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav 
      class="sidebar" 
      [class.collapsed]="isCollapsed()" 
      [style.width.px]="isCollapsed() ? 64 : width()"
      aria-label="Workspace Spaces & Navigation"
    >
      <div class="sidebar-header">
        @if (!isCollapsed()) {
          <span class="header-label">WORKSPACE SPACES</span>
        }
        <button 
          type="button" 
          class="collapse-toggle-btn" 
          (click)="toggleCollapse()"
          [title]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          aria-label="Toggle sidebar collapse"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (isCollapsed()) {
              <polyline points="9 18 15 12 9 6"></polyline>
            } @else {
              <polyline points="15 18 9 12 15 6"></polyline>
            }
          </svg>
        </button>
      </div>

      <div class="nav-group">
        <button 
          type="button"
          class="nav-link" 
          [class.active]="activeTab() === 'canon'" 
          (click)="tabSelected.emit('canon')"
          title="Canonical Knowledge (XDS)"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">Canonical Knowledge</span>
            <span class="badge xds">XDS</span>
          }
        </button>

        <button 
          type="button"
          class="nav-link" 
          [class.active]="activeTab() === 'drive'" 
          (click)="tabSelected.emit('drive')"
          title="XDRIVE Storage (Cloudflare R2)"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">XDRIVE Storage</span>
            <span class="badge drive">R2</span>
          }
        </button>

        <button 
          type="button"
          class="nav-link" 
          [class.active]="activeTab() === 'files'" 
          (click)="tabSelected.emit('files')"
          title="XFILES Register (DAM)"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">XFILES Register</span>
            <span class="badge files">DAM</span>
          }
        </button>

        <button 
          type="button"
          class="nav-link" 
          [class.active]="activeTab() === 'graph'" 
          (click)="tabSelected.emit('graph')"
          title="Entity Graph"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">Entity Graph</span>
          }
        </button>
      </div>

      <!-- Footer & Settings Trigger (Infrastructure Bridges moved to Settings) -->
      <div class="sidebar-footer">
        <button 
          type="button" 
          class="nav-link settings-link" 
          (click)="openSettings.emit('bridges')"
          title="Workspace Settings & Bridges"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">Settings & Bridges</span>
          }
        </button>

        @if (!isCollapsed()) {
          <div class="ecosystem-card">
            <div class="eco-title">Federated Suite</div>
            <div class="eco-text">
              Integrated via XAUTH SSO across XDRIVE, XFILES, XTRANSFER, XMAIL & XEIDOS.
            </div>
          </div>
        }
      </div>

      <!-- Resizer Splitter Bar cloned from XMail -->
      @if (!isCollapsed()) {
        <div 
          class="sidebar-resizer" 
          (mousedown)="startResize($event)"
          (touchstart)="startResize($event)"
          title="Drag to resize sidebar width"
        ></div>
      }
    </nav>
  `,
  styles: [`
    :host {
      position: relative;
      display: flex;
    }
    .sidebar {
      position: relative;
      height: calc(100vh - 64px);
      background: #FFFFFF;
      border-right: 1px solid #E8EBEF;
      display: flex;
      flex-direction: column;
      padding: 14px 10px;
      gap: 16px;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 0.15s cubic-bezier(0.2, 0, 0, 1);
      user-select: none;
    }
    .sidebar.collapsed {
      padding: 14px 6px;
      align-items: center;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      min-height: 28px;
    }
    .header-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #8A97A2;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .collapse-toggle-btn {
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      color: #51616F;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .collapse-toggle-btn:hover {
      background: #F4F3F0;
      border-color: #D7DCE0;
      color: #10233A;
    }
    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: #1C2128;
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      width: 100%;
    }
    .collapsed .nav-link {
      justify-content: center;
      padding: 10px;
    }
    .nav-link:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .nav-link.active {
      background: #EBF1F5;
      color: #13328C;
      font-weight: 600;
    }
    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #51616F;
      flex: none;
    }
    .nav-link.active .nav-icon {
      color: #13328C;
    }
    .nav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      font-size: 0.625rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }
    .badge.xds {
      background: #EBF3FF;
      color: #13328C;
    }
    .badge.drive {
      background: #F0F4FA;
      color: #0A1B44;
    }
    .badge.files {
      background: #EBF3FF;
      color: #13328C;
    }
    .sidebar-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .settings-link {
      color: #51616F;
      border: 1px solid #E8EBEF;
      background: #FBFBFA;
    }
    .settings-link:hover {
      background: #F4F3F0;
      color: #10233A;
      border-color: #D7DCE0;
    }
    .ecosystem-card {
      background: #FBFBFA;
      border: 1px solid #E8EBEF;
      border-radius: 8px;
      padding: 10px;
    }
    .eco-title {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #10233A;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .eco-text {
      font-size: 0.6875rem;
      color: #51616F;
      line-height: 1.4;
    }
    .sidebar-resizer {
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      cursor: col-resize;
      background: transparent;
      transition: background 0.15s ease;
      z-index: 10;
    }
    .sidebar-resizer:hover, .sidebar-resizer:active {
      background: #13328C;
    }
  `]
})
export class SidebarComponent {
  readonly activeTab = input.required<WorkspaceTab>();
  readonly tabSelected = output<WorkspaceTab>();
  readonly openSettings = output<string>();

  readonly minWidth = 200;
  readonly maxWidth = 460;
  readonly width = signal<number>(this.getInitialWidth());
  readonly isCollapsed = signal<boolean>(false);

  private isResizing = false;

  private getInitialWidth(): number {
    const saved = localStorage.getItem('xworkspace_sidebar_width');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= this.minWidth && parsed <= this.maxWidth) {
        return parsed;
      }
    }
    return 260;
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  startResize(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isResizing = true;
    const startX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const startWidth = this.width();

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isResizing) return;
      const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const deltaX = currentX - startX;
      let newWidth = startWidth + deltaX;
      if (newWidth < this.minWidth) newWidth = this.minWidth;
      if (newWidth > this.maxWidth) newWidth = this.maxWidth;
      this.width.set(newWidth);
    };

    const onEnd = () => {
      this.isResizing = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      localStorage.setItem('xworkspace_sidebar_width', String(this.width()));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }
}
