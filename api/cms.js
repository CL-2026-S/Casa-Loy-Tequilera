import { supabase } from './_utils/clients.js';
import { getAuthUser, auditLog } from './_utils/auth.js';

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

  const { type, action } = req.query || {};

  // 0. Detect Location handler (independent of Supabase database connection)
  if (req.method === 'GET' && type === 'detect-location') {
    const country = req.headers['x-vercel-ip-country'] || null;
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
    return res.status(200).json({
      country: country ? country.toUpperCase() : null,
      ip
    });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  try {
    // --- 1. GET Handlers (Publicly readable) ---
    if (req.method === 'GET') {
      // Fetch Banners
      if (type === 'banners') {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) throw error;
        return res.status(200).json(data);
      }

      // Fetch Featured Dishes (Top 3)
      if (type === 'dishes') {
        const { data, error } = await supabase
          .from('featured_dishes')
          .select('*')
          .order('dish_index', { ascending: true });
        if (error) throw error;
        return res.status(200).json(data);
      }

      // Fetch Job Listings
      if (type === 'jobs') {
        const { data, error } = await supabase
          .from('job_offers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }

      // Fetch Blog Posts
      if (type === 'blog') {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
      // Fetch Job Applications (Private: Admin or RH only)
      if (type === 'applications') {
        const currentUser = getAuthUser(req);
        if (!currentUser) {
          return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Inicia sesión para ver las postulaciones.' });
        }
        if (currentUser.role !== 'admin' && currentUser.role !== 'rh') {
          return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes permisos para ver las postulaciones.' });
        }

        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
      }

      return res.status(400).json({ error: 'Falta o es incorrecto el parámetro type.' });
    }

    // --- 2. POST Handlers (Requires auth and Editor/Admin role) ---
    if (req.method === 'POST') {
      const currentUser = getAuthUser(req);
      if (!currentUser) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Inicia sesión para realizar cambios.' });
      }

      const isJobsAction = action === 'save_job' || action === 'delete_job';
      const hasPermission = isJobsAction
        ? (currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'rh')
        : (currentUser.role === 'admin' || currentUser.role === 'editor');

      if (!hasPermission) {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes los permisos requeridos para realizar esta acción.' });
      }

      // Action: Update Banner
      if (action === 'update_banner') {
        const { id, page, type: bType, image_url, title_es, title_en, subtitle_es, subtitle_en, link_url, order_index } = req.body || {};
        if (!page || !bType || !image_url) {
          return res.status(400).json({ error: 'Página, tipo y url de imagen son obligatorios.' });
        }

        const bannerData = {
          page,
          type: bType,
          image_url,
          title_es,
          title_en,
          subtitle_es,
          subtitle_en,
          link_url,
          order_index: parseInt(order_index || '0', 10)
        };

        let dbRes;
        if (id) {
          dbRes = await supabase.from('banners').update(bannerData).eq('id', id);
        } else {
          dbRes = await supabase.from('banners').insert(bannerData);
        }

        if (dbRes.error) throw dbRes.error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          id ? 'update_banner' : 'create_banner',
          `Banner ${id ? 'actualizado' : 'creado'} para página: ${page}`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Delete Banner
      if (action === 'delete_banner') {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'delete_banner',
          `Banner eliminado ID: ${id}`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Update Featured Dishes (Top 3)
      if (action === 'update_dish') {
        const { dish_index, image_url, name_es, name_en, description_es, description_en } = req.body || {};
        if (!dish_index || !image_url || !name_es || !description_es) {
          return res.status(400).json({ error: 'Campos incompletos para actualizar platillo destacado.' });
        }

        const dishData = {
          dish_index: parseInt(dish_index, 10),
          image_url,
          name_es,
          name_en: name_en || name_es,
          description_es,
          description_en: description_en || description_es,
          authorized_by: currentUser.email, // Explicitly log user authorization
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('featured_dishes')
          .upsert(dishData, { onConflict: 'dish_index' });

        if (error) throw error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'update_dish',
          `Platillo Destacado ${dish_index} actualizado (${name_es}), autorizado por ${currentUser.email}`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Save Job Listing (Create or Update)
      if (action === 'save_job') {
        const {
          id, // text key e.g. 'kam'
          category,
          title_es, title_en,
          location_es, location_en,
          type_es, type_en,
          time_es, time_en,
          hero_desc_es, hero_desc_en,
          compensation_es, compensation_en,
          responsibilities,
          requirements,
          knowledge,
          benefits,
          is_active
        } = req.body || {};

        if (!id || !category || !title_es || !location_es || !type_es) {
          return res.status(400).json({ error: 'Faltan campos requeridos de la vacante.' });
        }

        const jobData = {
          id: id.toLowerCase().trim().replace(/\s+/g, '-'),
          category,
          title_es, title_en: title_en || title_es,
          location_es, location_en: location_en || location_es,
          type_es, type_en: type_en || type_es,
          time_es, time_en: time_en || time_es,
          hero_desc_es, hero_desc_en: hero_desc_en || hero_desc_es,
          compensation_es, compensation_en: compensation_en || compensation_es,
          responsibilities: responsibilities || [],
          requirements: requirements || [],
          knowledge: knowledge || [],
          benefits: benefits || [],
          is_active: is_active === undefined ? true : is_active
        };

        const { error } = await supabase
          .from('job_offers')
          .upsert(jobData, { onConflict: 'id' });

        if (error) throw error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'save_job',
          `Oferta de trabajo guardada ID: ${jobData.id} (${title_es})`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Delete Job Listing
      if (action === 'delete_job') {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

        const { error } = await supabase.from('job_offers').delete().eq('id', id);
        if (error) throw error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'delete_job',
          `Oferta de trabajo eliminada: ${id}`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Save Blog Post (Create or Update)
      if (action === 'save_blog') {
        const {
          id, // uuid if updating
          slug,
          title,
          description,
          category,
          label,
          image_url,
          body_es,
          body_en,
          author_es,
          author_en,
          seo_title,
          seo_description,
          seo_keywords
        } = req.body || {};

        if (!slug || !title || !description || !category || !label || !image_url) {
          return res.status(400).json({ error: 'Campos obligatorios del blog incompletos.' });
        }

        const blogData = {
          slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
          title,
          description,
          category,
          label,
          image_url,
          body_es: body_es || description,
          body_en: body_en || body_es || description,
          author_es: author_es || 'Casa Loy Tequilera',
          author_en: author_en || 'Casa Loy Tequilera',
          seo_title: seo_title || title,
          seo_description: seo_description || description,
          seo_keywords: seo_keywords || category
        };

        let dbRes;
        if (id) {
          dbRes = await supabase.from('blog_posts').update(blogData).eq('id', id);
        } else {
          dbRes = await supabase.from('blog_posts').insert(blogData);
        }

        if (dbRes.error) throw dbRes.error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          id ? 'update_blog' : 'create_blog',
          `Entrada de blog guardada: ${blogData.slug} (${title})`
        );

        return res.status(200).json({ success: true });
      }

      // Action: Delete Blog Post
      if (action === 'delete_blog') {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'delete_blog',
          `Entrada de blog eliminada ID: ${id}`
        );

        return res.status(200).json({ success: true });
      }

      // Action: AI Assist Blog Drafting (via Gemini or configured Webhook)
      if (action === 'ai_assist') {
        const { prompt, type: aiType } = req.body || {};
        if (!prompt) return res.status(400).json({ error: 'Prompt es obligatorio.' });

        let aiText = "";
        const webhookUrl = process.env.N8N_AI_WEBHOOK_URL;
        const geminiKey = process.env.GEMINI_API_KEY;

        if (webhookUrl) {
          // n8n Integration
          try {
            const apiRes = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, type: aiType || 'blog_content', user: currentUser.email })
            });
            if (apiRes.ok) {
              const data = await apiRes.json();
              aiText = data.text || data.output || JSON.stringify(data);
            } else {
              throw new Error("N8N webhook returned error status.");
            }
          } catch (e) {
            console.error("AI Assist webhook failed, falling back to mock generator:", e);
          }
        }

        // Fallback or Direct Gemini API Call if Key is set
        if (!aiText && geminiKey) {
          try {
            const systemInst = "Eres un redactor experto en marketing de ultra-lujo y cultura de tequila para Casa Loy. Escribe contenido premium.";
            const geminiPrompt = `${systemInst}\n\nRequerimiento: ${prompt}`;
            
            const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: geminiPrompt }] }]
              })
            });

            if (apiRes.ok) {
              const data = await apiRes.json();
              aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            } else {
              console.error("Gemini API call failed with status", apiRes.status);
            }
          } catch (e) {
            console.error("Gemini API call exception:", e);
          }
        }

        // Mock Fallback if no external service is configured or if they failed
        if (!aiText) {
          aiText = `[BORRADOR GENERADO CON ASISTENTE INTEGRADO]

Título Sugerido: La Esencia de Casa Loy y el Legado Agavero

Borrador del Post:
El cultivo del agave Weber azul en los Altos de Jalisco es mucho más que una actividad agrícola; es un ritual sagrado transmitido de generación en generación. En Casa Loy Tequilera, este proceso alcanza su máxima expresión artística.

La jima, realizada meticulosamente por manos expertas bajo el sol de Jalisco, marca el inicio de una transformación alquímica. Cocido lentamente en nuestros hornos de mampostería tradicional, el agave libera sus azúcares más profundos, sentando las bases de un tequila excepcional de ultra-lujo.

Este artículo explora detalladamente la conexión con nuestro terroir, las técnicas de fermentación orgánica, y la maduración en selectas barricas de roble blanco americano, invitándole a descubrir una experiencia sensorial inigualable en cada copa.

Metadatos SEO recomendados:
- Título SEO: Tradición y Legado del Tequila Premium | Casa Loy
- Descripción SEO: Descubre el arte detrás de la jima y destilación del agave premium de los Altos de Jalisco en la Hacienda Casa Loy.
- Keywords SEO: tequila de lujo, jima de agave, destilado premium, jalisco, casa loy.`;
        }

        return res.status(200).json({ success: true, text: aiText });
      }

      return res.status(400).json({ error: 'Acción de POST no válida.' });
    }

    return res.status(405).json({ error: 'Método no permitido.' });

  } catch (err) {
    console.error("CMS handler error:", err);
    return res.status(500).json({ error: err.message || 'Database execution error.' });
  }
}
