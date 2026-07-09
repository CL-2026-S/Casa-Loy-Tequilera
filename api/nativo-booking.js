import { supabase } from './_utils/clients.js';

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

  const { code, customer_name, customer_phone, guests, date_str, time_str, reason } = req.body || {};

  if (!code || !customer_name || !customer_phone || guests === undefined || !date_str || !time_str || !reason) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en la reservación.' });
  }

  // Fallback for local development if Supabase is not configured
  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock response in local development.");
      return res.status(200).json({
        success: true,
        message: 'Reserva registrada localmente en modo desarrollo (Sin base de datos).'
      });
    }
    console.error("Supabase client is not initialized.");
    return res.status(500).json({
      error: 'Error de configuración del servidor. Las credenciales de base de datos no están listas.'
    });
  }

  try {
    // Save reservation to Supabase
    const { data: newBooking, error: insertError } = await supabase
      .from('reservas_nativo')
      .insert({
        code,
        customer_name,
        customer_phone,
        guests: parseInt(guests, 10),
        date_str,
        time_str,
        reason
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase nativo reservation insert error:", insertError);
      if (insertError.code === '23505') {
        return res.status(409).json({ error: 'DUPLICATE_CODE', message: 'Esta reserva ya fue registrada.' });
      }
      return res.status(500).json({ error: 'Error al guardar la reserva en la base de datos.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Reservación registrada correctamente.',
      bookingId: newBooking.id
    });

  } catch (err) {
    console.error("Exception in nativo booking route:", err);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la reserva.' });
  }
}
