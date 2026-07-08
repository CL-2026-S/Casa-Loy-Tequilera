import React, { useState, useEffect, useRef } from "react";

const timeline = [
  {
    year: "1937",
    title: "Nace Un Legado",
    desc: "Nace Don Manuel Loy Aceves en Ayotlán, Jalisco, figura central del legado familiar y punto de partida de una historia construida con trabajo, visión y arraigo a la tierra.",
    img: "/Don Manuel Loy.webp",
  },
  {
    year: "Décadas Posteriores",
    title: "El Campo Como Origen",
    desc: "La familia Loy desarrolla una sólida experiencia en el sector agropecuario, especialmente en la crianza y comercialización de ganado porcino. Esta etapa marca la base productiva y familiar de lo que más tarde se convertiría en un ecosistema empresarial.",
    img: "/siembra-escritorio.webp",
    imgMobile: "/siembra-movil.webp",
    imgRetina: "/siembra-retina.webp",
  },
  {
    year: "1963",
    title: "IPASA Procesos Agropecuarios",
    desc: "Se vincula el origen de IPASA Procesos Agropecuarios, dedicada a la producción porcina en Ayotlán, Jalisco. Esta empresa representa una de las primeras raíces agropecuarias del grupo.",
    img: "/IPASA-escritorio.webp",
    imgMobile: "/IPASA-movil.webp",
    imgRetina: "/IPASA-retina.webp",
  },
  {
    year: "1985",
    title: "Grupo ORBE XXI",
    desc: "Con el paso de los años, la visión familiar toma forma empresarial. Nace Grupo ORBE XXI como una expresión de crecimiento, unión y continuidad; un ecosistema construido con paciencia, decisiones firmes y una mirada puesta en el futuro.",
    img: "/ORBE-escritorio.webp",
    imgMobile: "/ORBE-movil.webp",
    imgRetina: "/ORBE-retina.webp",
  },
  {
    year: "1990",
    title: "OMEX Alimentaria",
    desc: "Don Manuel Loy Aceves impulsa OMEX Alimentaria, empresa enfocada en carnes frías, embutidos y productos alimenticios. Con ella, la familia avanza de la producción agropecuaria hacia la industrialización de alimentos.",
    img: "/OMEX-escritorio.webp",
    imgMobile: "/OMEX-movil.webp",
    imgRetina: "/OMEX-retina.webp",
  },
  {
    year: "1992",
    title: "Teknoagrox",
    desc: "Teknoagrox nace como respuesta al campo y sus necesidades. La innovación se une a la experiencia agrícola, fortaleciendo una relación profunda con la tierra y con quienes la trabajan todos los días.",
    img: "/tecno-escritorio.webp",
    imgMobile: "/tecno-movil.webp",
    imgRetina: "/tecno-retina.webp",
  },
  {
    year: "2004",
    title: "Nutriagaves",
    desc: "El agave comienza a ocupar un lugar esencial en esta historia. Nace Nutriagaves, dedicada a la producción de miel de agave y productos derivados, con presencia en mercados internacionales.",
    img: "/nutriagaves-escritorio.webp",
    imgMobile: "/nutriagaves-movil.webp",
    imgRetina: "/nutriagaves-retina.webp",
  },
  {
    year: "2015",
    title: "PAOSA / Procesadora De Alimentos OMEX",
    desc: "Se consolida PAOSA, Procesadora de Alimentos OMEX, orientada a productos cárnicos de cerdo bajo procesos de calidad e inocuidad. Esta etapa fortalece la experiencia del grupo en transformación, producción y control alimentario.",
    img: "/paosa-escritorio.webp",
    imgMobile: "/paosa-movil.webp",
    imgRetina: "/paosa-retina.webp",
  },
  {
    year: "2017",
    title: "Loydeal",
    desc: "Con Loydeal, la familia diversifica su presencia empresarial a través de una red de carnicerías, acercando sus productos al consumidor final y ampliando su vínculo con el mercado.",
    img: "/loydeal-escritorio.webp",
    imgRetina: "/loydeal-retina.webp",
  },
  {
    year: "2019",
    title: "Comienza A Levantarse Un Sueño",
    desc: "Inicia la construcción de Casa Loy Tequilera. Más que levantar muros, comienza a tomar forma un sueño familiar: un espacio donde años de trabajo agrícola, visión empresarial y amor por el agave se transformarían en tequila.",
    img: "/Construcción Casa Loy Tequilera.webp",
  },
  {
    year: "2021",
    title: "La Casa Queda En Pie",
    desc: "Concluye la construcción de Casa Loy Tequilera. Lo que alguna vez fue una idea empieza a sentirse real: la casa está lista para recibir al agave, al fuego, al tiempo y a las manos que darían vida a una nueva etapa del legado familiar.",
    img: "/Casa Loy Tequilera 2.webp",
  },
  {
    year: "2021",
    title: "Nace Casa Loy Tequilera",
    desc: "Casa Loy Tequilera nace como resultado natural de una historia construida durante generaciones. No surge de la casualidad, sino de una herencia de trabajo, campo, familia y visión. Es una casa creada para honrar el origen y proyectarlo hacia el futuro.",
    img: "/Inaguración Casa Loy Tequilera.webp",
  },
  {
    year: "2022",
    title: "La Certificación Que Abre El Camino",
    desc: "Casa Loy Tequilera obtiene la certificación del Consejo Regulador del Tequila bajo la NOM 1633. Con este paso, queda autorizada para producir tequila oficialmente, marcando el inicio de una nueva historia dentro de la industria tequilera.",
    img: "/nom-escritorio.webp",
    imgMobile: "/nom-movil.webp",
    imgRetina: "/nom-retina.webp",
  },
  {
    year: "2022",
    title: "Casa Loy Abre Sus Puertas",
    desc: "La casa abre sus puertas y con ellas inicia una nueva etapa. A partir de este momento, el legado familiar comienza a expresarse en aromas, procesos, sabores y botellas que llevan consigo años de trabajo silencioso en el campo.",
    img: "/Casa Loy Tequilera Instalaciones 2.webp",
  },
  {
    year: "2022",
    title: "Nacen Las Marcas",
    desc: "Se lanzan Casa Loy Tequila, TADDEL y Tierra Zafiro. Cada marca representa una forma distinta de interpretar el agave, pero todas comparten un mismo origen: una familia que decidió transformar su historia en identidad.",
    img: "/Casa Loy Tequilera-escritorio.webp",
    imgMobile: "/Casa Loy Tequilera-movil.webp",
    imgRetina: "/Casa Loy Tequilera-retina.webp",
  },
  {
    year: "2023",
    title: "Una Identidad Lista Para El Mundo",
    desc: "Casa Loy Tequilera inicia una etapa de consolidación de marcas e identidad. La casa se prepara para llegar al mercado con una propuesta clara, memorable y fiel a sus raíces.",
    img: "/Cava Tequilera Casa Loy.webp",
  },
  {
    year: "2024",
    title: "La Historia Cruza Fronteras",
    desc: "Casa Loy Tequilera llega a Estados Unidos y Guatemala. Lo que nació desde la tierra y la familia comienza a viajar más lejos, llevando consigo el sabor, el carácter y la historia de Casa Loy.",
    img: "/Empleado Casa Loy Tequilera en campos de Ayotlán.webp",
  },
  {
    year: "2025",
    title: "El Regreso A La Tradición",
    desc: "La casa incorpora el método de producción con tahona, una técnica ancestral que exige paciencia, fuerza y respeto por el agave. Con este paso, Casa Loy no solo mira hacia el futuro: también vuelve al origen, a los procesos que honran el tiempo y la tradición.",
    img: "/molienda-escritorio.webp",
    imgMobile: "/molienda-movil.webp",
    imgRetina: "/molienda-retina.webp",
  },
  {
    year: "2025",
    title: "Apertura De Restaurante 1937 Nativo",
    desc: "Casa Loy expande su universo de marca con la apertura de Restaurante 1937 Nativo, un espacio con propuesta gastronómica y barra de mixología de autor, diseñado para elevar los sabores de la cocina contemporánea y maridarlos con destilados propios.",
    img: "/Restaurante 1937 Nativo Inaguración.webp",
  },
  {
    year: "2026",
    title: "Piedra Y Agave",
    desc: "Nace Casa Loy Piedra y Agave, la primera expresión elaborada con tahona. Un tequila que reúne tierra, legado, piedra y paciencia; una creación que no solo se bebe, también se cuenta, se recuerda y se comparte.",
    img: "/Banner Casa Loy Piedra y Agave-escritorio.webp",
    imgMobile: "/Banner Casa Loy Piedra y Agave-movil.webp",
    imgRetina: "/Banner Casa Loy Piedra y Agave-retina.webp",
  },
  {
    year: "2026",
    title: "Nuevas Fronteras",
    desc: "Casa Loy Tequilera continúa su crecimiento y llega a Colombia. La historia sigue avanzando, cruzando caminos y llevando su esencia a nuevos territorios, sin olvidar nunca el lugar donde todo comenzó: la tierra, la familia y el agave.",
    img: "/Barra Casa Loy Experiencias.webp",
  },
];

function TimelinePairRow({ pair, pairIdx }) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.1,
      }
    );

    const currentElement = rowRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const transitionClass = isVisible
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 translate-y-8 scale-[0.98]";

  const itemA = pair[0];
  const itemB = pair[1];

  return (
    <div
      ref={rowRef}
      className={`relative min-h-[65vh] lg:min-h-[72vh] flex flex-col justify-center py-10 lg:py-0 group transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${transitionClass}`}
    >
      {/* Central timeline axis line */}
      <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#8C4723]/10 via-[#8C4723]/30 to-[#8C4723]/10 -translate-x-1/2" />

      {/* Desktop Layout (lg+) */}
      <div className="hidden lg:flex lg:flex-col lg:gap-6 lg:w-full lg:relative z-10">
        
        {/* Left Content (Item A) */}
        <div className="relative w-full py-4 group/item">
          {/* Dot for Item A */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#8C4723] bg-[#F7F4EE] z-10 transition-all duration-500
              group-hover/item:scale-130 group-hover/item:bg-[#8C4723] group-hover/item:border-white shadow-sm"
          />

          <div className="w-[calc(50%-2.5rem)] mr-auto ml-0 text-right flex flex-row-reverse items-center justify-end gap-6 pr-6">
            {/* Narrative Text */}
            <div className="flex-1 space-y-1.5 max-w-[340px]">
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#8C4723] block leading-none transition-colors duration-500 group-hover/item:text-[#b06137]">
                {itemA.year}
              </span>
              <h3 className="font-serif text-base lg:text-lg italic font-semibold text-[#1A1615] leading-snug">
                {itemA.title}
              </h3>
              <p className="text-[#1A1615]/75 font-sans text-xs lg:text-[13px] leading-relaxed font-light">
                {itemA.desc}
              </p>
            </div>

            {/* Photograph Frame */}
            <div className="relative flex-shrink-0 w-44 lg:w-48 xl:w-56 aspect-square overflow-hidden border border-[#8C4723]/15 bg-white/30 shadow-sm transition-all duration-700 group-hover/item:shadow-md rounded-full">
              <picture className="w-full h-full">
                {itemA.imgMobile && <source media="(max-width: 768px)" srcSet={itemA.imgMobile} />}
                <img
                  alt={itemA.title}
                  className="w-full h-full object-cover grayscale opacity-95 transition-all duration-[1200ms] group-hover/item:grayscale-0 group-hover/item:scale-[1.05] group-hover/item:opacity-100 ease-out"
                  src={itemA.img}
                  srcSet={itemA.imgRetina ? `${itemA.imgRetina} 2x` : undefined}
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Right Content (Item B) */}
        {itemB && (
          <div className="relative w-full py-4 group/item">
            {/* Dot for Item B */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#8C4723] bg-[#F7F4EE] z-10 transition-all duration-500
                group-hover/item:scale-130 group-hover/item:bg-[#8C4723] group-hover/item:border-white shadow-sm"
            />

            <div className="w-[calc(50%-2.5rem)] ml-auto mr-0 text-left flex flex-row items-center justify-start gap-6 pl-6">
              {/* Photograph Frame */}
              <div className="relative flex-shrink-0 w-44 lg:w-48 xl:w-56 aspect-square overflow-hidden border border-[#8C4723]/15 bg-white/30 shadow-sm transition-all duration-700 group-hover/item:shadow-md rounded-full">
                <picture className="w-full h-full">
                  {itemB.imgMobile && <source media="(max-width: 768px)" srcSet={itemB.imgMobile} />}
                  <img
                    alt={itemB.title}
                    className="w-full h-full object-cover grayscale opacity-95 transition-all duration-[1200ms] group-hover/item:grayscale-0 group-hover/item:scale-[1.05] group-hover/item:opacity-100 ease-out"
                    src={itemB.img}
                    srcSet={itemB.imgRetina ? `${itemB.imgRetina} 2x` : undefined}
                  />
                </picture>
              </div>

              {/* Narrative Text */}
              <div className="flex-1 space-y-1.5 max-w-[340px]">
                <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#8C4723] block leading-none transition-colors duration-500 group-hover/item:text-[#b06137]">
                  {itemB.year}
                </span>
                <h3 className="font-serif text-base lg:text-lg italic font-semibold text-[#1A1615] leading-snug">
                  {itemB.title}
                </h3>
                <p className="text-[#1A1615]/75 font-sans text-xs lg:text-[13px] leading-relaxed font-light">
                  {itemB.desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile/Tablet Layout (<lg) */}
      <div className="flex flex-col gap-12 lg:hidden relative z-10 pl-10 pr-4">
        {/* Item A */}
        <div className="relative w-full flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Dot for Item A */}
          <div className="absolute left-[-26px] top-8 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#8C4723] bg-[#F7F4EE] z-10" />
          
          <div className="flex-1 space-y-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-[#8C4723] block leading-none">
              {itemA.year}
            </span>
            <h3 className="font-serif text-base italic font-semibold text-[#1A1615] leading-snug">
              {itemA.title}
            </h3>
            <p className="text-[#1A1615]/75 font-sans text-xs leading-relaxed font-light">
              {itemA.desc}
            </p>
          </div>
          <div className="relative flex-shrink-0 w-full max-w-[200px] aspect-square overflow-hidden border border-[#8C4723]/15 bg-white/30 shadow-sm rounded-full">
            <picture className="w-full h-full">
              {itemA.imgMobile && <source media="(max-width: 768px)" srcSet={itemA.imgMobile} />}
              <img
                alt={itemA.title}
                className="w-full h-full object-cover"
                src={itemA.img}
                srcSet={itemA.imgRetina ? `${itemA.imgRetina} 2x` : undefined}
              />
            </picture>
          </div>
        </div>

        {/* Item B */}
        {itemB && (
          <div className="relative w-full flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Dot for Item B */}
            <div className="absolute left-[-26px] top-8 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#8C4723] bg-[#F7F4EE] z-10" />

            <div className="flex-1 space-y-1.5">
              <span className="font-serif text-xl font-bold tracking-tight text-[#8C4723] block leading-none">
                {itemB.year}
              </span>
              <h3 className="font-serif text-base italic font-semibold text-[#1A1615] leading-snug">
                {itemB.title}
              </h3>
              <p className="text-[#1A1615]/75 font-sans text-xs leading-relaxed font-light">
                {itemB.desc}
              </p>
            </div>
            {itemB.img && (
              <div className="relative flex-shrink-0 w-full max-w-[200px] aspect-square overflow-hidden border border-[#8C4723]/15 bg-white/30 shadow-sm rounded-full">
                <picture className="w-full h-full">
                  {itemB.imgMobile && <source media="(max-width: 768px)" srcSet={itemB.imgMobile} />}
                  <img
                    alt={itemB.title}
                    className="w-full h-full object-cover"
                    src={itemB.img}
                    srcSet={itemB.imgRetina ? `${itemB.imgRetina} 2x` : undefined}
                  />
                </picture>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const timelineEn = [
  {
    year: "1937",
    title: "A Legacy is Born",
    desc: "Don Manuel Loy Aceves is born in Ayotlán, Jalisco, a central figure of the family legacy and the starting point of a story built with work, vision, and deep roots in the land.",
    img: "/Don Manuel Loy.webp",
  },
  {
    year: "Subsequent Decades",
    title: "The Field as Origin",
    desc: "The Loy family develops solid experience in the agricultural sector, particularly in swine breeding and commercialization. This stage builds the family and productive foundation of what would later become a business ecosystem.",
    img: "/siembra-escritorio.webp",
    imgMobile: "/siembra-movil.webp",
    imgRetina: "/siembra-retina.webp",
  },
  {
    year: "1963",
    title: "IPASA Agricultural Processes",
    desc: "The origin of IPASA Procesos Agropecuarios is established, dedicated to pig farming in Ayotlán, Jalisco. This company represents one of the group's earliest agricultural roots.",
    img: "/IPASA-escritorio.webp",
    imgMobile: "/IPASA-movil.webp",
    imgRetina: "/IPASA-retina.webp",
  },
  {
    year: "1985",
    title: "Grupo ORBE XXI",
    desc: "Over the years, the family vision takes corporate shape. Grupo ORBE XXI is born as an expression of growth, unity, and continuity; an ecosystem built with patience, firm decisions, and a forward-looking vision.",
    img: "/ORBE-escritorio.webp",
    imgMobile: "/ORBE-movil.webp",
    imgRetina: "/ORBE-retina.webp",
  },
  {
    year: "1990",
    title: "OMEX Alimentaria",
    desc: "Don Manuel Loy Aceves drives OMEX Alimentaria, a company focused on cold cuts, sausages, and food products. With it, the family advances from farming to food industrialization.",
    img: "/OMEX-escritorio.webp",
    imgMobile: "/OMEX-movil.webp",
    imgRetina: "/OMEX-retina.webp",
  },
  {
    year: "1992",
    title: "Teknoagrox",
    desc: "Teknoagrox is born as a response to the countryside and its needs. Innovation joins agricultural experience, strengthening a deep bond with the land and those who work it daily.",
    img: "/tecno-escritorio.webp",
    imgMobile: "/tecno-movil.webp",
    imgRetina: "/tecno-retina.webp",
  },
  {
    year: "2004",
    title: "Nutriagaves",
    desc: "Agave begins to occupy an essential place in this history. Nutriagaves is born, dedicated to the production of agave nectar and derived products, with a presence in international markets.",
    img: "/nutriagaves-escritorio.webp",
    imgMobile: "/nutriagaves-movil.webp",
    imgRetina: "/nutriagaves-retina.webp",
  },
  {
    year: "2015",
    title: "PAOSA / OMEX Food Processor",
    desc: "PAOSA is consolidated, oriented towards pork meat products under strict quality and safety processes. This stage strengthens the group's experience in food processing and control.",
    img: "/paosa-escritorio.webp",
    imgMobile: "/paosa-movil.webp",
    imgRetina: "/paosa-retina.webp",
  },
  {
    year: "2017",
    title: "Loydeal",
    desc: "With Loydeal, the family diversifies its commercial presence through a network of butcher shops, bringing its products closer to the end consumer and expanding its market reach.",
    img: "/loydeal-escritorio.webp",
    imgRetina: "/loydeal-retina.webp",
  },
  {
    year: "2019",
    title: "A Dream Begins to Rise",
    desc: "Construction of Casa Loy Tequilera begins. More than raising walls, a family dream begins to take shape: a space where years of agricultural work, business vision, and love for agave would transform into tequila.",
    img: "/Construcción Casa Loy Tequilera.webp",
  },
  {
    year: "2021",
    title: "The House Stands Tall",
    desc: "Construction of Casa Loy Tequilera concludes. What was once an idea starts to feel real: the house is ready to receive agave, fire, time, and the hands that would give life to a new stage of the family legacy.",
    img: "/Casa Loy Tequilera 2.webp",
  },
  {
    year: "2021",
    title: "Casa Loy Tequilera is Born",
    desc: "Casa Loy Tequilera is born as the natural result of a history built over generations. It does not arise from chance, but from a legacy of work, country, family, and vision. It is a house created to honor the origin and project it to the future.",
    img: "/Inaguración Casa Loy Tequilera.webp",
  },
  {
    year: "2022",
    title: "The Certification that Opens the Way",
    desc: "Casa Loy Tequilera obtains certification from the Tequila Regulatory Council under NOM 1633. With this step, it is officially authorized to produce tequila, marking the beginning of a new story within the tequila industry.",
    img: "/nom-escritorio.webp",
    imgMobile: "/nom-movil.webp",
    imgRetina: "/nom-retina.webp",
  },
  {
    year: "2022",
    title: "Casa Loy Opens Its Doors",
    desc: "The house opens its doors, initiating a new stage. From this moment on, the family legacy begins to express itself in aromas, processes, flavors, and bottles that carry years of silent work in the field.",
    img: "/Casa Loy Tequilera Instalaciones 2.webp",
  },
  {
    year: "2022",
    title: "The Brands are Born",
    desc: "Casa Loy Tequila, TADDEL, and Tierra Zafiro are launched. Each brand represents a different way of interpreting agave, but all share a common origin: a family that decided to transform its history into identity.",
    img: "/Casa Loy Tequilera-escritorio.webp",
    imgMobile: "/Casa Loy Tequilera-movil.webp",
    imgRetina: "/Casa Loy Tequilera-retina.webp",
  },
  {
    year: "2023",
    title: "An Identity Ready for the World",
    desc: "Casa Loy Tequilera begins a stage of brand and identity consolidation. The house prepares to enter the market with a clear, memorable proposal true to its roots.",
    img: "/Cava Tequilera Casa Loy.webp",
  },
  {
    year: "2024",
    title: "History Crosses Borders",
    desc: "Casa Loy Tequilera reaches the United States and Guatemala. What was born from the land and family begins to travel further, carrying the flavor, character, and history of Casa Loy.",
    img: "/Empleado Casa Loy Tequilera en campos de Ayotlán.webp",
  },
  {
    year: "2025",
    title: "The Return to Tradition",
    desc: "The house incorporates the tahona production method, an ancestral technique demanding patience, strength, and respect for agave. With this step, Casa Loy not only looks to the future: it also returns to the origin, to the processes honoring time and tradition.",
    img: "/molienda-escritorio.webp",
    imgMobile: "/molienda-movil.webp",
    imgRetina: "/molienda-retina.webp",
  },
  {
    year: "2025",
    title: "Opening of Restaurante 1937 Nativo",
    desc: "Casa Loy expands its brand universe with the opening of Restaurante 1937 Nativo, a space offering a gastronomic concept and signature mixology bar, designed to elevate contemporary flavors and pair them with our own spirits.",
    img: "/Restaurante 1937 Nativo Inaguración.webp",
  },
  {
    year: "2026",
    title: "Piedra y Agave",
    desc: "Casa Loy Piedra and Agave is born, the first expression crafted with tahona. A tequila uniting land, legacy, stone, and patience; a creation that is not only tasted, but also narrated, remembered, and shared.",
    img: "/Banner Casa Loy Piedra y Agave-escritorio.webp",
    imgMobile: "/Banner Casa Loy Piedra y Agave-movil.webp",
    imgRetina: "/Banner Casa Loy Piedra y Agave-retina.webp",
  },
  {
    year: "2026",
    title: "New Frontiers",
    desc: "Casa Loy Tequilera continues its growth and arrives in Colombia. The story keeps moving forward, crossing paths and bringing its essence to new territories, never forgetting where it all began: the land, the family, and the agave.",
    img: "/Barra Casa Loy Experiencias.webp",
  },
];

export default function AboutUs({ t, lang, setPage }) {
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    let interval = null;
    let timer = null;
    const stepDuration = 6000; // 6 seconds per step

    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 8);
      }, stepDuration);

      const tick = 100;
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + (tick / stepDuration) * 100;
        });
      }, tick);
    } else {
      setProgress(0);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isPlaying]);

  useEffect(() => {
    setProgress(0);
  }, [activeStep]);

  const activeTimeline = lang === "en" ? timelineEn : timeline;
  const groupedTimeline = [];
  for (let i = 0; i < activeTimeline.length; i += 2) {
    groupedTimeline.push(activeTimeline.slice(i, i + 2));
  }

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const localT = {
    es: {
      heroOvertitle: "HERENCIA & EXCELENCIA",
      heroTitlePart1: "La raíz",
      heroTitlePart2: "de un",
      heroTitleItalic: "legado.",
      heroQuote: '"Nacimos de la profundidad de la tierra roja de Ayotlán, donde la paciencia se entrelaza con la visión familiar."',
      heroDesc1: "Nuestras raíces se hunden en el fértil suelo de Jalisco a través de empresas pilares como OMEX, NUTRIAGAVES, IPASA y PAOSA. Esta sólida base agroindustrial nos permitió dominar el ciclo completo del agave mucho antes de la primera gota.",
      heroDesc2: "Hoy, arropados bajo el ala de Grupo Orbe XXI, nuestra historia ha evolucionado. Dejamos de ser solo guardianes del campo para convertirnos en artesanos del destino; creadores que transforman el esfuerzo de la tierra en experiencias sensoriales únicas.",
      originText: "Ayotlán, Jalisco",
      originSub: "El origen de nuestra tierra roja",
      timelineOvertitle: "CRONOLOGÍA",
      timelineTitle: "Una Historia con Raíz",
      sustainabilityOvertitle: "CONCIENCIA AMBIENTAL",
      sustainabilityTitle: "Gratitud a la Tierra",
      sustainabilityDesc: "Honramos la tierra que nos da origen. Por eso, nuestro compromiso es cuidarla, regenerarla y trabajar con procesos responsables que respeten el equilibrio del ecosistema.",
      processOvertitle: "EL PROCESO",
      processTitle: "Arte en Ocho Capítulos",
      ctaTitlePart1: "Continúa el viaje a través de",
      ctaTitlePart2: "experiencias y",
      ctaTitleItalic: "sabores únicos.",
      ctaButton1: "Explorar Experiencias",
      ctaButton2: "Descubrir el Restaurante",
    },
    en: {
      heroOvertitle: "HERITAGE & EXCELLENCE",
      heroTitlePart1: "The root",
      heroTitlePart2: "of a",
      heroTitleItalic: "legacy.",
      heroQuote: '"We were born from the depth of the red soil of Ayotlán, where patience is intertwined with family vision."',
      heroDesc1: "Our roots sink deep into the fertile soil of Jalisco through pillar companies such as OMEX, NUTRIAGAVES, IPASA, and PAOSA. This solid agro-industrial base allowed us to master the entire agave cycle long before the first drop.",
      heroDesc2: "Today, under the wing of Grupo Orbe XXI, our story has evolved. We ceased to be mere guardians of the field to become artisans of destiny; creators who transform the effort of the land into unique sensory experiences.",
      originText: "Ayotlán, Jalisco",
      originSub: "The origin of our red soil",
      timelineOvertitle: "TIMELINE",
      timelineTitle: "A History with Roots",
      sustainabilityOvertitle: "ENVIRONMENTAL CONSCIOUSNESS",
      sustainabilityTitle: "Gratitude to the Land",
      sustainabilityDesc: "We honor the land that gives us origin. Therefore, our commitment is to care for it, regenerate it, and work with responsible processes that respect the ecosystem's balance.",
      processOvertitle: "THE PROCESS",
      processTitle: "Art in Eight Chapters",
      ctaTitlePart1: "Continue the journey through",
      ctaTitlePart2: "unique experiences and",
      ctaTitleItalic: "flavors.",
      ctaButton1: "Explore Experiences",
      ctaButton2: "Discover the Restaurant",
    }
  };

  const activeT = localT[lang] || localT["es"];

  const processSteps = lang === "en" ? [
    {
      num: "01",
      timelineLabel: "Plantation",
      title: "The Promised Land",
      desc: "It all begins in the silence of Ayotlán's red soil. Here, at an altitude of 2,000 meters, we plant the future by hand. Each blue agave pup is a promise of patience; a commitment that will sleep under the Jalisco sun for seven long years, absorbing the minerals that will give soul to our tequila.",
      img: "/Empleado Casa Loy Tequilera Siembra.webp",
      detail: "Terroir: Iron-rich red clay in Los Altos de Jalisco at 2,000 meters.",
    },
    {
      num: "02",
      timelineLabel: "Harvest",
      title: "Awakening the Heart",
      desc: "After nearly a decade of waiting, the moment of encounter arrives. Our jimadores, guardians of an ancestral skill, select only the agaves that have reached full maturity. With the strength of the coa, they strip the agave to reveal its heart: the pure piña, the earth's concentrated treasure.",
      img: "/Jima.webp",
      detail: "Technique: Selective hand jima close to the ground.",
    },
    {
      num: "03",
      timelineLabel: "Cooking",
      title: "The Steam's Embrace",
      desc: "The piñas enter the warmth of our traditional brick masonry ovens. For 48 hours, under a whisper of low-pressure steam, the agave cooks slowly. There is no rush; in this warm embrace, starches are transformed into sweet and complex honeys, filling the air with the unmistakable scent of baked agave.",
      img: "/Cocimiento.webp",
      detail: "Cooking: Traditional stone ovens, low-pressure steam cooking for 48 hours.",
    },
    {
      num: "04",
      timelineLabel: "Milling",
      title: "The Stone's Caress",
      desc: "Under the imposing weight of our volcanic stone tahona, the cooked fibers yield their secrets. This ancestral method does not grind in a hurry; it presses gently, separating the purest juices without altering the delicate primary aromas of the agave. It is a tribute to time and respect.",
      img: "/Tahona Agave Molienda.webp",
      detail: "Mechanism: Extraction by traditional volcanic stone tahona mill.",
    },
    {
      num: "05",
      timelineLabel: "Fermentation",
      title: "The Yeast's Song",
      desc: "The agave juice rests in open vats under the Jalisco sky. Here, the invisible magic happens: our proprietary mother yeast, carefully cultivated for generations, begins its spontaneous dance. Guided by the local flora and the Ayotlán wind, the sweet juice comes to life, becoming the soul of our tequila.",
      img: "/Fermentación.webp",
      detail: "Process: Spontaneous fermentation with native mother yeasts in open vats.",
    },
    {
      num: "06",
      timelineLabel: "Distillation",
      title: "Birth of the Spirit",
      desc: "The fermented juice enters the belly of our copper pot stills. Through a slow and meticulous double distillation, fire separates water from spirit. Drop by drop, a crystal-clear liquid of exceptional purity is born, a blank canvas infused with the mineral essence of the soil and the sweetness of the land.",
      img: "/Destilación.webp",
      detail: "Distillation: Slow double distillation in traditional copper pot stills.",
    },
    {
      num: "07",
      timelineLabel: "Aging",
      title: "The Dream in Oak",
      desc: "In the darkness and silence of our cellars, the white tequila enters a long rest. Shielded in American and French oak barrels, the distillate breathes and matures. Over months and years, the wood imparts notes of vanilla, caramel, cocoa, and spices, dressing its original character in elegance.",
      img: "/Añejamiento.webp",
      detail: "Aging: Specially toasted, selected French and American oak barrels.",
    },
    {
      num: "08",
      timelineLabel: "Bottling",
      title: "The Seal of a Dynasty",
      desc: "The journey culminates. The tequila, perfected by time and man, is poured into its bottle. Every label is placed by hand, each bottle is numbered and certified, becoming a tangible tribute to the effort of the land, the passion of the Loy family, and the pride of our tradition.",
      img: "/Enbotellado.webp",
      detail: "Inspection: Manual numbering and labeling of limited batch bottles.",
    },
  ] : [
    {
      num: "01",
      timelineLabel: "Siembra",
      title: "La Tierra Prometida",
      desc: "Todo comienza en el silencio de la tierra roja de Ayotlán. Aquí, a 2,000 metros de altura, plantamos a mano el futuro. Cada hijuelo de agave azul es una promesa de paciencia; un compromiso que dormirá bajo el sol de Jalisco durante siete largos años, absorbiendo los minerales que darán alma a nuestro tequila.",
      img: "/Empleado Casa Loy Tequilera Siembra.webp",
      detail: "Suelo: Arcilloso-rojizo de los Altos de Jalisco a 2,000 msnm.",
    },
    {
      num: "02",
      timelineLabel: "Jima",
      title: "El Despertar del Corazón",
      desc: "Tras casi una década de espera, llega el momento del encuentro. Los jimadores, guardianes de una destreza ancestral, seleccionan solo los agaves que han alcanzado la madurez plena. Con la fuerza de la coa, desnudan el agave para revelar su corazón: la piña pura, el tesoro concentrado de la tierra.",
      img: "/Jima.webp",
      detail: "Técnica: Jima artesanal selectiva a ras de suelo.",
    },
    {
      num: "03",
      timelineLabel: "Cocimiento",
      title: "El Abrazo del Vapor",
      desc: "Las piñas entran al calor de nuestros hornos de mampostería tradicional. Durante 48 horas, bajo un susurro de vapor a baja presión, el agave se cocina lentamente. No hay prisa; en este abrazo de calor, los almidones se transforman en mieles dulces y complejas, llenando el aire de un aroma inconfundible a agave horneado.",
      img: "/Cocimiento.webp",
      detail: "Cocción: Hornos de piedra tradicionales a vapor de baja presión por 48 horas.",
    },
    {
      num: "04",
      timelineLabel: "Molienda",
      title: "La Caricia de la Piedra",
      desc: "Bajo el peso imponente de nuestra tahona de piedra volcánica, las fibras cocidas entregan sus secretos. Este método ancestral no tritura con prisa; presiona con suavidad, separando los jugos más puros sin alterar la delicadeza de los aromas primarios del agave. Es un tributo al tiempo y al respeto.",
      img: "/Tahona Agave Molienda.webp",
      detail: "Mecanismo: Extracción por tahona de piedra volcánica tradicional.",
    },
    {
      num: "05",
      timelineLabel: "Fermentación",
      title: "El Canto de las Levaduras",
      desc: "El jugo del agave descansa en tinas abiertas bajo el cielo de Jalisco. Aquí ocurre la magia invisible: nuestra levadura madre, cultivada con recelo por generaciones, inicia su danza espontánea. Al ritmo de la flora local y el viento de Ayotlán, el jugo dulce cobra vida propia, convirtiéndose en el alma del tequila.",
      img: "/Fermentación.webp",
      detail: "Proceso: Fermentación natural con levaduras madre en tinas abiertas.",
    },
    {
      num: "06",
      timelineLabel: "Destilación",
      title: "El Nacimiento del Espíritu",
      desc: "El mosto fermentado entra en el vientre de nuestros alambiques de cobre. A través de una doble destilación lenta y meticulosa, el fuego separa el agua del espíritu. Gota a gota, nace un líquido cristalino de pureza excepcional, un lienzo en blanco impregnado de la esencia mineral del suelo y el dulzor de la tierra.",
      img: "/Destilación.webp",
      detail: "Destilado: Doble destilación lenta en alambiques de cobre tradicionales.",
    },
    {
      num: "07",
      timelineLabel: "Añejamiento",
      title: "El Sueño en el Roble",
      desc: "En la penumbra y silencio de nuestras cavas, el tequila blanco entra en un largo reposo. Protegido en barricas de roble americano y francés, el destilado respira y madura. Con los meses y los años, la madera le regala notas de vainilla, caramelo, cacao y especias, vistiendo de gala su carácter original.",
      img: "/Añejamiento.webp",
      detail: "Maduración: Barricas seleccionadas de roble francés y americano con tostados específicos.",
    },
    {
      num: "08",
      timelineLabel: "Envasado",
      title: "El Sello de una Dinastía",
      desc: "El viaje culmina. El tequila, perfeccionado por el tiempo y el hombre, es vertido en su botella. Cada etiqueta es colocada a mano, cada botella es numerada y certificada, convirtiéndose en un tributo tangible al esfuerzo de la tierra, la pasión de la familia Loy y el orgullo de nuestra tradición.",
      img: "/Enbotellado.webp",
      detail: "Inspección: Numeración y etiquetado artesanal de botellas de lote limitado.",
    },
  ];

  return (
    <div className="pt-20 bg-background text-[#1c1c18]">
      <section className="relative min-h-[calc(100vh-80px)] flex items-center py-12 lg:py-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="col-span-12 lg:col-span-5 text-left space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-[#8C4723] block">
                  {activeT.heroOvertitle}
                </span>
                <h1 className="font-serif text-5xl lg:text-[clamp(44px,4vw,64px)] leading-[0.95] font-medium tracking-tight">
                  {activeT.heroTitlePart1} <br />
                  {activeT.heroTitlePart2} <span className="italic font-light">{activeT.heroTitleItalic}</span>
                </h1>
              </div>

              <p className="font-serif text-xl lg:text-[clamp(18px,1.5vw,24px)] text-[#1A1615] leading-snug italic font-light">
                {activeT.heroQuote}
              </p>

              <div className="space-y-4 text-sm lg:text-[clamp(14px,0.95vw,16px)] text-[#1c1c18]/70 leading-relaxed font-sans font-normal">
                <p>
                  {activeT.heroDesc1}
                </p>
                <p>
                  {activeT.heroDesc2}
                </p>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="col-span-12 lg:col-span-7 relative flex items-center justify-center">
              <div className="aspect-[16/10] lg:aspect-[1.3] w-full max-h-[45vh] lg:max-h-[58vh] bg-[#EDE7DE] overflow-hidden shadow-2xl relative">
                <img
                  alt="Campos de Agave"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  src="/Campo de Agave Ayotlán Casa Loy Tequilera.webp"
                />
                <div className="absolute bottom-6 right-6 bg-background max-w-[240px] border-l-4 border-[#8C4723] shadow-2xl p-4 text-left">
                  <span className="block font-serif text-base mb-1 italic">{activeT.originText}</span>
                  <span className="text-[8px] font-bold tracking-widest uppercase opacity-40 font-sans block">
                    {activeT.originSub}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-24 bg-[#F7F4EE] text-[#1A1615] relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-margin-mobile md:px-margin-desktop relative">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase text-[#8C4723] block mb-2 font-sans">
              {activeT.timelineOvertitle}
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl font-medium tracking-tight italic text-[#1A1615]">
              {activeT.timelineTitle}
            </h2>
            <div className="h-[1.5px] w-16 bg-[#8C4723]/35 mx-auto mt-4"></div>
          </div>

          {/* Grouped Timeline Pairs */}
          <div className="space-y-0">
            {groupedTimeline.map((pair, pairIdx) => (
              <TimelinePairRow
                key={pairIdx}
                pair={pair}
                pairIdx={pairIdx}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-margin-mobile md:px-margin-desktop">
          
          {/* Header */}
          <div className="mb-8 lg:mb-10">
            <div className="text-left space-y-4 max-w-2xl">
              <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.5em] uppercase text-[#8C4723] block">
                {activeT.sustainabilityOvertitle}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-none italic text-[#1A1615]">
                {activeT.sustainabilityTitle}
              </h2>
              <p className="text-sm md:text-base text-[#1c1c18]/60 leading-relaxed italic font-light">
                {activeT.sustainabilityDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Webkit Scrollbar CSS injector */}
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Single-Row Horizontal Accordion / Grid Layout (Edge-to-Edge) */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-0 w-full lg:h-[480px] overflow-x-auto scrollbar-none select-none"
        >
          {(lang === "en" ? [
            { title: "Solar Energy", text: "We harness clean energy through solar panels to reduce our environmental impact and operate more sustainably.", img: "/Paneles Solares.webp" },
            { title: "Composting Center", text: "Specialized space for the sustainable transformation of organic waste from the tequila process, converting vinazas and bagasse into valuable compost for the fields.", img: "/Vinazas.webp" },
            { title: "Vinazas Management & Compost", text: "Utilization system where the vinazas are distributed via spreader trucks and compost windrows, favoring organic integration and natural soil enrichment.", img: "/Fibras de Agave Cocido.webp" },
            { title: "Social & Family Development", text: "We promote the development and well-being of rural communities, strengthening opportunities, employment, and local growth around the agave culture.", img: "/Empleado Jimador Casa Loy Tequilera.webp" },
          ] : [
            { title: "Energía Solar", text: "Aprovechamos energía limpia mediante paneles solares para reducir nuestro impacto ambiental y operar de forma más sustentable.", img: "/Paneles Solares.webp" },
            { title: "Centro de Compostaje", text: "Espacio especializado para la transformación sustentable de residuos orgánicos del proceso tequilero, convirtiendo vinazas y bagazo en composta de valor para el campo.", img: "/Vinazas.webp" },
            { title: "Manejo de Vinazas y Composta", text: "Sistema de aprovechamiento donde las vinazas son distribuidas mediante camiones con vertedor y cordones de composta, favoreciendo la integración orgánica y el enriquecimiento natural del suelo.", img: "/Fibras de Agave Cocido.webp" },
            { title: "Desarrollo Social y Familiar", text: "Impulsamos el desarrollo y bienestar de las comunidades rurales, fortaleciendo oportunidades, empleo y crecimiento local alrededor de la cultura del agave.", img: "/Empleado Jimador Casa Loy Tequilera.webp" },
          ]).map((pillar, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden bg-[#1A1615] border-b lg:border-b-0 lg:border-r border-white/10 last:border-b-0 lg:last:border-r-0 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] lg:flex-1 lg:hover:flex-[3.5] h-[260px] sm:h-[300px] lg:h-[480px] w-full flex flex-col justify-between p-6 lg:p-8 cursor-pointer shadow-sm hover:shadow-2xl"
            >
              {/* Background Image */}
              <img
                alt={pillar.title}
                src={pillar.img}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out grayscale opacity-45 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-75 z-0 pointer-events-none"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 z-10 transition-opacity duration-700 pointer-events-none" />

              {/* Terracota subtle light leak on hover */}
              <div className="absolute inset-0 bg-[#8C4723]/10 opacity-0 group-hover:opacity-100 z-15 transition-opacity duration-700 pointer-events-none" />

              {/* Bottom Content Area */}
              <div className="relative z-20 flex flex-col justify-end text-left mt-auto w-full">
                {/* Title */}
                <h3 className="font-serif text-xl lg:text-2xl italic text-white transition-colors duration-500 mb-2">
                  {pillar.title}
                </h3>
                
                {/* Expanded Content: Description */}
                <div className="max-h-[160px] opacity-100 translate-y-0 lg:max-h-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:max-h-[160px] lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden">
                  <p className="font-sans text-xs leading-relaxed text-[#EDE7DE]/85 tracking-wide font-light pt-2.5 border-t border-[#8C4723]/25 max-w-[280px] lg:max-w-none">
                    {pillar.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 8 Process Steps */}
      <section className="py-8 lg:py-12 bg-[#F4F0E8] text-[#1A1615] relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#8C4723/0.03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          
          <div className="text-center mb-6">
            <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.5em] uppercase text-[#8C4723] block mb-2 lg:mb-3 font-sans">
              {activeT.processOvertitle}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium italic">
              {activeT.processTitle}
            </h2>
            <div className="h-[1.5px] w-20 bg-[#8C4723]/35 mx-auto mt-4"></div>
          </div>

          {/* Horizontal Journey Bar */}
          <div className="relative mb-8 max-w-4xl mx-auto px-4 overflow-x-auto scrollbar-none py-3">
            <div className="flex justify-between items-center relative min-w-[850px] px-6">
              {/* Background Connecting Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#8C4723]/15" />
              
              {/* Active Connected Line Overlay */}
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#8C4723] transition-all duration-700 ease-in-out" 
                style={{ width: `${(activeStep / 7) * 93}%` }}
              />

              {processSteps.map((step, idx) => {
                const isActive = idx === activeStep;
                const isCompleted = idx <= activeStep;
                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlaying(false);
                    }}
                    className="flex flex-col items-center relative z-10 cursor-pointer w-[100px] min-w-[100px] flex-1"
                  >
                    {/* The Dot */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? "border-[#8C4723] bg-[#8C4723] text-white scale-110 ring-4 ring-[#8C4723]/15 shadow-md"
                        : isCompleted 
                          ? "border-[#8C4723] bg-[#8C4723] text-white" 
                          : "border-[#8C4723]/25 bg-[#F4F0E8] text-[#1A1615]/40 hover:border-[#8C4723]/60 hover:text-[#8C4723]"
                    }`}>
                      <span className="text-[10px] font-bold font-sans">{step.num}</span>
                    </div>
                    
                    {/* The Label */}
                    <span className={`text-[9px] lg:text-[10px] tracking-wider uppercase mt-3 transition-colors duration-300 font-semibold font-sans text-center whitespace-nowrap ${
                      isActive ? "text-[#8C4723]" : "text-[#1A1615]/40"
                    }`}>
                      {step.timelineLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop View (lg+) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Premium Visual Showcase (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[3/2] w-full overflow-hidden shadow-2xl bg-white border border-[#8C4723]/10 rounded-sm">
                {processSteps.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={step.num}
                      className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        isActive
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-105 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        style={{
                          transform: isActive ? "scale(1)" : "scale(1.08)",
                          transition: "transform 6000ms cubic-bezier(0.25,1,0.5,1)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                    </div>
                  );
                })}
                
                {/* Floating Page Number */}
                <div className="absolute bottom-6 right-6 z-20 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 w-12 h-12 rounded-full text-white font-serif italic text-lg shadow-lg">
                  {processSteps[activeStep].num}
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Storytelling (6 cols) */}
            <div className="lg:col-span-6 relative text-left min-h-[310px] flex flex-col justify-between">
              
              {/* Animated content keying on activeStep to trigger CSS slide-up */}
              <div key={activeStep} className="animate-fade-in-slide space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Huge transparent background number */}
                  <div className="font-serif text-[120px] font-bold text-[#8C4723]/3 absolute -top-16 -left-8 select-none leading-none">
                    {processSteps[activeStep].num}
                  </div>

                  <div className="space-y-2 relative">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8C4723] block">
                      {lang === "en" ? "CHAPTER" : "CAPÍTULO"} {processSteps[activeStep].num}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium italic text-[#1A1615]">
                      {processSteps[activeStep].title}
                    </h3>
                  </div>

                  <p className="text-[#1A1615]/85 font-sans text-xs md:text-sm leading-relaxed font-light italic max-w-lg">
                    "{processSteps[activeStep].desc}"
                  </p>

                  {processSteps[activeStep].detail && (
                    <div className="bg-[#FAF8F3]/60 border-l-2 border-[#8C4723] p-3 text-xs font-sans flex items-start gap-3 max-w-md shadow-[0_4px_12px_rgba(140,71,35,0.01)]">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#8C4723] bg-[#8C4723]/5 px-2 py-0.5 mt-0.5 shrink-0">
                        {lang === "en" ? "TECHNICAL INFO" : "INFO TÉCNICA"}
                      </span>
                      <span className="text-[#1A1615]/90 font-medium leading-normal">
                        {processSteps[activeStep].detail}
                      </span>
                    </div>
                  )}
                </div>

                {/* Minimalist Control Row (Embedded directly under description on Desktop) */}
                <div className="flex items-center gap-6 pt-4 mt-4 border-t border-[#8C4723]/10 w-full max-w-lg">
                  {/* Play/Pause Button - minimal circle with progress outline */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full border border-[#8C4723]/20 flex items-center justify-center text-[#8C4723] hover:border-[#8C4723]/60 hover:bg-[#8C4723]/5 transition-all duration-300 cursor-pointer relative"
                    aria-label={isPlaying ? "Pausar" : "Iniciar"}
                  >
                    {isPlaying ? (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                    
                    {/* SVG progress circle track */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="19"
                        stroke="#8C4723"
                        strokeWidth="1.5"
                        fill="transparent"
                        className="opacity-15"
                      />
                      {isPlaying && (
                        <circle
                          cx="20"
                          cy="20"
                          r="19"
                          stroke="#8C4723"
                          strokeWidth="1.5"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 19}`}
                          strokeDashoffset={`${2 * Math.PI * 19 * (1 - progress / 100)}`}
                          className="transition-all duration-[100ms] ease-linear"
                        />
                      )}
                    </svg>
                  </button>

                  {/* Navigation arrows with text links */}
                  <div className="flex items-center gap-4">
                    {/* Prev Button */}
                    <button
                      onClick={() => {
                        setActiveStep((prev) => (prev > 0 ? prev - 1 : 7));
                        setIsPlaying(false);
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1615]/50 hover:text-[#8C4723] transition-colors duration-300 group cursor-pointer"
                    >
                      <svg className="w-2.5 h-2.5 fill-current rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/>
                      </svg>
                      <span>{lang === "en" ? "PREV" : "ANT."}</span>
                    </button>

                    <span className="text-[#8C4723]/35 text-xs font-light">|</span>

                    {/* Next Button with contextual text */}
                    <button
                      onClick={() => {
                        setActiveStep((prev) => (prev < 7 ? prev + 1 : 0));
                        setIsPlaying(false);
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1615]/50 hover:text-[#8C4723] transition-colors duration-300 group cursor-pointer"
                    >
                      <span>{lang === "en" ? `NEXT: ${processSteps[(activeStep + 1) % 8].timelineLabel}` : `SIG: ${processSteps[(activeStep + 1) % 8].timelineLabel}`}</span>
                      <svg className="w-2.5 h-2.5 fill-current transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Step status */}
                  <div className="ml-auto text-[11px] font-sans text-[#1A1615]/40 tracking-[0.15em] font-semibold uppercase">
                    {processSteps[activeStep].num} / 08
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Mobile/Tablet View (< lg) */}
          <div className="lg:hidden space-y-6 text-left">
            
            {/* Visual Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden shadow-lg bg-[#FAF8F3] border border-[#8C4723]/10">
              {processSteps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.num}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
                    }`}
                  >
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-95" />
                  </div>
                );
              })}
              
              {/* Floating indicators */}
              <span className="absolute top-3 left-3 font-sans tracking-[0.25em] text-[9px] text-white bg-[#8C4723] px-2.5 py-1 z-20 shadow-md font-semibold">
                {processSteps[activeStep].num} / 08
              </span>
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase block opacity-60">
                  {lang === "en" ? "CHAPTER" : "CAPÍTULO"} {processSteps[activeStep].num}
                </span>
                <h3 className="font-serif text-xl italic leading-none">{processSteps[activeStep].title}</h3>
              </div>
            </div>

            {/* Content Card with animation */}
            <div key={`mob-${activeStep}`} className="bg-white p-6 border border-[#8C4723]/10 shadow-sm space-y-4 animate-fade-in-slide">
              <p className="text-[#1A1615]/80 font-sans text-sm leading-relaxed font-normal italic">
                "{processSteps[activeStep].desc}"
              </p>
              
              {processSteps[activeStep].detail && (
                <div className="flex flex-col gap-1 border-t border-[#8C4723]/10 pt-3">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C4723]/80">
                    {lang === "en" ? "TECHNICAL INFO" : "INFO TÉCNICA"}
                  </span>
                  <span className="text-xs text-[#1A1615]/90 font-medium">
                    {processSteps[activeStep].detail}
                  </span>
                </div>
              )}

              {/* Minimalist Control Row (Embedded directly inside Content Card on Mobile) */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#8C4723]/10 w-full">
                {/* Play/Pause Button - minimal circle with progress outline */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full border border-[#8C4723]/20 flex items-center justify-center text-[#8C4723] hover:border-[#8C4723]/60 transition-all duration-300 cursor-pointer relative"
                  aria-label={isPlaying ? "Pausar" : "Iniciar"}
                >
                  {isPlaying ? (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  
                  {/* SVG progress circle track */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="17.5"
                      stroke="#8C4723"
                      strokeWidth="1.5"
                      fill="transparent"
                      className="opacity-15"
                    />
                    {isPlaying && (
                      <circle
                        cx="18"
                        cy="18"
                        r="17.5"
                        stroke="#8C4723"
                        strokeWidth="1.5"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 17.5}`}
                        strokeDashoffset={`${2 * Math.PI * 17.5 * (1 - progress / 100)}`}
                        className="transition-all duration-[100ms] ease-linear"
                      />
                    )}
                  </svg>
                </button>

                {/* Navigation arrows with text links */}
                <div className="flex items-center gap-3">
                  {/* Prev Button */}
                  <button
                    onClick={() => {
                      setActiveStep((prev) => (prev > 0 ? prev - 1 : 7));
                      setIsPlaying(false);
                    }}
                    className="flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-[#1A1615]/50 hover:text-[#8C4723] transition-colors duration-300 cursor-pointer"
                  >
                    <span>{lang === "en" ? "PREV" : "ANT."}</span>
                  </button>

                  <span className="text-[#8C4723]/35 text-xs font-light">|</span>

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      setActiveStep((prev) => (prev < 7 ? prev + 1 : 0));
                      setIsPlaying(false);
                    }}
                    className="flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-[#1A1615]/50 hover:text-[#8C4723] transition-colors duration-300 cursor-pointer"
                  >
                    <span>{lang === "en" ? "NEXT" : "SIG."}</span>
                  </button>
                </div>

                {/* Step status */}
                <div className="ml-auto text-[10px] font-sans text-[#1A1615]/40 tracking-wider font-semibold uppercase">
                  {processSteps[activeStep].num} / 08
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-24 bg-background text-[#1c1c18] relative flex items-center justify-center min-h-[50vh] overflow-hidden">
        <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl mb-12 italic font-light leading-none tracking-tight">
            {activeT.ctaTitlePart1} <br />
            {activeT.ctaTitlePart2} <span className="text-[#8C4723]">{activeT.ctaTitleItalic}</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
            <button
              onClick={() => setPage && setPage("turismo")}
              className="bg-[#8C4723] text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#2F403E] transition-all duration-500 w-full sm:w-auto active:scale-95 shadow-md cursor-pointer"
            >
              {activeT.ctaButton1}
            </button>
            <button
              onClick={() => setPage && setPage("nativo")}
              className="border border-[#8C4723]/30 text-[#8C4723] px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8C4723]/5 transition-all duration-500 w-full sm:w-auto active:scale-95 cursor-pointer"
            >
              {activeT.ctaButton2}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
