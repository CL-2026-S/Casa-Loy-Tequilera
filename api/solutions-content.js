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

  // 1. GET: Fetch the content for a specific language
  if (req.method === 'GET') {
    const lang = req.query.lang || 'en';
    
    try {
      const { data, error } = await supabase
        .from('solutions_content')
        .select('content')
        .eq('lang', lang)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return res.status(200).json(data ? data.content : null);
    } catch (err) {
      console.error('Error fetching solutions_content:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  // 2. POST: Update the content (requires authentication and admin/lead_maquila role)
  if (req.method === 'POST') {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    if (!userHasRole(staffUser, 'lead_maquila')) {
      return res.status(403).json({ error: 'Permisos insuficientes para editar contenido de Soluciones.' });
    }

    const { lang, content } = req.body;
    
    if (!lang || !content) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos (lang, content).' });
    }

    try {
      const { error } = await supabase
        .from('solutions_content')
        .upsert({ 
          lang, 
          content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'lang' });

      if (error) {
        throw error;
      }

      return res.status(200).json({ success: true, message: 'Contenido actualizado correctamente.' });
    } catch (err) {
      console.error('Error updating solutions_content:', err);
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el contenido.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
