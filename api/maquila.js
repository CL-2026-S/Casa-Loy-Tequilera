import { supabase } from './_utils/clients.js';
import { sendMaquilaLeadEmail } from './_utils/emails.js';
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

  const { action } = req.query || {};

  // 1. Action: Update Comments (POST)
  if (req.method === 'POST' && action === 'update_comments') {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    // Role check: admin, lead_maquila, editor are allowed
    if (!userHasRole(staffUser, 'lead_maquila', 'editor')) {
      return res.status(403).json({ error: 'Prohibido. No tiene permisos para editar comentarios.' });
    }

    const { id, comments } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'El ID del lead es obligatorio.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database client not initialized.' });
    }

    try {
      const { data, error } = await supabase
        .from('maquila_leads')
        .update({ comments: comments || '' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating maquila comments:", error);
        return res.status(500).json({ error: 'Error al actualizar los comentarios en la base de datos.' });
      }

      return res.status(200).json({ success: true, lead: data });
    } catch (err) {
      console.error("Exception in update maquila comments:", err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  // GET: Retrieve all maquila leads (Requires Authentication)
  if (req.method === 'GET') {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    // Role check: admin, lead_maquila, editor, viewer are allowed
    if (!userHasRole(staffUser, 'lead_maquila', 'editor', 'viewer')) {
      return res.status(403).json({ error: 'Prohibido. No tiene permisos suficientes para ver leads.' });
    }

    if (!supabase) {
      return res.status(200).json([]); // Fallback for dev without DB
    }

    try {
      const { data: leads, error: fetchError } = await supabase
        .from('maquila_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error("Supabase fetch maquila leads error:", fetchError);
        return res.status(500).json({ error: 'Error al obtener los leads de la base de datos.' });
      }

      return res.status(200).json(leads);
    } catch (err) {
      console.error("Exception in GET maquila leads:", err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
  }

  const { 
    name, 
    company, 
    email, 
    lada, 
    phone, 
    solution, 
    objective, 
    stage,
    comments,
    lead_type,
    origin,
    creation_mode 
  } = req.body || {};

  const isSolutions = origin === 'solutions' || origin === 'solutions_hub';
  const isGranel = origin === 'granel' || origin === 'bulk';
  const isManual = creation_mode === 'manual' || origin === 'manual';

  // Anti-Spam & Bot Protection (for public submissions)
  if (!isManual) {
    const spamCheck = checkIsSpamLead(req.body);
    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam] Bot lead rejected silently (${spamCheck.reason}): name="${name}", email="${email}", company="${company}"`);
      // Return simulated success so bots don't adapt or retry
      return res.status(200).json({
        success: true,
        message: 'Lead registrado correctamente.',
        leadId: 'spam-filtered'
      });
    }
  }

  // If manual creation, verify authentication and minimum fields
  if (isManual) {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    // Role check: admin, lead_maquila, editor are allowed to register manually
    if (!userHasRole(staffUser, 'lead_maquila', 'editor')) {
      return res.status(403).json({ error: 'Prohibido. No tiene permisos para registrar leads.' });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: Nombre, Email y Teléfono son requeridos.' });
    }
  } else if (isSolutions || isGranel) {
    // Solutions hub & Granel / Bulk inquiries
    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: Nombre, Empresa y Email son requeridos.' });
    }
  } else {
    // Public quiz validation
    if (!name || !company || !email || !lada || !phone || !solution || !objective || !stage) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en el formulario.' });
    }
  }

  // Fallback for local development if Supabase is not configured
  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock response in local development.");
      return res.status(200).json({
        success: true,
        message: 'Lead registrado localmente en modo desarrollo (Sin base de datos).'
      });
    }
    console.error("Supabase client is not initialized.");
    return res.status(500).json({
      error: 'Error de configuración del servidor. Las credenciales de base de datos no están listas.'
    });
  }

  try {
    // Save lead to Supabase
    const insertData = isManual ? {
      name,
      company: company || '',
      email,
      lada: lada || '',
      phone,
      solution: solution || '', // Servicio
      objective: objective || lead_type || '', // Lead Type fallback to objective
      stage: stage || '',
      comments: comments || '',
      lead_type: lead_type || '',
      origin: origin || 'manual',
      follow_up_sent: false
    } : {
      name,
      company,
      email,
      lada: lada || '',
      phone: phone || '',
      solution,
      objective: objective || '',
      stage: stage || '',
      comments: comments || '',
      lead_type: lead_type || '',
      origin: origin || 'quiz',
      follow_up_sent: false
    };

    const { data: newLead, error: insertError } = await supabase
      .from('maquila_leads')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("Supabase maquila lead insert error:", insertError);
      return res.status(500).json({ error: 'Error al guardar el lead en la base de datos.' });
    }

    // Send email notification via Resend ONLY for public quiz (manual leads get next-day follow-up)
    let emailSent = false;
    if (!isManual) {
      const emailResult = await sendMaquilaLeadEmail({
        name,
        company,
        email,
        lada,
        phone,
        solution,
        objective,
        stage
      });
      emailSent = emailResult.success;
    }

    return res.status(200).json({
      success: true,
      message: isManual ? 'Lead registrado correctamente (manual).' : 'Lead registrado y correos enviados correctamente (quiz).',
      leadId: newLead.id,
      email_sent: emailSent
    });

  } catch (err) {
    console.error("Exception in maquila lead route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el lead.' });
  }
}

/**
 * Intelligent Anti-Spam / Anti-Bot Detector
 * Analyzes Honeypot, Submission Velocity, and High-Entropy Gibberish patterns.
 */
function checkIsSpamLead(body) {
  const { name, company, email, solution, _hp, website_url, _render_time } = body || {};

  // 1. Honeypot check: If hidden field was filled by an automated bot
  const honeypotVal = _hp || website_url || body.website || body.company_website || body.fax_number;
  if (honeypotVal && String(honeypotVal).trim().length > 0) {
    return { isSpam: true, reason: 'honeypot_triggered' };
  }

  // 2. Submission velocity check: Submissions under 2 seconds are bots
  if (_render_time) {
    const elapsed = Date.now() - Number(_render_time);
    if (!isNaN(elapsed) && elapsed > 0 && elapsed < 2000) {
      return { isSpam: true, reason: 'submission_too_fast' };
    }
  }

  // 3. Name heuristic: Random character gibberish pattern (e.g. KHzeYZxtNaYDKiQvTkziVVp)
  if (name && typeof name === 'string') {
    const cleanName = name.trim();
    // Pattern: 13+ characters, no spaces, mixed uppercase and lowercase transitions
    if (!cleanName.includes(' ') && cleanName.length >= 13 && /[a-z]/.test(cleanName) && /[A-Z]/.test(cleanName)) {
      let caseTransitions = 0;
      for (let i = 0; i < cleanName.length - 1; i++) {
        const isUp1 = cleanName[i] === cleanName[i].toUpperCase();
        const isUp2 = cleanName[i + 1] === cleanName[i + 1].toUpperCase();
        if (isUp1 !== isUp2) caseTransitions++;
      }
      if (caseTransitions >= 3) {
        return { isSpam: true, reason: 'gibberish_name_detected' };
      }
    }
  }

  // 4. Email heuristic: Bot generators using massive dots in Gmail (e.g. kyla.n.o.h.o.ove.n.s.t.a.t1@gmail.com)
  if (email && typeof email === 'string') {
    const [localPart] = email.split('@');
    if (localPart) {
      const dotCount = (localPart.match(/\./g) || []).length;
      if (dotCount >= 3) {
        return { isSpam: true, reason: 'excessive_dots_in_email' };
      }
    }
  }

  // 5. Volume / Solution gibberish (e.g. Bulk Tequila - ldBCSPaRvuBOhwFicaYegBcg)
  if (solution && typeof solution === 'string') {
    const volMatch = solution.match(/Bulk Tequila - ([A-Za-z0-9]+)$/);
    if (volMatch && volMatch[1] && volMatch[1].length >= 15 && !volMatch[1].includes(' ')) {
      return { isSpam: true, reason: 'gibberish_volume_detected' };
    }
  }

  return { isSpam: false };
}

