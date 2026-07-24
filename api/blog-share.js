import { supabase, getSiteUrl } from './_utils/clients.js';

export default async function handler(req, res) {
  const { slug } = req.query;
  const siteUrl = getSiteUrl(req);

  try {
    // 1. Fetch index.html template from the deployment
    const indexUrl = `${siteUrl}/index.html`;
    const indexRes = await fetch(indexUrl);
    if (!indexRes.ok) {
      throw new Error(`Failed to fetch index.html from ${indexUrl}`);
    }
    let html = await indexRes.text();

    if (!slug) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // 2. Fetch post details from Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const post = data;
        const postTitle = post.title_es || post.title;
        const postDesc = post.description || post.seo_description || '';
        const postKeywords = post.seo_keywords || '';
        
        // Ensure image URL is absolute and properly encoded
        let postImage = post.image_url || '/Barra Casa Loy Experiencias.webp';
        if (!postImage.startsWith('http')) {
          // Replace spaces with %20 in path if needed
          const encodedPath = encodeURI(postImage);
          postImage = `${siteUrl}${encodedPath}`;
        }

        // 3. Replace default metadata
        // Title
        html = html.replace(/<title>.*?<\/title>/, `<title>${postTitle} | Blog Casa Loy</title>`);
        
        // Description
        html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${postDesc.replace(/"/g, '&quot;')}" />`);

        // Keywords
        if (postKeywords) {
          html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${postKeywords.replace(/"/g, '&quot;')}" />`);
        }

        // 4. Inject OpenGraph & Twitter Cards meta tags right before </head>
        const seoMetaTags = `
    <!-- Dynamic Social Share SEO Meta Tags -->
    <meta property="og:title" content="${postTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${postDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${postImage}" />
    <meta property="og:url" content="${siteUrl}/blog/${slug}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Casa Loy Tequilera" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${postTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${postDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${postImage}" />
    <meta name="author" content="Casa Loy Tequilera" />
  </head>`;

        html = html.replace('</head>', seoMetaTags);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    console.error("Error generating blog share preview:", err);
    // On error, fallback to rendering the raw page normally
    try {
      const indexUrl = `${siteUrl}/index.html`;
      const indexRes = await fetch(indexUrl);
      const html = await indexRes.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (e) {
      return res.status(500).send("Internal Server Error");
    }
  }
}
