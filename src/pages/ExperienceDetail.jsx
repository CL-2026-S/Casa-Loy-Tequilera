import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// CONFIGURACIÓN DE PAGO: Inserta aquí tu Client ID de PayPal comercial (Live)
// Para pruebas de desarrollo o sandbox, puedes usar "test".
const PAYPAL_CLIENT_ID = "AbyKuzlmnXXLw8pF1BR0SDFXDwlqRhxPdlysrAbffLKsbZdggzNOpHAEBLbA8bu1cSYLgEpHDpXkpJ6C";

const REGIMENES_FISCALES = [
  { code: "601", label: "601 - General de Ley Personas Morales" },
  { code: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { code: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { code: "606", label: "606 - Arrendamiento" },
  { code: "607", label: "607 - Régimen de Enajenación o Adquisición de Bienes" },
  { code: "608", label: "608 - Demás ingresos" },
  { code: "609", label: "609 - Consolidación" },
  { code: "610", label: "610 - Residentes en el Extranjero sin Establecimiento Permanente en México" },
  { code: "611", label: "611 - Ingresos por Dividendos (socios y accionistas)" },
  { code: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
  { code: "614", label: "614 - Ingresos por intereses" },
  { code: "615", label: "615 - Régimen de los ingresos por obtención de premios" },
  { code: "616", label: "616 - Sin obligaciones fiscales" },
  { code: "620", label: "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
  { code: "621", label: "621 - Incorporación Fiscal" },
  { code: "622", label: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { code: "623", label: "623 - Opcional para Grupos de Sociedades" },
  { code: "624", label: "624 - Coordinados" },
  { code: "625", label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { code: "626", label: "626 - Régimen Simplificado de Confianza" },
  { code: "628", label: "628 - Hidrocarburos" },
  { code: "629", label: "629 - De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales" },
  { code: "630", label: "630 - Enajenación de acciones en bolsa de valores" }
];


const packagesData = {
  oro: {
    es: {
      title: "Experiencia Casa Loy Oro",
      price: "$550.00",
      duration: "2.5 Horas",
      capacity: "Máximo 50 personas",
      desc: "Un viaje de origen a través de nuestro campo de agaves y procesos de destilación artesanal, culminando con una cata privada y nuestro prestigioso obsequio.",
      heroImg: "/Cata Experiencias.webp",
      features: [
        {
          title: "Recorrido campo de agaves",
          desc: "Camina entre agaves azules en las tierras altas de Ayotlán, Jalisco, y descubre el arte milenario del cultivo y la jima.",
          img: "/Cata en Terraza TADDEL.webp"
        },
        {
          title: "Murales e Historia",
          desc: "Recorre el legacy familiar a través de las expresiones artísticas y los murales históricos que relatan nuestro origen.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Recorrido por la destilería",
          desc: "Conoce de primera mano la destilería y descubre el proceso detrás de nuestras expresiones de tequila.",
          img: "/Cata Experiencias.webp"
        },
        {
          title: "Cata en cava subterránea",
          desc: "Experiencia sensorial: activa tus 5 sentidos y degusta nuestras expresiones de tequila en nuestra cava subterránea.",
          img: "/Cata experiencias (2).webp"
        },
        {
          title: "Mixología de autor",
          desc: "Degusta cocteles de autor elaborados por nuestro mixólogo con ingredientes locales y el toque característico de nuestras expresiones de tequila.",
          img: "/Terraza.webp"
        },
        {
          title: "Botella de TADDEL 200 ML",
          desc: "Lleva a casa una muestra de nuestra pasión: una botella de tequila TADDEL de 200 ml, lista para compartir o resguardar.",
          img: "/taddel_200ml_bottle.webp"
        }
      ]
    },
    en: {
      title: "Casa Loy Gold Experience",
      price: "$550.00",
      duration: "2.5 Hours",
      capacity: "Max 50 people",
      desc: "A journey of origin through our agave fields and artisanal distillation processes, culminating with a private tasting and our prestigious gift.",
      heroImg: "/Cata Experiencias.webp",
      features: [
        {
          title: "Agave Field Tour",
          desc: "Walk among blue agaves in the highlands of Ayotlán, Jalisco, and discover the ancient art of cultivation and harvesting.",
          img: "/Cata en Terraza TADDEL.webp"
        },
        {
          title: "Murals & History",
          desc: "Explore our family heritage through artistic expressions and historic murals that tell our origin story.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Distillery Tour",
          desc: "Witness firsthand our distillery and discover the process behind our tequila expressions.",
          img: "/Cata Experiencias.webp"
        },
        {
          title: "Underground Cellar Tasting",
          desc: "Sensory experience: activate your 5 senses and taste our tequila expressions in our underground cellar.",
          img: "/Cata experiencias (2).webp"
        },
        {
          title: "Signature Mixology",
          desc: "Savor signature cocktails crafted by our mixologist with local ingredients and the characteristic touch of our tequila expressions.",
          img: "/Terraza.webp"
        },
        {
          title: "TADDEL 200 ML Bottle",
          desc: "Take home a piece of our passion: a boutique 200 ml bottle of TADDEL tequila, ready to share or collect.",
          img: "/taddel_200ml_bottle.webp"
        }
      ]
    }
  },
  platino: {
    es: {
      title: "Experiencia Casa Loy Platino",
      price: "$750.00",
      duration: "4.0 Horas",
      capacity: "Máximo 50 personas",
      desc: "La experiencia insignia que fusiona el arte del tequila premium con la alta gastronomía de nuestro restaurante 1937 Nativo.",
      heroImg: "/Recorrido Platino.webp",
      features: [
        {
          title: "Recorrido campo de agaves",
          desc: "Descubre la majestuosidad del campo de agave azul y aprende sobre el suelo y el clima que otorgan un perfil único a nuestros destilados.",
          img: "/Recorrido Platino.webp"
        },
        {
          title: "Murales e Historia",
          desc: "Un recorrido guiado por nuestra historia familiar que honra las tradiciones locales y la perseverancia de la tierra.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Recorrido por la fábrica",
          desc: "Desde la siembra hasta la elaboración de nuestras expresiones de tequila.",
          img: "/Recorrido Platino.webp"
        },
        {
          title: "Cata en cava subterránea",
          desc: "Cata sensorial de nuestras expresiones, llenas de notas, aromas y matices que reflejan nuestra tradición tequilera.",
          img: "/Recorrido Platino Cava Cata.webp"
        },
        {
          title: "Mixología de autor",
          desc: "Cocteles de autor diseñados para maridar con gastronomía contemporánea.",
          img: "/Cata experiencias (2).webp"
        },
        {
          title: "Comida de 3 tiempos",
          desc: "Una experiencia culinaria completa en 1937 Nativo: Entrada de la casa, Plato a escoger entre 3 opciones de autor y un delicioso postre.",
          img: "/Terraza.webp"
        },
        {
          title: "Bebida (2 por persona)",
          desc: "Acompaña tu comida con 2 bebidas selectas por persona para complementar la propuesta gastronomómica del chef.",
          img: "/Cata en Terraza TADDEL.webp"
        }
      ]
    },
    en: {
      title: "Casa Loy Platinum Experience",
      price: "$750.00",
      duration: "4.0 Hours",
      capacity: "Max 50 people",
      desc: "Our flagship experience fusing premium tequila craftsmanship with fine dining at our 1937 Nativo restaurant.",
      heroImg: "/Recorrido Platino.webp",
      features: [
        {
          title: "Agave Field Tour",
          desc: "Discover the majesty of the blue agave fields and learn how the soil and climate shape our distillates' profile.",
          img: "/Recorrido Platino.webp"
        },
        {
          title: "Murals & History",
          desc: "A guided journey through our family history honoring local traditions and the perseverance of the land.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Factory Tour",
          desc: "From planting to the crafting of our tequila expressions.",
          img: "/Recorrido Platino.webp"
        },
        {
          title: "Underground Cellar Tasting",
          desc: "Sensory tasting of our expressions, full of notes, aromas, and nuances that reflect our tequila tradition.",
          img: "/Recorrido Platino Cava Cata.webp"
        },
        {
          title: "Signature Mixology",
          desc: "Signature cocktails designed to pair with contemporary gastronomy.",
          img: "/Cata experiencias (2).webp"
        },
        {
          title: "3-Course Fine Dining",
          desc: "A complete dining experience at 1937 Nativo: House appetizer, selection of 3 main courses, and a delicious dessert.",
          img: "/Terraza.webp"
        },
        {
          title: "Drinks (2 per person)",
          desc: "Accompany your meal with 2 select drinks per person to complement the chef's culinary design.",
          img: "/Cata en Terraza TADDEL.webp"
        }
      ]
    }
  },
  diamante: {
    es: {
      title: "Experiencia Casa Loy Diamante",
      price: "$1,500.00",
      duration: "4.0 Horas",
      capacity: "Máximo 50 personas",
      desc: "Una experiencia gastronómica y de tequila de primer nivel que ofrece acceso a colecciones privadas, mixología de autor, cata subterránea y el menú de lujo de 1937 Nativo.",
      heroImg: "/Diamante Experiencias.webp",
      features: [
        {
          title: "Recorrido campo de agaves",
          desc: "Camina por los campos de la destilería guiado por nuestros expertos.",
          img: "/Recorrido Diamante Visita.webp"
        },
        {
          title: "Murales y Historia",
          desc: "Una retrospectiva artística e histórica de Casa Loy y el desarrollo de Ayotlán como referente tequilero.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Recorrido por la destilería",
          desc: "Aprende el minucioso proceso de destilación para lograr nuestras expresiones de tequila.",
          img: "/Recorrido Diamante proceso.webp"
        },
        {
          title: "Cata en cava subterránea",
          desc: "Cata sensorial: degusta nuestras expresiones de tequila y descubre sus aromas, notas y personalidad.",
          img: "/Recorrido Diamante Cava Cata.webp"
        },
        {
          title: "Clase de Mixología de autor",
          desc: "Aprende y diseña tu propio cóctel con base en tequila asistido por nuestro mixólogo principal.",
          img: "/Recorrido Diamante Cava.webp"
        },
        {
          title: "Experiencia Luxury Gastronómica en 1937 Nativo",
          desc: "Comida gourmet maridaje de primer nivel en la terraza de 1937 Nativo con platillos exclusivos de autor.",
          img: "/Recorrido Diamante.webp"
        },
        {
          title: "Kit de Souvenirs",
          desc: "Llévate un recuerdo exclusivo de tu paso por Casa Loy Tequilera.",
          img: "/Recorrido Diamante agave cocido.webp"
        }
      ]
    },
    en: {
      title: "Casa Loy Diamond Experience",
      price: "$1,500.00",
      duration: "4.0 Hours",
      capacity: "Max 50 people",
      desc: "A premier tequila and dining experience offering access to private reserves, signature mixology class, cellar tasting, and the special signature menu at 1937 Nativo.",
      heroImg: "/Diamante Experiencias.webp",
      features: [
        {
          title: "Agave Field Tour",
          desc: "Walk through the distillery's fields guided by our experts.",
          img: "/Recorrido Diamante Visita.webp"
        },
        {
          title: "Murals & History",
          desc: "An artistic and historical retrospective of Casa Loy and Ayotlan's emergence as a premier tequila region.",
          img: "/Mural Historia Casa Loy.webp"
        },
        {
          title: "Distillery Tour",
          desc: "Learn the meticulous distillation process to achieve our tequila expressions.",
          img: "/Recorrido Diamante proceso.webp"
        },
        {
          title: "Underground Cellar Tasting",
          desc: "Sensory tasting: taste our tequila expressions and discover their aromas, notes, and personality.",
          img: "/Recorrido Diamante Cava Cata.webp"
        },
        {
          title: "Signature Mixology Class",
          desc: "Learn and craft your own tequila-based cocktail guided by our master mixologist.",
          img: "/Recorrido Diamante Cava.webp"
        },
        {
          title: "Luxury Gastronomic Experience at 1937 Nativo",
          desc: "A world-class gourmet pairing lunch on the terrace of 1937 Nativo with exclusive signature dishes.",
          img: "/Recorrido Diamante.webp"
        },
        {
          title: "Souvenir Kit",
          desc: "Take home an exclusive souvenir of your visit to Casa Loy Tequilera.",
          img: "/Recorrido Diamante agave cocido.webp"
        }
      ]
    }
  }
};

export default function ExperienceDetail({ 
  lang, 
  packageId, 
  setPage,
  maxCapacityLimit,
  setMaxCapacityLimit,
  blockedDates,
  setBlockedDates,
  blockedSlots = [],
  setBlockedSlots,
  bookingsCapacity,
  setBookingsCapacity
}) {
  const currentPackage = packagesData[packageId] || packagesData.oro;
  const activeData = currentPackage[lang] || currentPackage.es;

  const [showAdminButton, setShowAdminButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setShowAdminButton(true);
    }
  }, [packageId]);

  // Get current date/time in Guadalajara timezone
  const getCurrentGuadalajaraTime = () => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date());
      const dateParts = {};
      parts.forEach(part => {
        dateParts[part.type] = part.value;
      });
      return new Date(
        parseInt(dateParts.year),
        parseInt(dateParts.month) - 1,
        parseInt(dateParts.day),
        parseInt(dateParts.hour),
        parseInt(dateParts.minute),
        parseInt(dateParts.second)
      );
    } catch (e) {
      console.error("Timezone formatting error, using local time:", e);
      return new Date();
    }
  };

  // Dynamic 3-Month Calendar State
  const today = getCurrentGuadalajaraTime();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const isSlotBlocked = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return true;
    
    // Check if the entire date is blocked
    if (blockedDates.includes(dateStr)) return true;

    // Check if the specific slot is blocked
    const slotIsBlocked = blockedSlots.some(
      (slot) => slot.date_str === dateStr && slot.time_str === timeStr
    );
    if (slotIsBlocked) return true;
    
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) return true;
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // 0-based
    const day = parseInt(dateParts[2], 10);
    
    let hour = 0;
    let minute = 0;
    const timeUpper = timeStr.toUpperCase();
    const isPM = timeUpper.includes("PM");
    const isAM = timeUpper.includes("AM");
    
    const cleanTime = timeUpper.replace("AM", "").replace("PM", "").trim();
    const timeParts = cleanTime.split(':');
    if (timeParts.length >= 1) {
      hour = parseInt(timeParts[0], 10);
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;
    }
    if (timeParts.length >= 2) {
      minute = parseInt(timeParts[1], 10);
    }
    
    const slotDate = new Date(year, month, day, hour, minute, 0);
    const diffMs = slotDate.getTime() - today.getTime();
    const threeHoursMs = 3 * 60 * 60 * 1000;
    
    return diffMs < threeHoursMs;
  };

  const areAllSlotsBlockedForDate = (dateStr) => {
    const slots = ["11:00 AM", "1:00 PM"];
    return slots.every(time => isSlotBlocked(dateStr, time));
  };

  // Find tomorrow or next available date for initial selected date
  const getInitialDateStr = () => {
    let temp = new Date(today);
    for (let i = 0; i < 15; i++) {
      const y = temp.getFullYear();
      const m = temp.getMonth();
      const d = temp.getDate();
      const mm = String(m + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${y}-${mm}-${dd}`;
      
      const isBlocked = blockedDates.includes(dateStr);
      const isMonday = temp.getDay() === 1;
      const allSlotsBlocked = areAllSlotsBlockedForDate(dateStr);
      
      if (!isBlocked && !isMonday && !allSlotsBlocked) {
        return dateStr;
      }
      temp.setDate(temp.getDate() + 1);
    }
    return "";
  };

  const [selectedDateStr, setSelectedDateStr] = useState(getInitialDateStr);
  const [selectedTime, setSelectedTime] = useState("");
  const [numAdults, setNumAdults] = useState(1);
  const [numTeens, setNumTeens] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [isGroupQuote, setIsGroupQuote] = useState(false);

  const numGuests = isGroupQuote ? 51 : (numAdults + numTeens + numChildren);

  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Experience and Billing States
  const [allergies, setAllergies] = useState("");
  const [celebration, setCelebration] = useState("");
  const [comments, setComments] = useState("");
  const [requiresInvoice, setRequiresInvoice] = useState(false);
  const [rfc, setRfc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [regimenFiscal, setRegimenFiscal] = useState("");
  const [cfdiUse, setCfdiUse] = useState("");
  const [cardType, setCardType] = useState("");
  const [paypalPendingCode, setPaypalPendingCode] = useState(null);

  const isPersonaFisica = rfc.trim().length === 13;


  const isInvoiceValid = !requiresInvoice || (
    rfc.trim().length >= 12 && rfc.trim().length <= 13 &&
    razonSocial.trim().length > 0 &&
    postalCode.trim().length === 5 &&
    regimenFiscal.length > 0 &&
    cfdiUse.length > 0 &&
    cardType.length > 0
  );
  const isContactInfoValid = clientName.trim() !== "" && clientEmail.trim() !== "" && clientPhone.trim() !== "";
  const isFormValid = isContactInfoValid && isInvoiceValid;


  // Staff Controls State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  useEffect(() => {
    if (!selectedDateStr) return;
    const isBlocked = blockedDates.includes(selectedDateStr);
    const dateParts = selectedDateStr.split('-');
    let isMonday = false;
    let allSlotsBlocked = false;
    if (dateParts.length === 3) {
      const y = parseInt(dateParts[0], 10);
      const m = parseInt(dateParts[1], 10) - 1;
      const d = parseInt(dateParts[2], 10);
      isMonday = new Date(y, m, d).getDay() === 1;
      allSlotsBlocked = areAllSlotsBlockedForDate(selectedDateStr);
    }
    
    if (isBlocked || isMonday || allSlotsBlocked) {
      const initial = getInitialDateStr();
      if (initial && initial !== selectedDateStr) {
        setSelectedDateStr(initial);
      }
    }
  }, [blockedDates, bookingsCapacity, maxCapacityLimit]);

  const isPlatinoOrDiamante = packageId === "platino" || packageId === "diamante";
  const adultPrice = packageId === "oro" ? 550 : packageId === "platino" ? 750 : 1500;
  const teenPrice = 250;
  const totalPrice = isGroupQuote ? 0 : ((numAdults * adultPrice) + (numTeens * teenPrice));
  const pricePerPerson = isGroupQuote ? 0 : (numGuests > 0 ? Math.round(totalPrice / numGuests) : adultPrice);
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

  const saveBookingToLog = async (code, method, status = "Confirmada") => {
    const paymentMethodName = method === "paypal" ? "PayPal" : "Mercado Pago";
    const bookingPayload = {
      action: 'create_booking',
      code,
      customer_name: clientName || "Cliente Simulado",
      customer_email: clientEmail || "correo@ejemplo.com",
      customer_phone: clientPhone || "+52 1 33...",
      tour_id: packageId,
      date_str: selectedDateStr,
      time_str: selectedTime,
      guests: numGuests,
      total_paid: totalPrice,
      payment_method: paymentMethodName,
      allergies,
      celebration,
      comments,
      requires_invoice: requiresInvoice,
      rfc,
      razon_social: razonSocial,
      postal_code: postalCode,
      regimen_fiscal: regimenFiscal,
      cfdi_use: cfdiUse,
      card_type: cardType,
      status: status
    };

    try {
      const res = await fetch('/api/tourism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          if (errData.error === 'SOLD_OUT') {
            throw new Error('SOLD_OUT');
          }
          throw new Error(errData.error || 'API_ERROR');
        } else {
          throw new Error('SERVER_ERROR');
        }
      }
    } catch (e) {
      console.error("Supabase backup error:", e);
      if (e.message === 'SOLD_OUT') {
        throw e;
      }
      
      // Local backup fallback
      try {
        const existing = localStorage.getItem("casa_loy_bookings_log");
        const list = existing ? JSON.parse(existing) : [];
        const newBooking = {
          code,
          name: clientName || "Cliente Simulado",
          email: clientEmail || "correo@ejemplo.com",
          phone: clientPhone || "+52 1 33...",
          packageName: activeData.title,
          date: selectedDateStr,
          time: selectedTime,
          guests: numGuests,
          amount: totalPrice,
          method: paymentMethodName,
          timestamp: new Date().toLocaleString(),
          allergies,
          celebration,
          comments,
          requires_invoice: requiresInvoice,
          rfc,
          razon_social: razonSocial,
          postal_code: postalCode,
          regimen_fiscal: regimenFiscal,
          cfdi_use: cfdiUse,
          card_type: cardType
        };
        list.unshift(newBooking);
        localStorage.setItem("casa_loy_bookings_log", JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }
    }

    // Trigger GA4 and Meta Pixel Purchase Conversion Events
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: code,
          value: totalPrice,
          currency: 'MXN',
          items: [{
            item_id: packageId,
            item_name: activeData?.title || `Tour ${packageId}`,
            quantity: numGuests,
            price: numGuests > 0 ? (totalPrice / numGuests) : totalPrice
          }]
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          value: totalPrice,
          currency: 'MXN',
          content_name: activeData?.title || `Tour ${packageId}`,
          content_ids: [packageId],
          content_type: 'product',
          num_items: numGuests
        });
      }
    } catch (trackError) {
      console.warn("Analytics tracking failed:", trackError);
    }
  };

  const handleSimulatePayment = (method) => {
    const activeMethod = method || selectedPaymentMethod;
    if (!activeMethod) return;
    setIsPaying(true);

    setTimeout(async () => {
      const code = `CL-${packageId.toUpperCase()}-${selectedDateStr.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
      
      try {
        await saveBookingToLog(code, activeMethod);
        
        // Deduct spots in client state
        setBookingsCapacity((prev) => ({
          ...prev,
          [selectedDateStr]: {
            ...(prev[selectedDateStr] || {}),
            [selectedTime]: occupiedSpots + numGuests,
          },
        }));
        
        setReservationCode(code);
        setIsPaying(false);
        setBookingConfirmed(true);
        setPaymentStep(false);
      } catch (e) {
        setIsPaying(false);
        if (e.message === 'SOLD_OUT') {
          alert(lang === "es"
            ? "¡Lo sentimos! Este horario se ha quedado sin cupos disponibles mientras realizabas el pago. Por favor, selecciona otra hora o fecha."
            : "Sorry! This slot has run out of available spots while you were checking out. Please select another time or date."
          );
        } else {
          alert(lang === "es" ? "Error al registrar la reserva en el servidor." : "Error registering reservation on the server.");
        }
      }
    }, 1500);
  };

  // QR Code redirects to the validation endpoint with queries
  const qrLink = `${window.location.origin}/?code=${reservationCode}&package=${encodeURIComponent(activeData.title)}&date=${selectedDateStr}&time=${encodeURIComponent(selectedTime)}&guests=${numGuests}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrLink)}`;

  return (
    <div className="bg-background text-on-surface">
      {/* Clean Premium Header Section */}
      <section className="pt-32 pb-12 px-6 max-w-5xl mx-auto text-center">
        <span className="font-navigation text-xs text-primary uppercase tracking-[0.4em] mb-4 block font-semibold">
          {lang === "es" ? "Experiencia Exclusiva" : "Exclusive Experience"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight font-medium text-on-background uppercase mb-6">
          {activeData.title}
        </h1>
        <div className="w-16 h-[2px] bg-primary mx-auto mb-8"></div>
        <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          {activeData.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={handleScrollToBooking}
            className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[11px] uppercase tracking-[0.25em] font-semibold py-3 px-8 transition-all duration-300 min-w-[180px] text-center hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
          >
            {lang === "es" ? "Reservar Ahora" : "Book Now"}
          </button>
          <button
            onClick={() => setPage("turismo")}
            className="border border-outline/30 hover:border-primary text-on-surface hover:bg-primary/5 font-navigation text-[11px] uppercase tracking-[0.25em] font-semibold py-3 px-8 transition-all duration-300 min-w-[180px] text-center cursor-pointer"
          >
            {lang === "es" ? "Volver a Experiencias" : "Back to Experiences"}
          </button>
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

      {/* Luxury Editorial Showcase Itinerary */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-outline-variant/10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-navigation text-[10px] text-primary uppercase tracking-[0.3em] block mb-3 font-semibold">
            {lang === "es" ? "El Itinerario" : "The Itinerary"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight font-medium uppercase text-on-background">
            {lang === "es" ? "Momentos de la Experiencia" : "Moments of the Experience"}
          </h2>
          <div className="w-12 h-[1px] bg-primary/60 mx-auto mt-4"></div>
        </div>

        {/* Desktop Layout: Split list and image viewer */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">
          {/* Left Column: Interactive vertical list of steps */}
          <div className="col-span-5 space-y-1">
            {activeData.features.map((feat, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveStepIdx(idx)}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`py-6 border-b border-outline-variant/20 text-left transition-all duration-300 cursor-pointer ${
                    isActive ? "pl-2" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-serif text-sm transition-colors ${isActive ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                      0{idx + 1}.
                    </span>
                    <h3 className={`font-sans text-xs uppercase tracking-widest font-semibold transition-colors ${isActive ? "text-primary" : "text-on-surface"}`}>
                      {feat.title}
                    </h3>
                  </div>
                  
                  {/* Smooth height transition for description */}
                  <div className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="font-sans text-[13px] text-on-surface-variant font-light leading-relaxed pr-4">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Premium Image frame with fade transition */}
          <div className="col-span-7 relative aspect-[16/10] bg-stone-50 border border-outline-variant/20 shadow-sm overflow-hidden group">
            {activeData.features.map((feat, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.03] z-0"
                  }`}
                >
                  <img
                    alt={feat.title}
                    src={feat.img}
                    className="w-full h-full object-cover brightness-[0.95]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout: Elegant Accordion with integrated images */}
        <div className="lg:hidden space-y-4">
          {activeData.features.map((feat, idx) => {
            const isActive = activeStepIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-outline-variant/30 pb-4 text-left"
              >
                <button
                  onClick={() => setActiveStepIdx(isActive ? -1 : idx)}
                  className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-serif text-sm ${isActive ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                      0{idx + 1}.
                    </span>
                    <h3 className={`font-sans text-xs uppercase tracking-widest font-semibold ${isActive ? "text-primary" : "text-on-surface"}`}>
                      {feat.title}
                    </h3>
                  </div>
                  <span className={`material-symbols-outlined text-sm text-primary transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>

                {/* Animated expandable container */}
                <div className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="space-y-4 pt-2">
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-light leading-relaxed">
                      {feat.desc}
                    </p>
                    <div className="w-full aspect-video overflow-hidden border border-outline-variant/20 shadow-sm">
                      <img
                        alt={feat.title}
                        src={feat.img}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Relocated Booking Calendar System */}
      <section className="bg-[#f0eee8]/40 py-24 overflow-hidden text-left border-t border-outline-variant/20" id="booking">
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {!(paymentStep || bookingConfirmed) && (
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
                    <span className="font-headline-md text-xl font-bold">11:00 AM & 1:00 PM</span>
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

                {/* Staff Access Trigger Button (Only visible if ?admin=true is in URL) */}
                {showAdminButton && (
                  <div className="pt-4">
                    <button
                      onClick={() => setIsAdminOpen(true)}
                      className="flex items-center gap-2 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary hover:bg-primary/5 px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest transition-all cursor-pointer font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      {lang === "es" ? "Acceso Staff: Configurar Cupos" : "Staff Access: Set Capacities"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Calendar System */}
            <div className={paymentStep || bookingConfirmed ? "lg:col-span-12" : "lg:col-span-7"}>
              <div className="bg-white border border-outline-variant p-3.5 sm:p-5 shadow-xl relative flex flex-col justify-between">
                
                {/* Step 1: Booking Success Screen with QR Access Code */}
                {bookingConfirmed ? (
                  <div className="py-8 text-center space-y-6 flex flex-col items-center justify-center my-auto">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
                      check_circle
                    </span>
                    <h4 className="font-headline-md text-3xl font-bold">{activeT.successTitle}</h4>
                    
                    {/* Access QR Code Display */}
                    <div id="printable-ticket" className="p-6 bg-white border border-outline-variant/35 rounded-none shadow-sm flex flex-col items-center gap-4 max-w-sm mx-auto">
                      <div className="print-only-block text-center mb-4">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsI1CK1zDTaSkEhtFNd7gFs0Br7ZXW2rKE6mtXNlOgTpveNdFqRSK2aREIwDEFz2pNbAMxdM8OBUebW2gToScRYF1Q-TmhbHUos5e3w1fOey3coasOccOtVC4bzvDGydMpNF2wf6Q6Mt3FsJZRCihsNaG2kM2hluZ5hkMnIRqzGfCNnIgQCUk8l3pxlAgWZcH9ZqrbWcx3BD1-oHbu3TuTW9SKgwmqAzXcaSv6qTNhx6pJvTmykqnAVLEaPpvw8UHbNpl7z0SLcNA7" 
                          alt="Casa Loy" 
                          className="h-10 mx-auto mb-2" 
                        />
                        <h2 className="font-serif text-base font-bold tracking-wide text-stone-800">
                          BOLETO A TOUR - CASA LOY TEQUILERA
                        </h2>
                      </div>
                      
                      <img
                        alt="Reservation QR Access Code"
                        className="w-44 h-44 border-4 border-white shadow-md"
                        src={qrCodeUrl}
                      />
                      <span className="font-mono text-sm font-semibold text-primary">{reservationCode}</span>

                      <div className="print-only-block w-full text-left font-sans text-xs border-t border-stone-200 pt-4 mt-2 space-y-2 text-stone-700">
                        <p><strong>Cliente:</strong> {clientName}</p>
                        <p><strong>Experiencia:</strong> {activeData.title}</p>
                        <p><strong>Fecha:</strong> {formatReservationDate(selectedDateStr)}</p>
                        <p><strong>Hora:</strong> {selectedTime}</p>
                        <p><strong>{lang === "es" ? "Visitantes" : "Guests"}:</strong> {numAdults} {lang === "es" ? "Adulto(s)" : "Adult(s)"}{numTeens > 0 ? `, ${numTeens} ${lang === "es" ? "Jóven(es)" : "Youth(s)"}` : ''}{numChildren > 0 ? `, ${numChildren} ${lang === "es" ? "Niño(s)" : "Child(ren)"}` : ''}</p>
                        <p><strong>{lang === "es" ? "Total pagado" : "Total paid"}:</strong> ${totalPrice} MXN</p>
                      </div>
                    </div>

                    <p className="font-body-md text-on-surface-variant max-w-md mx-auto text-sm font-light leading-relaxed">
                      {lang === "es"
                        ? `Tu reserva para ${numGuests} ${numGuests === 1 ? "persona" : "personas"} a la "${activeData.title}" ha sido confirmada y liquidada para el ${formatReservationDate(selectedDateStr)} a las ${selectedTime}.`
                        : `Your booking for ${numGuests} ${numGuests === 1 ? "person" : "people"} to the "${activeData.title}" has been confirmed and paid for ${formatReservationDate(selectedDateStr)} at ${selectedTime}.`}
                    </p>
                    
                    <p className="text-xs text-on-surface-variant/80 max-w-xs font-sans leading-normal italic">
                      {activeT.qrInstruction}
                    </p>

                    <div className="w-full space-y-4 pt-4 border-t border-outline-variant/10 text-left">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {lang === "es" ? "Recibir Ticket de Acceso" : "Receive Access Ticket"}
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* WhatsApp share */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            lang === "es"
                              ? `¡Hola! Aquí tienes tu boleto de acceso para Casa Loy Tequilera.\n\n*Código:* ${reservationCode}\n*Experiencia:* ${activeData.title}\n*Fecha:* ${formatReservationDate(selectedDateStr)}\n*Hora:* ${selectedTime}\n*Visitantes:* ${numGuests}\n\n*Imagen del Código QR:* ${qrCodeUrl}`
                              : `Hi! Here is your access ticket for Casa Loy Tequilera.\n\n*Code:* ${reservationCode}\n*Experience:* ${activeData.title}\n*Date:* ${formatReservationDate(selectedDateStr)}\n*Time:* ${selectedTime}\n*Guests:* ${numGuests}\n\n*QR Code Image:* ${qrCodeUrl}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 py-2.5 font-sans font-bold text-xs transition-colors cursor-pointer text-center"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </a>

                        {/* Email trigger */}
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/tourism", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  action: "resend_email",
                                  code: reservationCode,
                                  email: clientEmail
                                })
                              });
                              if (res.ok) {
                                alert(lang === "es" 
                                  ? `¡Ticket de acceso enviado con éxito a ${clientEmail}!` 
                                  : `Access ticket successfully sent to ${clientEmail}!`
                                );
                              } else {
                                alert(lang === "es" ? "Error al enviar el correo." : "Error sending email.");
                              }
                            } catch (e) {
                              console.error(e);
                              alert(lang === "es" ? "Error de conexión." : "Connection error.");
                            }
                          }}
                          className="flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 py-2.5 font-sans font-bold text-xs transition-colors cursor-pointer text-center"
                        >
                          <span className="material-symbols-outlined text-sm">mail</span>
                          <span>{lang === "es" ? "Enviar por Correo" : "Send to Email"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-4 border-t border-outline-variant/10">
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
                  /* Step 2: Shopify-like Checkout Page */
                  <div className="space-y-6 text-left">
                    <div className="border-b border-outline-variant/30 pb-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-headline-md text-lg md:text-xl font-bold">{lang === "es" ? "Pago y Facturación" : "Checkout"}</h4>
                        <p className="text-[10px] text-on-surface-variant/75 mt-0.5">
                          {lang === "es" ? "Completa la información para finalizar tu reserva" : "Complete information to finalize booking"}
                        </p>
                      </div>
                      <span className="text-[10px] text-primary bg-primary/5 px-2.5 py-1 border border-primary/20 uppercase font-semibold tracking-wider">
                        {lang === "es" ? "Conexión Segura" : "Secure Connection"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Column: Client Info & Payment Stack */}
                      <div className="lg:col-span-7 space-y-6">
                        {/* Contact Information Form */}
                        <div className="space-y-4">
                          <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold">
                            {lang === "es" ? "1. Datos de Contacto" : "1. Contact Information"}
                          </h5>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                {lang === "es" ? "Nombre Completo" : "Full Name"} *
                              </label>
                              <input
                                type="text"
                                required
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
                                placeholder={lang === "es" ? "Ej. Juan Pérez" : "e.g. John Doe"}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                  {lang === "es" ? "Correo Electrónico" : "Email Address"} *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={clientEmail}
                                  onChange={(e) => setClientEmail(e.target.value)}
                                  className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
                                  placeholder="correo@ejemplo.com"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                  {lang === "es" ? "Teléfono / WhatsApp" : "Phone / WhatsApp"} *
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={clientPhone}
                                  onChange={(e) => setClientPhone(e.target.value)}
                                  className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
                                  placeholder="+52 1 33..."
                                />
                              </div>
                            </div>

                            {/* Experience Fields */}
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                  {lang === "es" ? "Alergias o Restricciones Alimenticias" : "Allergies or Dietary Restrictions"}
                                </label>
                                <input
                                  type="text"
                                  value={allergies}
                                  onChange={(e) => setAllergies(e.target.value)}
                                  className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
                                  placeholder={lang === "es" ? "Ej. Nueces, gluten, ninguna..." : "e.g. Nuts, gluten, none..."}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                    {lang === "es" ? "¿Celebras algo especial?" : "Are you celebrating something?"}
                                  </label>
                                  <input
                                    type="text"
                                    value={celebration}
                                    onChange={(e) => setCelebration(e.target.value)}
                                    className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
                                    placeholder={lang === "es" ? "Ej. Cumpleaños, aniversario..." : "e.g. Birthday, anniversary..."}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                    {lang === "es" ? "Comentarios / Notas" : "Comments / Notes"}
                                  </label>
                                  <textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    rows={1}
                                    className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white resize-none"
                                    placeholder={lang === "es" ? "Instrucciones o solicitudes especiales..." : "Special instructions or requests..."}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 pb-1">
                                <input
                                  type="checkbox"
                                  id="requiresInvoice"
                                  checked={requiresInvoice}
                                  onChange={(e) => {
                                    setRequiresInvoice(e.target.checked);
                                    if (e.target.checked && !cfdiUse) {
                                      setCfdiUse("G03");
                                    }
                                  }}
                                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary accent-[#8C4723]"
                                />
                                <label htmlFor="requiresInvoice" className="text-xs font-semibold text-stone-700 select-none cursor-pointer uppercase tracking-wider text-[10px]">
                                  {lang === "es" ? "¿Requieres factura fiscal mexicana?" : "Do you require a Mexican tax invoice?"}
                                </label>
                              </div>

                              {requiresInvoice && (
                                <div className="bg-stone-50/70 p-4 border border-outline-variant/30 space-y-3 transition-all duration-300">
                                  <h6 className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                    {lang === "es" ? "Datos de Facturación (CFDI 4.0)" : "Billing Information (CFDI 4.0)"}
                                  </h6>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                        RFC *
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={rfc}
                                        onChange={(e) => setRfc(e.target.value.toUpperCase().replace(/[^A-Z0-9&]/gi, '').slice(0, 13))}
                                        placeholder="XAXX010101000"
                                        className="w-full bg-white border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface"
                                      />
                                      <span className="text-[9px] text-stone-400 block mt-0.5">
                                        {rfc.trim().length === 12 ? (lang === "es" ? "Persona Moral (12 carac.)" : "Moral Person (12 char.)") : 
                                         rfc.trim().length === 13 ? (lang === "es" ? "Persona Física (13 carac.)" : "Physical Person (13 char.)") : 
                                         (lang === "es" ? "12 o 13 caracteres" : "12 or 13 characters")}
                                      </span>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                        {lang === "es" ? "Código Postal (CP) *" : "Postal Code (CP) *"}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        placeholder="e.g. 44100"
                                        className="w-full bg-white border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                      {lang === "es" ? "Razón Social *" : "Business Name / Razón Social *"}
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={razonSocial}
                                      onChange={(e) => setRazonSocial(e.target.value)}
                                      placeholder={lang === "es" ? "Ej. CASA LOY SA DE CV o JUAN PEREZ" : "e.g. COMPANY NAME or JOHN DOE"}
                                      className="w-full bg-white border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                        {lang === "es" ? "Régimen Fiscal *" : "Fiscal Regime *"}
                                      </label>
                                      <select
                                        required
                                        value={regimenFiscal}
                                        onChange={(e) => setRegimenFiscal(e.target.value)}
                                        className="w-full bg-white border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface"
                                      >
                                        <option value="">{lang === "es" ? "-- Seleccionar Régimen --" : "-- Select Regime --"}</option>
                                        {REGIMENES_FISCALES.map((reg) => (
                                          <option key={reg.code} value={reg.code}>{reg.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">
                                        {lang === "es" ? "Uso de CFDI *" : "CFDI Use *"}
                                      </label>
                                      <select
                                        required
                                        value={cfdiUse}
                                        onChange={(e) => setCfdiUse(e.target.value)}
                                        className="w-full bg-white border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface"
                                      >
                                        <option value="G03">{lang === "es" ? "G03 - Gastos en general" : "G03 - General expenses"}</option>
                                        <option value="S01">{lang === "es" ? "S01 - Sin efectos fiscales" : "S01 - No fiscal effects"}</option>
                                      </select>
                                    </div>
                                    <div className="mt-3">
                                      <span className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                                        {lang === "es" ? "Tipo de Tarjeta (Facturación) *" : "Card Type (Billing) *"}
                                      </span>
                                      <div className="flex gap-4">
                                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-sans text-on-surface">
                                          <input
                                            type="radio"
                                            name="cardType"
                                            value="Crédito"
                                            checked={cardType === "Crédito"}
                                            onChange={(e) => setCardType(e.target.value)}
                                            className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                          />
                                          {lang === "es" ? "Crédito" : "Credit"}
                                        </label>
                                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-sans text-on-surface">
                                          <input
                                            type="radio"
                                            name="cardType"
                                            value="Débito"
                                            checked={cardType === "Débito"}
                                            onChange={(e) => setCardType(e.target.value)}
                                            className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                          />
                                          {lang === "es" ? "Débito" : "Debit"}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Payment section */}
                        <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                          <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold">
                            {lang === "es" ? "2. Método de Pago" : "2. Payment Method"}
                          </h5>
                          
                          <div className="space-y-3">
                            {!isFormValid ? (
                              <div className="bg-stone-50 border border-dashed border-stone-200 p-4 text-center text-xs text-stone-400">
                                {lang === "es"
                                  ? "Por favor, completa tus datos de contacto y facturación (si aplica) para habilitar los métodos de pago."
                                  : "Please complete your contact details and billing info (if applicable) to enable payment methods."}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {/* PayPal Real Checkout Button */}
                                <div className="w-full">
                                  <PayPalButtons
                                    forceReRender={[numGuests, totalPrice, selectedDateStr, selectedTime, clientName, clientEmail, clientPhone, allergies, celebration, comments, requiresInvoice, rfc, razonSocial, postalCode, regimenFiscal, cfdiUse]}
                                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 40 }}
                                    createOrder={async (data, actions) => {
                                      if (isSlotBlocked(selectedDateStr, selectedTime)) {
                                        alert(lang === "es"
                                          ? "¡Lo sentimos! Este horario ya no está disponible para reservar."
                                          : "Sorry! This slot is no longer available for booking."
                                        );
                                        return Promise.reject(new Error("BLOCKED_SLOT"));
                                      }
                                      try {
                                        const checkRes = await fetch('/api/tourism');
                                        const contentType = checkRes.headers.get("content-type");
                                        if (checkRes.ok && contentType && contentType.includes("application/json")) {
                                          const checkData = await checkRes.json();
                                          const currentOccupied = checkData.bookingsCapacity?.[selectedDateStr]?.[selectedTime] || 0;
                                          const currentLimit = checkData.maxCapacityLimit || 50;
                                          if (currentOccupied + numGuests > currentLimit) {
                                            alert(lang === "es"
                                              ? "¡Lo sentimos! Este horario se ha quedado sin cupos disponibles. Selecciona otra fecha u hora."
                                              : "Sorry! This slot has run out of available spots. Please choose another date or time."
                                            );
                                            return Promise.reject(new Error("SOLD_OUT"));
                                          }
                                        } else {
                                          console.warn("Tourism API check skipped (Not JSON). Checking local state.");
                                          const localOccupied = bookingsCapacity[selectedDateStr]?.[selectedTime] || 0;
                                          if (localOccupied + numGuests > maxCapacityLimit) {
                                            alert(lang === "es"
                                              ? "¡Lo sentimos! Este horario se ha quedado sin cupos disponibles. Selecciona otra fecha u hora."
                                              : "Sorry! This slot has run out of available spots. Please choose another date or time."
                                            );
                                            return Promise.reject(new Error("SOLD_OUT"));
                                          }
                                        }
                                      } catch (e) {
                                        console.warn("Real-time check failed, checking locally:", e);
                                        const localOccupied = bookingsCapacity[selectedDateStr]?.[selectedTime] || 0;
                                        if (localOccupied + numGuests > maxCapacityLimit) {
                                          alert(lang === "es"
                                            ? "¡Lo sentimos! Este horario se ha quedado sin cupos disponibles. Selecciona otra fecha u hora."
                                            : "Sorry! This slot has run out of available spots. Please choose another date or time."
                                          );
                                          return Promise.reject(new Error("SOLD_OUT"));
                                        }
                                      }

                                      const code = `CL-${packageId.toUpperCase()}-${selectedDateStr.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
                                      try {
                                        await saveBookingToLog(code, "paypal", "Intento de Pago");
                                        setPaypalPendingCode(code);
                                      } catch (saveErr) {
                                        console.error("Failed to pre-save booking attempt:", saveErr);
                                      }

                                      return actions.order.create({
                                        purchase_units: [
                                          {
                                            amount: {
                                              value: totalPrice.toString(),
                                              currency_code: "MXN"
                                            },
                                            description: `${activeData.title} - ${numAdults} Ad, ${numTeens} Jv, ${numChildren} Nñ`,
                                            custom_id: code,
                                            payee: {
                                              email_address: "cuentasporcobrar@casaloy.com"
                                            }
                                          }
                                        ]
                                      });
                                    }}
                                    onApprove={(data, actions) => {
                                      return actions.order.capture().then(async (details) => {
                                        const codeToConfirm = paypalPendingCode || (details.purchase_units && details.purchase_units[0]?.custom_id) || `CL-${packageId.toUpperCase()}-${selectedDateStr.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
                                        
                                        setBookingsCapacity((prev) => ({
                                          ...prev,
                                          [selectedDateStr]: {
                                            ...(prev[selectedDateStr] || {}),
                                            [selectedTime]: (prev[selectedDateStr]?.[selectedTime] || 0) + numGuests,
                                          },
                                        }));
                                        
                                        try {
                                          const confirmRes = await fetch('/api/tourism', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              action: 'confirm_booking',
                                              code: codeToConfirm,
                                              paypalOrderId: details.id
                                            })
                                          });

                                          if (!confirmRes.ok) {
                                            const errData = await confirmRes.json().catch(() => ({}));
                                            throw new Error(errData.message || 'Server confirmation failed');
                                          }

                                          setReservationCode(codeToConfirm);
                                          setBookingConfirmed(true);
                                          setPaymentStep(false);
                                        } catch (confirmErr) {
                                          console.error("Failed to confirm booking after payment capture:", confirmErr);
                                          alert(lang === "es"
                                            ? "El pago fue procesado, pero hubo un problema al registrar tu reservación en nuestro sistema. Por favor, contáctanos por WhatsApp para validarla con tu código de reserva."
                                            : "Payment was processed, but there was an issue registering your reservation. Please contact us via WhatsApp to validate it with your booking code."
                                          );
                                        }
                                      });
                                    }}
                                    onError={(err) => {
                                      console.error("PayPal Error:", err);
                                      alert(lang === "es" ? "Error al procesar el pago con PayPal." : "Error processing payment with PayPal.");
                                    }}
                                  />
                                </div>


                              </div>
                            )}
                          </div>
                        </div>

                        {/* Back navigation */}
                        <button
                          onClick={() => setPaymentStep(false)}
                          disabled={isPaying}
                          className="w-full py-2.5 border border-outline-variant text-on-surface-variant hover:bg-stone-50 font-label-caps text-[10px] uppercase tracking-widest font-semibold text-center cursor-pointer mt-2"
                        >
                          {lang === "es" ? "Atrás" : "Back"}
                        </button>
                      </div>

                      {/* Right Column: Order Summary (Shopify Card style) */}
                      <div className="lg:col-span-5 bg-stone-50/70 border border-outline-variant/20 p-5 space-y-4">
                        <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold border-b border-outline-variant/20 pb-2">
                          {activeT.paySummary}
                        </h5>
                        
                        {/* Package Thumbnail & Name */}
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                            <img
                              alt={activeData.title}
                              className="w-full h-full object-cover"
                              src={activeData.heroImg}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-sans text-sm font-bold text-stone-800 leading-snug">{activeData.title}</h6>
                            <span className="text-[10px] text-stone-500 font-light block mt-0.5 leading-tight">
                              {numAdults} {numAdults === 1 ? (lang === "es" ? "adulto" : "adult") : (lang === "es" ? "adultos" : "adults")}
                              {numTeens > 0 && `, ${numTeens} ${numTeens === 1 ? (lang === "es" ? "joven" : "youth") : (lang === "es" ? "jóvenes" : "youths")}`}
                              {numChildren > 0 && `, ${numChildren} ${numChildren === 1 ? (lang === "es" ? "niño" : "child") : (lang === "es" ? "niños" : "children")}`}
                            </span>
                          </div>
                          <span className="font-sans text-xs font-semibold text-stone-700">{activeData.price}</span>
                        </div>

                        {/* Details Table */}
                        <div className="space-y-2 pt-2 border-t border-outline-variant/15 text-[11px] font-sans font-light">
                          <div className="flex justify-between text-stone-600">
                            <span>{lang === "es" ? "Fecha" : "Date"}</span>
                            <span className="font-medium text-stone-700">{formatReservationDate(selectedDateStr)}</span>
                          </div>
                          <div className="flex justify-between text-stone-600">
                            <span>{lang === "es" ? "Horario" : "Time"}</span>
                            <span className="font-medium text-stone-700">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between text-stone-600">
                            <span>IVA (16%)</span>
                            <span className="font-medium text-stone-700">{lang === "es" ? "Incluido" : "Included"}</span>
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between text-base font-serif font-bold pt-3 border-t border-outline-variant/20 text-on-surface">
                          <span>{activeT.payTotal}</span>
                          <span className="text-primary text-base">${totalPrice} MXN</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Step 3: Date & Hour Selection calendar */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Left Column: Calendar Grid */}
                    <div className="md:col-span-7">
                      <div className="flex justify-between items-center mb-4 select-none border-b border-outline-variant/20 pb-2">
                        <span className="font-headline-md text-base sm:text-lg font-bold">{currentMonthName}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-stone-100 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                            disabled={currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()}
                          >
                            ◀
                          </button>
                          <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-stone-100 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                            disabled={currentDate.getMonth() === (today.getMonth() + 3) % 12 && currentDate.getFullYear() === today.getFullYear() + Math.floor((today.getMonth() + 3) / 12)}
                          >
                            ▶
                          </button>
                        </div>
                      </div>

                      {/* Calendar days of week */}
                      <div className="grid grid-cols-7 gap-1 mb-2 text-center select-none font-navigation text-[10px] text-on-surface-variant/70 font-semibold border-b border-outline-variant/20 pb-1">
                        {activeT.daysOfWeek.map(d => <div key={d}>{d}</div>)}
                      </div>
                      
                      {/* Calendar days grid */}
                      <div className="grid grid-cols-7 gap-1 text-center font-navigation text-xs font-medium">
                        {/* Blank placeholders */}
                        {placeholders.map((day, idx) => (
                          <div key={`place-${idx}`} className="h-7 sm:h-8 flex items-center justify-center text-on-surface/20 cursor-not-allowed select-none text-[11px]">
                            {day}
                          </div>
                        ))}
                        
                        {days.map((day) => {
                          const dateStr = getFormattedDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const isBlocked = blockedDates.includes(dateStr);
                          const isPast = isDateInPast(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const isMonday = isDateMonday(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const allSlotsBlocked = areAllSlotsBlockedForDate(dateStr);
                          const isDisabled = isBlocked || isPast || isMonday || allSlotsBlocked;
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
                              className={`h-7 sm:h-8 flex flex-col items-center justify-center cursor-pointer transition-all border border-transparent rounded-none ${
                                isDisabled
                                  ? "text-on-surface/20 bg-stone-50/50 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-primary text-white scale-105 shadow-md font-semibold"
                                  : "hover:bg-primary/5 text-on-surface"
                              }`}
                            >
                              <span className="text-[11px] sm:text-xs">{day}</span>
                              {isMonday && (
                                <span className="text-[5px] sm:text-[6px] text-stone-400 leading-none lowercase">cerrado</span>
                              )}
                              {isBlocked && (
                                <span className="text-[5px] sm:text-[6px] text-red-500 leading-none lowercase">bloq</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Time slots, Guests, Confirm Button */}
                    <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/20 pt-4 md:pt-0 md:pl-6 space-y-4">
                      {/* Time slots selector with occupancy info */}
                      <div>
                        <label className="block text-[10px] font-semibold font-navigation uppercase tracking-widest text-primary mb-2">
                          {activeT.scheduleLabel}
                        </label>
                        <div className="flex flex-col gap-2">
                          {["11:00 AM", "1:00 PM"].map((time) => {
                            const occupied = bookingsCapacity[selectedDateStr]?.[time] || 0;
                            const remaining = maxCapacityLimit - occupied;
                            const isFull = remaining <= 0;
                            const isBlocked = isSlotBlocked(selectedDateStr, time);
                            const isDisabled = isFull || isBlocked;
                            return (
                              <button
                                key={time}
                                disabled={isDisabled}
                                onClick={() => {
                                  setSelectedTime(time);
                                  if (numGuests > remaining) {
                                    setNumGuests(remaining > 0 ? 1 : 0);
                                  }
                                }}
                                className={`w-full py-2 px-3 border font-label-caps text-[10px] text-center uppercase tracking-wider transition-all flex justify-between items-center ${
                                  isDisabled
                                    ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                                    : selectedTime === time
                                    ? "border-primary bg-primary text-white shadow-sm font-semibold"
                                    : "border-outline text-on-surface hover:bg-[#fcf9f3]"
                                }`}
                              >
                                <div className="font-bold">{time}</div>
                                <div className="text-[9px] lowercase font-sans opacity-85">
                                  {isFull 
                                    ? activeT.soldOut 
                                    : isBlocked 
                                      ? (lang === "es" ? "no disponible" : "not available") 
                                      : activeT.remainingSpots.replace("{spots}", remaining).replace("{max}", maxCapacityLimit)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Guests count selector */}
                      <div className="space-y-4 border-t border-outline-variant/20 pt-4">
                        <label className="block text-[10px] font-semibold font-navigation uppercase tracking-widest text-primary">
                          {activeT.guestsLabel}
                        </label>
                        
                        {!isGroupQuote ? (
                          <div className="space-y-3 bg-stone-50/50 p-3 border border-outline-variant/30">
                            {/* Adults */}
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-sans text-xs font-semibold text-stone-800">
                                  {lang === "es" ? "Adultos" : "Adults"}
                                </span>
                                <span className="text-[10px] text-stone-500 font-light block">
                                  {lang === "es" ? `Desde 18 años (${activeData.price} MXN)` : `Ages 18+ (${activeData.price} MXN)`}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumAdults(Math.max(1, numAdults - 1));
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={numAdults <= 1 || !selectedTime}
                                >
                                  -
                                </button>
                                <span className="font-serif text-sm font-bold w-6 text-center">{numAdults}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumAdults(numAdults + 1);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={!selectedTime || (numGuests >= remainingSpots && numGuests < 50)}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Teens 10-17 */}
                            <div className="flex justify-between items-center border-t border-outline-variant/10 pt-3">
                              <div>
                                <span className="font-sans text-xs font-semibold text-stone-800">
                                  {lang === "es" ? "Jóvenes (10 a 17 años)" : "Youth (Ages 10-17)"}
                                </span>
                                <span className="text-[10px] text-stone-500 font-light block leading-tight">
                                  {lang === "es" ? "Tarifa $250.00 MXN - No incluye alimentos (consumo a la carta)" : "Price $250.00 MXN - Meal not included (a la carte consumption)"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumTeens(Math.max(0, numTeens - 1));
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={numTeens <= 0 || !selectedTime}
                                >
                                  -
                                </button>
                                <span className="font-serif text-sm font-bold w-6 text-center">{numTeens}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumTeens(numTeens + 1);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={!selectedTime || (numGuests >= remainingSpots && numGuests < 50)}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Children under 10 */}
                            <div className="flex justify-between items-center border-t border-outline-variant/10 pt-3">
                              <div>
                                <span className="font-sans text-xs font-semibold text-stone-800">
                                  {lang === "es" ? "Niños (Menores de 10 años)" : "Children (Under 10)"}
                                </span>
                                <span className="text-[10px] text-stone-500 font-light block leading-tight">
                                  {lang === "es" ? "Gratis (zonas especiales) - No incluye alimentos (consumo a la carta)" : "Free (special zones only) - Meal not included (a la carte consumption)"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumChildren(Math.max(0, numChildren - 1));
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={numChildren <= 0 || !selectedTime}
                                >
                                  -
                                </button>
                                <span className="font-serif text-sm font-bold w-6 text-center">{numChildren}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNumChildren(numChildren + 1);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center border border-outline-variant bg-white hover:bg-stone-100 text-stone-700 cursor-pointer disabled:opacity-30"
                                  disabled={!selectedTime || (numGuests >= remainingSpots && numGuests < 50)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-primary/5 border border-primary/20 p-4 text-xs font-sans text-stone-700 space-y-2">
                            <p className="font-bold text-primary uppercase tracking-wider text-[10px]">
                              {lang === "es" ? "👥 Cotización Especial de Grupo" : "👥 Special Group Quote"}
                            </p>
                            <p className="leading-relaxed">
                              {lang === "es"
                                ? "Para visitas de más de 50 personas o eventos especiales, ofrecemos cotizaciones personalizadas y atención directa por WhatsApp."
                                : "For visits of more than 50 people or special events, we offer personalized quotes and direct assistance via WhatsApp."}
                            </p>
                          </div>
                        )}

                        {/* Special Group Booking Options / Events */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isGroupQuote) {
                                setIsGroupQuote(false);
                                setNumAdults(1);
                                setNumTeens(0);
                                setNumChildren(0);
                              } else {
                                setIsGroupQuote(true);
                              }
                            }}
                            className={`w-full py-2 px-3 border text-[10px] text-center font-navigation uppercase tracking-wider transition-all cursor-pointer ${
                              isGroupQuote
                                ? "border-primary bg-primary text-white font-bold"
                                : "border-outline text-on-surface hover:bg-[#fcf9f3]"
                            }`}
                          >
                            {isGroupQuote 
                              ? (lang === "es" ? "◀ Volver a Selección de Personas" : "◀ Back to Guest Selection")
                              : (lang === "es" ? "👥 ¿Grupo de +50 personas? Cotiza aquí" : "👥 Group of +50 people? Get quote here")}
                          </button>
                        </div>
                      </div>

                      {/* Warnings / Safety notes about minors in distillery */}
                      {(numChildren > 0 || numTeens > 0) && (
                        <div className="bg-stone-50 border-l-2 border-primary/40 p-3 text-[10.5px] font-sans text-on-surface-variant font-light space-y-1 select-none">
                          <p className="font-bold text-primary uppercase tracking-wider text-[9px] mb-0.5">
                            {lang === "es" ? "⚠️ Aviso Importante de Seguridad" : "⚠️ Important Safety Notice"}
                          </p>
                          {numChildren > 0 && (
                            <p>
                              • {lang === "es" 
                                ? "Al ser una destilería en operaciones, los menores de 10 años tienen permitido el acceso únicamente a áreas seguras/especiales y no a todo el recorrido del proceso productivo."
                                : "As an operating distillery, children under 10 are allowed access only to designated safe areas and not the full production process tour."}
                            </p>
                          )}
                          {numTeens > 0 && (
                            <p>
                              • {lang === "es"
                                ? "Los jóvenes de 10 a 17 años deben estar acompañados por un adulto en todo momento y no se les permite degustar bebidas alcohólicas (la mixología se sirve sin alcohol)."
                                : "Youth aged 10 to 17 must be accompanied by an adult at all times and are not permitted to taste alcoholic beverages (mixology will be served alcohol-free)."}
                            </p>
                          )}
                        </div>
                      )}

                      {selectedTime && !isGroupQuote && (
                        <div className="text-[11px] font-sans font-light">
                          {remainingSpots > 0 ? (
                            <p className="text-on-surface-variant border-t border-outline-variant/10 pt-1 text-[10px]">
                              {lang === "es"
                                ? `Selección: ${numGuests} ${numGuests === 1 ? "lugar" : "lugares"} el ${formatReservationDate(selectedDateStr)} a las ${selectedTime}.`
                                : `Selection: ${numGuests} ${numGuests === 1 ? "spot" : "spots"} on ${formatReservationDate(selectedDateStr)} at ${selectedTime}.`}
                            </p>
                          ) : (
                            <p className="text-error font-semibold uppercase tracking-wider border-t border-outline-variant/10 pt-1 text-[10px]">
                              {activeT.soldOut}
                            </p>
                          )}
                        </div>
                      )}

                      {isGroupQuote ? (
                        <a
                          href={`https://wa.me/5213481337135?text=${encodeURIComponent(
                            lang === "es"
                              ? `Hola, me gustaría cotizar una visita para un grupo de más de 50 personas para la ${activeData.title}.`
                              : `Hello, I would like to get a quote for a group of more than 50 people for the ${activeData.title}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-label-caps text-[11px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 font-bold cursor-pointer text-center"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                          </svg>
                          <span>{lang === "es" ? "Cotizar por WhatsApp" : "Get Quote via WhatsApp"}</span>
                        </a>
                      ) : (
                        <button
                          onClick={handleProceedToPayment}
                          disabled={!selectedTime || remainingSpots <= 0 || numGuests > remainingSpots || isSlotBlocked(selectedDateStr, selectedTime)}
                          className={`w-full py-3.5 font-label-caps text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                            selectedTime && remainingSpots >= numGuests && !isSlotBlocked(selectedDateStr, selectedTime)
                              ? "bg-primary text-on-primary hover:bg-[#9a5625]"
                              : "bg-stone-300 text-stone-500 cursor-not-allowed"
                          }`}
                        >
                          {activeT.confirmBtn}
                        </button>
                      )}
                    </div>
                  </div>
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
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
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
