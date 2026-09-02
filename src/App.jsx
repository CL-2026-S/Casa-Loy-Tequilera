import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { translations } from "./data/translations";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import AgeGatePremium from "./components/AgeGatePremium";
import SEO from "./components/SEO";

// Pages
import Home from "./pages/Home";
import HomeInteractive from "./pages/HomeInteractive";
import AboutUs from "./pages/AboutUs";
import Maquilas from "./pages/Maquilas";
import MaquilasV2 from "./pages/MaquilasV2";
import Brands from "./pages/Brands";
import Turismo from "./pages/Turismo";
import ExperienceDetail from "./pages/ExperienceDetail";
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
import ValidateTicket from "./pages/ValidateTicket";
import AdminPanel from "./pages/AdminPanel";

// Bilingual routing map
const routesMap = {
  // Spanish Paths (uniquely Spanish or shared with lang: null)
  "/": { page: "home", lang: null }, // Shared
  "/interactivo": { page: "home-interactive", lang: null }, // Shared
  "/quienes-somos": { page: "about", lang: "es" },
  "/marca-propia": { page: "maquilas", lang: "es" },
  "/maquilas": { page: "maquilas", lang: "es" },
  "/maquilas-v2": { page: "maquilas", lang: "es" },
  "/marcas": { page: "brands", lang: "es" },
  "/turismo": { page: "turismo", lang: "es" },
  "/turismo/oro": { page: "experience-oro", lang: "es" },
  "/turismo/platino": { page: "experience-platino", lang: "es" },
  "/turismo/diamante": { page: "experience-diamante", lang: "es" },
  "/nativo": { page: "nativo", lang: "es" },
  "/donde-comprar": { page: "where-to-buy", lang: "es" },
  "/blog": { page: "blog", lang: null }, // Shared
  "/bolsa-de-trabajo": { page: "careers", lang: "es" },
  "/politica-de-privacidad": { page: "privacy", lang: "es" },
  "/politica-de-cookies": { page: "cookies", lang: "es" },
  "/terminos-y-condiciones": { page: "terms", lang: "es" },
  "/validar-ticket": { page: "validate-ticket", lang: null }, // Shared
  "/panel": { page: "panel", lang: null }, // Shared
  "/editorial-preview": { page: "editorial-preview", lang: null }, // Shared

  // English Paths
  "/about": { page: "about", lang: "en" },
  "/about-us": { page: "about", lang: "en" },
  "/private-label": { page: "maquilas", lang: "en" },
  "/bottling": { page: "maquilas", lang: "en" },
  "/bottling-v2": { page: "maquilas", lang: "en" },
  "/brands": { page: "brands", lang: "en" },
  "/tourism": { page: "turismo", lang: "en" },
  "/tourism/gold": { page: "experience-oro", lang: "en" },
  "/tourism/platinum": { page: "experience-platino", lang: "en" },
  "/tourism/diamond": { page: "experience-diamante", lang: "en" },
  "/restaurant-nativo": { page: "nativo", lang: "en" },
  "/where-to-buy": { page: "where-to-buy", lang: "en" },
  "/careers": { page: "careers", lang: "en" },
  "/privacy-policy": { page: "privacy", lang: "en" },
  "/cookie-policy": { page: "cookies", lang: "en" },
  "/terms-and-conditions": { page: "terms", lang: "en" }
};

const getPageInfoFromPath = (pathname) => {
  if (routesMap[pathname]) {
    return routesMap[pathname];
  }
  if (pathname.startsWith("/blog/")) {
    return { page: "blog-post", lang: null }; // Shared
  }
  if (pathname.startsWith("/bolsa-de-trabajo/")) {
    return { page: "career-detail", lang: "es" };
  }
  if (pathname.startsWith("/careers/")) {
    return { page: "career-detail", lang: "en" };
  }
  return { page: "home", lang: null }; // Shared fallback
};

export default function App() {
  const [hasBypass, setHasBypass] = useState(true); // Teaser retirado - sitio activo
  const [country, setCountry] = useState(() => {
    return localStorage.getItem("casa_loy_user_country") || "";
  });
  const [lang, setLangState] = useState(() => {
    // 1. Check if user has a saved language preference in localStorage
    const savedLang = localStorage.getItem("casa_loy_pref_lang");
    if (savedLang === "es" || savedLang === "en") {
      return savedLang;
    }
    // 2. If no preference, check if current path determines a specific language
    const tempPageInfo = getPageInfoFromPath(window.location.pathname);
    if (tempPageInfo && (tempPageInfo.lang === "es" || tempPageInfo.lang === "en")) {
      return tempPageInfo.lang;
    }
    // 3. Fallback based on browser language
    const browserLang = navigator.language || navigator.userLanguage || "";
    if (browserLang.toLowerCase().includes("es")) {
      return "es";
    }
    return "es"; // Default to Spanish (will be updated by geolocation if needed)
  });

  const location = useLocation();
  const navigate = useNavigate();

  const pageInfo = getPageInfoFromPath(location.pathname);
  const page = pageInfo.page;

  // Automatically update the language state based on the current URL path
  useEffect(() => {
    if (pageInfo.lang && pageInfo.lang !== lang) {
      setLangState(pageInfo.lang);
      localStorage.setItem("casa_loy_pref_lang", pageInfo.lang);
    }
  }, [location.pathname, lang, pageInfo.lang]);

  // Detect country on mount (runs regardless of saved language preference)
  useEffect(() => {
    const detectCountry = async () => {
      const savedCountry = localStorage.getItem("casa_loy_user_country");
      if (savedCountry) {
        setCountry(savedCountry);
        return;
      }
      try {
        const response = await fetch("/api/cms?type=detect-location");
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country;
          if (countryCode) {
            const upperCountry = countryCode.toUpperCase();
            setCountry(upperCountry);
            localStorage.setItem("casa_loy_user_country", upperCountry);
            return;
          }
        }
      } catch (error) {
        console.warn("Error detecting country:", error);
      }
    };
    detectCountry();
  }, []);

  // Detect location and set language on mount if no preference is saved
  useEffect(() => {
    const detectLocation = async () => {
      const savedLang = localStorage.getItem("casa_loy_pref_lang");
      if (savedLang) return; // User already has a preference, don't override

      // If they landed on a language-specific path, save and respect it
      const currentPathInfo = getPageInfoFromPath(location.pathname);
      if (currentPathInfo && currentPathInfo.lang) {
        localStorage.setItem("casa_loy_pref_lang", currentPathInfo.lang);
        setLangState(currentPathInfo.lang);
        return;
      }

      if (country) {
        const spanishSpeakingCountries = ["MX", "ES", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR"];
        let detectedLang = "en";
        if (spanishSpeakingCountries.includes(country.toUpperCase())) {
          detectedLang = "es";
        }
        setLangState(detectedLang);
        localStorage.setItem("casa_loy_pref_lang", detectedLang);
        return;
      }

      // Browser language fallback as initial guess before country finishes loading
      const browserLang = navigator.language || navigator.userLanguage || "";
      const detectedLang = browserLang.toLowerCase().includes("es") ? "es" : "en";
      setLangState(detectedLang);
      localStorage.setItem("casa_loy_pref_lang", detectedLang);
    };

    detectLocation();
  }, [location.pathname, country]);

  // Wrapper setLang to handle URL switching when user clicks the ES/EN toggle in Header/Footer
  const setLang = (targetLang) => {
    if (targetLang === lang) return;

    const languageRedirects = {
      es: {
        "home": "/",
        "home-interactive": "/interactivo",
        "about": "/quienes-somos",
        "maquilas": "/marca-propia",
        "maquilas-v2": "/marca-propia",
        "brands": "/marcas",
        "turismo": "/turismo",
        "experience-oro": "/turismo/oro",
        "experience-platino": "/turismo/platino",
        "experience-diamante": "/turismo/diamante",
        "nativo": "/nativo",
        "where-to-buy": "/donde-comprar",
        "blog": "/blog",
        "careers": "/bolsa-de-trabajo",
        "privacy": "/politica-de-privacidad",
        "cookies": "/politica-de-cookies",
        "terms": "/terminos-y-condiciones"
      },
      en: {
        "home": "/",
        "home-interactive": "/interactivo",
        "about": "/about",
        "maquilas": "/private-label",
        "maquilas-v2": "/private-label",
        "brands": "/brands",
        "turismo": "/tourism",
        "experience-oro": "/tourism/gold",
        "experience-platino": "/tourism/platinum",
        "experience-diamante": "/tourism/diamond",
        "nativo": "/restaurant-nativo",
        "where-to-buy": "/where-to-buy",
        "blog": "/blog",
        "careers": "/careers",
        "privacy": "/privacy-policy",
        "cookies": "/cookie-policy",
        "terms": "/terms-and-conditions"
      }
    };

    if (languageRedirects[targetLang] && languageRedirects[targetLang][page]) {
      const targetPath = languageRedirects[targetLang][page];
      navigate(targetPath);
    }
    setLangState(targetLang);
    localStorage.setItem("casa_loy_pref_lang", targetLang);
  };

  // setPage wrapper to push state changes using react-router navigation, respecting the active language
  const setPage = (targetPage) => {
    const paths = {
      es: {
        home: "/",
        "home-interactive": "/interactivo",
        about: "/quienes-somos",
        maquilas: "/marca-propia",
        "maquilas-v2": "/marca-propia",
        brands: "/marcas",
        turismo: "/turismo",
        "experience-oro": "/turismo/oro",
        "experience-platino": "/turismo/platino",
        "experience-diamante": "/turismo/diamante",
        nativo: "/nativo",
        "where-to-buy": "/donde-comprar",
        blog: "/blog",
        "blog-post": "/blog/el-arte-de-la-cata",
        careers: "/bolsa-de-trabajo",
        "career-detail": `/bolsa-de-trabajo/${selectedJobId}`,
        privacy: "/politica-de-privacidad",
        cookies: "/politica-de-cookies",
        terms: "/terminos-y-condiciones",
        "validate-ticket": "/validar-ticket",
        panel: "/panel",
        "editorial-preview": "/editorial-preview"
      },
      en: {
        home: "/",
        "home-interactive": "/interactivo",
        about: "/about",
        maquilas: "/private-label",
        "maquilas-v2": "/private-label",
        brands: "/brands",
        turismo: "/tourism",
        "experience-oro": "/tourism/gold",
        "experience-platino": "/tourism/platinum",
        "experience-diamante": "/tourism/diamond",
        nativo: "/restaurant-nativo",
        "where-to-buy": "/where-to-buy",
        blog: "/blog",
        "blog-post": "/blog/el-arte-de-la-cata",
        careers: "/careers",
        "career-detail": `/careers/${selectedJobId}`,
        privacy: "/privacy-policy",
        cookies: "/cookie-policy",
        terms: "/terms-and-conditions",
        "validate-ticket": "/validar-ticket",
        panel: "/panel",
        "editorial-preview": "/editorial-preview"
      }
    };

    const activePaths = paths[lang] || paths.es;
    const targetPath = activePaths[targetPage] || "/";
    navigate(targetPath);
  };

  const [selectedTour, setSelectedTour] = useState("oro");
  const [selectedJobId, setSelectedJobId] = useState("kam");

  // Global Tourism Scheduling States (Shared between clients and CMS panel)
  const [maxCapacityLimit, setMaxCapacityLimit] = useState(50);
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookingsCapacity, setBookingsCapacity] = useState(() => {
    const initial = {};
    const today = new Date();
    let temp = new Date(today);
    for (let i = 0; i < 45; i++) {
      if (temp.getDay() !== 1) {
        const y = temp.getFullYear();
        const m = temp.getMonth();
        const d = temp.getDate();
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        const seed1 = ((d * 3) % 10) + 3;
        const seed2 = ((d * 7) % 8) + 5;
        initial[dateStr] = {
          "11:00 AM": seed1,
          "1:00 PM": seed2,
        };
      }
      temp.setDate(temp.getDate() + 1);
    }
    return initial;
  });

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

  const fetchTourismData = async () => {
    try {
      const res = await fetch('/api/tourism');
      if (res.ok) {
        const data = await res.json();
        if (data.maxCapacityLimit !== undefined) {
          setMaxCapacityLimit(data.maxCapacityLimit);
        }
        if (data.blockedDates !== undefined) {
          setBlockedDates(data.blockedDates);
        }
        if (data.blockedSlots !== undefined) {
          setBlockedSlots(data.blockedSlots);
        }
        if (data.bookingsCapacity !== undefined) {
          setBookingsCapacity(data.bookingsCapacity);
        }
      }
    } catch (e) {
      console.warn("Could not fetch tourism data from API, using default mock local state.", e);
    }
  };

  useEffect(() => {
    fetchTourismData();
    const params = new URLSearchParams(window.location.search);
    
    // Check if code query param is present (QR scan validation link)
    const code = params.get("code");
    if (code) {
      setPage("validate-ticket");
      return;
    }

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

  useEffect(() => {
    if (!hasBypass) return;
    window.scrollTo(0, 0);
  }, [page, hasBypass]);


  const shouldShowAgeGate = !ageVerified && page !== "privacy";

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "BAAvK-L9UVFBEa4dRiPs_e-lLR28owxHR7ogtbjBnC40ulxWbvVqVh5POA09f5FUVFrFPlt4n0Nzf4Sdb0", currency: "MXN" }}>
      <div className="bg-[#fcf9f3] text-[#1c1c18] font-body-md overflow-x-hidden antialiased select-none relative">
        {/* Dynamic SEO Injector for Meta Tags and JSON-LD microdata */}
        <SEO page={page} lang={lang} />

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
        {page !== "panel" && (
          <Header lang={lang} setLang={setLang} t={t} page={page} setPage={setPage} />
        )}
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home lang={lang} setPage={setPage} setLang={setLang} />} />
            <Route path="/editorial-preview" element={<Home lang={lang} setPage={setPage} setLang={setLang} />} />
            <Route path="/interactivo" element={<HomeInteractive lang={lang} setPage={setPage} />} />
            
            <Route path="/quienes-somos" element={<AboutUs t={t} lang={lang} setPage={setPage} />} />
            <Route path="/about" element={<AboutUs t={t} lang={lang} setPage={setPage} />} />
            <Route path="/about-us" element={<AboutUs t={t} lang={lang} setPage={setPage} />} />
            
            <Route path="/marca-propia" element={<Maquilas t={t} lang={lang} />} />
            <Route path="/private-label" element={<Maquilas t={t} lang={lang} />} />
            <Route path="/maquilas" element={<Navigate to="/marca-propia" replace />} />
            <Route path="/bottling" element={<Navigate to="/private-label" replace />} />
            <Route path="/maquilas-v2" element={<Navigate to="/marca-propia" replace />} />
            <Route path="/bottling-v2" element={<Navigate to="/private-label" replace />} />
            
            <Route path="/marcas" element={<Brands t={t} lang={lang} country={country} />} />
            <Route path="/brands" element={<Brands t={t} lang={lang} country={country} />} />
            
            <Route path="/turismo" element={<Turismo lang={lang} setPage={setPage} selectedTour={selectedTour} setSelectedTour={setSelectedTour} />} />
            <Route path="/tourism" element={<Turismo lang={lang} setPage={setPage} selectedTour={selectedTour} setSelectedTour={setSelectedTour} />} />
            
            <Route path="/turismo/oro" element={
              <ExperienceDetail
                lang={lang}
                packageId="oro"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            <Route path="/tourism/gold" element={
              <ExperienceDetail
                lang={lang}
                packageId="oro"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            
            <Route path="/turismo/platino" element={
              <ExperienceDetail
                lang={lang}
                packageId="platino"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            <Route path="/tourism/platinum" element={
              <ExperienceDetail
                lang={lang}
                packageId="platino"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            
            <Route path="/turismo/diamante" element={
              <ExperienceDetail
                lang={lang}
                packageId="diamante"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            <Route path="/tourism/diamond" element={
              <ExperienceDetail
                lang={lang}
                packageId="diamante"
                setPage={setPage}
                setSelectedTour={setSelectedTour}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            
            <Route path="/nativo" element={<Nativo1937 t={t} lang={lang} />} />
            <Route path="/restaurant-nativo" element={<Nativo1937 t={t} lang={lang} />} />
            
            <Route path="/donde-comprar" element={<WhereToBuy t={t} lang={lang} country={country} />} />
            <Route path="/where-to-buy" element={<WhereToBuy t={t} lang={lang} country={country} />} />
            
            <Route path="/blog" element={<Blog setPage={setPage} t={t} lang={lang} />} />
            <Route path="/blog/:slug" element={<BlogPost lang={lang} setPage={setPage} />} />
            
            <Route path="/bolsa-de-trabajo" element={<Careers lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            <Route path="/careers" element={<Careers lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            
            <Route path="/bolsa-de-trabajo/:jobId" element={<CareerDetailWrapper lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            <Route path="/careers/:jobId" element={<CareerDetailWrapper lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            
            <Route path="/politica-de-privacidad" element={<PrivacyPolicy t={t} lang={lang} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy t={t} lang={lang} />} />
            
            <Route path="/politica-de-cookies" element={<CookiePolicy t={t} lang={lang} />} />
            <Route path="/cookie-policy" element={<CookiePolicy t={t} lang={lang} />} />
            
            <Route path="/terminos-y-condiciones" element={<TermsConditions t={t} lang={lang} />} />
            <Route path="/terms-and-conditions" element={<TermsConditions t={t} lang={lang} />} />
            
            <Route path="/validar-ticket" element={<ValidateTicket lang={lang} setPage={setPage} />} />
            <Route path="/panel" element={
              <AdminPanel
                lang={lang}
                setPage={setPage}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                blockedSlots={blockedSlots}
                setBlockedSlots={setBlockedSlots}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
                refreshData={fetchTourismData}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Modern Watermarked Footer */}
        {page !== "panel" && <Footer lang={lang} t={t} setPage={setPage} />}

        {/* Global Newsletter Popup */}
        {page !== "panel" && <NewsletterPopup lang={lang} />}

        {/* Floating WhatsApp Button */}
        {page !== "panel" && (
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
        )}"
      </div>
    </PayPalScriptProvider>
  );
}

// CareerDetailWrapper to capture parameters from URL using useParams
function CareerDetailWrapper({ lang, setPage, setSelectedJobId }) {
  const { jobId } = useParams();
  useEffect(() => {
    if (jobId) {
      setSelectedJobId(jobId);
    }
  }, [jobId, setSelectedJobId]);
  return <CareerDetail lang={lang} setPage={setPage} jobId={jobId} />;
}
