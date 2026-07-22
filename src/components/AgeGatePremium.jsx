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
        const response = await fetch("/api/cms?type=detect-location");
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country ? data.country.toUpperCase() : null;
          
          if (countryCode) {
            const spanishSpeakingCountries = ["MX", "ES", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR"];
            const isSpanishSpeaking = spanishSpeakingCountries.includes(countryCode);
            
            // Set language based on country region/language list
            if (isSpanishSpeaking) {
              setLang("es");
            } else {
              setLang("en");
            }

            // Set age gate region matching countryData or fallback to ROW
            if (countryData[countryCode]) {
              setSelectedCountry(countryCode);
            } else {
              setSelectedCountry("ROW");
            }
          } else {
            setSelectedCountry("ROW");
            setLang("en");
          }
        } else {
          throw new Error("Location API response not OK");
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
    : countryData[selectedCountry]?.nameE  // Framer Motion variants for cinematic fade, zoom and blur transition
  const pageVariants = {
    initial: { 
      opacity: 0,
      scale: 1.02
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" } 
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(12px)",
      transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[9999] overflow-hidden select-none flex items-center justify-center bg-black"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .copper-metallic-btn {
          position: relative;
          overflow: hidden;
          background: transparent;
          color: #fcf9f3;
          border: 1px solid rgba(252, 249, 243, 0.4);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .copper-metallic-btn:hover {
          background: linear-gradient(135deg, #8c4723 0%, #b86e42 25%, #d89c74 50%, #a85c32 75%, #8c4723 100%);
          background-size: 200% auto;
          color: #fcf9f3;
          border-color: #8c4723;
          box-shadow: 0 6px 20px rgba(140, 71, 35, 0.35);
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
      ` }} />

      {/* FULL-SCREEN BACKGROUND VIDEO ONLY */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {!videoError && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            src="/recorrido-campos-casa-loy.mp4"
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={() => setVideoError(true)}
          >
            <source
              src="/recorrido-campos-casa-loy.mp4"
              type="video/mp4"
            />
          </video>
        )}
        
        {/* Cinematic dark overlay with NO backdrop blur so the video is fully visible and sharp */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Handmade paper agave fiber watermark texture overlay for premium craft brand feel */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
        />
      </div>

      {/* Language Selector (Top Right) */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-50 flex items-center gap-4 text-[10px] tracking-[0.25em] font-bold text-[#fcf9f3]">
        <button
          type="button"
          onClick={() => setLang("es")}
          className={`transition-all duration-300 hover:text-[#C8A86B] cursor-pointer ${lang === "es"
              ? "text-[#C8A86B] font-bold text-[10.5px]"
              : "text-[#fcf9f3]/65"
            }`}
        >
          ESPAÑOL
        </button>
        <span className="opacity-30 text-[#fcf9f3]">|</span>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`transition-all duration-300 hover:text-[#C8A86B] cursor-pointer ${lang === "en"
              ? "text-[#C8A86B] font-bold text-[10.5px]"
              : "text-[#fcf9f3]/65"
            }`}
        >
          ENGLISH
        </button>
      </div>

      {/* INTERFACE CONTAINER (No card/borders, light text on dark video background) */}
      <div className="relative z-10 w-full h-full overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          {!isUnderage ? (
            <motion.div
              key="verification-content"
              variants={{
                initial: { opacity: 0, scale: 0.96, y: 15 },
                animate: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1]
                  }
                },
                exit: {
                  opacity: 0,
                  scale: 0.96,
                  y: -10,
                  transition: { duration: 0.5, ease: "easeInOut" }
                }
              }}
              className="w-full max-w-[540px] flex flex-col items-center gap-y-6 text-center text-[#fcf9f3] relative"
            >
              <div className="relative z-10 w-full flex flex-col items-center gap-y-5">
                {/* Logo (Color Blanco version for dark bg) */}
                <div className="w-full flex justify-center pb-1">
                  <img
                    alt="Logo Casa Loy Tequilera"
                    className="h-[80px] sm:h-[90px] md:h-[100px] w-auto object-contain age-gate-logo animate-fade-in"
                    src="/Logotipo Casa Loy Tequilera Color Blanco.png"
                  />
                </div>

                {/* Editorial Titles */}
                <div className="space-y-3 w-full flex flex-col items-center">
                  <p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] text-[#fcf9f3]/85 leading-relaxed font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase whitespace-nowrap"
                  >
                    {lang === "es"
                      ? "Desde el corazón de Ayotlán, hasta los momentos que trascienden generaciones"
                      : "From the heart of Ayotlán, to the moments that transcend generations"}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-0.5">
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                    <span className="text-[7px] text-[#C8A86B]">◆</span>
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                  </div>
                </div>

                {/* Validation Form */}
                <form
                  onSubmit={handleValidate}
                  className="w-full flex flex-col gap-4 max-w-[300px] mt-1 relative z-30"
                >
                  {/* Custom Country Selector */}
                  <div className="relative w-full z-40">
                    <button
                      type="button"
                      onClick={() => setShowCountryList(!showCountryList)}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="w-full flex items-center justify-between bg-transparent border-b border-[#C8A86B]/30 hover:border-[#C8A86B]/60 py-2 text-[10.5px] font-medium text-[#fcf9f3] transition-all duration-300 outline-none"
                    >
                      <span className="tracking-[0.15em] uppercase text-left flex items-center gap-1.5">
                        {lang === "es" ? "Elige tu país: " : "Choose your country: "}
                        <span className="text-[#C8A86B] font-bold ml-1 flex items-center gap-1.5">
                          {renderFlag(selectedCountry)}
                          <span>{countryName}</span>
                        </span>
                      </span>
                      <span
                        className="material-symbols-outlined text-[12px] text-[#C8A86B] transition-transform duration-300"
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
                          className="absolute left-0 right-0 mt-1 max-h-[140px] overflow-y-auto bg-[#fcf9f3] border border-[#1c1c18]/15 shadow-xl z-50 text-left rounded-md"
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
                              className={`w-full text-left px-4 py-2 text-[10.5px] font-semibold tracking-wider hover:bg-[#8C4723]/10 transition-colors uppercase flex items-center gap-2 ${selectedCountry === code ? "text-[#8C4723] font-bold bg-[#8C4723]/5" : "text-[#1c1c18]"
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
                      className="text-[10px] sm:text-[11px] text-[#fcf9f3] leading-relaxed font-bold uppercase tracking-[0.15em] mb-0.5 whitespace-nowrap"
                    >
                      {lang === "es"
                        ? "POR FAVOR Introduce tu año de nacimiento"
                        : "PLEASE Enter your year of birth"}
                    </p>

                    <div className="flex justify-center items-center">
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
                          className="w-24 bg-transparent border-b-2 border-[#fcf9f3]/40 focus:border-[#C8A86B] text-center text-lg sm:text-xl font-bold text-[#fcf9f3] outline-none py-1 transition-colors tracking-widest placeholder-[#fcf9f3]/35 font-mono"
                        />
                        <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[8.5px] tracking-[0.15em] text-[#fcf9f3]/70 uppercase font-bold mt-1">
                          {lang === "es" ? "Año" : "Year"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Error Label */}
                  {error && (
                    <div
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[8.5px] text-[#ba1a1a] tracking-wider uppercase font-medium -mt-2 animate-pulse"
                    >
                      {error}
                    </div>
                  )}

                  {/* Checkbox */}
                  <div className="flex items-center justify-center select-none py-0.5 z-10">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div className="w-[13px] h-[13px] border border-[#fcf9f3]/45 group-hover:border-[#C8A86B]/60 rounded-sm transition-all duration-300 flex items-center justify-center bg-white/10">
                          {rememberMe && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="material-symbols-outlined text-[9px] text-[#C8A86B] font-bold"
                            >
                              check
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <span
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[10px] font-bold text-[#fcf9f3] transition-colors select-none tracking-wider uppercase"
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
                    className="copper-metallic-btn w-full active:scale-[0.98] font-bold text-[10px] tracking-[0.3em] py-3 px-6 transition-all duration-500 uppercase cursor-pointer select-none focus:outline-none rounded-sm"
                  >
                    {lang === "es" ? "Entrar" : "Enter"}
                  </button>
                </form>

                {/* Bottom Footer Section */}
                <div className="w-full border-t border-[#fcf9f3]/15 pt-3 mt-1 flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
                  <span
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[9px] tracking-[0.2em] font-bold text-[#fcf9f3]/75 uppercase whitespace-nowrap"
                  >
                    {selectedCountry === "MX"
                      ? "Evita el exceso."
                      : "Please drink responsibly."}
                  </span>

                  <span className="text-[#fcf9f3]/30 hidden min-[360px]:inline">|</span>

                  <button
                    type="button"
                    onClick={() => setShowPrivacyPopup(true)}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[9px] tracking-[0.1em] font-bold text-[#fcf9f3]/75 hover:text-[#C8A86B] transition-colors uppercase border-b border-transparent hover:border-[#C8A86B]/30 whitespace-nowrap cursor-pointer focus:outline-none"
                  >
                    {lang === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Underage Screen */
            <motion.div
              key="underage-screen"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[480px] flex flex-col items-center gap-y-6 text-center text-[#fcf9f3] relative"
            >
              <div className="relative z-10 w-full flex flex-col items-center gap-y-5">
                <svg className="w-12 h-12 text-[#C8A86B] mb-1 drop-shadow-sm" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 28V18C18 10.268 24.268 4 32 4C39.732 4 46 10.268 46 18V28" stroke="#C8A86B" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="10" y="26" width="44" height="34" rx="4" fill="none" stroke="#C8A86B" strokeWidth="2.5" />
                  <circle cx="32" cy="40" r="4" fill="#C8A86B" />
                  <path d="M30 43.5L34 43.5L35 50L29 50Z" fill="#C8A86B" />
                  <path d="M32 30L34 32L32 34L30 32Z" fill="#C8A86B" />
                </svg>

                <div className="space-y-3 max-w-[420px] flex flex-col items-center">
                  <h2
                    style={{ fontFamily: "'EB Garamond', serif" }}
                    className="text-2xl sm:text-3xl text-[#C8A86B] font-medium tracking-[0.2em] uppercase leading-tight"
                  >
                    {lang === "es" ? "Acceso restringido" : "Access Restricted"}
                  </h2>

                  <div className="flex items-center justify-center gap-3 my-1">
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                    <span className="text-[8px] text-[#C8A86B]">◆</span>
                    <div className="w-8 h-[0.5px] bg-[#C8A86B]/30" />
                  </div>

                  <p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-[11.5px] sm:text-[12.5px] text-[#fcf9f3]/90 font-semibold leading-relaxed tracking-wide"
                  >
                    {lang === "es"
                      ? "Casa Loy Tequilera es una experience reservada exclusivamente para mayores de edad conforme a la legislación de su país o región."
                      : "Casa Loy Tequilera is an experience reserved exclusively for adults in accordance with the legislation of their country or region."}
                  </p>

                  <p
                    style={{ fontFamily: "'EB Garamond', serif" }}
                    className="text-base sm:text-lg text-[#C8A86B] font-medium italic tracking-wider pt-1"
                  >
                    {lang === "es"
                      ? "Promovemos el consumo responsable y consciente."
                      : "We promote responsible and conscious consumption."}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 mt-2">
                  <a
                    href={countryData[selectedCountry]?.redirect || "https://www.iard.org/"}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="px-8 py-3 bg-[#8C4723] hover:bg-[#b86e42] text-[#fcf9f3] text-[9.5px] font-bold tracking-[0.25em] uppercase rounded-[2px] shadow-[0_4px_12px_rgba(140,71,35,0.15)] transition-all duration-500 hover:-translate-y-[1px] active:translate-y-0 cursor-pointer select-none inline-block"
                  >
                    {lang === "es" ? "Consumo Responsable" : "Responsible Consumption"}
                  </a>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    {redirectCount > 0 && (
                      <div className="w-1.2 h-1.2 rounded-full bg-[#C8A86B] animate-ping" />
                    )}
                    <span
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-[8.5px] tracking-[0.15em] text-[#fcf9f3]/60 uppercase font-medium"
                    >
                      {lang === "es"
                        ? "Redireccionando..."
                        : "Redirecting..."}{" "}
                      {redirectCount > 0 && (
                        <span className="text-[#C8A86B] font-bold ml-1">{redirectCount}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
