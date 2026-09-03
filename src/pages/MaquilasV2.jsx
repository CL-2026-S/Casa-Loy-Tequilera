import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";

export default function MaquilasV2({ lang = "es" }) {
  // Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    solution: "",
    stage: "",
    market: ""
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
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
        elementOrSelector: "#cal-inline-v2",
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
      seoTitle: "Maquila de Tequila B2B | Casa Loy Tequilera · NOM 1633",
      seoDesc: "Destilería y maquila de tequila en Los Altos de Jalisco. Respaldo de Grupo Orbe XXI, 3,600 Has. de agave propio y 13.5M L de capacidad anual.",
      heroOvertitle: "DESTILERÍA & MAQUILA TEQUILA B2B · NOM 1633",
      heroTitle: "MAQUILA DE TEQUILA DE MARCA PROPIA",
      heroTitleItalic: "EN LOS ALTOS DE JALISCO",
      heroSub: "Infraestructura industrial de vanguardia · 3,600 Hectáreas de agave propio · Exportación global",
      heroBtnStart: "COTIZAR MARCA PROPIA",
      heroBtnCall: "AGENDAR LLAMADA",
      
      trustNom: "NOM 1633 CRT",
      trustRegion: "Ayotlán · Los Altos de Jalisco",
      trustStructure: "Grupo Orbe XXI (60+ Años)",
      trustRoots: "3,600 Has. / 10.8M Agaves",
      trustControl: "13.5M L / Año Capacidad",
      trustExport: "1.2M L Cava Barricas",
      trustAdditiveFree: "Certificado 100% Additive Free",

      // Quiz
      quizBadge: "DIAGNÓSTICO ESTRATÉGICO · 3 PREGUNTAS",
      quizTitle: "Diseñemos el tequila ideal para tu mercado.",
      quizSub: "Completa este breve diagnóstico para evaluar la viabilidad operativa de tu proyecto y recibir una propuesta técnica personalizada.",
      step1Title: "¿Qué tipo de solución requiere tu proyecto?",
      step2Title: "¿En qué etapa se encuentra tu proyecto?",
      step3Title: "¿Cuál es el mercado objetivo principal de tu tequila?",
      step4Title: "¿A dónde enviamos tu propuesta técnica y diagnóstico?",
      step4Sub: "Un maestro tequilero o especialista de producción revisará los parámetros de tu proyecto sin compromiso.",
      btnSubmit: "RECIBIR PROPUESTA Y ASESORÍA TÉCNICA →",
      btnSubmitting: "ENVIANDO INFORMACIÓN...",
      successTitle: "¡Diagnóstico recibido con éxito!",
      successSub: "Gracias por compartir los detalles de tu proyecto. Un especialista de producción de Casa Loy revisará tus especificaciones y se comunicará en menos de 24 horas.",
      successCta: "O agenda directamente una llamada técnica aquí ↓",
      backBtn: "← Volver a la pregunta anterior",

      // Grupo Orbe XXI + Capacidad
      groupBadge: "SOLIDEZ CORPORATIVA & CAPACIDAD INSTALADA",
      groupTitle: "Respaldo de Grupo Orbe XXI: Más de 60 años de trayectoria empresarial.",
      groupSub: "Detrás de Casa Loy opera un consorcio agroindustrial multinacional con más de 2,900 colaboradores, presencia global y solvencia que blindan tu inversión y tu suministro de agave.",
      
      // Campo
      campoBadge: "ABASTECIMIENTO GARANTIZADO DE CAMPO",
      campoTitle: "3,600 Hectáreas y 10.8 Millones de Agaves Propios.",
      campoSub: "A diferencia de destilerías que dependen de intermediarios coyotes y volatilidad de precios en el mercado abierto, Casa Loy es autosuficiente. Cultivamos nuestras propias tierras en Jalisco, Michoacán y Guanajuato desde 1992, blindando tu costo por litro a largo plazo.",
      campoCorredor: "El Corredor Dorado de Los Altos: Guadalajara → Casamigos → Patrón → Don Julio → Ayotlán (Casa Loy) → Tequila Ocho / Teremana",

      // Calidad
      qualityBadge: "ESTÁNDARES INTERNACIONALES",
      qualityTitle: "Calidad científica y sellos que abren fronteras.",
      qualitySub: "Diseñado para superar las inspecciones más estrictas del CRT, FDA, TTB de EE.UU. y normativas de la Unión Europea.",

      // Agenda
      callBadge: "PASO DIRECTO · SIN INTERMEDIARIOS",
      callTitle: "Conversaciones que destilan negocios.",
      callSub: "Agenda una videollamada técnica de 20 minutos para revisar requerimientos, costos por litro y disponibilidad de producción con un especialista de Casa Loy.",
      calendarHeader: "Reserva tu espacio en la agenda oficial",
      calendarSub: "Selecciona fecha y hora disponible vía Cal.com."
    },
    en: {
      seoTitle: "Private Label Tequila B2B | Casa Loy Tequilera · NOM 1633",
      seoDesc: "Contract manufacturing and private label distillery in Los Altos de Jalisco. Backed by Grupo Orbe XXI, 3,600 Has. of estate agave and 13.5M L annual capacity.",
      heroOvertitle: "DISTILLERY & PRIVATE LABEL TEQUILA B2B · NOM 1633",
      heroTitle: "PRIVATE LABEL TEQUILA DISTILLING",
      heroTitleItalic: "IN LOS ALTOS DE JALISCO",
      heroSub: "State-of-the-art industrial infrastructure · 3,600 Hectares of estate agave · Global export readiness",
      heroBtnStart: "GET A CUSTOM QUOTE",
      heroBtnCall: "SCHEDULE A CALL",
      
      trustNom: "NOM 1633 CRT",
      trustRegion: "Ayotlán · Los Altos de Jalisco",
      trustStructure: "Grupo Orbe XXI (60+ Years)",
      trustRoots: "3,600 Has. / 10.8M Agaves",
      trustControl: "13.5M L / Year Capacity",
      trustExport: "1.2M L Aging Cellar",
      trustAdditiveFree: "100% Additive Free Certified",

      // Quiz
      quizBadge: "STRATEGIC DIAGNOSTIC · 3 QUESTIONS",
      quizTitle: "Let's formulate the ideal tequila for your market.",
      quizSub: "Complete this quick diagnostic to evaluate operational feasibility and receive a tailor-made technical proposal.",
      step1Title: "What type of solution does your project require?",
      step2Title: "What stage is your project currently in?",
      step3Title: "What is the primary target market for your tequila?",
      step4Title: "Where should we send your technical proposal and diagnostic?",
      step4Sub: "A master distiller or production specialist will review your specifications without obligation.",
      btnSubmit: "RECEIVE PROPOSAL & TECHNICAL CONSULTATION →",
      btnSubmitting: "SUBMITTING DETAILS...",
      successTitle: "Diagnostic Received Successfully!",
      successSub: "Thank you for sharing your project details. A Casa Loy production specialist will review your requirements and follow up within 24 hours.",
      successCta: "Or book a technical call directly on our calendar below ↓",
      backBtn: "← Back to previous question",

      // Grupo Orbe XXI + Capacity
      groupBadge: "CORPORATE BACKING & INSTALLED CAPACITY",
      groupTitle: "Backed by Grupo Orbe XXI: Over 60 years of agro-industrial excellence.",
      groupSub: "Behind Casa Loy operates a multinational consortium with 2,900+ employees, global reach, and financial strength that guarantees your investment and agave supply.",
      
      // Campo
      campoBadge: "GUARANTEED ESTATE SUPPLY",
      campoTitle: "3,600 Hectares and 10.8 Million Estate Agaves.",
      campoSub: "Unlike distilleries dependent on open-market spot prices and brokers, Casa Loy is fully self-sufficient. We farm our own estates across Jalisco, Michoacán, and Guanajuato since 1992, securing your long-term cost per liter.",
      campoCorredor: "The Golden Highlands Corridor: Guadalajara → Casamigos → Patrón → Don Julio → Ayotlán (Casa Loy) → Tequila Ocho / Teremana",

      // Calidad
      qualityBadge: "INTERNATIONAL STANDARDS",
      qualityTitle: "Scientific quality and certifications that open global doors.",
      qualitySub: "Engineered to surpass the most stringent audits by CRT, FDA, US TTB, and European Union regulations.",

      // Agenda
      callBadge: "DIRECT ACCESS · NO MIDDLEMEN",
      callTitle: "Conversations that distill business.",
      callSub: "Schedule a 20-minute technical video call to review specs, cost per liter, and production lead times with a Casa Loy specialist.",
      calendarHeader: "Reserve your slot on the official calendar",
      calendarSub: "Choose an available date and time via Cal.com."
    }
  }[lang] || {};

  const handleOptionSelect = (field, value, nextStep) => {
    setQuizAnswers(prev => ({ ...prev, [field]: value }));
    setQuizStep(nextStep);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/leads/maquilas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quizAnswers,
          ...contactForm,
          source: "maquilas-v2-react",
          createdAt: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("API lead capture fallback:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1c1c18] font-sans antialiased selection:bg-[#8C4723] selection:text-white">
      <SEO 
        title={t.seoTitle}
        description={t.seoDesc}
      />

      {/* ============================================================
          BLOQUE 1: HERO & TRUST TICKER
          ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1E1A17] text-white">
        <div className="absolute inset-0 z-0">
          <img
            alt="Naves Industriales Casa Loy Tequilera"
            className="w-full h-full object-cover brightness-[0.70]"
            src="/Naves Industriales Casa Loy Tequilera.webp"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#1E1A17]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center pt-24 pb-20">
          <span className="font-navigation text-[#FDA377] font-semibold tracking-[0.35em] text-[11px] md:text-xs uppercase mb-4 block">
            {t.heroOvertitle}
          </span>

          <h1 className="font-serif text-[clamp(28px,4.5vw,56px)] leading-[1.15] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-6">
            {t.heroTitle} <br />
            <span className="text-white italic font-normal">{t.heroTitleItalic}</span>
          </h1>

          <p className="font-navigation text-white/80 font-normal text-xs md:text-sm max-w-2xl mx-auto mb-10 leading-relaxed tracking-wider uppercase">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md sm:max-w-none">
            <a
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-xs uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all min-w-[210px] text-center shadow-lg cursor-pointer"
              href="#quiz-v2"
            >
              {t.heroBtnStart}
            </a>
            <a
              className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-xs uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all min-w-[210px] text-center cursor-pointer"
              href="#contact-scheduler"
            >
              {t.heroBtnCall}
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-[#EDE7DE] border-y border-[#1A1615]/10 py-4">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 text-center">
            <span className="font-navigation text-[11px] font-bold uppercase tracking-widest text-[#8C4723]">{t.trustNom}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustRegion}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustStructure}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustRoots}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustControl}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustExport}</span>
            <span className="text-primary text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-bold uppercase tracking-widest text-primary">{t.trustAdditiveFree}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          BLOQUE 2: QUIZ DE DIAGNÓSTICO RÁPIDO B2B (Captura Inmediata)
          ============================================================ */}
      <section className="relative py-16 md:py-24 bg-[#1E1A17] text-white overflow-hidden" id="quiz-v2">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="/Piñas de Agave Tequilana Weber.webp"
            alt="Agave Weber"
            className="w-full h-full object-cover brightness-75 filter"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1A17] via-transparent to-[#1E1A17]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-left">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-navigation text-[#FDA377] font-semibold tracking-[0.3em] text-[11px] uppercase block mb-2">
              {t.quizBadge}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight">
              {t.quizTitle}
            </h2>
            <p className="font-sans text-white/75 text-xs md:text-sm font-normal mt-3 leading-relaxed">
              {t.quizSub}
            </p>
          </div>

          <div className="bg-white/5 border border-white/15 backdrop-blur-md p-6 md:p-10 shadow-2xl relative">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="font-navigation text-xs text-[#FDA377] font-bold tracking-widest uppercase">
                {!isSuccess ? (lang === "es" ? ("Paso " + quizStep + " de 4") : ("Step " + quizStep + " of 4")) : (lang === "es" ? "Completado ✓" : "Completed ✓")}
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(s => (
                  <span
                    key={s}
                    className={`w-8 h-1 rounded-full transition-colors ${
                      isSuccess ? "bg-emerald-500" : s <= quizStep ? "bg-[#8C4723]" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quiz Steps */}
            {!isSuccess && quizStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl md:text-2xl text-white font-semibold">
                  {t.step1Title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: lang === "es" ? "Marca Propia Integral" : "Turnkey Private Label", code: "01 · " + (lang === "es" ? "Llave en Mano" : "Turnkey"), desc: lang === "es" ? "Desde registro CRT, formulación, botella y envasado hasta exportación." : "From CRT registry, bottle design, formulation to export." },
                    { title: lang === "es" ? "Tequila a Granel (Bulk)" : "Bulk Tequila Supply", code: "02 · " + (lang === "es" ? "Volumen Continuo" : "Bulk Supply"), desc: lang === "es" ? "Suministro continuo 100% Agave o Mixto para embotelladoras globales." : "Continuous 100% Agave or Mixto bulk for global bottlers." },
                    { title: lang === "es" ? "Envasado & Co-Packing" : "Bottling & Co-Packing", code: "03 · " + (lang === "es" ? "Acondicionamiento" : "Packaging"), desc: lang === "es" ? "Llenado, sellado, etiquetado e inspección visual para marcas existentes." : "Filling, sealing, labeling, and QA light table inspection." },
                    { title: lang === "es" ? "Perfil de Autor & Cava" : "Custom Profile & Cask Aging", code: "04 · " + (lang === "es" ? "Alta Gama" : "High End"), desc: lang === "es" ? "Crianza a la medida en roble americano, bourbon o roble francés." : "Bespoke barrel aging in virgin American, bourbon, or French oak." }
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect("solution", opt.title, 2)}
                      className="text-left p-5 border border-white/15 bg-white/5 hover:bg-[#8C4723]/30 hover:border-[#FDA377] transition-all group cursor-pointer"
                    >
                      <div className="font-navigation text-xs text-[#FDA377] font-bold uppercase tracking-wider mb-1">{opt.code}</div>
                      <div className="font-serif text-base text-white font-semibold group-hover:text-[#FDA377] transition-colors">{opt.title}</div>
                      <p className="font-sans text-xs text-white/70 font-normal mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isSuccess && quizStep === 2 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl md:text-2xl text-white font-semibold">
                  {t.step2Title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: lang === "es" ? "Idea Inicial / Lanzamiento" : "Initial Idea / New Brand", desc: lang === "es" ? "Busco asesoría técnica completa y lotes mínimos viables." : "Seeking complete technical advice and minimum order quantities." },
                    { title: lang === "es" ? "Marca Existente / Cambio" : "Existing Brand / Switching", desc: lang === "es" ? "Requiero replicar mi perfil sensorial con mayor consistencia y stock." : "Looking to replicate current flavor profile with better consistency." },
                    { title: lang === "es" ? "Distribuidor / Retail" : "Large Scale Distributor", desc: lang === "es" ? "Requiero suministro de alto volumen continuo y precios directos de fábrica." : "Need large volume supply and direct manufacturer pricing." },
                    { title: lang === "es" ? "Comparando Opciones" : "Evaluating Options", desc: lang === "es" ? "Quiero conocer cotización, tiempos de entrega y capacidades técnicas." : "Comparing pricing, lead times, and distillery capabilities." }
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect("stage", opt.title, 3)}
                      className="text-left p-5 border border-white/15 bg-white/5 hover:bg-[#8C4723]/30 hover:border-[#FDA377] transition-all group cursor-pointer"
                    >
                      <div className="font-serif text-base text-white font-semibold group-hover:text-[#FDA377]">{opt.title}</div>
                      <p className="font-sans text-xs text-white/70 font-normal mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setQuizStep(1)} className="font-navigation text-xs text-white/60 hover:text-white uppercase tracking-wider flex items-center gap-1 mt-4">
                  {t.backBtn}
                </button>
              </div>
            )}

            {!isSuccess && quizStep === 3 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl md:text-2xl text-white font-semibold">
                  {t.step3Title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: lang === "es" ? "Estados Unidos (USA)" : "United States (TTB / COLA)", desc: lang === "es" ? "Cumplimiento TTB, fórmulas certificadas y exportación directa." : "US TTB compliance, formula approval, and direct export." },
                    { title: lang === "es" ? "México (Mercado Nacional)" : "Domestic Mexican Market", desc: lang === "es" ? "Marbetes SAT, alta ante CRT y distribución en retail/HORECA." : "SAT tax stamps, CRT co-production registration, and retail readiness." },
                    { title: lang === "es" ? "Europa / Reino Unido / Asia" : "Europe / UK / Asia", desc: lang === "es" ? "Certificación EU Organic, análisis cromatográfico y logística marítima." : "EU Organic certification, gas chromatography, and sea freight logistics." },
                    { title: lang === "es" ? "Canadá u Otros Mercados" : "Canada / Latin America / Other", desc: lang === "es" ? "Soporte arancelario y documentación fitosanitaria internacional." : "Tariff guidance and international phytosanitary export documentation." }
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect("market", opt.title, 4)}
                      className="text-left p-5 border border-white/15 bg-white/5 hover:bg-[#8C4723]/30 hover:border-[#FDA377] transition-all group cursor-pointer"
                    >
                      <div className="font-serif text-base text-white font-semibold group-hover:text-[#FDA377]">{opt.title}</div>
                      <p className="font-sans text-xs text-white/70 font-normal mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setQuizStep(2)} className="font-navigation text-xs text-white/60 hover:text-white uppercase tracking-wider flex items-center gap-1 mt-4">
                  {t.backBtn}
                </button>
              </div>
            )}

            {!isSuccess && quizStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="font-navigation text-xs text-[#FDA377] font-bold uppercase tracking-widest block mb-1">
                    {lang === "es" ? "Último Paso" : "Final Step"}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-white font-semibold">
                    {t.step4Title}
                  </h3>
                  <p className="font-sans text-xs text-white/70 font-normal mt-1">
                    {t.step4Sub}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-navigation text-[11px] uppercase tracking-wider text-white/70 mb-1">
                        {lang === "es" ? "Nombre completo *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ej. Carlos Mendoza"
                        className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-navigation text-[11px] uppercase tracking-wider text-white/70 mb-1">
                        {lang === "es" ? "Empresa o Marca" : "Company / Brand Name"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="Ej. Tequila Don Carlos LLC"
                        className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-navigation text-[11px] uppercase tracking-wider text-white/70 mb-1">
                        {lang === "es" ? "Teléfono / WhatsApp *" : "Phone / WhatsApp *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+52 33 1234 5678"
                        className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-navigation text-[11px] uppercase tracking-wider text-white/70 mb-1">
                        {lang === "es" ? "Correo corporativo *" : "Business Email *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="carlos@empresa.com"
                        className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-navigation text-[11px] uppercase tracking-wider text-white/70 mb-1">
                      {lang === "es" ? "Detalles o notas adicionales (opcional)" : "Additional Notes (Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.notes}
                      onChange={e => setContactForm({ ...contactForm, notes: e.target.value })}
                      placeholder={lang === "es" ? "Platícanos sobre tu visión, fecha tentativa o perfil sensorial..." : "Tell us about your estimated launch date, desired profile..."}
                      className="w-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    {isSubmitting ? t.btnSubmitting : t.btnSubmit}
                  </button>
                </form>
                <button type="button" onClick={() => setQuizStep(3)} className="font-navigation text-xs text-white/60 hover:text-white uppercase tracking-wider flex items-center gap-1 mt-3">
                  {t.backBtn}
                </button>
              </div>
            )}

            {isSuccess && (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-semibold">
                  {t.successTitle}
                </h3>
                <p className="font-sans text-xs md:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  {t.successSub}
                </p>
                <div className="pt-4">
                  <a
                    href="#contact-scheduler"
                    className="inline-block py-3 px-6 border border-[#FDA377] text-[#FDA377] hover:bg-[#FDA377] hover:text-[#1E1A17] font-navigation text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    {t.successCta}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOQUE 3: RESPALDO INSTITUCIONAL & CAPACIDADES (13.5M L)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-[#FAF6F0] border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
            <div className="lg:col-span-8">
              <span className="font-navigation text-xs text-primary font-bold tracking-[0.25em] uppercase block mb-3">
                {t.groupBadge}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#1c1c18] font-light leading-tight">
                {t.groupTitle}
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="font-sans text-secondary text-xs md:text-sm leading-relaxed font-normal">
                {t.groupSub}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-white border border-outline-variant/40 space-y-3 hover:border-primary transition-all shadow-sm">
              <div className="font-navigation text-[10px] text-primary font-bold uppercase tracking-widest">Cocción Dual</div>
              <div className="font-serif text-3xl md:text-4xl text-[#1c1c18] font-semibold">320 Tons</div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1c18]">4 Hornos + 2 Autoclaves</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                4 hornos de mampostería tradicional a vapor lento (240t) y 2 autoclaves rápidas de acero (80t) que maximizan rendimiento y frescura.
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-3 hover:border-primary transition-all shadow-sm">
              <div className="font-navigation text-[10px] text-primary font-bold uppercase tracking-widest">Extracción Noble</div>
              <div className="font-serif text-3xl md:text-4xl text-[#1c1c18] font-semibold">Tahona & Molino</div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Extracción Verde</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                500,000 L/año en Tahona ancestral de piedra volcánica para perfiles artesanales, más molienda de rodillos que no machaca fibras amargas.
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-3 hover:border-primary transition-all shadow-sm">
              <div className="font-navigation text-[10px] text-primary font-bold uppercase tracking-widest">Destilación Total</div>
              <div className="font-serif text-3xl md:text-4xl text-primary font-semibold">13.5M Litros</div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Alambiques & Columnas</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                Alambiques de cobre tradicionales (4.5M L/año) y columnas continuas europeas (9M L/año). Agua purísima de pozo profundo propio.
              </p>
            </div>

            <div className="p-6 bg-white border border-outline-variant/40 space-y-3 hover:border-primary transition-all shadow-sm">
              <div className="font-navigation text-[10px] text-primary font-bold uppercase tracking-widest">Crianza & Bodega</div>
              <div className="font-serif text-3xl md:text-4xl text-[#1c1c18] font-semibold">1.2M Litros</div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Cava Climatizada</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                Roble blanco americano, bourbon y roble francés con humedad controlada, 1.3M L en tanques de acero y almacén para 2,000 tarimas.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#EDE7DE]/50 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
              <span className="font-navigation text-xs font-bold uppercase tracking-wider text-[#1c1c18]">Empresas del Grupo:</span>
              <span className="font-sans text-xs text-secondary">TeknoAgrox (Agave desde 1992) · Nutriagaves (Presencia USA/EU/Asia) · Casa Loy Tequilera (NOM 1633)</span>
            </div>
            <span className="font-mono text-[11px] text-primary font-semibold bg-white px-3 py-1 border border-primary/20">NOM 1633 CRT</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOQUE 4: AUTOSUFICIENCIA DE CAMPO (Ayotlán)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-[#F5EFEB] border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 overflow-hidden shadow-md border border-outline-variant/40">
              <img
                src="/Jimado Agave Tequilana Weber.webp"
                alt="Campos de Agave Casa Loy en Ayotlán"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="font-navigation text-xs text-primary font-bold tracking-[0.25em] uppercase block">
                {t.campoBadge}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#1c1c18] font-light leading-tight">
                {t.campoTitle}
              </h2>
              <p className="font-sans text-secondary text-xs md:text-sm leading-relaxed font-normal">
                {t.campoSub}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-serif text-2xl text-primary font-bold">10.8M</div>
                  <div className="font-navigation text-[11px] font-semibold text-[#1c1c18] uppercase">Plantas en Inventario</div>
                  <p className="font-sans text-[11px] text-secondary">Cosecha escalonada garantizada.</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-serif text-2xl text-primary font-bold">&gt;2,000 msnm</div>
                  <div className="font-navigation text-[11px] font-semibold text-[#1c1c18] uppercase">Terruño de Ayotlán</div>
                  <p className="font-sans text-[11px] text-secondary">Tierra roja rica en hierro y azúcares ART.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-outline-variant/40 font-navigation text-xs text-[#1c1c18] space-y-1">
                <span className="text-primary font-bold uppercase tracking-wider block text-[10px]">El Corredor Dorado de Los Altos:</span>
                <p className="font-sans text-xs text-secondary">{t.campoCorredor}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOQUE 5: CALIDAD, CLEAN TECH & CERTIFICACIONES
          ============================================================ */}
      <section className="py-16 md:py-24 bg-white border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-navigation text-xs text-primary font-bold tracking-[0.25em] uppercase block mb-3">
              {t.qualityBadge}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.qualityTitle}
            </h2>
            <p className="font-sans text-secondary text-xs md:text-sm font-normal mt-3 leading-relaxed">
              {t.qualitySub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            <div className="p-8 bg-[#FAF6F0] border border-outline-variant/40 space-y-4 shadow-sm hover:border-primary transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">science</span>
              <h3 className="font-serif text-xl text-[#1c1c18] font-bold">Tasting Lab & Cromatografía</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                Laboratorio in-house con cromatografía de gases lote a lote para garantizar perfiles sensoriales idénticos y cumplimiento estricto de metanol y ésteres.
              </p>
            </div>

            <div className="p-8 bg-[#FAF6F0] border border-outline-variant/40 space-y-4 shadow-sm hover:border-primary transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">solar_power</span>
              <h3 className="font-serif text-xl text-[#1c1c18] font-bold">Energía Limpia & Economía Circular</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                Paneles solares (hasta 45% de energía), caldera de biomasa de bagazo que elimina combustibles fósiles, compostaje 100% de fibras y tratamiento de vinazas.
              </p>
            </div>

            <div className="p-8 bg-[#FAF6F0] border border-outline-variant/40 space-y-4 shadow-sm hover:border-primary transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">verified</span>
              <h3 className="font-serif text-xl text-[#1c1c18] font-bold">100% Additive Free Verified</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed font-normal">
                Capacidad auditada para producir tequilas completamente libres de abocantes, colorantes o saborizantes artificiales, ideal para el segmento ultra-premium.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            <div className="p-4 border border-outline-variant/50 bg-[#EDE7DE]/20 space-y-1">
              <div className="font-navigation text-[11px] font-bold text-[#1c1c18] uppercase">USDA Organic</div>
              <span className="font-mono text-[9px] text-primary block">Mercado USA</span>
            </div>
            <div className="p-4 border border-outline-variant/50 bg-[#EDE7DE]/20 space-y-1">
              <div className="font-navigation text-[11px] font-bold text-[#1c1c18] uppercase">EU Organic</div>
              <span className="font-mono text-[9px] text-primary block">27 Países UE</span>
            </div>
            <div className="p-4 border border-outline-variant/50 bg-[#EDE7DE]/20 space-y-1">
              <div className="font-navigation text-[11px] font-bold text-[#1c1c18] uppercase">KMD Kosher</div>
              <span className="font-mono text-[9px] text-primary block">Pureza Global</span>
            </div>
            <div className="p-4 border border-outline-variant/50 bg-[#EDE7DE]/20 space-y-1">
              <div className="font-navigation text-[11px] font-bold text-[#1c1c18] uppercase">Additive Free</div>
              <span className="font-mono text-[9px] text-primary block">Tequila Matchmaker</span>
            </div>
            <div className="p-4 border border-outline-variant/50 bg-[#EDE7DE]/20 space-y-1">
              <div className="font-navigation text-[11px] font-bold text-[#1c1c18] uppercase">FSSC 22000</div>
              <span className="font-mono text-[9px] text-primary block">Inocuidad Máxima</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOQUE 6: AGENDA TU VIDEOLLAMADA TÉCNICA (Cal.com)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-[#1E1A17] text-white" id="contact-scheduler">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="font-navigation text-[#FDA377] font-semibold tracking-[0.3em] text-[11px] uppercase block mb-2">
              {t.callBadge}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight">
              {t.callTitle}
            </h2>
            <p className="font-sans text-white/75 text-xs md:text-sm font-normal mt-3 leading-relaxed">
              {t.callSub}
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-white border border-outline-variant/20 p-4 md:p-8 shadow-2xl relative text-left">
            <div className="mb-4 border-b border-stone-200/50 pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-xl text-zinc-900 font-semibold">{t.calendarHeader}</h4>
                <p className="text-xs text-stone-500 font-normal font-sans">{t.calendarSub}</p>
              </div>
              <span className="font-navigation text-[10px] text-primary font-bold uppercase bg-amber-50 px-2 py-1 border border-amber-200">20 Minutos</span>
            </div>
            <div id="cal-inline-v2" className="w-full h-[580px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
