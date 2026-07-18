import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer({ lang = "es", setPage }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          source_page: "footer"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setEmail("");
        localStorage.setItem("casa_loy_subscribed", "true");
      } else {
        setStatus("error");
        setErrorMessage(data.error || (lang === "es" ? "Error al suscribirse." : "Subscription error."));
      }
    } catch (err) {
      console.error("Footer subscription fetch error:", err);
      setStatus("error");
      setErrorMessage(lang === "es" ? "Error de conexión." : "Connection error.");
    }
  };

  // Content dictionary for Spanish and English
  const content = {
    es: {
      desc: "Destilería mexicana con visión global, especializada en la producción, desarrollo y comercialización de tequila 100% agave. Integramos tradición, innovación y capacidad operativa para impulsar marcas propias, experiencias premium y proyectos estratégicos dentro de la industria tequilera.",
      aboutCTA: "Conoce nuestra historia",
      portfolioTitle: "Portafolio Casa Loy",
      brands: [
        { name: "Casa Loy Tequila", url: "https://casaloytequila.com/", external: true },
        { name: "Reserva Casa Loy", url: "https://reservatequila.com/", external: true },
        { name: "TADDEL Tequila", url: "https://TADDELtequila.com/", external: true },
        { name: "Tierra Zafiro Tequila", url: "https://TierraZafirotequila.com/", external: true },
        { name: "Desarrolla tu Marca", page: "maquilas", external: false },
        { name: "Experiencias Casa Loy", page: "turismo", external: false },
        { name: "Restaurante 1937 Nativo", page: "nativo", external: false },
        { name: "Blog", page: "blog", external: false },
        { name: "Bolsa de Trabajo", page: "careers", external: false },
      ],
      contactTitle: "Contáctanos",
      whatsappLabel: "Atención / WhatsApp:",
      emailLabel: "Correo institucional:",
      locationLabel: "Ubicación:",
      locationVal: "Carretera Ayotlán–Atotonilco km 6.5, Las Villas, Jalisco",
      mapCTA: "Cómo llegar",
      newsletterTitle: "Únete a la Comunidad",
      newsletterDesc: "Recibe noticias, experiencias, lanzamientos y artículos exclusivos de Casa Loy.",
      newsletterPlaceholder: "Correo electrónico",
      newsletterBtn: "SUSCRIBIRME",
      newsletterSuccess: "Bienvenido a la comunidad Casa Loy.",
      newsletterDisclaimer: "Al suscribirte aceptas recibir comunicaciones de Casa Loy Tequilera y reconoces nuestro ",
      privacyLinkText: "Aviso de privacidad",
      socialTitle: "Redes institucionales",
      legalLinks: [
        { name: "Aviso de privacidad", page: "privacy", external: false },
        { name: "Política de cookies", page: "cookies", external: false },
        { name: "Términos y condiciones", page: "terms", external: false },
        { name: "Evita el Exceso", url: "http://alcoholinformate.org.mx/", external: true },
        { name: "Solo mayores de edad", tag: true },
      ],
      copyright: "© 2026 Casa Loy Tequilera. Todos los derechos reservados."
    },
    en: {
      desc: "Mexican distillery with a global vision, specializing in the production, development, and commercialization of 100% agave tequila. We integrate tradition, innovation, and operational capacity to drive private labels, premium experiences, and strategic projects within the tequila industry.",
      aboutCTA: "Discover our history",
      portfolioTitle: "Casa Loy Portfolio",
      brands: [
        { name: "Casa Loy Tequila", url: "https://casaloytequila.com/", external: true },
        { name: "Reserva Casa Loy", url: "https://reservatequila.com/", external: true },
        { name: "TADDEL Tequila", url: "https://TADDELtequila.com/", external: true },
        { name: "Tierra Zafiro Tequila", url: "https://TierraZafirotequila.com/", external: true },
        { name: "Develop your Brand", page: "maquilas", external: false },
        { name: "Casa Loy Experiences", page: "turismo", external: false },
        { name: "Restaurante 1937 Nativo", page: "nativo", external: false },
        { name: "Blog", page: "blog", external: false },
        { name: "Careers", page: "careers", external: false },
      ],
      contactTitle: "Contact Us",
      whatsappLabel: "Customer Service / WhatsApp:",
      emailLabel: "Corporate Email:",
      locationLabel: "Location:",
      locationVal: "Ayotlán–Atotonilco Highway km 6.5, Las Villas, Jalisco",
      mapCTA: "Get directions",
      newsletterTitle: "Join the Community",
      newsletterDesc: "Receive news, experiences, launches and exclusive articles from Casa Loy.",
      newsletterPlaceholder: "Email address",
      newsletterBtn: "SUBSCRIBE",
      newsletterSuccess: "Welcome to the Casa Loy community.",
      newsletterDisclaimer: "By subscribing you agree to receive communications from Casa Loy Tequilera and acknowledge our ",
      privacyLinkText: "Privacy policy",
      socialTitle: "Corporate Socials",
      legalLinks: [
        { name: "Privacy policy", page: "privacy", external: false },
        { name: "Cookie policy", page: "cookies", external: false },
        { name: "Terms & conditions", page: "terms", external: false },
        { name: "Avoid Excess", url: "http://alcoholinformate.org.mx/", external: true },
        { name: "Legal age only", tag: true },
      ],
      copyright: "© 2026 Casa Loy Tequilera. All rights reserved."
    }
  };

  const t = content[lang] || content.es;

  return (
    <footer className="pt-24 pb-12 bg-[#EDE7DE] text-[#1A1615] border-t border-[#1A1615]/15 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-gutter mb-20">
          
          {/* Column 1: Institutional Block */}
          <div className="lg:col-span-4 space-y-6 text-center flex flex-col items-center">
            <button
              onClick={() => setPage("home")}
              className="flex items-center justify-center select-none cursor-pointer focus:outline-none"
            >
              <img
                alt="Logo Casa Loy Tequilera"
                className="h-11 w-auto object-contain brightness-0 transition-opacity duration-300 hover:opacity-80 mx-auto"
                src="/Logotipo Casa Loy Tequilera.png"
              />
            </button>
            <p className="font-navigation text-[13px] text-[#1A1615]/75 leading-relaxed font-normal max-w-sm">
              {t.desc}
            </p>
            <div className="pt-2">
              <Link
                to="/quienes-somos"
                className="group inline-flex items-center gap-3 font-navigation text-[12px] font-semibold text-[#8C4723] hover:text-[#2F403E] transition-colors duration-300 uppercase tracking-widest focus:outline-none"
              >
                <span>{t.aboutCTA}</span>
                <span className="material-symbols-outlined text-sm font-light group-hover:translate-x-1.5 transition-transform duration-300">
                  arrow_right_alt
                </span>
              </Link>
            </div>
          </div>

          {/* Column 2: Casa Loy Portfolio */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <h4 className="font-serif text-[18px] font-bold text-[#2F403E] tracking-wide border-b border-[#1A1615]/10 pb-3">
              {t.portfolioTitle}
            </h4>
            <ul className="space-y-3 font-navigation text-[13.5px] font-medium text-[#1A1615]/80">
              {t.brands.map((link, idx) => {
                const getPageRoute = (p) => {
                  if (p === "maquilas") return "/maquilas";
                  if (p === "turismo") return "/turismo";
                  if (p === "nativo") return "/nativo";
                  if (p === "blog") return "/blog";
                  if (p === "careers") return "/bolsa-de-trabajo";
                  return "/";
                };
                return (
                  <li key={idx}>
                    {link.external ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#8C4723] text-[#1A1615]/80 transition-colors duration-300 block text-left cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={getPageRoute(link.page)}
                        className="hover:text-[#8C4723] transition-colors duration-300 block text-left cursor-pointer"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <h4 className="font-serif text-[18px] font-bold text-[#2F403E] tracking-wide border-b border-[#1A1615]/10 pb-3">
              {t.contactTitle}
            </h4>
            <div className="space-y-4">
              {/* WhatsApp/Phone Row */}
              <div className="flex items-center gap-3">
                <svg className="w-4.5 h-4.5 fill-current text-[#8C4723] shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.805.001-2.621-1.013-5.086-2.86-6.936C16.37 1.947 13.907 1.01 11.996 1.01c-5.41 0-9.813 4.402-9.815 9.813-.001 1.638.455 3.236 1.32 4.654L2.46 19.95l4.187-1.096L6.647 19.16zM17.15 14.5c-.282-.141-1.664-.822-1.921-.916-.257-.094-.445-.141-.631.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-4.88-1.22-6.52-3.08-.282-.482.282-.447.805-1.492.083-.164.041-.309-.021-.45-.062-.141-.563-1.36-.77-1.859-.203-.489-.407-.423-.563-.431-.145-.007-.312-.009-.48-.009-.168 0-.441.063-.672.312-.23.25-1.012.988-1.012 2.41 0 1.42 1.031 2.793 1.17 2.98.14.188 2.03 3.102 4.921 4.35.688.297 1.224.474 1.644.607.69.219 1.319.188 1.816.114.553-.082 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328z"/>
                </svg>
                <a
                  href="https://wa.me/5213332504359"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-navigation text-[13.5px] text-[#1A1615] hover:text-[#8C4723] transition-colors duration-300 font-medium"
                >
                  +52 1 33 3250 4359
                </a>
              </div>

              {/* Email Row */}
              <div className="flex items-center gap-3">
                <svg className="w-4.5 h-4.5 fill-current text-[#8C4723] shrink-0" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a
                  href="mailto:hola@casaloy.com"
                  className="font-navigation text-[13.5px] text-[#1A1615] hover:text-[#8C4723] transition-colors duration-300 font-medium break-all"
                >
                  hola@casaloy.com
                </a>
              </div>

              {/* Location Row */}
              <div className="pt-2 border-t border-[#1A1615]/5">
                <span className="font-navigation text-[9.5px] text-[#8C4723] tracking-[0.1em] uppercase block font-semibold mb-1">
                  {t.locationLabel}
                </span>
                <span className="font-navigation text-[13px] text-[#1A1615]/75 leading-relaxed font-normal block">
                  {t.locationVal}
                </span>
                <a
                  href="https://maps.app.goo.gl/68BvLpYUpiiSBmMk6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-navigation text-[11px] font-semibold text-[#8C4723] hover:text-[#2F403E] transition-colors duration-300 uppercase tracking-widest mt-1.5"
                >
                  <span>{t.mapCTA}</span>
                  <span className="material-symbols-outlined text-[13px] font-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter visual card */}
          <div className="lg:col-span-3 bg-[#F6F2EA] p-6 border border-[#1A1615]/8 shadow-sm flex flex-col justify-between space-y-4 text-center">
            <div>
              <div className="flex flex-col items-center gap-2 mb-3">
                <img
                  src="/favicon.svg"
                  alt="Casa Loy Tequilera"
                  className="w-10 h-10 object-contain mx-auto"
                />
                <h4 className="font-serif text-[20px] font-bold text-[#2F403E] leading-tight tracking-wide">
                  {t.newsletterTitle}
                </h4>
              </div>
              <p className="font-navigation text-[12.5px] text-[#1A1615]/75 leading-relaxed font-normal">
                {t.newsletterDesc}
              </p>
            </div>

            <div className="space-y-4">
              {status === "success" ? (
                <div className="p-4 bg-[#2F403E]/10 border border-[#2F403E]/20 rounded-none transition-all duration-500">
                  <p className="font-navigation text-[#2F403E] text-[13px] font-semibold">
                    {t.newsletterSuccess}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="space-y-3"
                >
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="w-full bg-white/70 border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1A1615] placeholder:text-[#1A1615]/40 focus:outline-none px-3 py-2 transition-all duration-300"
                    placeholder={t.newsletterPlaceholder}
                    required
                    type="email"
                    disabled={status === "loading"}
                  />
                  {status === "error" && (
                    <p className="text-[11px] font-navigation text-red-700 font-medium text-left">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#8C4723] text-white hover:bg-[#2F403E] disabled:bg-[#8C4723]/60 font-navigation text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 transition-colors duration-300 focus:outline-none cursor-pointer"
                  >
                    {status === "loading" ? (lang === "es" ? "ENVIANDO..." : "SENDING...") : t.newsletterBtn}
                  </button>
                </form>
              )}

              <span className="font-navigation text-[9.5px] text-[#1A1615]/50 leading-relaxed font-normal block">
                {t.newsletterDisclaimer}
                <Link
                  to="/politica-de-privacidad"
                  className="text-[#8C4723] hover:text-[#2F403E] transition-colors duration-300 underline underline-offset-2 focus:outline-none cursor-pointer"
                >
                  {t.privacyLinkText}
                </Link>
                .
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-t border-[#1A1615]/10 pt-8 gap-4 mt-8">
          
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 font-navigation text-[10px] text-[#1A1615]/75 uppercase tracking-widest font-semibold lg:whitespace-nowrap">
            {t.legalLinks.map((link, idx) => {
              if (link.tag) {
                return (
                  <span
                    key={idx}
                    className="cursor-default select-none border border-[#1A1615]/30 px-2.5 py-0.5 text-[9px] tracking-[0.15em] text-[#1A1615]/80"
                  >
                    {link.name}
                  </span>
                );
              }
              const getLegalRoute = (p) => {
                if (p === "privacy") return "/politica-de-privacidad";
                if (p === "cookies") return "/politica-de-cookies";
                if (p === "terms") return "/terminos-y-condiciones";
                return "/";
              };
              return link.external ? (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8C4723] transition-colors duration-300"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={idx}
                  to={getLegalRoute(link.page)}
                  className="hover:text-[#8C4723] transition-colors duration-300 uppercase tracking-widest focus:outline-none cursor-pointer"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Social Icons (Only LinkedIn and YouTube) in Copper */}
          <div className="flex items-center gap-5 my-2 lg:my-0 text-[#8C4723]">
            <a
              href="https://www.linkedin.com/company/casaloy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2F403E] transition-colors duration-300 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@casaloytequilera"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2F403E] transition-colors duration-300 flex items-center justify-center"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                <path d="M23 12a29.8 29.8 0 0 0-.4-3.5 3.03 3.03 0 0 0-2.1-2.1C18.6 6 12 6 12 6s-6.6 0-8.5.4a3.03 3.03 0 0 0-2.1 2.1c-.3 1.2-.4 2.4-.4 3.5s.1 2.3.4 3.5a3.03 3.03 0 0 0 2.1 2.1c1.9.4 8.5.4 8.5.4s6.6 0 8.5-.4a3.03 3.03 0 0 0 2.1-2.1c.3-1.2.4-2.3.4-3.5zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/>
              </svg>
            </a>
          </div>

          {/* Copyright in Copper Accent */}
          <span className="font-navigation text-[10px] text-[#8C4723] tracking-wider font-semibold text-center lg:text-right lg:whitespace-nowrap">
            {t.copyright}
          </span>
        </div>

      </div>
    </footer>
  );
}
