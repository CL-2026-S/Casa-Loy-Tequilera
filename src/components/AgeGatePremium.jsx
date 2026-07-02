import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Country legal ages mapping
const countryData = {
  MX: { nameEs: "México", nameEn: "Mexico", age: 18, redirect: "https://alcoholinformate.org.mx/" },
  US: { nameEs: "USA", nameEn: "USA", age: 21, redirect: "https://www.responsibility.org/" },
  GT: { nameEs: "Guatemala", nameEn: "Guatemala", age: 18, redirect: "https://seccatid.gob.gt/" },
  CO: { nameEs: "Colombia", nameEn: "Colombia", age: 18, redirect: "https://www.invima.gov.co/productos-vigilados/alimentos/bebidas-alcoholicas" },
  HK: { nameEs: "Hong Kong", nameEn: "Hong Kong", age: 18, redirect: "https://www.chp.gov.hk/en/healthtopics/content/100200/8798.html" },
  ROW: { nameEs: "Resto del mundo", nameEn: "Rest of the World", age: 18, redirect: "https://www.iard.org/" }
};

const renderFlag = (code) => {
  if (code === "ROW") {
    return (
      <svg className="w-5 h-3.5 text-[#8C4723] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        <path strokeLinecap="round" d="M3 12h18" />
      </svg>
    );
  }
  const codeLower = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${codeLower}.png`}
      srcSet={`https://flagcdn.com/w80/${codeLower}.png 2x`}
      alt={`${code} flag`}
      className="w-5 h-3.5 object-contain rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-black/5 shrink-0"
    />
  );
};

export default function AgeGatePremium({ onVerify, lang, setLang }) {
  const [selectedCountry, setSelectedCountry] = useState("MX");
  const [year, setYear] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [isUnderage, setIsUnderage] = useState(false);
  const [redirectCount, setRedirectCount] = useState(3);
  const [videoError, setVideoError] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const yearRef = useRef(null);

  // Detect location via IP on mount
  useEffect(() => {
    const detectIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country_code;
          if (countryCode && countryData[countryCode]) {
            setSelectedCountry(countryCode);
            if (countryCode === "MX") {
              setLang("es");
            } else {
              setLang("en");
            }
          } else {
            setSelectedCountry("ROW");
            setLang("en");
          }
        }
      } catch (err) {
        // Fallback to browser language
        const browserLang = navigator.language || "";
        if (browserLang.toLowerCase().includes("es")) {
          setSelectedCountry("MX");
          setLang("es");
        } else {
          setSelectedCountry("US");
          setLang("en");
        }
      }
    };
    detectIP();
  }, [setLang]);

  // Disable body scroll when age gate is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle countdown when underage
  useEffect(() => {
    if (isUnderage && redirectCount > 0) {
      const timer = setTimeout(() => {
        setRedirectCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isUnderage && redirectCount === 0) {
      const redirectUrl = countryData[selectedCountry]?.redirect || "https://www.iard.org/";
      window.location.href = redirectUrl;
    }
  }, [isUnderage, redirectCount, selectedCountry]);

  const handleYearInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setYear(val);
    setError("");
  };

  const handleValidate = (e) => {
    e.preventDefault();
    if (!year) {
      setError(
        lang === "es"
          ? "Por favor, introduce tu año de nacimiento."
          : "Please enter your year of birth."
      );
      return;
    }

    const yVal = parseInt(year);
    const currentYear = new Date().getFullYear();

    if (isNaN(yVal) || yVal < (currentYear - 110) || yVal > currentYear) {
      setError(lang === "es" ? "Año no válido." : "Invalid year.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - yVal;

    const requiredAge = countryData[selectedCountry]?.age || 18;

    if (age >= requiredAge) {
      // Access allowed
      if (rememberMe) {
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem(
          "casa_loy_age_verified",
          JSON.stringify({ verified: true, expiresAt })
        );
      } else {
        sessionStorage.setItem("casa_loy_age_verified_session", "true");
      }
      onVerify();
    } else {
      // Underage
      setIsUnderage(true);
    }
  };

  const countryName = lang === "es"
    ? countryData[selectedCountry]?.nameEs
    : countryData[selectedCountry]?.nameEn;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden select-none flex items-center justify-center"
      style={{
        backgroundColor: "#fcf9f3",
        backgroundImage: "linear-gradient(to bottom, rgba(252, 249, 243, 0.94), rgba(252, 249, 243, 0.96)), url('/Tahona Agave Molienda.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .copper-metallic-btn {
          position: relative;
          overflow: hidden;
          background: transparent;
          color: #8C4723;
          border: 1px solid rgba(140, 71, 35, 0.45);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(140, 71, 35, 0.05);
        }
        .copper-metallic-btn:hover {
          background: linear-gradient(135deg, #8c4723 0%, #b86e42 25%, #d89c74 50%, #a85c32 75%, #8c4723 100%);
          background-size: 200% auto;
          color: #fcf9f3;
          border-color: #8c4723;
          box-shadow: 0 6px 20px rgba(140, 71, 35, 0.25);
          transform: translateY(-1px);
        }
        .copper-metallic-btn:hover {
          background-position: right center;
        }
        .copper-metallic-btn:active {
          transform: translateY(1px);
        }
        .copper-metallic-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 30%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          transition: all 0.8s ease;
          opacity: 0;
        }
        .copper-metallic-btn:hover::after {
          opacity: 1;
          left: 130%;
        }
        @media (max-height: 680px) {
          .age-gate-logo {
            height: 90px !important;
          }
          .age-gate-container {
            gap: 12px !important;
          }
          .age-gate-form {
            gap: 12px !important;
          }
          .age-gate-title {
            font-size: 19px !important;
          }
          .age-gate-subtitle {
            font-size: 10px !important;
          }
          .logo-box {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
        }
        @media (max-height: 560px) {
          .age-gate-logo {
            height: 75px !important;
          }
          .age-gate-container {
            gap: 8px !important;
          }
          .age-gate-form {
            gap: 8px !important;
          }
          .age-gate-title {
            font-size: 16px !important;
          }
          .age-gate-subtitle {
            font-size: 9px !important;
          }
          .age-gate-footer {
            margin-top: 4px !important;
            padding-top: 8px !important;
          }
          .logo-box {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
        }
      ` }} />

      {/* LEFT PANEL / DOOR */}
      <motion.div
        variants={{
          initial: { x: 0 },
          animate: { x: 0 },
          exit: { x: "-100%", transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1] } }
        }}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-[#fcf9f3] z-10 border-r border-[#C8A86B]/20"
      >
        <div className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              poster="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
              onError={() => setVideoError(true)}
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-a-field-of-blue-agave-34241-large.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              alt="Campos de Agave"
              src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[#fcf9f3]/90 backdrop-blur-[1px]" />
          {/* Handmade paper agave fiber watermark texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-multiply bg-cover bg-center"
            style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
          />
          {/* Subtle shadow on the split edge */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent" />
        </div>
      </motion.div>

      {/* RIGHT PANEL / DOOR */}
      <motion.div
        variants={{
          initial: { x: 0 },
          animate: { x: 0 },
          exit: { x: "100%", transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1] } }
        }}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-[#fcf9f3] z-10 border-l border-[#C8A86B]/20"
      >
        <div className="absolute top-0 right-0 w-[100vw] h-full pointer-events-none" style={{ left: "-50vw" }}>
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              poster="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
              onError={() => setVideoError(true)}
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-a-field-of-blue-agave-34241-large.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              alt="Campos de Agave"
              src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[#fcf9f3]/90 backdrop-blur-[1px]" />
          {/* Handmade paper agave fiber watermark texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-multiply bg-cover bg-center"
            style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
          />
          {/* Subtle shadow on the split edge */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent" />
        </div>
      </motion.div>

      {/* CONTENT INTERFACE (Single Block, No Scroll) */}
      <div className="relative z-10 w-full h-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[760px] flex flex-col items-center gap-y-4 sm:gap-y-5 md:gap-y-6 text-center age-gate-container">
          <AnimatePresence mode="wait">
            {!isUnderage ? (
              <motion.div
                key="verification-content"
                variants={{
                  initial: { opacity: 0, y: 15 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1],
                      staggerChildren: 0.15
                    }
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.8, ease: "easeInOut" }
                  }
                }}
                className="w-full flex flex-col items-center gap-y-4 sm:gap-y-5 text-center text-[#1c1c18]"
              >
                {/* Logo with top spacing and bottom padding */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="w-full flex justify-center pt-3 pb-3 sm:pt-5 sm:pb-4 logo-box"
                >
                  <img
                    alt="Logo Casa Loy Tequilera"
                    className="h-[120px] sm:h-[140px] md:h-[160px] w-auto object-contain age-gate-logo"
                    src="/Logotipo Casa Loy Tequilera.png"
                  />
                </motion.div>

                {/* Language Selector */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="flex items-center gap-4 text-[10.5px] tracking-[0.25em] font-bold text-[#1c1c18]"
                >
                  <button
                    type="button"
                    onClick={() => setLang("es")}
                    className={`transition-all duration-300 hover:text-[#1c1c18] cursor-pointer ${lang === "es"
                        ? "text-[#8C4723] font-bold text-[11px]"
                        : "hover:text-[#1c1c18]/80"
                      }`}
                  >
                    ESPAÑOL
                  </button>
                  <span className="opacity-35 text-[#1c1c18]">|</span>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`transition-all duration-300 hover:text-[#1c1c18] cursor-pointer ${lang === "en"
                        ? "text-[#8C4723] font-bold text-[11px]"
                        : "hover:text-[#1c1c18]/80"
                      }`}
                  >
                    ENGLISH
                  </button>
                </motion.div>

                {/* Editorial Titles */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="space-y-2.5 sm:space-y-3 max-w-[90vw] md:max-w-none"
                >
                  <h1
                    style={{ fontFamily: "'EB Garamond', serif" }}
                    className="text-[21px] sm:text-[25px] md:text-[29px] text-[#1c1c18] font-medium tracking-[0.06em] uppercase leading-tight italic whitespace-normal md:whitespace-nowrap age-gate-title"
                  >
                    {lang === "es" ? "El legado se disfruta con el tiempo" : "The legacy is savored with time"}
                  </h1>
                  <p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[11px] sm:text-[12.5px] text-[#1c1c18] leading-relaxed font-semibold max-w-[90vw] md:max-w-none mx-auto tracking-[0.2em] uppercase whitespace-normal md:whitespace-nowrap age-gate-subtitle"
                  >
                    {lang === "es"
                      ? "Desde el corazón del Ayotlán, hasta los momentos que trascienden generaciones"
                      : "From the heart of Ayotlán, to the moments that transcend generations"}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                    <span className="text-[8px] text-[#C8A86B]">◆</span>
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                  </div>
                </motion.div>

                {/* Validation Form */}
                <motion.form
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  onSubmit={handleValidate}
                  className="w-full flex flex-col gap-4 sm:gap-5 max-w-[320px] mt-1 relative z-30 age-gate-form"
                >
                  {/* Custom Country Selector */}
                  <div className="relative w-full z-40">
                    <button
                      type="button"
                      onClick={() => setShowCountryList(!showCountryList)}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="w-full flex items-center justify-between bg-transparent border-b border-[#C8A86B]/30 hover:border-[#8C4723]/50 py-2.5 text-[11px] font-medium text-[#1c1c18] transition-all duration-300 outline-none"
                    >
                      <span className="tracking-[0.15em] uppercase text-left flex items-center gap-1.5">
                        {lang === "es" ? "Elige tu país: " : "Choose your country: "}
                        <span className="text-[#8C4723] font-bold ml-1 flex items-center gap-2">
                          {renderFlag(selectedCountry)}
                          <span>{countryName}</span>
                        </span>
                      </span>
                      <span
                        className="material-symbols-outlined text-[13px] text-[#C8A86B] transition-transform duration-300"
                        style={{ transform: showCountryList ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        expand_more
                      </span>
                    </button>

                    <AnimatePresence>
                      {showCountryList && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute left-0 right-0 mt-1 max-h-[140px] overflow-y-auto bg-[#fcf9f3] border border-[#1c1c18]/15 shadow-xl z-50 text-left backdrop-blur-md"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {Object.entries(countryData).map(([code, c]) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(code);
                                setShowCountryList(false);
                              }}
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                              className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold tracking-wider hover:bg-[#8C4723]/10 transition-colors uppercase flex items-center gap-2.5 ${selectedCountry === code ? "text-[#8C4723] font-bold bg-[#8C4723]/5" : "text-[#1c1c18]"
                                }`}
                            >
                              {renderFlag(code)}
                              <span>{lang === "es" ? c.nameEs : c.nameEn}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date Inputs */}
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <p
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[11px] sm:text-[12.5px] text-[#1c1c18] leading-relaxed font-bold uppercase tracking-[0.15em] mb-1.5 whitespace-nowrap"
                    >
                      {lang === "es"
                        ? "POR FAVOR Introduce tu año de nacimiento"
                        : "PLEASE Enter your year of birth"}
                    </p>

                    <div className="flex justify-center items-center">
                      {/* Year Input only */}
                      <div className="flex flex-col items-center">
                        <input
                          ref={yearRef}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          value={year}
                          onChange={handleYearInput}
                          placeholder="YYYY"
                          className="w-24 bg-transparent border-b-2 border-[#1c1c18]/50 focus:border-[#C8A86B] text-center text-xl sm:text-2xl font-bold text-[#1c1c18] outline-none py-1 transition-colors tracking-widest placeholder-[#1c1c18]/30 font-mono"
                        />
                        <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] tracking-[0.15em] text-[#1c1c18]/85 uppercase font-bold mt-1.5">
                          {lang === "es" ? "Año" : "Year"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Error Label */}
                  {error && (
                    <div
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[9px] text-[#ba1a1a] tracking-wider uppercase font-medium -mt-2 animate-pulse"
                    >
                      {error}
                    </div>
                  )}

                  {/* Checkbox */}
                  <div className="flex items-center justify-center select-none py-0.5 z-10">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div className="w-[14px] h-[14px] border border-[#1c1c18]/45 group-hover:border-[#C8A86B]/60 rounded-sm transition-all duration-300 flex items-center justify-center bg-white/40">
                          {rememberMe && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="material-symbols-outlined text-[10px] text-[#8C4723] font-bold"
                            >
                              check
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <span
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[11px] font-bold text-[#1c1c18] transition-colors select-none tracking-wider uppercase"
                      >
                        {lang === "es"
                          ? "Recordar mi acceso"
                          : "Remember my access"}
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="copper-metallic-btn w-full active:scale-[0.98] font-bold text-[11px] tracking-[0.3em] py-3.5 px-6 transition-all duration-500 uppercase cursor-pointer select-none focus:outline-none"
                  >
                    {lang === "es" ? "Entrar" : "Enter"}
                  </button>
                </motion.form>

                {/* Bottom Footer Section */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="w-full border-t border-[#1c1c18]/20 pt-4 mt-1 flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center age-gate-footer"
                >
                  <span
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[10px] tracking-[0.2em] font-bold text-[#1c1c18]/85 uppercase whitespace-nowrap"
                  >
                    {selectedCountry === "MX"
                      ? "Evita el exceso."
                      : "Please drink responsibly."}
                  </span>

                  <span className="text-[#1c1c18]/40 hidden min-[380px]:inline">|</span>

                  <button
                    type="button"
                    onClick={() => setShowPrivacyPopup(true)}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[10px] tracking-[0.1em] font-bold text-[#1c1c18]/85 hover:text-[#8C4723] transition-colors uppercase border-b border-transparent hover:border-[#8C4723]/30 whitespace-nowrap cursor-pointer focus:outline-none"
                  >
                    {lang === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              /* Underage Screen */
              <motion.div
                key="underage-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center gap-y-6 text-center text-[#1c1c18] px-4"
              >
                {/* Elegant SVG Custom Lock */}
                <svg className="w-16 h-16 text-[#8C4723] mb-2 drop-shadow-sm" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Lock Shackle */}
                  <path d="M18 28V18C18 10.268 24.268 4 32 4C39.732 4 46 10.268 46 18V28" stroke="#C8A86B" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Lock Body */}
                  <rect x="10" y="26" width="44" height="34" rx="4" fill="#F6F2EA" stroke="#8C4723" strokeWidth="2.5" />
                  {/* Keyhole details */}
                  <circle cx="32" cy="40" r="4" fill="#8C4723" />
                  <path d="M30 43.5L34 43.5L35 50L29 50Z" fill="#8C4723" />
                  {/* Outer decorative gold diamond overlay */}
                  <path d="M32 30L34 32L32 34L30 32Z" fill="#C8A86B" />
                </svg>

                <div className="space-y-4 max-w-[650px] flex flex-col items-center">
                  <h2
                    style={{ fontFamily: "'EB Garamond', serif" }}
                    className="text-3xl sm:text-4xl text-[#5C1D24] font-medium tracking-[0.25em] uppercase"
                  >
                    {lang === "es" ? "Acceso restringido" : "Access Restricted"}
                  </h2>

                  <div className="flex items-center justify-center gap-3 my-2">
                    <div className="w-10 h-[0.5px] bg-[#C8A86B]/30" />
                    <span className="text-[10px] text-[#C8A86B]">◆</span>
                    <div className="w-10 h-[0.5px] bg-[#C8A86B]/30" />
                  </div>

                  <p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[13.5px] sm:text-[15px] text-[#1c1c18] font-semibold leading-relaxed tracking-wide"
                  >
                    {lang === "es"
                      ? "Casa Loy Tequilera es una experiencia reservada exclusivamente para mayores de edad conforme a la legislación de su país o región."
                      : "Casa Loy Tequilera is an experience reserved exclusively for adults in accordance with the legislation of their country or region."}
                  </p>

                  <p
                    style={{ fontFamily: "'EB Garamond', serif" }}
                    className="text-lg sm:text-xl text-[#8C4723] font-medium italic tracking-wider pt-2"
                  >
                    {lang === "es"
                      ? "Promovemos el consumo responsable y consciente."
                      : "We promote responsible and conscious consumption."}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 mt-4">
                  <a
                    href={countryData[selectedCountry]?.redirect || "https://www.iard.org/"}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="px-10 py-4 bg-[#8C4723] hover:bg-[#2F403E] text-[#fcf9f3] text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase rounded-[2px] shadow-[0_4px_16px_rgba(140,71,35,0.15)] hover:shadow-[0_6px_24px_rgba(47,64,62,0.25)] transition-all duration-500 hover:-translate-y-[1px] active:translate-y-0 cursor-pointer select-none inline-block"
                  >
                    {lang === "es" ? "Consumo Responsable" : "Responsible Consumption"}
                  </a>

                  <div className="flex items-center justify-center gap-2.5 mt-2">
                    {redirectCount > 0 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8C4723] animate-ping" />
                    )}
                    <span
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#1c1c18]/55 uppercase font-medium"
                    >
                      {lang === "es"
                        ? "Casa Loy Tequilera - Redireccionando..."
                        : "Casa Loy Tequilera - Redirecting..."}{" "}
                      {redirectCount > 0 && (
                        <span className="text-[#8C4723] font-bold ml-1">{redirectCount}</span>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Privacy Policy Popup Modal */}
      <AnimatePresence>
        {showPrivacyPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#fcf9f3] w-full max-w-[620px] max-h-[85vh] overflow-hidden rounded-[3px] border border-[#C8A86B]/20 p-6 sm:p-8 relative shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowPrivacyPopup(false)}
                className="absolute top-4 right-4 text-[#1c1c18]/60 hover:text-[#8C4723] transition-colors cursor-pointer focus:outline-none flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">close</span>
              </button>

              {/* Agave fiber background inside the modal */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-cover bg-center rounded-[3px]"
                style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
              />

              {/* Scrollable Content */}
              <div className="relative z-10 overflow-y-auto pr-2 select-text space-y-6 text-[#1c1c18] flex-1 text-left" style={{ scrollbarWidth: "thin" }}>
                <span className="font-sans text-[9px] text-[#8C4723] tracking-[0.3em] uppercase block font-bold">
                  CASA LOY TEQUILERA
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight border-b border-[#C8A86B]/25 pb-3 -mt-1">
                  {lang === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
                </h2>

                <div className="space-y-4 font-sans text-[11.5px] sm:text-[12.5px] text-[#1c1c18]/90 leading-relaxed">
                  {lang === "es" ? (
                    <>
                      <p>
                        En <strong>Casa Loy Tequilera</strong>, valoramos su privacidad y nos comprometemos a proteger sus datos personales de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        1. Responsable del Tratamiento
                      </h3>
                      <p>
                        Casa Loy Tequilera es el único responsable de la recolección, uso, almacenamiento y protección de los datos personales proporcionados por nuestros clientes, aliados estratégicos, distribuidores, visitantes y usuarios del sitio web.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        2. Datos Personales Recabados
                      </h3>
                      <p>
                        Para dar cumplimiento a los servicios solicitados y mantener una comunicación directa, podemos recabar los siguientes datos: nombre completo, correo electrónico, número de teléfono (incluido WhatsApp), dirección de facturación o envío, información de perfil profesional (para procesos de selección) e información relacionada con reservas para nuestras experiencias de turismo y Restaurante 1937 Nativo.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        3. Finalidades del Tratamiento
                      </h3>
                      <p>
                        Los datos personales recabados serán utilizados de manera confidencial para las siguientes finalidades esenciales:
                      </p>
                      <ul className="list-disc pl-4 space-y-1.5">
                        <li>Atender solicitudes de información técnica, comercial o B2B de desarrollo de marca propia (Maquila).</li>
                        <li>Gestionar reservas para nuestras visitas de turismo destilado y el Restaurante 1937 Nativo.</li>
                        <li>Enviar boletines comerciales, oportunidades de negocio e invitaciones a lanzamientos exclusivos si decide suscribirse a nuestra comunidad.</li>
                        <li>Evaluar perfiles para vacantes profesionales dentro de nuestra destilería.</li>
                      </ul>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        4. Derechos ARCO
                      </h3>
                      <p>
                        Usted tiene derecho en cualquier momento a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer sus derechos ARCO, puede enviar una solicitud formal por escrito a nuestro correo institucional: <a href="mailto:hola@casaloy.com" className="text-[#8C4723] hover:underline font-bold">hola@casaloy.com</a>.
                      </p>
                      <p className="pt-4 text-[10px] text-[#1c1c18]/50 border-t border-[#1c1c18]/10">
                        Última actualización: Junio 2026. Casa Loy Tequilera se reserva el derecho de actualizar este aviso en cualquier momento.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        At <strong>Casa Loy Tequilera</strong>, we value your privacy and commit to protecting your personal data in accordance with the Federal Law on Protection of Personal Data Held by Private Parties.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        1. Data Controller
                      </h3>
                      <p>
                        Casa Loy Tequilera is solely responsible for the collection, use, storage, and protection of personal data provided by our clients, strategic partners, distributors, visitors, and website users.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        2. Personal Data Collected
                      </h3>
                      <p>
                        To comply with requested services and maintain direct communication, we may collect the following data: full name, email address, phone number (including WhatsApp), billing or shipping address, professional profile information (for recruitment processes), and booking-related information for our tourism experiences and Restaurante 1937 Nativo.
                      </p>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        3. Purposes of Processing
                      </h3>
                      <p>
                        The collected personal data will be used confidentially for the following essential purposes:
                      </p>
                      <ul className="list-disc pl-4 space-y-1.5">
                        <li>Handle B2B requests for technical, commercial, or private label development information (Bottling).</li>
                        <li>Manage bookings for our distillery tours and Restaurante 1937 Nativo.</li>
                        <li>Send newsletters, business opportunities, and invitations to exclusive launches if you choose to join our community.</li>
                        <li>Evaluate profiles for career opportunities within our distillery.</li>
                      </ul>
                      <h3 className="font-serif text-[14px] font-bold text-[#1c1c18] pt-2">
                        4. ARCO Rights
                      </h3>
                      <p>
                        You have the right at any time to Access, Rectify, Cancel, or Oppose the processing of your personal data. To exercise your ARCO rights, you may send a formal written request to our corporate email: <a href="mailto:hola@casaloy.com" className="text-[#8C4723] hover:underline font-bold">hola@casaloy.com</a>.
                      </p>
                      <p className="pt-4 text-[10px] text-[#1c1c18]/50 border-t border-[#1c1c18]/10">
                        Last updated: June 2026. Casa Loy Tequilera reserves the right to update this policy at any time.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Refined Close Button at the bottom */}
              <div className="relative z-10 pt-4 mt-4 border-t border-[#C8A86B]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrivacyPopup(false)}
                  className="copper-metallic-btn text-[10px] tracking-[0.2em] font-bold py-2.5 px-6 uppercase cursor-pointer focus:outline-none"
                >
                  {lang === "es" ? "Cerrar" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
