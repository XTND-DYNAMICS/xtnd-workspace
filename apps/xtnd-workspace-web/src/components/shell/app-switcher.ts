export interface FamilyApp {
  slug: string;
  name: string;
  host: string;
  accent: string;
  initials: string;
  description: string;
}

export const XTND_FAMILY_APPS: FamilyApp[] = [
  {
    slug: 'workspace',
    name: 'XWORKSPACE',
    host: 'https://workspace.xgi.io',
    accent: '#1E293B',
    initials: 'XW',
    description: 'Knowledge Fabric & Suite Shell'
  },
  {
    slug: 'drive',
    name: 'XDRIVE',
    host: 'https://drive.xgi.io',
    accent: '#0A1B44',
    initials: 'XD',
    description: 'Cloud & Local Storage Platform'
  },
  {
    slug: 'files',
    name: 'XFILES',
    host: 'https://files.xgi.io',
    accent: '#13328C',
    initials: 'XF',
    description: 'Documents, Registers & XDS Governance'
  },
  {
    slug: 'transfer',
    name: 'XTRANSFER',
    host: 'https://transfer.xgi.io',
    accent: '#1F4FE0',
    initials: 'XT',
    description: 'Secure File Delivery'
  },
  {
    slug: 'meridian',
    name: 'XMERIDIAN',
    host: 'https://meridian.xgi.io',
    accent: '#0284C7',
    initials: 'XM',
    description: 'Programmes & Plans'
  },
  {
    slug: 'vantage',
    name: 'XVANTAGE',
    host: 'https://vantage.xgi.io',
    accent: '#059669',
    initials: 'XV',
    description: 'Attribution & Telemetry'
  },
  {
    slug: 'mail',
    name: 'XMAIL',
    host: 'https://mail.xgi.io',
    accent: '#4F46E5',
    initials: 'XL',
    description: 'Communications & Messages'
  },
  {
    slug: 'eidos',
    name: 'XEIDOS',
    host: 'https://eidos.xgi.io',
    accent: '#7C3AED',
    initials: 'XE',
    description: 'Digital Twins & Infrastructure'
  }
];

export function renderAppSwitcher(): string {
  const items = XTND_FAMILY_APPS.map(
    app => `
      <a href="${app.host}" class="app-switcher-item" title="${app.name} — ${app.description}">
        <div class="app-switcher-icon" style="background: ${app.accent};">
          ${app.initials}
        </div>
        <span class="app-switcher-name">${app.name}</span>
      </a>
    `
  ).join('');

  return `
    <div class="app-switcher-menu" id="app-switcher-dropdown" hidden role="menu" aria-label="XTND Family Applications">
      ${items}
    </div>
  `;
}
