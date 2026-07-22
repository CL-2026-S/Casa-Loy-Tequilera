export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get country code from Vercel native headers
  const country = req.headers['x-vercel-ip-country'] || null;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;

  return res.status(200).json({
    country: country ? country.toUpperCase() : null,
    ip
  });
}
