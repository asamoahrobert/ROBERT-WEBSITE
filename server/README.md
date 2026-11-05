# Portfolio Contact Form Backend Server

A secure, lightweight Node.js + Express backend service for handling contact form submissions with Gmail SMTP via Nodemailer.

## Features
- **Gmail SMTP (Nodemailer)**: Sends email notifications with visitor's message and sets `replyTo` to visitor's email.
- **Security & Spam Protection**:
  - Rate limiting (max 5 requests per IP per 15 minutes) using `express-rate-limit`
  - Hidden honeypot field detection (silently drops bot submissions)
  - HTML escaping to prevent XSS / HTML injection in email clients
  - JSON body size strictly capped at 10kb
  - `helmet` security headers & restricted CORS for `ALLOWED_ORIGIN`
- **Dual Email Formats**: Both plain-text and beautifully styled HTML versions.

---

## 🛠️ Environment Variables (.env)

Create a `.env` file in the `server` directory (copied from `.env.example`):

```ini
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
TO_EMAIL=your-email@gmail.com
ALLOWED_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,https://robert-asamoah.vercel.app
```

---

## 🚀 Running Locally

1. Open terminal in the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Or in development mode with automatic restarts:
   ```bash
   npm run dev
   ```

4. Verify health check:
   Open [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser.

---

## 🌐 Deploying to Cloud (Render or Railway)

### Deploying to Render:
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `EMAIL_USER`: your Gmail address
   - `EMAIL_APP_PASSWORD`: your 16-character Google App Password
   - `TO_EMAIL`: where you want to receive emails
   - `ALLOWED_ORIGIN`: `https://robert-asamoah.vercel.app` (and your local dev URLs)
6. Copy the deployed Render URL (e.g., `https://robert-backend.onrender.com`).
7. Update `js/config.js` in the frontend:
   ```javascript
   window.CONTACT_API_URL = "https://robert-backend.onrender.com/api/contact";
   ```
