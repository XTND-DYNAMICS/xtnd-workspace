-- XWORKSPACE D1 Initial Schema
-- Multi-tenant Entity Graph, Sources, Overlays, and Audit Log

CREATE TABLE IF NOT EXISTS tenants (
  guid       TEXT PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

CREATE TABLE IF NOT EXISTS spaces (
  guid        TEXT PRIMARY KEY,
  tenant_guid TEXT NOT NULL,
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  is_private  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE,
  UNIQUE(tenant_guid, slug)
);
CREATE INDEX IF NOT EXISTS idx_spaces_tenant ON spaces(tenant_guid);

CREATE TABLE IF NOT EXISTS sources (
  guid                   TEXT PRIMARY KEY,
  tenant_guid            TEXT NOT NULL,
  space_guid             TEXT NOT NULL,
  connector_type         TEXT NOT NULL,
  name                   TEXT NOT NULL,
  status                 TEXT NOT NULL DEFAULT 'active',
  write_policy           TEXT NOT NULL DEFAULT 'bidirectional_writeback',
  auth_payload_encrypted TEXT,
  sync_cursor            TEXT,
  last_synced_at         TEXT,
  config                 TEXT NOT NULL DEFAULT '{}',
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE,
  FOREIGN KEY (space_guid) REFERENCES spaces(guid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sources_tenant ON sources(tenant_guid);

CREATE TABLE IF NOT EXISTS nodes (
  guid                  TEXT PRIMARY KEY,
  tenant_guid           TEXT NOT NULL,
  space_guid            TEXT NOT NULL,
  source_guid           TEXT,
  external_id           TEXT,
  external_version_hash TEXT,
  type                  TEXT NOT NULL,
  title                 TEXT NOT NULL,
  summary               TEXT,
  mime_type             TEXT,
  native_content        TEXT,
  metadata              TEXT NOT NULL DEFAULT '{}',
  write_policy          TEXT NOT NULL DEFAULT 'native_only',
  created_by            TEXT NOT NULL,
  updated_by            TEXT NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE,
  FOREIGN KEY (space_guid) REFERENCES spaces(guid) ON DELETE CASCADE,
  FOREIGN KEY (source_guid) REFERENCES sources(guid) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_nodes_tenant_space ON nodes(tenant_guid, space_guid);
CREATE INDEX IF NOT EXISTS idx_nodes_source_external ON nodes(source_guid, external_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(tenant_guid, type);

CREATE TABLE IF NOT EXISTS relations (
  guid           TEXT PRIMARY KEY,
  tenant_guid    TEXT NOT NULL,
  from_node_guid TEXT NOT NULL,
  to_node_guid   TEXT NOT NULL,
  relation_type  TEXT NOT NULL,
  origin         TEXT NOT NULL DEFAULT 'structural_derived',
  metadata       TEXT NOT NULL DEFAULT '{}',
  created_by     TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE,
  FOREIGN KEY (from_node_guid) REFERENCES nodes(guid) ON DELETE CASCADE,
  FOREIGN KEY (to_node_guid) REFERENCES nodes(guid) ON DELETE CASCADE,
  UNIQUE(from_node_guid, to_node_guid, relation_type)
);
CREATE INDEX IF NOT EXISTS idx_relations_from ON relations(from_node_guid);
CREATE INDEX IF NOT EXISTS idx_relations_to ON relations(to_node_guid);
CREATE INDEX IF NOT EXISTS idx_relations_tenant_type ON relations(tenant_guid, relation_type);

CREATE TABLE IF NOT EXISTS overlays (
  guid         TEXT PRIMARY KEY,
  tenant_guid  TEXT NOT NULL,
  node_guid    TEXT NOT NULL,
  overlay_type TEXT NOT NULL,
  content      TEXT NOT NULL DEFAULT '{}',
  author_guid  TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE,
  FOREIGN KEY (node_guid) REFERENCES nodes(guid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_overlays_node ON overlays(node_guid);

CREATE TABLE IF NOT EXISTS audit_log (
  guid           TEXT PRIMARY KEY,
  tenant_guid    TEXT NOT NULL,
  node_guid      TEXT,
  actor_guid     TEXT NOT NULL,
  actor_type     TEXT NOT NULL,
  action         TEXT NOT NULL,
  previous_state TEXT,
  new_state      TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_guid) REFERENCES tenants(guid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_node ON audit_log(tenant_guid, node_guid);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- Seed Tenant Zero: Evergreen AI
INSERT OR IGNORE INTO tenants (guid, slug, name, status) VALUES
  ('tenant_eai_001', 'evergreen-ai', 'Evergreen AI', 'active');

INSERT OR IGNORE INTO spaces (guid, tenant_guid, slug, name, is_private) VALUES
  ('space_eai_canon', 'tenant_eai_001', 'canon', 'Canonical Knowledge & XDS', 0),
  ('space_eai_general', 'tenant_eai_001', 'general', 'General Workspace', 0);
