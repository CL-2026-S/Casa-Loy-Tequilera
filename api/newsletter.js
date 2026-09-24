import subscribeHandler from './_newsletter/subscribe.js';
import unsubscribeHandler from './_newsletter/unsubscribe.js';
import { supabase } from './_utils/clients.js';
import { getAuthUser, userHasRole } from './_utils/auth.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Retrieve all newsletter subscribers (Admin & Staff)
  if (req.method === 'GET') {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    if (!userHasRole(staffUser, 'admin', 'editor', 'viewer')) {
      return res.status(403).json({ error: 'Prohibido. No tiene permisos suficientes para ver suscriptores.' });
    }

    if (!supabase) {
      return res.status(200).json([]);
    }

    try {
      const { data: subscribers, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase fetch subscribers error:", error);
        return res.status(500).json({ error: 'Error al obtener suscriptores.' });
      }

      return res.status(200).json(subscribers || []);
    } catch (err) {
      console.error("Exception in GET subscribers:", err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  const action = req.query.action || (req.method === 'POST' ? 'subscribe' : 'unsubscribe');

  if (action === 'subscribe') {
    return subscribeHandler(req, res);
  } else {
    return unsubscribeHandler(req, res);
  }
}
