import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { XTND_FAMILY_APPS, FamilyApp } from '../../components/shell/app-switcher';
import { UserMenuComponent } from './user-menu.component';
import { AppUpdateModalComponent } from './update-modal.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [UserMenuComponent, AppUpdateModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top-bar">
      <div class="top-bar-left">
        <!-- Main menu button removed per founder instruction -->
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
        <!-- Version Control & Build Stamp Pill cloned from XMail -->
        <button 
          type="button" 
          class="version-stamp-btn" 
          (click)="updateModalOpen.set(true)"
          title="App Management & Releases · Click to manage version"
        >
          <span class="version-dot"></span>
          <span class="version-text">Fully Updated · v0.1.0</span>
        </button>

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

        <!-- User Avatar Widget (identical to XMail/X360) -->
        <button 
          type="button" 
          class="user-avatar-btn" 
          (click)="toggleUserMenu()"
          aria-label="User account menu"
          [attr.aria-expanded]="userMenuOpen()"
        >
          <span class="avatar-ring"></span>
          <span class="avatar-label">PM</span>
        </button>

        <app-user-menu 
          [isOpen]="userMenuOpen()"
          (closeMenu)="userMenuOpen.set(false)"
          (openSettings)="onOpenSettings($event)"
          (openUpdateModal)="onOpenUpdateModal()"
        ></app-user-menu>

        <app-update-modal
          [open]="updateModalOpen()"
          (close)="updateModalOpen.set(false)"
        ></app-update-modal>
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
      background: #FFFFFF;
      border-bottom: 1px solid #E8EBEF;
      position: relative;
      z-index: 100;
    }
    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 240px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: #10233A;
    }
    .brand-glyph {
      font-size: 1.25rem;
      font-weight: 800;
      color: #B23A48;
      letter-spacing: -0.04em;
    }
    .product-title {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #10233A;
    }
    .tenant-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 14px;
      border-left: 1px solid #E8EBEF;
    }
    .tenant-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1C2128;
    }
    .tenant-pill {
      font-size: 0.6875rem;
      color: #51616F;
      background: #F4F3F0;
      padding: 2px 8px;
      border-radius: 9999px;
      font-weight: 500;
    }
    .top-bar-center {
      flex: 1;
      max-width: 640px;
      margin: 0 24px;
    }
    .search-pill {
      display: flex;
      align-items: center;
      background: #F4F3F0;
      border: 1px solid transparent;
      border-radius: 9999px;
      padding: 6px 16px;
      gap: 10px;
      transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
    }
    .search-pill:focus-within {
      background: #FFFFFF;
      border-color: #13328C;
      box-shadow: 0 1px 3px rgba(19, 50, 140, 0.12), 0 0 0 3px rgba(19, 50, 140, 0.08);
    }
    .search-icon {
      color: #51616F;
      flex: none;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.9375rem;
      width: 100%;
      color: #1C2128;
    }
    .search-input::placeholder {
      color: #8A97A2;
    }
    .shortcut-key {
      font-size: 0.6875rem;
      font-family: ui-monospace, monospace;
      background: #FFFFFF;
      border: 1px solid #D7DCE0;
      color: #51616F;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }
    .version-stamp-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FBFBFA;
      border: 1px solid #D7DCE0;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #10233A;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .version-stamp-btn:hover {
      background: #F4F3F0;
      border-color: #13328C;
    }
    .version-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0F8A5F;
    }
    .sso-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      background: #F2F5FE;
      border: 1px solid #C5D5FB;
      padding: 4px 10px;
      border-radius: 9999px;
      color: #13328C;
    }
    .sso-dot {
      width: 6px;
      height: 6px;
      background: #0F8A5F;
      border-radius: 50%;
    }
    .sso-user {
      font-weight: 600;
    }
    .sso-provider {
      font-size: 0.6875rem;
      color: #51616F;
      text-transform: uppercase;
    }
    .icon-btn {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: #51616F;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .icon-btn:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .app-switcher-container {
      position: relative;
    }
    .app-switcher-popover {
      position: absolute;
      top: 48px;
      right: 0;
      width: 340px;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(16, 35, 58, 0.16);
      border: 1px solid #D7DCE0;
      padding: 16px;
      z-index: 200;
      animation: menuPopIn 0.15s cubic-bezier(0.2, 0, 0, 1);
    }
    @keyframes menuPopIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .popover-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #E8EBEF;
    }
    .popover-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #10233A;
    }
    .popover-sub {
      font-size: 0.6875rem;
      color: #8A97A2;
    }
    .app-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .app-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 10px;
      border-radius: 10px;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .app-card:hover {
      background: #F4F3F0;
    }
    .app-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      color: #FFFFFF;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      margin-bottom: 6px;
    }
    .app-card-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #10233A;
    }
    .app-card-desc {
      font-size: 0.625rem;
      color: #51616F;
      margin-top: 2px;
      line-height: 1.2;
    }
    .user-avatar-btn {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #0A1B44;
      color: #FFFFFF;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 600;
      box-shadow: 0 0 0 2px #E8EBEF;
      transition: all 0.15s ease;
    }
    .user-avatar-btn:hover {
      box-shadow: 0 0 0 3px #13328C;
    }
  `]
})
export class TopBarComponent {
  readonly switcherOpen = signal(false);
  readonly userMenuOpen = signal(false);
  readonly updateModalOpen = signal(false);

  readonly openSettingsModal = output<string>();

  readonly apps: FamilyApp[] = XTND_FAMILY_APPS;

  toggleSwitcher() {
    this.switcherOpen.set(!this.switcherOpen());
    if (this.switcherOpen()) {
      this.userMenuOpen.set(false);
    }
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
    if (this.userMenuOpen()) {
      this.switcherOpen.set(false);
    }
  }

  onOpenSettings(tab: string) {
    this.userMenuOpen.set(false);
    this.openSettingsModal.emit(tab);
  }

  onOpenUpdateModal() {
    this.userMenuOpen.set(false);
    this.updateModalOpen.set(true);
  }
}
