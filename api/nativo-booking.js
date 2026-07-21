import { supabase, authorizeInternal } from './_utils/clients.js';
import { getAuthUser, auditLog } from './_utils/auth.js';
import { sendRestaurantBookingEmail } from './_utils/emails.js';

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

  if (!supabase) {
    console.error("Supabase client is not initialized in nativo booking.");
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  // --- 1. GET Handler (Administrators & Restaurant Managers only) ---
  if (req.method === 'GET') {
    try {
      const currentUser = getAuthUser(req);
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'restaurant_manager' && currentUser.role !== 'viewer')) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No tienes permisos para consultar las reservas de restaurante.' });
      }

      const { data, error } = await supabase
        .from('reservas_nativo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (err) {
      console.error("GET reservas_nativo error:", err);
      return res.status(500).json({ error: err.message || 'Error querying database.' });
    }
  }

  // --- 2. POST Handler ---
  if (req.method === 'POST') {
    const { action } = req.body || {};

    // Action A: Create Booking (Public or staff manual)
    if (action === 'create_booking' || !action) {
      const { code, customer_name, customer_phone, guests, date_str, time_str, reason } = req.body || {};

      if (!code || !customer_name || !customer_phone || guests === undefined || !date_str || !time_str || !reason) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en la reservación.' });
      }

      try {
        const { data: newBooking, error: insertError } = await supabase
          .from('reservas_nativo')
          .insert({
            code,
            customer_name,
            customer_phone,
            guests: parseInt(guests, 10),
            date_str,
            time_str,
            reason,
            status: 'Confirmada'
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

        // Trigger automatic confirmation email to 1937nativo@casaloy.com
        try {
          await sendRestaurantBookingEmail({
            code,
            customer_name,
            customer_phone,
            guests,
            date_str,
            time_str,
            reason
          });
        } catch (emailErr) {
          console.error("Error sending restaurant confirmation email:", emailErr);
        }

        // Optional Audit logging if created by a logged-in staff member
        const staff = getAuthUser(req);
        if (staff) {
          await auditLog(
            staff.userId,
            staff.email,
            staff.role,
            'create_restaurant_booking',
            `Reserva manual creada en restaurante: ${code} para ${customer_name}`
          );
        }

        return res.status(200).json({
          success: true,
          message: 'Reservación registrada correctamente.',
          bookingId: newBooking.id
        });

      } catch (err) {
        console.error("Exception in nativo booking insert:", err);
        return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la reserva.' });
      }
    }

    // Action B: Update Booking Status (Staff only: Admin / Restaurant Manager)
    if (action === 'update_status') {
      const currentUser = getAuthUser(req);
      const isInternal = authorizeInternal(req);

      if (!isInternal && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'restaurant_manager'))) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No tienes autorización para cambiar el estado de las reservas.' });
      }

      const { code, status } = req.body || {};
      if (!code || !status) {
        return res.status(400).json({ error: 'Code and status are required.' });
      }

      try {
        const { error } = await supabase
          .from('reservas_nativo')
          .update({ status })
          .eq('code', code.trim().toUpperCase());

        if (error) throw error;

        // Log to audit trail
        const activeUser = currentUser || { email: 'system', role: 'admin' };
        await auditLog(
          activeUser.userId,
          activeUser.email,
          activeUser.role,
          'update_restaurant_status',
          `Cambio de estado de reserva de restaurante ${code} a: ${status}`
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Exception updating restaurant booking status:", err);
        return res.status(500).json({ error: err.message || 'Error updating status.' });
      }
    }

    return res.status(400).json({ error: 'Acción no válida.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed.' });
}
