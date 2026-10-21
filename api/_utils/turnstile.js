// Cloudflare Turnstile Verification Utility

const DEFAULT_SECRET_KEY = '0x4AAAAAAFfZtP5JO_plCXek5_ZGQbIU9Uk';

export async function verifyTurnstileToken(token, req) {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || DEFAULT_SECRET_KEY;

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, error: 'missing-token' };
  }

  try {
    const clientIp =
      req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.headers?.['x-real-ip'] ||
      req?.socket?.remoteAddress ||
      '';

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('[Turnstile] Error verifying token with Cloudflare API:', err);
    return { success: false, error: err.message };
  }
}
