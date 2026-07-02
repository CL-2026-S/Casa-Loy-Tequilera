import React, { useState } from "react";

export default function Maquilas({ lang = "es" }) {
  // Diagnostic Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({ model: "", infra: "", volume: "" });
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState(lang === "es" ? "Lun, 24 Oct" : "Mon, Oct 24");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingCompleted, setBookingCompleted] = useState(false);

  const content = {
    es: {
      heroSub: "Desarrolla tu Marca",
      heroTitle: "Tu marca, nuestra esencia.",
      heroTitleItalic: "El arte de la Maquila con Legado.",
      heroBtn: "Inicia tu Proyecto",
      
      quizOvertitle: "Estrategia Operativa",
      quizTitle: "Define el futuro de tu destilado",
      quizDesc: "A través de nuestro diagnóstico de infraestructura, determinamos el modelo operativo exacto que requiere su visión comercial para el mercado global.",
      
      stepLabel: "Paso",
      stepModelTitle: "¿Cuál es tu modelo de negocio?",
      stepInfraTitle: "¿Qué nivel de infraestructura posees?",
      stepVolumeTitle: "¿Cuál es tu alcance proyectado?",
      
      modelOpts: ["Maquila Integral", "Granel", "Desarrollo de Perfil"],
      infraOpts: ["Turnkey - Todo incluido", "Solo Envasado y Logística"],
      volumeOpts: ["Volumen Masivo (+10k cajas)", "Ediciones de Nicho"],
      
      profileIdentified: "Perfil Identificado",
      modelLabel: "Modelo:",
      infraLabel: "Infraestructura:",
      scopeLabel: "Alcance:",
      quizSuccessText: "Nuestro equipo de Project Management analizará sus respuestas. Un especialista se pondrá en contacto en menos de 24 horas.",
      resetQuizBtn: "Reiniciar Consulta",
      
      servicesOvertitle: "Excelencia en cada eslabón",
      servicesTitle: "Sinergia entre maestría y rigor logístico",
      servicesDesc: "No solo embotellamos tequila; materializamos el prestigio de su marca a través de un control de calidad que supera los estándares internacionales más exigentes. Cada gota es un testimonio de nuestra devoción al detalle.",
      
      timeTitle: "Respeto al Tiempo",
      timeDesc: "Ciclos de producción optimizados sin comprometer los periodos de maduración y reposo del agave.",
      partnershipTitle: "Acompañamiento Estratégico",
      partnershipDesc: "Asesoría técnica y legal desde el registro de marca hasta la consolidación del primer embarque internacional.",
      
      labOvertitle: "Tecnología y Tradición",
      labTitle: "Control Analítico Superior",
      labDesc: "Nuestra infraestructura de vanguardia nos permite garantizar una trazabilidad absoluta del 100% Agave, blindando la pureza y el perfil organoléptico en cada lote producido.",
      labGuarantee: "Seguridad de suministro garantizada",
      
      capabilitiesOvertitle: "Nuestras Capacidades",
      capabilitiesTitle: "Soluciones 360° para Marcas Globales",
      capabilitiesDesc: "Infraestructura de vanguardia preparada para escalar producciones de cualquier volumen manteniendo la esencia del terruño mexicano.",
      
      capabilitiesList: [
        {
          num: "01",
          title: "Maquila Integral",
          desc: "Desde la jima hasta el etiquetado final. Control total del proceso bajo estándares premium de exportación.",
          bullets: ["100% Agave Azul", "Diseño de Botella"],
        },
        {
          num: "02",
          title: "Venta a Granel",
          desc: "Suministro constante de tequilas base con perfiles organolépticos consistentes para embotelladoras globales.",
          bullets: ["Logística Global", "Certificación CRT"],
          lightBg: true,
        },
        {
          num: "03",
          title: "Desarrollo de Perfil",
          desc: "Colaboración directa con nuestros maestros tequileros para crear una firma líquida exclusiva y única.",
          bullets: ["Curación de Barricas", "Catas Técnicas"],
        },
      ],
      
      capabilitiesPmNum: "04",
      capabilitiesPmTitle: "Project Management",
      capabilitiesPmDesc: "Gestión administrativa integral para el cumplimiento riguroso de normativas de exportación y aduanas.",
      capabilitiesPmBullets: ["Compliance CRT", "Export Standards"],
      
      certificationsOvertitle: "Respaldados por la Excelencia",
      certificationsTitle: "Certificaciones de Clase Mundial",
      certificationsList: [
        { title: "NOM", tag: "Guarantee of Origin", desc: "Cumplimiento total con la Norma Oficial Mexicana, garantizando procesos auténticos y tradicionales." },
        { title: "CRT", tag: "Maximum Compliance", desc: "Supervisión permanente del Consejo Regulador del Tequila, asegurando la pureza y calidad del destilado." },
        { title: "USDA", tag: "Clean Label Access", desc: "Certificación Orgánica que permite el acceso a los mercados globales más exigentes y conscientes." },
        { title: "KOSHER", tag: "Global Standard", desc: "Altos estándares de pureza y limpieza en la producción, ampliando el alcance comercial de su marca." },
      ],
      
      contactTitle: "Conversaciones que destilan negocios",
      pmRole: "Project Manager Comercio Exterior",
      pmQuote: "“Nuestra prioridad es blindar el prestigio de su marca a través de un proceso técnico impecable y una trazabilidad absoluta, garantizando el éxito comercial en el extranjero.”",
      pmCommitment: "Compromiso Casa Loy",
      
      schedulerTitle: "Reserva una Videollamada Técnica",
      schedulerDesc: "Selecciona un horario para discutir la viabilidad operativa de tu proyecto.",
      schedulerSuccessTitle: "¡Cita Programada Exitosamente!",
      schedulerSuccessDesc: "Hemos reservado el slot el <span class=\"font-semibold text-primary\">{date}</span> a las <span class=\"font-semibold text-primary\">{time}</span>. Enviaremos la invitación por correo.",
      rescheduleBtn: "Volver a Programar",
      dateOptions: ["Lun, 24 Oct", "Mar, 25 Oct", "Mie, 26 Oct"],
      timeOptions: ["10:00 AM CST", "11:30 AM CST", "03:00 PM CST"],
      scheduleBtn: "Agendar Consulta",
    },
    en: {
      heroSub: "Develop your Brand",
      heroTitle: "Your brand, our essence.",
      heroTitleItalic: "The Art of Private Label with Legacy.",
      heroBtn: "Start your Project",
      
      quizOvertitle: "Operational Strategy",
      quizTitle: "Define the future of your distillate",
      quizDesc: "Through our infrastructure diagnostic, we determine the exact operational model required for your commercial vision in the global market.",
      
      stepLabel: "Step",
      stepModelTitle: "What is your business model?",
      stepInfraTitle: "What level of infrastructure do you have?",
      stepVolumeTitle: "What is your projected volume?",
      
      modelOpts: ["Full Private Label", "Bulk Supply", "Profile Development"],
      infraOpts: ["Turnkey - All Inclusive", "Bottling & Logistics Only"],
      volumeOpts: ["Mass Volume (+10k cases)", "Niche Editions"],
      
      profileIdentified: "Profile Identified",
      modelLabel: "Model:",
      infraLabel: "Infrastructure:",
      scopeLabel: "Volume:",
      quizSuccessText: "Our Project Management team will analyze your answers. A specialist will get in touch in less than 24 hours.",
      resetQuizBtn: "Reset Consultation",
      
      servicesOvertitle: "Excellence in every link",
      servicesTitle: "Synergy between mastery and logistical rigor",
      servicesDesc: "We do not just bottle tequila; we materialize the prestige of your brand through quality control that exceeds the most demanding international standards. Every drop is a testament to our devotion to detail.",
      
      timeTitle: "Respect for Time",
      timeDesc: "Optimized production cycles without compromising the maturation and rest periods of the agave.",
      partnershipTitle: "Strategic Partnership",
      partnershipDesc: "Technical and legal advice from trademark registration to the consolidation of the first international shipment.",
      
      labOvertitle: "Technology and Tradition",
      labTitle: "Superior Analytical Control",
      labDesc: "Our state-of-the-art infrastructure allows us to guarantee 100% absolute traceability of our Agave, shielding the purity and organoleptic profile in every batch produced.",
      labGuarantee: "Guaranteed supply security",
      
      capabilitiesOvertitle: "Our Capabilities",
      capabilitiesTitle: "360° Solutions for Global Brands",
      capabilitiesDesc: "State-of-the-art infrastructure prepared to scale productions of any volume while maintaining the essence of the Mexican terroir.",
      
      capabilitiesList: [
        {
          num: "01",
          title: "Full Private Label",
          desc: "From harvesting to final labeling. Total control of the process under premium export standards.",
          bullets: ["100% Blue Agave", "Bottle Design"],
        },
        {
          num: "02",
          title: "Bulk Supply",
          desc: "Constant supply of base tequilas with consistent organoleptic profiles for global bottlers.",
          bullets: ["Global Logistics", "CRT Certification"],
          lightBg: true,
        },
        {
          num: "03",
          title: "Profile Development",
          desc: "Direct collaboration with our master tequileros to create an exclusive and unique liquid signature.",
          bullets: ["Barrel Curation", "Technical Tastings"],
        },
      ],
      
      capabilitiesPmNum: "04",
      capabilitiesPmTitle: "Project Management",
      capabilitiesPmDesc: "Comprehensive administrative management for strict compliance with export and customs regulations.",
      capabilitiesPmBullets: ["CRT Compliance", "Export Standards"],
      
      certificationsOvertitle: "Backed by Excellence",
      certificationsTitle: "World Class Certifications",
      certificationsList: [
        { title: "NOM", tag: "Guarantee of Origin", desc: "Full compliance with the Mexican Official Standard, guaranteeing authentic and traditional processes." },
        { title: "CRT", tag: "Maximum Compliance", desc: "Permanent supervision by the Tequila Regulatory Council, ensuring the purity and quality of the distillate." },
        { title: "USDA", tag: "Clean Label Access", desc: "Organic certification allowing access to the most demanding and conscious global markets." },
        { title: "KOSHER", tag: "Global Standard", desc: "High standards of purity and cleanliness in production, expanding the commercial reach of your brand." },
      ],
      
      contactTitle: "Conversations that distill business",
      pmRole: "Foreign Trade Project Manager",
      pmQuote: "“Our priority is to shield the prestige of your brand through an impeccable technical process and absolute traceability, guaranteeing commercial success abroad.”",
      pmCommitment: "Casa Loy Commitment",
      
      schedulerTitle: "Book a Technical Video Call",
      schedulerDesc: "Select a time to discuss the operational feasibility of your project.",
      schedulerSuccessTitle: "Appointment Successfully Scheduled!",
      schedulerSuccessDesc: "We have reserved the slot on <span class=\"font-semibold text-primary\">{date}</span> at <span class=\"font-semibold text-primary\">{time}</span>. We will send the invitation by email.",
      rescheduleBtn: "Reschedule",
      dateOptions: ["Mon, Oct 24", "Tue, Oct 25", "Wed, Oct 26"],
      timeOptions: ["10:00 AM CST", "11:30 AM CST", "03:00 PM CST"],
      scheduleBtn: "Schedule Consultation",
    }
  };

  const currentT = content[lang] || content.es;

  const handleNextStep = (field, value, next) => {
    setQuizAnswers({ ...quizAnswers, [field]: value });
    setQuizStep(next);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({ model: "", infra: "", volume: "" });
    setQuizStep(1);
  };

  const handleBook = () => {
    if (selectedTime) {
      setBookingCompleted(true);
    }
  };

  return (
    <div className="bg-[#fcf9f3] text-[#1c1c18]">
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Maquila Tequila Production"
            className="w-full h-full object-cover brightness-[0.82]"
            src="/Enbotellado.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-16 pb-28">
          <span className="font-navigation text-[clamp(11px,1vw,13px)] text-primary uppercase tracking-[0.4em] mb-4 block font-semibold">
            {currentT.heroSub}
          </span>
          <h1 className="font-serif text-[clamp(28px,4.5vw,60px)] leading-[1.1] tracking-tight font-light text-white uppercase max-w-4xl mx-auto mb-10">
            {currentT.heroTitle} <br />
            <span className="text-primary italic font-normal">{currentT.heroTitleItalic}</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md sm:max-w-none pt-2">
            <a
              className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-8 transition-all duration-300 min-w-[180px] md:min-w-[200px] text-center hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
              href="#quiz"
            >
              {currentT.heroBtn}
            </a>
          </div>
        </div>

        {/* Elegant scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-70">
          <style>{`
            @keyframes scroll-arrow-down {
              0% { transform: translateY(-4px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(4px); opacity: 0; }
            }
            .animate-scroll-arrow {
              animation: scroll-arrow-down 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
            }
          `}</style>
          <svg 
            className="w-4 h-4 text-white/70 animate-scroll-arrow" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section className="relative py-section-gap overflow-hidden bg-zinc-900 text-white" id="quiz">
        <div className="absolute inset-0 z-0">
          <img
            alt="Agave Hearts Background"
            className="w-full h-full object-cover brightness-[0.2] opacity-40"
            src="/Piñas de Agave Tequilana Weber.webp"
          />
        </div>
        <div className="relative z-10 px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            
            <div className="lg:col-span-5 text-left space-y-8">
              <span className="font-label-caps text-primary-fixed mb-4 block tracking-widest uppercase">
                {currentT.quizOvertitle}
              </span>
              <h2 className="font-headline-lg text-4xl md:text-6xl mb-8 leading-tight">
                {currentT.quizTitle}
              </h2>
              <p className="font-body-lg text-white/80 leading-relaxed font-light">
                {currentT.quizDesc}
              </p>
              <div className="flex items-center gap-4 text-primary-fixed">
                <span className="material-symbols-outlined text-4xl">analytics</span>
                <div className="h-[1px] w-24 bg-primary-fixed/30"></div>
              </div>
            </div>

            {/* Glassmorphic Quiz Controller */}
            <div className="lg:col-span-7 p-8 md:p-16 bg-[#fcf9f3]/10 backdrop-blur-2xl border border-white/10 rounded-none shadow-2xl">
              
              {quizStep === 1 && (
                <div className="space-y-6 text-left">
                  <span className="font-label-caps text-primary mb-2 block">{currentT.stepLabel} 01 / 03</span>
                  <h3 className="font-headline-md text-2xl md:text-3xl mb-8 text-white select-none">
                    {currentT.stepModelTitle}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {currentT.modelOpts.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleNextStep("model", opt, 2)}
                        className="w-full text-left p-6 border border-white/20 bg-white/5 hover:border-primary hover:bg-white hover:text-black transition-all flex justify-between items-center group font-navigation"
                      >
                        <span className="font-body-lg text-white group-hover:text-black">{opt}</span>
                        <span className="material-symbols-outlined text-white group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-6 text-left">
                  <span className="font-label-caps text-primary mb-2 block">{currentT.stepLabel} 02 / 03</span>
                  <h3 className="font-headline-md text-2xl md:text-3xl mb-8 text-white select-none">
                    {currentT.stepInfraTitle}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {currentT.infraOpts.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleNextStep("infra", opt, 3)}
                        className="w-full text-left p-6 border border-white/20 bg-white/5 hover:border-primary hover:bg-white hover:text-black transition-all flex justify-between items-center group font-navigation"
                      >
                        <span className="font-body-lg text-white group-hover:text-black">{opt}</span>
                        <span className="material-symbols-outlined text-white group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-6 text-left">
                  <span className="font-label-caps text-primary mb-2 block">{currentT.stepLabel} 03 / 03</span>
                  <h3 className="font-headline-md text-2xl md:text-3xl mb-8 text-white select-none">
                    {currentT.stepVolumeTitle}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {currentT.volumeOpts.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleNextStep("volume", opt, 4)}
                        className="w-full text-left p-6 border border-white/20 bg-white/5 hover:border-primary hover:bg-white hover:text-black transition-all flex justify-between items-center group font-navigation"
                      >
                        <span className="font-body-lg text-white group-hover:text-black">{opt}</span>
                        <span className="material-symbols-outlined text-white group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <div className="text-center py-8 space-y-6">
                  <span className="material-symbols-outlined text-6xl text-primary mb-2 animate-bounce">
                    verified
                  </span>
                  <h3 className="font-headline-md text-3xl mb-4 text-white">{currentT.profileIdentified}</h3>
                  <div className="p-4 bg-white/5 border border-white/10 max-w-sm mx-auto text-left font-sans text-xs space-y-2 mb-6">
                    <p>• <span className="opacity-50">{currentT.modelLabel}</span> {quizAnswers.model}</p>
                    <p>• <span className="opacity-50">{currentT.infraLabel}</span> {quizAnswers.infra}</p>
                    <p>• <span className="opacity-50">{currentT.scopeLabel}</span> {quizAnswers.volume}</p>
                  </div>
                  <p className="font-body-md text-white/70 max-w-md mx-auto leading-relaxed">
                    {currentT.quizSuccessText}
                  </p>
                  <button
                    onClick={handleResetQuiz}
                    className="text-primary font-label-caps border-b border-primary pb-1 hover:opacity-70 transition-opacity mt-8"
                  >
                    {currentT.resetQuizBtn}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className="overflow-hidden shadow-md">
              <img
                alt="Tequila Detail"
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 hover:scale-105"
                src="/Destilación.webp"
              />
            </div>
            
            <div className="text-left space-y-8">
              <span className="font-label-caps text-secondary tracking-widest uppercase block">
                {currentT.servicesOvertitle}
              </span>
              <h2 className="font-headline-lg text-4xl md:text-6xl">
                {currentT.servicesTitle}
              </h2>
              <p className="font-body-lg text-on-surface-variant font-light leading-relaxed">
                {currentT.servicesDesc}
              </p>
              
              <div className="space-y-8 pt-4">
                <div className="flex gap-6 items-start">
                  <span className="material-symbols-outlined text-primary text-3xl mt-0.5">schedule</span>
                  <div>
                    <h4 className="font-headline-md text-xl mb-2">{currentT.timeTitle}</h4>
                    <p className="font-body-md text-on-surface-variant/80 font-light">
                      {currentT.timeDesc}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="material-symbols-outlined text-primary text-3xl mt-0.5">handshake</span>
                  <div>
                    <h4 className="font-headline-md text-xl mb-2">{currentT.partnershipTitle}</h4>
                    <p className="font-body-md text-on-surface-variant/80 font-light">
                      {currentT.partnershipDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Laboratory Controls */}
      <section className="relative h-[80vh] flex items-center mb-24 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <img
            alt="Quality Laboratory"
            className="w-full h-full object-cover opacity-30 grayscale-[10%]"
            src="/Laboratorio.webp"
          />
        </div>
        <div className="relative z-10 px-margin-desktop max-w-container-max mx-auto text-white w-full text-left">
          <div className="max-w-2xl space-y-6">
            <span className="font-label-caps text-primary-fixed tracking-widest uppercase">
              {currentT.labOvertitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-6xl">{currentT.labTitle}</h2>
            <p className="font-body-lg text-white/80 font-light leading-relaxed">
              {currentT.labDesc}
            </p>
            <div className="flex gap-4 pt-4">
              <span className="w-16 h-[1px] bg-primary-fixed mt-4"></span>
              <p className="font-label-caps text-primary-fixed uppercase tracking-widest">
                {currentT.labGuarantee}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Capabilities Grid */}
      <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-gutter text-left">
          <div className="max-w-2xl space-y-4">
            <span className="font-label-caps text-secondary tracking-widest uppercase block">
              {currentT.capabilitiesOvertitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-6xl">
              {currentT.capabilitiesTitle}
            </h2>
          </div>
          <p className="font-body-md text-on-surface-variant lg:w-1/3 leading-relaxed font-light">
            {currentT.capabilitiesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {currentT.capabilitiesList.map((serv) => (
            <div
              key={serv.num}
              className={`p-10 border border-outline-variant flex flex-col h-[460px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-lg ${
                serv.lightBg ? "bg-[#EDE7DE]/20" : "bg-white"
              }`}
            >
              <div className="flex-1 space-y-4">
                <span className="text-[#8f4d1d] font-label-caps font-bold block">{serv.num}</span>
                <h3 className="font-headline-md text-2xl font-semibold">{serv.title}</h3>
                <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                  {serv.desc}
                </p>
              </div>
              <ul className="space-y-3 mb-10 text-xs font-navigation text-on-surface-variant/80">
                {serv.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xs text-primary font-bold">check</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <span className="material-symbols-outlined self-end text-outline-variant hover:text-primary transition-colors">
                arrow_outward
              </span>
            </div>
          ))}

          {/* Solid Copper Highlight Card */}
          <div className="bg-primary text-white p-10 flex flex-col h-[460px] transition-transform duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="flex-1 space-y-4">
              <span className="text-white/60 font-label-caps block">{currentT.capabilitiesPmNum}</span>
              <h3 className="font-headline-md text-2xl font-semibold">{currentT.capabilitiesPmTitle}</h3>
              <p className="text-white/80 font-body-md font-light leading-relaxed">
                {currentT.capabilitiesPmDesc}
              </p>
            </div>
            <ul className="space-y-3 mb-10 text-xs font-navigation text-white/90">
              {currentT.capabilitiesPmBullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xs">check</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <span className="material-symbols-outlined self-end text-white/50">work_history</span>
          </div>
        </div>
      </section>

      {/* Certifications Row */}
      <section className="bg-zinc-900 text-white py-section-gap">
        <div className="px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center mb-24">
            <span className="font-label-caps text-[#d9c2b6] tracking-[0.3em] uppercase mb-4 block">
              {currentT.certificationsOvertitle}
            </span>
            <h2 className="font-headline-lg text-4xl md:text-6xl">{currentT.certificationsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            {currentT.certificationsList.map((cert, idx) => (
              <div key={idx} className="border-l border-white/20 pl-8 space-y-4">
                <div className="font-headline-md text-3xl font-bold text-primary-fixed-dim">{cert.title}</div>
                <p className="font-label-caps tracking-widest text-[#d9c2b6] uppercase text-[9px]">
                  {cert.tag}
                </p>
                <p className="font-body-md text-white/70 text-sm leading-relaxed font-light">
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Dynamic Scheduler */}
      <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto text-left" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="space-y-12">
            <h2 className="font-headline-lg text-4xl md:text-6xl leading-tight">
              {currentT.contactTitle}
            </h2>
            
            <div className="bg-[#EDE7DE]/40 p-8 md:p-10 border border-outline-variant flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="w-24 h-24 flex-shrink-0 bg-stone-300 border border-outline-variant overflow-hidden">
                <img
                  alt="Fernanda Quintana"
                  className="w-full h-full object-cover"
                  src="/Empleado Casa Loy Tequilera.webp"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline-md text-xl font-bold">Fernanda Quintana</h3>
                <p className="font-body-md text-primary text-xs uppercase font-semibold">
                  {currentT.pmRole}
                </p>
                <div className="flex flex-col gap-1 text-xs font-navigation text-on-surface-variant font-light">
                  <a className="hover:text-primary transition-colors" href="mailto:f.quintana@casaloy.com">
                    f.quintana@casaloy.com
                  </a>
                  <span>+52 (33) 3250 4359</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="font-body-lg italic leading-relaxed text-on-surface-variant font-light">
                {currentT.pmQuote}
              </p>
              <div className="flex gap-6 items-center">
                <span className="w-16 h-[1px] bg-primary"></span>
                <span className="font-label-caps text-secondary uppercase tracking-widest text-[9px]">
                  {currentT.pmCommitment}
                </span>
              </div>
            </div>
          </div>

          {/* Scheduler Container */}
          <div>
            <div className="bg-white border border-outline-variant p-8 md:p-12 shadow-2xl relative">
              <div className="mb-10 border-b border-outline-variant/30 pb-6">
                <h4 className="font-headline-md text-2xl mb-2">{currentT.schedulerTitle}</h4>
                <p className="font-body-md text-on-surface-variant/80 font-light">
                  {currentT.schedulerDesc}
                </p>
              </div>

              {bookingCompleted ? (
                <div className="py-12 text-center space-y-6 animate-pulse">
                  <span className="material-symbols-outlined text-6xl text-primary">event_available</span>
                  <h4 className="font-headline-md text-2xl">{currentT.schedulerSuccessTitle}</h4>
                  <p className="font-body-md text-on-surface-variant font-light max-w-xs mx-auto" dangerouslySetInnerHTML={{
                    __html: currentT.schedulerSuccessDesc.replace("{date}", selectedDate).replace("{time}", selectedTime)
                  }} />
                  <button
                    onClick={() => {
                      setBookingCompleted(false);
                      setSelectedTime("");
                    }}
                    className="text-primary font-label-caps border-b border-primary pb-1 font-semibold"
                  >
                    {currentT.rescheduleBtn}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    {currentT.dateOptions.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-4 border font-navigation text-xs text-center uppercase tracking-widest transition-all ${
                          selectedDate === date
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant hover:border-primary hover:bg-[#fcf9f3]"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 mb-10">
                    {currentT.timeOptions.map((time) => (
                      <div
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`flex justify-between items-center p-5 border transition-all cursor-pointer group ${
                          selectedTime === time
                            ? "border-primary bg-[#fcf9f3]/40"
                            : "border-transparent bg-[#fcf9f3] hover:border-outline-variant hover:bg-white"
                        }`}
                      >
                        <span className="font-navigation font-bold">{time}</span>
                        <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={!selectedTime}
                    className={`w-full py-5 font-label-caps uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98] ${
                      selectedTime
                        ? "bg-primary text-white hover:bg-primary-container"
                        : "bg-stone-300 text-stone-500 cursor-not-allowed"
                    }`}
                  >
                    {currentT.scheduleBtn}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
