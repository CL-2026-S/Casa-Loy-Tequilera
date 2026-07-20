import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminPanel({
  lang,
  setPage,
  maxCapacityLimit,
  setMaxCapacityLimit,
  blockedDates,
  setBlockedDates,
  bookingsCapacity,
  setBookingsCapacity,
  refreshData
}) {
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("casa_loy_admin_registered") === "true";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("casa_loy_admin_logged") === "true";
  });

  // Form states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // CMS states
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "log";
  });
  const [bookingsLog, setBookingsLog] = useState([]);
  const [selectedQrTicket, setSelectedQrTicket] = useState(null);
  
  // Validation query states
  const [ticketSearchCode, setTicketSearchCode] = useState("");
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [searchStatus, setSearchStatus] = useState(""); // "", "found_valid", "found_used", "not_found"
  const [scanValidatedTime, setScanValidatedTime] = useState("");
  const [validationSuccessMsg, setValidationSuccessMsg] = useState("");

  // QR Camera Scanner States
  const [scannerActive, setScannerActive] = useState(false);

  // Manual Reservation Capture Form States
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualTour, setManualTour] = useState("oro");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("10:00 AM");
  const [manualGuests, setManualGuests] = useState(1);
  const [manualAmount, setManualAmount] = useState(1);
  const [manualMethod, setManualMethod] = useState("Efectivo");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Bulk Edit States
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState({
    1: true, // Monday
    2: true, // Tuesday
    3: true, // Wednesday
    4: true, // Thursday
    5: true, // Friday
    6: true, // Saturday
    0: true  // Sunday
  });
  const [bulkTimeSlot, setBulkTimeSlot] = useState("10:00 AM");
  const [bulkOccupancyValue, setBulkOccupancyValue] = useState(0);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, []);

  useEffect(() => {
    const pricePerPerson = manualTour === "oro" ? 1 : 750;
    setManualAmount(manualGuests * pricePerPerson);
  }, [manualGuests, manualTour]);

  const loadData = async () => {
    let apiLogs = [];
    try {
      const res = await fetch("/api/tourism");
      if (res.ok) {
        const data = await res.json();
        if (data.bookingsLog && Array.isArray(data.bookingsLog)) {
          apiLogs = data.bookingsLog;
        }
      }
    } catch (e) {
      console.error("Could not fetch reservations log from API.", e);
    }

    // Merge with localStorage logs
    let localLogs = [];
    try {
      const saved = localStorage.getItem("casa_loy_bookings_log");
      if (saved) {
        localLogs = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading local bookings log", e);
    }

    // Known backup reservations (such as July 17th sale)
    const backupReservations = [
      {
        code: "CL-PLATINO-202607254775",
        name: "Edgar Giovanni Martinez Lopez",
        email: "edgrmtz23@gmail.com",
        phone: "9941080231",
        packageName: "Experiencia Casa Loy Platino",
        date: "2026-07-25",
        time: "10:00 AM",
        guests: 6,
        amount: 4500,
        method: "PayPal",
        timestamp: "2026-07-17 19:09:43",
        used_at: null
      }
    ];

    // Combine logs without duplicates by code
    const map = new Map();
    [...apiLogs, ...localLogs, ...backupReservations].forEach(item => {
      if (item && item.code && !map.has(item.code)) {
        map.set(item.code, item);
      }
    });

    setBookingsLog(Array.from(map.values()));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMsg(lang === "es" ? "Por favor completa todos los campos" : "Please complete all fields");
      return;
    }
    localStorage.setItem("casa_loy_admin_email", emailInput);
    localStorage.setItem("casa_loy_admin_pass", passwordInput);
    localStorage.setItem("casa_loy_admin_registered", "true");
    setIsRegistered(true);
    setErrorMsg("");
    alert(lang === "es" ? "¡Registro completado! Ya puedes iniciar sesión." : "Registration complete! You can now log in.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const savedEmail = localStorage.getItem("casa_loy_admin_email") || "admin@casaloy.com";
    const savedPass = localStorage.getItem("casa_loy_admin_pass") || "admin";

    if (emailInput === savedEmail && passwordInput === savedPass) {
      sessionStorage.setItem("casa_loy_admin_logged", "true");
      setIsLoggedIn(true);
      setEmailInput("");
      setPasswordInput("");
      loadData();
    } else {
      setErrorMsg(lang === "es" ? "Credenciales incorrectas. Para pruebas usa: admin@casaloy.com / admin" : "Incorrect credentials. For testing use: admin@casaloy.com / admin");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("casa_loy_admin_logged");
    setIsLoggedIn(false);
  };

  // Helper to generate matching dates based on date range and weekdays selector
  const getMatchingDates = () => {
    if (!bulkStartDate || !bulkEndDate) return [];
    const start = new Date(bulkStartDate + "T00:00:00");
    const end = new Date(bulkEndDate + "T00:00:00");
    
    if (end < start) return [];
    
    const dates = [];
    let current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (selectedWeekdays[dayOfWeek]) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        dates.push(`${y}-${m}-${d}`);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Bulk Actions
  const handleBulkBlock = async (shouldBlock) => {
    const dates = getMatchingDates();
    if (dates.length === 0) {
      alert(lang === "es" ? "Selecciona un rango de fechas válido y al menos un día de la semana." : "Select a valid date range and at least one day of the week.");
      return;
    }

    if (
      !confirm(
        lang === "es"
          ? `¿Confirmas que deseas ${shouldBlock ? "BLOQUEAR" : "DESBLOQUEAR"} ${dates.length} días seleccionados?`
          : `Confirm you want to ${shouldBlock ? "BLOCK" : "UNBLOCK"} ${dates.length} selected days?`
      )
    ) {
      return;
    }

    setIsSubmittingBulk(true);
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key'}`
        },
        body: JSON.stringify({
          action: shouldBlock ? "block_dates" : "unblock_dates",
          dates
        })
      });

      if (res.ok) {
        alert(
          lang === "es"
            ? `¡Se han ${shouldBlock ? "bloqueado" : "desbloqueado"} ${dates.length} días con éxito en Supabase!`
            : `Successfully ${shouldBlock ? "blocked" : "unblocked"} ${dates.length} days in Supabase!`
        );
        if (refreshData) await refreshData();
      } else {
        alert("Error al actualizar la base de datos.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleBulkSetOccupancy = async () => {
    const dates = getMatchingDates();
    if (dates.length === 0) {
      alert(lang === "es" ? "Selecciona un rango de fechas válido." : "Select a valid date range.");
      return;
    }

    if (
      !confirm(
        lang === "es"
          ? `¿Confirmas que deseas fijar la ocupación del horario ${bulkTimeSlot} a ${bulkOccupancyValue} lugares en ${dates.length} días?`
          : `Confirm you want to set occupancy for slot ${bulkTimeSlot} to ${bulkOccupancyValue} places in ${dates.length} days?`
      )
    ) {
      return;
    }

    setIsSubmittingBulk(true);
    try {
      const slotOverrides = dates.map((d) => ({
        date_str: d,
        time_str: bulkTimeSlot,
        occupied_count: parseInt(bulkOccupancyValue) || 0
      }));

      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key'}`
        },
        body: JSON.stringify({
          action: "bulk_set_occupancy",
          slotOverrides
        })
      });

      if (res.ok) {
        alert(lang === "es" ? "Ocupación masiva actualizada con éxito en Supabase." : "Bulk occupancy successfully updated in Supabase.");
        if (refreshData) await refreshData();
      } else {
        alert("Error al actualizar ocupaciones.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleUpdateGeneralCapacity = async () => {
    if (maxCapacityLimit < 1) return;
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key'}`
        },
        body: JSON.stringify({
          action: "set_capacity",
          capacity: maxCapacityLimit
        })
      });
      if (res.ok) {
        alert(lang === "es" ? "Límite de capacidad general actualizado en Supabase" : "General capacity limit updated in Supabase");
        if (refreshData) await refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Search Ticket helper
  const triggerSearchByCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const ticket = bookingsLog.find((b) => b.code.trim().toUpperCase() === cleanCode);

    if (ticket) {
      setSearchedTicket(ticket);
      if (ticket.used_at) {
        setSearchStatus("found_used");
        setScanValidatedTime(ticket.used_at);
      } else {
        setSearchStatus("found_valid");
      }
    } else {
      if (cleanCode.startsWith("CL-")) {
        const simTicket = {
          code: cleanCode,
          name: "Cliente Externo",
          packageName: cleanCode.includes("DIAMANTE") ? "Experiencia Casa Loy Diamante" : cleanCode.includes("PLATINO") ? "Experiencia Casa Loy Platino" : "Experiencia Casa Loy Oro",
          date: new Date().toISOString().split("T")[0],
          time: "10:00 AM",
          guests: 2
        };
        setSearchedTicket(simTicket);
        const used = localStorage.getItem(`used_ticket_${cleanCode}`);
        if (used) {
          setSearchStatus("found_used");
          setScanValidatedTime(used);
        } else {
          setSearchStatus("found_valid");
        }
      } else {
        setSearchStatus("not_found");
      }
    }
  };

  // Search Ticket manually or scanned
  const handleSearchTicket = () => {
    setSearchStatus("");
    setSearchedTicket(null);
    setValidationSuccessMsg("");
    if (!ticketSearchCode) return;
    triggerSearchByCode(ticketSearchCode);
  };

  // Camera scanner hook
  useEffect(() => {
    let html5QrcodeScanner = null;
    if (scannerActive) {
      const timer = setTimeout(() => {
        try {
          html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
          );
          html5QrcodeScanner.render(
            (decodedText) => {
              let ticketCode = decodedText;
              if (decodedText.includes("code=")) {
                try {
                  const urlParams = new URLSearchParams(decodedText.split("?")[1]);
                  ticketCode = urlParams.get("code") || decodedText;
                } catch (e) {
                  console.error("Could not parse scanned URL params", e);
                }
              }
              const cleanCode = ticketCode.trim().toUpperCase();
              setTicketSearchCode(cleanCode);
              setScannerActive(false);
              triggerSearchByCode(cleanCode);
            },
            () => {
              // Ignore scan failures (normal operation)
            }
          );
        } catch (e) {
          console.error("Error creating scanner:", e);
        }
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [scannerActive]);

  const handleMarkTicketAsUsed = async () => {
    if (!searchedTicket) return;
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key'}`
        },
        body: JSON.stringify({
          action: "validate_ticket",
          code: searchedTicket.code
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScanValidatedTime(data.used_at);
        setSearchStatus("found_used");
        setValidationSuccessMsg(lang === "es" ? "¡Ticket Validado Exitosamente!" : "Ticket Successfully Validated!");
        
        // Update local logs
        await loadData();
      } else {
        // Fallback local storage
        const nowStr = new Date().toLocaleString();
        localStorage.setItem(`used_ticket_${searchedTicket.code}`, nowStr);
        setScanValidatedTime(nowStr);
        setSearchStatus("found_used");
        setValidationSuccessMsg(lang === "es" ? "¡Ticket Validado Localmente (Offline)!" : "Ticket Validated Locally (Offline)!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    if (!manualName || !manualEmail || !manualDate || !manualTime || !manualGuests) {
      alert(lang === "es" ? "Por favor completa los campos requeridos." : "Please fill in all required fields.");
      return;
    }
    
    setIsSubmittingManual(true);
    const randomCode = `CL-MAN-${manualTour.toUpperCase()}-${manualDate.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
    
    const payload = {
      action: 'create_booking',
      code: randomCode,
      customer_name: manualName,
      customer_email: manualEmail,
      customer_phone: manualPhone || '',
      tour_id: manualTour,
      date_str: manualDate,
      time_str: manualTime,
      guests: parseInt(manualGuests),
      total_paid: parseFloat(manualAmount),
      payment_method: manualMethod
    };

    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(lang === "es" 
          ? `¡Reserva manual registrada con éxito! Boleto enviado por correo.\nCódigo: ${randomCode}` 
          : `Manual booking registered! Ticket sent by email.\nCode: ${randomCode}`
        );
        // Reset states
        setManualName("");
        setManualEmail("");
        setManualPhone("");
        setManualGuests(1);
        setManualDate("");
        setManualMethod("Efectivo");
        setShowManualForm(false);
        // Refresh log
        await loadData();
        if (refreshData) await refreshData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'SERVER_ERROR'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión al registrar reserva.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const toggleWeekday = (dayNum) => {
    setSelectedWeekdays({
      ...selectedWeekdays,
      [dayNum]: !selectedWeekdays[dayNum]
    });
  };

  return (
    <div className="bg-[#fcf9f3] min-h-screen text-on-surface py-24 font-sans select-text">
      
      {!isLoggedIn ? (
        <div className="w-full max-w-md mx-auto bg-white border border-outline-variant/35 p-8 shadow-2xl space-y-6">
          <div className="text-center border-b border-outline-variant/20 pb-4">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#1c1c18] block uppercase">CASA LOY</span>
            <span className="text-[10px] text-primary tracking-widest uppercase font-semibold block mt-1">
              {isRegistered ? "CMS Administrador / Staff" : "Registro de Cuenta de Administrador"}
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200/40 text-red-700 p-3 text-xs text-left leading-normal font-sans">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={isRegistered ? handleLogin : handleRegister} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                {lang === "es" ? "Correo Electrónico" : "Email Address"}
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="ejemplo@casaloy.com"
                className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                {lang === "es" ? "Contraseña" : "Password"}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50/50 border border-outline-variant p-3 font-sans text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#8c4723] text-white py-3.5 font-label-caps text-xs uppercase tracking-widest font-semibold transition-all shadow-md mt-4 cursor-pointer"
            >
              {isRegistered 
                ? (lang === "es" ? "Iniciar Sesión" : "Sign In") 
                : (lang === "es" ? "Registrarse como Administrador" : "Register Admin")}
            </button>

            {isRegistered ? (
              <p className="text-[10px] text-stone-400 text-center mt-2 leading-relaxed">
                Nota de demo: Usa la cuenta por defecto <strong>admin@casaloy.com</strong> con contraseña <strong>admin</strong>, o registra una nueva.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegistered(true)}
                className="w-full text-center text-[10px] text-primary hover:underline cursor-pointer mt-2 font-medium"
              >
                ¿Ya tienes una cuenta registrada? Inicia sesión aquí
              </button>
            )}
          </form>
        </div>
      ) : (
        
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          
          {/* Header */}
          <div className="bg-white border border-outline-variant/35 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-sm">
            <div className="text-left">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">dashboard</span>
                <h4 className="font-serif text-xl font-bold uppercase tracking-wider">Hacienda Casa Loy CMS</h4>
              </div>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">
                Administración multi-días en lote, configuración de aforo y validación en tiempo real conectada a Supabase.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage("home")}
                className="border border-outline-variant/60 text-stone-600 hover:bg-stone-50 px-4 py-2 text-xs font-medium cursor-pointer"
              >
                Volver a la Web
              </button>
              <button
                onClick={handleLogout}
                className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b border-outline-variant/20 gap-6">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "calendar" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📅 Gestión Masiva de Cupos
            </button>
            <button
              onClick={() => setActiveTab("validate")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "validate" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🔍 Escáner QR de Entrada
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "log" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📋 Bitácora Supabase ({bookingsLog.length})
            </button>
          </div>

          <div className="bg-white border border-outline-variant/35 p-8 shadow-md">
            
            {/* TAB A: Bulk Date Scheduling */}
            {activeTab === "calendar" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Configuration Columns */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* General Capacity Limit */}
                  <div className="bg-stone-50 p-4 border border-outline-variant/25">
                    <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold mb-2">
                      Aforo / Cupo Máximo General
                    </h5>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={maxCapacityLimit}
                        onChange={(e) => setMaxCapacityLimit(parseInt(e.target.value) || 50)}
                        className="bg-white border border-outline-variant p-2 w-24 text-center text-sm font-bold focus:outline-none"
                      />
                      <button
                        onClick={handleUpdateGeneralCapacity}
                        className="bg-primary hover:bg-[#8c4723] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Actualizar en Supabase
                      </button>
                    </div>
                  </div>

                  {/* Multi-date selection range form */}
                  <div className="space-y-4">
                    <h5 className="font-navigation text-xs uppercase tracking-wider text-[#1c1c18] font-bold border-b border-stone-100 pb-2">
                      1. Definir Rango de Fechas y Días
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">Desde (Fecha Inicio)</label>
                        <input
                          type="date"
                          value={bulkStartDate}
                          onChange={(e) => setBulkStartDate(e.target.value)}
                          className="bg-stone-50 border border-outline-variant p-3 w-full text-xs font-sans focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">Hasta (Fecha Fin)</label>
                        <input
                          type="date"
                          value={bulkEndDate}
                          onChange={(e) => setBulkEndDate(e.target.value)}
                          className="bg-stone-50 border border-outline-variant p-3 w-full text-xs font-sans focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Weekdays multi-select check-list */}
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-2">
                        Aplicar solo a los siguientes días de la semana:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: "Lun", val: 1 },
                          { name: "Mar", val: 2 },
                          { name: "Mié", val: 3 },
                          { name: "Jue", val: 4 },
                          { name: "Vie", val: 5 },
                          { name: "Sáb", val: 6 },
                          { name: "Dom", val: 0 }
                        ].map((day) => (
                          <button
                            key={day.val}
                            type="button"
                            onClick={() => toggleWeekday(day.val)}
                            className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                              selectedWeekdays[day.val]
                                ? "bg-primary text-white border-primary"
                                : "bg-stone-50 text-stone-500 border-outline-variant/30 hover:border-stone-400"
                            }`}
                          >
                            {day.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h5 className="font-navigation text-xs uppercase tracking-wider text-[#1c1c18] font-bold pb-1">
                      2. Seleccionar Acción a Aplicar en Lote
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Action block 1: Blocking/Unblocking */}
                      <div className="border border-outline-variant/30 p-4 space-y-3 bg-stone-50/50">
                        <span className="text-[10px] font-bold text-stone-700 block uppercase">
                          Hacienda Abierta / Cerrada
                        </span>
                        <p className="text-[10px] text-stone-500 font-light leading-normal">
                          Bloquea las fechas del rango seleccionado para que ningún cliente pueda agendar tours.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBulkBlock(true)}
                            disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            🔒 Bloquear
                          </button>
                          <button
                            onClick={() => handleBulkBlock(false)}
                            disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            🔓 Habilitar
                          </button>
                        </div>
                      </div>

                      {/* Action block 2: Occupancy Overrides */}
                      <div className="border border-outline-variant/30 p-4 space-y-3 bg-stone-50/50">
                        <span className="text-[10px] font-bold text-stone-700 block uppercase">
                          Establecer Ocupación por Turno
                        </span>
                        <p className="text-[10px] text-stone-500 font-light leading-normal">
                          Configura la cantidad de lugares ya ocupados en un horario determinado para todos los días en lote.
                        </p>
                        <div className="flex gap-2 items-center">
                          <select
                            value={bulkTimeSlot}
                            onChange={(e) => setBulkTimeSlot(e.target.value)}
                            className="bg-white border border-outline-variant p-2 flex-1 text-xs focus:outline-none"
                          >
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={bulkOccupancyValue}
                            onChange={(e) => setBulkOccupancyValue(parseInt(e.target.value) || 0)}
                            className="bg-white border border-outline-variant p-2 w-16 text-center text-xs focus:outline-none"
                            placeholder="0"
                          />
                        </div>
                        <button
                          onClick={handleBulkSetOccupancy}
                          disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                          className="w-full bg-primary hover:bg-[#8c4723] text-white py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Aplicar Ocupación Masiva
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Summaries and active blocks list */}
                <div className="lg:col-span-4 space-y-4 lg:pl-6 lg:border-l border-stone-100">
                  <h5 className="font-navigation text-xs uppercase tracking-wider text-primary font-bold border-b border-stone-100 pb-2">
                    Fechas Bloqueadas ({blockedDates.length})
                  </h5>
                  {blockedDates.length === 0 ? (
                    <p className="text-xs text-stone-400 font-light italic">No hay fechas bloqueadas actualmente en la nube.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {blockedDates.map((dateStr) => {
                        const parts = dateStr.split("-");
                        const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        return (
                          <div key={dateStr} className="flex justify-between items-center bg-stone-50 border border-stone-100 p-2.5">
                            <span className="text-[10px] font-bold text-stone-700">🔒 Cerrado {formatted}</span>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch("/api/tourism", {
                                    method: "POST",
                                    headers: { 
                                      "Content-Type": "application/json",
                                      "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key'}`
                                    },
                                    body: JSON.stringify({ action: "unblock_dates", dates: [dateStr] })
                                  });
                                  if (res.ok) {
                                    if (refreshData) await refreshData();
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="text-[10px] text-red-600 hover:text-red-800 font-bold uppercase cursor-pointer"
                            >
                              Abrir
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB B: QR Scan & Ticket Verification */}
            {activeTab === "validate" && (
              <div className="max-w-xl mx-auto space-y-6 text-left py-4">
                <div className="space-y-2">
                  <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold">
                    Escaneo QR / Búsqueda de Acceso
                  </h5>
                  <p className="text-xs text-stone-400 font-light">
                    Ingresa o pega el código único del ticket QR (ej: CL-ORO-XXXX) para validar los datos en Supabase y marcar su entrada.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ticketSearchCode}
                    onChange={(e) => setTicketSearchCode(e.target.value)}
                    placeholder="Código de Reserva (e.g. CL-ORO-...)"
                    className="flex-1 bg-stone-50 border border-outline-variant p-3.5 font-mono text-xs focus:outline-none focus:border-primary text-on-surface focus:bg-white uppercase"
                  />
                  <button
                    onClick={handleSearchTicket}
                    className="bg-primary hover:bg-[#8c4723] text-white px-6 font-semibold uppercase text-xs tracking-wider cursor-pointer"
                  >
                    Buscar
                  </button>
                </div>

                <div className="pt-2">
                  {!scannerActive ? (
                    <button
                      onClick={() => {
                        setSearchStatus("");
                        setSearchedTicket(null);
                        setScannerActive(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 py-3 font-semibold uppercase text-xs tracking-wider cursor-pointer font-sans"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      Escanear QR con Cámara (Celular/Tablet)
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => setScannerActive(false)}
                        className="w-full bg-stone-500 hover:bg-stone-600 text-white py-2 font-semibold uppercase text-xs tracking-wider cursor-pointer"
                      >
                        Cancelar Escaneo
                      </button>
                      <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden border border-stone-200"></div>
                    </div>
                  )}
                </div>

                {validationSuccessMsg && (
                  <div className="bg-emerald-500 text-white p-3 text-xs font-bold text-center animate-pulse">
                    ✅ {validationSuccessMsg}
                  </div>
                )}

                {searchStatus === "not_found" && (
                  <div className="bg-red-50 border border-red-200/40 p-5 text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    <h6 className="font-serif text-sm font-bold text-red-800">Ticket No Encontrado</h6>
                    <p className="text-xs text-red-700/80 font-light">
                      El código ingresado no existe en los registros de Supabase. Revisa la escritura del código.
                    </p>
                  </div>
                )}

                {searchStatus === "found_valid" && searchedTicket && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                      <span className="material-symbols-outlined text-5xl text-emerald-500 animate-bounce">check_circle</span>
                      <h6 className="text-emerald-700 font-bold uppercase tracking-wider text-xs">
                        TICKET VÁLIDO - LISTO PARA ACCESO
                      </h6>
                      <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                    </div>

                    <div className="bg-stone-50 p-4 border border-stone-200/40 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Nombre del Visitante:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                      </div>
                      {searchedTicket.email && (
                        <div className="flex justify-between border-b border-stone-200/30 pb-2">
                          <span className="text-stone-500">Correo:</span>
                          <span className="font-semibold text-stone-800">{searchedTicket.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Experiencia:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.packageName}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Fecha y Hora:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.date} a las {searchedTicket.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Número de Personas:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.guests} pax</span>
                      </div>
                    </div>

                    <button
                      onClick={handleMarkTicketAsUsed}
                      className="w-full bg-primary hover:bg-[#8c4723] text-white py-3.5 font-label-caps text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer"
                    >
                      Registrar Entrada (Marcar como Usado)
                    </button>
                  </div>
                )}

                {searchStatus === "found_used" && searchedTicket && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                      <span className="material-symbols-outlined text-5xl text-red-500">warning</span>
                      <h6 className="text-red-700 font-bold uppercase tracking-wider text-xs">
                        ACCESO DENEGADO (TICKET YA USADO)
                      </h6>
                      <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                    </div>

                    <div className="bg-stone-50 p-4 border border-stone-200/40 space-y-2.5 text-xs">
                      <div className="text-stone-700 border-b border-stone-200/30 pb-2 font-medium">
                        <span className="font-semibold block text-[10px] text-stone-500 uppercase">Validado por Staff en:</span>
                        <span className="block mt-0.5 text-red-600 font-bold">✅ {scanValidatedTime}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Nombre del Visitante:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Experiencia:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.packageName} • {searchedTicket.guests} pax</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB C: Bookings log from Supabase */}
            {activeTab === "log" && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold">
                    Historial de Reservaciones en Supabase
                  </h5>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowManualForm(!showManualForm)}
                      className="text-xs bg-primary hover:bg-[#8c4723] text-white font-semibold uppercase tracking-wider px-4 py-2 flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      <span className="material-symbols-outlined text-xs">add</span>
                      {showManualForm ? "Cancelar Registro" : "Registrar Reserva Manual"}
                    </button>
                    <button
                      onClick={loadData}
                      className="text-xs text-stone-600 hover:text-stone-800 font-semibold cursor-pointer border border-stone-200 px-3 py-1 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-xs">refresh</span>
                      Actualizar
                    </button>
                  </div>
                </div>

                {/* Collapsible Manual Booking Form */}
                {showManualForm && (
                  <form onSubmit={handleManualBookingSubmit} className="bg-stone-50 border border-outline-variant/35 p-6 space-y-4 max-w-xl mx-auto font-sans">
                    <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 uppercase tracking-wide">
                      Formulario de Captura de Reservación (Staff)
                    </h6>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          placeholder="Ej. Pedro Picapiedra"
                          className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none focus:border-primary text-on-surface"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Correo Electrónico *</label>
                          <input
                            type="email"
                            required
                            value={manualEmail}
                            onChange={(e) => setManualEmail(e.target.value)}
                            placeholder="pedro@ejemplo.com"
                            className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Teléfono / WhatsApp</label>
                          <input
                            type="tel"
                            value={manualPhone}
                            onChange={(e) => setManualPhone(e.target.value)}
                            placeholder="3312345678"
                            className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none text-on-surface"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Experiencia *</label>
                          <select
                            value={manualTour}
                            onChange={(e) => setManualTour(e.target.value)}
                            className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none text-on-surface"
                          >
                            <option value="oro">Casa Loy Oro ($550.00)</option>
                            <option value="platino">Casa Loy Platino ($750.00)</option>
                            <option value="diamante">Casa Loy Diamante ($1,500.00)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Fecha de Visita *</label>
                          <input
                            type="date"
                            required
                            value={manualDate}
                            onChange={(e) => setManualDate(e.target.value)}
                            className="w-full bg-white border border-outline-variant p-2 text-xs focus:outline-none text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Horario *</label>
                          <select
                            value={manualTime}
                            onChange={(e) => setManualTime(e.target.value)}
                            className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none text-on-surface"
                          >
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Visitantes (Lugares) *</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            required
                            value={manualGuests}
                            onChange={(e) => setManualGuests(parseInt(e.target.value) || 1)}
                            className="w-full bg-white border border-outline-variant p-2 text-xs focus:outline-none text-center text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Total Cobrado (MXN) *</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={manualAmount}
                            onChange={(e) => setManualAmount(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white border border-outline-variant p-2 text-xs focus:outline-none text-center text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-stone-500 uppercase mb-1">Método de Pago *</label>
                          <select
                            value={manualMethod}
                            onChange={(e) => setManualMethod(e.target.value)}
                            className="w-full bg-white border border-outline-variant p-2.5 text-xs focus:outline-none text-on-surface"
                          >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Cortesía">Cortesía</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingManual}
                      className="w-full bg-primary hover:bg-[#8c4723] text-white py-3 text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md"
                    >
                      {isSubmittingManual ? "Registrando..." : "Confirmar y Descontar Cupos"}
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200/60 font-semibold">
                        <th className="p-3">Código</th>
                        <th className="p-3">Cliente / Contacto</th>
                        <th className="p-3">Experiencia</th>
                        <th className="p-3">Fecha y Hora</th>
                        <th className="p-3 text-center">Visitantes</th>
                        <th className="p-3 text-right">Pago</th>
                        <th className="p-3 text-center">Estado</th>
                        <th className="p-3 text-center">Boleto QR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookingsLog.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-stone-400 italic">No hay registros de reservaciones en Supabase.</td>
                        </tr>
                      ) : (
                        bookingsLog.map((log) => {
                          const isUsed = log.used_at || localStorage.getItem(`used_ticket_${log.code}`);
                          return (
                            <tr key={log.code} className="hover:bg-stone-50/50 text-stone-700">
                              <td className="p-3 font-mono font-bold text-primary select-all">{log.code}</td>
                              <td className="p-3 space-y-0.5">
                                <div className="font-semibold text-stone-900">{log.name}</div>
                                <div className="text-[10px] text-stone-500">{log.email}</div>
                                <div className="text-[10px] text-stone-500">{log.phone}</div>
                              </td>
                              <td className="p-3 font-medium">{log.packageName}</td>
                              <td className="p-3">
                                <div>{log.date}</div>
                                <div className="text-[10px] text-stone-500">{log.time}</div>
                              </td>
                              <td className="p-3 text-center font-semibold">{log.guests} pax</td>
                              <td className="p-3 text-right font-medium">
                                <div className="text-stone-900 font-bold">${log.amount} MXN</div>
                                <div className="text-[9px] text-stone-400 uppercase tracking-wider">{log.method}</div>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-none ${
                                  isUsed 
                                    ? "bg-red-50 text-red-700 border border-red-200/30" 
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/30"
                                }`}>
                                  {isUsed ? "Acceso Completado" : "Vigente"}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setSelectedQrTicket(log)}
                                  className="bg-primary/10 hover:bg-primary hover:text-white text-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
                                >
                                  <span className="material-symbols-outlined text-xs">qr_code_2</span>
                                  Ver QR
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* QR Ticket Modal for Admin */}
      {selectedQrTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl relative border border-stone-200 text-stone-800 space-y-4">
            <button
              onClick={() => setSelectedQrTicket(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-primary">Boleto Digital de Acceso</h4>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-mono font-semibold">{selectedQrTicket.code}</p>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200/60 flex flex-col items-center justify-center space-y-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  `${window.location.origin}/validar-ticket?code=${selectedQrTicket.code}&package=${encodeURIComponent(selectedQrTicket.packageName)}&date=${selectedQrTicket.date}&time=${encodeURIComponent(selectedQrTicket.time)}&guests=${selectedQrTicket.guests}`
                )}`}
                alt="Código QR de Acceso"
                className="w-48 h-48 border border-white shadow-sm bg-white p-2"
              />
              <span className="text-[10px] text-stone-400 text-center">Escanea este código QR con cualquier dispositivo para validar la entrada</span>
            </div>

            <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Titular:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.name}</span>
              </div>
              {selectedQrTicket.email && (
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Correo:</span>
                  <span className="font-semibold text-stone-800">{selectedQrTicket.email}</span>
                </div>
              )}
              {selectedQrTicket.phone && (
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Teléfono:</span>
                  <span className="font-semibold text-stone-800">{selectedQrTicket.phone}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Experiencia:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Fecha y Hora:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.date} a las {selectedQrTicket.time}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Visitantes:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.guests} pax</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Monto Cobrado:</span>
                <span className="font-bold text-stone-900">${selectedQrTicket.amount} MXN ({selectedQrTicket.method})</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Imprimir / PDF
              </button>
              <button
                onClick={() => setSelectedQrTicket(null)}
                className="flex-1 bg-primary hover:bg-[#8c4723] text-white py-2.5 font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
