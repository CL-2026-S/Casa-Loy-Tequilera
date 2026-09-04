import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { jobsData } from "../data/jobs";

const REGIMENES_FISCALES = [
  { code: "601", label: "601 - General de Ley Personas Morales" },
  { code: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { code: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { code: "606", label: "606 - Arrendamiento" },
  { code: "607", label: "607 - Régimen de Enajenación o Adquisición de Bienes" },
  { code: "608", label: "608 - Demás ingresos" },
  { code: "609", label: "609 - Consolidación" },
  { code: "610", label: "610 - Residentes en el Extranjero sin Establecimiento Permanente en México" },
  { code: "611", label: "611 - Ingresos por Dividendos (socios y accionistas)" },
  { code: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
  { code: "614", label: "614 - Ingresos por intereses" },
  { code: "615", label: "615 - Régimen de los ingresos por obtención de premios" },
  { code: "616", label: "616 - Sin obligaciones fiscales" },
  { code: "620", label: "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
  { code: "621", label: "621 - Incorporación Fiscal" },
  { code: "622", label: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { code: "623", label: "623 - Opcional para Grupos de Sociedades" },
  { code: "624", label: "624 - Coordinados" },
  { code: "625", label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { code: "626", label: "626 - Régimen Simplificado de Confianza" },
  { code: "628", label: "628 - Hidrocarburos" },
  { code: "629", label: "629 - De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales" },
  { code: "630", label: "630 - Enajenación de acciones en bolsa de valores" }
];

export default function AdminPanel({
  lang,
  setPage,
  maxCapacityLimit,
  setMaxCapacityLimit,
  blockedDates,
  setBlockedDates,
  blockedSlots = [],
  setBlockedSlots,
  bookingsCapacity,
  setBookingsCapacity,
  refreshData
}) {
  // Session states
  const [token, setToken] = useState(() => sessionStorage.getItem("casa_loy_admin_token") || "");
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("casa_loy_admin_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // Helper functions for multiple roles (comma separated)
  const userHasRole = (roleToCheck) => {
    if (!user || !user.role) return false;
    return user.role.split(',').map(r => r.trim()).includes(roleToCheck);
  };
  
  const isReadOnly = () => {
    if (!user || !user.role) return true;
    const roles = user.role.split(',').map(r => r.trim());
    if (roles.includes('admin')) return false; // Admin has write access to everything
    return roles.includes('viewer') || roles.includes('cuentas_por_cobrar');
  };

  // Form states (Login)
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Password Reset states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Layout tabs (adaptable by role)
  // Roles: admin | editor | experience_manager | restaurant_manager | viewer
  const [activeTab, setActiveTab] = useState("calendar");

  // Log sub-tabs and calendar states
  const [logSubTab, setLogSubTab] = useState("list"); // list | calendar
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // --- API DATA STATES ---
  const [bookingsLog, setBookingsLog] = useState([]); // Tours Bookings
  const [restaurantBookings, setRestaurantBookings] = useState([]); // Restaurant Bookings
  const [auditLogs, setAuditLogs] = useState([]); // Audit Log (admin only)
  const [usersList, setUsersList] = useState([]); // Users management (admin only)
  
  // CMS Data States
  const [cmsTab, setCmsTab] = useState("banners"); // banners | dishes | jobs | blog | pos
  const [bannersList, setBannersList] = useState([]);
  const [dishesList, setDishesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [jobApplicationsList, setJobApplicationsList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [posList, setPosList] = useState([]);

  // --- CMS FORM EDITING STATES ---
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jobImageFile, setJobImageFile] = useState(null);
  const [jobImageBase64, setJobImageBase64] = useState("");
  const [jobImageUrlVal, setJobImageUrlVal] = useState("");

  useEffect(() => {
    if (editingJob) {
      setJobImageUrlVal(editingJob.image_url || "");
      setJobImageFile(null);
      setJobImageBase64("");
    } else {
      setJobImageUrlVal("");
      setJobImageFile(null);
      setJobImageBase64("");
    }
  }, [editingJob]);

  const [editingBlog, setEditingBlog] = useState(null);
  const [authorsList, setAuthorsList] = useState([]);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [editingPos, setEditingPos] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // IA Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiType, setAiType] = useState("blog_content"); // blog_content | seo_meta
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  // Validation / QR scanner states
  const [ticketSearchCode, setTicketSearchCode] = useState("");
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [searchStatus, setSearchStatus] = useState(""); // "", "found_valid", "found_used", "not_found"
  const [scanValidatedTime, setScanValidatedTime] = useState("");
  const [validationSuccessMsg, setValidationSuccessMsg] = useState("");
  const [scannerActive, setScannerActive] = useState(false);

  // Manual Capture forms toggles
  const [showManualForm, setShowManualForm] = useState(false);
  const [showRestManualForm, setShowRestManualForm] = useState(false);

  // Manual Tour Reservation fields
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualTour, setManualTour] = useState("oro");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("11:00 AM");
  const [manualGuests, setManualGuests] = useState(1);
  const [manualAmount, setManualAmount] = useState(550);
  const [manualMethod, setManualMethod] = useState("Efectivo");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Manual Tour Billing details
  const [manualRequiresInvoice, setManualRequiresInvoice] = useState(false);
  const [manualRfc, setManualRfc] = useState("");
  const [manualRazonSocial, setManualRazonSocial] = useState("");
  const [manualPostalCode, setManualPostalCode] = useState("");
  const [manualRegimenFiscal, setManualRegimenFiscal] = useState("");
  const [manualCfdiUse, setManualCfdiUse] = useState("G03");
  const [manualCardType, setManualCardType] = useState("");

  // Manual Tour Discount states
  const [manualDiscountCodeInput, setManualDiscountCodeInput] = useState("");
  const [manualAppliedCoupon, setManualAppliedCoupon] = useState(null); // { code, discount_type, value }
  const [manualCouponError, setManualCouponError] = useState("");
  const [manualCouponSuccess, setManualCouponSuccess] = useState("");
  const [manualIsValidatingCoupon, setManualIsValidatingCoupon] = useState(false);

  // Admin Discount Codes list state
  const [discountCodesList, setDiscountCodesList] = useState([]);
  const [isCreatingDiscountCode, setIsCreatingDiscountCode] = useState(false);
  const [editingDiscountCode, setEditingDiscountCode] = useState(null);

  const handleManualApplyCoupon = async () => {
    if (!manualDiscountCodeInput.trim()) {
      setManualCouponError("Por favor escribe un código.");
      setManualCouponSuccess("");
      return;
    }

    setManualIsValidatingCoupon(true);
    setManualCouponError("");
    setManualCouponSuccess("");

    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate_discount_code",
          code: manualDiscountCodeInput
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setManualAppliedCoupon(data);
        setManualCouponSuccess(`¡Código ${data.code} aplicado con éxito!`);
      } else {
        setManualAppliedCoupon(null);
        setManualCouponError(data.error || "Código no válido.");
      }
    } catch (e) {
      console.error(e);
      setManualCouponError("Error al validar el cupón.");
    } finally {
      setManualIsValidatingCoupon(false);
    }
  };

  const handleManualRemoveCoupon = () => {
    setManualAppliedCoupon(null);
    setManualDiscountCodeInput("");
    setManualCouponError("");
    setManualCouponSuccess("");
  };

  // Coupon management functions (Admin)
  const handleCreateDiscountCode = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const code = formData.get("code");
    const discount_type = formData.get("discount_type");
    const value = formData.get("value");
    const max_uses = formData.get("max_uses");
    const expires_at = formData.get("expires_at");

    if (!code || !discount_type || value === undefined) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setIsCreatingDiscountCode(true);

    try {
      const isEditing = !!editingDiscountCode;
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: isEditing ? "update_discount_code" : "create_discount_code",
          code_id: isEditing ? editingDiscountCode.id : undefined,
          code: code.trim().toUpperCase(),
          discount_type,
          value: parseFloat(value),
          max_uses: max_uses ? parseInt(max_uses, 10) : null,
          expires_at: expires_at || null
        })
      });

      if (res.ok) {
        alert(isEditing ? "¡Cupón de descuento actualizado con éxito!" : "¡Cupón de descuento creado con éxito!");
        setEditingDiscountCode(null);
        e.target.reset();
        loadTabData();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "No se pudo guardar el cupón"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con la API.");
    } finally {
      setIsCreatingDiscountCode(false);
    }
  };

  const handleDeleteDiscountCode = async (id, code) => {
    if (!confirm(`¿Estás seguro de eliminar el cupón "${code}"?`)) {
      return;
    }

    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "delete_discount_code",
          code_id: id
        })
      });

      if (res.ok) {
        alert(`Cupón "${code}" eliminado.`);
        loadTabData();
      } else {
        alert("Error al eliminar el cupón.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
  };

  const handleToggleDiscountCode = async (id, currentActive, code) => {
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "toggle_discount_code",
          code_id: id,
          active: !currentActive
        })
      });

      if (res.ok) {
        loadTabData();
      } else {
        alert("Error al cambiar estado del cupón.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
  };

  // Manual Restaurant Reservation fields
  const [restName, setRestName] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [restGuests, setRestGuests] = useState(2);
  const [restDate, setRestDate] = useState("");
  const [restTime, setRestTime] = useState("14:00");
  const [restReason, setRestReason] = useState("otro");
  const [isSubmittingRestManual, setIsSubmittingRestManual] = useState(false);

  // Bulk Edit Capacity States
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 0: true
  });
  const [bulkTimeSlot, setBulkTimeSlot] = useState("11:00 AM");
  const [bulkOccupancyValue, setBulkOccupancyValue] = useState(0);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [blockScope, setBlockScope] = useState("ALL");

  const [selectedQrTicket, setSelectedQrTicket] = useState(null);
  const [downloadStartDate, setDownloadStartDate] = useState("");
  const [downloadEndDate, setDownloadEndDate] = useState("");
  const [appDownloadStartDate, setAppDownloadStartDate] = useState("");
  const [appDownloadEndDate, setAppDownloadEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Maquila Leads States
  const [maquilaLeadsList, setMaquilaLeadsList] = useState([]);
  const [maquilaDownloadStartDate, setMaquilaDownloadStartDate] = useState("");
  const [maquilaDownloadEndDate, setMaquilaDownloadEndDate] = useState("");
  const [maquilaSearchQuery, setMaquilaSearchQuery] = useState("");
  const [maquilaLeadTypeFilter, setMaquilaLeadTypeFilter] = useState("all");
  const [showMaquilaManualForm, setShowMaquilaManualForm] = useState(false);
  const [isSubmittingMaquilaManual, setIsSubmittingMaquilaManual] = useState(false);

  // Manual Maquila Lead Form fields
  const [maquilaManualName, setMaquilaManualName] = useState("");
  const [maquilaManualEmail, setMaquilaManualEmail] = useState("");
  const [maquilaManualPhone, setMaquilaManualPhone] = useState("");
  const [maquilaManualService, setMaquilaManualService] = useState("");
  const [maquilaManualLeadType, setMaquilaManualLeadType] = useState("Empresario");
  const [maquilaManualComments, setMaquilaManualComments] = useState("");
  const [maquilaManualOrigin, setMaquilaManualOrigin] = useState("Expo Tequila");

  // Edit comments inline states
  const [editingMaquilaLeadId, setEditingMaquilaLeadId] = useState(null);
  const [editingMaquilaComments, setEditingMaquilaComments] = useState("");
  const [isUpdatingMaquilaComments, setIsUpdatingMaquilaComments] = useState(false);


  // Verify session on mount and when token changes
  useEffect(() => {
    if (token) {
      verifySession();
    }
  }, [token]);

  // Load active tab data
  useEffect(() => {
    if (isLoggedIn) {
      loadTabData();
    }
  }, [isLoggedIn, activeTab, cmsTab]);

  useEffect(() => {
    // Set default active tab based on user role
    if (user) {
      if (userHasRole("admin") || userHasRole("experience_manager")) {
        setActiveTab("calendar");
      } else if (userHasRole("editor")) {
        setActiveTab("cms");
      } else if (userHasRole("restaurant_manager")) {
        setActiveTab("restaurant");
      } else if (userHasRole("rh")) {
        setActiveTab("cms");
        setCmsTab("jobs");
      } else if (userHasRole("lead_maquila")) {
        setActiveTab("maquila_leads");
      } else if (userHasRole("viewer") || userHasRole("cuentas_por_cobrar")) {
        setActiveTab("log");
      } else {
        setActiveTab("calendar");
      }
    }
  }, [user]);

  // Calculate pricing for manual tour booking
  useEffect(() => {
    const priceMap = { oro: 550, platino: 750, diamante: 1500 };
    const pricePerPerson = priceMap[manualTour] || 550;
    const baseTotal = manualGuests * pricePerPerson;
    
    let discount = 0;
    if (manualAppliedCoupon) {
      if (manualAppliedCoupon.discount_type === "percentage") {
        discount = baseTotal * (manualAppliedCoupon.value / 100);
      } else if (manualAppliedCoupon.discount_type === "fixed") {
        discount = manualAppliedCoupon.value;
      }
    }
    
    setManualAmount(Math.max(0, baseTotal - Math.min(discount, baseTotal)));
  }, [manualGuests, manualTour, manualAppliedCoupon]);

  // Calendar month/week definitions and helpers
  const monthNamesEs = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames = lang === "es" ? monthNamesEs : monthNamesEn;

  const weekDaysEs = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekDaysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = lang === "es" ? weekDaysEs : weekDaysEn;

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
    setSelectedCalendarDate(null);
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
    setSelectedCalendarDate(null);
  };

  const getDaysInMonthArray = () => {
    const year = calendarYear;
    const month = calendarMonth;
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Padding from previous month
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        dayNum: prevMonthLastDate - i,
        isCurrentMonth: false,
        dateStr: null
      });
    }
    
    // Current month days
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(i).padStart(2, "0");
      days.push({
        dayNum: i,
        isCurrentMonth: true,
        dateStr: `${year}-${mStr}-${dStr}`
      });
    }
    
    // Padding to complete grid
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNum: i,
        isCurrentMonth: false,
        dateStr: null
      });
    }
    
    return days;
  };

  const getBookingsForDate = (dateStr) => {
    if (!dateStr) return { bookings: [], paxBySlot: {}, totalPax: 0 };
    const dayBookings = bookingsLog.filter(
      (b) => b.date === dateStr && b.status !== "Cancelada"
    );
    const paxBySlot = {};
    let totalPax = 0;
    dayBookings.forEach((b) => {
      const timeSlot = b.time || "11:00 AM";
      paxBySlot[timeSlot] = (paxBySlot[timeSlot] || 0) + (parseInt(b.guests) || 0);
      totalPax += (parseInt(b.guests) || 0);
    });
    return {
      bookings: dayBookings,
      paxBySlot,
      totalPax
    };
  };

  async function verifySession() {
    try {
      const res = await fetch("/api/auth?action=verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        sessionStorage.setItem("casa_loy_admin_user", JSON.stringify(data.user));
      } else {
        // Token invalid or expired
        handleLogout();
      }
    } catch (e) {
      console.error("Session verification error:", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        sessionStorage.setItem("casa_loy_admin_token", data.token);
        sessionStorage.setItem("casa_loy_admin_user", JSON.stringify(data.user));
        setEmailInput("");
        setPasswordInput("");
      } else {
        setErrorMsg(data.message || (lang === "es" ? "Credenciales incorrectas." : "Incorrect credentials."));
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(lang === "es" ? "Error al conectar con el servidor." : "Server connection error.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("casa_loy_admin_token");
    sessionStorage.removeItem("casa_loy_admin_user");
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResetSuccessMsg("");
    setIsResetting(true);

    try {
      const res = await fetch("/api/auth?action=forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetSuccessMsg(data.message || "Se ha enviado una contraseña temporal a tu correo.");
        setResetEmail("");
      } else {
        setErrorMsg(data.message || "Error al procesar la solicitud.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de conexión con el servidor.");
    } finally {
      setIsResetting(false);
    }
  };

  // Load dynamic data depending on the current tab
  async function loadTabData() {
    const headers = { "Authorization": `Bearer ${token}` };

    if (activeTab === "calendar" || activeTab === "log" || activeTab === "validate") {
      if (refreshData) await refreshData();
      try {
        const res = await fetch("/api/tourism", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.bookingsLog) setBookingsLog(data.bookingsLog);
        }
      } catch (e) {
        console.error("Error fetching tours log:", e);
      }
    }

    if (activeTab === "restaurant") {
      try {
        const res = await fetch("/api/nativo-booking", { headers });
        if (res.ok) {
          const data = await res.json();
          setRestaurantBookings(data);
        }
      } catch (e) {
        console.error("Error fetching restaurant bookings:", e);
      }
    }

    if (activeTab === "audit" && userHasRole("admin")) {
      try {
        const res = await fetch("/api/auth?action=audit_logs", { headers });
        if (res.ok) {
          const data = await res.json();
          setAuditLogs(data.logs || []);
        }
      } catch (e) {
        console.error("Error fetching audit logs:", e);
      }
    }

    if (activeTab === "users" && userHasRole("admin")) {
      try {
        const res = await fetch("/api/auth?action=list_users", { headers });
        if (res.ok) {
          const data = await res.json();
          setUsersList(data.users || []);
        }
      } catch (e) {
        console.error("Error fetching staff users:", e);
      }
    }

    if (activeTab === "cms") {
      try {
        const res = await fetch(`/api/cms?type=${cmsTab}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (cmsTab === "banners") setBannersList(data);
          if (cmsTab === "dishes") setDishesList(data);
          if (cmsTab === "jobs") setJobsList(data);
          if (cmsTab === "blog") {
            setBlogList(data);
            try {
              const aRes = await fetch("/api/cms?type=blog_authors", { headers });
              if (aRes.ok) {
                const aData = await aRes.json();
                setAuthorsList(aData);
              }
            } catch (aErr) {
              console.error("Error loading authors in CMS:", aErr);
            }
          }
          if (cmsTab === "pos") setPosList(data);
          if (cmsTab === "applications") {
            setJobApplicationsList(data);
            // Also fetch jobs to map job_id to title in applications list
            try {
              const jobsRes = await fetch("/api/cms?type=jobs", { headers });
              if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobsList(jobsData);
              }
            } catch (jobsErr) {
              console.error("Error loading jobs fallback for applications:", jobsErr);
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching CMS ${cmsTab}:`, e);
      }
    }

    if (activeTab === "coupons" && (userHasRole("admin") || userHasRole("experience_manager"))) {
      try {
        const res = await fetch("/api/tourism", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: "list_discount_codes" })
        });
        if (res.ok) {
          const data = await res.json();
          setDiscountCodesList(data.codes || []);
        }
      } catch (e) {
        console.error("Error fetching discount codes:", e);
      }
    }

    if (activeTab === "maquila_leads") {
      try {
        const res = await fetch("/api/maquila", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setMaquilaLeadsList(data);
        }
      } catch (e) {
        console.error("Error fetching maquila leads:", e);
      }
    }
  };

  // --- ACTIONS FOR EXPERIENCE CALENDAR ---
  const getMatchingDates = () => {
    if (!bulkStartDate || !bulkEndDate) return [];
    const start = new Date(bulkStartDate + "T00:00:00");
    const end = new Date(bulkEndDate + "T00:00:00");
    if (end < start) return [];
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (selectedWeekdays[dayOfWeek]) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        dates.push(`${y}-${m}-${d}`);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleBulkBlock = async (shouldBlock) => {
    const dates = getMatchingDates();
    if (dates.length === 0) {
      alert("Selecciona un rango de fechas válido y al menos un día de la semana.");
      return;
    }
    const scopeLabel = blockScope === "ALL" ? "todo el día" : `el horario ${blockScope}`;
    if (!confirm(`¿Confirmas que deseas ${shouldBlock ? "BLOQUEAR" : "DESBLOQUEAR"} ${scopeLabel} en los ${dates.length} días seleccionados?`)) {
      return;
    }

    setIsSubmittingBulk(true);
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: shouldBlock ? "block_dates" : "unblock_dates",
          dates,
          time_str: blockScope
        })
      });
      if (res.ok) {
        alert(`¡Se han ${shouldBlock ? "bloqueado" : "desbloqueado"} ${dates.length} días con éxito!`);
        loadTabData();
      } else {
        alert("Error al actualizar la base de datos.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleBulkSetOccupancy = async () => {
    const dates = getMatchingDates();
    if (dates.length === 0) {
      alert("Selecciona un rango de fechas válido.");
      return;
    }
    if (!confirm(`¿Confirmas que deseas fijar la ocupación del horario ${bulkTimeSlot} a ${bulkOccupancyValue} lugares en ${dates.length} días?`)) {
      return;
    }

    setIsSubmittingBulk(true);
    try {
      const slotOverrides = dates.map((d) => ({
        date_str: d,
        time_str: bulkTimeSlot,
        occupied_count: parseInt(bulkOccupancyValue) || 0
      }));

      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "bulk_set_occupancy",
          slotOverrides
        })
      });

      if (res.ok) {
        alert("Ocupación masiva actualizada con éxito.");
        loadTabData();
      } else {
        alert("Error al actualizar ocupaciones.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleUpdateGeneralCapacity = async () => {
    if (maxCapacityLimit < 1) return;
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "set_capacity",
          capacity: maxCapacityLimit
        })
      });
      if (res.ok) {
        alert("Límite de aforo general actualizado.");
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- TOUR STATUS AND TICKET VALIDATION ---
  const handleUpdateTourStatus = async (code, newStatus) => {
    if (!confirm(`¿Deseas cambiar el estado de la reserva ${code} a "${newStatus}"?`)) {
      return;
    }
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update_status",
          code,
          status: newStatus
        })
      });
      if (res.ok) {
        alert("Estado actualizado con éxito.");
        loadTabData();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || 'Error del servidor'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error de red.");
    }
  };

  const handleToggleInvoiceSent = async (code, isSent) => {
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update_invoice_sent",
          code,
          invoice_sent: isSent
        })
      });
      if (res.ok) {
        setBookingsLog(prev => prev.map(b => b.code === code ? { ...b, invoice_sent: isSent } : b));
        if (selectedQrTicket && selectedQrTicket.code === code) {
          setSelectedQrTicket(prev => ({ ...prev, invoice_sent: isSent }));
        }
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || 'Error del servidor'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el estado de la factura.");
    }
  };

  const handleDownloadCsv = () => {
    if (!downloadStartDate || !downloadEndDate) {
      alert("Por favor selecciona una fecha de inicio y una fecha de fin.");
      return;
    }

    if (downloadStartDate > downloadEndDate) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    const filtered = bookingsLog.filter(log => {
      return log.date >= downloadStartDate && log.date <= downloadEndDate;
    });

    if (filtered.length === 0) {
      alert("No se encontraron reservaciones en el periodo seleccionado.");
      return;
    }

    const headers = [
      "Código",
      "Cliente",
      "Email",
      "Teléfono",
      "Tour",
      "Fecha",
      "Hora",
      "Pax",
      "Monto (MXN)",
      "Método Pago",
      "Origen",
      "Creado Por",
      "Estado",
      "Requiere Factura",
      "RFC",
      "Razón Social",
      "Código Postal",
      "Régimen Fiscal",
      "Uso CFDI",
      "Tipo de Tarjeta",
      "Factura Enviada"
    ];

    const rows = filtered.map(log => [
      log.code,
      log.name,
      log.email,
      log.phone,
      log.packageName,
      log.date,
      log.time,
      log.guests,
      log.amount,
      log.method,
      log.creation_mode === "manual" ? "Manual" : "Automático (Pago Online)",
      log.created_by === "customer" ? "Cliente" : log.created_by,
      log.status,
      log.requires_invoice ? "Sí" : "No",
      log.rfc || "",
      log.razon_social || "",
      log.postal_code || "",
      log.regimen_fiscal || "",
      log.cfdi_use || "",
      log.card_type || "",
      log.invoice_sent ? "Sí" : "No"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
      }).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reservaciones_casa_loy_${downloadStartDate}_a_${downloadEndDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadApplicationsCsv = () => {
    if (!appDownloadStartDate || !appDownloadEndDate) {
      alert("Por favor selecciona una fecha de inicio y una fecha de fin.");
      return;
    }

    if (appDownloadStartDate > appDownloadEndDate) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    const filtered = jobApplicationsList.filter(app => {
      const appDate = app.created_at.split("T")[0];
      return appDate >= appDownloadStartDate && appDate <= appDownloadEndDate;
    });

    if (filtered.length === 0) {
      alert("No se encontraron postulantes en el periodo seleccionado.");
      return;
    }

    const headers = [
      "Nombre",
      "Correo",
      "Teléfono",
      "Vacante de Interés",
      "CV Recibido",
      "Fecha de Registro"
    ];

    const rows = filtered.map(app => {
      const matchedJob = jobsList.find(j => j.id === app.job_id);
      const jobTitle = app.job_id === 'spontaneous' 
        ? "Postulación Espontánea" 
        : (matchedJob ? matchedJob.title_es : app.job_id);
      
      const appDateStr = new Date(app.created_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      return [
        app.name,
        app.email,
        app.phone,
        jobTitle,
        app.cv_name,
        appDateStr
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
      }).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `postulantes_casa_loy_${appDownloadStartDate}_a_${appDownloadEndDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerSearchByCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const ticket = bookingsLog.find((b) => b.code.trim().toUpperCase() === cleanCode);

    if (ticket) {
      setSearchedTicket(ticket);
      if (ticket.status === "Completada" || ticket.used_at) {
        setSearchStatus("found_used");
        setScanValidatedTime(ticket.used_at || ticket.timestamp);
      } else if (ticket.status === "Intento de Pago" || ticket.status === "Carrito Abandonado (Intento de Pago)") {
        setSearchStatus("found_attempt");
      } else if (ticket.status === "Cancelada") {
        setSearchStatus("found_cancelled");
      } else {
        setSearchStatus("found_valid");
      }
    } else {
      setSearchStatus("not_found");
    }
  };

  const handleSearchTicket = () => {
    setSearchStatus("");
    setSearchedTicket(null);
    setValidationSuccessMsg("");
    if (!ticketSearchCode) return;
    triggerSearchByCode(ticketSearchCode);
  };

  const handleMarkTicketAsUsed = async () => {
    if (!searchedTicket) return;
    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "validate_ticket",
          code: searchedTicket.code
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScanValidatedTime(data.used_at);
        setSearchStatus("found_used");
        setValidationSuccessMsg("¡Boleto Validado Exitosamente!");
        loadTabData();
      } else {
        alert("Error al validar boleto.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // QR Camera Scanner hook
  useEffect(() => {
    let html5QrcodeScanner = null;
    if (scannerActive) {
      const timer = setTimeout(() => {
        try {
          html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
          );
          html5QrcodeScanner.render(
            (decodedText) => {
              let ticketCode = decodedText;
              if (decodedText.includes("code=")) {
                try {
                  const urlParams = new URLSearchParams(decodedText.split("?")[1]);
                  ticketCode = urlParams.get("code") || decodedText;
                } catch (e) {
                  console.error(e);
                }
              }
              const cleanCode = ticketCode.trim().toUpperCase();
              setTicketSearchCode(cleanCode);
              setScannerActive(false);
              triggerSearchByCode(cleanCode);
            },
            () => {}
          );
        } catch (e) {
          console.error("Error creating scanner:", e);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error(err));
      }
    };
  }, [scannerActive]);

  // --- MAQUILA LEADS ACTIONS ---
  const handleMaquilaManualSubmit = async (e) => {
    e.preventDefault();
    if (!maquilaManualName || !maquilaManualEmail || !maquilaManualPhone) {
      alert("Por favor completa los campos obligatorios (Nombre, Correo y Teléfono).");
      return;
    }

    setIsSubmittingMaquilaManual(true);

    try {
      const res = await fetch("/api/maquila", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          creation_mode: 'manual',
          name: maquilaManualName,
          email: maquilaManualEmail,
          phone: maquilaManualPhone,
          solution: maquilaManualService,
          lead_type: maquilaManualLeadType,
          comments: maquilaManualComments,
          origin: maquilaManualOrigin
        })
      });

      if (res.ok) {
        alert("¡Lead registrado con éxito!");
        setMaquilaManualName("");
        setMaquilaManualEmail("");
        setMaquilaManualPhone("");
        setMaquilaManualService("");
        setMaquilaManualLeadType("Empresario");
        setMaquilaManualComments("");
        setMaquilaManualOrigin("Expo Tequila");
        setShowMaquilaManualForm(false);
        loadTabData();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "No se pudo registrar el lead"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con la API.");
    } finally {
      setIsSubmittingMaquilaManual(false);
    }
  };

  const handleDownloadMaquilaCsv = () => {
    if (!maquilaDownloadStartDate || !maquilaDownloadEndDate) {
      alert("Por favor selecciona una fecha de inicio y una fecha de fin.");
      return;
    }

    if (maquilaDownloadStartDate > maquilaDownloadEndDate) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    const filtered = maquilaLeadsList.filter(lead => {
      if (!lead.created_at) return false;
      const leadDate = lead.created_at.split('T')[0];
      return leadDate >= maquilaDownloadStartDate && leadDate <= maquilaDownloadEndDate;
    });

    if (filtered.length === 0) {
      alert("No se encontraron leads en el periodo seleccionado.");
      return;
    }

    const headers = [
      "Fecha Registro",
      "Nombre",
      "Email",
      "Telefono",
      "Lada",
      "Empresa",
      "Servicio",
      "Tipo Lead",
      "Comentarios",
      "Origen",
      "Seguimiento Enviado",
      "Fecha Seguimiento"
    ];

    const rows = filtered.map(lead => [
      lead.created_at ? new Date(lead.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) : '',
      lead.name,
      lead.email,
      lead.phone,
      lead.lada || '',
      lead.company || '',
      lead.solution || '',
      lead.lead_type || lead.objective || '',
      lead.comments || '',
      lead.origin || 'quiz',
      lead.follow_up_sent ? "Sí" : "No",
      lead.follow_up_sent_at ? new Date(lead.follow_up_sent_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) : ''
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
      }).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_maquila_${maquilaDownloadStartDate}_a_${maquilaDownloadEndDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateMaquilaComments = async (leadId, newComments) => {
    setIsUpdatingMaquilaComments(true);
    try {
      const res = await fetch("/api/maquila?action=update_comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: leadId,
          comments: newComments
        })
      });

      if (res.ok) {
        setEditingMaquilaLeadId(null);
        // Refresh local leads list
        setMaquilaLeadsList(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, comments: newComments } : lead
        ));
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "No se pudieron actualizar los comentarios."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con la API.");
    } finally {
      setIsUpdatingMaquilaComments(false);
    }
  };

  // --- MANUAL RESERVATIONS CAPTURES ---
  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    if (!manualName || !manualEmail || !manualDate || !manualTime) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    if (manualRequiresInvoice) {
      if (!manualRfc || manualRfc.trim().length < 12 || manualRfc.trim().length > 13) {
        alert("Por favor introduce un RFC válido (12 o 13 caracteres).");
        return;
      }
      if (!manualRazonSocial || manualRazonSocial.trim() === "") {
        alert("Por favor introduce la Razón Social.");
        return;
      }
      if (!manualPostalCode || manualPostalCode.trim().length !== 5) {
        alert("Por favor introduce un Código Postal válido (5 dígitos).");
        return;
      }
      if (!manualRegimenFiscal) {
        alert("Por favor selecciona el Régimen Fiscal.");
        return;
      }
      if (!manualCfdiUse) {
        alert("Por favor selecciona el Uso de CFDI.");
        return;
      }
      if (manualMethod === "Tarjeta" && !manualCardType) {
        alert("Por favor selecciona el Tipo de Tarjeta.");
        return;
      }
    }

    setIsSubmittingManual(true);
    const randomCode = `CL-MAN-${manualTour.toUpperCase()}-${manualDate.replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_booking',
          code: randomCode,
          customer_name: manualName,
          customer_email: manualEmail,
          customer_phone: manualPhone || '',
          tour_id: manualTour,
          date_str: manualDate,
          time_str: manualTime,
          guests: parseInt(manualGuests),
          total_paid: parseFloat(manualAmount),
          payment_method: manualMethod,
          requires_invoice: manualRequiresInvoice,
          rfc: manualRequiresInvoice ? manualRfc : '',
          razon_social: manualRequiresInvoice ? manualRazonSocial : '',
          postal_code: manualRequiresInvoice ? manualPostalCode : '',
          regimen_fiscal: manualRequiresInvoice ? manualRegimenFiscal : '',
          cfdi_use: manualRequiresInvoice ? manualCfdiUse : '',
          card_type: (manualRequiresInvoice && manualMethod === 'Tarjeta') ? manualCardType : '',
          discount_code: manualAppliedCoupon ? manualAppliedCoupon.code : null
        })
      });

      if (res.ok) {
        alert(`¡Reserva manual registrada con éxito! Código: ${randomCode}`);
        setManualName("");
        setManualEmail("");
        setManualPhone("");
        setManualGuests(1);
        setManualDate("");
        setManualRequiresInvoice(false);
        setManualRfc("");
        setManualRazonSocial("");
        setManualPostalCode("");
        setManualRegimenFiscal("");
        setManualCfdiUse("G03");
        setManualCardType("");
        setManualDiscountCodeInput("");
        setManualAppliedCoupon(null);
        setManualCouponError("");
        setManualCouponSuccess("");
        setShowManualForm(false);
        loadTabData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'SERVER_ERROR'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleRestManualBookingSubmit = async (e) => {
    e.preventDefault();
    if (!restName || !restPhone || !restDate || !restTime) {
      alert("Por favor completa los campos requeridos.");
      return;
    }
    setIsSubmittingRestManual(true);
    const rand = Math.floor(10000 + Math.random() * 90000);
    const code = `NAT-MAN-${rand}`;

    try {
      const res = await fetch("/api/nativo-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_booking',
          code,
          customer_name: restName,
          customer_phone: restPhone,
          guests: parseInt(restGuests, 10),
          date_str: restDate,
          time_str: restTime,
          reason: restReason
        })
      });

      if (res.ok) {
        alert(`¡Reservación de restaurante guardada con éxito! Código: ${code}`);
        setRestName("");
        setRestPhone("");
        setRestGuests(2);
        setRestDate("");
        setShowRestManualForm(false);
        loadTabData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'SERVER_ERROR'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al registrar reserva.");
    } finally {
      setIsSubmittingRestManual(false);
    }
  };

  const handleUpdateRestStatus = async (code, newStatus) => {
    if (!confirm(`¿Deseas cambiar el estado de la reserva ${code} a "${newStatus}"?`)) {
      return;
    }
    try {
      const res = await fetch("/api/nativo-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update_status",
          code,
          status: newStatus
        })
      });
      if (res.ok) {
        alert("Estado de mesa actualizado.");
        loadTabData();
      } else {
        alert("Error al actualizar el estado.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CMS MUTATION HANDLERS ---
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/cms?action=update_banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, id: editingBanner?.id })
      });
      if (res.ok) {
        alert("Banner guardado con éxito.");
        setEditingBanner(null);
        loadTabData();
      } else {
        alert("Error al guardar banner.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("¿Deseas eliminar este banner?")) return;
    try {
      const res = await fetch("/api/cms?action=delete_banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Banner eliminado.");
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDish = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/cms?action=update_dish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Platillo destacado actualizado y autorizado.");
        loadTabData();
      } else {
        alert("Error al actualizar platillo.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Parse JSON lists
    const responsibilities = data.responsibilities_raw ? data.responsibilities_raw.split('\n').filter(Boolean).map((line, i) => {
      const [title_es, desc_es] = line.split('|');
      return { num: `0${i+1}`, title_es: title_es?.trim(), desc_es: desc_es?.trim(), title_en: title_es?.trim(), desc_en: desc_es?.trim() };
    }) : [];

    const requirements = data.requirements_raw ? data.requirements_raw.split('\n').filter(Boolean).map(line => {
      const [icon, title_es, desc_es] = line.split('|');
      return { icon: icon?.trim() || 'school', title_es: title_es?.trim(), desc_es: desc_es?.trim(), title_en: title_es?.trim(), desc_en: desc_es?.trim() };
    }) : [];

    const knowledge = data.knowledge_raw ? data.knowledge_raw.split('\n').filter(Boolean).map(line => ({ es: line.trim(), en: line.trim() })) : [];
    const benefits = data.benefits_raw ? data.benefits_raw.split('\n').filter(Boolean).map(line => ({ es: line.trim(), en: line.trim() })) : [];

    try {
      const payload = {
        ...data,
        id: editingJob?.id || data.id,
        responsibilities,
        requirements,
        knowledge,
        benefits,
        is_active: data.is_active === "true",
        image_url: jobImageUrlVal
      };

      if (jobImageBase64 && jobImageFile) {
        payload.image_base64 = jobImageBase64;
        payload.image_filename = jobImageFile.name;
      }

      const res = await fetch("/api/cms?action=save_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Vacante de empleo guardada.");
        setEditingJob(null);
        loadTabData();
      } else {
        alert("Error al guardar vacante.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("¿Deseas eliminar esta vacante?")) return;
    try {
      const res = await fetch("/api/cms?action=delete_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Vacante eliminada.");
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const mapLocalJobToDb = (localJob) => {
    return {
      id: localJob.id,
      category: localJob.category || "comercial",
      title_es: localJob.title?.es || "",
      title_en: localJob.title?.en || "",
      location_es: localJob.location?.es || "",
      location_en: localJob.location?.en || "",
      type_es: localJob.type?.es || "",
      type_en: localJob.type?.en || "",
      time_es: localJob.time?.es || "",
      time_en: localJob.time?.en || "",
      hero_desc_es: localJob.heroDesc?.es || "",
      hero_desc_en: localJob.heroDesc?.en || "",
      compensation_es: localJob.compVal?.es || "",
      compensation_en: localJob.compVal?.en || "",
      responsibilities: (localJob.responsibilities || []).map(r => ({
        num: r.num || "01",
        title_es: r.title?.es || r.title || "",
        title_en: r.title?.en || r.title_es || r.title || "",
        desc_es: r.desc?.es || r.desc || "",
        desc_en: r.desc?.en || r.desc_es || r.desc || ""
      })),
      requirements: (localJob.requirements || []).map(r => ({
        icon: r.icon || "school",
        title_es: r.title?.es || r.title || "",
        title_en: r.title?.en || r.title_es || r.title || "",
        desc_es: r.desc?.es || r.desc || "",
        desc_en: r.desc?.en || r.desc_es || r.desc || ""
      })),
      knowledge: (localJob.conocimientos || []).map(k => ({
        es: k.es || k || "",
        en: k.en || k.es || k || ""
      })),
      benefits: (localJob.ofrecemos || []).map(b => ({
        es: b.es || b || "",
        en: b.en || b.es || b || ""
      })),
      image_url: localJob.id === 'kam' ? '/Empleado Casa Loy Tequilera.webp' : '/Trabajo Duro Casa Loy Tequilera Jimado.webp',
      is_active: true,
      is_fallback: true
    };
  };

  const getMergedJobsList = () => {
    const list = [...jobsList];
    jobsData.forEach(fallbackJob => {
      if (!list.some(dbJob => dbJob.id === fallbackJob.id)) {
        list.push(mapLocalJobToDb(fallbackJob));
      }
    });
    return list;
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/cms?action=save_blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, id: editingBlog?.id })
      });
      if (res.ok) {
        alert("Artículo de blog guardado.");
        setEditingBlog(null);
        loadTabData();
      } else {
        alert("Error al guardar blog.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("¿Deseas eliminar este artículo de blog?")) return;
    try {
      const res = await fetch("/api/cms?action=delete_blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Artículo de blog eliminado.");
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- BLOG AUTHORS MANAGEMENT ---
  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/cms?type=blog_authors", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuthorsList(data);
      }
    } catch (e) {
      console.error("Error fetching authors:", e);
    }
  };

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/cms?action=save_author", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, id: editingAuthor?.id })
      });
      if (res.ok) {
        alert("Autor guardado correctamente en el directorio.");
        setEditingAuthor(null);
        fetchAuthors();
      } else {
        alert("Error al guardar autor.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión al guardar autor.");
    }
  };

  const handleDeleteAuthor = async (id) => {
    if (!confirm("¿Deseas eliminar este autor del directorio?")) return;
    try {
      const res = await fetch("/api/cms?action=delete_author", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Autor eliminado del directorio.");
        fetchAuthors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSavedAuthor = (authorId) => {
    setSelectedAuthorId(authorId);
    if (!authorId) return;
    const found = authorsList.find(a => a.id === authorId);
    if (found) {
      const nameInput = document.querySelector('input[name="author_es"]');
      const roleInput = document.querySelector('input[name="author_role"]');
      const photoInput = document.querySelector('input[name="author_photo"]');
      const bioInput = document.querySelector('input[name="author_bio"]');
      if (nameInput) nameInput.value = found.name;
      if (roleInput) roleInput.value = found.role;
      if (photoInput) photoInput.value = found.photo;
      if (bioInput) bioInput.value = found.bio || "";
    }
  };

  // --- KEY ACCOUNT MANAGERS (POS CRUD) ---
  const handleSavePos = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    
    // Convert checkbox string values to booleans
    const booleanFields = [
      'is_active', 'pdv', 'cdc',
      'cl', 'td', 'tz',
      'casa_loy_blanco', 'casa_loy_reposado', 'casa_loy_cristalino', 'casa_loy_anejo', 'casa_loy_piedra_y_agave_blanco', 'casa_loy_piedra_y_agave_reposado',
      'taddel_plata', 'taddel_reposado', 'taddel_cristalino',
      'tierra_zafiro_blanco', 'tierra_zafiro_blanco_100_pure', 'tierra_zafiro_reposado', 'tierra_zafiro_cristalino'
    ];

    const payload = { ...data, id: editingPos?.id };
    booleanFields.forEach(field => {
      payload[field] = data[field] === "true";
    });

    try {
      const res = await fetch(`/api/points-of-sale`, {
        method: editingPos?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Punto de venta guardado con éxito.");
        setEditingPos(null);
        loadTabData();
      } else {
        alert("Error al guardar punto de venta.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePos = async (id) => {
    if (!confirm("¿Deseas eliminar este punto de venta?")) return;
    try {
      const res = await fetch(`/api/points-of-sale`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Punto de venta eliminado.");
        loadTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- STAFF USER MANAGEMENT (Admin only) ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const isNew = !editingUser?.id;

    // Collect checked roles
    const checkedBoxes = Array.from(e.target.querySelectorAll('input[name="roles_checkbox"]:checked'));
    if (checkedBoxes.length === 0) {
      alert("Por favor selecciona al menos un rol para el usuario.");
      return;
    }
    const finalRole = checkedBoxes.map(cb => cb.value).join(',');

    const payload = {
      name: data.name,
      email: data.email,
      role: finalRole,
      id: editingUser?.id
    };
    if (data.password) {
      payload.password = data.password;
    }

    try {
      const res = await fetch(`/api/auth?action=${isNew ? 'create_user' : 'update_user'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        alert(`Usuario ${isNew ? 'creado' : 'actualizado'} con éxito.`);
        setEditingUser(null);
        loadTabData();
      } else {
        alert(`Error: ${resData.message || 'Error del servidor'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la cuenta de ${email}?`)) return;
    try {
      const res = await fetch(`/api/auth?action=delete_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Usuario eliminado.");
        loadTabData();
      } else {
        alert(`Error: ${data.message || 'Error del servidor'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- AI WRITER ASSISTANT ---
  const handleAiAssistSubmit = async () => {
    if (!aiPrompt) return;
    setAiAssistLoading(true);
    setAiResult("");
    try {
      const res = await fetch("/api/cms?action=ai_assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: aiPrompt, type: aiType })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.text);
      } else {
        setAiResult("Error al generar borrador con IA.");
      }
    } catch (e) {
      console.error(e);
      setAiResult("Error de conexión al llamar a la IA.");
    } finally {
      setAiAssistLoading(false);
    }
  };

  const toggleWeekday = (dayNum) => {
    setSelectedWeekdays({ ...selectedWeekdays, [dayNum]: !selectedWeekdays[dayNum] });
  };

  // --- RENDER LOGIN IF NOT LOGGED IN ---
  if (!isLoggedIn) {
    return (
      <div className="bg-[#fcf9f3] min-h-screen flex items-center justify-center py-24 px-4 font-sans select-text">
        <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-2xl space-y-6">
          <div className="text-center border-b border-stone-100 pb-4">
            <span className="font-serif text-3xl font-bold tracking-widest text-[#1c1c18] block uppercase">CASA LOY</span>
            <span className="text-[10px] text-[#8C4723] tracking-widest uppercase font-semibold block mt-1">
              Plataforma Administrativa & CMS
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200/50 text-red-700 p-3.5 text-xs text-left leading-normal">
              ⚠️ {errorMsg}
            </div>
          )}

          {resetSuccessMsg && (
            <div className="bg-green-50 border border-green-200/50 text-green-700 p-3.5 text-xs text-left leading-normal">
              ✅ {resetSuccessMsg}
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-5 text-left">
              <p className="text-xs text-stone-500 leading-relaxed">
                Ingresa tu correo institucional registrado. Si existe en el sistema, te enviaremos una contraseña temporal de un solo uso.
              </p>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="ejemplo@casaloy.com"
                  className="w-full bg-stone-50 border border-stone-200 p-3.5 text-xs focus:outline-none focus:border-[#8C4723] text-[#1c1c18] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-[#2F403E] hover:bg-[#8C4723] text-white py-4 text-xs font-semibold uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                {isResetting ? "Enviando..." : "Enviar Contraseña Temporal"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setErrorMsg("");
                    setResetSuccessMsg("");
                  }}
                  className="text-xs text-[#8C4723] hover:underline bg-transparent border-none cursor-pointer focus:outline-none font-medium"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ejemplo@casaloy.com"
                  className="w-full bg-stone-50 border border-stone-200 p-3.5 text-xs focus:outline-none focus:border-[#8C4723] text-[#1c1c18] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 p-3.5 text-xs focus:outline-none focus:border-[#8C4723] text-[#1c1c18] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#2F403E] hover:bg-[#8C4723] text-white py-4 text-xs font-semibold uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                {isLoggingIn ? "Autenticando..." : "Iniciar Sesión"}
              </button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setErrorMsg("");
                    setResetSuccessMsg("");
                  }}
                  className="text-[10px] text-[#8C4723] hover:underline bg-transparent border-none cursor-pointer focus:outline-none font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <span className="text-[10px] text-stone-400">Acceso Restringido</span>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filter bookings log based on search query
  const filteredBookingsLog = bookingsLog.filter((log) => {
    if (statusFilter !== "all") {
      if (statusFilter === "Carrito Abandonado (Intento de Pago)") {
        if (log.status !== "Carrito Abandonado (Intento de Pago)" && log.status !== "Intento de Pago") {
          return false;
        }
      } else if (log.status !== statusFilter) {
        return false;
      }
    }

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    
    // Convert YYYY-MM-DD to DD/MM/YYYY for Mexican standard date search
    let formattedMexDate = "";
    if (log.date && log.date.includes("-")) {
      const parts = log.date.split("-");
      if (parts.length === 3) {
        formattedMexDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    return (
      (log.code && log.code.toLowerCase().includes(query)) ||
      (log.name && log.name.toLowerCase().includes(query)) ||
      (log.email && log.email.toLowerCase().includes(query)) ||
      (log.phone && log.phone.toLowerCase().includes(query)) ||
      (log.packageName && log.packageName.toLowerCase().includes(query)) ||
      (log.date && log.date.toLowerCase().includes(query)) ||
      (formattedMexDate && formattedMexDate.includes(query)) ||
      (log.time && log.time.toLowerCase().includes(query)) ||
      (log.method && log.method.toLowerCase().includes(query)) ||
      (log.status && log.status.toLowerCase().includes(query))
    );
  });

  // Filter maquila leads based on search query and lead type filter
  const filteredMaquilaLeads = maquilaLeadsList.filter((lead) => {
    const query = maquilaSearchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      (lead.solution && lead.solution.toLowerCase().includes(query)) ||
      (lead.comments && lead.comments.toLowerCase().includes(query)) ||
      (lead.company && lead.company.toLowerCase().includes(query)) ||
      (lead.origin && lead.origin.toLowerCase().includes(query));

    const activeLeadType = lead.lead_type || lead.objective || '';
    const matchesType = maquilaLeadTypeFilter === 'all' || 
      activeLeadType.toLowerCase() === maquilaLeadTypeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  // --- RENDER MAIN ADMIN DASHBOARD (LOGGED IN) ---
  return (
    <div className="bg-[#fcf9f3] min-h-screen text-[#1c1c18] py-24 font-sans select-text">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="bg-white border border-stone-200/60 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-sm">
          <div className="text-left">
            <div className="flex items-center gap-2 text-[#8C4723]">
              <span className="material-symbols-outlined">shield_person</span>
              <h4 className="font-serif text-xl font-bold uppercase tracking-wider">Casa Loy Tequilera Panel</h4>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5 flex-wrap">
              Sesión activa: <strong className="text-stone-800">{user?.name}</strong> • Roles: 
              {String(user?.role || '').split(',').map(r => (
                <span key={r} className="bg-stone-100 text-stone-700 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-sm">{r}</span>
              ))}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage("home")}
              className="border border-stone-200 text-stone-600 hover:bg-stone-50 px-4 py-2.5 text-xs font-medium cursor-pointer"
            >
              Volver a la Web
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#2F403E] hover:bg-red-700 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs based on Role */}
        <div className="flex flex-wrap border-b border-stone-200 gap-4 md:gap-6">
          {(userHasRole("admin") || userHasRole("experience_manager")) && (
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "calendar" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📅 Cupos de Tours
            </button>
          )}

          {(userHasRole("admin") || userHasRole("experience_manager")) && (
            <button
              onClick={() => setActiveTab("validate")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "validate" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🔍 Validador QR
            </button>
          )}

          {(userHasRole("admin") || userHasRole("experience_manager") || userHasRole("viewer") || userHasRole("cuentas_por_cobrar")) && (
            <button
              onClick={() => setActiveTab("log")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "log" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📋 Reservas Tours ({filteredBookingsLog.length !== bookingsLog.length ? `${filteredBookingsLog.length}/${bookingsLog.length}` : bookingsLog.length})
            </button>
          )}

          {(userHasRole("admin") || userHasRole("restaurant_manager") || userHasRole("viewer")) && (
            <button
              onClick={() => setActiveTab("restaurant")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "restaurant" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🍽️ Reservas Restaurante ({restaurantBookings.length})
            </button>
          )}

          {(userHasRole("admin") || userHasRole("editor") || userHasRole("rh")) && (
            <button
              onClick={() => {
                setActiveTab("cms");
                if (userHasRole("rh") && !userHasRole("admin") && !userHasRole("editor") && cmsTab !== "jobs" && cmsTab !== "applications") {
                  setCmsTab("jobs");
                }
              }}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "cms" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {(userHasRole("rh") && !userHasRole("admin") && !userHasRole("editor")) ? "💼 Bolsa de Trabajo" : "📝 CMS Contenidos"}
            </button>
          )}

          {userHasRole("admin") && (
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "users" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              👥 Personal
            </button>
          )}

          {(userHasRole("admin") || userHasRole("experience_manager")) && (
            <button
              onClick={() => setActiveTab("coupons")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "coupons" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🏷️ Cupones
            </button>
          )}

          {(userHasRole("admin") || userHasRole("lead_maquila") || userHasRole("editor") || userHasRole("viewer")) && (
            <button
              onClick={() => setActiveTab("maquila_leads")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "maquila_leads" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              💼 Leads Maquila
            </button>
          )}

          {(userHasRole("admin") || userHasRole("viewer")) && (
            <button
              onClick={() => setActiveTab("audit")}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all border-b-2 ${
                activeTab === "audit" ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📜 Auditoría
            </button>
          )}
        </div>

        {/* Tab Content Panel */}
        <div className="bg-white border border-stone-200/60 p-8 shadow-sm">
          
          {/* TAB: Calendar & Capacity (Tours) */}
          {(userHasRole("admin") || userHasRole("experience_manager")) && activeTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-stone-50 p-4 border border-stone-200/50">
                  <h5 className="text-xs uppercase tracking-wider text-[#8C4723] font-bold mb-2">
                    Aforo Máximo General por Sesión (Tours)
                  </h5>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={maxCapacityLimit}
                      onChange={(e) => setMaxCapacityLimit(parseInt(e.target.value) || 50)}
                      className="bg-white border border-stone-200 p-2.5 w-24 text-center text-sm font-bold focus:outline-none"
                    />
                    <button
                      onClick={handleUpdateGeneralCapacity}
                      className="bg-[#2F403E] hover:bg-[#8C4723] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Actualizar Aforo
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs uppercase tracking-wider text-stone-700 font-bold border-b border-stone-100 pb-2">
                    Administración Masiva de Cupos / Bloqueos
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Fecha Inicio</label>
                      <input
                        type="date"
                        value={bulkStartDate}
                        onChange={(e) => setBulkStartDate(e.target.value)}
                        className="bg-stone-50 border border-stone-200 p-3 w-full text-xs focus:outline-none focus:border-[#8C4723]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Fecha Fin</label>
                      <input
                        type="date"
                        value={bulkEndDate}
                        onChange={(e) => setBulkEndDate(e.target.value)}
                        className="bg-stone-50 border border-stone-200 p-3 w-full text-xs focus:outline-none focus:border-[#8C4723]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">
                      Días de la semana a aplicar:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Lun", val: 1 }, { name: "Mar", val: 2 }, { name: "Mié", val: 3 },
                        { name: "Jue", val: 4 }, { name: "Vie", val: 5 }, { name: "Sáb", val: 6 }, { name: "Dom", val: 0 }
                      ].map((day) => (
                        <button
                          key={day.val}
                          type="button"
                          onClick={() => toggleWeekday(day.val)}
                          className={`px-3 py-2 text-xs font-bold transition-all border ${
                            selectedWeekdays[day.val]
                              ? "bg-[#8C4723] text-white border-[#8C4723]"
                              : "bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400"
                          }`}
                        >
                          {day.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-stone-200 p-4 space-y-3 bg-stone-50">
                      <span className="text-[10px] font-bold text-stone-700 block uppercase">
                        Bloquear o Habilitar Días
                      </span>
                      <p className="text-[10px] text-stone-500 leading-normal">
                        Cierra la hacienda para tours en el rango de fechas seleccionado (mantenimiento o eventos privados).
                      </p>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-stone-500 uppercase">
                          Alcance del bloqueo:
                        </label>
                        <select
                          value={blockScope}
                          onChange={(e) => setBlockScope(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none"
                        >
                          <option value="ALL">Todo el día</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="1:00 PM">1:00 PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleBulkBlock(true)}
                          disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                          className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          🔒 Bloquear Días
                        </button>
                        <button
                          onClick={() => handleBulkBlock(false)}
                          disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          🔓 Habilitar Días
                        </button>
                      </div>
                    </div>

                    <div className="border border-stone-200 p-4 space-y-3 bg-stone-50">
                      <span className="text-[10px] font-bold text-stone-700 block uppercase">
                        Configurar Lugares Ocupados
                      </span>
                      <p className="text-[10px] text-stone-500 leading-normal">
                        Fija una afluencia predeterminada para el turno indicado en todo el rango seleccionado.
                      </p>
                      <div className="flex gap-2 items-center">
                        <select
                          value={bulkTimeSlot}
                          onChange={(e) => setBulkTimeSlot(e.target.value)}
                          className="bg-white border border-stone-200 p-2.5 flex-1 text-xs focus:outline-none"
                        >
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="1:00 PM">1:00 PM</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bulkOccupancyValue}
                          onChange={(e) => setBulkOccupancyValue(parseInt(e.target.value) || 0)}
                          className="bg-white border border-stone-200 p-2 w-16 text-center text-xs focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <button
                        onClick={handleBulkSetOccupancy}
                        disabled={isSubmittingBulk || !bulkStartDate || !bulkEndDate}
                        className="w-full bg-[#2F403E] hover:bg-[#8C4723] text-white py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Establecer Ocupación
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar list of blocked dates */}
              <div className="lg:col-span-4 space-y-4 lg:pl-6 lg:border-l border-stone-200">
                <h5 className="text-xs uppercase tracking-wider text-[#8C4723] font-bold border-b border-stone-100 pb-2">
                  Bloqueos Activos ({blockedDates.length + blockedSlots.length})
                </h5>
                {blockedDates.length === 0 && blockedSlots.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No hay bloqueos activos actualmente.</p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {/* Render Full Day Blocks */}
                    {blockedDates.map((dateStr) => {
                      const parts = dateStr.split("-");
                      const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                      return (
                        <div key={`all-${dateStr}`} className="flex justify-between items-center bg-stone-50 border border-stone-200/50 p-2.5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-700">🔒 Cerrado {formatted}</span>
                            <span className="text-[9px] text-[#8C4723] font-medium">Día Completo</span>
                          </div>
                          <button
                            onClick={async () => {
                              if (!confirm(`¿Desbloquear la fecha ${formatted} (Día Completo)?`)) return;
                              try {
                                const res = await fetch("/api/tourism", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ action: "unblock_dates", dates: [dateStr], time_str: "ALL" })
                                });
                                if (res.ok) loadTabData();
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="text-[10px] text-red-700 hover:text-red-950 font-bold uppercase cursor-pointer"
                          >
                            Abrir
                          </button>
                        </div>
                      );
                    })}

                    {/* Render Specific Slot Blocks */}
                    {blockedSlots.map((slot) => {
                      const parts = slot.date_str.split("-");
                      const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                      return (
                        <div key={`slot-${slot.date_str}-${slot.time_str}`} className="flex justify-between items-center bg-stone-50 border border-stone-200/50 p-2.5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-700">🔒 Cerrado {formatted}</span>
                            <span className="text-[9px] text-stone-500 font-medium">Horario: {slot.time_str}</span>
                          </div>
                          <button
                            onClick={async () => {
                              if (!confirm(`¿Desbloquear el horario ${slot.time_str} para la fecha ${formatted}?`)) return;
                              try {
                                const res = await fetch("/api/tourism", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ action: "unblock_dates", dates: [slot.date_str], time_str: slot.time_str })
                                });
                                if (res.ok) loadTabData();
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="text-[10px] text-red-700 hover:text-red-950 font-bold uppercase cursor-pointer"
                          >
                            Abrir
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Ticket Validation (QR & Manual search) */}
          {(userHasRole("admin") || userHasRole("experience_manager")) && activeTab === "validate" && (
            <div className="max-w-xl mx-auto space-y-6 text-left py-4">
              <div className="space-y-2">
                <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold">
                  Escáner QR & Validación de Entrada (Tours)
                </h5>
                <p className="text-xs text-stone-500">
                  Valida el boleto único del cliente. Puedes escribir el código manual o utilizar la cámara para escanear el QR.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={ticketSearchCode}
                  onChange={(e) => setTicketSearchCode(e.target.value)}
                  placeholder="Código de Reserva (e.g. CL-ORO-2026...)"
                  className="flex-1 bg-stone-50 border border-stone-200 p-3.5 font-mono text-xs focus:outline-none focus:border-[#8C4723] focus:bg-white uppercase"
                />
                <button
                  onClick={handleSearchTicket}
                  className="bg-[#2F403E] hover:bg-[#8C4723] text-white px-6 font-semibold uppercase text-xs tracking-wider cursor-pointer"
                >
                  Buscar
                </button>
              </div>

              <div className="pt-2">
                {!scannerActive ? (
                  <button
                    onClick={() => {
                      setSearchStatus("");
                      setSearchedTicket(null);
                      setScannerActive(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-[#8C4723] text-[#8C4723] hover:bg-[#8C4723]/5 py-3.5 font-semibold uppercase text-xs tracking-wider cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    Escanear QR con Cámara
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setScannerActive(false)}
                      className="w-full bg-stone-500 hover:bg-stone-600 text-white py-2.5 font-semibold uppercase text-xs tracking-wider cursor-pointer"
                    >
                      Detener Cámara
                    </button>
                    <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden border border-stone-200"></div>
                  </div>
                )}
              </div>

              {validationSuccessMsg && (
                <div className="bg-emerald-600 text-white p-3.5 text-xs font-bold text-center">
                  ✅ {validationSuccessMsg}
                </div>
              )}

              {searchStatus === "not_found" && (
                <div className="bg-red-50 border border-red-200/50 p-5 text-center space-y-2">
                  <span className="material-symbols-outlined text-4xl text-red-600">error</span>
                  <h6 className="font-serif text-sm font-bold text-red-800">Ticket No Encontrado</h6>
                  <p className="text-xs text-red-700/80">
                    El código no existe en los registros de Supabase. Comprueba que esté bien escrito.
                  </p>
                </div>
              )}

              {searchStatus === "found_valid" && searchedTicket && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
                    <h6 className="text-emerald-700 font-bold uppercase tracking-wider text-xs">
                      TICKET VÁLIDO - LISTO PARA ACCESO
                    </h6>
                    <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                  </div>

                  <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Visitante:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Correo:</span>
                      <span className="font-semibold text-stone-700">{searchedTicket.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Experiencia:</span>
                      <span className="font-bold text-[#8C4723]">{searchedTicket.packageName}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Fecha y Hora:</span>
                      <span className="font-bold text-stone-850">{searchedTicket.date} - {searchedTicket.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Lugares:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.guests} pax</span>
                    </div>
                  </div>

                  <button
                    onClick={handleMarkTicketAsUsed}
                    className="w-full bg-[#8C4723] hover:bg-[#70381b] text-white py-4 font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
                  >
                    Registrar Entrada (Marcar como Usado)
                  </button>
                </div>
              )}

              {searchStatus === "found_used" && searchedTicket && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-5xl text-red-600">warning</span>
                    <h6 className="text-red-700 font-bold uppercase tracking-wider text-xs">
                      ACCESO DENEGADO (TICKET YA UTILIZADO)
                    </h6>
                    <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                  </div>

                  <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2.5 text-xs">
                    <div className="text-stone-700 border-b border-stone-200/30 pb-2 font-medium">
                      <span className="font-semibold block text-[10px] text-stone-500 uppercase">Validado el:</span>
                      <span className="block mt-0.5 text-red-600 font-bold">✅ {scanValidatedTime || searchedTicket.used_at}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Visitante:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Experiencia:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.packageName} • {searchedTicket.guests} pax</span>
                    </div>
                  </div>
                </div>
              )}

              {searchStatus === "found_attempt" && searchedTicket && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 py-6 flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-5xl text-amber-600">payment</span>
                    <h6 className="text-amber-700 font-bold uppercase tracking-wider text-xs">
                      ACCESO DENEGADO (PAGO PENDIENTE)
                    </h6>
                    <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                  </div>

                  <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2.5 text-xs">
                    <p className="text-stone-600 text-center pb-2 border-b border-stone-200/30 font-semibold">
                      ⚠️ Este boleto no puede ser validado porque la compra quedó pendiente de pago en PayPal (Intento de Pago).
                    </p>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Visitante:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Experiencia:</span>
                      <span className="font-bold text-[#8C4723]">{searchedTicket.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Fecha y Hora:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.date} - {searchedTicket.time}</span>
                    </div>
                  </div>
                </div>
              )}

              {searchStatus === "found_cancelled" && searchedTicket && (
                <div className="space-y-4">
                  <div className="bg-stone-100 border border-stone-300 p-4 py-6 flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-5xl text-stone-500">cancel</span>
                    <h6 className="text-stone-700 font-bold uppercase tracking-wider text-xs">
                      ACCESO DENEGADO (TICKET CANCELADO)
                    </h6>
                    <span className="font-mono text-xs text-stone-500 font-bold">{searchedTicket.code}</span>
                  </div>

                  <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2.5 text-xs">
                    <p className="text-stone-600 text-center pb-2 border-b border-stone-200/30 font-semibold">
                      ❌ Este boleto ha sido cancelado por la administración.
                    </p>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Visitante:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/30 pb-2">
                      <span className="text-stone-500">Experiencia:</span>
                      <span className="font-bold text-[#8C4723]">{searchedTicket.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Fecha y Hora:</span>
                      <span className="font-bold text-stone-800">{searchedTicket.date} - {searchedTicket.time}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Bookings Log (Tours) */}
          {(userHasRole("admin") || userHasRole("experience_manager") || userHasRole("viewer") || userHasRole("cuentas_por_cobrar")) && activeTab === "log" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold">
                    Historial de Reservaciones de Tours
                  </h5>
                  <p className="text-xs text-stone-400">Listado general de reservas y control de estado.</p>
                </div>
                
                {!isReadOnly() && (
                  <button
                    onClick={() => setShowManualForm(!showManualForm)}
                    className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white font-semibold uppercase tracking-wider px-4 py-2.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    {showManualForm ? "Cancelar Registro" : "Registrar Reserva Manual"}
                  </button>
                )}
              </div>

              {/* Sub-tab Selection */}
              <div className="flex border-b border-stone-200 gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setLogSubTab("list")}
                  className={`pb-2 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all border-b-2 ${
                    logSubTab === "list"
                      ? "border-[#8C4723] text-[#8C4723] font-bold"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  📋 {lang === "es" ? "Listado Histórico" : "Historical List"}
                </button>
                <button
                  type="button"
                  onClick={() => setLogSubTab("calendar")}
                  className={`pb-2 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all border-b-2 ${
                    logSubTab === "calendar"
                      ? "border-[#8C4723] text-[#8C4723] font-bold"
                      : "border-transparent text-stone-400 hover:text-stone-700"
                  }`}
                >
                  📅 {lang === "es" ? "Vista Calendario" : "Calendar View"}
                </button>
              </div>

              {logSubTab === "list" ? (
                <>
                  {/* Buscador y Filtros de Reservaciones */}
                  <div className="bg-white border border-stone-200 p-4 mb-4 flex flex-col md:flex-row items-center gap-3">
                    <div className="flex-1 w-full relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por código, nombre, correo, teléfono, fecha o tour..."
                        className="w-full bg-stone-50/50 border border-stone-200 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#8C4723] focus:bg-white text-[#1c1c18]"
                      />
                    </div>

                    <div className="w-full md:w-64">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#8C4723] text-[#1c1c18]"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="Confirmada">Confirmadas (Vigentes)</option>
                        <option value="Completada">Completadas (Usadas)</option>
                        <option value="Cancelada">Canceladas</option>
                        <option value="Carrito Abandonado (Intento de Pago)">Carrito Abandonado (PayPal)</option>
                      </select>
                    </div>

                    {(searchQuery || statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="text-xs text-stone-500 hover:text-stone-850 font-semibold cursor-pointer underline underline-offset-2 shrink-0"
                      >
                        Limpiar Filtros
                      </button>
                    )}
                  </div>

                  {/* Descargar Periodos Form */}
                  {(userHasRole("admin") || userHasRole("experience_manager") || userHasRole("cuentas_por_cobrar")) && (
                <div className="bg-stone-50 border border-stone-200/60 p-4 flex flex-col md:flex-row md:items-end gap-4 mb-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Descargar Periodos - Fecha Inicio</label>
                    <input
                      type="date"
                      value={downloadStartDate}
                      onChange={(e) => setDownloadStartDate(e.target.value)}
                      className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Descargar Periodos - Fecha Fin</label>
                    <input
                      type="date"
                      value={downloadEndDate}
                      onChange={(e) => setDownloadEndDate(e.target.value)}
                      className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                    />
                  </div>
                  <button
                    onClick={handleDownloadCsv}
                    className="bg-[#8C4723] hover:bg-[#70381b] text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer h-[38px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">download</span>
                    Descargar Reservas (CSV)
                  </button>
                </div>
              )}

              {/* Tour Manual Registration Form */}
              {showManualForm && (
                <form onSubmit={handleManualBookingSubmit} className="bg-stone-50 border border-stone-200/60 p-6 space-y-4 max-w-xl mx-auto">
                  <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 uppercase tracking-wide">
                    Formulario de Captura de Reserva de Tour
                  </h6>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Nombre del Cliente *</label>
                      <input
                        type="text"
                        required
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={manualEmail}
                          onChange={(e) => setManualEmail(e.target.value)}
                          placeholder="juan@ejemplo.com"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Teléfono / WhatsApp</label>
                        <input
                          type="tel"
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                          placeholder="33XXXXXXXX"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Experiencia *</label>
                        <select
                          value={manualTour}
                          onChange={(e) => setManualTour(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        >
                          <option value="oro">Casa Loy Oro ($550.00)</option>
                          <option value="platino">Casa Loy Platino ($750.00)</option>
                          <option value="diamante">Casa Loy Diamante ($1,500.00)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Fecha *</label>
                        <input
                          type="date"
                          required
                          value={manualDate}
                          onChange={(e) => setManualDate(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Horario *</label>
                        <select
                          value={manualTime}
                          onChange={(e) => setManualTime(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        >
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="1:00 PM">1:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Visitantes *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={manualGuests}
                          onChange={(e) => setManualGuests(parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-center text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Total (MXN)</label>
                        <input
                          type="number"
                          disabled
                          value={manualAmount}
                          className="w-full bg-stone-100 border border-stone-200 p-2 text-xs text-center text-[#1c1c18] font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Método de Pago *</label>
                        <select
                          value={manualMethod}
                          onChange={(e) => {
                            setManualMethod(e.target.value);
                            if (e.target.value !== "Tarjeta") {
                              setManualCardType("");
                            }
                          }}
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        >
                          <option value="Efectivo">Efectivo</option>
                          <option value="Tarjeta">Tarjeta de Crédito</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Cortesía">Cortesía</option>
                        </select>
                      </div>
                    </div>

                    {/* Factura Checkbox */}
                    <div className="flex items-center gap-2 pt-2 pb-1">
                      <input
                        type="checkbox"
                        id="manualRequiresInvoice"
                        checked={manualRequiresInvoice}
                        onChange={(e) => {
                          setManualRequiresInvoice(e.target.checked);
                          if (e.target.checked && !manualCfdiUse) {
                            setManualCfdiUse("G03");
                          }
                        }}
                        className="w-4 h-4 text-[#8C4723] border-stone-300 rounded focus:ring-[#8C4723] accent-[#8C4723] cursor-pointer"
                      />
                      <label htmlFor="manualRequiresInvoice" className="text-xs font-bold text-stone-700 select-none cursor-pointer uppercase tracking-wider text-[10px]">
                        ¿Requieres factura fiscal mexicana?
                      </label>
                    </div>

                    {/* Factura Fields */}
                    {manualRequiresInvoice && (
                      <div className="bg-stone-100 p-4 border border-stone-200 space-y-3 transition-all duration-300">
                        <h6 className="text-[10px] font-bold text-[#8C4723] uppercase tracking-wider">
                          Datos de Facturación (CFDI 4.0)
                        </h6>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                              RFC *
                            </label>
                            <input
                              type="text"
                              required
                              value={manualRfc}
                              onChange={(e) => setManualRfc(e.target.value.toUpperCase().replace(/[^A-Z0-9&]/gi, '').slice(0, 13))}
                              placeholder="XAXX010101000"
                              className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                            />
                            <span className="text-[9px] text-stone-400 block mt-0.5">
                              {manualRfc.trim().length === 12 ? "Persona Moral (12 carac.)" : 
                               manualRfc.trim().length === 13 ? "Persona Física (13 carac.)" : 
                               "12 o 13 caracteres"}
                            </span>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                              Código Postal (CP) *
                            </label>
                            <input
                              type="text"
                              required
                              value={manualPostalCode}
                              onChange={(e) => setManualPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="e.g. 44100"
                              className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Razón Social *
                          </label>
                          <input
                            type="text"
                            required
                            value={manualRazonSocial}
                            onChange={(e) => setManualRazonSocial(e.target.value)}
                            placeholder="Ej. CASA LOY SA DE CV o JUAN PEREZ"
                            className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                              Régimen Fiscal *
                            </label>
                            <select
                              required
                              value={manualRegimenFiscal}
                              onChange={(e) => setManualRegimenFiscal(e.target.value)}
                              className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                            >
                              <option value="">-- Seleccionar Régimen --</option>
                              {REGIMENES_FISCALES.map((reg) => (
                                <option key={reg.code} value={reg.code}>{reg.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                              Uso de CFDI *
                            </label>
                            <select
                              required
                              value={manualCfdiUse}
                              onChange={(e) => setManualCfdiUse(e.target.value)}
                              className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                            >
                              <option value="G03">G03 - Gastos en general</option>
                              <option value="S01">S01 - Sin efectos fiscales</option>
                            </select>
                          </div>
                        </div>

                        {manualMethod === "Tarjeta" && (
                          <div className="mt-3">
                            <span className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                              Tipo de Tarjeta (Facturación) *
                            </span>
                            <div className="flex gap-4">
                              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-sans text-stone-700">
                                <input
                                  type="radio"
                                  name="manualCardType"
                                  value="Crédito"
                                  checked={manualCardType === "Crédito"}
                                  onChange={(e) => setManualCardType(e.target.value)}
                                  className="text-[#8C4723] focus:ring-[#8C4723] w-4 h-4 cursor-pointer accent-[#8C4723]"
                                />
                                Crédito
                              </label>
                              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-sans text-stone-700">
                                <input
                                  type="radio"
                                  name="manualCardType"
                                  value="Débito"
                                  checked={manualCardType === "Débito"}
                                  onChange={(e) => setManualCardType(e.target.value)}
                                  className="text-[#8C4723] focus:ring-[#8C4723] w-4 h-4 cursor-pointer accent-[#8C4723]"
                                />
                                Débito
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cupón de Descuento Manual */}
                    <div className="pt-2 border-t border-stone-200">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Cupón de Descuento
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled={!!manualAppliedCoupon}
                          value={manualDiscountCodeInput}
                          onChange={(e) => setManualDiscountCodeInput(e.target.value.toUpperCase().replace(/\s/g, ''))}
                          placeholder="Ej. CASA10"
                          className="flex-1 bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18] uppercase font-semibold"
                        />
                        {manualAppliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleManualRemoveCoupon}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs px-4 py-2 cursor-pointer uppercase font-semibold transition-colors"
                          >
                            Quitar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleManualApplyCoupon}
                            disabled={manualIsValidatingCoupon}
                            className="bg-stone-850 hover:bg-stone-900 text-white text-xs px-4 py-2 cursor-pointer uppercase font-semibold transition-colors disabled:opacity-50"
                          >
                            {manualIsValidatingCoupon ? "..." : "Aplicar"}
                          </button>
                        )}
                      </div>
                      {manualCouponError && (
                        <span className="text-[10px] text-red-650 block mt-1 font-semibold">{manualCouponError}</span>
                      )}
                      {manualCouponSuccess && (
                        <span className="text-[10px] text-emerald-650 block mt-1 font-semibold">{manualCouponSuccess}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingManual}
                    className="w-full bg-[#8C4723] hover:bg-[#70381b] text-white py-3 text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md"
                  >
                    {isSubmittingManual ? "Guardando..." : "Confirmar y Descontar Cupos"}
                  </button>
                </form>
              )}

              {/* Table of bookings */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                      <th className="p-3">Código</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Tour</th>
                      <th className="p-3">Fecha y Hora</th>
                      <th className="p-3">Fecha Compra/Intento</th>
                      <th className="p-3 text-center">Pax</th>
                      <th className="p-3 text-right">Monto</th>
                      <th className="p-3 text-center">Origen/Creador</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookingsLog.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center text-stone-400 italic">
                          {searchQuery ? "No se encontraron reservaciones que coincidan con la búsqueda." : "No hay registros de reservaciones en la base de datos."}
                        </td>
                      </tr>
                    ) : (
                      filteredBookingsLog.map((log) => {
                        const isCompleted = log.status === "Completada" || log.used_at;
                        return (
                          <tr key={log.code} className="hover:bg-stone-50/40 text-stone-700">
                            <td className="p-3 font-mono font-bold text-[#8C4723]">{log.code}</td>
                            <td className="p-3">
                              <div className="font-semibold text-stone-900 flex items-center gap-1.5 flex-wrap">
                                <span>{log.name}</span>
                                {log.requires_invoice && (
                                  <span className="inline-block bg-orange-50 text-orange-700 border border-orange-200 text-[9px] font-bold px-1.5 py-0.2 rounded-sm" title="Requiere Factura">
                                    🧾 FACTURA
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-500">{log.email}</div>
                              <div className="text-[10px] text-stone-500">{log.phone}</div>
                              {log.requires_invoice && (
                                <div className="mt-1 flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    id={`invoice-check-${log.code}`}
                                    checked={log.invoice_sent || false}
                                    disabled={userHasRole("viewer")}
                                    onChange={(e) => handleToggleInvoiceSent(log.code, e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-stone-300 text-[#8C4723] focus:ring-[#8C4723] cursor-pointer"
                                  />
                                  <label htmlFor={`invoice-check-${log.code}`} className={`text-[10px] font-semibold cursor-pointer ${log.invoice_sent ? 'text-emerald-700' : 'text-stone-400'}`}>
                                    {log.invoice_sent ? 'Factura Enviada' : 'Factura Pendiente'}
                                  </label>
                                </div>
                              )}
                            </td>
                            <td className="p-3 font-medium">{log.packageName}</td>
                            <td className="p-3">
                              <div>{log.date}</div>
                              <div className="text-[10px] text-stone-400">{log.time}</div>
                            </td>
                            <td className="p-3 text-stone-600 font-medium">
                              {log.timestamp || "No registrada"}
                            </td>
                            <td className="p-3 text-center font-semibold">{log.guests} pax</td>
                            <td className="p-3 text-right font-medium">
                              <div className="text-stone-900 font-bold">${log.amount} MXN</div>
                              <div className="text-[9px] text-stone-400 uppercase tracking-wider">{log.method}</div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm border ${
                                log.creation_mode === "manual"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-blue-50 text-blue-800 border-blue-200"
                              }`}>
                                {log.creation_mode === "manual" ? "Manual" : "Pago Online"}
                              </span>
                              <div className="text-[9px] text-stone-400 mt-0.5 truncate max-w-[120px] mx-auto" title={log.created_by}>
                                {log.created_by === "customer" ? "Cliente" : log.created_by}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              {isReadOnly() ? (
                                <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border ${
                                  isCompleted 
                                    ? "bg-red-50 text-red-700 border-red-200" 
                                    : log.status === "Cancelada"
                                      ? "bg-stone-100 text-stone-500 border-stone-300"
                                      : (log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)")
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}>
                                  {log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)" ? "Carrito Abandonado" : log.status}
                                </span>
                              ) : (
                                <select
                                  value={log.status || (isCompleted ? "Completada" : "Confirmada")}
                                  onChange={(e) => handleUpdateTourStatus(log.code, e.target.value)}
                                  className={`p-1.5 text-[10px] uppercase font-bold border rounded-none focus:outline-none ${
                                    isCompleted 
                                      ? "bg-red-50 text-red-700 border-red-200" 
                                      : log.status === "Cancelada"
                                        ? "bg-stone-100 text-stone-500 border-stone-300"
                                        : (log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)")
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  <option value="Confirmada">Confirmada (Vigente)</option>
                                  <option value="Cancelada">Cancelada</option>
                                  <option value="Completada">Completada (Usada)</option>
                                  <option value="Carrito Abandonado (Intento de Pago)">Carrito Abandonado</option>
                                  <option value="Intento de Pago">Intento de Pago (Antiguo)</option>
                                </select>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {(log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)") ? (
                                <span className="inline-block text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 font-bold uppercase tracking-wider">No Pagado</span>
                              ) : log.status === "Cancelada" ? (
                                <span className="inline-block text-[9px] text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 font-bold uppercase tracking-wider">Cancelado</span>
                              ) : (
                                <button
                                  onClick={() => setSelectedQrTicket(log)}
                                  className="bg-[#8C4723]/10 hover:bg-[#8C4723] hover:text-white text-[#8C4723] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                                >
                                  <span className="material-symbols-outlined text-xs">qr_code_2</span>
                                  Ver QR
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  {/* Sección de Calendario Principal */}
                  <div className="xl:col-span-8 bg-stone-50 border border-stone-200/50 p-6 shadow-sm">
                    {/* Encabezado del Calendario */}
                    <div className="flex justify-between items-center mb-6">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                        {lang === "es" ? "Ant" : "Prev"}
                      </button>
                      
                      <h4 className="font-serif text-lg font-bold text-stone-800 tracking-wide capitalize">
                        {monthNames[calendarMonth]} {calendarYear}
                      </h4>
                      
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {lang === "es" ? "Sig" : "Next"}
                        <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                      </button>
                    </div>

                    {/* Cabecera de los Días de la Semana */}
                    <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                      {weekDays.map((wd) => (
                        <div key={wd} className="text-[10px] font-bold text-stone-500 uppercase tracking-wider py-1">
                          {wd}
                        </div>
                      ))}
                    </div>

                    {/* Cuerpo del Calendario */}
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonthArray().map((cell, idx) => {
                        const isSelected = selectedCalendarDate && cell.dateStr === selectedCalendarDate;
                        const { paxBySlot, totalPax } = cell.dateStr 
                          ? getBookingsForDate(cell.dateStr) 
                          : { paxBySlot: {}, totalPax: 0 };
                        
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                        const isToday = cell.dateStr === todayStr;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (cell.dateStr) {
                                setSelectedCalendarDate(cell.dateStr);
                              }
                            }}
                            className={`min-h-[100px] border border-stone-200/50 p-2 transition-all flex flex-col justify-between ${
                              cell.isCurrentMonth 
                                ? "bg-white hover:bg-stone-50 cursor-pointer" 
                                : "bg-stone-100/50 text-stone-300 pointer-events-none"
                            } ${isSelected ? "ring-2 ring-[#8C4723] bg-stone-50/50" : ""} ${
                              isToday ? "border-2 border-[#8C4723]" : ""
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-bold ${
                                cell.isCurrentMonth ? (isToday ? "text-[#8C4723]" : "text-stone-700") : "text-stone-300"
                              }`}>
                                {cell.dayNum}
                              </span>
                              {totalPax > 0 && cell.isCurrentMonth && (
                                <span className="bg-[#2F403E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" title={`${totalPax} pax total`}>
                                  {totalPax}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 space-y-1">
                              {cell.isCurrentMonth && Object.entries(paxBySlot).map(([slot, pax]) => {
                                const is11 = slot.includes("11:00");
                                return (
                                  <div
                                    key={slot}
                                    className={`text-[8.5px] font-semibold px-1 py-0.5 rounded flex items-center justify-between border ${
                                      is11 
                                        ? "bg-[#f7f4f0] text-[#8C4723] border-[#8C4723]/10" 
                                        : "bg-[#edf2f1] text-[#2F403E] border-[#2F403E]/10"
                                    }`}
                                  >
                                    <span className="truncate">{slot.split(" ")[0]}</span>
                                    <span className="font-bold">{pax}p</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Panel de Detalle del Día */}
                  <div className="xl:col-span-4 bg-white border border-stone-200 p-6 shadow-sm space-y-6">
                    <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold border-b border-stone-100 pb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm font-bold">info</span>
                      {lang === "es" ? "Detalle del Día" : "Day Details"}
                    </h5>

                    {selectedCalendarDate ? (
                      (() => {
                        const allDayBookings = bookingsLog.filter((b) => b.date === selectedCalendarDate);
                        const parts = selectedCalendarDate.split("-");
                        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                        const formattedDate = dateObj.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });

                        const activeDayBookings = allDayBookings.filter(b => b.status !== "Cancelada");
                        const totalPax = activeDayBookings.reduce((sum, b) => sum + (parseInt(b.guests) || 0), 0);

                        return (
                          <div className="space-y-4">
                            <div className="bg-stone-50 border border-stone-200/60 p-4 text-left">
                              <h6 className="text-xs font-bold text-stone-700 capitalize mb-1">{formattedDate}</h6>
                              <div className="flex justify-between items-center text-xs text-stone-500 mt-2 pt-2 border-t border-stone-200/60">
                                <span>{lang === "es" ? "Reservas activas:" : "Active bookings:"} <strong>{activeDayBookings.length}</strong></span>
                                <span>{lang === "es" ? "Total personas:" : "Total pax:"} <strong>{totalPax} pax</strong></span>
                              </div>
                            </div>

                            {allDayBookings.length === 0 ? (
                              <p className="text-xs text-stone-400 italic py-8 text-center bg-stone-50/50">
                                {lang === "es" ? "No hay reservas registradas para este día." : "No bookings registered for this day."}
                              </p>
                            ) : (
                              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                {allDayBookings.map((log) => {
                                  const isCanceled = log.status === "Cancelada";
                                  const isCompleted = log.status === "Completada" || log.used_at;
                                  const is11 = log.time && log.time.includes("11:00");
                                  return (
                                    <div
                                      key={log.code}
                                      className={`p-3.5 border text-left flex flex-col justify-between gap-3 transition-all ${
                                        isCanceled 
                                          ? "bg-stone-50/50 border-stone-200 text-stone-400 opacity-60" 
                                          : "bg-white border-stone-200 hover:border-stone-400 text-stone-700 shadow-sm"
                                      }`}
                                    >
                                      <div className="flex justify-between items-start gap-2">
                                        <div>
                                          <span className="font-mono text-xs font-bold text-[#8C4723] block">{log.code}</span>
                                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border inline-block mt-1 ${
                                            is11 
                                              ? "bg-[#f7f4f0] text-[#8C4723] border-[#8C4723]/10" 
                                              : "bg-[#edf2f1] text-[#2F403E] border-[#2F403E]/10"
                                          }`}>
                                            {log.time}
                                          </span>
                                        </div>
                                        <span className="text-xs font-bold text-stone-900">{log.guests} pax</span>
                                      </div>

                                      <div className="text-[10px] space-y-0.5 border-t border-b border-stone-100 py-2">
                                        <div className="font-semibold text-stone-800 flex items-center gap-1">
                                          <span>{log.name}</span>
                                          {log.requires_invoice && (
                                            <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[8px] font-bold px-1 rounded-sm">🧾 FAC</span>
                                          )}
                                        </div>
                                        <div className="truncate text-stone-500">{log.email}</div>
                                        <div className="text-stone-500">{log.phone}</div>
                                        <div className="text-[9.5px] text-[#8C4723] font-medium mt-1">{log.packageName}</div>
                                        {log.allergies && <div className="text-stone-500 mt-1">⚠️ <span className="font-semibold">Alergias:</span> {log.allergies}</div>}
                                        {log.celebration && <div className="text-stone-500">🎉 <span className="font-semibold">Celebración:</span> {log.celebration}</div>}
                                        {log.comments && <div className="text-stone-400 italic font-light">"{log.comments}"</div>}
                                      </div>

                                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                                        {isReadOnly() ? (
                                          <span className={`inline-block px-2 py-0.5 uppercase tracking-wider font-bold border ${
                                            isCompleted 
                                              ? "bg-red-50 text-red-700 border-red-200" 
                                              : isCanceled
                                                ? "bg-stone-100 text-stone-500 border-stone-300"
                                                : (log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)")
                                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          }`}>
                                            {log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)" ? "Carrito Abandonado" : log.status}
                                          </span>
                                        ) : (
                                          <select
                                            value={log.status || (isCompleted ? "Completada" : "Confirmada")}
                                            onChange={(e) => handleUpdateTourStatus(log.code, e.target.value)}
                                            className={`p-1 text-[9.5px] uppercase font-bold border rounded-none focus:outline-none ${
                                              isCompleted 
                                                ? "bg-red-50 text-red-700 border-red-200" 
                                                : isCanceled
                                                  ? "bg-stone-100 text-stone-500 border-stone-300"
                                                  : (log.status === "Intento de Pago" || log.status === "Carrito Abandonado (Intento de Pago)")
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }`}
                                          >
                                            <option value="Confirmada">Confirmada</option>
                                            <option value="Cancelada">Cancelada</option>
                                            <option value="Completada">Completada</option>
                                            <option value="Carrito Abandonado (Intento de Pago)">Carrito Abandonado</option>
                                            <option value="Intento de Pago">Intento de Pago (Antiguo)</option>
                                          </select>
                                        )}

                                        {log.requires_invoice && (
                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="checkbox"
                                              id={`inv-cal-${log.code}`}
                                              checked={log.invoice_sent || false}
                                              disabled={userHasRole("viewer")}
                                              onChange={(e) => handleToggleInvoiceSent(log.code, e.target.checked)}
                                              className="w-3 h-3 rounded border-stone-300 text-[#8C4723] focus:ring-[#8C4723] cursor-pointer"
                                            />
                                            <label htmlFor={`inv-cal-${log.code}`} className={`font-semibold cursor-pointer ${log.invoice_sent ? 'text-emerald-700' : 'text-stone-400'}`}>
                                              {log.invoice_sent ? 'Enviada' : 'Pendiente'}
                                            </label>
                                          </div>
                                        )}

                                        {!isCanceled && log.status !== "Intento de Pago" && log.status !== "Carrito Abandonado (Intento de Pago)" && (
                                          <button
                                            type="button"
                                            onClick={() => setSelectedQrTicket(log)}
                                            className="bg-[#8C4723]/10 hover:bg-[#8C4723] hover:text-white text-[#8C4723] px-2 py-1 font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-0.5 ml-auto"
                                          >
                                            <span className="material-symbols-outlined text-[10px]">qr_code_2</span>
                                            QR
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                        <span className="material-symbols-outlined text-3xl mb-2 text-stone-300">calendar_month</span>
                        <p className="text-xs italic text-center">
                          {lang === "es" 
                            ? "Selecciona un día en el calendario para ver sus reservaciones." 
                            : "Select a day in the calendar to view its bookings."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Restaurant Reservations (Nativo 1937) */}
          {(userHasRole("admin") || userHasRole("restaurant_manager") || userHasRole("viewer")) && activeTab === "restaurant" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold">
                    Reservaciones de Restaurante 1937 Nativo
                  </h5>
                  <p className="text-xs text-stone-400">Administra mesas, cupos y reservas capturadas en el portal de Nativo.</p>
                </div>
                
                {!userHasRole("viewer") && (
                  <button
                    onClick={() => setShowRestManualForm(!showRestManualForm)}
                    className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white font-semibold uppercase tracking-wider px-4 py-2.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    {showRestManualForm ? "Cancelar Registro" : "Alta Manual Restaurante"}
                  </button>
                )}
              </div>

              {/* Restaurant Manual Capture Form */}
              {showRestManualForm && (
                <form onSubmit={handleRestManualBookingSubmit} className="bg-stone-50 border border-stone-200 p-6 space-y-4 max-w-xl mx-auto">
                  <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-2 uppercase tracking-wide">
                    Formulario Interno de Reserva (Restaurante)
                  </h6>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={restName}
                          onChange={(e) => setRestName(e.target.value)}
                          placeholder="Ej. María Pérez"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Teléfono / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={restPhone}
                          onChange={(e) => setRestPhone(e.target.value)}
                          placeholder="33XXXXXXXX"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Personas *</label>
                        <input
                          type="number"
                          min="1"
                          max="75"
                          required
                          value={restGuests}
                          onChange={(e) => setRestGuests(parseInt(e.target.value) || 2)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-center text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Fecha de Visita *</label>
                        <input
                          type="date"
                          required
                          value={restDate}
                          onChange={(e) => setRestDate(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Hora *</label>
                        <input
                          type="time"
                          required
                          value={restTime}
                          onChange={(e) => setRestTime(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Motivo *</label>
                        <select
                          value={restReason}
                          onChange={(e) => setRestReason(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        >
                          <option value="cumpleanos">Cumpleaños</option>
                          <option value="aniversario">Aniversario</option>
                          <option value="negocios">Negocios</option>
                          <option value="celebracion">Celebración</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRestManual}
                    className="w-full bg-[#8C4723] hover:bg-[#70381b] text-white py-3 text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md"
                  >
                    {isSubmittingRestManual ? "Confirmando..." : "Confirmar Mesa"}
                  </button>
                </form>
              )}

              {/* Table of restaurant bookings */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                      <th className="p-3">Mesa / Código</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Contacto</th>
                      <th className="p-3">Fecha y Hora</th>
                      <th className="p-3 text-center">Lugares</th>
                      <th className="p-3">Motivo</th>
                      <th className="p-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {restaurantBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-stone-400 italic">No hay registros de reservaciones en el restaurante.</td>
                      </tr>
                    ) : (
                      restaurantBookings.map((log) => (
                        <tr key={log.id} className="hover:bg-stone-50/40 text-stone-700">
                          <td className="p-3 font-mono font-bold text-[#2F403E]">{log.code || 'NAT-RES'}</td>
                          <td className="p-3 font-semibold text-stone-900">{log.customer_name}</td>
                          <td className="p-3 font-mono text-stone-500">{log.customer_phone}</td>
                          <td className="p-3">
                            <span className="font-medium">{log.date_str}</span> a las <span className="text-stone-500">{log.time_str} hrs</span>
                          </td>
                          <td className="p-3 text-center font-bold">{log.guests} pax</td>
                          <td className="p-3 uppercase text-[10px] tracking-wide text-stone-500 font-semibold">{log.reason}</td>
                          <td className="p-3 text-center">
                            {userHasRole("viewer") ? (
                              <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border ${
                                log.status === "Completada"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : log.status === "Cancelada"
                                    ? "bg-stone-100 text-stone-500 border-stone-300"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}>
                                {log.status || 'Confirmada'}
                              </span>
                            ) : (
                              <select
                                value={log.status || 'Confirmada'}
                                onChange={(e) => handleUpdateRestStatus(log.code, e.target.value)}
                                className={`p-1.5 text-[10px] uppercase font-bold border rounded-none focus:outline-none ${
                                  log.status === "Completada"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : log.status === "Cancelada"
                                      ? "bg-stone-100 text-stone-500 border-stone-300"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                <option value="Confirmada">Confirmada</option>
                                <option value="Cancelada">Cancelada</option>
                                <option value="Completada">Completada (Mesa Servida)</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CMS modules (Banners, Dishes, Blog with IA, Jobs, POS CRUD) */}
          {(userHasRole("admin") || userHasRole("editor") || userHasRole("rh")) && activeTab === "cms" && (
            <div className="space-y-6 text-left">
              
              {/* CMS Sub navigation bar */}
              <div className="flex border-b border-stone-200 gap-3 md:gap-4 overflow-x-auto pb-1">
                {[
                  { id: "banners", label: "🖼️ Banners & Galerías", roles: ["admin", "editor"] },
                  { id: "dishes", label: "🍽️ Top 3 Platillos", roles: ["admin", "editor"] },
                  { id: "blog", label: "✍️ Blog & Asistencia IA", roles: ["admin", "editor"] },
                  { id: "jobs", label: "💼 Vacantes", roles: ["admin", "editor", "rh"] },
                  { id: "applications", label: "👥 Postulantes / CVs", roles: ["admin", "rh"] },
                  { id: "pos", label: "📍 Puntos de Venta (Where to buy)", roles: ["admin", "editor"] }
                ].filter(sub => sub.roles.some(roleOpt => userHasRole(roleOpt))).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setCmsTab(sub.id);
                      setEditingBanner(null);
                      setEditingJob(null);
                      setEditingBlog(null);
                      setEditingPos(null);
                    }}
                    className={`pb-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 ${
                      cmsTab === sub.id ? "border-[#8C4723] text-[#8C4723] font-bold" : "border-transparent text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* CMS A: Banners */}
              {cmsTab === "banners" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold">Gestión de Banners de Páginas</h6>
                    <button
                      onClick={() => setEditingBanner({ page: "home", type: "main", image_url: "", order_index: 0 })}
                      className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white px-3.5 py-2 font-semibold"
                    >
                      + Nuevo Banner
                    </button>
                  </div>

                  {editingBanner && (
                    <form onSubmit={handleSaveBanner} className="bg-stone-50 border border-stone-200 p-5 space-y-4 max-w-lg">
                      <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-1.5 uppercase">
                        {editingBanner.id ? "Editar Banner" : "Registrar Nuevo Banner"}
                      </h6>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Página</label>
                          <select name="page" defaultValue={editingBanner.page} className="w-full bg-white border border-stone-200 p-2 text-xs">
                            <option value="home">Home / Portada</option>
                            <option value="tours">Tours & Experiencias</option>
                            <option value="about">Nosotros (Quienes somos)</option>
                            <option value="maquilas">Maquilas</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Tipo</label>
                          <select name="type" defaultValue={editingBanner.type} className="w-full bg-white border border-stone-200 p-2 text-xs">
                            <option value="main">Principal (Hero)</option>
                            <option value="secondary">Secundario</option>
                            <option value="gallery">Galería</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Imagen URL *</label>
                        <input type="text" name="image_url" required defaultValue={editingBanner.image_url} placeholder="/Banner-ejemplo.webp" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none"/>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Título (ES)</label>
                          <input type="text" name="title_es" defaultValue={editingBanner.title_es} className="w-full bg-white border border-stone-200 p-2 text-xs"/>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Título (EN)</label>
                          <input type="text" name="title_en" defaultValue={editingBanner.title_en} className="w-full bg-white border border-stone-200 p-2 text-xs"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Subtítulo (ES)</label>
                          <input type="text" name="subtitle_es" defaultValue={editingBanner.subtitle_es} className="w-full bg-white border border-stone-200 p-2 text-xs"/>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Subtítulo (EN)</label>
                          <input type="text" name="subtitle_en" defaultValue={editingBanner.subtitle_en} className="w-full bg-white border border-stone-200 p-2 text-xs"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Link de Destino</label>
                          <input type="text" name="link_url" defaultValue={editingBanner.link_url} placeholder="tours" className="w-full bg-white border border-stone-200 p-2 text-xs"/>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Orden (Index)</label>
                          <input type="number" name="order_index" defaultValue={editingBanner.order_index} className="w-full bg-white border border-stone-200 p-2 text-xs text-center"/>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingBanner(null)} className="px-3.5 py-1.5 text-xs border border-stone-200 cursor-pointer">Cancelar</button>
                        <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#8C4723] text-white font-semibold cursor-pointer">Guardar</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bannersList.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No hay banners personalizados en la base de datos (se utilizan fallbacks locales).</p>
                    ) : (
                      bannersList.map(b => (
                        <div key={b.id} className="border border-stone-200 p-3 space-y-3 bg-white">
                          <img src={b.image_url} alt="Banner Preview" className="w-full aspect-[16/9] object-cover border border-stone-100 bg-stone-50"/>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between font-bold text-stone-800">
                              <span className="uppercase">{b.page} ({b.type})</span>
                              <span>Orden: {b.order_index}</span>
                            </div>
                            <p className="text-stone-500 truncate">ES: {b.title_es || 'Sin título'}</p>
                            <p className="text-stone-400 truncate">EN: {b.title_en || 'No title'}</p>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                            <button onClick={() => setEditingBanner(b)} className="text-[10px] text-blue-700 hover:underline font-bold uppercase cursor-pointer">Editar</button>
                            <button onClick={() => handleDeleteBanner(b.id)} className="text-[10px] text-red-700 hover:underline font-bold uppercase cursor-pointer">Eliminar</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CMS B: Featured Dishes (Top 3) */}
              {cmsTab === "dishes" && (
                <div className="space-y-6">
                  <div>
                    <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold">Menú Top 3 Platillos / Maridajes Destacados</h6>
                    <p className="text-xs text-stone-400 mt-1">Configura las fotos, títulos y descripciones de los 3 platillos estrella de Restaurante 1937 Nativo.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(index => {
                      const dbDish = dishesList.find(d => d.dish_index === index) || {};
                      return (
                        <form key={index} onSubmit={handleUpdateDish} className="border border-stone-200 p-5 space-y-4 bg-white shadow-sm flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                              <span className="text-xs bg-[#8C4723] text-white px-2.5 py-0.5 font-bold">Platillo Destacado #{index}</span>
                              {dbDish.authorized_by && (
                                <span className="text-[9px] text-stone-400 font-light italic">Autorizado por: {dbDish.authorized_by}</span>
                              )}
                            </div>
                            <input type="hidden" name="dish_index" value={index} />
                            
                            <div>
                              <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Imagen URL *</label>
                              <input type="text" name="image_url" required defaultValue={dbDish.image_url || `/Platillo-${index}.webp`} className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nombre (ES) *</label>
                                <input type="text" name="name_es" required defaultValue={dbDish.name_es || ""} className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nombre (EN)</label>
                                <input type="text" name="name_en" defaultValue={dbDish.name_en || ""} className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Descripción (ES) *</label>
                              <textarea name="description_es" required defaultValue={dbDish.description_es || ""} rows="3" className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none resize-none"></textarea>
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Descripción (EN)</label>
                              <textarea name="description_en" defaultValue={dbDish.description_en || ""} rows="3" className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none resize-none"></textarea>
                            </div>
                          </div>

                          <button type="submit" className="w-full bg-[#2F403E] hover:bg-[#8C4723] text-white py-2 text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer mt-4">
                            Autorizar & Guardar Platillo #{index}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CMS C: Blog with IA Writer */}
              {cmsTab === "blog" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold">Artículos de Blog & Asistencia de IA</h6>
                      <p className="text-xs text-stone-400 mt-1">Escribe crónicas, novedades y utiliza Inteligencia Artificial para redactar textos optimizados para SEO.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          fetchAuthors();
                          setShowAuthorModal(true);
                        }}
                        className="text-xs bg-stone-800 hover:bg-stone-900 text-white px-3.5 py-2 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">groups</span>
                        Directorio de Autores ({authorsList.length})
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAuthorId("");
                          setEditingBlog({ slug: "", title: "", description: "", category: "Noticias", label: "PROCESOS", image_url: "", body_es: "", body_en: "" });
                        }}
                        className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white px-3.5 py-2 font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        + Nuevo Artículo
                      </button>
                    </div>
                  </div>

                  {editingBlog && (
                    <form onSubmit={handleSaveBlog} className="bg-stone-50 border border-stone-200 p-6 space-y-4 max-w-2xl mx-auto">
                      <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                        <h6 className="font-serif text-sm font-bold text-stone-800 uppercase">
                          {editingBlog.id ? "Editar Entrada de Blog" : "Nuevo Artículo de Blog"}
                        </h6>
                        <button
                          type="button"
                          onClick={() => {
                            setAiPrompt(`Escribe un artículo para el blog sobre el tema: "${editingBlog.title || 'Jimado y Selección de Agave'}"`);
                            setShowAiModal(true);
                          }}
                          className="bg-[#8C4723] hover:bg-[#70381b] text-white text-[10px] px-3 py-1.5 uppercase font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">neurology</span>
                          Asistente IA (Gemini)
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Título *</label>
                          <input type="text" name="title" required defaultValue={editingBlog.title} onChange={(e) => {
                            if (!editingBlog.id) {
                              const s = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              document.getElementById("blog_slug_input").value = s;
                            }
                          }} className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Slug único de URL *</label>
                          <input type="text" id="blog_slug_input" name="slug" required defaultValue={editingBlog.slug} placeholder="el-arte-del-jimado" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Categoría *</label>
                          <select name="category" defaultValue={editingBlog.category} className="w-full bg-white border border-stone-200 p-2.5 text-xs">
                            <option value="Noticias">Noticias</option>
                            <option value="Lanzamientos">Lanzamientos</option>
                            <option value="Datos Relevantes">Datos Relevantes</option>
                            <option value="Festividades">Festividades</option>
                            <option value="Mixología">Mixología</option>
                            <option value="Sustentabilidad">Sustentabilidad</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Etiqueta (Filtro)*</label>
                          <input type="text" name="label" required defaultValue={editingBlog.label || "PROCESOS"} placeholder="PROCESOS" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Imagen de Portada *</label>
                          <input type="text" name="image_url" required defaultValue={editingBlog.image_url} placeholder="/Agave.webp" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                      </div>

                      {/* Literal Blog Author Identity Section */}
                      <div className="bg-stone-100/80 border border-stone-200 p-4 rounded-sm space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8C4723] uppercase font-bold tracking-wider">
                            <span className="material-symbols-outlined text-[15px]">person</span>
                            Identidad Editorial del Autor (Byline Literal)
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAuthor({ name: "", role: "", photo: "/Don Manuel Loy.webp", bio: "" });
                              setShowAuthorModal(true);
                            }}
                            className="text-[10px] text-[#8C4723] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">person_add</span>
                            + Gestionar Directorio de Autores
                          </button>
                        </div>

                        {/* Dropdown selector for saved authors */}
                        <div className="bg-white p-3 border border-stone-200 rounded space-y-1.5 shadow-2xs">
                          <label className="block text-[10px] text-stone-800 uppercase font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#8C4723]">how_to_reg</span>
                            ⚡ Cargar Autor Guardado (Llena automáticamente nombre, cargo, foto y bio):
                          </label>
                          <select
                            value={selectedAuthorId}
                            onChange={(e) => handleSelectSavedAuthor(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-semibold text-stone-900 rounded focus:outline-none focus:border-[#8C4723]"
                          >
                            <option value="">-- Selecciona de la lista para auto-completar --</option>
                            {authorsList.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name} — {a.role}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Nombre del Autor(a) *</label>
                            <input type="text" name="author_es" defaultValue={editingBlog.author_es || "Don Manuel Loy"} placeholder="Don Manuel Loy" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Cargo / Especialidad *</label>
                            <input type="text" name="author_role" defaultValue={editingBlog.author_role || "Patriarca & Guardián del Terroir"} placeholder="Maestro Tequilero" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Foto del Autor (URL o Ruta) *</label>
                            <input type="text" name="author_photo" defaultValue={editingBlog.author_photo || "/Don Manuel Loy.webp"} placeholder="/Don Manuel Loy.webp" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Biografía Corta del Autor</label>
                          <input type="text" name="author_bio" defaultValue={editingBlog.author_bio || "Guardián de la tradición centenaria y el terroir de Los Altos de Jalisco en Casa Loy."} placeholder="Breve semblanza..." className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Resumen / Descripción corta *</label>
                        <textarea name="description" required defaultValue={editingBlog.description} rows="2" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none"></textarea>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cuerpo / Contenido del Artículo (ES) *</label>
                        <textarea name="body_es" defaultValue={editingBlog.body_es} rows="8" placeholder="Escribe aquí el contenido en español (soporta HTML básico)..." className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none font-sans leading-relaxed"></textarea>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cuerpo / Contenido del Artículo (EN)</label>
                        <textarea name="body_en" defaultValue={editingBlog.body_en} rows="8" placeholder="Escribe aquí el contenido en inglés..." className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none font-sans leading-relaxed"></textarea>
                      </div>

                      <div className="border-t border-stone-200 pt-3 space-y-3">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">Metadatos SEO Avanzados</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] text-stone-400">Título SEO</label>
                            <input type="text" name="seo_title" defaultValue={editingBlog.seo_title} className="w-full bg-white border border-stone-200 p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[9px] text-stone-400">Descripción SEO</label>
                            <input type="text" name="seo_description" defaultValue={editingBlog.seo_description} className="w-full bg-white border border-stone-200 p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[9px] text-stone-400">Palabras Clave SEO</label>
                            <input type="text" name="seo_keywords" defaultValue={editingBlog.seo_keywords} placeholder="tequila, agave, jalisco" className="w-full bg-white border border-stone-200 p-1.5 text-[11px]" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-3">
                        <button type="button" onClick={() => setEditingBlog(null)} className="px-3.5 py-1.5 text-xs border border-stone-200 cursor-pointer">Cancelar</button>
                        <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#8C4723] text-white font-semibold cursor-pointer">Guardar Artículo</button>
                      </div>
                    </form>
                  )}

                  {/* List of Blog Posts */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                          <th className="p-3">Título</th>
                          <th className="p-3">Slug</th>
                          <th className="p-3">Categoría</th>
                          <th className="p-3">Resumen</th>
                          <th className="p-3">Fecha de publicación</th>
                          <th className="p-3 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {blogList.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-stone-400 italic">No hay entradas de blog guardadas en Supabase (mostrando fallbacks locales).</td>
                          </tr>
                        ) : (
                          blogList.map(b => (
                            <tr key={b.id} className="hover:bg-stone-50/40 text-stone-700">
                              <td className="p-3 font-semibold text-stone-900">{b.title}</td>
                              <td className="p-3 font-mono text-[11px] text-stone-500">{b.slug}</td>
                              <td className="p-3"><span className="bg-stone-100 text-stone-600 px-2 py-0.5 text-[10px] font-bold uppercase">{b.category}</span></td>
                              <td className="p-3 text-stone-500 max-w-xs truncate">{b.description}</td>
                              <td className="p-3 text-stone-400">{b.published_at ? new Date(b.published_at).toLocaleDateString() : 'Borrador'}</td>
                              <td className="p-3 text-center space-x-2">
                                <button onClick={() => setEditingBlog(b)} className="text-blue-700 hover:underline font-bold uppercase cursor-pointer">Editar</button>
                                <button onClick={() => handleDeleteBlog(b.id)} className="text-red-700 hover:underline font-bold uppercase cursor-pointer">Eliminar</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CMS D: Jobs CRUD */}
              {cmsTab === "jobs" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold">Bolsa de Trabajo y Ofertas Laborales</h6>
                      <p className="text-xs text-stone-400 mt-1">Crea y administra ofertas de empleo en la sección Bolsa de Trabajo.</p>
                    </div>
                    <button
                      onClick={() => setEditingJob({ id: "", category: "comercial", title_es: "", location_es: "Guadalajara, Jalisco", type_es: "Tiempo completo", time_es: "Reciente", hero_desc_es: "", compensation_es: "", image_url: "", is_active: true })}
                      className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white px-3.5 py-2 font-semibold"
                    >
                      + Nueva Vacante
                    </button>
                  </div>

                  {editingJob && (
                    <form onSubmit={handleSaveJob} className="bg-stone-50 border border-stone-200 p-6 space-y-4 max-w-2xl mx-auto">
                      <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-1.5 uppercase">
                        {editingJob.id ? "Editar Vacante" : "Nueva Vacante"}
                      </h6>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Identificador ID *</label>
                          <input type="text" name="id" required defaultValue={editingJob.id} disabled={!!editingJob.id} placeholder="kam-ventas" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Categoría *</label>
                          <select name="category" defaultValue={editingJob.category} className="w-full bg-white border border-stone-200 p-2.5 text-xs">
                            <option value="comercial">Ventas y Comercial</option>
                            <option value="produccion">Producción e Ingeniería</option>
                            <option value="administracion">Administración y Soporte</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Estado</label>
                          <select name="is_active" defaultValue={editingJob.is_active ? "true" : "false"} className="w-full bg-white border border-stone-200 p-2.5 text-xs">
                            <option value="true">Activa (Pública)</option>
                            <option value="false">Inactiva (Borrador)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Puesto (ES) *</label>
                          <input type="text" name="title_es" required defaultValue={editingJob.title_es} className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Puesto (EN)</label>
                          <input type="text" name="title_en" defaultValue={editingJob.title_en} className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Ubicación *</label>
                          <input type="text" name="location_es" required defaultValue={editingJob.location_es} className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Tipo de Puesto *</label>
                          <input type="text" name="type_es" required defaultValue={editingJob.type_es} placeholder="Tiempo completo" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Antigüedad/Tiempo</label>
                          <input type="text" name="time_es" defaultValue={editingJob.time_es} placeholder="Reciente" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end font-sans">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Imagen de Portada (Subir Archivo)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setJobImageFile(file);
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => {
                                  setJobImageBase64(reader.result.split(',')[1]);
                                  setJobImageUrlVal(`[Archivo seleccionado: ${file.name}]`);
                                };
                              }
                            }}
                            className="w-full bg-white border border-stone-200 p-1 text-xs focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:border-0 file:text-[10px] file:font-semibold file:bg-[#2F403E]/10 file:text-[#2F403E] hover:file:bg-[#2F403E]/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Imagen URL (Manual / Cargada)</label>
                          <input
                            type="text"
                            value={jobImageUrlVal}
                            onChange={(e) => setJobImageUrlVal(e.target.value)}
                            placeholder="Ej. /Empleado Casa Loy Tequilera.webp (dejar vacío para predeterminada)"
                            className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Descripción del Puesto (ES) *</label>
                          <textarea name="hero_desc_es" required defaultValue={editingJob.hero_desc_es} rows="3" className="w-full bg-white border border-stone-200 p-2 text-xs"></textarea>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Ofrecemos (Compensación ES) *</label>
                          <textarea name="compensation_es" required defaultValue={editingJob.compensation_es} rows="3" placeholder="Sueldo competitivo + Prestaciones..." className="w-full bg-white border border-stone-200 p-2 text-xs"></textarea>
                        </div>
                      </div>

                      {/* Raw listing formatting lists */}
                      <div className="space-y-3 border-t border-stone-200 pt-3">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">Listados Estructurados (Separados por renglón)</span>
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Responsabilidades (Título | Detalle)</label>
                            <textarea name="responsibilities_raw" rows="4" placeholder="Estrategia Comercial | Ventas AAA&#10;Cobertura | Seguimiento a clientes" defaultValue={editingJob.responsibilities ? editingJob.responsibilities.map(r => `${r.title_es} | ${r.desc_es}`).join('\n') : ""} className="w-full bg-white border border-stone-200 p-2 font-mono text-[11px]"></textarea>
                          </div>
                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Requisitos (Icono | Título | Detalle)</label>
                            <textarea name="requirements_raw" rows="4" placeholder="school | Educación | Carrera marketing&#10;wine_bar | Experiencia | 5 años vinos" defaultValue={editingJob.requirements ? editingJob.requirements.map(r => `${r.icon || 'school'} | ${r.title_es} | ${r.desc_es}`).join('\n') : ""} className="w-full bg-white border border-stone-200 p-2 font-mono text-[11px]"></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Conocimientos Requeridos (Un concepto por renglón)</label>
                            <textarea name="knowledge_raw" rows="3" placeholder="Uso de CRM&#10;KPIs de Venta" defaultValue={editingJob.knowledge ? editingJob.knowledge.map(k => k.es).join('\n') : ""} className="w-full bg-white border border-stone-200 p-2 font-mono text-[11px]"></textarea>
                          </div>
                          <div>
                            <label className="block text-stone-400 font-bold mb-1">Beneficios Ofrecidos (Un beneficio por renglón)</label>
                            <textarea name="benefits_raw" rows="3" placeholder="Sueldo negociable&#10;Vales de despensa" defaultValue={editingJob.benefits ? editingJob.benefits.map(b => b.es).join('\n') : ""} className="w-full bg-white border border-stone-200 p-2 font-mono text-[11px]"></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-3">
                        <button type="button" onClick={() => setEditingJob(null)} className="px-3.5 py-1.5 text-xs border border-stone-200 cursor-pointer">Cancelar</button>
                        <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#8C4723] text-white font-semibold cursor-pointer">Guardar Vacante</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getMergedJobsList().length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No hay vacantes configuradas en el sistema.</p>
                    ) : (
                      getMergedJobsList().map(j => (
                        <div key={j.id} className="border border-stone-200 p-4 space-y-2.5 bg-white relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-[#2F403E]/10 text-[#2F403E] px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider">{j.category}</span>
                              <h5 className="font-serif text-base font-bold text-stone-900 mt-1">{j.title_es}</h5>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${j.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>
                                {j.is_active ? 'Activa' : 'Borrador'}
                              </span>
                              {j.is_fallback && (
                                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[9px] uppercase font-bold">
                                  Predefinida
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-stone-500 font-mono">ID: {j.id} • {j.location_es}</p>
                          <p className="text-xs text-stone-600 line-clamp-2">{j.hero_desc_es}</p>
                          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 mt-2">
                            <button onClick={() => setEditingJob(j)} className="text-[10px] text-blue-700 hover:underline font-bold uppercase cursor-pointer">Editar</button>
                            {!j.is_fallback && (
                              <button onClick={() => handleDeleteJob(j.id)} className="text-[10px] text-red-700 hover:underline font-bold uppercase cursor-pointer">Eliminar</button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CMS DD: Job Applications Table */}
              {cmsTab === "applications" && (userHasRole("admin") || userHasRole("rh")) && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold font-sans">Postulantes y CVs Recibidos</h6>
                      <p className="text-xs text-stone-400 mt-1 font-sans">Consulta los perfiles e interesados registrados en la bolsa de trabajo.</p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 bg-stone-50 p-3 border border-stone-200/50 rounded-sm font-sans">
                      <div>
                        <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Desde</label>
                        <input
                          type="date"
                          value={appDownloadStartDate}
                          onChange={(e) => setAppDownloadStartDate(e.target.value)}
                          className="bg-white border border-stone-200 p-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-stone-500 uppercase font-bold mb-1">Hasta</label>
                        <input
                          type="date"
                          value={appDownloadEndDate}
                          onChange={(e) => setAppDownloadEndDate(e.target.value)}
                          className="bg-white border border-stone-200 p-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleDownloadApplicationsCsv}
                        className="flex items-center gap-1.5 bg-[#8C4723] hover:bg-[#703517] text-white px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">download</span>
                        Exportar CSV
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                          <th className="p-3 font-sans">Postulante</th>
                          <th className="p-3 font-sans">Contacto</th>
                          <th className="p-3 font-sans">Vacante de Interés</th>
                          <th className="p-3 font-sans">CV Recibido</th>
                          <th className="p-3 font-sans">Fecha de Registro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {jobApplicationsList.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-stone-400 italic">No hay registros de postulaciones en el sistema.</td>
                          </tr>
                        ) : (
                          jobApplicationsList.map(app => {
                            const matchedJob = jobsList.find(j => j.id === app.job_id);
                            const jobTitle = app.job_id === 'spontaneous' 
                              ? "Postulación Espontánea" 
                              : (matchedJob ? matchedJob.title_es : app.job_id);

                            return (
                              <tr key={app.id} className="hover:bg-stone-50/40 text-stone-700 font-sans">
                                <td className="p-3 font-semibold text-stone-900">{app.name}</td>
                                <td className="p-3 space-y-1">
                                  <div>📧 <a href={`mailto:${app.email}`} className="text-[#8C4723] hover:underline font-semibold">{app.email}</a></div>
                                  <div className="text-stone-500">📞 {app.phone}</div>
                                </td>
                                <td className="p-3">
                                  {app.job_id === 'spontaneous' ? (
                                    <span className="inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-stone-100 text-stone-600 rounded-sm">
                                      {jobTitle}
                                    </span>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-[#2F403E]/10 text-[#2F403E] rounded-sm">
                                      {jobTitle}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  {app.cv_name ? (
                                    app.cv_name.startsWith("http") ? (
                                      <a
                                        href={app.cv_name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-[#2F403E]/10 hover:bg-[#2F403E]/20 text-[#2F403E] px-2 py-1 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[11px] font-semibold">download</span>
                                        Descargar CV
                                      </a>
                                    ) : (
                                      <span className="text-stone-500 font-mono text-[11px]">{app.cv_name}</span>
                                    )
                                  ) : (
                                    <span className="text-stone-400 italic">Sin CV</span>
                                  )}
                                </td>
                                <td className="p-3 text-stone-400">
                                  {new Date(app.created_at).toLocaleDateString('es-MX', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CMS E: Points of Sale (KAMs CRUD) */}
              {cmsTab === "pos" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h6 className="text-xs uppercase tracking-widest text-[#8C4723] font-bold">Puntos de Venta, Centros de Consumo & Distribuidores</h6>
                      <p className="text-xs text-stone-400 mt-1">Permite a los Key Account Managers (KAMs) dar de alta y editar su catálogo de distribución de forma interactiva.</p>
                    </div>
                    <button
                      onClick={() => setEditingPos({ retailer: "", name: "", address: "", region: "mx", is_active: true, pdv: true, cdc: false, cl: false, td: false, tz: false })}
                      className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white px-3.5 py-2 font-semibold"
                    >
                      + Registrar Punto
                    </button>
                  </div>

                  {editingPos && (
                    <form onSubmit={handleSavePos} className="bg-stone-50 border border-stone-200 p-6 space-y-4 max-w-xl mx-auto">
                      <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-1.5 uppercase">
                        {editingPos.id ? "Editar Distribuidor" : "Registrar Distribuidor / Pdv"}
                      </h6>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cadena / Retailer *</label>
                          <input type="text" name="retailer" required defaultValue={editingPos.retailer} placeholder="Ej. El Palacio de Hierro" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nombre Sucursal / Establecimiento *</label>
                          <input type="text" name="name" required defaultValue={editingPos.name} placeholder="Ej. Sucursal Providencia" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Dirección Completa *</label>
                        <input type="text" name="address" required defaultValue={editingPos.address} placeholder="Calle, Número, Colonia, Ciudad, Estado, País" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Región *</label>
                          <select 
                            name="region" 
                            value={editingPos.region || "mx"} 
                            onChange={(e) => setEditingPos({ ...editingPos, region: e.target.value })}
                            className="w-full bg-white border border-stone-200 p-2.5 text-xs"
                          >
                            <option value="mx">México (MX)</option>
                            <option value="usa">Estados Unidos (USA)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Código Postal</label>
                          <input type="text" name="postal_code" defaultValue={editingPos.postal_code} placeholder="44630" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Teléfono</label>
                          <input type="text" name="phone" defaultValue={editingPos.phone} placeholder="+52 33..." className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Latitud (Coordenada)</label>
                          <input type="number" step="0.000001" name="latitude" defaultValue={editingPos.latitude} placeholder="20.6908" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Longitud (Coordenada)</label>
                          <input type="number" step="0.000001" name="longitude" defaultValue={editingPos.longitude} placeholder="-103.3815" className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Google Maps URL</label>
                          <input type="text" name="maps_url" defaultValue={editingPos.maps_url} placeholder="https://maps.google.com/?q=..." className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 bg-stone-100/50 p-3">
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">KAM Asignado</label>
                          <input type="text" name="fase" defaultValue={editingPos.fase || user?.name} className="w-full bg-white border border-stone-200 p-2 text-xs" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Tipo Punto</span>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1.5 text-xs text-stone-700">
                              <input type="checkbox" name="pdv" value="true" defaultChecked={editingPos.pdv} /> PDV (Pto Venta)
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-700">
                              <input type="checkbox" name="cdc" value="true" defaultChecked={editingPos.cdc} /> CDC (Consumo)
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Estatus del punto</label>
                          <select name="is_active" defaultValue={editingPos.is_active ? "true" : "false"} className="w-full bg-white border border-stone-200 p-2 text-xs">
                            <option value="true">Activo / Visible</option>
                            <option value="false">Inactivo / Oculto</option>
                          </select>
                        </div>
                      </div>

                      {/* Region-aware Product/Brand existence */}
                      {editingPos.region === "usa" ? (
                        <div className="border-t border-stone-200 pt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-stone-500 uppercase block">Existencia por Marca (USA):</span>
                            <span className="text-[9px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200/50">
                              Búsqueda por Marca activa (sin categorías en USA)
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3 border border-stone-200/40">
                            <label className="flex items-center gap-2 p-2 border border-stone-200 rounded cursor-pointer hover:bg-stone-50 transition-colors">
                              <input 
                                type="checkbox" 
                                name="cl" 
                                value="true" 
                                defaultChecked={editingPos.cl || editingPos.casa_loy_blanco || editingPos.casa_loy_reposado || (editingPos.brands && editingPos.brands.includes('casa-loy'))} 
                                className="accent-[#8C4723] w-4 h-4 cursor-pointer"
                              />
                              <div>
                                <span className="font-bold text-[#8C4723] block text-xs">CL</span>
                                <span className="text-[10px] text-stone-500">Casa Loy</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 p-2 border border-stone-200 rounded cursor-pointer hover:bg-stone-50 transition-colors">
                              <input 
                                type="checkbox" 
                                name="td" 
                                value="true" 
                                defaultChecked={editingPos.td || editingPos.taddel_plata || editingPos.taddel_reposado || (editingPos.brands && editingPos.brands.includes('taddel'))} 
                                className="accent-[#2F403E] w-4 h-4 cursor-pointer"
                              />
                              <div>
                                <span className="font-bold text-[#2F403E] block text-xs">TD</span>
                                <span className="text-[10px] text-stone-500">TADDEL</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 p-2 border border-stone-200 rounded cursor-pointer hover:bg-stone-50 transition-colors">
                              <input 
                                type="checkbox" 
                                name="tz" 
                                value="true" 
                                defaultChecked={editingPos.tz || editingPos.tierra_zafiro_blanco || editingPos.tierra_zafiro_reposado || (editingPos.brands && editingPos.brands.includes('tierra-zafiro'))} 
                                className="accent-stone-700 w-4 h-4 cursor-pointer"
                              />
                              <div>
                                <span className="font-bold text-stone-700 block text-xs">TZ</span>
                                <span className="text-[10px] text-stone-500">Tierra Zafiro</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-stone-200 pt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-stone-500 uppercase block">Existencia de Producto por Categoría (México):</span>
                            <span className="text-[9px] bg-amber-50 text-[#8C4723] font-semibold px-2 py-0.5 rounded border border-amber-200/50">
                              Categorías activas para MX
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3 border border-stone-200/40">
                            {/* Casa Loy products */}
                            <div className="space-y-1">
                              <span className="font-bold text-[#8C4723] block text-[10px] uppercase">CASA LOY (CL)</span>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_blanco" value="true" defaultChecked={editingPos.casa_loy_blanco}/> Blanco</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_reposado" value="true" defaultChecked={editingPos.casa_loy_reposado}/> Reposado</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_cristalino" value="true" defaultChecked={editingPos.casa_loy_cristalino}/> Cristalino</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_anejo" value="true" defaultChecked={editingPos.casa_loy_anejo}/> Añejo</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_piedra_y_agave_blanco" value="true" defaultChecked={editingPos.casa_loy_piedra_y_agave_blanco}/> Piedra/Agave B.</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="casa_loy_piedra_y_agave_reposado" value="true" defaultChecked={editingPos.casa_loy_piedra_y_agave_reposado}/> Piedra/Agave R.</label>
                            </div>

                            {/* Taddel products */}
                            <div className="space-y-1">
                              <span className="font-bold text-[#2F403E] block text-[10px] uppercase">TADDEL (TD)</span>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="taddel_plata" value="true" defaultChecked={editingPos.taddel_plata}/> Plata</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="taddel_reposado" value="true" defaultChecked={editingPos.taddel_reposado}/> Reposado</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="taddel_cristalino" value="true" defaultChecked={editingPos.taddel_cristalino}/> Cristalino</label>
                            </div>

                            {/* Tierra Zafiro products */}
                            <div className="space-y-1">
                              <span className="font-bold text-stone-700 block text-[10px] uppercase">TIERRA ZAFIRO (TZ)</span>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="tierra_zafiro_blanco" value="true" defaultChecked={editingPos.tierra_zafiro_blanco}/> Blanco</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="tierra_zafiro_blanco_100_pure" value="true" defaultChecked={editingPos.tierra_zafiro_blanco_100_pure}/> Blanco 100% P.</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="tierra_zafiro_reposado" value="true" defaultChecked={editingPos.tierra_zafiro_reposado}/> Reposado</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" name="tierra_zafiro_cristalino" value="true" defaultChecked={editingPos.tierra_zafiro_cristalino}/> Cristalino</label>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 justify-end pt-3">
                        <button type="button" onClick={() => setEditingPos(null)} className="px-3.5 py-1.5 text-xs border border-stone-200 cursor-pointer">Cancelar</button>
                        <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#8C4723] text-white font-semibold cursor-pointer font-sans">Guardar Registro</button>
                      </div>
                    </form>
                  )}

                  {/* List of POS */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                          <th className="p-3">Establecimiento</th>
                          <th className="p-3">Cadena</th>
                          <th className="p-3">Dirección</th>
                          <th className="p-3">Región</th>
                          <th className="p-3 text-center">Marcas</th>
                          <th className="p-3">KAM / Asesor</th>
                          <th className="p-3 text-center">Tipo</th>
                          <th className="p-3 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {posList.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="p-8 text-center text-stone-400 italic">No hay distribuidores registrados en Supabase (mostrando fallbacks locales).</td>
                          </tr>
                        ) : (
                          posList.map(store => {
                            const hasCl = Boolean(store.cl || store.casa_loy_blanco || store.casa_loy_reposado || store.casa_loy_cristalino || store.casa_loy_anejo || store.casa_loy_piedra_y_agave_blanco || store.casa_loy_piedra_y_agave_reposado || (store.brands && store.brands.includes('casa-loy')));
                            const hasTd = Boolean(store.td || store.taddel_plata || store.taddel_reposado || store.taddel_cristalino || (store.brands && store.brands.includes('taddel')));
                            const hasTz = Boolean(store.tz || store.tierra_zafiro_blanco || store.tierra_zafiro_blanco_100_pure || store.tierra_zafiro_reposado || store.tierra_zafiro_cristalino || (store.brands && store.brands.includes('tierra-zafiro')));

                            return (
                              <tr key={store.id} className="hover:bg-stone-50/40 text-stone-700">
                                <td className="p-3 font-semibold text-stone-900">{store.name}</td>
                                <td className="p-3 font-medium">{store.retailer}</td>
                                <td className="p-3 text-stone-500 max-w-xs truncate" title={store.address}>{store.address}</td>
                                <td className="p-3 uppercase font-bold text-stone-500">{store.region}</td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <div className="inline-flex gap-1 items-center justify-center">
                                    {hasCl && (
                                      <span className="bg-[#8C4723]/15 text-[#8C4723] font-bold text-[9px] px-1.5 py-0.5 rounded" title="Casa Loy">CL</span>
                                    )}
                                    {hasTd && (
                                      <span className="bg-[#2F403E]/15 text-[#2F403E] font-bold text-[9px] px-1.5 py-0.5 rounded" title="TADDEL">TD</span>
                                    )}
                                    {hasTz && (
                                      <span className="bg-stone-600/15 text-stone-700 font-bold text-[9px] px-1.5 py-0.5 rounded" title="Tierra Zafiro">TZ</span>
                                    )}
                                    {!hasCl && !hasTd && !hasTz && (
                                      <span className="text-stone-300 text-[9px] italic">-</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-stone-600 font-medium">{store.fase}</td>
                                <td className="p-3 text-center">
                                  <span className="bg-[#8C4723]/10 text-[#8C4723] px-2 py-0.5 text-[10px] font-bold rounded-sm mr-1">
                                    {store.pdv ? 'PDV' : ''}
                                  </span>
                                  <span className="bg-[#2F403E]/10 text-[#2F403E] px-2 py-0.5 text-[10px] font-bold rounded-sm">
                                    {store.cdc ? 'CDC' : ''}
                                  </span>
                                </td>
                                <td className="p-3 text-center space-x-2 whitespace-nowrap">
                                  <button onClick={() => setEditingPos(store)} className="text-blue-700 hover:underline font-bold uppercase cursor-pointer">Editar</button>
                                  <button onClick={() => handleDeletePos(store.id)} className="text-red-700 hover:underline font-bold uppercase cursor-pointer">Eliminar</button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Audit logs (Admin only) */}
          {activeTab === "audit" && userHasRole("admin") && (
            <div className="space-y-4 text-left">
              <div>
                <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold">
                  Bitácora Global de Auditoría (Audit Log)
                </h5>
                <p className="text-xs text-stone-400">Acciones de creación, modificación o eliminación de datos administrativos.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                      <th className="p-3">Fecha y Hora</th>
                      <th className="p-3">Usuario (Email)</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Acción</th>
                      <th className="p-3">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-stone-400 italic">No hay registros de auditoría en el sistema.</td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-stone-50/40 text-stone-700">
                          <td className="p-3 text-stone-400 whitespace-nowrap">{new Date(log.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td>
                          <td className="p-3 font-semibold text-stone-900">{log.user_email}</td>
                          <td className="p-3"><span className="bg-stone-100 text-stone-600 px-2 py-0.5 text-[9px] uppercase font-sans font-bold">{log.user_role}</span></td>
                          <td className="p-3 font-sans font-bold text-[#8C4723]">{log.action}</td>
                          <td className="p-3 text-stone-600 font-sans text-xs max-w-lg truncate" title={log.details}>{log.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Personal & RBAC (Admin only) */}
          {activeTab === "users" && userHasRole("admin") && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold font-sans">
                    Cuentas de Personal y Asignación de Roles (RBAC)
                  </h5>
                  <p className="text-xs text-stone-400 font-sans">Administra los accesos y privilegios del personal de Hacienda Casa Loy.</p>
                </div>
                <button
                  onClick={() => setEditingUser({ name: "", email: "", role: "viewer", password: "" })}
                  className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white px-4 py-2.5 font-semibold uppercase tracking-wider cursor-pointer font-sans"
                >
                  + Agregar Personal
                </button>
              </div>

              {editingUser && (
                <form onSubmit={handleSaveUser} className="bg-stone-50 border border-stone-200 p-6 space-y-4 max-w-lg mx-auto font-sans">
                  <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-1.5 uppercase">
                    {editingUser.id ? "Modificar Cuenta de Personal" : "Crear Nueva Cuenta de Personal"}
                  </h6>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nombre del Trabajador *</label>
                      <input type="text" name="name" required defaultValue={editingUser.name} placeholder="Ej. Juan Pérez" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Correo (Usuario) *</label>
                      <input type="email" name="email" required defaultValue={editingUser.email} placeholder="ejemplo@casaloy.com" className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Roles Asignados (Selecciona uno o varios) *</label>
                      <div className="bg-white border border-stone-200 p-3 space-y-2 rounded max-h-[160px] overflow-y-auto">
                        {[
                          { id: 'admin', label: 'Administrador (Acceso Completo)' },
                          { id: 'editor', label: 'Editor (CMS, Blog, Banners)' },
                          { id: 'experience_manager', label: 'Gestor de Experiencias (Tours, QR)' },
                          { id: 'restaurant_manager', label: 'Gestor de Restaurante (Mesas)' },
                          { id: 'rh', label: 'Recursos Humanos (Bolsa de Trabajo)' },
                          { id: 'cuentas_por_cobrar', label: 'Cuentas por Cobrar (Facturas)' },
                          { id: 'viewer', label: 'Visor General (Solo Lectura)' },
                          { id: 'lead_maquila', label: 'Gestor de Leads de Maquila' }
                        ].map(roleOpt => {
                          const isChecked = String(editingUser?.role || '').split(',').map(r => r.trim()).includes(roleOpt.id);
                          return (
                            <label key={roleOpt.id} className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900 select-none">
                              <input 
                                type="checkbox" 
                                name="roles_checkbox" 
                                value={roleOpt.id} 
                                defaultChecked={isChecked}
                                className="rounded text-[#8C4723] focus:ring-[#8C4723] cursor-pointer" 
                              />
                              <span className="text-xs">{roleOpt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">
                        {editingUser.id ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso *"}
                      </label>
                      <input type="password" name="password" required={!editingUser.id} placeholder={editingUser.id ? "Dejar en blanco para no cambiar" : "••••••••"} className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setEditingUser(null)} className="px-3.5 py-1.5 text-xs border border-stone-200 cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#8C4723] text-white font-semibold cursor-pointer">Guardar Cuenta</button>
                  </div>
                </form>
              )}

              {/* Users list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Correo / Usuario</th>
                      <th className="p-3">Rol del Personal</th>
                      <th className="p-3">Fecha de Alta</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {usersList.map((staff) => (
                      <tr key={staff.id} className="hover:bg-stone-50/40 text-stone-700">
                        <td className="p-3 font-semibold text-stone-900">{staff.name}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-500">{staff.email}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {String(staff.role || '').split(',').map(r => r.trim()).map(roleName => (
                              <span key={roleName} className={`inline-block px-2.5 py-0.5 text-[10px] font-sans font-bold uppercase rounded-sm ${
                                roleName === 'admin' ? 'bg-red-100 text-red-800' :
                                roleName === 'editor' ? 'bg-blue-100 text-blue-800' :
                                roleName === 'experience_manager' ? 'bg-amber-100 text-amber-800' :
                                roleName === 'restaurant_manager' ? 'bg-purple-100 text-purple-800' :
                                roleName === 'cuentas_por_cobrar' ? 'bg-emerald-100 text-emerald-800' :
                                roleName === 'rh' ? 'bg-teal-100 text-teal-800' :
                                roleName === 'lead_maquila' ? 'bg-orange-100 text-orange-850 border border-orange-200' :
                                'bg-stone-100 text-stone-600'
                              }`}>
                                {roleName}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-stone-400">{new Date(staff.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-center space-x-3">
                          <button onClick={() => setEditingUser(staff)} className="text-blue-700 hover:underline font-bold uppercase cursor-pointer">Editar</button>
                          <button onClick={() => handleDeleteUser(staff.id, staff.email)} className="text-red-700 hover:underline font-bold uppercase cursor-pointer">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Cupones de Descuento (Admin/Experience Manager) */}
          {(userHasRole("admin") || userHasRole("experience_manager")) && activeTab === "coupons" && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold font-sans">
                    Gestión de Cupones de Descuento
                  </h5>
                  <p className="text-xs text-stone-400 font-sans">Administra los códigos promocionales y de descuento de Hacienda Casa Loy.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario de Creación / Edición */}
                <div className="lg:col-span-1 bg-stone-50 border border-stone-200 p-6 space-y-4 font-sans h-fit">
                  <h6 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-200 pb-1.5 uppercase">
                    {editingDiscountCode ? "Editar Cupón" : "Crear Nuevo Cupón"}
                  </h6>
                  <form key={editingDiscountCode ? editingDiscountCode.id : "new"} onSubmit={handleCreateDiscountCode} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Código de Cupón *</label>
                      <input
                        type="text"
                        name="code"
                        required
                        defaultValue={editingDiscountCode ? editingDiscountCode.code : ""}
                        placeholder="Ej. VERANO24"
                        className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none uppercase font-semibold text-[#1c1c18]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Tipo de Descuento *</label>
                        <select
                          name="discount_type"
                          defaultValue={editingDiscountCode ? editingDiscountCode.discount_type : "percentage"}
                          className="w-full bg-white border border-stone-200 p-2 text-xs text-[#1c1c18] focus:outline-none"
                        >
                          <option value="percentage">Porcentaje (%)</option>
                          <option value="fixed">Monto Fijo ($ MXN)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Valor *</label>
                        <input
                          type="number"
                          name="value"
                          step="0.01"
                          required
                          min="0.01"
                          defaultValue={editingDiscountCode ? editingDiscountCode.value : ""}
                          placeholder="Ej. 10 o 150"
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Límite de Usos (Opcional)</label>
                        <input
                          type="number"
                          name="max_uses"
                          min="1"
                          defaultValue={editingDiscountCode ? editingDiscountCode.max_uses || "" : ""}
                          placeholder="Ej. 100"
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Fecha de Expiración (Opcional)</label>
                        <input
                          type="date"
                          name="expires_at"
                          defaultValue={editingDiscountCode && editingDiscountCode.expires_at ? editingDiscountCode.expires_at.split('T')[0] : ""}
                          className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingDiscountCode && (
                        <button
                          type="button"
                          onClick={() => setEditingDiscountCode(null)}
                          className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-2.5 font-semibold uppercase tracking-wider text-xs cursor-pointer transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isCreatingDiscountCode}
                        className="flex-1 bg-[#8C4723] hover:bg-[#70381b] text-white py-2.5 font-semibold uppercase tracking-wider text-xs cursor-pointer transition-colors"
                      >
                        {isCreatingDiscountCode ? "Guardando..." : (editingDiscountCode ? "Actualizar" : "Crear Cupón")}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Tabla de Listado */}
                <div className="lg:col-span-2 space-y-4">
                  <h6 className="font-serif text-sm font-bold text-stone-850 uppercase">
                    Cupones Activos e Historial
                  </h6>
                  
                  <div className="bg-white border border-stone-200 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                          <th className="p-3">Código</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3 text-right">Valor</th>
                          <th className="p-3 text-center">Usos / Límite</th>
                          <th className="p-3">Expiración</th>
                          <th className="p-3 text-center">Estado</th>
                          <th className="p-3 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-sans">
                        {discountCodesList.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-stone-400 italic">No hay cupones creados aún.</td>
                          </tr>
                        ) : (
                          discountCodesList.map((code) => {
                            const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                            const isLimitReached = code.max_uses && code.uses_count >= code.max_uses;
                            const isInvalid = isExpired || isLimitReached;
                            
                            return (
                              <tr key={code.id} className="hover:bg-stone-50/50">
                                <td className="p-3 font-mono font-bold text-stone-900">{code.code}</td>
                                <td className="p-3 text-stone-600 uppercase text-[10px]">
                                  {code.discount_type === "percentage" ? "Porcentaje" : "Fijo ($)"}
                                </td>
                                <td className="p-3 text-right font-bold text-stone-800">
                                  {code.discount_type === "percentage" ? `${code.value}%` : `$${parseFloat(code.value).toFixed(2)}`}
                                </td>
                                <td className="p-3 text-center text-stone-600">
                                  {code.uses_count} / {code.max_uses || "∞"}
                                </td>
                                <td className="p-3 text-stone-500">
                                  {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : "Nunca"}
                                </td>
                                <td className="p-3 text-center">
                                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={code.active}
                                      onChange={() => handleToggleDiscountCode(code.id, code.active, code.code)}
                                      className="w-3.5 h-3.5 rounded border-stone-300 text-[#8C4723] focus:ring-[#8C4723] cursor-pointer"
                                    />
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${code.active ? 'text-emerald-700' : 'text-stone-400'}`}>
                                      {code.active ? "Activo" : "Inactivo"}
                                    </span>
                                  </label>
                                </td>
                                <td className="p-3 text-center space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => setEditingDiscountCode(code)}
                                    className="text-blue-700 hover:text-blue-900 font-bold uppercase hover:underline cursor-pointer text-[10px]"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDiscountCode(code.id, code.code)}
                                    className="text-red-700 hover:text-red-900 font-bold uppercase hover:underline cursor-pointer text-[10px]"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Leads de Maquila (Admin/Lead Maquila/Editor/Viewer) */}
          {(userHasRole("admin") || userHasRole("lead_maquila") || userHasRole("editor") || userHasRole("viewer")) && activeTab === "maquila_leads" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-[#8C4723] font-bold font-sans">
                    Leads de Maquila B2B
                  </h5>
                  <p className="text-xs text-stone-400 font-sans">Listado y registro de prospectos para maquila de marca propia.</p>
                </div>
                
                {!userHasRole("viewer") && (
                  <button
                    onClick={() => setShowMaquilaManualForm(!showMaquilaManualForm)}
                    className="text-xs bg-[#2F403E] hover:bg-[#8C4723] text-white font-semibold uppercase tracking-wider px-4 py-2.5 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    {showMaquilaManualForm ? "Cancelar Registro" : "Registrar Lead Manual"}
                  </button>
                )}
              </div>

              {/* Formulario de Alta Manual */}
              {showMaquilaManualForm && (
                <form onSubmit={handleMaquilaManualSubmit} className="bg-stone-50 border border-stone-200/60 p-6 space-y-4 max-w-xl mx-auto text-left font-sans">
                  <h6 className="font-serif text-sm font-bold text-stone-850 border-b border-stone-200 pb-2 uppercase tracking-wide">
                    Registrar Nuevo Lead (Alta Manual)
                  </h6>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={maquilaManualName}
                        onChange={(e) => setMaquilaManualName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={maquilaManualEmail}
                          onChange={(e) => setMaquilaManualEmail(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Teléfono / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={maquilaManualPhone}
                          onChange={(e) => setMaquilaManualPhone(e.target.value)}
                          placeholder="3312345678"
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Servicio de Interés</label>
                        <input
                          type="text"
                          value={maquilaManualService}
                          onChange={(e) => setMaquilaManualService(e.target.value)}
                          placeholder="Ej. Maquila Completa, Granel, Envasado..."
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Tipo de Lead *</label>
                        <select
                          value={maquilaManualLeadType}
                          onChange={(e) => setMaquilaManualLeadType(e.target.value)}
                          className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                        >
                          <option value="Importador">Importador</option>
                          <option value="Empresario">Empresario</option>
                          <option value="Marca Existente">Marca Existente</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Origen del Lead *</label>
                      <input
                        type="text"
                        required
                        value={maquilaManualOrigin}
                        onChange={(e) => setMaquilaManualOrigin(e.target.value)}
                        placeholder="Ej. Expo Tequila, Recomendado, Llamada, Web..."
                        className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Comentarios / Notas sobre el Proyecto</label>
                      <textarea
                        rows="3"
                        value={maquilaManualComments}
                        onChange={(e) => setMaquilaManualComments(e.target.value)}
                        placeholder="Escribe aquí detalles de la plática, requerimientos específicos, etc."
                        className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingMaquilaManual}
                    className="w-full bg-[#8C4723] hover:bg-[#70381b] text-white py-3 text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md transition-colors disabled:opacity-50"
                  >
                    {isSubmittingMaquilaManual ? "Guardando..." : "Registrar Lead y Programar Correo"}
                  </button>
                </form>
              )}

              {/* Buscador y Filtros de Leads */}
              <div className="bg-white border border-stone-200 p-4 mb-4 flex flex-col md:flex-row items-center gap-3 font-sans">
                <div className="flex-1 w-full relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input
                    type="text"
                    value={maquilaSearchQuery}
                    onChange={(e) => setMaquilaSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, correo, teléfono, empresa, comentarios o servicio..."
                    className="w-full bg-stone-50/50 border border-stone-200 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#8C4723] focus:bg-white text-[#1c1c18]"
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={maquilaLeadTypeFilter}
                    onChange={(e) => setMaquilaLeadTypeFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-[#8C4723] text-[#1c1c18]"
                  >
                    <option value="all">Todos los tipos de lead</option>
                    <option value="Importador">Importador</option>
                    <option value="Empresario">Empresario</option>
                    <option value="Marca Existente">Marca Existente</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {(maquilaSearchQuery || maquilaLeadTypeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setMaquilaSearchQuery("");
                      setMaquilaLeadTypeFilter("all");
                    }}
                    className="text-xs text-stone-500 hover:text-stone-850 font-semibold cursor-pointer underline underline-offset-2 shrink-0"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>

              {/* Descargar Reportes de Leads Form */}
              <div className="bg-stone-50 border border-stone-200/60 p-4 flex flex-col md:flex-row md:items-end gap-4 mb-4 font-sans">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Descargar Periodos - Fecha Inicio</label>
                  <input
                    type="date"
                    value={maquilaDownloadStartDate}
                    onChange={(e) => setMaquilaDownloadStartDate(e.target.value)}
                    className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Descargar Periodos - Fecha Fin</label>
                  <input
                    type="date"
                    value={maquilaDownloadEndDate}
                    onChange={(e) => setMaquilaDownloadEndDate(e.target.value)}
                    className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none text-[#1c1c18]"
                  />
                </div>
                <button
                  onClick={handleDownloadMaquilaCsv}
                  className="bg-[#8C4723] hover:bg-[#70381b] text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer h-[38px] transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">download</span>
                  Descargar Reporte (CSV)
                </button>
              </div>

              {/* Desktop view: table */}
              <div className="hidden md:block overflow-x-auto border border-stone-200 bg-white font-sans">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[9px] border-b border-stone-200 font-semibold">
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Servicio / Interés</th>
                      <th className="p-3 text-center">Tipo Lead</th>
                      <th className="p-3 text-center">Origen</th>
                      <th className="p-3">Comentarios / Notas</th>
                      <th className="p-3 text-center">Seguimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredMaquilaLeads.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-stone-400 italic">
                          {maquilaSearchQuery ? "No se encontraron leads que coincidan con la búsqueda." : "No hay registros de leads en la base de datos."}
                        </td>
                      </tr>
                    ) : (
                      filteredMaquilaLeads.map((lead) => {
                        const leadTypeVal = lead.lead_type || lead.objective || 'Empresario';
                        return (
                          <tr key={lead.id} className="hover:bg-stone-50/40 text-stone-700">
                            <td className="p-3 text-stone-400 whitespace-nowrap">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              }) : 'N/A'}
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-stone-900">{lead.name}</div>
                              <div className="text-[10px] text-stone-500 font-mono">{lead.email}</div>
                              <div className="text-[10px] text-stone-500">{lead.phone ? `+${lead.lada || ''} ${lead.phone}`.trim() : ''}</div>
                              {lead.company && <div className="text-[9px] uppercase font-bold text-[#8C4723] mt-0.5">{lead.company}</div>}
                            </td>
                            <td className="p-3 font-medium">{lead.solution || 'No especificado'}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm border ${
                                leadTypeVal === "Importador" ? "bg-blue-50 text-blue-800 border-blue-200" :
                                leadTypeVal === "Marca Existente" ? "bg-purple-50 text-purple-800 border-purple-200" :
                                leadTypeVal === "Empresario" ? "bg-amber-50 text-amber-800 border-amber-200" :
                                "bg-stone-50 text-stone-850 border-stone-200"
                              }`}>
                                {leadTypeVal}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm border ${
                                (lead.origin || 'quiz').toLowerCase() === 'quiz' ? 'bg-[#f4f7f6] text-[#2F403E] border-[#2F403E]/10' : 'bg-orange-50 text-orange-850 border-orange-200'
                              }`}>
                                {lead.origin || 'quiz'}
                              </span>
                            </td>
                            {editingMaquilaLeadId === lead.id ? (
                              <td className="p-3 max-w-[280px]">
                                <div className="flex flex-col gap-1.5">
                                  <textarea
                                    value={editingMaquilaComments}
                                    onChange={(e) => setEditingMaquilaComments(e.target.value)}
                                    className="w-full bg-white border border-stone-300 p-1.5 text-xs focus:outline-none text-[#1c1c18] font-sans rounded"
                                    rows="2"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleUpdateMaquilaComments(lead.id, editingMaquilaComments)}
                                      disabled={isUpdatingMaquilaComments}
                                      className="px-2 py-1 bg-[#2F403E] hover:bg-[#8C4723] text-white text-[10px] uppercase font-bold rounded cursor-pointer disabled:opacity-50"
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      onClick={() => setEditingMaquilaLeadId(null)}
                                      className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] uppercase font-bold rounded cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              <td className="p-3 max-w-[280px] break-words text-stone-500 italic">
                                <div className="flex justify-between items-start gap-2 group">
                                  <span className="flex-1">
                                    {lead.comments || '-'}
                                  </span>
                                  {!userHasRole("viewer") && (
                                    <button
                                      onClick={() => {
                                        setEditingMaquilaLeadId(lead.id);
                                        setEditingMaquilaComments(lead.comments || "");
                                      }}
                                      className="text-stone-400 hover:text-[#8C4723] transition-colors p-0.5 cursor-pointer shrink-0 opacity-80 md:opacity-0 md:group-hover:opacity-100"
                                      title="Editar comentarios"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">edit</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="p-3 text-center whitespace-nowrap">
                              {lead.follow_up_sent ? (
                                <div className="flex flex-col items-center">
                                  <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                                    ENVIADO
                                  </span>
                                  {lead.follow_up_sent_at && (
                                    <span className="text-[9px] text-stone-400 mt-0.5 font-mono">
                                      {new Date(lead.follow_up_sent_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                                  PENDIENTE
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile view: list of cards */}
              <div className="block md:hidden space-y-3 font-sans">
                {filteredMaquilaLeads.length === 0 ? (
                  <div className="bg-white border border-stone-200 p-8 text-center text-stone-400 italic rounded">
                    No se encontraron leads que coincidan con la búsqueda.
                  </div>
                ) : (
                  filteredMaquilaLeads.map((lead) => {
                    const leadTypeVal = lead.lead_type || lead.objective || 'Empresario';
                    return (
                      <div key={lead.id} className="bg-white border border-stone-200 p-4 rounded shadow-sm text-left space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-MX') : 'N/A'}
                            </span>
                            <h6 className="font-bold text-stone-900 text-sm mt-0.5">{lead.name}</h6>
                            {lead.company && <div className="text-[9px] uppercase font-bold text-[#8C4723]">{lead.company}</div>}
                          </div>
                          
                          <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm border ${
                            leadTypeVal === "Importador" ? "bg-blue-50 text-blue-800 border-blue-200" :
                            leadTypeVal === "Marca Existente" ? "bg-purple-50 text-purple-800 border-purple-200" :
                            leadTypeVal === "Empresario" ? "bg-amber-50 text-amber-800 border-amber-200" :
                            "bg-stone-50 text-stone-850 border-stone-200"
                          }`}>
                            {leadTypeVal}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 pt-1 border-t border-stone-100">
                          <div><span className="text-stone-400">Email:</span> <span className="font-mono text-stone-700">{lead.email}</span></div>
                          <div><span className="text-stone-400">Teléfono:</span> <span className="text-stone-700">{lead.phone ? `+${lead.lada || ''} ${lead.phone}`.trim() : 'N/A'}</span></div>
                          <div><span className="text-stone-400">Servicio:</span> <span className="font-medium text-stone-800">{lead.solution || 'No especificado'}</span></div>
                          <div><span className="text-stone-400">Origen:</span> <span className="font-medium text-[#8C4723] uppercase text-[10px] tracking-wider">{lead.origin || 'quiz'}</span></div>
                          {editingMaquilaLeadId === lead.id ? (
                            <div className="bg-stone-50 p-3 border border-stone-200 mt-1 rounded space-y-2">
                              <label className="block text-[9px] font-bold text-stone-400 uppercase">Editar Comentarios</label>
                              <textarea
                                value={editingMaquilaComments}
                                onChange={(e) => setEditingMaquilaComments(e.target.value)}
                                className="w-full bg-white border border-stone-300 p-2 text-xs focus:outline-none text-[#1c1c18] font-sans rounded"
                                rows="3"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMaquilaComments(lead.id, editingMaquilaComments)}
                                  disabled={isUpdatingMaquilaComments}
                                  className="px-3 py-1.5 bg-[#2F403E] hover:bg-[#8C4723] text-white text-[10px] uppercase font-bold rounded cursor-pointer disabled:opacity-50"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingMaquilaLeadId(null)}
                                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] uppercase font-bold rounded cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-stone-50 p-2 border border-stone-100 text-stone-600 italic text-[11px] mt-1 rounded flex justify-between items-start gap-2">
                              <span className="flex-1">
                                {lead.comments ? `"${lead.comments}"` : <span className="text-stone-400 not-italic font-sans">Sin comentarios.</span>}
                              </span>
                              {!userHasRole("viewer") && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMaquilaLeadId(lead.id);
                                    setEditingMaquilaComments(lead.comments || "");
                                  }}
                                  className="text-stone-400 hover:text-[#8C4723] transition-colors p-0.5 cursor-pointer shrink-0"
                                  title="Editar comentarios"
                                >
                                  <span className="material-symbols-outlined text-[15px]">edit</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-[10px]">
                          <span className="text-stone-400">Seguimiento Automático:</span>
                          {lead.follow_up_sent ? (
                            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded-sm">
                              ENVIADO {lead.follow_up_sent_at && `(${new Date(lead.follow_up_sent_at).toLocaleDateString('es-MX')})`}
                            </span>
                          ) : (
                            <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded-sm">
                              PENDIENTE
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* QR Ticket Modal for Admin */}
      {selectedQrTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div id="printable-ticket" className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-stone-200 text-stone-800 space-y-4 text-left scrollbar-thin">
            <button
              onClick={() => setSelectedQrTicket(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 cursor-pointer print-hidden"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#8C4723]">Boleto Digital de Acceso</h4>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-mono font-semibold">{selectedQrTicket.code}</p>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200/60 flex flex-col items-center justify-center space-y-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  `${window.location.origin}/validar-ticket?code=${selectedQrTicket.code}`
                )}`}
                alt="Código QR de Acceso"
                className="w-48 h-48 border border-white shadow-sm bg-white p-2"
              />
              <span className="text-[10px] text-stone-400 text-center">Escanea este código QR con cualquier dispositivo para validar la entrada</span>
            </div>

            <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Titular:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Correo:</span>
                <span className="font-semibold text-stone-800">{selectedQrTicket.email}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Experiencia:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Fecha y Hora:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.date} a las {selectedQrTicket.time}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Visitantes:</span>
                <span className="font-bold text-stone-900">{selectedQrTicket.guests} pax</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Monto Cobrado:</span>
                <span className="font-bold text-stone-900">${selectedQrTicket.amount} MXN ({selectedQrTicket.method})</span>
              </div>
              {selectedQrTicket.allergies && (
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Alergias:</span>
                  <span className="font-semibold text-red-600">{selectedQrTicket.allergies}</span>
                </div>
              )}
              {selectedQrTicket.celebration && (
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">¿Celebra algo?:</span>
                  <span className="font-semibold text-[#8C4723]">{selectedQrTicket.celebration}</span>
                </div>
              )}
              {selectedQrTicket.comments && (
                <div className="border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500 block mb-0.5">Comentarios:</span>
                  <span className="font-normal text-stone-600 italic block leading-snug">{selectedQrTicket.comments}</span>
                </div>
              )}
            </div>

            {selectedQrTicket.requires_invoice && (
              <div className="bg-stone-50 p-3 border border-[#d9c2b6]/40 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-stone-200 pb-1">
                  Datos de Facturación SAT
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">RFC:</span>
                  <span className="font-bold text-stone-900">{selectedQrTicket.rfc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Razón Social:</span>
                  <span className="font-semibold text-stone-800 text-right">{selectedQrTicket.razon_social}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Código Postal (CP):</span>
                  <span className="font-semibold text-stone-900">{selectedQrTicket.postal_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Régimen Fiscal:</span>
                  <span className="font-normal text-stone-700 text-right text-[10px]">{selectedQrTicket.regimen_fiscal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Uso de CFDI:</span>
                  <span className="font-normal text-stone-700 text-right text-[10px]">{selectedQrTicket.cfdi_use}</span>
                </div>
                {selectedQrTicket.card_type && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tipo de Tarjeta:</span>
                    <span className="font-semibold text-stone-900 text-right">{selectedQrTicket.card_type}</span>
                  </div>
                )}
                 <div className="flex justify-between items-center border-t border-stone-200 pt-1.5 mt-1.5">
                   <span className="text-stone-500 font-bold">Estado de Factura:</span>
                   <label className="inline-flex items-center gap-1.5 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={selectedQrTicket.invoice_sent || false}
                       disabled={userHasRole("viewer")}
                       onChange={(e) => handleToggleInvoiceSent(selectedQrTicket.code, e.target.checked)}
                       className="w-3.5 h-3.5 rounded border-stone-300 text-[#8C4723] focus:ring-[#8C4723] cursor-pointer"
                     />
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedQrTicket.invoice_sent ? 'text-emerald-700' : 'text-stone-500'}`}>
                       {selectedQrTicket.invoice_sent ? 'Enviada' : 'Pendiente'}
                     </span>
                   </label>
                 </div>
              </div>
            )}


            <div className="pt-2 flex gap-2 print-hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Imprimir / PDF
              </button>
              <button
                onClick={() => setSelectedQrTicket(null)}
                className="flex-1 bg-[#8C4723] hover:bg-[#70381b] text-white py-2.5 font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOG AUTHORS DIRECTORY MODAL */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-stone-200 text-stone-800 space-y-5 text-left rounded-lg">
            <button
              onClick={() => {
                setShowAuthorModal(false);
                setEditingAuthor(null);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h5 className="font-serif text-lg font-bold text-[#8C4723] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">groups</span>
                  Directorio de Autores del Journal
                </h5>
                <p className="text-xs text-stone-500 mt-0.5">
                  Crea a los autores una sola vez para seleccionarlos con 1 clic al redactar crónicas.
                </p>
              </div>
              {!editingAuthor && (
                <button
                  onClick={() => setEditingAuthor({ name: "", role: "", photo: "/Don Manuel Loy.webp", bio: "" })}
                  className="bg-[#8C4723] hover:bg-[#70381b] text-white text-xs px-3 py-1.5 uppercase font-bold rounded flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  Nuevo Autor
                </button>
              )}
            </div>

            {/* Form to create/edit author */}
            {editingAuthor ? (
              <form onSubmit={handleSaveAuthor} className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h6 className="font-serif text-xs font-bold text-stone-900 uppercase">
                    {editingAuthor.id ? "Editar Autor" : "Registrar Nuevo Autor"}
                  </h6>
                  <button
                    type="button"
                    onClick={() => setEditingAuthor(null)}
                    className="text-xs text-stone-400 hover:text-stone-700 font-semibold"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingAuthor.name}
                      placeholder="Ej. Don Manuel Loy"
                      className="w-full bg-white border border-stone-300 p-2 rounded focus:outline-none focus:border-[#8C4723]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Cargo / Rol Editorial *</label>
                    <input
                      type="text"
                      name="role"
                      required
                      defaultValue={editingAuthor.role}
                      placeholder="Ej. Maestro Tequilero & Selección"
                      className="w-full bg-white border border-stone-300 p-2 rounded focus:outline-none focus:border-[#8C4723]"
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <label className="block text-[10px] text-stone-500 uppercase font-bold">Foto del Autor (URL o Ruta) *</label>
                  <input
                    type="text"
                    id="author_photo_modal_input"
                    name="photo"
                    required
                    defaultValue={editingAuthor.photo || "/Don Manuel Loy.webp"}
                    className="w-full bg-white border border-stone-300 p-2 rounded focus:outline-none focus:border-[#8C4723]"
                  />
                  {/* Quick-pick photos from project */}
                  <div className="pt-1">
                    <span className="text-[10px] text-stone-400 block mb-1">Fotos sugeridas de Casa Loy (clic para seleccionar):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Don Manuel Loy", path: "/Don Manuel Loy.webp" },
                        { label: "Sergio Chef", path: "/Sergio Chef.webp" },
                        { label: "Jimador de Origen", path: "/Empleado Jimador Casa Loy Tequilera.webp" },
                        { label: "Claudia Sommelier", path: "/Ejecutiva.webp" },
                        { label: "Empleado Campo", path: "/Empleado Casa Loy Tequilera.webp" }
                      ].map((opt) => (
                        <button
                          key={opt.path}
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("author_photo_modal_input");
                            if (input) input.value = opt.path;
                          }}
                          className="text-[10px] bg-white hover:bg-stone-200 border border-stone-300 px-2 py-1 rounded text-stone-700 flex items-center gap-1 cursor-pointer"
                        >
                          <img src={opt.path} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-[10px] text-stone-500 uppercase font-bold mb-1">Biografía / Semblanza</label>
                  <textarea
                    name="bio"
                    rows="3"
                    defaultValue={editingAuthor.bio}
                    placeholder="Breve reseña sobre su trayectoria y conexión con el tequila y Casa Loy..."
                    className="w-full bg-white border border-stone-300 p-2 rounded focus:outline-none focus:border-[#8C4723]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingAuthor(null)}
                    className="px-3 py-1.5 text-xs border border-stone-300 rounded text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-[#8C4723] hover:bg-[#70381b] text-white font-bold rounded cursor-pointer"
                  >
                    Guardar Autor
                  </button>
                </div>
              </form>
            ) : null}

            {/* Authors list grid */}
            <div className="space-y-3">
              <h6 className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                Autores Registrados ({authorsList.length})
              </h6>

              {authorsList.length === 0 ? (
                <div className="text-center py-8 text-stone-400 italic text-xs">
                  No hay autores registrados aún. Crea el primero arriba.
                </div>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden bg-white">
                  {authorsList.map((a) => (
                    <div key={a.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={a.photo}
                          alt={a.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] shrink-0 bg-stone-100"
                        />
                        <div>
                          <h6 className="font-serif font-bold text-stone-900 text-sm leading-tight">
                            {a.name}
                          </h6>
                          <span className="text-[11px] text-[#8C4723] font-semibold block">
                            {a.role}
                          </span>
                          {a.bio && (
                            <p className="text-[11px] text-stone-500 font-light line-clamp-1 mt-0.5">
                              {a.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingAuthor(a)}
                          className="text-blue-700 hover:underline text-xs font-bold uppercase p-1 cursor-pointer"
                          title="Editar autor"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAuthor(a.id)}
                          className="text-red-700 hover:underline text-xs font-bold uppercase p-1 cursor-pointer"
                          title="Eliminar autor"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-3 flex justify-end">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="px-4 py-2 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTANT MODAL POPUP */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 shadow-2xl relative border border-stone-200 text-stone-800 space-y-4 text-left">
            <button
              onClick={() => {
                setShowAiModal(false);
                setAiResult("");
                setAiPrompt("");
              }}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h5 className="font-serif text-lg font-bold text-[#8C4723] border-b border-stone-100 pb-2">
              🤖 Asistente de Redacción Inteligente (Gemini)
            </h5>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 font-bold mb-1">Instrucciones / Tema del prompt *</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows="3"
                  className="w-full border border-stone-200 p-2 focus:outline-none"
                  placeholder="Ej. Redacta una introducción elegante sobre la filtración de nuestro tequila reposado..."
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">Tipo de asistencia</label>
                <select value={aiType} onChange={(e) => setAiType(e.target.value)} className="w-full border border-stone-200 p-2">
                  <option value="blog_content">Cuerpo de Artículo Completo</option>
                  <option value="seo_meta">Metadatos SEO y Excerpt</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAiAssistSubmit}
                disabled={aiAssistLoading}
                className="w-full bg-[#8C4723] hover:bg-[#70381b] text-white py-2.5 font-bold uppercase tracking-wider cursor-pointer"
              >
                {aiAssistLoading ? "Generando Texto con IA..." : "Generar Contenido"}
              </button>

              {aiResult && (
                <div className="space-y-2">
                  <label className="block text-stone-500 font-bold border-t border-stone-100 pt-2">Texto Generado:</label>
                  <textarea
                    readOnly
                    value={aiResult}
                    rows="8"
                    className="w-full bg-stone-50 border border-stone-200 p-2.5 font-mono text-[11px] leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Copy generated text to clipboard
                        navigator.clipboard.writeText(aiResult);
                        alert("Texto copiado al portapapeles.");
                      }}
                      className="flex-1 bg-stone-100 text-stone-700 py-1.5 text-xs font-semibold cursor-pointer uppercase tracking-wider text-center"
                    >
                      Copiar texto
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAiModal(false);
                        setAiResult("");
                        setAiPrompt("");
                      }}
                      className="flex-1 bg-[#2F403E] text-white py-1.5 text-xs font-semibold cursor-pointer uppercase tracking-wider text-center"
                    >
                      Cerrar asistente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
