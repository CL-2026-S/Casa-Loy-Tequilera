import React, { useState, useEffect } from "react";

export default function Hero({ t, setPage }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Delayed load activation to trigger premium typography entrance animations
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-zinc-950">
      {/* Background Image with Slow Scale Zoom on Load */}
      <picture>
        <source media="(max-width: 768px)" srcSet="/Casa Loy Tequilera-movil.webp" />
        <source 
          media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
          srcSet="/Casa Loy Tequilera-retina.webp" 
        />
        <img
          alt="Agave Fields Hero"
          className={`absolute inset-0 w-full h-full object-cover grayscale-[10%] transition-transform duration-[4000ms] ease-out ${
            loaded ? "scale-100 brightness-[0.82]" : "scale-110 brightness-[0.70]"
          }`}
          src="/Casa Loy Tequilera-escritorio.webp"
        />
      </picture>
      
      {/* Gradient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>

      {/* Main Content Containers */}
      <div className="relative z-10 text-center max-w-5xl px-margin-mobile">
        {/* Animated Subtitle */}
        <div className="overflow-hidden mb-6">
          <span
            className={`font-label-caps text-[11px] text-white/80 tracking-[0.4em] uppercase block transition-all duration-[1200ms] ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            {t.hero.subtitle}
          </span>
        </div>

        {/* Animated Headline */}
        <h1
          className={`font-display-hero text-headline-lg-mobile md:text-display-hero text-white mb-10 leading-[1.1] transition-all duration-[1500ms] delay-200 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          {t.hero.title1} <br />
          <span className="italic font-light">{t.hero.title2}</span>
        </h1>

        {/* Animated Paragraph description */}
        <p
          className={`font-body-lg text-white/70 max-w-2xl mx-auto mb-14 font-light transition-all duration-[1500ms] delay-400 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {t.hero.desc}
        </p>

        {/* Interactive Call to Actions */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-[1500ms] delay-600 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <button
            onClick={() => setPage("turismo")}
            className="group flex items-center justify-center gap-4 bg-primary text-on-primary px-10 py-5 font-label-caps text-[10px] uppercase tracking-[0.3em] transition-organic hover:bg-secondary active:scale-[0.98] min-w-[260px] shadow-lg hover:shadow-primary/20"
          >
            {t.hero.btn1}
          </button>
          
          <button
            onClick={() => setPage("nativo")}
            className="group flex items-center justify-center border border-white/30 text-white px-10 py-5 font-label-caps text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#1c1c18] transition-organic active:scale-[0.98] min-w-[260px] backdrop-blur-sm"
          >
            {t.hero.btn2}
          </button>
        </div>
      </div>

      {/* Smooth Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white animate-pulse"></div>
      </div>
    </section>
  );
}
