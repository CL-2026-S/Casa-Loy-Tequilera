import React, { useEffect } from "react";

const seoData = {
  es: {
    home: {
      title: "Casa Loy Tequilera | Destilería, Maquila de Tequila B2B, Tours & Restaurante 1937 Nativo",
      description: "Destilería mexicana premium en los Altos de Jalisco. Especialistas en Maquila de Tequila 100% Agave B2B, Tours Agaveros y Gastronomía de Autor en Restaurante 1937 Nativo.",
      ogTitle: "Casa Loy Tequilera - Destilería, Maquila B2B, Tours & Gastronomía",
      ogDesc: "Maquila de Tequila para marcas propias, experiencias turísticas en destilería y alta cocina en Restaurante 1937 Nativo.",
      ogImage: "/Casa Loy Tequilera.webp",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Distillery",
            "@id": "https://casaloy.com/#distillery",
            "name": "Casa Loy Tequilera",
            "description": "Destilería premium de tequila 100% agave en los Altos de Jalisco ofreciendo servicios de Maquila B2B, Tours Agaveros y Gastronomía de Autor.",
            "image": "https://casaloy.com/Logotipo%20Casa%20Loy%20Tequilera.webp",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Carretera Ayotlán–Atotonilco km 6.5, Las Villas",
              "addressLocality": "Ayotlán",
              "addressRegion": "Jalisco",
              "addressCountry": "MX"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "20.5342",
              "longitude": "-102.3245"
            },
            "url": "https://casaloy.com",
            "telephone": "+5213332504359",
            "priceRange": "$$$$"
          },
          {
            "@type": "Organization",
            "@id": "https://casaloy.com/#organization",
            "name": "Casa Loy Tequilera",
            "url": "https://casaloy.com",
            "logo": "https://casaloy.com/Logotipo%20Casa%20Loy%20Tequilera.webp",
            "sameAs": [
              "https://www.linkedin.com/company/casaloy",
              "https://www.youtube.com/@casaloytequilera"
            ]
          }
        ]
      }
    },
    "home-interactive": {
      title: "Experiencia Interactiva | Casa Loy Tequilera",
      description: "Explora de forma interactiva nuestra destilería, nuestros campos y los secretos del cocimiento, fermentación y destilación de nuestro tequila.",
      ogTitle: "Explora Casa Loy - Experiencia Interactiva",
      ogDesc: "Un recorrido visual interactivo por la destilería y los campos de agave en Jalisco.",
      ogImage: "/Casa Loy Tequilera Instalaciones.webp"
    },
    about: {
      title: "Quiénes Somos | Historia y Herencia de Casa Loy Tequilera",
      description: "Conoce el origen de Casa Loy Tequilera en Ayotlán, Jalisco. Nuestra historia familiar, el legado de Don Manuel Loy y el amor por la tierra del agave.",
      ogTitle: "Nuestra Historia - Casa Loy Tequilera",
      ogDesc: "Conoce la historia familiar y el legado agavero que da vida a nuestros tequilas premium.",
      ogImage: "/Don Manuel Loy.webp",
      schema: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera",
          "founder": {
            "@type": "Person",
            "name": "Don Manuel Loy"
          },
          "foundingDate": "1960"
        }
      }
    },
    maquilas: {
      title: "Maquila de Tequila 100% Agave & Marca Propia B2B | Casa Loy Tequilera",
      description: "Servicios integrales de Maquila de Tequila 100% agave, envasado, desarrollo de marca privada (Private Label) y exportación internacional. Hornos de mampostería y certificación CRT.",
      ogTitle: "Servicio de Maquila de Tequila B2B - Casa Loy Tequilera",
      ogDesc: "Lleva tu marca al mercado global con nuestra capacidad operativa, certificación CRT y estándares internacionales.",
      ogImage: "/Molienda.webp",
      schema: {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Maquila de Tequila B2B y Marca Propia",
        "provider": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera"
        },
        "areaServed": "Global"
      }
    },
    brands: {
      title: "Nuestras Marcas | Portafolio de Tequilas Casa Loy",
      description: "Descubre nuestro selecto portafolio de tequilas: Casa Loy Tequila, Reserva Casa Loy, TADDEL Tequila y Tierra Zafiro Tequila.",
      ogTitle: "Portafolio de Marcas - Casa Loy Tequilera",
      ogDesc: "Explora tequilas con carácter, herencia y diseño destilados en los Altos de Jalisco.",
      ogImage: "/taddel_200ml_bottle.webp",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "name": "Colección de Tequilas Casa Loy",
            "description": "Portafolio de tequilas premium destilados de agaves cultivados en los Altos de Jalisco."
          },
          {
            "@type": "Product",
            "name": "Tequila Casa Loy Blanco",
            "description": "Tequila 100% de agave de cocimiento tradicional y destilación delicada en hornos de mampostería.",
            "brand": {
              "@type": "Brand",
              "name": "Casa Loy"
            }
          },
          {
            "@type": "Product",
            "name": "TADDEL Tequila Plata",
            "description": "Tequila artesanal premium de diseño elegante y sabor cristalino.",
            "brand": {
              "@type": "Brand",
              "name": "TADDEL"
            }
          },
          {
            "@type": "Product",
            "name": "Tierra Zafiro Tequila Blanco",
            "description": "Tequila místico premium inspirado en la pureza y los cosmos.",
            "brand": {
              "@type": "Brand",
              "name": "Tierra Zafiro"
            }
          }
        ]
      }
    },
    turismo: {
      title: "Tours de Tequila en Jalisco | Experiencias Casa Loy",
      description: "Reserva un tour premium de tequila en Jalisco. Visita campos de agave, destilería, cavas subterráneas y disfruta de catas y mixología de autor.",
      ogTitle: "Experiencias Turísticas Casa Loy - Agenda tu Visita",
      ogDesc: "Sumérgete en la maestría artesanal de nuestra destilería con catas en cavas y cocina tradicional.",
      ogImage: "/Barra Casa Loy Experiencias.webp",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TouristAttraction",
            "name": "Experiencias de Turismo Casa Loy",
            "description": "Tours guiados y catas en la destilería Casa Loy en Jalisco.",
            "location": {
              "@type": "Place",
              "name": "Casa Loy Tequilera",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Carretera Ayotlán–Atotonilco km 6.5, Las Villas",
                "addressLocality": "Ayotlán",
                "addressRegion": "Jalisco",
                "addressCountry": "MX"
              }
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Dónde está ubicada la destilería de Casa Loy y cómo llegar desde Guadalajara o Atotonilco?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Casa Loy Tequilera se ubica en el km 6.5 de la carretera Ayotlán–Atotonilco, en Las Villas, Jalisco. Se encuentra a aproximadamente 1.5 horas de Guadalajara y a sólo 10 minutos de Atotonilco el Alto, posicionándose como un destino clave dentro de la ruta del tequila de los Altos de Jalisco."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuáles son los días y horarios disponibles para los tours y catas de tequila?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nuestros tours guiados por la destilería, el recorrido por los campos de agave azul y las experiencias culinarias están disponibles de Martes a Domingo en diversos horarios. Reservar tu lugar con antelación a través de nuestro portal es indispensable para asegurar disponibilidad."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué incluye la Experiencia Casa Loy Diamante y su cata en cava?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La Experiencia Diamante incluye recorrido guiado por campos de agave y destilería, cata profesional de tequila dirigida por experto en nuestra cava subterránea de piedra, una clase interactiva de mixología, un kit de souvenirs de la marca y un banquete gastronómico de tres tiempos en el Restaurante 1937 Nativo."
                }
              },
              {
                "@type": "Question",
                "name": "¿Se puede visitar el Restaurante 1937 Nativo sin realizar un tour de tequila?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí. Nuestro Restaurante 1937 Nativo está abierto al público general para disfrutar de alta cocina tradicional mexicana inspirada en el terroir de los Altos de Jalisco. Recomendamos hacer reserva previa."
                }
              },
              {
                "@type": "Question",
                "name": "¿Los tours de tequila en Casa Loy son adecuados para familias y niños?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí. Los menores de edad son bienvenidos en los recorridos por los campos de agave y la destilería artesanal, y disponemos de menús infantiles en el restaurante. Las catas y degustaciones de alcohol son exclusivas para mayores de 18 años con identificación oficial."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué métodos de pago aceptan para reservar experiencias y qué tan seguros son?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aceptamos pagos seguros en línea mediante tarjeta de crédito y débito a través de PayPal y Stripe. También es posible realizar el pago por transferencia bancaria contactando a atención a clientes por WhatsApp."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuál es la política de cancelación o cambios de fecha de los tours?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aceptamos cancelaciones con reembolso completo o reprogramaciones de fecha sin cargo adicional si nos avisas con al menos 48 horas de anticipación a tu reserva por WhatsApp."
                }
              }
            ]
          }
        ]
      }
    },
    "experience-oro": {
      title: "Experiencia Casa Loy Oro | Tour de Tequila en Jalisco",
      description: "Reserva la Experiencia Oro de Casa Loy por MXN $1. Incluye recorrido por campos de agave, destilería, cata en cava subterránea y botella de TADDEL 200ml.",
      ogTitle: "Experiencia Casa Loy Oro - Tour Premium",
      ogDesc: "Vive el origen del tequila con nuestro recorrido guiado, cata en cava y regalo especial.",
      ogImage: "/Casa Loy Experiencias Oro.webp"
    },
    "experience-platino": {
      title: "Experiencia Casa Loy Platino | Tour de Tequila y Comida",
      description: "Disfruta de la Experiencia Platino de Casa Loy por MXN $750. Incluye tour completo de tequila más comida de tres tiempos y mixología en el restaurante 1937 Nativo.",
      ogTitle: "Experiencia Casa Loy Platino - Tour y Comida",
      ogDesc: "Un viaje sensorial completo con cata guiada y menú gastronómico en nuestra hacienda.",
      ogImage: "/Casa Loy Experiencias Platino.webp"
    },
    "experience-diamante": {
      title: "Experiencia Casa Loy Diamante | Aventura Gastronómica de Lujo",
      description: "Vive la máxima Experiencia Diamante por MXN $1,500. Recorrido VIP por la destilería, cata en cava subterránea, clase de mixología, comida de lujo y kit de souvenirs.",
      ogTitle: "Experiencia Casa Loy Diamante - Aventura de Ultra-Lujo",
      ogDesc: "Nuestra experiencia de tequila definitiva: recorrido VIP, mixología y banquete luxury en 1937 Nativo.",
      ogImage: "/Casa Loy Experiencias Diamante.webp"
    },
    nativo: {
      title: "Restaurante 1937 Nativo | Cocina Mexicana en Jalisco",
      description: "Disfruta de la alta cocina tradicional mexicana inspirada en el terroir tequilero en Restaurante 1937 Nativo de Casa Loy. Conoce nuestro menú del chef Sergio.",
      ogTitle: "Restaurante 1937 Nativo - Casa Loy",
      ogDesc: "Sabores auténticos de la tierra del agave en un entorno de hacienda mexicana.",
      ogImage: "/Restaurante 1937 Nativo.webp",
      schema: {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Restaurante 1937 Nativo",
        "servesCuisine": "Mexicana Contemporánea",
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carretera Ayotlán–Atotonilco km 6.5",
          "addressLocality": "Ayotlán",
          "addressRegion": "Jalisco",
          "addressCountry": "MX"
        },
        "openingHours": "Tu-Su 09:00-18:00"
      }
    },
    "where-to-buy": {
      title: "Dónde Comprar Tequila Casa Loy | Tiendas y Puntos de Venta",
      description: "Encuentra dónde comprar nuestros tequilas en México y el mundo. Puntos de venta autorizados, Liverpool, Amazon, Mercado Libre y licorerías premium.",
      ogTitle: "Puntos de Venta de Tequila Casa Loy - Dónde Comprar",
      ogDesc: "Localiza tiendas físicas y plataformas digitales oficiales para adquirir nuestro portafolio de tequilas.",
      ogImage: "/Amazon_Logotipo.webp"
    },
    blog: {
      title: "Bitácora Tequilera | Blog de Casa Loy",
      description: "Artículos, recetas de coctelería, historias de la jima de agave, guías de cata y secretos de destilación en el blog oficial de Casa Loy.",
      ogTitle: "Bitácora Tequilera - Blog Oficial de Casa Loy",
      ogDesc: "Aprende sobre la cultura, historia y secretos que rodean al tequila de ultra-lujo.",
      ogImage: "/Barra Casa Loy Experiencias.webp"
    },
    "blog-post": {
      title: "El Arte de la Cata: Una Inmersión en los Sentidos | Blog Casa Loy",
      description: "Guía paso a paso para catar tequila de ultra-lujo: vista, olfato y retrogusto. Consejos del maestro tequilero para catar a la temperatura ideal.",
      ogTitle: "El Arte de la Cata de Tequila - Blog Casa Loy",
      ogDesc: "Descubre cómo catar el tequila 100% agave para apreciar su cuerpo, paisaje aromático y retrogusto.",
      ogImage: "/Barra Casa Loy Experiencias.webp",
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "El Arte de la Cata: Una Inmersión en los Sentidos",
        "datePublished": "2024-10-24T08:00:00Z",
        "author": {
          "@type": "Person",
          "name": "Maestro Tequilero"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Casa Loy Tequilera"
        }
      }
    },
    careers: {
      title: "Bolsa de Trabajo | Únete al Equipo de Casa Loy Tequilera",
      description: "Desarrolla tu carrera profesional en la industria del tequila. Conoce las vacantes activas y aplica para formar parte de Casa Loy.",
      ogTitle: "Bolsa de Trabajo de Casa Loy Tequilera - Trabaja con Nosotros",
      ogDesc: "Buscamos talento apasionado por la tierra y la tradición para unirse a nuestra destilería.",
      ogImage: "/Bolsa de Trabajo.webp"
    },
    "career-detail": {
      title: "Detalle de Vacante | Bolsa de Trabajo Casa Loy",
      description: "Revisa los requisitos, responsabilidades y beneficios de esta posición en Casa Loy Tequilera y postúlate hoy mismo.",
      ogTitle: "Vacante Disponible en Casa Loy - Únete al Equipo",
      ogDesc: "Detalles del puesto de trabajo activo en nuestra destilería en Jalisco.",
      ogImage: "/Bolsa de Trabajo.webp"
    },
    privacy: {
      title: "Aviso de Privacidad | Casa Loy Tequilera",
      description: "Consulta los términos de privacidad de datos personales en el sitio oficial de Casa Loy Tequilera.",
      ogTitle: "Aviso de Privacidad - Casa Loy",
      ogDesc: "Políticas de protección de datos personales y confidencialidad."
    },
    cookies: {
      title: "Política de Cookies | Casa Loy Tequilera",
      description: "Conoce el uso y configuración de cookies en el sitio web de Casa Loy Tequilera.",
      ogTitle: "Política de Cookies - Casa Loy",
      ogDesc: "Detalles del almacenamiento de cookies de navegación y optimización."
    },
    terms: {
      title: "Términos y Condiciones | Casa Loy Tequilera",
      description: "Términos y condiciones legales de uso de la plataforma web y la reserva de experiencias en Casa Loy.",
      ogTitle: "Términos y Condiciones - Casa Loy",
      ogDesc: "Acuerdo de uso legal del sitio web y reservaciones de tours."
    }
  },
  en: {
    home: {
      title: "Casa Loy Tequilera | 100% Agave Tequila from Jalisco Altos",
      description: "Premium Mexican distillery specializing in the production, development, and marketing of 100% agave tequila in Los Altos de Jalisco. Tradition, innovation, and operational excellence.",
      ogTitle: "Casa Loy Tequilera - Tradition & Innovation in Tequila",
      ogDesc: "We preserve a heritage of excellence dedicated to the art of creating ultra-luxury tequila from Jalisco, Mexico.",
      ogImage: "/Casa Loy Tequilera.webp",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Distillery",
            "name": "Casa Loy Tequilera",
            "description": "100% Agave Premium Tequila Distillery in Jalisco Highlands, Mexico.",
            "image": "https://casaloy.com/Logotipo%20Casa%20Loy%20Tequilera.webp",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Ayotlán–Atotonilco Highway km 6.5, Las Villas",
              "addressLocality": "Ayotlán",
              "addressRegion": "Jalisco",
              "addressCountry": "MX"
            },
            "url": "https://casaloy.com",
            "telephone": "+5213332504359"
          }
        ]
      }
    },
    about: {
      title: "About Us | Casa Loy Tequilera History & Heritage",
      description: "Discover the origin of Casa Loy Tequilera in Ayotlan, Jalisco. Our family history, the legacy of founder Don Manuel Loy, and our passion for agave.",
      ogTitle: "Our History - Casa Loy Tequilera",
      ogDesc: "Discover the family history and agave farming legacy behind our premium tequilas.",
      ogImage: "/Don Manuel Loy.webp"
    },
    maquilas: {
      title: "Private Label Tequila Development | Casa Loy Contract Bottling",
      description: "We offer end-to-end private label tequila development and contract bottling services. Traditional masonry ovens, expert distillation, and packaging.",
      ogTitle: "Contract Bottling & Brand Development - Casa Loy",
      ogDesc: "Bring your brand to the global market with our operational capacity and international quality standards.",
      ogImage: "/Molienda.webp"
    },
    brands: {
      title: "Our Brands | Casa Loy Tequila Portfolio",
      description: "Discover our select portfolio of tequilas: Casa Loy Tequila, Reserva Casa Loy, TADDEL Tequila, and Tierra Zafiro Tequila.",
      ogTitle: "Tequila Portfolio - Casa Loy Tequilera",
      ogDesc: "Explore premium tequilas with unique character and heritage distilled in Jalisco.",
      ogImage: "/taddel_200ml_bottle.webp"
    },
    turismo: {
      title: "Tequila Distillery Tours in Jalisco | Casa Loy Experiences",
      description: "Book a premium tequila tour in Jalisco. Visit agave fields, the distillery, underground aging cellars, and enjoy tastings and signature mixology.",
      ogTitle: "Casa Loy Tourism Experiences - Book Your Visit",
      ogDesc: "Immerse yourself in the craft of our distillery with cellar tastings and traditional gastronomy.",
      ogImage: "/Barra Casa Loy Experiences.webp",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TouristAttraction",
            "name": "Casa Loy Tourism Experiences",
            "description": "Guided tours and tequila tastings at Casa Loy Distillery in Jalisco.",
            "location": {
              "@type": "Place",
              "name": "Casa Loy Tequilera",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ayotlán–Atotonilco Highway km 6.5, Las Villas, Jalisco"
              }
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where is Casa Loy Tequilera located and how do I get there from Guadalajara?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Casa Loy Tequilera is located at km 6.5 of the Ayotlán–Atotonilco Highway in Las Villas, Jalisco. It is about a 1.5-hour drive from Guadalajara and 10 minutes from Atotonilco el Alto, making it a premier destination along the Altos de Jalisco tequila route."
                }
              },
              {
                "@type": "Question",
                "name": "What days and times are available for the tequila tours and tastings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Guided tours through our boutique distillery, blue agave field walks, and culinary experiences run from Tuesday to Sunday at various scheduled hours. Booking in advance via our website is required."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in the VIP Casa Loy Diamond Experience and cellar tasting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Diamond Experience includes a private tour of our agave fields and distillery, a professional tasting led by an expert inside our underground stone cellar, an interactive mixology class, an exclusive souvenir kit, and a 3-course gastronomic banquet at 1937 Nativo Restaurant."
                }
              },
              {
                "@type": "Question",
                "name": "Can I visit the 1937 Nativo Restaurant without booking a tequila tour?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. 1937 Nativo Restaurant is open to the public, offering contemporary Mexican cuisine inspired by local Altos de Jalisco ingredients. We advise booking in advance to guarantee a table."
                }
              },
              {
                "@type": "Question",
                "name": "Are tequila tours at Casa Loy suitable for families and children?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Children are welcome to join the tours through our agave fields and craft distillery, and we offer kids' menus at 1937 Nativo. However, tequila tastings are strictly reserved for guests aged 18 and older."
                }
              },
              {
                "@type": "Question",
                "name": "What payment methods are accepted and are they secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We accept secure online payments with credit and debit cards via PayPal and Stripe, ensuring full encryption of your details. Bank wire transfers can also be arranged via WhatsApp."
                }
              },
              {
                "@type": "Question",
                "name": "What is the cancellation or rescheduling policy for the experiences?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer free cancellations with a full refund or rescheduling with no extra fee if requested at least 48 hours prior to your scheduled tour."
                }
              }
            ]
          }
        ]
      }
    },
    nativo: {
      title: "1937 Nativo Restaurant | Mexican Culinary Experience in Jalisco",
      description: "Enjoy high-end traditional Mexican cuisine inspired by the tequila terroir at Casa Loy's 1937 Nativo Restaurant. Discover chef Sergio's signature menu.",
      ogTitle: "1937 Nativo Restaurant - Casa Loy",
      ogDesc: "Authentic flavors from the agave land in a luxurious Mexican hacienda setting.",
      ogImage: "/Restaurante 1937 Nativo.webp"
    }
  }
};

const pathMap = {
  home: { es: "/", en: "/" },
  "home-interactive": { es: "/interactivo", en: "/interactivo" },
  about: { es: "/quienes-somos", en: "/about" },
  maquilas: { es: "/maquilas", en: "/bottling" },
  brands: { es: "/marcas", en: "/brands" },
  turismo: { es: "/turismo", en: "/tourism" },
  "experience-oro": { es: "/turismo/oro", en: "/tourism/gold" },
  "experience-platino": { es: "/turismo/platino", en: "/tourism/platinum" },
  "experience-diamante": { es: "/turismo/diamante", en: "/tourism/diamond" },
  nativo: { es: "/nativo", en: "/restaurant-nativo" },
  "where-to-buy": { es: "/donde-comprar", en: "/where-to-buy" },
  blog: { es: "/blog", en: "/blog" },
  careers: { es: "/bolsa-de-trabajo", en: "/careers" },
  privacy: { es: "/politica-de-privacidad", en: "/privacy-policy" },
  cookies: { es: "/politica-de-cookies", en: "/cookie-policy" },
  terms: { es: "/terminos-y-condiciones", en: "/terms-and-conditions" }
};

export default function SEO({ page, lang = "es" }) {
  useEffect(() => {
    // 1. Determine hostname and path details
    const currentPath = window.location.pathname;
    const isProdDomain = window.location.hostname === "casaloy.com";
    const noIndexPages = ["panel", "validate-ticket", "editorial-preview"];
    
    // 2. Update Robots Meta Tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noIndexPages.includes(page) || !isProdDomain) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.name = "robots";
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = "noindex, nofollow";
    } else {
      if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    }

    // 3. Update Canonical and Hreflang Alternate Links
    const updateLinkTag = (rel, hreflang, href) => {
      let selector = `link[rel="${rel}"]`;
      if (hreflang) {
        selector += `[hreflang="${hreflang}"]`;
      }
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("link");
        tag.rel = rel;
        if (hreflang) tag.hreflang = hreflang;
        document.head.appendChild(tag);
      }
      tag.href = href;
    };

    let esPath = currentPath;
    let enPath = currentPath;
    
    if (pathMap[page]) {
      esPath = pathMap[page].es;
      enPath = pathMap[page].en;
    } else if (page === "career-detail") {
      let jobId = "";
      if (currentPath.startsWith("/bolsa-de-trabajo/")) {
        jobId = currentPath.substring("/bolsa-de-trabajo/".length);
      } else if (currentPath.startsWith("/careers/")) {
        jobId = currentPath.substring("/careers/".length);
      }
      if (jobId) {
        esPath = `/bolsa-de-trabajo/${jobId}`;
        enPath = `/careers/${jobId}`;
      }
    } else if (page === "blog-post") {
      let slug = "";
      if (currentPath.startsWith("/blog/")) {
        slug = currentPath.substring("/blog/".length);
      }
      if (slug) {
        esPath = `/blog/${slug}`;
        enPath = `/blog/${slug}`;
      }
    }

    const canonicalUrl = `https://casaloy.com${lang === "en" ? enPath : esPath}`;
    
    updateLinkTag("canonical", null, canonicalUrl);
    updateLinkTag("alternate", "es", `https://casaloy.com${esPath}`);
    updateLinkTag("alternate", "en", `https://casaloy.com${enPath}`);
    updateLinkTag("alternate", "x-default", `https://casaloy.com${esPath}`);

    // If it's a blog-post, dynamic SEO title/desc/JSON-LD are handled directly inside BlogPost.jsx
    if (page === "blog-post") {
      return;
    }

    // 4. Get current language pack or fallback to Spanish for standard pages
    const langData = seoData[lang] || seoData.es;
    const pageData = langData[page] || langData.home || seoData.es.home;

    // 5. Update Title
    document.title = pageData.title;

    // 6. Update Description Meta Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageData.description;

    // 7. Update OpenGraph Tags
    const updateMetaTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMetaTag("og:title", pageData.ogTitle || pageData.title);
    updateMetaTag("og:description", pageData.ogDesc || pageData.description);
    updateMetaTag("og:image", pageData.ogImage || "/Casa Loy Tequilera.webp");
    updateMetaTag("og:url", window.location.href);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:site_name", "Casa Loy Tequilera");

    // 8. Update Twitter Cards tags
    const updateTwitterTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    updateTwitterTag("twitter:card", "summary_large_image");
    updateTwitterTag("twitter:title", pageData.ogTitle || pageData.title);
    updateTwitterTag("twitter:description", pageData.ogDesc || pageData.description);
    updateTwitterTag("twitter:image", pageData.ogImage || "/Casa Loy Tequilera.webp");

    // 9. Inject/Update JSON-LD Structured Data
    // Remove previous script tag if it exists
    const previousScript = document.getElementById("casa-loy-jsonld");
    if (previousScript) {
      previousScript.remove();
    }

    // Generate schema object
    if (pageData.schema) {
      const script = document.createElement("script");
      script.id = "casa-loy-jsonld";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(pageData.schema);
      document.head.appendChild(script);
    }
  }, [page, lang]);

  return null; // This component doesn't render any visible UI
}
