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
                "name": "¿Dónde está ubicada Casa Loy Tequilera?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Casa Loy Tequilera se ubica en la Carretera Ayotlán–Atotonilco km 6.5, Las Villas, Jalisco, México."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué días están abiertas las experiencias de turismo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nuestras puertas están abiertas para visitas guiadas de Martes a Domingo con reservación previa."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuáles son los paquetes o tours disponibles?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Contamos con tres experiencias: Experiencia Oro (MXN 550), Experiencia Platino (MXN 750, incluye comida de 3 tiempos) y Experiencia Diamante (MXN 1,500, incluye clase de mixología, kit de souvenirs y banquete de lujo en Restaurante 1937 Nativo)."
                }
              }
            ]
          }
        ]
      }
    },
    "experience-oro": {
      title: "Experiencia Casa Loy Oro | Tour de Tequila en Jalisco",
      description: "Reserva la Experiencia Oro de Casa Loy por MXN $550. Incluye recorrido por campos de agave, destilería, cata en cava subterránea y botella de TADDEL 200ml.",
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
                "name": "Where is Casa Loy Tequilera located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Casa Loy Tequilera is located at Ayotlán–Atotonilco Highway km 6.5, Las Villas, Jalisco, Mexico."
                }
              },
              {
                "@type": "Question",
                "name": "What days are distillery tours available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We are open for guided tours from Tuesday to Sunday. Prior booking is required."
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

export default function SEO({ page, lang = "es" }) {
  useEffect(() => {
    if (page === "blog-post") {
      return;
    }
    // 1. Get current language pack or fallback to Spanish
    const langData = seoData[lang] || seoData.es;
    const pageData = langData[page] || langData.home || seoData.es.home;

    // 2. Update Title
    document.title = pageData.title;

    // 3. Update Description Meta Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageData.description;

    // 4. Update OpenGraph Tags
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
    updateMetaTag("og:type", page === "blog-post" ? "article" : "website");
    updateMetaTag("og:site_name", "Casa Loy Tequilera");

    // Update Twitter Cards tags
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

    // 5. Inyectar Canonical y Hreflang de manera dinámica
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

    const currentPath = window.location.pathname;
    const canonicalUrl = `https://casaloy.com${currentPath}`;
    
    updateLinkTag("canonical", null, canonicalUrl);
    updateLinkTag("alternate", "es", canonicalUrl);
    updateLinkTag("alternate", "en", canonicalUrl);
    updateLinkTag("alternate", "x-default", canonicalUrl);

    // 6. Inject/Update JSON-LD Structured Data
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
