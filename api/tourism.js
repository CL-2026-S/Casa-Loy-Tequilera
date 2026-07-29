import { supabase, authorizeInternal } from './_utils/clients.js';
import { sendBookingEmail } from './_utils/emails.js';
import { getAuthUser, auditLog } from './_utils/auth.js';

const getCurrentGuadalajaraTime = () => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    const dateParts = {};
    parts.forEach(part => {
      dateParts[part.type] = part.value;
    });
    return new Date(
      parseInt(dateParts.year),
      parseInt(dateParts.month) - 1,
      parseInt(dateParts.day),
      parseInt(dateParts.hour),
      parseInt(dateParts.minute),
      parseInt(dateParts.second)
    );
  } catch (e) {
    console.error("Timezone formatting error in backend, using local time:", e);
    return new Date();
  }
};

const isSlotBlocked = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return true;
  
  const dateParts = dateStr.split('-');
  if (dateParts.length !== 3) return true;
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);
  
  let hour = 0;
  let minute = 0;
  const timeUpper = timeStr.toUpperCase();
  const isPM = timeUpper.includes("PM");
  const isAM = timeUpper.includes("AM");
  
  const cleanTime = timeUpper.replace("AM", "").replace("PM", "").trim();
  const timeParts = cleanTime.split(':');
  if (timeParts.length >= 1) {
    hour = parseInt(timeParts[0], 10);
    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
  }
  if (timeParts.length >= 2) {
    minute = parseInt(timeParts[1], 10);
  }
  
  const slotDate = new Date(year, month, day, hour, minute, 0);
  const nowGdl = getCurrentGuadalajaraTime();
  
  const diffMs = slotDate.getTime() - nowGdl.getTime();
  const threeHoursMs = 3 * 60 * 60 * 1000;
  
  return diffMs < threeHoursMs;
};

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
    console.error("Supabase client is not initialized in serverless API.");
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  // GET handler: Fetch all current settings and logs
  if (req.method === 'GET') {
    try {
      // 1. Fetch settings
      const { data: settings, error: sErr } = await supabase
        .from('tourism_settings')
        .select('*');
      if (sErr) throw sErr;

      const maxCapacity = parseInt(settings?.find(s => s.key === 'max_capacity_limit')?.value || '50');

      // 2. Fetch blocked dates and slots
      const { data: blocked, error: bErr } = await supabase
        .from('blocked_dates')
        .select('date_str, time_str');
      if (bErr) throw bErr;

      const blockedList = blocked?.filter(d => d.time_str === 'ALL').map(d => d.date_str) || [];
      const blockedSlots = blocked?.filter(d => d.time_str !== 'ALL').map(d => ({ date_str: d.date_str, time_str: d.time_str })) || [];

      // 3. Fetch overrides
      const { data: overrides, error: oErr } = await supabase
        .from('slot_occupancy_overrides')
        .select('*');
      if (oErr) throw oErr;

      // 4. Fetch reservations log
      const { data: reservations, error: rErr } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (rErr) throw rErr;

      const bookingsCapacity = {};
      // Calculate capacity dynamically from active reservations
      reservations?.forEach(r => {
        if (r.status === 'Confirmada' || r.status === 'Completada') {
          const d = r.date_str;
          const t = r.time_str;
          const guests = parseInt(r.guests || '0');
          if (!bookingsCapacity[d]) bookingsCapacity[d] = {};
          bookingsCapacity[d][t] = (bookingsCapacity[d][t] || 0) + guests;
        }
      });

      // Merge with overrides if the overrides have higher counts (e.g. manual adjustments)
      overrides?.forEach(item => {
        const d = item.date_str;
        const t = item.time_str;
        const count = item.occupied_count;
        if (!bookingsCapacity[d]) bookingsCapacity[d] = {};
        if (count > (bookingsCapacity[d][t] || 0)) {
          bookingsCapacity[d][t] = count;
        }
      });

      const bookingsLog = reservations?.map(r => ({
        code: r.code,
        name: r.customer_name,
        email: r.customer_email,
        phone: r.customer_phone,
        packageName: r.tour_id === 'diamante' ? 'Experiencia Casa Loy Diamante' : r.tour_id === 'platino' ? 'Experiencia Casa Loy Platino' : 'Experiencia Casa Loy Oro',
        date: r.date_str,
        time: r.time_str,
        guests: r.guests,
        amount: r.total_paid,
        method: r.payment_method,
        timestamp: r.created_at ? new Date(r.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) : '',
        used_at: r.used_at ? new Date(r.used_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) : null,
        status: r.status || 'Confirmada',
        allergies: r.allergies || '',
        celebration: r.celebration || '',
        comments: r.comments || '',
        requires_invoice: r.requires_invoice || false,
        rfc: r.rfc || '',
        razon_social: r.razon_social || '',
        postal_code: r.postal_code || '',
        regimen_fiscal: r.regimen_fiscal || '',
        cfdi_use: r.cfdi_use || '',
        card_type: r.card_type || '',
        creation_mode: r.creation_mode || 'automatic',
        created_by: r.created_by || 'customer',
        invoice_sent: r.invoice_sent || false
      })) || [];

      return res.status(200).json({
        maxCapacityLimit: maxCapacity,
        blockedDates: blockedList,
        blockedSlots: blockedSlots,
        bookingsCapacity,
        bookingsLog
      });

    } catch (err) {
      console.error("GET tourism settings error:", err);
      return res.status(500).json({ error: err.message || 'Database query error.' });
    }
  }

  // POST handler: Perform mutations with validation
  if (req.method === 'POST') {
    const { action } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: 'Action parameter is required.' });
    }

    // Security Check: Enforce authorization for all admin mutations (actions other than create_booking and resend_email)
    let activeUser = { email: 'system', role: 'admin' };
    if (action !== 'create_booking' && action !== 'resend_email' && action !== 'confirm_booking') {
      const isInternal = authorizeInternal(req);
      const staffUser = getAuthUser(req);
      
      if (!isInternal && !staffUser) {
        return res.status(401).json({ 
          error: 'UNAUTHORIZED', 
          message: 'No tienes autorización para realizar esta acción administrativa.' 
        });
      }
      
      if (staffUser) {
        if (staffUser.role === 'cuentas_por_cobrar' && action !== 'update_invoice_sent') {
          return res.status(403).json({ 
            error: 'FORBIDDEN', 
            message: 'No tienes permisos para realizar esta acción (solo lectura de reservas).' 
          });
        }
        if (staffUser.role === 'viewer' || staffUser.role === 'visor') {
          return res.status(403).json({ 
            error: 'FORBIDDEN', 
            message: 'No tienes permisos para realizar modificaciones (solo lectura).' 
          });
        }
        activeUser = staffUser;
      }
    }

    try {
      // Action 1: Create Booking with transactional safety check
      if (action === 'create_booking') {
        const {
          code,
          customer_name,
          customer_email,
          customer_phone,
          tour_id,
          date_str,
          time_str,
          guests,
          total_paid,
          payment_method,
          allergies,
          celebration,
          comments,
          requires_invoice,
          rfc,
          razon_social,
          postal_code,
          regimen_fiscal,
          cfdi_use,
          card_type,
          status
        } = req.body;

        if (!code || !customer_name || !customer_email || !date_str || !time_str || !guests) {
          return res.status(400).json({ error: 'Missing required booking fields.' });
        }

        // Validate Guadalajara time & 3-hour cutoff rule
        if (isSlotBlocked(date_str, time_str)) {
          return res.status(409).json({
            error: 'SOLD_OUT',
            message: 'Este horario ya no está disponible por políticas de anticipación (mínimo 3 horas de antelación).'
          });
        }

        // Check if date or specific slot is blocked in database
        const { data: blockedCheck } = await supabase
          .from('blocked_dates')
          .select('time_str')
          .eq('date_str', date_str)
          .in('time_str', ['ALL', time_str]);

        if (blockedCheck && blockedCheck.length > 0) {
          return res.status(409).json({
            error: 'SOLD_OUT',
            message: 'Este horario o día ha sido bloqueado por la administración.'
          });
        }

        // --- PREVENT OVERSELLING / DOUBLE BOOKING CHECK ---
        // 1. Fetch current max capacity
        const { data: limitData } = await supabase
          .from('tourism_settings')
          .select('value')
          .eq('key', 'max_capacity_limit')
          .maybeSingle();
        const maxCapacity = parseInt(limitData?.value || '50');

        // 2. Fetch current occupancy for this slot dynamically from active reservations
        const { data: activeBookings } = await supabase
          .from('reservations')
          .select('guests')
          .eq('date_str', date_str)
          .eq('time_str', time_str)
          .in('status', ['Confirmada', 'Completada']);
        
        let occupiedCount = activeBookings?.reduce((sum, r) => sum + parseInt(r.guests || '0'), 0) || 0;

        // Fetch overrides for manual blocks
        const { data: overrideData } = await supabase
          .from('slot_occupancy_overrides')
          .select('occupied_count')
          .eq('date_str', date_str)
          .eq('time_str', time_str)
          .maybeSingle();
        const overrideCount = parseInt(overrideData?.occupied_count || '0');

        if (overrideCount > occupiedCount) {
          occupiedCount = overrideCount;
        }

        const remainingSpots = maxCapacity - occupiedCount;
        const requestedGuests = parseInt(guests);

        if (requestedGuests > remainingSpots) {
          return res.status(409).json({
            error: 'SOLD_OUT',
            message: `El cupo seleccionado ya no cuenta con suficientes lugares. Disponibles: ${remainingSpots}, solicitados: ${requestedGuests}.`
          });
        }

        const staffUser = getAuthUser(req);
        const creationMode = staffUser ? 'manual' : 'automatic';
        const createdBy = staffUser ? (staffUser.email || staffUser.name || 'admin') : 'customer';
        const finalStatus = status || 'Confirmada';

        // 3. Insert reservation
        const { error: insErr } = await supabase
          .from('reservations')
          .insert({
            code,
            customer_name,
            customer_email,
            customer_phone: customer_phone || '',
            tour_id,
            date_str,
            time_str,
            guests: requestedGuests,
            total_paid: parseFloat(total_paid || '0'),
            payment_method,
            allergies: allergies || '',
            celebration: celebration || '',
            comments: comments || '',
            requires_invoice: requires_invoice || false,
            rfc: rfc || '',
            razon_social: razon_social || '',
            postal_code: postal_code || '',
            regimen_fiscal: regimen_fiscal || '',
            cfdi_use: cfdi_use || '',
            card_type: card_type || null,
            creation_mode: creationMode,
            created_by: createdBy,
            status: finalStatus
          });

        if (insErr) {
          if (insErr.code === '23505') {
            return res.status(409).json({ error: 'DUPLICATE_CODE', message: 'Esta reserva ya fue registrada.' });
          }
          throw insErr;
        }

        // 4. Update occupancy atomically
        const newOccupiedCount = occupiedCount + requestedGuests;
        const { error: upsErr } = await supabase
          .from('slot_occupancy_overrides')
          .upsert({
            date_str,
            time_str,
            occupied_count: newOccupiedCount,
            updated_at: new Date().toISOString()
          });
        if (upsErr) throw upsErr;

        // 5. Send automated confirmation email using Resend
        if (finalStatus === 'Confirmada') {
          try {
            await sendBookingEmail(customer_email, {
              code,
              customer_name,
              tour_id,
              date_str,
              time_str,
              guests: requestedGuests,
              total_paid,
              payment_method: payment_method || '',
              allergies: allergies || '',
              celebration: celebration || '',
              comments: comments || '',
              requires_invoice: requires_invoice || false,
              rfc: rfc || '',
              razon_social: razon_social || '',
              postal_code: postal_code || '',
              regimen_fiscal: regimen_fiscal || '',
              cfdi_use: cfdi_use || ''
            });
          } catch (mailErr) {
            console.error("Resend automatic welcome mail failed:", mailErr);
          }
        }

        return res.status(200).json({ success: true, code });
      }

      // Action 2: Set General Capacity Limit
      if (action === 'set_capacity') {
        const { capacity } = req.body;
        if (capacity === undefined) {
          return res.status(400).json({ error: 'Capacity is required.' });
        }

        const { error: capErr } = await supabase
          .from('tourism_settings')
          .upsert({
            key: 'max_capacity_limit',
            value: String(capacity),
            updated_at: new Date().toISOString()
          });
        if (capErr) throw capErr;

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'set_capacity', `Aforo general cambiado a ${capacity}`);

        return res.status(200).json({ success: true });
      }

      // Action 3: Block multiple dates
      if (action === 'block_dates') {
        const { dates, time_str } = req.body;
        const targetTime = time_str || 'ALL';
        if (!Array.isArray(dates) || dates.length === 0) {
          return res.status(400).json({ error: 'Dates array is required.' });
        }

        const rows = dates.map(d => ({ date_str: d, time_str: targetTime, reason: 'Bloqueo masivo CMS' }));
        const { error: blockErr } = await supabase
          .from('blocked_dates')
          .upsert(rows);
        if (blockErr) throw blockErr;

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'block_dates', `Bloqueo de fechas: ${dates.join(', ')} para ${targetTime}`);

        return res.status(200).json({ success: true });
      }

      // Action 4: Unblock multiple dates
      if (action === 'unblock_dates') {
        const { dates, time_str } = req.body;
        if (!Array.isArray(dates) || dates.length === 0) {
          return res.status(400).json({ error: 'Dates array is required.' });
        }

        let query = supabase.from('blocked_dates').delete().in('date_str', dates);
        if (time_str) {
          query = query.eq('time_str', time_str);
        }

        const { error: unblockErr } = await query;
        if (unblockErr) throw unblockErr;

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'unblock_dates', `Desbloqueo de fechas: ${dates.join(', ')}${time_str ? ` para ${time_str}` : ''}`);

        return res.status(200).json({ success: true });
      }

      // Action 5: Set specific slot occupancy
      if (action === 'set_occupancy') {
        const { date_str, time_str, occupied_count } = req.body;
        if (!date_str || !time_str || occupied_count === undefined) {
          return res.status(400).json({ error: 'date_str, time_str, and occupied_count are required.' });
        }

        const { error: occErr } = await supabase
          .from('slot_occupancy_overrides')
          .upsert({
            date_str,
            time_str,
            occupied_count: parseInt(occupied_count),
            updated_at: new Date().toISOString()
          });
        if (occErr) throw occErr;

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'set_occupancy', `Ocupación para ${date_str} a las ${time_str} fijada en ${occupied_count}`);

        return res.status(200).json({ success: true });
      }

      // Action 6: Validate Ticket
      if (action === 'validate_ticket') {
        const { code } = req.body;
        if (!code) {
          return res.status(400).json({ error: 'Code is required.' });
        }

        const nowStr = new Date().toISOString();
        const { data, error: valErr } = await supabase
          .from('reservations')
          .update({ used_at: nowStr, status: 'Completada' })
          .eq('code', code.trim().toUpperCase())
          .select();

        if (valErr) throw valErr;
        if (!data || data.length === 0) {
          return res.status(404).json({ error: 'TICKET_NOT_FOUND', message: 'Ticket no encontrado.' });
        }

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'validate_ticket', `Entrada registrada para boleto ${code}`);

        return res.status(200).json({ success: true, used_at: new Date(nowStr).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) });
      }

      // Action 7: Bulk set capacities / occupancy
      if (action === 'bulk_set_occupancy') {
        const { slotOverrides } = req.body;
        if (!Array.isArray(slotOverrides) || slotOverrides.length === 0) {
          return res.status(400).json({ error: 'slotOverrides array is required.' });
        }

        const { error: bulkErr } = await supabase
          .from('slot_occupancy_overrides')
          .upsert(slotOverrides);
        if (bulkErr) throw bulkErr;

        await auditLog(activeUser.userId, activeUser.email, activeUser.role, 'bulk_set_occupancy', `Ocupación masiva establecida en ${slotOverrides.length} turnos`);

        return res.status(200).json({ success: true });
      }

      // Action 8: Resend Booking Confirmation Email
      if (action === 'resend_email') {
        const { code, email } = req.body;
        if (!code || !email) {
          return res.status(400).json({ error: 'Code and email are required.' });
        }

        const { data: ticket, error: tErr } = await supabase
          .from('reservations')
          .select('*')
          .eq('code', code.trim().toUpperCase())
          .maybeSingle();

        if (tErr) throw tErr;
        if (!ticket) {
          return res.status(404).json({ error: 'TICKET_NOT_FOUND', message: 'Reserva no encontrada.' });
        }

        const emailRes = await sendBookingEmail(email, {
          code: ticket.code,
          customer_name: ticket.customer_name,
          tour_id: ticket.tour_id,
          date_str: ticket.date_str,
          time_str: ticket.time_str,
          guests: ticket.guests,
          total_paid: ticket.total_paid,
          payment_method: ticket.payment_method || '',
          allergies: ticket.allergies || '',
          celebration: ticket.celebration || '',
          comments: ticket.comments || '',
          requires_invoice: ticket.requires_invoice || false,
          rfc: ticket.rfc || '',
          razon_social: ticket.razon_social || '',
          postal_code: ticket.postal_code || '',
          regimen_fiscal: ticket.regimen_fiscal || '',
          cfdi_use: ticket.cfdi_use || ''
        });

        if (!emailRes.success) {
          return res.status(500).json({ error: 'EMAIL_SEND_FAILED', message: emailRes.error });
        }

        return res.status(200).json({ success: true });
      }

      // Action 9: Update Booking Status
      if (action === 'update_status') {
        const { code, status } = req.body || {};
        if (!code || !status) {
          return res.status(400).json({ error: 'Code and status are required.' });
        }

        const updateData = { status };
        if (status === 'Completada') {
          updateData.used_at = new Date().toISOString();
        } else if (status === 'Confirmada') {
          updateData.used_at = null;
        }

        const { error } = await supabase
          .from('reservations')
          .update(updateData)
          .eq('code', code.trim().toUpperCase());

        if (error) throw error;

        await auditLog(
          activeUser.userId,
          activeUser.email,
          activeUser.role,
          'update_status',
          `Cambio de estado de reserva ${code} a: ${status}`
        );

        return res.status(200).json({ success: true });
      }

      // Action 10: Update Invoice Sent Status
      if (action === 'update_invoice_sent') {
        const { code, invoice_sent } = req.body || {};
        if (!code) {
          return res.status(400).json({ error: 'Code is required.' });
        }

        const { error } = await supabase
          .from('reservations')
          .update({ invoice_sent: !!invoice_sent })
          .eq('code', code.trim().toUpperCase());

        if (error) throw error;

        await auditLog(
          activeUser.userId,
          activeUser.email,
          activeUser.role,
          'update_invoice_sent',
          `Cambio de estado de factura para reserva ${code} a: ${invoice_sent ? 'Enviada' : 'Pendiente'}`
        );

        return res.status(200).json({ success: true });
      }

      // Action 11: Confirm Booking (transitions from 'Intento de Pago' to 'Confirmada')
      if (action === 'confirm_booking') {
        const { code } = req.body || {};
        if (!code) {
          return res.status(400).json({ error: 'Code is required.' });
        }

        const { data: booking, error: getErr } = await supabase
          .from('reservations')
          .select('*')
          .eq('code', code.trim().toUpperCase())
          .single();

        if (getErr || !booking) {
          return res.status(404).json({ error: 'Booking not found.' });
        }

        if (booking.status === 'Confirmada') {
          return res.status(200).json({ success: true });
        }

        const { error: updErr } = await supabase
          .from('reservations')
          .update({ status: 'Confirmada' })
          .eq('code', code.trim().toUpperCase());

        if (updErr) throw updErr;

        try {
          await sendBookingEmail(booking.customer_email, {
            code: booking.code,
            customer_name: booking.customer_name,
            tour_id: booking.tour_id,
            date_str: booking.date_str,
            time_str: booking.time_str,
            guests: booking.guests,
            total_paid: booking.total_paid,
            payment_method: booking.payment_method || '',
            allergies: booking.allergies || '',
            celebration: booking.celebration || '',
            comments: booking.comments || '',
            requires_invoice: booking.requires_invoice || false,
            rfc: booking.rfc || '',
            razon_social: booking.razon_social || '',
            postal_code: booking.postal_code || '',
            regimen_fiscal: booking.regimen_fiscal || '',
            cfdi_use: booking.cfdi_use || ''
          });
        } catch (mailErr) {
          console.error("Resend welcome email failed during confirm_booking:", mailErr);
        }

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid action.' });

    } catch (err) {
      console.error(`POST tourism ${action} error:`, err);
      return res.status(500).json({ error: err.message || 'Database execution error.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed.' });
}
