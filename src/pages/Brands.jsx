import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const brands = [
  {
    id: "casa-loy",
    logo: "/Casa_Loy_Tequila_Logotipo.png",
    nameEs: "Casa Loy Tequilera",
    nameEn: "Casa Loy Tequilera",
    taglineEs: "Origen · Tradición · Jalisco",
    taglineEn: "Origin · Tradition · Jalisco",
    url: "https://casaloy.com",
    logoClass: "h-24 sm:h-28 md:h-32",
    bgAccent: "from-[#8C4723]/8 to-transparent",
    borderAccent: "border-[#8C4723]/20 hover:border-[#8C4723]/50",
    dotColor: "bg-[#8C4723]",
  },
  {
    id: "taddel",
    logo: "/TADDEL_Tequila_MX_Logotipo.png",
    nameEs: "TADDEL Tequila",
    nameEn: "TADDEL Tequila",
    taglineEs: "Diseño · Pureza · Vanguardia",
    taglineEn: "Design · Purity · Vanguard",
    url: "https://taddel.mx",
    logoClass: "h-20 sm:h-24 md:h-28",
    bgAccent: "from-[#1c1c18]/8 to-transparent",
    borderAccent: "border-[#1c1c18]/20 hover:border-[#1c1c18]/50",
    dotColor: "bg-[#1c1c18]",
  },
  {
    id: "tierra-zafiro",
    logo: "/Tierra_Zafiro_Tequila_Logotipo.png",
    nameEs: "Tierra Zafiro",
    nameEn: "Tierra Zafiro",
    taglineEs: "Misticismo · Agave · Cosmos",
    taglineEn: "Mysticism · Agave · Cosmos",
    url: "https://tierrazafiro.com",
    logoClass: "h-24 sm:h-28 md:h-32",
    bgAccent: "from-[#2d4a6e]/8 to-transparent",
    borderAccent: "border-[#2d4a6e]/20 hover:border-[#2d4a6e]/50",
    dotColor: "bg-[#2d4a6e]",
  },
];

function BrandCard({ brand, lang, index }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const label = lang === "es" ? brand.nameEs : brand.nameEn;
  const tagline = lang === "es" ? brand.taglineEs : brand.taglineEn;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`
        group relative flex flex-col items-center justify-center
        border ${brand.borderAccent}
        bg-white/70 backdrop-blur-sm
        p-12 sm:p-16 md:p-20
        overflow-hidden
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:shadow-[0_24px_64px_rgba(0,0,0,0.10)]
        hover:-translate-y-1
        select-none
        rounded-[2px]
      `}
      aria-label={label}
    >
      {/* Subtle gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${brand.bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />

      {/* Agave fiber texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center justify-center w-full mb-8">
        <motion.img
          src={brand.logo}
          alt={label}
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`${brand.logoClass} w-auto object-contain`}
          draggable={false}
        />
      </div>

      {/* Divider */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-12 h-[0.5px] bg-[#1c1c18]/25 mb-5 origin-left"
      />

      {/* Brand name */}
      <p
        className="relative z-10 text-[10px] tracking-[0.28em] font-bold text-[#1c1c18]/60 uppercase mb-2 text-center"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {label}
      </p>

      {/* Tagline */}
      <p
        className="relative z-10 text-[9px] tracking-[0.18em] text-[#1c1c18]/35 uppercase text-center"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {tagline}
      </p>

      {/* Bottom accent dot */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${brand.dotColor} opacity-0 group-hover:opacity-40 transition-all duration-500`}
      />
    </motion.div>
  );
}

export default function Brands({ t, lang }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const heroTitle = lang === "es" ? "Nuestras Marcas" : "Our Brands";
  const heroSub =
    lang === "es"
      ? "Portafolio de marcas destiladas con origen, carácter y distinción"
      : "A portfolio of brands distilled with origin, character and distinction";
  const portfolioLabel = lang === "es" ? "PORTAFOLIO" : "PORTFOLIO";

  return (
    <div className="pt-20 bg-[#fcf9f3] text-[#1c1c18] min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 py-24 md:py-32 overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/Fibras de Agave Cocido.webp')" }}
        />

        {/* Decorative lines */}
        <div className="absolute inset-y-0 left-8 md:left-16 w-[0.5px] bg-[#1c1c18]/8 pointer-events-none" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[0.5px] bg-[#1c1c18]/8 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl flex flex-col items-center gap-6"
        >
          {/* Overtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-[0.5px] bg-[#8C4723]/40" />
            <span
              className="text-[9px] tracking-[0.35em] font-bold text-[#8C4723] uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {portfolioLabel}
            </span>
            <div className="w-8 h-[0.5px] bg-[#8C4723]/40" />
          </div>

          {/* Title */}
          <h1
            className="text-[42px] sm:text-[60px] md:text-[80px] leading-none font-medium tracking-tight text-[#1c1c18]"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p
            className="text-[11px] sm:text-[12px] tracking-[0.18em] text-[#1c1c18]/50 uppercase max-w-md leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {heroSub}
          </p>
        </motion.div>
      </section>

      {/* Thin separator */}
      <div className="w-full h-[0.5px] bg-[#1c1c18]/8" />

      {/* Brand Grid */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {brands.map((brand, i) => (
            <BrandCard key={brand.id} brand={brand} lang={lang} index={i} />
          ))}
        </div>
      </section>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-center pb-20 px-6"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-[0.5px] bg-[#1c1c18]/15" />
          <span className="text-[#8C4723] text-[8px]">◆</span>
          <div className="w-16 h-[0.5px] bg-[#1c1c18]/15" />
        </div>
        <p
          className="text-[9px] tracking-[0.2em] text-[#1c1c18]/30 uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {lang === "es"
            ? "Casa Loy Tequilera · Grupo Empresarial"
            : "Casa Loy Tequilera · Business Group"}
        </p>
      </motion.div>
    </div>
  );
}
