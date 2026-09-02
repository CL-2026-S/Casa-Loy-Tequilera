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
      heroSub: "Destilería integrada con NOM 1633, respaldada por Grupo Orbe XXI con más de 60 años de trayectoria empresarial, 3,600 hectáreas de agave propio y 13.5 millones de litros de capacidad anual.",
      heroBtnStart: "Iniciar Diagnóstico B2B",
      heroBtnCall: "Reservar Llamada Técnica",
      
      trustNom: "NOM 1633 CRT",
      trustRegion: "Ayotlán · Los Altos de Jalisco",
      trustStructure: "Grupo Orbe XXI (60+ Años)",
      trustRoots: "3,600 Has. / 10.8M Agaves",
      trustControl: "13.5M L / Año Capacidad",
      trustExport: "1.2M L Cava Barricas",
      trustAdditiveFree: "Certificado 100% Additive Free",

      // Respaldo Institucional Grupo Orbe XXI (PDF pág. 3-4)
      groupOverTitle: "Respaldo Corporativo & Trayectoria",
      groupTitle: "ORBE XXI GROUP: Más de 60 años de solidez institucional.",
      groupDesc: "Tu marca de tequila no depende de intermediarios vulnerables ni de productores improvisados. Detrás de Casa Loy Tequilera opera Grupo Orbe XXI, un consorcio multinacional con más de seis décadas de experiencia agroindustrial, presencia en América, Europa y Asia, y solvencia garantizada.",
      groupPillars: [
        { metric: "60+ Años", title: "Legado Empresarial", desc: "Grupo corporativo consolidado con liderazgo comprobado en agroindustria, alimentos y comercio exterior." },
        { metric: "2,900+", title: "Colaboradores Globales", desc: "Fuerza operativa y técnica internacional con estándares de gobierno corporativo de clase mundial." },
        { metric: "Desde 1992", title: "Especialistas en Agave (TeknoAgrox)", desc: "Más de tres décadas cultivando, seleccionando y perfeccionando la genética del Agave Tequilana Weber azul." },
        { metric: "Nutriagaves (2003)", title: "Presencia en USA, Europa & Asia", desc: "Líder global en jarabe e inulina de agave orgánico, con cadenas logísticas y certificaciones internacionales activas." }
      ],
      groupTequileraCard: {
        overtitle: "División Tequilera del Consorcio",
        title: "Casa Loy Tequilera — Fundada en 2019",
        desc: "Creada para integrar el control total de la cadena de valor: desde nuestras 3,600 hectáreas de agave propio hasta una destilería de vanguardia con capacidad de 13.5 millones de litros anuales y cava de añejamiento de 1.2M L."
      },
      groupSynergies: ["Casa Loy Tequilera", "Nutriagaves Group", "TeknoAgrox", "Loydeal", "OMEX Alimentaria", "IPASA", "PAOSA"],

      whyTitle: "Una destilería de clase mundial en Los Altos de Jalisco.",
      whyCards: [
        { wk: "Origen", title: "NOM 1633, Ayotlán, Jalisco", highlight: true, metric: "1633" },
        { wk: "Respaldo", title: "Grupo Orbe XXI: 60+ años, 2,900 colaboradores", dark: true },
        { wk: "Agave Propio", title: "3,600 Has. y 10.8M agaves en inventario", metric: "3,600 Has." },
        { wk: "Equipo Técnico", title: "Atención directa de maestros tequileros e ingenieros" },
        { wk: "Infraestructura", title: "13.5M L destilación anual y 1.2M L en cava de barricas", highlight: true, span2: true },
        { wk: "Laboratorio", title: "Tasting Lab profesional y cromatografía in-house lote a lote" }
      ],

      // World-Class Infrastructure & Capacities (PDF pág. 11-18)
      infraOverTitle: "Infraestructura Industrial Auditada",
      infraTitle: "Capacidades instaladas para proyectos de cualquier escala.",
      infraDesc: "Nuestra planta en Ayotlán combina la destilación artesanal en alambiques de cobre y extracción en tahona ancestral con tecnología europea continua de alta escala, respaldada por suministro propio de agua de pozo profundo.",
      infraCards: [
        { metric: "240 Tons", title: "Cocción Tradicional", desc: "4 hornos de mampostería (60t cada uno) para hidrólisis lenta al vapor de las piñas de agave." },
        { metric: "80 Tons", title: "Autoclaves de Acero", desc: "2 autoclaves de acero inoxidable (40t cada una) para cocción rápida y preservación de notas frescas." },
        { metric: "200tn / 500k L", title: "Sistemas de Extracción", desc: "200 tons/día extracción verde + Tahona de piedra volcánica (500,000 L/año) y molino de rodillos." },
        { metric: "4.5M Litros", title: "Alambiques de Cobre", desc: "Destilación artesanal en alambiques con serpentín de cobre: 15,000 L/día a 55° Alc. Vol." },
        { metric: "9M Litros", title: "Columnas Europeas", desc: "Destilación continua automatizada: 30,000 L/día a 55° Alc. Vol. para marcas de alto volumen." },
        { metric: "1.2M Litros", title: "Cava de Barricas", desc: "Roble Americano Virgen, Barricas de Bourbon y Roble Francés en cava climatizada." },
        { metric: "1.3M Litros", title: "Tanques de Acero Inox.", desc: "Almacenamiento y estabilización de producto terminado con control de temperatura." },
        { metric: "2,000 Pallets", title: "Bodega Logística", desc: "1,000 tarimas para insumos secos (botellas/cajas) + 1,000 tarimas para producto terminado exportable." }
      ],
      infraWater: {
        title: "Agua de Pozo Profundo Propio",
        desc: "Extracción directa en sitio que garantiza máxima pureza fisicoquímica y balance mineral constante en cada fermentación y dilución de ensamble."
      },

      insideTitle: "De la tierra a la botella: Nuestro Proceso Integral.",
      insideSteps: [
        { num: "01", name: "Agave Propio", desc: "3,600 Hectáreas propias y más de 10.8 millones de plantas en Jalisco, Michoacán y Guanajuato. Jima selectiva con alta concentración de azúcares reductores totales (ART) y certificación orgánica.", img: "/Piñas de Agave Tequilana Weber.webp" },
        { num: "02", name: "Cocción (2 Métodos)", desc: "Flexibilidad total: 4 hornos de mampostería tradicionales (240 tons total a vapor lento) o 2 autoclaves rápidas de acero (80 tons total) que maximizan el rendimiento y frescura.", img: "/Agave cocido.webp" },
        { num: "03", name: "Extracción (3 Métodos)", desc: "3 sistemas a elegir: Tahona ancestral de piedra volcánica (500,000 L/año), molino de rodillos/tornillo noble sin machacar fibras amargas, o sistema de difusor para alta escala.", img: "/Tahona Agave Molienda.webp" },
        { num: "04", name: "Fermentación (2 Métodos)", desc: "Fermentación lenta al aire libre en tinas abiertas de acero inoxidable o fermentación técnica en tanques cerrados con control de temperatura y levaduras exclusivas de la casa.", img: "/Fermentación.webp" },
        { num: "05", name: "Destilación (2 Métodos)", desc: "Alambiques tradicionales con serpentín de cobre (15,000 L/día a 55° · 4.5M L/año) o columnas europeas continuas automatizadas (30,000 L/día · 9M L/año). Agua de pozo profundo propio.", img: "/Destilación.webp" },
        { num: "06", name: "Cava de Barricas", desc: "Capacidad de 1.2 Millones de Litros en cava subterránea climatizada con humedad relativa controlada. Crianza en Roble Americano Virgen, Barricas de Bourbon y Roble Francés.", img: "/Cava de Añejamiento.webp" },
        { num: "07", name: "Tasting Lab & Control Químico", desc: "Cabinas sensoriales de cata profesional y laboratorio fisicoquímico in-house con cromatografía de gases para certificar perfiles 100% Additive Free y cumplimiento NOM-006 / TTB.", img: "/Laboratorio.webp" },
        { num: "08", name: "Envasado & QA", desc: "Línea de envasado con triple punto de aseguramiento de calidad: llenado automatizado, etiquetado de alta precisión e inspección visual en mesa lumínica botella por botella.", img: "/Embotellado 2.webp" }
      ],

      solutionsTitle: "Elige la ruta de producción adecuada.",
      solutions: [
        { num: "01", title: "Tequila de Marca Propia", desc: "Crea, envasa y comercializa tequila bajo tu propia marca desde cero.", tag: "private_label" },
        { num: "02", title: "Maquila / Producción por Contrato", desc: "Producción a la medida bajo tus especificaciones y fórmulas requeridas.", tag: "contract_manufacturing" },
        { num: "03", title: "Tequila a Granel", desc: "Suministro de volumen constante para embotelladoras, importadores o distribuidores.", tag: "bulk_tequila" },
        { num: "04", title: "Servicio de Envasado y Co-packing", desc: "Embotellado, etiquetado y embalaje para proyectos que ya tienen líquido o botellas.", tag: "copacking_bottling" },
        { num: "05", title: "Desarrollo de Perfil de Autor", desc: "Ajuste de perfiles organolépticos exclusivos guiado por nuestros maestros tequileros.", tag: "custom_profile" }
      ],

      // Categorías y Clases Oficiales (PDF pág. 9-10)
      catOverTitle: "Marco Regulatorio Oficial NOM-006",
      catTitle: "Categorías y Clases Oficiales de Tequila.",
      catDesc: "Diseñamos y envasamos perfiles en cualquiera de las categorías y clases reconocidas por la legislación mexicana y el Consejo Regulador del Tequila, adaptándonos al paladar y posicionamiento de tu mercado meta.",
      categories: [
        { title: "Tequila 100% Puro de Agave", desc: "Elaborado exclusivamente a partir de los azúcares del Agave Tequilana Weber variedad azul cultivado dentro de la zona de Denominación de Origen. Debe ser envasado de origen dentro de México.", badge: "NOM-006 Exclusivo" },
        { title: "Tequila (Mixto)", desc: "Elaborado con un mínimo de 51% de azúcares de agave azul y hasta 49% de otros azúcares de caña o maíz. Permite exportación a granel para embotellado en el país de destino.", badge: "Apto Granel Exportación" }
      ],
      classes: [
        { name: "Blanco / Silver", time: "Sin añejamiento", desc: "Embotellado directo tras la destilación o estabilización en tanques. Perfil herbal y cítrico puro de agave cocido." },
        { name: "Joven / Gold", time: "Mezcla o abocado", desc: "Tequila blanco mezclado con reposados o añejos, o redondeado suavemente para cócteles y gran escala." },
        { name: "Reposado", time: "2 a 11 meses", desc: "Madurado en barricas o pipones de roble americano o francés. Notas de vainilla suave, almendra y madera noble." },
        { name: "Añejo", time: "1 a 3 años", desc: "Maduración prolongada en barricas de roble de capacidad no mayor a 600 litros. Carácter tostado, cacao y frutos secos." },
        { name: "Extra Añejo", time: "Más de 3 años", desc: "Ultra maduración en barricas de roble seleccionadas. Máxima complejidad organoléptica para segmentos de lujo." }
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
        { idx: "01", name: "Tradicional / Ultra-Premium (Tahona)", desc: "Molienda con tahona de piedra volcánica ancestral, cocción en hornos de mampostería y alambiques de cobre. 100% Additive Free." },
        { idx: "02", name: "Premium Consistente (Autoclave)", desc: "Cocción en autoclaves de acero inoxidable, extracción noble sin machacar fibras y fermentación con control estricto de temperatura." },
        { idx: "03", name: "Comercial Escalable (Columnas)", desc: "Destilación eficiente en columnas europeas continuas (hasta 9M L/año) para marcas de alto volumen y rotación competitiva." },
        { idx: "04", name: "Firma del Autor & Barricas Selectas", desc: "Levaduras exclusivas de la casa y crianza en barricas seleccionadas de Roble Blanco Americano Virgen, Bourbon o Roble Francés." }
      ],

      // Agave, Terroir & Golden Corridor (PDF pág. 5-7)
      agaveOverTitle: "Autosuficiencia Agrícola & Terruño",
      agaveTitle: "Tu tequila nace en el campo: 3,600 Has. y 10.8 millones de agaves.",
      agaveSub: "En una industria vulnerable a la especulación y escasez del agave, Casa Loy garantiza estabilidad de precios y suministro permanente gracias a tres décadas de experiencia como productores agaveros autosuficientes.",
      agaveMetrics: [
        { metric: "3,600 Has.", title: "Superficie Cultivada", desc: "8,649 acres de tierra propia en Jalisco, Michoacán y Guanajuato." },
        { metric: "10.8M", title: "Plantas en Inventario", desc: "Plantaciones escalonadas por edades para garantizar jima continua." },
        { metric: "31+ Años", title: "Experiencia Agavera", desc: "Cultivando y seleccionando hijuelos de élite desde 1992 (TeknoAgrox)." },
        { metric: "Orgánico", title: "Capacidad Certificada", desc: "Cultivo libre de pesticidas sintéticos apto para certificación USDA / UE." }
      ],
      corridorOverTitle: "Ubicación Estratégica",
      corridorTitle: "Ayotlán: En el Corazón de Los Altos de Jalisco",
      corridorDesc: "Nuestra destilería y campos se ubican a más de 2,000 metros sobre el nivel del mar en Ayotlán, Jalisco. Esta altitud, combinada con tierras rojas arcillosas ricas en hierro y minerales, somete al agave azul a un estrés térmico natural que concentra niveles excepcionales de Azúcares Reductores Totales (ART).",
      corridorHighlightTitle: "✦ El Corredor Dorado de los Grandes Tequilas",
      corridorHighlightDesc: "Ayotlán forma parte de la ruta tequilera más prestigiosa y codiciada a nivel internacional, compartiendo terruño con destilerías legendarias:",
      corridorRoute: ["Guadalajara", "Casamigos", "Patrón", "Don Julio", "Ayotlán (CASA LOY)", "Tequila Ocho / Teremana"],

      // Quality, Tasting Lab & Bottling QA (PDF pág. 19)
      qaOverTitle: "Garantía Analítica & Sensorial",
      qaTitle: "Aseguramiento de Calidad: Del Laboratorio a la Botella.",
      qaSub: "Cada lote de producción es validado en nuestro laboratorio químico in-house y en cabinas especializadas de cata antes de pasar por nuestra línea de envasado con triple punto de inspección.",
      qaCards: [
        {
          icon: "local_bar",
          title: "Tasting Lab Profesional",
          desc: "Cabinas individuales de evaluación organoléptica aisladas para paneles de catadores profesionales. Validamos el perfil sensorial (aroma, balance alcohólico, notas de retrogusto) contra tu perfil patrón antes de embotellar.",
          bullets: ["Cabinas sensoriales normalizadas", "Blind tests y paneles de expertos", "Aprobación formal previa de muestra"]
        },
        {
          icon: "science",
          title: "Laboratorio Fisicoquímico",
          desc: "Equipamiento analítico avanzado y cromatografía de gases in-house. Monitoreamos alcoholímetro, acidez total, ésteres, aldehídos, furfural y metanol conforme a la NOM-006-SCFI y normativas TTB de EE.UU.",
          bullets: ["Cromatografía de gases por lote", "Certificados analíticos oficiales", "Confirmación 100% Additive Free"]
        },
        {
          icon: "inventory",
          title: "Línea de Envasado & QA",
          desc: "Área de envasado y acondicionamiento con estricto aseguramiento de calidad: llenado volumétrico automatizado, etiquetado de alta precisión e inspección visual en mesa de luz para asegurar botellas perfectas.",
          bullets: ["Llenado automatizado de precisión", "Etiquetado automatizado y manual premium", "Inspección visual botella por botella"]
        }
      ],

      // Sostenibilidad & Clean Tech (PDF pág. 20)
      ecoOverTitle: "Responsabilidad Ambiental & Clean Tech",
      ecoTitle: "Sostenibilidad: Destilación con respeto por el planeta.",
      ecoSub: "Los consumidores globales exigen marcas auténticamente sustentables. En Casa Loy implementamos un modelo de economía circular integral para minimizar la huella de carbono y optimizar el uso de recursos naturales.",
      ecoCards: [
        { metric: "Hasta 45%", title: "Energía Solar Fotovoltaica", desc: "Parque de paneles solares instalado en naves que abastece hasta el 45% de la demanda energética total de la planta en operación a plena capacidad." },
        { metric: "Biomasa", title: "Cero Combustibles Fósiles", desc: "Caldera de biomasa de última generación que aprovecha el bagazo residual del agave cocido para generar vapor limpio, erradicando el combustóleo y gas fósil." },
        { metric: "100% Circular", title: "Compostaje de Fibras de Agave", desc: "Aprovechamiento total de las fibras de agave desechadas durante la extracción para elaborar composta orgánica que regresa como fertilizante a nuestros propios campos." },
        { metric: "Reúso 100%", title: "Reciclaje de Agua para Riego", desc: "Planta de tratamiento de efluentes que recupera y depura el agua utilizada en procesos industriales para ser reintegrada en el riego de parcelas agrícolas." },
        { metric: "Tratamiento Integral", title: "Aprovechamiento de Vinazas", desc: "Sistema avanzado de tratamiento y neutralización de vinazas residuales para su transformación en fertilizante orgánico rico en minerales para la tierra." },
        { metric: "Storytelling", title: "Ventaja Comercial B2B", desc: "Comunica con orgullo a tus distribuidores y consumidores finales que tu tequila es producido en una de las destilerías más ecológicas y sostenibles de México.", badge: "ESG Compliance Ready" }
      ],

      // Certificaciones Internacionales (PDF pág. 21)
      certOverTitle: "Acreditaciones Internacionales",
      certTitle: "Certificaciones de clase mundial que abren fronteras.",
      certSub: "Tu marca contará con el respaldo técnico y los sellos oficiales exigidos por los retailers y distribuidores más rigurosos de Estados Unidos, Europa y mercados globales.",
      certBadges: [
        { code: "USDA", name: "USDA Organic", desc: "Certificación de producción orgánica para exportación directa al mercado de EE.UU.", market: "Mercado Norteamericano" },
        { code: "BIO", name: "EU Organic", desc: "Sello orgánico de la Unión Europea (Euro-leaf) para distribución en los 27 países miembros.", market: "Unión Europea" },
        { code: "KMD", name: "KMD Kosher", desc: "Certificación de pureza Kosher México con validez y reconocimiento internacional.", market: "Pureza Garantizada" },
        { code: "100%", name: "Additive Free", desc: "Confirmado libre de aditivos por Tequila Matchmaker. Cero colorantes, abocantes o aromas.", market: "Tequila Matchmaker" },
        { code: "FSSC", name: "FSSC 22000", desc: "Food Safety System Certification. Máximo estándar global en inocuidad y seguridad alimentaria.", market: "Inocuidad Global" }
      ],

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
      heroSub: "Integrated distillery with NOM 1633, backed by Grupo Orbe XXI with over 60 years of corporate heritage, 3,600 hectares of self-owned agave fields, and 13.5 million liters of annual distillation capacity.",
      heroBtnStart: "Start B2B Diagnosis",
      heroBtnCall: "Book Technical Call",

      trustNom: "NOM 1633 CRT",
      trustRegion: "Ayotlán · Los Altos de Jalisco",
      trustStructure: "Grupo Orbe XXI (60+ Years)",
      trustRoots: "3,600 Has. / 10.8M Agaves",
      trustControl: "13.5M L / Year Capacity",
      trustExport: "1.2M L Barrel Cellar",
      trustAdditiveFree: "100% Additive Free Certified",

      // Grupo Orbe XXI Backing
      groupOverTitle: "Corporate Heritage & Strength",
      groupTitle: "ORBE XXI GROUP: Over 60 years of institutional solidity.",
      groupDesc: "Your tequila brand does not rely on vulnerable brokers or improvised producers. Behind Casa Loy Tequilera operates Grupo Orbe XXI, a multinational corporate consortium with over six decades of agribusiness experience, global presence in the Americas, Europe, and Asia, and proven financial solvency.",
      groupPillars: [
        { metric: "60+ Years", title: "Corporate Legacy", desc: "Consolidated group with verified leadership in agribusiness, food processing, and international trade." },
        { metric: "2,900+", title: "Global Employees", desc: "International operational and technical workforce operating under world-class corporate governance standards." },
        { metric: "Since 1992", title: "Agave Specialists (TeknoAgrox)", desc: "Over three decades cultivating, propagating, and perfecting the genetics of blue Weber agave." },
        { metric: "Nutriagaves (2003)", title: "Presence in USA, Europe & Asia", desc: "Global leader in organic agave syrup and inulin, with established supply routes and global certifications." }
      ],
      groupTequileraCard: {
        overtitle: "Tequila Division of the Consortium",
        title: "Casa Loy Tequilera — Founded in 2019",
        desc: "Established to integrate total supply chain control: from our 3,600 hectares of self-owned agave to a state-of-the-art distillery with 13.5 million liters annual capacity and a 1.2M L barrel aging room."
      },
      groupSynergies: ["Casa Loy Tequilera", "Nutriagaves Group", "TeknoAgrox", "Loydeal", "OMEX Alimentaria", "IPASA", "PAOSA"],

      whyTitle: "A world-class distillery in Los Altos de Jalisco.",
      whyCards: [
        { wk: "Origin", title: "NOM 1633, Ayotlán, Jalisco", highlight: true, metric: "1633" },
        { wk: "Heritage", title: "Grupo Orbe XXI: 60+ years, 2,900 employees", dark: true },
        { wk: "Self-Owned Agave", title: "3,600 Has. and 10.8M agave plants in inventory", metric: "3,600 Has." },
        { wk: "Technical Team", title: "Direct contact with master distillers and chemical engineers" },
        { wk: "Infrastructure", title: "13.5M L annual distillation & 1.2M L barrel cellar", highlight: true, span2: true },
        { wk: "Laboratory", title: "Professional Tasting Lab & in-house gas chromatography" }
      ],

      // World-Class Infrastructure & Capacities
      infraOverTitle: "Audited Industrial Infrastructure",
      infraTitle: "Installed capacities built for projects of any scale.",
      infraDesc: "Our Ayotlán facility combines traditional copper pot stills and ancestral volcanic stone tahona milling with high-efficiency automated European column stills, supported by our own deep water well.",
      infraCards: [
        { metric: "240 Tons", title: "Traditional Masonry Ovens", desc: "4 stone ovens (60t each) for slow steam hydrolysis of mature agave piñas." },
        { metric: "80 Tons", title: "Stainless Steel Autoclaves", desc: "2 autoclaves (40t each) for rapid pressurized cooking preserving fresh herbal notes." },
        { metric: "200tn / 500k L", title: "Extraction Systems", desc: "200 ton/day green extraction + ancestral volcanic stone Tahona (500k L/year) and roller mill." },
        { metric: "4.5M Liters", title: "Copper Pot Stills", desc: "Artisanal double distillation in copper coil stills: 15,000 L/day at 55% ABV." },
        { metric: "9M Liters", title: "European Column Stills", desc: "Automated continuous column stills: 30,000 L/day at 55% ABV for high-volume commercial brands." },
        { metric: "1.2M Liters", title: "Barrel Cellar", desc: "Virgin American Oak, Bourbon Barrels, and French Oak in temperature-controlled cellar." },
        { metric: "1.3M Liters", title: "Stainless Tanks", desc: "Temperature-controlled holding tanks for resting and stabilizing finished product." },
        { metric: "2,000 Pallets", title: "Logistics Warehouse", desc: "1,000 pallets for dry goods (bottles/cases) + 1,000 pallets for export-ready finished product." }
      ],
      infraWater: {
        title: "Proprietary Deep Well Water",
        desc: "Direct on-site extraction providing microbiological purity and consistent mineral balance for all fermentations and proofing blends."
      },

      insideTitle: "From soil to bottle: Our End-to-End Process.",
      insideSteps: [
        { num: "01", name: "Own Agave", desc: "3,600 Self-owned hectares and over 10.8 million plants in Jalisco, Michoacán, and Guanajuato. Selective harvesting with high sugar concentration (total reducing sugars) and organic certification.", img: "/Piñas de Agave Tequilana Weber.webp" },
        { num: "02", name: "Cooking (2 Methods)", desc: "Total flexibility: 4 traditional masonry brick ovens (240 tons total capacity for slow steaming) or 2 stainless autoclaves (80 tons total) maximizing yield and freshness.", img: "/Agave cocido.webp" },
        { num: "03", name: "Extraction (3 Methods)", desc: "3 options: Ancestral volcanic stone Tahona (500,000 L/year), screw mill without crushing bitter fibers, or high-efficiency diffuser.", img: "/Tahona Agave Molienda.webp" },
        { num: "04", name: "Fermentation (2 Methods)", desc: "Slow open-air fermentation in open stainless steel tanks or controlled fermentation in closed tanks with proprietary yeast strains.", img: "/Fermentación.webp" },
        { num: "05", name: "Distillation (2 Methods)", desc: "Traditional copper pot stills with coil (15,000 L/day at 55% ABV · 4.5M L/year) or automated European column stills (30,000 L/day · 9M L/year). Proprietary deep well water.", img: "/Destilación.webp" },
        { num: "06", name: "Barrel Cellar", desc: "1.2 Million Liters capacity in underground temperature-controlled aging cellar. Aging in Virgin American Oak, Bourbon Casks, and French Oak.", img: "/Cava de Añejamiento.webp" },
        { num: "07", name: "Tasting Lab & Chemical QA", desc: "Individual sensory evaluation booths and in-house laboratory with gas chromatography to certify 100% Additive Free profiles and NOM-006 / TTB compliance.", img: "/Laboratorio.webp" },
        { num: "08", name: "Bottling & QA", desc: "Bottling line with triple quality assurance: automated volumetric filling, precision labelling, and light-table visual inspection bottle by bottle.", img: "/Embotellado 2.webp" }
      ],

      solutionsTitle: "Choose the right production path.",
      solutions: [
        { num: "01", title: "Private Label Tequila", desc: "Create, bottle, and market your own custom tequila brand from scratch.", tag: "private_label" },
        { num: "02", title: "Contract Manufacturing / Maquila", desc: "Bespoke production under your exact specifications and proprietary recipes.", tag: "contract_manufacturing" },
        { num: "03", title: "Bulk Tequila Supply", desc: "Steady volume supply for bottlers, importers, or global distributors.", tag: "bulk_tequila" },
        { num: "04", title: "Co-packing & Bottling Services", desc: "Bottling, labeling, and packaging for projects with existing liquid or bottles.", tag: "copacking_bottling" },
        { num: "05", title: "Custom Profile Development", desc: "Tailored organoleptic profile design guided by master distillers.", tag: "custom_profile" }
      ],

      // Categorías y Clases Oficiales
      catOverTitle: "NOM-006 Official Standards",
      catTitle: "Official Tequila Categories & Classes.",
      catDesc: "We formulate and bottle profiles in all categories and classes recognized by Mexican law and the Tequila Regulatory Council (CRT), matching the taste profile and price point of your target market.",
      categories: [
        { title: "100% Blue Agave Tequila", desc: "Crafted exclusively from blue Weber agave sugars cultivated within the protected Appellation of Origin. Must be bottled at source in Mexico.", badge: "NOM-006 Exclusive" },
        { title: "Tequila (Mixto)", desc: "Crafted with a minimum of 51% blue agave sugars and up to 49% other sugars (cane/corn). Certified for bulk export and destination country bottling.", badge: "Export Bulk Approved" }
      ],
      classes: [
        { name: "Blanco / Silver", time: "Unaged", desc: "Bottled directly after distillation or resting in stainless tanks. Crisp, authentic herbal profile with pure cooked agave." },
        { name: "Joven / Gold", time: "Blended or mellowed", desc: "Blanco tequila blended with reposado or añejo, or rounded for high-volume cocktails and retail scale." },
        { name: "Reposado", time: "2 to 11 months", desc: "Rested in oak casks or vats. Gentle vanilla, hazelnut, and refined wood notes." },
        { name: "Añejo", time: "1 to 3 years", desc: "Extended maturation in oak barrels no larger than 600 liters. Roasted oak, cacao, and dried fruit character." },
        { name: "Extra Añejo", time: "3+ years", desc: "Ultra-aged in hand-selected oak barrels. Highest organoleptic complexity for luxury segments." }
      ],

      whoTitle: "Solutions tailored to your business role.",
      whoSubtitle: "Select your project type to check core benefits and suggested paths:",
      whoAudiences: [
        {
          tag: "Founders",
          title: "Starting a tequila brand from scratch",
          desc: "We guide your entry into a highly regulated category. We support you with CRT registration, liquid formulation, package engineering, and authorized glass supplier sourcing.",
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
        { idx: "01", name: "Heritage / Ultra-Premium (Tahona)", desc: "Ancestral volcanic stone tahona mill, masonry steam ovens, and copper pot stills. 100% Additive Free." },
        { idx: "02", name: "Premium Consistent (Autoclave)", desc: "Stainless steel autoclave cooking, gentle extraction without crushing fibers, and strict temperature-controlled fermentation." },
        { idx: "03", name: "Scalable Commercial (Columns)", desc: "High-efficiency automated European column stills (up to 9M L/year) for competitive high-volume brands." },
        { idx: "04", name: "Custom Signature & Select Casks", desc: "Proprietary yeast strains and maturation in select Virgin American Oak, Bourbon Casks, or French Oak." }
      ],

      // Agave, Terroir & Golden Corridor
      agaveOverTitle: "Agricultural Self-Sufficiency & Terroir",
      agaveTitle: "Your tequila starts in the soil: 3,600 Has. and 10.8 million agaves.",
      agaveSub: "In an industry vulnerable to agave speculation and market shortages, Casa Loy guarantees price stability and permanent supply through three decades of self-sufficient agave farming.",
      agaveMetrics: [
        { metric: "3,600 Has.", title: "Cultivated Surface", desc: "8,649 acres of self-owned land in Jalisco, Michoacán, and Guanajuato." },
        { metric: "10.8M", title: "Plants in Inventory", desc: "Staggered age plantations ensuring continuous harvesting year-round." },
        { metric: "31+ Years", title: "Agave Heritage", desc: "Cultivating and selecting elite agave pups since 1992 (TeknoAgrox)." },
        { metric: "Organic", title: "Certified Capability", desc: "Pesticide-free farming qualified for USDA and EU organic certification." }
      ],
      corridorOverTitle: "Strategic Location",
      corridorTitle: "Ayotlán: In the Heart of the Jalisco Highlands",
      corridorDesc: "Our distillery and agave parcels are situated at over 2,000 meters above sea level in Ayotlán, Jalisco. This altitude, combined with mineral-rich red clay soils, subjects the agave to natural thermal stress that concentrates peak levels of Total Reducing Sugars (TRS).",
      corridorHighlightTitle: "✦ The Golden Corridor of Tequila Legends",
      corridorHighlightDesc: "Ayotlán forms part of the most prestigious tequila corridor in the world, sharing terroir with iconic distilleries:",
      corridorRoute: ["Guadalajara", "Casamigos", "Patrón", "Don Julio", "Ayotlán (CASA LOY)", "Tequila Ocho / Teremana"],

      // Quality, Tasting Lab & Packaging
      qaOverTitle: "Analytical & Sensory Assurance",
      qaTitle: "Quality Assurance: From Laboratory to the Bottle.",
      qaSub: "Every production batch is validated in our in-house chemical lab and in professional sensory testing booths before passing through our triple-check bottling line.",
      qaCards: [
        {
          icon: "local_bar",
          title: "Professional Tasting Lab",
          desc: "Individual isolated sensory booths for expert tasting panels. We validate organoleptic traits (aroma, alcohol balance, finish) against your benchmark before bottling.",
          bullets: ["Standardized sensory booths", "Blind tastings & expert panels", "Formal sample sign-off"]
        },
        {
          icon: "science",
          title: "Physicochemical Laboratory",
          desc: "Advanced analytical equipment and in-house gas chromatography. We monitor alcohol, total acidity, esters, aldehydes, furfural, and methanol under NOM-006 and US TTB standards.",
          bullets: ["Gas chromatography per batch", "Official analytical certificates", "100% Additive Free verification"]
        },
        {
          icon: "inventory",
          title: "Bottling Line & QA",
          desc: "Packaging area with strict quality assurance: automated volumetric filling, precision labelling, and light-table visual inspection ensuring zero bottle defects.",
          bullets: ["Automated precision filling", "Automated & manual premium labelling", "Light-table visual inspection"]
        }
      ],

      // Sostenibilidad & Clean Tech
      ecoOverTitle: "Environmental Responsibility & Clean Tech",
      ecoTitle: "Sustainability: Distilling with respect for our planet.",
      ecoSub: "Global consumers demand authentically sustainable brands. Casa Loy operates an end-to-end circular economy model minimizing carbon footprint and optimizing natural resources.",
      ecoCards: [
        { metric: "Up to 45%", title: "Solar Photovoltaic Energy", desc: "Rooftop solar panel park supplying up to 45% of the total plant electrical demand at full production capacity." },
        { metric: "Biomass", title: "Zero Fossil Fuels", desc: "State-of-the-art biomass boiler utilizing cooked agave bagasse waste to produce clean steam, eradicating fuel oil and fossil gas." },
        { metric: "100% Circular", title: "Agave Fiber Composting", desc: "100% of discarded agave fibers from milling are converted into organic compost returned as fertilizer to our fields." },
        { metric: "100% Reuse", title: "Water Recycling for Irrigation", desc: "Effluent treatment plant recovering industrial process water to be reused in agricultural parcel irrigation." },
        { metric: "Full Treatment", title: "Vinasse Upcycling", desc: "Advanced vinasse neutralization and treatment converting liquid distillery waste into mineral-rich organic fertilizer." },
        { metric: "Storytelling", title: "Commercial B2B Advantage", desc: "Communicate proudly to your distributors and retail partners that your tequila is crafted in one of Mexico's greenest distilleries.", badge: "ESG Compliance Ready" }
      ],

      // Certificaciones Internacionales
      certOverTitle: "International Accreditations",
      certTitle: "World-class certifications that open global doors.",
      certSub: "Your brand is backed by the technical credentials and official seals required by the most demanding retailers and distributors across the US, Europe, and global markets.",
      certBadges: [
        { code: "USDA", name: "USDA Organic", desc: "Certified organic production for direct export to the United States market.", market: "North America" },
        { code: "BIO", name: "EU Organic", desc: "European Union Organic seal (Euro-leaf) for distribution across all 27 member states.", market: "European Union" },
        { code: "KMD", name: "KMD Kosher", desc: "Kosher Mexico purity certification recognized by international rabbinical authorities.", market: "Guaranteed Purity" },
        { code: "100%", name: "Additive Free", desc: "Confirmed Additive Free by Tequila Matchmaker. Zero artificial coloring, glycerin, or flavors.", market: "Tequila Matchmaker" },
        { code: "FSSC", name: "FSSC 22000", desc: "Food Safety System Certification. Highest international benchmark in food safety management.", market: "Global Food Safety" }
      ],

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
            <span className="text-[#8C4723] text-xs font-semibold select-none hidden lg:inline">✦</span>
            <span className="font-navigation text-[10.5px] md:text-[11.5px] font-semibold uppercase tracking-widest text-emerald-800">{t.trustAdditiveFree}</span>
          </div>
        </div>
      </div>

      {/* 5.1b RESPALDO INSTITUCIONAL: GRUPO ORBE XXI (PDF pág. 3-4) */}
      <section className="bg-white border-b border-outline-variant/30 py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="max-w-3xl mb-12">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-3">
              {t.groupOverTitle}
            </span>
            <h2 className="font-headline-lg text-3xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.groupTitle}
            </h2>
            <p className="font-body-md text-sm md:text-base text-secondary font-light mt-4 leading-relaxed">
              {t.groupDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {t.groupPillars.map((pillar, idx) => (
              <div key={idx} className="p-6 border border-outline-variant/50 bg-[#EDE7DE]/15 space-y-3 hover:border-primary transition-all">
                <div className="font-serif text-3xl font-bold text-primary">{pillar.metric}</div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#1c1c18]">{pillar.title}</h3>
                <p className="font-sans text-xs text-secondary font-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-10 border border-primary/30 bg-[#8C4723]/5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-4">
              <div>
                <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block">{t.groupTequileraCard.overtitle}</span>
                <h3 className="font-serif text-2xl text-[#1c1c18] font-semibold">{t.groupTequileraCard.title}</h3>
              </div>
              <span className="font-mono text-xs bg-primary text-white px-3 py-1 uppercase tracking-wider rounded-full self-start md:self-auto font-normal">NOM 1633 CRT</span>
            </div>
            <p className="font-sans text-xs md:text-sm text-secondary leading-relaxed font-light">
              {t.groupTequileraCard.desc}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-secondary">
              <span className="text-[#1c1c18] font-bold">{lang === "es" ? "Sinergia del Consorcio:" : "Consortium Synergy:"}</span>
              {t.groupSynergies.map((synergy, idx) => (
                <span key={idx} className="bg-white border border-outline-variant/60 px-2.5 py-1 rounded text-[11px] font-sans">
                  {synergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* 5.2b INFRAESTRUCTURA DE CLASE MUNDIAL (PDF pág. 11-18) */}
      <section className="py-16 md:py-28 bg-[#fdfcf9] border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="mb-14">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-3">
              {t.infraOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.infraTitle}
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base font-light max-w-3xl mt-4 leading-relaxed">
              {t.infraDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.infraCards.map((card, idx) => (
              <div key={idx} className="border border-outline-variant/60 bg-white p-6 space-y-3 hover:border-primary hover:-translate-y-1 transition-all shadow-sm">
                <span className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-widest">0{idx + 1}</span>
                <div className="font-serif text-3xl text-primary font-semibold">{card.metric}</div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#1c1c18]">{card.title}</h3>
                <p className="font-sans text-xs text-secondary font-light leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 md:p-8 bg-[#EDE7DE]/40 border border-outline-variant/60 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-primary/40 bg-white flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="font-serif text-lg md:text-xl text-[#1c1c18] font-semibold">{t.infraWater.title}</h3>
              <p className="font-sans text-xs text-secondary font-light leading-relaxed">
                {t.infraWater.desc}
              </p>
            </div>
          </div>
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

      {/* 5.4b CATEGORÍAS Y CLASES NOM-006-SCFI (PDF pág. 9-10) */}
      <section className="py-16 md:py-28 bg-[#EDE7DE]/15 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="mb-14">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-3">
              {t.catOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.catTitle}
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base font-light max-w-3xl mt-4 leading-relaxed">
              {t.catDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {t.categories.map((cat, idx) => (
              <div key={idx} className="border border-outline-variant/60 bg-white p-8 space-y-4 hover:border-primary transition-all shadow-sm">
                <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2.5 py-1 rounded inline-block">
                  {cat.badge}
                </span>
                <h3 className="font-serif text-2xl text-[#1c1c18] font-semibold">{cat.title}</h3>
                <p className="font-sans text-xs text-secondary leading-relaxed font-light">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#1c1c18] font-semibold mb-6">
              {lang === "es" ? "Las 5 Clases Oficiales por Tiempo de Maduración:" : "The 5 Official Classes by Aging Duration:"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {t.classes.map((cls, idx) => (
                <div key={idx} className="border border-outline-variant/50 bg-white p-5 space-y-2 hover:border-primary transition-all">
                  <div className="font-sans text-sm font-bold text-[#1c1c18]">{cls.name}</div>
                  <span className="font-mono text-[10px] text-primary font-semibold block">{cls.time}</span>
                  <p className="font-sans text-[11px] text-secondary font-light leading-relaxed">{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>
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

      {/* 5.10 AGAVE, AUTOSUFICIENCIA & EL CORREDOR DORADO (PDF pág. 5-7) */}
      <section className="py-16 md:py-28 bg-[#f6f1eb] border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp} className="mb-14">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-4">
              {t.agaveOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.agaveTitle}
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base font-light max-w-3xl mt-4 leading-relaxed">
              {t.agaveSub}
            </p>
          </motion.div>

          {/* Agricultural Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {t.agaveMetrics.map((item, idx) => (
              <div key={idx} className="bg-white border border-outline-variant/50 p-6 space-y-2 shadow-sm">
                <div className="font-serif text-3xl md:text-4xl text-primary font-semibold">{item.metric}</div>
                <div className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1c18]">{item.title}</div>
                <p className="font-sans text-[11px] text-secondary font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Terroir & The Golden Corridor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              className="lg:col-span-6 overflow-hidden shadow-md border border-outline-variant/40"
              {...fadeInUp}
            >
              <img 
                src="/Jimado Agave Tequilana Weber.webp" 
                alt="Jimador trabajando en campos de agave de Casa Loy Tequilera" 
                className="w-full aspect-[4/3] object-cover transition-transform duration-10000 hover:scale-105"
              />
            </motion.div>
            
            <div className="lg:col-span-6 space-y-6">
              <div className="border-l-2 border-primary pl-6 space-y-2">
                <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">{t.corridorOverTitle}</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1c1c18] font-semibold">{t.corridorTitle}</h3>
                <p className="font-sans text-xs text-secondary leading-relaxed font-light">
                  {t.corridorDesc}
                </p>
              </div>

              <div className="p-6 bg-white border border-outline-variant/50 space-y-3">
                <div className="font-mono text-xs text-[#8C4723] font-bold uppercase tracking-wider">
                  {t.corridorHighlightTitle}
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed font-light">
                  {t.corridorHighlightDesc}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-[#1c1c18]">
                  {t.corridorRoute.map((stop, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>→</span>}
                      <span className={`px-2.5 py-1 rounded ${
                        stop.includes("CASA LOY") 
                          ? "bg-amber-100 text-amber-900 font-bold border border-amber-300" 
                          : "bg-stone-100"
                      }`}>
                        {stop}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.11 CALIDAD, TASTING LAB & LÍNEA DE ENVASADO QA (PDF pág. 19) */}
      <section className="py-16 md:py-28 bg-white border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <motion.div {...fadeInUp} className="mb-14">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-4">
              {t.qaOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.qaTitle}
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base font-light max-w-3xl mt-4 leading-relaxed">
              {t.qaSub}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.qaCards.map((card, idx) => (
              <div key={idx} className="border border-outline-variant/40 bg-[#fcf9f3] p-8 flex flex-col justify-between space-y-6 hover:border-primary transition-all shadow-sm">
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-primary text-4xl">{card.icon}</span>
                  <h3 className="font-serif text-2xl text-[#1c1c18] font-bold">{card.title}</h3>
                  <p className="font-sans text-xs text-secondary leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
                <ul className="space-y-2 text-xs font-sans text-[#1c1c18] border-t border-outline-variant/30 pt-4 font-light">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-primary">check</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.11b SOSTENIBILIDAD & ECONOMÍA CIRCULAR (PDF pág. 20) */}
      <section className="py-16 md:py-28 bg-[#1C1A19] text-white relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left relative z-10">
          <motion.div {...fadeInUp} className="mb-14">
            <span className="font-label-caps text-[#FDA377] font-bold tracking-widest uppercase text-xs block mb-4">
              {t.ecoOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-white font-light leading-tight">
              {t.ecoTitle}
            </h2>
            <p className="font-body-md text-white/70 text-sm md:text-base font-light max-w-3xl mt-4 leading-relaxed">
              {t.ecoSub}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.ecoCards.map((card, idx) => (
              <div 
                key={idx} 
                className={`p-8 space-y-4 border transition-all ${
                  card.badge 
                    ? "bg-[#8C4723]/20 border-primary/40 flex flex-col justify-between" 
                    : "bg-white/5 border-white/10 hover:border-primary"
                }`}
              >
                {card.metric && (
                  <div className="font-serif text-3xl md:text-4xl text-[#FDA377] font-light">{card.metric}</div>
                )}
                <div className="space-y-2">
                  {card.badge && (
                    <span className="font-mono text-xs text-[#FDA377] font-bold uppercase tracking-wider block">Valor para tu Marca</span>
                  )}
                  <h3 className="font-serif text-xl text-white font-semibold">{card.title}</h3>
                  <p className="font-sans text-xs text-white/70 leading-relaxed font-light">{card.desc}</p>
                </div>
                {card.badge && (
                  <div className="pt-4 border-t border-white/20 font-mono text-[10px] text-[#FDA377] uppercase">{card.badge}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.11c CERTIFICACIONES DE CLASE MUNDIAL (PDF pág. 21) */}
      <section className="py-16 md:py-28 bg-[#EDE7DE]/40 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-label-caps text-primary font-bold tracking-widest uppercase text-xs block mb-3">
              {t.certOverTitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-[#1c1c18] font-light leading-tight">
              {t.certTitle}
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base font-light mt-4 leading-relaxed">
              {t.certSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.certBadges.map((cert, idx) => (
              <div key={idx} className="bg-white border border-outline-variant/50 p-6 flex flex-col justify-between min-h-[220px] text-center shadow-sm hover:border-primary transition-all">
                <div>
                  <div className="w-12 h-12 rounded-full border border-stone-200 mx-auto flex items-center justify-center mb-4 text-xs font-mono font-bold text-[#1c1c18] bg-stone-50">
                    {cert.code}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1c18]">{cert.name}</h3>
                  <p className="font-sans text-[11px] text-secondary font-light mt-2 leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
                <span className="font-mono text-[9px] text-primary font-bold uppercase mt-4">{cert.market}</span>
              </div>
            ))}
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
