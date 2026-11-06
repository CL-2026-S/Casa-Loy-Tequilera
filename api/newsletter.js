import subscribeHandler from './_newsletter/subscribe.js';
import unsubscribeHandler from './_newsletter/unsubscribe.js';
import { supabase, getSiteUrl } from './_utils/clients.js';
import { getAuthUser, userHasRole, logAuditAction } from './_utils/auth.js';
import { sendWelcomeEmail } from './_utils/emails.js';
import { verifyTurnstileToken } from './_utils/turnstile.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE,PATCH');
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

    if (!userHasRole(staffUser, 'admin', 'editor', 'viewer', 'lead_maquila')) {
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

  const action = req.body?.action || req.query.action || (req.method === 'POST' ? 'subscribe' : 'unsubscribe');

  // --- ADMIN CMS ACTIONS ON SUBSCRIBERS ---
  if (['admin_add', 'toggle_status', 'delete_subscriber', 'bulk_delete'].includes(action)) {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }
    if (!userHasRole(staffUser, 'admin', 'editor')) {
      return res.status(403).json({ error: 'Permisos insuficientes para administrar suscriptores.' });
    }
    if (!supabase) {
      return res.status(500).json({ error: 'Base de datos no conectada.' });
    }

    try {
      if (action === 'admin_add') {
        const cleanEmail = String(req.body?.email || '').trim().toLowerCase();
        const sourcePage = req.body?.source_page || 'manual_cms';
        const sendWelcome = Boolean(req.body?.send_welcome);

        if (!cleanEmail || !cleanEmail.includes('@')) {
          return res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
        }

        const { data: existing } = await supabase
          .from('subscribers')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        let subscriberRecord = null;
        if (existing) {
          const { data: updated, error: updErr } = await supabase
            .from('subscribers')
            .update({ status: 'active', source_page: sourcePage })
            .eq('id', existing.id)
            .select()
            .single();
          if (updErr) throw updErr;
          subscriberRecord = updated;
        } else {
          const { data: inserted, error: insErr } = await supabase
            .from('subscribers')
            .insert({
              email: cleanEmail,
              source_page: sourcePage,
              status: 'active',
              welcome_email_sent: false,
              monthly_newsletter: true
            })
            .select()
            .single();
          if (insErr) throw insErr;
          subscriberRecord = inserted;
        }

        if (sendWelcome && subscriberRecord) {
          const siteUrl = getSiteUrl(req);
          await sendWelcomeEmail(cleanEmail, subscriberRecord.id, siteUrl).catch(() => {});
        }

        await logAuditAction(staffUser, 'add_newsletter_subscriber', `Suscriptor agregado manualmente: ${cleanEmail}`);
        return res.status(200).json({ success: true, subscriber: subscriberRecord });
      }

      if (action === 'toggle_status') {
        const { id, status, monthly_newsletter } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID del suscriptor requerido.' });

        const updatePayload = {};
        if (status !== undefined) updatePayload.status = status;
        if (monthly_newsletter !== undefined) updatePayload.monthly_newsletter = Boolean(monthly_newsletter);

        const { data: updated, error: updErr } = await supabase
          .from('subscribers')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (updErr) throw updErr;

        await logAuditAction(staffUser, 'update_newsletter_subscriber', `Suscriptor ${updated.email} actualizado (${JSON.stringify(updatePayload)})`);
        return res.status(200).json({ success: true, subscriber: updated });
      }

      if (action === 'delete_subscriber') {
        const { id, email } = req.body || {};
        if (!id) return res.status(400).json({ error: 'ID del suscriptor requerido.' });

        const { error: delErr } = await supabase
          .from('subscribers')
          .delete()
          .eq('id', id);

        if (delErr) throw delErr;

        await logAuditAction(staffUser, 'delete_newsletter_subscriber', `Suscriptor eliminado: ${email || id}`);
        return res.status(200).json({ success: true, id });
      }

      if (action === 'bulk_delete') {
        const { ids } = req.body || {};
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ error: 'Lista de IDs requerida para eliminación masiva.' });
        }

        const { error: delErr } = await supabase
          .from('subscribers')
          .delete()
          .in('id', ids);

        if (delErr) throw delErr;

        await logAuditAction(staffUser, 'bulk_delete_newsletter_subscribers', `Eliminación masiva de ${ids.length} suscriptores del newsletter`);
        return res.status(200).json({ success: true, deletedCount: ids.length });
      }
    } catch (adminErr) {
      console.error("Admin newsletter action error:", adminErr);
      return res.status(500).json({ error: adminErr.message || 'Error al procesar la acción sobre suscriptores.' });
    }
  }

  if (action === 'subscribe') {
    const { email, _hp, company_fax, company_url, _render_time } = req.body || {};
    const honeypotVal = _hp || company_fax || company_url || req.body?.website || req.body?.url;
    if (honeypotVal && String(honeypotVal).trim().length > 0) {
      console.warn(`[Anti-Spam] Newsletter bot rejected silently (honeypot): ${email}`);
      return res.status(200).json({ success: true, status: 'created', message: 'Suscripción completada.' });
    }

    if (_render_time) {
      const elapsed = Date.now() - Number(_render_time);
      if (!isNaN(elapsed) && elapsed > 0 && elapsed < 2000) {
        console.warn(`[Anti-Spam] Newsletter bot rejected silently (velocity < 2s): ${email}`);
        return res.status(200).json({ success: true, status: 'created', message: 'Suscripción completada.' });
      }
    }

    const [localPart] = (email || '').split('@');
    if (localPart) {
      const dotCount = (localPart.match(/\./g) || []).length;
      if (dotCount >= 3) {
        console.warn(`[Anti-Spam] Newsletter bot rejected silently (excessive dots): ${email}`);
        return res.status(200).json({ success: true, status: 'created', message: 'Suscripción completada.' });
      }
    }

    // Cloudflare Turnstile Verification
    const cfToken = req.body?.cf_token || req.body?.turnstileToken || req.body?.['cf-turnstile-response'];
    if (cfToken) {
      const turnstileResult = await verifyTurnstileToken(cfToken, req);
      if (!turnstileResult.success) {
        console.warn(`[Anti-Spam] Cloudflare Turnstile rejected newsletter token: ${email}`);
        return res.status(200).json({ success: true, status: 'created', message: 'Suscripción completada.' });
      }
    } else {
      const isProd = process.env.NODE_ENV === 'production' || req.headers?.host?.includes('casaloy.com');
      const originHeader = req.headers?.origin || req.headers?.referer || '';
      if (isProd && (!originHeader || !originHeader.includes('casaloy.com'))) {
        console.warn(`[Anti-Spam] Direct newsletter API hit rejected without Turnstile: ${email}`);
        return res.status(200).json({ success: true, status: 'created', message: 'Suscripción completada.' });
      }
    }

    return subscribeHandler(req, res);
  } else {
    return unsubscribeHandler(req, res);
  }
}
