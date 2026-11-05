/**
 * ====================================================================
 * PORTFOLIO CONTACT FORM BACKEND SERVER
 * ====================================================================
 * Express.js server providing a secure, rate-limited, and validated
 * POST /api/contact endpoint powered by Nodemailer and Gmail SMTP.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });
// Also fallback to root .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================================================================
// 1. SECURITY MIDDLEWARE
// ====================================================================

// Set HTTP security headers
app.use(helmet());

// Restrict request body size to 10kb
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Trust reverse proxies (Render, Railway, Heroku, etc.) for correct client IP detection
app.set('trust proxy', 1);

// Configure CORS
const allowedOriginsEnv = process.env.ALLOWED_ORIGIN || 'http://localhost:5500';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. server-to-server, curl, Postman) and local file:// origin
    if (!origin || origin === 'null') return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin) || isLocalhost) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
  maxAge: 86400, // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));

// ====================================================================
// 2. RATE LIMITING
// ====================================================================
// Limit to max 5 requests per IP per 15 minutes
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many messages sent from this IP. Please wait 15 minutes before trying again.',
  },
});

// ====================================================================
// 3. UTILITIES & SANITIZATION
// ====================================================================

/**
 * Escapes characters with special meaning in HTML to prevent XSS / HTML injection in email clients.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Lazily creates or returns the Nodemailer transporter.
 */
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass || pass.includes('your-16-char-app-password')) {
    throw new Error('EMAIL_USER and a valid 16-character EMAIL_APP_PASSWORD must be defined in .env.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, ''), // Strip any accidental spaces from 16-char app password
    },
  });
}

// ====================================================================
// 4. API ROUTES
// ====================================================================

// Health check endpoint (useful for Render/Railway monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Contact endpoint
app.post('/api/contact', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, message, company, website, _gotcha } = req.body;

    // ----------------------------------------------------------------
    // Anti-Spam: Honeypot check
    // If hidden fields are filled, silently return success and drop message
    // ----------------------------------------------------------------
    if (company || website || _gotcha) {
      console.log('[Honeypot Triggered] Silent success response returned to bot.');
      return res.status(200).json({
        success: true,
        message: "Message sent! I'll get back to you soon.",
      });
    }

    // ----------------------------------------------------------------
    // Server-Side Validation
    // ----------------------------------------------------------------
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Your name is required.' });
    }
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    }
    if (cleanName.length > 100) {
      return res.status(400).json({ success: false, error: 'Name must not exceed 100 characters.' });
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
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long.',
      });
    }
    if (cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Message must not exceed 3000 characters.',
      });
    }

    // Check credentials existence
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_APP_PASSWORD ||
      process.env.EMAIL_APP_PASSWORD.includes('your-16-char-app-password')
    ) {
      console.error('[Configuration Error] EMAIL_USER or EMAIL_APP_PASSWORD environment variable is missing or placeholder.');
      return res.status(500).json({
        success: false,
        error: 'Gmail App Password is not yet configured in server/.env. Please replace "your-16-char-app-password" with your 16-character Google App Password.',
      });
    }

    // Recipient email (fallback to EMAIL_USER if TO_EMAIL not specified)
    const recipientEmail = (process.env.TO_EMAIL || process.env.EMAIL_USER).trim();

    // ----------------------------------------------------------------
    // HTML Sanitization & Email Body Formatting
    // ----------------------------------------------------------------
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeMessageHtml = escapeHtml(cleanMessage).replace(/\r?\n/g, '<br>');
    const sentAt = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER.trim()}>`,
      to: recipientEmail,
      replyTo: cleanEmail, // Allows clicking 'Reply' directly to the visitor
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
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Portfolio Message</title>
        </head>
        <body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);" border="0" cellspacing="0" cellpadding="0">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 32px 28px; text-align: left;">
                      <div style="background-color: rgba(255, 255, 255, 0.2); width: 42px; height: 42px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 20px;">
                        📬
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">
                        New Portfolio Message
                      </h1>
                      <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 14px;">
                        Someone reached out via your portfolio website contact form.
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 28px;">
                      <!-- Visitor Meta Card -->
                      <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;" cellspacing="0" cellpadding="16">
                        <tr>
                          <td>
                            <div style="margin-bottom: 12px;">
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Sender Name</span>
                              <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${safeName}</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Email Address</span>
                              <a href="mailto:${safeEmail}" style="font-size: 15px; color: #4f46e5; text-decoration: underline; font-weight: 500;">${safeEmail}</a>
                            </div>
                            <div>
                              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Received At</span>
                              <span style="font-size: 13px; color: #64748b;">${sentAt} (UTC)</span>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Message Body -->
                      <div style="margin-bottom: 8px;">
                        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 8px;">Message Content</span>
                        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.65; color: #334155;">
                          ${safeMessageHtml}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #64748b;">
                        💡 You can reply directly to this email to respond to <strong>${safeName}</strong> (<a href="mailto:${safeEmail}" style="color: #4f46e5;">${safeEmail}</a>).
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

    // ----------------------------------------------------------------
    // Send Email via Nodemailer
    // ----------------------------------------------------------------
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    console.log(`[Success] Message sent from "${cleanName}" <${cleanEmail}> to <${recipientEmail}>.`);

    return res.status(200).json({
      success: true,
      message: "Message sent! I'll get back to you soon.",
    });
  } catch (error) {
    console.error('[Error] Failed to process contact submission:', error);

    // Provide clear troubleshooting error messages
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
});

// ====================================================================
// 5. ERROR HANDLING MIDDLEWARE
// ====================================================================

// Handle CORS errors gracefully
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Payload Too Large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload too large. Maximum request size is 10kb.',
    });
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Contact Server running on: http://localhost:${PORT}`);
  console.log(`📡 Contact Endpoint:          POST http://localhost:${PORT}/api/contact`);
  console.log(`🩺 Health Endpoint:           GET  http://localhost:${PORT}/api/health`);
  console.log(`🔒 Allowed CORS Origins:      ${allowedOrigins.join(', ')}`);
  console.log(`====================================================`);
});
