import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createTestD1(): any {
  const db = new DatabaseSync(':memory:');

  // Load migrations
  const m1 = readFileSync(join(__dirname, '../migrations/0001_initial_schema.sql'), 'utf-8');
  db.exec(m1);

  try {
    const m2 = readFileSync(join(__dirname, '../migrations/0002_fts_indices.sql'), 'utf-8');
    db.exec(m2);
  } catch (err) {
    // If FTS5 is not compiled in the default build, create a fallback table for tests
    db.exec(`
      CREATE TABLE IF NOT EXISTS fts_nodes (
        node_guid TEXT,
        tenant_guid TEXT,
        title TEXT,
        summary TEXT,
        content TEXT
      );
    `);
  }

  return {
    prepare(query: string) {
      let boundParams: any[] = [];
      return {
        bind(...params: any[]) {
          boundParams = params;
          return this;
        },
        async run() {
          const stmt = db.prepare(query);
          const info = stmt.run(...boundParams);
          return { meta: { changes: Number(info.changes) } };
        },
        async all() {
          const stmt = db.prepare(query);
          const results = stmt.all(...boundParams);
          return { results };
        },
        async first() {
          const stmt = db.prepare(query);
          const results = stmt.all(...boundParams);
          return results.length > 0 ? results[0] : null;
        }
      };
    }
  };
}
