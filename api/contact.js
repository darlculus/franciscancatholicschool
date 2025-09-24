import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fullName, email, subject, message } = req.body || {};
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
      to: ['info@franciscancnps.org', 'admissions@franciscancnps.org'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Email send failed', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
}