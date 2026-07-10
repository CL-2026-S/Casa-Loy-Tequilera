import React, { useEffect, useState } from "react";
import { jobsData } from "../data/jobs";

export default function CareerDetail({ lang = "es", setPage, jobId }) {
  const [cvFile, setCvFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jobId]);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !cvFile) {
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          cv_name: cvFile.name,
          job_id: job.id,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "" });
        setCvFile(null);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting job application:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Find job details, fallback to first job if not found
  const job = jobsData.find((j) => j.id === jobId) || jobsData[0];

  const labels = {
    es: {
      breadcrumbCareers: "Carreras",
      applyBtn: "Aplicar Ahora",
      backBtn: "Volver a Vacantes",
      formSectionTitle: "Únase al Linaje",
      formSectionDesc: "Envíe sus credenciales para evaluación privada por parte de nuestro consejo de administración.",
      formName: "Nombre completo",
      formPhone: "Teléfono de contacto",
      formEmail: "Correo electrónico",
      formFileLabel: "Curriculum Vitae / Portafolio",
      formFileSub: "Suelte su archivo o explore",
      formFileFormat: "PDF, DOCX (MAX 10MB)",
      formFileSelected: "Archivo seleccionado: ",
      formSubmitBtn: "ENVIAR APLICACIÓN",
      formSuccess: "¡Aplicación enviada con éxito! Nuestro comité evaluará su perfil y se pondrá en contacto en absoluta confidencialidad.",
      disclaimerText: "En Casa Loy los únicos medios oficiales que utilizamos para publicar vacantes son Indeed y LinkedIn. Cualquier vacante publicada fuera de estos medios no corresponde a nuestra empresa y carece de validez oficial."
    },
    en: {
      breadcrumbCareers: "Careers",
      applyBtn: "Apply Now",
      backBtn: "Back to Careers",
      formSectionTitle: "Join the Lineage",
      formSectionDesc: "Submit your credentials for private evaluation by our executive board.",
      formName: "Full Name",
      formPhone: "Contact phone",
      formEmail: "Email Address",
      formFileLabel: "Curriculum Vitae / Portfolio",
      formFileSub: "Drop your file or browse",
      formFileFormat: "PDF, DOCX (MAX 10MB)",
      formFileSelected: "Selected file: ",
      formSubmitBtn: "SUBMIT APPLICATION",
      formSuccess: "Application successfully submitted! Our executive board will review your profile and contact you in absolute confidentiality.",
      disclaimerText: "At Casa Loy, the only official channels we use to publish job vacancies are Indeed and LinkedIn. Any vacancy posted outside of these media does not correspond to us and is completely unauthorized."
    }
  };

  const t = labels[lang] || labels.es;

  const getJobImage = (id) => {
    switch (id) {
      case "kam":
        return "/Empleado Casa Loy Tequilera.webp";
      default:
        return "/Trabajo Duro Casa Loy Tequilera Jimado.webp";
    }
  };

  return (
    <div className="bg-background text-on-surface text-left">
      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-gutter md:px-margin-desktop bg-surface relative overflow-hidden">
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
              <span>{job.breadcrumbProduction[lang]}</span>
              <span className="material-symbols-outlined text-sm font-light">chevron_right</span>
              <span className="text-primary font-bold">{job.breadcrumbRole[lang]}</span>
            </nav>
            <button
              onClick={() => setPage("careers")}
              className="font-label-caps text-[10px] text-primary hover:opacity-75 tracking-widest font-bold border-b border-primary/30 cursor-pointer focus:outline-none"
            >
              {t.backBtn}
            </button>
          </div>

          <h1 className="font-serif text-5xl md:text-8xl lg:text-[100px] text-on-surface leading-none mb-8 tracking-tight font-medium">
            {job.title1[lang]} <br />
            <span className="italic text-primary font-light">{job.title2[lang]}</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-primary/30 pl-8 italic font-light">
            {job.heroDesc[lang]}
          </p>
        </div>
      </section>

      {/* Job Overview */}
      <section className="py-24 px-gutter md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 space-y-10">
            <h2 className="font-serif text-3xl md:text-5xl text-primary font-medium tracking-tight mb-12">
              {job.roleTitle[lang]}
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <span className="material-symbols-outlined text-primary font-light">location_on</span>
                </div>
                <div>
                  <h4 className="font-label-caps text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1">
                    {job.locLabel[lang]}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{job.locVal[lang]}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center shrink-0 shadow-sm bg-white">
                  <span className="material-symbols-outlined text-primary font-light">schedule</span>
                </div>
                <div>
                  <h4 className="font-label-caps text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1">
                    {job.typeLabel[lang]}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{job.typeVal[lang]}</p>
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
                    {job.compLabel[lang]}
                  </h4>
                  <p className="font-body-md text-on-surface font-light">{job.compVal[lang]}</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary text-white font-label-caps px-8 py-4 hover:shadow-lg transition-all tracking-widest text-xs font-bold cursor-pointer focus:outline-none"
              >
                {t.applyBtn}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 mt-12 lg:mt-0 relative group">
            <div className="aspect-[16/10] overflow-hidden bg-white shadow-xl">
              <img
                alt={`${job.breadcrumbRole[lang]} presentation`}
                className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-[1.5s]"
                src={getJobImage(job.id)}
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
                {job.sectionTitle[lang]}
              </h3>
              <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                {job.sectionDesc[lang]}
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6 mt-12 lg:mt-0">
              <ul className="space-y-8 text-left">
                {job.responsibilities.map((resp) => (
                  <li
                    key={resp.num}
                    className="flex gap-6 pb-8 border-b border-outline-variant/30 group last:border-b-0"
                  >
                    <span className="font-serif text-3xl md:text-4xl text-primary/30 group-hover:text-primary transition-colors font-medium">
                      {resp.num}
                    </span>
                    <div>
                      <h4 className="font-body-lg font-semibold text-on-surface mb-2 font-sans">
                        {resp.title[lang]}
                      </h4>
                      <p className="font-body-md text-on-surface-variant/80 font-light leading-relaxed">
                        {resp.desc[lang]}
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
            {job.reqTitle[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {job.requirements.map((req, idx) => (
              <div
                key={idx}
                className="p-10 bg-white border border-outline-variant/30 hover:border-primary transition-all duration-500 text-left shadow-sm hover:shadow-md"
              >
                <span className="material-symbols-outlined text-4xl text-primary mb-6 font-light block">
                  {req.icon}
                </span>
                <h4 className="font-body-lg font-bold mb-4 font-sans uppercase tracking-wider text-sm">
                  {req.title[lang]}
                </h4>
                <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
                  {req.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conocimientos Clave Section (if available) */}
      {job.conocimientos && (
        <section className="py-24 px-gutter md:px-margin-desktop bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-4 text-left">
                <h3 className="font-serif text-2xl md:text-3xl text-primary mb-6 tracking-tight font-medium">
                  {job.conocimientosTitle[lang]}
                </h3>
              </div>
              <div className="lg:col-span-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {job.conocimientos.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary text-base font-light shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <p className="font-body-md text-on-surface-variant text-sm font-light leading-relaxed">
                        {con[lang]}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ofrecemos Section (if available) */}
      {job.ofrecemos && (
        <section className="py-24 px-gutter md:px-margin-desktop bg-background border-t border-outline-variant/20">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-5 text-left">
                <h3 className="font-serif text-3xl md:text-5xl text-primary mb-6 tracking-tight font-medium">
                  {job.ofrecemosTitle[lang]}
                </h3>
                <p className="font-body-lg text-on-surface-variant/80 font-light leading-relaxed">
                  {lang === "es"
                    ? "Forme parte de una institución líder con un firme compromiso con la sustentabilidad y el bienestar de su equipo."
                    : "Become part of a leading institution with a firm commitment to sustainability and our team's well-being."}
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="bg-surface-container p-8 md:p-12 border border-outline-variant/20 shadow-sm space-y-6">
                  {job.ofrecemos.map((o, idx) => (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b border-outline-variant/20 last:border-b-0 last:pb-0">
                      <span className="material-symbols-outlined text-primary text-xl font-light shrink-0">
                        redeem
                      </span>
                      <p className="font-body-md text-on-surface font-semibold text-sm">
                        {o[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Application Form */}
      <section className="py-32 px-gutter md:px-margin-desktop bg-background border-t border-outline-variant/20" id="apply">
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
                    disabled={submitting}
                  />
                </div>
                <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-0 focus:ring-0 text-body-md py-4 focus:outline-none placeholder:text-outline-variant/60"
                    placeholder={t.formPhone}
                    type="tel"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                <input
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-0 focus:ring-0 text-body-md py-4 focus:outline-none placeholder:text-outline-variant/60"
                  placeholder={t.formEmail}
                  type="email"
                  disabled={submitting}
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
                    disabled={submitting}
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
                  className="w-full bg-primary text-white py-6 font-navigation text-navigation uppercase tracking-[0.2em] hover:bg-[#592c0a] transition-all duration-500 shadow-xl shadow-primary/10 hover:shadow-primary/30 flex items-center justify-center gap-4 text-xs font-bold cursor-pointer focus:outline-none"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (lang === "es" ? "ENVIANDO..." : "SENDING...") : t.formSubmitBtn}
                  <span className="material-symbols-outlined text-sm font-light">arrow_right_alt</span>
                </button>
              </div>

              {/* Safety recruitment disclaimer on detail page */}
              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex gap-4 items-start bg-surface-container-low/40 p-4">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 font-light">
                  gpp_maybe
                </span>
                <p className="font-body-md text-[11px] leading-relaxed text-on-surface-variant/70 font-light">
                  {t.disclaimerText}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
