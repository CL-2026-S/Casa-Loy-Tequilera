import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SolutionsHub({ lang = "en", setPage }) {
  const navigate = useNavigate();
  const [view, setView] = useState("hub"); // "hub" | "form" | "success"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    solution: "Private label tequila",
    email: "",
    phone: "",
    volume: "",
    timeline: "Ready to move now"
  });

  // Sync default dropdown values when language changes
  useEffect(() => {
    if (lang === "es") {
      setFormData(prev => ({
        ...prev,
        solution: prev.solution === "Private label tequila" ? "Tequila marca privada" : prev.solution,
        timeline: prev.timeline === "Ready to move now" ? "Listo para comenzar ahora" : prev.timeline
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        solution: prev.solution === "Tequila marca privada" ? "Private label tequila" : prev.solution,
        timeline: prev.timeline === "Listo para comenzar ahora" ? "Ready to move now" : prev.timeline
      }));
    }
  }, [lang]);

  // Content dictionary
  const content = {
    en: {
      brandHeader: "CASA LOY TEQUILERA",
      heroTitle: "B2B tequila solutions, made to order.",
      heroDesc: "Private label, bulk tequila & co-packing — from a producer with its own agave fields.",
      trustLine: "NOM 1633 • Registered with the CRT • Ayotlán, Jalisco",
      cards: [
        {
          id: "private-label",
          title: "Private Label Tequila",
          desc: "Launch or replicate a profile — one tequila contract, from formula to export",
          solutionValue: "Private label tequila"
        },
        {
          id: "bulk",
          title: "Bulk Tequila",
          desc: "Ship-ready supply for brands bottling at destination",
          solutionValue: "Bulk tequila"
        },
        {
          id: "copacking",
          title: "Co-packing",
          desc: "Bring your own liquid, we handle bottling in Mexico",
          solutionValue: "Co-packing"
        }
      ],
      talkToUs: "Talk to us",
      aboutUs: "About us ↗",
      callCard: {
        badge: "Direct Calendar",
        duration: "30 min",
        title: "Schedule your technical call",
        subtitle: "1-on-1 consultation directly with distillery • Cal.com",
        cta: "Book slot"
      },
      orGetInformed: "OR GET INFORMED",
      blogB2B: "Blog B2B",
      form: {
        back: "Back",
        title: "Tell us about your project.",
        desc: "A few questions so the right person from our team follows up — and if it's a fit, you'll get a calendar link right away.",
        nameLabel: "Full name",
        namePlaceholder: "Jane Smith",
        companyLabel: "Company",
        companyPlaceholder: "Your brand or distribution company",
        lookingForLabel: "What are you looking for?",
        solutionOptions: [
          "Private label tequila",
          "Bulk tequila",
          "Co-packing",
          "Custom formulation & distillery development"
        ],
        emailLabel: "Email address",
        emailPlaceholder: "jane@company.com",
        phoneLabel: "Phone / WhatsApp (Optional)",
        phonePlaceholder: "+1 555 123 4567",
        volumeLabel: "Estimated volume / market",
        volumePlaceholder: "e.g. 5,000 cases/yr — USA",
        timelineLabel: "Timeline",
        timelineOptions: [
          "Ready to move now",
          "1–3 months",
          "3–6 months",
          "Exploring options"
        ],
        sendBtn: "Send",
        sendingBtn: "Submitting...",
        notice: "If your answers match one of our active profiles, the confirmation screen opens our calendar so you can book directly — no back-and-forth email. Otherwise, someone from our team reaches out first.",
        directCalLink: "Prefer to book directly? Schedule your technical call here ↗"
      },
      success: {
        title: "Thank you for reaching out!",
        subtitle: "We have received your project details. If your answers match our production schedule, you can book a 30-minute consultation directly below:",
        bookCall: "Schedule 30-min Technical Call (Cal.com)",
        whatsappCta: "Prefer WhatsApp? Chat with our team",
        backToHub: "Return to Solutions Hub",
        exploreBrands: "Explore Casa Loy Brands"
      }
    },
    es: {
      brandHeader: "CASA LOY TEQUILERA",
      heroTitle: "Soluciones de tequila B2B, hechas a la medida.",
      heroDesc: "Marca privada, tequila a granel y co-packing — de un productor con campos propios de agave.",
      trustLine: "NOM 1633 • Registrado ante el CRT • Ayotlán, Jalisco",
      cards: [
        {
          id: "private-label",
          title: "Tequila Marca Privada",
          desc: "Lanza o replica un perfil — un solo contrato integral, desde la formulación hasta la exportación",
          solutionValue: "Tequila marca privada"
        },
        {
          id: "bulk",
          title: "Tequila a Granel",
          desc: "Suministro listo para embarque para marcas que embotellan en destino",
          solutionValue: "Tequila a granel"
        },
        {
          id: "copacking",
          title: "Co-packing / Envasado",
          desc: "Trae tu propio líquido, nosotros nos encargamos del envasado en México",
          solutionValue: "Co-packing / Envasado"
        }
      ],
      talkToUs: "Hablemos",
      aboutUs: "Quiénes somos ↗",
      callCard: {
        badge: "Agenda Directa",
        duration: "30 min",
        title: "Agenda tu llamada técnica",
        subtitle: "Videollamada 1 a 1 con destilería • Sin esperas",
        cta: "Agendar"
      },
      orGetInformed: "O INFÓRMATE",
      blogB2B: "Blog B2B",
      form: {
        back: "Volver",
        title: "Cuéntanos sobre tu proyecto.",
        desc: "Unas breves preguntas para que la persona indicada de nuestro equipo te contacte — y si tu proyecto califica, recibirás un enlace de agenda inmediatamente.",
        nameLabel: "Nombre completo",
        namePlaceholder: "Juan Pérez",
        companyLabel: "Empresa",
        companyPlaceholder: "Tu marca o empresa distribuidora",
        lookingForLabel: "¿Qué estás buscando?",
        solutionOptions: [
          "Tequila marca privada",
          "Tequila a granel",
          "Co-packing / Envasado",
          "Formulación especial y desarrollo en destilería"
        ],
        emailLabel: "Correo electrónico",
        emailPlaceholder: "juan@empresa.com",
        phoneLabel: "Teléfono / WhatsApp (Opcional)",
        phonePlaceholder: "+52 33 1234 5678",
        volumeLabel: "Volumen estimado / mercado",
        volumePlaceholder: "ej. 5,000 cajas/año — EE. UU.",
        timelineLabel: "Tiempo estimado",
        timelineOptions: [
          "Listo para comenzar ahora",
          "En 1 a 3 meses",
          "En 3 a 6 meses",
          "Explorando opciones"
        ],
        sendBtn: "Enviar",
        sendingBtn: "Enviando...",
        notice: "Si tus respuestas coinciden con uno de nuestros perfiles activos, la pantalla de confirmación abrirá nuestra agenda para que reserves directamente — sin correos de ida y vuelta. De lo contrario, alguien de nuestro equipo se pondrá en contacto primero.",
        directCalLink: "¿Prefieres agendar de inmediato? Reserva tu llamada técnica aquí ↗"
      },
      success: {
        title: "¡Gracias por contactarnos!",
        subtitle: "Hemos recibido los detalles de tu proyecto. Si tus respuestas coinciden con nuestra capacidad de producción, puedes agendar una videollamada técnica de 30 minutos a continuación:",
        bookCall: "Agendar videollamada técnica de 30 min (Cal.com)",
        whatsappCta: "¿Prefieres WhatsApp? Escríbenos directamente",
        backToHub: "Volver al Hub de Soluciones",
        exploreBrands: "Conoce las Marcas de Casa Loy"
      }
    }
  };

  const t = content[lang] || content.en;

  const handleCardClick = (solutionValue) => {
    setFormData(prev => ({
      ...prev,
      solution: solutionValue
    }));
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenForm = () => {
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHub = () => {
    setView("hub");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
      setErrorMessage(
        lang === "es"
          ? "Por favor completa los campos de Nombre, Empresa y Correo."
          : "Please fill in your Name, Company, and Email."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        lada: "",
        solution: formData.solution,
        objective: formData.volume.trim() || "N/A",
        stage: formData.timeline,
        origin: "solutions_hub"
      };

      const response = await fetch("/api/maquila", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Track GA4 / Meta Lead event
        try {
          if (typeof window.gtag === "function") {
            window.gtag("event", "generate_lead", {
              lead_source: "solutions_hub",
              solution: formData.solution
            });
          }
          if (typeof window.fbq === "function") {
            window.fbq("track", "Lead", {
              content_category: "b2b_solutions",
              content_name: formData.solution
            });
          }
        } catch (err) {
          console.warn("Analytics tracking failed:", err);
        }

        setView("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(
          errorData.error ||
            (lang === "es"
              ? "Hubo un problema al enviar tu información. Por favor intenta de nuevo."
              : "There was a problem submitting your information. Please try again.")
        );
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        lang === "es"
          ? "Error de conexión con el servidor. Intenta de nuevo."
          : "Connection error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1c1c18] pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 relative flex flex-col justify-between">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-lg h-60 bg-gradient-to-b from-[#8C4723]/6 to-transparent blur-2xl pointer-events-none -z-0"></div>

      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* ============================================================
              VIEW 1: LINKTREE-STYLE SOLUTIONS HUB (COMPACT & ON-BRAND)
              ============================================================ */}
          {view === "hub" && (
            <motion.div
              key="hub-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Main Headline (single line) */}
              <h1 className="font-serif text-[21px] sm:text-[27px] md:text-[31px] leading-tight font-semibold text-[#1c1c18] tracking-tight whitespace-normal sm:whitespace-nowrap mb-1.5">
                {t.heroTitle}
              </h1>

              {/* Subtitle (single line) */}
              <p className="font-navigation text-[11px] sm:text-[12.5px] md:text-[13px] text-[#53443a] font-normal whitespace-normal sm:whitespace-nowrap mb-2">
                {t.heroDesc}
              </p>

              {/* CRT & NOM Credential */}
              <div className="font-navigation text-[10px] sm:text-[10.5px] text-[#867369] font-medium tracking-wide mb-4">
                {t.trustLine}
              </div>

              {/* Cards & Actions Container */}
              <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                {/* Cards List */}
              <div className="w-full space-y-2.5 mb-3.5">
                {t.cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(card.solutionValue)}
                    className="w-full group bg-white border border-[#EDE7DE] hover:border-[#8C4723]/60 rounded-xl p-3.5 sm:p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_18px_rgba(140,71,35,0.08)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex-1 pr-1">
                      <h2 className="font-serif text-[16px] sm:text-[18px] font-semibold text-[#1c1c18] group-hover:text-[#8C4723] transition-colors leading-snug">
                        {card.title}
                      </h2>
                      <p className="font-navigation text-[11px] sm:text-[11.5px] text-[#53443a] font-normal mt-0.5 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                    <div className="text-[#867369] group-hover:text-[#8C4723] group-hover:translate-x-1 transition-all duration-200 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 stroke-current fill-none stroke-[2]"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Primary Action: Talk to us (Casa Loy Terracotta Red Clay) */}
              <button
                type="button"
                onClick={handleOpenForm}
                className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-[#8C4723] hover:bg-[#723606] active:bg-[#5e2b05] text-white font-navigation text-[13.5px] sm:text-[14px] font-semibold tracking-wide shadow-[0_4px_14px_rgba(140,71,35,0.25)] hover:shadow-[0_6px_20px_rgba(140,71,35,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mb-2.5"
              >
                <span>{t.talkToUs}</span>
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current stroke-[2] -rotate-12"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 9-18 9 4-9-4-9zm4 9h14" />
                </svg>
              </button>

              {/* Visual Secondary Action: Agenda tu llamada (Cal.com Direct Booking Card) */}
              <a
                href="https://cal.com/internationalcasaloy/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#FAF7F2] to-white border border-[#8C4723]/30 hover:border-[#8C4723] p-3.5 sm:p-4 text-left shadow-[0_2px_12px_rgba(140,71,35,0.06)] hover:shadow-[0_8px_24px_rgba(140,71,35,0.14)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer mb-2.5 group block"
              >
                {/* Top micro badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] sm:text-[10.5px] font-navigation font-semibold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{t.callCard.badge}</span>
                  </div>
                  <span className="font-navigation text-[10.5px] text-[#867369] font-medium tracking-wide">
                    {t.callCard.duration}
                  </span>
                </div>

                {/* Main visual row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#8C4723]/10 text-[#8C4723] flex items-center justify-center group-hover:bg-[#8C4723] group-hover:text-white transition-colors duration-200 flex-shrink-0">
                      <svg className="w-5 h-5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="font-serif text-[15px] sm:text-[16px] font-semibold text-[#1c1c18] group-hover:text-[#8C4723] transition-colors leading-snug">
                        {t.callCard.title}
                      </h3>
                      <p className="font-navigation text-[11px] sm:text-[11.5px] text-[#53443a] leading-tight mt-0.5">
                        {t.callCard.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right CTA action */}
                  <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8C4723] group-hover:bg-[#723606] text-white font-navigation text-[11.5px] sm:text-[12px] font-semibold shadow-sm transition-colors">
                    <span>{t.callCard.cta}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-[11px]">↗</span>
                  </div>
                </div>
              </a>

              {/* Secondary Link: About us */}
              <Link
                to={lang === "es" ? "/quienes-somos" : "/about"}
                className="font-navigation text-[12px] text-[#53443a] hover:text-[#8C4723] transition-colors py-1 font-medium flex items-center gap-1 group"
              >
                <span>{t.aboutUs}</span>
              </Link>

              {/* Section Divider */}
              <div className="w-full flex items-center gap-3 my-3.5">
                <div className="flex-1 h-px bg-[#1c1c18]/10"></div>
                <span className="font-navigation text-[9.5px] sm:text-[10px] font-bold tracking-[0.25em] text-[#867369] uppercase">
                  {t.orGetInformed}
                </span>
                <div className="flex-1 h-px bg-[#1c1c18]/10"></div>
              </div>

              {/* B2B Blog Button */}
              <Link
                to="/blog"
                className="w-full py-2.5 px-5 rounded-xl bg-white border border-[#EDE7DE] hover:border-[#8C4723]/50 hover:text-[#8C4723] text-[#1c1c18] font-navigation text-[12px] sm:text-[13px] font-semibold shadow-sm transition-all duration-200 text-center block mb-4"
              >
                {t.blogB2B}
              </Link>

              {/* Social Channels Row */}
              <div className="flex items-center justify-center gap-4 mb-3 text-[#2F403E]">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/casaloy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-[#EDE7DE] flex items-center justify-center hover:text-[#8C4723] hover:border-[#8C4723]/40 hover:scale-105 transition-all duration-200 shadow-sm"
                  aria-label="LinkedIn Casa Loy"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* YouTube / Media */}
                <a
                  href="https://www.youtube.com/@casaloytequilera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-[#EDE7DE] flex items-center justify-center hover:text-[#8C4723] hover:border-[#8C4723]/40 hover:scale-105 transition-all duration-200 shadow-sm"
                  aria-label="YouTube Casa Loy"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>

                {/* Email Direct */}
                <a
                  href="mailto:luisloyb@casaloy.com"
                  className="w-9 h-9 rounded-full bg-white border border-[#EDE7DE] flex items-center justify-center hover:text-[#8C4723] hover:border-[#8C4723]/40 hover:scale-105 transition-all duration-200 shadow-sm"
                  aria-label="Email Casa Loy (Luis Loy)"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            VIEW 2: PROJECT INTAKE FORM ("Tell us about your project")
            ============================================================ */}
        {view === "form" && (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md sm:max-w-lg mx-auto text-left"
          >
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToHub}
                className="font-navigation text-[13px] text-[#53443a] hover:text-[#8C4723] transition-colors py-1 flex items-center gap-1.5 font-medium cursor-pointer group mb-2"
              >
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-[2] group-hover:-translate-x-0.5 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t.form.back}</span>
              </button>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-[24px] sm:text-[28px] md:text-[30px] font-semibold text-[#1c1c18] leading-[1.15] mt-1 mb-1.5">
                {t.form.title}
              </h2>
              <p className="font-navigation text-[12px] sm:text-[12.5px] text-[#53443a] leading-relaxed font-normal mb-4">
                {t.form.desc}
              </p>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-xl text-[12px] text-[#ba1a1a] font-navigation flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmitForm} className="space-y-2.5">
                {/* Full name & Company in 2-col on sm screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.nameLabel} <span className="text-[#8C4723]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.form.namePlaceholder}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation placeholder-[#867369]/60 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.companyLabel} <span className="text-[#8C4723]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t.form.companyPlaceholder}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation placeholder-[#867369]/60 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* What are you looking for? */}
                <div>
                  <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                    {t.form.lookingForLabel} <span className="text-[#8C4723]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation appearance-none pr-10 transition-all cursor-pointer outline-none"
                    >
                      {t.form.solutionOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#867369]">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email & Phone in 2-col on sm screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.emailLabel} <span className="text-[#8C4723]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.form.emailPlaceholder}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation placeholder-[#867369]/60 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t.form.phonePlaceholder}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation placeholder-[#867369]/60 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Estimated volume & Timeline in 2-col on sm screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.volumeLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      placeholder={t.form.volumePlaceholder}
                      className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation placeholder-[#867369]/60 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-navigation text-[11px] font-semibold text-[#1c1c18] mb-1">
                      {t.form.timelineLabel}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-white border border-[#EDE7DE] focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] rounded-xl px-3.5 py-2 text-[13px] text-[#1c1c18] font-navigation appearance-none pr-10 transition-all cursor-pointer outline-none"
                      >
                        {t.form.timelineOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#867369]">
                        <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-[#8C4723] hover:bg-[#723606] active:bg-[#5e2b05] disabled:opacity-60 text-white font-navigation text-[14px] font-semibold tracking-wide shadow-[0_4px_14px_rgba(140,71,35,0.25)] hover:shadow-[0_6px_20px_rgba(140,71,35,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t.form.sendingBtn}</span>
                      </>
                    ) : (
                      <span>{t.form.sendBtn}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Informational Callout Box */}
              <div className="mt-3.5 p-3 sm:p-3.5 rounded-xl bg-[#F6F2EA] border border-[#EDE7DE] flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-[#8C4723] flex items-center justify-center flex-shrink-0 text-[10px] font-serif font-bold text-[#8C4723] mt-0.5">
                  i
                </div>
                <p className="font-navigation text-[11px] sm:text-[11.5px] text-[#53443a] leading-relaxed font-normal">
                  {t.form.notice}
                </p>
              </div>

              {/* Direct Cal.com booking link */}
              <div className="mt-2.5 text-center">
                <a
                  href="https://cal.com/internationalcasaloy/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-navigation text-[11.5px] text-[#8C4723] hover:text-[#723606] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.form.directCalLink}</span>
                </a>
              </div>
            </motion.div>
          )}

          {/* ============================================================
              VIEW 3: SUCCESS CONFIRMATION & CALENDAR ACCESS
              ============================================================ */}
          {view === "success" && (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md sm:max-w-lg mx-auto text-center bg-white border border-[#1c1c18]/10 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              {/* Checkmark Icon */}
              <div className="w-16 h-16 rounded-full bg-[#8C4723]/10 text-[#8C4723] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="font-serif text-[28px] sm:text-[32px] font-semibold text-[#1c1c18] leading-tight mb-2">
                {t.success.title}
              </h2>
              <p className="font-navigation text-[13px] sm:text-[14px] text-[#53443a] leading-relaxed mb-6 font-normal">
                {t.success.subtitle}
              </p>

              {/* Calendar Scheduling Button */}
              <div className="space-y-3 mb-6">
                <a
                  href="https://cal.com/internationalcasaloy/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#8C4723] hover:bg-[#723606] text-white font-navigation text-[13.5px] font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{t.success.bookCall}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                </a>

                {/* Direct WhatsApp Option */}
                <a
                  href={`https://wa.me/5213332504359?text=${encodeURIComponent(
                    lang === "es"
                      ? `Hola, completé el formulario de soluciones B2B para ${formData.company} (${formData.name}) y me gustaría agendar una llamada sobre ${formData.solution}.`
                      : `Hello, I submitted the B2B solutions form for ${formData.company} (${formData.name}) and would like to schedule a call regarding ${formData.solution}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#2F403E] hover:bg-[#25D366] text-white font-navigation text-[13px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                  </svg>
                  <span>{t.success.whatsappCta}</span>
                </a>
              </div>

              {/* Navigation Back */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 border-t border-[#1c1c18]/10 text-[12.5px] font-navigation font-medium">
                <button
                  type="button"
                  onClick={handleBackToHub}
                  className="text-[#867369] hover:text-[#8C4723] transition-colors cursor-pointer"
                >
                  {t.success.backToHub}
                </button>
                <span className="hidden sm:inline text-[#867369]/40">•</span>
                <Link
                  to={lang === "es" ? "/marcas" : "/brands"}
                  className="text-[#8C4723] hover:underline"
                >
                  {t.success.exploreBrands}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
