import React, { useState, useEffect } from "react";

export default function NewsletterPopup({ lang = "es" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const content = {
    es: {
      title: "Únete a la Comunidad",
      desc: "Recibe noticias, experiencias, lanzamientos y artículos exclusivos de Casa Loy.",
      placeholder: "Correo electrónico",
      btnSubscribe: "SUSCRIBIRME",
      btnLoading: "ENVIANDO...",
      success: "¡Bienvenido a Casa Loy!",
      successDesc: "Te has suscrito correctamente a nuestra comunidad.",
      disclaimer: "Al suscribirte aceptas recibir comunicaciones de Casa Loy Tequilera y reconoces nuestro ",
      privacyLink: "Aviso de privacidad",
      close: "Cerrar"
    },
    en: {
      title: "Join the Community",
      desc: "Receive news, experiences, launches and exclusive articles from Casa Loy.",
      placeholder: "Email address",
      btnSubscribe: "SUBSCRIBE",
      btnLoading: "SENDING...",
      success: "Welcome to Casa Loy!",
      successDesc: "You have successfully joined our community.",
      disclaimer: "By subscribing you agree to receive communications from Casa Loy Tequilera and acknowledge our ",
      privacyLink: "Privacy policy",
      close: "Close"
    }
  };

  const t = content[lang] || content.es;

  useEffect(() => {
    // Check if user has already dismissed the popup or is already subscribed
    const isDismissed = localStorage.getItem("casa_loy_popup_dismissed") === "true";
    const isSubscribed = localStorage.getItem("casa_loy_subscribed") === "true";

    if (!isDismissed && !isSubscribed) {
      // Trigger popup 5 seconds after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("casa_loy_popup_dismissed", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          source_page: "popup_global"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        localStorage.setItem("casa_loy_subscribed", "true");
        // Auto close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Ocurrió un error. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Popup subscription fetch error:", err);
      setStatus("error");
      setMessage(lang === "es" 
        ? "Error de conexión. Inténtalo de nuevo." 
        : "Connection error. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in transition-opacity duration-300">
      {/* Click outside to close (standard overlay behavior) */}
      <div className="absolute inset-0 cursor-default" onClick={handleClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#FCF9F3] text-[#1C1C18] border border-[#8C4723]/15 shadow-2xl rounded-none grid grid-cols-1 md:grid-cols-2 overflow-hidden animate-[fade-in-slide_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] z-10">
        
        {/* Left Column: Evocative Premium Image (Desktop only) */}
        <div className="hidden md:block relative h-full min-h-[420px] bg-zinc-900">
          <img
            src="/Campo de Agaves Casa Loy Tequilera 1.webp"
            alt="Agave fields at sunset"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[12s] scale-105 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <div className="absolute bottom-6 left-6 text-white/80 font-navigation text-[9px] uppercase tracking-[0.2em]">
            Los Altos de Jalisco &copy; Casa Loy
          </div>
        </div>

        {/* Right Column: Editorial Form Content */}
        <div className="flex flex-col justify-between p-8 md:p-12 relative min-h-[380px] md:min-h-full">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#1C1C18]/40 hover:text-[#8C4723] transition-colors duration-300 hover:rotate-90 select-none cursor-pointer focus:outline-none"
            aria-label={t.close}
          >
            <span className="material-symbols-outlined font-light text-xl">close</span>
          </button>

          {/* Form Header */}
          <div className="my-auto space-y-6">
            {status !== "success" ? (
              <>
                <div className="space-y-3">
                  <h3 className="font-serif text-[28px] md:text-[32px] font-bold text-[#2F403E] leading-tight tracking-wide">
                    {t.title}
                  </h3>
                  <p className="font-navigation text-[13.5px] text-[#53443a] leading-relaxed font-normal">
                    {t.desc}
                  </p>
                </div>

                {/* Subscription Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="w-full bg-white/70 border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13.5px] text-[#1C1C18] placeholder:text-[#1C1C18]/40 focus:outline-none px-4 py-3 transition-all duration-300 rounded-none"
                      placeholder={t.placeholder}
                      disabled={status === "loading"}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-[12px] font-navigation text-red-700 font-medium leading-relaxed">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#8C4723] text-white hover:bg-[#2F403E] disabled:bg-[#8c4723]/60 font-navigation text-[11px] font-bold uppercase tracking-[0.2em] py-3.5 transition-all duration-300 focus:outline-none cursor-pointer"
                  >
                    {status === "loading" ? t.btnLoading : t.btnSubscribe}
                  </button>
                </form>

                {/* Privacy Disclaimer */}
                <p className="text-[9.5px] font-navigation text-[#1C1C18]/50 leading-relaxed font-normal">
                  {t.disclaimer}
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClose();
                      // Navigate to privacy page in Vite app if needed
                      window.location.hash = "privacy";
                    }}
                    className="text-[#8C4723] hover:text-[#2F403E] transition-colors duration-300 underline underline-offset-2"
                  >
                    {t.privacyLink}
                  </a>
                  .
                </p>
              </>
            ) : (
              // Success State Card
              <div className="py-8 text-center space-y-4 animate-[fade-in-slide_0.5s_ease-out_forwards]">
                <div className="w-12 h-12 bg-[#2F403E]/10 rounded-full flex items-center justify-center mx-auto text-[#2F403E] mb-2">
                  <span className="material-symbols-outlined text-2xl font-light">done</span>
                </div>
                <h3 className="font-serif text-[26px] font-bold text-[#2F403E] tracking-wide">
                  {t.success}
                </h3>
                <p className="font-navigation text-[14px] text-[#53443a] leading-relaxed font-normal max-w-xs mx-auto">
                  {t.successDesc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
