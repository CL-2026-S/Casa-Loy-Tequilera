import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";

export default function Test2MBB({ lang = "es", setPage }) {
  const isEn = lang === "en";

  // 3-Question Quiz State (Matching site flow)
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    solution: "",
    stage: "",
    market: ""
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    lada: "+52",
    phone: "",
    email: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Inside Casa Loy active station index (0 to 7)
  const [activeInside, setActiveInside] = useState(0);

  // Hero Banner Carousel (Slide 1: Naves Industriales, Slide 2: Etiqueta de Botellas)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    {
      id: "naves",
      alt: isEn ? "Casa Loy Tequilera Industrial Facilities" : "Naves Industriales Casa Loy Tequilera",
      src: "/Naves Industriales Casa Loy Tequilera.webp",
      overlay: "from-black/55 via-black/35 to-black/85"
    },
    {
      id: "etiqueta",
      alt: isEn ? "Casa Loy Tequila Bottle and Label" : "Etiqueta y Botella de Tequila Casa Loy",
      src: "/Banner Casa Loy Piedra y Agave-escritorio.webp",
      srcMobile: "/Banner Casa Loy Piedra y Agave-movil.webp",
      overlay: "from-black/60 via-black/40 to-black/85"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Cal.com Embed Loader (30-minute consultation)
  useEffect(() => {
    if (setPage) setPage("test2mbb");
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
        elementOrSelector: "#cal-inline-test2mbb",
        calLink: "internationalcasaloy/30min",
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

  // Content dictionary
  const content = {
    hero: {
      h1: isEn ? (
        <>Private Label Tequila Manufacturing in Mexico.<br /><span className="text-white italic font-normal">Your tequila starts in Los Altos de Jalisco.</span></>
      ) : (
        <>Fabricación de Tequila Private Label en México.<br /><span className="text-white italic font-normal">Tu tequila empieza en Los Altos de Jalisco.</span></>
      ),
      secondary: isEn ? '"Your vision. Our expertise."' : '"Tu visión. Nuestra experiencia."',
      sub: isEn
        ? "A family-owned NOM 1633 distillery built for founders, existing brands, and distributors ready to build with a real origin behind them."
        : "Una destilería familiar con NOM 1633, creada para fundadores, marcas existentes y distribuidores listos para construir con un origen real detrás de su producto.",
      ctaStart: isEn ? "Start My Project →" : "Iniciar mi proyecto →",
      ctaCall: isEn ? "Book a Technical Call" : "Agendar una llamada técnica"
    },
    trust: [
      "NOM 1633", "LOS ALTOS DE JALISCO", "FAMILY-OWNED",
      "AGAVE ROOTS SINCE 1992", "BATCH CONTROL", "EXPORT COORDINATION"
    ],
    why: {
      eyebrow: isEn ? "Why Casa Loy" : "Por qué Casa Loy",
      title: isEn
        ? "A family-owned tequila producer in Los Altos de Jalisco."
        : "Un productor familiar de tequila en Los Altos de Jalisco.",
      cards: isEn ? [
        { wk: "Origin", h3: "NOM 1633, Los Altos de Jalisco", desc: "Designation of origin protected production in Jalisco highlands.", anchor: "#agave-supply" },
        { wk: "Structure", h3: "Family-owned, three generations", desc: "Long-term commitment, direct leadership and stable partnerships.", anchor: "#social-proof" },
        { wk: "Agave", h3: "Own cultivation since 1992", desc: "3,600 hectares ensuring price security and guaranteed supply.", anchor: "#agave-supply" },
        { wk: "Team", h3: "Real people behind every project", desc: "Master distillers, chemical engineers, and international trade advisers.", anchor: "#social-proof" },
        { wk: "Infrastructure", h3: "Built for serious, growing projects", desc: "Industrial scale flexibility from pilot runs to bulk containers.", anchor: "#methods" },
        { wk: "Quality", h3: "Batch control on every production", desc: "Internal laboratory and CRT compliance verification on every run.", anchor: "#quality-compliance" }
      ] : [
        { wk: "Origen", h3: "NOM 1633, Los Altos de Jalisco", desc: "Producción protegida bajo denominación de origen en los Altos de Jalisco.", anchor: "#agave-supply" },
        { wk: "Estructura", h3: "Empresa familiar, tres generaciones", desc: "Historia real, compromiso generacional, trato directo y alianzas sólidas.", anchor: "#social-proof" },
        { wk: "Agave", h3: "Cultivo propio desde 1992", desc: "3,600 hectáreas que blindan tu costo por litro y garantizan abasto continuo.", anchor: "#agave-supply" },
        { wk: "Equipo", h3: "Personas reales detrás de cada proyecto", desc: "Maestros tequileros, ingenieros químicos y coordinadores de exportación.", anchor: "#social-proof" },
        { wk: "Infraestructura", h3: "Construida para proyectos serios y en crecimiento", desc: "Flexibilidad industrial desde lotes piloto hasta tanques de granel.", anchor: "#methods" },
        { wk: "Calidad", h3: "Control de lote en cada producción", desc: "Laboratorio interno y verificación estricta de cumplimiento CRT por lote.", anchor: "#quality-compliance" }
      ]
    },
    inside: {
      eyebrow: isEn ? "Inside Casa Loy" : "Dentro de Casa Loy",
      title: isEn ? "From agave to bottle." : "Del agave a la botella.",
      stations: [
        {
          num: "01",
          name: isEn ? "Agave" : "Agave",
          desc: isEn ? "Selected Blue Weber agaves matured 6-7 years in Los Altos highlands." : "Agaves Blue Weber seleccionados y madurados 6-7 años en Los Altos.",
          img: "/Piñas de Agave Tequilana Weber.webp"
        },
        {
          num: "02",
          name: isEn ? "Cooking" : "Cocción",
          desc: isEn ? "Slow steam cooking preserving natural sugars and rich caramels." : "Cocimiento lento al vapor preservando azúcares naturales y notas caramelizadas.",
          img: "/Cocimiento.webp"
        },
        {
          num: "03",
          name: isEn ? "Milling" : "Molienda",
          desc: isEn ? "Gentle fiber shredding and traditional extraction of sweet agave honey." : "Desfibrado cuidadoso y extracción tradicional de mieles de agave puras.",
          img: "/Tahona Agave Molienda.webp"
        },
        {
          num: "04",
          name: isEn ? "Fermentation" : "Fermentación",
          desc: isEn ? "Temperature-controlled stainless steel vats with proprietary yeasts." : "Tinas de acero inoxidable con control térmico y levaduras propias.",
          img: "/Fermentación.webp"
        },
        {
          num: "05",
          name: isEn ? "Distillation" : "Destilación",
          desc: isEn ? "Double distillation in authentic copper pot stills and hybrid columns." : "Doble destilación en alambiques de cobre tradicionales y columnas híbridas.",
          img: "/Destilación.webp"
        },
        {
          num: "06",
          name: isEn ? "Barrels" : "Barricas",
          desc: isEn ? "Underground barrel cellar with American and French white oak casks." : "Cava subterránea con barricas de roble blanco americano y francés.",
          img: "/Añejamiento Barricas.webp"
        },
        {
          num: "07",
          name: isEn ? "Laboratory" : "Laboratorio",
          desc: isEn ? "Continuous chemical and chromatographic validation on every batch." : "Verificación química y cromatográfica continua lote por lote.",
          img: "/Laboratorio.webp"
        },
        {
          num: "08",
          name: isEn ? "Bottling" : "Envasado",
          desc: isEn ? "High-precision automated bottling, manual inspection, and sealing." : "Línea de embotellado de alta precisión, inspección visual y sellado.",
          img: "/Embotellado 2.webp"
        }
      ]
    },
    solutions: {
      eyebrow: isEn ? "Solutions" : "Soluciones",
      title: isEn ? "Choose the right production path." : "Elige la ruta de producción correcta.",
      routes: isEn ? [
        {
          num: "01",
          title: "Private Label Tequila",
          desc: "Create or sell tequila under your own brand.",
          tag: "PRIVATE_LABEL"
        },
        {
          num: "02",
          title: "Bulk Tequila Supply",
          desc: "Bulk tequila for bottlers, importers or distributors.",
          tag: "BULK_TEQUILA"
        },
        {
          num: "03",
          title: "Co-packing / Bottling Services",
          desc: "Bottling, labeling or packaging for a third-party project.",
          tag: "COPACKING_BOTTLING"
        }
      ] : [
        {
          num: "01",
          title: "Tequila Private Label",
          desc: "Crea o vende tequila bajo tu propia marca.",
          tag: "PRIVATE_LABEL"
        },
        {
          num: "02",
          title: "Suministro de Tequila a Granel",
          desc: "Tequila a granel para embotelladores, importadores o distribuidores.",
          tag: "BULK_TEQUILA"
        },
        {
          num: "03",
          title: "Co-packing / Servicios de Envasado",
          desc: "Envasado, etiquetado o empaque para un proyecto de terceros.",
          tag: "COPACKING_BOTTLING"
        }
      ]
    },
    who: {
      eyebrow: isEn ? "Who this is for" : "Para quién es esto",
      title: isEn ? "Find the right path for your tequila project." : "Encuentra la ruta correcta para tu proyecto de tequila.",
      cards: isEn ? [
        { tag: "Founders", h3: "Building a tequila brand from the ground up", desc: "Turnkey operational path from CRT registration to world-class liquid." },
        { tag: "Existing brands", h3: "Looking for a better production partner", desc: "Smooth transition without inventory stockout or organoleptic change." },
        { tag: "Distributors / Importers", h3: "Entering tequila as a new category", desc: "High-volume consistency, export certification and compliant logistics." },
        { tag: "Bulk buyers", h3: "Sourcing steady volume at defined profile", desc: "Stable pricing backed by 3,600 hectares of blue weber agave supply." }
      ] : [
        { tag: "Fundadores", h3: "Construyendo una marca de tequila desde cero", desc: "Ruta operativa llave en mano desde trámites de CRT hasta un líquido excepcional." },
        { tag: "Marcas existentes", h3: "Buscando un mejor socio de producción", desc: "Transición fluida sin riesgo de desabasto ni variación en tu perfil sensorial." },
        { tag: "Distribuidores / Importadores", h3: "Incursionando en tequila como nueva categoría", desc: "Volumen a gran escala, certificados de exportación y certeza arancelaria." },
        { tag: "Compradores a granel", h3: "Buscando volumen constante con perfil definido", desc: "Precios estables respaldados por 3,600 hectáreas de agave azul propio." }
      ]
    },
    stake: {
      eyebrow: isEn ? "What's at stake" : "Lo que está en juego",
      title: isEn
        ? "Your tequila project carries real business risk. We help you reduce it."
        : "Tu proyecto de tequila conlleva un riesgo de negocio real. Te ayudamos a reducirlo.",
      rows: isEn ? [
        { num: "01", title: "Starting from zero", desc: "Entering a category you don't know yet." },
        { num: "02", title: "Switching producer", desc: "Making sure the next transition doesn't repeat the last problem." },
        { num: "03", title: "Scaling / distribution", desc: "Growing volume without losing consistency." },
        { num: "04", title: "Exporting", desc: "Adding tequila to an existing book of business the right way." }
      ] : [
        { num: "01", title: "Empezar desde cero", desc: "Entrar a una categoría que aún no conoces." },
        { num: "02", title: "Cambiar de productor", desc: "Asegurar que la siguiente transición no repita el problema anterior." },
        { num: "03", title: "Escalar / distribución", desc: "Crecer en volumen sin perder consistencia." },
        { num: "04", title: "Exportar", desc: "Incorporar tequila a tu cartera de negocio de la manera correcta." }
      ]
    },
    quiz3: {
      badge: isEn ? "STRATEGIC DIAGNOSTIC · 3 QUESTIONS" : "DIAGNÓSTICO ESTRATÉGICO · 3 PREGUNTAS",
      title: isEn ? "Where does your tequila project stand today?" : "¿En qué etapa se encuentra hoy tu proyecto de tequila?",
      sub: isEn
        ? "Complete this 3-step diagnostic to evaluate technical feasibility and receive a tailor-made proposal from our distilling team."
        : "Completa este diagnóstico de 3 preguntas para evaluar la viabilidad operativa de tu proyecto y recibir una propuesta técnica personalizada.",
      step1Title: isEn ? "1. What type of solution does your project require?" : "1. ¿Qué tipo de solución requiere tu proyecto?",
      step2Title: isEn ? "2. What stage is your project currently in?" : "2. ¿En qué etapa se encuentra tu proyecto?",
      step3Title: isEn ? "3. What is the primary target market for your tequila?" : "3. ¿Cuál es el mercado objetivo principal de tu tequila?",
      step4Title: isEn ? "4. Contact details for technical proposal" : "4. Datos de contacto para envío de propuesta",
      step4Sub: isEn
        ? "A master distiller or production specialist will review your specifications without obligation."
        : "Un maestro tequilero o especialista de producción revisará los parámetros de tu proyecto sin compromiso.",
      btnNext: isEn ? "Continue →" : "Continuar →",
      btnBack: isEn ? "← Back" : "← Regresar",
      btnSubmit: isEn ? "RECEIVE PROPOSAL & TECHNICAL ADVICE →" : "RECIBIR PROPUESTA Y ASESORÍA TÉCNICA →",
      btnSubmitting: isEn ? "SENDING DETAILS..." : "ENVIANDO INFORMACIÓN...",
      successTitle: isEn ? "Diagnosis Received Successfully!" : "¡Diagnóstico Recibido con Éxito!",
      successSub: isEn
        ? "Thank you for sharing your project details. A Casa Loy production specialist will review your parameters and contact you within 24 hours."
        : "Gracias por compartir los detalles de tu proyecto. Un especialista de producción de Casa Loy revisará tus especificaciones y se comunicará en menos de 24 horas."
    },
    process: {
      eyebrow: isEn ? "Process" : "Proceso",
      title: isEn ? "From idea to production: a clear path before you commit." : "De la idea a la producción: una ruta clara antes de comprometerte.",
      steps: [
        {
          num: "01",
          title: isEn ? "Project diagnosis" : "Diagnóstico del proyecto",
          desc: isEn ? "We evaluate your concept, volume, market target, and profile requirements." : "Evaluamos tu concepto, volumen proyectado, mercado meta y requerimientos de perfil.",
          img: "/Cata Experiencias.webp"
        },
        {
          num: "02",
          title: isEn ? "Technical call" : "Llamada técnica",
          desc: isEn ? "30-minute technical video call with our distilling and commercial team." : "Videollamada técnica de 30 minutos con nuestro equipo de destilación y comercial.",
          img: "/Restaurante 1937 Nativo atención al cliente.webp"
        },
        {
          num: "03",
          title: isEn ? "Product definition" : "Definición del producto",
          desc: isEn ? "Benchmarking liquid profiles, organoleptic tastings, and packaging feasibility." : "Calibración de perfil de líquido, catas organolépticas y viabilidad de envasado.",
          img: "/Tahona Agave Molienda.webp"
        },
        {
          num: "04",
          title: isEn ? "Compliance path" : "Ruta de cumplimiento normativo",
          desc: isEn ? "Coordination of NOM 1633, CRT brand registration, and export certificates." : "Coordinación de registro de marca ante CRT, norma NOM 1633 y certificados de exportación.",
          img: "/Laboratorio Maquilas.webp"
        },
        {
          num: "05",
          title: isEn ? "Production & control" : "Producción y control",
          desc: isEn ? "Batch distillation, aging cellar allocation, and laboratory chromatographic clearance." : "Destilación por lotes, asignación de cava de barricas y liberación de laboratorio.",
          img: "/Destilación.webp"
        },
        {
          num: "06",
          title: isEn ? "Shipment coordination" : "Coordinación de envío",
          desc: isEn ? "Bottling inspection, palletizing, export documentation, and customs handover." : "Inspección de embotellado, paletizado, documentación de exportación y despacho aduanal.",
          img: "/Embotellado 2.webp"
        }
      ]
    },
    methods: {
      eyebrow: isEn ? "Production, by result" : "Producción, por resultado",
      title: isEn ? "The tequila profile your brand needs, and how we build it." : "El perfil de tequila que tu marca necesita, y cómo lo construimos.",
      profiles: isEn ? [
        {
          num: "01",
          title: "Heritage / Ultra-Premium",
          bottom: "Stone mill, traditional oven, pot still.",
          desc: "Stone mill, traditional oven, pot still."
        },
        {
          num: "02",
          title: "Premium Consistent",
          bottom: "Autoclave, precise control.",
          desc: "Autoclave, precise control."
        },
        {
          num: "03",
          title: "Scalable Commercial",
          bottom: "Column still, high efficiency.",
          desc: "Column still, high efficiency."
        },
        {
          num: "04",
          title: "Custom Signature",
          bottom: "Signature yeast, wine or whiskey barrels.",
          desc: "Signature yeast, wine or whiskey barrels."
        }
      ] : [
        {
          num: "01",
          title: "Herencia / Ultra-Premium",
          bottom: "Molino de piedra, horno tradicional, alambique.",
          desc: "Molino de piedra, horno tradicional, alambique."
        },
        {
          num: "02",
          title: "Premium Consistente",
          bottom: "Autoclave, control preciso.",
          desc: "Autoclave, control preciso."
        },
        {
          num: "03",
          title: "Comercial Escalable",
          bottom: "Columna de destilación, alta eficiencia.",
          desc: "Columna de destilación, alta eficiencia."
        },
        {
          num: "04",
          title: "Firma Personalizada",
          bottom: "Levadura característica, barricas de vino o whisky.",
          desc: "Levadura característica, barricas de vino o whisky."
        }
      ]
    },
    agave: {
      eyebrow: isEn ? "Agave & supply" : "Agave y suministro",
      title: isEn ? "Your tequila brand starts before production — it starts with supply." : "Tu marca de tequila empieza antes de la producción: empieza con el suministro.",
      facts: isEn ? [
        { k: "Origin", v: "Los Altos de Jalisco, Ayotlán", desc: "Mineral-rich red highland soil ideal for Blue Weber Agave." },
        { k: "Since", v: "Agave roots since 1992", desc: "Over 3 decades of agricultural mastery, avoiding raw material brokers." },
        { k: "Traceability", v: "Field-level knowledge, supply planning", desc: "3,600 estate hectares securing long-term cost stability per liter." }
      ] : [
        { k: "Origen", v: "Los Altos de Jalisco, Ayotlán", desc: "Tierra roja mineral de Los Altos óptima para la acumulación de azúcares." },
        { k: "Desde", v: "Raíces de agave desde 1992", desc: "Más de 3 décadas de experiencia agrícola directa, sin depender de coyotes." },
        { k: "Trazabilidad", v: "Conocimiento a nivel de campo, planeación de suministro", desc: "3,600 hectáreas propias que blindan la estabilidad de costo de tu marca." }
      ]
    },
    qualityCompliance: {
      quality: {
        eyebrow: isEn ? "Quality" : "Calidad",
        title: isEn ? "Batch-to-batch consistency your brand can defend." : "Consistencia lote a lote que tu marca puede respaldar.",
        lede: isEn ? "Lab verification, defined parameters, batch review, traceability and client approval before shipping." : "Verificación de laboratorio, parámetros definidos, revisión de lote, trazabilidad y aprobación del cliente antes del envío.",
        list: isEn ? [
          "In-house lab, every batch",
          "Client approval before shipping",
          "Batch-to-batch traceability"
        ] : [
          "Laboratorio propio, en cada lote",
          "Aprobación del cliente antes del envío",
          "Trazabilidad lote a lote"
        ]
      },
      compliance: {
        eyebrow: isEn ? "Compliance & export" : "Cumplimiento y exportación",
        title: isEn ? "We help coordinate compliance, not carry it alone." : "Te ayudamos a coordinar el cumplimiento normativo, no a cargarlo solo.",
        lede: isEn ? "We help coordinate the compliance and export documentation path with the right parties involved." : "Ayudamos a coordinar la ruta de cumplimiento normativo y documentación de exportación con las partes correctas involucradas.",
        list: isEn ? [
          "NOM 1633 · CRT",
          "Export documentation",
          "Coordination with legal & distribution partners"
        ] : [
          "NOM 1633 · CRT",
          "Documentación de exportación",
          "Coordinación con socios legales y de distribución"
        ]
      }
    },
    nda: {
      title: isEn ? "Your Brand. Your Project. Protected." : "Tu Marca. Tu Proyecto. Protegido.",
      desc: isEn
        ? "Your formula stays yours. Every project includes a confidentiality agreement, clear IP ownership terms, and controlled documentation — so your development process is protected from day one."
        : "Tu fórmula sigue siendo tuya. Cada proyecto incluye un acuerdo de confidencialidad, términos claros de propiedad intelectual y documentación controlada, para que tu proceso de desarrollo esté protegido desde el primer día.",
      badge: isEn ? "NDA available" : "NDA disponible"
    },
    proof: {
      eyebrow: isEn ? "Proof, not promises" : "Pruebas, no promesas",
      title: isEn
        ? "Every project receives direct attention from the people involved in production, quality, compliance and commercial coordination."
        : "Cada proyecto recibe atención directa de las personas involucradas en producción, calidad, cumplimiento normativo y coordinación comercial.",
      cards: isEn ? [
        { tag: "Attention", h3: "Direct attention from the team on every project", desc: "No impersonal ticket systems. You work directly with production directors." },
        { tag: "Process", h3: "Verified, traceable production process", desc: "Full batch reports and lab assays provided before every bottling run." },
        { tag: "Cases", h3: "Authorized case studies — coming soon", desc: "Proven track records across premium Mexican and international brands." },
        { tag: "Testimonials", h3: "Client testimonials — published with permission only", desc: "Strict confidentiality and partner discretion strictly respected." }
      ] : [
        { tag: "Atención", h3: "Atención directa del equipo en cada proyecto", desc: "Sin burocracia. Trato directo con directores de producción y maestros tequileros." },
        { tag: "Proceso", h3: "Proceso de producción verificado y trazable", desc: "Reportes químicos de laboratorio entregados antes de cada lote de embotellado." },
        { tag: "Casos", h3: "Casos de estudio autorizados — próximamente", desc: "Experiencia comprobada maquilando marcas premium nacionales e internacionales." },
        { tag: "Testimonios", h3: "Testimonios de clientes — publicados solo con autorización", desc: "Confidencialidad absoluta y respeto estricto a la discreción de cada socio." }
      ]
    },
    faq: {
      eyebrow: isEn ? "FAQ" : "Preguntas frecuentes",
      title: isEn ? "Straight answers, by intention." : "Respuestas directas, organizadas por intención.",
      blocks: [
        {
          category: isEn ? "Founders / Investors" : "Fundadores / Inversionistas",
          items: [
            {
              q: isEn ? "How do I start my own tequila brand?" : "¿Cómo empiezo mi propia marca de tequila?",
              a: isEn 
                ? "It starts with your liquid's character, target market, and budget range."
                : "Empieza con el carácter de tu líquido, tu mercado objetivo y tu rango de presupuesto."
            },
            {
              q: isEn ? "Who owns my formula?" : "¿A quién le pertenece mi fórmula?",
              a: isEn 
                ? "You do. Every project includes a confidentiality agreement and clear IP ownership terms."
                : "A ti. Cada proyecto incluye un acuerdo de confidencialidad y términos claros de propiedad intelectual."
            },
            {
              q: isEn ? "Can I visit the distillery?" : "¿Puedo visitar la destilería?",
              a: isEn 
                ? "Yes. We welcome serious project visits — seeing the process firsthand is often the fastest way to know if we're the right fit."
                : "Sí. Recibimos visitas de proyectos serios: ver el proceso de primera mano suele ser la forma más rápida de saber si somos el socio correcto."
            }
          ]
        },
        {
          category: isEn ? "Existing brands" : "Marcas existentes",
          items: [
            {
              q: isEn ? "Can I switch producers without interrupting inventory?" : "¿Puedo cambiar de productor sin interrumpir mi inventario?",
              a: isEn 
                ? "Yes — we map your timeline first, then build production around it."
                : "Sí: primero mapeamos tus tiempos y después construimos la producción alrededor de ellos."
            },
            {
              q: isEn ? "Can you produce exclusively for my brand?" : "¿Pueden producir de forma exclusiva para mi marca?",
              a: isEn 
                ? "Yes — exclusivity is part of the same protected development structure covered by your confidentiality agreement."
                : "Sí: la exclusividad forma parte de la misma estructura de desarrollo protegida, cubierta por tu acuerdo de confidencialidad."
            }
          ]
        },
        {
          category: isEn ? "Bulk buyers" : "Compradores a granel",
          items: [
            {
              q: isEn ? "Does Casa Loy offer bulk tequila?" : "¿Casa Loy ofrece tequila a granel?",
              a: isEn 
                ? "Yes — bulk supply with a consistent, defined profile."
                : "Sí: suministro a granel con un perfil consistente y definido."
            },
            {
              q: isEn ? "Can I use my own bottle?" : "¿Puedo usar mi propia botella?",
              a: isEn 
                ? "Yes. We can work with a bottle you've already sourced, or coordinate sourcing as part of your project."
                : "Sí. Podemos trabajar con una botella que ya hayas conseguido, o coordinar su abastecimiento como parte de tu proyecto."
            }
          ]
        },
        {
          category: isEn ? "Distributors / Importers" : "Distribuidores / Importadores",
          items: [
            {
              q: isEn ? "What documentation is needed to export from Mexico?" : "¿Qué documentación se necesita para exportar desde México?",
              a: isEn 
                ? "CRT export certificate, commercial invoice, certificate of origin, and TTB label approval for the U.S."
                : "Certificado de exportación CRT, factura comercial, certificado de origen y aprobación de etiqueta TTB para EE. UU."
            }
          ]
        },
        {
          category: isEn ? "Compliance" : "Cumplimiento normativo",
          items: [
            {
              q: isEn ? "What does NOM 1633 mean for a tequila brand?" : "¿Qué significa la NOM 1633 para una marca de tequila?",
              a: isEn 
                ? "It confirms the distillery is authorized under Mexico's denomination-of-origin standard."
                : "Confirma que la destilería está autorizada bajo la norma mexicana de denominación de origen."
            }
          ]
        }
      ]
    },
    finalCta: {
      eyebrow: isEn ? "Next step" : "Siguiente paso",
      title: isEn ? "Book a 20-minute technical video call." : "Agenda una videollamada técnica de 30 minutos.",
      lede: isEn
        ? "No commitment. No sales pitch. A real conversation about whether your project is the right fit for what we do here."
        : "Sin compromiso. Sin discurso de ventas. Una conversación real sobre si tu proyecto encaja con lo que hacemos aquí.",
      btnCall: isEn ? "Book a Technical Call →" : "Agendar una llamada técnica →",
      btnDetails: isEn ? "Send Project Details" : "Enviar detalles del proyecto"
    }
  };

  // Preload route from Solutions section into 3-question quiz
  const handleSelectRoute = (rt) => {
    setQuizAnswers((prev) => ({ ...prev, solution: rt.title }));
    const quizEl = document.getElementById("quiz");
    if (quizEl) {
      quizEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3-Question Quiz Submit Handler
  const handleQuizSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      setErrorMessage(isEn ? "Please fill in all required fields (Name, Email, Phone)." : "Por favor llena los campos obligatorios (Nombre, Correo, Teléfono).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: contactForm.name,
        company: contactForm.company || "N/A",
        email: contactForm.email,
        lada: contactForm.lada || "+52",
        phone: contactForm.phone,
        solution: quizAnswers.solution || "Tequila de Marca Privada / Blanca",
        objective: `Mercado: ${quizAnswers.market || "No especificado"}`,
        stage: quizAnswers.stage || "En desarrollo",
        comments: contactForm.notes || "Registro desde /test2mbb (Diagnóstico 3 preguntas)",
        lead_type: "Test2MBB Diagnóstico B2B",
        origin: "casaloy.com/test2mbb"
      };

      await fetch("/api/maquila", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setIsSuccess(true);
    } catch (err) {
      console.warn("Error submitting quiz:", err);
      setIsSuccess(true); // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="test2mbb-root font-sans antialiased text-[#1C1C1C] bg-[#FAF8F5] selection:bg-[#8C4723] selection:text-white">
      <SEO page="test2mbb" lang={lang} />

      {/* Internal Scoped CSS */}
      <style>{`
        .test2mbb-root h1, 
        .test2mbb-root h2, 
        .test2mbb-root h3,
        .test2mbb-root .font-serif-title {
          font-family: 'EB Garamond', 'Cormorant Garamond', Georgia, serif;
          letter-spacing: -0.01em;
        }
        .test2mbb-root .font-nav-tag {
          font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
        }
        .test2mbb-eyebrow {
          font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8C4723;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }
        .test2mbb-eyebrow::before {
          content: "";
          width: 24px;
          height: 1.5px;
          background: #8C4723;
          display: inline-block;
        }
        @keyframes scroll-arrow-down {
          0% { transform: translateY(-4px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(4px); opacity: 0; }
        }
        .animate-scroll-arrow {
          animation: scroll-arrow-down 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
        }
      `}</style>

      {/* ============================================================
          01. HERO BANNER: ESTILO EXACTO HOME DE CASA LOY CON TRUST BAR INTEGRADO
          (Visible sin hacer scroll: h-screen con barra inferior integrada)
          ============================================================ */}
      <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-zinc-950 text-white">
        {/* Background Image Carousel (Slide 1: Naves Industriales, Slide 2: Etiqueta de Botellas) */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <picture>
                {slide.srcMobile && (
                  <source media="(max-width: 768px)" srcSet={slide.srcMobile} />
                )}
                <img
                  alt={slide.alt}
                  className="w-full h-full object-cover brightness-[0.72] transition-transform duration-[8000ms] ease-out scale-105"
                  src={slide.src}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                />
              </picture>
              {/* Dark gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${slide.overlay}`}></div>
            </div>
          ))}
        </div>

        {/* Desktop Prev / Next Carousel Controls */}
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer border border-white/15 shadow-lg"
          aria-label="Previous banner slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer border border-white/15 shadow-lg"
          aria-label="Next banner slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content Container (Centered in Viewport) */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center pt-20 pb-2">
          {/* Main Heading: Fabricación de Tequila Private Label en México */}
          <h1 className="font-serif-title text-[clamp(26px,4.2vw,54px)] leading-[1.12] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-3">
            {content.hero.h1}
          </h1>

          {/* Secondary quote in Italic */}
          <p className="font-serif-title italic text-base md:text-xl text-[#FDA377] mb-3">
            {content.hero.secondary}
          </p>

          {/* Subtitle / Narrative */}
          <p className="font-nav-tag text-white/80 font-normal text-xs md:text-sm max-w-2xl mx-auto mb-7 leading-relaxed tracking-wider uppercase">
            {content.hero.sub}
          </p>

          {/* CTA Buttons in Exact Home Style */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md sm:max-w-none mb-3">
            <a
              href="#quiz"
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-nav-tag text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center shadow-lg cursor-pointer"
            >
              {content.hero.ctaStart}
            </a>
            <a
              href="#cta"
              className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-nav-tag text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold py-3.5 px-8 transition-all duration-500 min-w-[200px] text-center cursor-pointer"
            >
              {content.hero.ctaCall}
            </a>
          </div>

          {/* Slide Indicators (Dots) */}
          <div className="flex items-center gap-2.5 my-2.5 z-20">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentHeroSlide(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  idx === currentHeroSlide
                    ? "w-8 bg-[#8C4723]"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Animación de flecha de scroll de Home */}
          <a href="#why" className="inline-flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity mt-1 cursor-pointer">
            <svg 
              className="w-4 h-4 text-white animate-scroll-arrow" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </a>
        </div>

        {/* LÍNEA INFERIOR DE DATOS (TRUST BAR) INTEGRADA EN EL MISMO BLOQUE (Visible sin scroll) */}
        <div className="w-full bg-[#EDE7DE] border-t border-[#1A1615]/15 py-3 md:py-3.5 z-20 shadow-md">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-y-1.5 gap-x-3 md:gap-x-6 text-center">
              <span className="font-nav-tag text-[11px] md:text-xs font-bold uppercase tracking-widest text-[#8C4723]">
                NOM 1633
              </span>
              <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
              <span className="font-nav-tag text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1C1C1C]">
                LOS ALTOS DE JALISCO
              </span>
              <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
              <span className="font-nav-tag text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1C1C1C]">
                FAMILY-OWNED
              </span>
              <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
              <span className="font-nav-tag text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1C1C1C]">
                AGAVE ROOTS SINCE 1992
              </span>
              <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
              <span className="font-nav-tag text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1C1C1C]">
                BATCH CONTROL
              </span>
              <span className="text-[#8C4723] text-xs font-semibold select-none hidden md:inline">✦</span>
              <span className="font-nav-tag text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1C1C1C]">
                EXPORT COORDINATION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY CASA LOY (6 TARJETAS INTERACTIVAS)
          ============================================================ */}
      <section id="why" className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.why.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.why.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {content.why.cards.map((card, idx) => (
              <a
                key={idx}
                href={card.anchor}
                className="group border border-[#DCD5C3] hover:border-[#8C4723] rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-lg cursor-pointer block"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-nav-tag text-[10.5px] text-[#8C4723] uppercase tracking-wider font-bold">
                    {card.wk}
                  </span>
                  <span className="text-[#8C4723] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    →
                  </span>
                </div>
                <h3 className="font-serif-title font-semibold text-[18px] text-[#1C1C1C] leading-snug group-hover:text-[#8C4723] transition-colors">
                  {card.h3}
                </h3>
                <p className="text-[13px] text-[#6E6B62] mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          INSIDE CASA LOY (8 ESTACIONES CON IMAGEN Y OVERLAY)
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#12241B] text-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow" style={{ color: "#FDA377" }}>
            {content.inside.eyebrow}
          </p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-white mb-10">
            {content.inside.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {content.inside.stations.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveInside(idx)}
                className={`relative h-[210px] md:h-[240px] rounded-lg overflow-hidden border transition-all cursor-pointer group ${
                  activeInside === idx ? "border-[#FDA377] ring-2 ring-[#FDA377]" : "border-white/15 hover:border-white/40"
                }`}
              >
                <img
                  src={st.img}
                  alt={st.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>

                <div className="relative z-10 h-full p-4 md:p-5 flex flex-col justify-between">
                  <span className="font-nav-tag text-[11px] text-[#FDA377] font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded w-fit">
                    {st.num}
                  </span>
                  <div>
                    <h3 className="text-[17px] text-white font-semibold font-serif-title">
                      {st.name}
                    </h3>
                    <p className="text-[12px] text-white/80 mt-1 leading-snug line-clamp-3">
                      {st.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          RUTAS DE SOLUCIÓN (3 RUTAS LIMPIAS, SIN RECUADROS ROJOS NI CAJA INFERIOR)
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.solutions.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.solutions.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.solutions.routes.map((rt) => (
              <div
                key={rt.num}
                onClick={() => handleSelectRoute(rt)}
                className="p-7 rounded-xl bg-white border border-[#DCD5C3] hover:border-[#8C4723] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-nav-tag text-xs text-[#8C4723] font-bold">
                      {rt.num}
                    </span>
                    <span className="font-nav-tag text-[10px] text-[#8C4723] font-semibold uppercase bg-[#EFE7D6] px-2.5 py-1 rounded">
                      {rt.tag}
                    </span>
                  </div>

                  <h3 className="font-serif-title font-semibold text-[20px] text-[#1C1C1C] group-hover:text-[#8C4723] transition-colors leading-snug mb-3">
                    {rt.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6E6B62] leading-relaxed">
                    {rt.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCD5C3]/60 flex items-center justify-end">
                  <span className="text-[#8C4723] text-xs font-semibold tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isEn ? "Select route →" : "Elegir ruta →"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          AUTOIDENTIFICACIÓN (WHO THIS IS FOR)
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#EFE7D6]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.who.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.who.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {content.who.cards.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-nav-tag text-[10.5px] text-[#8C4723] font-bold uppercase tracking-wider block mb-2">
                  {card.tag}
                </span>
                <h3 className="font-serif-title font-semibold text-[17px] text-[#1C1C1C] leading-snug">
                  {card.h3}
                </h3>
                <p className="text-[12.5px] text-[#6E6B62] mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROBLEMAS QUE RESOLVEMOS (WHAT'S AT STAKE)
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.stake.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[680px] text-[#1C1C1C] mb-10">
            {content.stake.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.stake.rows.map((row) => (
              <div
                key={row.num}
                className="p-6 rounded-lg bg-white border border-[#DCD5C3] flex gap-4 items-start shadow-xs hover:border-[#8C4723] transition-colors"
              >
                <span className="font-serif-title text-3xl text-[#8C4723] font-semibold shrink-0">
                  {row.num}
                </span>
                <div>
                  <h3 className="font-serif-title font-semibold text-[18px] text-[#1C1C1C]">
                    {row.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6E6B62] mt-1.5 leading-relaxed">
                    {row.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DIAGNÓSTICO B2B (3 PREGUNTAS + CAPTURA DE CONTACTO)
          ============================================================ */}
      <section id="quiz" className="relative py-20 md:py-28 bg-[#1E1A17] text-white overflow-hidden">
        {/* Background photo texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="/Piñas de Agave Tequilana Weber.webp"
            alt="Agave Weber"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1A17] via-transparent to-[#1E1A17]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-nav-tag text-[#FDA377] font-semibold tracking-[0.3em] text-[11px] uppercase block mb-2">
              {content.quiz3.badge}
            </span>
            <h2 className="font-serif-title text-3xl md:text-4xl text-white font-semibold leading-tight">
              {content.quiz3.title}
            </h2>
            <p className="text-white/80 text-sm mt-3 leading-relaxed">
              {content.quiz3.sub}
            </p>
          </div>

          <div className="bg-white/5 border border-white/20 backdrop-blur-md rounded-xl p-6 md:p-10 shadow-2xl">
            {/* Steps Progress Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="font-nav-tag text-xs text-[#FDA377] font-bold tracking-widest uppercase">
                {!isSuccess
                  ? (isEn ? `Step ${quizStep} of 4` : `Paso ${quizStep} de 4`)
                  : (isEn ? "Completed ✓" : "Completado ✓")}
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <span
                    key={s}
                    className={`w-8 h-1.5 rounded-full transition-all ${
                      isSuccess
                        ? "bg-emerald-400"
                        : s <= quizStep
                        ? "bg-[#FDA377]"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-serif-title font-semibold text-2xl md:text-3xl text-white mb-3">
                  {content.quiz3.successTitle}
                </h3>
                <p className="text-white/85 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                  {content.quiz3.successSub}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="#cta"
                    className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-semibold text-xs md:text-sm uppercase tracking-widest py-3.5 px-7 rounded shadow cursor-pointer"
                  >
                    {isEn ? "Schedule 30-Min Technical Call Now →" : "Agendar llamada técnica de 30 min ahora →"}
                  </a>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setQuizStep(1);
                      setQuizAnswers({ solution: "", stage: "", market: "" });
                    }}
                    className="border border-white/40 hover:border-white text-white font-semibold text-xs md:text-sm uppercase tracking-widest py-3.5 px-6 rounded cursor-pointer"
                  >
                    {isEn ? "Start New Inquiry" : "Iniciar otra consulta"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Step 1: Solution */}
                {quizStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-serif-title text-xl md:text-2xl text-white font-semibold mb-4">
                      {content.quiz3.step1Title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: isEn ? "White Label / Private Label Tequila" : "Tequila de Marca Privada / Blanca", desc: isEn ? "Full turnkey support from CRT registry, formulation to export." : "Crea o vende tequila bajo tu propia marca con servicio llave en mano." },
                        { title: isEn ? "Bulk Tequila Supply" : "Suministro de Tequila a Granel", desc: isEn ? "100% Agave or Mixto bulk for bottlers & distributors." : "Tequila a granel para envasadores, importadores o distribuidores." },
                        { title: isEn ? "Co-packing & Bottling Services" : "Servicios de Envasado / Co-packing", desc: isEn ? "Filling, labeling, tax stamp placement and secondary packaging." : "Embotellado, tapado, sellado y acondicionamiento para proyectos externos." }
                      ].map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, solution: opt.title });
                            setQuizStep(2);
                          }}
                          className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                            quizAnswers.solution === opt.title
                              ? "bg-[#8C4723] border-[#FDA377] text-white shadow-md"
                              : "bg-white/5 hover:bg-white/10 border-white/15 text-white/90"
                          }`}
                        >
                          <span className="font-serif-title font-semibold text-[16px] block text-white">
                            {opt.title}
                          </span>
                          <span className="text-[12px] text-white/70 mt-1 block">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Stage */}
                {quizStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-serif-title text-xl md:text-2xl text-white font-semibold mb-4">
                      {content.quiz3.step2Title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: isEn ? "Idea or Early Concept" : "Idea o Concepto Inicial", desc: isEn ? "Planning brand concept, budget and formulation." : "En desarrollo de concepto, presupuesto o formulación." },
                        { title: isEn ? "Brand & Assets Ready" : "Marca y Fórmula Lista", desc: isEn ? "Registered trademark seeking industrial distillery." : "Marca registrada que busca socio destilador industrial." },
                        { title: isEn ? "Existing Brand on Market" : "Marca Existente en el Mercado", desc: isEn ? "Switching producers for stability, quality or supply." : "Buscando cambio de maquilador por estabilidad o calidad." },
                        { title: isEn ? "Volume Distributor / Importer" : "Distribuidor o Importador de Volumen", desc: isEn ? "Sourcing high volume under long term agreement." : "Abasteciendo volumen para cartera comercial establecida." }
                      ].map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, stage: opt.title });
                            setQuizStep(3);
                          }}
                          className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                            quizAnswers.stage === opt.title
                              ? "bg-[#8C4723] border-[#FDA377] text-white shadow-md"
                              : "bg-white/5 hover:bg-white/10 border-white/15 text-white/90"
                          }`}
                        >
                          <span className="font-serif-title font-semibold text-[16px] block text-white">
                            {opt.title}
                          </span>
                          <span className="text-[12px] text-white/70 mt-1 block">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="text-white/60 hover:text-white font-nav-tag text-xs pt-2"
                    >
                      {content.quiz3.btnBack}
                    </button>
                  </div>
                )}

                {/* Step 3: Market */}
                {quizStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-serif-title text-xl md:text-2xl text-white font-semibold mb-4">
                      {content.quiz3.step3Title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: isEn ? "United States (USA)" : "Estados Unidos (EE. UU.)", desc: isEn ? "TTB compliance, COLA approval and import permits." : "Normativas TTB, aprobación COLA y coordinación aduanal." },
                        { title: isEn ? "Mexico (Domestic)" : "México (Mercado Nacional)", desc: isEn ? "SAT marbetes, CRT compliance and national delivery." : "Marbetes SAT, cumplimiento CRT y entrega nacional." },
                        { title: isEn ? "Europe & United Kingdom" : "Europa y Reino Unido", desc: isEn ? "European denomination of origin standards." : "Estándares europeos de denominación de origen." },
                        { title: isEn ? "Canada / LatAm / Global" : "Canadá / Latinoamérica / Global", desc: isEn ? "Provincial monopolies or international distributors." : "Monopolios provinciales o distribuidores internacionales." }
                      ].map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, market: opt.title });
                            setQuizStep(4);
                          }}
                          className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                            quizAnswers.market === opt.title
                              ? "bg-[#8C4723] border-[#FDA377] text-white shadow-md"
                              : "bg-white/5 hover:bg-white/10 border-white/15 text-white/90"
                          }`}
                        >
                          <span className="font-serif-title font-semibold text-[16px] block text-white">
                            {opt.title}
                          </span>
                          <span className="text-[12px] text-white/70 mt-1 block">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuizStep(2)}
                      className="text-white/60 hover:text-white font-nav-tag text-xs pt-2"
                    >
                      {content.quiz3.btnBack}
                    </button>
                  </div>
                )}

                {/* Step 4: Contact Form */}
                {quizStep === 4 && (
                  <form onSubmit={handleQuizSubmit} className="space-y-4">
                    <div>
                      <h3 className="font-serif-title text-xl md:text-2xl text-white font-semibold">
                        {content.quiz3.step4Title}
                      </h3>
                      <p className="text-white/70 text-xs mt-1">
                        {content.quiz3.step4Sub}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-nav-tag text-[11px] uppercase tracking-wider text-[#FDA377] block mb-1">
                          {isEn ? "Full Name *" : "Nombre Completo *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder={isEn ? "John Doe" : "Tu Nombre"}
                          className="w-full bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377]"
                        />
                      </div>
                      <div>
                        <label className="font-nav-tag text-[11px] uppercase tracking-wider text-[#FDA377] block mb-1">
                          {isEn ? "Company / Brand Name" : "Empresa o Nombre de Marca"}
                        </label>
                        <input
                          type="text"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          placeholder={isEn ? "Brand LLC" : "Tu Empresa"}
                          className="w-full bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-nav-tag text-[11px] uppercase tracking-wider text-[#FDA377] block mb-1">
                          {isEn ? "Email *" : "Correo Electrónico *"}
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="tu@correo.com"
                          className="w-full bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377]"
                        />
                      </div>
                      <div>
                        <label className="font-nav-tag text-[11px] uppercase tracking-wider text-[#FDA377] block mb-1">
                          {isEn ? "Phone / WhatsApp *" : "Teléfono / WhatsApp *"}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={contactForm.lada}
                            onChange={(e) => setContactForm({ ...contactForm, lada: e.target.value })}
                            className="w-20 bg-white/10 border border-white/20 rounded p-3 text-white text-center"
                          />
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="33 1234 5678"
                            className="flex-1 bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="font-nav-tag text-[11px] uppercase tracking-wider text-[#FDA377] block mb-1">
                        {isEn ? "Project Notes / Specifics" : "Notas del Proyecto o Requerimientos"}
                      </label>
                      <textarea
                        rows={2}
                        value={contactForm.notes}
                        onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                        placeholder={isEn ? "Target launch date, estimated volume, packaging details..." : "Fecha estimada de lanzamiento, volumen previsto, detalles de botella..."}
                        className="w-full bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FDA377]"
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-rose-400 text-xs">{errorMessage}</p>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setQuizStep(3)}
                        className="text-white/60 hover:text-white font-nav-tag text-xs"
                      >
                        {content.quiz3.btnBack}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#8C4723] hover:bg-[#a6562b] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest py-4 px-8 rounded cursor-pointer transition shadow-lg"
                      >
                        {isSubmitting ? content.quiz3.btnSubmitting : content.quiz3.btnSubmit}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROCESO DE TRABAJO: 6 TARJETAS CON IMÁGENES
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#12241B] text-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow" style={{ color: "#FDA377" }}>
            {content.process.eyebrow}
          </p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-white mb-10">
            {content.process.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {content.process.steps.map((st) => (
              <div
                key={st.num}
                className="group relative rounded-xl overflow-hidden border border-white/15 bg-[#1B3327] hover:border-[#FDA377] transition-all duration-300 flex flex-col h-[280px] shadow-lg"
              >
                {/* Photo Top with Zoom Effect */}
                <div className="relative h-[150px] overflow-hidden">
                  <img
                    src={st.img}
                    alt={st.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3327] via-transparent to-black/30"></div>
                  <span className="absolute top-3 left-3 font-nav-tag text-xs font-bold text-[#12241B] bg-[#FDA377] px-2.5 py-0.5 rounded shadow">
                    {st.num}
                  </span>
                </div>

                {/* Content Bottom */}
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <h3 className="font-serif-title font-semibold text-[18px] text-white group-hover:text-[#FDA377] transition-colors leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-[12.5px] text-[#C9D3CB] mt-1.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          MÉTODOS POR RESULTADO (4 PERFILES)
          ============================================================ */}
      <section id="methods" className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.methods.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.methods.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {content.methods.profiles.map((pf, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] rounded-lg overflow-hidden bg-white flex flex-col justify-between hover:border-[#8C4723] hover:shadow-md transition-all duration-300 p-6"
              >
                <div>
                  <span className="font-nav-tag text-[11px] text-[#8C4723] uppercase font-bold tracking-wider block mb-2">
                    {pf.num}
                  </span>
                  <h3 className="font-serif-title font-semibold text-[19px] text-[#1C1C1C] leading-snug">
                    {pf.title}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-[#DCD5C3]/60 text-[13px] text-[#555] leading-relaxed">
                  {pf.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          AGAVE Y SUMINISTRO (FOTO REAL DE CAMPO Y DATOS)
          ============================================================ */}
      <section id="agave-supply" className="py-20 md:py-24 bg-[#EFE7D6]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.agave.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.agave.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#DCD5C3] bg-white shadow-lg">
              <img
                src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
                alt="Campos de Agave Casa Loy en Ayotlán"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white font-nav-tag text-[11px] px-3 py-1 rounded font-semibold">
                NOM 1633 · Ayotlán, Los Altos de Jalisco
              </span>
            </div>

            <div className="space-y-4">
              {content.agave.facts.map((fc, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border-l-4 border-[#8C4723] shadow-xs">
                  <span className="font-nav-tag text-[10.5px] text-[#8C4723] uppercase tracking-wider font-bold">
                    {fc.k}
                  </span>
                  <div className="text-[17px] text-[#1C1C1C] font-semibold mt-0.5 font-serif-title">
                    {fc.v}
                  </div>
                  <p className="text-[13px] text-[#6E6B62] mt-1 leading-relaxed">
                    {fc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          QUALITY & COMPLIANCE (CALIDAD Y EXPORTACIÓN)
          ============================================================ */}
      <div id="quality-compliance" className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#DCD5C3] border-y border-[#DCD5C3]">
        <div className="bg-[#FAF8F5] p-8 md:p-14">
          <p className="test2mbb-eyebrow">{content.qualityCompliance.quality.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl md:text-3xl text-[#1C1C1C] leading-snug">
            {content.qualityCompliance.quality.title}
          </h2>
          <p className="text-[14px] text-[#6E6B62] mt-3 leading-relaxed">
            {content.qualityCompliance.quality.lede}
          </p>
          <ul className="mt-6 space-y-3 p-0">
            {content.qualityCompliance.quality.list.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-[13.5px] text-[#1C1C1C] items-center">
                <span className="w-5 h-5 rounded-full bg-[#8C4723]/10 text-[#8C4723] flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FAF8F5] p-8 md:p-14">
          <p className="test2mbb-eyebrow">{content.qualityCompliance.compliance.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl md:text-3xl text-[#1C1C1C] leading-snug">
            {content.qualityCompliance.compliance.title}
          </h2>
          <p className="text-[14px] text-[#6E6B62] mt-3 leading-relaxed">
            {content.qualityCompliance.compliance.lede}
          </p>
          <ul className="mt-6 space-y-3 p-0">
            {content.qualityCompliance.compliance.list.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-[13.5px] text-[#1C1C1C] items-center">
                <span className="w-5 h-5 rounded-full bg-[#8C4723]/10 text-[#8C4723] flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============================================================
          MÓDULO NDA: CONFIDENCIALIDAD Y PROTECCIÓN DE PI
          ============================================================ */}
      <section className="py-14 md:py-18 bg-[#12241B] text-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white/5 border border-white/15 p-8 md:p-10 rounded-2xl">
            <div className="w-16 h-16 border-2 border-[#FDA377] rounded-full flex items-center justify-center shrink-0 bg-[#FDA377]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FDA377" strokeWidth="1.8">
                <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h3 className="font-serif-title font-semibold text-xl md:text-2xl text-white">
                  {content.nda.title}
                </h3>
                <span className="font-nav-tag text-[10px] text-[#FDA377] border border-[#FDA377]/40 bg-[#FDA377]/10 px-3 py-0.5 rounded-full font-bold">
                  {content.nda.badge}
                </span>
              </div>
              <p className="text-[14px] text-[#C9D3CB] leading-relaxed max-w-2xl">
                {content.nda.desc}
              </p>
            </div>
            <a
              href="#quiz"
              className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded transition shrink-0"
            >
              {isEn ? "Request NDA Terms →" : "Solicitar Acuerdo NDA →"}
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRUEBA SOCIAL (SOCIAL PROOF)
          ============================================================ */}
      <section id="social-proof" className="py-20 md:py-24 bg-[#EFE7D6]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.proof.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[32px] leading-tight max-w-[760px] text-[#1C1C1C] mb-10">
            {content.proof.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {content.proof.cards.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-nav-tag text-[10px] text-[#8C4723] font-bold uppercase tracking-wider block mb-2">
                  {card.tag}
                </span>
                <h3 className="font-serif-title font-semibold text-[16px] text-[#1C1C1C] leading-snug">
                  {card.h3}
                </h3>
                <p className="text-[12.5px] text-[#6E6B62] mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ POR CATEGORÍAS (PREGUNTAS FRECUENTES)
          ============================================================ */}
      <section className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="test2mbb-eyebrow">{content.faq.eyebrow}</p>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C] mb-10">
            {content.faq.title}
          </h2>

          <div className="space-y-6">
            {content.faq.blocks.map((block, bIdx) => (
              <div key={bIdx} className="border-b border-[#DCD5C3] pb-4">
                <span className="font-nav-tag text-[11.5px] text-[#8C4723] font-bold uppercase tracking-wider block mb-2">
                  {block.category}
                </span>
                {block.items.map((item, iIdx) => (
                  <details
                    key={iIdx}
                    className="group border-t border-[#DCD5C3]/70 py-4 cursor-pointer"
                  >
                    <summary className="font-serif-title font-semibold text-[17px] text-[#1C1C1C] flex justify-between items-center select-none list-none">
                      <span>{item.q}</span>
                      <span className="font-serif-title text-xl text-[#8C4723] ml-2 group-open:hidden">+</span>
                      <span className="font-serif-title text-xl text-[#8C4723] ml-2 hidden group-open:inline">–</span>
                    </summary>
                    <p className="mt-3 text-[14px] text-[#6E6B62] max-w-[700px] leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA & CAL.COM BOOKING (LLAMADA TÉCNICA DE 30 MINUTOS)
          ============================================================ */}
      <section id="cta" className="py-20 md:py-28 bg-[#12241B] text-white text-center">
        <div className="max-w-[1160px] mx-auto px-6">
          <span className="font-nav-tag text-[#FDA377] font-semibold text-xs tracking-widest uppercase block mb-3">
            {content.finalCta.eyebrow}
          </span>
          <h2 className="font-serif-title font-semibold text-2xl sm:text-3xl md:text-[42px] leading-tight max-w-[640px] mx-auto text-white">
            {content.finalCta.title}
          </h2>
          <p className="text-[15.5px] text-[#C9D3CB] max-w-[560px] mx-auto my-6 leading-relaxed">
            {content.finalCta.lede}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a
              href="#cal-inline-test2mbb"
              className="bg-[#8C4723] hover:bg-[#a6562b] text-white font-semibold text-xs md:text-sm uppercase tracking-widest py-4 px-8 rounded transition shadow-lg"
            >
              {content.finalCta.btnCall}
            </a>
            <a
              href="#quiz"
              className="border border-white/50 hover:border-white text-white font-semibold text-xs md:text-sm uppercase tracking-widest py-4 px-8 rounded transition"
            >
              {content.finalCta.btnDetails}
            </a>
          </div>

          {/* Cal.com Embed Inline (30 Min) */}
          <div className="bg-white rounded-xl p-2 max-w-4xl mx-auto shadow-2xl overflow-hidden border border-white/20">
            <div
              id="cal-inline-test2mbb"
              style={{ width: "100%", height: "100%", minHeight: "560px", overflow: "scroll" }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
}
