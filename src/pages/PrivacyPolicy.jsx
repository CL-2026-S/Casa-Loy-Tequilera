import React, { useEffect } from "react";

export default function PrivacyPolicy({ lang = "es" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    es: {
      title: "Aviso de Privacidad",
      intro: "En <strong>Casa Loy Tequilera</strong>, valoramos su privacidad y nos comprometemos a proteger sus datos personales de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
      sec1Title: "1. Responsable del Tratamiento",
      sec1Text: "Casa Loy Tequilera es el único responsable de la recolección, uso, almacenamiento y protección de los datos personales proporcionados por nuestros clientes, aliados estratégicos, distribuidores, visitantes y usuarios del sitio web.",
      sec2Title: "2. Datos Personales Recabados",
      sec2Text: "Para dar cumplimiento a los servicios solicitados y mantener una comunicación directa, podemos recabar los siguientes datos: nombre completo, correo electrónico, número de teléfono (incluido WhatsApp), dirección de facturación o envío, información de perfil profesional (para procesos de selección) e información relacionada con reservas para nuestras experiencias de turismo y Restaurante 1937 Nativo.",
      sec3Title: "3. Finalidades del Tratamiento",
      sec3Text: "Los datos personales recabados serán utilizados de manera confidencial para las siguientes finalidades esenciales:",
      sec3Bullets: [
        "Atender solicitudes de información técnica, comercial o B2B de desarrollo de marca propia (Maquila).",
        "Gestionar reservas para nuestras visitas de turismo destilado y el Restaurante 1937 Nativo.",
        "Enviar boletines comerciales, oportunidades de negocio e invitaciones a lanzamientos exclusivos si decide suscribirse a nuestra comunidad.",
        "Evaluar perfiles para vacantes profesionales dentro de nuestra destilería."
      ],
      sec4Title: "4. Derechos ARCO",
      sec4Text: "Usted tiene derecho en cualquier momento a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer sus derechos ARCO, puede enviar una solicitud formal por escrito a nuestro correo institucional: ",
      updateText: "Última actualización: Junio 2026. Casa Loy Tequilera se reserva el derecho de actualizar este aviso en cualquier momento."
    },
    en: {
      title: "Privacy Policy",
      intro: "At <strong>Casa Loy Tequilera</strong>, we value your privacy and commit to protecting your personal data in accordance with the Federal Law on Protection of Personal Data Held by Private Parties.",
      sec1Title: "1. Data Controller",
      sec1Text: "Casa Loy Tequilera is solely responsible for the collection, use, storage, and protection of personal data provided by our clients, strategic partners, distributors, visitors, and website users.",
      sec2Title: "2. Personal Data Collected",
      sec2Text: "To comply with requested services and maintain direct communication, we may collect the following data: full name, email address, phone number (including WhatsApp), billing or shipping address, professional profile information (for recruitment processes), and booking-related information for our tourism experiences and Restaurante 1937 Nativo.",
      sec3Title: "3. Purposes of Processing",
      sec3Text: "The collected personal data will be used confidentially for the following essential purposes:",
      sec3Bullets: [
        "Handle B2B requests for technical, commercial, or private label development information (Bottling).",
        "Manage bookings for our distillery tours and Restaurante 1937 Nativo.",
        "Send newsletters, business opportunities, and invitations to exclusive launches if you choose to join our community.",
        "Evaluate profiles for career opportunities within our distillery."
      ],
      sec4Title: "4. ARCO Rights",
      sec4Text: "You have the right at any time to Access, Rectify, Cancel, or Oppose the processing of your personal data. To exercise your ARCO rights, you may send a formal written request to our corporate email: ",
      updateText: "Last updated: June 2026. Casa Loy Tequilera reserves the right to update this policy at any time."
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
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec3Title}
          </h2>
          <p>{currentT.sec3Text}</p>
          <ul className="list-disc pl-6 space-y-2">
            {currentT.sec3Bullets.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
          
          <h2 className="font-serif text-xl md:text-2xl text-[#1c1c18] font-semibold pt-4">
            {currentT.sec4Title}
          </h2>
          <p>
            {currentT.sec4Text}
            <a href="mailto:hola@casaloy.com" className="text-primary hover:underline font-semibold">
              hola@casaloy.com
            </a>
            .
          </p>
          
          <p className="pt-6 text-xs text-[#1c1c18]/50 font-sans">
            {currentT.updateText}
          </p>
        </div>
      </div>
    </div>
  );
}
