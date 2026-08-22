import { supabase, authorizeInternal, authorizeCron, getSiteUrl } from './_utils/clients.js';
import { sendWelcomeEmail, sendMonthlyNewsletter, sendMaquilaFollowUpEmail } from './_utils/emails.js';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query || {};

  // 1. Welcome Email (Internal POST)
  if (action === 'welcome') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    if (!authorizeInternal(req)) {
      return res.status(401).json({ error: 'Unauthorized. Invalid or missing secret token.' });
    }

    const { email, subscriber_id } = req.body || {};
    if (!email || !subscriber_id) {
      return res.status(400).json({ error: 'Missing required fields: email and subscriber_id.' });
    }

    try {
      const siteUrl = getSiteUrl(req);
      const emailResult = await sendWelcomeEmail(email, subscriber_id, siteUrl);

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Failed to send welcome email.', 
          details: emailResult.error 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Welcome email sent and logged successfully.',
        messageId: emailResult.messageId
      });
    } catch (err) {
      console.error("Exception in welcome route handler:", err);
      return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el envío de bienvenida.' });
    }
  }

  // 2. Monthly Newsletter (Cron)
  if (action === 'monthly-newsletter') {
    if (!authorizeCron(req)) {
      return res.status(401).json({ error: 'Unauthorized. Invalid cron authentication.' });
    }

    if (!supabase) {
      console.error("Supabase client is not initialized.");
      return res.status(500).json({ error: 'Database client is not initialized.' });
    }

    try {
      const siteUrl = getSiteUrl(req);

      // Fetch active subscribers who want monthly newsletters
      const { data: subscribers, error: subError } = await supabase
        .from('subscribers')
        .select('id, email')
        .eq('status', 'active')
        .eq('monthly_newsletter', true);

      if (subError) {
        console.error("Error fetching subscribers:", subError);
        return res.status(500).json({ error: 'Failed to retrieve subscribers from database.' });
      }

      if (!subscribers || subscribers.length === 0) {
        return res.status(200).json({ 
          success: true, 
          message: 'No active subscribers found for monthly newsletter.' 
        });
      }

      // Fetch latest blog articles
      let articles = [];
      try {
        const { data: dbArticles, error: artError } = await supabase
          .from('blog_posts')
          .select('id, title, description, image_url, label')
          .order('published_at', { ascending: false })
          .limit(3);

        if (artError) {
          console.warn("Could not query blog_posts table. Falling back to default articles:", artError.message);
        } else if (dbArticles && dbArticles.length > 0) {
          articles = dbArticles.map(art => ({
            id: art.slug || art.id,
            title: art.title,
            desc: art.description,
            img: art.image_url,
            label: art.label
          }));
        }
      } catch (e) {
        console.warn("Exception checking blog_posts table, falling back to static articles:", e);
      }

      if (articles.length === 0) {
        articles = [
          {
            id: "arte-del-silencio",
            label: "PROCESOS",
            title: "El Arte del Silencio: Maduración en Roble Francés",
            desc: "Descubra cómo nuestras cavas subterráneas mantienen la temperatura perfecta para una oxigenación lenta y refinada del destilado.",
            img: "https://lh3.googleusercontent.com/aida/ADBb0uh4dGwXjbLHTgecXTm8Bi-8NOWTDevucS4vDq9ZMQiAu6hdSC8SAJMevu2-tJs_Ag_lhYuOAYXDv1Dj-54YWtU-Y-Zcy637TLjSkjFULKen-AT2TT-ZylpX7AcMFNfMZJ5d03_BVbr63c5YBHHKMKhS7vxqx-mLXxMl05D_iONiR6C5WpO6MZmhD4TcjFtuy87ehTETJFhgsBnaqEYplrelqS6IJVmvVJJVs50aaW6C2GYMrHgB0wqZ--A"
          },
          {
            id: "cocteleria-autor",
            label: "MIXOLOGÍA",
            title: "Coctelería de Autor: Raíces en el Vaso",
            desc: "Tres recetas exclusivas inspiradas en los sabores de Jalisco, diseñadas por nuestro Master Mixologist para este verano.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt4ez38_8y6O7q82S5pUHKrBMDARKa1AyVhEYuue2LigSr8goa5eR_yCnBb93NfzFRfSfZzCoX67d6ZJLM56YTsYyoNcLZ29D_4BIkuyEGmLZiN-ao-T0bSGmcXTIZY2fxOxFUvtPNiWdVSCrZg4hbIb1wQbABMWRn8EP5u-PZssoM6LO5wIK93BM5cpe_tlDS8ukj18tBIF6hOvwC2wrZd60YLJ0FoG0TkFz9lZadiytLlAL3vHe2ULbw_IB7H7FDRKTI_mRCaDnG"
          },
          {
            id: "maridaje-perfecto",
            label: "GASTRONOMÍA",
            title: "Maridaje Perfecto: El Alma de la Tierra en el Plato",
            desc: "Exploramos la conexión intrínseca entre los ingredientes locales y las notas de cata de nuestro tequila blanco.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaG7TEajQaw0SiKj4TxpB5DJ375bCbDGBbikv9JpykUVoGrw4jant4o2BS1vRLS4HTXF0PxJ_cyrhIo1YB_rPD_KkJGNnm2esDUvuqdFvv1vciH0b1NkQ3yxKiE-xPFsRIZBmUb_pW8R2OsnuTtHBbtnzlHiDbNnk5dhUMy268gnlSAoMefoI9gxQkrE1rl1tv1m32cCdeDSn6MLOoCs81u9cVB0FNnMnXN89Im37G_yj9n4uGOTyR9V_lyqlF6yAH0IdBvdO_gveb"
          }
        ];
      }

      const emailResult = await sendMonthlyNewsletter(subscribers, articles, siteUrl);

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Failed to distribute monthly newsletter.', 
          details: emailResult.error 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Monthly newsletter batch triggered successfully.',
        subscribers_contacted: subscribers.length,
        batches: emailResult.results
      });

    } catch (err) {
      console.error("Exception in monthly-newsletter route:", err);
      return res.status(500).json({ error: 'Ocurrió un error inesperado al procesar el boletín mensual.' });
    }
  }

  // 3. Maquila Follow-up (Cron)
  if (action === 'maquila-followup') {
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

  return res.status(400).json({ error: 'Invalid action.' });
}
