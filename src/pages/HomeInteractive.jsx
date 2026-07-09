import React, { useEffect, useState } from "react";

export default function HomeInteractive({ lang = "es", setPage }) {
  const [quizStep, setQuizStep] = useState(1); // 1, 2, 3, or 'result'
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate background parallax offset based on scroll position
      const scrollPos = window.scrollY;
      setParallaxOffset(scrollPos * 0.15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = {
    es: {
      gateTitle: "Verificación de Edad",
      gateDesc: "Debes tener la edad legal para consumir alcohol en tu país de residencia para entrar.",
      gateEnter: "ENTRAR",
      gateExit: "SALIR",
      heroOvertitle: "Destilería de Tradición",
      heroTitle: "El Legado Líquido de Ayotlán",
      heroDesc: "Artesanalidad, Tierra y Sofisticación Internacional que trascienden fronteras.",
      heroBtn1: "DESCUBRIR MARCAS",
      heroBtn2: "EXPLORAR TOUR",
      aboutOvertitle: "Herencia Viva",
      aboutTitle: "Raíces Profundas en el Corazón de Jalisco",
      aboutDesc: "En Casa Loy, el tequila no es solo una bebida; es el alma de nuestra tierra destilada a través de generaciones. En Ayotlán, cultivamos el agave con el respeto que merece el tiempo, transformando la paciencia en el destilado más refinado del mundo.",
      aboutQuote: `"La tierra dicta el ritmo, nosotros solo seguimos su latido."`,
      aboutYearLabel: "AÑO DE FUNDACIÓN",
      portfolioOvertitle: "El Portafolio",
      portfolioTitle: "Excelencia en Cada Expresión",
      portfolioAction: "VER TODO EL CATÁLOGO",
      brand1Cat: "ULTRA PREMIUM",
      brand1Title: "Casa Loy Añejo",
      brand1Desc: "Madurado durante 18 meses en barricas de roble francés, notas de vainilla y especias.",
      brand2Cat: "CONTEMPORÁNEO",
      brand2Title: "TADDEL Cristalino",
      brand2Desc: "La pureza del plata con la complejidad del reposado. Una obra maestra moderna.",
      brand3Cat: "ARTESANAL",
      brand3Title: "Tierra Zafiro",
      brand3Desc: "Tequila blanco destilado en alambiques de cobre, capturando la esencia pura del agave azul.",
      parallaxOvertitle: "Destino Casa Loy",
      parallaxTitle: "Una Invitación al Origen",
      parallaxDesc: "Descubra la magia de Ayotlán a través de nuestros tours privados y la gastronomía de autor en nuestro restaurante insignia, Restaurante 1937 Nativo.",
      parallaxAction: "RESERVAR EXPERIENCIA",
      b2bOvertitle: "Private Label & Desarrolla tu Marca",
      b2bTitle: "Su Marca, Nuestro Legado",
      b2bDesc: "Ofrecemos soluciones integrales de destilación y envasado para marcas que buscan la máxima calidad internacional.",
      q1Title: "¿Cuál es su volumen proyectado anualmente?",
      q1Opts: ["1,000 - 5,000 Cajas", "5,000 - 20,000 Cajas", "20,000+ Cajas"],
      q2Title: "¿Cuenta con un diseño de botella propio?",
      q2Opts: ["Sí, diseño listo", "No, requiero consultoría B2B"],
      q3Title: "¿Mercado objetivo principal?",
      q3Opts: ["Estados Unidos / Canadá", "Europa / Asia", "México / Latam"],
      qrTitle: "Perfil Compatible",
      qrDesc: "Contamos con la infraestructura para su proyecto. Un consultor B2B le contactará.",
      qrAction: "SOLICITAR CONTACTO",
      ageWarning: "EVITA EL EXCESO. DISFRUTA CON RESPONSABILIDAD.",
    },
    en: {
      gateTitle: "Age Verification",
      gateDesc: "You must be of legal drinking age in your country of residence to enter.",
      gateEnter: "ENTER",
      gateExit: "EXIT",
      heroOvertitle: "Tradition Distillery",
      heroTitle: "The Liquid Legacy of Ayotlán",
      heroDesc: "Craftsmanship, Terroir, and International Sophistication transcending borders.",
      heroBtn1: "DISCOVER BRANDS",
      heroBtn2: "EXPLORE TOUR",
      aboutOvertitle: "Living Heritage",
      aboutTitle: "Deep Roots in the Heart of Jalisco",
      aboutDesc: "At Casa Loy, tequila is not just a drink; it is the soul of our land distilled through generations. In Ayotlán, we cultivate agave with the respect that time deserves, transforming patience into the finest distillate in the world.",
      aboutQuote: `"The land dictates the rhythm, we only follow its heartbeat."`,
      aboutYearLabel: "FOUNDATION YEAR",
      portfolioOvertitle: "The Portfolio",
      portfolioTitle: "Excellence in Every Expression",
      portfolioAction: "VIEW ENTIRE CATALOG",
      brand1Cat: "ULTRA PREMIUM",
      brand1Title: "Casa Loy Añejo",
      brand1Desc: "Matured for 18 months in French oak barrels, with notes of vanilla and spice.",
      brand2Cat: "CONTEMPORARY",
      brand2Title: "TADDEL Cristalino",
      brand2Desc: "The purity of silver with the complexity of rested tequila. A modern masterpiece.",
      brand3Cat: "ARTISANAL",
      brand3Title: "Tierra Zafiro",
      brand3Desc: "White tequila distilled in copper stills, capturing the pure essence of blue agave.",
      parallaxOvertitle: "Destination Casa Loy",
      parallaxTitle: "An Invitation to the Origin",
      parallaxDesc: "Discover the magic of Ayotlán through our private tours and author gastronomy at our signature restaurant, Restaurante 1937 Nativo.",
      parallaxAction: "BOOK EXPERIENCE",
      b2bOvertitle: "Private Label & Develop your Brand",
      b2bTitle: "Your Brand, Our Legacy",
      b2bDesc: "We offer comprehensive distillation and packaging solutions for brands seeking top international quality.",
      q1Title: "What is your projected annual volume?",
      q1Opts: ["1,000 - 5,000 Cases", "5,000 - 20,000 Cases", "20,000+ Cases"],
      q2Title: "Do you have your own bottle design?",
      q2Opts: ["Yes, design ready", "No, I need B2B consultancy"],
      q3Title: "Primary target market?",
      q3Opts: ["United States / Canada", "Europe / Asia", "Mexico / Latam"],
      qrTitle: "Compatible Profile",
      qrDesc: "We have the perfect infrastructure for your project. A B2B representative will contact you.",
      qrAction: "REQUEST CONTACT",
      ageWarning: "ENJOY RESPONSIBLY. AVOID EXCESS.",
    }
  };

  const t = content[lang];

  return (
    <div className="relative text-on-surface text-left overflow-x-hidden">


      {/* Hero Video Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.82]"
            src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-a-field-of-blue-agave-34241-large.mp4"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>

        <div className="relative z-10 px-gutter md:px-margin-desktop w-full max-w-container-max mx-auto">
          <div className="max-w-3xl text-left space-y-6">
            <span className="font-label-caps text-label-caps text-white/95 tracking-[0.4em] block uppercase font-bold text-xs">
              {t.heroOvertitle}
            </span>
            <h1 className="font-serif text-5xl md:text-8xl text-white leading-[0.95] tracking-tight font-medium">
              {t.heroTitle}
            </h1>
            <p className="font-body-lg text-white/90 max-w-xl font-light leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap gap-4 pt-4 select-none">
              <button
                onClick={() => setPage("brands")}
                className="bg-primary text-white px-10 py-5 font-label-caps text-xs tracking-widest hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all font-bold"
              >
                {t.heroBtn1}
              </button>
              <button
                onClick={() => setPage("turismo")}
                className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 text-white font-label-caps text-xs tracking-widest hover:bg-white/20 active:scale-95 transition-all flex items-center gap-3 font-bold"
              >
                {t.heroBtn2}
                <span className="material-symbols-outlined text-sm font-light">play_circle</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos / Deep Roots */}
      <section className="py-32 px-gutter md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 text-left space-y-8">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.22em] block uppercase font-bold text-xs">
              {t.aboutOvertitle}
            </span>
            <h2 className="font-serif text-4xl md:text-[56px] text-on-surface leading-tight tracking-tight font-medium">
              {t.aboutTitle}
            </h2>
            <p className="font-body-lg text-on-surface-variant font-light leading-relaxed">
              {t.aboutDesc}
            </p>
            <div className="border-l-2 border-primary pl-8 italic font-serif text-xl md:text-2xl text-primary opacity-80 font-light">
              {t.aboutQuote}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 mb-12 lg:mb-0 relative group">
            <div className="aspect-[4/5] overflow-hidden bg-[#EDE7DE] shadow-xl">
              <img
                className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-[1.5s]"
                alt="Agave harvesting close-up hands"
                src="/Empleado Jimador Casa Loy Tequilera.webp"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#8C4723] p-6 flex flex-col justify-end text-white shadow-2xl select-none">
              <span className="font-serif text-5xl leading-none font-bold mb-2">1937</span>
              <span className="font-label-caps text-[9px] tracking-widest font-semibold opacity-75">
                {t.aboutYearLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestras Marcas Portfolio */}
      <section className="bg-surface-container-low py-32 overflow-hidden">
        <div className="px-gutter md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-20">
            <div className="text-left max-w-xl space-y-4">
              <span className="font-label-caps text-label-caps text-primary tracking-widest block uppercase font-bold text-xs">
                {t.portfolioOvertitle}
              </span>
              <h2 className="font-serif text-4xl md:text-[56px] text-on-surface tracking-tight leading-none font-medium">
                {t.portfolioTitle}
              </h2>
            </div>
            <button
              onClick={() => setPage("brands")}
              className="font-label-caps text-label-caps text-on-surface border-b border-on-surface pb-2 hover:text-primary hover:border-primary transition-all font-bold tracking-widest text-xs self-start md:self-auto"
            >
              {t.portfolioAction}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand 1 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("brands")}>
              <div className="aspect-[3/4] bg-white overflow-hidden mb-8 shadow-md">
                <picture>
                  <source media="(max-width: 768px)" srcSet="/Casa Loy Tequilera-movil.webp" />
                  <source 
                    media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
                    srcSet="/Casa Loy Tequilera-retina.webp" 
                  />
                  <img
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    alt="Tequila Casa Loy bottle"
                    src="/Casa Loy Tequilera-escritorio.webp"
                  />
                </picture>
              </div>
              <span className="font-label-caps text-[9px] text-secondary tracking-[0.2em] font-bold block mb-2">
                {t.brand1Cat}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-on-surface mb-3 group-hover:text-primary transition-colors font-medium">
                {t.brand1Title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80 font-light leading-relaxed">
                {t.brand1Desc}
              </p>
            </div>

            {/* Brand 2 */}
            <div className="group cursor-pointer text-left md:mt-12" onClick={() => setPage("brands")}>
              <div className="aspect-[3/4] bg-white overflow-hidden mb-8 shadow-md">
                <img
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  alt="TADDEL bottle served"
                  src="/Banner TADDEL Tequila.webp"
                />
              </div>
              <span className="font-label-caps text-[9px] text-secondary tracking-[0.2em] font-bold block mb-2">
                {t.brand2Cat}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-on-surface mb-3 group-hover:text-primary transition-colors font-medium">
                {t.brand2Title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80 font-light leading-relaxed">
                {t.brand2Desc}
              </p>
            </div>

            {/* Brand 3 */}
            <div className="group cursor-pointer text-left md:mt-24" onClick={() => setPage("brands")}>
              <div className="aspect-[3/4] bg-white overflow-hidden mb-8 shadow-md">
                <img
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  alt="Tierra Zafiro ceramic bottle"
                  src="/Banner Tierra Zafio Tequila.webp"
                />
              </div>
              <span className="font-label-caps text-[9px] text-secondary tracking-[0.2em] font-bold block mb-2">
                {t.brand3Cat}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-on-surface mb-3 group-hover:text-primary transition-colors font-medium">
                {t.brand3Title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80 font-light leading-relaxed">
                {t.brand3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tourism & Culinary Parallax Background Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Banner Experiencias-movil.webp" />
            <source 
              media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
              srcSet="/Banner Experiencias-retina.webp" 
            />
            <img
              id="parallax-img-1"
              className="w-full h-[120%] object-cover scale-105 brightness-[0.45] pointer-events-none"
              alt="Scenic agave landscape and distillery"
              src="/Banner Experiencias-escritorio.webp"
              style={{ transform: `translateY(${-parallaxOffset * 0.4}px)` }}
            />
          </picture>
        </div>
        <div className="relative z-10 px-gutter w-full max-w-container-max mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="font-label-caps text-label-caps text-[#FDA377] tracking-[0.4em] block uppercase font-bold text-xs">
              {t.parallaxOvertitle}
            </span>
            <h2 className="font-serif text-4xl md:text-[56px] text-white leading-tight tracking-tight font-medium">
              {t.parallaxTitle}
            </h2>
            <p className="font-body-lg text-white/90 leading-relaxed font-light">
              {t.parallaxDesc}
            </p>
            <div className="pt-6 select-none">
              <button
                onClick={() => setPage("turismo")}
                className="bg-white text-on-surface hover:bg-primary hover:text-white px-12 py-5 font-label-caps text-xs tracking-widest hover:shadow-lg transition-all duration-500 font-bold shadow-md"
              >
                {t.parallaxAction}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Contract Bottling Quiz Section */}
      <section className="py-32 bg-on-surface text-white overflow-hidden">
        <div className="px-gutter md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-6 space-y-8 text-left">
              <span className="font-label-caps text-label-caps text-[#FDA377] tracking-[0.3em] block uppercase font-bold text-xs animate-pulse">
                {t.b2bOvertitle}
              </span>
              <h2 className="font-serif text-4xl md:text-[56px] leading-tight tracking-tight font-medium">
                {t.b2bTitle}
              </h2>
              <p className="font-body-lg text-white/60 font-light leading-relaxed">
                {t.b2bDesc}
              </p>

              {/* B2B Quiz Widget */}
              <div className="bg-white/5 border border-white/10 p-8 shadow-2xl relative min-h-[340px] flex flex-col justify-between">
                {quizStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h4 className="font-serif text-xl md:text-2xl text-white/95 font-medium italic">
                      {t.q1Title}
                    </h4>
                    <div className="grid grid-cols-1 gap-4 select-none">
                      {t.q1Opts.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQuizStep(2)}
                          className="text-left border border-white/20 p-4 font-body-md hover:bg-white/10 hover:border-white transition-all text-sm font-light uppercase tracking-wider"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h4 className="font-serif text-xl md:text-2xl text-white/95 font-medium italic">
                      {t.q2Title}
                    </h4>
                    <div className="grid grid-cols-1 gap-4 select-none">
                      {t.q2Opts.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQuizStep(3)}
                          className="text-left border border-white/20 p-4 font-body-md hover:bg-white/10 hover:border-white transition-all text-sm font-light uppercase tracking-wider"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <h4 className="font-serif text-xl md:text-2xl text-white/95 font-medium italic">
                      {t.q3Title}
                    </h4>
                    <div className="grid grid-cols-1 gap-4 select-none">
                      {t.q3Opts.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQuizStep("result")}
                          className="text-left border border-white/20 p-4 font-body-md hover:bg-white/10 hover:border-white transition-all text-sm font-light uppercase tracking-wider"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === "result" && (
                  <div className="text-center space-y-6 py-6 animate-fade-in flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-[#FDA377] font-light">
                      verified_user
                    </span>
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl text-white/95 font-semibold tracking-wide">
                        {t.qrTitle}
                      </h4>
                      <p className="font-body-md text-sm text-white/60 font-light max-w-sm mx-auto leading-relaxed">
                        {t.qrDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => setPage("maquilas")}
                      className="bg-primary text-white px-8 py-3 font-label-caps text-xs tracking-widest font-bold hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all w-full max-w-xs mt-4"
                    >
                      {t.qrAction}
                    </button>
                  </div>
                )}

                {/* Progress dot indicators */}
                {quizStep !== "result" && (
                  <div className="flex gap-2 justify-center pt-6 select-none">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        quizStep === 1 ? "bg-primary" : "bg-white/20"
                      }`}
                    ></span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        quizStep === 2 ? "bg-primary" : "bg-white/20"
                      }`}
                    ></span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        quizStep === 3 ? "bg-primary" : "bg-white/20"
                      }`}
                    ></span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 mt-12 lg:mt-0 relative h-[400px] lg:h-[600px] overflow-hidden group">
              <img
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-1000 shadow-xl"
                alt="Sophisticated industrial tequila distillery"
                src="/Casa Loy Tequilera Naves.webp"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
