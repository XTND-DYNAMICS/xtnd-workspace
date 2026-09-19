import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UpdateStage = 'idle' | 'checking' | 'preparing' | 'activating' | 'finalizing' | 'rebooting' | 'complete';

@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="update-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="update-modal-title">
        <div class="update-modal-card">
          <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="update-modal-header">
            <div class="orb-wrap">
              <div class="orb-pulse-ring"></div>
              <div class="orb-core">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <h2 id="update-modal-title" class="update-title">App Management & Releases</h2>
            <div class="version-badge">
              <span class="curr">{{ currentVersion() }}</span>
              <svg class="arrow-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <span class="target">{{ targetVersion() || 'v0.1.1 (latest)' }}</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width.%]="percent()"></div>
            </div>
            <div class="progress-info">
              <span class="stage-label">{{ stageLabel() }}</span>
              <span class="progress-percent">{{ percent() }}%</span>
            </div>
          </div>

          <ul class="step-list">
            <li class="step-item" [class.done]="percent() >= 30" [class.active]="stage() === 'preparing'">
              <span class="step-ic">
                @if (percent() >= 30) {
                  <svg class="ic-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <span class="ic-dot"></span>
                }
              </span>
              <span class="step-text">Checking update manifest & asset hashes</span>
            </li>

            <li class="step-item" [class.done]="percent() >= 75" [class.active]="stage() === 'activating'">
              <span class="step-ic">
                @if (percent() >= 75) {
                  <svg class="ic-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <span class="ic-dot"></span>
                }
              </span>
              <span class="step-text">Activating Cloudflare edge workers & storage sync</span>
            </li>

            <li class="step-item" [class.done]="percent() >= 95" [class.active]="stage() === 'finalizing'">
              <span class="step-ic">
                @if (percent() >= 95) {
                  <svg class="ic-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <span class="ic-dot"></span>
                }
              </span>
              <span class="step-text">Finalizing workspace entity graph & cache state</span>
            </li>

            <li class="step-item" [class.done]="percent() >= 100" [class.active]="stage() === 'rebooting' || stage() === 'complete'">
              <span class="step-ic">
                @if (percent() >= 100) {
                  <svg class="ic-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <span class="ic-dot"></span>
                }
              </span>
              <span class="step-text">Rebooting browser app shell with verified build</span>
            </li>
          </ul>

          <div class="modal-actions">
            @if (isUpdating()) {
              <div class="update-footer-tip">
                Please hold on — your session will automatically reload in a moment.
              </div>
            } @else {
              <button type="button" class="btn btn-secondary" (click)="triggerUpdateCheck()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Check for Updates
              </button>

              <button type="button" class="btn btn-primary" (click)="startPushDeployment()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                Push New Version
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .update-modal-backdrop {
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
    .update-modal-card {
      position: relative;
      background: #FFFFFF;
      width: 440px;
      max-width: 92vw;
      border-radius: 16px;
      padding: 28px 24px;
      box-shadow: 0 20px 48px rgba(16, 35, 58, 0.2), 0 4px 12px rgba(16, 35, 58, 0.08);
      border: 1px solid #D7DCE0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: popIn 0.2s cubic-bezier(0.2, 0, 0, 1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .close-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      background: transparent;
      border: none;
      color: #8A97A2;
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .close-btn:hover {
      background: #F4F3F0;
      color: #10233A;
    }
    .update-modal-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .orb-wrap {
      position: relative;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .orb-pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(19, 50, 140, 0.25);
      animation: pulse 2s infinite cubic-bezier(0.2, 0, 0, 1);
    }
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .orb-core {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #13328C;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(19, 50, 140, 0.35);
    }
    .update-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #10233A;
      margin: 0;
    }
    .version-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #F2F5FE;
      border: 1px solid #C5D5FB;
      font-size: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-weight: 600;
    }
    .version-badge .curr {
      color: #51616F;
    }
    .arrow-svg {
      color: #1F4FE0;
    }
    .version-badge .target {
      color: #13328C;
    }
    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .progress-bar-track {
      height: 6px;
      background: #E8EBEF;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: #13328C;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }
    .stage-label {
      color: #51616F;
      font-weight: 500;
    }
    .progress-percent {
      color: #10233A;
      font-weight: 600;
      font-family: ui-monospace, monospace;
    }
    .step-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8125rem;
      color: #8A97A2;
      transition: color 0.15s ease;
    }
    .step-item.active {
      color: #10233A;
      font-weight: 600;
    }
    .step-item.done {
      color: #0F8A5F;
    }
    .step-ic {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .ic-check {
      color: #0F8A5F;
    }
    .ic-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A9B4BE;
    }
    .step-item.active .ic-dot {
      background: #13328C;
      box-shadow: 0 0 0 3px rgba(19, 50, 140, 0.2);
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 4px;
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
    .btn-secondary {
      background: #FBFBFA;
      border: 1px solid #D7DCE0;
      color: #1C2128;
    }
    .btn-secondary:hover {
      background: #F4F3F0;
      border-color: #A9B4BE;
    }
    .btn-primary {
      background: #0A1B44;
      border: 1px solid #0A1B44;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: #13328C;
      border-color: #13328C;
    }
    .update-footer-tip {
      font-size: 0.75rem;
      color: #51616F;
      text-align: center;
      width: 100%;
      padding: 6px 0;
    }
  `]
})
export class AppUpdateModalComponent {
  readonly open = input<boolean>(false);
  readonly currentVersion = input<string>('v0.1.0');
  readonly targetVersion = input<string | null>(null);

  readonly close = output<void>();

  readonly stage = signal<UpdateStage>('idle');
  readonly percent = signal<number>(0);
  readonly isUpdating = signal<boolean>(false);

  stageLabel() {
    switch (this.stage()) {
      case 'checking': return 'Checking remote repositories...';
      case 'preparing': return 'Preparing package manifest...';
      case 'activating': return 'Updating Cloudflare edge cache...';
      case 'finalizing': return 'Finalizing workspace state...';
      case 'rebooting': return 'Rebooting client shell...';
      case 'complete': return 'Update complete';
      default: return 'System ready';
    }
  }

  async triggerUpdateCheck() {
    this.stage.set('checking');
    this.percent.set(20);
    await new Promise(r => setTimeout(r, 600));
    this.percent.set(100);
    this.stage.set('complete');
    await new Promise(r => setTimeout(r, 400));
    this.stage.set('idle');
    this.percent.set(0);
  }

  async startPushDeployment() {
    this.isUpdating.set(true);
    this.stage.set('preparing');
    this.percent.set(30);

    await new Promise(r => setTimeout(r, 600));
    this.stage.set('activating');
    this.percent.set(75);

    await new Promise(r => setTimeout(r, 700));
    this.stage.set('finalizing');
    this.percent.set(95);

    await new Promise(r => setTimeout(r, 500));
    this.stage.set('rebooting');
    this.percent.set(100);

    await new Promise(r => setTimeout(r, 800));
    window.location.reload();
  }
}
