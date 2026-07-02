import React, { useEffect } from "react";

export default function TermsConditions({ lang = "es" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    es: {
      title: "Términos y Condiciones",
      intro: "Bienvenido al portal web oficial de <strong>Casa Loy Tequilera</strong>. Al acceder y navegar por este sitio web, usted acepta cumplir plenamente con los siguientes términos y condiciones de uso.",
      sec1Title: "1. Restricción de Edad Obligatoria",
      sec1Text: "Este sitio contiene información comercial e institucional relacionada con bebidas alcohólicas (tequila 100% agave). El acceso a este sitio web está estrictamente reservado a personas que tengan la <strong>mayoría de edad legal para consumir bebidas alcohólicas</strong> en su país de residencia. Si usted es menor de edad, por favor abandone el sitio de inmediato.",
      sec2Title: "2. Uso de la Información y Propiedad Intelectual",
      sec2Text: "Todos los textos, imágenes, marcas comerciales (incluidas Casa Loy, TADDEL y Tierra Zafiro), patentes, diseños industriales, logotipos y material audiovisual expuestos en esta plataforma son propiedad exclusiva de Casa Loy Tequilera o de sus licenciantes autorizados. Queda estrictamente prohibida la reproducción, distribución o modificación de cualquier contenido sin la autorización previa y por escrito de la destilería.",
      sec3Title: "3. Registro y Relación Comercial B2B",
      sec3Text: "El envío de información a través del formulario de diagnóstico B2B (Maquila / Desarrolla tu Marca), solicitud de vacantes laborales, registro de newsletter o reservas, no constituye una relación contractual obligatoria por parte de Casa Loy Tequilera. Nos reservamos el derecho de evaluar la viabilidad de las propuestas recibidas de acuerdo a nuestra capacidad instalada y cumplimiento legal ante el Consejo Regulador del Tequila (CRT).",
      sec4Title: "4. Limitación de Responsabilidad",
      sec4Text: "Casa Loy Tequilera se esfuerza por mantener la información del sitio web precisa y actualizada. No obstante, no garantizamos de forma explícita ni implícita que el portal web esté libre de errores temporales de conexión o caídas del servidor.",
      updateText: "Última actualización: Junio 2026."
    },
    en: {
      title: "Terms and Conditions",
      intro: "Welcome to the official website of <strong>Casa Loy Tequilera</strong>. By accessing and browsing this website, you agree to comply fully with the following terms and conditions of use.",
      sec1Title: "1. Mandatory Age Restriction",
      sec1Text: "This site contains commercial and institutional information related to alcoholic beverages (100% agave tequila). Access to this website is strictly restricted to individuals who are of the <strong>legal drinking age for consuming alcoholic beverages</strong> in their country of residence. If you are underage, please leave the site immediately.",
      sec2Title: "2. Use of Information and Intellectual Property",
      sec2Text: "All texts, images, trademarks (including Casa Loy, TADDEL, and Tierra Zafiro), patents, industrial designs, logos, and audiovisual material displayed on this platform are the exclusive property of Casa Loy Tequilera or its authorized licensors. Any reproduction, distribution, or modification of any content without the prior written authorization of the distillery is strictly prohibited.",
      sec3Title: "3. Registration and B2B Commercial Relationship",
      sec3Text: "Submitting information through the B2B diagnostic form (Private Label / Develop your Brand), job vacancy applications, newsletter registration, or bookings does not constitute a binding contractual relationship on the part of Casa Loy Tequilera. We reserve the right to evaluate the viability of the proposals received according to our installed capacity and legal compliance with the Tequila Regulatory Council (CRT).",
      sec4Title: "4. Limitation of Liability",
      sec4Text: "Casa Loy Tequilera strives to keep the website information accurate and up-to-date. However, we do not explicitly or implicitly guarantee that the website will be free of temporary connection errors or server downtime.",
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
          <p dangerouslySetInnerHTML={{ __html: currentT.sec1Text }} />
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec2Title}
          </h2>
          <p>{currentT.sec2Text}</p>
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec3Title}
          </h2>
          <p>{currentT.sec3Text}</p>
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec4Title}
          </h2>
          <p>{currentT.sec4Text}</p>
          
          <p className="pt-6 text-xs text-[#1c1c18]/50 font-sans">
            {currentT.updateText}
          </p>
        </div>
      </div>
    </div>
  );
}
