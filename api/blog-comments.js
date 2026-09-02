import { supabase } from './_utils/clients.js';
import { getAuthUser, userHasRole } from './_utils/auth.js';

// In-memory fallback in case Supabase table is not migrated yet
const memoryCommentsStore = new Map();

// Sample authentic comments for initial engagement
const defaultCommentsBySlug = {
  "del-origen-a-tu-copa-la-historia-que-vive-en-cada-botella": [
    {
      id: "seed-1",
      post_slug: "del-origen-a-tu-copa-la-historia-que-vive-en-cada-botella",
      author_name: "Valeria Morales S.",
      author_email: "valeria.m@example.com",
      comment_text: "Fascinante crónica sobre la paciencia del agave. Visité recientemente la destilería y comprender el trabajo del jimador en vivo cambia por completo la apreciación de cada copa.",
      likes: 6,
      created_at: "2026-07-25T16:20:00.000Z"
    },
    {
      id: "seed-2",
      post_slug: "del-origen-a-tu-copa-la-historia-que-vive-en-cada-botella",
      author_name: "Dr. Fernando Cárdenas",
      author_email: "fernando.c@example.com",
      comment_text: "Excelente mención a la NOM y a la denominación de origen. La trazabilidad y la autenticidad son lo que verdaderamente posicionan a un tequila de ultra-lujo en el mundo.",
      likes: 4,
      created_at: "2026-07-26T10:45:00.000Z"
    }
  ]
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { slug, action } = req.query || {};

  // --- 1. GET Comments for an article ---
  if (req.method === 'GET') {
    if (!slug) {
      return res.status(400).json({ error: 'Parámetro slug es obligatorio.' });
    }

    let dbComments = [];
    let dbSuccess = false;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_comments')
          .select('id, post_slug, author_name, comment_text, likes, created_at')
          .eq('post_slug', slug)
          .eq('is_approved', true)
          .order('created_at', { ascending: true });

        if (!error && data) {
          dbComments = data;
          dbSuccess = true;
        } else if (error) {
          console.warn("blog_comments query notice:", error.message);
        }
      } catch (err) {
        console.warn("Exception querying blog_comments:", err.message);
      }
    }

    if (!dbSuccess) {
      // Fallback: in-memory store + seed comments
      const inMemory = memoryCommentsStore.get(slug) || [];
      const seeds = defaultCommentsBySlug[slug] || [];
      const combined = [...seeds, ...inMemory];
      return res.status(200).json(combined);
    }

    // If DB returned records, also merge any active in-memory comments not yet in DB
    const inMemory = memoryCommentsStore.get(slug) || [];
    const existingIds = new Set(dbComments.map(c => c.id));
    const toAppend = inMemory.filter(c => !existingIds.has(c.id));

    return res.status(200).json([...dbComments, ...toAppend]);
  }

  // --- 2. POST Comments or Likes ---
  if (req.method === 'POST') {
    // Action: Like a comment
    if (action === 'like') {
      const { commentId, postSlug } = req.body || {};
      if (!commentId) {
        return res.status(400).json({ error: 'commentId es requerido.' });
      }

      if (supabase) {
        try {
          const { data: current } = await supabase
            .from('blog_comments')
            .select('likes')
            .eq('id', commentId)
            .single();

          if (current) {
            await supabase
              .from('blog_comments')
              .update({ likes: (current.likes || 0) + 1 })
              .eq('id', commentId);
          }
        } catch (e) {
          console.warn("Could not update comment likes in Supabase:", e.message);
        }
      }

      // Update in-memory fallback
      if (postSlug && memoryCommentsStore.has(postSlug)) {
        const list = memoryCommentsStore.get(postSlug);
        const item = list.find(c => c.id === commentId);
        if (item) item.likes = (item.likes || 0) + 1;
      }

      return res.status(200).json({ success: true });
    }

    // Action: Create new comment
    const { post_slug, author_name, author_email, comment_text } = req.body || {};

    if (!post_slug || !author_name || !comment_text) {
      return res.status(400).json({
        error: 'post_slug, author_name y comment_text son obligatorios.'
      });
    }

    // Sanitization & trim
    const cleanName = String(author_name).trim().slice(0, 80);
    const cleanEmail = author_email ? String(author_email).trim().slice(0, 120) : null;
    const cleanText = String(comment_text).trim().slice(0, 1500);

    if (cleanName.length < 2 || cleanText.length < 3) {
      return res.status(400).json({
        error: 'El nombre o el comentario son demasiado cortos.'
      });
    }

    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      post_slug,
      author_name: cleanName,
      author_email: cleanEmail,
      comment_text: cleanText,
      likes: 0,
      is_approved: true,
      created_at: new Date().toISOString()
    };

    let savedInDb = false;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_comments')
          .insert({
            post_slug: newComment.post_slug,
            author_name: newComment.author_name,
            author_email: newComment.author_email,
            comment_text: newComment.comment_text,
            likes: 0,
            is_approved: true
          })
          .select()
          .single();

        if (!error && data) {
          savedInDb = true;
          newComment.id = data.id;
          newComment.created_at = data.created_at;
        } else if (error) {
          console.warn("Supabase insert blog_comments notice:", error.message);
        }
      } catch (err) {
        console.warn("Exception writing to blog_comments table:", err.message);
      }
    }

    // Cache in-memory for instant retrieval
    const existing = memoryCommentsStore.get(post_slug) || [];
    memoryCommentsStore.set(post_slug, [...existing, newComment]);

    return res.status(201).json({
      success: true,
      comment: newComment,
      persisted_in_db: savedInDb
    });
  }

  // --- 3. DELETE Comment (Admin only) ---
  if (req.method === 'DELETE') {
    const currentUser = getAuthUser(req);
    if (!currentUser || !userHasRole(currentUser, 'admin', 'editor')) {
      return res.status(403).json({ error: 'Permisos insuficientes para eliminar comentarios.' });
    }

    const { id, post_slug } = req.body || {};
    if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

    if (supabase) {
      try {
        await supabase.from('blog_comments').delete().eq('id', id);
      } catch (e) {
        console.warn("Could not delete from Supabase blog_comments:", e.message);
      }
    }

    if (post_slug && memoryCommentsStore.has(post_slug)) {
      const list = memoryCommentsStore.get(post_slug);
      memoryCommentsStore.set(post_slug, list.filter(c => c.id !== id));
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
