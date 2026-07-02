import React, { useEffect, useState } from "react";

export default function BlogPost({ lang = "es", setPage }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    es: {
      category: "CULTURA & GASTRONOMÍA",
      title: "El Arte de la Cata: Una Inmersión en los Sentidos",
      author: "Maestro Tequilero",
      date: "24 de Octubre, 2024",
      quote: `"La cata no es simplemente el acto de beber; es un diálogo silencioso entre la tierra, el fuego y el alma humana, donde cada gota cuenta la historia de una herencia milenaria."`,
      p1: "Degustar un tequila de ultra-lujo como Casa Loy requiere de una disposición particular del espíritu. No buscamos el impacto inmediato del alcohol, sino la sutileza de los terpenos, la danza de los ésteres y la herencia del suelo volcánico que nutrió al agave durante años. En esta exploración sensorial, dividimos la experiencia en tres momentos fundamentales que definen el carácter de nuestro destilado.",
      p2: "La vista es nuestro primer contacto. Al inclinar la copa, observamos el 'cuerpo' del tequila a través de sus piernas o lágrimas que descienden lentamente por el cristal. Un reposado de Casa Loy exhibirá matices dorados que evocan los atardeceres de Los Altos, una transparencia cristalina que habla de una filtración impecable y una pureza técnica inigualable.",
      section1Title: "El Paisaje Aromático",
      section1Text: "Acercar la nariz a la copa es abrir una ventana al campo. Los aromas primarios nos remiten directamente al agave cocido, esa dulzura terrosa y profunda. Sin embargo, en Casa Loy, buscamos la complejidad. Aparecen notas cítricas de bergamota, matices florales y, tras el reposo en barrica, la vainilla y el clavo de olor se entrelazan sin opacar la esencia del espíritu original.",
      asideTitle: "NOTAS DEL MAESTRO",
      asideItem1Title: "Temperatura Ideal",
      asideItem1Text: "18°C a 20°C para apreciar toda la gama volátil.",
      asideItem2Title: "Cristalería",
      asideItem2Text: "Copa Riedel Tequila o copa de vino blanco para concentrar aromas.",
      asideItem3Title: "Maridaje Sugerido",
      asideItem3Text: "Chocolate amargo con sal de mar o frutas deshidratadas.",
      caption1: "Las barricas de roble blanco americano donde el tiempo se detiene.",
      section2Title: "El Retrogusto: La Memoria del Paladar",
      section2Text1: "El ataque en boca debe ser sedoso, casi aceitoso. Un gran tequila no debe quemar, sino abrazar. Al pasar el destilado por la lengua, descubrimos la mineralidad del suelo de Casa Loy. Es un equilibrio precario entre la potencia del alcohol y la delicadeza de los sabores naturales del agave.",
      section2Text2: "Finalmente, el final de boca o retrogusto es lo que diferencia a lo bueno de lo excepcional. En Casa Loy, buscamos una persistencia prolongada que deje un recuerdo de agave dulce y especias. Es el eco de la fermentación lenta y la destilación cuidadosa que resuena minutos después de haber terminado la copa.",
      terroirTitle: "El Terroir como Destino",
      terroirText: "Cada botella de Casa Loy es un mapa líquido de nuestra geografía única.",
      relatedTitle: "Historias Relacionadas",
      relatedAction: "Ver Journal",
      relatedCard1Cat: "Gastronomía",
      relatedCard1Title: "Maridaje Perfecto: Tequila y Cacao",
      relatedCard2Cat: "Proceso",
      relatedCard2Title: "La Jima: El Primer Grito de la Tierra",
      relatedCard3Cat: "Lifestyle",
      relatedCard3Title: "Hospitalidad de Lujo en Los Altos",
    },
    en: {
      category: "CULTURE & GASTRONOMY",
      title: "The Art of Tasting: An Immersion in the Senses",
      author: "Master Tequilero",
      date: "October 24, 2024",
      quote: `"Tasting is not merely the act of drinking; it is a silent dialogue between earth, fire, and the human soul, where every drop tells the story of a millennial heritage."`,
      p1: "Tasting an ultra-luxury tequila like Casa Loy requires a specific disposition of the spirit. We do not seek the immediate impact of alcohol, but the subtlety of terpenes, the dance of esters, and the heritage of the volcanic soil that nourished the agave for years. In this sensory exploration, we divide the experience into three fundamental stages that define the character of our distillate.",
      p2: "Sight is our first contact. By tilting the glass, we observe the 'body' of the tequila through its legs or tears that slowly descend down the crystal. A rested Casa Loy will exhibit golden hues evoking Los Altos sunsets, crystalline transparency speaking of impeccable filtration, and unmatched technical purity.",
      section1Title: "The Aromatic Landscape",
      section1Text: "Bringing the glass to the nose is opening a window to the fields. The primary aromas take us straight to cooked agave, that earthy, deep sweetness. However, at Casa Loy, we seek complexity. Citric notes of bergamot, floral nuances, and, after barrel resting, vanilla and clove intertwine without overshadowing the essence of the original spirit.",
      asideTitle: "MASTER'S NOTES",
      asideItem1Title: "Ideal Temperature",
      asideItem1Text: "18°C to 20°C (64°F to 68°F) to appreciate the full volatile range.",
      asideItem2Title: "Glassware",
      asideItem2Text: "Riedel Tequila glass or white wine glass to concentrate aromas.",
      asideItem3Title: "Suggested Pairing",
      asideItem3Text: "Dark chocolate with sea salt or dehydrated fruits.",
      caption1: "The American white oak barrels where time stands still.",
      section2Title: "The Aftertaste: The Palate's Memory",
      section2Text1: "The entry on the palate must be silky, almost oily. A great tequila should not burn, but embrace. As the distillate passes over the tongue, we discover the mineral nature of Casa Loy's soil. It is a delicate balance between the power of alcohol and the gentleness of agave's natural flavors.",
      section2Text2: "Finally, the finish or aftertaste is what differentiates the good from the exceptional. At Casa Loy, we seek a long persistence leaving a memory of sweet agave and spices. It is the echo of slow fermentation and careful distillation that resonates minutes after empty glass.",
      terroirTitle: "Terroir as Destiny",
      terroirText: "Every bottle of Casa Loy is a liquid map of our unique geography.",
      relatedTitle: "Related Stories",
      relatedAction: "View Journal",
      relatedCard1Cat: "Gastronomy",
      relatedCard1Title: "Perfect Pairing: Tequila & Cacao",
      relatedCard2Cat: "Process",
      relatedCard2Title: "La Jima: The Earth's First Cry",
      relatedCard3Cat: "Lifestyle",
      relatedCard3Title: "Luxury Hospitality in Los Altos",
    }
  };

  const t = content[lang];

  return (
    <div className="bg-background text-on-surface text-left">
      {/* Hero Section */}
      <header className="relative w-full h-[60vh] md:h-screen min-h-[500px] overflow-hidden">
        <img
          alt="Cata de Tequila en Casa Loy"
          className="w-full h-full object-cover"
          src="/Barra Casa Loy Experiencias.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="absolute bottom-margin-desktop left-gutter md:left-margin-desktop right-gutter md:right-margin-desktop max-w-container-max mx-auto">
          <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-4 block">
            {t.category}
          </span>
          <h1 className="font-serif text-4xl md:text-7xl lg:text-[84px] text-on-surface leading-tight max-w-4xl tracking-tight">
            {t.title}
          </h1>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter md:px-margin-desktop mt-20">
        {/* Author & Date */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-8 mb-20">
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {lang === "es" ? "Por: " : "By: "}
            <span className="font-bold text-on-surface uppercase not-italic tracking-wider">
              {t.author}
            </span>{" "}
            • {t.date}
          </p>
          <div className="flex gap-4">
            <span
              onClick={handleShare}
              className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors select-none"
              title="Copy link"
            >
              {copied ? "check" : "share"}
            </span>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors select-none">
              bookmark
            </span>
          </div>
        </div>

        {/* Article Intro Quote */}
        <section className="max-w-3xl mx-auto mb-24">
          <p className="font-serif text-2xl md:text-3xl text-on-surface-variant leading-relaxed text-center italic font-light">
            {t.quote}
          </p>
        </section>

        {/* Body Content */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-32">
          <div className="col-span-12 lg:col-span-8 space-y-8 text-lg md:text-xl text-on-surface-variant leading-relaxed font-light font-sans">
            <p className="first-letter:float-left first-letter:font-serif first-letter:text-[5rem] first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1 first-letter:text-primary first-letter:font-semibold">
              {t.p1}
            </p>
            <p>{t.p2}</p>

            <div className="pt-8">
              <h2 className="font-serif text-3xl md:text-5xl mb-6 text-primary tracking-tight font-medium">
                {t.section1Title}
              </h2>
              <p className="mb-6">{t.section1Text}</p>
            </div>
          </div>

          <aside className="col-span-12 lg:col-start-10 lg:col-span-3 sticky top-32 h-fit mt-12 lg:mt-0">
            <div className="bg-background/40 backdrop-blur-xl border border-outline-variant/20 p-8 space-y-6 shadow-sm">
              <h3 className="font-label-caps text-label-caps text-primary border-b border-primary/20 pb-4 tracking-widest font-bold">
                {t.asideTitle}
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem1Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem1Text}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem2Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem2Text}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-on-surface uppercase text-xs tracking-wider mb-1">
                    {t.asideItem3Title}
                  </p>
                  <p className="text-sm text-on-surface-variant/80 font-light">
                    {t.asideItem3Text}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </article>

        {/* Visual Interlude 1 */}
        <figure className="w-full mb-32">
          <div className="h-[400px] md:h-[600px] overflow-hidden shadow-sm">
            <img
              alt="Oak barrels cellar"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              src="/Añejamiento Barricas.webp"
            />
          </div>
          <figcaption className="mt-4 font-body-md text-body-md italic text-center text-on-surface-variant/70 font-light">
            {t.caption1}
          </figcaption>
        </figure>

        {/* Body Content 2 */}
        <section className="max-w-4xl mx-auto mb-32 space-y-12 text-left">
          <h2 className="font-serif text-3xl md:text-5xl text-center tracking-tight font-medium">
            {t.section2Title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-on-surface-variant leading-relaxed font-light">
            <p>{t.section2Text1}</p>
            <p>{t.section2Text2}</p>
          </div>
        </section>

        {/* Visual Interlude 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-32 h-auto lg:h-[500px]">
          <div className="lg:col-span-8 overflow-hidden h-[300px] lg:h-full shadow-sm">
            <img
              alt="Blue agave fields panoramic"
              className="w-full h-full object-cover"
              src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
            />
          </div>
          <div className="lg:col-span-4 bg-primary p-12 flex flex-col justify-center text-white text-left shadow-sm">
            <span className="material-symbols-outlined text-4xl mb-6 font-light">eco</span>
            <h3 className="font-serif text-3xl mb-4 leading-tight font-medium italic">
              {t.terroirTitle}
            </h3>
            <p className="text-base opacity-90 font-light leading-relaxed">{t.terroirText}</p>
          </div>
        </div>

        {/* Related Stories */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-outline-variant/30 pb-4">
            <h2 className="font-serif text-3xl tracking-tight font-medium">{t.relatedTitle}</h2>
            <button
              onClick={() => setPage("blog")}
              className="font-label-caps text-label-caps text-primary border-b border-primary hover:opacity-75 transition-opacity tracking-widest font-bold"
            >
              {t.relatedAction}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("blog")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Tequila and Chocolate pairing"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Platillo 5 1937 Nativo.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard1Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard1Title}
              </h4>
            </div>
            {/* Card 2 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("about")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Agave Jima Harvesting"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Jimado Empleado Casa Loy Tequilera.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard2Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard2Title}
              </h4>
            </div>
            {/* Card 3 */}
            <div className="group cursor-pointer text-left" onClick={() => setPage("turismo")}>
              <div className="aspect-[4/5] overflow-hidden mb-6 shadow-sm">
                <img
                  alt="Luxury resort lounge in Los Altos"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="/Terraza Casa Loy Experiencias.webp"
                />
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant/60 block mb-2 uppercase tracking-widest">
                {t.relatedCard3Cat}
              </span>
              <h4 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors font-medium">
                {t.relatedCard3Title}
              </h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
