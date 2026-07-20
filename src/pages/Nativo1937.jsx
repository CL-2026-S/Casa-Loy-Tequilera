import React, { useState, useEffect } from "react";

export default function Nativo1937({ lang = "es", t }) {
  const [showPdf, setShowPdf] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedModalIndex, setSelectedModalIndex] = useState(null);
  const [galleryCategory, setGalleryCategory] = useState("all"); // 'all', 'platillos', 'ambiente', 'espacios'

  const nativoGallery = [
    {
      id: "01",
      img: "/Vive la Experiencia.jpg",
      categoryKey: "espacios",
      title: {
        es: "Terrazas & Paisaje Agavero",
        en: "Outdoor Terraces & Agave Fields"
      },
      subtitle: {
        es: "Una atmósfera fresca e inolvidable entre paisajes tequileros y la calidez de nuestra arquitectura.",
        en: "A fresh and unforgettable atmosphere amidst tequila landscapes and warm architecture."
      },
      badge: {
        es: "Experiencia Nativo",
        en: "Nativo Experience"
      }
    },
    {
      id: "02",
      img: "/Restaurante 1937 Nativo atención al cliente.webp",
      categoryKey: "ambiente",
      title: {
        es: "Mixología de Autor & Servicio",
        en: "Signature Mixology & Service"
      },
      subtitle: {
        es: "Coctelería conceptual fresca concebida en maridaje perfecto con los tequilas de Casa Loy.",
        en: "Fresh conceptual cocktails crafted in perfect pairing with Casa Loy tequilas."
      },
      badge: {
        es: "Mixología & Barra",
        en: "Mixology & Bar"
      }
    },
    {
      id: "03",
      img: "/Platillo 2 1937 Nativo.webp",
      categoryKey: "platillos",
      title: {
        es: "Alta Cocina a las Brasas",
        en: "Haute Wood-Fired Cuisine"
      },
      subtitle: {
        es: "Cortes premium a la leña de encino, mariscos tatemados y frescas reducciones de agave.",
        en: "Premium oak-wood cuts, roasted seafood, and fresh agave reductions."
      },
      badge: {
        es: "Especialidades del Chef",
        en: "Chef's Specials"
      }
    },
    {
      id: "04",
      img: "/Restaurante 1937 Nativo Instalaciones.webp",
      categoryKey: "espacios",
      title: {
        es: "Murales & Piedra Volcánica",
        en: "Murals & Volcanic Stone"
      },
      subtitle: {
        es: "Espacios amplios llenos de luz natural, vegetación orgánica y arte inspirador.",
        en: "Spacious areas full of natural light, organic greenery, and inspiring art."
      },
      badge: {
        es: "Arquitectura & Luz",
        en: "Architecture & Light"
      }
    },
    {
      id: "05",
      img: "/Restaurante 1937 Nativo Instalaciones Mural 2.webp",
      categoryKey: "espacios",
      title: {
        es: "Salones Luminosos & Confort",
        en: "Luminous Lounges & Comfort"
      },
      subtitle: {
        es: "Mobiliario contemporáneo de madera noble en un ambiente amplio y acogedor.",
        en: "Contemporary hardwood furnishings in a spacious and welcoming setting."
      },
      badge: {
        es: "Salones & Confort",
        en: "Lounges & Comfort"
      }
    },
    {
      id: "06",
      img: "/Restaurante 1937 Nativo Instalaciones Mural 3.webp",
      categoryKey: "ambiente",
      title: {
        es: "La Cava & Barra Principal",
        en: "The Cellar & Main Bar"
      },
      subtitle: {
        es: "La colección completa de Tequila Casa Loy lista para catas y momentos memorables.",
        en: "The complete Casa Loy Tequila collection ready for tastings and memorable moments."
      },
      badge: {
        es: "Cava Casa Loy",
        en: "Casa Loy Cellar"
      }
    }
  ];

  const filteredGallery = galleryCategory === "all"
    ? nativoGallery
    : nativoGallery.filter(item => item.categoryKey === galleryCategory);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedModalIndex === null) return;
      if (e.key === "Escape") setSelectedModalIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedModalIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedModalIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModalIndex, filteredGallery.length]);
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    es: {
      heroOvertitle: "1937 Nativo Gastronomía & Tequila",
      heroTitle1: "Restaurante 1937 Nativo:",
      heroTitle2: "Alta Cocina de Autor & Maridaje Tequilero",
      heroDesc: "Cortes premium a las brasas, mariscos y mixología conceptual maridada con los tequilas de Casa Loy Tequilera.",
      btnReservations: "Reservar Mesa",
      btnMenu: "Ver Menú",
      identityLabel: "Nuestra Identidad",
      identityTitle: "Honramos la tierra y el origen.",
      identityDesc: "Honramos la tierra y el origen de Ayotlán, transformando la hospitalidad en una experiencia que conecta a las personas con el tequila, la cocina y la identidad local.",
      historyLink: "Conoce nuestra historia",
      pillarsOvertitle: "La Experiencia Nativo",
      pillarsTitle: "Una mesa cocinada con alma, fuego y agave",
      pillarsDesc: "Fusionamos la fuerza de la brasa con la fineza del tequila para crear una propuesta culinaria que honra sus raíces y cautiva los sentidos.",
      pillar1Title: "El Fuego y la Brasa",
      pillar1Sub: "Leña de encino y mezquite",
      pillar1Desc: "Nuestra cocina gira en torno a la brasa viva. Un ahumado lento que infunde notas rústicas y profundas en cortes premium y mariscos frescos.",
      pillar2Title: "La Esencia del Agave",
      pillar2Sub: "El alma de Casa Loy",
      pillar2Desc: "El tequila no solo acompaña, se integra. Reducciones aromáticas, adobos en pencas y mixología de autor diseñados en perfecta armonía.",
      pillar3Title: "El Respeto al Origen",
      pillar3Sub: "Trazabilidad local",
      pillar3Desc: "Honramos los Altos de Jalisco trabajando de la mano con productores locales, garantizando ingredientes frescos y sustentables en cada plato.",
      menuTitle: "La Carta",
      menuDesc: "Cocina Contemporánea con Productos Nativos: un viaje sensorial a través de los sabores más puros de nuestra región.",
      pdfMenu: "Descargar Menú Completo (PDF)",
      chefLabel: "EL ALMA DE LA COCINA",
      chefTitle: "Sergio Pérez Domínguez",
      chefRole: "Chef Ejecutivo & Visionario Culinario",
      chefDesc1: "Con una trayectoria forjada en la excelencia, el Chef Sergio Pérez Domínguez lidera la propuesta gastronómica de Restaurante 1937 Nativo. Su cocina es un tributo a la biodiversidad de Ayotlán, donde cada ingrediente narra una historia de trazabilidad y respeto por el origen.",
      chefDesc2: "Bajo su visión, la tradición se transforma en vanguardia sensorial, creando maridajes perfectos que elevan la experiencia de Casa Loy a un estándar internacional.",
      chefConceptTitle: "Brasería Mexicana Contemporánea",
      chefConceptDesc: "Cortes premium, mariscos a las brasas y cocina inspirada en la cultura del agave.",
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
          img: "/guacamole-chicharron.jpeg",
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
          img: "/new-york-corte.jpg",
        },
        {
          id: 4,
          title: "Tarta de Limón",
          desc: "Cremoso de limón amarillo sobre base crocante de mantequilla, merengue italiano flameado y ralladura de lima fresca.",
          img: "/tarta-de-limon.jpeg",
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
      pillarsOvertitle: "The Nativo Experience",
      pillarsTitle: "A table cooked with soul, fire, and agave",
      pillarsDesc: "We fuse the strength of the wood fire with the refinement of tequila to create a culinary proposal that honors its roots and captivates the senses.",
      pillar1Title: "Fire & Live Embers",
      pillar1Sub: "Oak and mesquite wood",
      pillar1Desc: "Our kitchen revolves around the live fire. Slow smoking that infuses rustic and deep notes into premium cuts and fresh seafood.",
      pillar2Title: "Agave Essence",
      pillar2Sub: "The soul of Casa Loy",
      pillar2Desc: "Tequila is not just a companion, it integrates. Aromatic reductions, adobos in agave leaves, and signature mixology designed in perfect harmony.",
      pillar3Title: "Respect for Origin",
      pillar3Sub: "Local traceability",
      pillar3Desc: "We honor the Highlands of Jalisco by working hand-in-hand with local producers, guaranteeing fresh and sustainable ingredients on every plate.",
      menuTitle: "The Menu",
      menuDesc: "Contemporary Cuisine with Native Products: a sensory journey through the purest flavors of our region.",
      pdfMenu: "Download Full Menu (PDF)",
      chefLabel: "THE SOUL OF THE KITCHEN",
      chefTitle: "Sergio Pérez Domínguez",
      chefRole: "Executive Chef & Culinary Visionary",
      chefDesc1: "With a career forged in excellence, Chef Sergio Pérez Domínguez leads the culinary vision at Restaurante 1937 Nativo. His cuisine is a tribute to the biodiversity of Ayotlán, where each ingredient tells a story of traceability and respect for its origin.",
      chefDesc2: "Under his vision, tradition transforms into sensory vanguard, creating perfect pairings that elevate the Casa Loy experience to an international standard.",
      chefConceptTitle: "Contemporary Mexican Brasserie",
      chefConceptDesc: "Premium cuts, wood-fired seafood, and cuisine inspired by the agave culture.",
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
          img: "/guacamole-chicharron.jpeg",
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
          img: "/new-york-corte.jpg",
        },
        {
          id: 4,
          title: "Lemon Tart",
          desc: "Smooth lemon curd on a buttery crust, topped with toasted Italian meringue and fresh lime zest.",
          img: "/tarta-de-limon.jpeg",
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

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const rand = Math.floor(10000 + Math.random() * 90000);
    const code = `NAT-${rand}`;
    
    try {
      const response = await fetch("/api/nativo-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          customer_name: bookingData.name,
          customer_phone: bookingData.phone,
          guests: bookingData.guests,
          date_str: bookingData.date,
          time_str: bookingData.time,
          reason: bookingData.reason,
        }),
      });

      if (response.ok) {
        setBookingCode(code);
        setBookingStep(3);
      } else {
        const errorData = await response.json();
        alert(
          lang === "es"
            ? `Error al registrar la reserva: ${errorData.message || errorData.error || "Error del servidor"}`
            : `Error registering reservation: ${errorData.message || errorData.error || "Server error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting nativo booking:", error);
      alert(
        lang === "es"
          ? "Ocurrió un problema de conexión al registrar tu reserva. Por favor, intenta de nuevo."
          : "A connection problem occurred while registering your reservation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    let cleanPhone = bookingData.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "52" + cleanPhone; // Add Mexico prefix
    }
    
    const text = lang === "es"
      ? `Hola, aquí tienes tu código de reservación de 1937 Nativo:\n` +
        `- Código de Reserva: ${bookingCode}\n` +
        `- Nombre: ${bookingData.name}\n` +
        `- Personas: ${bookingData.guests} pax\n` +
        `- Fecha: ${bookingData.date}\n` +
        `- Hora: ${bookingData.time} hrs\n` +
        `- Motivo: ${currentT.booking.reasons[bookingData.reason] || bookingData.reason}\n` +
        `¡Reserva registrada con éxito!`
      : `Hello, here is your 1937 Nativo reservation code:\n` +
        `- Reservation Code: ${bookingCode}\n` +
        `- Name: ${bookingData.name}\n` +
        `- Guests: ${bookingData.guests} pax\n` +
        `- Date: ${bookingData.date}\n` +
        `- Time: ${bookingData.time}\n` +
        `- Reason: ${currentT.booking.reasons[bookingData.reason] || bookingData.reason}\n` +
        `Reservation successfully registered!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-background text-on-surface">
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden" id="experience">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/Restaurante 1937 Nativo.webp" />
            <source 
              media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
              srcSet="/Restaurante 1937 Nativo.webp" 
            />
            <img
              alt="Cinematic view of Restaurante 1937 Nativo restaurant terrace"
              className="w-full h-full object-cover brightness-[0.82]"
              src="/Restaurante 1937 Nativo.webp"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28 animate-slide-left-right">
          <img
            src="/logo-nativo-1937-white.png"
            alt="1937 Nativo"
            className="w-auto h-48 sm:h-56 md:h-64 object-contain mb-12 select-none pointer-events-none"
          />
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <a
              href="#reservations"
              className="bg-[#8C4723] border border-[#8C4723] hover:bg-[#a6562b] hover:border-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
            >
              {currentT.btnReservations}
            </a>
            <a
              href="#menu"
              className="border border-white/60 hover:bg-[#8C4723] hover:border-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium py-3.5 px-8 transition-all duration-500 min-w-[180px] md:min-w-[200px] text-center"
            >
              {currentT.btnMenu}
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

      {/* Apple-Style Fresh & Inviting Gallery Section */}
      <section className="py-24 md:py-32 bg-[#FAF9F6] text-[#1D1D1F] text-left relative overflow-hidden border-b border-black/5" id="heritage">
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-block px-3.5 py-1 bg-[#8C4723]/10 text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.25em] font-semibold rounded-full">
                {lang === "es" ? "Experiencia Gastronómica" : "Gastronomic Experience"}
              </span>
              <h2 className="font-sans text-[clamp(30px,4vw,52px)] font-bold leading-[1.1] tracking-tight text-[#1D1D1F]">
                {lang === "es" 
                  ? "Fresco, auténtico y antojable en cada detalle." 
                  : "Fresh, authentic, and appetizing in every detail."}
              </h2>
              <p className="font-sans text-base md:text-lg text-[#1D1D1F]/70 font-normal leading-relaxed pt-1">
                {lang === "es"
                  ? "Descubre la atmósfera, la brasa y la mixología de Restaurante 1937 Nativo antes de explorar nuestra carta."
                  : "Discover the atmosphere, wood fire, and mixology of Restaurante 1937 Nativo before exploring our menu."}
              </p>
            </div>

            {/* Apple Segmented Pill Filter Bar */}
            <div className="flex items-center gap-1.5 bg-[#EBEAE7] p-1.5 rounded-full shadow-inner border border-black/5 self-start md:self-auto overflow-x-auto max-w-full">
              {[
                { key: "all", label: { es: "Todos", en: "All" } },
                { key: "platillos", label: { es: "Brasas & Cocina", en: "Grill & Kitchen" } },
                { key: "ambiente", label: { es: "Mixología & Barra", en: "Mixology & Bar" } },
                { key: "espacios", label: { es: "Espacios & Terrazas", en: "Spaces & Terraces" } }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setGalleryCategory(tab.key);
                    setActiveGalleryIndex(0);
                  }}
                  className={`px-4 md:px-5 py-2 rounded-full font-navigation text-[11px] font-semibold tracking-wider transition-all duration-300 whitespace-nowrap ${
                    galleryCategory === tab.key
                      ? "bg-white text-[#8C4723] shadow-md scale-100 font-bold"
                      : "text-[#1D1D1F]/60 hover:text-[#1D1D1F]"
                  }`}
                >
                  {tab.label[lang === "es" ? "es" : "en"]}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Hero Stage + Cards Grid */}
          <div className="space-y-8">
            
            {/* Primary Featured Card (Apple Pro Style) */}
            <div className="group relative bg-white rounded-3xl p-4 md:p-6 border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.09)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Main Hero Image */}
                <div 
                  className="lg:col-span-8 relative overflow-hidden rounded-2xl aspect-[16/10] md:aspect-[16/9] bg-zinc-100 cursor-pointer"
                  onClick={() => setSelectedModalIndex(activeGalleryIndex)}
                >
                  <img
                    src={filteredGallery[activeGalleryIndex]?.img || nativoGallery[0].img}
                    alt={filteredGallery[activeGalleryIndex]?.title[lang === "es" ? "es" : "en"]}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 bg-white/90 backdrop-blur-md text-[#8C4723] font-navigation text-[10px] uppercase tracking-[0.2em] font-bold rounded-full shadow-sm">
                      {filteredGallery[activeGalleryIndex]?.badge[lang === "es" ? "es" : "en"]}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#8C4723] backdrop-blur-md p-3 rounded-full text-white transition-all shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
                    </svg>
                  </div>
                </div>

                {/* Hero Info & Controls */}
                <div className="lg:col-span-4 p-4 space-y-6">
                  <div className="space-y-3">
                    <span className="font-navigation text-[11px] uppercase tracking-[0.3em] font-bold text-[#8C4723]">
                      0{activeGalleryIndex + 1} / 0{filteredGallery.length}
                    </span>
                    <h3 className="font-sans text-2xl md:text-3xl font-bold text-[#1D1D1F] leading-tight">
                      {filteredGallery[activeGalleryIndex]?.title[lang === "es" ? "es" : "en"]}
                    </h3>
                    <p className="font-sans text-sm text-[#1D1D1F]/70 font-normal leading-relaxed">
                      {filteredGallery[activeGalleryIndex]?.subtitle[lang === "es" ? "es" : "en"]}
                    </p>
                  </div>

                  {/* Navigation Arrows & Action CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1))}
                        className="w-10 h-10 rounded-full border border-black/10 hover:border-[#8C4723] hover:text-[#8C4723] flex items-center justify-center transition-colors bg-[#F5F5F7]"
                        aria-label="Anterior"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setActiveGalleryIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0))}
                        className="w-10 h-10 rounded-full border border-black/10 hover:border-[#8C4723] hover:text-[#8C4723] flex items-center justify-center transition-colors bg-[#F5F5F7]"
                        aria-label="Siguiente"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <a
                      href="#menu"
                      className="inline-flex items-center gap-2 text-xs font-navigation uppercase tracking-[0.2em] font-bold text-[#8C4723] hover:text-[#a6562b] transition-colors"
                    >
                      {lang === "es" ? "Ver Menú" : "View Menu"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Apple-Style Cards Carousel Reel (All 6 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveGalleryIndex(idx);
                    setSelectedModalIndex(idx);
                  }}
                  className={`group relative bg-white rounded-2xl p-3 border transition-all duration-500 cursor-pointer hover:shadow-xl ${
                    activeGalleryIndex === idx
                      ? "border-[#8C4723] ring-2 ring-[#8C4723]/20 shadow-lg"
                      : "border-black/[0.06] shadow-sm hover:border-black/20"
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 mb-3">
                    <img
                      src={item.img}
                      alt={item.title[lang === "es" ? "es" : "en"]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[#8C4723] font-navigation text-[9px] uppercase tracking-wider font-bold rounded-full shadow-sm">
                        {item.badge[lang === "es" ? "es" : "en"]}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-sans text-base font-bold text-[#1D1D1F] group-hover:text-[#8C4723] transition-colors">
                        {item.title[lang === "es" ? "es" : "en"]}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-[#8C4723]">
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#1D1D1F]/65 line-clamp-2 font-normal">
                      {item.subtitle[lang === "es" ? "es" : "en"]}
                    </p>
                  </div>
                </div>
              ))}
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
              {/* Concept tag */}
              <div className="border-l-2 border-primary/40 pl-5 pt-1 space-y-1">
                <p className="font-serif italic text-[18px] md:text-[20px] text-primary/80 font-medium leading-snug">
                  {currentT.chefConceptTitle}
                </p>
                <p className="font-sans text-[12px] text-on-surface-variant/70 font-light tracking-wide leading-relaxed">
                  {currentT.chefConceptDesc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Boutique Experience Section */}
      <section className="py-28 md:py-36 bg-[#fcf9f3] text-left relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Editorial Text */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-[0.5px] bg-[#8C4723]" />
                  <span className="font-navigation text-[9px] tracking-[0.4em] font-bold text-[#8C4723] uppercase">
                    {lang === "es" ? "Espacios Casa Loy" : "Casa Loy Spaces"}
                  </span>
                </div>
                
                <h2 className="font-serif text-[clamp(28px,3.8vw,46px)] leading-[1.15] tracking-tight text-[#1c1c18] font-medium">
                  {lang === "es" ? "La Boutique de Tequila" : "The Tequila Boutique"}
                </h2>
                <h3 className="font-headline-md text-[20px] italic text-primary/80">
                  {lang === "es" ? "Lleva la excelencia a casa." : "Take excellence home."}
                </h3>
              </div>
              
              <p className="font-sans text-[clamp(14px,1.05vw,16px)] text-[#1c1c18]/70 font-light leading-relaxed">
                {lang === "es"
                  ? "Al finalizar tu experiencia gastronómica en 1937 Nativo, te invitamos a visitar nuestra exclusiva boutique. Descubre ediciones limitadas y botellas especiales de nuestro portafolio —Casa Loy, TADDEL y Tierra Zafiro—, así como artículos artesanales de diseño seleccionados para honrar la herencia tequilera."
                  : "At the conclusion of your culinary experience at 1937 Nativo, we invite you to browse our exclusive boutique. Discover limited editions and special bottles from our portfolio—Casa Loy, TADDEL, and Tierra Zafiro—along with select handcrafted designer pieces curated to honor the tequila heritage."}
              </p>
            </div>

            {/* Right Column: Stunning Visual Card */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] overflow-hidden shadow-2xl border border-outline-variant/10">
                <img
                  src="/Boutique Restaurante.jpg"
                  alt="Casa Loy Tequila Boutique"
                  className="w-full h-full object-cover brightness-[0.95] hover:scale-102 transition-transform duration-[3000ms]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="relative bg-[#fcf9f3] border-t border-[#8C4723]/10 overflow-hidden scroll-mt-28" id="reservations">
        {/* Subtle organic background element */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-multiply bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px] items-stretch relative z-10">
          
          {/* Left Column: Full-bleed Atmospheric Photo */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full bg-zinc-100 overflow-hidden">
            <img
              src="/Restaurante 1937 Nativo Instalaciones.webp"
              alt="1937 Nativo Reservaciones"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.97]"
            />
            {/* Soft tint overlay */}
            <div className="absolute inset-0 bg-[#8C4723]/5 mix-blend-multiply pointer-events-none" />
            
            {/* Elegant text overlay at the bottom of the image */}
            <div className="absolute bottom-8 left-8 right-8 z-10 text-white space-y-2 hidden lg:block">
              <span className="font-navigation text-[9px] tracking-[0.3em] font-bold text-white/90 uppercase block">
                NATIVO 1937
              </span>
              <p className="text-xs font-sans font-light text-white/80 leading-relaxed max-w-xs">
                {lang === "es"
                  ? "Disfruta de una velada inigualable rodeado de campos de agave y alta cocina."
                  : "Enjoy an unforgettable evening surrounded by agave fields and haute cuisine."}
              </p>
            </div>
            {/* Gradient protection */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none hidden lg:block" />
          </div>

          {/* Right Column: Reservation Title, Subtitle, & Interactive Form */}
          <div className="lg:col-span-7 py-20 px-6 sm:px-12 lg:px-16 flex flex-col justify-center space-y-10 bg-[#f8f5ee]/40 w-full">
            
            {/* Header */}
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[0.5px] bg-[#8C4723]/40" />
                <span className="font-navigation text-[9px] tracking-[0.35em] font-bold text-[#8C4723] uppercase block">
                  {lang === "es" ? "Reserva tu Experiencia" : "Book Your Experience"}
                </span>
              </div>
              <h2 className="font-serif text-[clamp(30px,3.2vw,44px)] leading-[1.1] tracking-tight font-medium text-[#1c1c18]">
                {currentT.booking.title}
              </h2>
              <p className="font-sans text-[clamp(13px,0.95vw,14.5px)] text-[#1c1c18]/70 font-light leading-relaxed">
                {currentT.booking.subtitle}
              </p>
            </div>

            {/* Interactive Form Area */}
            <div className="max-w-xl w-full">
                
                {/* Steps indicator - Only show if page channel selected */}
                {bookingChannel === "page" && (
                  <div className="flex items-center justify-between mb-10 max-w-md mx-auto relative">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#1c1c18]/10 -z-10"></div>
                    {/* Active progress line */}
                    <div 
                      className="absolute top-1/2 left-0 h-[1px] bg-[#8C4723] transition-all duration-500 -z-10"
                      style={{ width: `${bookingStep === 1 ? '0%' : bookingStep === 2 ? '50%' : '100%'}` }}
                    ></div>
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold font-sans transition-all duration-300 ${bookingStep >= 1 ? 'bg-[#8C4723] border-[#8C4723] text-white' : 'bg-[#fcf9f3] border-[#1c1c18]/15 text-[#1c1c18]/40'}`}>
                        1
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 1 ? 'text-[#8C4723] font-bold' : 'text-[#1c1c18]/40'}`}>
                        {lang === "es" ? "Datos" : "Details"}
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold font-sans transition-all duration-300 ${bookingStep >= 2 ? 'bg-[#8C4723] border-[#8C4723] text-white' : 'bg-[#fcf9f3] border-[#1c1c18]/15 text-[#1c1c18]/40'}`}>
                        2
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 2 ? 'text-[#8C4723] font-bold' : 'text-[#1c1c18]/40'}`}>
                        {lang === "es" ? "Confirmar" : "Confirm"}
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold font-sans transition-all duration-300 ${bookingStep >= 3 ? 'bg-[#8C4723] border-[#8C4723] text-white' : 'bg-[#fcf9f3] border-[#1c1c18]/15 text-[#1c1c18]/40'}`}>
                        3
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold font-sans ${bookingStep >= 3 ? 'text-[#8C4723] font-bold' : 'text-[#1c1c18]/40'}`}>
                        {lang === "es" ? "Listo" : "Ready"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Channel Selection Panel */}
                {bookingChannel === null && (
                  <div className="space-y-6 text-center lg:text-left">
                    <p className="text-[#1c1c18]/80 font-sans font-light text-[13px] leading-relaxed">
                      {currentT.booking.selectMethod}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                      
                      {/* WhatsApp Channel */}
                      <a
                        href="https://wa.me/5213313334751?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20para%20una%20reservaci%C3%B3n%20en%20Restaurante%201937%20Nativo."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#8C4723]/10 bg-[#fdfbf9] hover:border-[#8C4723]/35 hover:bg-[#8C4723]/5 p-5 flex flex-col items-center text-center gap-4 group transition-all duration-500 rounded-[2px]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#25D366]/8 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform duration-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                          </svg>
                        </div>
                        <h3 className="font-navigation text-[11px] uppercase tracking-[0.15em] font-bold text-[#1c1c18] group-hover:text-[#8C4723] transition-colors">WhatsApp</h3>
                        <p className="text-[10px] text-[#1c1c18]/50 font-light leading-relaxed group-hover:text-[#1c1c18]/70 transition-colors">
                          {lang === "es" ? "Reserva rápida y directa." : "Quick and direct booking."}
                        </p>
                      </a>

                      {/* Phone Call Channel */}
                      <a
                        href="tel:+5213313334751"
                        className="border border-[#8C4723]/10 bg-[#fdfbf9] hover:border-[#8C4723]/35 hover:bg-[#8C4723]/5 p-5 flex flex-col items-center text-center gap-4 group transition-all duration-500 rounded-[2px]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#8C4723]/8 flex items-center justify-center text-[#8C4723] group-hover:scale-105 transition-transform duration-500">
                          <span className="material-symbols-outlined text-[18px]">call</span>
                        </div>
                        <h3 className="font-navigation text-[11px] uppercase tracking-[0.15em] font-bold text-[#1c1c18] group-hover:text-[#8C4723] transition-colors">
                          {lang === "es" ? "Llamada" : "Direct Call"}
                        </h3>
                        <p className="text-[10px] text-[#1c1c18]/50 font-light leading-relaxed group-hover:text-[#1c1c18]/70 transition-colors">
                          {lang === "es" ? "Reserva al instante por teléfono." : "Book instantly by phone."}
                        </p>
                      </a>

                      {/* Web Page Channel */}
                      <button
                        onClick={() => {
                          setBookingChannel("page");
                          setBookingStep(1);
                        }}
                        className="border border-[#8C4723]/10 bg-[#fdfbf9] hover:border-[#8C4723]/35 hover:bg-[#8C4723]/5 p-5 flex flex-col items-center text-center gap-4 group transition-all duration-500 w-full cursor-pointer bg-transparent rounded-[2px]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#8C4723]/8 flex items-center justify-center text-[#8C4723] group-hover:scale-105 transition-transform duration-500">
                          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        </div>
                        <h3 className="font-navigation text-[11px] uppercase tracking-[0.15em] font-bold text-[#1c1c18] group-hover:text-[#8C4723] transition-colors">
                          {lang === "es" ? "En la Página" : "On this Page"}
                        </h3>
                        <p className="text-[10px] text-[#1c1c18]/50 font-light leading-relaxed group-hover:text-[#1c1c18]/70 transition-colors">
                          {lang === "es" ? "Formulario en línea interactivo." : "Interactive online form."}
                        </p>
                      </button>

                    </div>
                  </div>
                )}

                {/* Step 1: Info Form */}
                {bookingChannel === "page" && bookingStep === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name Input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70">
                          {currentT.booking.nameLabel} *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 placeholder:text-[#1c1c18]/30 rounded-none"
                          placeholder={lang === "es" ? "Ej. Juan Pérez" : "e.g. John Doe"}
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        />
                        {errors.name && <p className="text-xs text-red-600 font-sans">{errors.name}</p>}
                      </div>

                      {/* Phone Input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70">
                          {currentT.booking.phoneLabel} *
                        </label>
                        <input
                          type="tel"
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 placeholder:text-[#1c1c18]/30 rounded-none"
                          placeholder={lang === "es" ? "Ej. +52 33 1234 5678" : "e.g. +1 555 123 4567"}
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        />
                        {errors.phone && <p className="text-xs text-red-600 font-sans">{errors.phone}</p>}
                      </div>

                      {/* Number of Guests */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70 flex justify-between">
                          <span>{currentT.booking.guestsLabel} *</span>
                          <span className="text-[10px] text-[#1c1c18]/45 italic normal-case font-normal">(1-75 pax)</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="75"
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 rounded-none"
                          value={bookingData.guests}
                          onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value, 10) || "" })}
                        />
                        {errors.guests && <p className="text-xs text-red-600 font-sans">{errors.guests}</p>}
                      </div>

                      {/* Reason for Visit */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70">
                          {currentT.booking.reasonLabel} *
                        </label>
                        <select
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 rounded-none"
                          value={bookingData.reason}
                          onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                        >
                          <option value="">{currentT.booking.reasonPlaceholder}</option>
                          {Object.entries(currentT.booking.reasons).map(([key, label]) => (
                            <option key={key} value={key} className="bg-white text-[#1c1c18]">{label}</option>
                          ))}
                        </select>
                        {errors.reason && <p className="text-xs text-red-600 font-sans">{errors.reason}</p>}
                      </div>

                      {/* Date Input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70 flex justify-between">
                          <span>{currentT.booking.dateLabel} *</span>
                          <span className="text-[10px] text-[#1c1c18]/45 italic normal-case font-normal">{lang === "es" ? "(Mar - Dom)" : "(Tue - Sun)"}</span>
                        </label>
                        <input
                          type="date"
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 rounded-none"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        />
                        {errors.date && <p className="text-xs text-red-600 font-sans">{errors.date}</p>}
                      </div>

                      {/* Time Input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/70 flex justify-between">
                          <span>{currentT.booking.timeLabel} *</span>
                          <span className="text-[10px] text-[#1c1c18]/45 italic normal-case font-normal">(12:00 - 20:00)</span>
                        </label>
                        <input
                          type="time"
                          className="w-full bg-[#fcfbf9] border border-[#1c1c18]/12 px-4 py-3 text-sm focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-sans font-light text-[#1c1c18] transition-all duration-300 rounded-none"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        />
                        {errors.time && <p className="text-xs text-red-600 font-sans">{errors.time}</p>}
                      </div>

                    </div>

                    <div className="flex gap-4 pt-6 border-t border-[#1c1c18]/10">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingChannel(null);
                          setBookingData({ name: "", phone: "", guests: 2, date: "", time: "", reason: "" });
                          setErrors({});
                        }}
                        className="flex-1 border border-[#1c1c18]/20 hover:bg-[#1c1c18]/5 text-[#1c1c18] font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer text-center bg-transparent rounded-none"
                      >
                        {currentT.booking.btnBack}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer shadow hover:shadow-md text-center rounded-none"
                      >
                        {currentT.booking.btnNext}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Confirmation Summary */}
                {bookingChannel === "page" && bookingStep === 2 && (
                  <div className="space-y-6 text-left">
                    <h3 className="font-navigation text-[11px] uppercase tracking-wider font-bold text-[#8C4723] mb-4 text-center">
                      {lang === "es" ? "Resumen de Reservación" : "Reservation Summary"}
                    </h3>
                    
                    <div className="bg-[#fcfbf9] p-6 border border-[#1c1c18]/10 space-y-4 font-sans font-light text-sm text-[#1c1c18]">
                      <div className="grid grid-cols-3 py-2 border-b border-[#1c1c18]/8">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.nameLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18] font-semibold">{bookingData.name}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-[#1c1c18]/8">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.phoneLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18]">{bookingData.phone}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-[#1c1c18]/8">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.guestsLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18] font-semibold">{bookingData.guests} pax</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-[#1c1c18]/8">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.dateLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18]">{bookingData.date}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-[#1c1c18]/8">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.timeLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18]">{bookingData.time} hrs</span>
                      </div>
                      <div className="grid grid-cols-3 py-2">
                        <span className="text-[#1c1c18]/60 font-medium">{currentT.booking.reasonLabel}:</span>
                        <span className="col-span-2 text-right text-[#1c1c18] italic">
                          {currentT.booking.reasons[bookingData.reason] || bookingData.reason}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-[#1c1c18]/10">
                      <button
                        disabled={isSubmitting}
                        onClick={() => setBookingStep(1)}
                        className="flex-1 border border-[#1c1c18]/20 hover:bg-[#1c1c18]/5 text-[#1c1c18] font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer text-center bg-transparent disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                      >
                        {currentT.booking.btnBack}
                      </button>
                      <button
                        disabled={isSubmitting}
                        onClick={handleConfirmBooking}
                        className="flex-1 bg-[#8C4723] hover:bg-[#a6562b] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 transition-all cursor-pointer shadow hover:shadow-md text-center disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 rounded-none"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{lang === "es" ? "Procesando..." : "Processing..."}</span>
                          </>
                        ) : (
                          currentT.booking.btnConfirm
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success Screen */}
                {bookingChannel === "page" && bookingStep === 3 && (
                  <div className="space-y-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-500/10 flex items-center justify-center text-green-600 mx-auto">
                      <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl font-light text-[#8C4723]">
                        {currentT.booking.stepSuccessTitle}
                      </h3>
                      <p className="text-sm font-sans font-light text-[#1c1c18]/75 max-w-md mx-auto leading-relaxed">
                        {currentT.booking.successDesc}
                      </p>
                    </div>

                    <div className="bg-[#fcfbf9] p-6 border border-[#1c1c18]/10 rounded-sm inline-block max-w-sm w-full mx-auto text-center shadow-inner">
                      <span className="text-[10px] uppercase tracking-wider font-semibold font-sans text-[#1c1c18]/60 block mb-1">
                        {currentT.booking.codeLabel}
                      </span>
                      <span className="text-xl font-mono font-bold text-[#8C4723] block tracking-wider">
                        {bookingCode}
                      </span>
                    </div>

                    <div className="bg-[#fdfbf8] border border-[#8C4723]/10 p-4 max-w-md mx-auto text-xs text-[#1c1c18]/75 font-sans font-light rounded-sm flex items-start gap-3 text-left">
                      <span className="material-symbols-outlined text-[#8C4723] text-lg shrink-0">notifications_active</span>
                      <div>
                        <span className="font-semibold text-[#1c1c18] block mb-1">
                          {lang === "es" ? "Recordatorio Automático" : "Automatic Reminder"}
                        </span>
                        {lang === "es" 
                          ? "Nativo enviará un recordatorio 30 minutos previos a tu hora estimada de llegada para mantener la reserva activa." 
                          : "Nativo will send a reminder 30 minutes prior to your estimated arrival time to keep the reservation active."}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-[#1c1c18]/10">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20b855] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 px-6 transition-all cursor-pointer shadow hover:shadow-md flex items-center justify-center gap-2 rounded-none"
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
                        className="border border-[#1c1c18]/20 hover:bg-[#1c1c18]/5 text-[#1c1c18] font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold py-3 px-6 transition-all cursor-pointer text-center bg-transparent rounded-none"
                      >
                        {currentT.booking.btnNewBooking}
                      </button>
                    </div>
                  </div>
                )}

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
                <div className="space-y-3">
                  <span className="font-label-caps text-label-caps text-primary uppercase text-xs">
                    {currentT.addressLabel}
                  </span>
                  <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
                    {currentT.addressVal}
                  </p>
                  <a
                    href="https://maps.app.goo.gl/u6vrCmwi2Yphuv3v7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[#8C4723] hover:bg-[#8C4723] text-[#8C4723] hover:text-white px-5 py-2.5 text-[11px] font-navigation uppercase tracking-wider font-semibold transition-all duration-300 rounded-[2px]"
                  >
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    {lang === "es" ? "Cómo llegar con Google Maps" : "Get Directions with Google Maps"}
                  </a>
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

            <div className="lg:col-span-8 mt-12 lg:mt-0 w-full min-h-[400px] lg:min-h-[480px] bg-[#fcf9f3]/60 backdrop-blur-md p-2 shadow-sm rounded-[3px] border border-black/5 overflow-hidden">
              <iframe
                title="Google Maps Location"
                src="https://maps.google.com/maps?q=1937+Nativo+Restaurante,+Ayotlan,+Jal.&z=16&t=&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] lg:min-h-[460px] border-0 rounded-[2px]"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Apple-Style Cinema Lightbox Modal */}
      {selectedModalIndex !== null && filteredGallery[selectedModalIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-10 text-white animate-fadeIn select-none"
          onClick={() => setSelectedModalIndex(null)}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="w-6 h-[0.5px] bg-[#8C4723]" />
              <span className="font-navigation text-[10px] uppercase tracking-[0.3em] text-[#D4A373]">
                {filteredGallery[selectedModalIndex].badge[lang === "es" ? "es" : "en"]}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-sans font-semibold text-sm text-white/70">
                0{selectedModalIndex + 1} / 0{filteredGallery.length}
              </span>
              <button
                onClick={() => setSelectedModalIndex(null)}
                className="w-10 h-10 rounded-full border border-white/20 hover:bg-[#8C4723] hover:border-[#8C4723] flex items-center justify-center transition-all duration-300"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Stage & Prev/Next Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Prev Arrow */}
            <button
              onClick={() => setSelectedModalIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1))}
              className="absolute left-2 md:left-6 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/50 hover:bg-[#8C4723] hover:border-[#8C4723] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-2xl"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* High-Res Image Display */}
            <img 
              src={filteredGallery[selectedModalIndex].img} 
              alt={filteredGallery[selectedModalIndex].title[lang === "es" ? "es" : "en"]} 
              className="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-2xl border border-white/10 transition-transform duration-500"
            />

            {/* Next Arrow */}
            <button
              onClick={() => setSelectedModalIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 md:right-6 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/50 hover:bg-[#8C4723] hover:border-[#8C4723] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-2xl"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bottom Bar Info */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-sans text-xl md:text-2xl text-white font-bold">
                {filteredGallery[selectedModalIndex].title[lang === "es" ? "es" : "en"]}
              </h3>
              <p className="font-sans text-xs md:text-sm text-white/60 font-normal mt-1">
                {filteredGallery[selectedModalIndex].subtitle[lang === "es" ? "es" : "en"]}
              </p>
            </div>
            <div className="font-navigation text-[10px] uppercase tracking-[0.2em] text-[#D4A373] hidden md:block">
              {lang === "es" ? "Navega con flechas o clic" : "Navigate with arrows or click"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
