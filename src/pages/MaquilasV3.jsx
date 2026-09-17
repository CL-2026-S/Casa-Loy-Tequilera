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
  const [quizAnswers, setQuizAnswers] = useState({ profile: "", solution: "", objective: "", stage: "" });
  const [contactForm, setContactForm] = useState({ name: "", company: "", lada: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Station State for "Dentro de Casa Loy" Interactive Showcase
  const [activeStation, setActiveStation] = useState(0);
  const [activeStationImage, setActiveStationImage] = useState(0);

  // Hero Background Carousel State
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const heroImages = [
    "/Naves Industriales Casa Loy Tequilera.webp",
    "/Linea Embotellado Tanque Envasado Casa Loy.jpg",
    "/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIdx(prev => (prev + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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
      heroTitleLine1: "Maquila de Tequila",
      heroTitleLine2: "y Marca Privada en México.",
      heroSubLine1: "Tu tequila nace en",
      heroSubLine2: "Los Altos de Jalisco",
      heroQuote: '"Tu visión. Nuestra experiencia."',
      heroDesc: "Destilería familiar NOM 1633 construida para fundadores, marcas existentes y distribuidores listos para crear con un verdadero origen detrás.",
      heroBtn: "Iniciar Mi Proyecto →",
      heroBtnSec: "Agendar Llamada Técnica",
      
      // Trust Bar
      trustNom: "NOM 1633",
      trustRegion: "LOS ALTOS DE JALISCO",
      trustFamily: "FAMILY-OWNED",
      trustRoots: "AGAVE ROOTS SINCE 1992",
      trustBatch: "BATCH CONTROL",
      trustExport: "EXPORT COORDINATION",

      // Why Casa Loy
      whyEyebrow: "INFRAESTRUCTURA & CERTEZA OPERATIVA",
      whyTitle: "¿Por qué Casa Loy para tu Proyecto?",
      whySub: "Seis pilares que blindan la calidad, el costo y la entrega continua de tu destilado.",

      // Inside Casa Loy
      insideEyebrow: "INSTALACIONES & CAPACIDAD INDUSTRIAL",
      insideTitle: "Dentro de Casa Loy",
      insideSub: "Recorre interactivamente las 8 estaciones de nuestra destilería en Ayotlán, Jalisco.",

      // Solutions
      solutionsEyebrow: "SOLUCIONES",
      solutionsTitle: "Adaptadas a tu Escala",
      solutionsSub: "Modelos de negocio estructurados para marcas de tequila en crecimiento y distribuidores de alto volumen.",

      // Stakes / Risks
      stakesEyebrow: "BLINDAJE DE NEGOCIO",
      stakesTitle: "Mitigación de Riesgos Reales",
      stakesSub: "Respuestas operativas ante los retos más críticos de la industria del tequila.",

      // Quiz
      quizOvertitle: "Diagnóstico Estratégico B2B",
      quizTitle: "¿Qué tipo de proyecto buscas desarrollar?",
      quizDesc: "Completa este diagnóstico confidencial para recibir una propuesta técnica y económica adaptada a tus objetivos.",
      stepLabel: "Paso",
      ndaText: "Convenio de Confidencialidad (NDA) disponible para todo proyecto",
      step0Title: "Encuentra la ruta correcta para tu proyecto",
      step0Opts: [
        { title: "Founders", desc: "Construyendo una marca de tequila desde cero" },
        { title: "Existing Brands", desc: "Buscando un mejor socio de producción y maquila" },
        { title: "Distributors / Importers", desc: "Incursionando en tequila como nueva categoría" },
        { title: "Bulk Buyers", desc: "Abastecimiento de volumen continuo con perfil definido" }
      ],
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
      processSub: "Un flujo continuo de 7 fases desde la concepción del perfil hasta el soporte post-venta ágil.",

      // Sustentabilidad & Certificaciones
      sustainabilityEyebrow: "RESPONSABILIDAD & CUMPLIMIENTO GLOBAL",
      sustainabilityTitle: "Sustentabilidad Integral & Certificaciones Oficiales",
      sustainabilitySub: "Infraestructura circular para inversionistas internacionales con enfoque en energía limpia, composta y certificaciones oficiales.",

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
      heroTitleLine1: "Private Label Tequila",
      heroTitleLine2: "Manufacturing in México.",
      heroSubLine1: "Tu tequila nace en",
      heroSubLine2: "Los Altos de Jalisco",
      heroQuote: '"Your vision. Our expertise."',
      heroDesc: "A family-owned NOM 1633 distillery built for founders, existing brands, and distributors ready to build with a real origin behind them.",
      heroBtn: "Start My Project →",
      heroBtnSec: "Book a Technical Call",

      // Trust Bar
      trustNom: "NOM 1633",
      trustRegion: "LOS ALTOS DE JALISCO",
      trustFamily: "FAMILY-OWNED",
      trustRoots: "AGAVE ROOTS SINCE 1992",
      trustBatch: "BATCH CONTROL",
      trustExport: "EXPORT COORDINATION",

      // Why Casa Loy
      whyEyebrow: "INFRASTRUCTURE & OPERATIONAL CERTAINTY",
      whyTitle: "Why Casa Loy for Your Tequila Project?",
      whySub: "Six pillars safeguarding liquid quality, cost control, and uninterrupted delivery.",

      // Inside Casa Loy
      insideEyebrow: "FACILITIES & INDUSTRIAL CAPACITY",
      insideTitle: "Inside Casa Loy",
      insideSub: "Take an interactive journey through the 8 stations of our distillery in Ayotlán, Jalisco.",

      // Solutions
      solutionsEyebrow: "SOLUTIONS",
      solutionsTitle: "Scaled to Your Stage",
      solutionsSub: "Proven business structures for emerging spirits brands and high-volume international distributors.",

      // Stakes / Risks
      stakesEyebrow: "BUSINESS PROTECTION",
      stakesTitle: "Mitigating Real Production Risks",
      stakesSub: "Engineered operational solutions addressing critical bottlenecks in the global tequila supply chain.",

      // Quiz
      quizOvertitle: "B2B Strategic Diagnostic",
      quizTitle: "What type of project are you looking to develop?",
      quizDesc: "Complete this confidential diagnostic to receive a technical and economic proposal tailored to your goals.",
      stepLabel: "Step",
      ndaText: "Strict Non-Disclosure Agreement (NDA) available for every project",
      step0Title: "Find the right path for your project",
      step0Opts: [
        { title: "Founders", desc: "Building a tequila brand from the ground up" },
        { title: "Existing Brands", desc: "Looking for a better production and contract distilling partner" },
        { title: "Distributors / Importers", desc: "Entering tequila as a new category" },
        { title: "Bulk Buyers", desc: "Sourcing steady volume at defined sensory profile" }
      ],
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
      processSub: "A structured 7-phase journey from initial consultation to agile post-sales support.",

      // Sustainability & Certifications
      sustainabilityEyebrow: "RESPONSIBILITY & GLOBAL COMPLIANCE",
      sustainabilityTitle: "Comprehensive Sustainability & Official Certifications",
      sustainabilitySub: "Circular infrastructure engineered for discerning global investors with clean energy, composting and verified international certifications.",

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
          profile: quizAnswers.profile,
          solution: quizAnswers.solution,
          objective: quizAnswers.objective,
          stage: quizAnswers.stage,
        }),
      });

      if (response.ok) {
        setQuizStep(6);
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
    setQuizAnswers({ profile: "", solution: "", objective: "", stage: "" });
    setContactForm({ name: "", company: "", lada: "", phone: "", email: "" });
    setQuizStep(1);
  };

  // 8 Stations of "Dentro de Casa Loy" Interactive Showcase
  const stations = [
    {
      num: "01",
      tag: lang === "es" ? "Recepción & Jima" : "Harvest & Intake",
      name: lang === "es" ? "Plantación, Carga en Campo & Jima" : "Plantations, Field Loading & Harvest",
      desc: lang === "es"
        ? "Recepción directa de nuestras 3,600 hectáreas en Los Altos de Jalisco. Selección de piñas en plenitud de maduración (6-7 años) con medición de grados Brix."
        : "Direct intake from our 3,600 hectares in Los Altos de Jalisco. Hand-selected agaves at peak maturity (6-7 years) tested for optimal natural Brix sugars.",
      specs: ["100% Tequilana Weber", "Los Altos de Jalisco", "Jima Madura"],
      images: [
        { src: "/Campo de Agave Ayotlán Casa Loy Tequilera.webp", label: lang === "es" ? "Plantación Los Altos" : "Highland Plantations" },
        { src: "/Jima Carga Camion Agave Casa Loy.jpg", label: lang === "es" ? "Carga en Campo" : "Field Loading" },
        { src: "/Jima.webp", label: lang === "es" ? "Jima de Agave" : "Agave Harvesting" }
      ]
    },
    {
      num: "02",
      tag: lang === "es" ? "Cocimiento Dual" : "Cooking Process",
      name: lang === "es" ? "Hornos de Mampostería & Autoclaves" : "Brick Ovens & Pressure Autoclaves",
      desc: lang === "es"
        ? "Capacidad combinada de horneado: 240 toneladas en hornos tradicionales de mampostería para notas caramelizadas y 80 toneladas en autoclaves cilíndricos de alta presión."
        : "Versatile cooking: 240 metric tons in traditional masonry brick ovens and 80 tons in high-pressure stainless steel autoclaves.",
      specs: ["240t Hornos Mampostería", "80t Autoclaves", "Vapor Controlado"],
      images: [
        { src: "/Cocimiento de Agave.webp", label: lang === "es" ? "Hornos de Mampostería" : "Brick Ovens (240t)" },
        { src: "/Autoclaves Acero Inoxidable Casa Loy.jpg", label: lang === "es" ? "Autoclaves de Acero" : "Pressure Autoclaves" }
      ]
    },
    {
      num: "03",
      tag: lang === "es" ? "Extracción Noble" : "Noble Extraction",
      name: lang === "es" ? "Tahona Volcánica & Tren de Molienda" : "Volcanic Tahona & Shredder Mill",
      desc: lang === "es"
        ? "Tahona volcánica ancestral para lotes de autor y tren de molienda mecánico de alta capacidad con tolvas industriales para extracción suave de azúcares."
        : "Ancestral volcanic stone tahona for author small-batches and high-throughput industrial shredder roller line for gentle sugar extraction.",
      specs: ["Tahona Tradicional", "Tren de Molienda ROSH", "Extracción Suave"],
      images: [
        { src: "/Tahona Agave Molienda.webp", label: lang === "es" ? "Tahona Tradicional" : "Volcanic Tahona" },
        { src: "/Molino Rosh Molienda Agave Casa Loy.jpg", label: lang === "es" ? "Tren de Molienda" : "Shredder Mill Line" }
      ]
    },
    {
      num: "04",
      tag: lang === "es" ? "Fermentación" : "Fermentation",
      name: lang === "es" ? "Tinas Abiertas & Tanques Cerrados" : "Open Vats & Closed Stainless Tanks",
      desc: lang === "es"
        ? "Tinas abiertas tradicionales para enriquecer ésteres frutales y batería de tanques de acero inoxidable cerrados con control térmico automatizado."
        : "Traditional open wooden/steel vats for fruit-forward esters and automated temperature-controlled closed stainless tanks.",
      specs: ["1: Tinas Abiertas", "2: Tanques Cerrados", "Levaduras Propias"],
      images: [
        { src: "/Fermentación.webp", label: lang === "es" ? "1: Tinas Abiertas" : "1: Open Vats" },
        { src: "/Tanques Fermentacion Cerrada Acero Casa Loy.jpg", label: lang === "es" ? "2: Tanques Cerrados" : "2: Closed Tanks" }
      ]
    },
    {
      num: "05",
      tag: lang === "es" ? "Destilación Dual" : "Distillation",
      name: lang === "es" ? "Alambiques de Cobre & Columnas" : "Copper Pot Stills & Columns",
      desc: lang === "es"
        ? "Alambiques tradicionales de cobre para cortes precisos de cabeza y cola, complementados con columnas continuas europeas de alta eficiencia."
        : "Traditional copper pot stills for precise cuts and author signatures, complemented with high-efficiency European continuous columns.",
      specs: ["Alambiques de Cobre", "Columnas Continuas", "13.5M L / Año"],
      images: [
        { src: "/Destilación.webp", label: lang === "es" ? "Alambiques de Cobre" : "Copper Pot Stills" },
        { src: "/Columnas Destilacion Tequila Casa Loy.jpg", label: lang === "es" ? "Columnas Continuas" : "Continuous Columns" }
      ]
    },
    {
      num: "06",
      tag: lang === "es" ? "Maduración de Autor" : "Cask Aging",
      name: lang === "es" ? "Cava Subterránea de Barricas" : "Underground Barrel Cellar",
      desc: lang === "es"
        ? "Capacidad de 1.2 millones de litros en barricas de Roble Blanco Americano y Roble Francés bajo condiciones estables de humedad y temperatura."
        : "1.2 Million liters capacity in Virgin American White Oak and French Oak barrels maintained under constant cellar humidity and temperature.",
      specs: ["1.2M L Cava", "Roble Americano", "Roble Francés"],
      images: [
        { src: "/Pasillo Cava de Añejamiento.webp", label: lang === "es" ? "Cava Subterránea" : "Underground Cellar" },
        { src: "/Cava de Añejamiento.webp", label: lang === "es" ? "Estiba de Barricas" : "Stacked Casks" },
        { src: "/Cava Tequilera Casa Loy.webp", label: lang === "es" ? "Bóveda de Añejamiento" : "Aging Vault" }
      ]
    },
    {
      num: "07",
      tag: lang === "es" ? "Control & Tasting" : "Quality & Tasting",
      name: lang === "es" ? "Laboratorio de Control & Tasting Lab" : "In-House Quality & Tasting Lab",
      desc: lang === "es"
        ? "Control de calidad analítico lote por lote y Tasting Lab exclusivo para catas sensoriales de perfilado líquido con el cliente."
        : "Batch-by-batch analytical QA and exclusive in-cellar tasting lab sessions to fine-tune your liquid's exact organoleptic signature.",
      specs: ["Tasting Lab en Cava", "Panel Sensorial", "Control de Calidad"],
      images: [
        { src: "/Laboratorio Maquilas.webp", label: lang === "es" ? "Laboratorio Analítico" : "Analytical Lab" },
        { src: "/Recorrido Diamante Cava Cata.webp", label: lang === "es" ? "Tasting Lab en Cava" : "In-Cellar Tasting Lab" }
      ]
    },
    {
      num: "08",
      tag: lang === "es" ? "Acondicionamiento Final" : "Final Bottling",
      name: lang === "es" ? "Tanques de Envasado & Línea de Embotellado" : "Bottling Line & Holding Tanks",
      desc: lang === "es"
        ? "Tanques de envasado dedicados (20,000+ Lts), llenado de precisión, etiquetado e inspección individual en mesa lumínica bajo normativas de exportación."
        : "Dedicated packaging holding tanks (20,000+ L), precision filling, labeling, and bottle-by-bottle light table QA inspection compliant with export standards.",
      specs: ["Tanques TEN-01", "Mesa Lumínica QA", "Co-Packing"],
      images: [
        { src: "/Linea Embotellado Tanque Envasado Casa Loy.jpg", label: lang === "es" ? "Tanque & Envasado" : "Bottling & Holding Tank" },
        { src: "/Embotellado 2.webp", label: lang === "es" ? "Inspección de Botellas" : "Bottle QA Inspection" }
      ]
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
          §1. HERO BANNER (Estructura limpia, fotos claras y botones del sitio)
          ============================================================ */}
      <section className="relative min-h-[90vh] md:min-h-screen w-full bg-zinc-950 overflow-hidden flex items-center">
        {/* Carousel Background Images - Bright & Crisp Visibility */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              alt="Casa Loy Tequilera Background"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out brightness-[0.88] ${
                heroImageIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
              src={src}
              fetchPriority={idx === 0 ? "high" : "low"}
            />
          ))}
          {/* Elegant diffused gradient vignette to ensure high text contrast and legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10 pointer-events-none"></div>
        </div>

        {/* Left-Aligned Content Container */}
        <div className="relative z-20 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto w-full py-20 lg:py-28">
          <div className="relative max-w-3xl text-left space-y-6 animate-slide-left-right">
            {/* Soft diffused aura specifically backing the text block */}
            <div className="absolute -inset-6 sm:-inset-10 -z-10 bg-black/40 backdrop-blur-[2px] rounded-3xl pointer-events-none"></div>

            {/* Title with exact requested structure: bold top lines + less-bold subtitle lines */}
            <h1 className="font-serif leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <span className="block font-medium text-[clamp(32px,4.5vw,60px)]">
                {t.heroTitleLine1}
              </span>
              <span className="block font-medium text-[clamp(32px,4.5vw,60px)]">
                {t.heroTitleLine2}
              </span>
              <span className="block font-light text-white/90 text-[clamp(24px,3.5vw,46px)] mt-2 sm:mt-3 leading-[1.12]">
                <span className="block">{t.heroSubLine1}</span>
                <span className="block">{t.heroSubLine2}</span>
              </span>
            </h1>

            {/* Enlarged Italic Vision Quote */}
            <div className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#FDA377] font-normal tracking-wide drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
              {t.heroQuote}
            </div>

            {/* Description Subtitle */}
            <p className="font-body-lg text-white/95 font-light leading-relaxed text-sm sm:text-base md:text-lg max-w-2xl pt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {t.heroDesc}
            </p>

            {/* Action Buttons matching the site's official style */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center pt-4">
              <a
                href="#quiz"
                className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center shadow-lg rounded-none cursor-pointer"
              >
                {t.heroBtn}
              </a>
              <a
                href="#agenda-llamada"
                className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center rounded-none cursor-pointer"
              >
                {t.heroBtnSec}
              </a>
            </div>

            {/* Carousel Slide Indicators */}
            <div className="flex items-center gap-2 pt-6">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroImageIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1 transition-all duration-500 cursor-pointer ${
                    heroImageIdx === i ? "w-8 bg-[#8C4723]" : "w-3 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
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

      {/* TRUST BAR (NOM 1633 · LOS ALTOS DE JALISCO · FAMILY-OWNED · AGAVE ROOTS SINCE 1992 · BATCH CONTROL · EXPORT COORDINATION) */}
      <div className="bg-[#F6F2EA] border-y border-[#1c1c18]/10 py-3.5 sm:py-4 shadow-sm">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 sm:gap-x-6 text-center">
            <span className="font-navigation text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#8C4723]">
              {t.trustNom}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden sm:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustRegion}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden sm:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustFamily}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustRoots}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustBatch}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustExport}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          §2. POR QUÉ CASA LOY (Visible completo sin scroll excesivo)
          ============================================================ */}
      <section className="py-10 md:py-14 min-h-[88vh] flex flex-col justify-center bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.whyEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.whyTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.whySub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <Reveal delay={100}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Origen" : "Origin"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">01</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    NOM 1633, Los Altos de Jalisco
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "Producción protegida bajo denominación de origen en los Altos de Jalisco."
                      : "Designation of origin protected production in Jalisco highlands."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Estructura" : "Structure"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">02</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {lang === "es" ? "Empresa familiar, tres generaciones" : "Family-owned, three generations"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "Compromiso generacional, trato directo sin burocracia y alianzas sólidas."
                      : "Long-term commitment, direct leadership and stable partnerships."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Agave" : "Agave"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">03</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {lang === "es" ? "Cultivo propio desde 1992" : "Own cultivation since 1992"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "3,600 hectáreas que blindan tu costo por litro y garantizan abasto continuo."
                      : "3,600 hectares ensuring price security and guaranteed supply."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Equipo" : "Team"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">04</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {lang === "es" ? "Personas reales detrás de cada proyecto" : "Real people behind every project"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "Maestros tequileros, ingenieros químicos y coordinadores de exportación."
                      : "Master distillers, chemical engineers, and international trade advisers."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Infraestructura" : "Infrastructure"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">05</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {lang === "es" ? "Construida para proyectos serios y en crecimiento" : "Built for serious, growing projects"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "Flexibilidad industrial desde lotes piloto hasta tanques de granel."
                      : "Industrial scale flexibility from pilot runs to bulk containers."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={350}>
              <div className="p-6 sm:p-7 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {lang === "es" ? "Calidad" : "Quality"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">06</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {lang === "es" ? "Control de lote en cada producción" : "Batch control on every production"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {lang === "es"
                      ? "Laboratorio interno y verificación estricta de cumplimiento CRT por lote."
                      : "Internal laboratory and CRT compliance verification on every run."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §3. DENTRO DE CASA LOY (Estética cinematográfica sin scroll)
          ============================================================ */}
      <section className="py-10 md:py-14 min-h-[88vh] flex flex-col justify-center bg-[#F6F2EA] border-y border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          {/* Header */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-6">
              <div>
                <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                  {t.insideEyebrow}
                </span>
                <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight">
                  {t.insideTitle}
                </h2>
              </div>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed max-w-md text-xs sm:text-sm">
                {t.insideSub}
              </p>
            </div>
          </Reveal>

          {/* Interactive Cinema Viewer */}
          <Reveal delay={100}>
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.6/1] max-h-[380px] rounded-none overflow-hidden border border-[#1c1c18]/15 shadow-md bg-black group mb-4">
              {(() => {
                const currentStation = stations[activeStation];
                const currentImgObj = currentStation.images?.[activeStationImage] || currentStation.images?.[0] || { src: currentStation.img, label: currentStation.name };
                return (
                  <>
                    <img
                      key={`${activeStation}-${activeStationImage}`}
                      src={currentImgObj.src}
                      alt={currentImgObj.label || currentStation.name}
                      className="w-full h-full object-cover brightness-[0.72] transition-all duration-700 ease-out scale-100 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>

                    {/* Top Multi-Image Switcher Pills */}
                    {currentStation.images && currentStation.images.length > 1 && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 border border-white/20">
                        {currentStation.images.map((imgItem, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStationImage(imgIdx);
                            }}
                            className={`px-2.5 py-1 font-navigation text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                              activeStationImage === imgIdx
                                ? "bg-[#8C4723] text-white font-bold shadow-sm"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {imgItem.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Left/Right Chevrons for Multi-Image stations */}
                    {currentStation.images && currentStation.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStationImage((prev) => (prev === 0 ? currentStation.images.length - 1 : prev - 1));
                          }}
                          aria-label="Previous Image"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#8C4723] text-white border border-white/20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStationImage((prev) => (prev === currentStation.images.length - 1 ? 0 : prev + 1));
                          }}
                          aria-label="Next Image"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#8C4723] text-white border border-white/20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </>
                    )}

                    {/* Overlaid Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-navigation text-[9px] sm:text-[10px] text-white uppercase tracking-[0.25em] bg-[#8C4723] px-2.5 py-0.5 font-semibold inline-block rounded-none">
                            {currentStation.num} · {currentStation.tag}
                          </span>
                          {currentImgObj.label && (
                            <span className="font-navigation text-[9px] sm:text-[10px] text-white/90 uppercase tracking-wider bg-white/15 backdrop-blur-md px-2 py-0.5 border border-white/20">
                              {currentImgObj.label}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl text-white font-light">
                          {currentStation.name}
                        </h3>
                        <p className="font-body-md text-white/90 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                          {currentStation.desc}
                        </p>
                      </div>

                      {/* Specs Pills */}
                      <div className="flex flex-wrap sm:flex-col gap-1.5 sm:items-end">
                        {currentStation.specs.map((spec, sIdx) => (
                          <span key={sIdx} className="font-navigation text-[9px] sm:text-[10px] uppercase tracking-wider text-white bg-white/15 backdrop-blur-md px-2.5 py-0.5 border border-white/20 rounded-none">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </Reveal>

          {/* Station Selectors (8 Sharp Buttons matching site buttons) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {stations.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStation(idx);
                  setActiveStationImage(0);
                }}
                className={`text-left p-2.5 sm:p-3 border transition-all rounded-none cursor-pointer ${
                  activeStation === idx
                    ? "bg-[#8C4723] border-[#8C4723] text-white shadow-sm"
                    : "bg-white border-[#1c1c18]/10 hover:border-[#8C4723] text-[#53443a] hover:text-[#1c1c18]"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-navigation text-[9px] sm:text-[10px] font-bold ${activeStation === idx ? "text-[#ffdbc7]" : "text-primary"}`}>
                    {s.num}
                  </span>
                  {activeStation === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#ffdbc7] animate-pulse"></span>}
                </div>
                <div className="font-serif text-xs sm:text-sm font-light truncate">{s.tag}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §4. RUTAS DE PRODUCCIÓN (3 Columnas Alineadas sin scroll)
          ============================================================ */}
      <section className="py-10 md:py-14 min-h-[88vh] flex flex-col justify-center bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.solutionsEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.solutionsTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.solutionsSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* 01 Marca Privada (Selected in Copper) */}
            <Reveal delay={100}>
              <div className="p-6 sm:p-7 border-2 border-[#8C4723] bg-white flex flex-col justify-between transition-all duration-500 hover:shadow-xl rounded-none relative h-full">
                <span className="absolute -top-3 right-6 bg-[#8C4723] text-white font-navigation text-[9px] uppercase tracking-[0.25em] px-3 py-0.5 font-semibold rounded-none shadow-sm">
                  {lang === "es" ? "Marca Privada" : "Private Label"}
                </span>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-serif text-2xl font-light">01</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {lang === "es" ? "Marca Privada" : "Private Label"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {lang === "es" 
                      ? "Desarrollo completo desde cero: asesoría jurídica ante el CRT, registro de marca, formulación líquida, proveeduría de botella, etiquetado y exportación."
                      : "Comprehensive brand creation from ground zero: official CRT registry compliance, sensory liquid formulation, bottle sourcing, labeling, and export clearance."}
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="#quiz"
                    className="w-full block bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none shadow-sm"
                  >
                    {lang === "es" ? "Ver Más" : "See More"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* 02 Tequila a Granel (Bulk) */}
            <Reveal delay={150}>
              <div className="p-6 sm:p-7 border border-[#1c1c18]/10 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-lg rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-serif text-2xl font-light">02</span>
                    <span className="font-navigation text-[9px] text-primary bg-[#F6F2EA] px-2.5 py-0.5 border border-[#1c1c18]/10 uppercase tracking-widest rounded-none font-semibold">
                      {lang === "es" ? "Gran Volumen" : "High Volume"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {lang === "es" ? "Tequila a Granel (Bulk)" : "Bulk Tequila Supply"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {lang === "es"
                      ? "Abastecimiento constante de Tequila 100% Agave o Mixto despachado en autotanques certificados o IBC totes para envasadoras y distribuidores."
                      : "Steady bulk supply of 100% Agave or Mixto shipped in dedicated road tankers or 1,000L IBC totes for international bottlers and distributors."}
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="#agenda-llamada"
                    className="w-full block bg-transparent border border-[#8C4723] hover:bg-[#8C4723] hover:text-white text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none"
                  >
                    {lang === "es" ? "Ver Más" : "See More"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* 03 Envasado & Co-packing */}
            <Reveal delay={200}>
              <div className="p-6 sm:p-7 border border-[#1c1c18]/10 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-lg rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-serif text-2xl font-light">03</span>
                    <span className="font-navigation text-[9px] text-primary bg-[#F6F2EA] px-2.5 py-0.5 border border-[#1c1c18]/10 uppercase tracking-widest rounded-none font-semibold">
                      {lang === "es" ? "Acondicionamiento" : "Packaging QA"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {lang === "es" ? "Envasado & Co-Packing" : "Co-Packing & Bottling"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {lang === "es"
                      ? "Línea de envasado de alta precisión: llenado volumétrico, colocación de tapón irrellenable, etiquetado de exportación e inspección lumínica."
                      : "High-precision automated packaging: volumetric filling, tamper-evident corking, luxury labeling, and bottle-by-bottle light table quality inspection."}
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="#quiz"
                    className="w-full block bg-transparent border border-[#8C4723] hover:bg-[#8C4723] hover:text-white text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none"
                  >
                    {lang === "es" ? "Ver Más" : "See More"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5. MITIGACIÓN DE RIESGOS (Alineado al resto del sitio sin scroll)
          ============================================================ */}
      <section className="py-10 md:py-14 min-h-[85vh] flex flex-col justify-center bg-[#F6F2EA] border-y border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.stakesEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.stakesTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.stakesSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <Reveal delay={100}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 rounded-none space-y-2 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-2xl font-light text-primary block">01</span>
                <h3 className="font-serif text-lg font-light text-[#1c1c18]">{lang === "es" ? "Empezar desde cero" : "Starting from zero"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                  {lang === "es" ? "Acompañamiento normativo ante el CRT e IMPI para evitar retrasos costosos en registro de marca y aprobación de etiquetas." : "Technical guidance on CRT and trademark registration preventing costly regulatory delays."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 rounded-none space-y-2 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-2xl font-light text-primary block">02</span>
                <h3 className="font-serif text-lg font-light text-[#1c1c18]">{lang === "es" ? "Cambiar de productor" : "Switching producer"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                  {lang === "es" ? "Replicamos el perfil químico de tu tequila actual con cromatografía in-house y producimos lotes de seguridad sin quiebres de stock." : "Zero stockouts: we chemically replicate your current liquid profile and maintain buffer inventory."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 rounded-none space-y-2 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-2xl font-light text-primary block">03</span>
                <h3 className="font-serif text-lg font-light text-[#1c1c18]">{lang === "es" ? "Escalar volumen" : "Scaling volume"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                  {lang === "es" ? "13.5M L de capacidad y 10.8M de agaves propios garantizan escalar de miles a millones de litros sin alzas de costo imprevistas." : "13.5M L capacity and 10.8M estate plants ensure scaling smoothly without surprise price spikes."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 rounded-none space-y-2 transition-all duration-500 hover:border-[#8C4723]/40 hover:shadow-md h-full">
                <span className="font-serif text-2xl font-light text-primary block">04</span>
                <h3 className="font-serif text-lg font-light text-[#1c1c18]">{lang === "es" ? "Exportación global" : "Global export"}</h3>
                <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
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
      <section className="relative py-12 md:py-16 min-h-[88vh] flex flex-col justify-center overflow-hidden bg-[#1C1A19] text-white" id="quiz">
        <div className="absolute inset-0 z-0">
          <img
            alt="Agave Hearts Background"
            className="w-full h-full object-cover brightness-[0.45] opacity-55"
            src="/Piñas de Agave Tequilana Weber.webp"
          />
        </div>
        <div className="relative z-10 px-6 max-w-[1240px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            <div className="lg:col-span-5 text-left space-y-5 animate-fade-in">
              <span className="font-navigation text-primary-fixed mb-2 block tracking-widest uppercase text-xs font-bold">
                {t.quizOvertitle}
              </span>
              <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl leading-tight text-white font-light">
                {t.quizTitle}
              </h2>
              <p className="font-body-lg text-white/80 leading-relaxed font-light text-xs sm:text-sm">
                {t.quizDesc}
              </p>
              <div className="flex items-center gap-4 text-primary-fixed">
                <span className="material-symbols-outlined text-3xl">analytics</span>
                <div className="h-[1px] w-20 bg-primary-fixed/30"></div>
              </div>
            </div>

            {/* Glassmorphic Quiz Controller */}
            <div className="lg:col-span-7 p-5 md:p-8 bg-white/15 backdrop-blur-3xl border border-white/20 rounded-none shadow-2xl transition-all duration-300 w-full">
              {/* NDA Guarantee Banner */}
              <div className="mb-5 inline-flex items-center gap-2 bg-[#8C4723]/35 border border-[#8C4723]/70 px-3.5 py-1 text-xs text-[#FDA377] select-none">
                <span className="material-symbols-outlined text-sm text-[#FDA377]">verified_user</span>
                <span className="font-navigation tracking-wider uppercase text-[10px] sm:text-[11px] font-semibold">
                  {t.ndaText} · NOM 1633 CRT
                </span>
              </div>

              {quizStep === 1 && (
                <div className="space-y-3.5 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 01 / 04
                  </span>
                  <h3 className="font-serif text-lg md:text-xl mb-4 text-white select-none font-light">
                    {t.step0Title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {t.step0Opts.map((profileOpt, idx) => (
                      <button
                        key={profileOpt.title}
                        onClick={() => handleNextStep("profile", profileOpt.title, 2)}
                        className="w-full text-left p-4 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex flex-col justify-between group font-navigation cursor-pointer min-h-[110px]"
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                            0{idx + 1}
                          </span>
                          <span className="material-symbols-outlined text-sm text-primary group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            arrow_forward
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-black leading-tight mb-1">
                            {profileOpt.title}
                          </div>
                          <p className="text-xs font-light text-white/75 group-hover:text-black/80 leading-snug">
                            {profileOpt.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-3.5 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 02 / 04
                  </span>
                  <h3 className="font-serif text-lg md:text-xl mb-4 text-white select-none font-light">
                    {t.step1Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {t.step1Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("solution", opt, 3)}
                          className={`w-full text-left p-3 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-xs sm:text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
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
                <div className="space-y-3.5 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 03 / 04
                  </span>
                  <h3 className="font-serif text-lg md:text-xl mb-4 text-white select-none font-light">
                    {t.step2Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {t.step2Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("objective", opt, 4)}
                          className={`w-full text-left p-3 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-xs sm:text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
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
                <div className="space-y-3.5 text-left animate-fade-in">
                  <span className="font-navigation text-[#FDA377] font-bold tracking-wider mb-1 block text-xs">
                    {t.stepLabel} 04 / 04
                  </span>
                  <h3 className="font-serif text-lg md:text-xl mb-4 text-white select-none font-light">
                    {t.step3Title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {t.step3Opts.map((opt, idx) => {
                      const letters = ["A", "B", "C", "D", "E"];
                      return (
                        <button
                          key={opt}
                          onClick={() => handleNextStep("stage", opt, 5)}
                          className={`w-full text-left p-3 border border-white/20 bg-white/10 hover:border-primary hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation cursor-pointer ${
                            idx === 4 ? "md:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-primary group-hover:text-white bg-white/20 group-hover:bg-primary px-2 py-0.5 rounded border border-white/20 group-hover:border-transparent transition-colors">
                              {letters[idx]}
                            </span>
                            <span className="text-xs sm:text-sm font-light text-white group-hover:text-black leading-tight">{opt}</span>
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

              {quizStep === 5 && (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-left animate-fade-in">
                  <h3 className="font-serif text-lg md:text-xl mb-3 text-white select-none font-light">
                    {t.ctaTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2 font-body-md placeholder:text-white/60 focus:outline-none text-white text-xs sm:text-sm"
                        placeholder={t.formName}
                      />
                    </div>
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2 font-body-md placeholder:text-white/60 focus:outline-none text-white text-xs sm:text-sm"
                        placeholder={t.formCompany}
                      />
                    </div>
                    <div className="flex gap-2 items-end border-b border-white/35 focus-within:border-primary transition-all duration-300 pb-0.5">
                      <span className="text-white/40 text-xs select-none pb-2 font-body-md">+</span>
                      <input
                        required
                        type="text"
                        maxLength="4"
                        value={contactForm.lada}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setContactForm({ ...contactForm, lada: val });
                        }}
                        className="w-12 border-0 focus:ring-0 bg-transparent py-2 font-body-md placeholder:text-white/60 focus:outline-none text-white text-xs sm:text-sm text-center"
                        placeholder="52"
                      />
                      <input
                        required
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setContactForm({ ...contactForm, phone: val });
                        }}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2 font-body-md placeholder:text-white/60 focus:outline-none text-white text-xs sm:text-sm"
                        placeholder={t.formPhone}
                      />
                    </div>
                    <div className="relative border-b border-white/35 focus-within:border-primary transition-all duration-300">
                      <input
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full border-0 focus:ring-0 bg-transparent py-2 font-body-md placeholder:text-white/60 focus:outline-none text-white text-xs sm:text-sm"
                        placeholder={t.formEmail}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3 bg-[#8C4723] border border-[#8C4723] text-white font-navigation uppercase tracking-[0.25em] text-xs transition-all hover:bg-[#a6562b] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 rounded-none cursor-pointer"
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

              {quizStep === 6 && (
                <div className="text-center py-5 space-y-4 animate-fade-in">
                  <span className="material-symbols-outlined text-4xl text-[#FDA377] mb-1 animate-bounce">
                    verified
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl mb-2 text-white font-light">{t.successTitle}</h3>
                  <p className="font-body-md text-white/70 max-w-md mx-auto text-xs sm:text-sm leading-relaxed font-light">
                    {t.successDesc}
                  </p>
                  <button
                    onClick={handleResetQuiz}
                    className="text-[#FDA377] font-navigation border-b border-[#FDA377] pb-0.5 hover:text-white hover:border-white transition-all mt-4 text-xs cursor-pointer uppercase tracking-wider"
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
          §7. RUTA DE TRABAJO (Alineado al sitio sin scroll)
          ============================================================ */}
      <section className="py-10 md:py-14 min-h-[85vh] flex flex-col justify-center bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.processEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.processTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.processSub}
              </p>
            </div>
          </Reveal>

          {/* Connected Process Flow / Timeline */}
          <div className="relative">
            {/* Horizontal Line across desktop */}
            <div className="hidden xl:block absolute top-7 left-10 right-10 h-[2px] bg-gradient-to-r from-[#8C4723] via-[#8C4723]/60 to-[#8C4723] z-0 pointer-events-none"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-3.5 relative z-10">
              {[
                {
                  num: "01",
                  title: lang === "es" ? "Diagnóstico" : "Diagnosis",
                  desc: lang === "es" ? "Análisis de volúmenes, mercado meta y especificaciones técnicas." : "Commercial targets, volume projections, and product specs analysis."
                },
                {
                  num: "02",
                  title: lang === "es" ? "Sesión Técnica" : "Tech Session",
                  desc: lang === "es" ? "Videollamada de 30 minutos con ingenieros para validar viabilidad." : "30-min session with distillery engineers reviewing feasibility & cost/liter."
                },
                {
                  num: "03",
                  title: lang === "es" ? "Tasting Lab" : "Lab Profiling",
                  desc: lang === "es" ? "Envío de muestras sensoriales en tasting lab hasta aprobar tu perfil." : "Sensory formulations dispatched until exact signature is achieved."
                },
                {
                  num: "04",
                  title: lang === "es" ? "Registro CRT" : "CRT Compliance",
                  desc: lang === "es" ? "Trámites oficiales ante CRT, registro y aprobación de etiquetas." : "Official registration with CRT, label approvals, and customs filings."
                },
                {
                  num: "05",
                  title: lang === "es" ? "Destilación & QA" : "Production & QA",
                  desc: lang === "es" ? "Destilación a escala, cromatografía de gases lote a lote y envasado." : "Scale distilling, batch gas chromatography reports, and precision packaging."
                },
                {
                  num: "06",
                  title: lang === "es" ? "Exportación" : "Global Dispatch",
                  desc: lang === "es" ? "Acompañamiento logístico aduanal y certificados fitosanitarios." : "Phytosanitary certification, freight coordination, and customs clearance."
                },
                {
                  num: "07",
                  title: lang === "es" ? "Post-Venta Agile" : "Agile Post-Sales",
                  desc: lang === "es" ? "Reordenamiento programado, optimización continua de márgenes y soporte técnico permanente." : "Scheduled reordering, continuous margin optimization, and proactive technical support."
                }
              ].map((step, idx) => (
                <Reveal key={idx} delay={idx * 60}>
                  <div className={`p-4 sm:p-5 bg-white border rounded-none flex flex-col items-center text-center justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-md h-full relative group ${
                    idx === 6 ? "border-[#8C4723] bg-[#FAF8F5]" : "border-[#1c1c18]/10"
                  }`}>
                    {/* Step Indicator Dot & Arrow */}
                    <div className="w-full flex items-center justify-center relative mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#8C4723] text-white flex items-center justify-center font-navigation text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-navigation text-[9px] text-[#8C4723] uppercase tracking-[0.2em] font-semibold">
                          PASO {step.num}
                        </span>
                      </div>
                      {idx < 6 && (
                        <span className="material-symbols-outlined text-xs text-[#8C4723]/40 group-hover:text-[#8C4723] group-hover:translate-x-0.5 transition-all hidden xl:inline absolute right-0">
                          arrow_forward
                        </span>
                      )}
                    </div>

                    <div className="text-center w-full my-auto">
                      <h3 className="font-serif text-base font-semibold text-[#1c1c18] mb-1.5 leading-snug">
                        {step.title}
                      </h3>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>

                    {idx === 6 && (
                      <div className="w-full mt-3 pt-2.5 border-t border-[#8C4723]/20 text-center">
                        <span className="font-navigation text-[9px] text-[#8C4723] font-bold uppercase tracking-wider block">
                          ✦ {lang === "es" ? "Acompañamiento Continuo" : "Continuous Partnership"}
                        </span>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §8. SUSTENTABILIDAD & CERTIFICACIONES (2 Columnas)
          ============================================================ */}
      <section className="py-12 md:py-16 min-h-[88vh] flex flex-col justify-center bg-[#F6F2EA] border-y border-[#1c1c18]/10 relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 text-left relative z-10 w-full">
          {/* Header */}
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.sustainabilityEyebrow || (lang === "es" ? "RESPONSABILIDAD & CUMPLIMIENTO GLOBAL" : "RESPONSIBILITY & GLOBAL COMPLIANCE")}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.sustainabilityTitle || (lang === "es" ? "Sustentabilidad Integral & Certificaciones Oficiales" : "Comprehensive Sustainability & Official Certifications")}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.sustainabilitySub || (lang === "es" 
                  ? "Infraestructura circular para inversionistas con energía limpia, composta de vinazas y sellos oficiales de exportación."
                  : "Circular infrastructure engineered for global spirits brands with clean energy, vinazas composting, and verified export seals.")}
              </p>
            </div>
          </Reveal>

          {/* 2 Columns: Left = Sustentabilidad, Right = Certificaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            
            {/* Columna Izquierda: Sustentabilidad (Ágil para Inversionistas) */}
            <Reveal delay={100}>
              <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-7 shadow-sm space-y-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1c18]/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                      <span className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C4723] font-bold">
                        {lang === "es" ? "Economía Circular & ESG" : "Circular Economy & ESG"}
                      </span>
                    </div>
                    <span className="font-navigation text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {lang === "es" ? "Grado Inversionista" : "Investor-Ready"}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1c1c18] mb-2">
                    {lang === "es" ? "Sustentabilidad Agroindustrial" : "Agroindustrial Sustainability"}
                  </h3>
                  <p className="font-body-md text-[#53443a] text-xs sm:text-sm leading-relaxed mb-5 font-light">
                    {lang === "es"
                      ? "Procesos diseñados para minimizar la huella de carbono, eliminar descargas residuales al subsuelo y garantizar una operación socialmente responsable."
                      : "Engineered operations reducing carbon footprint, preventing subsoil wastewater runoff, and driving transparent social governance."}
                  </p>

                  <div className="space-y-3.5">
                    {/* 01 Solar Energy */}
                    <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                      <img
                        src="/Paneles Solares.webp"
                        alt="Solar Energy Casa Loy"
                        className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                            {lang === "es" ? "Energía Solar Fotovoltaica" : "Solar Energy"}
                          </h4>
                          <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">Clean Energy</span>
                        </div>
                        <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                          {lang === "es"
                            ? "Aprovechamos energía limpia mediante paneles solares para reducir emisiones de CO₂ y asegurar eficiencia operativa permanente."
                            : "Clean photovoltaic solar arrays generating renewable electricity across production facilities, insulating operations from grid volatility."}
                        </p>
                      </div>
                    </div>

                    {/* 02 Vinazas Management & Composting */}
                    <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                      <img
                        src="/Compostaje.webp"
                        alt="Composting Center Casa Loy"
                        className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                            {lang === "es" ? "Manejo de Vinazas & Centro de Composta" : "Vinazas Management & Composting"}
                          </h4>
                          <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">Zero Waste</span>
                        </div>
                        <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                          {lang === "es"
                            ? "Transformación del 100% de residuos orgánicos: las vinazas y el bagazo se convierten en composta enriquecida para devolver vitalidad biológica a nuestros campos."
                            : "100% organic waste upcycling: vinazas and agave bagasse are converted into bio-compost to regenerate agricultural soil without open dumping."}
                        </p>
                      </div>
                    </div>

                    {/* 03 Social & Family Development */}
                    <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                      <img
                        src="/Empleado Jimador Casa Loy Tequilera.webp"
                        alt="Social and Family Development"
                        className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                            {lang === "es" ? "Desarrollo Social & Familiar" : "Social & Family Development"}
                          </h4>
                          <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">Fair Labor</span>
                        </div>
                        <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                          {lang === "es"
                            ? "Dignificación del oficio de jima y destilería en Ayotlán con contratos formales, capacitación técnica continua y apoyo a las familias jornaleras."
                            : "Promoting dignity and social stability for jimador and distillery families with formal contracts, continuous safety training, and regional community growth."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c1c18]/10 flex items-center justify-between text-[#8C4723]">
                  <span className="font-navigation text-[10px] uppercase tracking-widest font-semibold">
                    ✦ {lang === "es" ? "Economía Circular Verificada" : "Verified Circular Economy"}
                  </span>
                  <span className="font-serif text-xs italic text-[#53443a]">
                    Ayotlán, Jalisco
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Columna Derecha: Certificaciones Oficiales */}
            <Reveal delay={150}>
              <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-7 shadow-sm space-y-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1c18]/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8C4723]"></span>
                      <span className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C4723] font-bold">
                        {lang === "es" ? "Mercados Internacionales" : "International Markets"}
                      </span>
                    </div>
                    <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                      {lang === "es" ? "Auditorías Vigentes" : "Current Audits"}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1c1c18] mb-2">
                    {lang === "es" ? "Certificaciones de Exportación" : "Export Certifications"}
                  </h3>
                  <p className="font-body-md text-[#53443a] text-xs sm:text-sm leading-relaxed mb-5 font-light">
                    {lang === "es"
                      ? "Sellos oficiales confirmados para comercializar tu marca sin fricciones regulatorias en EE.UU., la Unión Europea y canales especializados globales."
                      : "Official accredited certifications enabling your brand to clear international customs and sell into premium retail without regulatory friction."}
                  </p>

                  <div className="space-y-3">
                    {/* USDA Organic */}
                    <div className="p-4 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-serif text-lg font-semibold text-[#1c1c18]">USDA Organic</div>
                        <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 border border-emerald-200">
                          {lang === "es" ? "Mercado EE.UU." : "USA Market"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {lang === "es"
                          ? "Certificación orgánica para todo el territorio de Estados Unidos y Norteamérica, avalando el cultivo libre de pesticidas sintéticos y trazabilidad total."
                          : "Certified organic compliance under USDA National Organic Program for uninterrupted access to top-tier US grocery and spirits retail."}
                      </p>
                    </div>

                    {/* Certificación Orgánica Unión Europea */}
                    <div className="p-4 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-serif text-lg font-semibold text-[#1c1c18]">
                          {lang === "es" ? "Certificación Orgánica Unión Europea" : "EU Organic Certification"}
                        </div>
                        <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 border border-blue-200">
                          {lang === "es" ? "27 Países UE" : "27 EU Nations"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {lang === "es"
                          ? "Sello de equivalencia orgánica oficial para exportación directa a los 27 países de la Unión Europea y Suiza, cumpliendo estrictos estándares ecológicos."
                          : "Official European Organic standard recognition guaranteeing seamless export clearance across the 27 EU member states."}
                      </p>
                    </div>

                    {/* KMD Kosher */}
                    <div className="p-4 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-serif text-lg font-semibold text-[#1c1c18]">KMD Kosher</div>
                        <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-[#8C4723] bg-[#8C4723]/10 px-2 py-0.5 border border-[#8C4723]/30">
                          {lang === "es" ? "Pureza Global" : "Global Purity"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {lang === "es"
                          ? "Certificación Kosher oficial (KMD) que audita la higiene, pureza de ingredientes y procesos sin contaminantes cruzados, ampliando tus canales globales."
                          : "Accredited KMD Kosher certification guaranteeing sanitary rigor and religious compliance, opening high-value specialized global distribution."}
                      </p>
                    </div>

                    {/* NOM 1633 CRT */}
                    <div className="p-4 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-serif text-lg font-semibold text-[#1c1c18]">NOM 1633 CRT</div>
                        <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-stone-800 bg-stone-200 px-2 py-0.5 border border-stone-300">
                          {lang === "es" ? "Denominación Oficial" : "Official Origin"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {lang === "es"
                          ? "Destilería autorizada con permanente inspección del Consejo Regulador del Tequila. Certificados de autenticidad y expedición de marbetes de exportación."
                          : "Authorized distillery under continuous Consejo Regulador del Tequila supervision, issuing authentic export certificates and customs pedigree."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c1c18]/10 flex items-center justify-between text-[#8C4723]">
                  <span className="font-navigation text-[10px] uppercase tracking-widest font-semibold">
                    ✦ {lang === "es" ? "Documentación Lista para Exportar" : "Export-Ready Compliance"}
                  </span>
                  <span className="font-serif text-xs italic text-[#53443a]">
                    CRT · USDA · EU · KMD
                  </span>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ============================================================
          §9. CALENDARIO DE CITAS TÉCNICAS (Mismo ancho max-w-4xl centrado)
          ============================================================ */}
      <section id="agenda-llamada" className="py-10 md:py-14 min-h-[88vh] flex flex-col justify-center bg-[#fcf9f3]">
        <div className="max-w-4xl mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="mb-6">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.calEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.calTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                {t.calSub}
              </p>
            </div>
          </Reveal>

          {/* Cal.com Clean Embed Card - matched width */}
          <Reveal delay={100}>
            <div className="w-full bg-white border border-[#1c1c18]/10 p-5 sm:p-7 shadow-sm rounded-none">
              <div className="mb-3 border-b border-[#1c1c18]/10 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-light text-[#1c1c18]">
                    {lang === "es" ? "Calendario Oficial de Citas Técnicas" : "Technical Consultation Calendar"}
                  </h4>
                  <p className="font-navigation text-[11px] text-[#53443a] font-light mt-0.5">
                    {lang === "es" ? "Selecciona el día y horario disponible para tu videollamada de 30 minutos." : "Select available date & time for your 30-minute Google Meet session."}
                  </p>
                </div>
                <span className="font-navigation text-[9px] text-primary font-bold uppercase bg-[#F6F2EA] px-2.5 py-0.5 border border-[#1c1c18]/10 rounded-none tracking-wider">
                  30 Minutos
                </span>
              </div>

              <div id="cal-inline-v3-scheduler" className="w-full h-[480px] sm:h-[520px]"></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          §10. PREGUNTAS FRECUENTES B2B (Mismo ancho max-w-4xl centrado)
          ============================================================ */}
      <section id="faqs-b2b" className="py-10 md:py-14 min-h-[88vh] flex flex-col justify-center bg-[#FAF6F0] border-t border-[#1c1c18]/10">
        <div className="max-w-4xl mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="mb-6">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {t.faqEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.faqTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                {t.faqSub}
              </p>
            </div>
          </Reveal>

          {/* FAQ Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#1c1c18]/10 pb-2.5">
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
                className={`font-navigation text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-3.5 py-2 transition-all cursor-pointer rounded-none ${
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
          <div className="space-y-1.5 w-full">
            {faqData[activeFaqTab].map((item, idx) => (
              <div
                key={idx}
                className="border-b border-[#1c1c18]/10 py-3 transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left font-serif text-base sm:text-lg font-light text-[#1c1c18] hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <span className="text-primary text-xl font-light">
                    {openFaqIdx === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaqIdx === idx && (
                  <p className="font-navigation text-xs sm:text-sm text-[#53443a] leading-relaxed font-light mt-2 pr-6">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* NDA Guarantee Bar */}
          <div className="mt-8 p-4 sm:p-5 bg-white border border-[#1c1c18]/10 rounded-none flex flex-col sm:flex-row items-center justify-between gap-3 w-full text-xs font-navigation shadow-sm">
            <span className="flex items-center gap-2 text-[#1c1c18]">
              <span className="text-emerald-700 font-bold">✓</span> {lang === "es" ? "Convenio de Confidencialidad (NDA) disponible para todo proyecto" : "Strict Non-Disclosure Agreement (NDA) available for every project"}
            </span>
            <span className="text-primary font-bold tracking-widest text-[11px]">NOM 1633 CRT</span>
          </div>
        </div>
      </section>
    </div>
  );
}
