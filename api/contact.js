/**
 * ====================================================================
 * VERCEL SERVERLESS FUNCTION: /api/contact
 * ====================================================================
 * Handles contact form submissions on Vercel deployment with Nodemailer
 * and Gmail SMTP.
 */

const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message, company, website, _gotcha } = req.body || {};

    // Anti-spam honeypot
    if (company || website || _gotcha) {
      return res.status(200).json({
        success: true,
        message: "Message sent! I'll get back to you soon.",
      });
    }

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Your name is required.' });
    }
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    const cleanEmail = email.trim();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'A message is required.' });
    }
    const cleanMessage = message.trim();
    if (cleanMessage.length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
    }

    const emailUser = (process.env.EMAIL_USER || 'asamoahrobert241@gmail.com').trim();
    const emailPass = (process.env.EMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');
    const toEmail = (process.env.TO_EMAIL || emailUser).trim();

    if (!emailPass || emailPass.includes('your-16-char-app-password')) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured. Please add EMAIL_APP_PASSWORD in Vercel project environment variables.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeMessageHtml = escapeHtml(cleanMessage).replace(/\r?\n/g, '<br>');
    const sentAt = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${emailUser}>`,
      to: toEmail,
      replyTo: cleanEmail,
      subject: `New portfolio message from ${cleanName}`,
      text: `You have received a new message from your portfolio contact form:\n\n` +
        `Name: ${cleanName}\n` +
        `Email: ${cleanEmail}\n` +
        `Date: ${sentAt} (UTC)\n\n` +
        `Message:\n${cleanMessage}\n\n` +
        `---\nReply directly to this email to respond to ${cleanName}.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 32px 28px; text-align: left;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Portfolio Message</h1>
                      <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 14px;">Someone reached out via your portfolio website contact form.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 28px;">
                      <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;" cellspacing="0" cellpadding="16">
                        <tr>
                          <td>
                            <div style="margin-bottom: 12px;">
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px;">Sender Name</span>
                              <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${safeName}</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px;">Email Address</span>
                              <a href="mailto:${safeEmail}" style="font-size: 15px; color: #4f46e5; text-decoration: underline; font-weight: 500;">${safeEmail}</a>
                            </div>
                            <div>
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px;">Received At</span>
                              <span style="font-size: 13px; color: #64748b;">${sentAt} (UTC)</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div style="margin-bottom: 8px;">
                        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 8px;">Message Content</span>
                        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.65; color: #334155;">
                          ${safeMessageHtml}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0; font-size: 13px; color: #475569;">
                        💡 Direct reply: Hitting <strong>Reply</strong> responds directly to <strong>${safeName}</strong> (&lt;${safeEmail}&gt;).
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent! I'll get back to you soon.",
    });
  } catch (error) {
    console.error('[Error] Contact submission failed:', error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        error: 'Email authentication failed. Please verify EMAIL_USER and EMAIL_APP_PASSWORD.',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Unable to send message at this time. Please try again later or email me directly.',
    });
  }
};
