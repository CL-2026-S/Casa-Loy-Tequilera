import { supabase } from './_utils/clients.js';
import { sendJobApplicationEmail } from './_utils/emails.js';

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

  const { name, phone, email, cv_name, job_id } = req.body || {};

  if (!name || !phone || !email || !cv_name || !job_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud (nombre, telefono, correo, cv_name, job_id).' });
  }

  try {
    let dbSuccess = false;
    let applicationId = null;

    if (supabase) {
      const { data: newApp, error: insertError } = await supabase
        .from('job_applications')
        .insert({
          name,
          phone,
          email,
          cv_name,
          job_id
        })
        .select()
        .single();

      if (!insertError) {
        dbSuccess = true;
        applicationId = newApp.id;

        // Fetch job title if needed
        let jobTitle = "Postulación Espontánea";
        if (job_id && job_id !== 'spontaneous') {
          try {
            const { data: jobData } = await supabase
              .from('job_offers')
              .select('title_es')
              .eq('id', job_id)
              .maybeSingle();
            if (jobData && jobData.title_es) {
              jobTitle = jobData.title_es;
            }
          } catch (jobErr) {
            console.error("Error fetching job details for email:", jobErr);
          }
        }

        // Send notification email to HR
        try {
          await sendJobApplicationEmail({
            name,
            email,
            phone,
            cv_name,
            job_title: jobTitle
          });
        } catch (emailErr) {
          console.error("Error sending job application email:", emailErr);
        }
      } else {
        console.error("Could not insert into job_applications table. Error:", insertError.message);
        return res.status(500).json({ error: 'Error al registrar la solicitud en la base de datos.', details: insertError.message });
      }
    } else {
      console.warn("Supabase client not initialized.");
      return res.status(500).json({ error: 'Servicio de base de datos no disponible.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Solicitud de empleo registrada correctamente.',
      db_saved: dbSuccess,
      applicationId: applicationId
    });

  } catch (err) {
    console.error("Exception in careers application route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la solicitud.' });
  }
}
