import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TopBarComponent } from './components/top-bar.component';
import { SidebarComponent, WorkspaceTab } from './components/sidebar.component';
import { CanvasComponent } from './components/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TopBarComponent, SidebarComponent, CanvasComponent],
  template: `
    <app-top-bar></app-top-bar>
    <div class="workspace-body">
      <app-sidebar 
        [activeTab]="activeTab()" 
        (tabSelected)="onTabSelected($event)"
      ></app-sidebar>
      <app-canvas [activeTab]="activeTab()"></app-canvas>
    </div>
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
    }
  `]
})
export class AppComponent {
  readonly activeTab = signal<WorkspaceTab>('canon');

  onTabSelected(tab: WorkspaceTab) {
    this.activeTab.set(tab);
  }
}
