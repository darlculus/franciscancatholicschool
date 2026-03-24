const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: 'Username is required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('username, email, full_name')
      .eq('username', username)
      .single();

    // Always respond the same way to prevent username enumeration
    if (error || !user || !user.email) {
      return res.json({ success: true, message: 'If that account exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Remove any existing token for this user, then insert new one
    await supabase.from('password_reset_tokens').delete().eq('username', username);
    await supabase.from('password_reset_tokens').insert({ token, username, expires_at: expiresAt });

    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Franciscan Catholic School" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.full_name},</p>
        <p>A password reset was requested for your account (<strong>${username}</strong>).</p>
        <p><a href="${resetUrl}" style="background:#8B4513;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset My Password</a></p>
        <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
        <p>— Franciscan Catholic Nursery and Primary School</p>
      `
    });

    res.json({ success: true, message: 'If that account exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to send reset email. Please contact the administrator.' });
  }
};
