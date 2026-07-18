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

export default function App() {
  const [hasBypass, setHasBypass] = useState(true); // Teaser retirado - sitio activo
  const [lang, setLang] = useState("es"); // Default language set to Spanish (ES)

  const location = useLocation();
  const navigate = useNavigate();

  // Derive the page state from the URL pathname to maintain backward compatibility
  const getPageFromPath = (pathname) => {
    if (pathname === "/" || pathname === "") return "home";
    if (pathname === "/interactivo") return "home-interactive";
    if (pathname === "/quienes-somos") return "about";
    if (pathname === "/maquilas") return "maquilas";
    if (pathname === "/marcas") return "brands";
    if (pathname === "/turismo") return "turismo";
    if (pathname === "/turismo/oro") return "experience-oro";
    if (pathname === "/turismo/platino") return "experience-platino";
    if (pathname === "/turismo/diamante") return "experience-diamante";
    if (pathname === "/nativo") return "nativo";
    if (pathname === "/donde-comprar") return "where-to-buy";
    if (pathname === "/blog") return "blog";
    if (pathname.startsWith("/blog/")) return "blog-post";
    if (pathname === "/bolsa-de-trabajo") return "careers";
    if (pathname.startsWith("/bolsa-de-trabajo/")) return "career-detail";
    if (pathname === "/politica-de-privacidad") return "privacy";
    if (pathname === "/politica-de-cookies") return "cookies";
    if (pathname === "/terminos-y-condiciones") return "terms";
    if (pathname === "/validar-ticket") return "validate-ticket";
    if (pathname === "/panel") return "panel";
    if (pathname === "/editorial-preview") return "editorial-preview";
    return "home";
  };
  const page = getPageFromPath(location.pathname);

  // setPage wrapper to push state changes using react-router navigation
  const setPage = (targetPage) => {
    switch (targetPage) {
      case "home":
        navigate("/");
        break;
      case "home-interactive":
        navigate("/interactivo");
        break;
      case "about":
        navigate("/quienes-somos");
        break;
      case "maquilas":
        navigate("/maquilas");
        break;
      case "brands":
        navigate("/marcas");
        break;
      case "turismo":
        navigate("/turismo");
        break;
      case "experience-oro":
        navigate("/turismo/oro");
        break;
      case "experience-platino":
        navigate("/turismo/platino");
        break;
      case "experience-diamante":
        navigate("/turismo/diamante");
        break;
      case "nativo":
        navigate("/nativo");
        break;
      case "where-to-buy":
        navigate("/donde-comprar");
        break;
      case "blog":
        navigate("/blog");
        break;
      case "blog-post":
        navigate("/blog/el-arte-de-la-cata");
        break;
      case "careers":
        navigate("/bolsa-de-trabajo");
        break;
      case "career-detail":
        navigate(`/bolsa-de-trabajo/${selectedJobId}`);
        break;
      case "privacy":
        navigate("/politica-de-privacidad");
        break;
      case "cookies":
        navigate("/politica-de-cookies");
        break;
      case "terms":
        navigate("/terminos-y-condiciones");
        break;
      case "validate-ticket":
        navigate("/validar-ticket");
        break;
      case "panel":
        navigate("/panel");
        break;
      case "editorial-preview":
        navigate("/editorial-preview");
        break;
      default:
        navigate("/");
    }
  };

  const [selectedTour, setSelectedTour] = useState("oro");
  const [selectedJobId, setSelectedJobId] = useState("kam");

  // Global Tourism Scheduling States (Shared between clients and CMS panel)
  const [maxCapacityLimit, setMaxCapacityLimit] = useState(50);
  const [blockedDates, setBlockedDates] = useState([]);
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
          "10:00 AM": seed1,
          "11:00 AM": seed2,
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
    <PayPalScriptProvider options={{ "client-id": "ATvqpIUvCDHFIHEAzauNdAX4o2qPqT-971MgriMfcpZFNQV9_af-WWa0kHCZHwiGFGnnSe2bhK33JPsL", currency: "MXN" }}>
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
        <Header lang={lang} setLang={setLang} t={t} page={page} setPage={setPage} />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home lang={lang} setPage={setPage} setLang={setLang} />} />
            <Route path="/editorial-preview" element={<Home lang={lang} setPage={setPage} setLang={setLang} />} />
            <Route path="/interactivo" element={<HomeInteractive lang={lang} setPage={setPage} />} />
            <Route path="/quienes-somos" element={<AboutUs t={t} lang={lang} setPage={setPage} />} />
            <Route path="/maquilas" element={<Maquilas t={t} lang={lang} />} />
            <Route path="/marcas" element={<Brands t={t} lang={lang} />} />
            <Route path="/turismo" element={<Turismo lang={lang} setPage={setPage} selectedTour={selectedTour} setSelectedTour={setSelectedTour} />} />
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
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
              />
            } />
            <Route path="/nativo" element={<Nativo1937 t={t} lang={lang} />} />
            <Route path="/donde-comprar" element={<WhereToBuy t={t} lang={lang} />} />
            <Route path="/blog" element={<Blog setPage={setPage} t={t} lang={lang} />} />
            <Route path="/blog/:slug" element={<BlogPost lang={lang} setPage={setPage} />} />
            <Route path="/bolsa-de-trabajo" element={<Careers lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            <Route path="/bolsa-de-trabajo/:jobId" element={<CareerDetailWrapper lang={lang} setPage={setPage} setSelectedJobId={setSelectedJobId} />} />
            <Route path="/politica-de-privacidad" element={<PrivacyPolicy t={t} lang={lang} />} />
            <Route path="/politica-de-cookies" element={<CookiePolicy t={t} lang={lang} />} />
            <Route path="/terminos-y-condiciones" element={<TermsConditions t={t} lang={lang} />} />
            <Route path="/validar-ticket" element={<ValidateTicket lang={lang} setPage={setPage} />} />
            <Route path="/panel" element={
              <AdminPanel
                lang={lang}
                setPage={setPage}
                maxCapacityLimit={maxCapacityLimit}
                setMaxCapacityLimit={setMaxCapacityLimit}
                blockedDates={blockedDates}
                setBlockedDates={setBlockedDates}
                bookingsCapacity={bookingsCapacity}
                setBookingsCapacity={setBookingsCapacity}
                refreshData={fetchTourismData}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
