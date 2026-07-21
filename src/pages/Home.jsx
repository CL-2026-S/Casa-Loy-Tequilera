import React, { useState, useEffect, useRef, useMemo } from "react";

// Intersection Observer Reveal Component for clean scroll entrance animations
function Reveal({ children, className = "", delay = 0, duration = 800 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}

// Animated count up for numerical statistics in Numeros section
function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const domRef = useRef();

  useEffect(() => {
    const endStr = String(end);
    const numericMatch = endStr.match(/\d+/);
    if (!numericMatch) {
      setCount(end);
      return;
    }
    const endVal = parseInt(numericMatch[0], 10);
    
    let animationFrameId = null;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * endVal);
      setCount(currentCount);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (animationFrameId) {
              window.cancelAnimationFrame(animationFrameId);
            }
            startTimestamp = null;
            animationFrameId = window.requestAnimationFrame(step);
          } else {
            if (animationFrameId) {
              window.cancelAnimationFrame(animationFrameId);
            }
            setCount(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  const endStr = String(end);
  const hasPlusSuffix = endStr.endsWith("+");
  const hasPlusPrefix = endStr.startsWith("+");

  return (
    <span ref={domRef}>
      {hasPlusPrefix && "+"}
      {count}
      {hasPlusSuffix && "+"}
    </span>
  );
}

// Local bilingual dictionary for accurate facts and high-end editorial copy
const localT = {
  es: {
    gate: {
      title: "Bienvenido al corazón del tequila",
      desc: "Desde los Altos de Jalisco preservamos una herencia dedicada al arte de crear tequila.",
      question: "¿Eres mayor de edad para ingresar a esta experiencia?",
      enter: "SÍ, SOY MAYOR DE EDAD",
      exit: "SALIR DEL SITIO",
      warning: "Evita el Exceso",
      heritage: "Jalisco, México · Desde 1960"
    },
    hero: {
      num: "1937",
      title: "LEGADO & ORIGEN",
      desc: "Inspirados en el nacimiento de nuestro fundador en 1937 y consolidados a través de décadas de cultivo de agave.",
      btn1: "Agendar Reunión",
      btn2: "Vivir el Origen",
    },
    manifiesto: {
      line1: "NO SOLO PRODUCIMOS TEQUILA.",
      line2: "CREAMOS HISTORIAS",
      line3: "QUE SE SIRVEN EN UNA COPA.",
    },
    numeros: [
      { val: "30+", label: "Años de maestría agavera", tooltip: "Tres décadas perfeccionando el arte del agave." },
      { val: "5", label: "Métodos para transformar el agave en arte", tooltip: "Hornos de Mampostería, Autoclave, Difusor, Tahona y Artesanal" },
      { val: "1633", label: "Sello de nuestro origen", tooltip: "Norma Oficial Mexicana dentro de la industria del tequila." },
      { val: "+5", label: "Mercados globales", tooltip: "México, USA, Guatemala, Hong Kong y Colombia." },
    ],
    historia: {
      quote: "“Tres generaciones. Una misma pasión por el tequila.”",
      desc: "Inspirada por la visión de <strong>Don Manuel Loy</strong>, Casa Loy Tequilera preserva el arte de hacer tequila mientras transforma la riqueza de Los Altos de Jalisco en destilados y proyectos que hoy representan la esencia de México en el mundo.",
      action: "Descubre quiénes somos",
    },
    ctaFinal: {
      title: "¿LISTO PARA CREAR TU LEGADO?",
      btn: "Agendar Reunión",
      btnSec: "Conocer Casa Loy"
    },
    footer: {
      desc: "Elevando la esencia de Jalisco a través del arte de la destilación y el cultivo de agaves de excelencia.",
      location: "Arandas - Ayotlán, Jalisco, México",
      rights: "© 2026 Casa Loy Tequilera. Todos los derechos reservados."
    }
  },
  en: {
    gate: {
      title: "Welcome to the heart of tequila",
      desc: "From the Highlands of Jalisco, we preserve a heritage dedicated to the art of creating tequila.",
      question: "Are you of legal drinking age to enter this experience?",
      enter: "YES, I AM OF LEGAL DRINKING AGE",
      exit: "EXIT SITE",
      warning: "Drink Responsibly",
      heritage: "Jalisco, Mexico · Since 1960"
    },
    hero: {
      num: "1937",
      title: "LEGACY & ORIGIN",
      desc: "Inspired by the birth of our founder in 1937 and built upon decades of dedicated agave cultivation.",
      btn1: "Schedule Meeting",
      btn2: "Live the Origin",
    },
    manifiesto: {
      line1: "WE DO NOT JUST PRODUCE TEQUILA.",
      line2: "WE CREATE STORIES",
      line3: "SERVED IN A GLASS.",
    },
    numeros: [
      { val: "30+", label: "Years of agave mastery", tooltip: "Three decades perfecting the art of the agave." },
      { val: "5", label: "Methods to transform agave into art", tooltip: "Masonry Ovens, Autoclave, Diffuser, Tahona, and Artisanal" },
      { val: "1633", label: "Seal of our origin", tooltip: "Official Mexican Standard within the tequila industry." },
      { val: "+5", label: "Global markets", tooltip: "Mexico, USA, Guatemala, Hong Kong, and Colombia." },
    ],
    historia: {
      quote: "“Three generations. One passion for tequila.”",
      desc: "Inspired by the vision of <strong>Don Manuel Loy</strong>, Casa Loy Tequilera preserves the art of making tequila while transforming the richness of Los Altos de Jalisco into distillates and projects that today represent the essence of Mexico in the world.",
      action: "Discover who we are",
    },
    ctaFinal: {
      title: "READY TO BUILD YOUR LEGACY?",
      btn: "Schedule Meeting",
      btnSec: "Discover Casa Loy"
    },
    footer: {
      desc: "Elevating the essence of Jalisco through the art of distillation and excellent agave cultivation.",
      location: "Arandas - Ayotlan, Jalisco, México",
      rights: "© 2026 Casa Loy Tequilera. All rights reserved."
    }
  }
};

export default function Home({ lang = "es", setPage, setLang }) {
  const currentLang = lang === "es" ? "es" : "en";
  const t = localT[currentLang];

  const [activeSlide, setActiveSlide] = useState(0);
  const autoplayTimerRef = useRef(null);
  const [dynamicSlides, setDynamicSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/cms?type=banners");
        if (res.ok) {
          const data = await res.json();
          const homeBanners = data.filter(b => b.page === 'home');
          if (homeBanners.length > 0) {
            const mapped = homeBanners.map(b => ({
              id: String(b.id),
              overtitle: currentLang === 'es' ? (b.subtitle_es || "CASA LOY") : (b.subtitle_en || b.subtitle_es || "CASA LOY"),
              titleEs: b.title_es,
              titleEn: b.title_en || b.title_es,
              descEs: b.subtitle_es || "",
              descEn: b.subtitle_en || b.subtitle_es || "",
              btn1Es: currentLang === 'es' ? "DESCUBRIR MÁS" : "DISCOVER MORE",
              btn1En: "DISCOVER MORE",
              btn1Route: b.link_url || "turismo",
              btn2Es: "",
              btn2En: "",
              microcopyEs: b.subtitle_es || "",
              microcopyEn: b.subtitle_en || b.subtitle_es || "",
              bg: b.image_url,
              bgMobile: b.image_url,
              bgRetina: b.image_url,
              brightness: "brightness-[0.82]",
              overlay: "from-black/30 via-transparent to-black/45",
            }));
            setDynamicSlides(mapped);
          }
        }
      } catch (e) {
        console.error("Error fetching dynamic home banners:", e);
      }
    };
    fetchBanners();
  }, [currentLang]);

  const slides = [
    {
      id: "maquila",
      overtitle: currentLang === "es" ? "LEGADO & CREACIÓN" : "LEGACY & CREATION",
      titleEs: 'TU MARCA DE TEQUILA <br /><span class="text-white italic font-normal">EMPIEZA EN EL ORIGEN</span>',
      titleEn: 'YOUR TEQUILA BRAND <br /><span class="text-white italic font-normal">BEGINS AT THE ORIGIN</span>',
      descEs: "Desarrollamos marcas premium con la experiencia, tradición and visión de una casa tequilera mexicana.",
      descEn: "We develop premium brands with the experience, tradition, and vision of a Mexican tequila house.",
      btn1Es: "DESARROLLAR MI MARCA",
      btn1En: "DEVELOP MY BRAND",
      btn1Route: "maquilas",
      btn2Es: "AGENDAR ASESORÍA",
      btn2En: "SCHEDULE CONSULTANCY",
      btn2Route: "maquilas#contact",
      microcopyEs: "Producción premium · Desarrollo integral · Exportación internacional",
      microcopyEn: "Premium production · Comprehensive development · International export",
      bg: "/Casa Loy Tequilera-escritorio.webp",
      bgMobile: "/Casa Loy Tequilera-movil.webp",
      bgRetina: "/Casa Loy Tequilera-retina.webp",
      brightness: "brightness-[0.82]",
      overlay: "from-black/30 via-transparent to-black/45",
    },
    {
      id: "tours",
      overtitle: currentLang === "es" ? "EXPERIENCIAS CASA LOY" : "CASA LOY EXPERIENCES",
      titleEs: 'VIVE EL <br /><span class="text-white italic font-normal">ORIGEN DEL TEQUILA</span>',
      titleEn: 'LIVE THE <span class="text-white italic font-normal">ORIGIN OF TEQUILA</span>',
      descEs: "Recorre nuestra historia, descubre el proceso de destilación and vive una experiencia auténtica entre agaves, tradición y tequila.",
      descEn: "Walk through our history, discover the distillation process, and live an authentic experience among agaves, tradition, and tequila.",
      btn1Es: "RESERVAR EXPERIENCIA",
      btn1En: "BOOK EXPERIENCE",
      btn1Route: "turismo",
      btn2Es: "",
      btn2En: "",
      microcopyEs: "Catas premium · Recorridos guiados · Experiencias auténticas",
      microcopyEn: "Premium tastings · Guided tours · Authentic experiences",
      bg: "/Banner Experiencias-escritorio.webp",
      bgMobile: "/Banner Experiencias-movil.webp",
      bgRetina: "/Banner Experiencias-retina.webp",
      brightness: "brightness-[0.82]",
      overlay: "from-black/30 via-transparent to-black/45",
    },
    {
      id: "restaurante",
      overtitle: currentLang === "es" ? "GASTRONOMÍA & ORIGEN" : "GASTRONOMY & ORIGIN",
      titleEs: 'UNA EXPERIENCIA <br /><span class="text-white italic font-normal">QUE SE SABOREA</span>',
      titleEn: 'AN EXPERIENCE <br /><span class="text-white italic font-normal">TO BE SAVORED</span>',
      descEs: "Cocina mexicana contemporánea, mixología de autor y el espíritu de Casa Loy en cada detalle.",
      descEn: "Contemporary Mexican cuisine, signature mixology, and the spirit of Casa Loy in every detail.",
      btn1Es: "RESERVAR MESA",
      btn1En: "BOOK TABLE",
      btn1Route: "nativo",
      btn2Es: "CONOCER MENÚ",
      btn2En: "VIEW MENU",
      btn2Route: "nativo#menu",
      microcopyEs: "Cocina de autor · Mixología premium · Experiencia sensorial",
      microcopyEn: "Signature cuisine · Premium mixology · Sensory experience",
      bg: "/Restaurante 1937 Nativo.webp",
      bgMobile: "/Restaurante 1937 Nativo.webp",
      bgRetina: "/Restaurante 1937 Nativo.webp",
      brightness: "brightness-[0.82]",
      overlay: "from-black/30 via-transparent to-black/45",
    },
    {
      id: "piedra",
      overtitle: currentLang === "es" ? "LA EVOLUCIÓN" : "THE EVOLUTION",
      titleEs: 'PIEDRA Y AGAVE REPOSADO <br /><span class="text-white italic font-normal">AHORA ES PARTE</span> DE CASA LOY',
      titleEn: 'PIEDRA Y AGAVE REPOSADO <br /><span class="text-white italic font-normal">IS NOW PART</span> OF CASA LOY',
      descEs: "Una etiqueta que honra el origen del tequila mexicano con una nueva imagen dentro de la familia Casa Loy Tequila.",
      descEn: "A label honoring the origin of Mexican tequila with a new image inside the Casa Loy Tequila family.",
      btn1Es: "DESCUBRIR LA NUEVA ETIQUETA",
      btn1En: "DISCOVER THE NEW LABEL",
      btn1Route: "brands",
      btn2Es: "CONOCER NUESTRAS MARCAS",
      btn2En: "EXPLORE OUR BRANDS",
      btn2Route: "brands",
      microcopyEs: "Nueva imagen · Misma esencia · Parte de Casa Loy Tequilera",
      microcopyEn: "New image · Same essence · Part of Casa Loy Tequilera",
      bg: "/Banner Casa Loy Piedra y Agave-escritorio.webp",
      bgMobile: "/Banner Casa Loy Piedra y Agave-movil.webp",
      bgRetina: "/Banner Casa Loy Piedra y Agave-retina.webp",
      brightness: "brightness-[0.82]",
      overlay: "from-black/30 via-transparent to-black/45",
    }
  ];

  const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : slides;

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7500);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [currentLang, activeSlides]);

  const handleManualSelect = (idx) => {
    setActiveSlide(idx);
    startAutoplay();
  };

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18] relative">
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { transform: translateY(-120px) translateX(20px) scale(0.6); opacity: 0; }
        }
        @keyframes mist-drift-1 {
          0% { transform: translateX(-10%) translateY(0) scale(1); opacity: 0.18; }
          50% { transform: translateX(10%) translateY(-2%) scale(1.05); opacity: 0.35; }
          100% { transform: translateX(-10%) translateY(0) scale(1); opacity: 0.18; }
        }
        @keyframes mist-drift-2 {
          0% { transform: translateX(10%) translateY(-1%) scale(1.05); opacity: 0.12; }
          50% { transform: translateX(-10%) translateY(1%) scale(1); opacity: 0.28; }
          100% { transform: translateX(10%) translateY(-1%) scale(1.05); opacity: 0.12; }
        }
        @keyframes slow-pan {
          0% { transform: scale(1.02) translate(0px, 0px); }
          50% { transform: scale(1.08) translate(-12px, -6px); }
          100% { transform: scale(1.02) translate(0px, 0px); }
        }
        @keyframes lighting-cycle {
          0%, 100% { filter: brightness(0.9) contrast(1.02); }
          50% { filter: brightness(1.06) contrast(1.05); }
        }
        @keyframes ray-shimmer {
          0%, 100% { opacity: 0.18; transform: rotate(0deg) scale(1); }
          50% { opacity: 0.38; transform: rotate(2deg) scale(1.04); }
        }
        @keyframes breathing-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes reveal-logo {
          0% { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes smooth-reveal-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes clouds-move {
          0% { transform: translateX(-15%); }
          50% { transform: translateX(15%); }
          100% { transform: translateX(-15%); }
        }
        .animate-slow-pan {
          animation: slow-pan 26s ease-in-out infinite;
        }
        .animate-lighting {
          animation: lighting-cycle 18s ease-in-out infinite;
        }
        .animate-ray-shimmer {
          animation: ray-shimmer 14s ease-in-out infinite;
          transform-origin: top left;
        }
        .animate-mist-1 {
          animation: mist-drift-1 32s ease-in-out infinite;
        }
        .animate-mist-2 {
          animation: mist-drift-2 26s ease-in-out infinite;
        }
        .animate-logo-reveal {
          animation: reveal-logo 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-reveal-up {
          animation: smooth-reveal-up 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-clouds {
          animation: clouds-move 65s ease-in-out infinite alternate;
        }
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(253, 163, 119, 0.7) 0%, transparent 80%);
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle var(--duration) ease-in-out infinite;
        }
        .animate-breath {
          animation: breathing-slow 14s ease-in-out infinite;
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
        }
      `}</style>


      
      {/* 01. HERO SLIDESHOW SECTION (Full Screen) */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden">
        {/* Render Background Images */}
        {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === activeSlide ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {slide.bgMobile || slide.bgRetina ? (
              <picture>
                {slide.bgMobile && <source media="(max-width: 768px)" srcSet={slide.bgMobile} />}
                {slide.bgRetina && (
                  <source 
                    media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
                    srcSet={slide.bgRetina} 
                  />
                )}
                <img
                  alt={slide.id}
                  className={`w-full h-full object-cover ${slide.brightness || "brightness-[0.82]"} transition-transform duration-[7500ms] ease-out ${
                    idx === activeSlide ? "scale-105" : "scale-100"
                  }`}
                  src={slide.bg}
                />
              </picture>
            ) : (
              <img
                alt={slide.id}
                className={`w-full h-full object-cover ${slide.brightness || "brightness-[0.82]"} transition-transform duration-[7500ms] ease-out ${
                  idx === activeSlide ? "scale-105" : "scale-100"
                }`}
                src={slide.bg}
              />
            )}
            {/* Dark gradient overlay for typography readability */}
            <div className={`absolute inset-0 bg-gradient-to-b ${slide.overlay || "from-black/30 via-transparent to-black/45"}`}></div>
          </div>
        ))}

        {/* Content Container (Crossfading slides content) */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === activeSlide;

            return (
              <div 
                key={slide.id}
                className={`absolute inset-x-6 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
                  isActive 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto animate-slide-left-right" 
                    : "opacity-0 translate-y-4 scale-98 pointer-events-none"
                }`}
              >
                {/* Overtitle */}
                <span className="font-navigation text-[clamp(11px,1vw,13px)] text-white uppercase tracking-[0.4em] mb-4 block font-semibold">
                  {slide.overtitle}
                </span>

                {/* Main Heading */}
                <h1 
                  className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10"
                  dangerouslySetInnerHTML={{ __html: currentLang === "es" ? slide.titleEs : slide.titleEn }}
                />

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
                  {/* Primary CTA */}
                  <button
                    onClick={() => {
                      if (slide.btn1Route.includes("#")) {
                        const [route, hash] = slide.btn1Route.split("#");
                        setPage(route);
                        setTimeout(() => {
                          const element = document.getElementById(hash);
                          if (element) element.scrollIntoView({ behavior: "smooth" });
                        }, 500);
                      } else {
                        setPage(slide.btn1Route);
                      }
                    }}
                    className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
                  >
                    {currentLang === "es" ? slide.btn1Es : slide.btn1En}
                  </button>

                  {/* Secondary CTA (If present) */}
                  {slide.btn2Es && (
                    <button
                      onClick={() => {
                        if (slide.btn2Route.includes("#")) {
                          const [route, hash] = slide.btn2Route.split("#");
                          setPage(route);
                          setTimeout(() => {
                            const element = document.getElementById(hash);
                            if (element) element.scrollIntoView({ behavior: "smooth" });
                          }, 500);
                        } else {
                          setPage(slide.btn2Route);
                        }
                      }}
                      className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
                    >
                      {currentLang === "es" ? slide.btn2Es : slide.btn2En}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManualSelect(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === activeSlide ? "w-8 bg-primary" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Elegant scroll indicator (el tipo de flecha de scroll y estilo se respeta) */}
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

      {/* Hero ➜ Historia gap: 120px desktop, 80px tablet, 64px mobile */}
      <div className="h-[64px] md:h-[80px] lg:h-[120px]"></div>

      {/* 02. MANIFIESTO SECTION */}
      <section className="bg-[#fcf9f3] w-full flex items-center justify-center px-6 py-20 md:py-32">
        <div className="max-w-[1240px] mx-auto text-center w-full">
          <Reveal duration={1200}>
            <div className="space-y-4 md:space-y-8 select-none">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-4">
                {currentLang === "es" ? "Desde Ayotlán, los Altos de Jalisco" : "From Ayotlán, the Highlands of Jalisco"}
              </span>
              <p className="font-serif text-[clamp(32px,5vw,76px)] leading-[1.05] tracking-tight font-light text-[#1c1c18] uppercase">
                {t.manifiesto.line1}
              </p>
              <p className="font-serif text-[clamp(32px,5vw,76px)] leading-[1.05] tracking-tight font-light text-primary italic">
                {t.manifiesto.line2}
              </p>
              <p className="font-serif text-[clamp(32px,5vw,76px)] leading-[1.05] tracking-tight font-light text-[#1c1c18] uppercase">
                {t.manifiesto.line3}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Spacing Historia ➜ Por qué Casa Loy: 100px desktop, 72px tablet, 56px mobile.
          Let's place this gap nicely between sections. */}
      <div className="h-[56px] md:h-[72px] lg:h-[100px]"></div>

      {/* 03. NÚMEROS SECTION (Monumental Viewport numbers) */}
      <section className="bg-[#F6F2EA] py-20 px-6">
        <div className="max-w-[1240px] mx-auto">
          <Reveal delay={100}>
            <div className="mb-16 md:mb-24 text-center">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {currentLang === "es" ? "LA TRADICIÓN SE CONVIERTE EN GRANDEZA" : "TRADITION BECOMES GRANDEUR"}
              </span>
              <h2 className="font-serif text-[clamp(28px,3vw,44px)] font-light text-[#1c1c18]">
                {currentLang === "es" ? "Una trayectoria tejida con paciencia" : "A trajectory woven with patience"}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 pt-4">
            {t.numeros.map((item, index) => {
              const borderClasses = `border-[#1c1c18]/10 border-b pb-8 md:pb-0 md:border-b-0 ${
                index === 0 ? "md:border-r lg:border-r" : ""
              } ${
                index === 1 ? "lg:border-r" : ""
              } ${
                index === 2 ? "md:border-r lg:border-r" : ""
              } ${
                index === 3 ? "border-b-0 pb-0" : ""
              }`;

              return (
                <Reveal 
                  key={index} 
                  delay={index * 150} 
                  className={`flex flex-col items-center text-center p-4 ${borderClasses}`}
                >
                  <span className="font-serif text-[clamp(60px,5.8vw,96px)] font-light leading-none text-primary select-none flex items-baseline justify-center mb-4">
                    <CountUp end={item.val} />
                    {item.val === "1633" && (
                      <span 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[clamp(14px,1.4vw,20px)] font-bold text-primary ml-1.5 translate-y-[4px] select-none"
                      >
                        NOM
                      </span>
                    )}
                  </span>
                  <span className="font-navigation text-[clamp(10px,0.85vw,12px)] text-[#53443a] uppercase tracking-[0.18em] font-semibold leading-relaxed max-w-[240px] min-h-[44px] md:min-h-[56px] flex items-start justify-center relative">
                    <span>
                      {item.label}
                      <span 
                        id={`stats-info-${index === 0 ? "30" : index === 1 ? "5" : index === 2 ? "1633" : "markets"}`}
                        className="inline-block relative group ml-1.5 align-middle select-none"
                      >
                        <svg 
                          className="w-3.5 h-3.5 inline-block text-[#53443a]/60 group-hover:text-primary transition-colors cursor-help"
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 bg-[#1c1c18]/80 backdrop-blur-md text-[#fcf9f3] text-xs font-sans font-normal normal-case tracking-normal p-3 rounded-lg shadow-xl opacity-0 invisible scale-95 origin-bottom group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none z-50 text-center">
                          {item.tooltip}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c1c18]/80"></span>
                        </span>
                      </span>
                    </span>
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="h-[56px] md:h-[72px] lg:h-[100px]"></div>

      {/* 04. HISTORIA SECTION (Split layouts) */}
      <section className="bg-[#fcf9f3] px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8 lg:space-y-10 text-left">
              <Reveal delay={150}>
                <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block">
                  {currentLang === "es" ? "NUESTRA HISTORIA" : "OUR HISTORY"}
                </span>
              </Reveal>

              <Reveal delay={300}>
                <h3 className="font-serif text-[clamp(32px,3.5vw,52px)] text-[#1c1c18] font-light leading-tight italic">
                  {t.historia.quote}
                </h3>
              </Reveal>

              <Reveal delay={450}>
                <p 
                  className="font-body-lg text-[#53443a] text-[clamp(15px,1.1vw,18px)] leading-relaxed font-light max-w-[520px]"
                  dangerouslySetInnerHTML={{ __html: t.historia.desc }}
                />
              </Reveal>

              <Reveal delay={600} className="pt-4">
                <button
                  onClick={() => setPage("about")}
                  className="group inline-flex items-center gap-6 font-navigation text-[clamp(10px,0.8vw,12px)] text-primary uppercase tracking-[0.3em] font-bold"
                >
                  {t.historia.action}
                  <div className="relative w-12 h-[1px] bg-primary/30 group-hover:w-18 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  </div>
                </button>
              </Reveal>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-7">
              <Reveal delay={300} duration={1200}>
                <div className="aspect-[4/3] w-full overflow-hidden border border-outline-variant/10 shadow-sm relative">
                  <img
                    alt="Distillery Detail V2"
                    className="w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105"
                    src="/Cava Tequilera Casa Loy.webp"
                  />
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Spacing Historia ➜ Por qué Casa Loy / Por qué ➜ Soluciones */}
      <div className="h-[56px] md:h-[72px] lg:h-[100px]"></div>

      {/* 05. ¿POR QUÉ CASA LOY? (New Section with rich negative space) */}
      <section className="bg-[#F6F2EA] py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="font-navigation text-[clamp(10px,1vw,12px)] text-primary uppercase tracking-[0.35em] font-semibold block mb-2">
                {currentLang === "es" ? "¿POR QUÉ CASA LOY?" : "WHY CASA LOY?"}
              </span>
              <h2 className="font-serif text-[clamp(28px,3.2vw,48px)] font-light text-[#1c1c18] uppercase tracking-wide">
                {currentLang === "es" ? "EL ARTE DEL AGAVE, ELEVADO A ESCALA GLOBAL" : "THE ART OF AGAVE, ELEVATED TO A GLOBAL SCALE"}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-8 lg:gap-6 xl:gap-10 pt-4">
            {[
              { 
                num: "01", 
                title: currentLang === "es" ? "Espíritu artesanal" : "Artisanal spirit", 
                desc: currentLang === "es" ? "La atención al detalle y el respeto por el oficio dan carácter a cada tequila que elaboramos." : "Attention to detail and respect for the craft give character to every tequila we make." 
              },
              { 
                num: "02", 
                title: currentLang === "es" ? "Infinitas posibilidades" : "Infinite possibilities", 
                desc: currentLang === "es" ? "Flexibilidad para desarrollar perfiles únicos, desde expresiones tradicionales hasta proyectos de gran escala." : "Flexibility to develop unique profiles, from traditional expressions to large-scale projects." 
              },
              { 
                num: "03", 
                title: currentLang === "es" ? "Todo en un mismo lugar" : "All in one place", 
                desc: currentLang === "es" ? "Del desarrollo del líquido al embotellado y empaque final, centralizamos cada etapa para ofrecer mayor agilidad y control." : "From liquid development to final bottling and packaging, we centralize every stage to offer greater agility and control." 
              },
              { 
                num: "04", 
                title: currentLang === "es" ? "Escala sin límites" : "Scale without limits", 
                desc: currentLang === "es" ? "Infraestructura y experiencia para acompañar marcas emergentes y proyectos con visión internacional." : "Infrastructure and experience to accompany emerging brands and projects with an international vision." 
              },
              { 
                num: "05", 
                title: currentLang === "es" ? "Más allá de las fronteras" : "Beyond borders", 
                desc: currentLang === "es" ? "Nuestra experiencia ha llevado la esencia mexicana a mercados alrededor del mundo." : "Our experience has brought the Mexican essence to markets around the world." 
              }
            ].map((item, idx) => (
              <Reveal 
                key={idx} 
                delay={idx * 100} 
                className={`text-left border-t border-[#1c1c18]/10 pt-8 space-y-3.5 ${
                  idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="space-y-1">
                  <span className="font-serif text-[clamp(32px,2vw,44px)] font-light text-primary block leading-none">
                    {item.num}
                  </span>
                  <h4 className="font-serif text-[clamp(16px,1.2vw,20px)] font-semibold text-[#1c1c18] leading-snug">
                    {item.title}
                  </h4>
                </div>
                <p className="font-body-md text-[#53443a] text-sm lg:text-[15px] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06. NUESTROS EJES DE NEGOCIO (Premium Grid of 4 Cards - Full Width joined) */}
      <section className="bg-[#fcf9f3] pt-14 md:pt-16 pb-0 w-full overflow-hidden">
        <div className="w-full">
          <Reveal>
            <div className="mb-10 text-center px-6">
              <span className="font-navigation text-[clamp(11px,0.9vw,13px)] text-primary uppercase tracking-[0.4em] font-semibold block">
                {currentLang === "es" ? "UNIVERSO DE MAESTRÍA" : "UNIVERSE OF MASTERY"}
              </span>
            </div>
          </Reveal>

          {/* Premium 4-Column Grid Edge-to-Edge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full">
            {[
              {
                title: currentLang === "es" ? "DESARROLLA TU MARCA" : "DEVELOP YOUR BRAND",
                desc: currentLang === "es" ? "Maquila, diseño y proyectos estratégicos de tequila con la mayor infraestructura operativa." : "Private label, design, and strategic tequila projects backed by the largest operational capacity.",
                img: "/Destilación.webp",
                route: "maquilas",
                cta: currentLang === "es" ? "Desarrolla Tu Marca" : "Develop Your Brand"
              },
              {
                title: currentLang === "es" ? "PORTAFOLIO DE MARCAS" : "BRAND PORTFOLIO",
                desc: currentLang === "es" ? "El agave resguardado en su máxima pureza a través de nuestras expresiones selectas." : "Agave preserved in its maximum purity through our select brand portfolio.",
                img: "/Añejamiento.webp",
                route: "brands",
                cta: currentLang === "es" ? "Explorar Marcas" : "Explore Brands"
              },
              {
                title: currentLang === "es" ? "VIVE EL ORIGEN" : "LIVE THE ORIGIN",
                desc: currentLang === "es" ? "Recorra los campos donde nace la leyenda y descubra los secretos de nuestra destilación." : "Walk the fields where the legend is born and discover the secrets of our distillation.",
                img: "/Terraza.jpg",
                route: "turismo",
                cta: currentLang === "es" ? "Reservar Experiencia" : "Book Experience"
              },
              {
                title: currentLang === "es" ? "SABOREA EL LEGADO" : "SAVOR THE LEGACY",
                desc: currentLang === "es" ? "Cocina contemporánea y mixología de autor maridadas en el corazón de nuestra destilería." : "Contemporary cuisine and signature mixology paired in the heart of our distillery.",
                img: "/Restaurante 1937 Nativo.webp",
                route: "nativo",
                cta: currentLang === "es" ? "Reservar Mesa" : "Book Table"
              }
            ].map((sol, index) => (
              <Reveal key={sol.title} delay={index * 150} duration={1000} className="w-full">
                <div 
                  onClick={() => setPage(sol.route)}
                  className="group relative w-full h-[55vh] md:h-[60vh] lg:h-[65vh] flex items-end overflow-hidden cursor-pointer text-left animate-fade-in transition-all duration-[600ms] ease-out hover:scale-[1.02] hover:z-10 hover:shadow-2xl"
                >
                  {/* Full-bleed background image with slow parallax hover zoom */}
                  <img
                    alt={sol.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    src={sol.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-500"></div>
                  
                  {/* Floating Content */}
                  <div className="relative z-10 p-6 md:p-8 w-full flex flex-col justify-end h-full">
                    <p className="font-body-md text-white/70 text-sm leading-relaxed font-normal max-w-xs mb-6">
                      {sol.desc}
                    </p>
                    
                    <button className="flex items-center gap-3 text-white font-navigation text-[10px] uppercase tracking-[0.25em] font-bold pb-1.5 border-b border-white/20 group-hover:border-primary group-hover:text-primary transition-all duration-300 w-fit">
                      {sol.cta}
                      <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
