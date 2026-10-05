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
      { threshold: 0.12 }
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

export default function Granel({ lang = "es" }) {
  const [currentLang, setCurrentLang] = useState(lang);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  // Active Station State for "Dentro de Casa Loy · Infraestructura de Granel" Showcase
  const [activeStation, setActiveStation] = useState(0);
  const [activeStationImage, setActiveStationImage] = useState(0);

  // Hero Background Carousel State
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const heroImages = [
    "/granel-hero-operario.webp",
    "/Naves Industriales Casa Loy Tequilera.webp",
    "/Tanques Fermentacion Cerrada Acero Casa Loy.jpg",
    "/Columnas Destilacion Tequila Casa Loy.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Active FAQ Category
  const [activeFaqTab, setActiveFaqTab] = useState("regulation");
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Interactive Yield & Volume Simulator State
  const [calcVolume, setCalcVolume] = useState(24000);
  const [selectedClass, setSelectedClass] = useState("blanco");

  // Animated KPIs Counters (13.5M L, 8M+ plants, 55% ABV, 20 business days)
  const [counters, setCounters] = useState({ capacity: 0, plants: 0, proof: 0, days: 0 });
  const [countersTriggered, setCountersTriggered] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setCounters({ capacity: 13.5, plants: 8, proof: 55, days: 20 });
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
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
        capacity: Number((13.5 * ease).toFixed(1)),
        plants: Number((8 * ease).toFixed(1)),
        proof: Math.round(55 * ease),
        days: Math.round(20 * ease)
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCounters({ capacity: 13.5, plants: 8, proof: 55, days: 20 });
      }
    };
    requestAnimationFrame(frame);
  }, [countersTriggered]);

  // Lead Quotation Form State
  const [leadForm, setLeadForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    volume: "24000",
    tequilaClass: "blanco",
    containerType: "isotank",
    application: "bottling",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLeadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: leadForm.name,
        company: leadForm.company,
        email: leadForm.email,
        phone: leadForm.phone,
        solution: `Tequila a Granel / Bulk Tequila (${leadForm.tequilaClass.toUpperCase()}) - ${leadForm.volume} L`,
        objective: leadForm.application === "rtd" ? "RTD Canned Cocktails" : "Envasado en el extranjero",
        stage: `Presentación: ${leadForm.containerType} | Destino: ${leadForm.country || "No especificado"}`,
        comments: `Notas: ${leadForm.notes || "Ninguna"}. Solicitud generada desde sitio web oficial de Tequila a Granel Casa Loy (Atención: Fernanda Quintana).`,
        origin: currentLang === "es" ? "granel" : "bulk",
        lead_type: "bulk_tequila"
      };

      const res = await fetch("/api/maquila", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(
          data.error ||
            (currentLang === "es"
              ? "Error al procesar la solicitud. Por favor intenta de nuevo o comunícate vía WhatsApp."
              : "Error submitting request. Please try again or reach out via WhatsApp.")
        );
      }
    } catch (err) {
      console.error("Error submitting bulk lead:", err);
      // Client-side fallback success in case of network issue
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        elementOrSelector: "#cal-inline-granel-scheduler",
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
          branding: { brandColor: "#8C4723" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    }
  }, []);

  // Content Translations
  const content = {
    es: {
      seoTitle: "Tequila a Granel B2B de Calidad & Consistente | Casa Loy · NOM 1633",
      seoDesc: "Tequila a granel 55% Alc. Vol. para envasar en el extranjero y cócteles RTD. Suministro asegurado con 8M plantas de agave propio, 13.5M L de capacidad y coordinación de exportación desde el origen.",

      // Hero
      heroCategory: "PROGRAMA B2B · ALTO VOLUMEN",
      heroTitleLine1: "Tequila a Granel",
      heroTitleLine2: "de Calidad y Consistente.",
      heroSubLine: "Para envasar en el extranjero y cócteles RTD",
      heroQuote: '"Suministro propio. Consistencia a cualquier escala."',
      heroDescLine1: "Destilería familiar NOM 1633 en Los Altos de Jalisco con 8M plantas de agave propio,",
      heroDescLine2: "tecnología europea de destilación continua y coordinación regulatoria",
      heroDescLine3: "integral desde el origen hasta su destino.",
      heroBtn: "Cotizar Programa de Granel →",
      heroBtnSec: "Agendar Llamada Técnica",
      heroDownloadPdf: "Descargar Ficha Técnica PDF",
      pdfFileName: "/CASA_LOY_TEQUILA_A_GRANEL_ES.pdf",

      // Trust Bar
      trustNom: "NOM 1633",
      trustRegion: "ALTOS DE JALISCO",
      trustCrt: "AUTORIZADO POR EL CRT",
      trustFamily: "EMPRESA FAMILIAR",
      trustRoots: "RAÍCES AGAVERAS DESDE 1992",
      trustBatch: "CONTROL POR LOTE",
      trustExport: "COORDINACIÓN DE EXPORTACIÓN",

      // Why Casa Loy for Bulk
      whyEyebrow: "INFRAESTRUCTURA & CERTEZA OPERATIVA",
      whyTitle: "¿Por qué Casa Loy para tu Tequila a Granel?",
      whySub: "Seis pilares industriales que blindan la calidad del destilado, la estabilidad del precio y el cumplimiento regulatorio internacional.",

      // Inside Casa Loy
      insideEyebrow: "INFRAESTRUCTURA INDUSTRIAL",
      insideTitle: "Dentro de Casa Loy",
      insideSub: "Recorre interactivamente las 8 estaciones de destilería, fermentación, maduración y patio de carga de granel en Ayotlán, Jalisco.",

      // Available Bulk Program
      specsEyebrow: "ESPECIFICACIONES INDUSTRIALES",
      specsTitle: "Programa de Granel Disponible",
      specsSub: "Destilado de alta graduación formulado bajo la supervisión permanente del Consejo Regulador del Tequila (CRT).",

      // Strategic Pillars
      pillarsEyebrow: "CÓMO TRABAJAR CON CASA LOY",
      pillarsTitle: "Arquitectura Operativa para Grandes Volúmenes",
      pillarsSub: "Diseñado para distribuidores, importadores y marcas globales que requieren liquidez de abasto y respaldo legal indiscutible.",

      // Simulator
      calcEyebrow: "SIMULADOR DE LOGÍSTICA & RENDIMIENTO",
      calcTitle: "Calculadora de Embarques a Granel",
      calcSub: "Calcula en tiempo real las botellas o latas resultantes, la dilución óptima y los contenedores requeridos a partir de tu volumen a 55% Alc. Vol.",

      // Sustainability & Certifications
      sustainabilityEyebrow: "RESPONSABILIDAD & CUMPLIMIENTO GLOBAL",
      sustainabilityTitle: "Sustentabilidad Integral & Certificaciones Oficiales",
      sustainabilitySub: "Infraestructura circular con energía limpia, composta biológica de vinazas y sellos de exportación oficiales.",

      // Calendar
      calEyebrow: "CONSULTORÍA DIRECTA",
      calTitle: "Agenda una Videollamada Técnica de 30 Minutos",
      calSub: "Conversa directamente con nuestros ingenieros químicos y coordinadores de exportación sobre tu perfil, volumen y cronograma de embarque.",

      // FAQs
      faqEyebrow: "PREGUNTAS FRECUENTES B2B",
      faqTitle: "Certeza Técnica & Regulatoria",
      faqSub: "Respuestas directas sobre la normativa de exportación, certificados de autenticidad, muestras y logística internacional.",
      tabRegulation: "Regulación & CAE",
      tabProfile: "Perfil & Formulación",
      tabLogistics: "Logística & Contratos",

      // Contact & Executive Card
      contactEyebrow: "ATENCIÓN ESPECIALIZADA",
      contactTitle: "Hablemos de Volumen, Perfil y Logística",
      contactSub: "Un especialista técnico evaluará tus requerimientos para estructurar una propuesta económica y operativa en menos de 24 horas hábiles."
    },
    en: {
      seoTitle: "Quality Bulk Tequila B2B Sourcing | Casa Loy · NOM 1633",
      seoDesc: "Consistent 55% ABV bulk tequila for foreign bottling and ready-to-drink (RTD) cocktails. Secured supply with 8M estate agave plants, 13.5M L capacity, and origin export clearance.",

      // Hero
      heroCategory: "B2B HIGH-VOLUME PROGRAM",
      heroTitleLine1: "Bulk Tequila",
      heroTitleLine2: "Quality & Consistency at Scale.",
      heroSubLine: "For foreign bottling and ready-to-drink (RTD) cocktails",
      heroQuote: '"Estate agave supply. Industrial consistency at any scale."',
      heroDescLine1: "Family-owned NOM 1633 distillery in The highlands of Jalisco with 8M estate agave plants,",
      heroDescLine2: "advanced European continuous column distillation, and complete regulatory export",
      heroDescLine3: "coordination from origin to destination.",
      heroBtn: "Request Bulk Quotation →",
      heroBtnSec: "Book a Technical Call",
      heroDownloadPdf: "Download Technical Datasheet PDF",
      pdfFileName: "/CASA_LOY_BULK_TEQUILA_EN.pdf",

      // Trust Bar
      trustNom: "NOM 1633",
      trustRegion: "THE HIGHLANDS OF JALISCO",
      trustCrt: "CRT AUTHORIZED",
      trustFamily: "FAMILY-OWNED",
      trustRoots: "AGAVE ROOTS SINCE 1992",
      trustBatch: "BATCH QA CONTROL",
      trustExport: "EXPORT COORDINATION",

      // Why Casa Loy for Bulk
      whyEyebrow: "INFRASTRUCTURE & OPERATIONAL CERTAINTY",
      whyTitle: "Why Casa Loy for Your Bulk Tequila?",
      whySub: "Six industrial pillars safeguarding liquid consistency, long-term pricing stability, and international regulatory compliance.",

      // Inside Casa Loy
      insideEyebrow: "INDUSTRIAL INFRASTRUCTURE",
      insideTitle: "Inside Casa Loy",
      insideSub: "Take an interactive journey through the 8 stations of our distillery, fermentation, maturation, and bulk export dispatch yard in Ayotlán, Jalisco.",

      // Available Bulk Program
      specsEyebrow: "INDUSTRIAL SPECIFICATIONS",
      specsTitle: "Available Bulk Tequila Program",
      specsSub: "High-proof export distillate manufactured under continuous Consejo Regulador del Tequila (CRT) supervision.",

      // Strategic Pillars
      pillarsEyebrow: "WORKING WITH CASA LOY",
      pillarsTitle: "Operational Architecture for High Volumes",
      pillarsSub: "Engineered for international brand owners, co-packers, and distributors requiring continuous supply security and undisputed legal backing.",

      // Simulator
      calcEyebrow: "LOGISTICS & YIELD SIMULATOR",
      calcTitle: "Bulk Shipment & Yield Calculator",
      calcSub: "Calculate in real time the resulting bottles or cans, proof dilution yield, and required containers based on your projected volume at 55% ABV.",

      // Sustainability & Certifications
      sustainabilityEyebrow: "RESPONSIBILITY & GLOBAL COMPLIANCE",
      sustainabilityTitle: "Comprehensive Sustainability & Official Certifications",
      sustainabilitySub: "Circular infrastructure engineered with solar energy, biological vinaza composting, and verified international export certifications.",

      // Calendar
      calEyebrow: "DIRECT CONSULTATION",
      calTitle: "Schedule a 30-Minute Technical Video Call",
      calSub: "Speak directly with our chemical engineers and export coordinators regarding sensory profile calibration, volume scaling, and dispatch timelines.",

      // FAQs
      faqEyebrow: "B2B FREQUENTLY ASKED QUESTIONS",
      faqTitle: "Technical & Regulatory Certainty",
      faqSub: "Direct answers covering export regulations, certificates of authenticity, sampling, and global freight coordination.",
      tabRegulation: "Regulation & CAE",
      tabProfile: "Profile & Formulation",
      tabLogistics: "Logistics & Contracts",

      // Contact & Executive Card
      contactEyebrow: "DEDICATED ADVISORY",
      contactTitle: "Let's Discuss Volume, Profile & Pricing",
      contactSub: "A technical specialist will review your requirements and provide an operational and economic proposal within 24 business hours."
    }
  };

  const t = content[currentLang] || content.es;

  // 8 Interactive Stations for "Dentro de Casa Loy · Infraestructura de Granel"
  const stations = [
    {
      num: "01",
      tag: currentLang === "es" ? "Agave Propio" : "Estate Agave",
      name: currentLang === "es" ? "Abastecimiento de Agave & Raíces desde 1992" : "Estate Agave & Roots Since 1992",
      desc: currentLang === "es"
        ? "8 millones de plantas de Agave Tequilana Weber Azul cultivadas en 3,600 hectáreas propias en Jalisco, Michoacán y Guanajuato. Blindaje absoluto contra la volatilidad del mercado del agave."
        : "8 million estate-grown Blue Weber Agave plants across 3,600 hectares in Jalisco, Michoacán, and Guanajuato. Complete insulation against open market agave price swings.",
      specs: currentLang === "es" ? ["8M+ Plantas Propias", "3,600 Hectáreas", "Altos de Jalisco"] : ["8M+ Estate Plants", "3,600 Hectares", "Highlands of Jalisco"],
      images: [
        {
          src: "/Campo de Agave Ayotlán Casa Loy Tequilera.webp",
          label: currentLang === "es" ? "Campos de Agave" : "Agave Fields",
          copperTag: currentLang === "es" ? "01 · CULTIVO PROPIO DESDE 1992" : "01 · ESTATE-GROWN AGAVE",
          whiteTag: currentLang === "es" ? "3,600 HECTÁREAS" : "3,600 HECTARES",
          desc: currentLang === "es"
            ? "Campos propios en Los Altos de Jalisco con suelos rojos ricos en hierro, brindando maduración óptima y concentración de azúcares reductores para programas de alto volumen."
            : "Estate fields in The highlands of Jalisco with mineral-rich red clay soil, ensuring optimum maturation and high sugar concentration for high-volume bulk supply.",
          specs: currentLang === "es" ? ["Altos de Jalisco", "Control Agronómico", "Abasto Vitalicio"] : ["Highlands of Jalisco", "Agronomic QA", "Lifelong Supply"]
        },
        {
          src: "/Empleado Jimador Casa Loy Tequilera.webp",
          label: currentLang === "es" ? "Jima & Selección" : "Harvest & Jima",
          copperTag: currentLang === "es" ? "01 · JIMA ARTESANAL" : "01 · ARTISANAL HARVEST",
          whiteTag: currentLang === "es" ? "SELECCIÓN DE PIÑAS" : "PIÑA SELECTION",
          desc: currentLang === "es"
            ? "Cuadrillas propias de jimadores que seleccionan y rasuran las piñas maduras con corte al ras para minimizar ceras y amargores en el destilado final."
            : "Dedicated jimador harvesting crews selecting mature piñas with close shave cuts to minimize waxes and bitter chlorophylls in the final bulk spirit.",
          specs: currentLang === "es" ? ["Jima al Ras", "Cero Clorofilas", "Calidad desde el Campo"] : ["Close Shave", "Zero Chlorophyll", "Field-Level Quality"]
        }
      ]
    },
    {
      num: "02",
      tag: currentLang === "es" ? "Cocimiento" : "Cooking",
      name: currentLang === "es" ? "Autoclaves de Acero & Serpentín de Vapor" : "Stainless Autoclaves & Steam Coils",
      desc: currentLang === "es"
        ? "Cocimiento térmico controlado de alta precisión para maximizar la hidrólisis de inulinas en fructosa pura sin notas ahumadas invasivas ni quemadas."
        : "High-precision thermal cooking maximizing inulin hydrolysis into pure fructose without intrusive smoke or caramel scorching.",
      specs: currentLang === "es" ? ["Autoclaves de Acero", "Hidrólisis Uniforme", "Pureza de Azúcares"] : ["Stainless Autoclaves", "Uniform Hydrolysis", "Pure Sugars"],
      images: [
        {
          src: "/Autoclaves Tequila Casa Loy.jpg",
          label: currentLang === "es" ? "Autoclaves de Acero" : "Stainless Autoclaves",
          copperTag: currentLang === "es" ? "02 · AUTOCLAVES DE ACERO INOXIDABLE" : "02 · STAINLESS STEEL AUTOCLAVES",
          whiteTag: currentLang === "es" ? "COCCIÓN CONTROLADA" : "CONTROLLED COOKING",
          desc: currentLang === "es"
            ? "Inyección directa de vapor limpio con ciclos programables de temperatura y presión, garantizando un perfil limpio, suave y repetible entre lotes continuos."
            : "Direct clean steam injection with programmable pressure/temperature ramps, yielding a clean, smooth, and batch-to-batch repeatable spirit profile.",
          specs: currentLang === "es" ? ["Control Digital", "Perfil Suave & Limpio", "Repetibilidad"] : ["Digital Control", "Clean & Smooth", "Repeatability"]
        },
        {
          src: "/Cocedores Serpentin Vapor Tequila Casa Loy.jpg",
          label: currentLang === "es" ? "Serpentín de Vapor" : "Steam-Coil Cookers",
          copperTag: currentLang === "es" ? "02 · COCEDORES CON SERPENTÍN" : "02 · STEAM-COIL COOKERS",
          whiteTag: currentLang === "es" ? "EFICIENCIA ESCALABLE" : "SCALABLE EFFICIENCY",
          desc: currentLang === "es"
            ? "Método de calentamiento indirecto con serpentín de vapor para jugos de agave, optimizado para escalas de exportación masivas y costo ultra-competitivo."
            : "Indirect steam-coil heating technology for agave juices, engineered for massive export scale and highly competitive unit economics.",
          specs: currentLang === "es" ? ["Eficiencia Térmica", "Costo Optimizado", "Producción Continua"] : ["Thermal Efficiency", "Cost Optimized", "Continuous Volume"]
        }
      ]
    },
    {
      num: "03",
      tag: currentLang === "es" ? "Molienda" : "Milling",
      name: currentLang === "es" ? "Molino de Tornillo & Prensado Continuo" : "Continuous Screw Mill Extraction",
      desc: currentLang === "es"
        ? "Extracción noble inspirada en la enología europea que extrae los jugos sin desgarrar agresivamente la fibra, preservando notas florales y herbáceas frescas."
        : "Gentle extraction inspired by European winemaking that presses agave juices without shredding fibers, preserving delicate floral and fresh herbal notes.",
      specs: currentLang === "es" ? ["Molino de Tornillo", "Extracción Noble", "Claridad de Jugos"] : ["Screw Mill", "Gentle Extraction", "Juice Clarity"],
      images: [
        {
          src: "/Molino Rosh Molienda Agave Casa Loy.jpg",
          label: currentLang === "es" ? "Molino de Tornillo" : "Screw Mill",
          copperTag: currentLang === "es" ? "03 · PRENSADO CONTINUO DE TORNILLO" : "03 · CONTINUOUS SCREW PRESS",
          whiteTag: currentLang === "es" ? "INSPIRACIÓN ENOLÓGICA" : "WINEMAKING INSPIRATION",
          desc: currentLang === "es"
            ? "Prensado continuo y controlado de piñas cocidas. Permite un flujo constante de mostos limpios para abastecer la capacidad anual de 13.5 millones de litros."
            : "Continuous and controlled pressing of cooked agave. Delivers an uninterrupted stream of clear must to feed our 13.5M L annual distillation capacity.",
          specs: currentLang === "es" ? ["Flujo Continuo", "Prensado Suave", "Alto Rendimiento"] : ["Continuous Flow", "Gentle Press", "High Yield"]
        },
        {
          src: "/Molino Desgarrador Agave.jpg",
          label: currentLang === "es" ? "Desgarrado Inicial" : "Initial Shredding",
          copperTag: currentLang === "es" ? "03 · DESGARRADO DE PRECISIÓN" : "03 · PRECISION SHREDDING",
          whiteTag: currentLang === "es" ? "PREPARACIÓN DE FIBRA" : "FIBER PREPARATION",
          desc: currentLang === "es"
            ? "Apertura longitudinal de las fibras de agave que optimiza la liberación de azúcares antes de la extracción de mostos en trenes continuos."
            : "Longitudinal fiber separation optimizing sugar release before must extraction in continuous industrial trains.",
          specs: currentLang === "es" ? ["Apertura de Fibra", "Eficiencia", "Uniformidad"] : ["Fiber Opening", "Efficiency", "Uniformity"]
        }
      ]
    },
    {
      num: "04",
      tag: currentLang === "es" ? "Fermentación" : "Fermentation",
      name: currentLang === "es" ? "Batería de Tanques Cerrados de Acero Inoxidable" : "Closed Stainless Steel Fermentation Battery",
      desc: currentLang === "es"
        ? "Tanques cerrados con camisas de enfriamiento y control automatizado de temperatura para guiar levaduras seleccionadas hacia perfiles limpios y estables."
        : "Closed stainless steel tanks with cooling jackets and automated temperature control, guiding selected yeast strains toward clean, stable profiles.",
      specs: currentLang === "es" ? ["Tanques Cerrados", "Camisas de Enfriamiento", "Levaduras Propias"] : ["Closed Tanks", "Cooling Jackets", "Proprietary Yeasts"],
      images: [
        {
          src: "/Tanques Fermentacion Cerrada Acero Casa Loy.jpg",
          label: currentLang === "es" ? "Tanques Cerrados de Acero" : "Closed Stainless Tanks",
          copperTag: currentLang === "es" ? "04 · FERMENTACIÓN CERRADA INDUSTRIAL" : "04 · CLOSED INDUSTRIAL FERMENTATION",
          whiteTag: currentLang === "es" ? "ESTABILIDAD MICROBIOLÓGICA" : "MICROBIOLOGICAL STABILITY",
          desc: currentLang === "es"
            ? "Control microbiológico estricto que previene desviaciones sensoriales. Cada tanque genera un mosto fermentado perfectamente balanceado para destilación continua."
            : "Strict microbiological control preventing sensory drift. Each tank produces a perfectly balanced wash ready for continuous column distillation.",
          specs: currentLang === "es" ? ["Cero Contaminación", "Perfil Controlado", "Estabilidad entre Lotes"] : ["Zero Contamination", "Controlled Profile", "Batch Stability"]
        },
        {
          src: "/Fermentación.webp",
          label: currentLang === "es" ? "Monitoreo de Cinética" : "Kinetic Monitoring",
          copperTag: currentLang === "es" ? "04 · CINÉTICA FERMENTATIVA" : "04 · FERMENTATION KINETICS",
          whiteTag: currentLang === "es" ? "CONTROL DE GRADO BRIX" : "BRIX DENSITY CONTROL",
          desc: currentLang === "es"
            ? "Medición de temperatura y consumo de azúcares hora tras hora hasta lograr la atenuación alcohólica perfecta antes del paso a columnas."
            : "Hourly monitoring of temperature and sugar consumption until reaching precise alcohol attenuation before moving into columns.",
          specs: currentLang === "es" ? ["Brix Control", "Atenuación Óptima", "Monitoreo Horario"] : ["Brix Control", "Optimal Attenuation", "Hourly QA"]
        }
      ]
    },
    {
      num: "05",
      tag: currentLang === "es" ? "Destilación" : "Distillation",
      name: currentLang === "es" ? "Destilación Continua con Tecnología Europea" : "Continuous Distillation with European Technology",
      desc: currentLang === "es"
        ? "Columnas de destilación continua de alta precisión para separar cabezas y colas con exactitud matemática, logrando 55% Alc. Vol. ultra limpio."
        : "High-precision continuous distillation columns separating heads and tails with mathematical accuracy, producing an ultra-clean 55% ABV distillate.",
      specs: currentLang === "es" ? ["Columnas Continuas", "Tecnología Europea", "55% Alc. Vol."] : ["Continuous Columns", "European Technology", "55% ABV"],
      images: [
        {
          src: "/Columnas Destilacion Tequila Casa Loy.jpg",
          label: currentLang === "es" ? "Columnas Continuas" : "Continuous Columns",
          copperTag: currentLang === "es" ? "05 · TECNOLOGÍA EUROPEA DE DESTILACIÓN" : "05 · EUROPEAN DISTILLATION TECH",
          whiteTag: currentLang === "es" ? "55% ALC. VOL. DE EXPORTACIÓN" : "55% ABV EXPORT PROOF",
          desc: currentLang === "es"
            ? "Diseñadas específicamente para producir tequila a granel con perfil limpio, repetible y sin notas agresivas, ideal para envasar en destino o para formular cócteles RTD."
            : "Engineered specifically to yield bulk tequila with a clean, repeatable, congener-balanced profile ideal for destination bottling or RTD formulation.",
          specs: currentLang === "es" ? ["Alta Graduación", "Separación de Congéneres", "Escala de Exportación"] : ["High Proof", "Congener Separation", "Export Scale"]
        },
        {
          src: "/Alambiques Acero Inoxidable Platillos Cobre Casa Loy.jpg",
          label: currentLang === "es" ? "Platillos de Cobre" : "Copper Plates",
          copperTag: currentLang === "es" ? "05 · REACCIÓN CON COBRE PURO" : "05 · PURE COPPER REACTION",
          whiteTag: currentLang === "es" ? "ELIMINACIÓN DE SULFUROS" : "SULFIDE ELIMINATION",
          desc: currentLang === "es"
            ? "Platillos internos de cobre que catalizan vapores alcohólicos y eliminan compuestos sulfurosos volátiles, garantizando frescura y elegancia organoléptica."
            : "Internal copper plates catalyzing spirit vapors and scrubbing volatile sulfide compounds, ensuring aromatic freshness and silky mouthfeel.",
          specs: currentLang === "es" ? ["Cobre Puro", "Cero Sulfuros", "Textura Sedosa"] : ["Pure Copper", "Zero Sulfides", "Silky Texture"]
        }
      ]
    },
    {
      num: "06",
      tag: currentLang === "es" ? "Maduración" : "Maturation",
      name: currentLang === "es" ? "Cava Subterránea & Granel Reposado" : "Underground Cellars & Bulk Reposado",
      desc: currentLang === "es"
        ? "Capacidad de 1.2 millones de litros en barricas de Roble Blanco Americano para suministrar Tequila a Granel clase Reposado con notas amaderadas genuinas."
        : "1.2 Million liters capacity in American White Oak casks supplying genuine Reposado Bulk Tequila with natural oak, vanilla, and toasted notes.",
      specs: currentLang === "es" ? ["Roble Blanco Americano", "Maduración Genuina", "Microclima Controlado"] : ["American White Oak", "Authentic Maturation", "Controlled Cellar"],
      images: [
        {
          src: "/Pasillo Cava de Añejamiento.webp",
          label: currentLang === "es" ? "Cava de Barricas" : "Barrel Cellar",
          copperTag: currentLang === "es" ? "06 · CAVA SUBTERRÁNEA CLIMATIZADA" : "06 · CLIMATE-CONTROLLED CELLAR",
          whiteTag: currentLang === "es" ? "1.2 MILLONES DE LITROS" : "1.2 MILLION LITERS",
          desc: currentLang === "es"
            ? "Bóveda subterránea con humedad relativa y temperatura estables todo el año para programas de Tequila Reposado a Granel con maduración auditada por el CRT."
            : "Underground vaulted cellar maintaining stable humidity and temperature year-round for Reposado Bulk programs audited by the CRT.",
          specs: currentLang === "es" ? ["Maduración Estable", "Auditoría CRT", "Perfil Roble Auténtico"] : ["Steady Aging", "CRT Audited", "Authentic Oak Profile"]
        },
        {
          src: "/Cava de Añejamiento.webp",
          label: currentLang === "es" ? "Selección de Roble" : "Oak Selection",
          copperTag: currentLang === "es" ? "06 · BARRICAS DE ROBLE AMERICANO" : "06 · AMERICAN OAK CASKS",
          whiteTag: currentLang === "es" ? "PERFIL REPOSADO A MEDIDA" : "BESPOKE REPOSADO PROFILE",
          desc: currentLang === "es"
            ? "Tostados ligeros y medios que aportan balance de vainilla, caramelo sutil y especias dulces para programas de exportación de alto valor."
            : "Light and medium toasts providing natural vanilla, subtle caramel, and sweet spice balance for high-value export programs.",
          specs: currentLang === "es" ? ["Roble Americano", "Tostado Medio", "Complejidad Suave"] : ["American Oak", "Medium Toast", "Smooth Complexity"]
        }
      ]
    },
    {
      num: "07",
      tag: currentLang === "es" ? "Laboratorio & CRT" : "QA Lab & CRT",
      name: currentLang === "es" ? "Laboratorio de Control Fisicoquímico & Aprobación CRT" : "In-House Analytical QA Lab & CRT Clearance",
      desc: currentLang === "es"
        ? "Cromatografía de gases, control de alcoholimetría y emisión de certificados fisicoquímicos oficiales lote por lote para tramitar el Certificado de Aprobación de Envasado (CAE)."
        : "Gas chromatography, alcohol proofing, and official batch analysis certificates to issue the Bottling Approval Certificate (CAE) from the CRT.",
      specs: currentLang === "es" ? ["Cromatografía de Gases", "Certificado por Lote", "CAE CRT Inmediato"] : ["Gas Chromatography", "Batch Analysis", "Instant CRT CAE"],
      images: [
        {
          src: "/Laboratorio Maquilas.webp",
          label: currentLang === "es" ? "Laboratorio Analítico" : "Analytical Lab",
          copperTag: currentLang === "es" ? "07 · LABORATORIO INTERNO CERTIFICADO" : "07 · CERTIFIED IN-HOUSE TESTING",
          whiteTag: currentLang === "es" ? "CROMATOGRAFÍA DE GASES" : "GAS CHROMATOGRAPHY",
          desc: currentLang === "es"
            ? "Medición exacta de metanol, alcoholes superiores, ésteres y acidez conforme a la NOM-006-SCFI-2012 y normativas aduaneras de EE.UU. (TTB) y Europa."
            : "Exact measurement of methanol, higher alcohols, esters, and acidity complying with NOM-006-SCFI-2012, US TTB, and European customs thresholds.",
          specs: currentLang === "es" ? ["NOM-006", "Conforme TTB / UE", "Trazabilidad Total"] : ["NOM-006", "TTB / EU Compliant", "Full Traceability"]
        },
        {
          src: "/Recorrido Diamante Cava Cata.webp",
          label: currentLang === "es" ? "Validación Sensorial" : "Sensory Validation",
          copperTag: currentLang === "es" ? "07 · PANEL ORGANOLÉPTICO" : "07 · ORGANOLEPTIC PANEL",
          whiteTag: currentLang === "es" ? "HOMOLOGACIÓN DE PERFIL" : "PROFILE HOMOLOGATION",
          desc: currentLang === "es"
            ? "Muestras patrón guardadas bajo custodia para validar que cada despacho a granel replique idénticamente el perfil organoléptico aprobado por el cliente."
            : "Retained reference samples kept under chain of custody to verify every bulk dispatch matches the customer's approved organoleptic profile.",
          specs: currentLang === "es" ? ["Muestras Patrón", "Cero Desviación", "Firma Sensorial"] : ["Reference Samples", "Zero Drift", "Sensory Signature"]
        }
      ]
    },
    {
      num: "08",
      tag: currentLang === "es" ? "Isotanques & Carga" : "Isotanks & Dispatch",
      name: currentLang === "es" ? "Patio de Carga, Isotanques & Contenedores IBC Totes" : "Dispatch Yard, Isotanks & IBC Totes",
      desc: currentLang === "es"
        ? "Carga en autotanques, Isotanques intermodales (21,000–26,000 L) y Contenedores IBC Totes grado alimenticio (1,040–1,250 L) con precintos de seguridad CRT."
        : "Loading dedicated tankers, intermodal Isotanks (21,000–26,000 L), and food-grade IBC Totes (1,040–1,250 L) sealed under official CRT regulatory inspection.",
      specs: currentLang === "es" ? ["Isotanques (24K L)", "IBC Totes (1,000 L)", "Precintos Oficiales CRT"] : ["Isotanks (24K L)", "IBC Totes (1,000 L)", "Official CRT Seals"],
      images: [
        {
          src: "/granel-hero-operario.webp",
          label: currentLang === "es" ? "Inspección de Carga" : "Loading Inspection",
          copperTag: currentLang === "es" ? "08 · INSPECCIÓN & LLENADO INDUSTRIAL" : "08 · INDUSTRIAL FILLING & INSPECTION",
          whiteTag: currentLang === "es" ? "GRADO ALIMENTICIO" : "FOOD-GRADE TANKS",
          desc: currentLang === "es"
            ? "Inspección previa de limpieza e higienización del contenedor, conexión estéril de mangueras y bombeo volumétrico con supervisión presencial del CRT."
            : "Pre-load sanitization inspection of tanks, sanitary closed hose coupling, and volumetric dosing supervised on-site by CRT regulatory inspectors.",
          specs: currentLang === "es" ? ["Supervisión CRT", "Bombeo Sanitario", "Control de Merma"] : ["CRT Supervision", "Sanitary Pumping", "Shrinkage Control"]
        },
        {
          src: "/Naves Industriales Casa Loy Tequilera.webp",
          label: currentLang === "es" ? "Patio de Exportación" : "Export Dispatch Yard",
          copperTag: currentLang === "es" ? "08 · PATIO LOGÍSTICO EXW" : "08 · EXW LOGISTICS YARD",
          whiteTag: currentLang === "es" ? "ACCESO CARRETERO PESADO" : "HEAVY TRUCK ACCESS",
          desc: currentLang === "es"
            ? "Amplias naves industriales y patio de maniobras en Ayotlán para tractocamiones y semirremolques con conexión directa a corredores carreteros hacia Manzanillo y la frontera norte."
            : "Extensive industrial yard in Ayotlán designed for semi-trailers with fast access to major freight corridors towards Manzanillo seaport and US northern border.",
          specs: currentLang === "es" ? ["Patio de Maniobras", "Ruta Manzanillo / Laredo", "Despacho Ágil"] : ["Maneuver Yard", "Seaport / Border Route", "Fast Dispatch"]
        }
      ]
    }
  ];

  // FAQ Categories for Granel
  const faqData = {
    regulation: [
      {
        q: currentLang === "es"
          ? "¿Por qué el Tequila Mixto es la categoría oficial que permite envasar en el extranjero?"
          : "Why is Mixto Tequila the official category permitted for foreign bottling?",
        a: currentLang === "es"
          ? "Por la legislación federal mexicana y la Norma Oficial del Tequila (NOM-006-SCFI), el Tequila 100% de Agave debe ser obligatoriamente envasado dentro de la zona de Denominación de Origen en territorio mexicano. El Tequila Mixto (51% azúcares de agave azul y 49% otros azúcares estándar) es la única categoría legal autorizada para ser transportada a granel y embotellada fuera de México con la palabra oficial 'Tequila'."
          : "Under Mexican federal law and NOM-006-SCFI, 100% Agave Tequila must be bottled strictly within the designated Denomination of Origin territory in Mexico. Standard Mixto Tequila (minimum 51% blue agave sugars and 49% other sugars) is the official category legally authorized to be exported in bulk and bottled abroad carrying the registered 'Tequila' appellation."
      },
      {
        q: currentLang === "es"
          ? "¿Qué es el CAE y cómo tramita Casa Loy la autorización de exportación ante el CRT?"
          : "What is the CAE and how does Casa Loy process export clearance with the CRT?",
        a: currentLang === "es"
          ? "El Certificado de Aprobación de Envasado (CAE) es el documento oficial expedido por el Consejo Regulador del Tequila (CRT) que avala que el envasador en el extranjero está debidamente registrado y vinculado con Casa Loy (NOM 1633). Nosotros coordinamos el Convenio de Corresponsabilidad y gestionamos el CAE para que tu embarque no sufra detenciones aduanales."
          : "The Bottling Approval Certificate (CAE) is the official document issued by Mexico's CRT certifying that the foreign co-packer is legally linked to Casa Loy (NOM 1633). We coordinate the Bilateral Agreement and handle the CAE filing directly with the CRT to ensure seamless customs clearance."
      },
      {
        q: currentLang === "es"
          ? "¿Cómo nos ayudan a evitar rechazos de etiqueta ante la TTB en EE.UU. u otros países?"
          : "How do you help us prevent label rejections with the US TTB and international authorities?",
        a: currentLang === "es"
          ? "Antes de imprimir etiquetas y antes de envasar, nuestro equipo legal y técnico revisa el borrador de tu etiqueta (COLA ante la TTB en EE.UU., Food Standards en Reino Unido/UE). Verificamos el tamaño de fuente de 'Tequila', las leyendas sanitarias, el grado alcohólico y la mención de la NOM 1633 para garantizar su aprobación."
          : "Prior to packaging and printing, our compliance team reviews your draft label (TTB COLA in the US, EU Food Standards). We verify exact font hierarchy for 'Tequila', mandatory health warnings, proof statements, and NOM 1633 declarations to guarantee official clearance."
      }
    ],
    profile: [
      {
        q: currentLang === "es"
          ? "¿Cuál es la graduación alcohólica estándar y cómo beneficia el flete internacional?"
          : "What is the standard proof and how does it optimize international freight costs?",
        a: currentLang === "es"
          ? "El granel se exporta a 55% Alc. Vol. (110 Proof), que es el límite máximo permitido por la NOM-006. Esto genera un ahorro logístico masivo: en lugar de pagar flete marítimo y terrestre por agua de dilución, transportas concentrado puro. En destino, tu envasador hidrata el tequila a 40% o 38% Alc. Vol., obteniendo hasta un 37.5% más de botellas comerciales por litro transportado."
          : "Bulk tequila is exported at 55% ABV (110 Proof), the legal ceiling under NOM-006. This creates significant freight savings: rather than paying intermodal freight for water, you transport high-proof spirit. At destination, your co-packer dilutes it to 40% or 38% ABV, yielding up to 37.5% more finished bottles per liter shipped."
      },
      {
        q: currentLang === "es"
          ? "¿Podemos formular el destilado a la medida o adaptarlo a cócteles enlatados RTD?"
          : "Can we formulate a tailored distillate or adapt it for ready-to-drink (RTD) canned cocktails?",
        a: currentLang === "es"
          ? "Totalmente. Para marcas con perfiles sensoriales definidos, nuestros ingenieros químicos replican tu muestra de referencia. Para cócteles listos para beber (RTD), proveemos un perfil limpio, fresco y cítrico que se integra perfectamente con carbonatación, jugos naturales y mixers sin enturbiamientos."
          : "Yes. For brand owners with specific target profiles, our chemical engineers match reference samples. For ready-to-drink (RTD) cocktails, we supply a clean, crisp, citrus-forward distillate that blends seamlessly with carbonation and fruit juices without turbidity."
      },
      {
        q: currentLang === "es"
          ? "¿Suministran muestras antes de cerrar el contrato de suministro?"
          : "Do you supply pre-shipment lab samples prior to contract execution?",
        a: currentLang === "es"
          ? "Sí. Tras la llamada técnica inicial con Fernanda Quintana y la definición del volumen objetivo, preparamos y enviamos un kit oficial de muestras de Blanco y/o Reposado a 55% Alc. Vol. con su respectiva ficha técnica y cromatografía de gases para evaluación en tu laboratorio o planta de envasado."
          : "Yes. Following an initial technical review with Fernanda Quintana, we prepare and dispatch official sample kits of Blanco and/or Reposado at 55% ABV accompanied by complete gas chromatography and certificates of analysis for evaluation."
      }
    ],
    logistics: [
      {
        q: currentLang === "es"
          ? "¿Cuáles son las presentaciones de contenedor y términos de entrega (Incoterms)?"
          : "What are the container options and delivery Incoterms?",
        a: currentLang === "es"
          ? "Manejamos Isotanques intermodales (21,000 a 26,000 Litros) y Contenedores IBC Totes grado alimenticio (1,040 a 1,250 Litros). El término base de venta es Ex Works (EXW) en nuestra planta en Ayotlán, Jalisco. No obstante, te asistimos coordinando con tu agente de carga internacional preferido o cotizando flete FOB Manzanillo / Altamira / Laredo."
          : "We dispatch intermodal Isotanks (21,000 to 26,000 Liters) and food-grade IBC Totes (1,040 to 1,250 Liters). Our standard baseline term is Ex Works (EXW) Ayotlán, Jalisco. However, we actively coordinate with your chosen freight forwarder and can quote FOB Manzanillo / Altamira or border transfer."
      },
      {
        q: currentLang === "es"
          ? "¿Cuál es el tiempo de entrega y cómo garantizan estabilidad de abasto continuo?"
          : "What is the lead time and how do you guarantee continuous supply stability?",
        a: currentLang === "es"
          ? "Para programas formalizados con pronósticos mensuales o trimestrales, la disponibilidad de carga es de 20 días hábiles (o inmediata con inventario de seguridad). Al contar con 8 millones de plantas de agave propio cultivadas desde 1992 y 13.5M L de capacidad anual, no dependemos de terceros ni sufrimos paros por escasez de agave."
          : "For established programs with rolling forecasts, loading turnaround is 20 business days (or immediate under safety stock agreements). With 8 million estate agave plants cultivated since 1992 and 13.5M L annual capacity, we are completely self-sufficient and never vulnerable to market agave shortages."
      }
    ]
  };

  // Yield Calculator Math based on selected calcVolume
  // 55% ABV to 40% ABV in 750ml bottles:
  const bottles40 = Math.round((calcVolume * (55 / 40)) / 0.75);
  // 55% ABV to 5% RTD in 355ml cans:
  const cans5 = Math.round((calcVolume * (55 / 5)) / 0.355);
  // Containers:
  const isotanksRequired = Math.ceil(calcVolume / 24000);
  const ibcTotesRequired = Math.ceil(calcVolume / 1000);

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18]">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url={currentLang === "es" ? "/granel" : "/bulk"}
      />

      {/* ============================================================
          §1. HERO BANNER (Estética cinematográfica, idéntica a MaquilasV3)
          ============================================================ */}
      <section className="relative min-h-screen w-full bg-zinc-950 overflow-hidden flex items-center">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              alt="Casa Loy Tequilera Granel Background"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out brightness-[0.78] ${
                heroImageIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
              src={src}
              fetchPriority={idx === 0 ? "high" : "low"}
            />
          ))}
          {/* Exact Gradients from MaquilasV3 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Left-Aligned Content Container */}
        <div className="relative z-20 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto w-full pt-28 sm:pt-32 pb-16">
          <div className="max-w-2xl lg:max-w-3xl text-left space-y-3.5 sm:space-y-4 animate-slide-left-right">
            {/* Top Pill Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-navigation text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#FDA377] font-semibold bg-black/40 px-3 py-1 border border-[#8C4723]/50">
                {t.heroCategory}
              </span>
              <span className="font-navigation text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.25em] text-white/80 bg-white/10 px-2.5 py-1 border border-white/20">
                NOM 1633 CRT
              </span>
            </div>

            {/* Title with enlarged bold top lines + less-bold subtitle lines */}
            <h1 className="font-serif leading-[1.08] tracking-tight text-white [text-shadow:_0_2px_14px_rgba(0,0,0,0.85)]">
              <span className="block font-medium text-[clamp(28px,3.8vw,52px)]">
                {t.heroTitleLine1}
              </span>
              <span className="block font-medium text-[clamp(28px,3.8vw,52px)]">
                {t.heroTitleLine2}
              </span>
              <span className="block font-light text-white/90 text-[clamp(18px,2.2vw,30px)] mt-1.5 sm:mt-2.5 leading-[1.16]">
                {t.heroSubLine}
              </span>
            </h1>

            {/* Italic Vision Quote */}
            <div className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#FDA377] font-normal tracking-wide [text-shadow:_0_2px_12px_rgba(0,0,0,0.85)]">
              {t.heroQuote}
            </div>

            {/* Description Subtitle structured in exactly 3 lines */}
            <p className="font-body-lg text-white/95 font-light leading-relaxed text-xs sm:text-[13px] md:text-sm pt-0.5 [text-shadow:_0_2px_10px_rgba(0,0,0,0.85)] max-w-xl">
              <span className="block">{t.heroDescLine1}</span>
              <span className="block">{t.heroDescLine2}</span>
              <span className="block">{t.heroDescLine3}</span>
            </p>

            {/* Action Buttons matching MaquilasV3 official styling */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-center pt-2">
              <a
                href="#cotizar"
                className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3 px-7 transition-all duration-500 min-w-[180px] sm:min-w-[210px] text-center shadow-lg rounded-none cursor-pointer"
              >
                {t.heroBtn}
              </a>
              <a
                href="#agenda-llamada"
                className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3 px-7 transition-all duration-500 min-w-[180px] sm:min-w-[210px] text-center rounded-none cursor-pointer"
              >
                {t.heroBtnSec}
              </a>
              <a
                href={t.pdfFileName}
                download
                className="border border-[#FDA377]/60 hover:bg-white/15 text-[#FDA377] hover:text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-5 transition-all duration-500 text-center rounded-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>PDF</span>
              </a>
            </div>

            {/* Carousel Slide Indicators */}
            <div className="flex items-center gap-2 pt-3">
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

      {/* TRUST BAR (NOM 1633 · ALTOS DE JALISCO · CRT · AGAVE ROOTS SINCE 1992 · BATCH CONTROL · EXPORT COORDINATION) */}
      <div className="bg-[#F6F2EA] border-y border-[#1c1c18]/10 py-3.5 sm:py-4 shadow-sm">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 sm:gap-x-6 text-center">
            <span className="font-navigation text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#8C4723]">
              {t.trustNom}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden sm:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustCrt}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden sm:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustRegion}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
            <span className="font-navigation text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#1c1c18]">
              {t.trustFamily}
            </span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
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
          §2. POR QUÉ CASA LOY PARA TEQUILA A GRANEL (6 Sharp Cards)
          ============================================================ */}
      <section className="py-12 sm:py-16 bg-[#fcf9f3] flex flex-col justify-center border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.whyEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.whyTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.whySub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 01 Agave Propio */}
            <Reveal delay={100}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Abastecimiento" : "Supply"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">01</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "8 Millones de Plantas Propias" : "8 Million Estate Agave Plants"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Cultivo en tierras propias desde 1992. Blindamos el costo por litro y aseguramos suministro constante sin intermediarios agrícolas."
                      : "Estate farming since 1992 across 3,600 hectares, providing pricing stability and uninterrupted long-term supply."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 02 Capacidad Industrial */}
            <Reveal delay={150}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Capacidad" : "Capacity"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">02</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "13.5 Millones de Litros Anuales" : "13.5 Million Liters Annually"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Naves industriales automatizadas con tecnología europea para sostener programas masivos de exportación sin contratiempos de volumen."
                      : "Modern automated distillery with European equipment engineered to support massive multinational export contracts seamlessly."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 03 Tecnología en Columna */}
            <Reveal delay={200}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Destilación" : "Distillation"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">03</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "Destilación Continua en Columna" : "Continuous Column Distillation"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Perfil sensorial limpio, con separación precisa de congéneres a 55% Alc. Vol., perfecto para envasar en el extranjero o para bases RTD."
                      : "Clean sensory profile with strict congener separation at 55% ABV (110 Proof), optimal for foreign bottling or premium RTD bases."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 04 Respaldo Regulatorio */}
            <Reveal delay={250}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Cumplimiento" : "Compliance"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">04</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "NOM 1633 & Certificación CAE" : "NOM 1633 & Official CAE"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Acompañamiento integral ante el CRT: Convenio de Vinculación, Certificado de Aprobación de Envasado (CAE) y trazabilidad aduanal completa."
                      : "End-to-end CRT regulatory coordination: Bilateral Agreement, Bottling Approval Certificate (CAE), and full customs traceability."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 05 Eficiencia Logística */}
            <Reveal delay={300}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Logística" : "Logistics"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">05</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "Isotanques e IBC Totes EXW" : "Isotanks & IBC Totes EXW"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Presentaciones industriales en Isotanques (21,000–26,000 L) y Totes (1,040–1,250 L) con inspección y precintos de seguridad CRT en origen."
                      : "Intermodal Isotanks (21,000–26,000 L) and IBC Totes (1,040–1,250 L) sealed under rigorous CRT supervision at our Ayotlán loading bay."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 06 Control de Calidad */}
            <Reveal delay={350}>
              <div className="p-5 sm:p-6 bg-white border border-[#1c1c18]/10 flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723]/50 hover:shadow-md rounded-none h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.25em] font-bold">
                      {currentLang === "es" ? "Certidumbre" : "Certainty"}
                    </span>
                    <span className="font-serif text-lg font-light text-[#8C4723]/60">06</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2 leading-snug">
                    {currentLang === "es" ? "Cromatografía de Gases por Lote" : "Batch Gas Chromatography QA"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Laboratorio analítico propio para verificar parámetros fisicoquímicos antes de liberar cada embarque, garantizando cero variación."
                      : "State-of-the-art analytical laboratory verifying proof, methanol, and congeners before releasing every single container."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §3. DENTRO DE CASA LOY · INFRAESTRUCTURA DE GRANELES (Cinema Interactive Showcase)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#F6F2EA] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          {/* Header */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-navigation text-[clamp(10px,1vw,12px)] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                  {t.insideEyebrow}
                </span>
                <h2 className="font-serif text-[clamp(24px,3vw,42px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight">
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
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] max-h-[420px] rounded-none overflow-hidden border border-[#1c1c18]/15 shadow-md bg-black group mb-4">
              {(() => {
                const currentStation = stations[activeStation];
                const currentImgObj =
                  currentStation.images?.[activeStationImage] ||
                  currentStation.images?.[0] || {
                    src: currentStation.img,
                    label: currentStation.name
                  };

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
                            setActiveStationImage((prev) =>
                              prev === 0 ? currentStation.images.length - 1 : prev - 1
                            );
                          }}
                          aria-label="Previous Image"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#8C4723] text-white border border-white/20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStationImage((prev) =>
                              prev === currentStation.images.length - 1 ? 0 : prev + 1
                            );
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
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-navigation text-[10.5px] sm:text-[12px] text-white uppercase tracking-[0.2em] bg-[#8C4723] px-3 py-0.5 font-semibold inline-block rounded-none shadow-sm">
                            {currentImgObj.copperTag ||
                              `${currentStation.num} · ${currentImgObj.tag || currentStation.tag}`}
                          </span>
                          {(currentImgObj.whiteTag || currentImgObj.label) && (
                            <span className="font-navigation text-[10.5px] sm:text-[12px] text-white uppercase tracking-wider bg-white/15 backdrop-blur-md px-2.5 py-0.5 border border-white/20 inline-block rounded-none shadow-sm">
                              {currentImgObj.whiteTag || currentImgObj.label}
                            </span>
                          )}
                        </div>
                        <p className="font-body-md text-white/90 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                          {currentImgObj.desc || currentStation.desc}
                        </p>
                      </div>

                      {/* Specs Pills */}
                      <div className="flex flex-wrap sm:flex-col gap-1.5 sm:items-end">
                        {(currentImgObj.specs || currentStation.specs).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="font-navigation text-[9px] sm:text-[10px] uppercase tracking-wider text-white bg-white/15 backdrop-blur-md px-2.5 py-0.5 border border-white/20 rounded-none"
                          >
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
                  <span
                    className={`font-navigation text-[9px] sm:text-[10px] font-bold ${
                      activeStation === idx ? "text-[#ffdbc7]" : "text-[#8C4723]"
                    }`}
                  >
                    {s.num}
                  </span>
                  {activeStation === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffdbc7] animate-pulse"></span>
                  )}
                </div>
                <div className="font-serif text-xs sm:text-sm font-light truncate">{s.tag}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §4. ESPECIFICACIONES INDUSTRIALES DEL PROGRAMA DE GRANEL (3 Cards)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.specsEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.specsTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.specsSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 01: Blanco */}
            <Reveal delay={100}>
              <div className="p-6 sm:p-7 border-2 border-[#8C4723] bg-white flex flex-col justify-between transition-all duration-500 hover:shadow-xl rounded-none relative h-full">
                <span className="absolute -top-3 right-6 bg-[#8C4723] text-white font-navigation text-[9px] uppercase tracking-[0.25em] px-3 py-0.5 font-semibold rounded-none shadow-sm">
                  {currentLang === "es" ? "Alta Demanda" : "Top Volume"}
                </span>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#8C4723] font-serif text-2xl font-light">01</span>
                    <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-wider font-bold">
                      55% Alc. Vol.
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {currentLang === "es" ? "Tequila Mixto Blanco" : "Mixto Tequila Blanco"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Destilado fresco, limpio y brillante. Con notas herbáceas sutiles y cítricas. Ideal para envasado directo en destino o formulación de cócteles RTD."
                      : "Fresh, bright, and congener-clean spirit. Crisp agave notes and citrus finish. Ideal for foreign bottle packaging and canned RTD cocktails."}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-[#1c1c18]/10 text-xs font-navigation text-[#53443a]">
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Composición:" : "Composition:"}</span>
                      <span>51% Agave / 49% Azúcares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Graduación:" : "Proof:"}</span>
                      <span>55% ABV (110 Proof)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Envase:" : "Format:"}</span>
                      <span>Isotanque / Totes IBC</span>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <a
                    href="#cotizar"
                    onClick={() => {
                      setLeadForm((prev) => ({ ...prev, tequilaClass: "blanco" }));
                    }}
                    className="w-full block bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none shadow-sm cursor-pointer"
                  >
                    {currentLang === "es" ? "Cotizar Blanco" : "Quote Blanco"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Card 02: Reposado */}
            <Reveal delay={150}>
              <div className="p-6 sm:p-7 border border-[#1c1c18]/15 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-xl rounded-none relative h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#8C4723] font-serif text-2xl font-light">02</span>
                    <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-wider font-bold">
                      55% Alc. Vol.
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {currentLang === "es" ? "Tequila Mixto Reposado" : "Mixto Tequila Reposado"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Madurado en barricas de Roble Blanco Americano en nuestra cava subterránea. Matices sutiles de vainilla, caramelo ligero y madera tostada."
                      : "Aged in American White Oak casks inside our climate-controlled underground cellar. Smooth tones of natural vanilla, light caramel, and toasted oak."}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-[#1c1c18]/10 text-xs font-navigation text-[#53443a]">
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Maduración:" : "Aging:"}</span>
                      <span>{currentLang === "es" ? "Mínimo 2 meses en roble" : "Min. 2 months in oak"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Graduación:" : "Proof:"}</span>
                      <span>55% ABV (110 Proof)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Envase:" : "Format:"}</span>
                      <span>Isotanque / Totes IBC</span>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <a
                    href="#cotizar"
                    onClick={() => {
                      setLeadForm((prev) => ({ ...prev, tequilaClass: "reposado" }));
                    }}
                    className="w-full block bg-stone-900 hover:bg-[#8C4723] text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none shadow-sm cursor-pointer"
                  >
                    {currentLang === "es" ? "Cotizar Reposado" : "Quote Reposado"}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Card 03: Perfil a Medida */}
            <Reveal delay={200}>
              <div className="p-6 sm:p-7 border border-[#1c1c18]/15 bg-white flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-xl rounded-none relative h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#8C4723] font-serif text-2xl font-light">03</span>
                    <span className="font-navigation text-[10px] text-[#8C4723] uppercase tracking-wider font-bold">
                      Tailored
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18] mb-2">
                    {currentLang === "es" ? "Perfil a Medida / RTD" : "Tailored Profile / RTD Base"}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light leading-relaxed mb-4 text-xs sm:text-sm">
                    {currentLang === "es"
                      ? "Formulación líquida calibrada para maridar con mixers, gaseosas o perfiles de autor. Replicamos tu muestra analítica con cromatografía."
                      : "Custom sensory calibration engineered for carbonated RTD canned cocktails or author blends, matched via gas chromatography analysis."}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-[#1c1c18]/10 text-xs font-navigation text-[#53443a]">
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Aplicación:" : "Application:"}</span>
                      <span>RTD Canned Cocktails</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Pruebas:" : "Sampling:"}</span>
                      <span>{currentLang === "es" ? "Kits de laboratorio disponibles" : "Lab sample kits available"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{currentLang === "es" ? "Acuerdo:" : "Agreement:"}</span>
                      <span>NDA de Confidencialidad</span>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <a
                    href="#agenda-llamada"
                    className="w-full block border border-[#8C4723] hover:bg-[#8C4723] text-[#8C4723] hover:text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-2.5 text-center transition-all duration-500 rounded-none shadow-sm cursor-pointer"
                  >
                    {currentLang === "es" ? "Consultar Perfil" : "Consult Custom Profile"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5. CERTEZA DE ABASTO & CAPACIDAD (Animated Easing Counters)
          ============================================================ */}
      <section ref={statsRef} className="py-14 sm:py-16 bg-[#141C1B] text-white">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#FDA377] uppercase tracking-[0.35em] font-semibold block mb-1">
                {currentLang === "es" ? "SUMINISTRO PROPIO & CERTEZA DE ORIGEN" : "ESTATE SUPPLY & CERTAINTY OF ORIGIN"}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,40px)] font-light text-white leading-tight mb-2">
                {currentLang === "es"
                  ? "Blindaje Agrícola e Industrial para tu Marca"
                  : "Agricultural & Industrial Shield for Your Brand"}
              </h2>
              <p className="font-body-lg text-white/80 font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {currentLang === "es"
                  ? "Casa Loy Tequilera es una productora familiar en Ayotlán, en los Altos de Jalisco. Cultivamos agave desde 1992, mucho antes de destilar nuestro primer litro."
                  : "Casa Loy Tequilera is a family-owned producer in Ayotlán, The highlands of Jalisco. We have cultivated agave since 1992, long before distilling our first liter."}
              </p>
            </div>
          </Reveal>

          {/* 4 Counters Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-y border-white/10 py-10">
            {/* Counter 1: Capacity */}
            <div className="space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FDA377] tracking-tight">
                {counters.capacity}M
              </div>
              <div className="font-navigation text-[11px] sm:text-xs uppercase tracking-widest text-white font-semibold">
                {currentLang === "es" ? "Litros / Capacidad Anual" : "Liters / Annual Capacity"}
              </div>
              <p className="text-white/60 text-xs font-light pt-1">
                {currentLang === "es"
                  ? "Capacidad instalada para abastecer programas continuos sin retrasos."
                  : "Installed capacity to support continuous contracts without volume bottlenecks."}
              </p>
            </div>

            {/* Counter 2: Agave Plants */}
            <div className="space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FDA377] tracking-tight">
                {counters.plants}M+
              </div>
              <div className="font-navigation text-[11px] sm:text-xs uppercase tracking-widest text-white font-semibold">
                {currentLang === "es" ? "Plantas de Agave Propio" : "Estate Agave Plants"}
              </div>
              <p className="text-white/60 text-xs font-light pt-1">
                {currentLang === "es"
                  ? "3,600 Has. cultivadas en Jalisco, Michoacán y Guanajuato."
                  : "3,600 Hectares across Jalisco, Michoacán, and Guanajuato."}
              </p>
            </div>

            {/* Counter 3: Proof */}
            <div className="space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FDA377] tracking-tight">
                {counters.proof}%
              </div>
              <div className="font-navigation text-[11px] sm:text-xs uppercase tracking-widest text-white font-semibold">
                {currentLang === "es" ? "Alc. Vol. de Exportación" : "Export Proof (ABV)"}
              </div>
              <p className="text-white/60 text-xs font-light pt-1">
                {currentLang === "es"
                  ? "Alta graduación que minimiza fletes y maximiza rendimiento en destino."
                  : "High concentration saving ocean freight and boosting proof yield at destination."}
              </p>
            </div>

            {/* Counter 4: Lead Time */}
            <div className="space-y-1">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FDA377] tracking-tight">
                {counters.days}
              </div>
              <div className="font-navigation text-[11px] sm:text-xs uppercase tracking-widest text-white font-semibold">
                {currentLang === "es" ? "Días Hábiles Disponibilidad" : "Business Days Lead Time"}
              </div>
              <p className="text-white/60 text-xs font-light pt-1">
                {currentLang === "es"
                  ? "Listo para recoger EXW Ayotlán una vez establecido el programa."
                  : "Ready for EXW pickup once your supply program is established."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §6. RUTA DE COORDINACIÓN PARA EXPORTACIÓN (3 Pasos Claros)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {currentLang === "es" ? "COORDINACIÓN PARA LA EXPORTACIÓN" : "EXPORT COORDINATION PATHWAY"}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {currentLang === "es" ? "Desde el Origen Hasta su Destino" : "From Origin to Your Destination"}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {currentLang === "es"
                  ? "Un proceso estructurado de 3 fases para asegurar cumplimiento legal ante el CRT, aduanas y envasadores autorizados."
                  : "A structured 3-phase pathway ensuring compliance across the CRT, customs brokerages, and authorized foreign co-packers."}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Step 1 */}
            <div className="p-6 bg-white border border-[#1c1c18]/10 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-3xl font-light text-[#8C4723]">01</span>
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                  {currentLang === "es" ? "Fase Inicial" : "Initial Phase"}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2">
                {currentLang === "es" ? "Revisión del Proyecto y de la Marca" : "Project & Brand Definition"}
              </h3>
              <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                {currentLang === "es"
                  ? "Antes de iniciar la producción, definimos con usted el perfil objetivo organoléptico, el mercado de destino, la presentación (Isotanque o IBC) y el volumen estimado."
                  : "Before distillation commences, we establish your target sensory profile, destination jurisdiction, container type (Isotank or IBC), and projected volume schedule."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white border border-[#1c1c18]/10 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-3xl font-light text-[#8C4723]">02</span>
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                  {currentLang === "es" ? "Regulación CRT" : "CRT Regulation"}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2">
                {currentLang === "es" ? "Documentación Regulatoria & CAE" : "Regulatory Filings & CAE"}
              </h3>
              <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                {currentLang === "es"
                  ? "Coordinamos para su embarque el Convenio de Vinculación, el Certificado de Aprobación de Envasado (CAE) y el registro oficial ante el Consejo Regulador del Tequila."
                  : "We draft and process the Bilateral Co-Responsibility Agreement, the Bottling Approval Certificate (CAE), and official brand registration with Mexico's CRT."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white border border-[#1c1c18]/10 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-3xl font-light text-[#8C4723]">03</span>
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                  {currentLang === "es" ? "Despacho EXW" : "EXW Dispatch"}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1c18] mb-2">
                {currentLang === "es" ? "Producción, Liberación y Carga" : "Production, QA Release & Dispatch"}
              </h3>
              <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                {currentLang === "es"
                  ? "Producimos conforme a la muestra aprobada, nuestro laboratorio propio libera el lote con cromatografía y la carga se realiza bajo inspección regulatoria con precintos CRT."
                  : "We distill to the approved benchmark, our in-house lab releases the batch with analytical certificates, and containers are loaded under CRT inspection with official seals."}
              </p>
            </div>
          </div>

          {/* Label Rejection Warning Callout */}
          <div className="mt-8 p-5 bg-[#FAF8F5] border-l-4 border-[#8C4723] border-y border-r border-[#1c1c18]/10 text-xs sm:text-sm text-[#53443a] leading-relaxed">
            <span className="font-bold text-[#1c1c18] block mb-1">
              ✦ {currentLang === "es" ? "Le ayudamos a evitar rechazos de etiqueta:" : "Preventing Costly Label Rejections:"}
            </span>
            {currentLang === "es"
              ? "Antes del envasado, revisamos que el uso de la palabra 'Tequila' y de términos relacionados en la etiqueta de su producto final cumpla con las normas del país de destino (TTB en EE.UU., normativas europeas, etc.). Las tarifas oficiales, agentes de aduanas, flete y seguro se coordinan o se cotizan por separado, según su proyecto."
              : "Before bottling, we review that the use of the word 'Tequila' and related statements on your final packaging complies with regulations in your destination market (TTB in USA, EU Food Standards). Official government fees, customs agents, freight, and marine cargo insurance are coordinated or quoted separately depending on your project."}
          </div>
        </div>
      </section>

      {/* ============================================================
          §7. SIMULADOR INTERACTIVO DE VOLUMEN & LOGÍSTICA
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#FAF6F0] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.calcEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.calcTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.calcSub}
              </p>
            </div>
          </Reveal>

          {/* Calculator Card */}
          <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-8 shadow-sm">
            {/* Slider Control */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label htmlFor="volume-slider" className="font-serif text-base sm:text-lg font-medium text-[#1c1c18]">
                  {currentLang === "es"
                    ? "Volumen a Granel Proyectado (Litros a 55% Alc. Vol.):"
                    : "Projected Bulk Volume (Liters at 55% ABV):"}
                </label>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#8C4723]">
                  {calcVolume.toLocaleString()} Litros
                </div>
              </div>

              <input
                id="volume-slider"
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={calcVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCalcVolume(val);
                  setLeadForm((prev) => ({ ...prev, volume: String(val) }));
                }}
                className="w-full h-2.5 bg-stone-200 accent-[#8C4723] rounded-none cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-navigation text-[#53443a]">
                <span>1,000 L (1 Tote)</span>
                <span>24,000 L (1 Isotanque)</span>
                <span>48,000 L (2 Isotanques)</span>
                <span>100,000 L (Multi-embarque)</span>
              </div>
            </div>

            {/* Results Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#1c1c18]/10">
              {/* Botellas 750ml @ 40% */}
              <div className="p-4 bg-[#FAF8F5] border border-[#1c1c18]/10">
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold block mb-1">
                  {currentLang === "es" ? "Envasado Estándar" : "Standard Bottling"}
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c18] mb-1">
                  {bottles40.toLocaleString()}
                </div>
                <div className="text-xs text-[#53443a] font-light">
                  {currentLang === "es"
                    ? "Botellas de 750 ml (diluido a 40% Alc. Vol.)"
                    : "750 ml bottles (proofed down to 40% ABV)"}
                </div>
              </div>

              {/* Latas RTD 355ml @ 5% */}
              <div className="p-4 bg-[#FAF8F5] border border-[#1c1c18]/10">
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold block mb-1">
                  {currentLang === "es" ? "Cócteles RTD" : "RTD Canned Cocktails"}
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c18] mb-1">
                  {cans5.toLocaleString()}
                </div>
                <div className="text-xs text-[#53443a] font-light">
                  {currentLang === "es"
                    ? "Latas de 355 ml (formulado a 5% Alc. Vol.)"
                    : "355 ml cans (formulated at 5% ABV)"}
                </div>
              </div>

              {/* Isotanques requeridos */}
              <div className="p-4 bg-[#FAF8F5] border border-[#1c1c18]/10">
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold block mb-1">
                  {currentLang === "es" ? "Isotanques (24,000 L)" : "Isotanks (24,000 L)"}
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c18] mb-1">
                  {isotanksRequired} {isotanksRequired === 1 ? "Unidad" : "Unidades"}
                </div>
                <div className="text-xs text-[#53443a] font-light">
                  {currentLang === "es"
                    ? "Isotanques intermodales grado alimenticio"
                    : "Intermodal food-grade Isotanks"}
                </div>
              </div>

              {/* Totes IBC requeridos */}
              <div className="p-4 bg-[#FAF8F5] border border-[#1c1c18]/10">
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold block mb-1">
                  {currentLang === "es" ? "IBC Totes (1,000 L)" : "IBC Totes (1,000 L)"}
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c18] mb-1">
                  {ibcTotesRequired} {ibcTotesRequired === 1 ? "Tote" : "Totes"}
                </div>
                <div className="text-xs text-[#53443a] font-light">
                  {currentLang === "es"
                    ? "Contenedores intermedios paletizados"
                    : "Intermediate bulk palletized containers"}
                </div>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1c1c18]/10">
              <span className="text-xs text-[#53443a] font-light">
                ✦ {currentLang === "es"
                  ? "Cálculo referencial sin mermas de envasado. Los rendimientos finales dependen de la formulación específica."
                  : "Benchmark estimation excluding bottling shrinkage. Final yields vary based on specific product formula."}
              </span>
              <a
                href="#cotizar"
                onClick={() => {
                  setLeadForm((prev) => ({ ...prev, volume: String(calcVolume) }));
                }}
                className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-medium py-3 px-6 transition-all rounded-none shadow-sm cursor-pointer whitespace-nowrap"
              >
                {currentLang === "es" ? "Cotizar Este Volumen Exacto →" : "Quote This Exact Volume →"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §8. SUSTENTABILIDAD & CERTIFICACIONES OFICIALES DE EXPORTACIÓN
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.sustainabilityEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.sustainabilityTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
                {t.sustainabilitySub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Columna Izquierda: Sustentabilidad Integral */}
            <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-7 shadow-sm space-y-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1c18]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C4723] font-bold">
                      {currentLang === "es" ? "Sustentabilidad Integral" : "Holistic Sustainability"}
                    </span>
                  </div>
                  <span className="font-navigation text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    {currentLang === "es" ? "ESG Compliance" : "ESG Compliance"}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1c1c18] mb-2">
                  {currentLang === "es" ? "Compromiso Ambiental y Social" : "Environmental & Social Responsibility"}
                </h3>
                <p className="font-body-md text-[#53443a] text-xs sm:text-sm leading-relaxed mb-5 font-light">
                  {currentLang === "es"
                    ? "Operaciones industriales diseñadas para reducir la huella de carbono, evitar descargas al subsuelo y generar bienestar social en la comunidad de Ayotlán."
                    : "Engineered industrial operations reducing carbon footprint, preventing subsoil wastewater runoff, and driving transparent social governance."}
                </p>

                <div className="space-y-3.5">
                  {/* Solar Energy */}
                  <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                    <img
                      src="/Paneles Solares.webp"
                      alt="Energía Solar Casa Loy"
                      className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                          {currentLang === "es" ? "Energía Solar Fotovoltaica" : "Photovoltaic Solar Energy"}
                        </h4>
                        <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">
                          {currentLang === "es" ? "Energía Limpia" : "Clean Energy"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {currentLang === "es"
                          ? "Paneles solares industriales para generar energía limpia en nuestras instalaciones, reduciendo emisiones de CO₂ permanentemente."
                          : "Industrial photovoltaic solar arrays generating renewable electricity across production facilities."}
                      </p>
                    </div>
                  </div>

                  {/* Vinazas & Composta */}
                  <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                    <img
                      src="/Compostaje.webp"
                      alt="Centro de Composta Casa Loy"
                      className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                          {currentLang === "es" ? "Manejo de Vinazas & Composta" : "Vinazas & Compost Center"}
                        </h4>
                        <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">
                          {currentLang === "es" ? "Cero Residuos" : "Zero Waste"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {currentLang === "es"
                          ? "Transformación del 100% de vinazas y bagazo en composta orgánica enriquecida para nutrir nuestros propios campos de agave."
                          : "100% organic waste upcycling: vinazas and bagasse converted into biological compost to regenerate our estate agave fields."}
                      </p>
                    </div>
                  </div>

                  {/* Desarrollo Social */}
                  <div className="flex gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 group hover:border-[#8C4723] transition-all">
                    <img
                      src="/Empleado Jimador Casa Loy Tequilera.webp"
                      alt="Desarrollo Social Jimadores"
                      className="w-20 h-20 object-cover shrink-0 border border-[#1c1c18]/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                          {currentLang === "es" ? "Comercio Justo & Bienestar Laboral" : "Fair Labor & Social Impact"}
                        </h4>
                        <span className="font-navigation text-[8px] uppercase tracking-wider text-[#8C4723] font-bold">
                          {currentLang === "es" ? "Comercio Justo" : "Fair Labor"}
                        </span>
                      </div>
                      <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                        {currentLang === "es"
                          ? "Dignificación del oficio jimador y destilador en Ayotlán con contratos formales, capacitación técnica y seguridad social integral."
                          : "Promoting dignity and social stability for jimador and distillery families with formal contracts and safety training."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c1c18]/10 flex items-center justify-between text-[#8C4723]">
                <span className="font-navigation text-[10px] uppercase tracking-widest font-semibold">
                  ✦ {currentLang === "es" ? "Economía Circular Verificada" : "Verified Circular Economy"}
                </span>
                <span className="font-serif text-xs italic text-[#53443a]">Ayotlán, Jalisco</span>
              </div>
            </div>

            {/* Columna Derecha: Certificaciones Oficiales */}
            <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-7 shadow-sm space-y-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1c18]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C4723]"></span>
                    <span className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C4723] font-bold">
                      {currentLang === "es" ? "Mercados Internacionales" : "International Markets"}
                    </span>
                  </div>
                  <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                    {currentLang === "es" ? "Auditorías Vigentes" : "Current Audits"}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1c1c18] mb-2">
                  {currentLang === "es" ? "Certificaciones de Exportación" : "Export Certifications"}
                </h3>
                <p className="font-body-md text-[#53443a] text-xs sm:text-sm leading-relaxed mb-5 font-light">
                  {currentLang === "es"
                    ? "Sellos oficiales confirmados para comercializar tu producto a granel sin fricciones regulatorias en EE.UU., la Unión Europea y canales globales."
                    : "Accredited certifications enabling your bulk shipments to clear customs and supply global retail without friction."}
                </p>

                <div className="space-y-3">
                  {/* NOM 1633 CRT */}
                  <div className="p-3.5 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-serif text-base font-semibold text-[#1c1c18]">NOM 1633 CRT</div>
                      <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-stone-800 bg-stone-200 px-2 py-0.5 border border-stone-300">
                        {currentLang === "es" ? "Denominación Oficial" : "Official Origin"}
                      </span>
                    </div>
                    <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                      {currentLang === "es"
                        ? "Destilería autorizada con permanente inspección del Consejo Regulador del Tequila. Certificados de autenticidad y CAE oficial."
                        : "Authorized distillery under continuous Consejo Regulador del Tequila supervision, issuing authentic export certificates and CAE."}
                    </p>
                  </div>

                  {/* USDA Organic */}
                  <div className="p-3.5 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-serif text-base font-semibold text-[#1c1c18]">USDA Organic</div>
                      <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 border border-emerald-200">
                        {currentLang === "es" ? "Mercado EE.UU." : "USA Market"}
                      </span>
                    </div>
                    <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                      {currentLang === "es"
                        ? "Certificación orgánica para Norteamérica avalando cultivo libre de pesticidas sintéticos y trazabilidad total de lote."
                        : "Certified organic compliance under USDA National Organic Program for uninterrupted access to top-tier US grocery and spirits retail."}
                    </p>
                  </div>

                  {/* Certificación Orgánica Unión Europea */}
                  <div className="p-3.5 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-serif text-base font-semibold text-[#1c1c18]">
                        {currentLang === "es" ? "Certificación Orgánica Unión Europea" : "EU Organic Certification"}
                      </div>
                      <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 border border-blue-200">
                        {currentLang === "es" ? "27 Países UE" : "27 EU Nations"}
                      </span>
                    </div>
                    <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                      {currentLang === "es"
                        ? "Sello de equivalencia orgánica para exportación directa a los 27 países de la UE y Suiza."
                        : "Official European Organic standard recognition guaranteeing seamless export clearance across the 27 EU member states."}
                    </p>
                  </div>

                  {/* KMD Kosher */}
                  <div className="p-3.5 border border-[#1c1c18]/10 bg-[#FAF8F5] hover:border-[#8C4723] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-serif text-base font-semibold text-[#1c1c18]">KMD Kosher</div>
                      <span className="font-navigation text-[9px] font-bold uppercase tracking-wider text-[#8C4723] bg-[#8C4723]/10 px-2 py-0.5 border border-[#8C4723]/30">
                        {currentLang === "es" ? "Pureza Global" : "Global Purity"}
                      </span>
                    </div>
                    <p className="font-body-md text-[#53443a] text-xs leading-relaxed font-light">
                      {currentLang === "es"
                        ? "Certificación Kosher oficial (KMD) que audita pureza de ingredientes y procesos sin contaminantes cruzados."
                        : "Accredited KMD Kosher certification guaranteeing sanitary rigor and pure production free of cross-contamination."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c1c18]/10 flex items-center justify-between text-[#8C4723]">
                <span className="font-navigation text-[10px] uppercase tracking-widest font-semibold">
                  ✦ {currentLang === "es" ? "Documentación Lista para Exportar" : "Export-Ready Compliance"}
                </span>
                <span className="font-serif text-xs italic text-[#53443a]">CRT · USDA · EU · KMD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §9. CALENDARIO DE CITAS TÉCNICAS (Cal.com 30 minutos)
          ============================================================ */}
      <section id="agenda-llamada" className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-4xl mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="mb-6">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.calEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.calTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm">
                {t.calSub}
              </p>
            </div>
          </Reveal>

          {/* Cal.com Clean Embed Card */}
          <Reveal delay={100}>
            <div className="w-full bg-white border border-[#1c1c18]/10 p-5 sm:p-7 shadow-sm rounded-none">
              <div className="mb-3 border-b border-[#1c1c18]/10 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-light text-[#1c1c18]">
                    {currentLang === "es"
                      ? "Calendario Oficial de Citas Técnicas para Granel"
                      : "Official Bulk Tequila Technical Consultation"}
                  </h4>
                  <p className="font-navigation text-[11px] text-[#53443a] font-light mt-0.5">
                    {currentLang === "es"
                      ? "Selecciona el día y horario disponible para tu videollamada técnica de 30 minutos."
                      : "Select available date & time for your 30-minute Google Meet consultation."}
                  </p>
                </div>
                <span className="font-navigation text-[9px] text-[#8C4723] font-bold uppercase bg-[#F6F2EA] px-2.5 py-0.5 border border-[#1c1c18]/10 rounded-none tracking-wider">
                  {currentLang === "es" ? "30 Minutos" : "30 Minutes"}
                </span>
              </div>

              <div id="cal-inline-granel-scheduler" className="w-full h-[480px] sm:h-[520px]"></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          §10. PREGUNTAS FRECUENTES B2B (Tabs e Items Acordeón)
          ============================================================ */}
      <section id="faqs-granel" className="py-12 md:py-16 bg-[#FAF6F0] border-b border-[#1c1c18]/10">
        <div className="max-w-4xl mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="mb-6">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.faqEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
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
              { key: "regulation", label: t.tabRegulation },
              { key: "profile", label: t.tabProfile },
              { key: "logistics", label: t.tabLogistics }
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
            {faqData[activeFaqTab]?.map((item, idx) => (
              <div key={idx} className="border-b border-[#1c1c18]/10 py-3 transition-all">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left font-serif text-base sm:text-lg font-light text-[#1c1c18] hover:text-[#8C4723] transition-colors cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <span className="text-[#8C4723] text-xl font-light">
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
              <span className="text-emerald-700 font-bold">✓</span>{" "}
              {currentLang === "es"
                ? "Convenio de Confidencialidad (NDA) disponible para todo proyecto"
                : "Strict Non-Disclosure Agreement (NDA) available for every project"}
            </span>
            <span className="text-[#8C4723] font-bold tracking-widest text-[11px]">NOM 1633 CRT</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          §11. CONTACTO B2B & TARJETA EJECUTIVA DE FERNANDA QUINTANA
          ============================================================ */}
      <section id="cotizar" className="py-14 sm:py-20 bg-[#fcf9f3]">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.contactEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(26px,3.2vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.contactTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-base">
                {t.contactSub}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Columna Izquierda: Tarjeta Ejecutiva de FERNANDA QUINTANA */}
            <div className="lg:col-span-5 space-y-6">
              {/* Executive Profile Card */}
              <div className="bg-white border-2 border-[#8C4723] p-6 sm:p-7 shadow-lg relative">
                <span className="absolute -top-3 right-6 bg-[#8C4723] text-white font-navigation text-[9px] uppercase tracking-[0.25em] px-3 py-0.5 font-semibold rounded-none shadow-sm">
                  {currentLang === "es" ? "Contacto Directo" : "Direct Contact"}
                </span>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#1c1c18]/10 text-center sm:text-left">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 border border-[#8C4723]/30 overflow-hidden bg-stone-100">
                    <img
                      src="/fernanda-quintana.webp"
                      alt="Fernanda Quintana"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c18]">
                      Fernanda Quintana
                    </div>
                    <div className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8C4723] font-semibold">
                      {currentLang === "es"
                        ? "KAE de Marca Privada, Graneles y Mercados Emergentes"
                        : "KAE of Private Labels, Bulk, & Emerging Markets"}
                    </div>
                    <div className="font-navigation text-[9.5px] uppercase tracking-widest text-[#53443a]">
                      Casa Loy Tequilera · NOM 1633
                    </div>
                  </div>
                </div>

                {/* Quote / Personal Commitment */}
                <div className="py-4 border-b border-[#1c1c18]/10">
                  <p className="font-serif italic text-xs sm:text-[13px] text-[#53443a] leading-relaxed">
                    {currentLang === "es"
                      ? '"Acompañamos a nuestros clientes en cada embarque de granel: desde la formulación y análisis de cromatografía hasta la liberación del CAE y la coordinación con sus agentes de carga internacionales."'
                      : '"We support our bulk clients through every step: from formulation and gas chromatography verification to CRT CAE clearance and coordination with your international freight forwarders."'}
                  </p>
                </div>

                {/* Direct Contact Links */}
                <div className="py-4 space-y-2.5 text-xs font-navigation text-[#53443a]">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">mail</span>
                    <a
                      href="mailto:fernanda@casaloy.com"
                      className="hover:text-[#8C4723] transition-colors font-medium"
                    >
                      fernanda@casaloy.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">phone_iphone</span>
                    <a
                      href="tel:+523328329955"
                      className="hover:text-[#8C4723] transition-colors font-medium"
                    >
                      +52 33 2832 9955
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">location_on</span>
                    <span className="font-light">
                      Ayotlán, Jalisco, México · NOM 1633 CRT
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons for Fernanda */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="https://wa.me/523328329955?text=Hola%20Fernanda,%20me%20gustar%C3%ADa%20cotizar%20el%20programa%20de%20Tequila%20a%20Granel%20de%20Casa%20Loy."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-navigation text-[10px] uppercase tracking-wider py-2.5 px-3 text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="/Fernanda_Quintana.vcf"
                    download="Fernanda_Quintana.vcf"
                    className="flex-1 border border-[#8C4723] text-[#8C4723] hover:bg-[#8C4723] hover:text-white font-navigation text-[10px] uppercase tracking-wider py-2.5 px-3 text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">contact_page</span>
                    <span>vCard</span>
                  </a>
                </div>
              </div>

              {/* Distillery Visit Invitation */}
              <div className="p-5 bg-white border border-[#1c1c18]/10 space-y-2">
                <span className="font-navigation text-[9px] uppercase tracking-widest text-[#8C4723] font-bold block">
                  {currentLang === "es" ? "VISITAS TÉCNICAS A PLANTA" : "TECHNICAL DISTILLERY AUDITS"}
                </span>
                <h4 className="font-serif text-base font-semibold text-[#1c1c18]">
                  {currentLang === "es" ? "Visítanos en Ayotlán, Jalisco" : "Visit Our Distillery in Jalisco"}
                </h4>
                <p className="font-body-md text-xs text-[#53443a] leading-relaxed font-light">
                  {currentLang === "es"
                    ? "A 90 minutos de Guadalajara. Vuela al Aeropuerto Internacional de Guadalajara (GDL); nosotros coordinamos tu traslado y auditoría técnica completa en planta."
                    : "90 minutes from Guadalajara. Fly into GDL International Airport; our team coordinates your transportation, technical audit, and tasting lab review."}
                </p>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Cotización B2B */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-[#1c1c18]/10 pb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18]">
                    {currentLang === "es" ? "Solicitud de Propuesta Técnica y Precios" : "Request Technical & Pricing Proposal"}
                  </h3>
                  <p className="font-navigation text-xs text-[#53443a] font-light mt-1">
                    {currentLang === "es"
                      ? "Completa los detalles de tu proyecto para recibir una cotización formal y tiempos de despacho estimados."
                      : "Complete your project requirements to receive a formal quotation and dispatch timeline."}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <h4 className="font-serif text-xl font-bold text-emerald-900">
                      {currentLang === "es" ? "¡Solicitud Recibida con Éxito!" : "Inquiry Successfully Received!"}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-800 font-light leading-relaxed max-w-md mx-auto">
                      {currentLang === "es"
                        ? "Muchas gracias. Fernanda Quintana y el equipo de exportación a granel evaluarán tus requerimientos y te responderán en menos de 24 horas hábiles."
                        : "Thank you. Fernanda Quintana and our bulk export team will review your specifications and follow up within 24 business hours."}
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-3 font-navigation text-[10px] uppercase tracking-wider text-[#8C4723] underline cursor-pointer"
                    >
                      {currentLang === "es" ? "Enviar otra solicitud" : "Submit another inquiry"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs">
                        {submitError}
                      </div>
                    )}

                    {/* Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Nombre y Apellido *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={leadForm.name}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "Ej. Carlos Mendoza" : "e.g. John Miller"}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Empresa / Marca *" : "Company / Brand *"}
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          value={leadForm.company}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "Ej. Spirits Imports LLC" : "e.g. Premium Spirits Co."}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Correo Corporativo *" : "Corporate Email *"}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={leadForm.email}
                          onChange={handleFormChange}
                          placeholder="carlos@company.com"
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Teléfono / WhatsApp *" : "Phone / WhatsApp *"}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={leadForm.phone}
                          onChange={handleFormChange}
                          placeholder="+1 555 123 4567"
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Country & Volume */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "País o Mercado Destino" : "Destination Market / Country"}
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={leadForm.country}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "EE.UU., Reino Unido, etc." : "USA, UK, Germany, etc."}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Volumen Estimado (Litros)" : "Estimated Volume (Liters)"}
                        </label>
                        <input
                          type="text"
                          name="volume"
                          value={leadForm.volume}
                          onChange={handleFormChange}
                          placeholder="24000"
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Class & Container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Clase de Tequila Deseada" : "Desired Tequila Class"}
                        </label>
                        <select
                          name="tequilaClass"
                          value={leadForm.tequilaClass}
                          onChange={handleFormChange}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        >
                          <option value="blanco">
                            {currentLang === "es" ? "Blanco (55% Alc. Vol.)" : "Blanco (55% ABV)"}
                          </option>
                          <option value="reposado">
                            {currentLang === "es" ? "Reposado (Madurado en Roble)" : "Reposado (Oak Aged)"}
                          </option>
                          <option value="ambas">
                            {currentLang === "es" ? "Ambas Clases (Blanco & Reposado)" : "Both (Blanco & Reposado)"}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {currentLang === "es" ? "Presentación Preferida" : "Preferred Packaging Format"}
                        </label>
                        <select
                          name="containerType"
                          value={leadForm.containerType}
                          onChange={handleFormChange}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        >
                          <option value="isotank">
                            {currentLang === "es" ? "Isotanque (21,000–26,000 L)" : "Isotank (21,000–26,000 L)"}
                          </option>
                          <option value="ibc">
                            {currentLang === "es" ? "Contenedores IBC Totes (1,040–1,250 L)" : "IBC Totes (1,040–1,250 L)"}
                          </option>
                          <option value="asesoria">
                            {currentLang === "es" ? "Requiero asesoría logística" : "Need logistics guidance"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                        {currentLang === "es"
                          ? "¿Algún requerimiento especial de perfil o fecha de embarque?"
                          : "Any specific profile target or dispatch date?"}
                      </label>
                      <textarea
                        name="notes"
                        rows="3"
                        value={leadForm.notes}
                        onChange={handleFormChange}
                        placeholder={
                          currentLang === "es"
                            ? "Ej. Necesitamos muestra previa a 55% Alc. Vol. para laboratorio en Texas..."
                            : "e.g. Requesting a 55% ABV benchmark sample kit for our tasting panel in London..."
                        }
                        className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#8C4723] hover:bg-[#a6562b] disabled:bg-stone-400 text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 transition-all rounded-none shadow-md cursor-pointer"
                      >
                        {isSubmitting
                          ? currentLang === "es" ? "Enviando cotización..." : "Submitting inquiry..."
                          : currentLang === "es" ? "Solicitar Propuesta y Estructura de Precios →" : "Request Proposal & Pricing Structure →"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §12. FINAL CTA & DESCARGA DE FICHA TÉCNICA OFICIAL
          ============================================================ */}
      <section className="py-12 bg-[#141C1B] text-white border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <span className="font-navigation text-[10px] uppercase tracking-[0.3em] text-[#FDA377] font-semibold block mb-2">
            NOM 1633 CRT · AYOTLÁN, JALISCO
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3">
            {currentLang === "es"
              ? "Descarga la Ficha Técnica Completa de Tequila a Granel"
              : "Download the Complete Bulk Tequila Technical Datasheet"}
          </h2>
          <p className="font-body-lg text-white/70 text-xs sm:text-sm max-w-xl mx-auto mb-6 font-light">
            {currentLang === "es"
              ? "Especificaciones fisicoquímicas, tolerancias de envasado, formatos de contenedores y requisitos para el Certificado de Aprobación de Envasado (CAE)."
              : "Physicochemical parameters, packaging thresholds, container dimensions, and requirements for the official Bottling Approval Certificate (CAE)."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={t.pdfFileName}
              download
              className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-8 transition-all rounded-none shadow-lg cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{t.heroDownloadPdf}</span>
            </a>
            <a
              href="#cotizar"
              className="border border-white/60 hover:bg-white/15 text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-8 transition-all rounded-none cursor-pointer"
            >
              {currentLang === "es" ? "Iniciar Cotización" : "Start Quotation"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
