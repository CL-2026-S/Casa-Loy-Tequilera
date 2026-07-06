import { useState, useEffect } from "react";

export default function ValidateTicket({ lang, setPage }) {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [validationStatus, setValidationStatus] = useState("checking"); // "checking", "valid", "used", "error"
  const [validatedAt, setValidatedAt] = useState("");

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Read URL query parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const packageName = params.get("package");
    const date = params.get("date");
    const time = params.get("time");
    const guests = params.get("guests");

    if (!code || !packageName) {
      setValidationStatus("error");
      return;
    }

    const details = { code, packageName, date, time, guests };
    setTicketDetails(details);

    // Check if ticket is already marked as used in localStorage
    const savedUse = localStorage.getItem(`used_ticket_${code}`);
    if (savedUse) {
      setValidationStatus("used");
      setValidatedAt(savedUse);
    } else {
      setValidationStatus("valid");
    }
  }, []);

  const handleValidateTicket = () => {
    if (!ticketDetails) return;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // Mark as used in localStorage
    localStorage.setItem(`used_ticket_${ticketDetails.code}`, formattedDate);
    setValidatedAt(formattedDate);
    setValidationStatus("used");
  };

  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="bg-[#fcf9f3] min-h-screen text-on-surface py-20 px-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white border border-outline-variant/30 p-8 shadow-2xl space-y-6 text-center">
        {/* Brand Header */}
        <div className="space-y-2 border-b border-outline-variant/20 pb-4">
          <span className="font-serif text-xl tracking-widest text-[#1c1c18] font-bold block uppercase">CASA LOY</span>
          <span className="text-[10px] text-primary tracking-widest uppercase font-semibold block">
            {lang === "es" ? "Validador de Accesos (Turismo)" : "Access Ticket Validator (Tourism)"}
          </span>
        </div>

        {/* Checking State */}
        {validationStatus === "checking" && (
          <div className="py-8 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm font-light text-on-surface-variant">
              {lang === "es" ? "Verificando validez del ticket..." : "Verifying ticket validity..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {validationStatus === "error" && (
          <div className="py-8 space-y-4">
            <span className="material-symbols-outlined text-6xl text-red-500">error</span>
            <h3 className="font-serif text-lg font-bold">
              {lang === "es" ? "Ticket Inválido o Incompleto" : "Invalid or Incomplete Ticket"}
            </h3>
            <p className="text-xs text-on-surface-variant/80 font-light max-w-xs mx-auto">
              {lang === "es" 
                ? "El código QR escaneado no contiene la estructura de parámetros requerida por Casa Loy." 
                : "The scanned QR code does not contain the parameter structure required by Casa Loy."}
            </p>
            <button
              onClick={() => setPage("home")}
              className="mt-4 inline-block bg-stone-900 text-white text-xs px-6 py-2.5 uppercase tracking-wider font-semibold cursor-pointer hover:bg-stone-800 transition-colors"
            >
              {lang === "es" ? "Ir al Inicio" : "Go Home"}
            </button>
          </div>
        )}

        {/* Valid Ticket Screen */}
        {validationStatus === "valid" && ticketDetails && (
          <div className="space-y-6">
            {/* Status indicator */}
            <div className="bg-emerald-50 border border-emerald-200/50 p-4 py-6 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-5xl text-emerald-500">verified</span>
              <h3 className="text-emerald-700 font-bold uppercase tracking-wider text-sm font-navigation">
                {lang === "es" ? "TICKET VÁLIDO - LISTO" : "VALID TICKET - READY"}
              </h3>
              <span className="font-mono text-xs text-stone-500">{ticketDetails.code}</span>
            </div>

            {/* Ticket details summary */}
            <div className="bg-stone-50 border border-stone-100 p-4 text-left space-y-3">
              <div className="border-b border-stone-200/50 pb-2">
                <span className="text-[9px] uppercase tracking-wider text-primary block font-semibold">
                  {lang === "es" ? "Experiencia Reservada" : "Reserved Experience"}
                </span>
                <span className="text-sm font-bold text-stone-800 block mt-0.5">{ticketDetails.packageName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b border-stone-200/50 pb-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-primary block font-semibold">
                    {lang === "es" ? "Fecha de Visita" : "Visit Date"}
                  </span>
                  <span className="text-xs font-semibold text-stone-700 block mt-0.5">{formatShowDate(ticketDetails.date)}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-primary block font-semibold">
                    {lang === "es" ? "Horario" : "Time"}
                  </span>
                  <span className="text-xs font-semibold text-stone-700 block mt-0.5">{ticketDetails.time}</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-primary block font-semibold">
                  {lang === "es" ? "Visitantes" : "Guests"}
                </span>
                <span className="text-xs font-semibold text-stone-700 block mt-0.5">
                  {ticketDetails.guests} {ticketDetails.guests === "1" ? (lang === "es" ? "Persona" : "Person") : (lang === "es" ? "Personas" : "People")}
                </span>
              </div>
            </div>

            {/* Validate Action button */}
            <button
              onClick={handleValidateTicket}
              className="w-full bg-primary hover:bg-[#8c4723] text-white py-4 font-label-caps text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              {lang === "es" ? "Validar y Registrar Entrada" : "Validate & Register Entrance"}
            </button>
          </div>
        )}

        {/* Used / Validated Ticket Screen */}
        {validationStatus === "used" && ticketDetails && (
          <div className="space-y-6">
            {/* Status indicator */}
            <div className="bg-red-50 border border-red-200/50 p-4 py-6 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-5xl text-red-500">cancel</span>
              <h3 className="text-red-700 font-bold uppercase tracking-wider text-sm font-navigation">
                {lang === "es" ? "ACCESO COMPLETADO" : "ENTRY COMPLETED"}
              </h3>
              <span className="text-xs text-red-600 font-medium">
                {lang === "es" ? "Ticket ya marcado como usado" : "Ticket already marked as used"}
              </span>
              <span className="font-mono text-xs text-stone-500 mt-1">{ticketDetails.code}</span>
            </div>

            {/* Validation history */}
            <div className="bg-stone-50 border border-stone-100 p-4 text-left text-xs space-y-2">
              <div className="text-stone-700">
                <span className="font-semibold block text-[10px] text-stone-500 uppercase">
                  {lang === "es" ? "Fecha de Validación" : "Validation Date"}
                </span>
                <span className="block font-medium mt-0.5 text-stone-800">✅ {validatedAt}</span>
              </div>
              <div className="border-t border-stone-200/50 pt-2 text-stone-700">
                <span className="font-semibold block text-[10px] text-stone-500 uppercase">
                  {lang === "es" ? "Reserva" : "Booking"}
                </span>
                <span className="block mt-0.5">{ticketDetails.packageName} • {ticketDetails.guests} pax</span>
                <span className="block text-stone-500 text-[10px] mt-0.5">{formatShowDate(ticketDetails.date)} a las {ticketDetails.time}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (confirm(lang === "es" ? "¿Seguro que deseas reactivar este ticket?" : "Are you sure you want to reactivate this ticket?")) {
                    localStorage.removeItem(`used_ticket_${ticketDetails.code}`);
                    setValidationStatus("valid");
                    setValidatedAt("");
                  }
                }}
                className="w-full py-2.5 border border-outline-variant hover:bg-stone-50 text-stone-600 font-medium text-xs text-center cursor-pointer font-sans"
              >
                {lang === "es" ? "Re-activar Ticket (Deshacer)" : "Re-activate Ticket (Undo)"}
              </button>
              
              <button
                onClick={() => setPage("home")}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 font-label-caps text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer text-center"
              >
                {lang === "es" ? "Volver al Inicio" : "Go to Homepage"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
