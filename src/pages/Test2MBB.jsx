import React, { useState, useEffect, useRef } from "react";
import SEO from "../components/SEO";

export default function Test2MBB({ lang = "es", setPage }) {
  // Active route preloaded from §5.4 interaction
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizData, setQuizData] = useState({
    route: "",
    stage: "",
    market: "",
    name: "",
    company: "",
    email: "",
    lada: "+52",
    phone: "",
    volume: "",
    tequilaType: "",
    assets: "",
    timeline: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // { score: number, assignedTo: string, time: string }
  const [errorMessage, setErrorMessage] = useState("");

  // Inside Casa Loy active station (0 to 7)
  const [activeInside, setActiveInside] = useState(0);

  // Cal.com Embed Loader
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
        elementOrSelector: "#cal-inline-test2mbb",
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
            brandColor: "#B5651D"
          }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    }
  }, []);

  // Content dictionary (EN / ES)
  const isEn = lang === "en";

  const content = {
    hero: {
      badge: "§5.1 · Hero B2B + Trust Bar",
      h1: isEn ? (
        <>Private Label Tequila Manufacturing in Mexico.<br />Your tequila starts in Los Altos de Jalisco.</>
      ) : (
        <>Maquila de Tequila de Marca Privada en México.<br />Tu tequila comienza en Los Altos de Jalisco.</>
      ),
      secondary: isEn ? '"Your vision. Our expertise."' : '"Tu visión. Nuestra experiencia."',
      sub: isEn
        ? "A family-owned NOM 1633 distillery built for founders, existing brands, and distributors ready to build with a real origin behind them."
        : "Una destilería familiar NOM 1633 concebida para fundadores, marcas existentes y distribuidores listos para construir con un origen real detrás.",
      ctaStart: isEn ? "Start My Project →" : "Iniciar mi proyecto →",
      ctaCall: isEn ? "Book a Technical Call" : "Agendar llamada técnica",
      specTracking: "Tracking: hero_start_project_click · hero_book_call_click · scroll_25",
      specWarn: isEn 
        ? "Do not open with 'Your vision. Our expertise.' as H1 — only as secondary phrase (already applied above)"
        : "No abrir con 'Your vision. Our expertise.' como H1 — solo como frase secundaria (ya aplicado arriba)"
    },
    trust: isEn ? [
      "NOM 1633", "Los Altos de Jalisco", "Family-owned",
      "Agave roots since 1992", "Batch control", "Export coordination"
    ] : [
      "NOM 1633", "Los Altos de Jalisco", "Empresa familiar",
      "Raíces agaveras desde 1992", "Control por lotes", "Coordinación de exportación"
    ],
    why: {
      tag: "§5.2",
      eyebrow: isEn ? "Why Casa Loy" : "¿Por qué Casa Loy?",
      title: isEn
        ? "A family-owned tequila producer in Los Altos de Jalisco."
        : "Un productor de tequila familiar en Los Altos de Jalisco.",
      cards: isEn ? [
        { wk: "Origin", h3: "NOM 1633, Los Altos de Jalisco", anchor: "#agave-supply" },
        { wk: "Structure", h3: "Family-owned, three generations", anchor: "#social-proof" },
        { wk: "Agave", h3: "Own cultivation since 1992", anchor: "#agave-supply" },
        { wk: "Team", h3: "Real people behind every project", anchor: "#social-proof" },
        { wk: "Infrastructure", h3: "Built for serious, growing projects", anchor: "#methods" },
        { wk: "Quality", h3: "Batch control on every production", anchor: "#quality-compliance" }
      ] : [
        { wk: "Origen", h3: "NOM 1633, Los Altos de Jalisco", anchor: "#agave-supply" },
        { wk: "Estructura", h3: "Familiar, tres generaciones", anchor: "#social-proof" },
        { wk: "Agave", h3: "Cultivo propio desde 1992", anchor: "#agave-supply" },
        { wk: "Equipo", h3: "Personas reales detrás de cada proyecto", anchor: "#social-proof" },
        { wk: "Infraestructura", h3: "Construido para proyectos serios en crecimiento", anchor: "#methods" },
        { wk: "Calidad", h3: "Control por lote en cada producción", anchor: "#quality-compliance" }
      ],
      specInteraction: isEn ? "Each card anchors to: origin, quality, compliance, team" : "Cada tarjeta ancla a: origin, quality, compliance, team",
      specWarn: isEn ? "Do not put Orbe XXI as protagonist nor corporate logos on top" : "No poner Orbe XXI como protagonista ni logos corporativos arriba"
    },
    inside: {
      tag: "§5.3",
      eyebrow: isEn ? "Inside Casa Loy" : "Dentro de Casa Loy",
      title: isEn ? "From agave to bottle." : "Del agave a la botella.",
      stations: isEn ? [
        { num: "01", name: "Agave", desc: "Selected Blue Weber agaves matured 6-7 years in Los Altos highlands." },
        { num: "02", name: "Cooking", desc: "Slow steam cooking preserving natural sugars and rich caramels." },
        { num: "03", name: "Milling", desc: "Gentle fiber shredding and traditional extraction of sweet agave honey." },
        { num: "04", name: "Fermentation", desc: "Temperature-controlled stainless steel vats with proprietary yeasts." },
        { num: "05", name: "Distillation", desc: "Double distillation in authentic copper pot stills and hybrid columns." },
        { num: "06", name: "Aging Barrels", desc: "Underground barrel cellar with American and French white oak casks." },
        { num: "07", name: "Lab", desc: "Continuous chemical and chromatographic validation on every batch." },
        { num: "08", name: "Bottling", desc: "High-precision automated bottling, manual inspection, and sealing." }
      ] : [
        { num: "01", name: "Agave", desc: "Agaves Blue Weber seleccionados y madurados 6-7 años en Los Altos." },
        { num: "02", name: "Cocción", desc: "Cocimiento lento al vapor preservando azúcares naturales y notas caramelizadas." },
        { num: "03", name: "Molienda", desc: "Desfibrado cuidadoso y extracción tradicional de mieles de agave puras." },
        { num: "04", name: "Fermentación", desc: "Tinas de acero inoxidable con control térmico y levaduras propias." },
        { num: "05", name: "Destilación", desc: "Doble destilación en alambiques de cobre tradicionales y columnas híbridas." },
        { num: "06", name: "Barricas", desc: "Cava subterránea con barricas de roble blanco americano y francés." },
        { num: "07", name: "Laboratorio", desc: "Verificación química y cromatográfica continua lote por lote." },
        { num: "08", name: "Envasado", desc: "Línea de embotellado de alta precisión, inspección visual y sellado." }
      ],
      specWarn: isEn ? "Do not display as machinery catalog or capacity figures as headlines" : "No mostrar como catálogo de maquinaria ni con números de capacidad como titulares"
    },
    solutions: {
      tag: "§5.4",
      eyebrow: isEn ? "Solutions" : "Rutas de solución",
      title: isEn ? "Choose the right production path." : "Elige la ruta de producción adecuada.",
      routes: isEn ? [
        {
          num: "01",
          title: "Private Label Tequila",
          desc: "Create or sell tequila under your own brand.",
          tag: "private_label"
        },
        {
          num: "02",
          title: "Contract Manufacturing / Maquila",
          desc: "Production for third parties under specification, with or without existing brand.",
          tag: "contract_manufacturing"
        },
        {
          num: "03",
          title: "Bulk Tequila Supply",
          desc: "Bulk tequila for bottlers, importers or distributors.",
          tag: "bulk_tequila"
        },
        {
          num: "04",
          title: "Co-packing / Bottling Services",
          desc: "Bottling, labeling or packaging for a third-party project.",
          tag: "copacking_bottling"
        },
        {
          num: "05",
          title: "Custom Profile Development",
          desc: "Development or adjustment of liquid profile.",
          tag: "custom_profile"
        }
      ] : [
        {
          num: "01",
          title: "Tequila de Marca Privada",
          desc: "Crea o vende tequila bajo tu propia marca comercial.",
          tag: "private_label"
        },
        {
          num: "02",
          title: "Maquila por Contrato",
          desc: "Producción para terceros bajo especificación, con o sin marca existente.",
          tag: "contract_manufacturing"
        },
        {
          num: "03",
          title: "Suministro de Tequila a Granel",
          desc: "Tequila a granel para envasadores, importadores o distribuidores.",
          tag: "bulk_tequila"
        },
        {
          num: "04",
          title: "Servicios de Envasado / Co-packing",
          desc: "Embotellado, etiquetado o acondicionamiento para proyectos de terceros.",
          tag: "copacking_bottling"
        },
        {
          num: "05",
          title: "Desarrollo de Perfil a la Medida",
          desc: "Desarrollo o calibración sensorial fina de tu perfil de líquido.",
          tag: "custom_profile"
        }
      ],
      closer: isEn ? (
        <>Can't find your exact model? <strong>We adapt to custom project requirements.</strong></>
      ) : (
        <>¿No encuentras tu modelo exacto? <strong>Nos adaptamos a los requerimientos específicos de tu proyecto.</strong></>
      ),
      specInteraction: isEn ? "Selecting route pre-loads answer into quiz and CRM tag" : "Al seleccionar ruta, precargar respuesta en quiz y etiqueta CRM",
      specWarn: isEn ? "Do not use '360° Solutions' as title — sounds generic" : "No usar 'Soluciones 360°' como título — suena genérico"
    },
    who: {
      tag: "§5.5",
      eyebrow: isEn ? "Who this is for" : "A quién va dirigido",
      title: isEn ? "Find the right path for your tequila project." : "Encuentra la ruta adecuada para tu proyecto tequilero.",
      cards: isEn ? [
        { tag: "Founders", h3: "Building a tequila brand from the ground up" },
        { tag: "Existing brands", h3: "Looking for a better production partner" },
        { tag: "Distributors / Importers", h3: "Entering tequila as a new category" },
        { tag: "Bulk buyers", h3: "Sourcing steady volume at defined profile" }
      ] : [
        { tag: "Fundadores", h3: "Construyendo una marca de tequila desde cero" },
        { tag: "Marcas existentes", h3: "Buscando un mejor socio de producción" },
        { tag: "Distribuidores / Importadores", h3: "Entrando al tequila como una nueva categoría" },
        { tag: "Compradores a granel", h3: "Abastecimiento constante con un perfil definido" }
      ],
      specWarn: isEn ? "Do not publish Profile A/B/C, BOFU/MOFU or internal jargon" : "No publicar Perfil A/B/C, BOFU/MOFU ni frases internas como 'marca quemada'"
    },
    stake: {
      tag: "§5.6",
      eyebrow: isEn ? "What's at stake" : "Lo que está en juego",
      title: isEn
        ? "Your tequila project carries real business risk. We help you reduce it."
        : "Tu proyecto de tequila conlleva un riesgo empresarial real. Te ayudamos a reducirlo.",
      rows: isEn ? [
        { num: "01", title: "Starting from zero", desc: "Entering a category you don't know yet." },
        { num: "02", title: "Switching producer", desc: "Making sure the next transition doesn't repeat the last problem." },
        { num: "03", title: "Scaling / distribution", desc: "Growing volume without losing consistency." },
        { num: "04", title: "Exporting", desc: "Adding tequila to an existing book of business the right way." }
      ] : [
        { num: "01", title: "Empezar desde cero", desc: "Entrar a una categoría que aún no conoces." },
        { num: "02", title: "Cambiar de productor", desc: "Asegurarse de que la próxima transición no repita el problema anterior." },
        { num: "03", title: "Escalamiento / distribución", desc: "Crecer volumen sin perder consistencia jamás." },
        { num: "04", title: "Exportación", desc: "Incorporar tequila a tu cartera de negocios de la forma correcta." }
      ]
    },
    quiz: {
      tag: "§5.7 · 8 pasos + lead score",
      eyebrow: isEn ? "Diagnosis" : "Diagnóstico",
      title: isEn ? "Where does your tequila project stand today?" : "¿En qué etapa se encuentra hoy tu proyecto de tequila?",
      sub: isEn
        ? "8-step diagnosis — captures route, stage, market, contact, volume, tequila type, assets ready, timeline."
        : "Diagnóstico de 8 pasos — captura ruta, etapa, mercado, contacto, volumen, tipo de tequila, recursos listos y tiempos.",
      btnStart: isEn ? "Start diagnosis →" : "Iniciar diagnóstico →",
      leadNote: isEn
        ? "LEAD SCORE → 70+ Luis (24h) · 45–69 Fernanda (24–48h) · 25–44 nurture email · <25 automated"
        : "LEAD SCORE → 70+ Luis (24h) · 45–69 Fernanda (24–48h) · 25–44 correo de seguimiento · <25 automatizado",
      stepLabels: isEn ? [
        "What are you looking for?",
        "What stage is your project in?",
        "What is your target market?",
        "Contact details",
        "Estimated volume",
        "Tequila type",
        "Assets ready",
        "Timeline & notes"
      ] : [
        "¿Qué estás buscando?",
        "¿En qué etapa está tu proyecto?",
        "¿Cuál es tu mercado objetivo?",
        "Datos de contacto",
        "Volumen estimado",
        "Tipo de tequila",
        "Recursos listos",
        "Tiempos y notas"
      ],
      specWarn: isEn ? "Do not start the site with the quiz or promise fixed price/dates from chatbot" : "No iniciar el sitio con el quiz ni prometer precio/fecha desde el chatbot"
    },
    process: {
      tag: "§5.8",
      eyebrow: isEn ? "Process" : "Proceso",
      title: isEn ? "From idea to production: a clear path before you commit." : "De la idea a la producción: una ruta clara antes de comprometerte.",
      steps: isEn ? [
        { num: "01", title: "Project diagnosis" },
        { num: "02", title: "Technical call" },
        { num: "03", title: "Product definition" },
        { num: "04", title: "Compliance path" },
        { num: "05", title: "Production & control" },
        { num: "06", title: "Shipment coordination" }
      ] : [
        { num: "01", title: "Diagnóstico del proyecto" },
        { num: "02", title: "Llamada técnica" },
        { num: "03", title: "Definición de producto" },
        { num: "04", title: "Ruta de cumplimiento" },
        { num: "05", title: "Producción y control" },
        { num: "06", title: "Coordinación de embarque" }
      ],
      specWarn: isEn ? "Do not commit exact turnaround times if not approved by operations" : "No comprometer tiempos exactos si no están aprobados por operación"
    },
    methods: {
      tag: "§5.9 · two-layer",
      eyebrow: isEn ? "Production, by result" : "Producción según resultado",
      title: isEn ? "The tequila profile your brand needs, and how we build it." : "El perfil de tequila que tu marca necesita y cómo lo construimos.",
      profiles: isEn ? [
        {
          num: "Profile 01",
          title: "Heritage / Ultra-Premium",
          bottom: "Stone mill, traditional oven, pot still."
        },
        {
          num: "Profile 02",
          title: "Premium Consistent",
          bottom: "Autoclave, precise control."
        },
        {
          num: "Profile 03",
          title: "Scalable Commercial",
          bottom: "Column still, high efficiency."
        },
        {
          num: "Profile 04",
          title: "Custom Signature",
          bottom: "Signature yeast, wine or whiskey barrels."
        }
      ] : [
        {
          num: "Perfil 01",
          title: "Herencia / Ultra-Premium",
          bottom: "Molino de piedra (tahona), horno tradicional de mampostería, alambique de cobre."
        },
        {
          num: "Perfil 02",
          title: "Premium Consistente",
          bottom: "Autoclave, control térmico de precisión."
        },
        {
          num: "Perfil 03",
          title: "Comercial Escalable",
          bottom: "Destilación en columna continua, máxima eficiencia."
        },
        {
          num: "Perfil 04",
          title: "Firma / De Autor",
          bottom: "Levaduras exclusivas, barricas de roble de vino o whisky."
        }
      ],
      specWarn: isEn ? "Do not present tahona/oven/autoclave/column as 4 equivalent methods — they are stages, not parallel options" : "No presentar tahona/horno/autoclave/columna como 4 métodos equivalentes — son etapas, no opciones paralelas"
    },
    agave: {
      tag: isEn ? "§5.10 · new section in this version" : "§5.10 · sección nueva en esta versión",
      eyebrow: isEn ? "Agave & supply" : "Agave y suministro",
      title: isEn ? "Your tequila brand starts before production — it starts with supply." : "Tu marca de tequila comienza antes de la producción — empieza con el suministro.",
      facts: isEn ? [
        { k: "Origin", v: "Los Altos de Jalisco, Ayotlán" },
        { k: "Since", v: "Agave roots since 1992" },
        { k: "Traceability", v: "Field-level knowledge, supply planning" }
      ] : [
        { k: "Origen", v: "Los Altos de Jalisco, Ayotlán" },
        { k: "Desde", v: "Raíces agaveras desde 1992" },
        { k: "Trazabilidad", v: "Conocimiento a nivel de campo, planeación de abasto" }
      ],
      specWarn: isEn ? "Do not use 'organic agave' as main claim unless certified — use 'agave roots since 1992'" : "No usar 'organic agave' como promesa principal si no está certificado — usar 'agave roots since 1992'"
    },
    qualityCompliance: {
      quality: {
        tag: "§5.11",
        eyebrow: isEn ? "Quality" : "Calidad",
        title: isEn ? "Batch-to-batch consistency your brand can defend." : "Consistencia lote tras lote que tu marca puede defender.",
        lede: isEn ? "Lab verification, defined parameters, batch review, traceability and client approval before shipping." : "Verificación de laboratorio, parámetros definidos, revisión de lote, trazabilidad y aprobación del cliente antes de embarcar.",
        list: isEn ? [
          "In-house lab, every batch",
          "Client approval before shipping",
          "Batch-to-batch traceability"
        ] : [
          "Laboratorio interno en cada lote",
          "Aprobación del cliente antes del embarque",
          "Trazabilidad completa lote a lote"
        ]
      },
      compliance: {
        tag: "§5.12",
        eyebrow: isEn ? "Compliance & export" : "Cumplimiento y exportación",
        title: isEn ? "We help coordinate compliance, not carry it alone." : "Ayudamos a coordinar el cumplimiento, no a cargarlo en solitario.",
        lede: isEn ? "We help coordinate the compliance and export documentation path with the right parties involved." : "Ayudamos a coordinar la ruta de cumplimiento y documentación de exportación con los actores clave involucrados.",
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
      tag: isEn ? "§5.12b · 🆕 NEW" : "§5.12b · 🆕 NUEVO",
      title: isEn ? "Your Brand. Your Project. Protected." : "Tu Marca. Tu Proyecto. Protegido.",
      desc: isEn
        ? "Your formula stays yours. Every project includes a confidentiality agreement, clear IP ownership terms, and controlled documentation — so your development process is protected from day one."
        : "Tu fórmula te pertenece. Cada proyecto incluye un acuerdo de confidencialidad (NDA), términos claros de propiedad intelectual y documentación controlada — para que tu proceso de desarrollo esté protegido desde el primer día.",
      badge: isEn ? "NDA available" : "NDA disponible"
    },
    proof: {
      tag: "§5.13",
      eyebrow: isEn ? "Proof, not promises" : "Evidencia, no promesas",
      title: isEn
        ? "Every project receives direct attention from the people involved in production, quality, compliance and commercial coordination."
        : "Cada proyecto recibe atención directa de las personas involucradas en producción, calidad, cumplimiento y coordinación comercial.",
      cards: isEn ? [
        { tag: "Attention", h3: "Direct attention from the team on every project" },
        { tag: "Process", h3: "Verified, traceable production process" },
        { tag: "Cases", h3: "Authorized case studies — coming soon" },
        { tag: "Testimonials", h3: "Client testimonials — published with permission only" }
      ] : [
        { tag: "Atención", h3: "Atención directa del equipo en cada proyecto" },
        { tag: "Proceso", h3: "Proceso de producción verificado y trazable" },
        { tag: "Casos", h3: "Casos de estudio autorizados — próximamente" },
        { tag: "Testimonios", h3: "Testimonios de clientes — publicados únicamente bajo permiso" }
      ],
      specWarn: isEn ? "Do not claim 'hundreds of brands' or client awards without written authorization" : "No presumir 'cientos de marcas' ni premios de clientes sin autorización escrita"
    },
    faq: {
      tag: isEn ? "§5.14 · +4 new questions" : "§5.14 · +4 preguntas nuevas",
      eyebrow: isEn ? "FAQ" : "Preguntas frecuentes",
      title: isEn ? "Straight answers, by intention." : "Respuestas claras, por intención.",
      blocks: [
        {
          category: isEn ? "Founders / Investors" : "Fundadores / Inversionistas",
          items: [
            {
              q: isEn ? "How do I start my own tequila brand?" : "¿Cómo inicio mi propia marca de tequila?",
              a: isEn ? "It starts with your liquid's character, target market, and budget range." : "Comienza definiendo el carácter de tu líquido, el mercado objetivo y el rango de presupuesto.",
              isNew: false
            },
            {
              q: isEn ? "Who owns my formula?" : "¿Quién es el dueño de mi fórmula?",
              a: isEn ? "You do. Every project includes a confidentiality agreement and clear IP ownership terms." : "Tú. Cada proyecto incluye un acuerdo de confidencialidad y términos claros de propiedad intelectual.",
              isNew: true
            },
            {
              q: isEn ? "Can I visit the distillery?" : "¿Puedo visitar la destilería?",
              a: isEn ? "Yes. We welcome serious project visits — seeing the process firsthand is often the fastest way to know if we're the right fit." : "Sí. Recibimos visitas para proyectos serios — ver el proceso en persona es a menudo la forma más rápida de confirmar si somos el socio adecuado.",
              isNew: true
            }
          ]
        },
        {
          category: isEn ? "Existing brands" : "Marcas existentes",
          items: [
            {
              q: isEn ? "Can I switch producers without interrupting inventory?" : "¿Puedo cambiar de productor sin interrumpir mi inventario?",
              a: isEn ? "Yes — we map your timeline first, then build production around it." : "Sí — primero mapeamos tu cronograma de existencias y luego planificamos la producción en torno a él.",
              isNew: false
            },
            {
              q: isEn ? "Can you produce exclusively for my brand?" : "¿Pueden producir exclusivamente para mi marca?",
              a: isEn ? "Yes — exclusivity is part of the same protected development structure covered by your confidentiality agreement." : "Sí — la exclusividad forma parte de la misma estructura de desarrollo protegido cubierta por tu acuerdo de confidencialidad.",
              isNew: true
            }
          ]
        },
        {
          category: isEn ? "Bulk buyers" : "Compradores a granel",
          items: [
            {
              q: isEn ? "Does Casa Loy offer bulk tequila?" : "¿Ofrece Casa Loy tequila a granel?",
              a: isEn ? "Yes — bulk supply with a consistent, defined profile." : "Sí — suministro a granel con un perfil consistente y definido.",
              isNew: false
            },
            {
              q: isEn ? "Can I use my own bottle?" : "¿Puedo usar mi propia botella?",
              a: isEn ? "Yes. We can work with a bottle you've already sourced, or coordinate sourcing as part of your project." : "Sí. Podemos trabajar con una botella que ya tengas seleccionada o coordinar la proveeduría como parte de tu proyecto.",
              isNew: true
            }
          ]
        },
        {
          category: isEn ? "Distributors / Importers" : "Distribuidores / Importadores",
          items: [
            {
              q: isEn ? "What documentation is needed to export from Mexico?" : "¿Qué documentación se necesita para exportar desde México?",
              a: isEn ? "CRT export certificate, commercial invoice, certificate of origin, and TTB label approval for the U.S." : "Certificado de exportación del CRT, factura comercial, certificado de origen y aprobación de etiqueta TTB para EE. UU.",
              isNew: false
            }
          ]
        },
        {
          category: isEn ? "Compliance" : "Cumplimiento normativo",
          items: [
            {
              q: isEn ? "What does NOM 1633 mean for a tequila brand?" : "¿Qué significa NOM 1633 para una marca de tequila?",
              a: isEn ? "It confirms the distillery is authorized under Mexico's denomination-of-origin standard." : "Confirma que la destilería está debidamente autorizada y registrada ante el Consejo Regulador del Tequila (CRT) bajo la norma oficial mexicana de denominación de origen.",
              isNew: false
            }
          ]
        }
      ],
      specWarn: isEn ? "Do not mix final consumer FAQ inside this B2B landing page" : "No mezclar FAQ de consumidor final dentro de esta landing B2B"
    },
    finalCta: {
      tag: isEn ? "§5.14 · Final CTA" : "§5.14 · CTA final",
      eyebrow: isEn ? "Next step" : "Siguiente paso",
      title: isEn ? "Book a 20-minute technical video call." : "Agenda una videollamada técnica de 20 minutos.",
      lede: isEn
        ? "No commitment. No sales pitch. A real conversation about whether your project is the right fit for what we do here."
        : "Sin compromisos ni discursos de ventas. Una conversación técnica real para evaluar si tu proyecto encaja con lo que hacemos aquí.",
      btnCall: isEn ? "Book a Technical Call →" : "Agendar llamada técnica →",
      btnDetails: isEn ? "Send Project Details" : "Enviar detalles del proyecto"
    },
    footerNote: "CASA LOY TEQUILERA — GUÍA EJECUTABLE v2 · NOM 1633 · BASADO EN LA GUÍA EJECUTABLE INTEGRAL + INTEGRACIONES NDA/FAQ/CASO/ACEVES"
  };

  // Route select handler
  const handleSelectRoute = (route) => {
    setSelectedRoute(route.tag);
    setQuizData((prev) => ({ ...prev, route: route.title }));
    setQuizActive(true);
    const quizEl = document.getElementById("quiz");
    if (quizEl) {
      quizEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate Lead Score & Executive
  const calculateLeadScore = (data) => {
    let score = 20; // base

    // Stage
    if (data.stage.includes("Existing") || data.stage.includes("Existente") || data.stage.includes("Distributor") || data.stage.includes("Distribuidor")) {
      score += 25;
    } else if (data.stage.includes("Formula") || data.stage.includes("Registrada")) {
      score += 15;
    } else {
      score += 5;
    }

    // Volume
    if (data.volume.includes("25,000") || data.volume.includes("Bulk") || data.volume.includes("Granel")) {
      score += 30;
    } else if (data.volume.includes("5,000")) {
      score += 20;
    } else if (data.volume.includes("1,000")) {
      score += 10;
    } else {
      score += 5;
    }

    // Assets ready
    if (data.assets.includes("Trademark") || data.assets.includes("Marca") || data.assets.includes("Licenses") || data.assets.includes("Licencias")) {
      score += 15;
    }

    // Timeline
    if (data.timeline.includes("Immediate") || data.timeline.includes("Inmediato") || data.timeline.includes("30 days")) {
      score += 10;
    }

    let assignedTo = "Automated System";
    let time = "Instant / Email";

    if (score >= 70) {
      assignedTo = "Luis (Dirección Comercial / Operaciones)";
      time = isEn ? "Priority response within 24 hours" : "Respuesta prioritaria en menos de 24 horas";
    } else if (score >= 45) {
      assignedTo = "Fernanda (Atención a Cuentas B2B)";
      time = isEn ? "Response within 24–48 hours" : "Respuesta técnica en 24 a 48 horas";
    } else if (score >= 25) {
      assignedTo = "Fernanda / Nurture Team";
      time = isEn ? "Nurture sequence & technical dossier" : "Dossier técnico y correo de seguimiento";
    } else {
      assignedTo = isEn ? "Automated Information Pack" : "Paquete informativo automatizado";
      time = isEn ? "Instant dispatch" : "Envío inmediato";
    }

    return { score, assignedTo, time };
  };

  // Submit diagnosis
  const handleQuizSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!quizData.name || !quizData.email || !quizData.phone) {
      setErrorMessage(isEn ? "Please complete required fields (Name, Email, Phone)." : "Por favor completa los campos obligatorios (Nombre, Correo, Teléfono).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const evaluation = calculateLeadScore(quizData);

    try {
      const payload = {
        name: quizData.name,
        company: quizData.company || "N/A",
        email: quizData.email,
        lada: quizData.lada || "+52",
        phone: quizData.phone,
        solution: quizData.route || "General Inquiry",
        objective: `${quizData.tequilaType || "N/A"} - Target: ${quizData.market || "N/A"} - Vol: ${quizData.volume || "N/A"}`,
        stage: quizData.stage || "Concept",
        lead_type: `Test2MBB Score: ${evaluation.score} - Assigned: ${evaluation.assignedTo}`,
        comments: `Assets: ${quizData.assets || "None"} | Timeline: ${quizData.timeline || "N/A"} | Notes: ${quizData.notes || "None"}`,
        origin: "casaloy.com/test2mbb"
      };

      const response = await fetch("/api/maquila", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn("API returned non-200, but proceeding with client success state.");
      }

      setQuizResult(evaluation);
    } catch (err) {
      console.warn("Submission error:", err);
      // Fallback show evaluation result
      setQuizResult(evaluation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="test2mbb-root font-sans antialiased text-[#1C1C1C] bg-[#F6F1E7]">
      <SEO page="test2mbb" lang={lang} />

      {/* Internal Scoped CSS for exact typography & color palette */}
      <style>{`
        .test2mbb-root {
          --agave: #1B3327;
          --agave-deep: #12241B;
          --sand: #F6F1E7;
          --sand-2: #EFE7D6;
          --copper: #B5651D;
          --gold: #E8B04B;
          --ink: #1C1C1C;
          --stone: #6E6B62;
          --stone-light: #8f8c81;
          --line: #DCD5C3;
          --line-dark: #2C4A38;
          --max: 1160px;
          --new: #3B6D11;
          --new-bg: #E9F1EA;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .test2mbb-root h1, 
        .test2mbb-root h2, 
        .test2mbb-root h3,
        .test2mbb-root .font-fraunces {
          font-family: 'Fraunces', Georgia, serif;
          letter-spacing: -0.01em;
        }
        .test2mbb-root .font-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        .test2mbb-wrap {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 32px;
        }
        .test2mbb-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--copper);
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .test2mbb-eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--copper);
          display: inline-block;
        }
        .test2mbb-spec-tag {
          position: absolute;
          top: 18px;
          right: 18px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: var(--stone-light);
          border: 1px solid var(--line);
          padding: 3px 8px;
          border-radius: 20px;
          background: rgba(255,255,255,.65);
          letter-spacing: .03em;
        }
        .test2mbb-on-dark .test2mbb-spec-tag {
          color: #9db3a5;
          border-color: var(--line-dark);
          background: rgba(0,0,0,.25);
        }
        .test2mbb-on-dark {
          background: var(--agave);
          color: #EDEBE0;
        }
        .test2mbb-on-dark .test2mbb-eyebrow {
          color: var(--gold);
        }
        .test2mbb-on-dark .test2mbb-eyebrow::before {
          background: var(--gold);
        }
        .test2mbb-on-dark h1,
        .test2mbb-on-dark h2,
        .test2mbb-on-dark h3 {
          color: #fff;
        }
        .test2mbb-on-dark p {
          color: #C9D3CB;
        }
        .test2mbb-spec-note {
          margin-top: 36px;
          border-top: 1px dashed var(--line);
          padding-top: 16px;
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .test2mbb-on-dark .test2mbb-spec-note {
          border-top-color: var(--line-dark);
        }
        .test2mbb-spec-note .sn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: var(--stone-light);
          max-width: 460px;
        }
        .test2mbb-on-dark .test2mbb-spec-note .sn {
          color: #7f9689;
        }
        .test2mbb-spec-note .sn b {
          color: var(--copper);
          display: block;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: .05em;
          font-size: 9.5px;
        }
        .test2mbb-on-dark .test2mbb-spec-note .sn b {
          color: var(--gold);
        }
        .test2mbb-spec-note .sn.warn b {
          color: #a6402f;
        }
        .test2mbb-new-badge {
          display: inline-block;
          margin-left: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: var(--new);
          border: 1px solid var(--new);
          padding: 1px 7px;
          border-radius: 10px;
          vertical-align: middle;
        }
        .test2mbb-faq-item summary::-webkit-details-marker {
          display: none;
        }
      `}</style>

      {/* 5.1 HERO + TRUST BAR */}
      <section className="relative py-16 md:py-24 test2mbb-on-dark overflow-hidden">
        {/* Agave Mark Background Watermark */}
        <svg
          className="absolute -right-20 -top-14 w-[380px] md:w-[520px] h-[380px] md:h-[520px] opacity-15 pointer-events-none"
          viewBox="0 0 200 200"
        >
          <g fill="none" stroke="#E8B04B" strokeWidth="0.6">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="66" />
            <circle cx="100" cy="100" r="40" />
            <path d="M100 10 L100 190 M10 100 L190 100 M35 35 L165 165 M165 35 L35 165" />
          </g>
        </svg>

        <div className="test2mbb-wrap relative z-10">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-[#E8B04B] border border-[#E8B04B]/40 px-3.5 py-1.5 rounded-full mb-6">
            {content.hero.badge}
          </div>

          <h1 className="font-fraunces font-semibold text-3xl sm:text-4xl md:text-[52px] leading-[1.1] max-w-[780px] text-white">
            {content.hero.h1}
          </h1>

          <p className="font-fraunces italic text-lg md:text-xl text-[#E8B04B] mt-4">
            {content.hero.secondary}
          </p>

          <p className="text-[17px] text-[#C9D3CB] max-w-[540px] my-6 leading-relaxed">
            {content.hero.sub}
          </p>

          <div className="flex flex-wrap gap-3.5 mt-8">
            <a
              href="#quiz"
              className="bg-[#E8B04B] hover:bg-[#f0c06a] text-[#12241B] font-semibold text-[14.5px] px-7 py-3.5 rounded-[3px] transition inline-block shadow-sm"
            >
              {content.hero.ctaStart}
            </a>
            <a
              href="#cta"
              className="border border-white/35 hover:border-white text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-[3px] transition inline-block"
            >
              {content.hero.ctaCall}
            </a>
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn">
              <b>Tracking</b>
              {content.hero.specTracking}
            </div>
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.hero.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="py-6 bg-[#EFE7D6] border-y border-[#DCD5C3]">
        <div className="test2mbb-wrap">
          <div className="flex flex-wrap justify-center items-center divide-y md:divide-y-0 md:divide-x divide-[#DCD5C3] text-center">
            {content.trust.map((item, idx) => (
              <span
                key={idx}
                className="font-mono text-[12.5px] text-[#1B3327] px-4 py-1.5 md:py-0 w-1/2 sm:w-auto font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5.2 WHY CASA LOY */}
      <section className="relative py-20 md:py-24 bg-[#F6F1E7]">
        <span className="test2mbb-spec-tag">{content.why.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.why.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.why.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {content.why.cards.map((card, idx) => (
              <a
                key={idx}
                href={card.anchor}
                className="group border border-[#DCD5C3] hover:border-[#B5651D] rounded-[4px] p-5 md:p-6 bg-white transition hover:shadow-md cursor-pointer block"
              >
                <div className="font-mono text-[10px] text-[#B5651D] uppercase tracking-wider group-hover:underline">
                  {card.wk}
                </div>
                <h3 className="font-fraunces font-semibold text-[16px] text-[#1C1C1C] mt-2 leading-snug">
                  {card.h3}
                </h3>
              </a>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn">
              <b>{isEn ? "Interaction" : "Interacción"}</b>
              {content.why.specInteraction}
            </div>
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.why.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.3 INSIDE CASA LOY */}
      <section className="relative py-20 md:py-24 test2mbb-on-dark" style={{ paddingBottom: "60px" }}>
        <span className="test2mbb-spec-tag">{content.inside.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.inside.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-white">
            {content.inside.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-[#2C4A38] mt-10 border border-[#2C4A38]">
            {content.inside.stations.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveInside(idx)}
                className={`p-6 min-h-[140px] flex flex-col justify-end transition cursor-pointer ${
                  activeInside === idx ? "bg-[#1B3327] ring-1 ring-[#E8B04B]" : "bg-[#12241B] hover:bg-[#152a20]"
                }`}
              >
                <div className="font-mono text-[10px] text-[#E8B04B] mb-1.5">{st.num}</div>
                <span className="text-[14px] text-white font-semibold">{st.name}</span>
                <p className="text-[11.5px] text-[#A2B5A8] mt-1 line-clamp-2">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.inside.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 RUTAS DE SOLUCIÓN (5) */}
      <section className="relative py-20 md:py-24 bg-[#F6F1E7]">
        <span className="test2mbb-spec-tag">{content.solutions.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.solutions.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.solutions.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-[1px] bg-[#DCD5C3] mt-10 border border-[#DCD5C3]">
            {content.solutions.routes.map((rt) => {
              const isSelected = selectedRoute === rt.tag;
              return (
                <div
                  key={rt.num}
                  onClick={() => handleSelectRoute(rt)}
                  className={`p-6 min-h-[220px] flex flex-col transition cursor-pointer ${
                    isSelected
                      ? "bg-white ring-2 ring-[#B5651D] shadow-md"
                      : "bg-[#F6F1E7] hover:bg-white"
                  }`}
                >
                  <div className="font-mono text-[10.5px] text-[#B5651D]">{rt.num}</div>
                  <h3 className="font-fraunces font-semibold text-[16px] my-3 leading-snug text-[#1C1C1C]">
                    {rt.title}
                  </h3>
                  <p className="text-[12.5px] text-[#6E6B62] flex-grow leading-relaxed">
                    {rt.desc}
                  </p>
                  <div className="mt-3">
                    <span className="font-mono text-[9.5px] text-[#8f8c81] bg-[#EFE7D6] px-2 py-0.5 rounded-full inline-block">
                      {rt.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[16.5px] font-fraunces italic text-[#1B3327] max-w-[700px] leading-relaxed">
            {content.solutions.closer}
          </p>

          <div className="test2mbb-spec-note">
            <div className="sn">
              <b>{isEn ? "Interaction" : "Interacción"}</b>
              {content.solutions.specInteraction}
            </div>
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.solutions.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 AUTOIDENTIFICACIÓN */}
      <section className="relative py-20 md:py-24 bg-[#EFE7D6]">
        <span className="test2mbb-spec-tag">{content.who.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.who.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.who.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {content.who.cards.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] p-6 rounded-[4px] bg-white transition hover:shadow-sm"
              >
                <span className="font-mono text-[10px] text-[#8f8c81] uppercase block">
                  {card.tag}
                </span>
                <h3 className="font-fraunces font-semibold text-[15.5px] mt-2.5 leading-snug text-[#1C1C1C]">
                  {card.h3}
                </h3>
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.who.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.6 PROBLEMAS QUE RESOLVEMOS */}
      <section className="relative py-20 md:py-24 bg-[#F6F1E7]">
        <span className="test2mbb-spec-tag">{content.stake.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.stake.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[680px] text-[#1C1C1C]">
            {content.stake.title}
          </h2>

          <div className="mt-10 border-t border-[#DCD5C3]">
            {content.stake.rows.map((row) => (
              <div
                key={row.num}
                className="grid grid-cols-[48px_1fr] md:grid-cols-[56px_1fr] gap-4 md:gap-6 py-5 border-b border-[#DCD5C3] items-start"
              >
                <span className="font-fraunces text-2xl text-[#B5651D] font-normal">
                  {row.num}
                </span>
                <div>
                  <h3 className="font-fraunces font-semibold text-[16px] text-[#1C1C1C]">
                    {row.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6E6B62] mt-1 leading-relaxed">
                    {row.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.7 QUIZ — 8 steps */}
      <section id="quiz" className="relative py-20 md:py-24 bg-[#EFE7D6]">
        <span className="test2mbb-spec-tag">{content.quiz.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.quiz.eyebrow}</p>

          <div className="mt-6 bg-[#1B3327] rounded-[6px] p-6 sm:p-10 text-white shadow-xl">
            {!quizActive && !quizResult ? (
              // Default View matching exact layout
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 md:gap-10 items-start">
                <div>
                  <h3 className="font-fraunces font-semibold text-xl sm:text-2xl text-white mb-2">
                    {content.quiz.title}
                  </h3>
                  {/* Progress Bar (8 segments) */}
                  <div className="flex gap-1 my-4">
                    <span className="flex-1 h-1 bg-[#E8B04B] rounded-full"></span>
                    {[...Array(7)].map((_, i) => (
                      <span key={i} className="flex-1 h-1 bg-white/15 rounded-full"></span>
                    ))}
                  </div>
                  <p className="text-[14px] text-[#C9D3CB] leading-relaxed">
                    {content.quiz.sub}
                  </p>

                  <button
                    onClick={() => setQuizActive(true)}
                    className="bg-[#E8B04B] hover:bg-[#f0c06a] text-[#12241B] font-semibold text-[14px] px-6 py-3 rounded-[3px] mt-5 transition inline-block cursor-pointer"
                  >
                    {content.quiz.btnStart}
                  </button>

                  <div className="mt-6 pt-3 border-t border-dashed border-white/15 font-mono text-[11.5px] text-[#9db3a5]">
                    {content.quiz.leadNote}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {content.quiz.stepLabels.map((lbl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuizStep(idx + 1);
                        setQuizActive(true);
                      }}
                      className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-[4px] p-3 text-left transition cursor-pointer text-[12px] text-white"
                    >
                      <span className="font-mono text-[#E8B04B] text-[9.5px] block mb-1">
                        0{idx + 1}/08
                      </span>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            ) : quizResult ? (
              // Results View with Lead Scoring assignment
              <div className="max-w-[640px] mx-auto text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#E8B04B]/20 border-2 border-[#E8B04B] flex items-center justify-center mx-auto mb-4 text-[#E8B04B]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-fraunces font-semibold text-2xl text-white mb-2">
                  {isEn ? "Project Diagnosis Received" : "Diagnóstico de Proyecto Recibido"}
                </h3>
                <div className="inline-block bg-[#12241B] border border-[#E8B04B]/40 px-4 py-1.5 rounded-full font-mono text-[12px] text-[#E8B04B] mb-4">
                  LEAD SCORE: {quizResult.score} / 100
                </div>
                <p className="text-[14px] text-[#C9D3CB] max-w-[500px] mx-auto mb-6">
                  {isEn ? "Assigned executive:" : "Responsable asignado:"}{" "}
                  <strong className="text-white">{quizResult.assignedTo}</strong>. {quizResult.time}.
                </p>

                <div className="bg-[#12241B] border border-white/15 rounded-[4px] p-4 text-left font-mono text-[12px] text-[#C9D3CB] space-y-1 mb-6">
                  <div><b>{isEn ? "Company:" : "Empresa:"}</b> {quizData.company || "N/A"}</div>
                  <div><b>{isEn ? "Route:" : "Ruta:"}</b> {quizData.route || "General"}</div>
                  <div><b>{isEn ? "Target Market:" : "Mercado:"}</b> {quizData.market || "N/A"}</div>
                  <div><b>{isEn ? "Volume:" : "Volumen:"}</b> {quizData.volume || "N/A"}</div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="#cta"
                    className="bg-[#E8B04B] hover:bg-[#f0c06a] text-[#12241B] font-semibold text-[14px] px-6 py-3 rounded-[3px] transition"
                  >
                    {isEn ? "Book Technical Call Now →" : "Agendar llamada técnica ahora →"}
                  </a>
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizActive(false);
                      setQuizStep(1);
                    }}
                    className="border border-white/30 hover:border-white text-white font-medium text-[13.5px] px-5 py-3 rounded-[3px] transition cursor-pointer"
                  >
                    {isEn ? "Reset Diagnosis" : "Reiniciar diagnóstico"}
                  </button>
                </div>
              </div>
            ) : (
              // Interactive 8-Step Form
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-white/15 mb-6">
                  <div>
                    <span className="font-mono text-[#E8B04B] text-[11px] block">
                      {isEn ? `Step 0${quizStep} of 08` : `Paso 0${quizStep} de 08`}
                    </span>
                    <h4 className="font-fraunces font-semibold text-lg text-white">
                      {content.quiz.stepLabels[quizStep - 1]}
                    </h4>
                  </div>
                  <button
                    onClick={() => setQuizActive(false)}
                    className="text-white/60 hover:text-white font-mono text-[11px] uppercase border border-white/20 px-2.5 py-1 rounded"
                  >
                    {isEn ? "Overview" : "Ver resumen"}
                  </button>
                </div>

                {/* Step 1: Route */}
                {quizStep === 1 && (
                  <div className="space-y-2">
                    {content.solutions.routes.map((rt) => (
                      <button
                        key={rt.tag}
                        onClick={() => {
                          setQuizData({ ...quizData, route: rt.title });
                          setQuizStep(2);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition flex justify-between items-center ${
                          quizData.route === rt.title
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        <span className="font-medium text-[14px]">{rt.title}</span>
                        <span className="font-mono text-[10px] text-[#E8B04B]">{rt.tag}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Stage */}
                {quizStep === 2 && (
                  <div className="space-y-2">
                    {[
                      isEn ? "Idea / Concept (< 6 months)" : "Idea / Concepto (< 6 meses)",
                      isEn ? "Formula & Brand Ready (Need distillery partner)" : "Fórmula y marca lista (Requiere destilería)",
                      isEn ? "Existing Brand (Switching producers for stability)" : "Marca existente (Cambio de productor por abasto/calidad)",
                      isEn ? "Established Distributor / Bulk Importer" : "Distribuidor o importador consolidado"
                    ].map((stg, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizData({ ...quizData, stage: stg });
                          setQuizStep(3);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition ${
                          quizData.stage === stg
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Market */}
                {quizStep === 3 && (
                  <div className="space-y-2">
                    {[
                      isEn ? "United States (USA)" : "Estados Unidos (EE. UU.)",
                      isEn ? "Mexico (Domestic market)" : "México (Mercado nacional)",
                      isEn ? "Europe & United Kingdom" : "Europa y Reino Unido",
                      isEn ? "Canada / Latin America / Global" : "Canadá / Latinoamérica / Global"
                    ].map((mkt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizData({ ...quizData, market: mkt });
                          setQuizStep(4);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition ${
                          quizData.market === mkt
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        {mkt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Contact */}
                {quizStep === 4 && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                        {isEn ? "Full Name *" : "Nombre Completo *"}
                      </label>
                      <input
                        type="text"
                        value={quizData.name}
                        onChange={(e) => setQuizData({ ...quizData, name: e.target.value })}
                        placeholder={isEn ? "Your Name" : "Tu Nombre"}
                        className="w-full bg-white/10 border border-white/20 rounded p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8B04B]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                        {isEn ? "Company / Brand Name" : "Empresa o Nombre de Marca"}
                      </label>
                      <input
                        type="text"
                        value={quizData.company}
                        onChange={(e) => setQuizData({ ...quizData, company: e.target.value })}
                        placeholder={isEn ? "Brand LLC" : "Tu Marca"}
                        className="w-full bg-white/10 border border-white/20 rounded p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8B04B]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                          {isEn ? "Email *" : "Correo Electrónico *"}
                        </label>
                        <input
                          type="email"
                          value={quizData.email}
                          onChange={(e) => setQuizData({ ...quizData, email: e.target.value })}
                          placeholder="tu@correo.com"
                          className="w-full bg-white/10 border border-white/20 rounded p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8B04B]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                          {isEn ? "Phone / WhatsApp *" : "Teléfono / WhatsApp *"}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={quizData.lada}
                            onChange={(e) => setQuizData({ ...quizData, lada: e.target.value })}
                            className="w-20 bg-white/10 border border-white/20 rounded p-2.5 text-white text-center"
                          />
                          <input
                            type="tel"
                            value={quizData.phone}
                            onChange={(e) => setQuizData({ ...quizData, phone: e.target.value })}
                            placeholder="33 1234 5678"
                            className="flex-1 bg-white/10 border border-white/20 rounded p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8B04B]"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!quizData.name || !quizData.email || !quizData.phone) {
                          setErrorMessage(isEn ? "Name, email and phone are required." : "Nombre, email y teléfono son obligatorios.");
                          return;
                        }
                        setErrorMessage("");
                        setQuizStep(5);
                      }}
                      className="bg-[#E8B04B] hover:bg-[#f0c06a] text-[#12241B] font-semibold text-[13.5px] px-6 py-2.5 rounded mt-2 cursor-pointer"
                    >
                      {isEn ? "Next: Estimated Volume →" : "Siguiente: Volumen Estimado →"}
                    </button>
                  </div>
                )}

                {/* Step 5: Volume */}
                {quizStep === 5 && (
                  <div className="space-y-2">
                    {[
                      isEn ? "Initial batch (< 1,000 Liters)" : "Lote inicial de prueba (< 1,000 Litros)",
                      isEn ? "1,000 – 5,000 Liters / order" : "1,000 a 5,000 Litros / pedido",
                      isEn ? "5,000 – 25,000 Liters / year" : "5,000 a 25,000 Litros / año",
                      isEn ? "Commercial bulk (> 25,000 Liters)" : "Volumen a granel comercial (> 25,000 Litros)"
                    ].map((vol, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizData({ ...quizData, volume: vol });
                          setQuizStep(6);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition ${
                          quizData.volume === vol
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 6: Tequila Type */}
                {quizStep === 6 && (
                  <div className="space-y-2">
                    {[
                      isEn ? "100% Blue Agave Blanco (Pure Terroir)" : "100% Agave Blanco (Puro Terroir)",
                      isEn ? "Aged Portfolio (Reposado, Añejo, Extra Añejo)" : "Portafolio Añejado (Reposado, Añejo, Extra Añejo)",
                      isEn ? "Cristalino (Filtered Smooth Expression)" : "Cristalino (Expresión suave filtrada)",
                      isEn ? "Custom Signature Profile / High Proof" : "Perfil de Autor / Alta Graduación"
                    ].map((tq, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizData({ ...quizData, tequilaType: tq });
                          setQuizStep(7);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition ${
                          quizData.tequilaType === tq
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        {tq}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 7: Assets Ready */}
                {quizStep === 7 && (
                  <div className="space-y-2">
                    {[
                      isEn ? "Registered Trademark & Brand Assets ready" : "Marca registrada y activos de diseño listos",
                      isEn ? "Bottle, label & packaging suppliers sourced" : "Botella, etiqueta e insumos ya cotizados",
                      isEn ? "Distribution channel / Import permit in place" : "Canal de distribución / Permiso de importación listo",
                      isEn ? "Starting from scratch — Full distillery guidance needed" : "Iniciando desde cero — Requiero asesoría integral"
                    ].map((ast, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizData({ ...quizData, assets: ast });
                          setQuizStep(8);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition ${
                          quizData.assets === ast
                            ? "bg-[#E8B04B]/20 border-[#E8B04B] text-white"
                            : "bg-white/5 hover:bg-white/10 border-white/15 text-[#C9D3CB]"
                        }`}
                      >
                        {ast}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 8: Timeline & Notes */}
                {quizStep === 8 && (
                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                        {isEn ? "Expected Timeline" : "Tiempos Estimados de Arranque"}
                      </label>
                      <select
                        value={quizData.timeline}
                        onChange={(e) => setQuizData({ ...quizData, timeline: e.target.value })}
                        className="w-full bg-[#12241B] border border-white/20 rounded p-2.5 text-white focus:outline-none focus:border-[#E8B04B]"
                      >
                        <option value="">{isEn ? "Select timeline..." : "Selecciona tiempo..."}</option>
                        <option value="Immediate (< 30 days)">{isEn ? "Immediate (< 30 days)" : "Inmediato (< 30 días)"}</option>
                        <option value="1 to 3 months">{isEn ? "1 to 3 months" : "1 a 3 meses"}</option>
                        <option value="3 to 6 months">{isEn ? "3 to 6 months" : "3 a 6 meses"}</option>
                        <option value="Exploring for future">{isEn ? "Exploring for future" : "Explorando a futuro"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[10.5px] uppercase text-[#E8B04B] block mb-1">
                        {isEn ? "Additional Project Details / Notes" : "Detalles Adicionales / Notas del Proyecto"}
                      </label>
                      <textarea
                        rows={3}
                        value={quizData.notes}
                        onChange={(e) => setQuizData({ ...quizData, notes: e.target.value })}
                        placeholder={isEn ? "Specific organoleptic notes, packaging preferences or questions..." : "Notas organolépticas específicas, preferencias de envasado o preguntas..."}
                        className="w-full bg-white/10 border border-white/20 rounded p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8B04B]"
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-[#ff7676] text-[13px]">{errorMessage}</p>
                    )}

                    <button
                      disabled={isSubmitting}
                      onClick={handleQuizSubmit}
                      className="bg-[#E8B04B] hover:bg-[#f0c06a] disabled:opacity-50 text-[#12241B] font-semibold text-[14px] px-7 py-3 rounded cursor-pointer transition w-full sm:w-auto"
                    >
                      {isSubmitting
                        ? (isEn ? "Evaluating Lead Score..." : "Calculando Lead Score...")
                        : (isEn ? "Submit & Calculate Score →" : "Enviar y Calcular Score →")}
                    </button>
                  </div>
                )}

                {/* Progress back / forward buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10 text-[12px] font-mono">
                  {quizStep > 1 ? (
                    <button
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="text-[#E8B04B] hover:underline"
                    >
                      ← {isEn ? "Previous Step" : "Paso Anterior"}
                    </button>
                  ) : <span />}
                  <span className="text-white/40">{quizStep} / 8</span>
                </div>
              </div>
            )}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.quiz.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.8 PROCESO DE TRABAJO */}
      <section className="relative py-20 md:py-24 test2mbb-on-dark">
        <span className="test2mbb-spec-tag">{content.process.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.process.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-white">
            {content.process.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {content.process.steps.slice(0, 4).map((st) => (
              <div
                key={st.num}
                className="bg-white/[0.05] border border-[#2C4A38] p-6 rounded-[4px]"
              >
                <span className="font-mono text-[#E8B04B] text-[10px] block">{st.num}</span>
                <h3 className="font-fraunces font-semibold text-[15.5px] text-white mt-2 leading-snug">
                  {st.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {content.process.steps.slice(4).map((st) => (
              <div
                key={st.num}
                className="bg-white/[0.05] border border-[#2C4A38] p-6 rounded-[4px]"
              >
                <span className="font-mono text-[#E8B04B] text-[10px] block">{st.num}</span>
                <h3 className="font-fraunces font-semibold text-[15.5px] text-white mt-2 leading-snug">
                  {st.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.process.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.9 MÉTODOS POR RESULTADO */}
      <section id="methods" className="relative py-20 md:py-24 bg-[#F6F1E7]">
        <span className="test2mbb-spec-tag">{content.methods.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.methods.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.methods.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {content.methods.profiles.map((pf, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] rounded-[4px] overflow-hidden bg-white flex flex-col justify-between"
              >
                <div className="p-5 border-b border-[#DCD5C3]">
                  <div className="font-mono text-[10px] text-[#B5651D] uppercase">
                    {pf.num}
                  </div>
                  <h3 className="font-fraunces font-semibold text-[16px] text-[#1C1C1C] mt-2 leading-snug">
                    {pf.title}
                  </h3>
                </div>
                <div className="p-4 text-[12px] text-[#6E6B62] bg-[#EFE7D6]">
                  {pf.bottom}
                </div>
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.methods.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.10 AGAVE Y SUMINISTRO */}
      <section id="agave-supply" className="relative py-20 md:py-24 bg-[#EFE7D6]">
        <span className="test2mbb-spec-tag">{content.agave.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.agave.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.agave.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mt-10">
            <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden border border-[#DCD5C3] bg-[#EFE7D6] shadow-sm">
              <img
                src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
                alt="Campos de Agave Casa Loy en Ayotlán"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/Jimado Agave Tequilana Weber.webp";
                }}
              />
              <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white font-mono text-[9.5px] px-2 py-0.5 rounded">
                NOM 1633 · Ayotlán, Jalisco
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {content.agave.facts.map((fc, idx) => (
                <div key={idx} className="border-l-2 border-[#B5651D] pl-4">
                  <div className="font-mono text-[10px] text-[#B5651D] uppercase tracking-wider">
                    {fc.k}
                  </div>
                  <div className="text-[14.5px] text-[#1C1C1C] font-semibold mt-0.5">
                    {fc.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.agave.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.11 + 5.12 QUALITY & COMPLIANCE */}
      <div id="quality-compliance" className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#DCD5C3] border-y border-[#DCD5C3]">
        <div className="bg-[#F6F1E7] p-8 md:p-12 relative">
          <span className="test2mbb-spec-tag">{content.qualityCompliance.quality.tag}</span>
          <p className="test2mbb-eyebrow">{content.qualityCompliance.quality.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl text-[#1C1C1C] leading-snug">
            {content.qualityCompliance.quality.title}
          </h2>
          <p className="text-[14px] text-[#6E6B62] mt-3 leading-relaxed">
            {content.qualityCompliance.quality.lede}
          </p>
          <ul className="mt-5 space-y-2 p-0">
            {content.qualityCompliance.quality.list.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 text-[13px] text-[#1C1C1C]">
                <span className="text-[#B5651D] font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#F6F1E7] p-8 md:p-12 relative">
          <span className="test2mbb-spec-tag">{content.qualityCompliance.compliance.tag}</span>
          <p className="test2mbb-eyebrow">{content.qualityCompliance.compliance.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl text-[#1C1C1C] leading-snug">
            {content.qualityCompliance.compliance.title}
          </h2>
          <p className="text-[14px] text-[#6E6B62] mt-3 leading-relaxed">
            {content.qualityCompliance.compliance.lede}
          </p>
          <ul className="mt-5 space-y-2 p-0">
            {content.qualityCompliance.compliance.list.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 text-[13px] text-[#1C1C1C]">
                <span className="text-[#B5651D] font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5.12b NDA */}
      <section className="p-0 bg-[#12241B]">
        <div className="test2mbb-wrap py-12 md:py-16">
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center bg-[#12241B] text-white">
            <span className="test2mbb-spec-tag" style={{ top: 0, right: 0, color: "#9db3a5", borderColor: "#2C4A38", background: "rgba(0,0,0,.25)" }}>
              {content.nda.tag}
            </span>
            <div className="w-14 h-14 border-[1.5px] border-[#E8B04B] rounded-full flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8B04B" strokeWidth="1.6">
                <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-fraunces font-semibold text-xl md:text-2xl text-white mb-2">
                {content.nda.title}
              </h3>
              <p className="text-[13.5px] text-[#C9D3CB] max-w-[620px] leading-relaxed">
                {content.nda.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[10px] text-[#E8B04B] border border-[#E8B04B]/35 px-3 py-1 rounded-full">
                {content.nda.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5.13 PRUEBA SOCIAL */}
      <section id="social-proof" className="relative py-20 md:py-24 bg-[#EFE7D6]">
        <span className="test2mbb-spec-tag">{content.proof.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.proof.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[32px] leading-tight max-w-[760px] text-[#1C1C1C]">
            {content.proof.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {content.proof.cards.map((card, idx) => (
              <div
                key={idx}
                className="border border-[#DCD5C3] p-6 rounded-[4px] bg-white transition hover:shadow-sm"
              >
                <span className="font-mono text-[10px] text-[#8f8c81] uppercase block">
                  {card.tag}
                </span>
                <h3 className="font-fraunces font-semibold text-[15.5px] mt-2.5 leading-snug text-[#1C1C1C]">
                  {card.h3}
                </h3>
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.proof.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.14 FAQ */}
      <section className="relative py-20 md:py-24 bg-[#F6F1E7]">
        <span className="test2mbb-spec-tag">{content.faq.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow">{content.faq.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[34px] leading-tight max-w-[640px] text-[#1C1C1C]">
            {content.faq.title}
          </h2>

          <div className="mt-10 space-y-6">
            {content.faq.blocks.map((block, bIdx) => (
              <div key={bIdx} className="border-b border-[#DCD5C3] pb-4">
                <div className="font-mono text-[11px] text-[#B5651D] uppercase tracking-wider mb-2">
                  {block.category}
                </div>
                {block.items.map((item, iIdx) => (
                  <details
                    key={iIdx}
                    className="test2mbb-faq-item group border-t border-[#DCD5C3] py-4"
                  >
                    <summary className="cursor-pointer font-fraunces font-semibold text-[15.5px] text-[#1C1C1C] flex justify-between items-center select-none">
                      <span>
                        {item.q}{" "}
                        {item.isNew && (
                          <span className="test2mbb-new-badge">NEW</span>
                        )}
                      </span>
                      <span className="font-fraunces text-xl text-[#B5651D] ml-2 group-open:hidden">+</span>
                      <span className="font-fraunces text-xl text-[#B5651D] ml-2 hidden group-open:inline">–</span>
                    </summary>
                    <p className="mt-2.5 text-[13.5px] text-[#6E6B62] max-w-[660px] leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </div>

          <div className="test2mbb-spec-note">
            <div className="sn warn">
              <b>{isEn ? "Don't do" : "No hacer"}</b>
              {content.faq.specWarn}
            </div>
          </div>
        </div>
      </section>

      {/* 5.14 FINAL CTA & CAL.COM BOOKING */}
      <section id="cta" className="relative py-20 md:py-28 test2mbb-on-dark text-center">
        <span className="test2mbb-spec-tag">{content.finalCta.tag}</span>
        <div className="test2mbb-wrap">
          <p className="test2mbb-eyebrow justify-center">{content.finalCta.eyebrow}</p>
          <h2 className="font-fraunces font-semibold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[640px] mx-auto text-white">
            {content.finalCta.title}
          </h2>
          <p className="text-[16px] text-[#C9D3CB] max-w-[560px] mx-auto my-6 leading-relaxed">
            {content.finalCta.lede}
          </p>

          <div className="flex flex-wrap justify-center gap-3.5 mb-10">
            <a
              href="#cal-inline-test2mbb"
              className="bg-[#E8B04B] hover:bg-[#f0c06a] text-[#12241B] font-semibold text-[14.5px] px-7 py-3.5 rounded-[3px] transition inline-block shadow-sm"
            >
              {content.finalCta.btnCall}
            </a>
            <a
              href="#quiz"
              className="border border-white/35 hover:border-white text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-[3px] transition inline-block"
            >
              {content.finalCta.btnDetails}
            </a>
          </div>

          {/* Cal.com Inline Scheduler */}
          <div className="mt-8 bg-white rounded-lg p-2 max-w-4xl mx-auto shadow-2xl overflow-hidden border border-white/20">
            <div
              id="cal-inline-test2mbb"
              style={{ width: "100%", height: "100%", minHeight: "560px", overflow: "scroll" }}
            ></div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE / SPEC BANNER */}
      <footer className="py-8 bg-[#EFE7D6] text-center border-t border-[#DCD5C3]">
        <div className="test2mbb-wrap">
          <p className="font-mono text-[11px] text-[#8f8c81] tracking-tight">
            {content.footerNote}
          </p>
        </div>
      </footer>
    </div>
  );
}
