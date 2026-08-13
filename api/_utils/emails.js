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
  const currentDate = (() => {
    try {
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
    } catch (e) {
      return new Date();
    }
  })();
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

/**
 * Sends a confirmation email for a booking, containing the QR ticket.
 * @param {string} email 
 * @param {object} bookingDetails 
 */
export async function sendBookingEmail(email, bookingDetails) {
  if (!resend) {
    console.warn("Resend client not configured. Skipping booking email.");
    return { success: false, error: "Resend not initialized" };
  }

  const { 
    code, 
    customer_name, 
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
    cfdi_use
  } = bookingDetails;
  
  const tourName = tour_id === 'diamante' ? 'Experiencia Casa Loy Diamante' : tour_id === 'platino' ? 'Experiencia Casa Loy Platino' : 'Experiencia Casa Loy Oro';
  const qrLink = `https://casaloy.com/?code=${code}&package=${encodeURIComponent(tourName)}&date=${date_str}&time=${encodeURIComponent(time_str)}&guests=${guests}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrLink)}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu Boleto de Acceso - Casa Loy</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #fcf9f3;
          font-family: 'Montserrat', sans-serif;
          color: #1c1c18;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #fcf9f3;
          padding: 40px 0;
        }
        .card {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e5e2dc;
          padding: 40px;
          box-sizing: border-box;
          text-align: center;
        }
        .logo {
          max-height: 48px;
          width: auto;
          margin-bottom: 30px;
        }
        .title {
          font-family: 'Georgia', serif;
          font-size: 22px;
          color: #7d3f0f;
          margin-top: 0;
          margin-bottom: 10px;
          font-weight: normal;
          letter-spacing: 0.02em;
        }
        .subtitle {
          font-size: 14px;
          color: #53443a;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .qr-container {
          background-color: #fcf9f3;
          border: 1px dashed #d9c2b6;
          padding: 24px;
          margin-bottom: 30px;
          display: inline-block;
        }
        .qr-img {
          width: 180px;
          height: 180px;
          border: 4px solid #ffffff;
        }
        .code-text {
          display: block;
          font-family: monospace;
          font-size: 16px;
          font-weight: bold;
          color: #7d3f0f;
          margin-top: 12px;
          letter-spacing: 0.05em;
        }
        .details-table {
          width: 100%;
          border-top: 1px solid #f0eee8;
          margin-top: 20px;
          padding-top: 20px;
          font-size: 13px;
          text-align: left;
        }
        .details-row {
          padding: 8px 0;
        }
        .details-label {
          color: #867369;
          font-weight: bold;
        }
        .details-value {
          color: #1c1c18;
          text-align: right;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #f0eee8;
          padding-top: 24px;
          font-size: 11px;
          color: #867369;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%">
        <tr>
          <td>
            <div class="card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Tequilera" class="logo">
              <h1 class="title">¡Tu Reserva está Confirmada!</h1>
              <p class="subtitle">Hola <strong>${customer_name}</strong>, gracias por tu compra. Presenta el siguiente boleto digital en la entrada el día de tu visita.</p>
              
              <div class="qr-container">
                <img src="${qrCodeUrl}" alt="Código QR de Acceso" class="qr-img">
                <span class="code-text">${code}</span>
              </div>
              
              <table class="details-table" width="100%">
                <tr>
                  <td class="details-row details-label">Experiencia:</td>
                  <td class="details-row details-value"><strong>${tourName}</strong></td>
                </tr>
                <tr>
                  <td class="details-row details-label">Fecha:</td>
                  <td class="details-row details-value">${date_str}</td>
                </tr>
                <tr>
                  <td class="details-row details-label">Horario:</td>
                  <td class="details-row details-value">${time_str}</td>
                </tr>
                <tr>
                  <td class="details-row details-label">Visitantes:</td>
                  <td class="details-row details-value">${guests}</td>
                </tr>
                <tr>
                  <td class="details-row details-label">Total pagado:</td>
                  <td class="details-row details-value"><strong>$${total_paid} MXN</strong></td>
                </tr>
                <tr>
                  <td class="details-row details-label">Método de Pago:</td>
                  <td class="details-row details-value">${payment_method || 'No especificado'}</td>
                </tr>
                ${allergies ? `
                <tr>
                  <td class="details-row details-label">Alergias:</td>
                  <td class="details-row details-value">${allergies}</td>
                </tr>
                ` : ''}
                ${celebration ? `
                <tr>
                  <td class="details-row details-label">¿Celebras algo?:</td>
                  <td class="details-row details-value">${celebration}</td>
                </tr>
                ` : ''}
                ${comments ? `
                <tr>
                  <td class="details-row details-label">Comentarios:</td>
                  <td class="details-row details-value">${comments}</td>
                </tr>
                ` : ''}
              </table>

              ${requires_invoice ? `
              <div style="margin-top: 24px; border-top: 1px solid #f0eee8; padding-top: 20px; text-align: left; font-size: 13px;">
                <h4 style="color: #7d3f0f; font-family: 'Georgia', serif; font-size: 15px; margin: 0 0 10px 0; font-weight: normal; text-transform: uppercase; letter-spacing: 0.05em;">Datos de Facturación Fiscal</h4>
                <table width="100%">
                  <tr>
                    <td style="padding: 4px 0; color: #867369; font-weight: bold; width: 40%;">RFC:</td>
                    <td style="padding: 4px 0; color: #1c1c18; text-align: right;">${rfc}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #867369; font-weight: bold;">Razón Social:</td>
                    <td style="padding: 4px 0; color: #1c1c18; text-align: right;">${razon_social}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #867369; font-weight: bold;">Código Postal (CP):</td>
                    <td style="padding: 4px 0; color: #1c1c18; text-align: right;">${postal_code}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #867369; font-weight: bold;">Régimen Fiscal:</td>
                    <td style="padding: 4px 0; color: #1c1c18; text-align: right; font-size: 11px;">${regimen_fiscal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #867369; font-weight: bold;">Uso de CFDI:</td>
                    <td style="padding: 4px 0; color: #1c1c18; text-align: right; font-size: 11px;">${cfdi_use}</td>
                  </tr>
                </table>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>Ubicación: Carretera Ayotlán–Atotonilco km 6.5, Las Villas, Jalisco.</p>
                <p>Si tienes alguna duda o necesitas reagendar, contáctanos a través de WhatsApp o respondiendo a este correo.</p>
                <p>&copy; 2026 Casa Loy Tequilera. Todos los derechos reservados.</p>
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
      subject: `Tu boleto de acceso - Casa Loy (${code})`,
      html: html,
    });

    // Send admin notification automatically to tour and invoicing departments
    try {
      const adminEmails = ['turismo@casaloy.com', 'turismo2@casaloy.com', 'turismo3@casaloy.com', 'turismocasaloy@gmail.com'];
      if (requires_invoice) {
        adminEmails.push('cuentasporcobrar@casaloy.com');
      }

      const adminHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 40px; box-sizing: border-box; }
            .logo { max-height: 40px; width: auto; margin-bottom: 20px; display: block; }
            h2 { font-family: Georgia, serif; font-size: 20px; color: #8C4723; font-weight: normal; margin-top: 0; border-bottom: 1px solid #e5e2dc; padding-bottom: 15px; }
            .info-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            .info-table th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #f0eee8; color: #8C4723; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%; }
            .info-table td { padding: 12px 8px; border-bottom: 1px solid #f0eee8; font-size: 14px; color: #1c1c18; }
            .invoice-box { margin-top: 25px; padding: 20px; border: 1px dashed #d9c2b6; background-color: #fcf9f3; }
            .invoice-box h4 { margin: 0 0 12px 0; color: #8C4723; font-family: Georgia, serif; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e2dc; padding-bottom: 5px; }
            .footer { font-size: 11px; color: #8a8a82; margin-top: 30px; border-top: 1px solid #e5e2dc; padding-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Tequilera" class="logo">
            <h2>Nueva Reserva de Tour Registrada</h2>
            <p>Se ha confirmado una nueva compra de tour a través de la plataforma web:</p>
            
            <table class="info-table">
              <tr><th>Código</th><td><strong>${code}</strong></td></tr>
              <tr><th>Cliente</th><td>${customer_name}</td></tr>
              <tr><th>Correo</th><td>${email}</td></tr>
              <tr><th>Experiencia</th><td>${tourName}</td></tr>
              <tr><th>Fecha</th><td>${date_str}</td></tr>
              <tr><th>Hora</th><td>${time_str}</td></tr>
              <tr><th>Visitantes</th><td>${guests} personas</td></tr>
              <tr><th>Monto pagado</th><td><strong>$${total_paid} MXN</strong></td></tr>
              <tr><th>Método de pago</th><td>${payment_method || 'No especificado'}</td></tr>
              ${allergies ? `<tr><th>Alergias</th><td>${allergies}</td></tr>` : ''}
              ${celebration ? `<tr><th>¿Celebra algo?</th><td>${celebration}</td></tr>` : ''}
              ${comments ? `<tr><th>Comentarios</th><td>${comments}</td></tr>` : ''}
            </table>

            ${requires_invoice ? `
              <div class="invoice-box">
                <h4>Datos de Facturación Solicitada</h4>
                <table width="100%" class="info-table" style="margin: 0;">
                  <tr><th style="padding: 6px 0; border: none; width: 35%;">RFC</th><td style="padding: 6px 0; border: none;">${rfc}</td></tr>
                  <tr><th style="padding: 6px 0; border: none; width: 35%;">Razón Social</th><td style="padding: 6px 0; border: none;">${razon_social}</td></tr>
                  <tr><th style="padding: 6px 0; border: none; width: 35%;">CP</th><td style="padding: 6px 0; border: none;">${postal_code}</td></tr>
                  <tr><th style="padding: 6px 0; border: none; width: 35%;">Régimen Fiscal</th><td style="padding: 6px 0; border: none; font-size: 12px;">${regimen_fiscal}</td></tr>
                  <tr><th style="padding: 6px 0; border: none; width: 35%;">Uso de CFDI</th><td style="padding: 6px 0; border: none; font-size: 12px;">${cfdi_use}</td></tr>
                </table>
              </div>
            ` : ''}
            
            <div class="footer">
              <p>Este correo ha sido generado automáticamente por el sistema de Casa Loy Tequilera.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        bcc: ['jgutierrez@casaloy.com'],
        subject: `Nueva Reserva Tour: ${code} - ${customer_name}`,
        html: adminHtml
      });
    } catch (adminMailErr) {
      console.error("Error sending notification copy to tour admin emails:", adminMailErr);
    }

    if (error) {
      console.error("Resend API error sending booking email:", error);
      return { success: false, error };
    }
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("Exception sending booking email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a notification email for a restaurant booking.
 * @param {object} bookingDetails 
 */
export async function sendRestaurantBookingEmail(bookingDetails) {
  if (!resend) {
    console.warn("Resend client not configured. Skipping restaurant email.");
    return { success: false, error: "Resend not initialized" };
  }

  const { code, customer_name, customer_phone, guests, date_str, time_str, reason } = bookingDetails;
  const fromEmail = getFromEmail();

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 30px; }
        h2 { color: #8C4723; border-bottom: 2px solid #8C4723; padding-bottom: 10px; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #f0eee8; }
        th { color: #8C4723; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Nueva Reserva - Restaurante 1937 Nativo</h2>
        <p>Se ha registrado una nueva reservación para el restaurante desde el sitio web.</p>
        <table>
          <tr>
            <th>ID de Reserva:</th>
            <td><strong>${code}</strong></td>
          </tr>
          <tr>
            <th>Cliente:</th>
            <td>${customer_name}</td>
          </tr>
          <tr>
            <th>Teléfono:</th>
            <td>${customer_phone}</td>
          </tr>
          <tr>
            <th>Fecha de Visita:</th>
            <td>${date_str}</td>
          </tr>
          <tr>
            <th>Hora de Visita:</th>
            <td>${time_str} hrs</td>
          </tr>
          <tr>
            <th>Invitados:</th>
            <td>${guests} personas</td>
          </tr>
          <tr>
            <th>Motivo:</th>
            <td>${reason}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ['1937nativo@casaloy.com'],
      subject: `Nueva Reserva Restaurante: ${code} - ${customer_name}`,
      html: html,
    });

    if (error) {
      console.error("Resend API error sending restaurant booking email:", error);
      return { success: false, error };
    }
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("Exception sending restaurant email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendMaquilaLeadEmail(leadDetails) {
  if (!resend) {
    console.warn("Resend client not configured. Skipping maquila lead email.");
    return { success: false, error: "Resend not initialized" };
  }

  const { name, company, email, lada, phone, solution, objective, stage } = leadDetails;

  // 1. Email for the administrator
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 40px; }
        h2 { font-family: Georgia, serif; font-size: 22px; color: #8C4723; font-weight: normal; margin-top: 0; }
        .lead-info { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .lead-info th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e5e2dc; color: #8C4723; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%; }
        .lead-info td { padding: 12px 8px; border-bottom: 1px solid #e5e2dc; font-size: 14px; color: #1c1c18; }
        .footer { font-size: 11px; color: #8a8a82; margin-top: 30px; border-top: 1px solid #e5e2dc; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Nuevo Lead - Diagnóstico de Maquila</h2>
        <p>Se ha recibido un nuevo lead calificado a través del Quiz de 3 Preguntas en el sitio web de Casa Loy Tequilera:</p>
        
        <table class="lead-info">
          <tr><th>Nombre</th><td>${name}</td></tr>
          <tr><th>Empresa</th><td>${company}</td></tr>
          <tr><th>Correo</th><td>${email}</td></tr>
          <tr><th>Teléfono</th><td>+${lada} ${phone}</td></tr>
          <tr><th>Proyecto</th><td>${solution}</td></tr>
          <tr><th>Objetivo</th><td>${objective}</td></tr>
          <tr><th>Etapa</th><td>${stage}</td></tr>
        </table>
        
        <div class="footer">
          <p>Este correo fue generado automáticamente por la plataforma web de Casa Loy Tequilera.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Email for the customer/client
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 40px; }
        h2 { font-family: Georgia, serif; font-size: 24px; color: #8C4723; font-weight: normal; margin-top: 0; text-align: center; }
        p { font-size: 15px; line-height: 1.6; color: #3e3e38; }
        .details-box { background-color: #fcf9f3; border: 1px solid #e5e2dc; padding: 20px; margin: 24px 0; }
        .details-title { font-weight: bold; color: #8C4723; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; }
        .footer { font-size: 12px; color: #8a8a82; margin-top: 30px; text-align: center; border-top: 1px solid #e5e2dc; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>¡Gracias por realizar nuestro diagnóstico, ${name}!</h2>
        <p>Hemos recibido tus respuestas sobre el proyecto para <strong>${company}</strong>.</p>
        
        <p>Un miembro de nuestro equipo de desarrollo de marcas revisará tus especificaciones para <strong>${solution}</strong> y se pondrá en contacto contigo a la brevedad al correo <strong>${email}</strong> para platicar sobre la viabilidad operativa y los siguientes pasos.</p>
        
        <div class="details-box">
          <div class="details-title">Resumen de tu diagnóstico:</div>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Solución:</strong> ${solution}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Objetivo principal:</strong> ${objective}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Etapa actual:</strong> ${stage}</p>
        </div>

        <p>Si deseas agendar directamente una llamada técnica, puedes hacerlo en nuestra sección de contacto en el sitio web.</p>
        
        <div class="footer">
          <p>&copy; 2026 Casa Loy Tequilera. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const fromEmail = getFromEmail();
    // Send to admin
    await resend.emails.send({
      from: fromEmail,
      to: ['fquintana@casaloy.com'],
      cc: ['luisloyb@casaloy.com'],
      subject: `Nuevo Diagnóstico de Maquila - ${company}`,
      html: adminHtml,
    });

    // Send to client/lead
    const { data: clientRes, error: clientErr } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Recibimos tu propuesta de marca - Casa Loy`,
      html: clientHtml,
    });

    if (clientErr) {
      console.error("Resend error sending confirmation to client:", clientErr);
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in sendMaquilaLeadEmail:", err);
    return { success: false, error: err.message };
  }
}

export async function sendAlliancesLeadEmail(leadDetails) {
  if (!resend) {
    console.warn("Resend client not configured. Skipping alliances lead email.");
    return { success: false, error: "Resend not initialized" };
  }

  const { name, company, email, lada, phone, market, message } = leadDetails;

  // Market label mapping
  const marketLabels = {
    mx: 'México',
    usa: 'Estados Unidos (USA)',
    hk: 'Hong Kong',
    co: 'Colombia',
    gt: 'Guatemala',
    other: 'Otro / Internacional'
  };
  const marketName = marketLabels[market?.toLowerCase()] || market || 'No especificado';

  // 1. Email for the administrator
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 40px; }
        h2 { font-family: Georgia, serif; font-size: 22px; color: #8C4723; font-weight: normal; margin-top: 0; }
        .lead-info { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .lead-info th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e5e2dc; color: #8C4723; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%; }
        .lead-info td { padding: 12px 8px; border-bottom: 1px solid #e5e2dc; font-size: 14px; color: #1c1c18; }
        .footer { font-size: 11px; color: #8a8a82; margin-top: 30px; border-top: 1px solid #e5e2dc; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Nueva Solicitud - Alianza Comercial / Distribución</h2>
        <p>Se ha recibido una propuesta de alianza comercial a través del formulario "Vende nuestros productos":</p>
        
        <table class="lead-info">
          <tr><th>Nombre</th><td>${name}</td></tr>
          <tr><th>Empresa / Establecimiento</th><td>${company}</td></tr>
          <tr><th>Correo</th><td>${email}</td></tr>
          <tr><th>Teléfono</th><td>+${lada} ${phone}</td></tr>
          <tr><th>Mercado de Interés</th><td><strong>${marketName}</strong></td></tr>
          <tr><th>Mensaje</th><td>${message ? message.replace(/\n/g, '<br />') : 'Sin mensaje adicional'}</td></tr>
        </table>
        
        <div class="footer">
          <p>Este correo fue generado automáticamente por la plataforma web de Casa Loy Tequilera.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Email for the customer/client
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 40px; }
        h2 { font-family: Georgia, serif; font-size: 24px; color: #8C4723; font-weight: normal; margin-top: 0; text-align: center; }
        p { font-size: 15px; line-height: 1.6; color: #3e3e38; }
        .details-box { background-color: #fcf9f3; border: 1px solid #e5e2dc; padding: 20px; margin: 24px 0; }
        .details-title { font-weight: bold; color: #8C4723; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; }
        .footer { font-size: 12px; color: #8a8a82; margin-top: 30px; text-align: center; border-top: 1px solid #e5e2dc; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>¡Gracias por tu interés en Casa Loy, ${name}!</h2>
        <p>Hemos recibido tu solicitud para comercializar nuestros productos en nombre de <strong>${company}</strong> para el mercado de <strong>${marketName}</strong>.</p>
        
        <p>Un miembro de nuestro equipo comercial revisará la información de tu establecimiento y se pondrá en contacto contigo a la brevedad al teléfono <strong>+${lada} ${phone}</strong> o por este medio para conversar sobre las oportunidades de distribución, catálogos de precios y requisitos de comercialización.</p>
        
        <div class="details-box">
          <div class="details-title">Resumen de tu solicitud:</div>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Empresa:</strong> ${company}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Mercado de Interés:</strong> ${marketName}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Correo de contacto:</strong> ${email}</p>
        </div>

        <p>Agradecemos tu interés en llevar la herencia y excelencia de Casa Loy a tu mercado.</p>
        
        <div class="footer">
          <p>&copy; 2026 Casa Loy Tequilera. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const fromEmail = getFromEmail();
    const adminEmail = process.env.ALLIANCES_LEADS_EMAIL || 'contacto@casaloy.com';

    // Send to admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Nueva Propuesta de Distribución (${marketName}) - ${company}`,
      html: adminHtml,
    });

    // Send to client/lead
    const { data: clientRes, error: clientErr } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Recibimos tu solicitud de distribución - Casa Loy`,
      html: clientHtml,
    });

    if (clientErr) {
      console.error("Resend error sending alliances confirmation to client:", clientErr);
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in sendAlliancesLeadEmail:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a temporary password reset email.
 */
export async function sendPasswordResetEmail(email, tempPassword) {
  if (!resend) {
    console.warn("Resend client not configured.");
    return { success: false, error: "Resend not initialized" };
  }
  const fromEmail = getFromEmail();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; background-color: #fcf9f3; color: #1c1c18; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e2dc; padding: 30px; }
        h2 { color: #8C4723; border-bottom: 2px solid #8C4723; padding-bottom: 10px; margin-top: 0; }
        .pass-box { background: #fdfbf8; border: 1px dashed #8C4723; padding: 15px; text-align: center; font-size: 20px; font-family: monospace; letter-spacing: 2px; font-weight: bold; color: #8C4723; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Restablecimiento de Contraseña - Casa Loy</h2>
        <p>Se ha solicitado un restablecimiento de contraseña para tu cuenta de personal en el Panel Administrador.</p>
        <p>Tu contraseña temporal de acceso es:</p>
        <div class="pass-box">${tempPassword}</div>
        <p>Te recomendamos iniciar sesión con esta contraseña y cambiarla inmediatamente desde la pestaña <strong>Personal</strong> del Panel.</p>
        <p style="color: #a09d95; font-size: 11px; margin-top: 20px;">Si no solicitaste este cambio, por favor notifícalo al Administrador del sistema.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Nueva Contraseña Temporal - Panel Casa Loy',
      html: html,
    });
    if (error) {
      console.error("Resend error sending reset email:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Exception in sendPasswordResetEmail:", err);
    return { success: false, error: err.message };
  }
}


