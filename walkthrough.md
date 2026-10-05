# Walkthrough de Implementación: Vendedores / KAMs & Permisos de Personal (RBAC)

Hemos completado el desarrollo para resolver integralmente los dos temas solicitados:

1. **Despliegue y Gestión de Vendedores / KAMs en Puntos de Venta:**
   - Desplegable interactivo de KAMs registrados en el formulario de Puntos de Venta.
   - Directorio y módulo de administración para registrar nuevos KAMs.
   - Capacidad de **renombrar a un vendedor/KAM** con **sincronización automática en cascada** de todos sus puntos de venta asociados en la base de datos.
   - Opción para **transferir la cartera completa** de puntos de venta de un KAM a otro en un solo clic.

2. **Visualización Detallada de Personal Registrado y Permisos (RBAC):**
   - Buscador y filtro por roles en el listado de personal.
   - Botón interactivo `🛡️ Ver Permisos (N módulos)` en cada colaborador que abre un modal con el desglose exacto de los 13 módulos del sistema (🟢 Permitido vs ⚪ Sin Acceso).
   - Modal interactivo de **Matriz Global de Roles y Permisos (RBAC)** con explicación clara de facultades por cada rol.
   - Formulario de alta/edición de personal enriquecido con explicaciones directas en cada casilla de rol.

---

## 1. Vendedores / KAMs en Puntos de Venta

### Base de Datos & Migración
* Se creó la tabla `sales_kams` en Supabase con RLS habilitado y políticas de acceso.
* Se migraron automáticamente los 7 vendedores/KAMs existentes registrados en los 604 puntos de venta actuales: *Sofia Mejia*, *Julio Sanchez*, *Alejandro Carranza*, *Isaac Gomez*, *Julio Delgado*, *Victor Curiel*, *Jose Zarate*.
* [NEW] [`supabase_sales_kams.sql`](file:///c:/Users/Jessy/Downloads/Casa%20Loy%20Tequilera/supabase_sales_kams.sql): Script SQL para reproducir la migración en cualquier ambiente.

### API Serverless
* [NEW] [`api/kams.js`](file:///c:/Users/Jessy/Downloads/Casa%20Loy%20Tequilera/api/kams.js):
  * `GET`: Devuelve la lista de KAMs registrados y el conteo de tiendas asignadas a cada uno desde `points_of_sale`.
  * `POST`: Registro de un nuevo KAM (nombre único, correo, teléfono, notas, estatus activo/inactivo).
  * `PUT`: Modificación o renombramiento. **Si el nombre cambia, actualiza automáticamente todos los registros en `points_of_sale` donde `fase = old_name` a `new_name`**.
  * `PUT (action: 'reassign_stores')`: Permite transferir todos los puntos de venta de un vendedor origen a un vendedor destino.
  * `DELETE`: Eliminación de un KAM con opción de reasignar sus tiendas previamente.

### Interfaz en Panel de Administración
* [MODIFY] [`src/pages/AdminPanel.jsx`](file:///c:/Users/Jessy/Downloads/Casa%20Loy%20Tequilera/src/pages/AdminPanel.jsx):
  * **Formulario de Puntos de Venta:** El campo `Vendedor / KAM Asignado` ahora es un menú desplegable `<select>` que lista a los KAMs registrados con su conteo de tiendas y estatus. Cuenta con un botón de acceso directo `+ Registrar KAM` para agregar un vendedor sin abandonar la captura.
  * **Botón en Toolbar & Métrica Interactiva:** Se añadió el botón `Directorio Vendedores/KAMs (N)` y la tarjeta métrica de Vendedores/KAMs ahora es clicable para abrir directamente la gestión.
  * **Modal "Directorio de Vendedores y KAMs":**
    * Búsqueda en tiempo real por nombre, notas o correo.
    * Formulario para crear o renombrar KAMs (con aviso explícito sobre la sincronización en cascada).
    * Modal de transferencia rápida de cartera ("Reasignar Cartera").
    * Eliminación protegida para administradores.

---

## 2. Personal y Roles (RBAC): Consulta de Permisos

### Catálogo Maestro y Evaluador de Permisos
* Se definió en [`src/pages/AdminPanel.jsx`](file:///c:/Users/Jessy/Downloads/Casa%20Loy%20Tequilera/src/pages/AdminPanel.jsx):
  * `ROLES_CATALOG`: Especificación exhaustiva de los 8 roles del sistema:
    1. **Administrador General** (`admin`): Control total de todos los módulos.
    2. **Editor de Contenidos & CMS** (`editor`): Blog, Asistente IA, Banners, Platillos, Puntos de Venta y Vacantes.
    3. **Gestor de Experiencias y Turismo** (`experience_manager`): Calendario, cupos, validación QR, bitácora turística y cupones.
    4. **Gestor de Restaurante Nativo** (`restaurant_manager`): Reservaciones de mesas y comensales.
    5. **Cuentas por Cobrar & Facturación** (`cuentas_por_cobrar`): Bitácora financiera y timbrado fiscal CFDI 4.0 ante el SAT.
    6. **Recursos Humanos (RH)** (`rh`): Publicación de vacantes y descarga de CVs.
    7. **Gestor de Leads de Maquila** (`lead_maquila`): Prospectos industriales, cotizaciones y correos automáticos.
    8. **Visor General (Solo Lectura)** (`viewer`): Consulta sin permisos de alteración ni borrado.
  * `getUserPermissionsMatrix(roleString)`: Función utilitaria que analiza combinaciones de múltiples roles y genera el estatus de acceso (permitido vs denegado) para los 13 módulos del sistema.

### Interfaz de Cuentas de Personal
* **Barra de Búsqueda y Filtros:** Permite filtrar instantáneamente al personal por nombre, correo o rol.
* **Columna "Permisos del Sistema":** Cada fila cuenta con un botón interactivo `🛡️ Ver Permisos (N/13 módulos)` que muestra el conteo de accesos y abre el detalle del colaborador.
* **Modal "Detalle de Permisos por Colaborador":**
  * Presenta tarjeta del usuario con avatar, nombre, correo y roles asignados.
  * Rejilla de tarjetas para cada uno de los 13 módulos del sistema con distintivo `✓ Permitido` o `✕ Sin Acceso` y explicación del alcance.
* **Modal "Matriz y Glosario de Roles del Sistema":**
  * Accesible mediante el botón `Matriz de Permisos` en la cabecera.
  * Tarjetas informativas de cada rol, descripción, facultades y conteo de usuarios asignados.
* **Formulario de Alta y Edición:** Cada checkbox de rol ahora incluye una descripción contextual para que el Administrador conozca con precisión los accesos que está concediendo.

---

## Verificación de Compilación

* Se ejecutó el comando de compilación `npm run build` con Vite.
* El empaquetado finalizó exitosamente en **9.27 segundos** sin errores de sintaxis, tipos o referencias.
