import React, { useState, useEffect } from "react";

export default function Brands({ t, lang }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const localT = {
    es: {
      overtitle: "EDITORIAL DE MARCAS",
      title: "El Legado",
      desc: "Una exploración sensorial a través de nuestras firmas más distinguidas. Pureza, paciencia y la maestría del tiempo traducidas en espíritu.",
      
      brand1Overtitle: "EDICIÓN LIMITADA",
      brand1Title: "Reserva de la Casa Loy",
      brand1Desc: "El pináculo de nuestra destilería. Un encuentro entre la nobleza del roble y la madurez del agave, custodiado bajo condiciones de quietud absoluta.",
      brand1Action: "EXPLORAR CUVÉE",
      
      brand2Overtitle: "ORIGEN & TRADICIÓN",
      brand2Title: "Casa Loy",
      brand2Desc: "Nuestra firma fundacional. Un homenaje directo a la tierra de Jalisco, donde el agave azul es transformado siguiendo procesos ancestrales que respetan la integridad de la materia prima.",
      brand2Action: "VER EL ORIGEN",
      
      brand3Overtitle: "VANGUARDIA",
      brand3Title: "Taddel",
      brand3Quote: '"La sofisticación no es añadir más, es quitar lo innecesario hasta encontrar la esencia."',
      brand3Desc: "Taddel representa el nuevo lujo. Un destilado cristalino de perfil técnico impecable, diseñado para los paladares que buscan la pureza absoluta y el diseño sensorial contemporáneo.",
      brand3Action: "DESCUBRIR DISEÑO",
      
      brand4Overtitle: "COSMOGONÍA",
      brand4Title: "Tierra Zafiro",
      brand4Desc: "Capturamos la energía de la noche y el misticismo del origen. Tierra Zafiro es un portal a lo ancestral, un destilado vibrante que honra los ciclos celestiales.",
      brand4Action1: "EL RITUAL",
      brand4Action2: "VER GALERÍA",
    },
    en: {
      overtitle: "BRANDS EDITORIAL",
      title: "The Legacy",
      desc: "A sensory exploration through our most distinguished signatures. Purity, patience, and the mastery of time translated into spirit.",
      
      brand1Overtitle: "LIMITED EDITION",
      brand1Title: "Reserva de la Casa Loy",
      brand1Desc: "The pinnacle of our distillery. An encounter between the nobility of oak and the maturity of agave, guarded under conditions of absolute stillness.",
      brand1Action: "EXPLORAR CUVÉE",
      
      brand2Overtitle: "ORIGIN & TRADITION",
      brand2Title: "Casa Loy",
      brand2Desc: "Our founding signature. A direct tribute to the land of Jalisco, where blue agave is transformed following ancestral processes that respect the raw material's integrity.",
      brand2Action: "VIEW THE ORIGIN",
      
      brand3Overtitle: "VANGUARD",
      brand3Title: "Taddel",
      brand3Quote: '"Sophistication is not adding more, it is removing the unnecessary until finding the essence."',
      brand3Desc: "Taddel represents new luxury. A crystalline spirit of impeccable technical profile, designed for palates seeking absolute purity and contemporary sensory design.",
      brand3Action: "DISCOVER DESIGN",
      
      brand4Overtitle: "COSMOGONY",
      brand4Title: "Tierra Zafiro",
      brand4Desc: "We capture the energy of the night and the mysticism of the origin. Tierra Zafiro is a portal to the ancestral, a vibrant distillate honoring celestial cycles.",
      brand4Action1: "THE RITUAL",
      brand4Action2: "VIEW GALLERY",
    }
  };

  const activeT = localT[lang] || localT["es"];

  return (
    <div className="pt-20 bg-background text-on-surface">
      {/* Hero Section */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-margin-mobile md:px-0 relative">
        <div className="max-w-5xl z-10 space-y-8">
          <span className="text-primary font-label-caps text-label-caps tracking-[0.5em] mb-4 block animate-pulse">
            {activeT.overtitle}
          </span>
          <h1 className="text-on-surface font-display-hero text-[56px] md:text-[100px] leading-none mb-6">
            {activeT.title}
          </h1>
          <div className="w-16 h-[1px] bg-primary/30 mx-auto mb-6"></div>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto leading-relaxed italic opacity-70">
            {activeT.desc}
          </p>
        </div>
      </section>

      {/* Block 1: Reserva de la Casa Loy */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop overflow-hidden border-t border-outline-variant/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 select-none">
            <div className="aspect-[16/10] bg-piedra-volcanica overflow-hidden shadow-2xl">
              <img
                alt="Reserva de la Casa Loy"
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                src="/Cava Tequilera Casa Loy.webp"
              />
            </div>
          </div>
          <div className="lg:col-span-5 text-left space-y-8 pl-0 lg:pl-10">
            <div className="flex items-center gap-4">
              <span className="font-serif italic text-4xl opacity-20 select-none">01</span>
              <span className="text-primary font-label-caps text-label-caps">{activeT.brand1Overtitle}</span>
            </div>
            <h2 className="text-on-surface font-display-hero text-4xl md:text-[56px] leading-tight font-medium">
              {activeT.brand1Title}
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-lg leading-loose opacity-80 max-w-md font-light">
              {activeT.brand1Desc}
            </p>
            <div>
              <a className="group inline-flex items-center gap-6 text-on-surface font-label-caps text-label-caps tracking-[0.25em] hover:text-primary transition-all" href="#">
                {activeT.brand1Action}
                <span className="w-12 h-[1px] bg-outline group-hover:bg-primary group-hover:w-20 transition-all duration-500"></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Casa Loy */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-[#EDE7DE]/30 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-8 pr-0 lg:pr-10 order-2 lg:order-1">
            <div className="flex items-center gap-4">
              <span className="font-serif italic text-4xl opacity-20 select-none">02</span>
              <span className="text-primary font-label-caps text-label-caps">{activeT.brand2Overtitle}</span>
            </div>
            <h2 className="text-on-surface font-display-hero text-4xl md:text-[56px] leading-tight font-medium">
              {activeT.brand2Title}
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-lg leading-loose opacity-80 max-w-md font-light">
              {activeT.brand2Desc}
            </p>
            <button className="bg-on-surface text-white px-12 py-5 font-label-caps text-label-caps tracking-widest hover:bg-primary active:scale-95 transition-all shadow-xl hover:-translate-y-1 duration-300">
              {activeT.brand2Action}
            </button>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="aspect-[4/3] bg-piedra-volcanica overflow-hidden shadow-2xl">
              <img
                alt="Bodega Casa Loy"
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                src="/Banner Casa Loy Tequila.webp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Block 3: Taddel */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 relative bg-white p-6 md:p-12 shadow-sm border border-outline-variant/10">
              <div className="absolute top-2 right-6 font-serif italic text-[120px] text-primary/5 select-none leading-none z-0">
                03
              </div>
              <div className="aspect-square bg-lino-canvas overflow-hidden relative z-10">
                <img
                  alt="Taddel Design"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                  src="/Banner TADDEL Tequila.webp"
                />
              </div>
            </div>
            <div className="lg:col-span-5 text-left space-y-8 pl-0 lg:pl-6">
              <span className="text-primary font-label-caps text-label-caps block">{activeT.brand3Overtitle}</span>
              <h2 className="text-on-surface font-display-hero text-4xl md:text-[56px] leading-tight italic font-light">
                {activeT.brand3Title}
              </h2>
              <div className="border-l border-primary/30 pl-8 mb-6">
                <p className="text-on-surface-variant font-body-lg text-body-lg italic opacity-70 leading-relaxed font-light">
                  {activeT.brand3Quote}
                </p>
              </div>
              <p className="text-on-surface-variant font-body-md leading-loose opacity-80 font-light">
                {activeT.brand3Desc}
              </p>
              <div className="pt-2">
                <a className="inline-flex items-center gap-4 border-b border-on-surface/30 pb-2 font-label-caps text-label-caps tracking-[0.3em] hover:text-primary hover:border-primary transition-all duration-300" href="#">
                  {activeT.brand3Action}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Tierra Zafiro */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-background text-center relative overflow-hidden">
        {/* Giant Number Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
          <span className="font-serif italic text-[50vw] leading-none">04</span>
        </div>
        <div className="max-w-4xl mx-auto mb-16 relative z-10 space-y-6">
          <span className="text-primary font-label-caps text-label-caps tracking-[0.2em] block">
            {activeT.brand4Overtitle}
          </span>
          <h2 className="text-on-surface font-display-hero text-5xl md:text-[84px] leading-none">
            {activeT.brand4Title}
          </h2>
          <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto leading-relaxed opacity-85 font-light">
            {activeT.brand4Desc}
          </p>
        </div>
        <div className="max-w-6xl mx-auto mb-20 relative z-10">
          <div className="aspect-[21/9] bg-piedra-volcanica overflow-hidden shadow-2xl">
            <img
              alt="Tierra Zafiro Agave"
              className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
              src="/Banner Tierra Zafio Tequila.webp"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-8 relative z-10">
          <button className="border border-on-surface/40 px-16 py-5 font-label-caps text-label-caps tracking-[0.3em] hover:bg-on-surface hover:text-white active:scale-95 transition-all duration-500">
            {activeT.brand4Action1}
          </button>
          <button className="bg-primary text-white px-16 py-5 font-label-caps text-label-caps tracking-[0.3em] hover:bg-secondary active:scale-95 transition-all shadow-xl hover:-translate-y-1 duration-300">
            {activeT.brand4Action2}
          </button>
        </div>
      </section>
    </div>
  );
}
