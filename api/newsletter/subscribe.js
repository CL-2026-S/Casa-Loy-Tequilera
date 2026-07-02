import { supabase, getSiteUrl } from '../_utils/clients.js';
import { sendWelcomeEmail } from '../_utils/emails.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  // Parse input parameters
  const { email, source_page } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Un correo electrónico válido es obligatorio.' });
  }

  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock response in local development.");
      return res.status(200).json({ 
        success: true, 
        status: 'created', 
        message: 'Suscripción de desarrollo completada con éxito (Sin base de datos configurada).' 
      });
    }
    console.error("Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    return res.status(500).json({ 
      error: 'Error de configuración del servidor. Las credenciales de base de datos no están listas.' 
    });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const siteUrl = getSiteUrl(req);

    // 1. Check if subscriber already exists
    const { data: existingSub, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return res.status(500).json({ error: 'Error al verificar la base de datos.' });
    }

    if (existingSub) {
      if (existingSub.status === 'active') {
        // Already active. We return 200 with metadata
        return res.status(200).json({ 
          success: true, 
          status: 'already_subscribed', 
          message: 'Este correo electrónico ya está registrado.' 
        });
      } else {
        // Reactivate unsubscribed subscriber
        const { data: updatedSub, error: updateError } = await supabase
          .from('subscribers')
          .update({ 
            status: 'active',
            source_page: source_page || 'reactivation',
            created_at: new Date().toISOString() // Refresh signup date
          })
          .eq('id', existingSub.id)
          .select()
          .single();

        if (updateError) {
          console.error("Supabase update error:", updateError);
          return res.status(500).json({ error: 'Error al reactivar la suscripción.' });
        }

        // Log reactivation signup event
        await supabase.from('email_events').insert({
          subscriber_id: updatedSub.id,
          event_type: 'signup'
        });

        // Trigger welcome email immediately
        const emailResult = await sendWelcomeEmail(cleanEmail, updatedSub.id, siteUrl);

        return res.status(200).json({
          success: true,
          status: 'reactivated',
          message: 'Suscripción reactivada con éxito.',
          email_sent: emailResult.success
        });
      }
    }

    // 2. Create new subscriber
    const { data: newSub, error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: cleanEmail,
        source_page: source_page || 'unknown',
        status: 'active',
        welcome_email_sent: false,
        monthly_newsletter: true
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({ error: 'Error al guardar el suscriptor en la base de datos.' });
    }

    // 3. Log signup event
    await supabase.from('email_events').insert({
      subscriber_id: newSub.id,
      event_type: 'signup'
    });

    // 4. Send welcome email immediately (and await it before completing function)
    const emailResult = await sendWelcomeEmail(cleanEmail, newSub.id, siteUrl);

    return res.status(200).json({
      success: true,
      status: 'created',
      message: 'Suscripción completada con éxito. ¡Bienvenido a Casa Loy!',
      email_sent: emailResult.success
    });

  } catch (err) {
    console.error("Exception in subscribe route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la suscripción.' });
  }
}
