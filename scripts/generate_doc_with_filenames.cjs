const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageOrientation,
  Header,
  Footer,
  ShadingType,
} = require('docx');
const XLSX = require('xlsx');

// Visual branding Casa Loy
const COLOR_PRIMARY = "8C4723";   // Terracotta Casa Loy
const COLOR_SECONDARY = "1A1615"; // Dark Charcoal
const COLOR_LIGHT_BG = "FBF9F5";  // Warm cream tint
const COLOR_BORDER = "D3CCC0";    // Light subtle border
const COLOR_MUTED = "555555";     // Dark gray
const COLOR_CODE = "2D3748";      // Code text dark slate

const borderThin = {
  style: BorderStyle.SINGLE,
  size: 6,
  color: COLOR_BORDER,
};

const cellBorders = {
  top: borderThin,
  bottom: borderThin,
  left: borderThin,
  right: borderThin,
};

// Column widths for Portrait layout (total = 10,200 dxa)
const COL_WIDTHS = {
  ELEMENT: 2600,  // 25.5%
  FILENAME: 3400, // 33.3%
  SIZE: 1900,     // 18.6%
  FORMAT: 1000,   // 9.8%
  WEIGHT: 1300,   // 12.7%
};

const sectionsData = [
  {
    category: "1. BANNERS PRINCIPALES Y PORTADAS (HERO)",
    description: "Imágenes a pantalla completa en la cabecera del sitio (Home, Maquilas, Nativo 1937, Turismo, Nosotros y Bolsa de Trabajo).",
    items: [
      { element: "Hero General - Escritorio", filename: "Casa Loy Tequilera-escritorio.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero General - Celular", filename: "Casa Loy Tequilera-movil.webp", size: "1080 × 1920 px (9:16)", format: "WebP", weight: "< 110 KB" },
      { element: "Hero General - Retina 4K", filename: "Casa Loy Tequilera-retina.webp", size: "2560 × 1440 px (16:9)", format: "WebP", weight: "< 280 KB" },
      { element: "Hero Piedra y Agave (Alt)", filename: "Banner Casa Loy Piedra y Agave-escritorio.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero Piedra y Agave (Móvil)", filename: "Banner Casa Loy Piedra y Agave-movil.webp", size: "1080 × 1920 px (9:16)", format: "WebP", weight: "< 110 KB" },
      { element: "Hero Restaurante 1937 (PC)", filename: "Banner Restaurante 1937 Nativo-escritorio.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero Restaurante 1937 (Móvil)", filename: "Banner Restaurante 1937 Nativo-movil.webp", size: "1080 × 1920 px (9:16)", format: "WebP", weight: "< 110 KB" },
      { element: "Hero Turismo y Tours (PC)", filename: "Banner Experiencias-escritorio.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero Turismo y Tours (Móvil)", filename: "Banner Experiencias-movil.webp", size: "1080 × 1920 px (9:16)", format: "WebP", weight: "< 110 KB" },
      { element: "Hero Tequila TADDEL", filename: "Banner TADDEL Tequila.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero Tequila Tierra Zafiro", filename: "Banner Tierra Zafio Tequila.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Hero Bolsa de Trabajo", filename: "Bolsa de Trabajo.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { element: "Franja Parallax Naves", filename: "Naves Industriales Casa Loy Tequilera.webp", size: "1920 × 600 px (3.2:1)", format: "WebP", weight: "< 130 KB" },
    ]
  },
  {
    category: "2. PROCESO TEQUILERO Y PLANTA INDUSTRIAL (MAQUILAS)",
    description: "Etapas de producción: Jima, Molienda con Tahona, Fermentación, Destilación, Cavas, Laboratorio y Sustentabilidad.",
    items: [
      { element: "Jima de Agave Azul", filename: "Jimado Agave Tequilana Weber.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Piñas Cosechadas de Agave", filename: "Piñas de Agave Tequilana Weber.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Cocción de Agave en Hornos", filename: "Cocimiento de Agave.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Molienda Ancestral Tahona", filename: "Tahona Agave Molienda.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Molienda (Escritorio)", filename: "molienda-escritorio.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Molienda (Móvil)", filename: "molienda-movil.webp", size: "800 × 600 px (4:3)", format: "WebP", weight: "< 75 KB" },
      { element: "Tinas de Fermentación", filename: "Fermentación.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Alambiques de Destilación", filename: "Destilación.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Pasillo Cava de Barricas", filename: "Pasillo Cava de Añejamiento.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Cava de Barricas (PC)", filename: "añejamiento-escritorio.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Cava de Barricas (Móvil)", filename: "añejamiento-movil.webp", size: "800 × 600 px (4:3)", format: "WebP", weight: "< 75 KB" },
      { element: "Laboratorio Fisicoquímico", filename: "Laboratorio Maquilas.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Control de Calidad Maquilas", filename: "Calidad Maquilas.webp", size: "960 × 1280 px (3:4)", format: "WebP", weight: "< 110 KB" },
      { element: "Línea de Envasado / QA", filename: "Enbotellado.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Caldera de Biomasa", filename: "Caldera de Biomasa.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { element: "Parque de Paneles Solares", filename: "Paneles Solares.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Compostaje y Vinazas", filename: "compostaje-escritorio.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 100 KB" },
    ]
  },
  {
    category: "3. RESTAURANTE 1937 NATIVO (GASTRONOMÍA Y ESPACIOS)",
    description: "Platillos emblemáticos del menú, mixología, salones, murales de arte, boutique y equipo culinario.",
    items: [
      { element: "Guacamole con Chicharrón", filename: "guacamole-chicharron.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { element: "Platillo Degustación 1", filename: "Platillo 1 1937 Nativo.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { element: "Platillo Degustación 2", filename: "Platillo 2 1937 Nativo.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { element: "Platillos de Menú 3, 4 y 5", filename: "Platillo 3 1937 Nativo.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { element: "Corte New York", filename: "new-york-corte.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { element: "Pulpo a las Brasas", filename: "Pulpo.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 110 KB" },
      { element: "Tarta de Limón (Postre)", filename: "tarta-de-limon.webp", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 110 KB" },
      { element: "Instalaciones Salón Nativo", filename: "Restaurante 1937 Nativo Instalaciones.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 160 KB" },
      { element: "Mural Histórico La Diosa", filename: "Restaurante 1937 Nativo Mural Diosa.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 160 KB" },
      { element: "Murales de Instalaciones 2 y 3", filename: "Restaurante 1937 Nativo Instalaciones Mural 2.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 160 KB" },
      { element: "Boutique y Cava de Altura", filename: "Boutique Restaurante.webp", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 180 KB" },
      { element: "Chef Ejecutivo Sergio", filename: "Sergio Chef.webp", size: "800 × 1000 px (4:5)", format: "WebP", weight: "< 80 KB" },
      { element: "Servicio y Atención al Cliente", filename: "Restaurante 1937 Nativo atención al cliente.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Fondo Fibras de Agave", filename: "Fibras de Agave Cocido.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 150 KB" },
    ]
  },
  {
    category: "4. TURISMO, EXPERIENCIAS Y CATAS",
    description: "Tours por la tequilera (Diamante, Platino, Oro), catas en terraza, mirador del columpio y cavas.",
    items: [
      { element: "Paquete Recorrido Oro", filename: "Casa Loy Experiencias Oro.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Paquete Recorrido Platino", filename: "Casa Loy Experiencias Platino.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Paquete Recorrido Diamante", filename: "Casa Loy Experiencias Diamante.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { element: "Cata en Cava Subterránea", filename: "Cata Experiencias.webp", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 170 KB" },
      { element: "Cata en Terraza TADDEL", filename: "Cata en Terraza TADDEL.webp", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 170 KB" },
      { element: "Mirador del Columpio", filename: "Columpio Experiencias.webp", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 160 KB" },
      { element: "Terraza Casa Loy y Agaves", filename: "Terraza Casa Loy Experiencias.webp", size: "1920 × 1280 px (3:2)", format: "WebP", weight: "< 150 KB" },
      { element: "Barra de Mixología", filename: "Barra Casa Loy Experiencias.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 150 KB" },
      { element: "Mural de Historia Recorrido", filename: "Mural Historia Casa Loy.webp", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 150 KB" },
      { element: "Barricas Marcadas con Logo", filename: "Tours 2 - Colocar Logotipo de tequilera en las barricas.webp", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
    ]
  },
  {
    category: "5. LOGOTIPOS, MARCAS Y CATÁLOGO DE BOTELLAS",
    description: "Identidad visual de Casa Loy, marcas registradas, clientes retailers B2B y fotografías de producto.",
    items: [
      { element: "Logotipo Casa Loy (Oficial)", filename: "Logotipo Casa Loy Tequilera.webp", size: "Vectorial (o 600×338)", format: "SVG / WebP", weight: "< 15 KB" },
      { element: "Logotipo Casa Loy en Blanco", filename: "Logotipo Casa Loy Tequilera Color Blanco.webp", size: "Vectorial (o 600×338)", format: "SVG / WebP", weight: "< 15 KB" },
      { element: "Logotipo Tequila TADDEL MX", filename: "TADDEL_Tequila_MX_Logotipo.webp", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { element: "Logotipo Tequila TADDEL USA", filename: "TADDEL_1937_Tequila_USA_Logotipo.webp", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { element: "Logotipo Tierra Zafiro", filename: "Tierra_Zafiro_Tequila_Logotipo.webp", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { element: "Logo Restaurante 1937 Nativo", filename: "logo-nativo-1937.webp", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { element: "Logo Nativo 1937 en Blanco", filename: "logo-nativo-1937-white.webp", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { element: "Logo Amazon Marketplace", filename: "Amazon_Logotipo.webp", size: "400 × 400 px (1:1)", format: "SVG / WebP", weight: "< 15 KB" },
      { element: "Logo Liverpool Puntos Venta", filename: "Liverpool_Logotipo.webp", size: "400 × 400 px (1:1)", format: "SVG / WebP", weight: "< 15 KB" },
      { element: "Logo Mercado Libre", filename: "Mercado_Libre_Logotipo.webp", size: "400 × 400 px (1:1)", format: "SVG / WebP", weight: "< 15 KB" },
      { element: "Botella Taddel 200ml (Sin fondo)", filename: "taddel_200ml_bottle.webp", size: "1000 × 1500 px (2:3)", format: "WebP / PNG", weight: "< 180 KB" },
      { element: "Botella Marca Privada Maquilas", filename: "botella-tequila-blanco-750ml.webp", size: "1000 × 1500 px (2:3)", format: "WebP / PNG", weight: "< 180 KB" },
    ]
  },
  {
    category: "6. HISTORIA Y LÍNEA DE TIEMPO (ABOUT US)",
    description: "Retratos y fotografías de los orígenes y evolución del grupo empresarial Loy desde 1937.",
    items: [
      { element: "Don Manuel Loy Aceves (1937)", filename: "Don Manuel Loy.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Siembra y Campo Agrícola (PC)", filename: "siembra-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Siembra y Campo Agrícola (Móvil)", filename: "siembra-movil.webp", size: "200 × 200 px (1:1)", format: "WebP", weight: "< 12 KB" },
      { element: "IPASA Procesos (1963) (PC)", filename: "IPASA-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "IPASA Procesos (Móvil)", filename: "IPASA-movil.webp", size: "200 × 200 px (1:1)", format: "WebP", weight: "< 12 KB" },
      { element: "Grupo ORBE XXI (1985) (PC)", filename: "ORBE-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Grupo ORBE XXI (Móvil)", filename: "ORBE-movil.webp", size: "200 × 200 px (1:1)", format: "WebP", weight: "< 12 KB" },
      { element: "OMEX Alimentaria (1990) (PC)", filename: "OMEX-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "OMEX Alimentaria (Móvil)", filename: "OMEX-movil.webp", size: "200 × 200 px (1:1)", format: "WebP", weight: "< 12 KB" },
      { element: "Teknoagrox Innovación (1992)", filename: "tecno-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Nutriagaves (2004)", filename: "nutriagaves-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "PAOSA Cárnicos (2015)", filename: "paosa-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Carnicerías Loydeal (2017)", filename: "loydeal-escritorio.webp", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { element: "Construcción Planta (2019)", filename: "Construcción Casa Loy Tequilera.webp", size: "600 × 600 px (1:1)", format: "WebP", weight: "< 40 KB" },
      { element: "Planta Terminada (2021)", filename: "Casa Loy Tequilera 2.webp", size: "600 × 600 px (1:1)", format: "WebP", weight: "< 40 KB" },
    ]
  },
  {
    category: "7. BLOG, REDES SOCIALES Y FAVICONS",
    description: "Tarjetas editoriales, imagen para compartir por WhatsApp / redes sociales y accesos directos.",
    items: [
      { element: "Imagen Redes (WhatsApp/FB/LI)", filename: "Jimado Agave Tequilana Weber.webp", size: "1200 × 630 px (1.91:1)", format: "JPG / WebP", weight: "< 250 KB" },
      { element: "Hero de Artículo de Blog", filename: "blog-portada-cultura-tequila.webp", size: "1200 × 630 px (1.91:1)", format: "WebP", weight: "< 110 KB" },
      { element: "Miniatura Tarjeta de Blog", filename: "blog-miniatura-cultura-tequila.webp", size: "600 × 400 px (3:2)", format: "WebP", weight: "< 50 KB" },
      { element: "Favicon Pestaña Navegador", filename: "favicon.svg", size: "Vectorial escalable", format: "SVG", weight: "< 8 KB" },
      { element: "Apple Touch Icon / Acceso móvil", filename: "apple-touch-icon.png", size: "180 × 180 px (1:1)", format: "PNG sólido", weight: "< 20 KB" },
    ]
  }
];

function createHeaderCell(text, widthDxa) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            size: 18, // 9 pt
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text, widthDxa, isEven, align = AlignmentType.LEFT, isBold = false, color = COLOR_SECONDARY, isCode = false) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: isEven ? "FFFFFF" : COLOR_LIGHT_BG },
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: isBold,
            color: color,
            size: isCode ? 16 : 17, // 8.5 pt
            font: isCode ? "Consolas" : "Calibri",
          }),
        ],
      }),
    ],
  });
}

function buildCategoryTable(items) {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell("Elemento / Sección", COL_WIDTHS.ELEMENT),
        createHeaderCell("Nombre de la Imagen (Archivo Actual)", COL_WIDTHS.FILENAME),
        createHeaderCell("Tamaño Óptimo (Ancho×Alto)", COL_WIDTHS.SIZE),
        createHeaderCell("Formato", COL_WIDTHS.FORMAT),
        createHeaderCell("Peso Máximo", COL_WIDTHS.WEIGHT),
      ],
    }),
  ];

  items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    rows.push(
      new TableRow({
        children: [
          createDataCell(item.element, COL_WIDTHS.ELEMENT, isEven, AlignmentType.LEFT, true),
          createDataCell(item.filename, COL_WIDTHS.FILENAME, isEven, AlignmentType.LEFT, false, COLOR_CODE, true),
          createDataCell(item.size, COL_WIDTHS.SIZE, isEven, AlignmentType.CENTER, true, COLOR_PRIMARY),
          createDataCell(item.format, COL_WIDTHS.FORMAT, isEven, AlignmentType.CENTER),
          createDataCell(item.weight, COL_WIDTHS.WEIGHT, isEven, AlignmentType.CENTER, true),
        ],
      })
    );
  });

  return new Table({
    width: { size: 10200, type: WidthType.DXA },
    columnWidths: [
      COL_WIDTHS.ELEMENT,
      COL_WIDTHS.FILENAME,
      COL_WIDTHS.SIZE,
      COL_WIDTHS.FORMAT,
      COL_WIDTHS.WEIGHT,
    ],
    rows,
  });
}

// Build Document Children
const docChildren = [];

// Header Title Block
docChildren.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 60 },
    children: [
      new TextRun({
        text: "CASA LOY TEQUILERA",
        size: 38,
        bold: true,
        color: COLOR_PRIMARY,
        font: "Georgia",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: "INVENTARIO OFICIAL DE IMÁGENES: NOMBRES, TAMAÑOS Y FORMATOS",
        size: 22,
        bold: true,
        color: COLOR_SECONDARY,
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 220 },
    children: [
      new TextRun({
        text: "Relación exacta de archivos actuales en el sitio web con sus dimensiones óptimas en píxeles y peso objetivo",
        size: 19,
        italics: true,
        color: COLOR_MUTED,
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    border: {
      bottom: { color: COLOR_PRIMARY, size: 12, style: BorderStyle.SINGLE },
    },
  })
);

// Quick summary note
docChildren.push(
  new Paragraph({
    spacing: { before: 80, after: 60 },
    children: [
      new TextRun({
        text: "CÓMO CONSULTAR ESTE DOCUMENTO:",
        bold: true,
        size: 20,
        color: COLOR_PRIMARY,
      }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 50 },
    children: [
      new TextRun({ text: "Columna 'Nombre de la Imagen': ", bold: true }),
      new TextRun({ text: "Contiene el nombre exacto del archivo tal cual está guardado en la carpeta " }),
      new TextRun({ text: "public/", font: "Consolas", bold: true }),
      new TextRun({ text: " del sitio web." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 50 },
    children: [
      new TextRun({ text: "Columna 'Tamaño Óptimo': ", bold: true }),
      new TextRun({ text: "Es la resolución exacta en píxeles (Ancho × Alto) a la que debe redimensionarse la imagen para evitar distorsiones." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "Columna 'Peso Máximo': ", bold: true }),
      new TextRun({ text: "Es el límite de kilobytes para que la página cargue en menos de 2 segundos en celulares y logre 95+ en Google PageSpeed." }),
    ],
  })
);

// Iterate through categories
sectionsData.forEach((sec) => {
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 260, after: 60 },
      children: [
        new TextRun({
          text: sec.category,
          bold: true,
          size: 22,
          color: COLOR_PRIMARY,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: sec.description,
          size: 18,
          italics: true,
          color: COLOR_MUTED,
        }),
      ],
    }),
    buildCategoryTable(sec.items)
  );
});

// Final footer note
docChildren.push(
  new Paragraph({
    spacing: { before: 350, after: 100 },
    border: {
      top: { color: COLOR_BORDER, size: 6, style: BorderStyle.SINGLE },
    },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Casa Loy Tequilera  •  NOM 1633  •  Ayotlán, Jalisco, México  •  Control de Calidad Web",
        size: 17,
        color: COLOR_MUTED,
        italics: true,
      }),
    ],
  })
);

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Calibri",
          color: COLOR_SECONDARY,
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          orientation: PageOrientation.PORTRAIT,
          margin: { top: 900, bottom: 900, left: 1000, right: 1000 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "CASA LOY TEQUILERA  |  INVENTARIO DE IMÁGENES Y ESPECIFICACIONES",
                  size: 15,
                  color: COLOR_PRIMARY,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Casa Loy Tequilera — Manual Técnico de Assets Web",
                  size: 15,
                  color: COLOR_MUTED,
                }),
              ],
            }),
          ],
        }),
      },
      children: docChildren,
    },
  ],
});

// Write Word Document
const wordPath = path.join(__dirname, '..', 'Casa_Loy_Especificaciones_Imagenes_Web.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(wordPath, buf);
  console.log('Documento Word (.docx) actualizado con éxito en:', wordPath);
});

// Also update Excel Spreadsheet (.xlsx)
const excelRows = [];
excelRows.push([
  "Sección / Categoría",
  "Elemento / Ubicación",
  "Nombre de la Imagen (Archivo Actual en public/)",
  "Tamaño Óptimo (Ancho × Alto)",
  "Formato Recomendado",
  "Peso Máximo Óptimo",
  "Estrategia de Carga"
]);

sectionsData.forEach((sec) => {
  sec.items.forEach((item) => {
    excelRows.push([
      sec.category,
      item.element,
      item.filename,
      item.size,
      item.format,
      item.weight,
      item.weight.includes("180") || item.weight.includes("110") ? "Prioridad Alta (Hero LCP)" : "Lazy Loading (Carga bajo demanda)"
    ]);
  });
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(excelRows);

ws['!cols'] = [
  { wch: 38 },
  { wch: 32 },
  { wch: 45 },
  { wch: 25 },
  { wch: 14 },
  { wch: 16 },
  { wch: 30 }
];

XLSX.utils.book_append_sheet(wb, ws, "Inventario de Imágenes");
const excelPath = path.join(__dirname, '..', 'Casa_Loy_Listado_Imagenes_Web.xlsx');
XLSX.writeFile(wb, excelPath);
console.log('Archivo Excel (.xlsx) actualizado con éxito en:', excelPath);
