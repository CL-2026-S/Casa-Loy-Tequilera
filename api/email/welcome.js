import { authorizeInternal, getSiteUrl } from '../_utils/clients.js';
import { sendWelcomeEmail } from '../_utils/emails.js';

export default async function handler(req, res) {
  // Enable CORS for flexibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Security Check: Authorized internal calls only
  if (!authorizeInternal(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing secret token.' });
  }

  const { email, subscriber_id } = req.body || {};

  if (!email || !subscriber_id) {
    return res.status(400).json({ error: 'Missing required fields: email and subscriber_id.' });
  }

  try {
    const siteUrl = getSiteUrl(req);
    const emailResult = await sendWelcomeEmail(email, subscriber_id, siteUrl);

    if (!emailResult.success) {
      return res.status(500).json({ 
        error: 'Failed to send welcome email.', 
        details: emailResult.error 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent and logged successfully.',
      messageId: emailResult.messageId
    });
  } catch (err) {
    console.error("Exception in welcome route handler:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el envío de bienvenida.' });
  }
}
