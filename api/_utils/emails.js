import { resend, supabase, getFromEmail } from './clients.js';

/**
 * Sends a welcome email to a subscriber.
 * @param {string} email 
 * @param {string} subscriberId 
 * @param {string} siteUrl - base URL for links
 */
export async function sendWelcomeEmail(email, subscriberId, siteUrl) {
  if (!resend || !supabase) {
    console.warn("Resend or Supabase client not configured. Skipping welcome email.");
    return { success: false, error: "Clients not initialized" };
  }

  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?id=${subscriberId}`;
  const exploreUrl = `${siteUrl}/?utm_source=welcome_email&utm_medium=email&utm_campaign=welcome`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Casa Loy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #fcf9f3;
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #1c1c18;
          -webkit-font-smoothing: antialiased;
        }
        table {
          border-collapse: collapse;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #fcf9f3;
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .main-card {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e5e2dc;
          padding: 48px;
          box-sizing: border-box;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo {
          max-height: 48px;
          width: auto;
        }
        .content {
          font-size: 15px;
          line-height: 1.8;
          color: #2F403E;
          margin-bottom: 40px;
          text-align: center;
        }
        .welcome-title {
          font-family: 'Georgia', serif;
          font-size: 24px;
          color: #1c1c18;
          margin-top: 0;
          margin-bottom: 24px;
          font-weight: normal;
          letter-spacing: 0.03em;
        }
        .welcome-text {
          margin-bottom: 24px;
          color: #4a4a46;
        }
        .btn-wrapper {
          text-align: center;
          margin-bottom: 40px;
        }
        .cta-button {
          display: inline-block;
          background-color: #8C4723;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 32px;
          font-family: 'Montserrat', 'Helvetica', 'Arial', sans-serif;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          transition: background-color 0.3s ease;
        }
        .footer {
          text-align: center;
          font-family: 'Montserrat', 'Helvetica', 'Arial', sans-serif;
          font-size: 10px;
          color: #8C4723;
          letter-spacing: 0.05em;
          border-top: 1px solid #f0eee8;
          padding-top: 30px;
          margin-top: 20px;
        }
        .footer a {
          color: #8C4723;
          text-decoration: underline;
        }
        .footer-address {
          color: #1c1c18;
          opacity: 0.6;
          margin-top: 12px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%">
        <tr>
          <td>
            <div class="main-card">
              <div class="header">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Tequilera" class="logo">
              </div>
              <div class="content">
                <h1 class="welcome-title">Bienvenido a Casa Loy</h1>
                <p class="welcome-text">Ahora formas parte de una comunidad donde compartimos experiencias, historias, lanzamientos y la esencia de nuestra tradición tequilera.</p>
                <p class="welcome-text">Próximamente recibirás artículos seleccionados, novedades y experiencias exclusivas.</p>
              </div>
              <div class="btn-wrapper">
                <a href="${exploreUrl}" class="cta-button">Explorar Casa Loy</a>
              </div>
              <div class="footer">
                <p>Recibes este correo porque te suscribiste al newsletter de Casa Loy.</p>
                <p><a href="${unsubscribeUrl}">Darse de baja / Unsubscribe</a></p>
                <p class="footer-address">
                  Carretera Ayotlán–Atotonilco km 6.5, Las Villas, Jalisco.<br>
                  &copy; 2026 Casa Loy Tequilera. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const fromEmail = getFromEmail();
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Bienvenido a la comunidad Casa Loy',
      html: html,
    });

    if (error) {
      console.error("Resend API error sending welcome email:", error);
      return { success: false, error };
    }

    // Update welcome_email_sent to true in subscribers table
    await supabase
      .from('subscribers')
      .update({ welcome_email_sent: true })
      .eq('id', subscriberId);

    // Record welcome_email_sent event in email_events table
    await supabase
      .from('email_events')
      .insert({
        subscriber_id: subscriberId,
        event_type: 'welcome_email_sent',
      });

    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("Exception in sendWelcomeEmail:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends the monthly blog newsletter to a list of subscribers.
 * @param {Array<Object>} subscribers - array of subscriber records { id, email }
 * @param {Array<Object>} articles - array of articles { title, desc, img, id }
 * @param {string} siteUrl - base URL for links
 */
export async function sendMonthlyNewsletter(subscribers, articles, siteUrl) {
  if (!resend || !supabase) {
    console.warn("Clients not initialized. Skipping monthly newsletter.");
    return { success: false, error: "Clients not initialized" };
  }

  if (subscribers.length === 0) {
    return { success: true, message: "No subscribers to send to." };
  }

  // Get current Month/Year in Spanish
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentDate = new Date();
  const monthName = months[currentDate.getMonth()];
  const yearName = currentDate.getFullYear();
  const subject = `Novedades y Experiencias Casa Loy - ${monthName} ${yearName}`;

  // Generate articles HTML blocks
  let articlesHtml = "";
  articles.forEach(art => {
    const artUrl = `${siteUrl}/?page=blog-post&id=${art.id}&utm_source=monthly_newsletter&utm_medium=email`;
    articlesHtml += `
      <div style="margin-bottom: 40px; border-bottom: 1px solid #e5e2dc; padding-bottom: 30px; text-align: left;">
        ${art.img ? `<img src="${art.img}" alt="${art.title}" style="width: 100%; max-height: 250px; object-fit: cover; margin-bottom: 16px;">` : ""}
        <span style="font-family: 'Montserrat', sans-serif; font-size: 10px; color: #8C4723; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; display: block; margin-bottom: 8px;">${art.label || 'ARTÍCULO'}</span>
        <h3 style="font-family: 'Georgia', serif; font-size: 20px; color: #1c1c18; margin: 0 0 10px 0; font-weight: normal; line-height: 1.4;">${art.title}</h3>
        <p style="font-family: 'Georgia', serif; font-size: 14px; color: #4a4a46; line-height: 1.6; margin: 0 0 16px 0;">${art.desc}</p>
        <a href="${artUrl}" style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: bold; color: #8C4723; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em;">Leer artículo &rarr;</a>
      </div>
    `;
  });

  const fromEmail = getFromEmail();
  const blogUrl = `${siteUrl}/?page=blog&utm_source=monthly_newsletter&utm_medium=email`;

  const results = [];

  // Batch subscribers into groups of 100 (Resend Batch API limit)
  const batchSize = 100;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const chunk = subscribers.slice(i, i + batchSize);
    
    // Prepare individual emails for the batch
    const emailObjects = chunk.map(sub => {
      const unsubUrl = `${siteUrl}/api/newsletter/unsubscribe?id=${sub.id}`;
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { margin: 0; padding: 0; background-color: #fcf9f3; font-family: 'Georgia', 'Times New Roman', serif; color: #1c1c18; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #fcf9f3; padding-top: 40px; padding-bottom: 40px; }
            .main-card { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e2dc; padding: 48px; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { max-height: 40px; }
            .intro { font-size: 15px; line-height: 1.8; color: #1c1c18; text-align: center; margin-bottom: 40px; }
            .intro-title { font-family: 'Georgia', serif; font-size: 24px; font-weight: normal; margin-bottom: 12px; }
            .cta-button { display: inline-block; background-color: #8C4723; color: #ffffff !important; text-decoration: none; padding: 14px 32px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; }
            .footer { text-align: center; font-family: 'Montserrat', sans-serif; font-size: 10px; color: #8C4723; border-top: 1px solid #f0eee8; padding-top: 30px; margin-top: 40px; }
            .footer a { color: #8C4723; text-decoration: underline; }
            .footer-address { color: #1c1c18; opacity: 0.6; margin-top: 12px; }
          </style>
        </head>
        <body>
          <table class="wrapper" width="100%">
            <tr>
              <td>
                <div class="main-card">
                  <div class="header">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Tequilera" class="logo">
                  </div>
                  <div class="intro">
                    <h1 class="intro-title">${monthName} en Casa Loy</h1>
                    <p style="color: #4a4a46;">Le presentamos las últimas crónicas, lanzamientos y novedades de nuestro blog y experiencias exclusivas.</p>
                  </div>
                  
                  <!-- Articles Feed -->
                  ${articlesHtml}
                  
                  <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                    <a href="${blogUrl}" class="cta-button">Leer artículos</a>
                  </div>
                  
                  <div class="footer">
                    <p>Recibes este correo porque estás suscrito al boletín mensual de Casa Loy.</p>
                    <p><a href="${unsubUrl}">Darse de baja / Unsubscribe</a></p>
                    <p class="footer-address">
                      Carretera Ayotlán–Atotonilco km 6.5, Las Villas, Jalisco.<br>
                      &copy; 2026 Casa Loy Tequilera. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      return {
        from: fromEmail,
        to: [sub.email],
        subject: subject,
        html: emailHtml,
      };
    });

    try {
      // Send batch via Resend
      const { data, error } = await resend.batch.send(emailObjects);
      
      if (error) {
        console.error(`Error sending batch starting at index ${i}:`, error);
        results.push({ success: false, error });
        continue;
      }

      // Record events in Supabase for all subscribers in this chunk
      const eventRows = chunk.map(sub => ({
        subscriber_id: sub.id,
        event_type: 'newsletter_sent'
      }));

      await supabase.from('email_events').insert(eventRows);
      results.push({ success: true, count: chunk.length, batchId: data.id });
    } catch (err) {
      console.error(`Exception in batch sending starting at index ${i}:`, err);
      results.push({ success: false, error: err.message });
    }
  }

  return { success: true, results };
}
