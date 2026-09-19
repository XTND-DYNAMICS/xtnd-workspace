import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { XTND_FAMILY_APPS, FamilyApp } from '../../components/shell/app-switcher';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top-bar">
      <div class="top-bar-left">
        <button class="icon-btn menu-toggle" aria-label="Toggle navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <a href="/" class="brand-link">
          <span class="brand-glyph">X</span>
          <span class="product-title">WORKSPACE</span>
        </a>

        <div class="tenant-selector">
          <span class="tenant-name">Evergreen AI</span>
          <span class="tenant-pill">Tenant Zero</span>
        </div>
      </div>

      <div class="top-bar-center">
        <div class="search-pill">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            class="search-input" 
            id="global-search-input"
            placeholder="Search in workspace, documents, drives, entities..." 
            aria-label="Global knowledge search"
          />
          <kbd class="shortcut-key">/</kbd>
        </div>
      </div>

      <div class="top-bar-right">
        <div class="sso-badge" title="SSO Active via XAUTH federated to Google Workspace">
          <span class="sso-dot"></span>
          <span class="sso-user">pm&#64;xgi.io</span>
          <span class="sso-provider">XAUTH SSO</span>
        </div>

        <div class="app-switcher-container">
          <button 
            type="button" 
            class="icon-btn app-switcher-btn" 
            id="app-switcher-btn"
            (click)="toggleSwitcher()" 
            [attr.aria-expanded]="switcherOpen()" 
            aria-label="Google-style XTND App Switcher"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="5" r="2"></circle>
              <circle cx="12" cy="5" r="2"></circle>
              <circle cx="19" cy="5" r="2"></circle>
              <circle cx="5" cy="12" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="19" cy="12" r="2"></circle>
              <circle cx="5" cy="19" r="2"></circle>
              <circle cx="12" cy="19" r="2"></circle>
              <circle cx="19" cy="19" r="2"></circle>
            </svg>
          </button>

          @if (switcherOpen()) {
            <div class="app-switcher-popover" role="menu">
              <div class="popover-header">
                <span class="popover-title">XTND Product Suite</span>
                <span class="popover-sub">Google Workspace Multi-Color Family</span>
              </div>
              <div class="app-grid">
                @for (app of apps; track app.slug) {
                  <a [href]="app.host" class="app-card" [title]="app.name + ' — ' + app.description">
                    <div class="app-card-icon" [style.background-color]="app.accent">
                      {{ app.initials }}
                    </div>
                    <span class="app-card-name">{{ app.name }}</span>
                    <span class="app-card-desc">{{ app.description }}</span>
                  </a>
                }
              </div>
            </div>
          }
        </div>

        <div class="user-avatar" title="Peter A. Moelgaard (Google Workspace Federated)">
          <span>PM</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .top-bar {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: var(--surface-raised, #FFFFFF);
      border-bottom: 1px solid var(--border-subtle, #E5E7EB);
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 280px;
    }
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--text-secondary, #4B5563);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms ease;
    }
    .icon-btn:hover {
      background: var(--surface-hover, #F3F4F6);
      color: var(--text-primary, #111827);
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-glyph {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background-color: #1E293B;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
    }
    .product-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #111827;
    }
    .tenant-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      padding-left: 12px;
      border-left: 1px solid var(--border-subtle, #E5E7EB);
    }
    .tenant-name {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }
    .tenant-pill {
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      background: #EFF6FF;
      color: #1D4ED8;
      border-radius: 999px;
    }
    .top-bar-center {
      flex: 1;
      max-width: 680px;
      margin: 0 24px;
    }
    .search-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 44px;
      padding: 0 16px;
      background: #F1F3F4;
      border-radius: 24px;
      border: 1px solid transparent;
      transition: all 150ms ease;
    }
    .search-pill:focus-within {
      background: #FFFFFF;
      border-color: #CBD5E1;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
    }
    .search-icon {
      color: #5F6368;
    }
    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #202124;
    }
    .shortcut-key {
      font-size: 11px;
      font-family: monospace;
      padding: 2px 6px;
      background: #E2E8F0;
      border-radius: 4px;
      color: #64748B;
    }
    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .sso-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 999px;
      font-size: 11px;
    }
    .sso-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #059669;
    }
    .sso-user {
      font-weight: 600;
      color: #15803D;
    }
    .sso-provider {
      color: #166534;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .app-switcher-container {
      position: relative;
    }
    .app-switcher-popover {
      position: absolute;
      top: 48px;
      right: 0;
      width: 320px;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);
      padding: 16px;
      z-index: 300;
    }
    .popover-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #F1F3F4;
    }
    .popover-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
    }
    .popover-sub {
      font-size: 10px;
      color: #6B7280;
    }
    .app-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .app-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 8px;
      border-radius: 8px;
      transition: background 120ms ease;
      text-align: center;
    }
    .app-card:hover {
      background: #F8FAFC;
    }
    .app-card-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      margin-bottom: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    .app-card-name {
      font-size: 11px;
      font-weight: 700;
      color: #111827;
    }
    .app-card-desc {
      font-size: 9px;
      color: #6B7280;
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-color: #0A1B44;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      border: 2px solid #E2E8F0;
      cursor: pointer;
    }
  `]
})
export class TopBarComponent {
  readonly apps = XTND_FAMILY_APPS;
  readonly switcherOpen = signal(false);

  toggleSwitcher() {
    this.switcherOpen.update(v => !v);
  }
}
