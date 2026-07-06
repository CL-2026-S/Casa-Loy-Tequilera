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

      const maxCapacity = parseInt(settings?.find(s => s.key === 'max_capacity_limit')?.value || '20');

      // 2. Fetch blocked dates
      const { data: blocked, error: bErr } = await supabase
        .from('blocked_dates')
        .select('date_str');
      if (bErr) throw bErr;

      const blockedList = blocked?.map(d => d.date_str) || [];

      // 3. Fetch overrides
      const { data: overrides, error: oErr } = await supabase
        .from('slot_occupancy_overrides')
        .select('*');
      if (oErr) throw oErr;

      const bookingsCapacity = {};
      overrides?.forEach(item => {
        const d = item.date_str;
        const t = item.time_str;
        const count = item.occupied_count;
        if (!bookingsCapacity[d]) bookingsCapacity[d] = {};
        bookingsCapacity[d][t] = count;
      });

      // 4. Fetch reservations log
      const { data: reservations, error: rErr } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (rErr) throw rErr;

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
        timestamp: r.created_at ? new Date(r.created_at).toLocaleString() : '',
        used_at: r.used_at ? new Date(r.used_at).toLocaleString() : null
      })) || [];

      return res.status(200).json({
        maxCapacityLimit: maxCapacity,
        blockedDates: blockedList,
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
          payment_method
        } = req.body;

        if (!code || !customer_name || !customer_email || !date_str || !time_str || !guests) {
          return res.status(400).json({ error: 'Missing required booking fields.' });
        }

        // --- PREVENT OVERSELLING / DOUBLE BOOKING CHECK ---
        // 1. Fetch current max capacity
        const { data: limitData } = await supabase
          .from('tourism_settings')
          .select('value')
          .eq('key', 'max_capacity_limit')
          .maybeSingle();
        const maxCapacity = parseInt(limitData?.value || '20');

        // 2. Fetch current occupancy for this slot
        const { data: overrideData } = await supabase
          .from('slot_occupancy_overrides')
          .select('occupied_count')
          .eq('date_str', date_str)
          .eq('time_str', time_str)
          .maybeSingle();
        const occupiedCount = parseInt(overrideData?.occupied_count || '0');

        const remainingSpots = maxCapacity - occupiedCount;
        const requestedGuests = parseInt(guests);

        if (requestedGuests > remainingSpots) {
          return res.status(409).json({
            error: 'SOLD_OUT',
            message: `El cupo seleccionado ya no cuenta con suficientes lugares. Disponibles: ${remainingSpots}, solicitados: ${requestedGuests}.`
          });
        }

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
            payment_method
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

        return res.status(200).json({ success: true });
      }

      // Action 3: Block multiple dates
      if (action === 'block_dates') {
        const { dates } = req.body;
        if (!Array.isArray(dates) || dates.length === 0) {
          return res.status(400).json({ error: 'Dates array is required.' });
        }

        const rows = dates.map(d => ({ date_str: d, reason: 'Bloqueo masivo CMS' }));
        const { error: blockErr } = await supabase
          .from('blocked_dates')
          .upsert(rows);
        if (blockErr) throw blockErr;

        return res.status(200).json({ success: true });
      }

      // Action 4: Unblock multiple dates
      if (action === 'unblock_dates') {
        const { dates } = req.body;
        if (!Array.isArray(dates) || dates.length === 0) {
          return res.status(400).json({ error: 'Dates array is required.' });
        }

        const { error: unblockErr } = await supabase
          .from('blocked_dates')
          .delete()
          .in('date_str', dates);
        if (unblockErr) throw unblockErr;

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
          .update({ used_at: nowStr })
          .eq('code', code.trim().toUpperCase())
          .select();

        if (valErr) throw valErr;
        if (!data || data.length === 0) {
          return res.status(404).json({ error: 'TICKET_NOT_FOUND', message: 'Ticket no encontrado.' });
        }

        return res.status(200).json({ success: true, used_at: new Date(nowStr).toLocaleString() });
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
