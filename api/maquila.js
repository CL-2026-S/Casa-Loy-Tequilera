import { supabase, authorizeCron } from './_utils/clients.js';
import { sendMaquilaLeadEmail, sendMaquilaFollowUpEmail } from './_utils/emails.js';
import { getAuthUser } from './_utils/auth.js';

// Get yesterday's date range in Mexico City timezone (UTC-6)
function getYesterdayRangeMX() {
  const mxNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  const mxYesterday = new Date(mxNow);
  mxYesterday.setDate(mxYesterday.getDate() - 1);
  
  const year = mxYesterday.getFullYear();
  const month = String(mxYesterday.getMonth() + 1).padStart(2, '0');
  const day = String(mxYesterday.getDate()).padStart(2, '0');
  
  const yesterdayYMD = `${year}-${month}-${day}`;
  
  return {
    startISO: `${yesterdayYMD}T00:00:00.000-06:00`,
    endISO: `${yesterdayYMD}T23:59:59.999-06:00`,
    yesterdayDateStr: yesterdayYMD
  };
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

  const { action } = req.query || {};

  // 1. Cron Job: Send follow-up emails to yesterday's leads
  if (action === 'followup') {
    // Security Check: Authorized cron triggers only
    if (!authorizeCron(req)) {
      return res.status(401).json({ error: 'Unauthorized. Invalid cron authentication.' });
    }

    if (!supabase) {
      console.error("Supabase client is not initialized.");
      return res.status(500).json({ error: 'Database client is not initialized.' });
    }

    try {
      const { startISO, endISO, yesterdayDateStr } = getYesterdayRangeMX();

      // Fetch leads registered yesterday (MX time) who haven't received follow-up email
      const { data: leads, error: fetchError } = await supabase
        .from('maquila_leads')
        .select('id, name, email, created_at')
        .eq('follow_up_sent', false)
        .gte('created_at', startISO)
        .lte('created_at', endISO);

      if (fetchError) {
        console.error("Error fetching yesterday's maquila leads:", fetchError);
        return res.status(500).json({ error: 'Failed to retrieve leads from database.' });
      }

      if (!leads || leads.length === 0) {
        return res.status(200).json({
          success: true,
          message: `No active maquila leads found from yesterday (${yesterdayDateStr}) pending follow-up.`
        });
      }

      const results = [];
      for (const lead of leads) {
        if (!lead.email || !lead.name) {
          results.push({ id: lead.id, status: 'skipped', reason: 'Missing name or email' });
          continue;
        }

        console.log(`Sending maquila follow-up email to lead: ${lead.name} (${lead.email})`);
        const emailResult = await sendMaquilaFollowUpEmail(lead.name.trim(), lead.email.trim());

        if (emailResult.success) {
          const { error: updateError } = await supabase
            .from('maquila_leads')
            .update({
              follow_up_sent: true,
              follow_up_sent_at: new Date().toISOString()
            })
            .eq('id', lead.id);

          if (updateError) {
            console.error(`Failed to update follow-up status for lead ID ${lead.id}:`, updateError);
            results.push({ id: lead.id, name: lead.name, email: lead.email, status: 'sent_but_failed_db_update', error: updateError });
          } else {
            results.push({ id: lead.id, name: lead.name, email: lead.email, status: 'success', messageId: emailResult.messageId });
          }
        } else {
          console.error(`Failed to send email to lead ${lead.email}:`, emailResult.error);
          results.push({ id: lead.id, name: lead.name, email: lead.email, status: 'failed', error: emailResult.error });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Finished processing maquila follow-up emails for yesterday (${yesterdayDateStr}).`,
        date_processed: yesterdayDateStr,
        total_leads: leads.length,
        results
      });

    } catch (err) {
      console.error("Exception in maquila-followup cron route:", err);
      return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el seguimiento de maquilas.' });
    }
  }

  // GET: Retrieve all maquila leads (Requires Authentication)
  if (req.method === 'GET') {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    // Role check: admin, lead_maquila, editor, viewer are allowed
    const allowedRoles = ['admin', 'lead_maquila', 'editor', 'viewer'];
    if (!allowedRoles.includes(staffUser.role)) {
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
    creation_mode 
  } = req.body || {};

  const isManual = creation_mode === 'manual';

  // If manual creation, verify authentication and minimum fields
  if (isManual) {
    const staffUser = getAuthUser(req);
    if (!staffUser) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    // Role check: admin, lead_maquila, editor are allowed to register manually
    const allowedRoles = ['admin', 'lead_maquila', 'editor'];
    if (!allowedRoles.includes(staffUser.role)) {
      return res.status(403).json({ error: 'Prohibido. No tiene permisos para registrar leads.' });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: Nombre, Email y Teléfono son requeridos.' });
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
      follow_up_sent: false
    } : {
      name,
      company,
      email,
      lada,
      phone,
      solution,
      objective,
      stage,
      comments: '',
      lead_type: '',
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
