const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create users table and default admin
function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
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
    
    // Create default bursar account
    const defaultPassword = await bcrypt.hash('bursar123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password, fullName, role, email) 
            VALUES (?, ?, ?, ?, ?)`,
      ['bursar', defaultPassword, 'Sr. Clare Ohagwa, OSF', 'bursar', 'bursar@franciscan.edu'],
      (err) => {
        if (err && !err.message.includes('UNIQUE')) {
          console.error('Default user creation error:', err);
        } else {
          console.log('Database initialized with default bursar account');
          console.log('Username: bursar | Password: bursar123');
        }
      }
    );
  });
  
  // Create teachers table
  db.run(`CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    gender TEXT,
    dob TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    qualification TEXT,
    specialization TEXT,
    experience TEXT,
    joinDate TEXT,
    assignedClass TEXT,
    employmentType TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    status TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Teachers table creation error:', err);
    } else {
      console.log('Teachers table ready');
    }
  });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
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

    // Return user data without password
    const { password: _, ...userData } = user;
    res.json({ 
      success: true, 
      user: userData,
      message: 'Login successful'
    });
  });
});

// Change password endpoint
app.post('/api/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
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
    
    db.run('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE username = ?',
      [hashedNewPassword, username],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
        res.json({ success: true, message: 'Password changed successfully' });
      }
    );
  });
});

// Update profile endpoint
app.post('/api/update-profile', (req, res) => {
  const { username, fullName, email } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username required' });
  }

  db.run('UPDATE users SET fullName = ?, email = ?, updatedAt = CURRENT_TIMESTAMP WHERE username = ?',
    [fullName, email, username],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
      }
      res.json({ success: true, message: 'Profile updated successfully' });
    }
  );
});

// Get all teachers
app.get('/api/teachers', (req, res) => {
  db.all('SELECT * FROM teachers ORDER BY createdAt DESC', [], (err, teachers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ teachers });
  });
});

// Add teacher
app.post('/api/teachers', async (req, res) => {
  const teacher = req.body;
  const hashedPassword = teacher.password ? await bcrypt.hash(teacher.password, 10) : null;
  
  db.run(`INSERT INTO teachers (firstName, lastName, gender, dob, phone, email, address, 
          qualification, specialization, experience, joinDate, assignedClass, employmentType, 
          username, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [teacher.firstName, teacher.lastName, teacher.gender, teacher.dob, teacher.phone, 
     teacher.email, teacher.address, teacher.qualification, teacher.specialization, 
     teacher.experience, teacher.joinDate, teacher.assignedClass, teacher.employmentType,
     teacher.username, hashedPassword, teacher.role, teacher.status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add teacher' });
      }
      res.json({ teacher: { id: this.lastID, ...teacher } });
    }
  );
});

// Update teacher
app.put('/api/teachers', async (req, res) => {
  const { id, password, ...updates } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  if (hashedPassword) {
    values.push(hashedPassword);
    db.run(`UPDATE teachers SET ${fields}, password = ? WHERE id = ?`, [...values, id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update teacher' });
      res.json({ teacher: { id, ...updates } });
    });
  } else {
    db.run(`UPDATE teachers SET ${fields} WHERE id = ?`, [...values, id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update teacher' });
      res.json({ teacher: { id, ...updates } });
    });
  }
});

// Delete teacher
app.delete('/api/teachers', (req, res) => {
  const { id } = req.body;
  db.run('DELETE FROM teachers WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete teacher' });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Default login - Username: bursar | Password: bursar123');
});
