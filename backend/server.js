const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'franciscan_school_secret_2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Data storage (in production, use a proper database)
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const RECEIPTS_FILE = path.join(DATA_DIR, 'receipts.json');

// Initialize data directory and files
async function initializeData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize users file with default accounts
    const defaultUsers = {
      bursar: [
        {
          id: 'BUR001',
          username: 'bursar',
          password: await bcrypt.hash('bursar123', 10),
          name: 'Sr. Clare Ohagwa, OSF',
          role: 'bursar',
          email: 'bursar@franciscancnps.org',
          active: true
        }
      ],
      admin: [
        {
          id: 'ADM001',
          username: 'admin',
          password: await bcrypt.hash('admin123', 10),
          name: 'Rev. Fr. Principal',
          role: 'admin',
          email: 'admin@franciscancnps.org',
          active: true
        }
      ]
    };

    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    }

    // Initialize payments file
    try {
      await fs.access(PAYMENTS_FILE);
    } catch {
      await fs.writeFile(PAYMENTS_FILE, JSON.stringify([], null, 2));
    }

    // Initialize receipts file
    try {
      await fs.access(RECEIPTS_FILE);
    } catch {
      await fs.writeFile(RECEIPTS_FILE, JSON.stringify([], null, 2));
    }

  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper functions
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    const users = await readJsonFile(USERS_FILE);
    if (!users) {
      return res.status(500).json({ error: 'Unable to access user data' });
    }

    const userList = users[role] || [];
    const user = userList.find(u => u.username === username && u.active);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payments (bursar only)
app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payments = await readJsonFile(PAYMENTS_FILE);
    if (!payments) {
      return res.status(500).json({ error: 'Unable to access payment data' });
    }

    res.json({ success: true, payments });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear payments (bursar only)
app.delete('/api/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const saved = await writeJsonFile(PAYMENTS_FILE, []);
    if (!saved) {
      return res.status(500).json({ error: 'Unable to clear payments' });
    }

    res.json({ success: true, message: 'All payments cleared' });

  } catch (error) {
    console.error('Clear payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add payment (bursar only)
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { studentName, studentClass, amount, purpose, paymentMode, paymentDate, notes } = req.body;

    if (!studentName || !amount || !purpose) {
      return res.status(400).json({ error: 'Student name, amount, and purpose are required' });
    }

    const payments = await readJsonFile(PAYMENTS_FILE);
    if (!payments) {
      return res.status(500).json({ error: 'Unable to access payment data' });
    }

    const newPayment = {
      id: `PAY-${Date.now()}`,
      receiptId: `RCPT-${Date.now()}`,
      studentName,
      studentClass: studentClass || '',
      amount: parseFloat(amount),
      purpose,
      paymentMode: paymentMode || 'cash',
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      notes: notes || '',
      status: 'paid',
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    payments.push(newPayment);
    
    const saved = await writeJsonFile(PAYMENTS_FILE, payments);
    if (!saved) {
      return res.status(500).json({ error: 'Unable to save payment' });
    }

    res.json({ success: true, payment: newPayment });

  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats (bursar only)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payments = await readJsonFile(PAYMENTS_FILE);
    if (!payments) {
      return res.status(500).json({ error: 'Unable to access payment data' });
    }

    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.paymentDate === today);
    
    const stats = {
      todayTotal: todayPayments.reduce((sum, p) => sum + p.amount, 0),
      todayCount: todayPayments.length,
      totalPayments: payments.length,
      pendingCount: payments.filter(p => p.status === 'pending').length
    };

    res.json({ success: true, stats });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
async function startServer() {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`Franciscan School Portal Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
  });
}

startServer();