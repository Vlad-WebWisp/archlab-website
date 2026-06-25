-- ArchLab waitlist signups.
-- Apply locally:   npx wrangler d1 execute archlab-waitlist --local  --file=./schema.sql
-- Apply remotely:  npx wrangler d1 execute archlab-waitlist --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS waitlist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One signup per email address (case-insensitive).
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (lower(email));
