import React from "react";

export default function Experience({ t, setPage }) {
  return (
    <section className="flex flex-col lg:flex-row min-h-[900px] bg-[#fcf9f3]">
      
      {/* Panel 1: Turismo Destilado */}
      <div className="lg:w-1/2 relative flex flex-col justify-end p-margin-mobile md:p-margin-desktop min-h-[500px] lg:min-h-0 group overflow-hidden border-b lg:border-b-0 lg:border-r border-outline-variant/10 text-left">
        {/* Grayscale hoverable Image */}
        <img
          alt="Turismo Casa Loy"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
          src="/Terraza.jpg"
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

        {/* Info Box */}
        <div className="relative z-10 max-w-lg space-y-8 text-left">
          <div className="space-y-4">
            <span className="font-label-caps text-secondary-fixed-dim text-[11px] uppercase tracking-[0.4em] block">
              {t.experience.card1Overtitle}
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white">
              {t.experience.card1Title}
            </h2>
          </div>
          <p className="font-body-lg text-white/70 text-base leading-relaxed font-light">
            {t.experience.card1Desc}
          </p>
          <button
            onClick={() => setPage("turismo")}
            className="bg-primary text-on-primary px-12 py-5 font-label-caps text-[10px] uppercase tracking-[0.3em] hover:bg-secondary active:scale-[0.98] transition-organic shadow-md"
          >
            {t.experience.card1Action}
          </button>
        </div>
      </div>

      {/* Panel 2: 1937 Nativo Gastronomía */}
      <div className="lg:w-1/2 relative flex flex-col justify-end p-margin-mobile md:p-margin-desktop min-h-[500px] lg:min-h-0 group overflow-hidden text-left">
        {/* Custom opacity scaling Image */}
        <img
          alt="1937 Nativo"
          className="absolute inset-0 w-full h-full object-cover opacity-75 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-90"
          src="/Restaurante 1937 Nativo.webp"
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent"></div>

        {/* Info Box */}
        <div className="relative z-10 max-w-lg space-y-8 text-left">
          <div className="space-y-4">
            <span className="font-label-caps text-tertiary-fixed-dim text-[11px] uppercase tracking-[0.4em] block">
              {t.experience.card2Overtitle}
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white italic font-light">
              {t.experience.card2Title}
            </h2>
          </div>
          <p className="font-body-lg text-white/70 text-base leading-relaxed font-light">
            {t.experience.card2Desc}
          </p>
          <button
            onClick={() => setPage("nativo")}
            className="bg-white text-on-surface px-12 py-5 font-label-caps text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary active:scale-[0.98] transition-organic shadow-md"
          >
            {t.experience.card2Action}
          </button>
        </div>
      </div>

    </section>
  );
}
