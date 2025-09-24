import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      parentName,
      childName,
      appointmentEmail,
      appointmentPhone,
      childAge,
      preferredDate,
      preferredTime,
      visitPurpose,
      additionalInfo = '',
      appointmentHp
    } = req.body || {};

    // Honeypot check
    if (appointmentHp) {
      return res.status(200).json({ ok: true });
    }

    // Basic validation
    const missing = [];
    if (!parentName) missing.push('parentName');
    if (!childName) missing.push('childName');
    if (!appointmentEmail) missing.push('appointmentEmail');
    if (!appointmentPhone) missing.push('appointmentPhone');
    if (!childAge) missing.push('childAge');
    if (!preferredDate) missing.push('preferredDate');
    if (!preferredTime) missing.push('preferredTime');
    if (!visitPurpose) missing.push('visitPurpose');

    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // Build transporter for Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // info@franciscancnps.org
        pass: process.env.SMTP_PASS  // Zoho app password
      }
    });

    await transporter.verify();

    const subject = `[Appointment] ${preferredDate} ${preferredTime} — ${parentName} for ${childName}`;

    await transporter.sendMail({
      from: `"Website Appointments" <${process.env.SMTP_USER}>`,
      to: ['info@franciscancnps.org', 'admin@franciscancnps.org'],
      replyTo: appointmentEmail,
      subject,
      text: `Parent: ${parentName}\nChild: ${childName}\nEmail: ${appointmentEmail}\nPhone: ${appointmentPhone}\nChild Age: ${childAge}\nPreferred Date: ${preferredDate}\nPreferred Time: ${preferredTime}\nPurpose: ${visitPurpose}\n\nAdditional Info:\n${additionalInfo || 'N/A'}`,
      html: `
        <h3>New Appointment Request</h3>
        <p><strong>Parent:</strong> ${escapeHtml(parentName)}</p>
        <p><strong>Child:</strong> ${escapeHtml(childName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(appointmentEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(appointmentPhone)}</p>
        <p><strong>Child Age:</strong> ${escapeHtml(childAge)}</p>
        <p><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</p>
        <p><strong>Preferred Time:</strong> ${escapeHtml(preferredTime)}</p>
        <p><strong>Purpose:</strong> ${escapeHtml(visitPurpose)}</p>
        <p><strong>Additional Info:</strong><br/>${escapeHtml(additionalInfo).replace(/\n/g, '<br/>') || 'N/A'}</p>
      `
    });

    // Confirmation email to visitor
    await transporter.sendMail({
      from: `"Franciscan Catholic School" <${process.env.SMTP_USER}>`,
      to: appointmentEmail,
      subject: 'Your appointment request was received',
      text: `Hello ${parentName},\n\nThank you for booking an appointment with Franciscan Catholic Nursery and Primary School. We have received your request and will confirm shortly.\n\nDate: ${preferredDate}\nTime: ${preferredTime}\nPurpose: ${visitPurpose}\n\n--\nFranciscan Catholic CNPS`,
      html: `
        <p>Hello ${escapeHtml(parentName)},</p>
        <p>Thank you for booking an appointment with <strong>Franciscan Catholic Nursery and Primary School</strong>. We have received your request and will confirm shortly.</p>
        <p><strong>Date:</strong> ${escapeHtml(preferredDate)}<br/>
           <strong>Time:</strong> ${escapeHtml(preferredTime)}<br/>
           <strong>Purpose:</strong> ${escapeHtml(visitPurpose)}</p>
        <p>Best regards,<br/>Franciscan Catholic CNPS</p>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Appointment email failed', err);
    return res.status(500).json({ error: 'Appointment email failed' });
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