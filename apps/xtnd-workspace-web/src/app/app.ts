import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TopBarComponent } from './components/top-bar.component';
import { SidebarComponent, WorkspaceTab } from './components/sidebar.component';
import { CanvasComponent } from './components/canvas.component';
import { SettingsModalComponent } from './components/settings-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TopBarComponent, SidebarComponent, CanvasComponent, SettingsModalComponent],
  template: `
    <app-top-bar 
      (openSettingsModal)="onOpenSettings($event)"
    ></app-top-bar>
    <div class="workspace-body">
      <app-sidebar 
        [activeTab]="activeTab()" 
        (tabSelected)="onTabSelected($event)"
        (openSettings)="onOpenSettings($event)"
      ></app-sidebar>
      <app-canvas [activeTab]="activeTab()"></app-canvas>
    </div>

    <app-settings-modal
      [open]="settingsModalOpen()"
      [initialTab]="settingsTab()"
      (close)="settingsModalOpen.set(false)"
    ></app-settings-modal>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .workspace-body {
      display: flex;
      flex: 1;
      height: calc(100vh - 64px);
      overflow: hidden;
      position: relative;
    }
  `]
})
export class AppComponent {
  readonly activeTab = signal<WorkspaceTab>('canon');
  readonly settingsModalOpen = signal<boolean>(false);
  readonly settingsTab = signal<string>('bridges');

  onTabSelected(tab: WorkspaceTab) {
    this.activeTab.set(tab);
  }

  onOpenSettings(tab: string = 'bridges') {
    this.settingsTab.set(tab);
    this.settingsModalOpen.set(true);
  }
}
