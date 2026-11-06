import { supabase } from './_utils/clients.js';
import { getAuthUser, userHasRole } from './_utils/auth.js';

// In-memory fallback in case database is unreachable
const memoryCommentsStore = new Map();
const VALID_REACTIONS = ['corazon', 'brindis', 'aplauso', 'fuego'];

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

  const { slug, action, all, include_stats } = req.query || {};

  // --- 1. GET Comments (for an article or all for Admin moderation) ---
  if (req.method === 'GET') {
    // Admin view: get all comments across all articles
    if (all === 'true') {
      const currentUser = getAuthUser(req);
      if (!currentUser || !userHasRole(currentUser, 'admin', 'editor')) {
        return res.status(403).json({ error: 'Permisos insuficientes.' });
      }

      if (supabase) {
        const { data, error } = await supabase
          .from('blog_comments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return res.status(200).json(data);
        }
      }
      return res.status(200).json([]);
    }

    if (!slug) {
      return res.status(400).json({ error: 'Parámetro slug es obligatorio.' });
    }

    let dbComments = [];
    let dbSuccess = false;
    let postStats = {
      views_count: 0,
      likes_count: 0,
      reactions: { corazon: 0, brindis: 0, aplauso: 0, fuego: 0 }
    };

    if (supabase) {
      try {
        const [commentsRes, postRes] = await Promise.all([
          supabase
            .from('blog_comments')
            .select('id, post_slug, parent_id, author_name, author_role_badge, comment_text, likes, is_pinned, created_at')
            .eq('post_slug', slug)
            .eq('is_approved', true)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: true }),
          supabase
            .from('blog_posts')
            .select('views_count, likes_count, reactions')
            .eq('slug', slug)
            .maybeSingle()
        ]);

        if (!commentsRes.error && commentsRes.data) {
          dbComments = commentsRes.data;
          dbSuccess = true;
        }
        if (!postRes.error && postRes.data) {
          postStats = {
            views_count: Number(postRes.data.views_count || 0),
            likes_count: Number(postRes.data.likes_count || 0),
            reactions: postRes.data.reactions || { corazon: 0, brindis: 0, aplauso: 0, fuego: 0 }
          };
        }
      } catch (err) {
        console.warn("Exception querying blog_comments / stats:", err.message);
      }
    }

    const inMemory = memoryCommentsStore.get(slug) || [];
    const existingIds = new Set(dbComments.map(c => c.id));
    const combinedComments = dbSuccess
      ? [...dbComments, ...inMemory.filter(c => !existingIds.has(c.id))]
      : inMemory;

    if (include_stats === 'true') {
      return res.status(200).json({
        comments: combinedComments,
        stats: {
          ...postStats,
          comments_count: combinedComments.length
        }
      });
    }

    return res.status(200).json(combinedComments);
  }

  // --- 2. POST Actions (View, React, Like Comment, Moderate, Create Comment) ---
  if (req.method === 'POST') {
    // Action A: Register real article view (increment views_count in blog_posts)
    if (action === 'view') {
      const targetSlug = req.body?.slug || slug;
      if (!targetSlug) {
        return res.status(400).json({ error: 'slug es requerido.' });
      }

      if (supabase) {
        try {
          const { data: post } = await supabase
            .from('blog_posts')
            .select('id, views_count, likes_count, reactions')
            .eq('slug', targetSlug)
            .maybeSingle();

          if (post) {
            const nextViews = Number(post.views_count || 0) + 1;
            const { data: updated } = await supabase
              .from('blog_posts')
              .update({ views_count: nextViews })
              .eq('id', post.id)
              .select('views_count, likes_count, reactions')
              .single();

            return res.status(200).json({
              success: true,
              views_count: updated ? Number(updated.views_count) : nextViews,
              likes_count: Number((updated || post).likes_count || 0),
              reactions: (updated || post).reactions || { corazon: 0, brindis: 0, aplauso: 0, fuego: 0 }
            });
          }
        } catch (err) {
          console.warn("Error incrementing blog view:", err.message);
        }
      }

      return res.status(200).json({ success: true, views_count: 1 });
    }

    // Action B: React to an article (persist reaction in blog_posts)
    if (action === 'react') {
      const { slug: postSlug, reactionType = 'corazon', delta = 1 } = req.body || {};
      const targetSlug = postSlug || slug;
      if (!targetSlug) {
        return res.status(400).json({ error: 'slug es requerido.' });
      }

      const cleanReaction = VALID_REACTIONS.includes(reactionType) ? reactionType : 'corazon';
      const step = Number(delta) < 0 ? -1 : 1;

      if (supabase) {
        try {
          const { data: post } = await supabase
            .from('blog_posts')
            .select('id, likes_count, reactions')
            .eq('slug', targetSlug)
            .maybeSingle();

          if (post) {
            const currentReactions = {
              corazon: 0,
              brindis: 0,
              aplauso: 0,
              fuego: 0,
              ...(post.reactions || {})
            };

            currentReactions[cleanReaction] = Math.max(0, Number(currentReactions[cleanReaction] || 0) + step);
            const totalLikes = Object.values(currentReactions).reduce((acc, v) => acc + Math.max(0, Number(v || 0)), 0);

            const { data: updated } = await supabase
              .from('blog_posts')
              .update({
                reactions: currentReactions,
                likes_count: totalLikes
              })
              .eq('id', post.id)
              .select('likes_count, reactions')
              .single();

            return res.status(200).json({
              success: true,
              likes_count: updated ? Number(updated.likes_count) : totalLikes,
              reactions: updated ? updated.reactions : currentReactions
            });
          }
        } catch (err) {
          console.warn("Error updating article reactions:", err.message);
        }
      }

      return res.status(200).json({ success: true });
    }

    // Action C: Like or Unlike a specific comment
    if (action === 'like') {
      const { commentId, postSlug, delta = 1 } = req.body || {};
      if (!commentId) {
        return res.status(400).json({ error: 'commentId es requerido.' });
      }

      const step = Number(delta) < 0 ? -1 : 1;
      let updatedLikes = null;

      if (supabase) {
        try {
          const { data: current } = await supabase
            .from('blog_comments')
            .select('likes')
            .eq('id', commentId)
            .single();

          if (current) {
            updatedLikes = Math.max(0, Number(current.likes || 0) + step);
            await supabase
              .from('blog_comments')
              .update({ likes: updatedLikes })
              .eq('id', commentId);
          }
        } catch (e) {
          console.warn("Could not update comment likes in Supabase:", e.message);
        }
      }

      if (postSlug && memoryCommentsStore.has(postSlug)) {
        const list = memoryCommentsStore.get(postSlug);
        const item = list.find(c => c.id === commentId);
        if (item) {
          item.likes = Math.max(0, (item.likes || 0) + step);
          if (updatedLikes === null) updatedLikes = item.likes;
        }
      }

      return res.status(200).json({ success: true, likes: updatedLikes });
    }

    // Action D: Moderate comment (Pin / Unpin / Approve / Hide - Admin/Editor only)
    if (action === 'moderate') {
      const currentUser = getAuthUser(req);
      if (!currentUser || !userHasRole(currentUser, 'admin', 'editor')) {
        return res.status(403).json({ error: 'Permisos insuficientes para moderar comentarios.' });
      }

      const { id, is_approved, is_pinned } = req.body || {};
      if (!id) return res.status(400).json({ error: 'ID es obligatorio.' });

      const updates = {};
      if (typeof is_approved === 'boolean') updates.is_approved = is_approved;
      if (typeof is_pinned === 'boolean') updates.is_pinned = is_pinned;

      if (supabase) {
        const { data, error } = await supabase
          .from('blog_comments')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, comment: data });
      }

      return res.status(200).json({ success: true });
    }

    // Action E: Create new comment or reply
    const {
      post_slug,
      parent_id,
      author_name,
      author_email,
      comment_text,
      website_hp
    } = req.body || {};

    // Honeypot anti-bot protection
    if (website_hp && String(website_hp).trim().length > 0) {
      return res.status(200).json({ success: true, ignored: true });
    }

    if (!post_slug || !author_name || !comment_text) {
      return res.status(400).json({
        error: 'post_slug, author_name y comment_text son obligatorios.'
      });
    }

    const cleanName = String(author_name).trim().slice(0, 80);
    const cleanEmail = author_email ? String(author_email).trim().slice(0, 120) : null;
    const cleanText = String(comment_text).trim().slice(0, 1500);
    const cleanParentId = parent_id ? String(parent_id).trim() : null;

    if (cleanName.length < 2 || cleanText.length < 2) {
      return res.status(400).json({
        error: 'El nombre o el comentario son demasiado cortos.'
      });
    }

    // Check if posted by an authenticated Admin/Editor for official Casa Loy badge
    const currentUser = getAuthUser(req);
    const isOfficialTeam = currentUser && userHasRole(currentUser, 'admin', 'editor');
    const roleBadge = isOfficialTeam ? 'Equipo Casa Loy' : null;

    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      post_slug,
      parent_id: cleanParentId,
      author_name: cleanName,
      author_email: cleanEmail,
      author_role_badge: roleBadge,
      comment_text: cleanText,
      likes: 0,
      is_approved: true,
      is_pinned: false,
      created_at: new Date().toISOString()
    };

    let savedInDb = false;

    if (supabase) {
      try {
        const insertPayload = {
          post_slug: newComment.post_slug,
          parent_id: newComment.parent_id,
          author_name: newComment.author_name,
          author_email: newComment.author_email,
          author_role_badge: newComment.author_role_badge,
          comment_text: newComment.comment_text,
          likes: 0,
          is_approved: true,
          is_pinned: false
        };

        const { data, error } = await supabase
          .from('blog_comments')
          .insert(insertPayload)
          .select('id, post_slug, parent_id, author_name, author_role_badge, comment_text, likes, is_pinned, created_at')
          .single();

        if (!error && data) {
          savedInDb = true;
          Object.assign(newComment, data);
        } else if (error) {
          console.warn("Supabase insert blog_comments notice:", error.message);
        }
      } catch (err) {
        console.warn("Exception writing to blog_comments table:", err.message);
      }
    }

    const existing = memoryCommentsStore.get(post_slug) || [];
    memoryCommentsStore.set(post_slug, [...existing, newComment]);

    return res.status(201).json({
      success: true,
      comment: newComment,
      persisted_in_db: savedInDb
    });
  }

  // --- 3. DELETE Comment (Admin/Editor only) ---
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
      memoryCommentsStore.set(post_slug, list.filter(c => c.id !== id && c.parent_id !== id));
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
