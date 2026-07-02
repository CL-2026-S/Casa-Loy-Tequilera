import React from "react";

export default function Introduction({ t, setPage }) {
  return (
    <section className="py-section-gap bg-[#fcf9f3] overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4 animate-on-scroll">
              <span className="font-label-caps text-primary text-[11px] uppercase tracking-[0.3em] block">
                {t.intro.overtitle}
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-[1.1]">
                {t.intro.title}
                <span className="italic font-light text-primary">
                  {t.intro.titleItalic}
                </span>
                .
              </h2>
            </div>
            
            <div className="space-y-8 max-w-md">
              <p className="font-body-lg text-on-surface-variant leading-relaxed font-light">
                {t.intro.desc1}
              </p>
              <p className="font-body-md text-on-surface-variant/80 font-light">
                {t.intro.desc2}
              </p>
            </div>

            {/* Custom Interactive editorial Link */}
            <div className="pt-6">
              <button
                onClick={() => setPage("about")}
                className="group inline-flex items-center gap-6 font-label-caps text-[10px] text-primary uppercase tracking-[0.4em] transition-all"
              >
                {t.intro.action}
                <div className="relative w-12 h-[1px] bg-primary/30 group-hover:w-18 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Asymmetrical Image Column */}
          <div className="lg:col-span-6 lg:col-start-7 relative mt-16 lg:mt-0">
            <div className="aspect-[4/5] overflow-hidden shadow-md border border-outline-variant/15">
              <img
                alt="Distillery Detail"
                className="w-full h-full object-cover transition-organic duration-1000 scale-100 hover:scale-105"
                src="/Casa Loy Tequilera.webp"
              />
            </div>

            {/* Overlapping floating Badge with glassmorphism */}
            <div className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 flex items-center justify-center w-48 h-48 md:w-56 md:h-56 bg-surface-container-high/90 backdrop-blur-xl border border-white/20 p-8 shadow-xl transition-transform duration-500 hover:scale-105">
              <div className="text-center select-none">
                <span className="font-headline-md text-5xl md:text-6xl block mb-2 text-primary">
                  {t.intro.badgeVal}
                </span>
                <span className="font-label-caps text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-semibold">
                  {t.intro.badgeLabel}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
