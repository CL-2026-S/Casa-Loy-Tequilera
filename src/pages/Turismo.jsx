import { useState } from "react";

export default function Turismo({ lang, setPage }) {

  const localT = {
    es: {
      overtitle: "Tradición y Excelencia",
      titlePart1: "El Corazón del Tequila:",
      titlePart2: "Una Experiencia de Origen",
      subtitle: "Sumérgete en la maestría artesanal de nuestra tierra, donde el tiempo se detiene para honrar el legado del agave.",
      btnChooseTour: "elige tu tour",
      btnGastronomy: "disfruta de la GASTRONOMÍA",
      expOvertitle: "Nuestras Experiencias",
      expTitle: "Un viaje sensorial a través del tiempo.",
      expDesc: "Cada tour está diseñado para ofrecer una visión íntima de nuestro proceso artesanal, desde el campo hasta la cava subterránea.",
      
      tourOroTitle: "Experiencia Casa Loy Oro",
      tourOroPrice: "MXN 550.00 / Persona",
      tourOroBullet1: "✓ Recorrido campo de agaves",
      tourOroBullet2: "✓ Murales e Historia",
      tourOroBullet3: "✓ Recorrido por la fábrica",
      tourOroBullet4: "✓ Cata en cava subterránea",
      tourOroBullet5: "✓ Mixología de autor",
      tourOroBullet6: "✓ Botella de TADDEL 200 ML",
      tourOroBtn: "Reservar Oro",

      tourPlatinoTitle: "Experiencia Casa Loy Platino",
      tourPlatinoPrice: "MXN 750.00 / Persona",
      tourPlatinoBullet1: "✓ Recorrido campo de agaves",
      tourPlatinoBullet2: "✓ Murales e Historia",
      tourPlatinoBullet3: "✓ Recorrido por la fábrica",
      tourPlatinoBullet4: "✓ Cata en cava subterránea",
      tourPlatinoBullet5: "✓ Mixología de autor",
      tourPlatinoBullet6: "✓ Comida (Entrada, Plato a escoger, Postre)",
      tourPlatinoBullet7: "✓ Bebida (2 por persona)",
      tourPlatinoBtn: "Reservar Platino",
      
      tourDiamanteTitle: "Experiencia Casa Loy Diamante",
      tourDiamantePrice: "MXN 1,500.00 / Persona",
      tourDiamanteBullet1: "✓ Recorrido campo de agaves",
      tourDiamanteBullet2: "✓ Murales y Historia",
      tourDiamanteBullet3: "✓ Recorrido por la destilería",
      tourDiamanteBullet4: "✓ Cata en cava subterránea",
      tourDiamanteBullet5: "✓ Clase de Mixología de autor",
      tourDiamanteBullet6: "✓ Experiencia Luxury Gastronómica en 1937 Nativo",
      tourDiamanteBullet7: "✓ Kit de Souvenirs",
      tourDiamanteBtn: "Reservar Diamante",
      
      planTitle: "Planea tu visita.",
      planDesc: "Nuestras puertas están abiertas de Martes a Domingo. Selecciona el horario que mejor se adapte a tu viaje y asegura tu lugar en la mesa.",
      scheduleLabel: "Horarios",
      daysLabel: "Disponibilidad",
      daysValue: "Mar - Dom",
      paymentLabel: "Pagos Seguros",
      monthName: "Octubre 2026",
      successTitle: "¡Reserva Completada!",
      successDesc: "Tu lugar ha sido reservado para el Octubre {day}, 2026 a las {time}.",
      successBtn: "Volver a Agendar",
      confirmBtn: "Confirmar Reserva",
      
      daysOfWeek: ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"],
      
      eventsTitle: "Catas Privadas & Eventos",
      eventsDesc: "Celebra tus momentos más importantes en un entorno donde la elegancia y la herencia se encuentran. Ofrecemos espacios exclusivos para grupos reducidos y eventos corporativos de alto nivel.",
      eventsBtnQuote: "Cotiza Aquí",
      eventsBtnFolleto: "Descargar Folleto",

      guestsLabel: "Número de Personas",
      remainingSpots: "Lugares disponibles: {spots} de 50",
      soldOut: "Horario Agotado (Límite 50 cupos)",
      selectTourLabel: "Experiencia seleccionada",
    },
    en: {
      overtitle: "Tradition and Excellence",
      titlePart1: "The Heart of Tequila:",
      titlePart2: "An Experience of Origin",
      subtitle: "Immerse yourself in the legacy of the agave where time stops to honor the craftsmanship of our land.",
      btnChooseTour: "choose your tour",
      btnGastronomy: "enjoy the GASTRONOMY",
      expOvertitle: "Our Experiences",
      expTitle: "A sensory journey through time.",
      expDesc: "Each tour is designed to offer an intimate view of our process, from the field to the underground cellar.",
      
      tourOroTitle: "Casa Loy Gold Experience",
      tourOroPrice: "MXN 550.00 / Person",
      tourOroBullet1: "✓ Agave fields tour",
      tourOroBullet2: "✓ Murals & History",
      tourOroBullet3: "✓ Tour of the factory",
      tourOroBullet4: "✓ Tasting in underground cellar",
      tourOroBullet5: "✓ Signature mixology",
      tourOroBullet6: "✓ TADDEL 200 ML Bottle",
      tourOroBtn: "Book Gold",

      tourPlatinoTitle: "Casa Loy Platinum Experience",
      tourPlatinoPrice: "MXN 750.00 / Person",
      tourPlatinoBullet1: "✓ Agave fields tour",
      tourPlatinoBullet2: "✓ Murals & History",
      tourPlatinoBullet3: "✓ Tour of the factory",
      tourPlatinoBullet4: "✓ Tasting in underground cellar",
      tourPlatinoBullet5: "✓ Signature mixology",
      tourPlatinoBullet6: "✓ Meal (Appetizer, Choice of main, Dessert)",
      tourPlatinoBullet7: "✓ Drinks (2 per person)",
      tourPlatinoBtn: "Book Platinum",
      
      tourDiamanteTitle: "Casa Loy Diamond Experience",
      tourDiamantePrice: "MXN 1,500.00 / Person",
      tourDiamanteBullet1: "✓ Agave fields tour",
      tourDiamanteBullet2: "✓ Murals & History",
      tourDiamanteBullet3: "✓ Distillery tour",
      tourDiamanteBullet4: "✓ Tasting in underground cellar",
      tourDiamanteBullet5: "✓ Signature mixology class",
      tourDiamanteBullet6: "✓ Luxury Gastronomic Experience at 1937 Nativo",
      tourDiamanteBullet7: "✓ Souvenir kit",
      tourDiamanteBtn: "Book Diamond",
      
      planTitle: "Plan your visit.",
      planDesc: "Our doors are open from Tuesday to Sunday. Select the time that best suits your trip and secure your place at the table.",
      scheduleLabel: "Hours",
      daysLabel: "Availability",
      daysValue: "Tue - Sun",
      paymentLabel: "Secure Payments",
      monthName: "October 2026",
      successTitle: "Booking Completed!",
      successDesc: "Your place has been reserved for October {day}, 2026 at {time}.",
      successBtn: "Book Again",
      confirmBtn: "Confirm Booking",
      
      daysOfWeek: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      
      eventsTitle: "Private Tastings & Events",
      eventsDesc: "Celebrate your most important moments in a setting where elegance and heritage meet. We offer exclusive spaces for small groups and high-level corporate events.",
      eventsBtnQuote: "Get a Quote",
      eventsBtnFolleto: "Download Brochure",

      guestsLabel: "Number of Guests",
      remainingSpots: "Available spots: {spots} of 50",
      soldOut: "Time Slot Sold Out (Limit 50 spots)",
      selectTourLabel: "Selected Experience",
    }
  };

  const activeT = localT[lang] || localT["es"];


  return (
    <div className="bg-background text-on-surface">
      {/* Cinematic Hero */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Banner Experiencias-movil.webp" />
            <source 
              media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
              srcSet="/Banner Experiencias-retina.webp" 
            />
            <img
              alt="Agave fields experience background"
              className="w-full h-full object-cover brightness-[0.82]"
              src="/Banner Experiencias-escritorio.webp"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28 animate-slide-left-right">
          <h1 className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10">
            {activeT.titlePart1} <br />
            <span className="text-white italic font-normal">{activeT.titlePart2}</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <a
              href="#packages"
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
            >
              {activeT.btnChooseTour}
            </a>
            <a
              href="#events"
              className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
            >
              {activeT.btnGastronomy}
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

      {/* Packages Showcase */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mb-24 text-left">
          <div className="lg:col-span-6">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-4">
              {activeT.expOvertitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-6xl leading-tight mb-6">
              {activeT.expTitle}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-body-lg text-body-lg text-on-surface-variant font-light leading-relaxed">
              {activeT.expDesc}
            </p>
          </div>
        </div>

        <div id="packages" className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              id: "oro",
              title: activeT.tourOroTitle,
              price: activeT.tourOroPrice,
              bullets: [
                activeT.tourOroBullet1,
                activeT.tourOroBullet2,
                activeT.tourOroBullet3,
                activeT.tourOroBullet4,
                activeT.tourOroBullet5,
                activeT.tourOroBullet6,
              ],
              btnText: activeT.tourOroBtn,
              img: "/Casa Loy Experiencias Oro.webp"
            },
            {
              id: "platino",
              title: activeT.tourPlatinoTitle,
              price: activeT.tourPlatinoPrice,
              bullets: [
                activeT.tourPlatinoBullet1,
                activeT.tourPlatinoBullet2,
                activeT.tourPlatinoBullet3,
                activeT.tourPlatinoBullet4,
                activeT.tourPlatinoBullet5,
                activeT.tourPlatinoBullet6,
                activeT.tourPlatinoBullet7,
              ],
              btnText: activeT.tourPlatinoBtn,
              img: "/Casa Loy Experiencias Platino.webp"
            },
            {
              id: "diamante",
              title: activeT.tourDiamanteTitle,
              price: activeT.tourDiamantePrice,
              bullets: [
                activeT.tourDiamanteBullet1,
                activeT.tourDiamanteBullet2,
                activeT.tourDiamanteBullet3,
                activeT.tourDiamanteBullet4,
                activeT.tourDiamanteBullet5,
                activeT.tourDiamanteBullet6,
                activeT.tourDiamanteBullet7,
              ],
              btnText: activeT.tourDiamanteBtn,
              img: "/Casa Loy Experiencias Diamante.webp"
            }
          ].map((exp) => (
            <div key={exp.id} className="group relative overflow-hidden shadow-lg h-[620px] cursor-pointer">
              <img
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={exp.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full transition-all duration-500 transform translate-y-0 lg:translate-y-[295px] lg:group-hover:translate-y-0">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="font-headline-md text-white text-xl md:text-2xl font-semibold leading-tight">
                      {exp.title}
                    </h3>
                    <p className="font-label-caps text-secondary-fixed mt-2">
                      {exp.price}
                    </p>
                  </div>
                </div>
                <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 lg:delay-100 space-y-4 lg:space-y-6">
                  <ul className="text-white/80 space-y-2 font-body-md text-xs font-light">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setPage(`experience-${exp.id}`)}
                      className="w-full bg-white text-primary py-3.5 font-label-caps text-xs text-center uppercase tracking-widest hover:bg-[#8C4723] hover:text-white transition-all block shadow-md font-semibold cursor-pointer"
                    >
                      {lang === "es" ? "Ver Detalles" : "View Details"}
                    </button>
                    <button
                      onClick={() => {
                        setPage(`experience-${exp.id}`);
                        setTimeout(() => {
                          const element = document.getElementById("booking");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }, 200);
                      }}
                      className="w-full border border-white/50 text-white hover:border-white hover:bg-white/10 py-3.5 font-label-caps text-xs text-center uppercase tracking-widest transition-all block font-bold cursor-pointer"
                    >
                      {exp.btnText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </section>

      {/* Private Events Banquet section */}
      <section className="py-section-gap relative overflow-hidden min-h-[500px] flex items-center justify-center bg-zinc-950" id="events">
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxurious dims banquet hall inside a traditional Mexican hacienda"
            className="w-full h-full object-cover opacity-45"
            src="/Terraza Casa Loy Experiencias.webp"
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center text-white space-y-8">
          <h2 className="font-headline-lg text-4xl md:text-6xl font-medium">{activeT.eventsTitle}</h2>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            {activeT.eventsDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <a
              href={
                lang === "es"
                  ? "https://wa.me/5213481337135?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20una%20cata%20privada%20o%20evento%20en%20Casa%20Loy."
                  : "https://wa.me/5213481337135?text=Hello%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20a%20private%20tasting%20or%20event%20at%20Casa%20Loy."
              }
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-12 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-[#ffdbcc] active:scale-95 transition-all shadow-lg inline-block text-center cursor-pointer font-semibold"
            >
              {activeT.eventsBtnQuote}
            </a>
            <button className="border border-white text-white px-12 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> {activeT.eventsBtnFolleto}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
