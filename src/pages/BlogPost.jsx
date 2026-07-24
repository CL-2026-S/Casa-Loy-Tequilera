import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogPost({ lang = "es", setPage }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const res = await fetch("/api/cms?type=blog");
        if (res.ok) {
          const data = await res.json();
          const found = data.find(p => p.slug === slug);
          if (found) {
            setPost(found);
          }
        }
      } catch (e) {
        console.error("Error loading blog post:", e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let scriptTag = null;
    
    if (post) {
      const postTitle = lang === "es" ? (post.title_es || post.title) : (post.title_en || post.title_es || post.title);
      const postDesc = post.description || "";
      const postKeywords = post.seo_keywords || "";

      // 1. Update Title
      document.title = `${postTitle} | Blog Casa Loy`;

      // 2. Update Description Meta Tag
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = postDesc;

      // 3. Update Keywords Meta Tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = postKeywords;

      // 4. Update OpenGraph Tags
      const updateMeta = (prop, val) => {
        let tag = document.querySelector(`meta[property="${prop}"]`);
        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute("property", prop);
          document.head.appendChild(tag);
        }
        tag.content = val;
      };

      updateMeta("og:title", postTitle);
      updateMeta("og:description", postDesc);
      if (post.image_url) {
        updateMeta("og:image", post.image_url);
      }
      updateMeta("og:url", window.location.href);

      // 5. Inject JSON-LD Structured Data
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postTitle,
        "description": postDesc,
        "image": post.image_url || "https://casaloy.com/Barra%20Casa%20Loy%20Experiencias.webp",
        "datePublished": post.published_at || post.created_at,
        "dateModified": post.published_at || post.created_at,
        "author": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera",
          "url": "https://casaloy.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera",
          "logo": {
            "@type": "ImageObject",
            "url": "https://casaloy.com/Logotipo%20Casa%20Loy%20Tequilera.webp"
          }
        },
        "keywords": postKeywords
      };

      scriptTag = document.createElement("script");
      scriptTag.id = "blog-post-jsonld";
      scriptTag.type = "application/ld+json";
      scriptTag.innerHTML = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    } else if (!loading) {
      // Fallback static post SEO
      const staticTitle = lang === "es"
        ? "El Arte de la Cata: Una Inmersión en los Sentidos | Blog Casa Loy"
        : "The Art of Tasting: An Immersion in the Senses | Blog Casa Loy";
      const staticDesc = lang === "es"
        ? "Guía paso a paso para catar tequila de ultra-lujo: vista, olfato y retrogusto."
        : "Step-by-step guide to tasting ultra-luxury tequila: sight, smell, and aftertaste.";
      const staticKeywords = "Día Internacional del Tequila, Tequila, Casa Loy, Agave azul, Origen, Tradición tequilera, Jimadores, Denominación de Origen";

      document.title = staticTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = staticDesc;

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.content = staticKeywords;

      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": staticTitle,
        "description": staticDesc,
        "image": "https://casaloy.com/Barra%20Casa%20Loy%20Experiencias.webp",
        "datePublished": "2024-10-24T08:00:00Z",
        "author": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera",
          "url": "https://casaloy.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera",
          "logo": {
            "@type": "ImageObject",
            "url": "https://casaloy.com/Logotipo%20Casa%20Loy%20Tequilera.webp"
          }
        },
        "keywords": staticKeywords
      };

      scriptTag = document.createElement("script");
      scriptTag.id = "blog-post-jsonld";
      scriptTag.type = "application/ld+json";
      scriptTag.innerHTML = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [post, lang, loading]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    es: {
      category: "CULTURA & GASTRONOMÍA",
      title: "El Arte de la Cata: Una Inmersión en los Sentidos",
      author: "Casa Loy Tequilera",
      date: "24 de Octubre, 2024",
      quote: `"La cata no es simplemente el acto de beber; es un diálogo silencioso entre la tierra, el fuego y el alma humana, donde cada gota cuenta la historia de una herencia milenaria."`,
      p1: "Degustar un tequila de ultra-lujo como Casa Loy requiere de una disposición particular del espíritu. No buscamos el impacto inmediato del alcohol, sino la sutileza de los terpenos, la danza de los ésteres y la herencia del suelo volcánico que nutrió al agave durante años. En esta exploración sensorial, dividimos la experiencia en tres momentos fundamentales que definen el carácter de nuestro destilado.",
      p2: "La vista es nuestro primer contacto. Al inclinar la copa, observamos el 'cuerpo' del tequila a través de sus piernas o lágrimas que descienden lentamente por el cristal. Un reposado de Casa Loy exhibirá matices dorados que evocan los atardeceres de Los Altos, una transparencia cristalina que habla de una filtración impecable y una pureza técnica inigualable.",
      section1Title: "El Paisaje Aromático",
      section1Text: "Acercar la nariz a la copa es abrir una ventana al campo. Los aromas primarios nos remiten directamente al agave cocido, esa dulzura terrosa y profunda. Sin embargo, en Casa Loy, buscamos la complejidad. Aparecen notas cítricas de bergamota, matices florales y, tras el reposo en barrica, la vainilla y el clavo de olor se entrelazan sin opacar la esencia del espíritu original.",
      asideTitle: "NOTAS DEL MAESTRO",
      asideItem1Title: "Temperatura Ideal",
      asideItem1Text: "18°C a 20°C para apreciar toda la gama volátil.",
      asideItem2Title: "Cristalería",
      asideItem2Text: "Copa Riedel Tequila o copa de vino blanco para concentrar aromas.",
      asideItem3Title: "Maridaje Sugerido",
      asideItem3Text: "Chocolate amargo con sal de mar o frutas deshidratadas.",
      caption1: "Las barricas de roble blanco americano donde el tiempo se detiene.",
      section2Title: "El Retrogusto: La Memoria del Paladar",
      section2Text1: "El ataque en boca debe ser sedoso, casi aceitoso. Un gran tequila no debe quemar, sino abrazar. Al pasar el destilado por la lengua, descubrimos la mineralidad del suelo de Casa Loy. Es un equilibrio precario entre la potencia del alcohol y la delicadeza de los sabores naturales del agave.",
      section2Text2: "Finalmente, el final de boca o retrogusto es lo que diferencia a lo bueno de lo excepcional. En Casa Loy, buscamos una persistencia prolongada que deje un recuerdo de agave dulce y especias. Es el eco de la fermentación lenta y la destilación cuidadosa que resuena minutos después de haber terminado la copa.",
      terroirTitle: "El Terroir como Destino",
      terroirText: "Cada botella de Casa Loy es un mapa líquido de nuestra geografía única.",
      relatedTitle: "Historias Relacionadas",
      relatedAction: "Ver Journal",
      relatedCard1Cat: "Gastronomía",
      relatedCard1Title: "Maridaje Perfecto: Tequila y Cacao",
      relatedCard2Cat: "Proceso",
      relatedCard2Title: "La Jima: El Primer Grito de la Tierra",
      relatedCard3Cat: "Lifestyle",
      relatedCard3Title: "Hospitalidad de Lujo en Los Altos",
    },
    en: {
      category: "CULTURE & GASTRONOMY",
      title: "The Art of Tasting: An Immersion in the Senses",
      author: "Casa Loy Tequilera",
      date: "October 24, 2024",
      quote: `"Tasting is not merely the act of drinking; it is a silent dialogue between earth, fire, and the human soul, where every drop tells the story of a millennial heritage."`,
      p1: "Tasting an ultra-luxury tequila like Casa Loy requires a specific disposition of the spirit. We do not seek the immediate impact of alcohol, but the subtlety of terpenes, the dance of esters, and the heritage of the volcanic soil that nourished the agave for years. In this sensory exploration, we divide the experience into three fundamental stages that define the character of our distillate.",
      p2: "Sight is our first contact. By tilting the glass, we observe the 'body' of the tequila through its legs or tears that slowly descend down the crystal. A rested Casa Loy will exhibit golden hues evoking Los Altos sunsets, crystalline transparency speaking of impeccable filtration, and unmatched technical purity.",
      section1Title: "The Aromatic Landscape",
      section1Text: "Bringing the glass to the nose is opening a window to the fields. The primary aromas take us straight to cooked agave, that earthy, deep sweetness. However, at Casa Loy, we seek complexity. Citric notes of bergamot, floral nuances, and, after barrel resting, vanilla and clove intertwine without overshadowing the essence of the original spirit.",
      asideTitle: "MASTER'S NOTES",
      asideItem1Title: "Ideal Temperature",
      asideItem1Text: "18°C to 20°C (64°F to 68°F) to appreciate the full volatile range.",
      asideItem2Title: "Glassware",
      asideItem2Text: "Riedel Tequila glass or white wine glass to concentrate aromas.",
      asideItem3Title: "Suggested Pairing",
      asideItem3Text: "Dark chocolate with sea salt or dehydrated fruits.",
      caption1: "The American white oak barrels where time stands still.",
      section2Title: "The Aftertaste: The Palate's Memory",
      section2Text1: "The entry on the palate must be silky, almost oily. A great tequila should not burn, but embrace. As the distillate passes over the tongue, we discover the mineral nature of Casa Loy's soil. It is a delicate balance between the power of alcohol and the gentleness of agave's natural flavors.",
      section2Text2: "Finally, the finish or aftertaste is what differentiates the good from the exceptional. At Casa Loy, we seek a long persistence leaving a memory of sweet agave and spices. It is the echo of slow fermentation and careful distillation that resonates minutes after empty glass.",
      terroirTitle: "Terroir as Destiny",
      terroirText: "Every bottle of Casa Loy is a liquid map of our unique geography.",
      relatedTitle: "Related Stories",
      relatedAction: "View Journal",
      relatedCard1Cat: "Gastronomy",
      relatedCard1Title: "Perfect Pairing: Tequila & Cacao",
      relatedCard2Cat: "Process",
      relatedCard2Title: "La Jima: The Earth's First Cry",
      relatedCard3Cat: "Lifestyle",
      relatedCard3Title: "Luxury Hospitality in Los Altos",
    }
  };

  const t = content[lang];
  const staticKeywordsArray = lang === "es"
    ? ["Cata de Tequila", "Tradición Agavera", "Casa Loy", "Los Altos de Jalisco", "El Origen"]
    : ["Tequila Tasting", "Agave Tradition", "Casa Loy", "Los Altos de Jalisco", "The Origin"];

  if (post) {
    const postTitle = lang === "es" ? (post.title_es || post.title) : (post.title_en || post.title_es || post.title);
    const postCategory = post.category || "Noticias";
    const postAuthor = lang === "es" ? post.author_es : (post.author_en || post.author_es);
    const postDate = new Date(post.published_at || post.created_at).toLocaleDateString(
      lang === "es" ? "es-MX" : "en-US",
      { day: "numeric", month: "long", year: "numeric" }
    );
    const postBody = lang === "es" ? post.body_es : (post.body_en || post.body_es);
    const postKeywordsArray = post.seo_keywords ? post.seo_keywords.split(",").map(k => k.trim()).filter(Boolean) : [];

    return (
      <div className="bg-background text-on-surface text-left min-h-screen">
        {/* Editorial Header (Title on clean background for silent luxury) */}
        <header className="max-w-4xl mx-auto px-gutter pt-40 md:pt-48 pb-12 text-center select-none animate-fade-in-slide">
          <span className="font-label-caps text-label-caps text-secondary tracking-[0.4em] mb-6 block uppercase font-bold text-[11px] md:text-xs">
            {postCategory}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-[72px] text-on-surface leading-[1.1] tracking-tight font-light max-w-4xl mx-auto mb-8">
            {postTitle}
          </h1>
          {post.description && (
            <p className="font-serif text-lg md:text-xl text-on-surface-variant/80 italic font-light mt-6 max-w-2xl mx-auto leading-relaxed">
              {post.description}
            </p>
          )}
          <div className="w-12 h-[1px] bg-secondary/35 mx-auto mt-12"></div>
        </header>

        {/* Featured Image (No cropping, original aspect ratio, borderless, warm background) */}
        <div className="max-w-5xl mx-auto px-gutter mb-20 animate-fade-in-slide">
          <div className="overflow-hidden bg-[#F6F2EA] shadow-sm">
            <img
              alt={postTitle}
              className="w-full h-auto object-contain max-h-[80vh] mx-auto hover:scale-101 transition-transform duration-[1.5s]"
              src={post.image_url || "/Barra Casa Loy Experiencias.webp"}
            />
          </div>
        </div>

        <main className="max-w-container-max mx-auto px-gutter md:px-margin-desktop mt-8 pb-24">
          {/* Body Content */}
          <article className="max-w-3xl mx-auto space-y-8 text-base md:text-lg text-on-surface leading-[1.8] font-light font-sans dynamic-blog-body">
            <div dangerouslySetInnerHTML={{ __html: postBody }} />
          </article>

          {/* Article Tags / Keywords (Semantic markup for search engine crawlers) */}
          {postKeywordsArray.length > 0 && (
            <section aria-label="Tags" className="max-w-3xl mx-auto mt-12 pb-6 border-b border-outline-variant/10">
              <ul className="flex flex-wrap gap-2" itemProp="keywords">
                {postKeywordsArray.map((tag, idx) => (
                  <li key={idx}>
                    <span className="font-navigation text-[10px] uppercase tracking-wider bg-secondary/5 text-secondary border border-secondary/20 px-3 py-1 font-semibold rounded-sm select-none inline-block">
                      #{tag.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Author & Date + Social Share moved to the bottom */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant/30 pt-8 mt-12 gap-6">
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              {lang === "es" ? "Por: " : "By: "}
              <span className="font-bold text-on-surface uppercase not-italic tracking-wider">
                {postAuthor}
              </span>{" "}
              • {postDate}
            </p>
            
            {/* Social Share buttons */}
            <div className="flex items-center gap-3">
              <span className="font-navigation text-xs text-on-surface-variant/70 uppercase tracking-widest font-semibold mr-1">
                {lang === "es" ? "Compartir:" : "Share:"}
              </span>
              
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + " " + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 text-on-surface-variant"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 text-on-surface-variant"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(postTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-on-surface-variant"
                title="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Copy Link */}
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-on-surface-variant cursor-pointer"
                title={lang === "es" ? "Copiar enlace" : "Copy link"}
              >
                <span className="material-symbols-outlined text-[16px] font-bold">
                  {copied ? "check" : "link"}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface text-left min-h-screen">
      {/* Editorial Header (Title on clean background for silent luxury) */}
      <header className="max-w-4xl mx-auto px-gutter pt-40 md:pt-48 pb-12 text-center select-none animate-fade-in-slide">
        <span className="font-label-caps text-label-caps text-secondary tracking-[0.4em] mb-6 block uppercase font-bold text-[11px] md:text-xs">
          {t.category}
        </span>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-[72px] text-on-surface leading-[1.1] tracking-tight font-light max-w-4xl mx-auto mb-8">
          {t.title}
        </h1>
        {t.quote && (
          <p className="font-serif text-lg md:text-xl text-on-surface-variant/80 italic font-light mt-6 max-w-2xl mx-auto leading-relaxed">
            {t.quote}
          </p>
        )}
        <div className="w-12 h-[1px] bg-secondary/35 mx-auto mt-12"></div>
      </header>

      {/* Featured Image (No cropping, original aspect ratio, borderless, warm background) */}
      <div className="max-w-5xl mx-auto px-gutter mb-20 animate-fade-in-slide">
        <div className="overflow-hidden bg-[#F6F2EA] shadow-sm">
          <img
            alt={t.title}
            className="w-full h-auto object-contain max-h-[80vh] mx-auto hover:scale-101 transition-transform duration-[1.5s]"
            src="/Barra Casa Loy Experiencias.webp"
          />
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-gutter md:px-margin-desktop mt-8">

        {/* Body Content */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-32">
          <div className="col-span-12 lg:col-span-8 space-y-8 text-base md:text-lg text-on-surface leading-[1.8] font-light font-sans">
            <p className="first-letter:float-left first-letter:font-serif first-letter:text-[5rem] first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:text-primary first-letter:font-semibold">
              {t.p1}
            </p>
            <p>{t.p2}</p>

            <div className="pt-8">
              <h2 className="font-serif text-3xl md:text-5xl mb-6 text-primary tracking-tight font-medium">
                {t.section1Title}
              </h2>
              <p className="mb-6">{t.section1Text}</p>
            </div>
          </div>

          <aside className="col-span-12 lg:col-start-10 lg:col-span-3 sticky top-32 h-fit mt-12 lg:mt-0">
            <div className="bg-background/40 backdrop-blur-xl border border-outline-variant/20 p-8 space-y-6 shadow-sm">
              <h3 className="font-label-caps text-label-caps text-primary border-b border-primary/20 pb-4 tracking-widest font-bold">
                {t.asideTitle}
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem1Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem1Text}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem2Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem2Text}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem3Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem3Text}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </article>

        {/* Visual Interlude 1 */}
        <figure className="w-full mb-32">
          <div className="h-[400px] md:h-[600px] overflow-hidden shadow-sm">
            <img
              alt="Oak barrels cellar"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              src="/Añejamiento Barricas.webp"
            />
          </div>
          <figcaption className="mt-4 font-body-md text-body-md italic text-center text-on-surface-variant/70 font-light">
            {t.caption1}
          </figcaption>
        </figure>

        {/* Body Content 2 */}
        <section className="max-w-4xl mx-auto mb-32 space-y-12 text-left">
          <h2 className="font-serif text-3xl md:text-5xl text-center tracking-tight font-medium">
            {t.section2Title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-base md:text-lg text-on-surface leading-[1.8] font-light font-sans">
            <p>{t.section2Text1}</p>
            <p>{t.section2Text2}</p>
          </div>
        </section>

        {/* Visual Interlude 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-32 h-auto lg:h-[500px]">
          <div className="lg:col-span-8 overflow-hidden h-[300px] lg:h-full shadow-sm">
            <img
              alt="Blue agave fields panoramic"
              className="w-full h-full object-cover"
              src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
            />
          </div>
          <div className="lg:col-span-4 bg-primary p-12 flex flex-col justify-center text-white text-left shadow-sm">
            <span className="material-symbols-outlined text-4xl mb-6 font-light">eco</span>
            <h3 className="font-serif text-3xl mb-4 leading-tight font-medium italic">
              {t.terroirTitle}
            </h3>
            <p className="text-base opacity-90 font-light leading-relaxed">{t.terroirText}</p>
          </div>
        </div>

        {/* Article Tags / Keywords (Semantic markup for search engine crawlers) */}
        {staticKeywordsArray.length > 0 && (
          <section aria-label="Tags" className="max-w-4xl mx-auto mt-12 pb-6 border-b border-outline-variant/10">
            <ul className="flex flex-wrap gap-2" itemProp="keywords">
              {staticKeywordsArray.map((tag, idx) => (
                <li key={idx}>
                  <span className="font-navigation text-[10px] uppercase tracking-wider bg-secondary/5 text-secondary border border-secondary/20 px-3 py-1 font-semibold rounded-sm select-none inline-block">
                    #{tag.trim()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Author & Date + Social Share moved to the bottom */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant/30 pt-8 mt-12 mb-20 gap-6">
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {lang === "es" ? "Por: " : "By: "}
            <span className="font-bold text-on-surface uppercase not-italic tracking-wider">
              {t.author}
            </span>{" "}
            • {t.date}
          </p>
          
          {/* Social Share buttons */}
          <div className="flex items-center gap-3">
            <span className="font-navigation text-xs text-on-surface-variant/70 uppercase tracking-widest font-semibold mr-1">
              {lang === "es" ? "Compartir:" : "Share:"}
            </span>
            
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(t.title + " " + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 text-on-surface-variant"
              title="WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 text-on-surface-variant"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(t.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-on-surface-variant"
              title="Twitter / X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-on-surface-variant cursor-pointer"
              title={lang === "es" ? "Copiar enlace" : "Copy link"}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">
                {copied ? "check" : "link"}
              </span>
            </button>
          </div>
        </div>

        {/* Related Stories */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-outline-variant/30 pb-4">
            <h2 className="font-serif text-3xl tracking-tight font-medium">{t.relatedTitle}</h2>
            <button
              onClick={() => setPage("blog")}
              className="font-label-caps text-label-caps text-primary border-b border-primary hover:opacity-75 transition-opacity tracking-widest font-bold"
            >
              {t.relatedAction}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("blog")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Tequila and Chocolate pairing"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Platillo 5 1937 Nativo.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard1Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard1Title}
              </h4>
            </div>
            {/* Card 2 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("about")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Agave Jima Harvesting"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Jimado Empleado Casa Loy Tequilera.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard2Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard2Title}
              </h4>
            </div>
            {/* Card 3 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("turismo")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Luxury resort lounge in Los Altos"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Terraza Casa Loy Experiencias.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard3Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard3Title}
              </h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
