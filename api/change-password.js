const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database('/tmp/users.db');
  }
  return db;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const database = getDb();
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  database.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    database.run('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE username = ?',
      [hashedNewPassword, username],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
        res.json({ success: true, message: 'Password changed successfully' });
      }
    );
  });
};
