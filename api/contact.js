import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fullName, email, subject, message, contactHp } = req.body || {};

    // Honeypot check
    if (contactHp) {
      return res.status(200).json({ ok: true });
    }

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build transporter for Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // info@franciscancnps.org
        pass: process.env.SMTP_PASS  // App password from Zoho
      }
    });

    await transporter.verify();

    // Send to multiple recipients
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: ['info@franciscancnps.org', 'admin@franciscancnps.org'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(String(message)).replace(/\n/g, '<br/>')}</p>
      `
    });

    // Confirmation email to visitor
    await transporter.sendMail({
      from: `"Franciscan Catholic School" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message',
      text: `Hello ${fullName},\n\nThank you for contacting Franciscan Catholic Nursery and Primary School. We have received your message and will get back to you as soon as possible.\n\nSubject: ${subject}\n\n--\nFranciscan Catholic CNPS`,
      html: `
        <p>Hello ${escapeHtml(fullName)},</p>
        <p>Thank you for contacting <strong>Franciscan Catholic Nursery and Primary School</strong>. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p>Best regards,<br/>Franciscan Catholic CNPS</p>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Email send failed', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
}

// Simple HTML-escape to avoid any accidental markup injection
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}