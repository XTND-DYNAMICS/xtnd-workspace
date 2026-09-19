import { initializeAuth } from './auth.ts';
import { renderTopBar } from './components/shell/top-bar.ts';
import { renderCompositionCanvas, type ComposedDocumentModel } from './components/canvas/composition-canvas.ts';

export async function bootstrap() {
  await initializeAuth();

  const shellContainer = document.getElementById('shell-container');
  if (shellContainer) {
    shellContainer.innerHTML = renderTopBar('Evergreen AI (Tenant Zero)');

    const switcherBtn = document.getElementById('app-switcher-btn');
    const switcherDropdown = document.getElementById('app-switcher-dropdown');

    if (switcherBtn && switcherDropdown) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = switcherDropdown.hidden;
        switcherDropdown.hidden = !isHidden;
        switcherBtn.setAttribute('aria-expanded', String(!isHidden));
      });

      document.addEventListener('click', () => {
        switcherDropdown.hidden = true;
        switcherBtn.setAttribute('aria-expanded', 'false');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    });
  }

  // Composed Document Model demonstrating side-by-side composition of XFILES and XDRIVE
  const sampleModel: ComposedDocumentModel = {
    node: {
      guid: 'node_xw001_sample',
      tenantGuid: 'tenant_eai_001',
      spaceGuid: 'space_eai_canon',
      sourceGuid: 'source_xfiles_canon',
      externalId: '00-Foundation/XWORKSPACE-Vision-and-Mission.md',
      externalVersionHash: 'v0.1.0',
      type: 'markdown',
      title: 'XWORKSPACE — Vision and Mission',
      summary: 'Fix the scope of XWORKSPACE before implementation begins',
      nativeContent: `# 1. Vision\n\nAn organisation's knowledge is one body, not a pile of tools. Documents, assets, data and the relations between them are held as a single navigable structure that people and AI agents work from directly — wherever the material physically lives, and without moving it first.\n\n## 2. Mission\n\nBuild a multi-tenant knowledge fabric that connects a customer's existing systems bidirectionally, models everything in them as a typed entity graph, and exposes that graph equally to a human portal and to AI agents.`,
      writePolicy: 'bidirectional_writeback',
      createdBy: 'Peter A. Moelgaard',
      updatedBy: 'Peter A. Moelgaard',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T09:00:00Z'
    },
    outgoingRelations: [
      {
        guid: 'rel_01',
        tenantGuid: 'tenant_eai_001',
        fromNodeGuid: 'node_xw001_sample',
        toNodeGuid: 'node_reg',
        relationType: 'references',
        origin: 'structural_derived',
        createdBy: 'pm@xgi.io',
        createdAt: '2026-09-19T00:00:00Z',
        targetNode: {
          guid: 'node_reg',
          tenantGuid: 'tenant_eai_001',
          spaceGuid: 'space_eai_canon',
          type: 'document',
          title: 'DOCUMENT-REGISTER.md',
          writePolicy: 'bidirectional_writeback',
          createdBy: 'pm@xgi.io',
          updatedBy: 'pm@xgi.io',
          createdAt: '',
          updatedAt: ''
        }
      },
      {
        guid: 'rel_02',
        tenantGuid: 'tenant_eai_001',
        fromNodeGuid: 'node_xw001_sample',
        toNodeGuid: 'node_drive_asset',
        relationType: 'documents',
        origin: 'structural_derived',
        createdBy: 'pm@xgi.io',
        createdAt: '2026-09-19T00:00:00Z',
        targetNode: {
          guid: 'node_drive_asset',
          tenantGuid: 'tenant_eai_001',
          spaceGuid: 'space_eai_canon',
          type: 'file_asset',
          title: 'xtnd-dynamics-mark.svg',
          writePolicy: 'read_only',
          createdBy: 'pm@xgi.io',
          updatedBy: 'pm@xgi.io',
          createdAt: '',
          updatedAt: ''
        }
      }
    ],
    incomingRelations: [],
    projections: [
      {
        type: 'live_table',
        title: 'XDS Document Register',
        sourceName: 'XFILES Platform · files.xgi.io',
        writePolicy: 'bidirectional_writeback',
        data: {
          rows: [
            { id: 'XW-001', status: 'Draft for review', metric: 'Vision and Mission (v0.1.0)' },
            { id: 'XW-002', status: 'Draft for issue', metric: 'Design System Brief (v0.1.1)' }
          ]
        }
      },
      {
        type: 'live_table',
        title: 'Projected Execution Telemetry',
        sourceName: 'XVANTAGE Platform · vantage.xgi.io',
        writePolicy: 'read_only',
        data: {
          rows: [
            { id: 'EAI1-A010', status: 'Active', metric: 'AP Networks Proposal Review' },
            { id: 'EAI1-A012', status: 'Verified', metric: 'XAuth Integration Deployed' }
          ]
        }
      }
    ]
  };

  const canvasContent = document.getElementById('canvas-content');
  if (canvasContent) {
    canvasContent.innerHTML = renderCompositionCanvas(sampleModel);
  }
}

if (typeof window !== 'undefined') {
  bootstrap();
}
