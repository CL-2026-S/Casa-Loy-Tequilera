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

const COLOR_PRIMARY = "8C4723";   // Terracotta Casa Loy
const COLOR_SECONDARY = "1A1615"; // Dark Charcoal
const COLOR_LIGHT_BG = "FBF9F5";  // Warm cream tint
const COLOR_BORDER = "D3CCC0";    // Light subtle border
const COLOR_MUTED = "555555";     // Dark gray
const COLOR_CODE = "2D3748";      // Code text

const borderThin = { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER };
const cellBorders = { top: borderThin, bottom: borderThin, left: borderThin, right: borderThin };

// Column widths for 6-column 3-tier view (total = 10,200 dxa)
const COL_WIDTHS_3TIER = {
  TYPE: 2400,    // 23.5%
  MOBILE: 1800,  // 17.6%
  DESKTOP: 1900, // 18.6%
  RETINA: 1900,  // 18.6%
  FORMAT: 1000,  // 9.8%
  WEIGHTS: 1200, // 11.8%
};

const threeTierData = [
  {
    type: "1. Hero Banners Principales (Full Screen)",
    mobile: "1080 × 1920 px (9:16 vertical)",
    desktop: "1920 × 1080 px (16:9)",
    retina: "2560 × 1440 px (2K/QHD)",
    format: "WebP",
    weights: "< 110 / 180 / 280 KB"
  },
  {
    type: "2. Banners Secundarios / Parallax / CTA",
    mobile: "800 × 800 px (1:1 cuadrado)",
    desktop: "1920 × 600 px (3.2:1)",
    retina: "2560 × 800 px (3.2:1)",
    format: "WebP",
    weights: "< 70 / 130 / 200 KB"
  },
  {
    type: "3. Proceso Tequilero (Tarjetas Horizontales)",
    mobile: "800 × 600 px (4:3)",
    desktop: "1200 × 800 px (3:2)",
    retina: "1920 × 1280 px (3:2 @2x)",
    format: "WebP",
    weights: "< 75 / 120 / 190 KB"
  },
  {
    type: "4. Proceso Tequilero (Tarjetas Verticales)",
    mobile: "600 × 800 px (3:4)",
    desktop: "960 × 1280 px (3:4)",
    retina: "1440 × 1920 px (3:4 @2x)",
    format: "WebP",
    weights: "< 65 / 110 / 180 KB"
  },
  {
    type: "5. Platillos Restaurante 1937 (Menú)",
    mobile: "800 × 1000 px (4:5)",
    desktop: "1080 × 1350 px (4:5)",
    retina: "1440 × 1800 px (4:5 @2x)",
    format: "WebP",
    weights: "< 75 / 120 / 190 KB"
  },
  {
    type: "6. Salones y Terrazas Restaurante",
    mobile: "1080 × 1080 px (1:1)",
    desktop: "1920 × 1080 px (16:9)",
    retina: "2560 × 1440 px (16:9)",
    format: "WebP",
    weights: "< 90 / 160 / 260 KB"
  },
  {
    type: "7. Cavas y Galerías Verticales de Altura",
    mobile: "800 × 1200 px (2:3)",
    desktop: "1200 × 1800 px (2:3)",
    retina: "1600 × 2400 px (2:3 @2x)",
    format: "WebP",
    weights: "< 95 / 180 / 270 KB"
  },
  {
    type: "8. Paquetes de Turismo (Diamante/Platino/Oro)",
    mobile: "800 × 600 px (4:3)",
    desktop: "1200 × 800 px (3:2)",
    retina: "1920 × 1280 px (3:2 @2x)",
    format: "WebP",
    weights: "< 70 / 110 / 180 KB"
  },
  {
    type: "9. Botellas Silueteadas (Fondo Transparente)",
    mobile: "600 × 900 px (2:3)",
    desktop: "1000 × 1500 px (2:3)",
    retina: "1400 × 2100 px (2:3 @2x)",
    format: "WebP / PNG",
    weights: "< 80 / 180 / 260 KB"
  },
  {
    type: "10. Packshot / Bodegón de Botella Cuadrado",
    mobile: "800 × 800 px (1:1)",
    desktop: "1200 × 1200 px (1:1)",
    retina: "1600 × 1600 px (1:1 @2x)",
    format: "WebP",
    weights: "< 70 / 120 / 190 KB"
  },
  {
    type: "11. Línea de Tiempo / Historia (Avatares)",
    mobile: "200 × 200 px (1:1)",
    desktop: "450 × 450 px (1:1)",
    retina: "600 × 600 px (1:1 @2x)",
    format: "WebP",
    weights: "< 12 / 30 / 45 KB"
  },
  {
    type: "12. Logotipos Oficiales y de Marcas",
    mobile: "SVG (o 200×200 px)",
    desktop: "Vectorial SVG (o 600×338)",
    retina: "Vectorial SVG (Infinito)",
    format: "SVG / WebP",
    weights: "< 15 KB (vectorial)"
  },
  {
    type: "13. Portada Hero de Blog / Noticias",
    mobile: "800 × 450 px (16:9)",
    desktop: "1200 × 630 px (1.91:1)",
    retina: "1600 × 840 px (1.91:1)",
    format: "WebP",
    weights: "< 65 / 110 / 170 KB"
  },
  {
    type: "14. Redes Sociales / WhatsApp (Open Graph)",
    mobile: "1200 × 630 px (Universal)",
    desktop: "1200 × 630 px (Universal)",
    retina: "1200 × 630 px (Área 1080×566)",
    format: "JPG / WebP",
    weights: "< 250 KB (Meta Tag)"
  },
  {
    type: "15. Favicon y Accesos Móviles (PWA / iOS)",
    mobile: "180 × 180 px (Apple Icon)",
    desktop: "Vectorial (SVG) + 32×32 (ICO)",
    retina: "512 × 512 px (PWA HD)",
    format: "SVG / PNG",
    weights: "< 8 KB / < 35 KB"
  }
];

function createHeaderCell(text, widthDxa) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
    margins: { top: 120, bottom: 120, left: 100, right: 100 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text, bold: true, color: "FFFFFF", size: 17, font: "Calibri" }),
        ],
      }),
    ],
  });
}

function createDataCell(text, widthDxa, isEven, align = AlignmentType.LEFT, isBold = false, color = COLOR_SECONDARY) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: isEven ? "FFFFFF" : COLOR_LIGHT_BG },
    margins: { top: 85, bottom: 85, left: 100, right: 100 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({ text, bold: isBold, color, size: 16, font: "Calibri" }),
        ],
      }),
    ],
  });
}

// Build 3-tier comparative table
const rows3Tier = [
  new TableRow({
    tableHeader: true,
    children: [
      createHeaderCell("Tipo de Imagen", COL_WIDTHS_3TIER.TYPE),
      createHeaderCell("Vista Móvil (Celular)", COL_WIDTHS_3TIER.MOBILE),
      createHeaderCell("Escritorio (PC/Laptop)", COL_WIDTHS_3TIER.DESKTOP),
      createHeaderCell("Retina / HiDPI (@2x)", COL_WIDTHS_3TIER.RETINA),
      createHeaderCell("Formato", COL_WIDTHS_3TIER.FORMAT),
      createHeaderCell("Pesos Máx. (M/E/R)", COL_WIDTHS_3TIER.WEIGHTS),
    ],
  }),
];

threeTierData.forEach((item, idx) => {
  const isEven = idx % 2 === 0;
  rows3Tier.push(
    new TableRow({
      children: [
        createDataCell(item.type, COL_WIDTHS_3TIER.TYPE, isEven, AlignmentType.LEFT, true),
        createDataCell(item.mobile, COL_WIDTHS_3TIER.MOBILE, isEven, AlignmentType.CENTER, true, COLOR_PRIMARY),
        createDataCell(item.desktop, COL_WIDTHS_3TIER.DESKTOP, isEven, AlignmentType.CENTER, true, COLOR_SECONDARY),
        createDataCell(item.retina, COL_WIDTHS_3TIER.RETINA, isEven, AlignmentType.CENTER, true, "7A3D1E"),
        createDataCell(item.format, COL_WIDTHS_3TIER.FORMAT, isEven, AlignmentType.CENTER),
        createDataCell(item.weights, COL_WIDTHS_3TIER.WEIGHTS, isEven, AlignmentType.CENTER, false, COLOR_MUTED),
      ],
    })
  );
});

const threeTierTable = new Table({
  width: { size: 10200, type: WidthType.DXA },
  columnWidths: [
    COL_WIDTHS_3TIER.TYPE,
    COL_WIDTHS_3TIER.MOBILE,
    COL_WIDTHS_3TIER.DESKTOP,
    COL_WIDTHS_3TIER.RETINA,
    COL_WIDTHS_3TIER.FORMAT,
    COL_WIDTHS_3TIER.WEIGHTS,
  ],
  rows: rows3Tier,
});

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
        text: "GUÍA MAESTRA DE DIMENSIONES: MÓVIL, ESCRITORIO Y RETINA (@2X)",
        size: 22,
        bold: true,
        color: COLOR_SECONDARY,
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: "Dimensiones exactas en píxeles y pesos máximos para lograr la máxima nitidez visual con calificación 95+ en PageSpeed",
        size: 18,
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

// Explanatory box
docChildren.push(
  new Paragraph({
    spacing: { before: 50, after: 50 },
    children: [
      new TextRun({
        text: "POR QUÉ USAR 3 DIMENSIONES POR IMAGEN:",
        bold: true,
        size: 20,
        color: COLOR_PRIMARY,
      }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({ text: "1. Vista Móvil (Celulares): ", bold: true }),
      new TextRun({ text: "Los teléfonos se usan en posición vertical. Si usas una foto panorámica de escritorio, se verá minúscula o recortada. Las imágenes móviles usan proporción vertical (" }),
      new TextRun({ text: "9:16 o 4:5", bold: true }),
      new TextRun({ text: ") y pesos ultra ligeros (< 110 KB) para cargar al instante en 4G/5G." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({ text: "2. Vista Escritorio (PC / Laptops): ", bold: true }),
      new TextRun({ text: "Diseñada a escala 1x para pantallas panorámicas estándar (" }),
      new TextRun({ text: "1920 × 1080 px", bold: true }),
      new TextRun({ text: "), con compresión WebP al 80-82% para mantener la agilidad de navegación." }),
    ],
  }),
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "3. Vista Retina / HiDPI (@2x): ", bold: true }),
      new TextRun({ text: "Para dispositivos Apple (MacBook, iPhone, iPad) y monitores 2K/4K que tienen el doble de densidad de píxeles. Se exportan a " }),
      new TextRun({ text: "2560 × 1440 px", bold: true }),
      new TextRun({ text: " para evitar cualquier pixelación o borrosidad." }),
    ],
  })
);

// Add 3-Tier Comparative Master Table
docChildren.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 150, after: 120 },
    children: [
      new TextRun({
        text: "TABLA COMPARATIVA DE DIMENSIONES: MÓVIL vs ESCRITORIO vs RETINA",
        bold: true,
        size: 22,
        color: COLOR_PRIMARY,
      }),
    ],
  }),
  threeTierTable
);

// Code example box
docChildren.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 260, after: 100 },
    children: [
      new TextRun({
        text: "CÓMO SE IMPLEMENTA EN CÓDIGO CON LA ETIQUETA <picture>",
        bold: true,
        size: 20,
        color: COLOR_PRIMARY,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: "El navegador selecciona automáticamente el archivo ideal según la pantalla del visitante sin desperdiciar datos móviles:",
        size: 18,
        color: COLOR_MUTED,
      }),
    ],
  }),
  new Table({
    width: { size: 10200, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "<picture>\n" +
                          "  <!-- 1. MÓVIL: Celulares verticales (descarga solo ~100 KB) -->\n" +
                          "  <source media=\"(max-width: 768px)\" srcset=\"/Casa Loy Tequilera-movil.webp\" />\n\n" +
                          "  <!-- 2. RETINA: Pantallas 2K/4K / MacBook con densidad @2x -->\n" +
                          "  <source \n" +
                          "    media=\"(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)\"\n" +
                          "    srcset=\"/Casa Loy Tequilera-retina.webp\"\n" +
                          "  />\n\n" +
                          "  <!-- 3. ESCRITORIO: Monitores estándar 1080p (fallback universal) -->\n" +
                          "  <img \n" +
                          "    src=\"/Casa Loy Tequilera-escritorio.webp\"\n" +
                          "    alt=\"Destilería Casa Loy Tequilera\"\n" +
                          "    width=\"1920\" height=\"1080\"\n" +
                          "    fetchpriority=\"high\"\n" +
                          "    class=\"w-full h-full object-cover\"\n" +
                          "  />\n" +
                          "</picture>",
                    font: "Consolas",
                    size: 16,
                    color: "222222",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
);

// Footer note
docChildren.push(
  new Paragraph({
    spacing: { before: 300, after: 100 },
    border: { top: { color: COLOR_BORDER, size: 6, style: BorderStyle.SINGLE } },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Casa Loy Tequilera  •  NOM 1633  •  Ayotlán, Jalisco  •  Guía de Arquitectura Visual Web",
        size: 16,
        color: COLOR_MUTED,
        italics: true,
      }),
    ],
  })
);

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", color: COLOR_SECONDARY } } },
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
                  text: "CASA LOY TEQUILERA  |  DIMENSIONES MÓVIL, ESCRITORIO Y RETINA",
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
const wordPath = path.join(__dirname, '..', 'Casa_Loy_Dimensiones_Retina_Movil_Escritorio.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(wordPath, buf);
  console.log('Documento Word (.docx) creado con éxito en:', wordPath);
  // Also try to update the original docx if not locked
  try {
    fs.writeFileSync(path.join(__dirname, '..', 'Casa_Loy_Especificaciones_Imagenes_Web.docx'), buf);
    console.log('Documento base Word (.docx) también actualizado.');
  } catch (e) {
    console.log('Nota: El archivo base Word está actualmente abierto en otra app.');
  }
});

// Update Excel with 3-tier view sheet
const excelRows3Tier = [
  [
    "Tipo de Imagen / Sección",
    "Vista Móvil (Celular)",
    "Vista Escritorio (PC / Laptop)",
    "Vista Retina / HiDPI (@2x)",
    "Formato Recomendado",
    "Pesos Máximos (Móvil / Escritorio / Retina)",
    "Uso y Función"
  ]
];

threeTierData.forEach((item) => {
  excelRows3Tier.push([
    item.type,
    item.mobile,
    item.desktop,
    item.retina,
    item.format,
    item.weights,
    item.type.includes("Hero") ? "Cabecera principal (LCP)" : "Contenido interior (Lazy Load)"
  ]);
});

const wb = XLSX.utils.book_new();
const ws3Tier = XLSX.utils.aoa_to_sheet(excelRows3Tier);

ws3Tier['!cols'] = [
  { wch: 38 },
  { wch: 28 },
  { wch: 28 },
  { wch: 28 },
  { wch: 14 },
  { wch: 28 },
  { wch: 26 }
];

XLSX.utils.book_append_sheet(wb, ws3Tier, "3 Vistas Móvil-PC-Retina");
const excelPath = path.join(__dirname, '..', 'Casa_Loy_Dimensiones_Retina_Movil_Escritorio.xlsx');
XLSX.writeFile(wb, excelPath);
console.log('Archivo Excel (.xlsx) creado con éxito en:', excelPath);

