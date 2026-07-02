import { supabase, getSiteUrl } from '../_utils/clients.js';

export default async function handler(req, res) {
  // We only support GET to allow direct link clicks from emails
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed. Use GET.');
  }

  const { id, email } = req.query || {};

  if (!id && !email) {
    return res.status(400).send('Faltan parámetros requeridos: id o email.');
  }

  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock unsubscribe page in local development.");
      const siteUrl = getSiteUrl(req);
      const homeUrl = `${siteUrl}/`;
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Suscripción Cancelada (MOCK) - Casa Loy</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; background-color: #fcf9f3; font-family: 'Montserrat', sans-serif; color: #1c1c18; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
            .container { max-width: 500px; padding: 40px; background-color: #ffffff; border: 1px solid #e5e2dc; box-shadow: 0 4px 20px rgba(28, 28, 24, 0.02); }
            .logo { max-height: 40px; margin-bottom: 30px; }
            h1 { font-family: 'EB Garamond', serif; font-size: 28px; font-weight: normal; margin-bottom: 20px; color: #8C4723; }
            p { font-size: 14px; line-height: 1.6; color: #53443a; margin-bottom: 30px; font-weight: 300; }
            .btn { display: inline-block; background-color: #2F403E; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; transition: background-color 0.3s ease; }
            .btn:hover { background-color: #8C4723; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Logo" class="logo">
            <h1>Suscripción Cancelada (MOCK)</h1>
            <p>Tu correo electrónico ha sido eliminado de nuestro boletín mensual con éxito. (Modo de desarrollo sin base de datos).</p>
            <a href="${homeUrl}" class="btn">Volver a Casa Loy</a>
          </div>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
    console.error("Supabase client is not initialized.");
    return res.status(500).send('Error de base de datos. Por favor configure las variables de entorno.');
  }

  try {
    let query = supabase.from('subscribers').update({ status: 'unsubscribed' });
    let identifier = '';

    if (id) {
      query = query.eq('id', id);
      identifier = id;
    } else {
      query = query.eq('email', email.trim().toLowerCase());
      identifier = email;
    }

    const { data, error } = await query.select();

    if (error) {
      console.error("Supabase unsubscribe error:", error);
      return res.status(500).send('Error al procesar la solicitud en la base de datos.');
    }

    // Prepare confirmation page styling matching Casa Loy branding
    const siteUrl = getSiteUrl(req);
    const homeUrl = `${siteUrl}/`;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suscripción Cancelada - Casa Loy</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #fcf9f3;
            font-family: 'Montserrat', sans-serif;
            color: #1c1c18;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .container {
            max-width: 500px;
            padding: 40px;
            background-color: #ffffff;
            border: 1px solid #e5e2dc;
            box-shadow: 0 4px 20px rgba(28, 28, 24, 0.02);
          }
          .logo {
            max-height: 40px;
            margin-bottom: 30px;
          }
          h1 {
            font-family: 'EB Garamond', serif;
            font-size: 28px;
            font-weight: normal;
            margin-bottom: 20px;
            color: #8C4723;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #53443a;
            margin-bottom: 30px;
            font-weight: 300;
          }
          .btn {
            display: inline-block;
            background-color: #2F403E;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            transition: background-color 0.3s ease;
          }
          .btn:hover {
            background-color: #8C4723;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" alt="Casa Loy Logo" class="logo">
          <h1>Suscripción Cancelada</h1>
          <p>Tu correo electrónico ha sido eliminado de nuestro boletín mensual con éxito. Lamentamos verte partir. Si fue un error, puedes volver a suscribirte en nuestro sitio web en cualquier momento.</p>
          <a href="${homeUrl}" class="btn">Volver a Casa Loy</a>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (err) {
    console.error("Exception in unsubscribe handler:", err);
    return res.status(500).send('Ocurrió un error inesperado al procesar la cancelación de suscripción.');
  }
}
