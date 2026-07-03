import React from "react";

export default function Nativo1937({ lang = "es" }) {
  const content = {
    es: {
      heroOvertitle: "Gastronomía & Origen",
      heroTitle1: "Restaurante 1937 Nativo:",
      heroTitle2: "El Sabor del Origen",
      heroDesc: "Una experiencia culinaria que honra la tierra y el legado de Casa Loy en el corazón de Ayotlán.",
      btnReservations: "Reservar Mesa",
      btnMenu: "Ver Menú",
      identityLabel: "Nuestra Identidad",
      identityTitle: "Honramos la tierra y el origen.",
      identityDesc: "Honramos la tierra y el origen de Ayotlán, transformando la hospitalidad en una experiencia que conecta a las personas con el tequila, la cocina y la identidad local.",
      historyLink: "Conoce nuestra historia",
      menuTitle: "La Carta",
      menuDesc: "Cocina Contemporánea con Productos Nativos: un viaje sensorial a través de los sabores más puros de nuestra región.",
      pdfMenu: "Descargar Menú Completo (PDF)",
      chefLabel: "EL ALMA DE LA COCINA",
      chefTitle: "Sergio Pérez Domínguez",
      chefRole: "Chef Ejecutivo & Visionario Culinario",
      chefDesc1: "Con una trayectoria forjada en la excelencia, el Chef Sergio Pérez Domínguez lidera la propuesta gastronómica de Restaurante 1937 Nativo. Su cocina es un tributo a la biodiversidad de Ayotlán, donde cada ingrediente narra una historia de trazabilidad y respeto por el origen.",
      chefDesc2: "Bajo su visión, la tradición se transforma en vanguardia sensorial, creando maridajes perfectos que elevan la experiencia de Casa Loy a un estándar internacional.",
      visitTitle: "Visítanos",
      hoursLabel: "Horarios",
      hoursVal: "Martes a Domingo:<br />13:00 – 20:00 hrs.",
      addressLabel: "Dirección",
      addressVal: "Carretera Ayotlán-Atotonilco km 6.5, Las Villas, 47930 Ayotlán, Jal.",
      contactLabel: "Contacto",
      contactVal: "Teléfono y WhatsApp<br />33 1333 4751",
      menuItems: [
        {
          id: 1,
          title: "Entradas de la Tierra",
          desc: "Tlacoyos de maíz criollo y emulsión de agave.",
          img: "/Platillo 1 1937 Nativo.webp",
        },
        {
          id: 2,
          title: "Fuertes y Brasas",
          desc: "Cortes añejados al fuego de leña de mezquite.",
          img: "/Platillo 3 1937 Nativo.webp",
          shifted: true,
        },
        {
          id: 3,
          title: "Postres de Autor",
          desc: "Dulce de calabaza en tacha y helado de pinole.",
          img: "/Postre 1 1937 Nativo.webp",
        },
      ]
    },
    en: {
      heroOvertitle: "Gastronomy & Origin",
      heroTitle1: "Restaurante 1937 Nativo:",
      heroTitle2: "The Taste of Origin",
      heroDesc: "A culinary experience honoring the land and legacy of Casa Loy in the heart of Ayotlán.",
      btnReservations: "Book a Table",
      btnMenu: "View Menu",
      identityLabel: "Our Identity",
      identityTitle: "We honor the land and the origin.",
      identityDesc: "We honor the land and origin of Ayotlán, transforming hospitality into an experience that connects people with tequila, cuisine, and local identity.",
      historyLink: "Discover our history",
      menuTitle: "The Menu",
      menuDesc: "Contemporary Cuisine with Native Products: a sensory journey through the purest flavors of our region.",
      pdfMenu: "Download Full Menu (PDF)",
      chefLabel: "THE SOUL OF THE KITCHEN",
      chefTitle: "Sergio Pérez Domínguez",
      chefRole: "Executive Chef & Culinary Visionary",
      chefDesc1: "With a career forged in excellence, Chef Sergio Pérez Domínguez leads the culinary vision at Restaurante 1937 Nativo. His cuisine is a tribute to the biodiversity of Ayotlán, where each ingredient tells a story of traceability and respect for its origin.",
      chefDesc2: "Under his vision, tradition transforms into sensory vanguard, creating perfect pairings that elevate the Casa Loy experience to an international standard.",
      visitTitle: "Visit Us",
      hoursLabel: "Opening Hours",
      hoursVal: "Tuesday to Sunday:<br />1:00 PM – 8:00 PM",
      addressLabel: "Address",
      addressVal: "Carretera Ayotlán-Atotonilco km 6.5, Las Villas, 47930 Ayotlán, Jal.",
      contactLabel: "Contact",
      contactVal: "Phone & WhatsApp<br />33 1333 4751",
      menuItems: [
        {
          id: 1,
          title: "Earth Appetizers",
          desc: "Heirloom corn tlacoyos and agave emulsion.",
          img: "/Platillo 1 1937 Nativo.webp",
        },
        {
          id: 2,
          title: "Mains & Embers",
          desc: "Aged cuts cooked over mesquite wood fire.",
          img: "/Platillo 3 1937 Nativo.webp",
          shifted: true,
        },
        {
          id: 3,
          title: "Signature Desserts",
          desc: "Candied pumpkin 'en tacha' and pinole ice cream.",
          img: "/Postre 1 1937 Nativo.webp",
        },
      ]
    }
  };

  const currentT = content[lang] || content.es;

  return (
    <div className="bg-background text-on-surface">
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden" id="experience">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Banner Restaurante 1937 Nativo-movil.webp" />
            <source 
              media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
              srcSet="/Banner Restaurante 1937 Nativo-retina.webp" 
            />
            <img
              alt="Cinematic view of Restaurante 1937 Nativo restaurant terrace"
              className="w-full h-full object-cover brightness-[0.82]"
              src="/Banner Restaurante 1937 Nativo-escritorio.webp"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28">
          <span className="font-navigation text-[clamp(11px,1vw,13px)] text-primary uppercase tracking-[0.4em] mb-4 block font-semibold">
            {currentT.heroOvertitle}
          </span>
          <h1 className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10">
            {currentT.heroTitle1} <br />
            <span className="text-primary italic font-normal">{currentT.heroTitle2}</span>
          </h1>
          <p className="font-sans text-[clamp(13px,1.1vw,16px)] text-white/85 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {currentT.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <button className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-8 transition-all duration-300 min-w-[180px] md:min-w-[200px] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md">
              {currentT.btnReservations}
            </button>
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 text-white hover:text-primary font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold py-3.5 px-4 transition-colors duration-300"
            >
              {currentT.btnMenu}
              <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                arrow_right_alt
              </span>
            </a>
          </div>
        </div>

        {/* Elegant scroll indicator */}
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

      {/* Philosophy Section */}
      <section className="py-section-gap bg-surface text-left" id="heritage">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            
            <div className="lg:col-span-5 space-y-8">
              <span className="font-label-caps text-label-caps text-primary mb-4 block">{currentT.identityLabel}</span>
              <h2 className="font-headline-lg text-4xl md:text-6xl font-medium">{currentT.identityTitle}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-light">
                {currentT.identityDesc}
              </p>
              <div className="flex items-center gap-4 text-primary font-navigation uppercase tracking-widest text-[12px] group cursor-pointer">
                <span>{currentT.historyLink}</span>
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                  arrow_right_alt
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative aspect-[4/5] overflow-hidden shadow-md">
                <img
                  alt="Close up of an artisanal Mexican dish"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
                  src="/Restaurante 1937 Nativo Instalaciones.webp"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Menu Section */}
      <section className="py-section-gap bg-[#f6f3ed] overflow-hidden text-left" id="menu">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          
          <div className="text-center mb-24 space-y-4">
            <h2 className="font-headline-lg text-4xl md:text-6xl">{currentT.menuTitle}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto italic font-light">
              {currentT.menuDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
            {currentT.menuItems.map((item) => (
              <div
                key={item.id}
                className={`group space-y-6 ${item.shifted ? "md:pt-24" : ""}`}
              >
                <div className="overflow-hidden aspect-square relative shadow-md">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    src={item.img}
                  />
                </div>
                <h3 className="font-headline-md text-2xl font-bold">{item.title}</h3>
                <p className="font-body-md text-on-surface-variant/80 font-light">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <a
              className="border-b border-primary text-primary font-navigation uppercase tracking-[0.2em] py-2 hover:opacity-70 transition-opacity font-semibold"
              href="#"
            >
              {currentT.pdfMenu}
            </a>
          </div>

        </div>
      </section>

      {/* Executive Chef Section */}
      <section className="py-section-gap bg-surface text-left">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative p-2">
                <div className="absolute -top-6 -left-6 w-32 h-32 border-l border-t border-primary/20 pointer-events-none"></div>
                <div className="aspect-[3/4] overflow-hidden shadow-2xl relative z-10 border border-outline-variant/15">
                  <img
                    alt="Chef Sergio Pérez Domínguez"
                    className="w-full h-full object-cover"
                    src="/Sergio Chef.webp"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/10 -z-0 translate-x-2 translate-y-2"></div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2 space-y-8">
              <span className="font-label-caps text-label-caps text-primary mb-4 block tracking-[0.3em] uppercase">
                {currentT.chefLabel}
              </span>
              <h2 className="font-headline-lg text-4xl md:text-5xl font-medium">{currentT.chefTitle}</h2>
              <h3 className="font-headline-md text-[24px] italic text-primary/80">
                {currentT.chefRole}
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-light leading-relaxed">
                {currentT.chefDesc1}
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-light leading-relaxed">
                {currentT.chefDesc2}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-section-gap bg-[#e5e2dc] text-left" id="location">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            <div className="lg:col-span-4 space-y-12 pr-0 lg:pr-8">
              <h2 className="font-headline-lg text-4xl md:text-5xl font-medium">{currentT.visitTitle}</h2>
              <div className="space-y-8 font-sans font-light">
                <div className="space-y-2">
                  <span className="font-label-caps text-label-caps text-primary uppercase text-xs">
                    {currentT.hoursLabel}
                  </span>
                  <p className="font-body-lg text-base md:text-lg text-on-surface-variant" dangerouslySetInnerHTML={{ __html: currentT.hoursVal }} />
                </div>
                <div className="space-y-2">
                  <span className="font-label-caps text-label-caps text-primary uppercase text-xs">
                    {currentT.addressLabel}
                  </span>
                  <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
                    {currentT.addressVal}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-label-caps text-label-caps text-primary uppercase text-xs">
                    {currentT.contactLabel}
                  </span>
                  <p className="font-body-lg text-base md:text-lg text-on-surface-variant" dangerouslySetInnerHTML={{ __html: currentT.contactVal }} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 mt-12 lg:mt-0">
              <div className="bg-[#fcf9f3]/60 backdrop-blur-md p-4 shadow-md overflow-hidden relative group">
                <picture>
                  <source media="(max-width: 768px)" srcSet="/Casa Loy Tequilera-movil.webp" />
                  <source 
                    media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
                    srcSet="/Casa Loy Tequilera-retina.webp" 
                  />
                  <img
                    alt="Highlands of Jalisco map locator details"
                    className="w-full aspect-[16/10] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    src="/Casa Loy Tequilera-escritorio.webp"
                  />
                </picture>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button className="bg-primary text-on-primary p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-[32px] text-white">location_on</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
