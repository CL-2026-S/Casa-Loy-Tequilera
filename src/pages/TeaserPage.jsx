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
      className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 text-white overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at center, rgba(140, 71, 35, 0.22) 0%, rgba(13, 28, 26, 1) 65%, rgba(8, 16, 15, 1) 100%)"
      }}
    >
      {/* Background Decorative Element: Subtle gold dust/stars particles floating (pure CSS) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center max-w-lg w-full text-center z-10">
        
        {/* Logo Container with Golden Hover Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="cursor-pointer group relative mb-12 sm:mb-16 select-none"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Subtle golden aura behind logo on hover */}
          <div className="absolute -inset-4 bg-[#8C4723]/0 rounded-full blur-xl group-hover:bg-[#8C4723]/10 transition-all duration-700"></div>
          
          <img
            src="/Logotipo Casa Loy Tequilera.png"
            alt="Logotipo Casa Loy Tequilera"
            className="h-[140px] sm:h-[180px] md:h-[200px] w-auto object-contain transition-all duration-500 drop-shadow-[0_4px_25px_rgba(140,71,35,0.25)]"
            draggable="false"
          />
        </motion.div>

        {/* Separator Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "80px", opacity: 0.4 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#8C4723] to-transparent mb-8 sm:mb-10"
        />

        {/* Revealing Phrase */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 px-4"
        >
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] font-light text-[#EDE7DE] font-serif italic"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Algo extraordinario está por revelarse.
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#EDE7DE]/40 font-sans mt-3">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0D1C1A] border border-[#8C4723]/30 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setError("");
                }}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors duration-250 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8C4723]/15 text-[#8C4723] mb-3">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <h3 className="text-lg font-serif tracking-wider text-[#EDE7DE]">
                  Modo de Pruebas
                </h3>
                <p className="text-xs text-white/40 mt-1">
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
                    className="w-full bg-[#132825] border border-[#8C4723]/20 rounded px-4 py-2.5 text-center text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] transition-all duration-300 font-sans"
                    autoFocus
                  />
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400 text-center font-sans font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-[#8C4723] hover:bg-[#a35329] active:bg-[#723618] text-white rounded py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(140,71,35,0.2)] focus:outline-none"
                >
                  Acceder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiny Admin Indicator at the bottom, very subtle and blend-in */}
      <div className="absolute bottom-4 text-[9px] tracking-[0.3em] uppercase text-white/10 select-none">
        Casa Loy Tequilera v1.0
      </div>
    </div>
  );
}
