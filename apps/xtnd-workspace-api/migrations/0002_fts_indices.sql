-- SQLite FTS5 Virtual Table for Instant Lexical & Keyword Graph Retrieval
CREATE VIRTUAL TABLE IF NOT EXISTS fts_nodes USING fts5(
  node_guid UNINDEXED,
  tenant_guid UNINDEXED,
  title,
  summary,
  content,
  tokenize = 'porter unicode61'
);

-- Triggers to synchronize fts_nodes with nodes table
CREATE TRIGGER IF NOT EXISTS trg_nodes_ai AFTER INSERT ON nodes BEGIN
  INSERT INTO fts_nodes(node_guid, tenant_guid, title, summary, content)
  VALUES (new.guid, new.tenant_guid, new.title, COALESCE(new.summary, ''), COALESCE(new.native_content, ''));
END;

CREATE TRIGGER IF NOT EXISTS trg_nodes_ad AFTER DELETE ON nodes BEGIN
  DELETE FROM fts_nodes WHERE node_guid = old.guid;
END;

CREATE TRIGGER IF NOT EXISTS trg_nodes_au AFTER UPDATE ON nodes BEGIN
  DELETE FROM fts_nodes WHERE node_guid = old.guid;
  INSERT INTO fts_nodes(node_guid, tenant_guid, title, summary, content)
  VALUES (new.guid, new.tenant_guid, new.title, COALESCE(new.summary, ''), COALESCE(new.native_content, ''));
END;
