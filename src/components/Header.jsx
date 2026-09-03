import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header({ lang, setLang, t, page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastPage, setLastPage] = useState(page);

  const getPath = (pageKey) => {
    const paths = {
      es: {
        home: "/",
        about: "/quienes-somos",
        maquilas: "/marca-propia",
        brands: "/marcas",
        turismo: "/turismo",
        nativo: "/nativo",
        "where-to-buy": "/donde-comprar"
      },
      en: {
        home: "/",
        about: "/about",
        maquilas: "/private-label",
        brands: "/brands",
        turismo: "/tourism",
        nativo: "/restaurant-nativo",
        "where-to-buy": "/where-to-buy"
      }
    };
    return (paths[lang] || paths.es)[pageKey] || "/";
  };

  if (page !== lastPage) {
    setLastPage(page);
    setScrolled(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkHeroPage = ["home", "home-interactive", "maquilas", "turismo", "nativo", "blog", "careers", "editorial-preview"].includes(page);

  const getLinkClass = (targetPage) => {
    const isActive = page === targetPage;
    const base = "font-navigation text-[clamp(9.5px,0.65vw,12px)] uppercase tracking-[0.1em] font-semibold relative transition-all duration-300 whitespace-nowrap py-1.5 group select-none cursor-pointer";
    
    if (isDarkHeroPage && !scrolled) {
      if (isActive) {
        return `${base} text-white font-bold`;
      }
      return `${base} text-white/85 hover:text-white`;
    }
    
    if (isActive) {
      return `${base} text-primary`;
    }
    
    return `${base} text-[#1c1c18] hover:text-primary`;
  };

  const getUnderlineClass = (targetPage) => {
    const isActive = page === targetPage;
    const base = "absolute bottom-0 left-0 w-full h-[1.5px] bg-current transform origin-left transition-transform duration-300";
    return isActive ? `${base} scale-x-100` : `${base} scale-x-0 group-hover:scale-x-100`;
  };

  return (
    <>
      <header
        className={`premium-header ${
          scrolled
            ? "header-scrolled"
            : (isDarkHeroPage ? "header-unscrolled-dark" : "header-unscrolled-light")
        }`}
      >
        {/* Mobile Navbar Layout */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex xl:hidden justify-between items-center w-full">
          {/* Mobile Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center h-full"
          >
            <img
              alt="Logo Casa Loy"
              className="h-12 w-auto object-contain transition-all duration-300"
              src={isDarkHeroPage && !scrolled ? "/Logotipo Casa Loy Tequilera Color Blanco.webp" : "/Logotipo Casa Loy Tequilera.webp"}
            />
          </Link>

          {/* Mobile Actions (Where to Buy and Hamburger) */}
          <div className="flex items-center gap-4">
            <Link
              to={getPath("where-to-buy")}
              className={`h-9 px-4 font-label-caps text-[10px] uppercase tracking-[0.15em] transition-all duration-300 shadow-sm font-semibold whitespace-nowrap text-center flex items-center justify-center rounded-none active:scale-[0.98] ${
                isDarkHeroPage && !scrolled
                  ? "bg-white text-[#1c1c18] hover:bg-primary hover:text-white"
                  : "bg-primary text-white hover:bg-[#914b27]"
              }`}
            >
              {t.nav.whereToBuy}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center p-1 rounded-sm hover:bg-surface-container-high/40 transition-colors"
            >
              <span className={`material-symbols-outlined text-2xl font-light transition-colors ${
                isDarkHeroPage && !scrolled ? "text-white" : "text-[#1c1c18]"
              }`}>
                menu
              </span>
            </button>
          </div>
        </div>

        {/* Desktop 8-Column Balanced Grid Layout */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full hidden xl:grid grid-cols-[1.3fr_1.1fr_1.4fr_1.1fr_1.1fr_1.8fr_0.8fr_1.4fr] gap-x-6 items-center justify-items-center">
          
          {/* Column 1: Logotipo Casa Loy */}
          <Link
            to="/"
            className="flex items-center justify-center hover:opacity-85 transition-opacity"
          >
            <img
              alt="Logo Casa Loy"
              className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-[58px]" : "h-[68px]"}`}
              src={isDarkHeroPage && !scrolled ? "/Logotipo Casa Loy Tequilera Color Blanco.webp" : "/Logotipo Casa Loy Tequilera.webp"}
            />
          </Link>

          {/* Column 2: Quiénes Somos */}
          <Link
            to={getPath("about")}
            className={getLinkClass("about")}
          >
            {t.nav.about}
            <span className={getUnderlineClass("about")} />
          </Link>

          {/* Column 3: Desarrolla tu Marca */}
          <Link
            to={getPath("maquilas")}
            className={getLinkClass("maquilas")}
          >
            {t.nav.bottling}
            <span className={getUnderlineClass("maquilas")} />
          </Link>

          {/* Column 4: Nuestras Marcas */}
          <Link
            to={getPath("brands")}
            className={getLinkClass("brands")}
          >
            {t.nav.brands}
            <span className={getUnderlineClass("brands")} />
          </Link>

          {/* Column 5: Experiencias */}
          <Link
            to={getPath("turismo")}
            className={getLinkClass("turismo")}
          >
            {t.nav.tourism}
            <span className={getUnderlineClass("turismo")} />
          </Link>

          {/* Column 6: Restaurante 1937 Nativo */}
          <Link
            to={getPath("nativo")}
            className={getLinkClass("nativo")}
          >
            {t.nav.nativo}
            <span className={getUnderlineClass("nativo")} />
          </Link>

          {/* Column 7: Selector de idioma ES / EN */}
          <div className="flex items-center gap-2 font-navigation text-[clamp(9.5px,0.65vw,12px)] tracking-widest font-semibold select-none whitespace-nowrap">
            <span
              onClick={() => setLang("es")}
              className={`cursor-pointer transition-all duration-300 relative py-1 group ${
                lang === "es"
                  ? (isDarkHeroPage && !scrolled ? "text-white font-bold" : "text-primary font-bold")
                  : (isDarkHeroPage && !scrolled ? "text-white/80 hover:text-white" : "text-[#1c1c18]/60 hover:text-primary")
              }`}
            >
              ES
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-current transform origin-left transition-transform duration-300 ${
                lang === "es" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </span>
            <span className={`transition-colors duration-300 ${isDarkHeroPage && !scrolled ? "text-white/40" : "text-[#1c1c18] opacity-20"}`}>|</span>
            <span
              onClick={() => setLang("en")}
              className={`cursor-pointer transition-all duration-300 relative py-1 group ${
                lang === "en"
                  ? (isDarkHeroPage && !scrolled ? "text-white font-bold" : "text-primary font-bold")
                  : (isDarkHeroPage && !scrolled ? "text-white/80 hover:text-white" : "text-[#1c1c18]/60 hover:text-primary")
              }`}
            >
              EN
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-current transform origin-left transition-transform duration-300 ${
                lang === "en" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </span>
          </div>

          {/* Column 8: Botón Dónde Comprar */}
          <Link
            to={getPath("where-to-buy")}
            className={`h-10 px-5 font-label-caps text-[clamp(9px,0.7vw,11px)] uppercase tracking-[0.18em] transition-all duration-300 shadow-sm font-semibold whitespace-nowrap text-center flex items-center justify-center rounded-none active:scale-[0.98] ${
              isDarkHeroPage && !scrolled
                ? "bg-white text-[#1c1c18] hover:bg-primary hover:text-white"
                : "bg-primary text-white hover:bg-[#914b27]"
            }`}
          >
            {t.nav.whereToBuy}
          </Link>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#fcf9f3] p-8 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-out transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <img
                  alt="Logo Casa Loy"
                  className="h-10 w-auto object-contain"
                  src="/Logotipo Casa Loy Tequilera.webp"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-high/40 text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl font-light">close</span>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-5 pt-8 text-left">
              <Link
                to={getPath("about")}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-navigation text-navigation text-left py-1 transition-colors duration-300 ${
                  page === "about" ? "text-primary font-semibold" : "text-[#1c1c18] hover:text-primary"
                }`}
              >
                {t.nav.about}
              </Link>
              <Link
                to={getPath("maquilas")}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-navigation text-navigation text-left py-1 transition-colors duration-300 ${
                  page === "maquilas" ? "text-primary font-semibold" : "text-[#1c1c18] hover:text-primary"
                }`}
              >
                {t.nav.bottling}
              </Link>
              <Link
                to={getPath("brands")}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-navigation text-navigation text-left py-1 transition-colors duration-300 ${
                  page === "brands" ? "text-primary font-semibold" : "text-[#1c1c18] hover:text-primary"
                }`}
              >
                {t.nav.brands}
              </Link>
              <Link
                to={getPath("turismo")}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-navigation text-navigation text-left py-1 transition-colors duration-300 ${
                  page === "turismo" ? "text-primary font-semibold" : "text-[#1c1c18] hover:text-primary"
                }`}
              >
                {t.nav.tourism}
              </Link>
              <Link
                to={getPath("nativo")}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-navigation text-navigation text-left py-1 transition-colors duration-300 ${
                  page === "nativo" ? "text-primary font-semibold" : "text-[#1c1c18] hover:text-primary"
                }`}
              >
                {t.nav.nativo}
              </Link>
            </nav>
          </div>

          {/* Drawer Bottom */}
          <div className="space-y-6 pt-8 border-t border-[#d9c2b6]/40">
            {/* Mobile Language Switches */}
            <div className="flex gap-6 items-center justify-center font-navigation text-[13px] tracking-widest font-semibold text-on-surface-variant select-none">
              <span
                onClick={() => {
                  setLang("es");
                  setMobileMenuOpen(false);
                }}
                className={`cursor-pointer transition-colors duration-300 ${
                  lang === "es" ? "text-primary font-bold" : "text-[#1c1c18]/60 hover:text-primary"
                }`}
              >
                ESPAÑOL
              </span>
              <span className="opacity-20 text-[#1c1c18]">|</span>
              <span
                onClick={() => {
                  setLang("en");
                  setMobileMenuOpen(false);
                }}
                className={`cursor-pointer transition-colors duration-300 ${
                  lang === "en" ? "text-primary font-bold" : "text-[#1c1c18]/60 hover:text-primary"
                }`}
              >
                ENGLISH
              </span>
            </div>
            <Link
              to={getPath("where-to-buy")}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-primary text-white py-4 font-label-caps text-[10px] uppercase tracking-[0.25em] transition-all duration-300 hover:bg-[#914b27] block text-center"
            >
              {t.nav.whereToBuy}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
