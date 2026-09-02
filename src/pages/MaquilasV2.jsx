import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";

const MexicoFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" className="w-5 h-3.5 shadow-sm border border-black/10 flex-shrink-0 inline-block align-middle">
    <rect width="10" height="20" fill="#006847" />
    <rect x="10" width="10" height="20" fill="#FFFFFF" />
    <rect x="20" width="10" height="20" fill="#C8102E" />
    <path d="M14 11a1 1 0 1 1 2 0v1h-2v-1z" fill="#78521a" />
    <circle cx="15" cy="9.5" r="1.5" fill="#cca625" />
  </svg>
);

const USFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 39" className="w-5 h-3.5 shadow-sm border border-black/10 flex-shrink-0 inline-block align-middle">
    <rect width="74" height="39" fill="#B22234" />
    <rect y="3" width="74" height="3" fill="#FFFFFF" />
    <rect y="9" width="74" height="3" fill="#FFFFFF" />
    <rect y="15" width="74" height="3" fill="#FFFFFF" />
    <rect y="21" width="74" height="3" fill="#FFFFFF" />
    <rect y="27" width="74" height="3" fill="#FFFFFF" />
    <rect y="33" width="74" height="3" fill="#FFFFFF" />
    <rect width="30" height="21" fill="#3C3B6E" />
    <g fill="#FFFFFF">
      <rect x="4" y="3" width="2" height="2" rx="1" />
      <rect x="10" y="3" width="2" height="2" rx="1" />
      <rect x="16" y="3" width="2" height="2" rx="1" />
      <rect x="22" y="3" width="2" height="2" rx="1" />
      <rect x="7" y="6" width="2" height="2" rx="1" />
      <rect x="13" y="6" width="2" height="2" rx="1" />
      <rect x="19" y="6" width="2" height="2" rx="1" />
      <rect x="4" y="9" width="2" height="2" rx="1" />
      <rect x="10" y="9" width="2" height="2" rx="1" />
      <rect x="16" y="9" width="2" height="2" rx="1" />
      <rect x="22" y="9" width="2" height="2" rx="1" />
      <rect x="7" y="12" width="2" height="2" rx="1" />
      <rect x="13" y="12" width="2" height="2" rx="1" />
      <rect x="19" y="12" width="2" height="2" rx="1" />
      <rect x="4" y="15" width="2" height="2" rx="1" />
      <rect x="10" y="15" width="2" height="2" rx="1" />
      <rect x="16" y="15" width="2" height="2" rx="1" />
      <rect x="22" y="15" width="2" height="2" rx="1" />
    </g>
  </svg>
);

export default function MaquilasV2({ lang = "es" }) {
  // Active step in Process Explorer
  const [activeStep, setActiveStep] = useState(0);
  
  // Active problem in Risks section
  const [activeProblem, setActiveProblem] = useState(0);

  // Active B2B Audience Profile
  const [activeAudience, setActiveAudience] = useState(0);

  // Quiz states
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    solution: "",
    stage: "",
    market: "",
    volume: "",
    tequilaType: "",
    assetsReady: [],
    timeline: "",
    notes: ""
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    lada: "",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, []);

  const content = {
    es: {
      heroTitle: "MAQUILA DE TEQUILA DE MARCA PROPIA EN MÉXICO",
      heroSubtitle: "Tu marca de tequila comienza con el auténtico origen en Los Altos de Jalisco.",
      heroSecondary: "Tu visión. Nuestra maestría y legado.",
      heroSub: "Una destilería familiar con NOM 1633 diseñada para fundadores, marcas existentes y distribuidores listos para construir un proyecto con raíces sólidas y trazabilidad total.",
      heroBtnStart: "Iniciar Diagnóstico B2B",
      heroBtnCall: "Reservar Llamada Técnica",
      
      trustNom: "NOM 1633",
      trustRegion: "Los Altos de Jalisco",
      trustStructure: "Destilería Familiar",
      trustRoots: "Agave Propio desde 1992",
      trustControl: "Control por Lotes",
      trustExport: "Exportación Global",

      whyTitle: "Una destilería familiar y productora en Los Altos de Jalisco.",
      whyCards: [
        { wk: "Origen", title: "NOM 1633, Ayotlán, Jalisco", highlight: true, metric: "1633" },
        { wk: "Estructura", title: "Empresa familiar, tres generaciones agaveras", dark: true },
        { wk: "Agave", title: "Cultivo propio certificado desde 1992", metric: "Desde 1992" },
        { wk: "Equipo", title: "Atención directa de los tomadores de decisiones" },
        { wk: "Infraestructura", title: "Diseñada para escalar proyectos de volumen serio", highlight: true, span2: true },
        { wk: "Calidad", title: "Análisis químicos y control lote a lote en laboratorio" }
      ],

      insideTitle: "De la tierra a la botella: Nuestro Proceso.",
      insideSteps: [
        { num: "01", name: "Agave", desc: "Agaves tequilana Weber variedad azul rigurosamente seleccionados en Los Altos de Jalisco, con alta concentración de azúcares reductores totales (ART).", img: "/Piñas de Agave Tequilana Weber.webp" },
        { num: "02", name: "Cocción", desc: "Cocción lenta y uniforme en hornos de mampostería tradicionales para hidrolizar suavemente los almidones del agave en azúcares fermentables.", img: "/Agave cocido.webp" },
        { num: "03", name: "Molienda", desc: "Extracción suave de los jugos del agave utilizando molino de rodillos o tahona de piedra tradicional para conservar las fibras aromáticas.", img: "/Tahona Agave Molienda.webp" },
        { num: "04", name: "Fermentación", desc: "Fermentación natural y libre en tinas de acero inoxidable con levaduras propias de la casa para definir los aromas primarios del destilado.", img: "/Fermentación.webp" },
        { num: "05", name: "Destilación", desc: "Doble destilación lenta en alambiques de cobre tradicionales para refinar y purificar el espirituoso manteniendo el carácter del terruño.", img: "/Destilación.webp" },
        { num: "06", name: "Barricas", desc: "Maduración y reposo en cavas subterráneas climatizadas utilizando barricas de roble americano, francés o barricas seleccionadas de vino y whiskey.", img: "/Cava de Añejamiento.webp" },
        { num: "07", name: "Laboratorio", desc: "Control analítico cromatográfico estricto in-house en cada lote para garantizar consistencia química y organoléptica certificada.", img: "/Laboratorio.webp" },
        { num: "08", name: "Envasado", desc: "Línea de envasado semiautomática adaptada para botellas personalizadas, con control de filtración fina y etiquetado manual ultra-premium.", img: "/Embotellado 2.webp" }
      ],

      solutionsTitle: "Elige la ruta de producción adecuada.",
      solutions: [
        { num: "01", title: "Tequila de Marca Propia", desc: "Crea, envasa y comercializa tequila bajo tu propia marca desde cero.", tag: "private_label" },
        { num: "02", title: "Maquila / Producción por Contrato", desc: "Producción a la medida bajo tus especificaciones y fórmulas requeridas.", tag: "contract_manufacturing" },
        { num: "03", title: "Tequila a Granel", desc: "Suministro de volumen constante para embotelladoras, importadores o distribuidores.", tag: "bulk_tequila" },
        { num: "04", title: "Servicio de Envasado y Co-packing", desc: "Embotellado, etiquetado y embalaje para proyectos que ya tienen líquido o botellas.", tag: "copacking_bottling" },
        { num: "05", title: "Desarrollo de Perfil de Autor", desc: "Ajuste de perfiles organolépticos exclusivos guiado por nuestros maestros tequileros.", tag: "custom_profile" }
      ],

      whoTitle: "Soluciones diseñadas a la medida de tu rol.",
      whoSubtitle: "Selecciona tu perfil de negocio para conocer los beneficios y la ruta sugerida:",
      whoAudiences: [
        {
          tag: "Fundadores",
          title: "Creando una marca de tequila desde cero",
          desc: "Guiamos tu entrada a una categoría altamente regulada. Te ayudamos con el registro ante el CRT, desarrollo del líquido, diseño de envase y conexión con proveedores autorizados de botellas.",
          benefits: ["Acompañamiento CRT paso a paso", "Lotes mínimos viables optimizados", "Propiedad garantizada de tu fórmula"]
        },
        {
          tag: "Marcas Existentes",
          title: "Buscando un socio de maquila más consistente",
          desc: "Evita quiebres de stock y variaciones en el sabor. Analizamos químicamente tu líquido actual para replicar su perfil sensorial con total precisión en nuestra destilería.",
          benefits: ["Transición sin variaciones de sabor", "Reserva de agave para contratos anuales", "Logística y cesión ante el CRT en tiempo récord"]
        },
        {
          tag: "Distribuidores",
          title: "Introduciendo el tequila a tu portafolio global",
          desc: "Añade una categoría de alto valor comercial. Proveemos marcas blancas listas para exportar o líquidos a la medida con soporte completo en regulaciones internacionales.",
          benefits: ["Cumplimiento TTB y aduanas internacionales", "Fórmulas adaptadas al gusto de tu mercado", "Certificados de exportación oficiales"]
        },
        {
          tag: "Compradores a Granel",
          title: "Asegurando volumen constante y perfiles estables",
          desc: "Suministro continuo de tequila 100% de agave o mixto. Ideal para embotelladoras y distribuidores que buscan estabilidad de precio y consistencia química.",
          benefits: ["Cromatografía y reporte de laboratorio por lote", "Logística de cisternas y contenedores IBC", "Contratos de suministro a largo plazo"]
        }
      ],

      problemsTitle: "Tu proyecto de tequila conlleva riesgos comerciales reales. Te ayudamos a mitigarlos.",
      problems: [
        { num: "01", title: "Empezar desde cero", desc: "Guiamos tu entrada a una categoría compleja con normativas estrictas de denominación de origen.", fullDesc: "Desarrollar una marca desde el concepto inicial requiere estructuración ante el IMPI, trámites ante el CRT, registro de marca y diseño técnico de envases. Te damos acompañamiento en toda la ruta crítica regulatoria para evitar retrasos costosos." },
        { num: "02", title: "Cambiar de productor", desc: "Garantizamos una transición suave sin quiebres de inventario o variaciones en el sabor.", fullDesc: "Mapeamos tu perfil organoléptico mediante cromatografía de gases para replicar el sabor de tu tequila actual en nuestra destilería. Además, gestionamos la cesión de marca o alta de co-producción en el CRT de forma ágil para proteger tu cadena de suministro." },
        { num: "03", title: "Escalamiento y distribución", desc: "Aumentamos el volumen conforme tu marca crece, manteniendo la calidad en cada lote.", fullDesc: "Nuestra capacidad instalada y reservas de agave propio nos permiten garantizar un suministro continuo y escalable. Crecemos con tu marca, ofreciendo el mismo estándar premium en lotes iniciales pequeños y en pedidos comerciales masivos." },
        { num: "04", title: "Exportación internacional", desc: "Simplificamos la burocracia, logística y aduanas con soporte especializado.", fullDesc: "Conectamos tu marca con agentes aduanales y distribuidores con experiencia. Preparamos certificados de exportación oficiales del CRT, hojas analíticas de laboratorio, y cumplimos con los estándares TTB (EE.UU.), aduanas de la UE y de Asia." }
      ],

      quizTitle: "¿En qué etapa se encuentra tu proyecto de tequila?",
      quizIntro: "Diagnóstico estratégico de 8 pasos para calificar tu ruta de producción, volumen y viabilidad operativa.",
      quizStartBtn: "Iniciar Diagnóstico →",
      quizNextBtn: "Siguiente Paso →",
      quizSubmitBtn: "Enviar y Recibir Diagnóstico",
      quizSubmitting: "Procesando...",
      quizResetBtn: "Realizar otro diagnóstico",
      quizSuccessTitle: "¡Diagnóstico Recibido!",
      quizSuccessDesc: "Gracias por completar tu diagnóstico. Un especialista técnico revisará tu proyecto y se comunicará en un lapso menor a 24 horas.",

      processTitle: "De la idea a la producción: Un camino claro antes de comprometerte.",
      processSteps: [
        { num: "01", title: "Diagnóstico Inicial" },
        { num: "02", title: "Llamada Técnica Directa" },
        { num: "03", title: "Definición de Producto" },
        { num: "04", title: "Cumplimiento Legal" },
        { num: "05", title: "Producción & Control" },
        { num: "06", title: "Envío & Exportación" }
      ],

      methodsTitle: "El perfil de tequila que tu marca requiere, y cómo lo construimos.",
      methods: [
        { idx: "01", name: "Tradicional / Ultra-Premium", desc: "Molienda con tahona de piedra, cocción en hornos de mampostería y alambiques de cobre." },
        { idx: "02", name: "Premium Consistente", desc: "Cocción en autoclaves de acero inoxidable y fermentación con control de temperatura." },
        { idx: "03", name: "Comercial Escalable", desc: "Destilación eficiente en columnas para marcas de alto volumen y rotación rápida." },
        { idx: "04", name: "Firma del Autor", desc: "Levaduras exclusivas de la casa y maduración en barricas seleccionadas de vino o whisky." }
      ],

      agaveTitle: "Tu marca de tequila comienza en el campo, no en la destilería.",
      agaveOriginKey: "Origen",
      agaveOriginVal: "Ayotlán, Los Altos de Jalisco",
      agaveSinceKey: "Desde",
      agaveSinceVal: "Raíces agaveras cultivando la tierra desde 1992",
      agaveTraceKey: "Trazabilidad",
      agaveTraceVal: "Planeación de suministro a nivel de parcela y jima controlada",

      qualityTitle: "Consistencia Lote a Lote",
      qualityDesc: "Validación en laboratorio interno, perfiles físico-químicos definidos, revisión sensorial y aprobación final del cliente antes de envasar.",
      qualityBullets: ["Laboratorio in-house en cada lote", "Firma y aprobación del cliente previa", "Trazabilidad completa de principio a fin"],
      
      complianceTitle: "Coordinamos el Cumplimiento Legal",
      complianceDesc: "Te ayudamos a navegar la compleja estructura aduanal, registro ante el CRT y certificaciones internacionales para la exportación regular.",
      complianceBullets: ["NOM 1633 autorizada por el CRT", "Documentación de exportación completa", "Soporte legal con agentes aduanales y distribuidores"],

      ndaTitle: "Tu Marca. Tu Proyecto. Protegido bajo Contrato.",
      ndaDesc: "Tu fórmula es tuya. Cada proyecto inicia bajo un Acuerdo de Confidencialidad (NDA) firmado, con propiedad intelectual clara y documentación resguardada contra fugas de información.",
      ndaBadge: "NDA Disponible Inmediatamente",

      proofTitle: "Pruebas, no promesas.",
      proofSubtitle: "La confianza se construye lote a lote. Diseñamos procesos comerciales transparentes y trazables.",
      proofItems: [
        { label: "Atención", val: "Contacto directo con los ingenieros y productores a cargo" },
        { label: "Proceso", val: "Trazabilidad química y documental verificable por el CRT" },
        { label: "Casos de éxito", val: "Casos de éxito autorizados — Próximamente" },
        { label: "Privacidad", val: "Testimonios publicados estrictamente con autorización escrita" }
      ],

      faqTitle: "Respuestas directas para decisiones informadas.",
      faqGroups: {
        founders: "Fundadores e Inversionistas",
        brands: "Marcas Existentes",
        bulk: "Compradores a Granel",
        distributors: "Distribuidores e Importadores",
        compliance: "Regulación y Cumplimiento"
      },
      faqs: [
        { group: "founders", q: "¿Cómo empiezo mi propia marca de tequila?", a: "Comienza definiendo el perfil organoléptico (sabor), mercado destino y presupuesto inicial. Nosotros te guiamos en la ruta de certificación oficial ante el CRT." },
        { group: "founders", q: "¿Quién es el dueño de la fórmula de mi tequila?", a: "Tú. Tu marca es dueña de su perfil y receta. Firmamos contratos de propiedad intelectual que te blindan legalmente." },
        { group: "founders", q: "¿Puedo visitar las instalaciones de la destilería?", a: "Sí. Damos la bienvenida a visitas técnicas de proyectos calificados. Ver la destilería en persona es la mejor forma de iniciar un lazo de confianza." },
        { group: "brands", q: "¿Puedo cambiar de productor sin que se detenga mi cadena de suministro?", a: "Sí. Trazamos un plan de transición coordinado, produciendo lotes de seguridad antes del cambio legal de marca ante el CRT." },
        { group: "brands", q: "¿Pueden fabricar perfiles de forma exclusiva para mí?", a: "Sí. Desarrollamos recetas y perfiles organolépticos exclusivos protegidos bajo contrato de exclusividad." },
        { group: "bulk", q: "¿Ofrecen tequila a granel certificado?", a: "Sí. Suministramos tequila 100% agave y mixto a granel con perfiles consistentes listos para ser envasados en destino." },
        { group: "bulk", q: "¿Puedo proveer mis propias botellas y etiquetas?", a: "Sí. Recibimos insumos proporcionados por tu marca o coordinamos el desarrollo y compra de vidrio local con nuestros proveedores autorizados." },
        { group: "distributors", q: "¿Qué permisos y aduanas se requieren para exportar desde México?", a: "Se requiere padrón de exportadores, certificado de exportación del CRT, factura comercial y cumplir con las regulaciones del país destino (como TTB/COLA en EE.UU.)." },
        { group: "compliance", q: "¿Qué significa que Casa Loy sea NOM 1633?", a: "La NOM (Norma Oficial Mexicana) 1633 es nuestro registro único autorizado ante el CRT, certificando que destilamos bajo las normas oficiales en la región geográfica protegida por la denominación de origen." }
      ],

      ctaFinalTitle: "Agenda una videollamada técnica de 20 minutos.",
      ctaFinalDesc: "Sin compromisos ni discursos comerciales agresivos. Evaluaremos la viabilidad operativa de tu proyecto con un especialista de producción.",
      ctaFinalBtn1: "Agendar Llamada →",
      ctaFinalBtn2: "Enviar Detalles de Proyecto"
    },
    en: {
      heroTitle: "PRIVATE LABEL TEQUILA MANUFACTURING IN MEXICO",
      heroSubtitle: "Your tequila starts with a real origin in Los Altos de Jalisco.",
      heroSecondary: "Your vision. Our expertise and legacy.",
      heroSub: "A family-owned distillery with NOM 1633 built for founders, existing brands, and distributors ready to build a project with real roots and total traceability.",
      heroBtnStart: "Start B2B Diagnosis",
      heroBtnCall: "Book Technical Call",

      trustNom: "NOM 1633",
      trustRegion: "Los Altos de Jalisco",
      trustStructure: "Family-Owned",
      trustRoots: "Agave roots since 1992",
      trustControl: "Batch Control",
      trustExport: "Export Coordination",

      whyTitle: "A family-owned tequila producer in Los Altos de Jalisco.",
      whyCards: [
        { wk: "Origin", title: "NOM 1633, Ayotlán, Jalisco", highlight: true, metric: "1633" },
        { wk: "Structure", title: "Family-owned, three generations", dark: true },
        { wk: "Agave", title: "Own cultivation since 1992", metric: "Since 1992" },
        { wk: "Team", title: "Real people behind every project" },
        { wk: "Infrastructure", title: "Built for serious, growing projects", highlight: true, span2: true },
        { wk: "Quality", title: "Batch control on every production" }
      ],

      insideTitle: "From agave to bottle.",
      insideSteps: [
        { num: "01", name: "Agave", desc: "Rigourously hand-selected blue Weber agave from the Jalisco Highlands, featuring maximum sugar concentration (total reducing sugars).", img: "/Piñas de Agave Tequilana Weber.webp" },
        { num: "02", name: "Cooking", desc: "Slow and uniform cooking in traditional masonry brick ovens to smoothly hydrolyze agave starches into fermentable sugars.", img: "/Agave cocido.webp" },
        { num: "03", name: "Milling", desc: "Gentle extraction of agave juices using a roller mill or traditional volcanic stone tahona to preserve primary aroma-bearing fibers.", img: "/Tahona Agave Molienda.webp" },
        { num: "04", name: "Fermentation", desc: "Natural and open fermentation in stainless steel vats using our own proprietary yeast strains to define primary organoleptic profiles.", img: "/Fermentación.webp" },
        { num: "05", name: "Distillation", desc: "Slow double distillation in traditional copper pot stills to refine and purify the spirit while retaining the authentic terroir character.", img: "/Destilación.webp" },
        { num: "06", name: "Aging", desc: "Maturation and rest in temperature-controlled underground cellars using American or French oak casks, or selected wine/whiskey barrels.", img: "/Cava de Añejamiento.webp" },
        { num: "07", name: "Lab Testing", desc: "Strict chromatography and chemical quality control in our in-house laboratory to certify batch-to-batch consistency.", img: "/Laboratorio.webp" },
        { num: "08", name: "Bottling", desc: "Semi-automated bottling line for custom bottles, featuring fine filtration control and manual labelling for ultra-premium brands.", img: "/Embotellado 2.webp" }
      ],

      solutionsTitle: "Choose the right production path.",
      solutions: [
        { num: "01", title: "Private Label Tequila", desc: "Create or sell tequila under your own brand from scratch.", tag: "private_label" },
        { num: "02", title: "Contract Manufacturing / Maquila", desc: "Production for third parties under specifications and custom formulas.", tag: "contract_manufacturing" },
        { num: "03", title: "Bulk Tequila Supply", desc: "Bulk tequila for bottlers, importers, or distributors.", tag: "bulk_tequila" },
        { num: "04", title: "Co-packing / Bottling Services", desc: "Bottling, labeling, or packaging for a third-party project.", tag: "copacking_bottling" },
        { num: "05", title: "Custom Profile Development", desc: "Development or adjustment of custom liquid profile guided by master distillers.", tag: "custom_profile" }
      ],

      whoTitle: "Solutions tailored to your business role.",
      whoSubtitle: "Select your project type to check core benefits and suggested paths:",
      whoAudiences: [
        {
          tag: "Founders",
          title: "Starting a tequila brand from scratch",
          desc: "We guide your entry into a highly regulated industry. We support you with CRT brand registration, liquid development, packaging layout, and connections with authorized bottle suppliers.",
          benefits: ["Step-by-step CRT compliance guide", "Optimized Minimum Viable Batches", "100% guaranteed formula ownership"]
        },
        {
          tag: "Existing Brands",
          title: "Looking for a more consistent contract distiller",
          desc: "Avoid inventory shortages and flavor variations. We chemically profile your current liquid to replicate its sensory traits with precision in our distillery.",
          benefits: ["Seamless transition with zero flavor shift", "Dedicated agave reserves in annual contracts", "Swift CRT co-production registration"]
        },
        {
          tag: "Distributors",
          title: "Adding tequila to your international portfolio",
          desc: "Add a high-margin commercial category. We supply export-ready private label products or custom liquids with complete support on global compliance.",
          benefits: ["TTB and international import compliance", "Liquids adapted to local market preferences", "Official export certificates preparation"]
        },
        {
          tag: "Bulk Buyers",
          title: "Securing steady volume and stable profiles",
          desc: "Constant supply of 100% agave or mixed bulk tequila. Ideal for independent bottlers and large distributors looking for price stability and chemical consistency.",
          benefits: ["Gas chromatography reports for every batch", "Flexitank and IBC container coordination", "Long-term supply contracts"]
        }
      ],

      problemsTitle: "Your tequila project carries real business risk. We help you reduce it.",
      problems: [
        { num: "01", title: "Starting from zero", desc: "We guide you through entering a highly regulated and complex spirits category.", fullDesc: "Developing a brand from the ground up requires coordination with IMPI, CRT registration, and bottle sourcing. We provide complete advisory throughout this roadmap to avoid costly operational delays." },
        { num: "02", title: "Switching producer", desc: "Making sure the transition does not interrupt your inventory or change your flavor profile.", fullDesc: "We map your current chemical profile using gas chromatography to replicate your flavor profile in our distillery. We also manage all CRT registration transfers swiftly to keep inventory moving." },
        { num: "03", title: "Scaling / distribution", desc: "Growing volume without losing consistency batch after batch.", fullDesc: "Our high production capacity and vast agave fields allow us to secure steady, scalable supply. We grow alongside your brand, providing top consistency from initial small batches to massive commercial shipments." },
        { num: "04", title: "Exporting", desc: "Taking the hassle out of custom clearances, regulations, and international logistics.", fullDesc: "We connect you with experienced custom agents and global distributors. We prepare official CRT export certificates, analytical sheets, and fully comply with TTB (US) and EU import rules." }
      ],

      quizTitle: "Where does your tequila project stand today?",
      quizIntro: "8-step diagnosis to analyze your production route, volume needs, and operational feasibility.",
      quizStartBtn: "Start Diagnosis →",
      quizNextBtn: "Next Step →",
      quizSubmitBtn: "Submit & Receive Diagnosis",
      quizSubmitting: "Processing...",
      quizResetBtn: "Take quiz again",
      quizSuccessTitle: "Diagnosis Submitted!",
      quizSuccessDesc: "Thank you for completing the diagnosis. A technical specialist will review your details and contact you within 24 hours.",

      processTitle: "From idea to production: A clear path before you commit.",
      processSteps: [
        { num: "01", title: "Project Diagnosis" },
        { num: "02", title: "Technical Call" },
        { num: "03", title: "Product Definition" },
        { num: "04", title: "Compliance Path" },
        { num: "05", title: "Production & Control" },
        { num: "06", title: "Shipment Coordination" }
      ],

      methodsTitle: "The tequila profile your brand needs, and how we build it.",
      methods: [
        { idx: "01", name: "Heritage / Ultra-Premium", desc: "Stone mill (tahona), traditional brick ovens, and copper pot stills." },
        { idx: "02", name: "Premium Consistent", desc: "Autoclave cooking and precise fermentation temperature controls." },
        { idx: "03", name: "Scalable Commercial", desc: "High-efficiency column stills for cost-effective high-volume brands." },
        { idx: "04", name: "Custom Signature", desc: "Proprietary yeast strains and aging in selected wine or whiskey barrels." }
      ],

      agaveTitle: "Your tequila brand starts before production — it starts with supply.",
      agaveOriginKey: "Origin",
      agaveOriginVal: "Ayotlán, Los Altos de Jalisco",
      agaveSinceKey: "Since",
      agaveSinceVal: "Agave roots cultivating the soil since 1992",
      agaveTraceKey: "Traceability",
      agaveTraceVal: "Parcel-level supply planning and controlled harvesting",

      qualityTitle: "Batch-to-Batch Quality",
      qualityDesc: "In-house lab validation, defined chemical parameters, sensory review, and final client approval before shipping.",
      qualityBullets: ["In-house laboratory analysis for every single batch", "Client approval signature before bottling", "Full batch-to-batch traceability"],
      
      complianceTitle: "Legal & Regulatory Compliance",
      complianceDesc: "We assist you in navigating complex customs structures, CRT brand registrations, and international import compliance.",
      complianceBullets: ["NOM 1633 fully authorized by the CRT", "Export documentation preparation support", "Coordination with customs agents and distributors"],

      ndaTitle: "Your Brand. Your Project. Protected.",
      ndaDesc: "Your formula stays yours. Every project includes a signed confidentiality agreement (NDA), clear IP ownership terms, and locked documentation.",
      ndaBadge: "NDA Available Immediately",

      proofTitle: "Proof, not promises.",
      proofSubtitle: "Trust is built batch by batch. We design transparent and fully traceable business workflows.",
      proofItems: [
        { label: "Attention", val: "Direct attention from the engineers and producers in charge" },
        { label: "Process", val: "Chemical and documental traceability verified by CRT" },
        { label: "Case Studies", val: "Authorized case studies — Coming soon" },
        { label: "Privacy", val: "Testimonios published strictly with written authorization only" }
      ],

      faqTitle: "Straight answers, by intention.",
      faqGroups: {
        founders: "Founders & Investors",
        brands: "Existing Brands",
        bulk: "Bulk Buyers",
        distributors: "Distributors & Importers",
        compliance: "Compliance"
      },
      faqs: [
        { group: "founders", q: "How do I start my own tequila brand?", a: "It starts with defining your liquid profile, target market, and initial budget. We guide you through the official certification route with the CRT." },
        { group: "founders", q: "Who owns my custom tequila formula?", a: "You do. Your brand owns its flavor profile and recipe. We sign intellectual property contracts that protect you legally." },
        { group: "founders", q: "Can I visit the distillery?", a: "Yes. We welcome technical visits from qualified projects. Seeing the distillery in person is the best way to start a relationship of trust." },
        { group: "brands", q: "Can I switch producers without interrupting my inventory?", a: "Yes. We map a coordinated transition timeline, producing safety buffer stock before doing the official brand transfer with the CRT." },
        { group: "brands", q: "Can you produce exclusively for my brand?", a: "Yes. We develop exclusive liquid profiles and recipes protected under custom exclusivity contracts." },
        { group: "bulk", q: "Do you offer certified bulk tequila?", a: "Yes. We supply 100% agave and mixed bulk tequila with consistent profiles ready for bottling at your destination." },
        { group: "bulk", q: "Can I use my own bottle?", a: "Yes. We can bottle in containers provided by your brand or coordinate bottle sourcing with our local partner glass makers." },
        { group: "distributors", q: "What documentation is needed to export from Mexico?", a: "You need an exporter registry, CRT export certificate, commercial invoice, and labels compliant with your destination country (like TTB/COLA in the US)." },
        { group: "compliance", q: "What does NOM 1633 mean for a tequila brand?", a: "NOM 1633 is our unique registration with the CRT, certifying that our tequila is distilled under official standards in the protected geographic region of origin." }
      ],

      ctaFinalTitle: "Book a 20-minute technical video call.",
      ctaFinalDesc: "No commitment. No pushy sales pitch. A real conversation about operational feasibility with a production expert.",
      ctaFinalBtn1: "Book Call Now →",
      ctaFinalBtn2: "Send Project Details"
    }
  };

  const t = content[lang] || content.es;

  // Multi-step Quiz Handler
  const handleQuizOption = (field, value, nextStep) => {
    setQuizAnswers((prev) => ({ ...prev, [field]: value }));
    setQuizStep(nextStep);
  };

  const handleCheckboxOption = (value) => {
    setQuizAnswers((prev) => {
      const alreadySelected = prev.assetsReady.includes(value);
      const newAssets = alreadySelected
        ? prev.assetsReady.filter((x) => x !== value)
        : [...prev.assetsReady, value];
      return { ...prev, assetsReady: newAssets };
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const commentsMarkdown = `
**[Diagnóstico B2B Maquilas V2]**
- **Mercado Objetivo:** ${quizAnswers.market}
- **Volumen Estimado:** ${quizAnswers.volume}
- **Tipo de Tequila:** ${quizAnswers.tequilaType}
- **Activos Listos:** ${quizAnswers.assetsReady.join(", ") || "Ninguno"}
- **Lanzamiento Estimado:** ${quizAnswers.timeline}
- **Notas del Proyecto:** ${quizAnswers.notes || "Sin comentarios adicionales"}
- **Modo:** Cuestionario de 8 pasos B2B
    `.trim();

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
          objective: quizAnswers.market,
          stage: quizAnswers.stage,
          comments: commentsMarkdown,
          origin: "quiz_v2"
        }),
      });

      if (response.ok) {
        setQuizStep(9); // Success step
      } else {
        const errorData = await response.json();
        alert(
          lang === "es"
            ? `Error al enviar el diagnóstico: ${errorData.error || "Error del servidor"}`
            : `Error submitting diagnosis: ${errorData.error || "Server error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting B2B quiz:", error);
      alert(
        lang === "es"
          ? "Hubo un problema de conexión al enviar tus datos. Por favor, intenta de nuevo."
          : "There was a connection issue sending your data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({
      solution: "",
      stage: "",
      market: "",
      volume: "",
      tequilaType: "",
      assetsReady: [],
      timeline: "",
      notes: ""
    });
    setContactForm({
      name: "",
      company: "",
      lada: "",
      phone: "",
      email: ""
    });
    setQuizStep(1);
  };

  // Motion animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.08
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18] font-body-md select-none overflow-x-hidden">
      <SEO page="maquilas-v2" lang={lang} />

      {/* 5.1 HERO PARALLAX BANNER WITH Slow Zoom Background */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
        >
          <img
            alt="Maquila Tequila Production"
            className="w-full h-full object-cover brightness-[0.72]"
            src="/Naves Industriales Casa Loy Tequilera.webp"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28">
          <motion.span 
            className="font-label-caps text-[#FDA377] font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase mb-6 block"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {lang === "es" ? "Destilería & Maquila Tequila B2B" : "Distillery & Tequila Private Label"}
          </motion.span>

          <motion.h1 
            className="font-serif text-[clamp(28px,4.5vw,56px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p 
            className="font-serif text-white/90 italic text-lg md:text-xl font-normal max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          >
            "{t.heroSecondary}"
          </motion.p>

          <motion.p 
            className="font-sans text-white/80 font-light text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.heroSub}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-md sm:max-w-none pt-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all duration-300 min-w-[200px] text-center shadow-lg"
              href="#quiz-v2"
            >
              {t.heroBtnStart}
            </a>
            <a
              className="border border-white/35 hover:border-white hover:bg-white/5 text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all duration-300 min-w-[200px] text-center"
              href="#contact-scheduler"
            >
              {t.heroBtnCall}
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-70">
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

      {/* TRUST BAR */}
      <div className="bg-[#EDE7DE]/40 border-y border-outline-variant/30 py-5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-y-3 gap-x-5 text-center">
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#8C4723]">{t.trustNom}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustRegion}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustStructure}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustRoots}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustControl}</span>
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-[#1C1C1C]">{t.trustExport}</span>
          </div>
        </div>
      </div>

      {/* 5.2 WHY CASA LOY (Bento Grid Redesign: Breaks repetition of text cards) */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Por qué Casa Loy" : "Why Casa Loy"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.whyTitle}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* 1. NOM 1633 Card (Cream Highlight - col-span-2) */}
            <motion.div 
              className="border border-outline-variant bg-[#EDE7DE]/40 p-8 flex flex-col justify-between min-h-[220px] md:col-span-2 relative group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, borderColor: "#8C4723" }}
            >
              <div>
                <span className="font-label-caps text-[#8C4723] text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[0].wk}
                </span>
                <h3 className="font-headline-md text-2xl text-[#1c1c18] font-bold leading-tight max-w-xl">
                  {t.whyCards[0].title}
                </h3>
              </div>
              <div className="absolute right-8 bottom-4 font-serif text-6xl text-primary/10 select-none font-bold">
                {t.whyCards[0].metric}
              </div>
            </motion.div>

            {/* 2. Family Structure Card (Dark Accent) */}
            <motion.div 
              className="bg-zinc-950 text-white p-8 flex flex-col justify-between min-h-[220px] relative group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4 }}
            >
              <div>
                <span className="font-label-caps text-[#FDA377] text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[1].wk}
                </span>
                <h3 className="font-headline-md text-xl text-white font-semibold leading-snug">
                  {t.whyCards[1].title}
                </h3>
              </div>
              <span className="material-symbols-outlined text-[#FDA377] text-3xl opacity-20 self-end">
                diversity_3
              </span>
            </motion.div>

            {/* 3. Own Agave Card (Standard Metric) */}
            <motion.div 
              className="border border-outline-variant bg-white p-8 flex flex-col justify-between min-h-[220px] relative group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, borderColor: "#8C4723" }}
            >
              <div>
                <span className="font-label-caps text-[#8C4723] text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[2].wk}
                </span>
                <h3 className="font-headline-md text-xl text-[#1c1c18] font-semibold leading-snug">
                  {t.whyCards[2].title}
                </h3>
              </div>
              <div className="font-mono text-xs text-primary font-semibold tracking-wider">
                {t.whyCards[2].metric}
              </div>
            </motion.div>

            {/* 4. Infrastructure Card (Highlighted Span) */}
            <motion.div 
              className="border border-outline-variant bg-white p-8 flex flex-col justify-between min-h-[220px] md:col-span-2 relative group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, borderColor: "#8C4723" }}
            >
              <div>
                <span className="font-label-caps text-primary text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[4].wk}
                </span>
                <h3 className="font-headline-md text-2xl text-[#1c1c18] font-bold leading-tight max-w-xl">
                  {t.whyCards[4].title}
                </h3>
              </div>
              <span className="material-symbols-outlined text-stone-200 text-5xl absolute right-8 bottom-6 select-none">
                precision_manufacturing
              </span>
            </motion.div>

            {/* 5. Team Card */}
            <motion.div 
              className="border border-outline-variant bg-white p-8 flex flex-col justify-between min-h-[220px] group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, borderColor: "#8C4723" }}
            >
              <div>
                <span className="font-label-caps text-primary text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[3].wk}
                </span>
                <h3 className="font-headline-md text-xl text-[#1c1c18] font-semibold leading-snug">
                  {t.whyCards[3].title}
                </h3>
              </div>
              <div className="w-8 h-[1px] bg-primary/20 group-hover:w-16 transition-all duration-300"></div>
            </motion.div>

            {/* 6. Lab Quality Card */}
            <motion.div 
              className="border border-outline-variant bg-[#EDE7DE]/20 p-8 flex flex-col justify-between min-h-[220px] md:col-span-2 group"
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, borderColor: "#8C4723" }}
            >
              <div>
                <span className="font-label-caps text-primary text-[10px] font-bold tracking-widest block mb-4 uppercase">
                  {t.whyCards[5].wk}
                </span>
                <h3 className="font-headline-md text-2xl text-[#1c1c18] font-bold leading-tight max-w-xl">
                  {t.whyCards[5].title}
                </h3>
              </div>
              <span className="material-symbols-outlined text-[#8C4723] text-4xl opacity-35 self-end">
                biotech
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5.3 INTERACTIVE PROCESS EXPLORER */}
      <section className="bg-[#1C1A19] text-white py-section-gap relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left relative z-10">
          <motion.div {...fadeInUp} className="mb-12">
            <span className="font-label-caps text-[#FDA377] font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Dentro de la Destilería" : "Inside the Distillery"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-white">
              {t.insideTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
            {/* Steps Tab List */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {t.insideSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 flex items-center gap-5 border transition-all duration-350 ${
                    activeStep === idx 
                      ? "bg-[#8C4723] border-[#8C4723] text-white pl-6" 
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-[#FDA377]">{step.num}</span>
                  <span className="font-navigation text-sm font-semibold tracking-wider uppercase">{step.name}</span>
                </button>
              ))}
            </div>

            {/* Step Detail Display Card */}
            <div className="lg:col-span-8 bg-zinc-950 border border-white/10 grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="w-full h-full min-h-[300px] overflow-hidden order-1 md:order-2"
                >
                  <img 
                    src={t.insideSteps[activeStep].img} 
                    alt={t.insideSteps[activeStep].name} 
                    className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="p-8 md:p-10 flex flex-col justify-center text-left order-2 md:order-1 border-t md:border-t-0 md:border-r border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    <span className="font-mono text-xs font-bold text-[#FDA377]">
                      {lang === "es" ? "ETAPA" : "STAGE"} {t.insideSteps[activeStep].num}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-semibold">
                      {t.insideSteps[activeStep].name}
                    </h3>
                    <p className="font-body-md text-sm text-[#B7C4BA] leading-relaxed font-light">
                      {t.insideSteps[activeStep].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 RUTAS DE SOLUCIÓN */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Soluciones de Producción" : "Production Solutions"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.solutionsTitle}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {t.solutions.map((sol, idx) => (
              <motion.div 
                key={idx} 
                className="border border-outline-variant bg-white p-8 flex flex-col justify-between min-h-[250px] cursor-pointer group"
                variants={{
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                whileHover={{ 
                  y: -8, 
                  borderColor: "#8C4723",
                  boxShadow: "0 12px 30px rgba(140, 71, 35, 0.09)"
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  setQuizAnswers((prev) => ({ ...prev, solution: sol.title }));
                  setQuizStep(2);
                  const el = document.getElementById("quiz-v2");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="space-y-4">
                  <div className="font-label-caps text-xs text-primary font-bold">{sol.num}</div>
                  <h3 className="font-headline-md text-lg font-semibold text-[#1c1c18] group-hover:text-primary transition-colors duration-300">
                    {sol.title}
                  </h3>
                  <p className="font-body-md text-xs text-[#53443a] leading-relaxed font-light">
                    {sol.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="font-mono text-[9px] text-stone-500 uppercase tracking-widest bg-stone-100 py-1 px-2.5 rounded group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors duration-300">
                    {sol.tag}
                  </span>
                  <span className="material-symbols-outlined text-sm text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                    arrow_forward
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.p {...fadeInUp} className="mt-12 font-serif italic text-base text-[#8C4723] max-w-2xl leading-relaxed">
            * {lang === "es" ? "Todas las rutas están certificadas bajo la" : "All paths are certified under"} <strong>NOM 1633</strong> {lang === "es" ? "garantizando el estricto cumplimiento ante el Consejo Regulador del Tequila." : "ensuring strict compliance with the Tequila Regulatory Council."}
          </motion.p>
        </div>
      </section>

      {/* 5.5 TARGET AUDIENCE INTERACTIVE TABS (Redesigned to replace repetitive text card grids) */}
      <section className="bg-[#EDE7DE]/20 py-section-gap border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-2 block text-xs">
              {lang === "es" ? "Rutas por Negocio" : "Routes by Business"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18]">
              {t.whoTitle}
            </h2>
            <p className="text-sm text-[#53443a] font-light mt-3 mb-10 max-w-xl leading-relaxed">
              {t.whoSubtitle}
            </p>
          </motion.div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-px mb-8">
            {t.whoAudiences.map((aud, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAudience(idx)}
                className={`py-3.5 px-6 font-navigation text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                  activeAudience === idx
                    ? "border-primary text-primary bg-white/40"
                    : "border-transparent text-stone-500 hover:text-[#1c1c18]"
                }`}
              >
                {aud.tag}
              </button>
            ))}
          </div>

          {/* Selected Audience Details Card */}
          <div className="bg-white border border-outline-variant/40 p-8 md:p-12 shadow-sm min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAudience}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-7 space-y-4">
                  <span className="font-label-caps text-xs text-primary font-bold">{t.whoAudiences[activeAudience].tag}</span>
                  <h3 className="font-headline-md text-2xl md:text-3xl text-[#1c1c18] font-bold">
                    {t.whoAudiences[activeAudience].title}
                  </h3>
                  <p className="font-sans text-sm text-[#53443a] leading-relaxed font-light">
                    {t.whoAudiences[activeAudience].desc}
                  </p>
                </div>

                <div className="lg:col-span-5 bg-[#EDE7DE]/15 p-6 border-l-2 border-primary space-y-4">
                  <div className="font-label-caps text-[10px] text-[#8C4723] font-bold tracking-widest uppercase">
                    {lang === "es" ? "Beneficios Clave" : "Core Benefits"}
                  </div>
                  <ul className="space-y-3">
                    {t.whoAudiences[activeAudience].benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-[#1c1c18] font-light">
                        <span className="material-symbols-outlined text-sm text-primary">check</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="font-serif italic text-xs text-stone-500">
                {lang === "es" 
                  ? "* Evaluaremos tu factibilidad técnica en base a este perfil."
                  : "* We will evaluate your technical feasibility based on this profile."}
              </span>
              <a 
                href="#quiz-v2"
                className="bg-[#8C4723] text-white hover:bg-[#a6562b] py-3 px-8 font-navigation text-[10px] uppercase tracking-widest font-semibold text-center transition-all min-w-[200px]"
              >
                {lang === "es" ? "Comenzar Proyecto" : "Start Project"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5.6 PROBLEMAS QUE RESOLVEMOS */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Mitigación de Riesgo" : "Risk Mitigation"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.problemsTitle}
            </h2>
          </motion.div>

          <div className="max-w-4xl space-y-2 border-t border-outline-variant/40 pt-4 mt-6">
            {t.problems.map((prob, idx) => {
              const isSelected = activeProblem === idx;
              return (
                <div 
                  key={idx} 
                  className={`py-4 border-b border-outline-variant/30 transition-all duration-350 cursor-pointer ${
                    isSelected ? "px-6 bg-[#EDE7DE]/20" : ""
                  }`}
                  onClick={() => setActiveProblem(idx)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <span className={`font-serif text-3xl font-semibold md:col-span-1 transition-colors ${
                      isSelected ? "text-primary scale-105" : "text-primary/30"
                    }`}>{prob.num}</span>
                    
                    <h3 className="font-headline-md text-lg font-bold text-[#1c1c18] md:col-span-4 flex items-center justify-between">
                      <span>{prob.title}</span>
                      <span className="material-symbols-outlined md:hidden text-primary">
                        {isSelected ? "remove" : "add"}
                      </span>
                    </h3>
                    
                    <p className="font-body-md text-sm text-[#53443a] leading-relaxed md:col-span-7 font-light">
                      {prob.desc}
                    </p>
                  </div>

                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 14 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-xs text-[#53443a]/90 bg-white p-4 border border-outline-variant/40 leading-relaxed font-light pl-6">
                          {prob.fullDesc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.7 QUIZ INTERACTIVO */}
      <section id="quiz-v2" className="relative py-section-gap bg-[#1C1A19] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Agave Hearts Background"
            className="w-full h-full object-cover brightness-[0.45] opacity-45"
            src="/Piñas de Agave Tequilana Weber.webp"
          />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="font-label-caps text-[#FDA377] font-semibold tracking-widest uppercase block text-xs">
                {lang === "es" ? "Diagnóstico Operativo" : "Operational Diagnosis"}
              </span>
              <h2 className="font-headline-lg text-4xl md:text-5xl text-white leading-tight">
                {t.quizTitle}
              </h2>
              <p className="font-body-lg text-white/80 font-light leading-relaxed">
                {t.quizIntro}
              </p>
              
              {quizStep < 9 && (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-xs text-white/40 font-mono">
                    {lang === "es" ? "Paso" : "Step"} {quizStep} {lang === "es" ? "de" : "of"} 8
                  </div>
                  {quizStep > 1 && (
                    <button 
                      onClick={() => setQuizStep((prev) => prev - 1)}
                      className="text-[#FDA377] text-xs font-navigation uppercase tracking-wider text-left border-b border-[#FDA377] max-w-fit pb-0.5 hover:text-white hover:border-white transition-colors cursor-pointer bg-transparent"
                    >
                      ← {lang === "es" ? "Regresar" : "Back"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Glassmorphic Quiz Container */}
            <div className="lg:col-span-7 p-8 md:p-10 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-none shadow-2xl min-h-[440px] flex flex-col justify-center text-left relative">
              <AnimatePresence mode="wait">
                
                {/* Paso 1: Ruta */}
                {quizStep === 1 && (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">01 / 08 · {lang === "es" ? "SOLUCIÓN" : "SOLUTION"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Qué solución de producción buscas?" : "What production solution do you need?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {t.solutions.map((sol, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizOption("solution", sol.title, 2)}
                          className="w-full text-left p-4 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation"
                        >
                          <span className="text-sm font-light leading-tight">{sol.title}</span>
                          <span className="text-[10px] font-mono border border-white/20 group-hover:border-black/20 px-2 py-0.5 rounded opacity-60">0{i+1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Paso 2: Etapa */}
                {quizStep === 2 && (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">02 / 08 · {lang === "es" ? "ETAPA" : "STAGE"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿En qué etapa se encuentra tu proyecto?" : "What stage is your project in?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { label: lang === "es" ? "Idea Inicial o Conceptualización" : "Initial Idea or Concept", val: "Idea Inicial" },
                        { label: lang === "es" ? "Concepto Definido / Marca Registrada" : "Concept Ready / Registered Brand", val: "Marca Registrada" },
                        { label: lang === "es" ? "Marca Operando / Buscando cambio de proveedor" : "Active Brand / Switching Supplier", val: "Marca Operando" },
                        { label: lang === "es" ? "Compra inmediata o producción de urgencia" : "Immediate Purchase / Urgent Production", val: "Inmediata" }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizOption("stage", item.val, 3)}
                          className="w-full text-left p-4 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation"
                        >
                          <span className="text-sm font-light leading-tight">{item.label}</span>
                          <span className="text-[10px] font-mono border border-white/20 group-hover:border-black/20 px-2 py-0.5 rounded opacity-60">0{i+1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Paso 3: Mercado */}
                {quizStep === 3 && (
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">03 / 08 · {lang === "es" ? "MERCADO" : "MARKET"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Cuál es tu mercado objetivo principal?" : "What is your main target market?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { label: "Estados Unidos (USA)", val: "EE.UU." },
                        { label: "México", val: "México" },
                        { label: "Europa", val: "Europa" },
                        { label: lang === "es" ? "Canadá y Sudamérica" : "Canada & South America", val: "Canadá y LatAm" },
                        { label: lang === "es" ? "Asia y resto del mundo" : "Asia & Rest of World", val: "Asia y otros" }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizOption("market", item.val, 4)}
                          className="w-full text-left p-4 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation"
                        >
                          <span className="text-sm font-light leading-tight">{item.label}</span>
                          <span className="text-[10px] font-mono border border-white/20 group-hover:border-black/20 px-2 py-0.5 rounded opacity-60">0{i+1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Paso 4: Datos de Contacto */}
                {quizStep === 4 && (
                  <motion.div 
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">04 / 08 · {lang === "es" ? "CONTACTO" : "CONTACT"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "Por favor ingresa tus datos de contacto" : "Please enter your contact details"}
                    </h3>
                    <div className="space-y-4">
                      <div className="border-b border-white/30 focus-within:border-primary transition-all duration-300">
                        <input
                          required
                          type="text"
                          placeholder={lang === "es" ? "Nombre Completo *" : "Full Name *"}
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full border-0 focus:ring-0 bg-transparent py-2.5 text-white placeholder:text-white/40 focus:outline-none text-sm font-sans"
                        />
                      </div>
                      <div className="border-b border-white/30 focus-within:border-primary transition-all duration-300">
                        <input
                          required
                          type="text"
                          placeholder={lang === "es" ? "Nombre de la Empresa *" : "Company / Project Name *"}
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          className="w-full border-0 focus:ring-0 bg-transparent py-2.5 text-white placeholder:text-white/40 focus:outline-none text-sm font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-white/30 focus-within:border-primary transition-all duration-300">
                        <input
                          required
                          type="text"
                          placeholder="LADA"
                          maxLength="4"
                          value={contactForm.lada}
                          onChange={(e) => setContactForm({ ...contactForm, lada: e.target.value.replace(/\D/g, "") })}
                          className="border-0 focus:ring-0 bg-transparent py-2.5 text-white placeholder:text-white/40 focus:outline-none text-sm text-center font-sans"
                        />
                        <input
                          required
                          type="tel"
                          placeholder={lang === "es" ? "Teléfono *" : "Phone *"}
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, "") })}
                          className="col-span-2 border-0 focus:ring-0 bg-transparent py-2.5 text-white placeholder:text-white/40 focus:outline-none text-sm font-sans"
                        />
                      </div>
                      <div className="border-b border-white/30 focus-within:border-primary transition-all duration-300">
                        <input
                          required
                          type="email"
                          placeholder={lang === "es" ? "Correo Electrónico *" : "Email Address *"}
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full border-0 focus:ring-0 bg-transparent py-2.5 text-white placeholder:text-white/40 focus:outline-none text-sm font-sans"
                        />
                      </div>
                      
                      <button
                        type="button"
                        disabled={!contactForm.name || !contactForm.company || !contactForm.email || !contactForm.phone}
                        onClick={() => setQuizStep(5)}
                        className="w-full mt-4 py-4 bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {t.quizNextBtn}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 5: Volumen */}
                {quizStep === 5 && (
                  <motion.div 
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">05 / 08 · {lang === "es" ? "VOLUMEN" : "VOLUME"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Cuál es tu volumen anual estimado?" : "What is your estimated annual volume?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { label: lang === "es" ? "Menos de 10,000 litros (Volumen inicial)" : "Less than 10k Liters (Initial)", val: "<10k Litros" },
                        { label: "10,000 a 50,000 litros", val: "10k-50k Litros" },
                        { label: "50,000 a 100,000 litros", val: "50k-100k Litros" },
                        { label: lang === "es" ? "Más de 100,000 litros (Alta escala)" : "More than 100k Liters (Scale)", val: ">10k Litros" }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizOption("volume", item.val, 6)}
                          className="w-full text-left p-4 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation"
                        >
                          <span className="text-sm font-light leading-tight">{item.label}</span>
                          <span className="text-[10px] font-mono border border-white/20 group-hover:border-black/20 px-2 py-0.5 rounded opacity-60">0{i+1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Paso 6: Tipo de Tequila */}
                {quizStep === 6 && (
                  <motion.div 
                    key="step-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">06 / 08 · {lang === "es" ? "DESTILADO" : "SPIRIT TYPE"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Qué tipo de tequila requieres producir?" : "What type of tequila do you need to produce?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { label: lang === "es" ? "Blanco / Plata (Sin paso por barrica)" : "Blanco / Silver (Unaged)", val: "Blanco" },
                        { label: "Reposado", val: "Reposado" },
                        { label: "Añejo", val: "Añejo" },
                        { label: "Extra Añejo", val: "Extra Añejo" },
                        { label: lang === "es" ? "Cristalino o perfil organoléptico especial" : "Cristalino or custom profile", val: "Especial/Cristalino" }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuizOption("tequilaType", item.val, 7)}
                          className="w-full text-left p-4 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex justify-between items-center group font-navigation"
                        >
                          <span className="text-sm font-light leading-tight">{item.label}</span>
                          <span className="text-[10px] font-mono border border-white/20 group-hover:border-black/20 px-2 py-0.5 rounded opacity-60">0{i+1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Paso 7: Activos Listos */}
                {quizStep === 7 && (
                  <motion.div 
                    key="step-7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">07 / 08 · {lang === "es" ? "ACTIVOS" : "ASSETS"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Con qué activos cuenta tu marca actualmente?" : "What assets does your brand currently have?"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { label: lang === "es" ? "Marca registrada legalmente ante el IMPI u organismo equivalente" : "Trademark legally registered", val: "Marca Registrada" },
                        { label: lang === "es" ? "Diseño de botella y etiqueta finalizado" : "Packaging / label design ready", val: "Diseño Listo" },
                        { label: lang === "es" ? "Permiso de importación en mercado destino listo" : "Importer permit ready in target market", val: "Permisos Listos" },
                        { label: lang === "es" ? "Ninguno aún, requiero soporte de consultoría integral" : "None of the above, I need consulting support", val: "Ninguno" }
                      ].map((item, i) => (
                        <label 
                          key={i}
                          className="flex items-center gap-3 p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-xs font-navigation text-white/95"
                        >
                          <input
                            type="checkbox"
                            checked={quizAnswers.assetsReady.includes(item.val)}
                            onChange={() => handleCheckboxOption(item.val)}
                            className="w-4 h-4 text-[#8C4723] rounded focus:ring-0 bg-transparent border-white/30"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => setQuizStep(8)}
                        className="w-full mt-4 py-4 bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-xs uppercase tracking-widest font-semibold transition-all"
                      >
                        {t.quizNextBtn}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 8: Cronograma y Notas */}
                {quizStep === 8 && (
                  <motion.div 
                    key="step-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <span className="font-label-caps text-[#FDA377] font-bold tracking-wider text-[10px] block">08 / 08 · {lang === "es" ? "CRONOGRAMA" : "TIMELINE"}</span>
                    <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">
                      {lang === "es" ? "¿Cuándo tienes planeado lanzar tu tequila?" : "When are you planning to launch your tequila?"}
                    </h3>
                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                      <div className="border-b border-white/35 focus-within:border-primary transition-all duration-300">
                        <select
                          required
                          value={quizAnswers.timeline}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, timeline: e.target.value })}
                          className="w-full border-0 focus:ring-0 bg-transparent py-2.5 text-white/80 placeholder:text-white/40 focus:outline-none text-sm font-sans"
                        >
                          <option value="" className="text-black">{lang === "es" ? "-- Selecciona fecha de lanzamiento -- *" : "-- Select estimated launch timeline -- *"}</option>
                          <option value="Inmediato (<3 meses)" className="text-black">{lang === "es" ? "Urgente / Inmediato (Menos de 3 meses)" : "Immediate (<3 months)"}</option>
                          <option value="Corto Plazo (3-6 meses)" className="text-black">{lang === "es" ? "Corto Plazo (3 a 6 meses)" : "Short-term (3-6 months)"}</option>
                          <option value="Mediano Plazo (6-12 meses)" className="text-black">{lang === "es" ? "Mediano Plazo (6 a 12 meses)" : "Medium-term (6-12 months)"}</option>
                          <option value="Planeación (>12 meses)" className="text-black">{lang === "es" ? "Planeación futura (Más de 12 meses)" : "Future planning (>12 months)"}</option>
                        </select>
                      </div>

                      <div className="border-b border-white/35 focus-within:border-primary transition-all duration-300">
                        <textarea
                          rows="3"
                          placeholder={lang === "es" ? "Notas adicionales, requerimientos o comentarios sobre tu proyecto..." : "Additional specifications, notes, or comments about your project..."}
                          value={quizAnswers.notes}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, notes: e.target.value })}
                          className="w-full border-0 focus:ring-0 bg-transparent py-2 text-white placeholder:text-white/40 focus:outline-none text-sm font-sans resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !quizAnswers.timeline}
                        className="w-full mt-4 py-4 bg-amber-600 hover:bg-amber-700 text-white font-navigation text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                      >
                        {isSubmitting ? t.quizSubmitting : t.quizSubmitBtn}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Paso 9: Éxito */}
                {quizStep === 9 && (
                  <motion.div 
                    key="step-9"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-6 space-y-5"
                  >
                    <span className="material-symbols-outlined text-5xl text-[#FDA377] block mb-2 animate-bounce">
                      check_circle
                    </span>
                    <h3 className="font-headline-md text-2xl text-white">{t.quizSuccessTitle}</h3>
                    <p className="font-body-md text-white/70 max-w-md mx-auto text-sm leading-relaxed font-light">
                      {t.quizSuccessDesc}
                    </p>
                    <button
                      onClick={handleResetQuiz}
                      className="text-[#FDA377] font-label-caps border-b border-[#FDA377] pb-0.5 hover:text-white hover:border-white transition-all mt-6 text-xs cursor-pointer bg-transparent"
                    >
                      {t.quizResetBtn}
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5.8 PROCESO DE TRABAJO */}
      <section className="bg-zinc-950 text-white py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-[#FDA377] font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Ruta de Trabajo" : "Work Roadmap"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-white">
              {t.processTitle}
            </h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {t.processSteps.map((step, idx) => (
              <motion.div 
                key={idx} 
                className="bg-white/5 border border-white/10 p-8 flex flex-col justify-between min-h-[180px] transition-organic hover:bg-white/10 hover:border-primary"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
              >
                <span className="font-label-caps text-xs text-[#FDA377] font-bold block mb-4">{step.num}</span>
                <h3 className="font-headline-md text-base font-semibold text-white leading-tight">
                  {step.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5.9 MÉTODOS POR RESULTADO */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Tipos de Líquido" : "Liquid Styles"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.methodsTitle}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {t.methods.map((method, idx) => (
              <motion.div 
                key={idx} 
                className="border border-outline-variant bg-white flex flex-col min-h-[220px] transition-organic hover:border-primary/40 hover:-translate-y-1 hover:shadow-md"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
              >
                <div className="p-8 border-b border-outline-variant/30 flex-grow text-left">
                  <div className="font-label-caps text-[10px] text-primary font-bold tracking-widest uppercase mb-2">Perfil {method.idx}</div>
                  <h3 className="font-headline-md text-lg font-bold text-[#1c1c18] leading-tight">
                    {method.name}
                  </h3>
                </div>
                <div className="bg-[#EDE7DE]/30 p-6 text-xs text-[#53443a] leading-relaxed font-body-md font-light text-left min-h-[88px] flex items-center">
                  {method.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5.10 AGAVE Y SUMINISTRO */}
      <section className="bg-[#EDE7DE]/20 py-section-gap border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Abastecimiento de Campo" : "Field Supply"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.agaveTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
            <motion.div 
              className="overflow-hidden shadow-md border border-outline-variant/40"
              {...fadeInUp}
            >
              <img 
                src="/Jimado Agave Tequilana Weber.webp" 
                alt="Jimador trabajando en campos de agave de Casa Loy Tequilera" 
                className="w-full aspect-[4/3] object-cover transition-transform duration-10000 hover:scale-105"
              />
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-6 text-left"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                { k: t.agaveOriginKey, v: t.agaveOriginVal },
                { k: t.agaveSinceKey, v: t.agaveSinceVal },
                { k: t.agaveTraceKey, v: t.agaveTraceVal }
              ].map((fact, idx) => (
                <motion.div 
                  key={idx} 
                  className="border-l-2 border-primary pl-6 py-1"
                  variants={{
                    initial: { opacity: 0, x: -15 },
                    whileInView: { opacity: 1, x: 0 }
                  }}
                >
                  <div className="font-label-caps text-[10px] text-primary font-bold tracking-widest uppercase">{fact.k}</div>
                  <div className="font-body-md text-sm text-[#1c1c18] font-normal mt-1">{fact.v}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.11 + 5.12 CALIDAD Y CUMPLIMIENTO (Clean Minimalist Redesign: Removed image column) */}
      <section className="bg-[#fcf9f3] border-y border-outline-variant/40 py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            
            {/* Pillar 1: Quality */}
            <motion.div {...fadeInUp} className="space-y-4">
              <span className="font-label-caps text-primary font-bold text-[10px] tracking-widest uppercase block">
                {lang === "es" ? "Aseguramiento de Calidad" : "Quality Assurance"}
              </span>
              <h3 className="font-headline-md text-2xl text-[#1c1c18] font-bold leading-tight">
                {t.qualityTitle}
              </h3>
              <p className="font-sans text-xs text-[#53443a] leading-relaxed font-light">
                {t.qualityDesc}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                {t.qualityBullets.map((bullet, i) => (
                  <span key={i} className="flex items-center gap-2 text-[11px] text-[#1c1c18] font-light font-sans">
                    <span className="material-symbols-outlined text-xs text-primary">check</span>
                    <span>{bullet}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Pillar 2: Compliance */}
            <motion.div {...fadeInUp} className="space-y-4">
              <span className="font-label-caps text-primary font-bold text-[10px] tracking-widest uppercase block">
                {lang === "es" ? "Regulación Aduanal & CRT" : "Customs & CRT Regulation"}
              </span>
              <h3 className="font-headline-md text-2xl text-[#1c1c18] font-bold leading-tight">
                {t.complianceTitle}
              </h3>
              <p className="font-sans text-xs text-[#53443a] leading-relaxed font-light">
                {t.complianceDesc}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                {t.complianceBullets.map((bullet, i) => (
                  <span key={i} className="flex items-center gap-2 text-[11px] text-[#1c1c18] font-light font-sans">
                    <span className="material-symbols-outlined text-xs text-primary">check</span>
                    <span>{bullet}</span>
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5.12b NDA PRIVACIDAD BANNER */}
      <section className="bg-zinc-950 text-white py-12 md:py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div 
            className="border border-white/10 bg-zinc-900/60 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-left"
            {...fadeInUp}
          >
            <div className="w-14 h-14 border border-[#FDA377] rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FDA377" strokeWidth="1.5">
                <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-headline-md text-xl md:text-2xl text-white font-semibold">{t.ndaTitle}</h3>
              <p className="font-body-md text-sm text-white/70 leading-relaxed font-light">{t.ndaDesc}</p>
              <div className="border border-white/20 text-[#FDA377] px-3.5 py-1 rounded-full text-[10px] font-mono tracking-wider inline-block uppercase font-normal">{t.ndaBadge}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5.13 PRUEBA SOCIAL (Minimal Grid-less Strip: Replaced repetitive white cards) */}
      <section className="py-section-gap bg-[#EDE7DE]/20 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side Quote */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase block text-xs">
                {t.proofTitle}
              </span>
              <h2 className="font-serif italic text-3xl md:text-4xl text-[#8C4723] font-light leading-snug">
                "{t.proofSubtitle}"
              </h2>
              <div className="w-16 h-[2px] bg-primary"></div>
            </div>

            {/* Right side clean points list */}
            <div className="lg:col-span-7 divide-y divide-outline-variant/30 text-left">
              {t.proofItems.map((item, idx) => (
                <div key={idx} className="py-5 flex gap-5 items-start">
                  <span className="font-mono text-xs font-bold text-primary pt-0.5">0{idx+1}</span>
                  <div className="space-y-1">
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1c1c18]">{item.label}</h4>
                    <p className="font-sans text-xs text-[#53443a] font-light leading-relaxed">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5.14 FAQ */}
      <section id="faq-v2" className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-secondary font-semibold tracking-widest uppercase mb-4 block text-xs">
              FAQ
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl mb-12 text-[#1c1c18]">
              {t.faqTitle}
            </h2>
          </motion.div>
          
          <div className="faq-blocks max-w-4xl">
            {Object.keys(t.faqGroups).map((groupKey) => {
              const groupName = t.faqGroups[groupKey];
              const groupFaqs = t.faqs.filter((f) => f.group === groupKey);
              
              return (
                <div key={groupKey} className="mb-10">
                  <div className="font-label-caps text-xs text-primary font-bold tracking-wider uppercase border-b border-outline-variant/30 pb-2 mb-3 mt-6">
                    {groupName}
                  </div>
                  {groupFaqs.map((faq, i) => (
                    <details key={i} className="border-b border-outline-variant/20 py-4 group">
                      <summary className="cursor-pointer font-headline-md text-base font-semibold flex justify-between items-center text-[#1c1c18] select-none list-none group-open:text-primary transition-colors">
                        <span>{faq.q}</span>
                        <span className="material-symbols-outlined text-primary text-xl group-open:rotate-180 transition-transform duration-200">expand_more</span>
                      </summary>
                      <p className="mt-3 text-sm text-[#53443a] leading-relaxed font-light pl-2">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA + CAL.COM SCHEDULER */}
      <section className="bg-zinc-950 text-white py-section-gap" id="contact-scheduler">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <motion.div {...fadeInUp}>
            <span className="font-label-caps text-[#FDA377] font-semibold tracking-widest uppercase mb-4 block text-xs">
              {lang === "es" ? "Siguiente Paso" : "Next Step"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-white max-w-3xl mx-auto mb-6">
              {t.ctaFinalTitle}
            </h2>
            <p className="font-sans text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t.ctaFinalDesc}
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-md sm:max-w-none pt-2 mb-16"
            {...fadeInUp}
          >
            <a
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all duration-300 min-w-[200px] text-center shadow-lg"
              href="#cal-inline-v2"
            >
              {t.ctaFinalBtn1}
            </a>
            <a
              className="border border-white/35 hover:border-white hover:bg-white/5 text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 transition-all duration-300 min-w-[200px] text-center"
              href="#quiz-v2"
            >
              {t.ctaFinalBtn2}
            </a>
          </motion.div>

          {/* Cal.com Embed Container */}
          <motion.div 
            className="w-full max-w-5xl mx-auto bg-white border border-outline-variant/20 p-4 md:p-8 shadow-2xl relative text-left"
            {...fadeInUp}
          >
            <div className="mb-6 border-b border-stone-200/50 pb-4 text-center md:text-left">
              <h4 className="font-headline-md text-2xl mb-1 text-zinc-900">
                {lang === "es" ? "Reserva tu videollamada técnica" : "Schedule Your Technical Call"}
              </h4>
              <p className="text-xs text-stone-500 font-light font-sans">
                {lang === "es" 
                  ? "Selecciona un espacio libre en nuestra agenda oficial de Cal.com." 
                  : "Select a free slot directly from our official Cal.com calendar."}
              </p>
            </div>
            <div 
              id="cal-inline-v2" 
              className="w-full h-[620px]"
            />
          </motion.div>
        </div>
      </section>

      {/* FOOTER WATERMARK */}
      <div className="bg-[#EDE7DE] border-t border-outline-variant/30 py-8 text-center">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <p className="font-mono text-[10px] text-[#53443a] uppercase tracking-wider margin-0">
            CASA LOY TEQUILERA — B2B PRIVATE LABEL GUIDE v2 · NOM 1633 · {lang === "es" ? "TODOS LOS DERECHOS RESERVADOS" : "ALL RIGHTS RESERVED"}
          </p>
        </div>
      </div>
    </div>
  );
}
