import React, { useState, useEffect, useRef } from "react";
import SEO from "../components/SEO";

// Intersection Observer Reveal Component for clean scroll entrance animations
function Reveal({ children, className = "", delay = 0, duration = 800 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}

export default function MaquilasV3({ lang = "es" }) {
  // Quiz State (Identical to Maquilas / Marca Privada)
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({ solution: "", objective: "", stage: "" });
  const [contactForm, setContactForm] = useState({ name: "", company: "", lada: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Station State for "Dentro de Casa Loy" Interactive Showcase
  const [activeStation, setActiveStation] = useState(0);

  // Active FAQ Category
  const [activeFaqTab, setActiveFaqTab] = useState("founders");
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Animated Counters State for Agave & Abastecimiento
  const [counters, setCounters] = useState({ msnm: 0, has: 0, plants: 0 });
  const [countersTriggered, setCountersTriggered] = useState(false);
  const agaveRef = useRef(null);

  // IntersectionObserver for Animated Counters
  useEffect(() => {
    const el = agaveRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setCounters({ msnm: 2000, has: 3600, plants: 10.8 });
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCountersTriggered(true);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!countersTriggered) return;
    const duration = 1800;
    const start = performance.now();
    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        msnm: Math.round(2000 * ease),
        has: Math.round(3600 * ease),
        plants: Number((10.8 * ease).toFixed(1))
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCounters({ msnm: 2000, has: 3600, plants: 10.8 });
      }
    };
    requestAnimationFrame(frame);
  }, [countersTriggered]);

  // Cal.com Embed Loader (30 minutes technical consultation)
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
        elementOrSelector: "#cal-inline-v3-scheduler",
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

  // Content Translations
  const content = {
    es: {
      seoTitle: "Maquila de Tequila de Marca Privada & Granel B2B | Casa Loy · NOM 1633",
      seoDesc: "Destilería oficial NOM 1633 en Los Altos de Jalisco. Producción integral de marca privada, venta a granel, 3,600 Has. de agave propio y 13.5M L de capacidad anual.",
      
      // Hero
      heroOvertitle: "DESTILERÍA & MAQUILA B2B · NOM 1633",
      heroTitle: "Marca Privada de Tequila 100% Agave",
      heroTitleItalic: "Infraestructura, Certificación CRT y Exportación Global.",
      heroBtn: "Cotizar Marca Privada B2B",
      heroBtnSec: "Agendar Videollamada",
      
      // Trust Bar
      trustNom: "NOM 1633 CRT",
      trustRegion: "Los Altos de Jalisco",
      trustGroup: "Grupo Orbe XXI (60+ Años)",
      trustAgave: "3,600 Has. Agave Propio (1992)",
      trustCapacity: "13.5M L / Año Capacidad",
      trustControl: "Control Lote por Lote",
      trustFree: "100% Additive Free Verified",

      // Why Casa Loy
      whyEyebrow: "INFRAESTRUCTURA & CERTEZA OPERATIVA",
      whyTitle: "¿Por qué Casa Loy para tu Proyecto?",
      whySub: "Seis pilares industriales que blindan la calidad, el costo y la entrega continua de tu destilado.",

      // Inside Casa Loy
      insideEyebrow: "INSTALACIONES & CAPACIDAD INDUSTRIAL",
      insideTitle: "Dentro de Casa Loy",
      insideSub: "Recorre interactivamente las 8 estaciones de nuestra destilería en Ayotlán, Jalisco.",

      // Solutions
      solutionsEyebrow: "RUTAS DE PRODUCCIÓN",
      solutionsTitle: "Soluciones Adaptadas a tu Escala",
      solutionsSub: "Modelos de negocio estructurados para marcas de tequila en crecimiento y distribuidores de alto volumen.",

      // Stakes / Risks
      stakesEyebrow: "BLINDAJE DE NEGOCIO",
      stakesTitle: "Mitigación de Riesgos Reales",
      stakesSub: "Respuestas operativas ante los retos más críticos de la industria del tequila.",

      // Quiz (Same as Maquilas.jsx)
      quizOvertitle: "Quiz estratégico de 3 preguntas",
      quizTitle: "¿Qué tipo de proyecto buscas desarrollar?",
      quizDesc: "Completa este diagnóstico de 3 preguntas para recibir una propuesta adaptada a tus necesidades y objetivos.",
      stepLabel: "Pregunta",
      step1Title: "¿Qué solución necesitas actualmente?",
      step2Title: "¿Cuál es tu objetivo principal?",
      step3Title: "¿En qué etapa se encuentra tu proyecto?",

      step1Opts: [
        "Desarrollo integral de Marca Privada",
        "Desarrollo de marca privada (Private Label)",
        "Compra de tequila a granel",
        "Embotellado para mi marca",
        "Desarrollo desde cero"
      ],
      step2Opts: [
        "Lanzar una nueva marca",
        "Escalar producción actual",
        "Exportar",
        "Tener producto para retail/distribución",
        "Buscar mejor proveedor"
      ],
      step3Opts: [
        "Idea inicial",
        "Ya tengo marca o concepto",
        "Ya vendo actualmente",
        "Busco producción inmediata",
        "Estoy comparando proveedores"
      ],

      ctaTitle: "Recibe asesoría personalizada para tu proyecto",
      formName: "Nombre",
      formCompany: "Empresa",
      formPhone: "Teléfono",
      formEmail: "Correo",
      formSubmitBtn: "Enviar y Recibir Asesoría",
      formSubmitting: "Enviando...",

      successTitle: "¡Diagnóstico Enviado!",
      successDesc: "Muchas gracias por tu interés. Un especialista técnico se pondrá en contacto en menos de 24 horas.",
      resetQuizBtn: "Realizar otro diagnóstico",

      // Workflow Process
      processEyebrow: "METODOLOGÍA DE DESARROLLO",
      processTitle: "Ruta de Trabajo Ágil & Transparente",
      processSub: "Un flujo estructurado en 6 fases desde el primer contacto hasta el embarque final.",

      // Agave Section
      agaveEyebrow: "ORIGEN & SOSTENIBILIDAD",
      agaveTitle: "Agave Propio & Certeza de Abastecimiento",
      agaveSub: "La base de un gran tequila nace en el campo. Nuestro cultivo directo en Ayotlán garantiza continuidad y estabilidad de costos.",

      // Calendar Section
      calEyebrow: "CONSULTORÍA DIRECTA",
      calTitle: "Agenda una Videollamada Técnica de 30 Minutos",
      calSub: "Conversa directamente con nuestros ingenieros y maestros destiladores sobre la viabilidad y formulación de tu tequila.",

      // FAQ Section
      faqEyebrow: "PREGUNTAS FRECUENTES B2B",
      faqTitle: "Certeza Técnica & Comercial",
      faqSub: "Respuestas claras a las dudas más comunes de fundadores, marcas consolidadas y compradores a granel.",
      tabFounders: "Nuevas Marcas / Fundadores",
      tabExisting: "Marcas en Producción",
      tabBulk: "Compradores a Granel (Bulk)",

      // Final CTA
      finalCtaEyebrow: "¿LISTO PARA CREAR TU LEGADO?",
      finalCtaTitle: "Desarrolla tu Marca de Tequila con el Respaldo de Casa Loy",
      finalCtaDesc: "Infraestructura de 13.5M L, 3,600 Has. de agave propio y certificación oficial NOM 1633 para exportar al mundo.",
      finalCtaBtn1: "Iniciar Diagnóstico B2B",
      finalCtaBtn2: "Agendar Sesión Técnica"
    },
    en: {
      seoTitle: "Private Label Tequila & Bulk Distilling B2B | Casa Loy · NOM 1633",
      seoDesc: "Official NOM 1633 distillery in Los Altos de Jalisco. Full private label production, bulk tequila supply, 3,600 Has. estate agave, and 13.5M L annual capacity.",

      // Hero
      heroOvertitle: "DISTILLERY & B2B PRIVATE LABEL · NOM 1633",
      heroTitle: "100% Agave Tequila Private Label & Bottling",
      heroTitleItalic: "Infrastructure, CRT Certification & Global Export.",
      heroBtn: "Get B2B Quote",
      heroBtnSec: "Schedule Video Call",

      // Trust Bar
      trustNom: "NOM 1633 CRT",
      trustRegion: "Los Altos de Jalisco",
      trustGroup: "Grupo Orbe XXI (60+ Years)",
      trustAgave: "3,600 Has. Estate Agave (1992)",
      trustCapacity: "13.5M L / Year Capacity",
      trustControl: "Batch-by-Batch QA",
      trustFree: "100% Additive Free Verified",

      // Why Casa Loy
      whyEyebrow: "INFRASTRUCTURE & OPERATIONAL CERTAINTY",
      whyTitle: "Why Casa Loy for Your Tequila Project?",
      whySub: "Six industrial pillars safeguarding liquid quality, cost control, and uninterrupted delivery.",

      // Inside Casa Loy
      insideEyebrow: "FACILITIES & INDUSTRIAL CAPACITY",
      insideTitle: "Inside Casa Loy",
      insideSub: "Take an interactive journey through the 8 stations of our distillery in Ayotlán, Jalisco.",

      // Solutions
      solutionsEyebrow: "PRODUCTION ROUTES",
      solutionsTitle: "Solutions Scaled to Your Stage",
      solutionsSub: "Proven business structures for emerging spirits brands and high-volume international distributors.",

      // Stakes / Risks
      stakesEyebrow: "BUSINESS PROTECTION",
      stakesTitle: "Mitigating Real Production Risks",
      stakesSub: "Engineered operational solutions addressing critical bottlenecks in the global tequila supply chain.",

      // Quiz
      quizOvertitle: "Strategic 3-Question Quiz",
      quizTitle: "What type of project are you looking to develop?",
      quizDesc: "Complete this 3-question diagnostic to receive a proposal tailored to your needs and goals.",
      stepLabel: "Question",
      step1Title: "What solution do you currently need?",
      step2Title: "What is your main objective?",
      step3Title: "What stage is your project in?",

      step1Opts: [
        "Full private label tequila production",
        "Private label development (Private Label)",
        "Bulk tequila purchase",
        "Bottling for my brand",
        "Development from scratch"
      ],
      step2Opts: [
        "Launch a new brand",
        "Scale current production",
        "Export",
        "Have product for retail/distribution",
        "Find a better supplier"
      ],
      step3Opts: [
        "Initial idea",
        "Already have a brand or concept",
        "Currently selling",
        "Looking for immediate production",
        "Comparing suppliers"
      ],

      ctaTitle: "Receive personalized advisory for your project",
      formName: "Name",
      formCompany: "Company",
      formPhone: "Phone",
      formEmail: "Email",
      formSubmitBtn: "Submit and Receive Advisory",
      formSubmitting: "Submitting...",

      successTitle: "Diagnostic Sent!",
      successDesc: "Thank you for your interest. A technical specialist will get in touch in less than 24 hours.",
      resetQuizBtn: "Take quiz again",

      // Workflow Process
      processEyebrow: "DEVELOPMENT METHODOLOGY",
      processTitle: "Agile & Transparent Workflow",
      processSub: "A structured 6-phase journey from initial consultation to final customs dispatch.",

      // Agave Section
      agaveEyebrow: "ORIGIN & SUSTAINABILITY",
      agaveTitle: "Estate-Grown Agave & Supply Certainty",
      agaveSub: "Exceptional tequila starts in the field. Our direct cultivation in Ayotlán guarantees uninterrupted supply and long-term cost insulation.",

      // Calendar Section
      calEyebrow: "DIRECT CONSULTATION",
      calTitle: "Schedule a 30-Minute Technical Video Call",
      calSub: "Speak directly with our chemical engineers and master distillers about formulation, feasibility, and margins.",

      // FAQ Section
      faqEyebrow: "B2B FREQUENTLY ASKED QUESTIONS",
      faqTitle: "Technical & Commercial Certainty",
      faqSub: "Clear answers to common questions from startup founders, established brands, and bulk buyers.",
      tabFounders: "New Brands / Founders",
      tabExisting: "Active Producers",
      tabBulk: "Bulk Buyers",

      // Final CTA
      finalCtaEyebrow: "READY TO BUILD YOUR LEGACY?",
      finalCtaTitle: "Develop Your Tequila Brand with the Backing of Casa Loy",
      finalCtaDesc: "13.5M L capacity, 3,600 estate agave hectares, and official NOM 1633 certification to export globally.",
      finalCtaBtn1: "Start B2B Diagnostic",
      finalCtaBtn2: "Schedule Technical Session"
    }
  };

  const t = content[lang] || content.es;

  // Handle Diagnostic Quiz Submission to Supabase /api/maquila
  const handleNextStep = (field, value, nextStep) => {
    setQuizAnswers(prev => ({ ...prev, [field]: value }));
    setQuizStep(nextStep);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maquila", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          company: contactForm.company,
          email: contactForm.email,
          lada: contactForm.lada,
          phone: contactForm.phone,
          solution: quizAnswers.solution,
          objective: quizAnswers.objective,
          stage: quizAnswers.stage,
        }),
      });

      if (response.ok) {
        setQuizStep(5);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(
          lang === "es"
            ? `Error al enviar el formulario: ${errorData.error || "Error del servidor"}`
            : `Error submitting form: ${errorData.error || "Server error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting quiz form:", error);
      alert(
        lang === "es"
          ? "Ocurrió un problema de conexión al enviar tus respuestas. Por favor, intenta de nuevo."
          : "A connection problem occurred while sending your answers. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({ solution: "", objective: "", stage: "" });
    setContactForm({ name: "", company: "", lada: "", phone: "", email: "" });
    setQuizStep(1);
  };

  // 8 Stations of "Dentro de Casa Loy" Interactive Showcase
  const stations = [
    {
      num: "01",
      tag: lang === "es" ? "Recepción & Jima" : "Harvest & Intake",
      name: lang === "es" ? "Patio de Agave & Selección de Piñas" : "Agave Intake & Quality Selection",
      desc: lang === "es"
        ? "Recepción directa de nuestras 3,600 hectáreas en Los Altos de Jalisco. Selección de piñas en plenitud de maduración (6-7 años) con medición de grados Brix."
        : "Direct intake from our 3,600 hectares in Los Altos de Jalisco. Hand-selected agaves at peak maturity (6-7 years) tested for optimal natural Brix sugars.",
      specs: ["100% Tequilana Weber", "Los Altos de Jalisco", "Jima Madura"],
      img: "/Patio de Maniobras y Recepción de Agave Casa Loy.webp"
    },
    {
      num: "02",
      tag: lang === "es" ? "Cocimiento Dual" : "Cooking Process",
      name: lang === "es" ? "Hornos de Mampostería & Autoclaves" : "Traditional Brick Ovens & Autoclaves",
      desc: lang === "es"
        ? "Capacidad combinada de horneado: 240 toneladas en hornos tradicionales de mampostería para notas caramelizadas y 80 toneladas en autoclaves de acero inoxidable."
        : "Versatile cooking: 240 metric tons in traditional masonry ovens for rich caramelized notes and 80 tons in stainless steel pressure autoclaves.",
      specs: ["240t Hornos Mampostería", "80t Autoclaves", "Vapor Controlado"],
      img: "/Cocimiento de Agave.webp"
    },
    {
      num: "03",
      tag: lang === "es" ? "Extracción Noble" : "Noble Extraction",
      name: lang === "es" ? "Tahona Volcánica & Molinos" : "Volcanic Tahona & Roller Mills",
      desc: lang === "es"
        ? "Tahona ancestral de piedra volcánica (500k L/año) para destilados de autor y tren de molienda mecánico con extracción suave de azúcares."
        : "Ancestral volcanic stone tahona (500k L/yr) for ultra-premium batches and modern roller mills ensuring gentle sugar extraction.",
      specs: ["Tahona 500k L", "Piedra Volcánica", "Extracción Suave"],
      img: "/Tahona Agave Molienda.webp"
    },
    {
      num: "04",
      tag: lang === "es" ? "Fermentación Controlada" : "Fermentation",
      name: lang === "es" ? "Tinas de Fermentación Térmica" : "Stainless Fermentation Tanks",
      desc: lang === "es"
        ? "Tinas de acero inoxidable con control de temperatura automatizado y cepas de levadura exclusivas que garantizan perfiles aromáticos reproducibles."
        : "Stainless steel tanks with automated temperature jackets and proprietary yeast strains ensuring reproducible sensory signatures.",
      specs: ["Control Térmico", "Levaduras Propias", "Acero Inoxidable"],
      img: "/Fermentación.webp"
    },
    {
      num: "05",
      tag: lang === "es" ? "Destilación Dual" : "Distillation",
      name: lang === "es" ? "Alambiques de Cobre & Columnas" : "Copper Pot Stills & Columns",
      desc: lang === "es"
        ? "Alambiques tradicionales de cobre para cortes precisos de cabeza y cola, complementados con columnas continuas europeas de alta eficiencia."
        : "Traditional copper pot stills for precise cuts and author signatures, complemented with high-efficiency European continuous columns.",
      specs: ["Alambiques de Cobre", "Columnas Continuas", "13.5M L / Año"],
      img: "/Destilación.webp"
    },
    {
      num: "06",
      tag: lang === "es" ? "Maduración de Autor" : "Cask Aging",
      name: lang === "es" ? "Cava Subterránea de Barricas" : "Underground Barrel Cellar",
      desc: lang === "es"
        ? "Capacidad de 1.2 millones de litros en barricas de Roble Blanco Americano y Roble Francés bajo condiciones estables de humedad y temperatura."
        : "1.2 Million liters capacity in Virgin American White Oak and French Oak barrels maintained under constant cellar humidity and temperature.",
      specs: ["1.2M L Cava", "Roble Americano", "Roble Francés"],
      img: "/Pasillo Cava de Añejamiento.webp"
    },
    {
      num: "07",
      tag: lang === "es" ? "Control Analítico" : "Analytical Lab",
      name: lang === "es" ? "Tasting Lab & Cromatografía" : "In-House Tasting Lab & GC",
      desc: lang === "es"
        ? "Laboratorio propio equipado con cromatografía de gases, análisis fisicoquímico lote por lote y cabinas de cata profesional previa al embarque."
        : "In-house lab equipped with gas chromatography, physicochemical analysis for every single batch, and professional sensory booths.",
      specs: ["Cromatografía de Gases", "Reporte por Lote", "Panel Sensorial"],
      img: "/Laboratorio Maquilas.webp"
    },
    {
      num: "08",
      tag: lang === "es" ? "Acondicionamiento Final" : "Final Bottling",
      name: lang === "es" ? "Línea de Envasado & Inspección QA" : "Bottling Line & QA Light Tables",
      desc: lang === "es"
        ? "Llenado de precisión, colocación de tapón, etiquetado e inspección individual en mesa lumínica bajo normativas de exportación internacional."
        : "High-precision filling, corking, labeling, and bottle-by-bottle light table QA inspection compliant with international export standards.",
      specs: ["Mesa Lumínica QA", "Sellado de Exportación", "Co-Packing"],
      img: "/Enbotellado.webp"
    }
  ];

  // FAQ Categories for Dedicated FAQ Section
  const faqData = {
    founders: [
      {
        q: lang === "es" ? "¿Cómo comienzo mi propia marca de tequila desde cero?" : "How do I start my own private label tequila from scratch?",
        a: lang === "es" 
          ? "El proceso inicia definiendo tu perfil organoléptico (sabor), presupuesto y mercado objetivo. Casa Loy te guía paso a paso: formulación líquida, trámites oficiales ante el CRT e IMPI, proveeduría de botella, diseño de etiqueta y preparación para exportación."
          : "It starts with defining your target sensory profile, budget, and market destination. Casa Loy guides you end-to-end: formulation, official CRT and trademark registration, glass sourcing, labeling, and international export."
      },
      {
        q: lang === "es" ? "¿Quién es el dueño legal de la fórmula de mi tequila?" : "Who owns the legal formula of my tequila?",
        a: lang === "es"
          ? "Tú y tu empresa. Tu marca es la propietaria indiscutible de su perfil sensorial y receta. Firmamos convenios de confidencialidad (NDA) y acuerdos de propiedad intelectual desde el primer día."
          : "You do. Your brand owns 100% of its liquid formula and sensory profile. We sign strict Non-Disclosure Agreements (NDAs) and IP protection contracts prior to sample dispatch."
      },
      {
        q: lang === "es" ? "¿Puedo visitar las instalaciones de la destilería en Jalisco?" : "Can I visit the distillery facilities in Jalisco?",
        a: lang === "es"
          ? "Sí. Recibimos visitas técnicas y auditorías de proyectos formalizados para conocer los hornos, autoclaves, alambiques y el laboratorio en persona."
          : "Yes. We welcome technical inspections and project meetings to audit our ovens, autoclaves, pot stills, and testing lab in person."
      }
    ],
    existing: [
      {
        q: lang === "es" ? "¿Cómo garantizan no interrumpir mi inventario si cambio de maquila?" : "How do you ensure zero inventory disruption if I switch suppliers?",
        a: lang === "es"
          ? "Trazamos un cronograma de transición coordinado: analizamos químicamente tu destilado actual con cromatografía de gases para replicar su sabor exacto y producimos lotes de seguridad antes de transferir la marca ante el CRT."
          : "We establish a seamless transition schedule: our lab analyzes your current distillate via gas chromatography to replicate its exact chemical fingerprint and builds buffer inventory before transferring registration."
      },
      {
        q: lang === "es" ? "¿Pueden formular un perfil de autor totalmente exclusivo?" : "Can you formulate a completely exclusive liquid profile?",
        a: lang === "es"
          ? "Sí. Desarrollamos perfiles organolépticos blindados por contrato que no pueden ser replicados ni compartidos con ninguna otra marca."
          : "Yes. We engineer bespoke flavor profiles protected under exclusivity clauses that cannot be shared or sold to any other brand."
      }
    ],
    bulk: [
      {
        q: lang === "es" ? "¿Ofrecen tequila a granel con certificados de análisis por lote?" : "Do you supply bulk tequila with lot certificates of analysis?",
        a: lang === "es"
          ? "Sí. Suministramos Tequila 100% Agave y Mixto en autotanques (cisternas) y contenedores IBC totes de 1,000L con reporte fisicoquímico y cromatografía de gases oficial por cada despacho."
          : "Yes. We dispatch continuous 100% Agave and Mixto bulk tequila in dedicated tankers or 1,000L IBC totes accompanied by gas chromatography and CRT certificates for each shipment."
      },
      {
        q: lang === "es" ? "¿Qué respaldo normativo otorga la NOM 1633 de Casa Loy?" : "What regulatory guarantee does Casa Loy NOM 1633 provide?",
        a: lang === "es"
          ? "La NOM 1633 es nuestro registro oficial autorizado ante el Consejo Regulador del Tequila (CRT), garantizando autenticidad de origen, apego a la NOM-006-SCFI y certificación inmediata para exportación a EE.UU., Europa y Asia."
          : "NOM 1633 is our authorized registration with Mexico's CRT, certifying origin authenticity, NOM-006 compliance, and immediate export eligibility to the US, Europe, and Asia."
      }
    ]
  };

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18]">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url="/test1mbb"
      />

      {/* ============================================================
          §1. HERO BANNER ESTÁNDAR DEL SITIO (Idéntico a Maquilas / Turismo / Home)
          ============================================================ */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Maquila Tequila Production Casa Loy"
            className="w-full h-full object-cover brightness-[0.82]"
            src="/Naves Industriales Casa Loy Tequilera.webp"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28 animate-slide-left-right">
          <span className="font-navigation text-[clamp(11px,1vw,13px)] text-white uppercase tracking-[0.4em] mb-4 block font-semibold">
            {t.heroOvertitle}
          </span>
          <h1 className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10">
            {t.heroTitle} <br />
            <span className="text-white italic font-normal">{t.heroTitleItalic}</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <a
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center shadow-lg rounded-none"
              href="#quiz"
            >
              {t.heroBtn}
            </a>
            <a
              className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center rounded-none"
              href="#agenda-llamada"
            >
              {t.heroBtnSec}
            </a>
          </div>
        </div>

        {/* Elegant scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-70 pointer-events-none">
          <style>{`
            @keyframes scroll-arrow-down {
              0% { transform: translateY(-4px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(4px); opacity: 0; }
            }
            .animate-scroll-arrow {
              animation: scroll-arrow-down 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
            }
          `}</style>
          <svg 
            className="w-4 h-4 text-white/70 animate-scroll-arrow" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* TRUST BAR (Franja ejecutiva en tonos cálidos ivory idéntica a Home) */}
      <div className="bg-[#F6F2EA] border-y border-[#1c1c18]/10 py-4.5 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-2.5 gap-x-5 text-center">
            <span className="font-navigation text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C4723]">{t.trustNom}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c18]">{t.trustRegion}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c18]">{t.trustGroup}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c18]">{t.trustAgave}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c18]">{t.trustCapacity}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c18]">{t.trustControl}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">{t.trustFree}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          §2. POR QUÉ CASA LOY (Diseño alineado al resto del sitio)
          ============================================================ */}
      <section className="py-20 md:py-32 bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.whyEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.whyTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.whySub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">01</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Terruño de Origen" : "Highlands Terroir"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">NOM 1633, Los Altos</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "Ayotlán a más de 2,000 msnm con suelos rojos volcánicos ricos en hierro y microclima con oscilación térmica ideal." : "Ayotlán above 2,000m elevation with red volcanic soil and optimal thermal day/night swing."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">02</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Respaldo Industrial" : "Industrial Group"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">Grupo Orbe XXI (60+ {lang === "es" ? "Años" : "Years"})</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "Consorcio agroindustrial con más de 2,900 colaboradores y empresas líderes hermanas como TeknoAgrox y Nutriagaves." : "Multinational consortium with 2,900+ employees and sister agro-tech leaders TeknoAgrox and Nutriagaves."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">03</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Reserva Propia" : "Estate Reserve"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">3,600 Has. {lang === "es" ? "de Agave" : "Estate Agave"}</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "10.8 millones de plantas propias cultivadas desde 1992 que blindan tu costo por litro contra la especulación spot." : "10.8 million estate agaves since 1992 insulating your brand margins against open spot agave speculation."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">04</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Trato Técnico Directo" : "Direct Engineering"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">{lang === "es" ? "Sin Intermediarios" : "No Middlemen Brokers"}</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "Comunicación directa con maestros destiladores, ingenieros químicos y coordinadores de aduanas y exportación." : "Direct work sessions with master distillers, laboratory chemists, and export compliance specialists."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">05</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Escala & Flexibilidad" : "Scale & Versatility"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">13.5M {lang === "es" ? "Litros / Año" : "Liters / Year"}</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "Hornos de mampostería (240t), autoclaves (80t), tahona volcánica, alambiques de cobre y columnas continuas." : "Traditional brick ovens (240t), autoclaves (80t), volcanic tahona, copper pot stills, and continuous columns."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={600}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <span className="font-serif text-3xl font-light text-primary block mb-2">06</span>
                  <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-[0.25em] font-semibold block mb-2">
                    {lang === "es" ? "Control Químico" : "Batch Traceability"}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1c18] mb-2">{lang === "es" ? "Cromatografía de Gases" : "Gas Chromatography QA"}</h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                    {lang === "es" ? "Tasting Lab in-house con validación analítica lote a lote y sellos internacionales: USDA, Kosher y Additive Free." : "In-house lab with batch-by-batch chromatographic reports and USDA, Kosher, and Additive Free certifications."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §3. DENTRO DE CASA LOY (Estética cálida y armónica)
          ============================================================ */}
      <section className="py-20 md:py-32 bg-[#F6F2EA] border-y border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          {/* Header */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div>
                <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                  {t.insideEyebrow}
                </span>
                <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight">
                  {t.insideTitle}
                </h2>
              </div>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed max-w-md text-[clamp(15px,1.1vw,17px)]">
                {t.insideSub}
              </p>
            </div>
          </Reveal>

          {/* Interactive Cinema Viewer */}
          <Reveal delay={150}>
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] rounded-none overflow-hidden border border-[#1c1c18]/15 shadow-md bg-black group mb-6">
              <img
                key={stations[activeStation].img}
                src={stations[activeStation].img}
                alt={stations[activeStation].name}
                className="w-full h-full object-cover brightness-[0.72] transition-all duration-700 ease-out scale-100 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>

              {/* Overlaid Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-navigation text-[10px] text-white uppercase tracking-[0.25em] bg-[#8C4723] px-3 py-1 font-semibold inline-block rounded-none">
                    {stations[activeStation].num} · {stations[activeStation].tag}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
                    {stations[activeStation].name}
                  </h3>
                  <p className="font-body-md text-white/90 leading-relaxed font-light text-sm sm:text-base">
                    {stations[activeStation].desc}
                  </p>
                </div>

                {/* Specs Pills */}
                <div className="flex flex-wrap sm:flex-col gap-2 sm:items-end">
                  {stations[activeStation].specs.map((spec, sIdx) => (
                    <span key={sIdx} className="font-navigation text-[10px] uppercase tracking-wider text-white bg-white/15 backdrop-blur-md px-3 py-1 border border-white/20 rounded-none">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Station Selectors (8 Sharp Buttons matching site buttons) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stations.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStation(idx)}
                className={`text-left p-3.5 border transition-all rounded-none cursor-pointer ${
                  activeStation === idx
                    ? "bg-[#8C4723] border-[#8C4723] text-white shadow-sm"
                    : "bg-white border-[#1c1c18]/10 hover:border-[#8C4723] text-[#53443a] hover:text-[#1c1c18]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-navigation text-[10px] font-bold ${activeStation === idx ? "text-[#ffdbc7]" : "text-primary"}`}>
                    {s.num}
                  </span>
                  {activeStation === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#ffdbc7] animate-pulse"></span>}
                </div>
                <div className="font-serif text-sm font-light truncate">{s.tag}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §4. RUTAS DE PRODUCCIÓN (3 Columnas Alineadas a Capabilities)
          ============================================================ */}
      <section className="py-20 md:py-32 bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.solutionsEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.solutionsTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.solutionsSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 01 Marca Privada Integral */}
            <Reveal delay={100}>
              <div className="p-8 sm:p-10 border border-[#1c1c18]/10 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-lg rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-serif text-2xl font-light">01</span>
                    <span className="font-navigation text-[10px] text-primary bg-[#F6F2EA] px-2.5 py-1 border border-[#1c1c18]/10 uppercase tracking-widest rounded-none font-semibold">
                      {lang === "es" ? "Llave en Mano" : "Turnkey 360°"}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1c1c18] mb-3">
                    {lang === "es" ? "Marca Privada Integral" : "Turnkey Private Label"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-6 text-sm">
                    {lang === "es" 
                      ? "Desarrollo completo desde cero: asesoría jurídica ante el CRT, registro de marca, formulación líquida, proveeduría de botella, etiquetado y preparación para exportación aduanal."
                      : "Comprehensive brand creation from ground zero: official CRT registry compliance, sensory liquid formulation, bottle sourcing, labeling, and international customs clearance."}
                  </p>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#1c1c18]/10">
                  <ul className="space-y-2 text-xs font-navigation text-[#53443a]">
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "100% Tequilana Weber propio" : "100% Weber blue estate agave"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Acompañamiento legal CRT e IMPI" : "CRT & TTB regulatory guidance"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Lotes mínimos optimizados" : "Optimized MOQs for export"}</li>
                  </ul>
                  <a
                    href="#quiz"
                    className="w-full block bg-transparent border border-[#8C4723] hover:bg-[#8C4723] hover:text-white text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-3 text-center transition-all duration-500 rounded-none mt-4"
                  >
                    {lang === "es" ? "Cotizar Marca Privada" : "Quote Private Label"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* 02 Tequila a Granel (Bulk) */}
            <Reveal delay={200}>
              <div className="p-8 sm:p-10 border-2 border-[#8C4723] bg-white flex flex-col justify-between transition-all duration-500 hover:shadow-xl rounded-none relative h-full">
                <span className="absolute -top-3 right-6 bg-[#8C4723] text-white font-navigation text-[9px] uppercase tracking-[0.25em] px-3 py-1 font-semibold rounded-none shadow-sm">
                  {lang === "es" ? "Suministro Continuo" : "Bulk Tankers"}
                </span>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-serif text-2xl font-light">02</span>
                    <span className="font-navigation text-[10px] text-primary bg-[#F6F2EA] px-2.5 py-1 border border-[#1c1c18]/10 uppercase tracking-widest rounded-none font-semibold">
                      {lang === "es" ? "Gran Volumen" : "High Volume"}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1c1c18] mb-3">
                    {lang === "es" ? "Tequila a Granel (Bulk)" : "Bulk Tequila Supply"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-6 text-sm">
                    {lang === "es"
                      ? "Abastecimiento constante de Tequila 100% Agave o Mixto despachado en autotanques certificados o contenedores IBC totes para importadores, envasadoras globales y distribuidores."
                      : "Steady bulk supply of 100% Agave or Mixto shipped in dedicated road tankers or 1,000L IBC totes for international bottlers, global importers, and distributors."}
                  </p>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#1c1c18]/10">
                  <ul className="space-y-2 text-xs font-navigation text-[#53443a]">
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Reporte cromatográfico por autotanque" : "Gas chromatography report per tanker"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Blindaje de precio por cosecha propia" : "Price stability tied to estate agave"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Contratos plurianuales de abasto" : "Multi-year continuous supply contracts"}</li>
                  </ul>
                  <a
                    href="#agenda-llamada"
                    className="w-full block bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-3 text-center transition-all duration-500 rounded-none shadow-sm mt-4"
                  >
                    {lang === "es" ? "Cotizar Suministro a Granel" : "Quote Bulk Supply"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* 03 Envasado & Co-packing */}
            <Reveal delay={300}>
              <div className="p-8 sm:p-10 border border-[#1c1c18]/10 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-lg rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-serif text-2xl font-light">03</span>
                    <span className="font-navigation text-[10px] text-primary bg-[#F6F2EA] px-2.5 py-1 border border-[#1c1c18]/10 uppercase tracking-widest rounded-none font-semibold">
                      {lang === "es" ? "Acondicionamiento" : "Packaging QA"}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1c1c18] mb-3">
                    {lang === "es" ? "Envasado & Co-Packing" : "Co-Packing & Bottling"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-6 text-sm">
                    {lang === "es"
                      ? "Línea de envasado de alta precisión: llenado volumétrico, colocación de corcho o tapón irrellenable, etiquetado de exportación e inspección en mesa lumínica botella por botella."
                      : "High-precision automated packaging: volumetric filling, tamper-evident corking, luxury labeling, and bottle-by-bottle light table quality inspection."}
                  </p>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#1c1c18]/10">
                  <ul className="space-y-2 text-xs font-navigation text-[#53443a]">
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Inspección lumínica 100% de botellas" : "100% Light-table bottle inspection"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Sellos de seguridad y marbetes CRT" : "Official CRT export tax stamps"}</li>
                    <li className="flex items-center gap-2.5"><span className="text-primary font-bold">✓</span> {lang === "es" ? "Para marcas nuevas o existentes" : "For emerging or established brands"}</li>
                  </ul>
                  <a
                    href="#quiz"
                    className="w-full block bg-transparent border border-[#8C4723] hover:bg-[#8C4723] hover:text-white text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-3 text-center transition-all duration-500 rounded-none mt-4"
                  >
                    {lang === "es" ? "Solicitar Embotellado" : "Request Bottling"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5. MITIGACIÓN DE RIESGOS (Alineado al resto del sitio)
          ============================================================ */}
      <section className="py-20 md:py-32 bg-[#F6F2EA] border-y border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.stakesEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.stakesTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.stakesSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal delay={100}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 rounded-none space-y-3 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-3xl font-light text-primary block">01</span>
                <h3 className="font-serif text-xl font-light text-[#1c1c18]">{lang === "es" ? "Empezar desde cero" : "Starting from zero"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                  {lang === "es" ? "Acompañamiento normativo ante el CRT e IMPI para evitar retrasos costosos en registro de marca y aprobación de etiquetas." : "Technical guidance on CRT and trademark registration preventing costly regulatory delays."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 rounded-none space-y-3 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-3xl font-light text-primary block">02</span>
                <h3 className="font-serif text-xl font-light text-[#1c1c18]">{lang === "es" ? "Cambiar de productor" : "Switching producer"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                  {lang === "es" ? "Replicamos el perfil químico de tu tequila actual con cromatografía in-house y producimos lotes de seguridad sin quiebres de stock." : "Zero stockouts: we chemically replicate your current liquid profile and maintain buffer inventory."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 rounded-none space-y-3 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-3xl font-light text-primary block">03</span>
                <h3 className="font-serif text-xl font-light text-[#1c1c18]">{lang === "es" ? "Escalar volumen" : "Scaling volume"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                  {lang === "es" ? "13.5M L de capacidad y 10.8M de agaves propios garantizan escalar de miles a millones de litros sin alzas de costo imprevistas." : "13.5M L capacity and 10.8M estate plants ensure scaling smoothly without surprise price spikes."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="p-8 bg-white border border-[#1c1c18]/10 rounded-none space-y-3 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-3xl font-light text-primary block">04</span>
                <h3 className="font-serif text-xl font-light text-[#1c1c18]">{lang === "es" ? "Exportación global" : "Global export"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-sm">
                  {lang === "es" ? "Certificados de exportación CRT, fórmulas aprobadas ante el TTB de EE.UU. y documentación fitosanitaria para más de 20 países." : "CRT export certificates, US TTB formula approvals, and phytosanitary clearance for 20+ countries."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §6. QUIZ OFICIAL DE MARCA PRIVADA (Exactamente como Maquilas.jsx)
          ============================================================ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#1C1A19] text-white" id="quiz">
        <div className="absolute inset-0 z-0">
          <img
            alt="Agave Hearts Background"
            className="w-full h-full object-cover brightness-[0.45] opacity-55"
            src="/Piñas de Agave Tequilana Weber.webp"
          />
        </div>
        <div className="relative z-10 px-6 max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-5 text-left space-y-8 animate-fade-in">
              <span className="font-navigation text-primary-fixed mb-4 block tracking-widest uppercase text-xs font-bold">
                {t.quizOvertitle}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white font-light">
                {t.quizTitle}
              </h2>
              <p className="font-body-lg text-white/80 leading-relaxed font-light text-sm md:text-base">
                {t.quizDesc}
              </p>
              <div className="flex items-center gap-4 text-primary-fixed">
                <span className="material-symbols-outlined text-4xl">analytics</span>
                <div className="h-[1px] w-24 bg-primary-fixed/30"></div>
              </div>
            </div>

            {/* Glassmorphic Quiz Controller */}
            <div className="lg:col-span-7 p-6 md:p-10 bg-white/15 backdrop-blur-3xl border border-white/20 rounded-none shadow-2xl transition-all duration-300 w-full">
              {quizStep === 1 && (
                <div className="space-y-4 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 01 / 03
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 text-white select-none font-light">
                    {t.step1Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {t.step1Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("solution", opt, 2)}
                          className={`w-full text-left p-4 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
                          </div>
                          <span className="material-symbols-outlined text-sm text-primary group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            arrow_forward
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-4 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 02 / 03
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 text-white select-none font-light">
                    {t.step2Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {t.step2Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("objective", opt, 3)}
                          className={`w-full text-left p-4 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
                          </div>
                          <span className="material-symbols-outlined text-sm text-primary group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            arrow_forward
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-4 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 03 / 03
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl mb-6 text-white select-none font-light">
                    {t.step3Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {t.step3Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("stage", opt, 4)}
                          className={`w-full text-left p-4 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
                          </div>
                          <span className="material-symbols-outlined text-sm text-primary group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            arrow_forward
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <form onSubmit={handleFormSubmit} className="space-y-5 text-left animate-fade-in">
                  <h3 className="font-serif text-xl md:text-2xl mb-4 text-white select-none font-light">
                    {t.ctaTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2.5 font-body-md placeholder:text-white/60 focus:outline-none text-white text-sm"
                        placeholder={t.formName}
                      />
                    </div>
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2.5 font-body-md placeholder:text-white/60 focus:outline-none text-white text-sm"
                        placeholder={t.formCompany}
                      />
                    </div>
                    <div className="flex gap-2 items-end border-b border-white/35 focus-within:border-primary transition-all duration-300 pb-0.5">
                      <span className="text-white/40 text-sm select-none pb-2 font-body-md">+</span>
                      <input
                        required
                        type="text"
                        maxLength="4"
                        value={contactForm.lada}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setContactForm({ ...contactForm, lada: val });
                        }}
                        className="w-14 border-0 focus:ring-0 bg-transparent py-2.5 font-body-md placeholder:text-white/60 focus:outline-none text-white text-sm text-center"
                        placeholder="52"
                      />
                      <input
                        required
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2.5 font-body-md placeholder:text-white/60 focus:outline-none text-white text-sm"
                        placeholder={t.formPhone}
                      />
                    </div>
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2.5 font-body-md placeholder:text-white/60 focus:outline-none text-white text-sm"
                        placeholder={t.formEmail}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 py-3.5 bg-[#8C4723] border border-[#8C4723] text-white font-navigation uppercase tracking-[0.25em] text-xs transition-all hover:bg-[#a6562b] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 rounded-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t.formSubmitting}</span>
                      </>
                    ) : (
                      t.formSubmitBtn
                    )}
                  </button>
                </form>
              )}

              {quizStep === 5 && (
                <div className="text-center py-6 space-y-5 animate-fade-in">
                  <span className="material-symbols-outlined text-5xl text-[#FDA377] mb-1 animate-bounce">
                    verified
                  </span>
                  <h3 className="font-serif text-2xl mb-3 text-white font-light">{t.successTitle}</h3>
                  <p className="font-body-md text-white/70 max-w-md mx-auto text-sm leading-relaxed font-light">
                    {t.successDesc}
                  </p>
                  <button
                    onClick={handleResetQuiz}
                    className="text-[#FDA377] font-navigation border-b border-[#FDA377] pb-0.5 hover:text-white hover:border-white transition-all mt-6 text-xs cursor-pointer uppercase tracking-wider"
                  >
                    {t.resetQuizBtn}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §7. RUTA DE TRABAJO (Alineado al sitio)
          ============================================================ */}
      <section className="py-20 md:py-32 bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.processEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.processTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.processSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                num: "01",
                title: lang === "es" ? "Diagnóstico" : "Diagnosis",
                desc: lang === "es" ? "Análisis de volúmenes, mercado meta y especificaciones técnicas de producto." : "Commercial targets, volume projections, and product specs analysis."
              },
              {
                num: "02",
                title: lang === "es" ? "Sesión Técnica" : "Tech Call",
                desc: lang === "es" ? "Videollamada de 30 minutos con ingenieros para validar viabilidad y costeo." : "30-min session with distillery engineers reviewing feasibility & cost/liter."
              },
              {
                num: "03",
                title: lang === "es" ? "Tasting Lab" : "Lab Samples",
                desc: lang === "es" ? "Envío de muestras sensoriales en tasting lab hasta aprobar tu perfil exclusivo." : "Sensory formulations dispatched until exact signature is achieved."
              },
              {
                num: "04",
                title: lang === "es" ? "Registro CRT" : "CRT Compliance",
                desc: lang === "es" ? "Trámites oficiales ante el CRT, registro de co-producción y aprobación de etiquetas." : "Official registration with CRT, label approvals, and customs filings."
              },
              {
                num: "05",
                title: lang === "es" ? "Destilación & QA" : "Production & QA",
                desc: lang === "es" ? "Destilación a escala, cromatografía de gases lote a lote y envasado final." : "Scale distilling, batch gas chromatography reports, and precision packaging."
              },
              {
                num: "06",
                title: lang === "es" ? "Exportación" : "Global Dispatch",
                desc: lang === "es" ? "Acompañamiento logístico aduanal y certificados fitosanitarios internacionales." : "Phytosanitary certification, freight coordination, and customs clearance."
              }
            ].map((step, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="p-6 bg-white border border-[#1c1c18]/10 rounded-none space-y-2.5 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-sm h-full">
                  <div className="font-navigation text-[10px] text-primary uppercase tracking-[0.25em] font-semibold">FASE {step.num}</div>
                  <h3 className="font-serif text-lg font-light text-[#1c1c18]">{step.title}</h3>
                  <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §8. AGAVE & ABASTECIMIENTO (Alineado al sitio)
          ============================================================ */}
      <section ref={agaveRef} className="py-20 md:py-32 bg-[#F6F2EA] border-y border-[#1c1c18]/10 relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 text-left relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Photography */}
            <div className="lg:col-span-6 relative overflow-hidden rounded-none border border-[#1c1c18]/10 shadow-md">
              <img
                src="/Jimado Agave Tequilana Weber.webp"
                alt="Agave Fields in Ayotlán Casa Loy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-[#1c1c18]/80 backdrop-blur-md px-3 py-1.5 border border-white/20 rounded-none">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-navigation text-[10px] uppercase tracking-wider text-white font-semibold">
                    Ayotlán, Los Altos de Jalisco
                  </span>
                </div>
                <span className="font-serif text-sm text-primary-fixed italic bg-[#1c1c18]/80 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-none">
                  100% Tequilana Weber
                </span>
              </div>
            </div>

            {/* Narrative & Metrics */}
            <div className="lg:col-span-6 space-y-6">
              <Reveal>
                <div>
                  <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                    {t.agaveEyebrow}
                  </span>
                  <h2 className="font-serif text-[clamp(28px,3.5vw,46px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                    {t.agaveTitle}
                  </h2>
                  <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                    {t.agaveSub}
                  </p>
                </div>
              </Reveal>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-6 bg-white border border-[#1c1c18]/10 rounded-none text-center shadow-sm">
                  <div className="font-serif text-3xl md:text-4xl text-primary font-light">
                    +{counters.msnm.toLocaleString()}
                  </div>
                  <div className="font-navigation text-[10px] uppercase text-[#53443a] font-semibold mt-1">msnm Altura</div>
                </div>
                <div className="p-6 bg-white border border-[#1c1c18]/10 rounded-none text-center shadow-sm">
                  <div className="font-serif text-3xl md:text-4xl text-primary font-light">
                    {counters.has.toLocaleString()}
                  </div>
                  <div className="font-navigation text-[10px] uppercase text-[#53443a] font-semibold mt-1">Hectáreas Propias</div>
                </div>
                <div className="p-6 bg-white border border-[#1c1c18]/10 rounded-none text-center shadow-sm">
                  <div className="font-serif text-3xl md:text-4xl text-primary font-light">
                    {counters.plants.toFixed(1)}M
                  </div>
                  <div className="font-navigation text-[10px] uppercase text-[#53443a] font-semibold mt-1">Plantas de Agave</div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="border-l-2 border-[#8C4723] pl-4 py-1">
                  <h4 className="font-serif text-xl font-light text-[#1c1c18]">
                    {lang === "es" ? "Blindaje de Costo por Litro a Largo Plazo" : "Long-Term Cost Protection"}
                  </h4>
                  <p className="font-body-md text-[#53443a] text-sm mt-1 leading-relaxed font-light">
                    {lang === "es"
                      ? "Nuestras 3,600 hectáreas sembradas desde 1992 protegen tu marca contra los ciclos de escasez y encarecimiento del agave en el mercado libre."
                      : "Our estate hectares planted since 1992 protect your brand margins against open spot agave speculation and shortages."}
                  </p>
                </div>
                <div className="border-l-2 border-[#8C4723] pl-4 py-1">
                  <h4 className="font-serif text-xl font-light text-[#1c1c18]">
                    {lang === "es" ? "Maduración Óptima & Azúcares Reductores" : "Optimal Maturation & Sugar Yield"}
                  </h4>
                  <p className="font-body-md text-[#53443a] text-sm mt-1 leading-relaxed font-light">
                    {lang === "es"
                      ? "Jima programada únicamente de piñas en plenitud de maduración (6 a 7 años), garantizando altos grados Brix naturales sin saborizantes artificiales."
                      : "Harvesting only fully mature agaves (6 to 7 years) ensuring high natural Brix grades compliant with additive-free standards."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §9. CALENDARIO DE CITAS TÉCNICAS (Sección propia arriba de FAQs)
          ============================================================ */}
      <section id="agenda-llamada" className="py-20 md:py-32 bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.calEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.calTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.calSub}
              </p>
            </div>
          </Reveal>

          {/* Cal.com Clean Embed Card */}
          <Reveal delay={150}>
            <div className="w-full max-w-4xl bg-white border border-[#1c1c18]/10 p-6 md:p-10 shadow-sm rounded-none">
              <div className="mb-4 border-b border-[#1c1c18]/10 pb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xl font-light text-[#1c1c18]">
                    {lang === "es" ? "Calendario Oficial de Citas Técnicas" : "Technical Consultation Calendar"}
                  </h4>
                  <p className="font-navigation text-xs text-[#53443a] font-light mt-0.5">
                    {lang === "es" ? "Selecciona el día y horario disponible para tu videollamada de 30 minutos." : "Select available date & time for your 30-minute Google Meet session."}
                  </p>
                </div>
                <span className="font-navigation text-[10px] text-primary font-bold uppercase bg-[#F6F2EA] px-3 py-1 border border-[#1c1c18]/10 rounded-none tracking-wider">
                  30 Minutos
                </span>
              </div>

              <div id="cal-inline-v3-scheduler" className="w-full h-[520px] sm:h-[560px]"></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          §10. PREGUNTAS FRECUENTES B2B (Estilo idéntico a Turismo / FAQ)
          ============================================================ */}
      <section id="faqs-b2b" className="py-20 md:py-32 bg-[#FAF6F0] border-t border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-3">
                {t.faqEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-4">
                {t.faqTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,17px)]">
                {t.faqSub}
              </p>
            </div>
          </Reveal>

          {/* FAQ Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8 border-b border-[#1c1c18]/10 pb-3">
            {[
              { key: "founders", label: t.tabFounders },
              { key: "existing", label: t.tabExisting },
              { key: "bulk", label: t.tabBulk }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFaqTab(tab.key);
                  setOpenFaqIdx(0);
                }}
                className={`font-navigation text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 transition-all cursor-pointer rounded-none ${
                  activeFaqTab === tab.key
                    ? "bg-[#8C4723] text-white font-semibold shadow-sm"
                    : "bg-white border border-[#1c1c18]/10 text-[#53443a] hover:border-[#8C4723] hover:text-[#1c1c18]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Questions Accordion */}
          <div className="space-y-2 max-w-4xl">
            {faqData[activeFaqTab].map((item, idx) => (
              <div
                key={idx}
                className="border-b border-[#1c1c18]/10 py-4 transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left font-serif text-lg md:text-xl font-light text-[#1c1c18] hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <span className="text-primary text-2xl font-light">
                    {openFaqIdx === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaqIdx === idx && (
                  <p className="font-navigation text-sm text-[#53443a] leading-relaxed font-light mt-3 pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* NDA Guarantee Bar */}
          <div className="mt-12 p-6 bg-white border border-[#1c1c18]/10 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl text-xs font-navigation shadow-sm">
            <span className="flex items-center gap-2 text-[#1c1c18]">
              <span className="text-emerald-700 font-bold">✓</span> {lang === "es" ? "Convenio de Confidencialidad (NDA) disponible para todo proyecto" : "Strict Non-Disclosure Agreement (NDA) available for every project"}
            </span>
            <span className="text-primary font-bold tracking-widest">NOM 1633 CRT</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          §11. FINAL EDITORIAL CALL TO ACTION (Estándar de Home / Maquilas)
          ============================================================ */}
      <section className="bg-[#F6F2EA] py-24 md:py-32 px-6 border-t border-[#1c1c18]/10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block">
            {t.finalCtaEyebrow}
          </span>
          <h2 className="font-serif text-[clamp(28px,3.8vw,52px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight">
            {t.finalCtaTitle}
          </h2>
          <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-[clamp(15px,1.1vw,18px)] max-w-2xl mx-auto">
            {t.finalCtaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center pt-4">
            <a
              href="#quiz"
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center shadow-md rounded-none"
            >
              {t.finalCtaBtn1}
            </a>
            <a
              href="#agenda-llamada"
              className="border border-[#8C4723] text-[#8C4723] hover:bg-[#8C4723] hover:text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center rounded-none"
            >
              {t.finalCtaBtn2}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
