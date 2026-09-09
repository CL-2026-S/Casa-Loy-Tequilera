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
  ShadingType
} = require('docx');

const PRIMARY_COLOR = "8C4723"; // Copper / Terracotta
const SECONDARY_COLOR = "1A1615"; // Dark Charcoal
const ACCENT_COLOR = "855C37"; // Warm Bronze
const BG_LIGHT = "F9F7F2"; // Warm Cream
const BORDER_COLOR = "D5CEBF"; // Light border
const TEXT_MUTED = "666666";

const borderThin = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: borderThin,
  bottom: borderThin,
  left: borderThin,
  right: borderThin,
};

// Data for the 30 master items
const masterTableData = [
  { id: "1", section: "Hero Banner Principal (Home, Maquilas, Nativo)", context: "Escritorio Estándar", dims: "1920 × 1080 px", ratio: "16:9", format: "WebP", weight: "< 180 KB", strategy: "fetchpriority=\"high\"" },
  { id: "2", section: "Hero Banner Principal", context: "Móvil (Vertical)", dims: "1080 × 1920 px", ratio: "9:16", format: "WebP", weight: "< 110 KB", strategy: "fetchpriority=\"high\"" },
  { id: "3", section: "Hero Banner Principal", context: "Pantallas Retina / 2K", dims: "2560 × 1440 px", ratio: "16:9", format: "WebP", weight: "< 280 KB", strategy: "fetchpriority=\"high\"" },
  { id: "4", section: "Banners Secundarios / Parallax / CTA", context: "Escritorio Panorámico", dims: "1920 × 600 px", ratio: "3.2:1", format: "WebP", weight: "< 130 KB", strategy: "loading=\"lazy\"" },
  { id: "5", section: "Proceso Tequilero (Jima, Tahona, Destilación)", context: "Tarjeta Horizontal", dims: "1200 × 800 px", ratio: "3:2", format: "WebP", weight: "< 120 KB", strategy: "loading=\"lazy\"" },
  { id: "6", section: "Proceso Tequilero (Mampostería / Tarjeta Alta)", context: "Tarjeta Vertical", dims: "960 × 1280 px", ratio: "3:4", format: "WebP", weight: "< 110 KB", strategy: "loading=\"lazy\"" },
  { id: "7", section: "Proceso Tequilero", context: "Móvil", dims: "800 × 600 px", ratio: "4:3", format: "WebP", weight: "< 75 KB", strategy: "loading=\"lazy\"" },
  { id: "8", section: "Platillos & Coctelería (Restaurante 1937)", context: "Tarjeta Vertical Menú", dims: "1080 × 1350 px", ratio: "4:5", format: "WebP", weight: "< 120 KB", strategy: "loading=\"lazy\"" },
  { id: "9", section: "Platillos & Entradas (Restaurante 1937)", context: "Tarjeta Cuadrada", dims: "1200 × 1200 px", ratio: "1:1", format: "WebP", weight: "< 100 KB", strategy: "loading=\"lazy\"" },
  { id: "10", section: "Espacios, Terrazas y Salones Nativo", context: "Galería Horizontal", dims: "1920 × 1080 px", ratio: "16:9", format: "WebP", weight: "< 160 KB", strategy: "loading=\"lazy\"" },
  { id: "11", section: "Boutique & Cava Vertical Nativo", context: "Fotografía de Altura", dims: "1200 × 1800 px", ratio: "2:3", format: "WebP", weight: "< 180 KB", strategy: "loading=\"lazy\"" },
  { id: "12", section: "Chef & Equipo de Cocina", context: "Retrato Personal", dims: "800 × 1000 px", ratio: "4:5", format: "WebP", weight: "< 80 KB", strategy: "loading=\"lazy\"" },
  { id: "13", section: "Tours & Catas (Diamante, Platino, Oro)", context: "Tarjeta de Paquete", dims: "1200 × 800 px", ratio: "3:2", format: "WebP", weight: "< 110 KB", strategy: "loading=\"lazy\"" },
  { id: "14", section: "Galería de Experiencias (Barricas / Cavas)", context: "Detalle Vertical", dims: "1200 × 1800 px", ratio: "2:3", format: "WebP", weight: "< 170 KB", strategy: "loading=\"lazy\"" },
  { id: "15", section: "Línea de Tiempo / Historia (About Us)", context: "Escritorio (Avatar)", dims: "450 × 450 px", ratio: "1:1", format: "WebP", weight: "< 30 KB", strategy: "loading=\"lazy\"" },
  { id: "16", section: "Línea de Tiempo / Historia", context: "Móvil", dims: "200 × 200 px", ratio: "1:1", format: "WebP", weight: "< 12 KB", strategy: "loading=\"lazy\"" },
  { id: "17", section: "Línea de Tiempo / Historia", context: "Pantallas Retina (@2x)", dims: "600 × 600 px", ratio: "1:1", format: "WebP", weight: "< 40 KB", strategy: "loading=\"lazy\"" },
  { id: "18", section: "Logo Principal Casa Loy (Header y Footer)", context: "Todo dispositivo", dims: "Vectorial (o 600×338)", ratio: "Libre", format: "SVG / WebP", weight: "< 15 KB", strategy: "Inmediata" },
  { id: "19", section: "Logos de Marcas Propias (TADDEL, Zafiro)", context: "Tarjetas de Marca", dims: "600 × 600 px", ratio: "1:1", format: "SVG / WebP", weight: "< 25 KB", strategy: "loading=\"lazy\"" },
  { id: "20", section: "Logos Clientes & Retailers (Amazon, Liverpool)", context: "Carrusel / Rejilla", dims: "400 × 400 px", ratio: "1:1", format: "SVG / WebP", weight: "< 15 KB", strategy: "loading=\"lazy\"" },
  { id: "21", section: "Botellas & Productos (Fondo Transparente)", context: "Ficha / Catálogo B2B", dims: "1000 × 1500 px", ratio: "2:3", format: "WebP / PNG", weight: "< 180 KB", strategy: "loading=\"lazy\"" },
  { id: "22", section: "Packshot / Bodegón de Producto", context: "Cuadrada con fondo", dims: "1200 × 1200 px", ratio: "1:1", format: "WebP", weight: "< 120 KB", strategy: "loading=\"lazy\"" },
  { id: "23", section: "Blog / Noticias", context: "Portada Hero del Post", dims: "1200 × 630 px", ratio: "1.91:1", format: "WebP", weight: "< 110 KB", strategy: "fetchpriority=\"high\"" },
  { id: "24", section: "Blog / Noticias", context: "Tarjeta de Listado", dims: "600 × 400 px", ratio: "3:2", format: "WebP", weight: "< 50 KB", strategy: "loading=\"lazy\"" },
  { id: "25", section: "Blog / Noticias", context: "Fotos de Contenido", dims: "1200 × 800 px", ratio: "3:2", format: "WebP", weight: "< 95 KB", strategy: "loading=\"lazy\"" },
  { id: "26", section: "Open Graph / Redes Sociales (WhatsApp, FB, LI)", context: "Compartir Enlace", dims: "1200 × 630 px", ratio: "1.91:1", format: "JPG o WebP", weight: "< 250 KB", strategy: "N/A (Meta Tag)" },
  { id: "27", section: "Favicon Web Moderno", context: "Pestaña Navegador", dims: "Vectorial", ratio: "1:1", format: "SVG", weight: "< 8 KB", strategy: "Inmediata" },
  { id: "28", section: "Favicon Tradicional", context: "Navegadores Legacy", dims: "32 × 32 px (multi)", ratio: "1:1", format: "ICO", weight: "< 15 KB", strategy: "Inmediata" },
  { id: "29", section: "Apple Touch Icon", context: "Acceso directo iOS", dims: "180 × 180 px", ratio: "1:1", format: "PNG sólido", weight: "< 20 KB", strategy: "Inmediata" },
  { id: "30", section: "Android App / PWA Icon", context: "Pantalla de inicio", dims: "512 × 512 px", ratio: "1:1", format: "PNG", weight: "< 45 KB", strategy: "Inmediata" },
];

function createHeaderCell(text, widthPercent) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: PRIMARY_COLOR },
    margins: { top: 120, bottom: 120, left: 100, right: 100 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            size: 18, // 9pt
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text, widthPercent, isEven, align = AlignmentType.LEFT, isBold = false) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: isEven ? "FFFFFF" : BG_LIGHT },
    margins: { top: 90, bottom: 90, left: 100, right: 100 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: isBold,
            color: SECONDARY_COLOR,
            size: 17, // 8.5pt
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

// Build table rows
const tableRows = [
  new TableRow({
    tableHeader: true,
    children: [
      createHeaderCell("#", 4),
      createHeaderCell("Sección / Elemento", 24),
      createHeaderCell("Dispositivo / Contexto", 16),
      createHeaderCell("Dimensiones Óptimas", 15),
      createHeaderCell("Ratio", 7),
      createHeaderCell("Formato", 10),
      createHeaderCell("Peso Máx.", 10),
      createHeaderCell("Estrategia de Carga", 14),
    ],
  }),
];

masterTableData.forEach((item, index) => {
  const isEven = index % 2 === 0;
  tableRows.push(
    new TableRow({
      children: [
        createDataCell(item.id, 4, isEven, AlignmentType.CENTER, true),
        createDataCell(item.section, 24, isEven, AlignmentType.LEFT, true),
        createDataCell(item.context, 16, isEven, AlignmentType.LEFT),
        createDataCell(item.dims, 15, isEven, AlignmentType.CENTER, true),
        createDataCell(item.ratio, 7, isEven, AlignmentType.CENTER),
        createDataCell(item.format, 10, isEven, AlignmentType.CENTER),
        createDataCell(item.weight, 10, isEven, AlignmentType.CENTER),
        createDataCell(item.strategy, 14, isEven, AlignmentType.CENTER),
      ],
    })
  );
});

const masterTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: tableRows,
});

// Create Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Calibri",
          color: SECONDARY_COLOR,
        },
      },
    },
  },
  sections: [
    // SECTION 1: Portrait Cover & Introduction & Formats
    {
      properties: {
        page: {
          orientation: PageOrientation.PORTRAIT,
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "CASA LOY TEQUILERA  |  MANUAL DE OPTIMIZACIÓN DE ASSETS WEB",
                  size: 16,
                  color: PRIMARY_COLOR,
                  bold: true,
                  font: "Calibri",
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
                  text: "Página 1  •  NOM 1633  •  Documento Confidencial de Arquitectura Web",
                  size: 16,
                  color: TEXT_MUTED,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: "CASA LOY TEQUILERA",
              size: 40, // 20pt
              bold: true,
              color: PRIMARY_COLOR,
              font: "Georgia",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "ESPECIFICACIONES TÉCNICAS Y LISTADO MAESTRO DE IMÁGENES WEB",
              size: 24, // 12pt
              bold: true,
              color: SECONDARY_COLOR,
              font: "Calibri",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "Guía de Dimensiones, Formatos, Pesos Máximos y Rendimiento (Core Web Vitals / PageSpeed 95+)",
              size: 20,
              italics: true,
              color: TEXT_MUTED,
              font: "Calibri",
            }),
          ],
        }),

        // Horizontal Line divider
        new Paragraph({
          spacing: { after: 300 },
          border: {
            bottom: { color: PRIMARY_COLOR, size: 12, style: BorderStyle.SINGLE },
          },
        }),

        // Section 1: Introduction
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: "1. OBJETIVO DE LA OPTIMIZACIÓN",
              bold: true,
              size: 24,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "El propósito de esta guía es establecer los estándares oficiales para la preparación, exportación e integración de todas las imágenes del ecosistema digital de Casa Loy Tequilera (Portal Institucional, Maquilas B2B, Restaurante 1937 Nativo, Turismo y Marcas).",
              size: 20,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "El cumplimiento de estas medidas garantiza una calificación superior a 95 puntos en Google PageSpeed Insights, un Largest Contentful Paint (LCP) inferior a 2.0 segundos y una experiencia visual de lujo sin degradación en pantallas Retina 4K.",
              size: 20,
            }),
          ],
        }),

        // Section 2: Formats Table
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
          children: [
            new TextRun({
              text: "2. FORMATOS RECOMENDADOS SEGÚN EL TIPO DE ASSET",
              bold: true,
              size: 24,
              color: PRIMARY_COLOR,
            }),
          ],
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                createHeaderCell("Formato", 15),
                createHeaderCell("Uso Principal en el Sitio", 40),
                createHeaderCell("Compresión / Configuración", 25),
                createHeaderCell("Peso Máximo", 20),
              ],
            }),
            new TableRow({
              children: [
                createDataCell("WebP", 15, true, AlignmentType.CENTER, true),
                createDataCell("Fotografías generales, campos de agave, cavas, platillos, retratos y fondos de pantalla.", 40, true),
                createDataCell("Calidad 80% – 82% (Lossy)", 25, true, AlignmentType.CENTER),
                createDataCell("< 180 KB", 20, true, AlignmentType.CENTER, true),
              ],
            }),
            new TableRow({
              children: [
                createDataCell("SVG", 15, false, AlignmentType.CENTER, true),
                createDataCell("Logotipos (Casa Loy, Taddel, Nativo), iconos de navegación, sellos NOM 1633 y certificados.", 40, false),
                createDataCell("Vectorial limpio (optimizado SVGO)", 25, false, AlignmentType.CENTER),
                createDataCell("< 15 KB", 20, false, AlignmentType.CENTER, true),
              ],
            }),
            new TableRow({
              children: [
                createDataCell("PNG (24-bit)", 15, true, AlignmentType.CENTER, true),
                createDataCell("Botellas silueteadas con transparencia estricta o empaques sin fondo cuando se requiera.", 40, true),
                createDataCell("Compresión con TinyPNG / Oxipng", 25, true, AlignmentType.CENTER),
                createDataCell("< 200 KB", 20, true, AlignmentType.CENTER, true),
              ],
            }),
            new TableRow({
              children: [
                createDataCell("JPG", 15, false, AlignmentType.CENTER, true),
                createDataCell("Imagen Open Graph para compartir en WhatsApp, Facebook, LinkedIn y Twitter (fallback universal).", 40, false),
                createDataCell("Calidad 85% progresivo", 25, false, AlignmentType.CENTER),
                createDataCell("< 250 KB", 20, false, AlignmentType.CENTER, true),
              ],
            }),
          ],
        }),

        // Golden rules
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
          children: [
            new TextRun({
              text: "3. TRES REGLAS DE ORO PARA EL EQUIPO DE DISEÑO Y DESARROLLO",
              bold: true,
              size: 24,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "1. Prioridad de Carga Selectiva: ", bold: true }),
            new TextRun({ text: "Únicamente las imágenes visibles en el primer pantallazo (Hero Banners principales) deben cargar con " }),
            new TextRun({ text: "fetchpriority=\"high\"", italics: true, bold: true }),
            new TextRun({ text: ". Todas las demás imágenes del sitio deben llevar obligatoriamente " }),
            new TextRun({ text: "loading=\"lazy\" decoding=\"async\"", italics: true, bold: true }),
            new TextRun({ text: "." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "2. Cero Desplazamiento de Diseño (Evitar CLS): ", bold: true }),
            new TextRun({ text: "Toda etiqueta <img> debe tener definidos sus atributos numéricos " }),
            new TextRun({ text: "width", italics: true, bold: true }),
            new TextRun({ text: " y " }),
            new TextRun({ text: "height", italics: true, bold: true }),
            new TextRun({ text: ", o clases de aspect-ratio en CSS, para que el navegador reserve el espacio antes de la descarga." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "3. Nombres de Archivo Semánticos para SEO: ", bold: true }),
            new TextRun({ text: "Evitar nombres con espacios, mayúsculas o acentos (ej. 'Añejamiento Barricas.webp'). Usar siempre minúsculas con guiones y palabras clave: " }),
            new TextRun({ text: "tequila-reposado-barricas-roble-casa-loy.webp", italics: true, bold: true }),
            new TextRun({ text: "." }),
          ],
        }),
      ],
    },

    // SECTION 2: Landscape Master Table (All 30 Items)
    {
      properties: {
        page: {
          orientation: PageOrientation.LANDSCAPE,
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
                  text: "CASA LOY TEQUILERA  |  LISTADO MAESTRO DE TAMAÑOS Y PESOS ÓPTIMOS",
                  size: 16,
                  color: PRIMARY_COLOR,
                  bold: true,
                  font: "Calibri",
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
                  text: "Página 2  •  Tabla Maestra de Producción  •  Casa Loy Tequilera",
                  size: 16,
                  color: TEXT_MUTED,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 100, after: 150 },
          children: [
            new TextRun({
              text: "4. LISTADO MAESTRO UNIFICADO DE IMÁGENES Y ESPECIFICACIONES",
              bold: true,
              size: 26,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "La siguiente tabla resume todas las dimensiones exactas en píxeles, proporciones, formatos admitidos, pesos objetivo y estrategias de carga para el 100% de los elementos del sitio web:",
              size: 19,
              color: TEXT_MUTED,
            }),
          ],
        }),
        masterTable,
      ],
    },

    // SECTION 3: Implementation Code & Technical Reference
    {
      properties: {
        page: {
          orientation: PageOrientation.PORTRAIT,
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "CASA LOY TEQUILERA  |  IMPLEMENTACIÓN TÉCNICA EN CÓDIGO",
                  size: 16,
                  color: PRIMARY_COLOR,
                  bold: true,
                  font: "Calibri",
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
                  text: "Página 3  •  Guía para Desarrolladores  •  Casa Loy Tequilera",
                  size: 16,
                  color: TEXT_MUTED,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
          children: [
            new TextRun({
              text: "5. PLANTILLA DE CÓDIGO RESPONSIVE (<picture>)",
              bold: true,
              size: 24,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({
              text: "Para garantizar que los smartphones descarguen la versión vertical (9:16) y las pantallas Retina reciban la máxima nitidez sin penalizar el tiempo de carga móvil, se debe aplicar este estándar en los banners principales:",
              size: 20,
            }),
          ],
        }),

        // Code block box
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
                  margins: { top: 150, bottom: 150, left: 150, right: 150 },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "<picture>\n" +
                                "  <!-- Smartphone en formato vertical (1080x1920) -->\n" +
                                "  <source media=\"(max-width: 768px)\" srcset=\"/banner-casa-loy-movil.webp\" />\n\n" +
                                "  <!-- Pantallas Retina / 2K de alta densidad -->\n" +
                                "  <source \n" +
                                "    media=\"(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)\"\n" +
                                "    srcset=\"/banner-casa-loy-retina.webp\"\n" +
                                "  />\n\n" +
                                "  <!-- Escritorio estándar 1920x1080 (fallback universal) -->\n" +
                                "  <img\n" +
                                "    src=\"/banner-casa-loy-escritorio.webp\"\n" +
                                "    alt=\"Instalaciones y planta de destilación Casa Loy Tequilera en Jalisco NOM 1633\"\n" +
                                "    width=\"1920\"\n" +
                                "    height=\"1080\"\n" +
                                "    fetchpriority=\"high\"\n" +
                                "    class=\"w-full h-full object-cover\"\n" +
                                "  />\n" +
                                "</picture>",
                          font: "Consolas",
                          size: 18,
                          color: "222222",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
          children: [
            new TextRun({
              text: "6. CHECKLIST DE PRE-PUBLICACIÓN PARA NUEVOS ASSETS",
              bold: true,
              size: 24,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "[  ] ", bold: true }),
            new TextRun({ text: "Formato WebP verificado a calidad 80-82% con compresión lossy." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "[  ] ", bold: true }),
            new TextRun({ text: "Peso dentro del umbral recomendado (< 180 KB en escritorio, < 110 KB en móvil)." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "[  ] ", bold: true }),
            new TextRun({ text: "Nombre de archivo en minúsculas, sin espacios, sin acentos y con palabras clave SEO." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "[  ] ", bold: true }),
            new TextRun({ text: "Atributo alt descriptivo con contexto del producto, proceso o instalación." }),
          ],
        }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "[  ] ", bold: true }),
            new TextRun({ text: "Estrategia de carga asignada: fetchpriority=\"high\" si es portada, o loading=\"lazy\" si es sección interior." }),
          ],
        }),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, '..', 'Casa_Loy_Especificaciones_Imagenes_Web.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log('Documento creado exitosamente en:', outputPath);
}).catch((err) => {
  console.error('Error generando documento:', err);
});
