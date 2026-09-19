# XWORKSPACE (`workspace.xgi.io`)

> **Knowledge Fabric, Multi-Product Shell & Composition Canvas for XTND DYNAMICS**

XWORKSPACE is the central unified suite shell and knowledge platform under XTND DYNAMICS. It follows the Google Workspace architectural pattern across `xgi.io`, unified by **XAUTH SSO** (`https://auth.xgi.io`), a 9-dot family app switcher, and an Entity Graph with bidirectional write-back.

## Production Endpoints & Architecture

- **Suite Shell Client**: [`https://workspace.xgi.io`](https://workspace.xgi.io) — Standalone Angular 22 web client with Google Workspace ergonomics and multi-color family palette.
- **Entity Graph API**: [`https://workspace-api.xgi.io`](https://workspace-api.xgi.io) — Cloudflare Worker deployed with D1 graph engine and R2 asset storage (`xtnd-workspace-assets`).
- **AI Agent Surface**: `apps/xtnd-workspace-mcp` — Model Context Protocol (MCP) server exposing tools for knowledge search, graph traversal, and document write-back.

## Plugin Connectors

- **`plugin-xdrive`** (`packages/plugins/plugin-xdrive`): Maps XDRIVE virtual volumes and binary storage files directly into the XWORKSPACE Entity Graph.
- **`plugin-xfiles`** (`packages/plugins/plugin-xfiles`): Ingests canonical XDS Markdown documents, validates frontmatter, reconciles `DOCUMENT-REGISTER.md`, and inspects sidecar metadata.

## Google Workspace Multi-Color Family Palette

- **XWORKSPACE**: Shell Slate (`#1E293B`)
- **XDRIVE**: Deep Obsidian Navy (`#0A1B44`) — Darkest shade
- **XFILES**: Deep Sapphire Blue (`#13328C`) — Darker blue
- **XTRANSFER**: Vibrant Cobalt Blue (`#1F4FE0`)
- **XAUTH**: Emerald Green (`#059669`)
- **XMAIL**: Royal Indigo (`#4F46E5`)
- **XPASS / XEIDOS**: Digital Twin Purple (`#7C3AED`)
- **XPRESENT**: Corporate Carmine (`#B23A48`)

## Repository Structure

```
xtnd-workspace/
├── .github/workflows/deploy.yml # Automated CI/CD to Cloudflare
├── apps/
│   ├── xtnd-workspace-web/     # Angular 22 Standalone Suite Shell (workspace.xgi.io)
│   ├── xtnd-workspace-api/     # Cloudflare Worker API & D1 Graph Store (workspace-api.xgi.io)
│   └── xtnd-workspace-mcp/     # Model Context Protocol (MCP) Server
├── packages/
│   ├── core/                   # Core domain types, tokens & graph schemas
│   ├── xds-runtime/            # XTND Document Standard parser & sidecar engine
│   └── plugins/
│       ├── plugin-xdrive/      # XDRIVE storage connector
│       └── plugin-xfiles/      # XFILES governance connector
```

## Quickstart & Verification

```bash
npm install
npm test
npm run build
```

## Identity & Single Sign-On

Federated via **XAUTH** (`https://auth.xgi.io` / `https://api.auth.xgi.io`), scoped to `.xgi.io` and federated onward to Google Workspace.
