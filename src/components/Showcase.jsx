import React from "react";

export default function Showcase({ t, setPage }) {
  const brands = [
    {
      id: "casaloy",
      title: t.showcase.card1Title,
      desc: t.showcase.card1Desc,
      action: t.showcase.card1Action,
      label: "CASA LOY",
      bgColor: "bg-white border border-outline-variant/20",
      textColor: "text-primary/20 group-hover:text-primary/45",
      isDark: false,
    },
    {
      id: "taddel",
      title: t.showcase.card2Title,
      desc: t.showcase.card2Desc,
      action: t.showcase.card2Action,
      label: "TADDEL",
      bgColor: "bg-[#1c1c18]",
      textColor: "text-white/10 group-hover:text-white/25",
      isDark: true,
    },
    {
      id: "zafiro",
      title: t.showcase.card3Title,
      desc: t.showcase.card3Desc,
      action: t.showcase.card3Action,
      label: "TIERRA ZAFIRO",
      bgColor: "bg-primary",
      textColor: "text-white/20 group-hover:text-white/35",
      isDark: true,
    },
  ];

  return (
    <section className="py-section-gap bg-[#fcf9f3]">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Title Group */}
        <div className="mb-32 text-center space-y-4">
          <span className="font-label-caps text-primary text-[11px] uppercase tracking-[0.4em] block">
            {t.showcase.overtitle}
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {t.showcase.title}
            <span className="italic font-light">{t.showcase.titleItalic}</span>
          </h2>
          <div className="w-16 h-[1px] bg-outline-variant/30 mx-auto mt-8"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setPage("brands")}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              
              {/* Product Visual Container */}
              <div
                className={`w-full aspect-[3/4] flex items-center justify-center mb-14 transition-all duration-700 ease-out group-hover:shadow-2xl group-hover:-translate-y-4 relative overflow-hidden ${brand.bgColor}`}
              >
                {/* Corner Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr transition-all duration-700 opacity-0 group-hover:opacity-100 ${
                    brand.isDark
                      ? "from-white/5 to-transparent"
                      : "from-primary-container/10 to-transparent"
                  }`}
                ></div>

                {/* Rotated Editorial Decoration Text */}
                <div className="relative flex flex-col items-center z-10 select-none">
                  <span
                    className={`font-headline-md text-3xl md:text-4xl uppercase tracking-[0.4em] vertical-rl rotate-180 transition-organic ${brand.textColor}`}
                  >
                    {brand.label}
                  </span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-8 px-6">
                <h3 className="font-headline-md text-2xl uppercase tracking-[0.25em] text-on-surface">
                  {brand.title}
                </h3>
                
                <p className="font-body-md text-on-surface-variant/70 text-sm italic leading-relaxed font-light">
                  {brand.desc}
                </p>

                {/* High-End grow line Button */}
                <button className="group inline-flex items-center gap-4 text-on-surface font-label-caps text-[9px] uppercase tracking-[0.3em] transition-all">
                  {brand.action}
                  <span className="w-6 h-[1px] bg-on-surface/20 group-hover:w-12 group-hover:bg-primary transition-all duration-500"></span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
