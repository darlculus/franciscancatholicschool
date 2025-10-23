const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'franciscan_school_secret_2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-memory storage for production (replace with database in real deployment)
let users = {
  bursar: [
    {
      id: 'BUR001',
      username: 'bursar',
      password: '$2a$10$Q/7qypw5N6ZH.mr1tHv/4entiZxSlX1rr2VYHLwMIsqzEK/7FnE.i', // bursar123
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
      password: '$2a$10$d1etOkRJEikZSbFpqbksJ.Szhxb.sHnhxbY4rU3y/BY64DPiJ0txa', // admin123
      name: 'Rev. Fr. Principal',
      role: 'admin',
      email: 'admin@franciscancnps.org',
      active: true
    }
  ]
};

let payments = [];
let receipts = [];

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

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
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

    res.json({ success: true, payments });

  } catch (error) {
    console.error('Get payments error:', error);
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
    res.json({ success: true, payment: newPayment });

  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear payments (bursar only)
app.delete('/api/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
    }

    payments = [];
    res.json({ success: true, message: 'All payments cleared' });

  } catch (error) {
    console.error('Clear payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats (bursar only)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'bursar') {
      return res.status(403).json({ error: 'Access denied' });
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
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Franciscan School Portal Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});