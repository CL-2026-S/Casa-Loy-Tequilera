import React, { useEffect } from "react";

export default function CookiePolicy({ lang = "es" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    es: {
      title: "Política de Cookies",
      intro: "En <strong>Casa Loy Tequilera</strong>, utilizamos cookies y tecnologías similares para mejorar la experiencia de navegación de nuestros visitantes, analizar la usabilidad de nuestra plataforma y optimizar nuestros servicios de información corporativa.",
      sec1Title: "1. ¿Qué es una Cookie?",
      sec1Text: "Una cookie es un pequeño archivo de texto que un sitio web almacena en su navegador o dispositivo. Permite recordar información sobre su visita (como su preferencia de idioma, edad confirmada u opciones de navegación) para hacer que su próxima visita sea más fluida y personalizada.",
      sec2Title: "2. Tipos de Cookies que Utilizaremos",
      sec2Text: "Nuestra plataforma utiliza las siguientes categorías de cookies:",
      sec2Bullets: [
        "<strong>Cookies Técnicas y Esenciales:</strong> Son obligatorias para el correcto funcionamiento del sitio. Por ejemplo, almacenamos el estado de validación del filtro de edad para garantizar que solo usuarios mayores de edad ingresen a las secciones de la destilería.",
        "<strong>Cookies de Personalización:</strong> Permiten recordar sus preferencias de idioma (Español o Inglés) durante la navegación por las diferentes vistas del portal.",
        "<strong>Cookies de Análisis Estadístico:</strong> Nos permiten medir el número de visitantes, la duración de la sesión y qué apartados comerciales (como el desarrollo de marcas propias o gastronomía) captan mayor atención estratégica de inversionistas y aliados."
      ],
      sec3Title: "3. Control y Desactivación",
      sec3Text: "Usted puede modificar la configuración de su navegador para restringir, bloquear o borrar las cookies del sitio web de Casa Loy Tequilera en cualquier momento. Si decide inhabilitar las cookies técnicas, tenga en cuenta que el filtro de verificación de edad y ciertas funciones de reserva interactiva podrían no operar de forma correcta.",
      updateText: "Última actualización: Junio 2026."
    },
    en: {
      title: "Cookie Policy",
      intro: "At <strong>Casa Loy Tequilera</strong>, we use cookies and similar technologies to improve the browsing experience of our visitors, analyze the usability of our platform, and optimize our corporate information services.",
      sec1Title: "1. What is a Cookie?",
      sec1Text: "A cookie is a small text file that a website stores on your browser or device. It allows the site to remember information about your visit (such as your language preference, verified age, or browsing options) to make your next visit smoother and more personalized.",
      sec2Title: "2. Types of Cookies We Use",
      sec2Text: "Our platform uses the following categories of cookies:",
      sec2Bullets: [
        "<strong>Technical and Essential Cookies:</strong> These are mandatory for the correct operation of the website. For example, we store the age verification filter status to ensure only legal-age users enter the distillery sections.",
        "<strong>Personalization Cookies:</strong> These allow the site to remember your language preferences (Spanish or English) while navigating through different pages.",
        "<strong>Statistical Analysis Cookies:</strong> These allow us to measure the number of visitors, session duration, and which business sections (such as private label development or gastronomy) attract the most strategic attention from investors and partners."
      ],
      sec3Title: "3. Control and Deactivation",
      sec3Text: "You can modify your browser settings to restrict, block, or delete cookies from the Casa Loy Tequilera website at any time. If you decide to disable technical cookies, please note that the age verification filter and certain interactive booking features might not operate correctly.",
      updateText: "Last updated: June 2026."
    }
  };

  const currentT = content[lang] || content.es;

  return (
    <div className="pt-32 pb-24 bg-[#fcf9f3] text-[#1c1c18] text-left min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8 space-y-10">
        <span className="font-label-caps text-[11px] text-primary tracking-[0.4em] uppercase block font-bold">
          CASA LOY TEQUILERA
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight tracking-tight">
          {currentT.title}
        </h1>
        <div className="w-16 h-[1.5px] bg-primary/30"></div>
        
        <div className="space-y-6 font-sans text-sm md:text-base text-[#1c1c18]/80 leading-relaxed font-light">
          <p dangerouslySetInnerHTML={{ __html: currentT.intro }} />
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec1Title}
          </h2>
          <p>{currentT.sec1Text}</p>
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec2Title}
          </h2>
          <p>{currentT.sec2Text}</p>
          <ul className="list-disc pl-6 space-y-2">
            {currentT.sec2Bullets.map((bullet, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }} />
            ))}
          </ul>
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec3Title}
          </h2>
          <p>{currentT.sec3Text}</p>
          
          <p className="pt-6 text-xs text-[#1c1c18]/50 font-sans">
            {currentT.updateText}
          </p>
        </div>
      </div>
    </div>
  );
}
