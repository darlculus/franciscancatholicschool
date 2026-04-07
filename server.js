const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// ── Route every /api/* call to the matching api/*.js handler ──────────────────
const apiHandlers = [
  'login', 'change-password', 'teachers', 'classes', 'students',
  'attendance', 'admin-attendance', 'forgot-password', 'reset-password',
  'messages', 'contact', 'appointment'
];

apiHandlers.forEach(name => {
  const handler = require(`./api/${name}.js`);
  // Support GET, POST, PUT, DELETE, OPTIONS on each route
  app.all(`/api/${name}`, handler);
});

// ── Fallback: serve index.html for any non-API route ─────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log('   All API calls now use Supabase (same as live site)\n');
});
