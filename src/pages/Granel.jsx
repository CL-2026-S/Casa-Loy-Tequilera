import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// Scroll entrance animation component
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

  // Synchronize language if prop changes
  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  // Lead Form State
  const [formState, setFormState] = useState({
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

  // Interactive Volume Calculator State
  const [calcVolume, setCalcVolume] = useState(24000);
  const [selectedClass, setSelectedClass] = useState("blanco");
  const [selectedFaq, setSelectedFaq] = useState(0);

  // Animated KPIs Counters
  const [counters, setCounters] = useState({ capacity: 0, agave: 0, days: 0 });
  const [countersTriggered, setCountersTriggered] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setCounters({ capacity: 13.5, agave: 8, days: 20 });
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
    const duration = 1600;
    const start = performance.now();
    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        capacity: Number((13.5 * ease).toFixed(1)),
        agave: Math.round(8 * ease),
        days: Math.round(20 * ease)
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCounters({ capacity: 13.5, agave: 8, days: 20 });
      }
    };
    requestAnimationFrame(frame);
  }, [countersTriggered]);

  // Cal.com Embed
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

  // Form submission handler
  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: formState.name,
        company: formState.company,
        email: formState.email,
        phone: formState.phone,
        solution: `Tequila a Granel / Bulk Tequila (${formState.tequilaClass.toUpperCase()}) - ${formState.volume} L`,
        objective: formState.application === "rtd" ? "RTD Canned Cocktails" : "Envasado en el extranjero",
        stage: `Presentación: ${formState.containerType} | Destino: ${formState.country || "No especificado"}`,
        comments: `Notas adicionales: ${formState.notes || "Ninguna"}. Solicitud generada desde sitio web oficial de Granel Casa Loy.`,
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
        setSubmitError(data.error || (currentLang === "es" ? "Error al procesar la solicitud. Por favor intenta de nuevo." : "Error submitting request. Please try again."));
      }
    } catch (err) {
      console.error("Error submitting bulk lead:", err);
      // Fallback success for network/dev
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Translations Object
  const t = {
    es: {
      seoTitle: "Tequila a Granel de Calidad & Consistente | Casa Loy · NOM 1633",
      seoDesc: "Tequila a granel para envasar en el extranjero y cócteles RTD. Suministro garantizado con 8M plantas de agave propio, 13.5M L de capacidad y coordinación de exportación desde el origen.",
      badgeNom: "NOM 1633",
      badgeCrt: "AUTORIZADO POR EL CRT",
      badgeAltos: "ALTOS DE JALISCO",
      badgeRoots: "CON RAÍCES EN EL AGAVE DESDE 1992",
      headerCategory: "TEQUILA A GRANEL",
      heroTitle: "Tequila a granel de calidad, consistente a cualquier escala.",
      heroSubtitle: "Un perfil de tequila limpio y consistente para envasar en el extranjero. Lo respaldan nuestro propio suministro de agave, nuestra capacidad de producción y la coordinación de la exportación desde el origen.",
      ctaQuote: "Cotizar Programa de Granel",
      ctaSpecs: "Ver Especificaciones Técnicas",
      ctaDownloadPdf: "Descargar Ficha Técnica PDF",
      pdfFileName: "/CASA_LOY_TEQUILA_A_GRANEL_ES.pdf",
      introStoryTitle: "Suministro Confiable & Certeza de Origen",
      introStoryP1: "Casa Loy Tequilera es una productora familiar de tequila ubicada en Ayotlán, en los Altos de Jalisco. Es una de las siete empresas de la familia Loy y la única que lleva su nombre. Cultivamos agave desde 1992, mucho antes de destilar nuestro primer litro. Hoy contamos con ocho millones de plantas de agave en tierras propias en Jalisco, Michoacán y Guanajuato.",
      introStoryP2: "Cada lote se produce para ser consistente a gran escala. Nuestro suministro de agave y nuestra capacidad de producción nos permiten sostener programas de granel a largo plazo. Además, le ayudamos a coordinar el proceso de exportación desde el origen para que su embarque avance con total claridad.",
      introHighlight: "Tequila a granel que protege la marca que usted está construyendo: perfil limpio, suministro confiable, lotes repetibles.",
      
      // Program Specs
      specsSectionEyebrow: "ESPECIFICACIONES INDUSTRIALES",
      specsSectionTitle: "Programa de Granel Disponible",
      specsSectionSub: "Liquid ready-to-ship formulado bajo la estricta supervisión del Consejo Regulador del Tequila (CRT).",
      specCategoryLabel: "CATEGORÍA",
      specCategoryVal: "Tequila Mixto",
      specCategorySub: "(51% agave azul, 49% otros azúcares)",
      specClassesLabel: "CLASES",
      specClassesVal: "Blanco / Reposado",
      specClassesSub: "Maduración y perfil sensorial a medida",
      specStrengthLabel: "GRADUACIÓN",
      specStrengthVal: "55% Alc. Vol.",
      specStrengthSub: "Estándar de exportación (alta concentración)",
      specPackagingLabel: "PRESENTACIÓN",
      specPackagingVal: "Isotanque (21,000–26,000 L)",
      specPackagingSub: "o Contenedores IBC (1,040–1,250 L)",
      specUseLabel: "USO PRINCIPAL",
      specUseVal: "Envasado en el extranjero / RTD",
      specUseSub: "Cumplimiento normativo total con CAE",

      // 3 Steps
      stepsEyebrow: "COORDINACIÓN PARA LA EXPORTACIÓN",
      stepsTitle: "Desde el Origen Hasta su Destino",
      step1Num: "01",
      step1Title: "Revisión del proyecto y de la marca",
      step1Desc: "Antes de iniciar la producción, definimos con usted el perfil objetivo, el mercado y el volumen requerido.",
      step2Num: "02",
      step2Title: "Documentación regulatoria",
      step2Desc: "Coordinamos para su embarque el Convenio de Vinculación, el Certificado de Aprobación de Envasado (CAE) y el registro ante el CRT.",
      step3Num: "03",
      step3Title: "Producción, liberación y carga",
      step3Desc: "Producimos conforme a la muestra aprobada, nuestro laboratorio propio libera el lote y la carga se realiza bajo inspección regulatoria.",

      // Pillars
      whyEyebrow: "¿POR QUÉ TEQUILA A GRANEL CASA LOY?",
      whyTitle: "Cómo trabajar con Casa Loy",
      pillar1Title: "Tequila Mixto de calidad para envasar en el extranjero",
      pillar1Desc: "Por ley, el Tequila 100% de agave debe envasarse dentro de la zona de Denominación de Origen, en México. El tequila mixto es la categoría oficial que permite envasar legalmente en el extranjero.",
      pillar2Title: "Consistencia a gran escala",
      pillar2Desc: "Destilación automatizada en columna, con tecnología europea de punta, pensada para producir lotes repetibles y sostener programas de volumen a largo plazo sin variación.",
      pillar3Title: "Un perfil hecho para su mercado",
      pillar3Desc: "Podemos partir de su perfil objetivo organoléptico o de una muestra de referencia para adaptar el destilado a la preferencia exacta de sus consumidores.",
      pillar4Title: "Producción con agave propio",
      pillar4Desc: "Cultivamos agave en tierras propias desde 1992. Eso nos otorga blindaje de suministro y la capacidad de producción para crecer al ritmo de su demanda comercial.",

      // Questions callout
      q1Title: "¿Puedo usarlo en cócteles enlatados listos para beber (RTD)?",
      q1Desc: "Sí, el mismo perfil limpio, fresco y equilibrado, con el mismo cumplimiento legal con el CAE.",
      q2Title: "¿Puedo envasar mi propia marca de tequila?",
      q2Desc: "Sí. Trabaje con un envasador autorizado en su mercado. Nosotros le enviamos el granel con todos los requisitos cumplidos, y el envasador lo embotella y etiqueta con su marca.",

      // Label rejection banner
      labelAlertTitle: "Le ayudamos a evitar rechazos de etiqueta:",
      labelAlertText: "Antes del envasado, revisamos que el uso de la palabra \"Tequila\" y de términos relacionados en la etiqueta de su producto final cumpla con las normas del país de destino (TTB en USA, normativas europeas, etc.). Las tarifas oficiales, los trámites, los agentes de aduanas, el flete y el seguro se coordinan o se cotizan por separado, según su proyecto.",

      // Quality & Logistics
      qualityEyebrow: "CALIDAD CERTIFICADA",
      qualityTitle: "Consistencia a gran escala, en cada lote.",
      qualityQuote: "No perdemos de vista ningún embarque: coordinamos directamente con sus agentes de carga y agentes de aduanas, desde el origen hasta el destino. Si algo requiere atención, como un retraso o una retención en aduanas, usted se entera antes de que afecte sus plazos, no después.",
      kpi1Title: "Ex Works (EXW) Ayotlán",
      kpi1Desc: "Usted elige a su agente de carga, a su aseguradora y a sus socios logísticos. Nosotros proporcionamos la documentación de exportación y la coordinación en origen para cada carga aprobada.",
      kpi2Title: "13.5M L / 8M plantas",
      kpi2Desc: "Capacidad anual de destilación en naves industriales de última generación, con agave cultivado desde 1992.",
      kpi3Title: "Disponibilidad estimada: 20 días hábiles",
      kpi3Desc: "Desde la confirmación del pedido hasta que el producto está listo para recoger en planta, una vez establecido el programa. Con programas basados en pronósticos, la disponibilidad puede ser más rápida.",

      // Calculator
      calcEyebrow: "SIMULADOR DE LOGÍSTICA & VOLUMEN",
      calcTitle: "Calculadora de Embarques a Granel",
      calcSub: "Estima el rendimiento, número de contenedores y botellas o latas resultantes a partir de tu volumen proyectado a 55% Alc. Vol.",
      calcVolumeLabel: "Volumen a Granel proyectado (Litros a 55% Alc. Vol.):",
      calcEquivTitle: "Rendimiento Estimado en Destino:",
      calcBottlesLabel: "Botellas equivalentes de 750 ml (diluido a 40% Alc. Vol.):",
      calcCansLabel: "Latas RTD equivalentes de 355 ml (formulado a 5% Alc. Vol.):",
      calcIsotanksLabel: "Isotanques requeridos (24,000 L prom.):",
      calcIbcLabel: "Contenedores IBC requeridos (1,000 L prom.):",
      calcApplyBtn: "Cotizar este Volumen Exacto",

      // Contact & Form
      contactEyebrow: "INICIE SU PROGRAMA B2B",
      contactTitle: "Hablemos de volumen, perfil y precio.",
      contactDesc: "Envíenos su mercado objetivo, el volumen estimado, el perfil que busca y sus plazos. Le diremos sin rodeos cuál es la mejor ruta, cómo funciona el proceso de muestras, cuál es la estructura de precios y qué requisitos de exportación aplican.",
      formName: "Nombre y Apellido *",
      formCompany: "Empresa / Marca *",
      formEmail: "Correo Corporativo *",
      formPhone: "Teléfono / WhatsApp *",
      formCountry: "País o Mercado Destino",
      formVolume: "Volumen Estimado (Lts)",
      formClass: "Clase de Tequila Deseada",
      formClassOptBlanco: "Blanco (Perfil fresco y limpio)",
      formClassOptReposado: "Reposado (Madurado en roble)",
      formClassOptBoth: "Ambas Clases (Blanco & Reposado)",
      formContainer: "Presentación Preferida",
      formContainerIsotank: "Isotanque (21,000–26,000 L)",
      formContainerIbc: "Contenedores IBC Totes (1,040–1,250 L)",
      formContainerAdvice: "Requiero asesoría logística",
      formApp: "Aplicación del Producto",
      formAppBottling: "Envasado / Embotellado de Marca en Destino",
      formAppRtd: "Cócteles enlatados RTD (Ready to Drink)",
      formAppOther: "Otro desarrollo / Base para licores",
      formNotes: "¿Algún requerimiento especial de perfil o fecha estimada de embarque?",
      formSubmit: "Solicitar Propuesta y Estructura de Precios",
      formSubmitting: "Enviando cotización...",
      successTitle: "¡Solicitud Recibida con Éxito!",
      successDesc: "Muchas gracias. Luis Emmanuel Loy y el equipo de exportación a granel revisarán sus requerimientos y responderán con la propuesta técnica en menos de 24 horas hábiles.",
      btnNewInquiry: "Enviar otra consulta",

      // Direct Contact Card
      contactDirectorRole: "Director de Marcas Privadas y Tequila a Granel",
      contactDirectorName: "Luis Emmanuel Loy Bermúdez",
      contactVisitTitle: "VISÍTENOS EN DESTILERÍA",
      contactVisitDesc: "Ayotlán, Jalisco, México. A 90 minutos de Guadalajara. Llegue en avión al Aeropuerto de Guadalajara (GDL); nosotros lo recogemos y coordinamos su recorrido técnico.",
      btnWhatsapp: "Mensaje Directo por WhatsApp",
      btnVcard: "Guardar Contacto (vCard)",
      scheduleTitle: "Agenda una Sesión Técnica de 30 Minutos"
    },
    en: {
      seoTitle: "Quality Bulk Tequila Built for Consistency at Scale | Casa Loy · NOM 1633",
      seoDesc: "Bulk tequila for bottling abroad and RTD canned cocktails. Backed by 8M estate agave plants, 13.5M L annual capacity, and export coordination from origin.",
      badgeNom: "NOM 1633",
      badgeCrt: "CRT AUTHORISED",
      badgeAltos: "HIGHLANDS OF JALISCO",
      badgeRoots: "AGAVE ROOTS SINCE 1992",
      headerCategory: "BULK TEQUILA",
      heroTitle: "Quality Bulk Tequila, Built for Consistency at Scale.",
      heroSubtitle: "A clean, consistent tequila profile for bottling abroad, backed by agave supply, production capacity, and export-ready coordination from origin.",
      ctaQuote: "Get Bulk Program Quotation",
      ctaSpecs: "View Technical Specs",
      ctaDownloadPdf: "Download Program PDF",
      pdfFileName: "/CASA_LOY_BULK_TEQUILA_EN.pdf",
      introStoryTitle: "Reliable Agave Supply & Origin Certainty",
      introStoryP1: "Casa Loy Tequilera is a family-owned tequila producer in Ayotlán, in the Highlands of Jalisco, one of seven companies owned by the Loy family, and the only one with the name. We have been growing agave since 1992, long before we distilled our first liter, and today we hold eight million agave plants on land we own across Jalisco, Michoacán, and Guanajuato.",
      introStoryP2: "Every batch is built for consistency at scale, backed by agave supply and production capacity to support long-term bulk programs. We also help coordinate the export pathway from origin, so your shipment moves with clarity.",
      introHighlight: "Bulk tequila that protects the brand you're building: clean profile, reliable supply, repeatable batches.",
      
      // Program Specs
      specsSectionEyebrow: "INDUSTRIAL SPECIFICATIONS",
      specsSectionTitle: "Available Bulk Program",
      specsSectionSub: "Export-grade bulk liquid produced under strict regulatory supervision by the Tequila Regulatory Council (CRT).",
      specCategoryLabel: "CATEGORY",
      specCategoryVal: "Tequila Mixto",
      specCategorySub: "(51% blue agave, 49% other sugars)",
      specClassesLabel: "CLASSES",
      specClassesVal: "Blanco / Reposado",
      specClassesSub: "Tailored maturation and sensory profile",
      specStrengthLabel: "STRENGTH",
      specStrengthVal: "55% Alc. Vol.",
      specStrengthSub: "Export strength standard for freight efficiency",
      specPackagingLabel: "PRESENTATION",
      specPackagingVal: "Isotank (21,000–26,000 L)",
      specPackagingSub: "or IBC Totes (1,040–1,250 L)",
      specUseLabel: "PRIMARY USE",
      specUseVal: "Bottling abroad / RTD cocktails",
      specUseSub: "Full regulatory compliance with CAE certificate",

      // 3 Steps
      stepsEyebrow: "EXPORT-READY COORDINATION",
      stepsTitle: "From Origin Directly to Destination",
      step1Num: "01",
      step1Title: "Project & brand review",
      step1Desc: "Before production begins, we align with you on target profile, destination market, and projected volume.",
      step2Num: "02",
      step2Title: "Regulatory documentation pathway",
      step2Desc: "We coordinate your Linkage Agreement, Bottler Approval Certificate (CAE), and mandatory CRT registry.",
      step3Num: "03",
      step3Title: "Production, lab release & inspected loading",
      step3Desc: "Produced against your approved benchmark sample, released by our certified lab, and loaded under official regulatory inspection.",

      // Pillars
      whyEyebrow: "WHY CASA LOY BULK TEQUILA",
      whyTitle: "Working with Casa Loy",
      pillar1Title: "Quality Mixto for bottling abroad",
      pillar1Desc: "Tequila 100% Agave must, by law, bottle inside Mexico's Denomination of Origin zone. Mixto is the legal category that allows bottling and packaging abroad.",
      pillar2Title: "Built for consistency at scale",
      pillar2Desc: "European automated column distillation, engineered specifically for repeatable batches and long-term volume programs without drift.",
      pillar3Title: "Market-aligned profile",
      pillar3Desc: "We can work from your target organoleptic profile or reference sample to align the liquid precisely with your market's preferences.",
      pillar4Title: "Agave-backed production",
      pillar4Desc: "Grown on land we own since 1992, giving us sovereign agave supply and production capacity to support your growing volume demands.",

      // Questions callout
      q1Title: "Can I use it for RTD canned cocktails?",
      q1Desc: "Yes, the exact same clean, balanced profile and the exact same CAE regulatory compliance.",
      q2Title: "Can I bottle my own tequila brand?",
      q2Desc: "Yes. Work with an authorised bottler in your market; we supply the compliant bulk shipment, and they bottle and label under your brand.",

      // Label rejection banner
      labelAlertTitle: "We help you avoid label rejections:",
      labelAlertText: "We review your final product label's use of \"Tequila\" and related terms against destination rules (TTB in USA, European guidelines, etc.) before bottling. Official fees, filings, brokers, freight, and insurance are coordinated or quoted separately according to your project.",

      // Quality & Logistics
      qualityEyebrow: "CERTIFIED QUALITY",
      qualityTitle: "Consistency at scale, built into every batch.",
      qualityQuote: "We stay on top of every shipment: we coordinate directly with your freight forwarders and customs brokers, origin to destination. If something needs attention, like a delay or a hold at customs, you hear about it before it affects your timeline, not after.",
      kpi1Title: "Ex Works Ayotlán",
      kpi1Desc: "You choose your own freight forwarder, insurer, and logistics partners. We provide the export documentation and origin coordination for every approved load.",
      kpi2Title: "13.5M L / 8M plants",
      kpi2Desc: "Annual production capacity in cutting-edge industrial facilities, with estate agave growing since 1992.",
      kpi3Title: "Estimated readiness: 20 business days",
      kpi3Desc: "From confirmed order to product ready for collection, once set up. Forecast-based programs may allow significantly faster availability.",

      // Calculator
      calcEyebrow: "LOGISTICS & VOLUME SIMULATOR",
      calcTitle: "Bulk Freight & Yield Calculator",
      calcSub: "Estimate resulting container requirements, retail bottle yields, and RTD beverage can yields from your projected volume at 55% ABV.",
      calcVolumeLabel: "Projected Bulk Volume (Liters at 55% Alc. Vol.):",
      calcEquivTitle: "Estimated Destination Yield:",
      calcBottlesLabel: "Equivalent 750 ml bottles (proofed to 40% ABV):",
      calcCansLabel: "Equivalent 355 ml RTD cans (blended to 5% ABV):",
      calcIsotanksLabel: "Isotanks required (24,000 L avg):",
      calcIbcLabel: "IBC Totes required (1,000 L avg):",
      calcApplyBtn: "Quote this Exact Volume",

      // Contact & Form
      contactEyebrow: "START YOUR B2B BULK PROGRAM",
      contactTitle: "Let's talk volume, profile, and price.",
      contactDesc: "Send us your target market, estimated volume, desired profile, and timeline. We will be direct about the best route, sample path, pricing structure, and export requirements.",
      formName: "Full Name *",
      formCompany: "Company / Brand *",
      formEmail: "Corporate Email *",
      formPhone: "Phone / WhatsApp *",
      formCountry: "Destination Country / Market",
      formVolume: "Estimated Volume (Liters)",
      formClass: "Desired Tequila Class",
      formClassOptBlanco: "Blanco (Crisp, clean profile)",
      formClassOptReposado: "Reposado (Aged in oak)",
      formClassOptBoth: "Both Classes (Blanco & Reposado)",
      formContainer: "Preferred Packaging Presentation",
      formContainerIsotank: "Isotank (21,000–26,000 L)",
      formContainerIbc: "IBC Totes (1,040–1,250 L)",
      formContainerAdvice: "Need logistics guidance",
      formApp: "Intended Application",
      formAppBottling: "Bottling abroad under private label",
      formAppRtd: "RTD Canned Cocktails (Ready to Drink)",
      formAppOther: "Other beverage / Liqueur base",
      formNotes: "Any target profile specifications or desired ship date?",
      formSubmit: "Request Proposal & Pricing Structure",
      formSubmitting: "Submitting inquiry...",
      successTitle: "Inquiry Successfully Received!",
      successDesc: "Thank you. Luis Emmanuel Loy and the bulk export team will review your specifications and reply with a technical proposal within 24 business hours.",
      btnNewInquiry: "Submit another inquiry",

      // Direct Contact Card
      contactDirectorRole: "Head of Private Labels & Bulk Tequila",
      contactDirectorName: "Luis Emmanuel Loy Bermúdez",
      contactVisitTitle: "VISIT OUR DISTILLERY",
      contactVisitDesc: "Ayotlán, Jalisco, México. 90 minutes from Guadalajara. Fly into Guadalajara International Airport (GDL); we will pick you up and host your technical tour.",
      btnWhatsapp: "Direct WhatsApp Message",
      btnVcard: "Save Contact (vCard)",
      scheduleTitle: "Schedule a 30-Minute Technical Call"
    }
  }[currentLang];

  // Calculated Yields
  // Proofing formula: (55% ABV / 40% ABV) = 1.375 proofed volume
  // Bottles 750ml = (Volume * 1.375) / 0.75
  // RTD Cans 355ml at 5% ABV = (Volume * (55 / 5)) / 0.355 = (Volume * 11) / 0.355
  const proofedLiters40 = Math.round(calcVolume * (55 / 40));
  const bottlesCount = Math.round(proofedLiters40 / 0.75);
  const rtdCansCount = Math.round((calcVolume * 11) / 0.355);
  const isotanksCount = Math.max(1, (calcVolume / 24000).toFixed(1));
  const ibcTotesCount = Math.ceil(calcVolume / 1000);

  // FAQ Items
  const faqList = currentLang === "es" ? [
    {
      q: "¿Por qué el Tequila para envasar en el extranjero debe ser Tequila Mixto y no 100% de Agave?",
      a: "Por mandato de la Norma Oficial Mexicana (NOM-006-SCFI) y la Denominación de Origen del Tequila (DOT), todo tequila clasificado como '100% de Agave' debe ser obligatoriamente envasado dentro del territorio mexicano comprendido en la zona protegida. La categoría de Tequila Mixto (51% agave azul y 49% azúcares estándar) es la única vía legalmente avalada por el CRT para ser transportada a granel y embotellada fuera de México."
    },
    {
      q: "¿Qué documentos oficiales entrega Casa Loy para la exportación?",
      a: "Casa Loy proporciona la totalidad del expediente de exportación: Convenio de Vinculación registrado ante el CRT, Certificado de Aprobación de Envasado (CAE), Pedimento de Exportación mexicana, Certificado de Origen, Certificado de Análisis Químico por lote de nuestro laboratorio acreditado, y fichas de seguridad (MSDS)."
    },
    {
      q: "¿Cuál es el volumen mínimo de compra para tequila a granel?",
      a: "Surtimos tanto en contenedores IBC Totes (desde 1,040 a 1,250 Litros) como en Isotanques completos de grado alimenticio (21,000 a 26,000 Litros). Para programas recurrentes o contratos marco, podemos establecer cronogramas de entrega escalonados con disponibilidad garantizada de 20 días hábiles."
    },
    {
      q: "¿El producto se envía listo para diluir o ya ajustado a graduación comercial?",
      a: "El tequila a granel se exporta a 55% Alc. Vol. Esto permite a nuestros clientes optimizar drásticamente el costo de flete marítimo o terrestre, ya que transportan un producto altamente concentrado que rinde un 37.5% más de volumen al ser diluido con agua desmineralizada a 40% Alc. Vol. en su planta envasadora de destino."
    },
    {
      q: "¿Cómo se gestiona el envío de muestras para aprobación técnica?",
      a: "Una vez analizado su perfil objetivo y volumen estimado, nuestro laboratorio prepara y envía botellas de muestra certificadas (Blanco o Reposado a 55% Alc. Vol.) directamente a sus instalaciones para análisis de laboratorio, pruebas sensoriales y de formulación previa a la firma del contrato."
    }
  ] : [
    {
      q: "Why must tequila for bottling abroad be Tequila Mixto rather than 100% Agave?",
      a: "Under the Mexican Official Standard (NOM-006-SCFI) and the Tequila Denomination of Origin (DOT), any tequila labelled as '100% Agave' must legally be bottled inside the protected Mexican territory. The Tequila Mixto category (51% blue agave and 49% standard sugars) is the only category legally authorised by the CRT to be transported in bulk and bottled outside Mexico."
    },
    {
      q: "What official documentation does Casa Loy provide for international export?",
      a: "Casa Loy provides the entire export dossier: Linkage Agreement registered with the CRT, Bottler Approval Certificate (CAE), Mexican Export Pedimento, Certificate of Origin, Batch Chemical Analysis from our accredited in-house lab, and MSDS sheets."
    },
    {
      q: "What is the minimum order quantity (MOQ) for bulk tequila?",
      a: "We supply both in IBC Totes (from 1,040 to 1,250 Litres) and full food-grade Isotanques (21,000 to 26,000 Litres). For recurring programs or volume master agreements, we establish staggered shipping schedules with a 20-business-day turnaround."
    },
    {
      q: "Is the product shipped at retail strength or high-proof?",
      a: "Our bulk tequila is exported at 55% Alc. Vol. This enables clients to drastically optimise maritime and overland freight expenditures by transporting high-density liquid that yields 37.5% more finished volume when proofed with demineralised water to 40% ABV at your local bottling plant."
    },
    {
      q: "How does the benchmark sampling approval process work?",
      a: "Once we assess your target profile and estimated annual volume, our laboratory prepares and couriers certified benchmark sample bottles (Blanco or Reposado at 55% ABV) directly to your facility for lab analysis, bench tasting, and formulation sign-off before contract execution."
    }
  ];

  return (
    <div className="bg-[#FBF9F5] text-stone-800 font-sans min-h-screen selection:bg-[#8C4723] selection:text-white">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        canonical={currentLang === "es" ? "https://casaloy.com/granel" : "https://casaloy.com/bulk"}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: CINEMATIC EDITORIAL WITH REAL HIGH-RES OPERATOR ASSET    */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#141C1B] text-white overflow-hidden pt-28 pb-20">
        {/* Background Image with Atmospheric Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/granel-hero-operario.webp"
            alt="Tequila a granel Casa Loy destilería y columnas de destilación"
            className="w-full h-full object-cover object-center scale-105 transform animate-fade-in transition-transform duration-1000"
          />
          {/* Multi-layered Vignette & Dark Shading */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141C1B]/95 via-[#141C1B]/80 to-[#141C1B]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141C1B] via-transparent to-[#141C1B]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-black/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-left py-12">
          
          {/* Top Trust Ribbon & Badges */}
          <Reveal delay={100}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <span className="bg-[#8C4723] text-amber-100 text-[10px] sm:text-xs uppercase font-bold tracking-[0.25em] px-3.5 py-1.5 rounded-xs shadow-md">
                {t.headerCategory}
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-amber-200/90 border border-amber-400/30 px-3 py-1 rounded-xs backdrop-blur-xs bg-black/30">
                {t.badgeNom}
              </span>
              <span className="hidden sm:inline-block text-stone-400 text-xs">•</span>
              <span className="text-[11px] sm:text-xs font-sans uppercase tracking-widest text-stone-300/90 font-medium">
                {t.badgeCrt}
              </span>
              <span className="hidden md:inline-block text-stone-400 text-xs">•</span>
              <span className="hidden md:inline-block text-[11px] sm:text-xs font-sans uppercase tracking-widest text-stone-300/90 font-medium">
                {t.badgeAltos}
              </span>
            </div>
          </Reveal>

          {/* Main Title */}
          <Reveal delay={200}>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold leading-[1.12] tracking-tight max-w-4xl text-balance">
              {t.heroTitle}
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={300}>
            <p className="mt-6 text-base sm:text-xl text-stone-200/95 font-light leading-relaxed max-w-2xl text-pretty">
              {t.heroSubtitle}
            </p>
          </Reveal>

          {/* Key Specs Pill Bar */}
          <Reveal delay={400}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl bg-stone-900/60 backdrop-blur-md p-3 sm:p-4 rounded-lg border border-stone-700/60 shadow-xl">
              <div>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 tracking-wider">Categoría</span>
                <span className="font-serif text-sm sm:text-base font-bold text-white">Tequila Mixto</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 tracking-wider">Clases</span>
                <span className="font-serif text-sm sm:text-base font-bold text-white">Blanco & Reposado</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 tracking-wider">Graduación</span>
                <span className="font-serif text-sm sm:text-base font-bold text-white">55% Alc. Vol.</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-amber-300 tracking-wider">Presentación</span>
                <span className="font-serif text-sm sm:text-base font-bold text-white">Isotanques & IBC</span>
              </div>
            </div>
          </Reveal>

          {/* Hero CTAs */}
          <Reveal delay={500}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contacto-granel"
                className="bg-[#8C4723] hover:bg-[#70381b] text-white px-7 py-3.5 rounded-sm font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-[#8C4723]/30 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>{t.ctaQuote}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>

              <a
                href={t.pdfFileName}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-sm font-semibold text-xs sm:text-sm tracking-widest uppercase backdrop-blur-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-amber-300">download</span>
                <span>{t.ctaDownloadPdf}</span>
              </a>

              {/* Language Switcher Button */}
              <button
                type="button"
                onClick={() => setCurrentLang(prev => prev === "es" ? "en" : "es")}
                className="bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white border border-stone-600 px-4 py-3 rounded-sm text-xs font-mono transition-colors cursor-pointer ml-auto hidden sm:flex items-center gap-1.5"
                title="Cambiar idioma / Change language"
              >
                <span className="material-symbols-outlined text-sm">language</span>
                <span className="font-bold">{currentLang === "es" ? "EN (English)" : "ES (Español)"}</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FAMILY HERITAGE & SUPPLY INTEGRATION: STORY & AGAVE BACKING            */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#FBF9F5] border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-left space-y-12">
          
          <Reveal>
            <div className="max-w-3xl space-y-4">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {t.introStoryTitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-bold leading-snug">
                {currentLang === "es" 
                  ? "Cultivamos agave desde 1992 para sostener programas a largo plazo." 
                  : "We have grown agave since 1992 to sustain long-term bulk programs."}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-700 leading-relaxed text-sm sm:text-base font-light">
            <Reveal delay={100}>
              <p>{t.introStoryP1}</p>
            </Reveal>
            <Reveal delay={200}>
              <p>{t.introStoryP2}</p>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <div className="bg-[#1E2827] text-white p-6 sm:p-8 rounded-lg border-l-4 border-[#8C4723] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                  {currentLang === "es" ? "PROPUESTA DE VALOR" : "CORE VALUE PROPOSITION"}
                </span>
                <p className="font-serif text-lg sm:text-xl font-medium text-amber-50 italic">
                  "{t.introHighlight}"
                </p>
              </div>
              <a
                href="#calculadora-granel"
                className="shrink-0 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {currentLang === "es" ? "Simular Embarque" : "Simulate Shipment"}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TECHNICAL SPECIFICATIONS MATRIX (AVAILABLE BULK PROGRAM)               */}
      {/* ========================================================================= */}
      <section id="especificaciones" className="py-20 lg:py-24 bg-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-left">
          
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {t.specsSectionEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold">
                {t.specsSectionTitle}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                {t.specsSectionSub}
              </p>
            </div>
          </Reveal>

          {/* 5 Column Spec Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1 */}
            <Reveal delay={100}>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg h-full flex flex-col justify-between hover:border-[#8C4723] transition-colors shadow-2xs group">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#8C4723] text-2xl group-hover:scale-110 transition-transform">category</span>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {t.specCategoryLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {t.specCategoryVal}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 pt-3 border-t border-stone-200/60 mt-4">
                  {t.specCategorySub}
                </p>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={150}>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg h-full flex flex-col justify-between hover:border-[#8C4723] transition-colors shadow-2xs group">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#8C4723] text-2xl group-hover:scale-110 transition-transform">water_drop</span>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {t.specClassesLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {t.specClassesVal}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 pt-3 border-t border-stone-200/60 mt-4">
                  {t.specClassesSub}
                </p>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={200}>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg h-full flex flex-col justify-between hover:border-[#8C4723] transition-colors shadow-2xs group">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#8C4723] text-2xl group-hover:scale-110 transition-transform">percent</span>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {t.specStrengthLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {t.specStrengthVal}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 pt-3 border-t border-stone-200/60 mt-4">
                  {t.specStrengthSub}
                </p>
              </div>
            </Reveal>

            {/* Card 4 */}
            <Reveal delay={250}>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg h-full flex flex-col justify-between hover:border-[#8C4723] transition-colors shadow-2xs group">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#8C4723] text-2xl group-hover:scale-110 transition-transform">local_shipping</span>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {t.specPackagingLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {t.specPackagingVal}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 pt-3 border-t border-stone-200/60 mt-4">
                  {t.specPackagingSub}
                </p>
              </div>
            </Reveal>

            {/* Card 5 */}
            <Reveal delay={300}>
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg h-full flex flex-col justify-between hover:border-[#8C4723] transition-colors shadow-2xs group">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#8C4723] text-2xl group-hover:scale-110 transition-transform">verified</span>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {t.specUseLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {t.specUseVal}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 pt-3 border-t border-stone-200/60 mt-4">
                  {t.specUseSub}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Visual Logistics Photo Strip from Brochure */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-lg overflow-hidden border border-stone-200 shadow-sm h-64 group">
              <img
                src="/Linea Embotellado Tanque Envasado Casa Loy.jpg"
                alt="Tanques y almacenamiento a granel Casa Loy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  {currentLang === "es" ? "Tanques de Acero Inoxidable & Almacenamiento" : "Stainless Steel Bulk Storage Tanks"}
                </span>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-stone-200 shadow-sm h-64 group">
              <img
                src="/Alambiques Acero Inoxidable Platillos Cobre Casa Loy.jpg"
                alt="Columna de destilación continua Casa Loy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  {currentLang === "es" ? "Destilación Continua con Tecnología Europea" : "Automated Continuous Column Distillation"}
                </span>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-stone-200 shadow-sm h-64 group">
              <img
                src="/Naves Industriales Casa Loy Tequilera.webp"
                alt="Naves industriales y patio de carga Casa Loy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  {currentLang === "es" ? "Patio de Carga para Isotanques & Exportación" : "Loading Yard for Food-Grade Isotanques"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 3-STEP EXPORT PATHWAY: DARK HIGH-IMPACT SECTION                        */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#141C1B] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-left relative z-10">
          
          <Reveal>
            <div className="max-w-3xl mb-16 space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C5A059] block">
                {t.stepsEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                {t.stepsTitle}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <Reveal delay={100}>
              <div className="bg-[#1E2827] border border-stone-700/80 p-6 sm:p-8 rounded-lg space-y-4 hover:border-amber-400/50 transition-colors h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-serif text-3xl font-bold text-[#C5A059] block">
                    {t.step1Num}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {t.step1Title}
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed font-light">
                    {t.step1Desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-700/50 flex items-center gap-2 text-stone-400 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#C5A059]">checklist</span>
                  <span>{currentLang === "es" ? "Alineación de objetivos" : "Scope alignment"}</span>
                </div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={200}>
              <div className="bg-[#1E2827] border border-stone-700/80 p-6 sm:p-8 rounded-lg space-y-4 hover:border-amber-400/50 transition-colors h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-serif text-3xl font-bold text-[#C5A059] block">
                    {t.step2Num}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {t.step2Title}
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed font-light">
                    {t.step2Desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-700/50 flex items-center gap-2 text-stone-400 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#C5A059]">description</span>
                  <span>{currentLang === "es" ? "CAE & Trámite CRT" : "CAE & CRT compliance"}</span>
                </div>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={300}>
              <div className="bg-[#1E2827] border border-stone-700/80 p-6 sm:p-8 rounded-lg space-y-4 hover:border-amber-400/50 transition-colors h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-serif text-3xl font-bold text-[#C5A059] block">
                    {t.step3Num}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {t.step3Title}
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed font-light">
                    {t.step3Desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-700/50 flex items-center gap-2 text-stone-400 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#C5A059]">science</span>
                  <span>{currentLang === "es" ? "Liberación analítica" : "Inspected release"}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE VOLUME & LOGISTICS CALCULATOR: PROOFING & CONTAINER YIELDS  */}
      {/* ========================================================================= */}
      <section id="calculadora-granel" className="py-20 lg:py-24 bg-[#FBF9F5] border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-left">
          
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {t.calcEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold">
                {t.calcTitle}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.calcSub}
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-white border-2 border-stone-200/90 rounded-xl p-6 sm:p-10 shadow-lg space-y-8">
              {/* Volume Slider Control */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs sm:text-sm uppercase font-bold tracking-wider text-stone-700">
                    {t.calcVolumeLabel}
                  </label>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#8C4723] bg-amber-50 px-4 py-1.5 rounded border border-amber-200 w-fit">
                    {Number(calcVolume).toLocaleString()} Litros
                  </div>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="120000"
                  step="1000"
                  value={calcVolume}
                  onChange={(e) => setCalcVolume(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#8C4723]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] uppercase font-bold text-stone-400">Presets:</span>
                  {[5000, 12000, 24000, 48000, 96000].map(vol => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setCalcVolume(vol)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        calcVolume === vol 
                          ? "bg-[#8C4723] text-white font-bold" 
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                      }`}
                    >
                      {vol.toLocaleString()} L
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Outputs Dashboard */}
              <div className="border-t border-stone-200 pt-6">
                <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-4">
                  {t.calcEquivTitle}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-1">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">
                      {t.calcBottlesLabel}
                    </span>
                    <span className="font-serif text-2xl font-bold text-stone-900 block text-[#8C4723]">
                      ~{bottlesCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {currentLang === "es" ? "Diluido de 55% a 40% Alc. Vol." : "Diluted from 55% to 40% ABV"}
                    </span>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-1">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">
                      {t.calcCansLabel}
                    </span>
                    <span className="font-serif text-2xl font-bold text-stone-900 block text-[#2F403E]">
                      ~{rtdCansCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {currentLang === "es" ? "Formulado a 5% Alc. Vol." : "Blended at 5% ABV"}
                    </span>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-1">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">
                      {t.calcIsotanksLabel}
                    </span>
                    <span className="font-serif text-2xl font-bold text-stone-900 block">
                      {isotanksCount}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {currentLang === "es" ? "Isotanques grado alimenticio" : "Food-grade isotanks"}
                    </span>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-1">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">
                      {t.calcIbcLabel}
                    </span>
                    <span className="font-serif text-2xl font-bold text-stone-900 block">
                      {ibcTotesCount}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {currentLang === "es" ? "Totes IBC en pallets" : "IBC Totes on pallets"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button inside Calculator */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  {currentLang === "es" 
                    ? "Los volúmenes finales pueden ajustarse según la pérdida de proceso y tolerancia de graduación." 
                    : "Final yields may vary slightly depending on plant proofing loss and filtration tolerances."}
                </span>
                <a
                  href="#contacto-granel"
                  onClick={() => setFormState(prev => ({ ...prev, volume: String(calcVolume) }))}
                  className="bg-[#2F403E] hover:bg-[#8C4723] text-white px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  {t.calcApplyBtn}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY CASA LOY BULK TEQUILA: 4 PILLARS & STRATEGIC CALLOUTS              */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-left space-y-16">
          
          <Reveal>
            <div className="max-w-3xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {t.whyEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold">
                {t.whyTitle}
              </h2>
            </div>
          </Reveal>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={100}>
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                <span className="material-symbols-outlined text-[#8C4723] text-2xl">public</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {t.pillar1Title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {t.pillar1Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                <span className="material-symbols-outlined text-[#8C4723] text-2xl">precision_manufacturing</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {t.pillar2Title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {t.pillar2Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                <span className="material-symbols-outlined text-[#8C4723] text-2xl">tune</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {t.pillar3Title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {t.pillar3Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                <span className="material-symbols-outlined text-[#8C4723] text-2xl">yard</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {t.pillar4Title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {t.pillar4Desc}
                </p>
              </div>
            </Reveal>
          </div>

          {/* 2 Strategic Questions Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={150}>
              <div className="p-6 bg-amber-50/70 border border-amber-300/80 rounded-lg space-y-2">
                <h4 className="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8C4723]">liquor</span>
                  {t.q1Title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  {t.q1Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="p-6 bg-amber-50/70 border border-amber-300/80 rounded-lg space-y-2">
                <h4 className="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8C4723]">brand_awareness</span>
                  {t.q2Title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  {t.q2Desc}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Regulatory & Label Advisory Callout Box from Page 2 */}
          <Reveal delay={300}>
            <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-lg border-l-4 border-amber-400 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
                <span className="material-symbols-outlined text-lg">policy</span>
                <span>{t.labelAlertTitle}</span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                {t.labelAlertText}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CERTIFIED QUALITY & LOGISTICS STATS: LIVE COUNTERS                      */}
      {/* ========================================================================= */}
      <section ref={statsRef} className="py-20 lg:py-24 bg-[#141C1B] text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-left space-y-16">
          
          <Reveal>
            <div className="max-w-3xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C5A059] block">
                {t.qualityEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold">
                {t.qualityTitle}
              </h2>
              <p className="text-stone-300 text-base leading-relaxed font-light italic max-w-3xl pt-2">
                "{t.qualityQuote}"
              </p>
            </div>
          </Reveal>

          {/* Certifications Banner Badges */}
          <Reveal delay={150}>
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#1E2827] border border-stone-700/80 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-xl">verified</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                  {currentLang === "es" ? "Verificado por el CRT" : "CRT Verified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-xl">license</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                  {currentLang === "es" ? "Con Certificado de Aprobación de Envasado (CAE)" : "CAE Bottling Certificate"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-xl">eco</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                  USDA Organic & Sagarpa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-xl">workspace_premium</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                  KMD Kosher
                </span>
              </div>
            </div>
          </Reveal>

          {/* 3 Logistics KPI Columns with Animated Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={200}>
              <div className="bg-[#1E2827] border border-stone-700/70 p-6 sm:p-8 rounded-lg space-y-4 h-full">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A059] block">
                  EXW Ayotlán
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {t.kpi1Title}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {t.kpi1Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-[#1E2827] border border-stone-700/70 p-6 sm:p-8 rounded-lg space-y-4 h-full">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A059] block">
                  {counters.capacity}M L / {counters.agave}M
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {t.kpi2Title}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {t.kpi2Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="bg-[#1E2827] border border-stone-700/70 p-6 sm:p-8 rounded-lg space-y-4 h-full">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A059] block">
                  {counters.days} {currentLang === "es" ? "Días" : "Days"}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {t.kpi3Title}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {t.kpi3Desc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ ACCORDION: REGULATORY, EXPORT & TECHNICAL CERTAINTY                */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#FBF9F5] border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-left space-y-12">
          
          <Reveal>
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {currentLang === "es" ? "PREGUNTAS FRECUENTES" : "FREQUENTLY ASKED QUESTIONS"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold">
                {currentLang === "es" ? "Certeza Técnica & Comercial" : "Technical & Commercial Clarity"}
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = selectedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-lg overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/80 transition-colors"
                  >
                    <span className="font-serif text-sm sm:text-base font-bold text-stone-900">
                      {faq.q}
                    </span>
                    <span className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#8C4723]" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100 pt-3 animate-fade-in font-light">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. LEAD INQUIRY & CONTACT SECTION ("Hablemos de volumen, perfil y precio") */}
      {/* ========================================================================= */}
      <section id="contacto-granel" className="py-20 lg:py-24 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Info & Luis Loy Card */}
            <div className="lg:col-span-5 space-y-8">
              <Reveal>
                <div className="space-y-4">
                  <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                    {t.contactEyebrow}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold leading-tight">
                    {t.contactTitle}
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    {t.contactDesc}
                  </p>
                </div>
              </Reveal>

              {/* Luis Loy Executive Card */}
              <Reveal delay={150}>
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl space-y-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src="/luis-emmanuel-loy-bermudez.webp"
                      alt="Luis Emmanuel Loy Bermúdez"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#8C4723]/40 shadow-xs"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-900">
                        {t.contactDirectorName}
                      </h4>
                      <p className="text-xs text-[#8C4723] font-medium">
                        {t.contactDirectorRole}
                      </p>
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                        NOM 1633 · Casa Loy Tequilera
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-200/80 text-xs">
                    <div className="flex items-center gap-2 text-stone-700">
                      <span className="material-symbols-outlined text-sm text-[#8C4723]">mail</span>
                      <a href="mailto:luisloyb@casaloy.com" className="hover:underline font-mono">
                        luisloyb@casaloy.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <span className="material-symbols-outlined text-sm text-[#8C4723]">call</span>
                      <a href="tel:+14698798739" className="hover:underline font-mono">
                        +1 469 879 8739
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <a
                      href="https://wa.me/14698798739?text=Hola%20Luis,%20estoy%20interesado%20en%20el%20programa%20de%20Tequila%20a%20Granel%20de%20Casa%20Loy."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>{t.btnWhatsapp}</span>
                    </a>
                    <a
                      href="/Luis_Emmanuel_Loy_Bermudez.vcf"
                      download
                      className="inline-flex items-center justify-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-2 rounded text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">contact_page</span>
                      <span>{t.btnVcard}</span>
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Visit Invitation */}
              <Reveal delay={250}>
                <div className="bg-[#1E2827] text-white p-6 rounded-xl space-y-2 border-l-4 border-amber-400">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                    {t.contactVisitTitle}
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {t.contactVisitDesc}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right: Technical Lead Capture Form */}
            <div className="lg:col-span-7">
              <Reveal delay={200}>
                <div className="bg-stone-50 border-2 border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-md">
                  {submitSuccess ? (
                    <div className="text-center py-12 space-y-4 animate-fade-in">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        {t.successTitle}
                      </h3>
                      <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                        {t.successDesc}
                      </p>
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setSubmitSuccess(false)}
                          className="text-xs uppercase font-bold tracking-wider text-[#8C4723] hover:underline cursor-pointer"
                        >
                          {t.btnNewInquiry}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitLead} className="space-y-4">
                      <h3 className="font-serif text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">
                        {currentLang === "es" ? "Formulario de Requerimientos a Granel" : "Bulk Tequila Technical Inquiry"}
                      </h3>

                      {submitError && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded">
                          {submitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formName}
                          </label>
                          <input
                            type="text"
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            placeholder="Ej. John Smith"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formCompany}
                          </label>
                          <input
                            type="text"
                            required
                            value={formState.company}
                            onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                            placeholder="Ej. Spirits Import Co. / Brand LLC"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formEmail}
                          </label>
                          <input
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            placeholder="john@spiritsbrand.com"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formPhone}
                          </label>
                          <input
                            type="text"
                            required
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formCountry}
                          </label>
                          <input
                            type="text"
                            value={formState.country}
                            onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                            placeholder="Ej. United States / Germany / Spain"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formVolume}
                          </label>
                          <input
                            type="number"
                            value={formState.volume}
                            onChange={(e) => setFormState({ ...formState, volume: e.target.value })}
                            placeholder="24000"
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formClass}
                          </label>
                          <select
                            value={formState.tequilaClass}
                            onChange={(e) => setFormState({ ...formState, tequilaClass: e.target.value })}
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723] cursor-pointer"
                          >
                            <option value="blanco">{t.formClassOptBlanco}</option>
                            <option value="reposado">{t.formClassOptReposado}</option>
                            <option value="both">{t.formClassOptBoth}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                            {t.formContainer}
                          </label>
                          <select
                            value={formState.containerType}
                            onChange={(e) => setFormState({ ...formState, containerType: e.target.value })}
                            className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723] cursor-pointer"
                          >
                            <option value="isotank">{t.formContainerIsotank}</option>
                            <option value="ibc">{t.formContainerIbc}</option>
                            <option value="advice">{t.formContainerAdvice}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                          {t.formApp}
                        </label>
                        <select
                          value={formState.application}
                          onChange={(e) => setFormState({ ...formState, application: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723] cursor-pointer"
                        >
                          <option value="bottling">{t.formAppBottling}</option>
                          <option value="rtd">{t.formAppRtd}</option>
                          <option value="other">{t.formAppOther}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-stone-600 mb-1">
                          {t.formNotes}
                        </label>
                        <textarea
                          rows={3}
                          value={formState.notes}
                          onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                          placeholder={currentLang === "es" ? "Cuéntanos sobre tu proyecto, fechas de entrega o requerimientos específicos..." : "Tell us about your project, timeline, target markets or formulation requirements..."}
                          className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#8C4723] hover:bg-[#723617] disabled:bg-stone-400 text-white font-semibold py-3.5 px-6 rounded text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                            <span>{t.formSubmitting}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.formSubmit}</span>
                            <span className="material-symbols-outlined text-base">send</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CAL.COM 30-MIN TECHNICAL CONSULTATION SCHEDULER                       */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#FBF9F5]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <Reveal>
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C4723] block">
                {currentLang === "es" ? "SESIÓN TÉCNICA" : "TECHNICAL SESSION"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold">
                {t.scheduleTitle}
              </h2>
              <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
                {currentLang === "es"
                  ? "Selecciona el día y la hora que mejor se adapte a tu agenda para conversar directamente con nuestro equipo de exportación y maestros destiladores."
                  : "Choose the day and time that best fits your schedule to speak directly with our export leadership and master distilling team."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm overflow-hidden min-h-[500px]">
              <div id="cal-inline-granel-scheduler" style={{ width: "100%", height: "100%", overflow: "scroll" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER CTA RIBBON: DIRECT PDF DOWNLOAD & WHATSAPP                     */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#141C1B] text-white border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-serif text-lg sm:text-xl font-bold text-white block">
              {currentLang === "es" ? "Casa Loy Tequilera · NOM 1633" : "Casa Loy Tequilera · NOM 1633"}
            </span>
            <span className="text-xs text-stone-400">
              Ayotlán, Jalisco, México · {currentLang === "es" ? "Tequila a Granel para Exportación" : "Bulk Tequila for Global Export"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={t.pdfFileName}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-amber-300">picture_as_pdf</span>
              <span>{t.ctaDownloadPdf}</span>
            </a>

            <a
              href="https://wa.me/14698798739?text=Hola%20Luis,%20estoy%20interesado%20en%20el%20programa%20de%20Tequila%20a%20Granel%20de%20Casa%20Loy."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8C4723] hover:bg-[#723617] text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
