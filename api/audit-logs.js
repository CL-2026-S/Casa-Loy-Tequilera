import { supabase } from './_utils/clients.js';
import { getAuthUser } from './_utils/auth.js';

export default async function handler(req, res) {
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  try {
    const currentUser = getAuthUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Inicia sesión para continuar.' });
    }

    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Acceso exclusivo para el rol de Administrador.' });
    }

    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return res.status(200).json({ success: true, logs });

  } catch (err) {
    console.error("Audit log API error:", err);
    return res.status(500).json({ error: err.message || 'Database error fetching logs.' });
  }
}
