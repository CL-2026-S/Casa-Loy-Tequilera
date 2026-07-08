import { supabase } from './_utils/clients.js';
import { sendMaquilaLeadEmail } from './_utils/emails.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { name, company, email, lada, phone, solution, objective, stage } = req.body || {};

  if (!name || !company || !email || !lada || !phone || !solution || !objective || !stage) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en el formulario.' });
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
    // 1. Save lead to Supabase
    const { data: newLead, error: insertError } = await supabase
      .from('maquila_leads')
      .insert({
        name,
        company,
        email,
        lada,
        phone,
        solution,
        objective,
        stage
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase maquila lead insert error:", insertError);
      return res.status(500).json({ error: 'Error al guardar el lead en la base de datos.' });
    }

    // 2. Send email notification via Resend
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

    return res.status(200).json({
      success: true,
      message: 'Lead registrado y correos enviados correctamente.',
      leadId: newLead.id,
      email_sent: emailResult.success
    });

  } catch (err) {
    console.error("Exception in maquila lead route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el lead.' });
  }
}
