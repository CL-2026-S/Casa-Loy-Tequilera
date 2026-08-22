# Checklist de Implementación

- [x] Modificar base de datos (Completado: se añadieron las columnas a `maquila_leads` y se modificó el constraint de rol en `admin_users` para admitir `lead_maquila`).
- [x] Modificar `api/_utils/emails.js` para añadir la función `sendMaquilaFollowUpEmail`.
- [x] Modificar `api/maquila.js` para admitir `GET` (listado) y registro manual `POST` con rol `lead_maquila`.
- [x] Crear el cron job daily `api/email/maquila-followup.js` para el envío del correo automático.
- [x] Modificar `vercel.json` para agendar la tarea programada.
- [x] Modificar `src/pages/AdminPanel.jsx` para soporte de leads de maquila.
- [x] Implementar soporte para Múltiples Roles (RBAC):
  - [x] Eliminar restricción de base de datos `admin_users_role_check` (`supabase_alter_admin_users_drop_role_check.sql`).
  - [x] Implementar utilidad `userHasRole` en auth backend (`api/_utils/auth.js`).
  - [x] Actualizar validaciones de rol en APIs serverless (`auth.js`, `cms.js`, `maquila.js`, `nativo-booking.js`, `points-of-sale.js`, `tourism.js`).
  - [x] Implementar helpers `userHasRole` e `isReadOnly` en frontend (`src/pages/AdminPanel.jsx`).
  - [x] Modificar formulario de personal en frontend para usar **Checkboxes** (selección múltiple de roles).
  - [x] Actualizar guardado de usuario para concatenar los roles seleccionados con comas.
  - [x] Mostrar badges de múltiples roles simultáneos en la tabla de personal y en el header.
  - [x] Actualizar lógica de redirección de pestaña predeterminada tras el login según prioridades de rol.
- [x] Verificar compilación y funcionalidad (Vite build exitoso).
- [x] Subir y guardar cambios en Git.
