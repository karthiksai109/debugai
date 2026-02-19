import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'debugai.db');

let db;

export function initDB() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'slack',
      channel_id TEXT,
      user_id TEXT,
      user_name TEXT,
      input_text TEXT NOT NULL,
      severity TEXT,
      category TEXT,
      root_cause TEXT,
      suggestion TEXT,
      code_fix TEXT,
      confidence REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `);

  return db;
}

export function getDB() {
  if (!db) initDB();
  return db;
}

export function insertAnalysis({ id, source, channel_id, user_id, user_name, input_text }) {
  const stmt = getDB().prepare(`
    INSERT INTO analyses (id, source, channel_id, user_id, user_name, input_text, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
  `);
  return stmt.run(id, source, channel_id, user_id, user_name, input_text);
}

export function updateAnalysisResult({ id, severity, category, root_cause, suggestion, code_fix, confidence }) {
  const stmt = getDB().prepare(`
    UPDATE analyses
    SET severity = ?, category = ?, root_cause = ?, suggestion = ?, code_fix = ?,
        confidence = ?, status = 'completed', completed_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(severity, category, root_cause, suggestion, code_fix, confidence, id);
}

export function markAnalysisFailed(id, error) {
  const stmt = getDB().prepare(`
    UPDATE analyses SET status = 'failed', root_cause = ? WHERE id = ?
  `);
  return stmt.run(error, id);
}

export function getAnalysis(id) {
  return getDB().prepare('SELECT * FROM analyses WHERE id = ?').get(id);
}

export function listAnalyses(limit = 50, offset = 0) {
  return getDB().prepare('SELECT * FROM analyses ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
}

export function getStats() {
  const db = getDB();
  const total = db.prepare('SELECT COUNT(*) as count FROM analyses').get().count;
  const completed = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE status = 'completed'").get().count;
  const failed = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE status = 'failed'").get().count;
  const pending = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE status = 'pending'").get().count;

  const bySeverity = db.prepare(`
    SELECT severity, COUNT(*) as count FROM analyses
    WHERE severity IS NOT NULL GROUP BY severity
  `).all();

  const byCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM analyses
    WHERE category IS NOT NULL GROUP BY category
  `).all();

  const recent = db.prepare(`
    SELECT * FROM analyses ORDER BY created_at DESC LIMIT 10
  `).all();

  const avgConfidence = db.prepare(`
    SELECT AVG(confidence) as avg FROM analyses WHERE confidence IS NOT NULL
  `).get().avg;

  return { total, completed, failed, pending, bySeverity, byCategory, recent, avgConfidence: avgConfidence || 0 };
}
