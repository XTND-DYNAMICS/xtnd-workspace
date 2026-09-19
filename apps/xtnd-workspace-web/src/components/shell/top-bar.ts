import { renderAppSwitcher } from './app-switcher.ts';

export function renderTopBar(tenantName = 'Evergreen AI'): string {
  return `
    <header class="shell-header">
      <div class="shell-header-left">
        <a href="/" class="brand-logo" aria-label="XWORKSPACE Home">
          <span class="brand-glyph">X</span>
          <span>WORKSPACE</span>
        </a>
        <span class="tenant-badge" id="current-tenant">${tenantName}</span>
      </div>

      <div class="shell-search-bar">
        <div class="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="global-search-input" class="search-input" placeholder="Search knowledge graph, documents, records (Press /)" />
          <span class="search-shortcut-hint">/</span>
        </div>
      </div>

      <div class="shell-header-right">
        <button id="app-switcher-btn" class="icon-button" aria-label="Open XTND App Switcher" aria-expanded="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

        <div id="user-profile-badge" class="tenant-badge">
          pm@xgi.io
        </div>

        ${renderAppSwitcher()}
      </div>
    </header>
  `;
}
