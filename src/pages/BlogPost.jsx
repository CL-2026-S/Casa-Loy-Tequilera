import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BlogPost({ lang = "es", setPage }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Reading progress bar state
  const [scrollProgress, setScrollProgress] = useState(0);

  // Claps / Reacciones interactivas
  const [claps, setClaps] = useState(() => {
    const saved = localStorage.getItem(`casa_loy_claps_${slug}`);
    return saved ? parseInt(saved, 10) : 18;
  });
  const [hasClapped, setHasClapped] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", text: "" });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState("");
  const [commentErrorMsg, setCommentErrorMsg] = useState("");
  const [likedCommentIds, setLikedCommentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("casa_loy_liked_comments") || "[]");
    } catch {
      return [];
    }
  });

  // Track scroll progress for reading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch("/api/cms?type=blog");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAllPosts(data);
            const found = data.find(p => p.slug === slug);
            if (found) {
              setPost(found);
            }
          }
        }
      } catch (e) {
        console.error("Error loading blog post:", e);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  // Fetch comments for this article
  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;
      setCommentsLoading(true);
      try {
        const res = await fetch(`/api/blog-comments?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setComments(data);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // SEO & JSON-LD handling
  useEffect(() => {
    let scriptTag = null;
    
    if (post) {
      const postTitle = lang === "es" ? (post.title_es || post.title) : (post.title_en || post.title_es || post.title);
      const postDesc = post.description || "";
      const postKeywords = post.seo_keywords || "";

      document.title = `${postTitle} | Blog Casa Loy`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = postDesc;

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = postKeywords;

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

      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postTitle,
        "description": postDesc,
        "image": post.image_url || "https://casaloy.com/Barra%20Casa%20Loy%20Experiencias.webp",
        "datePublished": post.published_at || post.created_at,
        "dateModified": post.published_at || post.created_at,
        "author": {
          "@type": "Person",
          "name": post.author_es || "Maestro Tequilero Casa Loy",
          "jobTitle": post.author_role || "Maestro Tequilero",
          "worksFor": {
            "@type": "Organization",
            "name": "Casa Loy Tequilera"
          }
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
        "datePublished": "2024-10-24T10:30:00Z",
        "author": {
          "@type": "Person",
          "name": "Don Manuel Loy",
          "jobTitle": "Patriarca & Guardián del Terroir",
          "worksFor": {
            "@type": "Organization",
            "name": "Casa Loy Tequilera"
          }
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
      if (scriptTag) scriptTag.remove();
    };
  }, [post, lang, loading]);

  // Social sharing
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Claps / Likes handler
  const handleClap = () => {
    const nextClaps = claps + 1;
    setClaps(nextClaps);
    setHasClapped(true);
    localStorage.setItem(`casa_loy_claps_${slug}`, nextClaps.toString());
  };

  // Like a specific comment
  const handleLikeComment = async (commentId) => {
    if (likedCommentIds.includes(commentId)) return;

    // Optimistic UI update
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c));
    const nextLiked = [...likedCommentIds, commentId];
    setLikedCommentIds(nextLiked);
    localStorage.setItem("casa_loy_liked_comments", JSON.stringify(nextLiked));

    try {
      await fetch("/api/blog-comments?action=like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, postSlug: slug })
      });
    } catch (e) {
      console.warn("Could not sync like to server:", e);
    }
  };

  // Submit comment handler
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) return;

    setIsSubmittingComment(true);
    setCommentErrorMsg("");
    setCommentSuccessMsg("");

    const payload = {
      post_slug: slug,
      author_name: commentForm.name.trim(),
      author_email: commentForm.email.trim() || null,
      comment_text: commentForm.text.trim()
    };

    try {
      const res = await fetch("/api/blog-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const createdComment = data.comment || {
          id: `local_${Date.now()}`,
          ...payload,
          likes: 0,
          created_at: new Date().toISOString()
        };

        setComments(prev => [...prev, createdComment]);
        setCommentForm({ name: "", email: "", text: "" });
        setCommentSuccessMsg(
          lang === "es"
            ? "¡Gracias por enriquecer la conversación! Tu comentario ha sido publicado."
            : "Thank you for joining the conversation! Your comment has been published."
        );
        setTimeout(() => setCommentSuccessMsg(""), 6000);
      } else {
        setCommentErrorMsg(data.error || (lang === "es" ? "Error al publicar comentario." : "Error posting comment."));
      }
    } catch (err) {
      console.error(err);
      setCommentErrorMsg(lang === "es" ? "Error de conexión." : "Network connection error.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Compute Prev / Next article
  const { prevPost, nextPost } = useMemo(() => {
    if (!allPosts || allPosts.length <= 1) return { prevPost: null, nextPost: null };
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    if (currentIndex === -1) return { prevPost: null, nextPost: null };

    const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    return { prevPost: prev, nextPost: next };
  }, [allPosts, slug]);

  // Helpers for text metrics & formatting
  const calculateReadTime = (bodyText) => {
    if (!bodyText) return 4;
    const clean = String(bodyText).replace(/<[^>]*>?/gm, " ");
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 190));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const dateFormatted = d.toLocaleDateString(
      lang === "es" ? "es-MX" : "en-US",
      { day: "numeric", month: "long", year: "numeric" }
    );

    const timeFormatted = d.toLocaleTimeString(
      lang === "es" ? "es-MX" : "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: false }
    );

    return lang === "es"
      ? `${dateFormatted} • ${timeFormatted} hrs`
      : `${dateFormatted} at ${timeFormatted}`;
  };

  // Scroll smoothly to comments section
  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Curated Fallback Static Content
  const staticContent = {
    es: {
      category: "CULTURA & GASTRONOMÍA",
      title: "El Arte de la Cata: Una Inmersión en los Sentidos",
      authorName: "Don Manuel Loy",
      authorRole: "Patriarca & Guardián del Terroir",
      authorPhoto: "/Don Manuel Loy.webp",
      authorBio: "Con más de cuatro décadas custodiando los campos de agave azul en Ayotlán, Don Manuel Loy transmite la maestría del tiempo, el fuego y la destilación de ultra-lujo.",
      date: "2024-10-24T10:30:00Z",
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
      authorName: "Don Manuel Loy",
      authorRole: "Patriarch & Guardian of the Terroir",
      authorPhoto: "/Don Manuel Loy.webp",
      authorBio: "With over four decades safeguarding the blue agave fields in Ayotlán, Don Manuel Loy passes down the mastery of time, fire, and ultra-luxury distillation.",
      date: "2024-10-24T10:30:00Z",
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

  const t = staticContent[lang] || staticContent.es;

  // Resolve Author Information dynamically
  const authorData = useMemo(() => {
    if (post) {
      const name = lang === "es" ? post.author_es : (post.author_en || post.author_es || "Casa Loy Tequilera");
      const role = post.author_role || (lang === "es" ? "Maestro Tequilero & Selección de Origen" : "Master Distiller & Origin Selection");
      const bio = post.author_bio || (lang === "es"
        ? "Custodiando la pureza del agave azul y la tradición destiladora centenaria en las tierras altas de Jalisco."
        : "Safeguarding the purity of blue agave and centuries-old distillation tradition in the highlands of Jalisco.");
      
      // Smart portrait selection
      let photo = post.author_photo;
      if (!photo) {
        if (post.category?.toLowerCase().includes("gastro") || post.category?.toLowerCase().includes("mixo")) {
          photo = "/Sergio Chef.webp";
        } else if (post.category?.toLowerCase().includes("cultura") || post.category?.toLowerCase().includes("festiv")) {
          photo = "/Don Manuel Loy.webp";
        } else {
          photo = "/Empleado Jimador Casa Loy Tequilera.webp";
        }
      }
      return { name, role, bio, photo };
    }
    return {
      name: t.authorName,
      role: t.authorRole,
      bio: t.authorBio,
      photo: t.authorPhoto
    };
  }, [post, lang, t]);

  const rawDate = post ? (post.published_at || post.created_at) : t.date;
  const formattedDateWithTime = formatDateTime(rawDate);
  const readTimeEstimate = calculateReadTime(post ? (post.body_es || post.description) : t.p1 + t.p2 + t.section1Text);
  const postCategory = post ? (post.category || "NOTICIAS") : t.category;
  const postTitle = post 
    ? (lang === "es" ? (post.title_es || post.title) : (post.title_en || post.title_es || post.title))
    : t.title;
  const postDescription = post ? post.description : t.quote;
  const postFeaturedImage = post ? (post.image_url || "/Barra Casa Loy Experiencias.webp") : "/Barra Casa Loy Experiencias.webp";
  const postKeywordsArray = post?.seo_keywords 
    ? post.seo_keywords.split(",").map(k => k.trim()).filter(Boolean)
    : ["Tequila Artesanal", "Tradición Agavera", "Casa Loy", "Los Altos de Jalisco", "Origen Certificado"];

  return (
    <div className="bg-[#FAF8F5] text-on-surface text-left min-h-screen relative selection:bg-primary/20 selection:text-primary">
      {/* 1. Subtle Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#8C4723] via-[#D4AF37] to-[#8C4723] z-50 transition-all duration-150 ease-out shadow-sm"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 2. Floating Interaction Dock (Desktop Floating Left / Mobile Sticky Bottom) */}
      <aside aria-label="Social and comments" className="fixed bottom-6 right-6 md:bottom-auto md:top-1/3 md:left-6 md:right-auto z-40 flex md:flex-col items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 rounded-full border border-stone-200/80 shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Claps / Likes */}
        <button
          onClick={handleClap}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative group cursor-pointer ${
            hasClapped ? "bg-primary text-white scale-105" : "hover:bg-stone-100 text-stone-700"
          }`}
          title={lang === "es" ? "Aplaude este artículo" : "Clap for this story"}
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
            favorite
          </span>
          <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            {claps}
          </span>
        </button>

        {/* Jump to comments */}
        <button
          onClick={scrollToComments}
          className="w-11 h-11 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-all relative group cursor-pointer"
          title={lang === "es" ? "Ir a los comentarios" : "Jump to comments"}
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
            chat_bubble
          </span>
          {comments.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#8C4723] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {comments.length}
            </span>
          )}
        </button>

        <div className="w-[1px] h-4 md:w-4 md:h-[1px] bg-stone-200" />

        {/* WhatsApp Share */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + " - Casa Loy: " + window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full hover:bg-[#25D366] hover:text-white flex items-center justify-center text-stone-600 transition-all cursor-pointer"
          title="WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
          </svg>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full hover:bg-stone-900 hover:text-white flex items-center justify-center text-stone-600 transition-all cursor-pointer relative"
          title={lang === "es" ? "Copiar enlace" : "Copy link"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? "check" : "link"}
          </span>
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-white text-[10px] font-sans px-2 py-0.5 rounded shadow-md">
              {lang === "es" ? "¡Copiado!" : "Copied!"}
            </span>
          )}
        </button>
      </aside>

      {/* Editorial Header */}
      <header className="max-w-4xl mx-auto px-gutter pt-36 md:pt-44 pb-8 text-center animate-fade-in-slide">
        {/* Category & Badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => navigate("/blog")}
            className="font-label-caps text-secondary tracking-[0.35em] uppercase font-bold text-[11px] md:text-xs hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            JOURNAL
          </button>
          <span className="text-stone-300">•</span>
          <span className="font-label-caps text-primary tracking-[0.25em] uppercase font-bold text-[11px] md:text-xs bg-primary/5 px-3 py-1 border border-primary/15 rounded-full">
            {postCategory}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#1A1816] leading-[1.12] tracking-tight font-light max-w-4xl mx-auto mb-6">
          {postTitle}
        </h1>

        {/* Subtitle / Quote description */}
        {postDescription && (
          <p className="font-serif text-base sm:text-lg md:text-xl text-stone-600 italic font-light max-w-2xl mx-auto leading-relaxed mb-10">
            {postDescription}
          </p>
        )}

        {/* ========================================================================= */}
        {/* 3. LITERAL BLOG BYLINE (FOTO, NOMBRE, CARGO, FECHA, HORA, TIEMPO LECTURA) */}
        {/* ========================================================================= */}
        <div className="max-w-2xl mx-auto bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-sm mt-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Author Photo, Name and Role */}
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={authorData.photo}
                  alt={authorData.name}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm bg-stone-100"
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8C4723] rounded-full flex items-center justify-center text-white text-[10px] shadow-sm"
                  title="Verificado Casa Loy"
                >
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-tight hover:text-primary transition-colors">
                    {authorData.name}
                  </span>
                </div>
                <p className="font-navigation text-[11px] text-[#8C4723] uppercase tracking-wider font-semibold mt-0.5">
                  {authorData.role}
                </p>
              </div>
            </div>

            {/* Publication Timestamp, Reading Time & Comments Anchor */}
            <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 sm:gap-1 text-xs text-stone-500 font-sans border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
              {/* Fecha y Hora Exacta */}
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span className="material-symbols-outlined text-[15px] text-[#8C4723]">
                  schedule
                </span>
                <span>{formattedDateWithTime}</span>
              </div>

              {/* Tiempo de lectura y Comentarios */}
              <div className="flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                  {lang === "es" ? `${readTimeEstimate} min de lectura` : `${readTimeEstimate} min read`}
                </span>
                <span>•</span>
                <button
                  onClick={scrollToComments}
                  className="flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                  {comments.length} {lang === "es" ? "comentarios" : "comments"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-5xl mx-auto px-gutter mb-14 md:mb-20 animate-fade-in-slide">
        <div className="overflow-hidden rounded-xl bg-[#F4EFE6] border border-stone-200/80 shadow-md">
          <img
            alt={postTitle}
            className="w-full h-auto object-cover max-h-[75vh] mx-auto hover:scale-[1.01] transition-transform duration-[1.5s]"
            src={postFeaturedImage}
          />
        </div>
      </div>

      {/* Main Editorial Content Container */}
      <main className="max-w-container-max mx-auto px-gutter md:px-margin-desktop pb-24">
        
        {/* Dynamic Post Body (From Database) */}
        {post ? (
          <article className="max-w-3xl mx-auto space-y-8 text-base md:text-lg text-stone-800 leading-[1.85] font-light font-sans dynamic-blog-body">
            <div dangerouslySetInnerHTML={{ __html: lang === "es" ? post.body_es : (post.body_en || post.body_es) }} />
          </article>
        ) : (
          /* Static Editorial Post Content */
          <>
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-24 max-w-4xl mx-auto">
              <div className="col-span-12 lg:col-span-8 space-y-8 text-base md:text-lg text-stone-800 leading-[1.85] font-light font-sans">
                <p className="first-letter:float-left first-letter:font-serif first-letter:text-[5rem] first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:text-primary first-letter:font-semibold">
                  {t.p1}
                </p>
                <p>{t.p2}</p>

                <div className="pt-8">
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 text-primary tracking-tight font-medium">
                    {t.section1Title}
                  </h2>
                  <p className="mb-6">{t.section1Text}</p>
                </div>
              </div>

              <aside className="col-span-12 lg:col-span-4 sticky top-28 h-fit mt-8 lg:mt-0">
                <div className="bg-white/80 backdrop-blur-md border border-[#8C4723]/20 rounded-xl p-6 space-y-5 shadow-sm">
                  <h3 className="font-label-caps text-xs text-primary border-b border-primary/20 pb-3 tracking-widest font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                    {t.asideTitle}
                  </h3>
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="font-bold text-stone-900 uppercase text-[11px] tracking-wider mb-0.5">
                        {t.asideItem1Title}
                      </p>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {t.asideItem1Text}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 uppercase text-[11px] tracking-wider mb-0.5">
                        {t.asideItem2Title}
                      </p>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {t.asideItem2Text}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 uppercase text-[11px] tracking-wider mb-0.5">
                        {t.asideItem3Title}
                      </p>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {t.asideItem3Text}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </article>

            {/* Interlude Visual */}
            <figure className="w-full max-w-4xl mx-auto mb-20">
              <div className="h-[360px] md:h-[500px] overflow-hidden rounded-xl shadow-md">
                <img
                  alt="Añejamiento en barricas Casa Loy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  src="/Añejamiento Barricas.webp"
                />
              </div>
              <figcaption className="mt-3 font-body-md text-xs italic text-center text-stone-500 font-light">
                {t.caption1}
              </figcaption>
            </figure>

            <section className="max-w-3xl mx-auto mb-20 space-y-8 text-left text-base md:text-lg text-stone-800 leading-[1.85] font-light font-sans">
              <h2 className="font-serif text-3xl md:text-4xl text-left tracking-tight font-medium text-stone-900">
                {t.section2Title}
              </h2>
              <p>{t.section2Text1}</p>
              <p>{t.section2Text2}</p>
            </section>
          </>
        )}

        {/* Keywords / Tags */}
        {postKeywordsArray.length > 0 && (
          <section aria-label="Tags del artículo" className="max-w-3xl mx-auto mt-14 pb-8 border-b border-stone-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-navigation text-xs uppercase tracking-widest text-stone-400 font-semibold mr-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sell</span>
                {lang === "es" ? "Etiquetas:" : "Tags:"}
              </span>
              {postKeywordsArray.map((tag, idx) => (
                <span
                  key={idx}
                  className="font-navigation text-[11px] uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80 px-3 py-1 font-semibold rounded-md select-none transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. TARJETA "ACERCA DEL AUTOR" (AUTHOR BIO CARD)                           */}
        {/* ========================================================================= */}
        <section aria-label="Sobre el autor" className="max-w-3xl mx-auto mt-14 p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-sm text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={authorData.photo}
              alt={authorData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#D4AF37] shadow-md shrink-0 bg-stone-100"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-navigation text-[10px] uppercase tracking-widest text-[#8C4723] font-bold block">
                    {lang === "es" ? "ESCRITO POR" : "WRITTEN BY"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
                    {authorData.name}
                  </h3>
                </div>
                <span className="font-navigation text-[11px] font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {authorData.role}
                </span>
              </div>
              <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                {authorData.bio}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigate("/blog")}
                  className="font-navigation text-xs uppercase tracking-wider text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {lang === "es" ? "Ver todas las publicaciones del Journal" : "View all Journal publications"}
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. NAVEGACIÓN ANTERIOR / SIGUIENTE ARTÍCULO                              */}
        {/* ========================================================================= */}
        {(prevPost || nextPost) && (
          <nav aria-label="Navegación de historias" className="max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <div
                onClick={() => navigate(`/blog/${prevPost.slug}`)}
                className="group cursor-pointer p-5 bg-white border border-stone-200/80 rounded-xl hover:border-primary/40 hover:shadow-md transition-all text-left"
              >
                <span className="font-navigation text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  {lang === "es" ? "Artículo Anterior" : "Previous Story"}
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                  {prevPost.title}
                </h4>
              </div>
            ) : <div />}

            {nextPost ? (
              <div
                onClick={() => navigate(`/blog/${nextPost.slug}`)}
                className="group cursor-pointer p-5 bg-white border border-stone-200/80 rounded-xl hover:border-primary/40 hover:shadow-md transition-all text-right sm:text-right"
              >
                <span className="font-navigation text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center justify-end gap-1 mb-1">
                  {lang === "es" ? "Siguiente Artículo" : "Next Story"}
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                  {nextPost.title}
                </h4>
              </div>
            ) : <div />}
          </nav>
        )}

        {/* ========================================================================= */}
        {/* 6. ESPACIO COMPLETO PARA COMENTARIOS (COMMENTS SECTION)                  */}
        {/* ========================================================================= */}
        <section id="comments-section" aria-label="Comentarios" className="max-w-3xl mx-auto mt-16 pt-12 border-t border-stone-200 text-left">
          
          {/* Comments Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8C4723]/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">forum</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {lang === "es" ? "Comentarios de la Comunidad" : "Community Comments"}
                </h2>
                <p className="text-xs text-stone-500 font-sans">
                  {comments.length} {comments.length === 1 ? (lang === "es" ? "comentario publicado" : "comment published") : (lang === "es" ? "comentarios publicados" : "comments published")}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario para dejar comentario */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              {lang === "es" ? "Únete a la conversación" : "Leave a Comment"}
            </h3>
            <p className="text-xs text-stone-500 font-light mb-6">
              {lang === "es" 
                ? "Comparte tus impresiones, dudas o experiencias sobre el destilado. Tu correo no será publicado."
                : "Share your thoughts, questions, or experiences. Your email will remain private."}
            </p>

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {lang === "es" ? "Nombre o Apodo *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder={lang === "es" ? "Ej. Arq. Sofía Mendoza" : "E.g. Sophia Miller"}
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {lang === "es" ? "Correo Electrónico (Privado)" : "Email Address (Private)"}
                  </label>
                  <input
                    type="email"
                    maxLength={120}
                    placeholder={lang === "es" ? "tu@correo.com" : "you@email.com"}
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {lang === "es" ? "Comentario *" : "Comment *"}
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={1500}
                  placeholder={lang === "es" ? "¿Qué opinas sobre este artículo o tu experiencia con Casa Loy?" : "What are your thoughts on this story or your experience with Casa Loy?"}
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-4 text-sm text-stone-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
              </div>

              {commentSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                  {commentSuccessMsg}
                </div>
              )}

              {commentErrorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-rose-600">error</span>
                  {commentErrorMsg}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-400">
                  {lang === "es" ? "* Campos obligatorios" : "* Required fields"}
                </span>

                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-primary hover:bg-[#6D3418] disabled:bg-stone-300 text-white font-navigation text-xs tracking-widest uppercase font-bold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingComment ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {lang === "es" ? "PUBLICANDO..." : "POSTING..."}
                    </>
                  ) : (
                    <>
                      {lang === "es" ? "PUBLICAR COMENTARIO" : "POST COMMENT"}
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Listado de comentarios */}
          <div className="space-y-4">
            {commentsLoading ? (
              <div className="py-12 text-center text-stone-400">
                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs">{lang === "es" ? "Cargando comentarios..." : "Loading comments..."}</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-white/50 border border-dashed border-stone-200 rounded-xl p-8">
                <span className="material-symbols-outlined text-3xl text-stone-300 mb-2">
                  chat_bubble_outline
                </span>
                <p className="font-serif text-lg text-stone-700 font-medium">
                  {lang === "es" ? "Sé el primero en comentar" : "Be the first to comment"}
                </p>
                <p className="text-xs text-stone-500 font-light mt-1">
                  {lang === "es" 
                    ? "Inicia la conversación sobre este tema y comparte tu punto de vista." 
                    : "Start the conversation and share your point of view."}
                </p>
              </div>
            ) : (
              comments.map((c) => {
                const isLiked = likedCommentIds.includes(c.id);
                // Dynamic initials monogram
                const initials = (c.author_name || "A")
                  .split(" ")
                  .map(n => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={c.id}
                    className="p-5 sm:p-6 bg-white border border-stone-200/80 rounded-xl shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8C4723] to-[#D4AF37] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-tight">
                            {c.author_name}
                          </h4>
                          <span className="text-[11px] text-stone-400 font-sans block mt-0.5">
                            {formatDateTime(c.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Botón de Like a Comentario */}
                      <button
                        onClick={() => handleLikeComment(c.id)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isLiked
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                        }`}
                        title={lang === "es" ? "Me gusta este comentario" : "Like this comment"}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isLiked ? "favorite" : "favorite_border"}
                        </span>
                        <span className="font-medium text-[11px]">{c.likes || 0}</span>
                      </button>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed font-light pl-13">
                      {c.comment_text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

        </section>

        {/* Related Stories */}
        <section aria-label="Historias relacionadas" className="mt-24 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
              {t.relatedTitle}
            </h2>
            <button
              onClick={() => navigate("/blog")}
              className="font-label-caps text-xs text-primary border-b border-primary hover:opacity-75 transition-opacity tracking-widest font-bold cursor-pointer"
            >
              {t.relatedAction}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="group cursor-pointer text-left" onClick={() => navigate("/blog")}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4 shadow-sm bg-stone-100">
                <img
                  alt="Platillo Restaurante 1937 Nativo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Platillo 5 1937 Nativo.webp"
                />
              </div>
              <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest font-semibold">
                {t.relatedCard1Cat}
              </span>
              <h4 className="font-serif text-lg font-bold group-hover:text-primary transition-colors text-stone-900">
                {t.relatedCard1Title}
              </h4>
            </div>

            <div className="group cursor-pointer text-left" onClick={() => navigate("/quienes-somos")}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4 shadow-sm bg-stone-100">
                <img
                  alt="Jimado Empleado Casa Loy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Jimado Empleado Casa Loy Tequilera.webp"
                />
              </div>
              <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest font-semibold">
                {t.relatedCard2Cat}
              </span>
              <h4 className="font-serif text-lg font-bold group-hover:text-primary transition-colors text-stone-900">
                {t.relatedCard2Title}
              </h4>
            </div>

            <div className="group cursor-pointer text-left" onClick={() => navigate("/turismo")}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4 shadow-sm bg-stone-100">
                <img
                  alt="Terraza Casa Loy Experiencias"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Terraza Casa Loy Experiencias.webp"
                />
              </div>
              <span className="font-label-caps text-[10px] text-stone-400 block mb-1 uppercase tracking-widest font-semibold">
                {t.relatedCard3Cat}
              </span>
              <h4 className="font-serif text-lg font-bold group-hover:text-primary transition-colors text-stone-900">
                {t.relatedCard3Title}
              </h4>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
