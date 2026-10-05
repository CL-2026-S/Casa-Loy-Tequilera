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

  // Active Photo in Showcase (The 4 core photos from One-Pager Page 1)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Hero Background Carousel State
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const heroImages = [
    "/granel-hero-operario.webp",
    "/Naves Industriales Casa Loy Tequilera.webp",
    "/Columnas Destilacion Tequila Casa Loy.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Animated KPIs Counters (13.5M L, 8M plants, 20 days - from One Pager)
  const [counters, setCounters] = useState({ capacity: 0, plants: 0, days: 0 });
  const [countersTriggered, setCountersTriggered] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setCounters({ capacity: 13.5, plants: 8, days: 20 });
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
    const duration = 1600;
    const start = performance.now();
    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        capacity: Number((13.5 * ease).toFixed(1)),
        plants: Number((8 * ease).toFixed(1)),
        days: Math.round(20 * ease)
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCounters({ capacity: 13.5, plants: 8, days: 20 });
      }
    };
    requestAnimationFrame(frame);
  }, [countersTriggered]);

  // Contact / Lead Form State
  const [leadForm, setLeadForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    market: "",
    volume: "",
    profile: "",
    timeline: ""
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
        solution: `Tequila a Granel / Bulk Tequila - ${leadForm.volume || "Volumen no especificado"}`,
        objective: `Mercado: ${leadForm.market || "No especificado"} | Perfil: ${leadForm.profile || "No especificado"}`,
        stage: `Plazos: ${leadForm.timeline || "No especificado"}`,
        comments: `Solicitud generada desde One-Pager de Granel Casa Loy (Atención: Fernanda Quintana).`,
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
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Translations Object - STRICTLY THE ONE-PAGER TEXT
  const content = {
    es: {
      seoTitle: "Tequila a Granel de Calidad & Consistente | Casa Loy · NOM 1633",
      seoDesc: "Un perfil de tequila limpio y consistente para envasar en el extranjero. Lo respaldan nuestro propio suministro de agave, nuestra capacidad de producción y la coordinación de la exportación desde el origen.",

      // Hero & Trust Bar
      heroCategory: "TEQUILA A GRANEL",
      heroTitleLine1: "Tequila a granel de calidad,",
      heroTitleLine2: "consistente a cualquier escala.",
      heroSubtitle: "Un perfil de tequila limpio y consistente para envasar en el extranjero. Lo respaldan nuestro propio suministro de agave, nuestra capacidad de producción y la coordinación de la exportación desde el origen.",
      heroBtnQuote: "Cotizar Programa de Granel →",
      heroBtnPdf: "Descargar One-Pager PDF",
      pdfFileName: "/CASA_LOY_TEQUILA_A_GRANEL_ES.pdf",

      trustNom: "NOM 1633",
      trustCrt: "AUTORIZADO POR EL CRT",
      trustRegion: "ALTOS DE JALISCO",
      trustRoots: "CON RAÍCES EN EL AGAVE DESDE 1992",

      // Story Section
      storyP1: "Casa Loy Tequilera es una productora familiar de tequila ubicada en Ayotlán, en los Altos de Jalisco. Es una de las siete empresas de la familia Loy y la única que lleva su nombre. Cultivamos agave desde 1992, mucho antes de destilar nuestro primer litro. Hoy contamos con ocho millones de plantas de agave en tierras propias en Jalisco, Michoacán y Guanajuato.",
      storyP2: "Cada lote se produce para ser consistente a gran escala. Nuestro suministro de agave y nuestra capacidad de producción nos permiten sostener programas de granel a largo plazo. Además, le ayudamos a coordinar el proceso de exportación desde el origen para que su embarque avance con total claridad.",
      storyHighlight: "Tequila a granel que protege la marca que usted está construyendo: perfil limpio, suministro confiable, lotes repetibles.",

      // Programa de Granel Disponible
      specsEyebrow: "ESPECIFICACIONES DEL PROGRAMA",
      specsTitle: "PROGRAMA DE GRANEL DISPONIBLE",
      specCatLabel: "CATEGORÍA",
      specCatVal: "Tequila Mixto",
      specCatSub: "(51% agave, 49% otros azúcares)",
      specClassesLabel: "CLASES",
      specClassesVal: "Blanco / Reposado",
      specStrengthLabel: "GRADUACIÓN",
      specStrengthVal: "55% Alc. Vol.",
      specPresLabel: "PRESENTACIÓN",
      specPresVal: "Isotanque (21,000–26,000 L)",
      specPresSub: "o contenedores IBC (1,040–1,250 L)",
      specUseLabel: "USO",
      specUseVal: "Envasado en el extranjero / RTD",

      // Coordinación para la Exportación
      stepsEyebrow: "PROCESO PASO A PASO",
      stepsTitle: "COORDINACIÓN PARA LA EXPORTACIÓN, DESDE EL ORIGEN",
      step1Num: "01",
      step1Title: "Revisión del proyecto y de la marca",
      step1Desc: "Antes de iniciar la producción, definimos con usted el perfil objetivo, el mercado y el volumen.",
      step2Num: "02",
      step2Title: "Documentación regulatoria",
      step2Desc: "Coordinamos para su embarque el Convenio de Vinculación, el Certificado de Aprobación de Envasado (CAE) y el registro ante el CRT.",
      step3Num: "03",
      step3Title: "Producción, liberación de laboratorio y carga inspeccionada",
      step3Desc: "Producimos conforme a la muestra que usted aprobó, nuestro laboratorio libera el lote y la carga se realiza bajo inspección regulatoria.",

      // Cómo Trabajar con Casa Loy
      workEyebrow: "¿POR QUÉ TEQUILA A GRANEL CASA LOY?",
      workTitle: "Cómo trabajar con Casa Loy",
      pillar1Title: "Tequila Mixto de calidad para envasar en el extranjero",
      pillar1Desc: "Por ley, el Tequila 100% de agave debe envasarse dentro de la zona de Denominación de Origen, en México. El tequila mixto es la categoría que permite envasar en el extranjero.",
      pillar2Title: "Consistencia a gran escala",
      pillar2Desc: "Destilación automatizada en columna, con tecnología europea, pensada para producir lotes repetibles y sostener programas de volumen a largo plazo.",
      pillar3Title: "Un perfil hecho para su mercado",
      pillar3Desc: "Podemos partir de su perfil objetivo o de una muestra de referencia para adaptar el tequila a su mercado.",
      pillar4Title: "Producción con agave propio",
      pillar4Desc: "Cultivamos agave en tierras propias desde 1992. Eso nos da el suministro y la capacidad de producción para crecer al ritmo de su demanda.",

      // Questions
      q1Title: "¿Puedo usarlo en cócteles enlatados listos para beber (RTD)?",
      q1Desc: "Sí, el mismo perfil limpio, el mismo cumplimiento con el CAE.",
      q2Title: "¿Puedo envasar mi propia marca de tequila?",
      q2Desc: "Sí. Trabaje con un envasador autorizado en su mercado. Nosotros le enviamos el granel con todos los requisitos cumplidos, y el envasador lo embotella y etiqueta con su marca.",

      // Label Rejection Banner
      labelAlertTitle: "Le ayudamos a evitar rechazos de etiqueta:",
      labelAlertDesc: "Antes del envasado, revisamos que el uso de la palabra \"Tequila\" y de términos relacionados en la etiqueta de su producto final cumpla con las normas del país de destino. Las tarifas oficiales, los trámites, los agentes de aduanas, el flete y el seguro se coordinan o se cotizan por separado, según su proyecto.",

      // Calidad Certificada
      qualityEyebrow: "CALIDAD CERTIFICADA",
      qualityTitle: "Consistencia a gran escala, en cada lote.",
      qualityCrt: "Verificado por el CRT · Con Certificado de Aprobación de Envasado (CAE).",
      qualityTracking: "No perdemos de vista ningún embarque: coordinamos directamente con sus agentes de carga y agentes de aduanas, desde el origen hasta el destino. Si algo requiere atención, como un retraso o una retención en aduanas, usted se entera antes de que afecte sus plazos, no después.",
      kpi1Title: "Ex Works (EXW) Ayotlán",
      kpi1Desc: "Usted elige a su agente de carga, a su aseguradora y a sus socios logísticos. Nosotros proporcionamos la documentación de exportación y la coordinación en origen para cada carga aprobada.",
      kpi2Title: "13.5M L / 8M plantas",
      kpi2Desc: "Capacidad anual de producción, con agave cultivado desde 1992",
      kpi3Title: "Disponibilidad estimada: 20 días hábiles",
      kpi3Desc: "Desde la confirmación del pedido hasta que el producto está listo para recoger en planta, una vez establecido el programa. Con programas basados en pronósticos, la disponibilidad puede ser más rápida.",

      // Contact & Form
      contactTitle: "Hablemos de volumen, perfil y precio.",
      contactDesc: "Envíenos su mercado objetivo, el volumen estimado, el perfil que busca y sus plazos. Le diremos sin rodeos cuál es la mejor ruta, cómo funciona el proceso de muestras, cuál es la estructura de precios y qué requisitos de exportación aplican.",
      contactLabel: "CONTACTO",
      contactName: "Fernanda Quintana",
      contactRole: "KAE de Marca Privada, Graneles y Mercados Emergentes",
      contactEmail: "fernanda@casaloy.com",
      contactPhone: "+52 33 2832 9955",
      contactDomain: "casaloy.com",
      visitLabel: "VISÍTENOS",
      visitDesc: "Ayotlán, Jalisco, México, a 90 minutos de Guadalajara. Llegue en avión; nosotros lo recogemos.",
      btnWhatsapp: "Mensaje Directo por WhatsApp",
      btnVcard: "Descargar vCard",

      formTitle: "Solicitar Cotización y Asesoría Técnica",
      formName: "Nombre y Apellido *",
      formCompany: "Empresa / Marca *",
      formEmail: "Correo Corporativo *",
      formPhone: "Teléfono / WhatsApp *",
      formMarket: "Mercado Objetivo (País de destino)",
      formVolume: "Volumen Estimado (Litros)",
      formProfile: "Perfil Sensorial Deseado (Blanco, Reposado o RTD)",
      formTimeline: "Plazos o Fecha Estimada de Embarque",
      formSubmitBtn: "Enviar Requerimientos a Fernanda Quintana →",
      formSubmitting: "Enviando requerimientos...",
      successTitle: "¡Solicitud Enviada con Éxito!",
      successDesc: "Muchas gracias. Fernanda Quintana revisará sus requerimientos y responderá con la propuesta técnica en menos de 24 horas hábiles."
    },
    en: {
      seoTitle: "Quality Bulk Tequila, Built for Consistency at Scale | Casa Loy · NOM 1633",
      seoDesc: "A clean, consistent tequila profile for bottling abroad, backed by agave supply, production capacity, and export-ready coordination from origin.",

      // Hero & Trust Bar
      heroCategory: "BULK TEQUILA",
      heroTitleLine1: "Quality Bulk Tequila,",
      heroTitleLine2: "Built for Consistency at Scale.",
      heroSubtitle: "A clean, consistent tequila profile for bottling abroad, backed by agave supply, production capacity, and export-ready coordination from origin.",
      heroBtnQuote: "Request Bulk Quotation →",
      heroBtnPdf: "Download One-Pager PDF",
      pdfFileName: "/CASA_LOY_BULK_TEQUILA_EN.pdf",

      trustNom: "NOM 1633",
      trustCrt: "CRT AUTHORISED",
      trustRegion: "HIGHLANDS OF JALISCO",
      trustRoots: "AGAVE ROOTS SINCE 1992",

      // Story Section
      storyP1: "Casa Loy Tequilera is a family-owned tequila producer in Ayotlán, in the Highlands of Jalisco, one of seven companies owned by the Loy family, and the only one with the name. We have been growing agave since 1992, long before we distilled our first liter, and today we hold eight million agave plants on land we own across Jalisco, Michoacán, and Guanajuato.",
      storyP2: "Every batch is built for consistency at scale, backed by agave supply and production capacity to support long-term bulk programs. We also help coordinate the export pathway from origin, so your shipment moves with clarity.",
      storyHighlight: "Bulk tequila that protects the brand you're building: clean profile, reliable supply, repeatable batches.",

      // Available Bulk Program
      specsEyebrow: "PROGRAM SPECIFICATIONS",
      specsTitle: "AVAILABLE BULK PROGRAM",
      specCatLabel: "CATEGORY",
      specCatVal: "Tequila Mixto",
      specCatSub: "(51% agave, 49% other sugars)",
      specClassesLabel: "CLASSES",
      specClassesVal: "Blanco / Reposado",
      specStrengthLabel: "STRENGTH",
      specStrengthVal: "55% Alc. Vol.",
      specPresLabel: "PRESENTATION",
      specPresVal: "Isotank (21,000–26,000 L)",
      specPresSub: "or IBC totes (1,040–1,250 L)",
      specUseLabel: "USE",
      specUseVal: "Bottling abroad / RTD",

      // Export-Ready Coordination
      stepsEyebrow: "STEP-BY-STEP PATHWAY",
      stepsTitle: "EXPORT-READY COORDINATION, FROM ORIGIN",
      step1Num: "01",
      step1Title: "Project & brand review",
      step1Desc: "We align on your target profile, market, and volume before production begins.",
      step2Num: "02",
      step2Title: "Regulatory documentation pathway",
      step2Desc: "Linkage Agreement, Bottler Approval Certificate, and CRT registration coordinated for your shipment.",
      step3Num: "03",
      step3Title: "Production, lab release & inspected loading",
      step3Desc: "Produced against your approved sample, released by our laboratory, and loaded under regulatory inspection.",

      // Working with Casa Loy
      workEyebrow: "WHY CASA LOY BULK TEQUILA",
      workTitle: "Working with Casa Loy",
      pillar1Title: "Quality Mixto for bottling abroad",
      pillar1Desc: "Tequila 100% Agave must, by law, bottle inside Mexico's Denomination of Origin zone. Mixto is the category that allows bottling abroad.",
      pillar2Title: "Built for consistency at scale",
      pillar2Desc: "European automated column distillation, designed for repeatable batches and long-term volume programs.",
      pillar3Title: "Market-aligned profile",
      pillar3Desc: "We can work from your target profile or reference sample to align the liquid with your market.",
      pillar4Title: "Agave-backed production",
      pillar4Desc: "Grown on land we own since 1992, giving us the agave supply and production capacity to support growing demand.",

      // Questions
      q1Title: "Can I use it for RTD canned cocktails?",
      q1Desc: "Yes, same clean profile, same CAE compliance.",
      q2Title: "Can I bottle my own tequila brand?",
      q2Desc: "Yes. Work with an authorised bottler in your market; we supply the compliant bulk shipment, and they bottle and label under your brand.",

      // Label Rejection Banner
      labelAlertTitle: "We help you avoid label rejections:",
      labelAlertDesc: "We review your final product label's use of \"Tequila\" and related terms against destination rules before bottling. Official fees, filings, brokers, freight, and insurance are coordinated or quoted separately according to your project.",

      // Certified Quality
      qualityEyebrow: "CERTIFIED QUALITY",
      qualityTitle: "Consistency at scale, built into every batch.",
      qualityCrt: "CRT verified · CAE certified.",
      qualityTracking: "We stay on top of every shipment: we coordinate directly with your freight forwarders and customs brokers, origin to destination. If something needs attention, like a delay or a hold at customs, you hear about it before it affects your timeline, not after.",
      kpi1Title: "Ex Works Ayotlán",
      kpi1Desc: "You choose your own freight forwarder, insurer, and logistics partners. We provide the export documentation and origin coordination for every approved load.",
      kpi2Title: "13.5M L / 8M plants",
      kpi2Desc: "Annual production capacity, from agave growing since 1992",
      kpi3Title: "Estimated readiness: 20 business days",
      kpi3Desc: "From confirmed order to product ready for collection, once set up. Forecast-based programs may allow faster availability.",

      // Contact & Form
      contactTitle: "Let's talk volume, profile, and price.",
      contactDesc: "Send us your target market, estimated volume, desired profile, and timeline. We will be direct about the best route, sample path, pricing structure, and export requirements.",
      contactLabel: "CONTACT",
      contactName: "Fernanda Quintana",
      contactRole: "KAE of Private Labels, Bulk, & Emerging Markets",
      contactEmail: "fernanda@casaloy.com",
      contactPhone: "+52 33 2832 9955",
      contactDomain: "casaloy.com",
      visitLabel: "VISIT",
      visitDesc: "Ayotlán, Jalisco, México, 90 min from Guadalajara. Fly in and we will pick you up.",
      btnWhatsapp: "Direct WhatsApp Message",
      btnVcard: "Download vCard",

      formTitle: "Request Quotation & Technical Guidance",
      formName: "Full Name *",
      formCompany: "Company / Brand *",
      formEmail: "Corporate Email *",
      formPhone: "Phone / WhatsApp *",
      formMarket: "Destination Market / Country",
      formVolume: "Estimated Volume (Liters)",
      formProfile: "Target Sensory Profile (Blanco, Reposado or RTD)",
      formTimeline: "Projected Timeline / Dispatch Date",
      formSubmitBtn: "Send Requirements to Fernanda Quintana →",
      formSubmitting: "Submitting requirements...",
      successTitle: "Inquiry Successfully Sent!",
      successDesc: "Thank you. Fernanda Quintana will review your specifications and reply with a technical and economic proposal within 24 business hours."
    }
  };

  const t = content[currentLang] || content.es;

  // The 4 Core Photos from Page 1 of the One-Pager (Formatted with MaquilasV3 interactive photo banner format)
  const onePagerPhotos = [
    {
      num: "01",
      tag: currentLang === "es" ? "Tanques de Acero Inoxidable" : "Stainless Steel Tanks",
      copperTag: currentLang === "es" ? "01 · TANQUES DE ENVASADO & REPOSO" : "01 · HOLDING & PACKAGING TANKS",
      whiteTag: currentLang === "es" ? "HIGIENE INDUSTRIAL" : "INDUSTRIAL SANITATION",
      title: currentLang === "es" ? "Tanques de Almacenamiento Sanitario" : "Sanitary Bulk Holding Tanks",
      desc: currentLang === "es"
        ? "Monitoreo permanente de volumen y grado alcohólico en tanques de acero inoxidable de grado alimenticio para abastecer programas de granel sin variaciones."
        : "Continuous volume and proof control in food-grade stainless steel holding tanks engineered to support uninterrupted bulk programs.",
      specs: currentLang === "es" ? ["Acero Inoxidable", "Grado Alimenticio", "Supervisión CRT"] : ["Stainless Steel", "Food-Grade", "CRT Monitored"],
      src: "/Linea Embotellado Tanque Envasado Casa Loy.jpg"
    },
    {
      num: "02",
      tag: currentLang === "es" ? "Agave Propio" : "Estate Agave",
      copperTag: currentLang === "es" ? "02 · 8M PLANTAS EN TIERRAS PROPIAS" : "02 · 8M ESTATE AGAVE PLANTS",
      whiteTag: currentLang === "es" ? "CULTIVO DESDE 1992" : "FARMING SINCE 1992",
      title: currentLang === "es" ? "Campos de Agave en Los Altos de Jalisco" : "Estate Agave in The Highlands of Jalisco",
      desc: currentLang === "es"
        ? "Ocho millones de plantas de agave en tierras propias en Jalisco, Michoacán y Guanajuato. Certeza de abasto de por vida para marcas internacionales."
        : "Eight million estate agave plants across Jalisco, Michoacán, and Guanajuato, securing pricing stability and lifelong supply for global brands.",
      specs: currentLang === "es" ? ["Altos de Jalisco", "3,600 Hectáreas", "Madurez Óptima"] : ["Highlands of Jalisco", "3,600 Hectares", "Optimal Maturity"],
      src: "/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
    },
    {
      num: "03",
      tag: currentLang === "es" ? "Destilación en Columna" : "Column Distillation",
      copperTag: currentLang === "es" ? "03 · TECNOLOGÍA EUROPEA EN COLUMNA" : "03 · EUROPEAN COLUMN TECHNOLOGY",
      whiteTag: currentLang === "es" ? "55% ALC. VOL." : "55% ABV EXPORT PROOF",
      title: currentLang === "es" ? "Destilación Automatizada para Granel" : "Automated Continuous Distillation",
      desc: currentLang === "es"
        ? "Destilación automatizada en columna con tecnología europea de punta, pensada para producir lotes repetibles y sostener programas de volumen a largo plazo."
        : "Automated continuous column distillation with cutting-edge European technology, engineered for repeatable batches and long-term volume programs.",
      specs: currentLang === "es" ? ["Tecnología Europea", "Lotes Repetibles", "Perfil Limpio"] : ["European Tech", "Repeatable Batches", "Clean Profile"],
      src: "/Columnas Destilacion Tequila Casa Loy.jpg"
    },
    {
      num: "04",
      tag: currentLang === "es" ? "Isotanques & Carga" : "Isotanks & Dispatch",
      copperTag: currentLang === "es" ? "04 · ISOTANQUES & CONTENEDORES IBC" : "04 · ISOTANKS & IBC TOTES",
      whiteTag: currentLang === "es" ? "EX WORKS AYOTLÁN" : "EX WORKS AYOTLÁN",
      title: currentLang === "es" ? "Patio de Maniobras y Carga para Exportación" : "Loading Yard & Export Dispatch",
      desc: currentLang === "es"
        ? "Carga en autotanques, Isotanques (21,000–26,000 L) o contenedores IBC (1,040–1,250 L) bajo estricta inspección regulatoria y precintos del CRT."
        : "Loading dedicated tankers, intermodal Isotanks (21,000–26,000 L), or IBC totes (1,040–1,250 L) under strict CRT regulatory inspection and seals.",
      specs: currentLang === "es" ? ["Isotanques (24K L)", "IBC Totes (1,000 L)", "Precintos CRT"] : ["Isotanks (24K L)", "IBC Totes (1,000 L)", "CRT Seals"],
      src: "/Naves Industriales Casa Loy Tequilera.webp"
    }
  ];

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18]">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url={currentLang === "es" ? "/granel" : "/bulk"}
      />

      {/* ============================================================
          §1. HERO BANNER (Estilo MaquilasV3 con datos exactos del One-Pager)
          ============================================================ */}
      <section className="relative min-h-[90vh] lg:min-h-screen w-full bg-zinc-950 overflow-hidden flex items-center">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              alt="Casa Loy Tequila a Granel Background"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out brightness-[0.78] ${
                heroImageIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
              src={src}
              fetchPriority={idx === 0 ? "high" : "low"}
            />
          ))}
          {/* Exact Gradients from MaquilasV3 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/65 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto w-full pt-28 sm:pt-32 pb-16">
          <div className="max-w-2xl lg:max-w-3xl text-left space-y-3.5 sm:space-y-4 animate-slide-left-right">
            {/* Category Tag */}
            <div className="flex items-center gap-2">
              <span className="font-navigation text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#FDA377] font-semibold bg-black/50 px-3 py-1 border border-[#8C4723]/60">
                {t.heroCategory}
              </span>
              <span className="font-navigation text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.25em] text-white/80 bg-white/10 px-2.5 py-1 border border-white/20">
                NOM 1633 CRT
              </span>
            </div>

            {/* Title with exact 2-line structure from One-Pager */}
            <h1 className="font-serif leading-[1.08] tracking-tight text-white [text-shadow:_0_2px_14px_rgba(0,0,0,0.85)]">
              <span className="block font-medium text-[clamp(28px,3.8vw,52px)]">
                {t.heroTitleLine1}
              </span>
              <span className="block font-medium text-[clamp(28px,3.8vw,52px)]">
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* Subtitle from One-Pager */}
            <p className="font-body-lg text-white/95 font-light leading-relaxed text-xs sm:text-[13px] md:text-sm pt-0.5 [text-shadow:_0_2px_10px_rgba(0,0,0,0.85)] max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Action Buttons matching MaquilasV3 */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-center pt-2">
              <a
                href="#contacto"
                className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3 px-7 transition-all duration-500 min-w-[200px] text-center shadow-lg rounded-none cursor-pointer"
              >
                {t.heroBtnQuote}
              </a>
              <a
                href={t.pdfFileName}
                download
                className="border border-[#FDA377]/70 hover:bg-white/15 text-[#FDA377] hover:text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-6 transition-all duration-500 text-center rounded-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>{t.heroBtnPdf}</span>
              </a>
            </div>

            {/* Slide Indicators */}
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

        {/* Scroll Chevron */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-70 pointer-events-none">
          <svg
            className="w-4 h-4 text-white/70 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* TRUST BAR (NOM 1633 · AUTORIZADO POR EL CRT · ALTOS DE JALISCO · CON RAÍCES EN EL AGAVE DESDE 1992) */}
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
              {t.trustRoots}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          §2. RESEÑA DE ORIGEN & PROGRAMA DE GRANEL DISPONIBLE (One-Pager Page 1)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full space-y-10">
          {/* Historia & Cita Destacada */}
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <p className="font-body-lg text-[#53443a] text-sm sm:text-base leading-relaxed font-light">
                  {t.storyP1}
                </p>
                <p className="font-body-lg text-[#53443a] text-sm sm:text-base leading-relaxed font-light">
                  {t.storyP2}
                </p>
              </div>
              <div className="lg:col-span-4 p-5 sm:p-6 bg-white border-l-4 border-[#8C4723] border-y border-r border-[#1c1c18]/10 shadow-sm">
                <p className="font-serif italic text-sm sm:text-base text-[#1c1c18] leading-relaxed">
                  "{t.storyHighlight}"
                </p>
              </div>
            </div>
          </Reveal>

          {/* PROGRAMA DE GRANEL DISPONIBLE Table / Cards */}
          <Reveal delay={100}>
            <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-8 shadow-sm">
              <div className="mb-6 border-b border-[#1c1c18]/10 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.3em] text-[#8C4723] font-bold block mb-1">
                    {t.specsEyebrow}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c18] tracking-tight">
                    {t.specsTitle}
                  </h2>
                </div>
                <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] bg-[#FAF8F5] px-2.5 py-1 border border-[#8C4723]/30 font-semibold">
                  NOM 1633 CRT
                </span>
              </div>

              {/* 5 Column Grid for the 5 Specs from One-Pager */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Categoría */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 flex flex-col justify-between">
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.25em] text-[#8C4723] font-bold block mb-1">
                    {t.specCatLabel}
                  </span>
                  <div>
                    <div className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                      {t.specCatVal}
                    </div>
                    <div className="text-[11px] text-[#53443a] font-light mt-0.5">
                      {t.specCatSub}
                    </div>
                  </div>
                </div>

                {/* Clases */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 flex flex-col justify-between">
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.25em] text-[#8C4723] font-bold block mb-1">
                    {t.specClassesLabel}
                  </span>
                  <div>
                    <div className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                      {t.specClassesVal}
                    </div>
                    <div className="text-[11px] text-[#53443a] font-light mt-0.5">
                      {currentLang === "es" ? "Alineado a perfil objetivo" : "Tailored to target profile"}
                    </div>
                  </div>
                </div>

                {/* Graduación */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 flex flex-col justify-between">
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.25em] text-[#8C4723] font-bold block mb-1">
                    {t.specStrengthLabel}
                  </span>
                  <div>
                    <div className="font-serif text-base sm:text-lg font-bold text-[#8C4723]">
                      {t.specStrengthVal}
                    </div>
                    <div className="text-[11px] text-[#53443a] font-light mt-0.5">
                      {currentLang === "es" ? "Alta concentración (110 Proof)" : "High proof export standard"}
                    </div>
                  </div>
                </div>

                {/* Presentación */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 flex flex-col justify-between">
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.25em] text-[#8C4723] font-bold block mb-1">
                    {t.specPresLabel}
                  </span>
                  <div>
                    <div className="font-serif text-sm sm:text-base font-bold text-[#1c1c18] leading-tight">
                      {t.specPresVal}
                    </div>
                    <div className="text-[11px] text-[#53443a] font-light mt-0.5">
                      {t.specPresSub}
                    </div>
                  </div>
                </div>

                {/* Uso */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#1c1c18]/10 flex flex-col justify-between">
                  <span className="font-navigation text-[9.5px] uppercase tracking-[0.25em] text-[#8C4723] font-bold block mb-1">
                    {t.specUseLabel}
                  </span>
                  <div>
                    <div className="font-serif text-sm sm:text-base font-bold text-[#1c1c18] leading-tight">
                      {t.specUseVal}
                    </div>
                    <div className="text-[11px] text-[#53443a] font-light mt-0.5">
                      {currentLang === "es" ? "Cumplimiento con CAE" : "With full CAE compliance"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          §3. BANNER DE FOTOS INTERACTIVO (Formato MaquilasV3 con las 4 fotos del One-Pager)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#F6F2EA] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          {/* Header */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-6">
              <div>
                <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                  {currentLang === "es" ? "INSTALACIONES & OPERACIÓN" : "FACILITIES & OPERATIONS"}
                </span>
                <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight">
                  {currentLang === "es" ? "Infraestructura de Granel en Ayotlán" : "Bulk Infrastructure in Ayotlán"}
                </h2>
              </div>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed max-w-md text-xs sm:text-sm">
                {currentLang === "es"
                  ? "Visualiza las estaciones de almacenamiento, cultivo propio, destilación europea y carga para exportación."
                  : "Explore our holding tanks, estate agave fields, European distillation, and export dispatch bays."}
              </p>
            </div>
          </Reveal>

          {/* Interactive Cinema Viewer matching MaquilasV3 format */}
          <Reveal delay={100}>
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] max-h-[420px] rounded-none overflow-hidden border border-[#1c1c18]/15 shadow-md bg-black group mb-4">
              {(() => {
                const currentPhoto = onePagerPhotos[activePhotoIdx];
                return (
                  <>
                    <img
                      key={currentPhoto.src}
                      src={currentPhoto.src}
                      alt={currentPhoto.title}
                      className="w-full h-full object-cover brightness-[0.74] transition-all duration-700 ease-out scale-100 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none"></div>

                    {/* Left / Right Chevron Controls */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIdx((prev) =>
                          prev === 0 ? onePagerPhotos.length - 1 : prev - 1
                        );
                      }}
                      aria-label="Previous Photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#8C4723] text-white border border-white/20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIdx((prev) =>
                          prev === onePagerPhotos.length - 1 ? 0 : prev + 1
                        );
                      }}
                      aria-label="Next Photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#8C4723] text-white border border-white/20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    {/* Overlaid Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-navigation text-[10.5px] sm:text-[12px] text-white uppercase tracking-[0.2em] bg-[#8C4723] px-3 py-0.5 font-semibold inline-block rounded-none shadow-sm">
                            {currentPhoto.copperTag}
                          </span>
                          <span className="font-navigation text-[10.5px] sm:text-[12px] text-white uppercase tracking-wider bg-white/15 backdrop-blur-md px-2.5 py-0.5 border border-white/20 inline-block rounded-none shadow-sm">
                            {currentPhoto.whiteTag}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl text-white font-bold">
                          {currentPhoto.title}
                        </h3>
                        <p className="font-body-md text-white/90 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                          {currentPhoto.desc}
                        </p>
                      </div>

                      {/* Specs Pills */}
                      <div className="flex flex-wrap sm:flex-col gap-1.5 sm:items-end">
                        {currentPhoto.specs.map((spec, sIdx) => (
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

          {/* 4 Photo Selector Buttons (Formato MaquilasV3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {onePagerPhotos.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`text-left p-3 border transition-all rounded-none cursor-pointer ${
                  activePhotoIdx === idx
                    ? "bg-[#8C4723] border-[#8C4723] text-white shadow-sm"
                    : "bg-white border-[#1c1c18]/10 hover:border-[#8C4723] text-[#53443a] hover:text-[#1c1c18]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-navigation text-[10px] font-bold ${
                      activePhotoIdx === idx ? "text-[#ffdbc7]" : "text-[#8C4723]"
                    }`}
                  >
                    {item.num}
                  </span>
                  {activePhotoIdx === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffdbc7] animate-pulse"></span>
                  )}
                </div>
                <div className="font-serif text-xs sm:text-sm font-semibold truncate">
                  {item.tag}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §4. COORDINACIÓN PARA LA EXPORTACIÓN, DESDE EL ORIGEN (3 Pasos del One-Pager)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full">
          <Reveal>
            <div className="max-w-3xl mb-8">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.stepsEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.stepsTitle}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Step 01 */}
            <Reveal delay={100}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-md rounded-none">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-3xl font-light text-[#8C4723]">{t.step1Num}</span>
                    <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                      {currentLang === "es" ? "Alineación" : "Alignment"}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1c18] mb-2 leading-snug">
                    {t.step1Title}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                    {t.step1Desc}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 02 */}
            <Reveal delay={150}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-md rounded-none">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-3xl font-light text-[#8C4723]">{t.step2Num}</span>
                    <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                      {currentLang === "es" ? "Regulación CRT" : "CRT Regulation"}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1c18] mb-2 leading-snug">
                    {t.step2Title}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                    {t.step2Desc}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 03 */}
            <Reveal delay={200}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full flex flex-col justify-between transition-all duration-500 hover:border-[#8C4723] hover:shadow-md rounded-none">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-3xl font-light text-[#8C4723]">{t.step3Num}</span>
                    <span className="font-navigation text-[9px] uppercase tracking-wider text-[#8C4723] font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#8C4723]/30">
                      {currentLang === "es" ? "Inspección EXW" : "EXW Inspection"}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1c18] mb-2 leading-snug">
                    {t.step3Title}
                  </h3>
                  <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                    {t.step3Desc}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §5. CÓMO TRABAJAR CON CASA LOY (One-Pager Page 2)
          ============================================================ */}
      <section className="py-12 md:py-16 bg-[#FAF6F0] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full space-y-8">
          <Reveal>
            <div className="max-w-3xl mb-6">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.workEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight mb-2">
                {t.workTitle}
              </h2>
            </div>
          </Reveal>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Pillar 1 */}
            <Reveal delay={100}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                  {t.pillar1Title}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.pillar1Desc}
                </p>
              </div>
            </Reveal>

            {/* Pillar 2 */}
            <Reveal delay={150}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                  {t.pillar2Title}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.pillar2Desc}
                </p>
              </div>
            </Reveal>

            {/* Pillar 3 */}
            <Reveal delay={200}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                  {t.pillar3Title}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.pillar3Desc}
                </p>
              </div>
            </Reveal>

            {/* Pillar 4 */}
            <Reveal delay={250}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1c18]">
                  {t.pillar4Title}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.pillar4Desc}
                </p>
              </div>
            </Reveal>
          </div>

          {/* 2 Strategic Q&A Cards from One-Pager */}
          <Reveal delay={300}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
              <div className="p-5 bg-white border border-[#8C4723]/30 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#8C4723]">
                  <span className="material-symbols-outlined text-lg">local_bar</span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#1c1c18]">
                    {t.q1Title}
                  </h4>
                </div>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed pl-6">
                  {t.q1Desc}
                </p>
              </div>

              <div className="p-5 bg-white border border-[#8C4723]/30 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#8C4723]">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#1c1c18]">
                    {t.q2Title}
                  </h4>
                </div>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed pl-6">
                  {t.q2Desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Label Rejection Warning Callout Banner from One-Pager */}
          <Reveal delay={350}>
            <div className="p-5 bg-[#FAF8F5] border-l-4 border-[#8C4723] border-y border-r border-[#1c1c18]/10 text-xs sm:text-sm text-[#53443a] leading-relaxed shadow-sm">
              <span className="font-bold text-[#1c1c18] block mb-1">
                ✦ {t.labelAlertTitle}
              </span>
              <p className="font-light">{t.labelAlertDesc}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          §6. CALIDAD CERTIFICADA & KPIs (One-Pager Page 2)
          ============================================================ */}
      <section ref={statsRef} className="py-12 md:py-16 bg-[#fcf9f3] border-b border-[#1c1c18]/10">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full space-y-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block">
                {t.qualityEyebrow}
              </span>
              <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-light text-[#1c1c18] leading-tight">
                {t.qualityTitle}
              </h2>
              <div className="font-navigation text-xs uppercase tracking-wider text-[#8C4723] font-semibold pt-1">
                {t.qualityCrt}
              </div>

              {/* Official Badges from One-Pager Page 2 */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <span className="px-3 py-1 bg-white border border-[#1c1c18]/15 font-navigation text-[10px] font-bold text-stone-800 tracking-wider">
                  USDA ORGANIC
                </span>
                <span className="px-3 py-1 bg-white border border-[#1c1c18]/15 font-navigation text-[10px] font-bold text-stone-800 tracking-wider">
                  KMD KOSHER
                </span>
                <span className="px-3 py-1 bg-white border border-[#1c1c18]/15 font-navigation text-[10px] font-bold text-stone-800 tracking-wider">
                  SAGARPA ORGÁNICO MÉXICO
                </span>
                <span className="px-3 py-1 bg-[#8C4723] text-white font-navigation text-[10px] font-bold tracking-wider">
                  CRT CAE
                </span>
              </div>
            </div>
          </Reveal>

          {/* Tracking Commitment Paragraph with Left Accent Border */}
          <Reveal delay={100}>
            <div className="max-w-3xl mx-auto p-5 bg-white border-l-4 border-[#8C4723] border-y border-r border-[#1c1c18]/10 shadow-sm text-xs sm:text-sm text-[#53443a] leading-relaxed font-light">
              {t.qualityTracking}
            </div>
          </Reveal>

          {/* 3 Key Metrics Cards from One-Pager */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
            {/* Metric 1 */}
            <Reveal delay={150}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <span className="font-navigation text-[9.5px] uppercase tracking-wider text-[#8C4723] font-bold block">
                  INCOTERMS
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1c1c18]">
                  {t.kpi1Title}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.kpi1Desc}
                </p>
              </div>
            </Reveal>

            {/* Metric 2 */}
            <Reveal delay={200}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <span className="font-navigation text-[9.5px] uppercase tracking-wider text-[#8C4723] font-bold block">
                  CAPACIDAD & ABASTO
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#8C4723]">
                  {counters.capacity}M L / {counters.plants}M plantas
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.kpi2Desc}
                </p>
              </div>
            </Reveal>

            {/* Metric 3 */}
            <Reveal delay={250}>
              <div className="p-6 bg-white border border-[#1c1c18]/15 h-full space-y-2">
                <span className="font-navigation text-[9.5px] uppercase tracking-wider text-[#8C4723] font-bold block">
                  DISPONIBILIDAD
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1c1c18]">
                  {counters.days} {currentLang === "es" ? "días hábiles" : "business days"}
                </h3>
                <p className="font-body-md text-[#53443a] font-light text-xs sm:text-sm leading-relaxed">
                  {t.kpi3Desc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          §7. HABLEMOS DE VOLUMEN, PERFIL Y PRECIO
          (TARJETA EJECUTIVA DE FERNANDA QUINTANA + FORMULARIO B2B)
          ============================================================ */}
      <section id="contacto" className="py-14 sm:py-20 bg-[#FAF6F0]">
        <div className="max-w-[1240px] mx-auto px-6 text-left w-full space-y-10">
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-navigation text-[10px] sm:text-[11px] text-[#8C4723] uppercase tracking-[0.35em] font-semibold block mb-1">
                {t.contactLabel}
              </span>
              <h2 className="font-serif text-[clamp(26px,3.2vw,44px)] font-light text-[#1c1c18] leading-[1.12] tracking-tight mb-2">
                {t.contactTitle}
              </h2>
              <p className="font-body-lg text-[#53443a] font-light leading-relaxed text-xs sm:text-sm md:text-base">
                {t.contactDesc}
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
                      alt={t.contactName}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c18]">
                      {t.contactName}
                    </div>
                    <div className="font-navigation text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8C4723] font-semibold">
                      {t.contactRole}
                    </div>
                    <div className="font-navigation text-[9.5px] uppercase tracking-widest text-[#53443a]">
                      Casa Loy Tequilera · NOM 1633
                    </div>
                  </div>
                </div>

                {/* Direct Contact Links */}
                <div className="py-4 space-y-2.5 text-xs font-navigation text-[#53443a] border-b border-[#1c1c18]/10">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">mail</span>
                    <a
                      href={`mailto:${t.contactEmail}`}
                      className="hover:text-[#8C4723] transition-colors font-medium"
                    >
                      {t.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">phone_iphone</span>
                    <a
                      href="tel:+523328329955"
                      className="hover:text-[#8C4723] transition-colors font-medium"
                    >
                      {t.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#8C4723] text-base">language</span>
                    <a
                      href="https://casaloy.com"
                      className="hover:text-[#8C4723] transition-colors font-medium"
                    >
                      {t.contactDomain}
                    </a>
                  </div>
                </div>

                {/* Direct Action Buttons for Fernanda */}
                <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="https://wa.me/523328329955?text=Hola%20Fernanda,%20me%20gustar%C3%ADa%20cotizar%20el%20programa%20de%20Tequila%20a%20Granel%20de%20Casa%20Loy."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-navigation text-[10px] uppercase tracking-wider py-2.5 px-3 text-center transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>{t.btnWhatsapp}</span>
                  </a>
                  <a
                    href="/Fernanda_Quintana.vcf"
                    download="Fernanda_Quintana.vcf"
                    className="flex-1 border border-[#8C4723] text-[#8C4723] hover:bg-[#8C4723] hover:text-white font-navigation text-[10px] uppercase tracking-wider py-2.5 px-3 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">contact_page</span>
                    <span>{t.btnVcard}</span>
                  </a>
                </div>
              </div>

              {/* VISÍTANOS Box from One-Pager Page 2 */}
              <div className="p-5 bg-white border border-[#1c1c18]/10 space-y-1.5 shadow-sm">
                <span className="font-navigation text-[9.5px] uppercase tracking-widest text-[#8C4723] font-bold block">
                  {t.visitLabel}
                </span>
                <p className="font-body-md text-xs sm:text-sm text-[#53443a] leading-relaxed font-light">
                  {t.visitDesc}
                </p>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Cotización del One-Pager */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#1c1c18]/15 p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-[#1c1c18]/10 pb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1c18]">
                    {t.formTitle}
                  </h3>
                  <p className="font-navigation text-xs text-[#53443a] font-light mt-1">
                    {currentLang === "es"
                      ? "Envíenos los datos de su proyecto para recibir la ruta, proceso de muestras y estructura de precios."
                      : "Send us your project details to receive the export route, sampling process, and pricing structure."}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <h4 className="font-serif text-xl font-bold text-emerald-900">
                      {t.successTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-800 font-light leading-relaxed max-w-md mx-auto">
                      {t.successDesc}
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
                          {t.formName}
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
                          {t.formCompany}
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          value={leadForm.company}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "Ej. Spirits Imports LLC" : "e.g. Spirits Co."}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formEmail}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={leadForm.email}
                          onChange={handleFormChange}
                          placeholder="carlos@empresa.com"
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formPhone}
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

                    {/* Market & Volume (from One-Pager Prompt) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formMarket}
                        </label>
                        <input
                          type="text"
                          name="market"
                          value={leadForm.market}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "EE.UU., Reino Unido, etc." : "USA, UK, etc."}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formVolume}
                        </label>
                        <input
                          type="text"
                          name="volume"
                          value={leadForm.volume}
                          onChange={handleFormChange}
                          placeholder="24,000 L (1 Isotanque)"
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    {/* Profile & Timeline (from One-Pager Prompt) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formProfile}
                        </label>
                        <input
                          type="text"
                          name="profile"
                          value={leadForm.profile}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "Blanco 55%, Reposado o RTD" : "Blanco 55%, Reposado or RTD"}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#1c1c18] font-semibold mb-1">
                          {t.formTimeline}
                        </label>
                        <input
                          type="text"
                          name="timeline"
                          value={leadForm.timeline}
                          onChange={handleFormChange}
                          placeholder={currentLang === "es" ? "Próximos 30-60 días" : "Next 30-60 days"}
                          className="w-full p-2.5 border border-[#1c1c18]/20 text-xs font-body focus:border-[#8C4723] focus:outline-none rounded-none bg-stone-50/50"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#8C4723] hover:bg-[#a6562b] disabled:bg-stone-400 text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 transition-all rounded-none shadow-md cursor-pointer"
                      >
                        {isSubmitting ? t.formSubmitting : t.formSubmitBtn}
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
          §8. FOOTER RIBBON (Descarga directa del PDF oficial del One-Pager)
          ============================================================ */}
      <section className="py-8 bg-[#141C1B] text-white border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="font-navigation text-[9.5px] uppercase tracking-widest text-[#FDA377] font-semibold">
              CASA LOY TEQUILERA · NOM 1633 CRT
            </span>
            <div className="font-serif text-sm sm:text-base text-white/90">
              {currentLang === "es" ? "Ficha Técnica Oficial Tequila a Granel" : "Official Bulk Tequila Technical Datasheet"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={t.pdfFileName}
              download
              className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] uppercase tracking-[0.2em] font-medium py-2.5 px-6 transition-all rounded-none flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>{t.heroBtnPdf}</span>
            </a>
            <a
              href="#contacto"
              className="border border-white/50 hover:bg-white/10 text-white font-navigation text-[10px] uppercase tracking-[0.2em] font-medium py-2.5 px-5 transition-all rounded-none cursor-pointer"
            >
              {currentLang === "es" ? "Contactar" : "Contact"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
