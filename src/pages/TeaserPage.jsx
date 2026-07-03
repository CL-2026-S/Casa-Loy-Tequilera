import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeaserPage({ onUnlock }) {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Auto-reset click count if inactive for 3 seconds
  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 5) {
      setShowPasswordModal(true);
      setClickCount(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPassword = password.trim().toLowerCase();
    if (cleanPassword === "casaloy2026" || cleanPassword === "admin" || cleanPassword === "preview") {
      onUnlock();
    } else {
      setError("Código incorrecto");
      // Clear error after 2 seconds
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 text-[#1c1c18] overflow-hidden select-none bg-[#fcf9f3]"
    >
      {/* Background Image Watermark (Quiet Luxury & Agave) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-luminosity bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/Campo de Agave Ayotlán Casa Loy Tequilera.webp')"
        }}
      ></div>

      {/* Subtle Radial Gradient overlay to blur borders and create soft light in the center */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 20%, rgba(229, 235, 232, 0.4) 70%, rgba(220, 228, 224, 0.7) 100%)"
        }}
      ></div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center max-w-lg w-full text-center z-10">
        
        {/* Logo Container with Soft Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="cursor-pointer group relative mb-10 sm:mb-14 select-none"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Extremely subtle warm glow on logo hover */}
          <div className="absolute -inset-6 bg-[#8C4723]/3 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
          
          <img
            src="/Logotipo Casa Loy Tequilera.png"
            alt="Logotipo Casa Loy Tequilera"
            className="h-[140px] sm:h-[180px] md:h-[200px] w-auto object-contain transition-all duration-500"
            draggable="false"
          />
        </motion.div>

        {/* Separator Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "60px", opacity: 0.25 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
          className="h-[1px] bg-[#8C4723] mb-8 sm:mb-10"
        />

        {/* Revealing Phrase */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 px-4"
        >
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl tracking-[0.06em] font-light text-[#1c1c18] font-serif italic leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Algo extraordinario está por revelarse.
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#1c1c18]/50 font-sans mt-4">
            Casa Loy Tequilera • Próximamente
          </p>
        </motion.div>
      </div>

      {/* Secret Password Modal Overlay */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.97, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#fcf9f3] border border-[#8C4723]/15 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_20px_50px_rgba(28,28,24,0.12)] text-[#1c1c18]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setError("");
                }}
                className="absolute top-4 right-4 text-[#1c1c18]/40 hover:text-[#1c1c18] transition-colors duration-250 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8C4723]/8 text-[#8C4723] mb-3">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <h3 className="text-lg font-serif tracking-wider text-[#1c1c18]">
                  Modo de Pruebas
                </h3>
                <p className="text-xs text-[#1c1c18]/50 mt-1 font-sans">
                  Ingrese el código de acceso para desbloquear el sitio.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Código de acceso"
                    className="w-full bg-[#F6F2EA] border border-[#8C4723]/20 rounded px-4 py-2.5 text-center text-sm text-[#1c1c18] placeholder-[#1c1c18]/30 focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] transition-all duration-300 font-sans"
                    autoFocus
                  />
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 text-center font-sans font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-[#8C4723] hover:bg-[#723618] active:bg-[#5a2a12] text-white rounded py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(140,71,35,0.12)] focus:outline-none"
                >
                  Acceder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiny Admin Indicator at the bottom, very subtle and blend-in */}
      <div className="absolute bottom-4 text-[9px] tracking-[0.3em] uppercase text-[#1c1c18]/25 select-none font-sans">
        Casa Loy Tequilera v1.0
      </div>
    </div>
  );
}
