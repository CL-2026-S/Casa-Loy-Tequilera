import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";

export default function MaquilasV3({ lang = "es" }) {
  // 8-Step Quiz State
  const [currentQuizStep, setCurrentQuizStep] = useState(1);
  const [quizState, setQuizState] = useState({
    solution: "",
    stage: "",
    market: "",
    name: "",
    company: "",
    phone: "",
    email: "",
    volume: "",
    tequilaType: "",
    assetsReady: [],
    timeline: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cal.com Integration
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    if (window.Cal) {
      window.Cal("init", { origin: "https://cal.com" });
      window.Cal("inline", {
        elementOrSelector: "#cal-inline-v3-react",
        calLink: "internationalcasaloy",
        config: { 
          layout: "month_view",
          theme: "light",
          timeZone: "America/Mexico_City",
          timezone: "America/Mexico_City"
        }
      });
      window.Cal("ui", {
        styles: {
          branding: {
            brandColor: "#8C4723"
          }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    }
  }, []);

  const t = {
    es: {
      seoTitle: "Maquila de Tequila de Marca Propia & Granel B2B | Casa Loy · NOM 1633",
      seoDesc: "Destilería oficial NOM 1633 en Los Altos de Jalisco. Producción integral de marca propia, venta a granel, 3,600 Has. de agave propio y 13.5M L de capacidad anual.",
      
      // Hero
      heroBadge: "NOM 1633 CRT · LOS ALTOS DE JALISCO",
      heroTitle: "Maquila de Tequila de Marca Propia en México.",
      heroTitleItalic: "tu marca comienza en los altos de jalisco.",
      heroSecondary: "\"Tu visión. Nuestra maestría y legado.\"",
      heroSub: "Destilería familiar NOM 1633 construida para fundadores, marcas existentes y distribuidores globales listos para producir con un origen real, infraestructura auditada y suministro propio de agave.",
      btnStart: "Comenzar Proyecto →",
      btnBook: "Agendar Videollamada",

      // Trust bar
      trustNom: "NOM 1633 CRT",
      trustRegion: "Los Altos de Jalisco",
      trustGroup: "Grupo Orbe XXI (60+ Años)",
      trustAgave: "3,600 Has. Agave Propio (1992)",
      trustCapacity: "13.5M L / Año Capacidad",
      trustControl: "Control Lote por Lote",
      trustFree: "100% Additive Free Verified",

      // Why Casa Loy
      whyEyebrow: "Por qué Casa Loy",
      whyTitle: "Un productor de tequila con raíces en Los Altos de Jalisco.",
      whySub: "Combinamos la herencia agavera tradicional de nuestra región con el respaldo agroindustrial global de Grupo Orbe XXI.",

      // Inside Casa Loy
      insideEyebrow: "Dentro de Casa Loy",
      insideTitle: "Del agave a la botella.",

      // Solutions
      solutionsEyebrow: "Rutas de Producción",
      solutionsTitle: "Elige la ruta técnica adecuada para tu proyecto.",
      solutionsSub: "Sin términos genéricos ni confusiones. Adaptamos nuestra infraestructura a tus objetivos comerciales.",

      // Who this is for
      whoEyebrow: "A quién servimos",
      whoTitle: "Encuentra el camino exacto para tu proyecto.",

      // Stakes
      stakesEyebrow: "Mitigación de Riesgos",
      stakesTitle: "Tu proyecto de tequila conlleva riesgos comerciales reales. Te ayudamos a mitigarlos.",

      // Quiz
      quizEyebrow: "Diagnóstico de Proyecto",
      quizTitle: "¿En qué etapa se encuentra tu proyecto hoy?",
      quizSub: "Diagnóstico de 8 pasos para calificar tu ruta operativa, volumen y viabilidad técnica.",
      stepTitles: [
        "Paso 1 de 8 · Solución",
        "Paso 2 de 8 · Etapa",
        "Paso 3 de 8 · Mercado",
        "Paso 4 de 8 · Contacto",
        "Paso 5 de 8 · Volumen",
        "Paso 6 de 8 · Categoría",
        "Paso 7 de 8 · Activos",
        "Paso 8 de 8 · Tiempos"
      ],

      // Process
      processEyebrow: "Ruta de Trabajo",
      processTitle: "De la idea a la producción: una ruta clara antes de comprometerte.",

      // Methods
      methodsEyebrow: "Producción por Resultado",
      methodsTitle: "El perfil de tequila que tu marca necesita, y cómo lo construimos.",

      // Agave
      agaveEyebrow: "Agave & Abastecimiento",
      agaveTitle: "Tu marca de tequila comienza antes de la destilería: comienza en el campo.",
      agaveSub: "A diferencia de destilerías que compran agave a intermediarios sufriendo la especulación del precio spot, Casa Loy es autosuficiente. Cultivamos nuestras propias tierras en Jalisco, Michoacán y Guanajuato desde 1992.",

      // Quality & Compliance
      qualityEyebrow: "Aseguramiento de Calidad",
      qualityTitle: "Consistencia lote por lote que tu marca puede defender.",
      qualitySub: "Tasting Lab con cabinas de cata sensorial profesional y laboratorio fisicoquímico in-house para verificar parámetros exactos antes del envasado.",
      complianceEyebrow: "Cumplimiento & Exportación",
      complianceTitle: "Coordinamos la ruta regulatoria para que no camines solo.",
      complianceSub: "Acompañamiento legal completo ante el Consejo Regulador del Tequila (CRT), aduanas y autoridades internacionales.",

      // NDA
      ndaTitle: "Tu Marca. Tu Proyecto. Protegido.",
      ndaSub: "Tu fórmula te pertenece exclusivamente. Cada proyecto incluye un acuerdo de confidencialidad (NDA), términos claros de propiedad intelectual (IP) y documentación técnica controlada desde el día uno.",
      ndaBtn: "Solicitar NDA Previo →",

      // Proof
      proofEyebrow: "Prueba, no Promesas",
      proofTitle: "Cada proyecto recibe atención directa de los profesionales a cargo de producción, calidad y cumplimiento.",

      // FAQ
      faqEyebrow: "FAQ B2B",
      faqTitle: "Respuestas directas, organizadas por tu perfil.",

      // CTA
      ctaEyebrow: "Siguiente Paso",
      ctaTitle: "Agenda una videollamada técnica de 20 minutos.",
      ctaSub: "Sin compromisos ni discursos de ventas forzados. Evaluaremos la viabilidad operativa de tu proyecto directamente con un especialista de producción."
    },
    en: {
      seoTitle: "Private Label & Bulk Tequila Contract Manufacturing | Casa Loy · NOM 1633",
      seoDesc: "Official NOM 1633 distillery in Los Altos de Jalisco. Turnkey private label tequila, bulk supply, 3,600 Has. of estate agave and 13.5M L annual capacity.",
      
      heroBadge: "NOM 1633 CRT · HIGHLANDS OF JALISCO",
      heroTitle: "Private Label Tequila Manufacturing in Mexico.",
      heroTitleItalic: "your tequila starts in los altos de jalisco.",
      heroSecondary: "\"Your vision. Our expertise.\"",
      heroSub: "A family-owned NOM 1633 distillery built for founders, existing brands, and distributors ready to build with a real origin behind them.",
      btnStart: "Start My Project →",
      btnBook: "Book a Technical Call",

      trustNom: "NOM 1633 CRT",
      trustRegion: "Los Altos de Jalisco",
      trustGroup: "Grupo Orbe XXI (60+ Years)",
      trustAgave: "3,600 Has. Estate Agave (1992)",
      trustCapacity: "13.5M L / Year Capacity",
      trustControl: "Batch-to-Batch Control",
      trustFree: "100% Additive Free Verified",

      whyEyebrow: "Why Casa Loy",
      whyTitle: "A family-owned tequila producer in Los Altos de Jalisco.",
      whySub: "Combining the artisanal agave heritage of our region with the multinational agro-industrial backing of Grupo Orbe XXI.",

      insideEyebrow: "Inside Casa Loy",
      insideTitle: "From agave to bottle.",

      solutionsEyebrow: "Solutions",
      solutionsTitle: "Choose the right production path.",
      solutionsSub: "No generic buzzwords. We adapt our industrial distillery footprint to your commercial objectives.",

      whoEyebrow: "Who this is for",
      whoTitle: "Find the right path for your tequila project.",

      stakesEyebrow: "What's at stake",
      stakesTitle: "Your tequila project carries real business risk. We help you reduce it.",

      quizEyebrow: "Diagnosis",
      quizTitle: "Where does your tequila project stand today?",
      quizSub: "8-step diagnosis capturing route, stage, target market, volume, and operational feasibility.",
      stepTitles: [
        "Step 1 of 8 · Solution",
        "Step 2 of 8 · Stage",
        "Step 3 of 8 · Market",
        "Step 4 of 8 · Contact",
        "Step 5 of 8 · Volume",
        "Step 6 of 8 · Tequila Type",
        "Step 7 of 8 · Assets",
        "Step 8 of 8 · Timeline"
      ],

      processEyebrow: "Process",
      processTitle: "From idea to production: a clear path before you commit.",

      methodsEyebrow: "Production, by result",
      methodsTitle: "The tequila profile your brand needs, and how we build it.",

      agaveEyebrow: "Agave & supply",
      agaveTitle: "Your tequila brand starts before production — it starts with supply.",
      agaveSub: "Unlike contract bottlers dependent on open market spot brokers, Casa Loy is self-sufficient. We farm our own fields in Jalisco, Michoacán, and Guanajuato since 1992.",

      qualityEyebrow: "Quality",
      qualityTitle: "Batch-to-batch consistency your brand can defend.",
      qualitySub: "In-house Tasting Lab and state-of-the-art gas chromatography to certify chemical profile before bottling.",
      complianceEyebrow: "Compliance & export",
      complianceTitle: "We help coordinate compliance, not carry it alone.",
      complianceSub: "Full regulatory assistance with the Tequila Regulatory Council (CRT), US TTB, and global customs.",

      ndaTitle: "Your Brand. Your Project. Protected.",
      ndaSub: "Your formula stays yours. Every project includes a confidentiality agreement, clear IP ownership terms, and controlled documentation from day one.",
      ndaBtn: "Request NDA Before Call →",

      proofEyebrow: "Proof, not promises",
      proofTitle: "Every project receives direct attention from the people involved in production, quality, compliance, and logistics.",

      faqEyebrow: "FAQ",
      faqTitle: "Straight answers, by intention.",

      ctaEyebrow: "Next step",
      ctaTitle: "Book a 20-minute technical video call.",
      ctaSub: "No commitment. No sales pitch. A real conversation about whether your project is the right fit for what we do here."
    }
  }[lang] || {};

  const handleOptionSelect = (field, value, nextStep) => {
    setQuizState(prev => ({ ...prev, [field]: value }));
    setCurrentQuizStep(nextStep);
  };

  const handleAssetsToggle = (asset) => {
    setQuizState(prev => {
      const exists = prev.assetsReady.includes(asset);
      const updated = exists 
        ? prev.assetsReady.filter(a => a !== asset)
        : [...prev.assetsReady, asset];
      return { ...prev, assetsReady: updated };
    });
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/leads/maquilas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quizState,
          source: "maquilas-v3-react",
          createdAt: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("API fallback note:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1C1C1C] font-sans antialiased selection:bg-[#8C4723] selection:text-white">
      <SEO 
        title={t.seoTitle}
        description={t.seoDesc}
      />

      {/* ============================================================
          §5.1 HERO B2B + TRUST BAR
          ============================================================ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#1E1A17] text-white pt-24 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/Naves Industriales Casa Loy Tequilera.webp"
            alt="Destilería Casa Loy Tequilera"
            className="w-full h-full object-cover brightness-[0.62] contrast-[1.05]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1E1A17]/40 to-[#1E1A17]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8B04B] border border-[#E8B04B]/40 px-4 py-1.5 rounded-full mb-6 bg-black/20 backdrop-blur-sm">
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-light leading-[1.12] tracking-tight max-w-4xl mx-auto uppercase">
            {t.heroTitle}
            <span className="block font-serif italic text-[#E8B04B] text-2xl sm:text-4xl md:text-5xl font-normal mt-2 lowercase">
              {t.heroTitleItalic}
            </span>
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-white/90 mt-4">
            {t.heroSecondary}
          </p>

          <p className="font-sans text-white/80 text-xs md:text-sm max-w-2xl mx-auto mt-4 mb-10 leading-relaxed font-normal">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#quiz"
              className="w-full sm:w-auto bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all shadow-lg min-w-[220px]"
            >
              {t.btnStart}
            </a>
            <a
              href="#contacto-agenda"
              className="w-full sm:w-auto border border-white/40 hover:bg-white/10 text-white font-navigation text-xs uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all min-w-[220px]"
            >
              {t.btnBook}
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-[#EDE7DE] border-y border-[#1A1615]/10 py-4">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 text-center">
            <span className="font-navigation text-[11px] font-bold uppercase tracking-widest text-[#8C4723]">{t.trustNom}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustRegion}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustGroup}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustAgave}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustCapacity}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustControl}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-bold uppercase tracking-widest text-emerald-800">{t.trustFree}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          §5.2 WHY CASA LOY
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.whyEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.whyTitle}
            </h2>
            <p className="font-sans text-secondary text-xs md:text-sm mt-3 leading-relaxed font-normal">
              {t.whySub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Origen" : "Origin"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">NOM 1633, Los Altos de Jalisco</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Terruño de Ayotlán a más de 2,000 msnm con suelos rojos ferrosos y microclima privilegiado." : "Ayotlán highlands terroir above 2,000 meters elevation with iron-rich red volcanic soil."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Estructura" : "Structure"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">Grupo Orbe XXI (60+ {lang === "es" ? "Años" : "Years"})</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Consorcio con más de 2,900 colaboradores y empresas hermanas líderes como TeknoAgrox y Nutriagaves." : "Multinational agro-industrial group with 2,900+ employees and sister companies TeknoAgrox and Nutriagaves."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Agave Propio" : "Estate Agave"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">{lang === "es" ? "Cultivo Propio desde 1992" : "Estate Farming Since 1992"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "3,600 hectáreas plantadas y 10.8 millones de agaves que blindan tu suministro contra la volatilidad del mercado." : "3,600 planted hectares and 10.8 million estate agaves protecting your cost against market spot speculation."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Equipo Humano" : "Team"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">{lang === "es" ? "Profesionales en Cada Etapa" : "Real Team Behind Every Step"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Trato directo con maestros tequileros, químicos y coordinadores de aduanas sin intermediarios opacos." : "Direct access to master distillers, chemical engineers, and compliance experts without brokers."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Infraestructura" : "Infrastructure"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">13.5M {lang === "es" ? "Litros / Año" : "Liters / Year"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Hornos tradicionales (240t), autoclaves (80t), tahona volcánica, alambiques de cobre y columnas continuas." : "Traditional ovens (240t), autoclaves (80t), volcanic stone tahona, copper pot stills, and columns."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 hover:border-primary transition-all shadow-sm space-y-2">
              <div className="font-mono text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">{lang === "es" ? "Calidad Auditada" : "Audited QA"}</div>
              <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold">{lang === "es" ? "Trazabilidad Química por Lote" : "Batch Gas Chromatography"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Tasting Lab in-house con cromatografía de gases y sellos USDA, EU Organic, Kosher y Additive Free." : "In-house lab with gas chromatography and certifications: USDA, EU Organic, Kosher, and Additive Free."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.3 INSIDE CASA LOY (8 Celdas Lineales)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-[#1E1A17] text-white border-b border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8B04B] font-bold mb-2">{t.insideEyebrow}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight mb-10">
            {t.insideTitle}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 border border-white/10 bg-white/5 p-2">
            {[
              { num: "01", name: lang === "es" ? "Agave Propio" : "Estate Agave" },
              { num: "02", name: lang === "es" ? "Cocción Dual" : "Dual Cooking" },
              { num: "03", name: lang === "es" ? "Molienda Noble" : "Noble Extraction" },
              { num: "04", name: lang === "es" ? "Fermentación" : "Fermentation" },
              { num: "05", name: lang === "es" ? "Destilación" : "Distillation" },
              { num: "06", name: lang === "es" ? "Cava Barricas" : "Cask Aging" },
              { num: "07", name: lang === "es" ? "Laboratorio" : "Tasting Lab" },
              { num: "08", name: lang === "es" ? "Envasado QA" : "Bottling QA" }
            ].map((cell, idx) => (
              <div key={idx} className="p-4 bg-black/40 border border-white/10 flex flex-col justify-between min-h-[110px]">
                <span className="font-mono text-[10px] text-[#E8B04B] font-bold">{cell.num}</span>
                <span className="font-serif text-sm font-semibold text-white">{cell.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.4 RUTAS DE SOLUCIÓN (5 Opciones)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.solutionsEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.solutionsTitle}
            </h2>
            <p className="font-sans text-secondary text-xs md:text-sm mt-3 leading-relaxed font-normal">
              {t.solutionsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { num: "01", title: lang === "es" ? "Marca Propia Integral" : "Private Label Tequila", tag: lang === "es" ? "Llave en Mano" : "Turnkey", desc: lang === "es" ? "Crea o comercializa tequila con tu propia marca. Acompañamiento CRT, registro, envase y exportación." : "Create your own brand. Turnkey registration, formulation, packaging, and export." },
              { num: "02", title: lang === "es" ? "Maquila por Contrato" : "Contract Manufacturing", tag: "Contract Mfg", desc: lang === "es" ? "Producción a terceros bajo especificación técnica rigurosa, con o sin marca propia previamente registrada." : "Production for third parties under technical specs, with or without existing brand." },
              { num: "03", title: lang === "es" ? "Tequila a Granel" : "Bulk Tequila Supply", tag: lang === "es" ? "Volumen Continuo" : "Bulk Tankers", desc: lang === "es" ? "Suministro constante en autotanques o contenedores IBC para embotelladoras, importadores o distribuidores." : "Bulk tankers or IBC totes for global bottlers and importers." },
              { num: "04", title: lang === "es" ? "Envasado & Co-packing" : "Co-Packing & Bottling", tag: lang === "es" ? "Acondicionamiento" : "Packaging", desc: lang === "es" ? "Llenado, taponado, etiquetado e inspección en mesa lumínica para marcas con líquido existente." : "Bottling, sealing, labeling, and light table QA inspection." },
              { num: "05", title: lang === "es" ? "Perfil de Autor & Cava" : "Custom Signature Profile", tag: lang === "es" ? "Alta Gama" : "Bespoke Cask", desc: lang === "es" ? "Formulación sensorial exclusiva, levaduras propias y crianza a la medida en barricas de roble seleccionadas." : "Signature liquid development and bespoke cask aging in American/French oak." }
            ].map((r, i) => (
              <div key={i} className="p-6 bg-[#EDE7DE]/60 border border-outline-variant/50 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="font-mono text-xs text-primary font-bold">{r.num}</span>
                  <h3 className="font-serif text-lg font-bold text-[#1C1C1C] mt-2 mb-2">{r.title}</h3>
                  <p className="font-sans text-xs text-secondary leading-relaxed font-normal">{r.desc}</p>
                </div>
                <span className="inline-block mt-4 font-mono text-[9px] text-primary bg-white px-2 py-0.5 border border-primary/20 max-w-fit">{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.5 AUTOIDENTIFICACIÓN (4 Perfiles B2B)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F5EFEB] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.whoEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.whoTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-white border border-outline-variant/40 space-y-3">
              <span className="font-mono text-[10px] text-[#8C4723] font-bold uppercase tracking-wider">{lang === "es" ? "Fundadores" : "Founders"}</span>
              <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{lang === "es" ? "Creando una marca de tequila desde cero" : "Building a brand from the ground up"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Acompañamiento en registro CRT, formulación sensorial, proveeduría de vidrio y lotes mínimos optimizados." : "Step-by-step guidance on CRT registry, sensory formulation, glass packaging, and low MOQs."}
              </p>
            </div>

            <div className="p-8 bg-white border border-outline-variant/40 space-y-3">
              <span className="font-mono text-[10px] text-[#8C4723] font-bold uppercase tracking-wider">{lang === "es" ? "Marcas Existentes" : "Existing Brands"}</span>
              <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{lang === "es" ? "Buscando un socio de maquila más consistente" : "Looking for a better production partner"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Transición sin quiebres de inventario. Replicamos el perfil analítico de tu tequila actual con cromatografía in-house." : "Smooth transition without stock interruption. Replicating flavor profile with gas chromatography."}
              </p>
            </div>

            <div className="p-8 bg-white border border-outline-variant/40 space-y-3">
              <span className="font-mono text-[10px] text-[#8C4723] font-bold uppercase tracking-wider">{lang === "es" ? "Distribuidores / Retail" : "Distributors / Retail"}</span>
              <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{lang === "es" ? "Incorporando el tequila como nueva categoría" : "Entering tequila as a new category"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Marcas blancas listas para exportación y cumplimiento TTB en EE.UU., normativas UE y aduanas de Asia." : "Export-ready private label solutions meeting US TTB, EU, and Asian customs standards."}
              </p>
            </div>

            <div className="p-8 bg-white border border-outline-variant/40 space-y-3">
              <span className="font-mono text-[10px] text-[#8C4723] font-bold uppercase tracking-wider">{lang === "es" ? "Compradores a Granel" : "Bulk Buyers"}</span>
              <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{lang === "es" ? "Abasteciendo volumen constante a costo estable" : "Sourcing steady volume at defined profile"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Suministro de 100% Agave o Mixto con certificados de análisis por lote y logística marítima o terrestre." : "Continuous bulk supply with lab certificates of analysis and global logistics."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.6 MITIGACIÓN DE RIESGOS REALES
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.stakesEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.stakesTitle}
            </h2>
          </div>

          <div className="border-t border-outline-variant/40 divide-y divide-outline-variant/30">
            {[
              { num: "01", title: lang === "es" ? "Empezar desde cero" : "Starting from zero", desc: lang === "es" ? "Entrar a una categoría altamente regulada con normas estrictas de denominación de origen requiere acompañamiento técnico para evitar retrasos costosos ante el CRT o IMPI." : "Entering a regulated denomination of origin category requires expert technical guidance to prevent costly delays." },
              { num: "02", title: lang === "es" ? "Cambiar de productor" : "Switching producer", desc: lang === "es" ? "Aseguramos que la transición entre destilerías no altere el sabor de tu tequila ni cause desabasto. Mapeamos tu perfil químico actual y producimos lotes de seguridad antes del cambio legal." : "Ensuring your next transition preserves liquid profile and prevents inventory disruption." },
              { num: "03", title: lang === "es" ? "Escalamiento y volumen" : "Scaling / distribution", desc: lang === "es" ? "Nuestra capacidad de 13.5M L y reserva propia de 10.8M agaves garantizan que tu marca pueda pasar de miles de litros a millones sin perder consistencia sensorial ni sufrir alzas súbitas de costo." : "Growing volume from thousands to millions of liters without losing flavor consistency or suffering price spikes." },
              { num: "04", title: lang === "es" ? "Exportación global" : "Exporting", desc: lang === "es" ? "Soporte aduanal, certificados de exportación del CRT, fórmulas aprobadas ante el TTB de EE.UU. y documentación fitosanitaria para más de 20 países." : "Adding tequila to an international book of business with full CRT export certifications and US TTB label approvals." }
            ].map((p, i) => (
              <div key={i} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <span className="font-serif text-3xl text-primary font-light md:col-span-1">{p.num}</span>
                <div className="md:col-span-4"><h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{p.title}</h3></div>
                <div className="md:col-span-7"><p className="font-sans text-xs md:text-sm text-secondary leading-relaxed font-normal">{p.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.7 QUIZ ESTRATÉGICO DE DIAGNÓSTICO (8 Pasos)
          ============================================================ */}
      <section id="quiz" className="py-20 md:py-28 bg-[#1E1A17] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img src="/Piñas de Agave Tequilana Weber.webp" alt="Agave" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-left">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8B04B] font-bold mb-2">{t.quizEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light">
              {t.quizTitle}
            </h2>
            <p className="font-sans text-white/70 text-xs md:text-sm mt-2">
              {t.quizSub}
            </p>
          </div>

          <div className="bg-white/5 border border-white/15 p-6 md:p-10 backdrop-blur-md shadow-2xl">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="font-mono text-xs text-[#E8B04B] uppercase font-bold tracking-widest">
                {!isSuccess ? t.stepTitles[currentQuizStep - 1] : (lang === "es" ? "Completado ✓" : "Completed ✓")}
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <span
                    key={s}
                    className={`w-6 h-1 rounded-full transition-colors ${
                      isSuccess ? "bg-emerald-500" : s <= currentQuizStep ? "bg-[#8C4723]" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Steps Container */}
            {!isSuccess && currentQuizStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿Qué solución de producción buscas?" : "What production solution are you looking for?"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { num: "01", val: lang === "es" ? "Tequila de Marca Propia" : "Turnkey Private Label", desc: lang === "es" ? "Crear una marca propia de tequila desde cero con soporte integral." : "Full turnkey private label tequila creation from scratch." },
                    { num: "02", val: lang === "es" ? "Maquila / Contract Manufacturing" : "Contract Manufacturing", desc: lang === "es" ? "Producción a terceros bajo especificaciones y ficha técnica." : "Custom distilling for third parties under specifications." },
                    { num: "03", val: lang === "es" ? "Tequila a Granel" : "Bulk Tequila Supply", desc: lang === "es" ? "Suministro de 100% Agave o Mixto para embotelladoras globales." : "Steady bulk tankers or IBC totes for global distributors." },
                    { num: "04", val: lang === "es" ? "Envasado / Co-Packing" : "Co-Packing / Bottling", desc: lang === "es" ? "Llenado, taponado, etiquetado y mesa de luz para marcas activas." : "Bottling, sealing, labeling, and QA inspection." }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect("solution", item.val, 2)}
                      className="text-left p-4 border border-white/15 bg-white/5 hover:bg-[#8C4723]/40 hover:border-[#E8B04B] transition-all text-xs font-sans cursor-pointer"
                    >
                      <div className="font-mono text-[#E8B04B] text-[10px] uppercase mb-1">{item.num}</div>
                      <div className="font-bold text-white text-sm">{item.val}</div>
                      <p className="text-white/70 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isSuccess && currentQuizStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿En qué etapa se encuentra tu proyecto?" : "What stage is your project currently in?"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { val: lang === "es" ? "Idea Inicial / Nuevo Lanzamiento" : "Initial Idea / New Launch", desc: lang === "es" ? "Busco asesoría técnica y lotes mínimos viables." : "Seeking guidance on MOQs and startup roadmap." },
                    { val: lang === "es" ? "Marca Existente / Cambio de Maquila" : "Existing Brand / Switching", desc: lang === "es" ? "Requiero replicar mi perfil sensorial con mayor consistencia." : "Looking to replicate current flavor profile with better consistency." },
                    { val: lang === "es" ? "Distribuidor / Importador" : "Distributor / Importer", desc: lang === "es" ? "Requiero suministro de alto volumen continuo y precios directos." : "Need steady volume supply and direct manufacturing pricing." },
                    { val: lang === "es" ? "Comparando Opciones" : "Evaluating Options", desc: lang === "es" ? "Quiero conocer cotización, tiempos de entrega y capacidades." : "Comparing pricing, lead times, and distillery capabilities." }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect("stage", item.val, 3)}
                      className="text-left p-4 border border-white/15 bg-white/5 hover:bg-[#8C4723]/40 hover:border-[#E8B04B] transition-all text-xs font-sans cursor-pointer"
                    >
                      <div className="font-bold text-white text-sm">{item.val}</div>
                      <p className="text-white/70 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentQuizStep(1)} className="text-xs font-mono text-white/50 hover:text-white mt-4 block">
                  ← {lang === "es" ? "Paso anterior" : "Previous step"}
                </button>
              </div>
            )}

            {!isSuccess && currentQuizStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿Cuál es tu mercado objetivo principal?" : "What is your primary target market?"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { val: lang === "es" ? "Estados Unidos (USA)" : "United States (US TTB)", desc: lang === "es" ? "Aprobación de fórmula TTB y exportación directa." : "US TTB formula approval and direct export." },
                    { val: lang === "es" ? "México (Mercado Nacional)" : "Domestic Mexican Market", desc: lang === "es" ? "Marbetes SAT, alta ante CRT y distribución nacional." : "SAT tax stamps, CRT co-production, and nationwide retail." },
                    { val: lang === "es" ? "Europa / Reino Unido / Asia" : "Europe / UK / Asia", desc: lang === "es" ? "Certificación EU Organic, análisis y logística marítima." : "EU Organic certification, customs, and sea freight." },
                    { val: lang === "es" ? "Canadá u Otros Mercados" : "Canada / Latin America / Other", desc: lang === "es" ? "Soporte arancelario y documentación fitosanitaria." : "Tariff guidance and international documentation." }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect("market", item.val, 4)}
                      className="text-left p-4 border border-white/15 bg-white/5 hover:bg-[#8C4723]/40 hover:border-[#E8B04B] transition-all text-xs font-sans cursor-pointer"
                    >
                      <div className="font-bold text-white text-sm">{item.val}</div>
                      <p className="text-white/70 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentQuizStep(2)} className="text-xs font-mono text-white/50 hover:text-white mt-4 block">
                  ← {lang === "es" ? "Paso anterior" : "Previous step"}
                </button>
              </div>
            )}

            {!isSuccess && currentQuizStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "Datos de contacto para tu propuesta técnica" : "Contact details for your technical proposal"}</h3>
                <p className="font-sans text-xs text-white/70">{lang === "es" ? "Un maestro tequilero o especialista de producción revisará tus especificaciones." : "A master distiller or production engineer will review your specs."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "Nombre completo *" : "Full Name *"}</label>
                    <input
                      type="text"
                      required
                      value={quizState.name}
                      onChange={e => setQuizState({ ...quizState, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8B04B]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "Empresa o Marca" : "Company or Brand"}</label>
                    <input
                      type="text"
                      value={quizState.company}
                      onChange={e => setQuizState({ ...quizState, company: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8B04B]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "Teléfono / WhatsApp *" : "Phone / WhatsApp *"}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+52 ..."
                      value={quizState.phone}
                      onChange={e => setQuizState({ ...quizState, phone: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8B04B]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "Correo corporativo *" : "Business Email *"}</label>
                    <input
                      type="email"
                      required
                      value={quizState.email}
                      onChange={e => setQuizState({ ...quizState, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8B04B]"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={() => setCurrentQuizStep(3)} className="text-xs font-mono text-white/50 hover:text-white">
                    ← {lang === "es" ? "Paso anterior" : "Previous step"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!quizState.name || !quizState.phone || !quizState.email) {
                        alert(lang === "es" ? "Por favor completa nombre, teléfono y correo." : "Please fill name, phone, and email.");
                        return;
                      }
                      setCurrentQuizStep(5);
                    }}
                    className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-widest px-6 py-3 font-semibold cursor-pointer"
                  >
                    {lang === "es" ? "Continuar a Volumen →" : "Continue to Volume →"}
                  </button>
                </div>
              </div>
            )}

            {!isSuccess && currentQuizStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿Qué volumen anual estimado proyectas?" : "What is your estimated annual volume?"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { val: lang === "es" ? "Lote Inicial / Artesanal (< 1,000 cajas)" : "Initial Artisan Batch (< 1,000 cases)", desc: "< 1,000 cases (~9,000 L)" },
                    { val: lang === "es" ? "Escala Media Comercial (1,000 a 5,000 cajas)" : "Commercial Mid-Scale (1,000 - 5,000 cases)", desc: "1,000 - 5,000 cases" },
                    { val: lang === "es" ? "Distribución Regional (5,000 a 20,000 cajas)" : "Regional Distribution (5,000 - 20,000 cases)", desc: "5,000 - 20,000 cases" },
                    { val: lang === "es" ? "Gran Escala / Granel Masivo (> 20,000 cajas)" : "Large Scale / Bulk Tankers (> 20,000 cases)", desc: "> 20,000 cases or steady bulk" }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect("volume", item.val, 6)}
                      className="text-left p-4 border border-white/15 bg-white/5 hover:bg-[#8C4723]/40 hover:border-[#E8B04B] transition-all text-xs font-sans cursor-pointer"
                    >
                      <div className="font-bold text-white text-sm">{item.val}</div>
                      <p className="text-white/70 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentQuizStep(4)} className="text-xs font-mono text-white/50 hover:text-white mt-4 block">
                  ← {lang === "es" ? "Paso anterior" : "Previous step"}
                </button>
              </div>
            )}

            {!isSuccess && currentQuizStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿Qué categoría y clase de tequila buscas producir?" : "What tequila category and class do you plan to bottle?"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { val: lang === "es" ? "Tequila 100% Puro de Agave" : "100% Agave Tequila", desc: lang === "es" ? "Envasado de origen en México. Blanco, Reposado o Añejo." : "Bottled in origin in Mexico. Blanco, Reposado, Añejo." },
                    { val: lang === "es" ? "Tequila Mixto (51% Agave)" : "Mixto Tequila (51% Agave)", desc: lang === "es" ? "Apto para exportación a granel y envasado en destino." : "Exportable in bulk tankers for packaging at destination." },
                    { val: lang === "es" ? "Línea de Autor en Tahona" : "Tahona Stone Artisanal Line", desc: lang === "es" ? "Molienda en piedra volcánica, 100% libre de aditivos." : "Volcanic stone milling, 100% additive-free verified." },
                    { val: lang === "es" ? "Por Definir" : "To Be Determined", desc: lang === "es" ? "Deseo asesoría para elegir la mejor opción según costos." : "Need technical consultation to evaluate options." }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect("tequilaType", item.val, 7)}
                      className="text-left p-4 border border-white/15 bg-white/5 hover:bg-[#8C4723]/40 hover:border-[#E8B04B] transition-all text-xs font-sans cursor-pointer"
                    >
                      <div className="font-bold text-white text-sm">{item.val}</div>
                      <p className="text-white/70 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentQuizStep(5)} className="text-xs font-mono text-white/50 hover:text-white mt-4 block">
                  ← {lang === "es" ? "Paso anterior" : "Previous step"}
                </button>
              </div>
            )}

            {!isSuccess && currentQuizStep === 7 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "¿Qué activos tienes listos actualmente?" : "What assets are already in place?"}</h3>
                <div className="space-y-2.5 pt-2">
                  {[
                    lang === "es" ? "Marca registrada ante IMPI o USPTO" : "Trademark registered (IMPI / USPTO)",
                    lang === "es" ? "Diseño de botella o etiqueta definido" : "Bottle or label packaging design ready",
                    lang === "es" ? "Canales de distribución activos en destino" : "Active distribution channels in target market",
                    lang === "es" ? "Padrón de exportadores o importador en destino" : "Import permit / export register ready"
                  ].map((asset, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 border border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={quizState.assetsReady.includes(asset)}
                        onChange={() => handleAssetsToggle(asset)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span>{asset}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={() => setCurrentQuizStep(6)} className="text-xs font-mono text-white/50 hover:text-white">
                    ← {lang === "es" ? "Paso anterior" : "Previous step"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentQuizStep(8)}
                    className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-widest px-6 py-3 font-semibold cursor-pointer"
                  >
                    {lang === "es" ? "Continuar a Tiempos →" : "Continue to Timeline →"}
                  </button>
                </div>
              </div>
            )}

            {!isSuccess && currentQuizStep === 8 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-white font-semibold">{lang === "es" ? "Tiempo estimado de lanzamiento y notas" : "Estimated launch timeline & notes"}</h3>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "¿Cuándo te gustaría tener producto terminado?" : "Target production date?"}</label>
                    <select
                      value={quizState.timeline}
                      onChange={e => setQuizState({ ...quizState, timeline: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8B04B]"
                    >
                      <option value="Inmediato / Menos de 3 meses" className="bg-[#1E1A17] text-white">{lang === "es" ? "Inmediato (menos de 3 meses)" : "Immediate (< 3 months)"}</option>
                      <option value="3 a 6 meses" className="bg-[#1E1A17] text-white">3 - 6 {lang === "es" ? "meses" : "months"}</option>
                      <option value="6 a 12 meses" className="bg-[#1E1A17] text-white">6 - 12 {lang === "es" ? "meses" : "months"}</option>
                      <option value="Solo explorando viabilidad" className="bg-[#1E1A17] text-white">{lang === "es" ? "Solo explorando viabilidad técnica" : "Just exploring feasibility"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/70 mb-1">{lang === "es" ? "Notas adicionales o perfil deseado (opcional)" : "Additional notes or desired profile (optional)"}</label>
                    <textarea
                      rows={2}
                      value={quizState.notes}
                      onChange={e => setQuizState({ ...quizState, notes: e.target.value })}
                      placeholder={lang === "es" ? "Notas sobre perfil sensorial, tipo de botella o requerimientos especiales..." : "Notes on flavor profile, bottle style, or custom needs..."}
                      className="w-full bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E8B04B] resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={() => setCurrentQuizStep(7)} className="text-xs font-mono text-white/50 hover:text-white">
                    ← {lang === "es" ? "Paso anterior" : "Previous step"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitQuiz}
                    className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-widest px-8 py-3.5 font-semibold cursor-pointer shadow-xl"
                  >
                    {isSubmitting ? (lang === "es" ? "ENVIANDO..." : "SUBMITTING...") : (lang === "es" ? "ENVIAR DIAGNÓSTICO FINAL →" : "SUBMIT DIAGNOSTIC →")}
                  </button>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="font-serif text-3xl text-white font-semibold">
                  {lang === "es" ? "¡Diagnóstico recibido con éxito!" : "Diagnostic Received Successfully!"}
                </h3>
                <p className="font-sans text-xs md:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  {lang === "es" 
                    ? "Un especialista de producción de Casa Loy revisará tus especificaciones y se comunicará en menos de 24 horas."
                    : "A Casa Loy production specialist will review your specifications and contact you within 24 hours."}
                </p>
                <div className="pt-4">
                  <a
                    href="#contacto-agenda"
                    className="inline-block py-3 px-6 border border-[#E8B04B] text-[#E8B04B] hover:bg-[#E8B04B] hover:text-[#1E1A17] font-navigation text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    {lang === "es" ? "O agenda directamente tu videollamada técnica aquí ↓" : "Or book a technical call directly on calendar below ↓"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.8 PROCESO DE TRABAJO (6 Fases)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.processEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.processTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: lang === "es" ? "Diagnóstico de Proyecto" : "Project Diagnosis", desc: lang === "es" ? "Revisión inicial de objetivos comerciales, volúmenes proyectados, mercado destino y requerimientos de fórmula." : "Review of project commercial targets, volume, market destination, and formula specifications." },
              { num: "02", title: lang === "es" ? "Llamada Técnica" : "Technical Call", desc: lang === "es" ? "Sesión de 20 minutos con ingenieros y maestros tequileros para aterrizar viabilidad operativa y cotizaciones por litro." : "20-minute video session with production engineers to review feasibility and cost per liter." },
              { num: "03", title: lang === "es" ? "Definición de Producto" : "Product Definition", desc: lang === "es" ? "Elaboración y envío de muestras sensoriales en tasting lab hasta alcanzar la firma organoléptica deseada." : "Lab sample formulation and dispatch until your exact sensory liquid signature is reached." },
              { num: "04", title: lang === "es" ? "Cumplimiento Legal & CRT" : "Compliance Path", desc: lang === "es" ? "Trámites oficiales ante el Consejo Regulador del Tequila, aprobación de etiquetas y registro de co-producción." : "Official registration with the CRT, label approval, and co-production compliance." },
              { num: "05", title: lang === "es" ? "Producción & Control" : "Production & Control", desc: lang === "es" ? "Destilación a escala, cromatografía de gases lote a lote, envasado y aprobación del cliente previa a la entrega." : "Distillation at scale, batch gas chromatography QA, bottling, and client sign-off." },
              { num: "06", title: lang === "es" ? "Coordinación de Envío" : "Shipment Coordination", desc: lang === "es" ? "Preparación para exportación internacional con certificados fitosanitarios y acompañamiento logístico aduanal." : "International export preparation with phytosanitary certificates and freight coordination." }
            ].map((st, i) => (
              <div key={i} className="p-6 bg-white border border-outline-variant/40 space-y-2">
                <span className="font-mono text-xs text-primary font-bold">{st.num}</span>
                <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">{st.title}</h3>
                <p className="font-sans text-xs text-secondary leading-relaxed font-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.9 MÉTODOS POR RESULTADO (4 Perfiles)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F5EFEB] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.methodsEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.methodsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "Perfil 01", title: "Heritage / Ultra-Premium", tag: lang === "es" ? "Tradición pura" : "Heritage Pure", desc: lang === "es" ? "Tahona de piedra volcánica ancestral (500k L/año), hornos de mampostería y alambiques de cobre. 100% Additive Free." : "Volcanic stone tahona (500k L/yr), brick ovens, copper pot stills. 100% Additive Free." },
              { num: "Perfil 02", title: "Premium Consistente", tag: lang === "es" ? "Consistencia lote a lote" : "Batch Consistency", desc: lang === "es" ? "Autoclaves de vapor limpio a 80 tons, extracción noble sin machacar fibras y fermentación a temperatura controlada." : "Clean steam autoclaves (80 tons), gentle extraction, temperature-controlled fermentation." },
              { num: "Perfil 03", title: "Comercial Escalable", tag: lang === "es" ? "Escala competitiva" : "High Efficiency", desc: lang === "es" ? "Destilación continua en columnas europeas de alta eficiencia (9M L/año). Ideal para marcas de gran volumen y rotación rápida." : "European continuous columns (9M L/yr). High efficiency for large volume distribution." },
              { num: "Perfil 04", title: "Firma del Autor & Cava", tag: lang === "es" ? "Maduración exclusiva" : "Cask Aging", desc: lang === "es" ? "Levaduras exclusivas de la casa y crianza en barricas de Roble Americano Virgen, Bourbon o Roble Francés (cava 1.2M L)." : "Signature house yeasts and bespoke aging in American/French oak casks (1.2M L cellar)." }
            ].map((p, idx) => (
              <div key={idx} className="p-6 bg-white border border-outline-variant/40 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] text-primary uppercase font-bold">{p.num}</div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1C1C] mt-1 mb-2">{p.title}</h3>
                  <p className="font-sans text-xs text-secondary leading-relaxed font-normal">{p.desc}</p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30 text-[11px] font-mono text-primary">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.10 AGAVE & SUMINISTRO PROPIO (Ayotlán)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 overflow-hidden border border-outline-variant/40 shadow-sm">
              <img src="/Jimado Agave Tequilana Weber.webp" alt="Jimado de Agave en Ayotlán" className="w-full aspect-[4/3] object-cover" />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold">{t.agaveEyebrow}</p>
              <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
                {t.agaveTitle}
              </h2>
              <p className="font-sans text-secondary text-xs md:text-sm leading-relaxed font-normal">
                {t.agaveSub}
              </p>

              <div className="space-y-3 pt-2">
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Origen & Terruño" : "Origin & Terroir"}</div>
                  <div className="font-serif text-lg text-[#1C1C1C] font-bold">{lang === "es" ? "Los Altos de Jalisco, Ayotlán (>2,000 msnm)" : "Los Altos de Jalisco, Ayotlán (>2,000m ASL)"}</div>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Inventario Real" : "Estate Agave"}</div>
                  <div className="font-serif text-lg text-[#1C1C1C] font-bold">{lang === "es" ? "3,600 Hectáreas y 10.8 Millones de Plantas Propias" : "3,600 Hectares & 10.8 Million Estate Agaves"}</div>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Trazabilidad Total" : "Supply Planning"}</div>
                  <div className="font-serif text-lg text-[#1C1C1C] font-bold">{lang === "es" ? "Planeación agrícola de jima y blindaje de costo por litro" : "Harvest scheduling securing long-term cost per liter"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.11 & §5.12 CALIDAD & CUMPLIMIENTO INTERNACIONAL (2 Columnas)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#EDE7DE] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 md:p-10 bg-white border border-outline-variant/50 space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold">{t.qualityEyebrow}</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1C1C1C] font-bold leading-tight">
                {t.qualityTitle}
              </h2>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {t.qualitySub}
              </p>
              <ul className="space-y-2 pt-2 text-xs font-sans text-[#1C1C1C]">
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Cromatografía de gases lote por lote" : "Batch-to-batch gas chromatography"}</li>
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Aprobación técnica del cliente previa al embarque" : "Client approval prior to dispatch"}</li>
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Trazabilidad microbiológica completa" : "Full microbiological traceability"}</li>
              </ul>
            </div>

            <div className="p-8 md:p-10 bg-white border border-outline-variant/50 space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold">{t.complianceEyebrow}</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1C1C1C] font-bold leading-tight">
                {t.complianceTitle}
              </h2>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {t.complianceSub}
              </p>
              <ul className="space-y-2 pt-2 text-xs font-sans text-[#1C1C1C]">
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Registro oficial NOM 1633 ante el CRT" : "NOM 1633 official certification with CRT"}</li>
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Certificados de exportación y aprobación TTB (EE.UU.)" : "Export documentation and US TTB formula approval"}</li>
                <li className="flex items-center gap-2"><span className="text-primary font-bold">✦</span> {lang === "es" ? "Sellos USDA Organic, EU Organic, Kosher y Additive Free" : "USDA Organic, EU Organic, Kosher, and Additive Free"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.12b BLINDAJE LEGAL & NDA
          ============================================================ */}
      <section className="py-12 bg-[#1E1A17] text-white border-b border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="p-8 md:p-10 bg-white/5 border border-[#E8B04B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block font-mono text-[10px] text-[#E8B04B] uppercase tracking-widest border border-[#E8B04B]/40 px-2.5 py-0.5 rounded-full">{lang === "es" ? "Contrato de Confidencialidad (NDA)" : "Non-Disclosure Agreement"}</span>
              <h3 className="font-serif text-2xl md:text-3xl text-white font-semibold">{t.ndaTitle}</h3>
              <p className="font-sans text-xs md:text-sm text-white/80 leading-relaxed font-normal">
                {t.ndaSub}
              </p>
            </div>
            <div className="shrink-0">
              <a href="#contacto-agenda" className="inline-block py-3 px-6 bg-[#E8B04B] hover:bg-[#E8B04B]/90 text-[#1E1A17] font-navigation text-xs uppercase tracking-widest font-bold transition-all">
                {t.ndaBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.13 PRUEBA SOCIAL: RIGOR Y ATENCIÓN DIRECTA
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.proofEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.proofTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-outline-variant/40 space-y-2">
              <span className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Atención" : "Attention"}</span>
              <h3 className="font-serif text-lg font-bold text-[#1C1C1C]">{lang === "es" ? "Contacto Directo" : "Direct Attention"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Trato sin capas de vendedores: hablas directamente con ingenieros y maestros tequileros." : "Direct communication with the technical and production team on every project."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-2">
              <span className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Proceso" : "Process"}</span>
              <h3 className="font-serif text-lg font-bold text-[#1C1C1C]">{lang === "es" ? "Trazabilidad Verificable" : "Traceable Process"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Proceso documentado de origen a destino auditado y validado periódicamente por el CRT." : "Documented process from field to bottle audited by CRT inspectors."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-2">
              <span className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Casos de Éxito" : "Case Studies"}</span>
              <h3 className="font-serif text-lg font-bold text-[#1C1C1C]">{lang === "es" ? "Casos Autorizados" : "Authorized Cases"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Marcas globales y proyectos boutique desarrollados y destilados en nuestra planta." : "Global distributor labels and boutique tequila brands distilled at our plant."}
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-2">
              <span className="font-mono text-[10px] text-primary uppercase font-bold">{lang === "es" ? "Privacidad" : "Privacy"}</span>
              <h3 className="font-serif text-lg font-bold text-[#1C1C1C]">{lang === "es" ? "Confidencialidad Total" : "Strict NDA"}</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                {lang === "es" ? "Publicamos testimonios y nombres de marcas asociadas estrictamente bajo autorización escrita." : "Client brand names and testimonials published strictly with written consent."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.14 PREGUNTAS FRECUENTES (FAQ)
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F5EFEB] border-b border-outline-variant/30">
        <div className="max-w-[1000px] mx-auto px-6 text-left">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8C4723] font-bold mb-2">{t.faqEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] font-light leading-tight">
              {t.faqTitle}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs uppercase text-primary font-bold tracking-wider mb-3">{lang === "es" ? "Fundadores / Inversionistas" : "Founders / Investors"}</h3>
              <div className="divide-y divide-outline-variant/40 border-t border-b border-outline-variant/40">
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Cómo comienzo mi propia marca de tequila?" : "How do I start my own tequila brand?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "El proceso inicia definiendo el perfil organoléptico (sabor), presupuesto y mercado meta. Casa Loy te guía en la formulación, registro ante el CRT, proveeduría de botella y diseño de etiqueta hasta tener el primer lote terminado." : "It starts with defining liquid character, budget range, and target market. Casa Loy assists with CRT registration, glass sourcing, formulation, and export."}
                  </p>
                </details>
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Quién es el dueño de la fórmula de mi tequila?" : "Who owns my liquid formula?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "Tú. Tu marca es dueña indiscutible de su perfil y receta. Firmamos contratos de propiedad intelectual y confidencialidad (NDA) que te blindan legalmente desde el primer día." : "You do. Every project includes an NDA and clear IP ownership terms protecting your recipe."}
                  </p>
                </details>
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Puedo visitar las instalaciones de la destilería en Ayotlán?" : "Can I visit the distillery in Ayotlán?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "Sí. Damos la bienvenida a visitas técnicas para proyectos calificados. Conocer la planta, los hornos y el laboratorio en persona es el mejor paso para iniciar una relación de confianza." : "Yes. We welcome project visits to review operations, autoclaves, brick ovens, and testing lab."}
                  </p>
                </details>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-mono text-xs uppercase text-primary font-bold tracking-wider mb-3">{lang === "es" ? "Marcas Existentes" : "Existing Brands"}</h3>
              <div className="divide-y divide-outline-variant/40 border-t border-b border-outline-variant/40">
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Puedo cambiar de productor sin que se interrumpa mi inventario?" : "Can I switch producers without interrupting inventory?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "Sí. Trazamos un calendario de transición coordinado, analizando químicamente tu líquido actual para replicar su sabor y produciendo lotes de seguridad antes de hacer la cesión de marca ante el CRT." : "Yes. We map your timeline first, replicate the flavor with gas chromatography, and buffer stock before transferring the brand."}
                  </p>
                </details>
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Fabrican perfiles de autor de forma exclusiva?" : "Can you produce exclusively for my brand?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "Sí. Desarrollamos recetas organolépticas exclusivas protegidas bajo contrato para que ningún otro cliente pueda utilizar tu perfil." : "Yes. Exclusivity and formula protection are core components of our contract agreements."}
                  </p>
                </details>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-mono text-xs uppercase text-primary font-bold tracking-wider mb-3">{lang === "es" ? "Granel & Regulaciones" : "Bulk Buyers & Compliance"}</h3>
              <div className="divide-y divide-outline-variant/40 border-t border-b border-outline-variant/40">
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Ofrecen tequila a granel certificado con reporte cromatográfico?" : "Does Casa Loy offer bulk tequila with gas chromatography?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "Sí. Suministramos tequila 100% agave y mixto a granel con reportes físico-químicos y cromatografía de gases por cada contenedor o cisterna despachada." : "Yes. We supply continuous 100% agave and mixto bulk with certificates of analysis for each shipment."}
                  </p>
                </details>
                <details className="py-4 group">
                  <summary className="flex justify-between items-center cursor-pointer font-serif text-lg font-bold text-[#1C1C1C] group-hover:text-primary transition-colors">
                    <span>{lang === "es" ? "¿Qué significa que Casa Loy sea NOM 1633?" : "What does NOM 1633 mean for a tequila brand?"}</span>
                    <span className="font-serif text-xl text-primary font-light group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="font-sans text-xs md:text-sm text-secondary mt-3 leading-relaxed">
                    {lang === "es" ? "La NOM (Norma Oficial Mexicana) 1633 es nuestro número de registro autorizado ante el CRT, certificando que destilamos bajo las normas oficiales mexicanas dentro de la región geográfica protegida por la denominación de origen." : "NOM 1633 is our authorized registration with Mexico's CRT, certifying production complies with official Mexican standards and origin designation."}
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5.14 CTA FINAL + CAL.COM SCHEDULER
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#1E1A17] text-white" id="contacto-agenda">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8B04B] font-bold mb-2">{t.ctaEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight">
              {t.ctaTitle}
            </h2>
            <p className="font-sans text-white/75 text-xs md:text-sm mt-3 leading-relaxed font-normal">
              {t.ctaSub}
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-white border border-outline-variant/30 p-4 md:p-8 shadow-2xl relative text-left">
            <div className="mb-4 border-b border-stone-200/60 pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-xl text-zinc-900 font-semibold">{lang === "es" ? "Reserva tu espacio en la agenda oficial" : "Reserve your technical consultation slot"}</h4>
                <p className="text-xs text-stone-500 font-normal font-sans">{lang === "es" ? "Selecciona fecha y hora disponible vía Cal.com." : "Select available date & time via Cal.com."}</p>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold uppercase bg-amber-50 px-2 py-1 border border-amber-200">20 Minutos</span>
            </div>
            <div id="cal-inline-v3-react" className="w-full h-[580px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
