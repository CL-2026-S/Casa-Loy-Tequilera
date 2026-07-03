import React, { useState } from "react";

export default function Turismo({ t, lang }) {
  // Calendar Scheduler State
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

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
      
      tourPlatinoTitle: "Experiencia Casa Loy Platino",
      tourPlatinoPrice: "MXN 650.00 / Persona",
      tourPlatinoBullet1: "✓ Visita completa a campos de agave",
      tourPlatinoBullet2: "✓ Historia a través de murales",
      tourPlatinoBullet3: "✓ Cata privada en cava subterránea",
      tourPlatinoBullet4: "✓ Mixología y comida de 3 tiempos",
      tourPlatinoBtn: "Reservar Platino",
      
      tourOroTitle: "Experiencia Casa Loy Oro",
      tourOroPrice: "MXN 450.00 / Persona",
      tourOroBullet1: "✓ Recorrido por la destilería artesanal",
      tourOroBullet2: "✓ Explicación técnica de jimado",
      tourOroBullet3: "✓ Cata guiada de 3 expresiones",
      tourOroBullet4: "✓ Clase magistral de mixología",
      tourOroBtn: "Reservar Oro",
      
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
      expDesc: "Each tour is designed to offer an intimate view of our database-driven process, from the field to the underground cellar.",
      
      tourPlatinoTitle: "Casa Loy Platinum Experience",
      tourPlatinoPrice: "MXN 650.00 / Person",
      tourPlatinoBullet1: "✓ Full visit to agave fields",
      tourPlatinoBullet2: "✓ History through murals",
      tourPlatinoBullet3: "✓ Private tasting in underground cellar",
      tourPlatinoBullet4: "✓ Mixology and 3-course meal",
      tourPlatinoBtn: "Book Platinum",
      
      tourOroTitle: "Casa Loy Gold Experience",
      tourOroPrice: "MXN 450.00 / Person",
      tourOroBullet1: "✓ Tour of the artisanal distillery",
      tourOroBullet2: "✓ Technical explanation of harvesting",
      tourOroBullet3: "✓ Guided tasting of 3 expressions",
      tourOroBullet4: "✓ Master mixology class",
      tourOroBtn: "Book Gold",
      
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
    }
  };

  const activeT = localT[lang] || localT["es"];

  const handleBook = () => {
    if (selectedTime) {
      setBookingConfirmed(true);
    }
  };

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
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28">
          <span className="font-navigation text-[clamp(11px,1vw,13px)] text-primary uppercase tracking-[0.4em] mb-4 block font-semibold">
            {activeT.overtitle}
          </span>
          <h1 className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10">
            {activeT.titlePart1} <br />
            <span className="text-primary italic font-normal">{activeT.titlePart2}</span>
          </h1>
          <p className="font-sans text-[clamp(13px,1.1vw,16px)] text-white/85 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {activeT.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <a
              href="#packages"
              className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-8 transition-all duration-300 min-w-[180px] md:min-w-[200px] text-center hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            >
              {activeT.btnChooseTour}
            </a>
            <a
              href="#events"
              className="group inline-flex items-center gap-3 text-white hover:text-primary font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold py-3.5 px-4 transition-colors duration-300"
            >
              {activeT.btnGastronomy}
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

      {/* Packages Showcase */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden" id="packages">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {/* Platino Package */}
          <div className="group relative overflow-hidden shadow-lg h-[600px] cursor-pointer">
            <img
              alt="Casa Loy Platino experience fields"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/Casa Loy Experiencias Platico.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-10 w-full transition-all duration-500 transform translate-y-24 group-hover:translate-y-0">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-white text-2xl md:text-3xl font-semibold">
                    {activeT.tourPlatinoTitle}
                  </h3>
                  <p className="font-label-caps text-label-caps text-secondary-fixed mt-2">
                    {activeT.tourPlatinoPrice}
                  </p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 space-y-6">
                <ul className="text-white/80 space-y-2 font-body-md text-sm font-light">
                  <li className="flex items-center gap-2">{activeT.tourPlatinoBullet1}</li>
                  <li className="flex items-center gap-2">{activeT.tourPlatinoBullet2}</li>
                  <li className="flex items-center gap-2">{activeT.tourPlatinoBullet3}</li>
                  <li className="flex items-center gap-2">{activeT.tourPlatinoBullet4}</li>
                </ul>
                <a
                  href="#booking"
                  className="w-full bg-white text-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed transition-colors block text-center shadow-lg"
                >
                  {activeT.tourPlatinoBtn}
                </a>
              </div>
            </div>
          </div>

          {/* Oro Package */}
          <div className="group relative overflow-hidden shadow-lg h-[600px] cursor-pointer">
            <img
              alt="Casa Loy Oro experience fields"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/Casa Loy Experiencias Oro.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-10 w-full transition-all duration-500 transform translate-y-24 group-hover:translate-y-0">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-white text-2xl md:text-3xl font-semibold">
                    {activeT.tourOroTitle}
                  </h3>
                  <p className="font-label-caps text-label-caps text-secondary-fixed mt-2">
                    {activeT.tourOroPrice}
                  </p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 space-y-6">
                <ul className="text-white/80 space-y-2 font-body-md text-sm font-light">
                  <li className="flex items-center gap-2">{activeT.tourOroBullet1}</li>
                  <li className="flex items-center gap-2">{activeT.tourOroBullet2}</li>
                  <li className="flex items-center gap-2">{activeT.tourOroBullet3}</li>
                  <li className="flex items-center gap-2">{activeT.tourOroBullet4}</li>
                </ul>
                <a
                  href="#booking"
                  className="w-full bg-white text-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed transition-colors block text-center shadow-lg"
                >
                  {activeT.tourOroBtn}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar System */}
      <section className="bg-[#f0eee8]/30 py-section-gap overflow-hidden text-left" id="booking">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            <div className="lg:col-span-5 space-y-8">
              <h2 className="font-headline-lg text-4xl md:text-6xl font-medium">{activeT.planTitle}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-light leading-relaxed">
                {activeT.planDesc}
              </p>
              
              <div className="flex items-center gap-8 py-8 border-y border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-primary text-[10px] uppercase">
                    {activeT.scheduleLabel}
                  </span>
                  <span className="font-headline-md text-xl md:text-2xl font-bold">10:00 AM & 11:00 AM</span>
                </div>
                <div className="w-px h-12 bg-outline-variant/30"></div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-primary text-[10px] uppercase">
                    {activeT.daysLabel}
                  </span>
                  <span className="font-headline-md text-xl md:text-2xl font-bold">{activeT.daysValue}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 opacity-60 select-none">
                <span className="font-label-caps text-[10px]">{activeT.paymentLabel}</span>
                <svg className="h-5" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "20px" }}>
                  <text x="0" y="24" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="24" fill="#003087">PayPal</text>
                </svg>
                <svg className="h-5" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "20px" }}>
                  <text x="0" y="24" fontFamily="sans-serif" fontWeight="bold" fontSize="20" fill="#009EE3">mercado pago</text>
                </svg>
              </div>
            </div>

            {/* Interactive Calendar System */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="bg-white border border-outline-variant p-8 md:p-12 shadow-2xl relative">
                
                <div className="flex justify-between items-center mb-8 select-none">
                  <span className="font-headline-md text-xl font-bold">{activeT.monthName}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                      ◀
                    </button>
                    <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                      ▶
                    </button>
                  </div>
                </div>

                {bookingConfirmed ? (
                  <div className="py-16 text-center space-y-6">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
                      check_circle
                    </span>
                    <h4 className="font-headline-md text-2xl font-bold">{activeT.successTitle}</h4>
                    <p className="font-body-md text-on-surface-variant max-w-xs mx-auto font-light leading-relaxed">
                      {activeT.successDesc.replace("{day}", selectedDay).replace("{time}", selectedTime)}
                    </p>
                    <button
                      onClick={() => {
                        setBookingConfirmed(false);
                        setSelectedTime("");
                      }}
                      className="text-primary font-label-caps border-b border-primary pb-1 font-semibold"
                    >
                      {activeT.successBtn}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Calendar grid representation */}
                    <div className="grid grid-cols-7 gap-2 mb-8 text-center select-none font-navigation text-xs text-on-surface-variant/70 font-semibold border-b border-outline-variant/20 pb-4">
                      {activeT.daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-8 text-center font-navigation text-sm font-medium">
                      {/* Blank placeholders */}
                      <div className="h-12 flex items-center justify-center text-on-surface/20 cursor-not-allowed">
                        29
                      </div>
                      <div className="h-12 flex items-center justify-center text-on-surface/20 cursor-not-allowed">
                        30
                      </div>
                      
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
                        <div
                          key={day}
                          onClick={() => {
                            if (day !== 7) setSelectedDay(day);
                          }}
                          className={`h-12 flex items-center justify-center cursor-pointer transition-all ${
                            day === 7
                              ? "text-on-surface/20 cursor-not-allowed"
                              : selectedDay === day
                              ? "bg-primary text-white scale-105 shadow-md"
                              : "hover:bg-primary-fixed"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mb-8">
                      {["10:00 AM", "11:00 AM"].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`flex-1 py-4 border font-label-caps text-xs text-center uppercase tracking-widest transition-all ${
                            selectedTime === time
                              ? "border-primary bg-primary text-white shadow-md"
                              : "border-outline text-on-surface hover:bg-[#fcf9f3]"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleBook}
                      disabled={!selectedTime}
                      className={`w-full py-5 font-label-caps text-label-caps uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${
                        selectedTime
                          ? "bg-primary text-on-primary hover:bg-[#9a5625]"
                          : "bg-stone-300 text-stone-500 cursor-not-allowed"
                      }`}
                    >
                      {activeT.confirmBtn}
                    </button>
                  </>
                )}

              </div>
            </div>

          </div>
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
            <button className="bg-white text-primary px-12 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed active:scale-95 transition-all shadow-lg">
              {activeT.eventsBtnQuote}
            </button>
            <button className="border border-white text-white px-12 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> {activeT.eventsBtnFolleto}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
