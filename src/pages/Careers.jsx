import React, { useEffect, useState } from "react";
import { jobsData } from "../data/jobs";

export default function Careers({ lang = "es", setPage, setSelectedJobId }) {
  const [cvFile, setCvFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dynamicJobs, setDynamicJobs] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/cms?type=jobs");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped = data.map(j => ({
              id: j.id,
              categoryLabel: {
                es: j.category === 'comercial' ? 'Comercial y Ventas' : j.category === 'produccion' ? 'Producción e Ingeniería' : 'Administración',
                en: j.category === 'comercial' ? 'Sales & Commercial' : j.category === 'produccion' ? 'Production & Engineering' : 'Administration'
              },
              title: {
                es: j.title_es,
                en: j.title_en || j.title_es
              },
              location: {
                es: j.location_es,
                en: j.location_en || j.location_es
              },
              type: {
                es: j.type_es,
                en: j.type_en || j.type_es
              },
              time: {
                es: j.time_es,
                en: j.time_en || j.time_es
              }
            }));
            setDynamicJobs(mapped);
          }
        }
      } catch (e) {
        console.error("Error fetching jobs from CMS:", e);
      }
    };
    fetchJobs();
  }, []);

  const activeJobs = dynamicJobs.length > 0 ? dynamicJobs : jobsData;

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
      const reader = new FileReader();
      reader.readAsDataURL(cvFile);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        
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
              cv_file_base64: base64Data,
              job_id: "spontaneous",
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
          console.error("Error submitting spontaneous application:", err);
        } finally {
          setSubmitting(false);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setSubmitting(false);
      };
    } catch (err) {
      console.error("Error reading file:", err);
      setSubmitting(false);
    }
  };

  const content = {
    es: {
      category: "TALENTO Y TRADICIÓN",
      heroTitle: "Únase a Nuestra Herencia",
      exploreBtn: "EXPLORAR VACANTES",
      sectionTitle: "Oportunidades Actuales",
      published: "PUBLICADA",
      applyBtn: "APLICAR",
      spontaneousTitle: "¿No encuentra su rol ideal?",
      spontaneousTitleItalic: "Escríbanos.",
      spontaneousDesc: "En Casa Loy, creemos que el gran tequila nace de las almas que comparten nuestra devoción por la tierra y el respeto al tiempo. Si siente el llamado de nuestra herencia, le invitamos a escribir su historia junto a la nuestra.",
      spontaneousEmail: "rh@casaloy.com",
      formName: "Nombre completo",
      formPhone: "Teléfono de contacto",
      formEmail: "Correo electrónico",
      formUploadLabel: "CARGAR CURRICULUM VITAE (PDF, MAX 5MB)",
      formUploadSelected: "Archivo seleccionado: ",
      formSubmitBtn: "ENVIAR PERFIL PROFESIONAL",
      formSuccess: "¡Gracias! Su perfil ha sido registrado con éxito en nuestro sistema de selección. Nos pondremos en contacto.",
      disclaimerTitle: "AVISO IMPORTANTE SOBRE NUESTRAS VACANTES",
      disclaimerText: "En Casa Loy los únicos medios oficiales que utilizamos para publicar vacantes son Indeed y LinkedIn. Cualquier vacante publicada fuera de estos medios no corresponde a nuestra empresa y carece de validez oficial."
    },
    en: {
      category: "TALENT & TRADITION",
      heroTitle: "Join Our Heritage",
      exploreBtn: "EXPLORE VACANCIES",
      sectionTitle: "Current Opportunities",
      published: "PUBLISHED",
      applyBtn: "APPLY NOW",
      spontaneousTitle: "Can't find your ideal role?",
      spontaneousTitleItalic: "Write to us.",
      spontaneousDesc: "At Casa Loy, we believe great tequila is born from souls who share our devotion to the land and respect for time. If you feel the calling of our heritage, we invite you to write your story alongside ours.",
      spontaneousEmail: "rh@casaloy.com",
      formName: "Full name",
      formPhone: "Contact phone",
      formEmail: "Email address",
      formUploadLabel: "UPLOAD CURRICULUM VITAE (PDF, MAX 5MB)",
      formUploadSelected: "Selected file: ",
      formSubmitBtn: "SEND PROFESSIONAL PROFILE",
      formSuccess: "Thank you! Your profile has been successfully registered in our recruitment system. We will be in touch.",
      disclaimerTitle: "IMPORTANT NOTICE ABOUT VACANCIES",
      disclaimerText: "At Casa Loy, the only official channels we use to publish job vacancies are Indeed and LinkedIn. Any vacancy posted outside of these media does not correspond to us and is completely unauthorized."
    }
  };

  const t = content[lang] || content.es;

  return (
    <div className="bg-background text-on-surface text-left">
      {/* Hero Section */}
      <header className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <img
          alt="Casa Loy Distillery Heritage"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.82]"
          src="/Bolsa de Trabajo.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45"></div>
        <div className="relative z-10 text-center px-gutter max-w-4xl">
          <h1 className="font-serif text-4xl md:text-7xl lg:text-[84px] text-white mb-12 tracking-tight font-medium leading-none">
            {t.heroTitle}
          </h1>
          <a
            className="inline-flex items-center text-white font-label-caps border-b border-white/50 pb-2 hover:border-white transition-all text-xs tracking-widest font-bold"
            href="#vacantes"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("vacantes")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t.exploreBtn}{" "}
            <span className="material-symbols-outlined ml-2 font-light">expand_more</span>
          </a>
        </div>
      </header>

      {/* Job Listings Section */}
      <section className="py-32 px-gutter md:px-margin-desktop max-w-container-max mx-auto" id="vacantes">
        <div className="mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-primary font-medium tracking-tight border-b border-outline-variant/15 pb-6">
            {t.sectionTitle}
          </h2>
        </div>

        <div className="space-y-6">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-background/40 backdrop-blur-md border border-outline-variant/20 p-8 hover:bg-surface-container-low transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm group hover:shadow-md"
            >
              <div className="flex-1 text-left">
                <span className="font-label-caps text-secondary text-[10px] tracking-widest font-bold mb-2 block">
                  {job.categoryLabel[lang]}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-on-surface mb-2 font-medium tracking-tight group-hover:text-primary transition-colors">
                  {job.title[lang]}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-on-surface-variant/70 font-navigation text-xs tracking-wider">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm font-light">location_on</span>{" "}
                    {job.location[lang]}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm font-light">schedule</span>{" "}
                    {job.type[lang]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 border-t border-outline-variant/10 md:border-none pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-widest font-bold">
                    {t.published}
                  </p>
                  <p className="text-sm font-light text-on-surface-variant">{job.time[lang]}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setPage("career-detail");
                  }}
                  className="bg-primary text-white font-label-caps px-10 py-4 hover:bg-[#592c0a] hover:scale-102 transition-all tracking-widest font-bold text-xs cursor-pointer focus:outline-none"
                >
                  {t.applyBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruitment Safety Disclaimer Banner */}
      <section className="bg-surface-container-low border-y border-outline-variant/15 py-12">
        <div className="max-w-container-max mx-auto px-gutter md:px-margin-desktop">
          <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-8 border border-outline-variant/30 shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0 font-light mt-1">
              gpp_maybe
            </span>
            <div className="space-y-2 text-left">
              <h4 className="font-label-caps text-xs tracking-wider font-bold text-primary uppercase">
                {t.disclaimerTitle}
              </h4>
              <p className="font-body-md text-xs leading-relaxed text-on-surface-variant/80 font-light">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section className="bg-surface-container py-32" id="hr-contact">
        <div className="max-w-container-max mx-auto px-gutter md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="text-left space-y-8">
            <h2 className="font-serif text-3xl md:text-5xl text-on-surface leading-tight font-medium tracking-tight">
              {t.spontaneousTitle}
              <br />
              <span className="text-primary italic font-light">{t.spontaneousTitleItalic}</span>
            </h2>
            <p className="font-body-lg text-on-surface-variant font-light leading-relaxed">
              {t.spontaneousDesc}
            </p>
            <div className="flex items-center gap-4 text-primary font-navigation text-sm tracking-wider font-semibold">
              <span className="material-symbols-outlined font-light">mail</span>
              <span>{t.spontaneousEmail}</span>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-2xl border border-outline-variant/10">
            {submitted ? (
              <div className="py-16 text-center space-y-6 animate-fade-in">
                <span className="material-symbols-outlined text-6xl text-primary font-light">
                  done_all
                </span>
                <p className="font-serif text-2xl italic text-on-surface font-light leading-relaxed">
                  {t.formSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-0 focus:ring-0 bg-transparent py-4 font-body-md placeholder:text-outline-variant/60 focus:outline-none"
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
                      className="w-full border-0 focus:ring-0 bg-transparent py-4 font-body-md placeholder:text-outline-variant/60 focus:outline-none"
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
                    className="w-full border-0 focus:ring-0 bg-transparent py-4 font-body-md placeholder:text-outline-variant/60 focus:outline-none"
                    placeholder={t.formEmail}
                    type="email"
                    disabled={submitting}
                  />
                </div>

                <div className="border border-dashed border-outline-variant/50 p-8 text-center hover:border-primary transition-colors cursor-pointer relative bg-background/20 group">
                  <input
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="cv-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleUpload}
                    disabled={submitting}
                  />
                  <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary mb-4 font-light block">
                    cloud_upload
                  </span>
                  <p className="font-label-caps text-[9px] text-on-surface-variant group-hover:text-primary tracking-widest font-bold uppercase transition-colors">
                    {cvFile ? `${t.formUploadSelected} ${cvFile.name}` : t.formUploadLabel}
                  </p>
                </div>

                <button
                  className="w-full bg-primary text-white font-label-caps py-5 hover:bg-[#592c0a] disabled:bg-primary/60 transition-colors tracking-widest text-xs font-bold cursor-pointer focus:outline-none"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (lang === "es" ? "ENVIANDO..." : "SENDING...") : t.formSubmitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
