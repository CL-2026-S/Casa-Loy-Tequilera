import React, { useState } from "react";

export default function Nativo1937({ lang = "es", t }) {
  const [showPdf, setShowPdf] = useState(false);
  
  // Booking States
  const [bookingChannel, setBookingChannel] = useState(null); // null, 'whatsapp', 'call', 'page'
  const [bookingStep, setBookingStep] = useState(1); // 1: Info, 2: Confirm, 3: Success
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    guests: 2,
    date: "",
    time: "",
    reason: ""
  });
  const [errors, setErrors] = useState({});
  const [bookingCode, setBookingCode] = useState("");

  const content = {
    es: {
      heroOvertitle: "Gastronomía & Origen",
      heroTitle1: "Restaurante 1937 Nativo:",
      heroTitle2: "Brasería Mexicana Contemporánea",
      heroDesc: "Cortes premium, mariscos a las brasas y cocina inspirada en la cultura del agave.",
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
      hoursVal: "Martes a Domingo:<br />12:00 – 20:00 hrs.",
      addressLabel: "Dirección",
      addressVal: "Carretera Ayotlán-Atotonilco km 6.5, Las Villas, 47930 Ayotlán, Jal.",
      contactLabel: "Contacto",
      contactVal: "Teléfono y WhatsApp<br />+52 1 33 1333 4751",
      menuItems: [
        {
          id: 1,
          title: "Guacamole con Chicharrón Norteño",
          desc: "Aguacate criollo machacado al momento, coronado con crujiente chicharrón de cerdo norteño y brotes orgánicos.",
          img: "/Guacamole con Chicharrón.jpeg",
        },
        {
          id: 2,
          title: "Aguachile Negro de Camarón",
          desc: "Camarón azul marinado en jugo de limón y cenizas de chiles tatemados, pepino, cebolla morada y rábano sandía.",
          img: "/Platillo 1 1937 Nativo.webp",
          shifted: true,
        },
        {
          id: 3,
          title: "Cortes a la leña",
          desc: "Selección de cortes premium asados a fuego directo con leña de encino y mezquite, acompañados de cebollitas cambray asadas.",
          img: "/New york Corte.jpg",
        },
        {
          id: 4,
          title: "Tarta de Limón",
          desc: "Cremoso de limón amarillo sobre base crocante de mantequilla, merengue italiano flameado y ralladura de lima fresca.",
          img: "/Tarta de Limón.jpeg",
          shifted: true,
        },
      ],
      booking: {
        title: "Reservar Mesa",
        subtitle: "Asegura tu lugar en nuestra mesa y vive una experiencia gastronómica inigualable.",
        maxCapacity: "Cupos máximos de reservación: 1-75 pax",
        selectMethod: "Selecciona el método para realizar tu reservación:",
        methodWa: "Reservar por WhatsApp",
        methodCall: "Llamar por Teléfono",
        methodForm: "Reservar en la Página",
        stepInfoTitle: "Detalles de la Reserva",
        stepConfirmTitle: "Confirmar Reserva",
        stepSuccessTitle: "¡Reserva Registrada!",
        nameLabel: "Nombre Completo",
        phoneLabel: "Número de Teléfono / WhatsApp",
        guestsLabel: "Número de Personas",
        dateLabel: "Fecha de Visita",
        timeLabel: "Hora de Visita",
        reasonLabel: "Motivo de la Visita",
        reasonPlaceholder: "Selecciona el motivo...",
        reasons: {
          cumpleanos: "Cumpleaños",
          aniversario: "Aniversario",
          bautizo: "Bautizo",
          celebracion: "Celebración",
          negocios: "Comida de Negocios",
          otro: "Otro motivo"
        },
        btnNext: "Continuar",
        btnBack: "Regresar",
        btnConfirm: "Confirmar y Registrar",
        btnWaSend: "Enviar a WhatsApp para Validación",
        btnCallNow: "Llamar Ahora",
        btnNewBooking: "Nueva Reservación",
        validation: {
          nameReq: "El nombre completo es obligatorio.",
          phoneReq: "El número de teléfono es obligatorio.",
          guestsRange: "La reservación debe ser de 1 a 75 personas.",
          dateReq: "La fecha es obligatoria.",
          datePast: "La fecha no puede ser en el pasado.",
          dateMonday: "El restaurante está cerrado los lunes (Martes a Domingo).",
          timeReq: "La hora es obligatoria.",
          timeRange: "El horario de servicio es de 12:00 a 20:00 hrs.",
          reasonReq: "Selecciona un motivo para tu visita."
        },
        successDesc: "Tu reservación ha sido registrada. Te enviaremos un recordatorio 30 minutos previos a tu hora estimada de llegada.",
        codeLabel: "Código de Reservación:"
      }
    },
    en: {
      heroOvertitle: "Gastronomy & Origin",
      heroTitle1: "Restaurante 1937 Nativo:",
      heroTitle2: "Contemporary Mexican Brasserie",
      heroDesc: "Premium cuts, wood-fired seafood, and cuisine inspired by the agave culture.",
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
      hoursVal: "Tuesday to Sunday:<br />12:00 PM – 8:00 PM",
      addressLabel: "Address",
      addressVal: "Carretera Ayotlán-Atotonilco km 6.5, Las Villas, 47930 Ayotlán, Jal.",
      contactLabel: "Contact",
      contactVal: "Phone & WhatsApp<br />+52 1 33 1333 4751",
      menuItems: [
        {
          id: 1,
          title: "Guacamole with Northern Pork Belly",
          desc: "Freshly mashed Creole avocado, topped with crispy Northern-style pork rind and organic microgreens.",
          img: "/Guacamole con Chicharrón.jpeg",
        },
        {
          id: 2,
          title: "Black Shrimp Aguachile",
          desc: "Blue shrimp marinated in fresh lime juice and charred chili ashes, with cucumber, red onion, and watermelon radish.",
          img: "/Platillo 1 1937 Nativo.webp",
          shifted: true,
        },
        {
          id: 3,
          title: "Wood-fired Cuts",
          desc: "Selection of premium cuts grilled over live oak and mesquite wood fire, served with grilled cambray onions.",
          img: "/New york Corte.jpg",
        },
        {
          id: 4,
          title: "Lemon Tart",
          desc: "Smooth lemon curd on a buttery crust, topped with toasted Italian meringue and fresh lime zest.",
          img: "/Tarta de Limón.jpeg",
          shifted: true,
        },
      ],
      booking: {
        title: "Book a Table",
        subtitle: "Secure your spot at our table and enjoy an incomparable culinary experience.",
        maxCapacity: "Maximum capacity per booking: 1-75 pax",
        selectMethod: "Select your preferred booking method:",
        methodWa: "Book via WhatsApp",
        methodCall: "Call by Phone",
        methodForm: "Book on this Page",
        stepInfoTitle: "Reservation Details",
        stepConfirmTitle: "Confirm Reservation",
        stepSuccessTitle: "Booking Registered!",
        nameLabel: "Full Name",
        phoneLabel: "Phone / WhatsApp Number",
        guestsLabel: "Number of Guests",
        dateLabel: "Date of Visit",
        timeLabel: "Time of Visit",
        reasonLabel: "Reason for Visit",
        reasonPlaceholder: "Select a reason...",
        reasons: {
          cumpleanos: "Birthday",
          aniversario: "Anniversary",
          bautizo: "Baptism",
          celebracion: "Celebration",
          negocios: "Business Lunch",
          otro: "Other"
        },
        btnNext: "Continue",
        btnBack: "Go Back",
        btnConfirm: "Confirm & Register",
        btnWaSend: "Send to WhatsApp for Validation",
        btnCallNow: "Call Now",
        btnNewBooking: "New Reservation",
        validation: {
          nameReq: "Full name is required.",
          phoneReq: "Phone number is required.",
          guestsRange: "Number of guests must be between 1 and 75 people.",
          dateReq: "Date is required.",
          datePast: "Date cannot be in the past.",
          dateMonday: "The restaurant is closed on Mondays (Tuesday to Sunday).",
          timeReq: "Time is required.",
          timeRange: "Service hours are between 12:00 PM and 8:00 PM.",
          reasonReq: "Please select a reason for your visit."
        },
        successDesc: "Your booking has been registered. We will send you a reminder 30 minutes prior to your estimated arrival time.",
        codeLabel: "Reservation Code:"
      }
    }
  };

  const currentT = content[lang] || content.es;

  const validateForm = () => {
    const newErrors = {};
    const tVal = currentT.booking.validation;

    if (!bookingData.name.trim()) {
      newErrors.name = tVal.nameReq;
    }
    if (!bookingData.phone.trim()) {
      newErrors.phone = tVal.phoneReq;
    }
    
    const guestsNum = parseInt(bookingData.guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 75) {
      newErrors.guests = tVal.guestsRange;
    }

    if (!bookingData.date) {
      newErrors.date = tVal.dateReq;
    } else {
      const selectedDate = new Date(bookingData.date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = tVal.datePast;
      }
      
      // Monday is 1 in getDay() (0 is Sunday, 1 is Monday, etc.)
      if (selectedDate.getDay() === 1) {
        newErrors.date = tVal.dateMonday;
      }
    }

    if (!bookingData.time) {
      newErrors.time = tVal.timeReq;
    } else {
      const [hours, minutes] = bookingData.time.split(":").map(Number);
      const timeVal = hours + minutes / 60;
      if (timeVal < 12 || timeVal > 20) {
        newErrors.time = tVal.timeRange;
      }
    }

    if (!bookingData.reason) {
      newErrors.reason = tVal.reasonReq;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setBookingStep(2);
    }
  };

  const handleConfirmBooking = () => {
    const rand = Math.floor(10000 + Math.random() * 90000);
    const code = `NAT-${rand}`;
    setBookingCode(code);
    setBookingStep(3);
  };

  const getWhatsAppLink = () => {
    const formattedPhone = "5213313334751";
    const text = lang === "es"
      ? `Hola 1937 Nativo, me gustaría solicitar una reservación con los siguientes detalles:\n` +
        `- Código de Reserva: ${bookingCode}\n` +
        `- Nombre: ${bookingData.name}\n` +
        `- Personas: ${bookingData.guests} pax\n` +
        `- Fecha: ${bookingData.date}\n` +
        `- Hora: ${bookingData.time} hrs\n` +
        `- Motivo: ${currentT.booking.reasons[bookingData.reason] || bookingData.reason}\n` +
        `Espero su confirmación. ¡Muchas gracias!`
      : `Hello 1937 Nativo, I would like to request a table reservation with the following details:\n` +
        `- Reservation Code: ${bookingCode}\n` +
        `- Name: ${bookingData.name}\n` +
        `- Guests: ${bookingData.guests} pax\n` +
        `- Date: ${bookingData.date}\n` +
        `- Time: ${bookingData.time}\n` +
        `- Reason: ${currentT.booking.reasons[bookingData.reason] || bookingData.reason}\n` +
        `Looking forward to your confirmation. Thank you!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

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
            <a
              href="#reservations"
              className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-8 transition-all duration-300 min-w-[180px] md:min-w-[200px] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center justify-center text-center"
            >
              {currentT.btnReservations}
            </a>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter items-start">
            {currentT.menuItems.map((item) => (
              <div
                key={item.id}
                className={`group space-y-6 ${item.shifted ? "lg:pt-20" : ""}`}
              >
                <div className="overflow-hidden aspect-square relative shadow-md">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    src={item.img}
                  />
                </div>
                <h3 className="font-headline-md text-xl font-bold min-h-[56px] flex items-end">{item.title}</h3>
                <p className="font-body-md text-on-surface-variant/80 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setShowPdf(!showPdf)}
                className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3.5 px-8 transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer min-w-[200px]"
              >
                <span className="material-symbols-outlined text-sm">{showPdf ? "expand_less" : "visibility"}</span>
                {showPdf 
                  ? (lang === "es" ? "Ocultar Menú en Pantalla" : "Hide Menu Online") 
                  : (lang === "es" ? "Ver Menú en Pantalla" : "View Menu Online")
                }
              </button>
              <a
                className="border border-primary text-primary hover:bg-primary hover:text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] py-3.5 px-8 transition-all duration-300 font-semibold flex items-center justify-center gap-2 min-w-[200px] text-center"
                href="/1937 Nativo Restaurante Menu.pdf"
                download="1937 Nativo Restaurante Menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                {currentT.pdfMenu}
              </a>
            </div>

            {/* Embedded PDF Viewer container */}
            {showPdf && (
              <div className="w-full max-w-4xl mt-6 border border-primary/20 bg-white p-2 shadow-2xl rounded-sm transition-all duration-500 overflow-hidden">
                <div className="bg-[#fcf9f3] px-4 py-2 border-b border-primary/10 flex justify-between items-center text-xs text-on-surface-variant font-sans font-light">
                  <span>1937 Nativo Restaurante Menu.pdf</span>
                  <button onClick={() => setShowPdf(false)} className="hover:text-primary text-sm flex items-center cursor-pointer">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="w-full h-[600px] md:h-[750px] relative">
                  <iframe
                    src="/1937 Nativo Restaurante Menu.pdf#toolbar=0"
                    title="1937 Nativo Restaurante Menu"
                    className="w-full h-full border-0"
                  />
                  <div className="absolute bottom-4 right-4 md:hidden">
                    <a
                      href="/1937 Nativo Restaurante Menu.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/95 text-white px-4 py-2 rounded-full text-xs font-sans shadow flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                      {lang === "es" ? "Abrir en Pantalla Completa" : "Open Full Screen"}
                    </a>
                  </div>
                </div>
              </div>
            )}
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

      {/* Reservation Section */}
      <section className="py-section-gap bg-[#fcf9f3] border-t border-primary/10 text-left" id="reservations">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          
          <div className="text-center mb-16 space-y-4">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] uppercase block">
              {lang === "es" ? "Reserva tu Experiencia" : "Book Your Experience"}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl font-medium">{currentT.booking.title}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
              {currentT.booking.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#f6f3ed] p-8 md:p-12 border border-primary/10 shadow-2xl relative">
            
            {/* Steps indicator - Only show if page channel selected */}
            {bookingChannel === "page" && (
              <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10 -z-10"></div>
                {/* Active progress line */}
                <div 
                  className="absolute top-1/2 left-0 h-[1px] bg-primary transition-all duration-500 -z-10"
                  style={{ width: `${bookingStep === 1 ? '0%' : bookingStep === 2 ? '50%' : '100%'}` }}
                ></div>
                
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold font-sans transition-all duration-300 ${bookingStep >= 1 ? 'bg-primary border-primary text-white' : 'bg-white border-black/10 text-on-surface/55'}`}>
                    1
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 1 ? 'text-primary font-bold' : 'text-on-surface/55'}`}>
                    {lang === "es" ? "Datos" : "Details"}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold font-sans transition-all duration-300 ${bookingStep >= 2 ? 'bg-primary border-primary text-white' : 'bg-white border-black/10 text-on-surface/55'}`}>
                    2
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 2 ? 'text-primary font-bold' : 'text-on-surface/55'}`}>
                    {lang === "es" ? "Confirmar" : "Confirm"}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold font-sans transition-all duration-300 ${bookingStep >= 3 ? 'bg-primary border-primary text-white' : 'bg-white border-black/10 text-on-surface/55'}`}>
                    3
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 3 ? 'text-primary font-bold' : 'text-on-surface/55'}`}>
                    {lang === "es" ? "Listo" : "Ready"}
                  </span>
                </div>
              </div>
            )}

            {/* Channel Selection Panel */}
            {bookingChannel === null && (
              <div className="space-y-8 text-center">
                <p className="text-on-surface-variant font-sans font-light">
                  {currentT.booking.selectMethod}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* WhatsApp Channel */}
                  <a
                    href="https://wa.me/5213313334751?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20para%20una%20reservaci%C3%B3n%20en%20Restaurante%201937%20Nativo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-primary/20 hover:border-primary hover:bg-[#25D366]/5 p-6 flex flex-col items-center gap-4 group transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                      </svg>
                    </div>
                    <h3 className="font-navigation text-xs uppercase tracking-wider font-bold">WhatsApp</h3>
                    <p className="text-xs text-on-surface-variant/80 font-light leading-relaxed">
                      {lang === "es" ? "Reserva rápida y directa mediante mensaje de WhatsApp." : "Quick and direct booking via WhatsApp chat."}
                    </p>
                  </a>

                  {/* Phone Call Channel */}
                  <a
                    href="tel:+5213313334751"
                    className="border border-primary/20 hover:border-primary hover:bg-primary/5 p-6 flex flex-col items-center gap-4 group transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <h3 className="font-navigation text-xs uppercase tracking-wider font-bold">
                      {lang === "es" ? "Llamada Directa" : "Direct Call"}
                    </h3>
                    <p className="text-xs text-on-surface-variant/80 font-light leading-relaxed">
                      {lang === "es" ? "Reserva al instante hablando con nuestro anfitrión." : "Book instantly by speaking with our host."}
                    </p>
                  </a>

                  {/* Web Page Channel */}
                  <button
                    onClick={() => {
                      setBookingChannel("page");
                      setBookingStep(1);
                    }}
                    className="border border-primary/20 hover:border-primary hover:bg-[#8C4723]/5 p-6 flex flex-col items-center gap-4 group transition-all duration-300 w-full cursor-pointer bg-transparent"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#8C4723]/10 flex items-center justify-center text-[#8C4723] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <h3 className="font-navigation text-xs uppercase tracking-wider font-bold">
                      {lang === "es" ? "En la Página" : "On this Page"}
                    </h3>
                    <p className="text-xs text-on-surface-variant/80 font-light leading-relaxed">
                      {lang === "es" ? "Completa nuestro formulario interactivo en línea." : "Fill out our interactive online booking form."}
                    </p>
                  </button>

                </div>

                <div className="text-xs text-on-surface-variant/60 font-light font-sans pt-4">
                  {currentT.booking.maxCapacity}
                </div>
              </div>
            )}

            {/* Step 1: Info Form */}
            {bookingChannel === "page" && bookingStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant">
                      {currentT.booking.nameLabel} *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      placeholder={lang === "es" ? "Ej. Juan Pérez" : "e.g. John Doe"}
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-xs text-red-600 font-sans">{errors.name}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant">
                      {currentT.booking.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      placeholder={lang === "es" ? "Ej. +52 33 1234 5678" : "e.g. +1 555 123 4567"}
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    />
                    {errors.phone && <p className="text-xs text-red-600 font-sans">{errors.phone}</p>}
                  </div>

                  {/* Number of Guests */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant flex justify-between">
                      <span>{currentT.booking.guestsLabel} *</span>
                      <span className="text-[10px] text-primary/70 italic normal-case font-normal">(1-75 pax)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="75"
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value, 10) || "" })}
                    />
                    {errors.guests && <p className="text-xs text-red-600 font-sans">{errors.guests}</p>}
                  </div>

                  {/* Reason for Visit */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant">
                      {currentT.booking.reasonLabel} *
                    </label>
                    <select
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    >
                      <option value="">{currentT.booking.reasonPlaceholder}</option>
                      {Object.entries(currentT.booking.reasons).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    {errors.reason && <p className="text-xs text-red-600 font-sans">{errors.reason}</p>}
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant flex justify-between">
                      <span>{currentT.booking.dateLabel} *</span>
                      <span className="text-[10px] text-primary/70 italic normal-case font-normal">{lang === "es" ? "(Mar - Dom)" : "(Tue - Sun)"}</span>
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    />
                    {errors.date && <p className="text-xs text-red-600 font-sans">{errors.date}</p>}
                  </div>

                  {/* Time Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold font-sans text-on-surface-variant flex justify-between">
                      <span>{currentT.booking.timeLabel} *</span>
                      <span className="text-[10px] text-primary/70 italic normal-case font-normal">(12:00 - 20:00)</span>
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white border border-primary/20 px-4 py-3 text-sm focus:outline-none focus:border-primary font-sans font-light"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    />
                    {errors.time && <p className="text-xs text-red-600 font-sans">{errors.time}</p>}
                  </div>

                </div>

                <div className="flex gap-4 pt-6 border-t border-primary/10">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingChannel(null);
                      setBookingData({ name: "", phone: "", guests: 2, date: "", time: "", reason: "" });
                      setErrors({});
                    }}
                    className="flex-1 border border-primary/20 hover:bg-black/5 text-on-surface font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer text-center bg-transparent"
                  >
                    {currentT.booking.btnBack}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer shadow hover:shadow-md text-center"
                  >
                    {currentT.booking.btnNext}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Confirmation Summary */}
            {bookingChannel === "page" && bookingStep === 2 && (
              <div className="space-y-6 text-left">
                <h3 className="font-navigation text-xs uppercase tracking-wider font-bold text-primary mb-4 text-center">
                  {lang === "es" ? "Resumen de Reservación" : "Reservation Summary"}
                </h3>
                
                <div className="bg-[#fcf9f3] p-6 border border-primary/10 space-y-4 font-sans font-light text-sm">
                  <div className="grid grid-cols-3 py-2 border-b border-black/5">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.nameLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface font-semibold">{bookingData.name}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-black/5">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.phoneLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface">{bookingData.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-black/5">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.guestsLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface font-semibold">{bookingData.guests} pax</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-black/5">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.dateLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface">{bookingData.date}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 border-b border-black/5">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.timeLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface">{bookingData.time} hrs</span>
                  </div>
                  <div className="grid grid-cols-3 py-2">
                    <span className="text-on-surface-variant font-medium">{currentT.booking.reasonLabel}:</span>
                    <span className="col-span-2 text-right text-on-surface italic">
                      {currentT.booking.reasons[bookingData.reason] || bookingData.reason}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-primary/10">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 border border-primary/20 hover:bg-black/5 text-on-surface font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer text-center bg-transparent"
                  >
                    {currentT.booking.btnBack}
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer shadow hover:shadow-md text-center"
                  >
                    {currentT.booking.btnConfirm}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {bookingChannel === "page" && bookingStep === 3 && (
              <div className="space-y-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-light text-primary">
                    {currentT.booking.stepSuccessTitle}
                  </h3>
                  <p className="text-sm font-sans font-light text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    {currentT.booking.successDesc}
                  </p>
                </div>

                <div className="bg-[#fcf9f3] p-6 border border-primary/10 rounded-sm inline-block max-w-sm w-full mx-auto text-center shadow-inner">
                  <span className="text-[10px] uppercase tracking-wider font-semibold font-sans text-on-surface-variant block mb-1">
                    {currentT.booking.codeLabel}
                  </span>
                  <span className="text-xl font-mono font-bold text-primary block tracking-wider">
                    {bookingCode}
                  </span>
                </div>

                <div className="bg-[#2F403E]/5 border border-[#2F403E]/10 p-4 max-w-md mx-auto text-xs text-on-surface-variant font-sans font-light rounded-sm flex items-start gap-3 text-left">
                  <span className="material-symbols-outlined text-[#2F403E] text-lg shrink-0">notifications_active</span>
                  <div>
                    <span className="font-semibold text-on-surface block mb-1">
                      {lang === "es" ? "Recordatorio Automático" : "Automatic Reminder"}
                    </span>
                    {lang === "es" 
                      ? "Nativo enviará un recordatorio 30 minutos previos a tu hora estimada de llegada para mantener la reserva activa." 
                      : "Nativo will send a reminder 30 minutes prior to your estimated arrival time to keep the reservation active."}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-primary/10">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20b855] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 px-6 transition-all cursor-pointer shadow hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                    </svg>
                    {currentT.booking.btnWaSend}
                  </a>
                  <button
                    onClick={() => {
                      setBookingChannel(null);
                      setBookingData({ name: "", phone: "", guests: 2, date: "", time: "", reason: "" });
                      setBookingStep(1);
                      setBookingCode("");
                    }}
                    className="border border-primary/20 hover:bg-black/5 text-on-surface font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 px-6 transition-all cursor-pointer text-center bg-transparent"
                  >
                    {currentT.booking.btnNewBooking}
                  </button>
                </div>
              </div>
            )}

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

                {/* Redes Sociales Links */}
                <div className="space-y-3 pt-6 border-t border-black/10">
                  <span className="font-label-caps text-label-caps text-primary uppercase text-xs">
                    {lang === "es" ? "Síguenos" : "Follow Us"}
                  </span>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 mt-2">
                    <a
                      href="https://www.instagram.com/1937nativo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                    <a
                      href="https://www.facebook.com/1937nativo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://www.tripadvisor.com.mx/Restaurant_Review-g3160388-d34040214-Reviews-1937_Nativo_Restaurante-Ayotlan.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-lg">reviews</span>
                      <span>TripAdvisor</span>
                    </a>
                  </div>
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
                  <a 
                    href="https://maps.google.com/?q=Carretera+Ayotlan-Atotonilco+km+6.5,+Las+Villas,+47930+Ayotlan,+Jal." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary text-on-primary p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[32px] text-white">location_on</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
