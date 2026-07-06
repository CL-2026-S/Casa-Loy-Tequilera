import { useState, useEffect } from "react";

export default function AdminPanel({
  lang,
  setPage,
  maxCapacityLimit,
  setMaxCapacityLimit,
  blockedDates,
  setBlockedDates,
  bookingsCapacity,
  setBookingsCapacity
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
  const [activeTab, setActiveTab] = useState("calendar"); // "calendar", "validate", "log"
  const [bookingsLog, setBookingsLog] = useState([]);
  
  // Validation query states
  const [ticketSearchCode, setTicketSearchCode] = useState("");
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [searchStatus, setSearchStatus] = useState(""); // "", "found_valid", "found_used", "not_found"
  const [scanValidatedTime, setScanValidatedTime] = useState("");

  // Slots editor states
  const [editPackageId, setEditPackageId] = useState("oro");
  const [editDateStr, setEditDateStr] = useState("");
  const [editTimeSlot, setEditTimeSlot] = useState("10:00 AM");
  const [editSpotsValue, setEditSpotsValue] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load bookings log from localstorage
    loadBookingsLog();
  }, []);

  const loadBookingsLog = () => {
    try {
      const saved = localStorage.getItem("casa_loy_bookings_log");
      if (saved) {
        setBookingsLog(JSON.parse(saved));
      } else {
        // Mock default bookings log if empty for visual demo
        const mockLog = [
          {
            code: "CL-ORO-202607153928",
            name: "Juan Carlos Gómez",
            email: "jc.gomez@gmail.com",
            phone: "+52 331 456 7890",
            packageName: "Experiencia Casa Loy Oro",
            date: "2026-07-15",
            time: "10:00 AM",
            guests: 2,
            amount: 1100,
            method: "PayPal",
            timestamp: "05/07/2026 14:32:10"
          },
          {
            code: "CL-DIAMANTE-202607204928",
            name: "María Fernanda Ortiz",
            email: "mafer.ortiz@outlook.com",
            phone: "+52 552 189 0456",
            packageName: "Experiencia Casa Loy Diamante",
            date: "2026-07-20",
            time: "11:00 AM",
            guests: 4,
            amount: 3000,
            method: "Mercado Pago",
            timestamp: "06/07/2026 10:15:45"
          }
        ];
        localStorage.setItem("casa_loy_bookings_log", JSON.stringify(mockLog));
        setBookingsLog(mockLog);
      }
    } catch (e) {
      console.error(e);
    }
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
    } else {
      setErrorMsg(lang === "es" ? "Credenciales incorrectas. Para pruebas usa: admin@casaloy.com / admin" : "Incorrect credentials. For testing use: admin@casaloy.com / admin");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("casa_loy_admin_logged");
    setIsLoggedIn(false);
  };

  // Search Ticket manually in panel
  const handleSearchTicket = () => {
    setSearchStatus("");
    setSearchedTicket(null);
    if (!ticketSearchCode) return;

    // Search in localstorage logs
    const ticket = bookingsLog.find((b) => b.code.trim().toUpperCase() === ticketSearchCode.trim().toUpperCase());
    
    // Check in localstorage if used
    const usedTime = localStorage.getItem(`used_ticket_${ticketSearchCode.trim().toUpperCase()}`);

    if (ticket) {
      setSearchedTicket(ticket);
      if (usedTime) {
        setSearchStatus("found_used");
        setScanValidatedTime(usedTime);
      } else {
        setSearchStatus("found_valid");
      }
    } else {
      // If code matches mock syntax but not in list, make a simulation ticket
      if (ticketSearchCode.toUpperCase().startsWith("CL-")) {
        const simTicket = {
          code: ticketSearchCode.toUpperCase(),
          name: "Cliente Externo",
          packageName: ticketSearchCode.includes("DIAMANTE") ? "Experiencia Casa Loy Diamante" : ticketSearchCode.includes("PLATINO") ? "Experiencia Casa Loy Platino" : "Experiencia Casa Loy Oro",
          date: new Date().toISOString().split('T')[0],
          time: "10:00 AM",
          guests: 2
        };
        setSearchedTicket(simTicket);
        if (usedTime) {
          setSearchStatus("found_used");
          setScanValidatedTime(usedTime);
        } else {
          setSearchStatus("found_valid");
        }
      } else {
        setSearchStatus("not_found");
      }
    }
  };

  const handleMarkTicketAsUsed = () => {
    if (!searchedTicket) return;
    const nowStr = new Date().toLocaleString();
    localStorage.setItem(`used_ticket_${searchedTicket.code}`, nowStr);
    setScanValidatedTime(nowStr);
    setSearchStatus("found_used");
    loadBookingsLog(); // reload logs to keep sync
  };

  const handleToggleBlockDate = () => {
    if (!editDateStr) {
      alert("Selecciona una fecha");
      return;
    }
    if (blockedDates.includes(editDateStr)) {
      setBlockedDates(blockedDates.filter((d) => d !== editDateStr));
    } else {
      setBlockedDates([...blockedDates, editDateStr]);
    }
  };

  const handleUpdateSlotSpots = () => {
    if (!editDateStr) {
      alert("Selecciona una fecha");
      return;
    }
    setBookingsCapacity((prev) => ({
      ...prev,
      [editDateStr]: {
        ...(prev[editDateStr] || {}),
        [editTimeSlot]: parseInt(editSpotsValue) || 0
      }
    }));
    alert("Cupo ocupado actualizado con éxito");
  };

  return (
    <div className="bg-[#fcf9f3] min-h-screen text-on-surface py-24 font-sans select-text">
      
      {/* 1. Login & Registration Layout (If not logged in) */}
      {!isLoggedIn ? (
        <div className="w-full max-w-md mx-auto bg-white border border-outline-variant/30 p-8 shadow-2xl space-y-6">
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
        
        /* 2. CMS Admin Dashboard */
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          
          {/* Header Bar */}
          <div className="bg-white border border-outline-variant/30 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-sm">
            <div className="text-left">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">dashboard</span>
                <h4 className="font-serif text-xl font-bold uppercase tracking-wider">Casa Loy CMS Panel</h4>
              </div>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">
                Panel centralizado para control de turismo, cupos de experiencias y validación de entradas.
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

          {/* Navigation Tabs (Shopify Admin Style) */}
          <div className="flex border-b border-outline-variant/20 gap-6">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "calendar" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📅 Control de Cupos
            </button>
            <button
              onClick={() => setActiveTab("validate")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "validate" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🔍 Validar Tickets
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "log" ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📋 Bitácora de Reservas
            </button>
          </div>

          {/* CMS Tab Content */}
          <div className="bg-white border border-outline-variant/35 p-8 shadow-md">
            
            {/* TAB A: Calendar Capacity Controls */}
            {activeTab === "calendar" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Left section: Settings forms */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-4">
                    <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold border-b border-stone-100 pb-2">
                      Límite de Cupo General
                    </h5>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={maxCapacityLimit}
                        onChange={(e) => setMaxCapacityLimit(parseInt(e.target.value) || 20)}
                        className="bg-stone-50 border border-outline-variant p-3 w-28 text-center text-sm font-sans focus:outline-none focus:border-primary"
                      />
                      <span className="text-xs text-on-surface-variant font-light leading-relaxed">
                        Lugares disponibles máximos por turno y horario (se aplica por defecto a todos los slots).
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold border-b border-stone-100 pb-2">
                      Bloquear o Modificar Turnos
                    </h5>
                    
                    <div className="space-y-4">
                      {/* Date picker */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">Fecha</label>
                        <input
                          type="date"
                          value={editDateStr}
                          onChange={(e) => setEditDateStr(e.target.value)}
                          className="bg-stone-50 border border-outline-variant p-3 w-full text-xs font-sans focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Action blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Block Date */}
                        <div className="border border-stone-100 p-4 space-y-2 bg-stone-50/50">
                          <span className="text-[10px] font-bold text-stone-700 block uppercase">
                            Bloqueo Completo
                          </span>
                          <button
                            onClick={handleToggleBlockDate}
                            disabled={!editDateStr}
                            className={`w-full py-2.5 text-xs font-semibold text-white tracking-wider cursor-pointer uppercase ${
                              blockedDates.includes(editDateStr) 
                                ? "bg-emerald-600 hover:bg-emerald-700" 
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {blockedDates.includes(editDateStr) ? "🔓 Desbloquear Fecha" : "🔒 Bloquear Fecha"}
                          </button>
                        </div>

                        {/* Adjust Occupancy */}
                        <div className="border border-stone-100 p-4 space-y-3 bg-stone-50/50">
                          <span className="text-[10px] font-bold text-stone-700 block uppercase">
                            Registrar Lugares Ocupados
                          </span>
                          <div className="flex gap-2 items-center">
                            <select
                              value={editTimeSlot}
                              onChange={(e) => setEditTimeSlot(e.target.value)}
                              className="bg-white border border-outline-variant p-2 flex-1 text-xs focus:outline-none"
                            >
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editSpotsValue}
                              onChange={(e) => setEditSpotsValue(parseInt(e.target.value) || 0)}
                              className="bg-white border border-outline-variant p-2 w-16 text-center text-xs focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                          <button
                            onClick={handleUpdateSlotSpots}
                            disabled={!editDateStr}
                            className="w-full bg-primary hover:bg-[#8c4723] text-white py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            Aplicar Ocupación
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right section: List of blocked dates */}
                <div className="lg:col-span-6 space-y-4 lg:pl-6 lg:border-l border-stone-100">
                  <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold border-b border-stone-100 pb-2">
                    Fechas Bloqueadas
                  </h5>
                  {blockedDates.length === 0 ? (
                    <p className="text-xs text-stone-400 font-light italic">No hay fechas inhabilitadas actualmente.</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {blockedDates.map((dateStr) => {
                        const parts = dateStr.split('-');
                        const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        return (
                          <div key={dateStr} className="flex justify-between items-center bg-stone-50 border border-stone-100 p-3">
                            <span className="text-xs font-bold text-stone-700">🔒 Hacienda Cerrada el {formatted}</span>
                            <button
                              onClick={() => setBlockedDates(blockedDates.filter((d) => d !== dateStr))}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                            >
                              Habilitar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="bg-[#fcf9f3] p-4 text-xs font-sans text-stone-600 leading-relaxed border border-stone-200/40 pt-4 mt-6">
                    <strong>💡 Tip de administración:</strong> Al bloquear una fecha o registrar cupos ocupados desde este panel, los clientes que visiten la web pública verán los horarios bloqueados o con el stock reducido inmediatamente al agendar en tiempo real.
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: Ticket verification search */}
            {activeTab === "validate" && (
              <div className="max-w-xl mx-auto space-y-6 text-left py-4">
                <div className="space-y-2">
                  <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold">
                    Ingresa o Escanea el Código del Ticket
                  </h5>
                  <p className="text-xs text-stone-400 font-light">
                    Ingresa el código único del ticket (ej: CL-ORO-XXXX) para validar los datos del visitante y marcar su entrada.
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

                {/* Validation status cards */}
                {searchStatus === "not_found" && (
                  <div className="bg-red-50 border border-red-200/40 p-5 text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    <h6 className="font-serif text-sm font-bold text-red-800">Ticket No Encontrado</h6>
                    <p className="text-xs text-red-700/80 font-light">
                      El código ingresado no existe en los registros de reservas de Casa Loy. Por favor, revisa que esté escrito correctamente.
                    </p>
                  </div>
                )}

                {searchStatus === "found_valid" && searchedTicket && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                      <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
                      <h6 className="text-emerald-700 font-bold uppercase tracking-wider text-xs">
                        TICKET VÁLIDO - SIN ACCESAR
                      </h6>
                      <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                    </div>

                    <div className="bg-stone-50 p-4 border border-stone-200/40 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Nombre del Visitante:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Experiencia:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.packageName}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/30 pb-2">
                        <span className="text-stone-500">Fecha y Hora:</span>
                        <span className="font-bold text-stone-800">{searchedTicket.date} a las {searchedTicket.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Visitantes autorizados:</span>
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
                        ACCESO YA REGISTRADO (TICKET USADO)
                      </h6>
                      <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                    </div>

                    <div className="bg-stone-50 p-4 border border-stone-200/40 space-y-2.5 text-xs">
                      <div className="text-stone-700 border-b border-stone-200/30 pb-2 font-medium">
                        <span className="font-semibold block text-[10px] text-stone-500 uppercase">Validado por Staff en:</span>
                        <span className="block mt-0.5 text-stone-800 font-bold">✅ {scanValidatedTime}</span>
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

                    <button
                      onClick={() => {
                        if (confirm("¿Deseas reactivar esta entrada para permitir el check-in de nuevo?")) {
                          localStorage.removeItem(`used_ticket_${searchedTicket.code}`);
                          setSearchStatus("found_valid");
                          setScanValidatedTime("");
                          loadBookingsLog();
                        }
                      }}
                      className="w-full py-2.5 border border-outline-variant hover:bg-stone-50 text-stone-600 font-medium text-xs text-center cursor-pointer"
                    >
                      Re-activar Entrada (Habilitar Check-in)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB C: Bookings log */}
            {activeTab === "log" && (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <h5 className="font-navigation text-sm uppercase tracking-wider text-primary font-bold">
                    Historial y Registro de Reservaciones
                  </h5>
                  <button
                    onClick={() => {
                      if (confirm("¿Seguro que deseas limpiar la bitácora?")) {
                        localStorage.removeItem("casa_loy_bookings_log");
                        loadBookingsLog();
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                  >
                    Limpiar Bitácora
                  </button>
                </div>

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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookingsLog.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-stone-400 italic">No hay registros de reservaciones.</td>
                        </tr>
                      ) : (
                        bookingsLog.map((log) => {
                          const isUsed = localStorage.getItem(`used_ticket_${log.code}`);
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
                                  {isUsed ? "Acceso Realizado" : "Vigente"}
                                </span>
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

    </div>
  );
}
