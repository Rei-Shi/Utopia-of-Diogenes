CREATE TABLE IF NOT EXISTS messages (
 id INTEGER PRIMARY KEY,
 text TEXT,
 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);