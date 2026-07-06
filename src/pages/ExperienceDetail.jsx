import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// CONFIGURACIÓN DE PAGO: Inserta aquí tu Client ID de PayPal comercial (Live)
// Para pruebas de desarrollo o sandbox, puedes usar "test".
const PAYPAL_CLIENT_ID = "ATvqpIUvCDHFIHEAzauNdAX4o2qPqT-971MgriMfcpZFNQV9_af-WWa0kHCZHwiGFGnnSe2bhK33JPsL";

export default function ExperienceDetail({ lang, packageId, setPage }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [packageId]);

  // Dynamic 3-Month Calendar State
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  // Find tomorrow or next available date for initial selected date
  const getInitialDateStr = () => {
    let temp = new Date(today);
    // Add 1 day to ensure they don't book past times today
    temp.setDate(temp.getDate() + 1);
    for (let i = 0; i < 7; i++) {
      if (temp.getDay() !== 1) { // not Monday
        const y = temp.getFullYear();
        const m = temp.getMonth();
        const d = temp.getDate();
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
      }
      temp.setDate(temp.getDate() + 1);
    }
    return "";
  };

  const [selectedDateStr, setSelectedDateStr] = useState(getInitialDateStr);
  const [selectedTime, setSelectedTime] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  // Staff Controls State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [maxCapacityLimit, setMaxCapacityLimit] = useState(20);
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookingsCapacity, setBookingsCapacity] = useState(() => {
    // Generate deterministic mock occupancy for future slots to feel realistic
    const initial = {};
    let temp = new Date(today);
    for (let i = 0; i < 30; i++) {
      if (temp.getDay() !== 1) {
        const y = temp.getFullYear();
        const m = temp.getMonth();
        const d = temp.getDate();
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        // Generate mock occupancy
        const seed1 = ((d * 3) % 10) + 3; // 3 to 12 spots
        const seed2 = ((d * 7) % 8) + 5; // 5 to 12 spots
        initial[dateStr] = {
          "10:00 AM": seed1,
          "11:00 AM": seed2,
        };
      }
      temp.setDate(temp.getDate() + 1);
    }
    return initial;
  });

  const pricePerPerson = packageId === "oro" ? 550 : 750;
  const occupiedSpots = selectedTime ? (bookingsCapacity[selectedDateStr]?.[selectedTime] || 0) : 0;
  const remainingSpots = maxCapacityLimit - occupiedSpots;

  // Calendar Helpers
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const placeholders = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    placeholders.push(prevMonthDays - i);
  }

  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  const getFormattedDateString = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const isDateInPast = (year, month, day) => {
    const checkDate = new Date(year, month, day, 23, 59, 59);
    return checkDate.getTime() < today.getTime();
  };

  const isDateMonday = (year, month, day) => {
    return new Date(year, month, day).getDay() === 1;
  };

  const handlePrevMonth = () => {
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (currentDate.getTime() > startOfCurrentMonth.getTime()) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    const limitMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    if (currentDate.getTime() < limitMonth.getTime()) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  // Month translation sets
  const monthNamesEs = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthName = lang === "es"
    ? `${monthNamesEs[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : `${monthNamesEn[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const formatReservationDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parts[2];
    
    if (lang === "es") {
      return `${day} de ${monthNamesEs[monthIndex]} de ${year}`;
    } else {
      return `${monthNamesEn[monthIndex]} ${day}, ${year}`;
    }
  };

  // Local translations for booking block
  const localT = {
    es: {
      planTitle: "Planea tu visita.",
      planDesc: "Nuestras puertas están abiertas de Martes a Domingo. Selecciona el horario que mejor se adapte a tu viaje y asegura tu lugar en la mesa.",
      scheduleLabel: "Horarios",
      daysLabel: "Disponibilidad",
      daysValue: "Mar - Dom",
      paymentLabel: "Pagos Seguros",
      successTitle: "¡Reserva Completada!",
      successBtn: "Volver a Agendar",
      confirmBtn: "Proceder al Pago",
      daysOfWeek: ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"],
      guestsLabel: "Número de Personas",
      remainingSpots: "Lugares disponibles: {spots} de {max}",
      soldOut: "Horario Agotado",
      payMethodLabel: "Selecciona tu método de pago",
      payTitle: "Pasarela de Pago Segura",
      paySummary: "Resumen de tu Reserva",
      payTotal: "Total a pagar",
      payConfirm: "Confirmar y Pagar",
      payProcessing: "Procesando pago seguro...",
      qrInstruction: "Guarda o toma captura de este código QR. Deberás presentarlo en el acceso a la hacienda.",
      printQrBtn: "Imprimir / Guardar Ticket",
    },
    en: {
      planTitle: "Plan your visit.",
      planDesc: "Our doors are open from Tuesday to Sunday. Select the time that best suits your trip and secure your place at the table.",
      scheduleLabel: "Hours",
      daysLabel: "Availability",
      daysValue: "Tue - Sun",
      paymentLabel: "Secure Payments",
      successTitle: "Booking Completed!",
      successBtn: "Book Another Visit",
      confirmBtn: "Proceed to Payment",
      daysOfWeek: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      guestsLabel: "Number of Guests",
      remainingSpots: "Available spots: {spots} of {max}",
      soldOut: "Time Slot Sold Out",
      payMethodLabel: "Select your payment method",
      payTitle: "Secure Payment Gateway",
      paySummary: "Your Reservation Summary",
      payTotal: "Total amount",
      payConfirm: "Confirm & Pay",
      payProcessing: "Processing secure payment...",
      qrInstruction: "Save or screenshot this QR code. You must present it at the estate entrance.",
      printQrBtn: "Print / Save Ticket",
    }
  };

  const activeT = localT[lang] || localT.es;

  // Data for the three packages
  const packagesData = {
    oro: {
      es: {
        title: "Experiencia Casa Loy Oro",
        price: "$550.00",
        duration: "2.5 Horas",
        capacity: "Máximo 20 personas",
        desc: "Un viaje de origen a través de nuestro campo de agaves y procesos de destilación artesanal, culminando con una cata privada y nuestro prestigioso obsequio.",
        heroImg: "/Exp_test_1.jpeg",
        features: [
          {
            title: "Recorrido campo de agaves",
            desc: "Camina entre agaves azules en las tierras altas de Ayotlán, Jalisco, y descubre el arte milenario del cultivo y la jima.",
            img: "/Exp_test_1.jpeg"
          },
          {
            title: "Murales e Historia",
            desc: "Recorre el legado familiar a través de las expresiones artísticas y los murales históricos que relatan nuestro origen.",
            img: "/Exp_test_2.jpeg"
          },
          {
            title: "Recorrido por la fábrica",
            desc: "Conoce de primera mano la destilación artesanal, desde la cocción de las piñas en hornos tradicionales de piedra hasta los alambiques de cobre.",
            img: "/Exp_test_3.jpeg"
          },
          {
            title: "Cata en cava subterránea",
            desc: "Una experiencia mística bajo tierra, degustando nuestras expresiones de tequila en una cava privada iluminada por velas.",
            img: "/Exp_test_4.jpeg"
          },
          {
            title: "Mixología de autor",
            desc: "Degusta cócteles exclusivos elaborados por nuestros bartenders con ingredientes locales y el toque característico de Casa Loy.",
            img: "/Exp_test_5.jpeg"
          },
          {
            title: "Botella de TADDEL 200 ML",
            desc: "Lleva a casa una muestra de nuestra pasión: una botella de tequila TADDEL de 200 ml, lista para compartir o resguardar.",
            img: "/Exp_test_6.jpeg"
          }
        ]
      },
      en: {
        title: "Casa Loy Gold Experience",
        price: "$550.00",
        duration: "2.5 Hours",
        capacity: "Max 20 people",
        desc: "A journey of origin through our agave fields and artisanal distillation processes, culminating with a private tasting and our prestigious gift.",
        heroImg: "/Exp_test_1.jpeg",
        features: [
          {
            title: "Agave Field Tour",
            desc: "Walk among blue agaves in the highlands of Ayotlán, Jalisco, and discover the ancient art of cultivation and harvesting.",
            img: "/Exp_test_1.jpeg"
          },
          {
            title: "Murals & History",
            desc: "Explore our family heritage through artistic expressions and historic murals that tell our origin story.",
            img: "/Exp_test_2.jpeg"
          },
          {
            title: "Factory Tour",
            desc: "Witness artisanal distillation firsthand, from cooking agave pinas in traditional stone ovens to copper stills.",
            img: "/Exp_test_3.jpeg"
          },
          {
            title: "Underground Cellar Tasting",
            desc: "A mystical experience underground, tasting our select tequila expressions in a candlelit private cellar.",
            img: "/Exp_test_4.jpeg"
          },
          {
            title: "Signature Mixology",
            desc: "Savor exclusive cocktails crafted by our mixologists with local ingredients and the distinctive Casa Loy touch.",
            img: "/Exp_test_5.jpeg"
          },
          {
            title: "TADDEL 200 ML Bottle",
            desc: "Take home a piece of our passion: a boutique 200 ml bottle of TADDEL tequila, ready to share or collect.",
            img: "/Exp_test_6.jpeg"
          }
        ]
      }
    },
    platino: {
      es: {
        title: "Experiencia Casa Loy Platino",
        price: "$750.00",
        duration: "4.0 Horas",
        capacity: "Máximo 20 personas",
        desc: "La experiencia insignia que fusiona el arte del tequila premium con la alta gastronomía de nuestro restaurante 1937 Nativo.",
        heroImg: "/Exp_test_7.jpeg",
        features: [
          {
            title: "Recorrido campo de agaves",
            desc: "Descubre la majestuosidad del campo de agave azul y aprende sobre el suelo y el clima que otorgan un perfil único a nuestros destilados.",
            img: "/Exp_test_7.jpeg"
          },
          {
            title: "Murales e Historia",
            desc: "Un recorrido guiado por nuestra historia familiar que honra las tradiciones locales y la perseverancia de la tierra.",
            img: "/Exp_test_9.jpeg"
          },
          {
            title: "Recorrido por la fábrica",
            desc: "Explora todo el proceso, desde el jimado tradicional hasta la molienda con tahona y la fermentación controlada.",
            img: "/Exp_test_10.jpeg"
          },
          {
            title: "Cata en cava subterránea",
            desc: "Cata guiada de nuestras mejores barricas en un entorno lleno de historia, misticismo y silencio.",
            img: "/Exp_test_11.jpeg"
          },
          {
            title: "Mixología de autor",
            desc: "Cócteles contemporáneos diseñados para maridar con la atmósfera y los paisajes de la hacienda.",
            img: "/Exp_test_12.jpeg"
          },
          {
            title: "Comida de 3 tiempos",
            desc: "Una experiencia culinaria completa en 1937 Nativo: Entrada de la casa, Plato a escoger entre 3 opciones de autor y un Postre artesanal.",
            img: "/Exp_test_13.jpeg"
          },
          {
            title: "Bebida (2 por persona)",
            desc: "Acompaña tu comida con 2 bebidas selectas por persona para complementar la propuesta gastronómica del chef.",
            img: "/Exp_test_14.jpeg"
          }
        ]
      },
      en: {
        title: "Casa Loy Platinum Experience",
        price: "$750.00",
        duration: "4.0 Hours",
        capacity: "Max 20 people",
        desc: "Our flagship experience fusing premium tequila craftsmanship with fine dining at our 1937 Nativo restaurant.",
        heroImg: "/Exp_test_7.jpeg",
        features: [
          {
            title: "Agave Field Tour",
            desc: "Discover the majesty of the blue agave fields and learn how the soil and climate shape our distillates' profile.",
            img: "/Exp_test_7.jpeg"
          },
          {
            title: "Murals & History",
            desc: "A guided journey through our family history honoring local traditions and the perseverance of the land.",
            img: "/Exp_test_9.jpeg"
          },
          {
            title: "Factory Tour",
            desc: "Explore the entire process from traditional harvesting to tahona stone milling and controlled fermentation.",
            img: "/Exp_test_10.jpeg"
          },
          {
            title: "Underground Cellar Tasting",
            desc: "A guided tasting of our finest barrels in a setting rich with history, mysticism, and quiet aging.",
            img: "/Exp_test_11.jpeg"
          },
          {
            title: "Signature Mixology",
            desc: "Contemporary cocktails designed to pair perfectly with the estate's atmosphere and views.",
            img: "/Exp_test_12.jpeg"
          },
          {
            title: "3-Course Fine Dining",
            desc: "A complete dining experience at 1937 Nativo: House appetizer, selection of 3 main courses, and an artisanal dessert.",
            img: "/Exp_test_13.jpeg"
          },
          {
            title: "Drinks (2 per person)",
            desc: "Accompany your meal with 2 select drinks per person to complement the chef's culinary design.",
            img: "/Exp_test_14.jpeg"
          }
        ]
      }
    },
    diamante: {
      es: {
        title: "Experiencia Casa Loy Diamante",
        price: "$750.00",
        duration: "4.0 Horas",
        capacity: "Máximo 20 personas",
        desc: "Una experiencia culinaria y de tequila de primer nivel que ofrece acceso a colecciones privadas y el menú especial de 1937 Nativo.",
        heroImg: "/Exp_test_15.jpeg",
        features: [
          {
            title: "Recorrido campo de agaves",
            desc: "Camina por los predios más antiguos de la hacienda y jima una piña de agave con tus propias manos guiado por un jimador maestro.",
            img: "/Exp_test_15.jpeg"
          },
          {
            title: "Murales e Historia",
            desc: "Una retrospectiva artística e histórica de Casa Loy y el desarrollo de Ayotlán como referente tequilero.",
            img: "/Exp_test_16.jpeg"
          },
          {
            title: "Recorrido por la fábrica",
            desc: "Aprende el minucioso proceso técnico de destilación y fermentación en tanques de acero y madera tradicional.",
            img: "/Exp_test_17.jpeg"
          },
          {
            title: "Cata en cava subterránea",
            desc: "Degustación exclusiva de tequilas añejos y extra añejos directamente de barricas seleccionadas.",
            img: "/Exp_test_18.jpeg"
          },
          {
            title: "Mixología de autor",
            desc: "Aprende y diseña tu propio cóctel con base en tequila asistido por nuestro mixólogo principal.",
            img: "/Exp_test_19.jpeg"
          },
          {
            title: "Comida de 3 tiempos",
            desc: "Comida gourmet de 3 tiempos en la terraza de 1937 Nativo: entrada selecta, plato a escoger (3 opciones de autor) y postre especial.",
            img: "/Exp_test_13.jpeg"
          },
          {
            title: "Bebida (2 por persona)",
            desc: "Disfruta de dos copas de vino nacional, tequila premium o mixología fina para complementar tu experiencia.",
            img: "/Exp_test_14.jpeg"
          }
        ]
      },
      en: {
        title: "Casa Loy Diamond Experience",
        price: "$750.00",
        duration: "4.0 Hours",
        capacity: "Max 20 people",
        desc: "A premier tequila and dining experience offering access to private reserves and the special signature menu at 1937 Nativo.",
        heroImg: "/Exp_test_15.jpeg",
        features: [
          {
            title: "Agave Field Tour",
            desc: "Walk through the estate's oldest agave fields and harvest a pina yourself guided by a master jimador.",
            img: "/Exp_test_15.jpeg"
          },
          {
            title: "Murals & History",
            desc: "An artistic and historical retrospective of Casa Loy and Ayotlan's emergence as a premier tequila region.",
            img: "/Exp_test_16.jpeg"
          },
          {
            title: "Factory Tour",
            desc: "Learn the meticulous technical distillation process and fermentation in traditional steel and wood tanks.",
            img: "/Exp_test_17.jpeg"
          },
          {
            title: "Underground Cellar Tasting",
            desc: "An exclusive tasting of aged and extra-aged tequilas straight from selected barrels in the private reserve.",
            img: "/Exp_test_18.jpeg"
          },
          {
            title: "Signature Mixology",
            desc: "Learn and craft your own tequila-based cocktail guided by our master mixologist.",
            img: "/Exp_test_19.jpeg"
          },
          {
            title: "3-Course Fine Dining",
            desc: "Gourmet 3-course meal on the terrace of 1937 Nativo: choice of appetizer, selection of 3 main courses, and a special dessert.",
            img: "/Exp_test_13.jpeg"
          },
          {
            title: "Drinks (2 per person)",
            desc: "Enjoy two glasses of boutique local wine, premium tequila, or fine mixology to complete your experience.",
            img: "/Exp_test_14.jpeg"
          }
        ]
      }
    }
  };

  const currentPackage = packagesData[packageId] || packagesData.oro;
  const activeData = currentPackage[lang] || currentPackage.es;

  const handleScrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceedToPayment = () => {
    if (selectedTime && remainingSpots >= numGuests) {
      setPaymentStep(true);
    }
  };

  const handleSimulatePayment = () => {
    if (!selectedPaymentMethod) return;
    setIsPaying(true);

    setTimeout(() => {
      // Deduct spots in client state
      setBookingsCapacity((prev) => ({
        ...prev,
        [selectedDateStr]: {
          ...(prev[selectedDateStr] || {}),
          [selectedTime]: occupiedSpots + numGuests,
        },
      }));
      // Generate unique random reservation code
      const code = `CL-${packageId.toUpperCase()}-${selectedDateStr.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
      setReservationCode(code);
      setIsPaying(false);
      setBookingConfirmed(true);
      setPaymentStep(false);
    }, 1500);
  };

  // QR Content string
  const qrString = `Reserva: ${reservationCode}\nPaquete: ${activeData.title}\nFecha: ${formatReservationDate(selectedDateStr)}\nHora: ${selectedTime}\nPersonas: ${numGuests}\nTotal: $${numGuests * pricePerPerson} MXN\nEstado: PAGADO`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}`;

  return (
    <div className="bg-background text-on-surface">
      {/* Visual Fullscreen Hero */}
      <section className="relative min-h-screen lg:h-screen w-full bg-zinc-950 flex items-center justify-center py-20 lg:py-0">
        <div className="absolute inset-0 z-0">
          <img
            alt={activeData.title}
            className="w-full h-full object-cover brightness-[0.70]"
            src={activeData.heroImg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-auto pt-16">
          <span className="font-navigation text-[clamp(11px,1vw,13px)] text-primary uppercase tracking-[0.4em] mb-4 block font-semibold">
            {lang === "es" ? "Experiencia Exclusiva" : "Exclusive Experience"}
          </span>
          <h1 className="font-serif text-[clamp(32px,5.5vw,72px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-6 drop-shadow-md">
            {activeData.title}
          </h1>
          <p className="font-sans text-[clamp(14px,1.2vw,18px)] text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {activeData.desc}
          </p>
          <div className="flex flex-col items-center gap-4 mb-10">
            <span className="font-serif text-3xl md:text-5xl text-white font-medium drop-shadow-sm">
              {activeData.price}
            </span>
            <span className="font-navigation text-xs uppercase tracking-widest text-primary font-semibold">
              {lang === "es" ? "Por Persona" : "Per Person"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none">
            <button
              onClick={handleScrollToBooking}
              className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-10 transition-all duration-300 min-w-[200px] text-center hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer"
            >
              {lang === "es" ? "Reservar Ahora" : "Book Now"}
            </button>
            <button
              onClick={() => setPage("turismo")}
              className="border border-white/40 hover:border-white hover:bg-white/10 text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-bold py-4 px-10 transition-all duration-300 min-w-[200px] text-center cursor-pointer"
            >
              {lang === "es" ? "Volver a Experiencias" : "Back to Experiences"}
            </button>
          </div>
        </div>
      </section>

      {/* Overview stats panel */}
      <section className="bg-surface-container py-12 border-b border-outline-variant/20 select-none">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-primary text-3xl font-light">schedule</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
              {lang === "es" ? "Duración" : "Duration"}
            </span>
            <span className="font-serif text-lg md:text-xl font-bold">{activeData.duration}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-primary text-3xl font-light">group</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
              {lang === "es" ? "Capacidad" : "Capacity"}
            </span>
            <span className="font-serif text-lg md:text-xl font-bold">{activeData.capacity}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-primary text-3xl font-light">payments</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
              {lang === "es" ? "Precio" : "Price"}
            </span>
            <span className="font-serif text-lg md:text-xl font-bold">{activeData.price} MXN</span>
          </div>
        </div>
      </section>

      {/* Alternating Itinerary sections */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto space-y-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-4">
            {lang === "es" ? "El Itinerario" : "The Itinerary"}
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl leading-tight font-medium">
            {lang === "es" ? "Cada momento diseñado para deleitar" : "Every moment tailored to delight"}
          </h2>
        </div>

        {activeData.features.map((feat, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center text-left`}
            >
              {/* Image box */}
              <div className="w-full lg:w-1/2 group overflow-hidden shadow-xl aspect-[4/3] bg-zinc-100">
                <img
                  alt={feat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={feat.img}
                />
              </div>

              {/* Text box */}
              <div className="w-full lg:w-1/2 space-y-6 lg:px-8">
                <span className="font-serif text-primary text-2xl font-semibold opacity-75">
                  0{idx + 1}.
                </span>
                <h3 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface">
                  {feat.title}
                </h3>
                <div className="w-12 h-[2px] bg-primary"></div>
                <p className="font-body-lg text-on-surface-variant font-light leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Relocated Booking Calendar System */}
      <section className="bg-[#f0eee8]/40 py-24 overflow-hidden text-left border-t border-outline-variant/20" id="booking">
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-8">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block">
                {lang === "es" ? "Agenda tu visita" : "Book your visit"}
              </span>
              <h2 className="font-headline-lg text-4xl md:text-5xl font-medium leading-tight">{activeT.planTitle}</h2>
              <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                {activeT.planDesc}
              </p>
              
              <div className="flex items-center gap-8 py-8 border-y border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-primary text-[10px] uppercase">
                    {activeT.scheduleLabel}
                  </span>
                  <span className="font-headline-md text-xl font-bold">10:00 AM & 11:00 AM</span>
                </div>
                <div className="w-px h-12 bg-outline-variant/30"></div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-primary text-[10px] uppercase">
                    {activeT.daysLabel}
                  </span>
                  <span className="font-headline-md text-xl font-bold">{activeT.daysValue}</span>
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
            <div className="lg:col-span-7">
              <div className="bg-white border border-outline-variant p-4 sm:p-8 md:p-12 shadow-xl relative min-h-[520px] flex flex-col justify-between">
                
                {/* Step 1: Booking Success Screen with QR Access Code */}
                {bookingConfirmed ? (
                  <div className="py-8 text-center space-y-6 flex flex-col items-center justify-center my-auto">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
                      check_circle
                    </span>
                    <h4 className="font-headline-md text-3xl font-bold">{activeT.successTitle}</h4>
                    
                    {/* Access QR Code Display */}
                    <div className="p-4 bg-[#fcf9f3] border border-outline-variant/35 rounded-none shadow-sm flex flex-col items-center gap-4 max-w-sm">
                      <img
                        alt="Reservation QR Access Code"
                        className="w-44 h-44 border-4 border-white shadow-md"
                        src={qrCodeUrl}
                      />
                      <span className="font-mono text-sm font-semibold text-primary">{reservationCode}</span>
                    </div>

                    <p className="font-body-md text-on-surface-variant max-w-md mx-auto text-sm font-light leading-relaxed">
                      {lang === "es"
                        ? `Tu reserva para ${numGuests} ${numGuests === 1 ? "persona" : "personas"} a la "${activeData.title}" ha sido confirmada y liquidada para el ${formatReservationDate(selectedDateStr)} a las ${selectedTime}.`
                        : `Your booking for ${numGuests} ${numGuests === 1 ? "person" : "people"} to the "${activeData.title}" has been confirmed and paid for ${formatReservationDate(selectedDateStr)} at ${selectedTime}.`}
                    </p>
                    
                    <p className="text-xs text-on-surface-variant/80 max-w-xs font-sans leading-normal italic">
                      {activeT.qrInstruction}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 border border-primary text-primary py-3 font-label-caps text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors font-semibold"
                      >
                        {activeT.printQrBtn}
                      </button>
                      <button
                        onClick={() => {
                          setBookingConfirmed(false);
                          setPaymentStep(false);
                          setSelectedTime("");
                          setNumGuests(1);
                        }}
                        className="flex-1 bg-primary text-white py-3 font-label-caps text-xs uppercase tracking-widest hover:bg-[#8c4723] transition-colors font-semibold"
                      >
                        {activeT.successBtn}
                      </button>
                    </div>
                  </div>
                ) : paymentStep ? (
                  /* Step 2: Payment Gateway Form (PayPal & Mercado Pago Selector) */
                  <div className="space-y-6 my-auto">
                    <div className="border-b border-outline-variant/30 pb-4">
                      <h4 className="font-headline-md text-2xl font-bold">{activeT.payTitle}</h4>
                      <p className="text-xs text-on-surface-variant/75 mt-1">
                        {lang === "es" ? "Tu conexión está encriptada y es segura" : "Your connection is encrypted and secure"}
                      </p>
                    </div>

                    {/* Order summary */}
                    <div className="bg-[#fcf9f3] p-6 space-y-4">
                      <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold">
                        {activeT.paySummary}
                      </h5>
                      <div className="flex justify-between text-sm font-sans font-light border-b border-outline-variant/20 pb-2">
                        <span>{activeData.title}</span>
                        <span>{activeData.price}</span>
                      </div>
                      <div className="flex justify-between text-sm font-sans font-light border-b border-outline-variant/20 pb-2">
                        <span>{lang === "es" ? "Fecha y hora" : "Date & time"}</span>
                        <span className="font-medium">{formatReservationDate(selectedDateStr)} a las {selectedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm font-sans font-light border-b border-outline-variant/20 pb-2">
                        <span>{lang === "es" ? "Visitantes" : "Guests"}</span>
                        <span>{numGuests}</span>
                      </div>
                      <div className="flex justify-between text-base font-serif font-bold pt-2 text-on-surface">
                        <span>{activeT.payTotal}</span>
                        <span className="text-primary text-lg">${numGuests * pricePerPerson} MXN</span>
                      </div>
                    </div>

                    {/* Payment methods list */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold font-navigation uppercase tracking-wider text-primary">
                        {activeT.payMethodLabel}
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod("paypal")}
                          className={`flex-1 flex items-center justify-center py-4 border rounded-none transition-all ${
                            selectedPaymentMethod === "paypal"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-outline-variant hover:bg-stone-50"
                          }`}
                        >
                          <span className="font-bold italic text-base text-[#003087] select-none">PayPal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod("mercadopago")}
                          className={`flex-1 flex items-center justify-center py-4 border rounded-none transition-all ${
                            selectedPaymentMethod === "mercadopago"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-outline-variant hover:bg-stone-50"
                          }`}
                        >
                          <span className="font-extrabold text-base text-[#009EE3] select-none">mercado pago</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6">
                      {selectedPaymentMethod === "paypal" ? (
                        <div className="w-full max-w-[280px] mx-auto">
                          <PayPalButtons
                            forceReRender={[numGuests, pricePerPerson, selectedDateStr, selectedTime]}
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 40 }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: (numGuests * pricePerPerson).toString(),
                                      currency_code: "MXN"
                                    },
                                    description: `${activeData.title} - ${numGuests} ${numGuests === 1 ? "persona" : "personas"}`
                                  }
                                ]
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order.capture().then((details) => {
                                const code = `CL-${packageId.toUpperCase()}-${selectedDateStr.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
                                setReservationCode(code);
                                setBookingConfirmed(true);
                                setPaymentStep(false);
                                
                                setBookingsCapacity((prev) => ({
                                  ...prev,
                                  [selectedDateStr]: {
                                    ...(prev[selectedDateStr] || {}),
                                    [selectedTime]: (prev[selectedDateStr]?.[selectedTime] || 0) + numGuests,
                                  },
                                }));
                              });
                            }}
                            onError={(err) => {
                              console.error("PayPal Error:", err);
                              alert(lang === "es" ? "Error procesando el pago con PayPal." : "Error processing payment with PayPal.");
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={handleSimulatePayment}
                          disabled={!selectedPaymentMethod || isPaying}
                          className={`w-full py-4 font-label-caps text-xs uppercase tracking-widest font-semibold transition-all shadow-md ${
                            selectedPaymentMethod && !isPaying
                              ? "bg-primary text-white hover:bg-[#8c4723]"
                              : "bg-stone-200 text-stone-500 cursor-not-allowed"
                          }`}
                        >
                          {isPaying ? activeT.payProcessing : activeT.payConfirm}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setPaymentStep(false)}
                        disabled={isPaying}
                        className="w-full py-3 border border-outline-variant text-on-surface hover:bg-stone-50 font-label-caps text-xs uppercase tracking-widest font-semibold text-center cursor-pointer"
                      >
                        {lang === "es" ? "Atrás" : "Back"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Step 3: Date & Hour Selection calendar */
                  <>
                    <div className="flex justify-between items-center mb-8 select-none border-b border-outline-variant/20 pb-4">
                      <span className="font-headline-md text-xl font-bold">{currentMonthName}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevMonth}
                          className="p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()}
                        >
                          ◀
                        </button>
                        <button
                          onClick={handleNextMonth}
                          className="p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={currentDate.getMonth() === (today.getMonth() + 3) % 12 && currentDate.getFullYear() === today.getFullYear() + Math.floor((today.getMonth() + 3) / 12)}
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Calendar grid representation */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 sm:mb-8 text-center select-none font-navigation text-xs text-on-surface-variant/70 font-semibold border-b border-outline-variant/20 pb-2">
                      {activeT.daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 sm:mb-8 text-center font-navigation text-xs sm:text-sm font-medium">
                      {/* Blank placeholders */}
                      {placeholders.map((day, idx) => (
                        <div key={`place-${idx}`} className="h-10 sm:h-12 flex items-center justify-center text-on-surface/20 cursor-not-allowed select-none">
                          {day}
                        </div>
                      ))}
                      
                      {days.map((day) => {
                        const dateStr = getFormattedDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isBlocked = blockedDates.includes(dateStr);
                        const isPast = isDateInPast(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isMonday = isDateMonday(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isDisabled = isBlocked || isPast || isMonday;
                        const isSelected = selectedDateStr === dateStr;
                        
                        return (
                          <button
                            key={day}
                            disabled={isDisabled}
                            onClick={() => {
                              setSelectedDateStr(dateStr);
                              setSelectedTime("");
                              setNumGuests(1);
                            }}
                            className={`h-10 sm:h-12 flex flex-col items-center justify-center cursor-pointer transition-all border border-transparent rounded-none ${
                              isDisabled
                                ? "text-on-surface/20 bg-stone-50/50 cursor-not-allowed"
                                : isSelected
                                ? "bg-primary text-white scale-105 shadow-md font-semibold"
                                : "hover:bg-primary/5 text-on-surface"
                            }`}
                          >
                            <span className="text-xs sm:text-sm">{day}</span>
                            {isMonday && (
                              <span className="text-[6px] sm:text-[7px] text-stone-400 leading-none lowercase">cerrado</span>
                            )}
                            {isBlocked && (
                              <span className="text-[6px] sm:text-[7px] text-red-500 leading-none lowercase">bloqueado</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time slots selector with occupancy info */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold font-navigation uppercase tracking-widest text-primary mb-2">
                        {activeT.scheduleLabel}
                      </label>
                      <div className="flex gap-4">
                        {["10:00 AM", "11:00 AM"].map((time) => {
                          const occupied = bookingsCapacity[selectedDateStr]?.[time] || 0;
                          const remaining = maxCapacityLimit - occupied;
                          const isFull = remaining <= 0;
                          return (
                            <button
                              key={time}
                              disabled={isFull}
                              onClick={() => {
                                setSelectedTime(time);
                                if (numGuests > remaining) {
                                  setNumGuests(remaining > 0 ? 1 : 0);
                                }
                              }}
                              className={`flex-1 py-4 border font-label-caps text-xs text-center uppercase tracking-widest transition-all ${
                                isFull
                                  ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                                  : selectedTime === time
                                  ? "border-primary bg-primary text-white shadow-md font-semibold"
                                  : "border-outline text-on-surface hover:bg-[#fcf9f3]"
                              }`}
                            >
                              <div>{time}</div>
                              <div className="text-[9px] lowercase font-sans opacity-85 mt-1">
                                {isFull ? activeT.soldOut : activeT.remainingSpots.replace("{spots}", remaining).replace("{max}", maxCapacityLimit)}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Guests count selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold font-navigation uppercase tracking-widest text-primary mb-2">
                        {activeT.guestsLabel}
                      </label>
                      <select
                        value={numGuests}
                        onChange={(e) => setNumGuests(parseInt(e.target.value))}
                        disabled={!selectedTime || remainingSpots <= 0}
                        className="w-full bg-white border border-outline-variant p-4 font-sans text-sm focus:outline-none focus:border-primary disabled:opacity-50 text-on-surface"
                      >
                        {!selectedTime ? (
                          <option value="1">1 {lang === "es" ? "Persona" : "Person"}</option>
                        ) : remainingSpots > 0 ? (
                          Array.from({ length: Math.min(10, remainingSpots) }, (_, i) => i + 1).map(
                            (val) => (
                              <option key={val} value={val}>
                                {val} {val === 1 ? (lang === "es" ? "Persona" : "Person") : (lang === "es" ? "Personas" : "People")}
                              </option>
                            )
                          )
                        ) : (
                          <option value="0">0</option>
                        )}
                      </select>
                    </div>

                    {selectedTime && (
                      <div className="mb-6 text-sm font-sans font-light">
                        {remainingSpots > 0 ? (
                          <p className="text-on-surface-variant border-t border-outline-variant/10 pt-2 text-xs">
                            {lang === "es"
                              ? `Has seleccionado ${numGuests} ${numGuests === 1 ? "lugar" : "lugares"} para la fecha ${formatReservationDate(selectedDateStr)} a las ${selectedTime}.`
                              : `You selected ${numGuests} ${numGuests === 1 ? "spot" : "spots"} for ${formatReservationDate(selectedDateStr)} at ${selectedTime}.`}
                          </p>
                        ) : (
                          <p className="text-error font-semibold uppercase tracking-wider border-t border-outline-variant/10 pt-2">
                            {activeT.soldOut}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleProceedToPayment}
                      disabled={!selectedTime || remainingSpots <= 0 || numGuests > remainingSpots}
                      className={`w-full py-5 font-label-caps text-label-caps uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${
                        selectedTime && remainingSpots >= numGuests
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

      {/* Staff Control Panel Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant w-full max-w-lg p-8 shadow-2xl relative space-y-6 text-on-surface">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 transition-colors font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                <h4 className="font-headline-md text-xl font-bold">Panel de Control de Turismo (Staff)</h4>
              </div>
              <p className="text-xs text-on-surface-variant/80 mt-1">
                Configura límites de cupo, bloquea fechas y ajusta reservas preexistentes.
              </p>
            </div>

            {/* General capacity limit */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
                Límite de Cupo por Horario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxCapacityLimit}
                  onChange={(e) => setMaxCapacityLimit(parseInt(e.target.value) || 20)}
                  className="bg-stone-50 border border-outline-variant p-3 w-28 text-center text-sm font-sans focus:outline-none focus:border-primary"
                />
                <span className="text-xs text-on-surface-variant font-light">
                  personas máximo por slot (por defecto es 20).
                </span>
              </div>
            </div>

            {/* Block specific dates */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/20">
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
                Bloquear Fecha Específica
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  id="admin-block-date"
                  className="bg-stone-50 border border-outline-variant p-3 flex-1 text-sm font-sans focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("admin-block-date");
                    if (input && input.value) {
                      if (!blockedDates.includes(input.value)) {
                        setBlockedDates([...blockedDates, input.value]);
                      }
                      input.value = "";
                    }
                  }}
                  className="bg-primary hover:bg-[#8c4723] text-white px-5 py-3 font-label-caps text-xs uppercase tracking-widest transition-all cursor-pointer font-semibold shadow-sm"
                >
                  Bloquear
                </button>
              </div>
              
              {blockedDates.length > 0 && (
                <div className="max-h-24 overflow-y-auto space-y-1.5 pt-2">
                  {blockedDates.map((dateStr) => {
                    const parts = dateStr.split('-');
                    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    return (
                      <div key={dateStr} className="flex justify-between items-center bg-stone-50 p-2 text-xs border border-stone-100">
                        <span className="font-medium text-stone-700">🔒 {formattedDate}</span>
                        <button
                          onClick={() => setBlockedDates(blockedDates.filter((d) => d !== dateStr))}
                          className="text-red-600 hover:text-red-800 transition-colors font-bold cursor-pointer"
                        >
                          Desbloquear
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Adjust slot occupancy */}
            <div className="space-y-3 pt-2 border-t border-outline-variant/20">
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
                Ajustar Ocupación Manual de Turno
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  id="admin-occupancy-date"
                  className="bg-stone-50 border border-outline-variant p-2 text-xs font-sans focus:outline-none focus:border-primary col-span-1"
                />
                <select
                  id="admin-occupancy-time"
                  className="bg-stone-50 border border-outline-variant p-2 text-xs font-sans focus:outline-none focus:border-primary col-span-1"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                </select>
                <div className="flex gap-1.5 items-center col-span-1">
                  <input
                    type="number"
                    id="admin-occupancy-count"
                    min="0"
                    placeholder="Lugares"
                    className="bg-stone-50 border border-outline-variant p-2 w-full text-xs font-sans focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const dateInput = document.getElementById("admin-occupancy-date");
                  const timeSelect = document.getElementById("admin-occupancy-time");
                  const countInput = document.getElementById("admin-occupancy-count");
                  if (dateInput && dateInput.value && timeSelect && countInput && countInput.value !== "") {
                    const dateStr = dateInput.value;
                    const timeStr = timeSelect.value;
                    const countVal = parseInt(countInput.value) || 0;
                    
                    setBookingsCapacity((prev) => ({
                      ...prev,
                      [dateStr]: {
                        ...(prev[dateStr] || {}),
                        [timeStr]: countVal
                      }
                    }));
                    
                    // Reset inputs
                    dateInput.value = "";
                    countInput.value = "";
                  }
                }}
                className="w-full bg-[#fcf9f3] border border-primary/40 hover:border-primary text-primary py-2.5 font-label-caps text-xs uppercase tracking-widest transition-all cursor-pointer text-center font-bold"
              >
                Actualizar Ocupación
              </button>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 text-right">
              <button
                onClick={() => setIsAdminOpen(false)}
                className="bg-primary text-white px-8 py-3.5 font-label-caps text-xs uppercase tracking-widest hover:bg-[#8c4723] transition-all cursor-pointer font-semibold shadow-md"
              >
                Cerrar y Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
