import React, { useEffect, useState } from "react";

export default function CareerDetail({ lang = "es", setPage }) {
  const [cvFile, setCvFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", linkedin: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", linkedin: "" });
        setCvFile(null);
      }, 5000);
    }
  };

  const content = {
    es: {
      breadcrumbCareers: "Carreras",
      breadcrumbProduction: "Producción",
      breadcrumbRole: "Maestro Tequilero",
      title1: "Maestro",
      title2: "Tequilero",
      heroDesc: "Un legado forjado en tierra, fuego y tiempo. Buscamos un custodio visionario para nuestro linaje artesanal.",
      roleTitle: "Rol & Herencia",
      locLabel: "Ubicación",
      locVal: "Ayotlán, Jalisco, México",
      typeLabel: "Tipo",
      typeVal: "Tiempo Completo, Permanente",
      compLabel: "Compensación",
      compVal: "Paquete Ejecutivo con Camino a Socios",
      applyBtn: "Aplicar Ahora",
      backBtn: "Volver a Vacantes",
      sectionTitle: "El Arte del Oficio",
      sectionDesc: "El Maestro Tequilero es el arquitecto de nuestro perfil sensorial, equilibrando la tradición ancestral con la precisión organoléptica.",
      responsibilities: [
        {
          num: "01",
          title: "Gobernanza de Destilación Artesanal",
          desc: "Supervisar cada etapa de la cocción lenta y la destilación en pequeños lotes para garantizar el 100% de pureza y la expresión perfecta del terroir.",
        },
        {
          num: "02",
          title: "Evaluación Sensorial y Control de Calidad",
          desc: "Llevar a cabo rigurosas evaluaciones organolépticas para cada lote, manteniendo la consistencia de la firma aromática de Casa Loy.",
        },
        {
          num: "03",
          title: "Mentoría de Herencia",
          desc: "Transmitir el conocimiento ancestral a las futuras generaciones de artesanos destiladores, preservando el patrimonio intangible de Casa Loy.",
        }
      ],
      reqTitle: "Guardián del Legado",
      requirements: [
        {
          icon: "agriculture",
          title: "Maestría en Agave",
          desc: "Experiencia inigualable en la selección de Agave Azul Tequilana Weber, específicamente cultivado en Los Altos de Jalisco.",
        },
        {
          icon: "history_edu",
          title: "Experiencia Profunda",
          desc: "Más de 15 años de liderazgo demostrable en la producción de destilados premium, preferiblemente licores de ultra-lujo.",
        },
        {
          icon: "verified",
          title: "Tradición de Mampostería",
          desc: "Dominio de hornos tradicionales de mampostería y la técnica ancestral de trituración por tahona.",
        }
      ],
      formSectionTitle: "Únase al Linaje",
      formSectionDesc: "Envíe sus credenciales para evaluación privada por parte de nuestro consejo de administración.",
      formName: "Nombre completo",
      formEmail: "Correo electrónico",
      formLinkedin: "Perfil de LinkedIn (URL)",
      formFileLabel: "Curriculum Vitae / Portafolio",
      formFileSub: "Suelte su archivo o explore",
      formFileFormat: "PDF, DOCX (MAX 10MB)",
      formFileSelected: "Archivo seleccionado: ",
      formSubmitBtn: "ENVIAR APLICACIÓN",
      formSuccess: "¡Aplicación enviada con éxito! Nuestro comité evaluará su perfil y se pondrá en contacto en absoluta confidencialidad.",
    },
    en: {
      breadcrumbCareers: "Careers",
      breadcrumbProduction: "Production",
      breadcrumbRole: "Maestro Tequilero",
      title1: "Maestro",
      title2: "Tequilero",
      heroDesc: "A legacy forged in earth, fire, and time. We seek a visionary custodian for our luxury artisanal lineage.",
      roleTitle: "Role & Heritage",
      locLabel: "Location",
      locVal: "Ayotlán, Jalisco, Mexico",
      typeLabel: "Type",
      typeVal: "Full-time, Permanent",
      compLabel: "Compensation",
      compVal: "Executive Package with Equity Path",
      applyBtn: "Apply Now",
      backBtn: "Back to Careers",
      sectionTitle: "The Art of the Craft",
      sectionDesc: "The Maestro is the architect of our sensory profile, balancing ancient tradition with organoleptic precision.",
      responsibilities: [
        {
          num: "01",
          title: "Artisanal Distillation Governance",
          desc: "Overseeing every stage of the slow-cook and small-batch distillation process to ensure 100% purity and terroir expression.",
        },
        {
          num: "02",
          title: "Sensory Evaluation & Quality Control",
          desc: "Conducting rigorous organoleptic assessments for every batch, maintaining the signature Casa Loy profile consistency.",
        },
        {
          num: "03",
          title: "Heritage Mentorship",
          desc: "Transmitting ancestral knowledge to the next generation of distillery craftsmen, preserving the intangible heritage of Casa Loy.",
        }
      ],
      reqTitle: "Guardian of the Legacy",
      requirements: [
        {
          icon: "agriculture",
          title: "Agave Mastery",
          desc: "Unrivaled expertise in the selection of 100% Blue Weber Agave, specifically grown in Los Altos de Jalisco.",
        },
        {
          icon: "history_edu",
          title: "Deep Experience",
          desc: "15+ years of demonstrable leadership in premium distillate production, preferably with ultra-luxury spirits.",
        },
        {
          icon: "verified",
          title: "Masonry Traditions",
          desc: "Mastery of traditional masonry ovens (hornos) and the ancestral tahona crushing method.",
        }
      ],
      formSectionTitle: "Join the Lineage",
      formSectionDesc: "Submit your credentials for private evaluation by our executive board.",
      formName: "Full Name",
      formEmail: "Email Address",
      formLinkedin: "LinkedIn Profile (URL)",
      formFileLabel: "Curriculum Vitae / Portfolio",
      formFileSub: "Drop your file or browse",
      formFileFormat: "PDF, DOCX (MAX 10MB)",
      formFileSelected: "Selected file: ",
      formSubmitBtn: "SUBMIT APPLICATION",
      formSuccess: "Application successfully submitted! Our executive board will review your profile and contact you in absolute confidentiality.",
    }
  };

  const t = content[lang];

  return (
    <div className="bg-background text-on-surface text-left">
      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-gutter md:px-margin-desktop bg-surface relative overflow-hidden">
        {/* Subtle decorative grid/linen overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #7d3f0f 0px, #7d3f0f 2px, transparent 2px, transparent 4px),
                              linear-gradient(to bottom, rgba(252, 249, 243, 0.95), rgba(252, 249, 243, 0.8))`,
          }}
        ></div>

        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8 select-none">
            <nav className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
              <span className="cursor-pointer hover:text-primary" onClick={() => setPage("careers")}>
                {t.breadcrumbCareers}
              </span>
              <span className="material-symbols-outlined text-sm font-light">chevron_right</span>
              <span>{t.breadcrumbProduction}</span>
              <span className="material-symbols-outlined text-sm font-light">chevron_right</span>
              <span className="text-primary font-bold">{t.breadcrumbRole}</span>
            </nav>
            <button
              onClick={() => setPage("careers")}
              className="font-label-caps text-[10px] text-primary hover:opacity-75 tracking-widest font-bold border-b border-primary/30"
            >
              {t.backBtn}
            </button>
          </div>

          <h1 className="font-serif text-5xl md:text-8xl lg:text-[100px] text-on-surface leading-none mb-8 tracking-tight font-medium">
            {t.title1} <br />
            <span className="italic text-primary font-light">{t.title2}</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-primary/30 pl-8 italic font-light">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Job Overview */}
      <section className="py-24 px-gutter md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 space-y-10">
            <h2 className="font-serif text-3xl md:text-5xl text-primary font-medium tracking-tight mb-12">
              {t.roleTitle}
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <span className="material-symbols-outlined text-primary font-light">location_on</span>
                </div>
                <div>
                  <h4 className="font-label-caps text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1">
                    {t.locLabel}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{t.locVal}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <span className="material-symbols-outlined text-primary font-light">schedule</span>
                </div>
                <div>
                  <h4 className="font-label-caps text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1">
                    {t.typeLabel}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{t.typeVal}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <span className="material-symbols-outlined text-primary font-light">
                    workspace_premium
                  </span>
                </div>
                <div>
                  <h4 className="font-label-caps text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1">
                    {t.compLabel}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{t.compVal}</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary text-white font-label-caps px-8 py-4 hover:shadow-lg transition-all tracking-widest text-xs font-bold"
              >
                {t.applyBtn}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 mt-12 lg:mt-0 relative group">
            <div className="aspect-[16/10] overflow-hidden bg-white shadow-xl">
              <img
                alt="Maestro Tequilero selection process"
                className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-[1.5s]"
                src="/Trabajo Duro Casa Loy Tequilera Jimado.webp"
              />
            </div>
            <div className="absolute inset-0 border border-primary/20 -m-4 -z-10 group-hover:-m-2 transition-all duration-700"></div>
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="py-32 px-gutter md:px-margin-desktop bg-background">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4 border-t border-primary/20 pt-8 text-left">
              <h3 className="font-serif text-2xl md:text-3xl text-on-surface mb-4 tracking-tight font-medium">
                {t.sectionTitle}
              </h3>
              <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                {t.sectionDesc}
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6 mt-12 lg:mt-0">
              <ul className="space-y-8 text-left">
                {t.responsibilities.map((resp) => (
                  <li
                    key={resp.num}
                    className="flex gap-6 pb-8 border-b border-outline-variant/30 group last:border-b-0"
                  >
                    <span className="font-serif text-3xl md:text-4xl text-primary/30 group-hover:text-primary transition-colors font-medium">
                      {resp.num}
                    </span>
                    <div>
                      <h4 className="font-body-lg font-semibold text-on-surface mb-2 font-sans">
                        {resp.title}
                      </h4>
                      <p className="font-body-md text-on-surface-variant/80 font-light leading-relaxed">
                        {resp.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-32 px-gutter md:px-margin-desktop bg-surface-container-low text-center">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl text-on-surface mb-16 tracking-tight font-medium">
            {t.reqTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.requirements.map((req, idx) => (
              <div
                key={idx}
                className="p-10 bg-white border border-outline-variant/30 hover:border-primary transition-all duration-500 text-left shadow-sm hover:shadow-md"
              >
                <span className="material-symbols-outlined text-4xl text-primary mb-6 font-light block">
                  {req.icon}
                </span>
                <h4 className="font-body-lg font-bold mb-4 font-sans uppercase tracking-wider text-sm">
                  {req.title}
                </h4>
                <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                  {req.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-32 px-gutter md:px-margin-desktop bg-background" id="apply">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-5xl text-on-surface tracking-tight font-medium">
              {t.formSectionTitle}
            </h2>
            <p className="font-body-md text-on-surface-variant font-light">
              {t.formSectionDesc}
            </p>
          </div>

          {submitted ? (
            <div className="bg-white p-12 text-center space-y-6 shadow-2xl border border-outline-variant/10 animate-fade-in">
              <span className="material-symbols-outlined text-6xl text-primary font-light block">
                verified
              </span>
              <p className="font-serif text-2xl italic text-on-surface font-light leading-relaxed">
                {t.formSuccess}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-left bg-white p-8 md:p-12 shadow-2xl border border-outline-variant/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-body-md py-4 focus:outline-none placeholder:text-outline-variant/60"
                    placeholder={t.formName}
                    type="text"
                  />
                </div>
                <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                  <input
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-body-md py-4 focus:outline-none placeholder:text-outline-variant/60"
                    placeholder={t.formEmail}
                    type="email"
                  />
                </div>
              </div>

              <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                <input
                  required
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-transparent border-0 focus:ring-0 text-body-md py-4 focus:outline-none placeholder:text-outline-variant/60"
                  placeholder={t.formLinkedin}
                  type="url"
                />
              </div>

              <div className="space-y-4">
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold uppercase block">
                  {t.formFileLabel}
                </label>
                <div className="relative w-full h-40 border border-dashed border-outline-variant/50 hover:border-primary transition-colors flex flex-col items-center justify-center bg-background/10 cursor-pointer group">
                  <input
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleUpload}
                  />
                  <span className="material-symbols-outlined text-primary/50 text-4xl mb-2 font-light group-hover:scale-105 transition-transform block">
                    upload_file
                  </span>
                  <p className="font-body-md text-on-surface-variant font-light">
                    {cvFile ? `${t.formFileSelected} ${cvFile.name}` : t.formFileSub}
                  </p>
                  <p className="text-[10px] uppercase tracking-tighter text-on-surface-variant/40 mt-2 font-semibold">
                    {t.formFileFormat}
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  className="w-full bg-primary text-white py-6 font-navigation text-navigation uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-500 shadow-xl shadow-primary/10 hover:shadow-primary/30 flex items-center justify-center gap-4 text-xs font-bold"
                  type="submit"
                >
                  {t.formSubmitBtn}
                  <span className="material-symbols-outlined text-sm font-light">arrow_right_alt</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
