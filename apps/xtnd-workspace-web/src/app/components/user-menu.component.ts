import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

export interface UserMenuState {
  isOpen: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="user-menu-backdrop" (click)="closeMenu.emit()"></div>
      <div class="user-menu card" (click)="$event.stopPropagation()">
        <!-- User Profile Header -->
        <div class="user-menu__profile">
          <div class="user-menu__user-info">
            <span class="user-menu__name">{{ userName() }}</span>
            <span class="user-menu__email">{{ userEmail() }}</span>
            <span class="user-menu__role">Operator · XTND Auth SSO</span>
          </div>
          <div class="user-menu__avatar-slot" aria-hidden="true">
            <span class="avatar-circle">PM</span>
          </div>
        </div>

        <div class="user-menu__divider"></div>

        <!-- Theme Section -->
        <div class="user-menu__section">
          <span class="user-menu__sec-title">Interface Theme</span>
          <div class="user-menu__theme-btns" role="group" aria-label="Theme">
            <button
              type="button"
              class="theme-opt-btn"
              [class.theme-opt-btn--active]="activeTheme() === 'light'"
              (click)="setTheme('light')"
            >
              <svg class="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <span class="theme-label">Light</span>
            </button>

            <button
              type="button"
              class="theme-opt-btn"
              [class.theme-opt-btn--active]="activeTheme() === 'dark'"
              (click)="setTheme('dark')"
            >
              <svg class="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span class="theme-label">Dark</span>
            </button>

            <button
              type="button"
              class="theme-opt-btn"
              [class.theme-opt-btn--active]="activeTheme() === 'system'"
              (click)="setTheme('system')"
            >
              <svg class="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span class="theme-label">System</span>
            </button>
          </div>
        </div>

        <div class="user-menu__divider"></div>

        <!-- Management Navigation -->
        <div class="user-menu__section">
          <button type="button" class="user-menu__action-btn" (click)="openSettings.emit('bridges')">
            <svg class="user-menu__svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 11a9 9 0 0 1 9 9"></path>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1"></circle>
            </svg>
            <div class="user-menu__action-texts">
              <span class="user-menu__action-label">Infrastructure Bridges</span>
              <span class="user-menu__action-sub">Manage Dropbox, R2, D1 & GitHub</span>
            </div>
          </button>

          <button type="button" class="user-menu__action-btn" (click)="openUpdateModal.emit()">
            <svg class="user-menu__svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 16 12 12 8 16"></polyline>
              <line x1="12" y1="12" x2="12" y2="21"></line>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
            </svg>
            <div class="user-menu__action-texts">
              <span class="user-menu__action-label">Version Control & Releases</span>
              <span class="user-menu__action-sub">Push deployments & check updates</span>
            </div>
          </button>

          <button type="button" class="user-menu__action-btn" (click)="openSettings.emit('system')">
            <svg class="user-menu__svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <div class="user-menu__action-texts">
              <span class="user-menu__action-label">System Diagnostics</span>
              <span class="user-menu__action-sub">Cloudflare edge & D1 status</span>
            </div>
          </button>
        </div>

        <div class="user-menu__divider"></div>

        <!-- Version & Build Info -->
        <div class="user-menu__version-box">
          <div class="user-menu__ver-row">
            <span class="user-menu__ver-key">Version</span>
            <span class="user-menu__ver-val code-font">v0.1.0</span>
          </div>
          <div class="user-menu__ver-row">
            <span class="user-menu__ver-key">Commit</span>
            <span class="user-menu__ver-val code-font">34a54eb</span>
          </div>
          <div class="user-menu__ver-row">
            <span class="user-menu__ver-key">Engine</span>
            <span class="user-menu__ver-val">Angular 22 · TypeScript 6</span>
          </div>
        </div>

        <div class="user-menu__divider"></div>

        <!-- Sign Out Action -->
        <div class="user-menu__section">
          <button type="button" class="user-menu__action-btn user-menu__action-btn--danger" (click)="onSignOut()">
            <svg class="user-menu__svg-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <div class="user-menu__action-texts">
              <span class="user-menu__action-label">Sign Out</span>
              <span class="user-menu__action-sub">End current XAUTH session</span>
            </div>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .user-menu-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: transparent;
    }
    .user-menu {
      position: absolute;
      top: 56px;
      right: 16px;
      z-index: 201;
      width: 320px;
      padding: 10px;
      box-shadow: 0 12px 32px rgba(16, 35, 58, 0.16), 0 2px 6px rgba(16, 35, 58, 0.08);
      border: 1px solid #D7DCE0;
      background: #FFFFFF;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      animation: menuPopIn 0.15s cubic-bezier(0.2, 0, 0, 1);
    }
    @keyframes menuPopIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .user-menu__profile {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 10px;
    }
    .user-menu__user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .user-menu__name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #10233A;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user-menu__email {
      font-size: 0.8125rem;
      color: #51616F;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 1px;
    }
    .user-menu__role {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #B23A48;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 3px;
    }
    .user-menu__avatar-slot {
      width: 40px;
      height: 40px;
      flex: none;
      border-radius: 50%;
    }
    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #0A1B44;
      color: #FFFFFF;
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: 0 0 0 2px #E8EBEF;
    }
    .user-menu__divider {
      height: 1px;
      background: #E8EBEF;
      margin: 4px 0;
    }
    .user-menu__section {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 4px;
    }
    .user-menu__sec-title {
      font-size: 0.6875rem;
      color: #8A97A2;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      padding: 2px 4px;
    }
    .user-menu__theme-btns {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .theme-opt-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 6px;
      background: #FBFBFA;
      border: 1px solid #D7DCE0;
      color: #1C2128;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .theme-opt-btn:hover {
      background: #F4F3F0;
      color: #10233A;
      border-color: #A9B4BE;
    }
    .theme-opt-btn--active {
      background: #EBF1F5;
      color: #13328C;
      border-color: #13328C;
      font-weight: 600;
    }
    .user-menu__action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 6px;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      width: 100%;
      color: #1C2128;
      transition: background 0.15s ease;
    }
    .user-menu__action-btn:hover {
      background: #F4F3F0;
    }
    .user-menu__action-btn--danger:hover {
      background: #FDF0EF;
      color: #D0342C;
    }
    .user-menu__svg-icon {
      flex: none;
      color: #51616F;
    }
    .user-menu__action-btn--danger .user-menu__svg-icon {
      color: #D0342C;
    }
    .user-menu__action-texts {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .user-menu__action-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: inherit;
    }
    .user-menu__action-sub {
      font-size: 0.6875rem;
      color: #8A97A2;
      margin-top: 1px;
    }
    .user-menu__version-box {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 6px 10px;
      background: #FBFBFA;
      border-radius: 6px;
      border: 1px solid #E8EBEF;
    }
    .user-menu__ver-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.6875rem;
    }
    .user-menu__ver-key {
      color: #8A97A2;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .user-menu__ver-val {
      color: #10233A;
      font-weight: 500;
    }
    .code-font {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
  `]
})
export class UserMenuComponent {
  readonly isOpen = input<boolean>(false);
  readonly userName = input<string>('Peter A. Moelgaard');
  readonly userEmail = input<string>('pm@xgi.io');

  readonly closeMenu = output<void>();
  readonly openSettings = output<string>();
  readonly openUpdateModal = output<void>();

  readonly activeTheme = signal<ThemeMode>('light');

  setTheme(theme: ThemeMode) {
    this.activeTheme.set(theme);
    localStorage.setItem('xworkspace_theme', theme);
  }

  onSignOut() {
    window.location.href = 'https://auth.xgi.io/sign-out?service=xworkspace';
  }
}
