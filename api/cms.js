import { supabase } from './_utils/clients.js';
import { getAuthUser, auditLog, userHasRole } from './_utils/auth.js';

// Predefined authentic authors for Casa Loy
const defaultBlogAuthors = [
  {
    id: 'author-don-manuel',
    name: 'Don Manuel Loy',
    role: 'Patriarca & Guardián del Terroir',
    photo: '/Don Manuel Loy.webp',
    bio: 'Con más de cuatro décadas custodiando los campos de agave azul en Ayotlán, Don Manuel Loy transmite la maestría del tiempo, el fuego y la destilación de ultra-lujo.'
  },
  {
    id: 'author-sergio-chef',
    name: 'Sergio Chef',
    role: 'Chef Ejecutivo Restaurante 1937 Nativo',
    photo: '/Sergio Chef.webp',
    bio: 'Explorador culinario del maridaje con tequila y los ingredientes endémicos de Los Altos de Jalisco.'
  },
  {
    id: 'author-maestro-tequilero',
    name: 'Ing. Gabriel Lozano',
    role: 'Maestro Tequilero & Selección de Origen',
    photo: '/Empleado Jimador Casa Loy Tequilera.webp',
    bio: 'Especialista en fermentación pausada, destilación en alambiques de cobre y añejamiento en barricas de roble.'
  },
  {
    id: 'author-sommelier',
    name: 'Lic. Claudia Villarreal',
    role: 'Sommelier en Jefe Casa Loy',
    photo: '/Ejecutiva.webp',
    bio: 'Guía de catas sensoriales y defensora de la denominación de origen del tequila de alta gama.'
  }
];

let memoryAuthorsStore = [...defaultBlogAuthors];

async function uploadMediaFile(base64Data, filename, prefix = 'banner') {
  if (!base64Data) return null;
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const fileBuffer = Buffer.from(cleanBase64, 'base64');
    const extMatch = (filename || '').match(/\.([a-zA-Z0-9]+)$/);
    const fileExtension = extMatch ? extMatch[1].toLowerCase() : 'webp';
    const uniqueFileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    const mimeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      gif: 'image/gif'
    };
    const contentType = mimeMap[fileExtension] || `image/${fileExtension}`;

    let bucket = 'banners';
    let { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.warn(`Upload to '${bucket}' failed, trying 'cvs' bucket:`, error.message);
      bucket = 'cvs';
      const fallbackUpload = await supabase
        .storage
        .from(bucket)
        .upload(uniqueFileName, fileBuffer, {
          contentType,
          upsert: true
        });
      if (fallbackUpload.error) {
        throw fallbackUpload.error;
      }
    }

    const { data: publicUrlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error("Error in uploadMediaFile:", err);
    throw err;
  }
}

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

        // Ensure intelligent responsive and multilingual fallbacks
        const normalized = (data || []).map(b => {
          const dEs = b.image_desktop_es || b.image_url || '';
          const mEs = b.image_mobile_es || dEs;
          const dEn = b.image_desktop_en || dEs;
          const mEn = b.image_mobile_en || dEn || mEs;
          return {
            ...b,
            image_desktop_es: dEs,
            image_mobile_es: mEs,
            image_desktop_en: dEn,
            image_mobile_en: mEn,
            image_url: dEs || b.image_url
          };
        });

        return res.status(200).json(normalized);
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

      // Fetch Blog Authors
      if (type === 'blog_authors') {
        try {
          const { data, error } = await supabase
            .from('blog_authors')
            .select('*')
            .order('name', { ascending: true });

          if (!error && data && data.length > 0) {
            return res.status(200).json(data);
          }
        } catch (e) {
          console.warn("Could not query blog_authors table:", e.message);
        }

        return res.status(200).json(memoryAuthorsStore);
      }
      // Fetch Job Applications (Private: Admin or RH only)
      if (type === 'applications') {
        const currentUser = getAuthUser(req);
        if (!currentUser) {
          return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Inicia sesión para ver las postulaciones.' });
        }
        if (!userHasRole(currentUser, 'admin', 'rh')) {
          return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes permisos para ver las postulaciones.' });
        }

        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
      }

      // Fetch Points of Sale (CMS pos)
      if (type === 'pos') {
        const { data, error } = await supabase
          .from('points_of_sale')
          .select('*')
          .order('name', { ascending: true });

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
        ? userHasRole(currentUser, 'admin', 'editor', 'rh')
        : userHasRole(currentUser, 'admin', 'editor');

      if (!hasPermission) {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes los permisos requeridos para realizar esta acción.' });
      }

      // Action: Upload Banner Image
      if (action === 'upload_banner_image') {
        const { image_base64, filename } = req.body || {};
        if (!image_base64) {
          return res.status(400).json({ error: 'Falta la imagen en base64.' });
        }
        try {
          const publicUrl = await uploadMediaFile(image_base64, filename || 'banner.webp', 'banner');
          return res.status(200).json({ success: true, url: publicUrl });
        } catch (uploadErr) {
          return res.status(500).json({ error: 'Error al subir la imagen a almacenamiento: ' + uploadErr.message });
        }
      }

      // Action: Update Banner
      if (action === 'update_banner') {
        const {
          id,
          page,
          type: bType,
          title_es,
          title_en,
          subtitle_es,
          subtitle_en,
          button_text_es,
          button_text_en,
          link_url,
          order_index,
          is_active,
          // Image URLs
          image_desktop_es,
          image_mobile_es,
          image_desktop_en,
          image_mobile_en,
          image_url,
          // Base64 direct file uploads
          image_desktop_es_base64, image_desktop_es_name,
          image_mobile_es_base64, image_mobile_es_name,
          image_desktop_en_base64, image_desktop_en_name,
          image_mobile_en_base64, image_mobile_en_name
        } = req.body || {};

        if (!page) {
          return res.status(400).json({ error: 'La página del banner es obligatoria.' });
        }

        // Process any direct base64 image uploads
        let finalDesktopEs = image_desktop_es;
        if (image_desktop_es_base64) {
          finalDesktopEs = await uploadMediaFile(image_desktop_es_base64, image_desktop_es_name, 'banner_desk_es');
        }

        let finalMobileEs = image_mobile_es;
        if (image_mobile_es_base64) {
          finalMobileEs = await uploadMediaFile(image_mobile_es_base64, image_mobile_es_name, 'banner_mob_es');
        }

        let finalDesktopEn = image_desktop_en;
        if (image_desktop_en_base64) {
          finalDesktopEn = await uploadMediaFile(image_desktop_en_base64, image_desktop_en_name, 'banner_desk_en');
        }

        let finalMobileEn = image_mobile_en;
        if (image_mobile_en_base64) {
          finalMobileEn = await uploadMediaFile(image_mobile_en_base64, image_mobile_en_name, 'banner_mob_en');
        }

        // Fallback hierarchy:
        // 1. Primary image is Spanish desktop or legacy image_url or any available image
        const primaryImg = finalDesktopEs || finalMobileEs || image_url || finalDesktopEn || finalMobileEn;
        if (!primaryImg) {
          return res.status(400).json({ error: 'Debes proporcionar al menos una imagen (escritorio o celular).' });
        }

        // Responsive fallback: if mobile is omitted, use desktop
        const resolvedDesktopEs = finalDesktopEs || primaryImg;
        const resolvedMobileEs = finalMobileEs || resolvedDesktopEs;

        // Language fallback: if English is omitted, use Spanish
        const resolvedDesktopEn = finalDesktopEn || resolvedDesktopEs;
        const resolvedMobileEn = finalMobileEn || finalDesktopEn || resolvedMobileEs;

        const bannerData = {
          page,
          type: bType || 'main',
          title_es: title_es !== undefined ? title_es : '',
          title_en: title_en !== undefined ? title_en : (title_es || ''),
          subtitle_es: subtitle_es !== undefined ? subtitle_es : '',
          subtitle_en: subtitle_en !== undefined ? subtitle_en : (subtitle_es || ''),
          button_text_es: button_text_es !== undefined ? button_text_es : '',
          button_text_en: button_text_en !== undefined ? button_text_en : (button_text_es || ''),
          link_url: link_url !== undefined ? link_url : '',
          order_index: parseInt(order_index || '0', 10),
          is_active: is_active === undefined ? true : Boolean(is_active),
          image_desktop_es: resolvedDesktopEs,
          image_mobile_es: resolvedMobileEs,
          image_desktop_en: resolvedDesktopEn,
          image_mobile_en: resolvedMobileEn,
          image_url: resolvedDesktopEs // For backwards compatibility
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
          `Banner ${id ? 'actualizado' : 'creado'} para página: ${page} (${bannerData.title_es || 'Sin título'})`
        );

        return res.status(200).json({ success: true, banner: bannerData });
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
          is_active,
          image_url,
          image_base64,
          image_filename
        } = req.body || {};

        if (!id || !category || !title_es || !location_es || !type_es) {
          return res.status(400).json({ error: 'Faltan campos requeridos de la vacante.' });
        }

        let dbImageUrl = image_url;

        if (image_base64 && image_filename) {
          try {
            const fileBuffer = Buffer.from(image_base64, 'base64');
            const fileExtension = image_filename.split('.').pop() || 'jpg';
            const uniqueFileName = `job_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
            
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('cvs')
              .upload(uniqueFileName, fileBuffer, {
                contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
                upsert: true
              });

            if (uploadError) {
              console.error("Supabase Storage image upload error:", uploadError.message);
            } else {
              const { data: publicUrlData } = supabase
                .storage
                .from('cvs')
                .getPublicUrl(uniqueFileName);
              
              if (publicUrlData && publicUrlData.publicUrl) {
                dbImageUrl = publicUrlData.publicUrl;
              }
            }
          } catch (uploadExc) {
            console.error("Exception uploading job image to Supabase:", uploadExc);
          }
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
          is_active: is_active === undefined ? true : is_active,
          image_url: dbImageUrl || null
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
          author_photo,
          author_role,
          author_bio,
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
          author_photo: author_photo || '/Empleado Jimador Casa Loy Tequilera.webp',
          author_role: author_role || 'Maestro Tequilero & Selección de Origen',
          author_bio: author_bio || 'Guardián de la tradición centenaria y el terroir de Los Altos de Jalisco en Casa Loy.',
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

      // Action: Save Author
      if (action === 'save_author') {
        const { id, name, role, photo, bio } = req.body || {};
        if (!name || !role || !photo) {
          return res.status(400).json({ error: 'Nombre, cargo y foto son campos obligatorios.' });
        }

        const authorData = {
          name: name.trim(),
          role: role.trim(),
          photo: photo.trim(),
          bio: (bio || '').trim()
        };

        let authorId = id;
        if (id) {
          try {
            await supabase.from('blog_authors').update(authorData).eq('id', id);
          } catch (e) {
            console.warn("Supabase update blog_authors notice:", e.message);
          }
          // Update in-memory
          const idx = memoryAuthorsStore.findIndex(a => a.id === id);
          if (idx !== -1) {
            memoryAuthorsStore[idx] = { ...memoryAuthorsStore[idx], ...authorData };
          }
        } else {
          authorId = `auth_${Date.now()}`;
          try {
            const { data } = await supabase.from('blog_authors').insert(authorData).select().single();
            if (data?.id) authorId = data.id;
          } catch (e) {
            console.warn("Supabase insert blog_authors notice:", e.message);
          }
          memoryAuthorsStore.push({ id: authorId, ...authorData });
        }

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          id ? 'update_author' : 'create_author',
          `Autor guardado: ${name}`
        );

        return res.status(200).json({ success: true, author: { id: authorId, ...authorData } });
      }

      // Action: Delete Author
      if (action === 'delete_author') {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

        try {
          await supabase.from('blog_authors').delete().eq('id', id);
        } catch (e) {
          console.warn("Supabase delete blog_authors notice:", e.message);
        }

        memoryAuthorsStore = memoryAuthorsStore.filter(a => a.id !== id);

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'delete_author',
          `Autor eliminado ID: ${id}`
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
