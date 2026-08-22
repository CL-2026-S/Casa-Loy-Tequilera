import { supabase, authorizeCron } from '../_utils/clients.js';
import { sendMaquilaFollowUpEmail } from '../_utils/emails.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // 1. Fetch leads registered yesterday (MX time) who haven't received follow-up email
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

    // 2. Loop through leads and send the follow-up email
    const results = [];
    for (const lead of leads) {
      if (!lead.email || !lead.name) {
        results.push({ id: lead.id, status: 'skipped', reason: 'Missing name or email' });
        continue;
      }

      console.log(`Sending maquila follow-up email to lead: ${lead.name} (${lead.email})`);
      const emailResult = await sendMaquilaFollowUpEmail(lead.name.trim(), lead.email.trim());

      if (emailResult.success) {
        // Mark lead as follow_up_sent in Supabase
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
