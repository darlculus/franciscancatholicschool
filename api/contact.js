const nodemailer = require('nodemailer');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function makeTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};

    // ── Appointment request ──────────────────────────────────────────────────
    if (body.type === 'appointment') {
      if (body.appointmentHp) return res.status(200).json({ ok: true });

      const { parentName, childName, appointmentEmail, appointmentPhone,
              childAge, preferredDate, preferredTime, visitPurpose, additionalInfo = '' } = body;

      const missing = ['parentName','childName','appointmentEmail','appointmentPhone',
                       'childAge','preferredDate','preferredTime','visitPurpose']
                       .filter(f => !body[f]);
      if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });

      const t = makeTransporter();
      await t.verify();

      await t.sendMail({
        from: `"Website Appointments" <${process.env.SMTP_USER}>`,
        to: ['info@franciscancnps.org', 'admin@franciscancnps.org'],
        replyTo: appointmentEmail,
        subject: `[Appointment] ${preferredDate} ${preferredTime} — ${parentName} for ${childName}`,
        html: `<h3>New Appointment Request</h3>
          <p><strong>Parent:</strong> ${escapeHtml(parentName)}</p>
          <p><strong>Child:</strong> ${escapeHtml(childName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(appointmentEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(appointmentPhone)}</p>
          <p><strong>Child Age:</strong> ${escapeHtml(childAge)}</p>
          <p><strong>Date:</strong> ${escapeHtml(preferredDate)}</p>
          <p><strong>Time:</strong> ${escapeHtml(preferredTime)}</p>
          <p><strong>Purpose:</strong> ${escapeHtml(visitPurpose)}</p>
          <p><strong>Additional Info:</strong><br/>${escapeHtml(additionalInfo).replace(/\n/g,'<br/>') || 'N/A'}</p>`
      });

      await t.sendMail({
        from: `"Franciscan Catholic School" <${process.env.SMTP_USER}>`,
        to: appointmentEmail,
        subject: 'Your appointment request was received',
        html: `<p>Hello ${escapeHtml(parentName)},</p>
          <p>Thank you for booking an appointment. We will confirm shortly.</p>
          <p><strong>Date:</strong> ${escapeHtml(preferredDate)}<br/>
             <strong>Time:</strong> ${escapeHtml(preferredTime)}<br/>
             <strong>Purpose:</strong> ${escapeHtml(visitPurpose)}</p>
          <p>Best regards,<br/>Franciscan Catholic CNPS</p>`
      });

      return res.status(200).json({ ok: true });
    }

    // ── Contact form (default) ───────────────────────────────────────────────
    if (body.contactHp) return res.status(200).json({ ok: true });

    const { fullName, email, subject, message } = body;
    if (!fullName || !email || !subject || !message)
      return res.status(400).json({ error: 'Missing required fields' });

    const t = makeTransporter();
    await t.verify();

    await t.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: ['info@franciscancnps.org', 'admin@franciscancnps.org'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(String(message)).replace(/\n/g,'<br/>')}</p>`
    });

    await t.sendMail({
      from: `"Franciscan Catholic School" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message',
      html: `<p>Hello ${escapeHtml(fullName)},</p>
        <p>Thank you for contacting Franciscan Catholic Nursery and Primary School. We will get back to you shortly.</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p>Best regards,<br/>Franciscan Catholic CNPS</p>`
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Email failed', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
};
