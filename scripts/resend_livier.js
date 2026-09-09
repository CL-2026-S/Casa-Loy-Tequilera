import fs from 'fs';
import path from 'path';

// Parse .env manually if not already populated
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });

    // If RESEND_FROM_EMAIL is the sandbox onboarding@resend.dev, override with the official verified domain
    if (process.env.RESEND_FROM_EMAIL?.includes('onboarding@resend.dev')) {
      process.env.RESEND_FROM_EMAIL = 'Casa Loy Tequilera <hola@casaloy.com>';
    }
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

async function main() {
  console.log("=== Reenviando notificación de Livier Ocegueda ===");

  const { supabase, resend } = await import('../api/_utils/clients.js');
  const { sendJobApplicationEmail } = await import('../api/_utils/emails.js');

  if (!resend) {
    console.error("Error: Cliente de Resend no disponible.");
    return;
  }

  let livierData = {
    name: "Livier Ocegueda Sánchez",
    email: "livieroceguedaa@gmail.com",
    phone: "3333763513",
    cv_name: "CV LIVIER OCEGUEDA.pdf",
    cv_url: null,
    cv_base64: null,
    job_title: "Cartera de Talento (Sin vacante específica)",
    is_spontaneous: true
  };

  // Buscar en Supabase si existe el registro para obtener la URL del CV o el archivo
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .ilike('name', '%Livier%')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const record = data[0];
        console.log("Registro encontrado en BD:", record);
        livierData.name = record.name || livierData.name;
        livierData.email = record.email || livierData.email;
        livierData.phone = record.phone || livierData.phone;
        
        if (record.cv_name && record.cv_name.startsWith('http')) {
          livierData.cv_url = record.cv_name;
          livierData.cv_name = record.cv_name.split('/').pop() || "CV LIVIER OCEGUEDA.pdf";
          
          // Descargar el archivo desde la URL pública para adjuntarlo en base64
          try {
            console.log("Descargando PDF desde Supabase URL:", record.cv_name);
            const response = await fetch(record.cv_name);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              livierData.cv_base64 = Buffer.from(arrayBuffer).toString('base64');
              console.log("PDF descargado y convertido a Base64 con éxito.");
            }
          } catch (dlErr) {
            console.warn("No se pudo descargar el archivo desde la URL:", dlErr.message);
          }
        }
      }
    } catch (dbErr) {
      console.warn("No se pudo consultar Supabase:", dbErr.message);
    }
  }

  console.log("Enviando correo con los siguientes datos:");
  console.log({
    name: livierData.name,
    email: livierData.email,
    phone: livierData.phone,
    cv_name: livierData.cv_name,
    cv_url: livierData.cv_url,
    has_attachment: !!livierData.cv_base64,
    is_spontaneous: livierData.is_spontaneous
  });

  const result = await sendJobApplicationEmail(livierData);
  console.log("Resultado del envío:", result);
}

main();
