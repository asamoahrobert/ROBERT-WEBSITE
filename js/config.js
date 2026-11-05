/**
 * ====================================================================
 * PORTFOLIO RUNTIME CONFIGURATION
 * ====================================================================
 * Automatically routes contact submissions:
 * - On production domains (e.g. Vercel), uses "/api/contact"
 * - In local development, defaults to "http://localhost:5000/api/contact"
 */
if (
  typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  window.location.protocol !== 'file:'
) {
  window.CONTACT_API_URL = '/api/contact';
} else {
  window.CONTACT_API_URL = window.CONTACT_API_URL || 'http://localhost:5000/api/contact';
}
