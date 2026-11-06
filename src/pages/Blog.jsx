import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TurnstileWidget from "../components/TurnstileWidget";

export default function Blog({ setPage, lang = "es" }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("recent"); // recent | popular | liked
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [renderTime] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dynamicArticles, setDynamicArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper for read time based on full body HTML or description
  const calculateReadTime = (bodyText, desc) => {
    const raw = bodyText || desc || "";
    if (!raw) return 3;
    const clean = String(raw).replace(/<[^>]*>?/gm, " ");
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 180));
  };

  // Helper for date formatting
  const formatCardDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(
      lang === "es" ? "es-MX" : "en-US",
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  // Default curated showcase articles as safety fallback if offline
  const fallbackShowcaseArticles = [
    {
      id: "el-arte-de-la-cata",
      category: "Cultura & Gastronomía",
      label: "CATA & TERROIR",
      title: lang === "es" ? "El Arte de la Cata: Una Inmersión en los Sentidos" : "The Art of Tasting: An Immersion in the Senses",
      desc: lang === "es"
        ? "Descubra el diálogo silencioso entre la tierra volcánica, la paciencia del roble y el retrogusto inconfundible de Casa Loy."
        : "Discover the silent dialogue between volcanic soil, the patience of oak, and Casa Loy's unmistakable finish.",
      body: "",
      img: "/Barra Casa Loy Experiencias.webp",
      published_at: "2026-07-20T10:00:00Z",
      author_name: "Don Manuel Loy",
      author_role: lang === "es" ? "Patriarca & Guardián del Terroir" : "Patriarch & Terroir Guardian",
      author_photo: "/Don Manuel Loy.webp",
      clickable: true,
      views_count: 215,
      likes_count: 32,
      comments_count: 2
    }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/cms?type=blog");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((b) => {
              let photo = b.author_photo;
              if (!photo) {
                if (b.category?.toLowerCase().includes("gastro") || b.category?.toLowerCase().includes("mixo")) {
                  photo = "/Sergio Chef.webp";
                } else if (b.category?.toLowerCase().includes("cultura") || b.category?.toLowerCase().includes("festiv")) {
                  photo = "/Don Manuel Loy.webp";
                } else {
                  photo = "/Empleado Jimador Casa Loy Tequilera.webp";
                }
              }

              return {
                id: b.slug,
                category: b.category || "Noticias",
                label: b.label || "CRÓNICAS",
                title: lang === "es" ? (b.title_es || b.title) : (b.title_en || b.title_es || b.title),
                desc: b.description,
                body: lang === "es" ? (b.body_es || b.description) : (b.body_en || b.body_es || b.description),
                img: b.image_url || "/Barra Casa Loy Experiencias.webp",
                published_at: b.published_at || b.created_at,
                author_name: lang === "es" ? (b.author_es || "Casa Loy Tequilera") : (b.author_en || b.author_es || "Casa Loy Tequilera"),
                author_role: b.author_role || (lang === "es" ? "Maestro Tequilero & Selección" : "Master Distiller"),
                author_photo: photo,
                clickable: true,
                views_count: Number(b.views_count || 0),
                likes_count: Number(b.likes_count || 0),
                comments_count: Number(b.comments_count || 0)
              };
            });

            setDynamicArticles(mapped);
          } else {
            setDynamicArticles(fallbackShowcaseArticles);
          }
        } else {
          setDynamicArticles(fallbackShowcaseArticles);
        }
      } catch (e) {
        console.error("Error fetching dynamic blog articles:", e);
        setDynamicArticles(fallbackShowcaseArticles);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [lang]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source_page: "blog",
          _hp: honeypot,
          _render_time: renderTime,
          cf_token: turnstileToken
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        setEmail("");
        localStorage.setItem("casa_loy_subscribed", "true");
      } else {
        setStatus("error");
        setErrorMessage(data.error || (lang === "es" ? "Error al suscribirse." : "Subscription error."));
      }
    } catch (err) {
      console.error("Blog page subscription fetch error:", err);
      setStatus("error");
      setErrorMessage(lang === "es" ? "Error de conexión." : "Connection error.");
    }
  };

  const filters = [
    { id: "Todas", label: lang === "es" ? "Todas" : "All" },
    { id: "Noticias", label: lang === "es" ? "Noticias" : "News" },
    { id: "Festividades", label: lang === "es" ? "Festividades" : "Celebrations" },
    { id: "Cultura & Gastronomía", label: lang === "es" ? "Cultura & Terroir" : "Culture & Terroir" },
    { id: "Lanzamientos", label: lang === "es" ? "Lanzamientos" : "Launches" },
    { id: "Datos Relevantes", label: lang === "es" ? "Procesos" : "Processes" },
    { id: "Mixología", label: lang === "es" ? "Mixología" : "Mixology" },
    { id: "Sustentabilidad", label: lang === "es" ? "Sustentabilidad" : "Sustainability" },
  ];

  const content = {
    es: {
      heroOvertitle: "CRÓNICAS, TERROIR Y MAESTRÍA",
      heroTitle: "JOURNAL",
      heroDesc: "El espacio editorial oficial de Casa Loy Tequilera: historias que nacen en la tierra volcánica de Ayotlán y maduran con la maestría de nuestros artesanos.",
      readMore: "LEER CRÓNICA COMPLETA",
      featuredBadge: "CRÓNICA DESTACADA",
      searchPlaceholder: "Buscar crónicas, aromas, procesos...",
      sortRecent: "Más recientes",
      sortPopular: "Más leídos",
      sortLiked: "Más valorados",
      viewsLabel: "lecturas",
      newsletterOvertitle: "COMUNIDAD EXCLUSIVA",
      newsletterTitle: "Únete a la Comunidad del Journal",
      newsletterDesc: "Recibe crónicas exclusivas, lanzamientos privados y notas de cata directo en tu bandeja.",
      newsletterSuccess: "¡Gracias por unirse a nuestra comunidad editorial!",
      newsletterPlaceholder: "CORREO ELECTRÓNICO",
      newsletterSubmit: "SUSCRIBIRSE",
      newsletterDisclaimer: "Al suscribirse, acepta nuestra política de privacidad y términos de servicio.",
    },
    en: {
      heroOvertitle: "CHRONICLES, TERROIR & MASTERY",
      heroTitle: "JOURNAL",
      heroDesc: "The official editorial journal of Casa Loy Tequilera: stories born in Ayotlán's volcanic soil and matured with our artisans' mastery.",
      readMore: "READ FULL CHRONICLE",
      featuredBadge: "FEATURED CHRONICLE",
      searchPlaceholder: "Search stories, terroir, distillation...",
      sortRecent: "Most recent",
      sortPopular: "Most read",
      sortLiked: "Most appreciated",
      viewsLabel: "reads",
      newsletterOvertitle: "EXCLUSIVE COMMUNITY",
      newsletterTitle: "Join the Journal Community",
      newsletterDesc: "Receive exclusive chronicles, private launches, and tasting notes directly in your inbox.",
      newsletterSuccess: "Thank you for joining our editorial community!",
      newsletterPlaceholder: "EMAIL ADDRESS",
      newsletterSubmit: "SUBSCRIBE",
      newsletterDisclaimer: "By subscribing, you agree to our privacy policy and terms of service.",
    }
  };

  const currentT = content[lang] || content.es;

  // Filter, Search & Sort logic
  const filteredArticles = useMemo(() => {
    const filtered = dynamicArticles.filter((art) => {
      const matchesCategory =
        activeFilter === "Todas" ||
        art.category?.toLowerCase() === activeFilter.toLowerCase() ||
        (activeFilter === "Noticias" && (art.category === "Noticias" || !art.category));

      const matchesSearch =
        !searchQuery.trim() ||
        art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author_name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.views_count || 0) - (a.views_count || 0);
      }
      if (sortBy === "liked") {
        const scoreB = (b.likes_count || 0) * 2 + (b.comments_count || 0) * 3;
        const scoreA = (a.likes_count || 0) * 2 + (a.comments_count || 0) * 3;
        return scoreB - scoreA;
      }
      // default: recent
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    });
  }, [dynamicArticles, activeFilter, searchQuery, sortBy]);

  const showFeaturedSpotlight = activeFilter === "Todas" && !searchQuery.trim() && sortBy === "recent" && filteredArticles.length > 0;
  const featuredArticle = showFeaturedSpotlight ? filteredArticles[0] : null;
  const gridArticles = showFeaturedSpotlight ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className="bg-[#FAF8F5] text-on-surface text-left min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Editorial Hero Header */}
      <section className="relative h-[48vh] md:h-[56vh] w-full flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Campo de Agave Ayotlán Casa Loy Tequilera.webp" />
            <img
              alt="Campos de Agave Casa Loy - El Origen"
              className="w-full h-full object-cover scale-105 brightness-[0.62]"
              src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75"></div>
        </div>

        {/* Editorial Journal Title Overlay */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto select-none pt-12 animate-fade-in-slide">
          <span className="font-navigation text-[11px] md:text-xs text-[#D4AF37] tracking-[0.45em] block uppercase font-bold mb-3">
            {currentT.heroOvertitle}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.2em] uppercase font-medium mr-[-0.2em] mb-4">
            {currentT.heroTitle}
          </h1>
          <p className="font-serif text-base md:text-lg text-stone-100 italic max-w-2xl mx-auto font-normal leading-relaxed">
            {currentT.heroDesc}
          </p>
        </div>
      </section>

      {/* Filter, Sort & Search Bar */}
      <section className="bg-white sticky top-16 z-40 border-b border-stone-200/80 shadow-xs">
        <div className="max-w-container-max mx-auto px-margin-desktop py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto select-none no-scrollbar whitespace-nowrap pb-1 lg:pb-0">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`font-navigation text-xs py-2 px-3.5 rounded-full transition-all duration-200 font-semibold tracking-wide cursor-pointer ${
                    activeFilter === f.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort & Instant Search Box */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label={lang === "es" ? "Ordenar artículos" : "Sort articles"}
                  className="bg-stone-50 border border-stone-300 rounded-full pl-3.5 pr-8 py-2.5 text-xs font-semibold text-stone-700 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                >
                  <option value="recent">{currentT.sortRecent}</option>
                  <option value="popular">{currentT.sortPopular}</option>
                  <option value="liked">{currentT.sortLiked}</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentT.searchPlaceholder}
                  className="w-full bg-stone-50 border border-stone-300 rounded-full pl-9 pr-8 py-2.5 text-xs text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Blog Feed Grid */}
      {isLoading ? (
        <section className="py-24 max-w-container-max mx-auto px-margin-desktop text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-stone-500 font-sans tracking-wide">
            {lang === "es" ? "Cargando el Journal..." : "Loading the Journal..."}
          </p>
        </section>
      ) : (
        <section className="py-12 md:py-16 max-w-container-max mx-auto px-margin-desktop space-y-12">
          
          {/* Featured Article Spotlight */}
          {featuredArticle && (
            <article
              onClick={() => featuredArticle.clickable && navigate(`/blog/${featuredArticle.id}`)}
              className="group cursor-pointer bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 animate-fade-in-slide"
            >
              <div className="lg:col-span-7 relative overflow-hidden bg-stone-100 min-h-[280px] sm:min-h-[360px]">
                <img
                  src={featuredArticle.img}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#8C4723] text-white font-navigation text-[10px] uppercase tracking-widest font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    {currentT.featuredBadge}
                  </span>
                  <span className="bg-white/95 backdrop-blur-xs text-stone-900 font-navigation text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-xs">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  {/* Live Metrics Row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-medium font-sans">
                    <span>{formatCardDate(featuredArticle.published_at)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      {calculateReadTime(featuredArticle.body, featuredArticle.desc)} min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-stone-700" title={lang === "es" ? "Visitas reales" : "Real views"}>
                      <span className="material-symbols-outlined text-[15px] text-[#8C4723]">visibility</span>
                      {featuredArticle.views_count}
                    </span>
                    <span className="flex items-center gap-1 text-rose-700 font-semibold" title={lang === "es" ? "Reacciones" : "Reactions"}>
                      <span className="material-symbols-outlined text-[15px]">favorite</span>
                      {featuredArticle.likes_count}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-semibold" title={lang === "es" ? "Comentarios" : "Comments"}>
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      {featuredArticle.comments_count}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-950 leading-tight group-hover:text-primary transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="font-sans text-stone-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {featuredArticle.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author_photo}
                      alt={featuredArticle.author_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shadow-xs shrink-0"
                    />
                    <div>
                      <span className="font-serif font-bold text-sm text-stone-900 block leading-tight">
                        {featuredArticle.author_name}
                      </span>
                      <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-wider block font-bold">
                        {featuredArticle.author_role}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-navigation text-[11px] uppercase tracking-widest font-bold text-primary group-hover:translate-x-1 transition-transform">
                    {lang === "es" ? "Leer" : "Read"}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Articles Grid */}
          {gridArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 animate-fade-in-slide">
              {gridArticles.map((art) => {
                const readTime = calculateReadTime(art.body, art.desc);
                const cardDate = formatCardDate(art.published_at);

                return (
                  <article
                    key={art.id}
                    onClick={() => art.clickable && navigate(`/blog/${art.id}`)}
                    className="group cursor-pointer bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between text-left"
                  >
                    <div>
                      {/* Featured Thumbnail */}
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                        <img
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={art.img}
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-primary font-navigation text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-xs">
                          {art.category}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-600 font-medium font-sans">
                          <span>{cardDate}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {readTime} min
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-stone-700" title={lang === "es" ? "Visitas" : "Views"}>
                            <span className="material-symbols-outlined text-[14px] text-[#8C4723]">visibility</span>
                            {art.views_count}
                          </span>
                          <span className="flex items-center gap-1 text-rose-700 font-semibold" title={lang === "es" ? "Reacciones" : "Reactions"}>
                            <span className="material-symbols-outlined text-[14px]">favorite</span>
                            {art.likes_count}
                          </span>
                          <span className="flex items-center gap-1 text-primary font-semibold" title={lang === "es" ? "Comentarios" : "Comments"}>
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            {art.comments_count}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug group-hover:text-primary transition-colors text-stone-950 line-clamp-2">
                          {art.title}
                        </h3>

                        <p className="font-sans text-stone-700 text-sm leading-relaxed font-normal line-clamp-3">
                          {art.desc}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Literal Blog Author Byline */}
                    <div className="p-6 pt-0 border-t border-stone-100 mt-2">
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={art.author_photo}
                            alt={art.author_name}
                            className="w-8 h-8 rounded-full object-cover border border-[#D4AF37] shadow-xs shrink-0"
                          />
                          <div>
                            <span className="font-serif font-bold text-sm text-stone-900 block leading-tight">
                              {art.author_name}
                            </span>
                            <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-wider block font-bold">
                              {art.author_role}
                            </span>
                          </div>
                        </div>

                        <span className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-stone-400 transition-all">
                          <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !featuredArticle ? (
            <div className="text-center py-24 max-w-md mx-auto animate-fade-in-slide">
              <span className="material-symbols-outlined text-4xl text-stone-300 mb-4 font-light select-none">
                search_off
              </span>
              <p className="font-serif text-2xl text-stone-800 mb-2 font-medium">
                {lang === "es" ? "No se encontraron crónicas" : "No stories found"}
              </p>
              <p className="font-body-md text-sm text-stone-500 font-light mb-6">
                {searchQuery
                  ? (lang === "es" ? `No hay resultados para "${searchQuery}". Intenta con otra palabra.` : `No matches for "${searchQuery}". Try another keyword.`)
                  : (lang === "es" ? "Estamos preparando nuevas crónicas sobre esta categoría." : "We are preparing new stories for this category.")}
              </p>
              {(searchQuery || activeFilter !== "Todas") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("Todas");
                  }}
                  className="font-navigation text-xs uppercase tracking-widest text-primary font-bold border-b border-primary pb-1 cursor-pointer"
                >
                  {lang === "es" ? "Ver todas las crónicas" : "View all stories"}
                </button>
              )}
            </div>
          ) : null}
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-[#F3EFE8] py-16 md:py-24 border-t border-stone-200">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left space-y-4">
            <span className="font-navigation text-xs uppercase tracking-[0.3em] text-[#8C4723] font-bold block">
              {currentT.newsletterOvertitle}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-stone-900">
              {currentT.newsletterTitle}
            </h2>
            <p className="font-sans text-sm md:text-base text-stone-600 font-light leading-relaxed">
              {currentT.newsletterDesc}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col gap-4 text-left">
            {/* Anti-Bot Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
              <input
                type="text"
                name="company_fax"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            {status === "success" ? (
              <div className="p-5 bg-white border border-[#D4AF37] rounded-xl text-center shadow-xs">
                <span className="material-symbols-outlined text-2xl text-[#8C4723] mb-1">
                  mark_email_read
                </span>
                <p className="font-serif text-stone-900 font-bold text-sm">
                  {currentT.newsletterSuccess}
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    className="w-full bg-white border border-stone-300 rounded-xl text-stone-900 py-3.5 px-4 focus:outline-none focus:border-primary transition-colors font-sans text-sm placeholder:text-stone-400 shadow-xs"
                    placeholder={currentT.newsletterPlaceholder}
                    required
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading"}
                  />
                </div>
                {status === "error" && (
                  <p className="text-[12px] font-sans text-red-700 font-medium">
                    {errorMessage}
                  </p>
                )}
                <TurnstileWidget
                  theme="light"
                  onVerify={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken("")}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-primary text-white font-navigation text-xs tracking-[0.2em] uppercase py-3.5 px-6 rounded-xl hover:bg-[#6D3418] disabled:bg-stone-400 active:scale-98 transition-all shadow-md cursor-pointer font-bold"
                >
                  {status === "loading" ? (lang === "es" ? "ENVIANDO..." : "SENDING...") : currentT.newsletterSubmit}
                </button>
                <p className="text-[11px] font-sans text-stone-500 font-light">
                  {currentT.newsletterDisclaimer}
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
