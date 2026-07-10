import { supabase } from './_utils/clients.js';
import { sendAlliancesLeadEmail } from './_utils/emails.js';

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

  const { name, company, email, lada, phone, market, message } = req.body || {};

  if (!name || !company || !email || !lada || !phone || !market) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en el formulario.' });
  }

  try {
    let dbSuccess = false;
    let leadId = null;

    // 1. Try to save lead to Supabase if client is active
    if (supabase) {
      try {
        const { data: newLead, error: insertError } = await supabase
          .from('alliances_leads')
          .insert({
            name,
            company,
            email,
            lada,
            phone,
            market,
            message: message || ''
          })
          .select()
          .single();

        if (!insertError) {
          dbSuccess = true;
          leadId = newLead.id;
        } else {
          console.warn("Could not insert into alliances_leads table, proceeding with email only. Error:", insertError.message);
        }
      } catch (dbErr) {
        console.warn("Supabase execution failed, proceeding with email only:", dbErr);
      }
    } else {
      console.warn("Supabase client not initialized, proceeding with email notification.");
    }

    // 2. Send email notification via Resend
    const emailResult = await sendAlliancesLeadEmail({
      name,
      company,
      email,
      lada,
      phone,
      market,
      message
    });

    return res.status(200).json({
      success: true,
      message: 'Solicitud registrada y notificaciones enviadas correctamente.',
      db_saved: dbSuccess,
      leadId: leadId,
      email_sent: emailResult.success
    });

  } catch (err) {
    console.error("Exception in alliances lead route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la solicitud.' });
  }
}
