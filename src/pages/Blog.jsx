import React, { useState } from "react";

export default function Blog({ setPage, lang = "es" }) {
  const [activeFilter, setActiveFilter] = useState("Noticias");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          source_page: "blog"
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
    { id: "Noticias", label: lang === "es" ? "Noticias" : "News" },
    { id: "Lanzamientos", label: lang === "es" ? "Lanzamientos" : "Launches" },
    { id: "Datos Relevantes", label: lang === "es" ? "Datos Relevantes" : "Key Facts" },
    { id: "Festividades", label: lang === "es" ? "Festivities" : "Festivities" },
    { id: "Mixología", label: lang === "es" ? "Mixología" : "Mixology" },
    { id: "Sustentabilidad", label: lang === "es" ? "Sustentabilidad" : "Sustainability" },
  ];

  const content = {
    es: {
      heroOvertitle: "CULTURA & GASTRONOMÍA",
      heroTitle: "La Nueva Era de la Destilería: El Renacer de Restaurante 1937 Nativo",
      heroDesc: "Un viaje a través del tiempo y el terroir, donde la tradición centenaria se encuentra con la visión contemporánea de la excelencia líquida.",
      readMore: "LEER MÁS",
      
      newsletterOvertitle: "COMUNIDAD",
      newsletterTitle: "Únase a Nuestra Cofradía",
      newsletterDesc: "Recibe crónicas exclusivas, invitaciones a catas privadas y acceso anticipado a nuestras ediciones limitadas.",
      newsletterSuccess: "¡Gracias por unirse a nuestra cofradía de ultra-lujo!",
      newsletterPlaceholder: "SU CORREO ELECTRÓNICO",
      newsletterSubmit: "SUSCRIBIRSE",
      newsletterDisclaimer: "Al suscribirse, acepta nuestra política de privacidad y términos de servicio.",
      
      articles: [
        {
          id: "arte-del-silencio",
          category: "Noticias",
          label: "PROCESOS",
          title: "El Arte del Silencio: Maduración en Roble Francés",
          desc: "Descubra cómo nuestras cavas subterráneas mantienen la temperatura perfecta para una oxigenación lenta y refinada del destilado.",
          img: "/Añejamiento Barricas.webp",
          clickable: true,
        },
        {
          id: "cocteleria-autor",
          category: "Mixología",
          label: "MIXOLOGÍA",
          title: "Coctelería de Autor: Raíces en el Vaso",
          desc: "Tres recetas exclusivas inspiradas en los sabores de Jalisco, diseñadas por nuestro Master Mixologist para este verano.",
          img: "/Barra Casa Loy Experiencias.webp",
        },
        {
          id: "maridaje-perfecto",
          category: "Lanzamientos",
          label: "GASTRONOMÍA",
          title: "Maridaje Perfecto: El Alma de la Tierra en el Plato",
          desc: "Exploramos la conexión intrínseca entre los ingredientes locales y las notas de cata de nuestro tequila blanco.",
          img: "/Platillo 2 1937 Nativo.webp",
        },
      ]
    },
    en: {
      heroOvertitle: "CULTURE & GASTRONOMY",
      heroTitle: "The New Era of the Distillery: The Rebirth of Restaurante 1937 Nativo",
      heroDesc: "A journey through time and terroir, where century-old tradition meets contemporary vision of liquid excellence.",
      readMore: "READ MORE",
      
      newsletterOvertitle: "COMMUNITY",
      newsletterTitle: "Join Our Guild",
      newsletterDesc: "Receive exclusive chronicles, invitations to private tastings, and early access to our limited editions.",
      newsletterSuccess: "Thank you for joining our ultra-luxury guild!",
      newsletterPlaceholder: "YOUR EMAIL ADDRESS",
      newsletterSubmit: "SUBSCRIBE",
      newsletterDisclaimer: "By subscribing, you agree to our privacy policy and terms of service.",
      
      articles: [
        {
          id: "arte-del-silencio",
          category: "Noticias", // matches category filter key
          label: "PROCESSES",
          title: "The Art of Silence: Maturation in French Oak",
          desc: "Discover how our underground cellars maintain the perfect temperature for slow and refined oxygenation of the distillate.",
          img: "/Añejamiento Barricas.webp",
          clickable: true,
        },
        {
          id: "cocteleria-autor",
          category: "Mixología", // matches category filter key
          label: "MIXOLOGY",
          title: "Signature Cocktails: Roots in the Glass",
          desc: "Three exclusive recipes inspired by the flavors of Jalisco, designed by our Master Mixologist for this summer.",
          img: "/Barra Casa Loy Experiencias.webp",
        },
        {
          id: "maridaje-perfecto",
          category: "Lanzamientos", // matches category filter key
          label: "GASTRONOMY",
          title: "Perfect Pairing: The Soul of the Land on the Plate",
          desc: "We explore the intrinsic connection between local ingredients and the tasting notes of our white tequila.",
          img: "/Platillo 2 1937 Nativo.webp",
        },
      ]
    }
  };

  const currentT = content[lang] || content.es;

  const filteredArticles = currentT.articles.filter(
    (art) => activeFilter === "Noticias" || art.category === activeFilter
  );

  return (
    <div className="bg-surface text-on-surface text-left">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-end overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Banner Restaurante 1937 Nativo.webp-movil.jpg" />
            <source 
              media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
              srcSet="/Banner Restaurante 1937 Nativo.webp-retina.jpg" 
            />
            <img
              alt="La Nueva Era de la Destilería"
              className="w-full h-full object-cover scale-105 brightness-[0.82]"
              src="/Banner Restaurante 1937 Nativo.webp-escritorio.jpg"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop pb-24 w-full text-white space-y-6">
          <span className="font-label-caps text-label-caps text-secondary-fixed tracking-[0.2em] block uppercase animate-pulse">
            {currentT.heroOvertitle}
          </span>
          <h1 className="font-display-hero text-headline-lg-mobile md:text-headline-lg text-white mb-6 leading-tight max-w-3xl">
            {currentT.heroTitle}
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant/90 mb-8 max-w-2xl font-light">
            {currentT.heroDesc}
          </p>
          <button
            onClick={() => setPage("blog-post")}
            className="group flex items-center gap-3 font-navigation text-navigation text-white border-b border-white/30 pb-2 w-fit hover:border-white transition-all duration-300"
          >
            {currentT.readMore}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">
              arrow_right_alt
            </span>
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface sticky top-16 z-40 border-b-[0.5px] border-outline-variant/20 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="flex items-center gap-12 h-16 overflow-x-auto select-none no-scrollbar whitespace-nowrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`font-navigation text-navigation py-4 px-2 transition-all duration-300 font-semibold tracking-wide ${
                  activeFilter === f.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant/60 hover:text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Feed Grid */}
      <section className="py-section-gap max-w-container-max mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => art.clickable && setPage("blog-post")}
              className="group cursor-pointer space-y-6 text-left"
            >
              <div className="aspect-[3/4] overflow-hidden bg-surface-container relative shadow-sm border border-outline-variant/10">
                <img
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={art.img}
                />
              </div>
              <span className="font-label-caps text-label-caps text-primary block text-xs">
                {art.label}
              </span>
              <h3 className="font-headline-md text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                {art.title}
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm leading-relaxed font-light line-clamp-3">
                {art.desc}
              </p>
              <button className="inline-flex items-center gap-2 font-navigation text-navigation text-primary group-hover:tracking-widest transition-all duration-500 font-semibold uppercase text-xs">
                {currentT.readMore}
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#f6f3ed] py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left space-y-6">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-xs">
              {currentT.newsletterOvertitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl font-medium">{currentT.newsletterTitle}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant font-light leading-relaxed">
              {currentT.newsletterDesc}
            </p>
          </div>
          
          <form
            onSubmit={handleSubscribe}
            className="w-full max-w-md flex flex-col gap-6 text-left"
          >
            {status === "success" ? (
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-sm text-center">
                <p className="font-body-md text-primary font-bold">
                  {currentT.newsletterSuccess}
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-b border-outline text-on-surface py-4 focus:outline-none focus:border-primary transition-colors font-navigation text-navigation placeholder:text-outline-variant/60"
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
                  <p className="text-[12px] font-navigation text-red-700 font-medium">
                    {errorMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-primary text-white font-navigation text-navigation py-4 tracking-[0.2em] hover:bg-secondary disabled:bg-primary/60 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {status === "loading" ? (lang === "es" ? "ENVIANDO..." : "SENDING...") : currentT.newsletterSubmit}
                </button>
                <p className="text-[10px] font-body-md text-on-surface-variant/60">
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
