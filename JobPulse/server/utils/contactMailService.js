const nodemailer = require('nodemailer');

const CONTACT_TO = 'schatsafe@gmail.com';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const cleanText = (value = '') => String(value).trim().replace(/\r/g, '');

const getMailConfig = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || process.env.SMTP_USER,
  to: process.env.CONTACT_MAIL_TO || CONTACT_TO
});

const isContactEmailConfigured = () => {
  const config = getMailConfig();
  return Boolean(config.host && config.port && config.user && config.pass && config.from && config.to);
};

const createTransporter = () => {
  const config = getMailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
};

const buildContactEmail = ({ name, email, subject, message }) => {
  const safeName = cleanText(name);
  const safeEmail = cleanText(email);
  const safeSubject = cleanText(subject).replace(/\n/g, ' ').slice(0, 120);
  const safeMessage = cleanText(message);

  const text = [
    'New contact message from JobPulse_24/7',
    '',
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    `Subject: ${safeSubject}`,
    '',
    safeMessage
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 16px;color:#111827">New contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
      <p style="white-space:pre-wrap">${escapeHtml(safeMessage)}</p>
    </div>
  `;

  return {
    subject: `JobPulse contact: ${safeSubject}`,
    text,
    html,
    replyTo: safeEmail
  };
};

const sendContactEmail = async (payload) => {
  const config = getMailConfig();
  const transporter = createTransporter();
  const email = buildContactEmail(payload);

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: email.replyTo
  });
};

module.exports = {
  isContactEmailConfigured,
  sendContactEmail
};
