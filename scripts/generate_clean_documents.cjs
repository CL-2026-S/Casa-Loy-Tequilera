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

// Styling colors
const COLOR_PRIMARY = "8C4723";   // Terracotta Casa Loy
const COLOR_SECONDARY = "1A1615"; // Dark Charcoal
const COLOR_LIGHT_BG = "FBF9F5";  // Warm cream tint
const COLOR_BORDER = "D3CCC0";    // Light subtle border
const COLOR_MUTED = "555555";     // Dark gray for notes

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
  ELEMENT: 3500, // 34.3%
  DEVICE: 1800,  // 17.6%
  SIZE: 2200,    // 21.6%
  FORMAT: 1200,  // 11.8%
  WEIGHT: 1500,  // 14.7%
};

const sectionsData = [
  {
    category: "1. BANNERS PRINCIPALES Y PORTADAS (HERO)",
    description: "Imágenes de primer pantallazo (Home, Maquilas, Nativo 1937, Turismo, Nosotros y Bolsa de Trabajo).",
    items: [
      { name: "Hero Portada - Escritorio", device: "PC / Laptop", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 180 KB" },
      { name: "Hero Portada - Móvil", device: "Smartphone vertical", size: "1080 × 1920 px (9:16)", format: "WebP", weight: "< 110 KB" },
      { name: "Hero Portada - Pantallas Retina", device: "Monitores 2K / 4K", size: "2560 × 1440 px (16:9)", format: "WebP", weight: "< 280 KB" },
      { name: "Banners Secundarios / Parallax / CTA", device: "Escritorio panorámico", size: "1920 × 600 px (3.2:1)", format: "WebP", weight: "< 130 KB" },
    ]
  },
  {
    category: "2. PROCESO TEQUILERO Y PLANTA INDUSTRIAL (MAQUILAS)",
    description: "Fotografías de Jima, Hornos, Molienda con Tahona, Fermentación, Destilación, Cavas y Laboratorio.",
    items: [
      { name: "Proceso Tequilero (Tarjeta horizontal)", device: "Escritorio / Tablet", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 120 KB" },
      { name: "Proceso Tequilero (Tarjeta vertical)", device: "Mampostería / Rejilla", size: "960 × 1280 px (3:4)", format: "WebP", weight: "< 110 KB" },
      { name: "Proceso Tequilero - Versión Móvil", device: "Smartphones", size: "800 × 600 px (4:3)", format: "WebP", weight: "< 75 KB" },
      { name: "Certificaciones / Laboratorio QA", device: "Todo dispositivo", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
    ]
  },
  {
    category: "3. RESTAURANTE 1937 NATIVO (GASTRONOMÍA Y ESPACIOS)",
    description: "Fotografía culinaria del menú, coctelería, arquitectura del restaurante, murales y cavas.",
    items: [
      { name: "Platillos y Cocteles (Tarjeta Menú)", device: "Todo dispositivo", size: "1080 × 1350 px (4:5)", format: "WebP", weight: "< 120 KB" },
      { name: "Platillos y Entradas (Formato cuadrado)", device: "Galerías cuadradas", size: "1200 × 1200 px (1:1)", format: "WebP", weight: "< 100 KB" },
      { name: "Salones, Terrazas y Murales", device: "Galería horizontal", size: "1920 × 1080 px (16:9)", format: "WebP", weight: "< 160 KB" },
      { name: "Boutique y Cava de Altura", device: "Fotografía vertical", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 180 KB" },
      { name: "Retrato del Chef y Equipo", device: "Ficha de personal", size: "800 × 1000 px (4:5)", format: "WebP", weight: "< 80 KB" },
    ]
  },
  {
    category: "4. TURISMO, EXPERIENCIAS Y CATAS",
    description: "Paquetes turísticos (Diamante, Platino, Oro), catas maridaje, cavas subterráneas y terraza de agave.",
    items: [
      { name: "Paquetes de Experiencias (Portada)", device: "Tarjeta de tour", size: "1200 × 800 px (3:2)", format: "WebP", weight: "< 110 KB" },
      { name: "Cava de Barricas y Columpio", device: "Detalle vertical", size: "1200 × 1800 px (2:3)", format: "WebP", weight: "< 170 KB" },
      { name: "Terraza TADDEL y Paisaje de Agave", device: "Vista panorámica", size: "1920 × 1280 px (3:2)", format: "WebP", weight: "< 150 KB" },
    ]
  },
  {
    category: "5. LOGOTIPOS, MARCAS Y CATÁLOGO DE PRODUCTOS",
    description: "Identidad visual de Casa Loy, marcas de la casa (TADDEL, Tierra Zafiro), retailers y renders de botella.",
    items: [
      { name: "Logo Oficial Casa Loy (Color y Blanco)", device: "Header y Footer", size: "Vectorial (o 600×338)", format: "SVG / WebP", weight: "< 15 KB" },
      { name: "Logos Marcas Propias (TADDEL / Zafiro)", device: "Tarjetas de marca", size: "600 × 600 px (1:1)", format: "SVG / WebP", weight: "< 25 KB" },
      { name: "Logos Clientes y Distribuidores", device: "Rejilla / Carrusel", size: "400 × 400 px (1:1)", format: "SVG / WebP", weight: "< 15 KB" },
      { name: "Botellas Silueteadas (Sin fondo)", device: "Fichas de catálogo", size: "1000 × 1500 px (2:3)", format: "WebP / PNG", weight: "< 180 KB" },
      { name: "Packshot / Bodegón de Botella con fondo", device: "Fotografía de producto", size: "1200 × 1200 px (1:1)", format: "WebP", weight: "< 120 KB" },
    ]
  },
  {
    category: "6. LÍNEA DE TIEMPO / HISTORIA (ABOUT US)",
    description: "Fotografías circulares de la historia familiar y orígenes (Don Manuel Loy, IPASA, ORBE XXI, OMEX).",
    items: [
      { name: "Hito Histórico - Escritorio", device: "PC / Laptop", size: "450 × 450 px (1:1)", format: "WebP", weight: "< 30 KB" },
      { name: "Hito Histórico - Móvil", device: "Smartphones", size: "200 × 200 px (1:1)", format: "WebP", weight: "< 12 KB" },
      { name: "Hito Histórico - Pantallas Retina (@2x)", device: "Monitores HD", size: "600 × 600 px (1:1)", format: "WebP", weight: "< 40 KB" },
    ]
  },
  {
    category: "7. BLOG, REDES SOCIALES Y FAVICONS",
    description: "Artículos editoriales, tarjetas Open Graph para compartir por WhatsApp y accesos directos de navegador.",
    items: [
      { name: "Portada Principal de Artículo de Blog", device: "Hero del post", size: "1200 × 630 px (1.91:1)", format: "WebP", weight: "< 110 KB" },
      { name: "Miniatura en Listado de Artículos", device: "Cuadrícula de noticias", size: "600 × 400 px (3:2)", format: "WebP", weight: "< 50 KB" },
      { name: "Imagen para Redes (WhatsApp, FB, LI)", device: "Compartir enlace", size: "1200 × 630 px (1.91:1)", format: "JPG / WebP", weight: "< 250 KB" },
      { name: "Favicon Web Moderno", device: "Pestaña navegador", size: "Vectorial escalable", format: "SVG", weight: "< 8 KB" },
      { name: "Apple Touch Icon / Acceso móvil", device: "Icono iOS / Android", size: "180 × 180 px (1:1)", format: "PNG sólido", weight: "< 20 KB" },
    ]
  }
];

function createHeaderCell(text, widthDxa) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            size: 19, // 9.5 pt
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text, widthDxa, isEven, align = AlignmentType.LEFT, isBold = false, color = COLOR_SECONDARY) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: isEven ? "FFFFFF" : COLOR_LIGHT_BG },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: isBold,
            color: color,
            size: 18, // 9 pt
            font: "Calibri",
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
        createHeaderCell("Elemento / Imagen", COL_WIDTHS.ELEMENT),
        createHeaderCell("Dispositivo / Ubicación", COL_WIDTHS.DEVICE),
        createHeaderCell("Tamaño Exacto (Ancho × Alto)", COL_WIDTHS.SIZE),
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
          createDataCell(item.name, COL_WIDTHS.ELEMENT, isEven, AlignmentType.LEFT, true),
          createDataCell(item.device, COL_WIDTHS.DEVICE, isEven, AlignmentType.LEFT),
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
      COL_WIDTHS.DEVICE,
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
        text: "MANUAL OFICIAL DE TAMAÑOS, FORMATOS Y OPTIMIZACIÓN DE IMÁGENES",
        size: 22,
        bold: true,
        color: COLOR_SECONDARY,
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 250 },
    children: [
      new TextRun({
        text: "Guía clara por secciones para fotógrafos, diseñadores y desarrolladores web",
        size: 19,
        italics: true,
        color: COLOR_MUTED,
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 250 },
    border: {
      bottom: { color: COLOR_PRIMARY, size: 12, style: BorderStyle.SINGLE },
    },
  })
);

// Quick rules summary box
docChildren.push(
  new Paragraph({
    spacing: { before: 100, after: 80 },
    children: [
      new TextRun({
        text: "REGLAS CLAVE DE OPTIMIZACIÓN:",
        bold: true,
        size: 20,
        color: COLOR_PRIMARY,
      }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({ text: "Formato Estándar: ", bold: true }),
      new TextRun({ text: "Todas las fotos deben exportarse en " }),
      new TextRun({ text: "WebP a calidad 80-82%", bold: true, color: COLOR_PRIMARY }),
      new TextRun({ text: " (reduce el peso un 70% sin perder nitidez)." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({ text: "Logotipos e Iconos: ", bold: true }),
      new TextRun({ text: "Usar siempre formato " }),
      new TextRun({ text: "SVG vectorial", bold: true, color: COLOR_PRIMARY }),
      new TextRun({ text: " (nitidez perfecta y menos de 15 KB)." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "Nombres de archivo: ", bold: true }),
      new TextRun({ text: "Guardar siempre en minúsculas y con guiones (ej. " }),
      new TextRun({ text: "tequila-barricas-roble.webp", italics: true, bold: true }),
      new TextRun({ text: "), evitando espacios y acentos." }),
    ],
  })
);

// Iterate and add each Category Table
sectionsData.forEach((sec, idx) => {
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 240, after: 60 },
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
        text: "Casa Loy Tequilera  •  NOM 1633  •  Ayotlán, Jalisco, México  •  Documento Oficial de Desarrollo Web",
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
          margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "CASA LOY TEQUILERA  |  MANUAL DE IMÁGENES Y OPTIMIZACIÓN WEB",
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
                  text: "Casa Loy Tequilera — Manual Técnico de Optimización Web",
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
  console.log('Documento Word (.docx) creado con éxito en:', wordPath);
});

// ALSO CREATE EXCEL SPREADSHEET (.xlsx) for convenience
const excelRows = [];
excelRows.push([
  "Sección / Categoría",
  "Elemento / Imagen",
  "Dispositivo / Ubicación",
  "Dimensiones Óptimas (Ancho × Alto)",
  "Formato",
  "Peso Máximo Recomendado",
  "Objetivo de Rendimiento"
]);

sectionsData.forEach((sec) => {
  sec.items.forEach((item) => {
    excelRows.push([
      sec.category,
      item.name,
      item.device,
      item.size,
      item.format,
      item.weight,
      item.weight.includes("180") || item.weight.includes("110") ? "Prioridad Alta (Hero LCP)" : "Lazy Loading (Carga bajo demanda)"
    ]);
  });
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(excelRows);

// Set column widths in Excel
ws['!cols'] = [
  { wch: 38 },
  { wch: 35 },
  { wch: 25 },
  { wch: 25 },
  { wch: 12 },
  { wch: 18 },
  { wch: 30 }
];

XLSX.utils.book_append_sheet(wb, ws, "Especificaciones Imágenes");
const excelPath = path.join(__dirname, '..', 'Casa_Loy_Listado_Imagenes_Web.xlsx');
XLSX.writeFile(wb, excelPath);
console.log('Archivo Excel (.xlsx) creado con éxito en:', excelPath);
