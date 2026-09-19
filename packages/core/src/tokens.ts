/**
 * XFOLIO Document Token Contract + XWORKSPACE Named Extensions
 * Conforming to:
 * - ~/Workspaces/xtnd-folio/themes/_core/contract.json
 * - XW-002 Requirements Q-13, Q-14, Q-20, Q-21
 */

export const XFOLIO_REQUIRED_TOKENS = {
  type: [
    '--font-core', '--font-display', '--font-mono',
    '--weight-regular', '--weight-medium', '--weight-semibold', '--weight-bold',
    '--text-display-2', '--text-h1', '--text-h2', '--text-h3', '--text-h4',
    '--text-body-lg', '--text-body', '--text-body-sm', '--text-caption', '--text-micro',
    '--leading-tight', '--leading-snug', '--leading-heading', '--leading-body',
    '--tracking-display', '--tracking-heading', '--tracking-eyebrow', '--tracking-mono'
  ],
  colour: [
    '--brand-accent', '--brand-primary',
    '--surface-page', '--surface-card', '--surface-sunken', '--surface-hover', '--surface-inverse',
    '--text-heading', '--text-body', '--text-muted', '--text-faint',
    '--text-inverse', '--text-inverse-muted', '--text-accent',
    '--text-link', '--text-link-hover',
    '--border-subtle', '--border-default', '--border-strong', '--border-inverse', '--border-focus',
    '--status-ok-fg', '--status-ok-bg',
    '--status-caution-fg', '--status-caution-bg',
    '--status-alert-fg', '--status-alert-bg',
    '--status-info-fg', '--status-info-bg',
    '--status-neutral-fg', '--status-neutral-bg',
    '--grid-line'
  ],
  space: [
    '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7',
    '--space-8', '--space-9', '--space-10', '--space-11', '--space-12', '--space-13', '--space-14',
    '--container-max', '--gutter'
  ],
  shape: [
    '--radius-tag', '--radius-panel', '--radius-card', '--radius-pill',
    '--shadow-xs'
  ],
  motion: [
    '--dur-fast', '--ease-standard', '--transition-control'
  ]
} as const;

/**
 * Named extensions specific to XWORKSPACE application surfaces (Q-21)
 * These extend without redefining any contract token.
 */
export const XWORKSPACE_EXTENSION_TOKENS = {
  // Q-13 Quiet Provenance Tokens (must remain calm on dense multi-source pages)
  provenance: [
    '--provenance-bg',
    '--provenance-fg',
    '--provenance-border',
    '--provenance-icon-size'
  ],
  // Q-14 Write Policy Tokens (dual signal: subtle badge styling + icon)
  writePolicy: [
    '--policy-writeback-bg',
    '--policy-writeback-fg',
    '--policy-writeback-border',
    '--policy-readonly-bg',
    '--policy-readonly-fg',
    '--policy-readonly-border'
  ],
  // Q-11 App Switcher Tokens
  appSwitcher: [
    '--app-switcher-surface',
    '--app-switcher-shadow',
    '--app-switcher-item-hover',
    '--app-switcher-icon-container'
  ]
} as const;
