import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { translations } from "./data/translations";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import AgeGatePremium from "./components/AgeGatePremium";

// Pages
import Home from "./pages/Home";
import HomeEditorialV2 from "./pages/HomeEditorialV2";
import HomeInteractive from "./pages/HomeInteractive";
import AboutUs from "./pages/AboutUs";
import Maquilas from "./pages/Maquilas";
import Brands from "./pages/Brands";
import Turismo from "./pages/Turismo";
import Nativo1937 from "./pages/Nativo1937";
import WhereToBuy from "./pages/WhereToBuy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsConditions from "./pages/TermsConditions";
import TeaserPage from "./pages/TeaserPage";

export default function App() {
  const [hasBypass, setHasBypass] = useState(() => {
    return localStorage.getItem("casa_loy_preview_bypass") === "true";
  });
  const [lang, setLang] = useState("es"); // Default language set to Spanish (ES)
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    if (path === "/editorial-preview" || path === "/editorial-preview/") {
      return "editorial-preview";
    }
    if (path === "/privacy-policy" || path === "/privacy-policy/") {
      return "privacy";
    }
    return "home";
  }); // Navigation routing state

  const [ageVerified, setAgeVerified] = useState(() => {
    // Check if session verified in localStorage (expires in 30 days)
    const savedSession = localStorage.getItem("casa_loy_age_verified");
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.verified && Date.now() < sessionData.expiresAt) {
          return true;
        } else {
          localStorage.removeItem("casa_loy_age_verified");
        }
      } catch (e) {
        localStorage.removeItem("casa_loy_age_verified");
      }
    }
    // Check session-only verified state
    const sessionOnly = sessionStorage.getItem("casa_loy_age_verified_session");
    if (sessionOnly === "true") {
      return true;
    }
    return false;
  });

  const t = translations[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true" || params.get("test") === "true" || params.get("bypass") === "true") {
      localStorage.setItem("casa_loy_preview_bypass", "true");
      setHasBypass(true);
      const url = new URL(window.location);
      url.searchParams.delete("preview");
      url.searchParams.delete("test");
      url.searchParams.delete("bypass");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } else if (params.get("lock") === "true") {
      localStorage.removeItem("casa_loy_preview_bypass");
      setHasBypass(false);
      const url = new URL(window.location);
      url.searchParams.delete("lock");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, []);

  if (!hasBypass) {
    return (
      <TeaserPage
        onUnlock={() => {
          localStorage.setItem("casa_loy_preview_bypass", "true");
          setHasBypass(true);
        }}
      />
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (page === "editorial-preview") {
      window.history.pushState({}, "", "/editorial-preview");
    } else if (page === "privacy") {
      window.history.pushState({}, "", "/privacy-policy");
    } else {
      // Clear path back to root for other state-routed pages
      window.history.pushState({}, "", "/");
    }
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomeEditorialV2 lang={lang} setPage={setPage} setLang={setLang} />;
      case "editorial-preview":
        return <HomeEditorialV2 lang={lang} setPage={setPage} setLang={setLang} />;
      case "home-interactive":
        return <HomeInteractive lang={lang} setPage={setPage} />;
      case "about":
        return <AboutUs t={t} lang={lang} setPage={setPage} />;
      case "maquilas":
        return <Maquilas t={t} lang={lang} />;
      case "brands":
        return <Brands t={t} lang={lang} />;
      case "turismo":
        return <Turismo t={t} lang={lang} />;
      case "nativo":
        return <Nativo1937 t={t} lang={lang} />;
      case "where-to-buy":
        return <WhereToBuy t={t} lang={lang} />;
      case "blog":
        return <Blog setPage={setPage} t={t} lang={lang} />;
      case "blog-post":
        return <BlogPost lang={lang} setPage={setPage} />;
      case "careers":
        return <Careers lang={lang} setPage={setPage} />;
      case "career-detail":
        return <CareerDetail lang={lang} setPage={setPage} />;
      case "privacy":
        return <PrivacyPolicy t={t} lang={lang} />;
      case "cookies":
        return <CookiePolicy t={t} lang={lang} />;
      case "terms":
        return <TermsConditions t={t} lang={lang} />;
      default:
        return <Home t={t} setPage={setPage} lang={lang} />;
    }
  };

  const shouldShowAgeGate = !ageVerified && page !== "privacy";

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18] font-body-md overflow-x-hidden antialiased select-none relative">
      <AnimatePresence>
        {shouldShowAgeGate && (
          <AgeGatePremium
            onVerify={() => setAgeVerified(true)}
            lang={lang}
            setLang={setLang}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Header / Navigation */}
      <Header lang={lang} setLang={setLang} t={t} page={page} setPage={setPage} />
      
      <main className="min-h-screen">
        {renderPage()}
      </main>

      {/* Modern Watermarked Footer */}
      <Footer lang={lang} t={t} setPage={setPage} />

      {/* Global Newsletter Popup */}
      <NewsletterPopup lang={lang} />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5213332504359?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20de%20Casa%20Loy%20Tequilera."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-40 bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-[#2F403E] text-white hover:bg-[#25D366] transition-all duration-300 shadow-[0_4px_16px_rgba(47,64,62,0.2)] hover:shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C4723] cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
        </svg>
      </a>
    </div>
  );
}
