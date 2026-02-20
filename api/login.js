const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database('/tmp/users.db', (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        initializeDatabase();
      }
    });
  }
  return db;
}

function initializeDatabase() {
  const database = getDb();
  database.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, async (err) => {
    if (err) {
      console.error('Table creation error:', err);
      return;
    }
    
    const defaultPassword = await bcrypt.hash('bursar123', 10);
    database.run(`INSERT OR IGNORE INTO users (username, password, fullName, role, email) 
            VALUES (?, ?, ?, ?, ?)`,
      ['bursar', defaultPassword, 'Sr. Clare Ohagwa, OSF', 'bursar', 'bursar@franciscan.edu']
    );
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const database = getDb();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  database.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { password: _, ...userData } = user;
    res.json({ 
      success: true, 
      user: userData,
      message: 'Login successful'
    });
  });
};
