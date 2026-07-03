import React from "react";

export default function Solutions({ t, setPage }) {
  const cards = [
    {
      id: "bottling",
      title: t.solutions.card1Title,
      desc: t.solutions.card1Desc,
      action: t.solutions.card1Action,
      img: "/Destilación.webp",
      route: "maquilas",
    },
    {
      id: "brands",
      title: t.solutions.card2Title,
      desc: t.solutions.card2Desc,
      action: t.solutions.card2Action,
      img: "/Casa Loy Tequilera-escritorio.webp",
      imgMobile: "/Casa Loy Tequilera-movil.webp",
      imgRetina: "/Casa Loy Tequilera-retina.webp",
      route: "brands",
    },
    {
      id: "experiences",
      title: t.solutions.card3Title,
      desc: t.solutions.card3Desc,
      action: t.solutions.card3Action,
      img: "/Banner Experiencias-escritorio.webp",
      imgMobile: "/Banner Experiencias-movil.webp",
      imgRetina: "/Banner Experiencias-retina.webp",
      route: "turismo",
    },
  ];

  return (
    <section className="py-section-gap bg-surface-container-low/30 border-y border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-24">
        <span className="font-label-caps text-primary text-[11px] uppercase tracking-[0.3em] block mb-6">
          {t.solutions.overtitle}
        </span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          {t.solutions.title}
        </h2>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setPage(card.route)}
            className="group relative aspect-[3/4.5] overflow-hidden cursor-pointer shadow-md text-left"
          >
            {/* Background Image zooming on Hover */}
            <picture>
              {card.imgMobile && <source media="(max-width: 768px)" srcSet={card.imgMobile} />}
              {card.imgRetina && (
                <source 
                  media="(min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 1024px) and (min-resolution: 192dpi)" 
                  srcSet={card.imgRetina} 
                />
              )}
              <img
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] cubic-bezier(0.22, 1, 0.36, 1) group-hover:scale-110"
                src={card.img}
              />
            </picture>

            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c18]/90 via-[#1c1c18]/25 to-transparent"></div>

            {/* Expanding/Contracting inner border */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-700 m-4"></div>

            {/* Content box details */}
            <div className="absolute bottom-0 left-0 p-10 w-full space-y-6">
              <h3 className="font-headline-md text-white text-3xl md:text-4xl">
                {card.title}
              </h3>
              
              {/* Delayed text reveal on hover */}
              <p className="font-body-md text-white/70 text-sm leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-16 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                {card.desc}
              </p>
              
              <button className="inline-block text-white border-b border-white/30 pb-2 font-label-caps text-[9px] uppercase tracking-[0.3em] hover:border-white hover:text-primary transition-all">
                {card.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
