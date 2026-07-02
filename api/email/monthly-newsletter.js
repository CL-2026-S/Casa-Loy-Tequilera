import { supabase, authorizeCron, getSiteUrl } from '../_utils/clients.js';
import { sendMonthlyNewsletter } from '../_utils/emails.js';

export default async function handler(req, res) {
  // Security Check: Authorized cron triggers only
  if (!authorizeCron(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid cron authentication.' });
  }

  if (!supabase) {
    console.error("Supabase client is not initialized.");
    return res.status(500).json({ error: 'Database client is not initialized.' });
  }

  try {
    const siteUrl = getSiteUrl(req);

    // 1. Fetch active subscribers who want monthly newsletters
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

    // 2. Fetch latest blog articles
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

    // Fallback static articles (from Blog.jsx contents) if database is empty
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

    // 3. Send monthly newsletter in batches
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
