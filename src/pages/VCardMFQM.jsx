import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VCardMFQM({ lang: initialLang = "es", setLang: parentSetLang }) {
  const [lang, setLocalLang] = useState(() => {
    return initialLang || localStorage.getItem("casa_loy_pref_lang") || "es";
  });

  const [copiedKey, setCopiedKey] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync with parent setLang if provided
  const handleToggleLang = (targetLang) => {
    setLocalLang(targetLang);
    localStorage.setItem("casa_loy_pref_lang", targetLang);
    if (typeof parentSetLang === "function") {
      parentSetLang(targetLang);
    }
  };

  const contact = {
    name: "Fernanda Quintana",
    role: "KAE of Private Labels, Bulk, & Emerging Markets",
    company: "Casa Loy Tequilera",
    nom: "NOM 1633",
    mobileDisplay: "+52 33 2508 8372",
    mobileTel: "+523325088372",
    email: "fquintana@casaloy.com",
    address: "Carretera Ayotlán-Atotonilco km 6.5 Las Villas, 47930, Ayotlán, Jal.",
    mapsUrl: "https://maps.app.goo.gl/KCfGjQB68iiGYRkK7",
    websiteDisplay: "casaloy.com",
    websiteUrl: "https://casaloy.com",
    vcardUrl: "https://casaloy.com/contact/mfqm",
    photoUrl: "/fernanda-quintana.webp",
  };

  const i18n = {
    es: {
      roleTitle: "KAE of Private Labels, Bulk, & Emerging Markets",
      distilleryBadge: "Destilería de Los Altos de Jalisco",
      btnCall: "Llamar",
      btnEmail: "Correo",
      btnLocation: "Ubicación",
      mobileTitle: "Móvil",
      emailTitle: "Correo corporativo",
      addressTitle: "Dirección",
      websiteTitle: "Sitio web",
      directions: "Ver en Google Maps",
      saveContact: "Guardar Contacto",
      saveContactSub: "Añadir a tu libreta de contactos (vCard)",
      share: "Compartir",
      copyLink: "Copiar Enlace",
      copied: "¡Copiado!",
      qrModalTitle: "Código QR de Contacto",
      qrModalDesc: "Apunta con la cámara de tu móvil para abrir o guardar esta tarjeta digital.",
      close: "Cerrar",
      whatsappBtn: "Escribir por WhatsApp",
      visitDistillery: "Conocer Casa Loy",
      toastVcard: "Tarjeta descargada con éxito",
      directPhone: "Llamada directa",
      sendEmail: "Enviar mensaje"
    },
    en: {
      roleTitle: "KAE of Private Labels, Bulk, & Emerging Markets",
      distilleryBadge: "Los Altos de Jalisco Distillery",
      btnCall: "Call",
      btnEmail: "Email",
      btnLocation: "Location",
      mobileTitle: "Mobile",
      emailTitle: "Work Email",
      addressTitle: "Address",
      websiteTitle: "Website",
      directions: "View on Google Maps",
      saveContact: "Save Contact",
      saveContactSub: "Add to your phone contacts (vCard)",
      share: "Share",
      copyLink: "Copy Link",
      copied: "Copied!",
      qrModalTitle: "Contact QR Code",
      qrModalDesc: "Scan with your smartphone camera to open or save this digital business card.",
      close: "Close",
      whatsappBtn: "Chat on WhatsApp",
      visitDistillery: "Visit Casa Loy",
      toastVcard: "Contact file downloaded successfully",
      directPhone: "Direct phone call",
      sendEmail: "Send email"
    }
  };

  const t = i18n[lang] || i18n.es;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  const handleDownloadVCard = () => {
    const vcardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "PRODID:-//Casa Loy Tequilera//Digital Business Card//EN",
      "FN;CHARSET=UTF-8:Fernanda Quintana",
      "N;CHARSET=UTF-8:Quintana;Fernanda;;;",
      "ORG;CHARSET=UTF-8:Casa Loy Tequilera",
      "TITLE;CHARSET=UTF-8:KAE of Private Labels, Bulk, & Emerging Markets",
      "TEL;TYPE=CELL,VOICE:+523325088372",
      "EMAIL;TYPE=WORK,INTERNET:fquintana@casaloy.com",
      "URL:https://casaloy.com",
      "ADR;TYPE=WORK;CHARSET=UTF-8:;;Carretera Ayotlán-Atotonilco km 6.5 Las Villas;Ayotlán;Jalisco;47930;Mexico",
      "NOTE;CHARSET=UTF-8:Casa Loy Tequilera - KAE of Private Labels, Bulk, & Emerging Markets. NOM 1633.",
      "REV:" + new Date().toISOString(),
      "END:VCARD"
    ].join("\r\n");

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Fernanda_Quintana.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contact.name} | Casa Loy`,
          text: `${contact.name} - ${contact.role} at Casa Loy Tequilera`,
          url: contact.vcardUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setShowQrModal(true);
        }
      }
    } else {
      setShowQrModal(true);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    contact.vcardUrl
  )}&format=svg&margin=8&color=14221F`;

  return (
    <div className="min-h-screen bg-[#0F1715] text-[#1C1C18] flex flex-col items-center justify-start py-0 md:py-10 px-0 sm:px-4 font-sans selection:bg-[#C59B27]/30 selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedKey && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 bg-[#14221F] text-[#F3E0C6] px-5 py-2.5 rounded-full shadow-2xl border border-[#C59B27]/40 text-xs font-medium tracking-wide flex items-center gap-2 backdrop-blur-md"
          >
            <svg className="w-4 h-4 text-[#C59B27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{t.copied}</span>
          </motion.div>
        )}
        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 bg-[#2F403E] text-white px-5 py-2.5 rounded-full shadow-2xl border border-[#C59B27]/50 text-xs font-medium tracking-wide flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#C59B27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t.toastVcard}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-[#FCF9F3] md:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-[#EDE4D4]/80 flex flex-col relative min-h-screen md:min-h-0"
      >
        {/* ============================================================
            CARD HEADER & BANNER
            ============================================================ */}
        <div className="relative w-full h-44 sm:h-48 bg-gradient-to-br from-[#111A18] via-[#1A2825] to-[#2B3F3B] overflow-hidden flex flex-col justify-between p-4 sm:p-5">
          {/* Subtle agave texture pattern background */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: "url('/Campo de Agaves Casa Loy Tequilera 1.webp')" }}
          />

          {/* Top Controls Row: Logo + ES/EN Switcher + Share Button */}
          <div className="relative z-10 flex items-center justify-between w-full">
            {/* Casa Loy Logo */}
            <a
              href="https://casaloy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
              title="Casa Loy Tequilera"
            >
              <img
                src="/Logotipo Casa Loy Tequilera Color Blanco.webp"
                alt="Casa Loy Tequilera"
                className="h-7 w-auto object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="text-white/80 font-serif tracking-widest text-[11px] uppercase group-hover:text-white transition-colors">
                Casa Loy
              </span>
            </a>

            {/* Action Group: ES/EN Selector + Share */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-0.5 border border-white/15">
                <button
                  type="button"
                  onClick={() => handleToggleLang("es")}
                  className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-full transition-all ${
                    lang === "es"
                      ? "bg-[#C59B27] text-[#14221F] shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                  aria-label="Cambiar a Español"
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLang("en")}
                  className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-full transition-all ${
                    lang === "en"
                      ? "bg-[#C59B27] text-[#14221F] shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              {/* Share Icon Button */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all active:scale-95"
                title={t.share}
                aria-label={t.share}
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom subtle gold accent line inside banner */}
          <div className="relative z-10 flex items-center justify-between text-[10px] tracking-widest text-[#C59B27] uppercase font-mono font-medium">
            <span>{contact.nom}</span>
            <span>Los Altos de Jalisco</span>
          </div>
        </div>

        {/* ============================================================
            PROFILE PHOTO / FOTO
            ============================================================ */}
        <div className="relative flex justify-center -mt-16 sm:-mt-18 z-20 px-4">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-[#C59B27] via-[#EDE4D4] to-[#8C4723] shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#182320] border-2 border-white flex items-center justify-center relative">
              {!imgError ? (
                <img
                  src={contact.photoUrl}
                  alt={contact.name}
                  className="w-full h-full object-cover object-[center_15%]"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Luxury Monogram Executive Fallback */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#172522] to-[#0A1210] text-center p-2">
                  <svg className="w-6 h-6 text-[#C59B27] mb-1 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
                  </svg>
                  <span className="font-serif tracking-widest text-lg font-bold text-[#F3E0C6]">
                    FQ
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#C59B27]/90 font-medium">
                    Casa Loy
                  </span>
                </div>
              )}
            </div>

            {/* Verified Crest Badge */}
            <div
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#14221F] border-2 border-[#C59B27] flex items-center justify-center shadow-lg"
              title="Casa Loy Executive"
            >
              <svg className="w-4 h-4 text-[#C59B27]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================
            EXECUTIVE NAME & TITLE
            ============================================================ */}
        <div className="text-center px-6 pt-3.5 pb-2">
          <h1 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#1C1C18] tracking-tight leading-tight">
            {contact.name}
          </h1>

          <p className="text-[13px] sm:text-[14px] font-semibold text-[#8C4723] uppercase tracking-wider mt-1 leading-snug">
            {contact.role}
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-[#584A42]">
            <span className="font-medium">{contact.company}</span>
            <span className="w-1 h-1 rounded-full bg-[#C59B27]" />
            <span className="text-[11px] text-[#7D685D]">{t.distilleryBadge}</span>
          </div>
        </div>

        {/* ============================================================
            3 HORIZONTAL BUTTONS AT THE SAME HEIGHT (Call / Email / Location)
            ============================================================ */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* 1) CALL */}
            <a
              href={`tel:${contact.mobileTel}`}
              className="group h-[86px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#EDE4D4] shadow-sm hover:shadow-md hover:border-[#C59B27]/70 active:scale-95 transition-all text-center p-2"
              title={`${t.btnCall}: ${contact.mobileDisplay}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#14221F]/5 text-[#14221F] group-hover:bg-[#14221F] group-hover:text-[#C59B27] flex items-center justify-center transition-colors mb-1.5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-[#1C1C18] tracking-tight group-hover:text-[#8C4723] transition-colors leading-none">
                {t.btnCall}
              </span>
            </a>

            {/* 2) EMAIL */}
            <a
              href={`mailto:${contact.email}`}
              className="group h-[86px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#EDE4D4] shadow-sm hover:shadow-md hover:border-[#C59B27]/70 active:scale-95 transition-all text-center p-2"
              title={`${t.btnEmail}: ${contact.email}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#14221F]/5 text-[#14221F] group-hover:bg-[#14221F] group-hover:text-[#C59B27] flex items-center justify-center transition-colors mb-1.5">
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-[#1C1C18] tracking-tight group-hover:text-[#8C4723] transition-colors leading-none">
                {t.btnEmail}
              </span>
            </a>

            {/* 3) LOCATION */}
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-[86px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#EDE4D4] shadow-sm hover:shadow-md hover:border-[#C59B27]/70 active:scale-95 transition-all text-center p-2"
              title={`${t.btnLocation}: Ayotlán, Jalisco`}
            >
              <div className="w-10 h-10 rounded-full bg-[#14221F]/5 text-[#14221F] group-hover:bg-[#14221F] group-hover:text-[#C59B27] flex items-center justify-center transition-colors mb-1.5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-[#1C1C18] tracking-tight group-hover:text-[#8C4723] transition-colors leading-none">
                {t.btnLocation}
              </span>
            </a>
          </div>
        </div>

        {/* ============================================================
            CUERPO / CONTACT DETAILS LIST
            ============================================================ */}
        <div className="px-5 pb-6 flex-1 flex flex-col gap-3">
          {/* Item 1: Mobile */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE4D4] shadow-xs flex items-center justify-between hover:border-[#C59B27]/40 transition-colors">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] text-[#8C4723] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-semibold text-[#7D685D] tracking-wider block">
                  {t.mobileTitle}
                </span>
                <a
                  href={`tel:${contact.mobileTel}`}
                  className="text-[14px] font-medium text-[#1C1C18] hover:text-[#8C4723] transition-colors truncate block"
                >
                  {contact.mobileDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* WhatsApp Quick Chat */}
              <a
                href={`https://wa.me/523325088372?text=${encodeURIComponent(
                  lang === "es"
                    ? "Hola Fernanda, te contacto desde tu tarjeta digital Casa Loy."
                    : "Hello Fernanda, I am reaching out through your Casa Loy digital card."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all"
                title={t.whatsappBtn}
                aria-label={t.whatsappBtn}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16z" />
                </svg>
              </a>

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(contact.mobileDisplay, "phone")}
                className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#7D685D] hover:text-[#1C1C18] hover:bg-[#EDE4D4] flex items-center justify-center transition-all"
                title={t.copyLink}
                aria-label="Copy phone"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Item 2: Mail */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE4D4] shadow-xs flex items-center justify-between hover:border-[#C59B27]/40 transition-colors">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] text-[#8C4723] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-semibold text-[#7D685D] tracking-wider block">
                  {t.emailTitle}
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[14px] font-medium text-[#1C1C18] hover:text-[#8C4723] transition-colors truncate block"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={() => handleCopy(contact.email, "email")}
              className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#7D685D] hover:text-[#1C1C18] hover:bg-[#EDE4D4] flex items-center justify-center transition-all shrink-0"
              title={t.copyLink}
              aria-label="Copy email"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Item 3: Address */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE4D4] shadow-xs flex flex-col gap-2 hover:border-[#C59B27]/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] text-[#8C4723] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[11px] uppercase font-semibold text-[#7D685D] tracking-wider block">
                  {t.addressTitle}
                </span>
                <p className="text-[13px] leading-relaxed text-[#1C1C18] font-normal mt-0.5">
                  {contact.address}
                </p>
              </div>
            </div>

            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-12 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C4723] hover:text-[#5B2A24] transition-colors"
            >
              <span>{t.directions}</span>
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Item 4: Website */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE4D4] shadow-xs flex items-center justify-between hover:border-[#C59B27]/40 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] text-[#8C4723] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-semibold text-[#7D685D] tracking-wider block">
                  {t.websiteTitle}
                </span>
                <a
                  href={contact.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium text-[#1C1C18] hover:text-[#8C4723] transition-colors truncate block"
                >
                  {contact.websiteDisplay}
                </a>
              </div>
            </div>

            <a
              href={contact.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#7D685D] hover:text-[#1C1C18] hover:bg-[#EDE4D4] flex items-center justify-center transition-all shrink-0"
              title={t.visitDistillery}
              aria-label="Open website"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* ============================================================
            STICKY / FLOATING ACTION BAR: SAVE CONTACT (vCard)
            ============================================================ */}
        <div className="sticky bottom-0 z-30 p-4 sm:p-5 bg-gradient-to-t from-[#FCF9F3] via-[#FCF9F3]/95 to-[#FCF9F3]/40 backdrop-blur-md border-t border-[#EDE4D4]/60">
          <button
            type="button"
            onClick={handleDownloadVCard}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#14221F] via-[#243531] to-[#14221F] hover:from-[#0D1715] hover:to-[#0D1715] text-white shadow-xl hover:shadow-2xl hover:border-[#C59B27] border border-[#C59B27]/40 flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#C59B27] text-[#14221F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-[14px] font-semibold tracking-wide text-white leading-tight">
                {t.saveContact}
              </span>
              <span className="block text-[10px] text-[#C59B27] tracking-wider uppercase font-medium">
                {t.saveContactSub}
              </span>
            </div>
          </button>

          {/* Quick link back to full website */}
          <div className="text-center mt-3">
            <a
              href="https://casaloy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#7D685D] hover:text-[#1C1C18] tracking-wider uppercase font-medium transition-colors"
            >
              © Casa Loy Tequilera • Ayotlán, Jalisco
            </a>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          QR CODE / SHARE MODAL
          ============================================================ */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm bg-[#FCF9F3] rounded-3xl p-6 shadow-2xl border border-[#C59B27]/40 flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EDE4D4]/70 hover:bg-[#EDE4D4] text-[#1C1C18] flex items-center justify-center transition-colors"
                aria-label={t.close}
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <span className="text-[11px] font-semibold text-[#8C4723] uppercase tracking-wider mb-1">
                Casa Loy Tequilera
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1C1C18]">
                {t.qrModalTitle}
              </h3>
              <p className="text-xs text-[#584A42] mt-1 max-w-xs leading-relaxed">
                {t.qrModalDesc}
              </p>

              {/* QR Code Graphic Frame */}
              <div className="my-5 p-3.5 bg-white rounded-2xl border border-[#EDE4D4] shadow-md flex items-center justify-center">
                <img
                  src={qrImageUrl}
                  alt="QR Code"
                  className="w-52 h-52 object-contain rounded-lg"
                />
              </div>

              {/* Name & URL */}
              <p className="text-sm font-semibold text-[#1C1C18]">
                {contact.name}
              </p>
              <p className="text-xs text-[#7D685D] font-mono mt-0.5">
                {contact.vcardUrl}
              </p>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={() => handleCopy(contact.vcardUrl, "modalUrl")}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#14221F] text-[#F3E0C6] hover:bg-[#1C2C28] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>{copiedKey === "modalUrl" ? t.copied : t.copyLink}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
