CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  ref TEXT UNIQUE NOT NULL,
  name TEXT, email TEXT, phone TEXT,
  qty INTEGER, description TEXT,
  files_json TEXT,
  created_at TEXT,
  ip TEXT, ua TEXT
);
CREATE INDEX IF NOT EXISTS tickets_ref_idx ON tickets(ref);
