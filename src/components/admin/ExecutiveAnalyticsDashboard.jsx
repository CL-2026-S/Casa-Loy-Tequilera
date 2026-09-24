import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

// Color tokens aligned with Casa Loy's luxury identity
const BRAND = {
  agaveDark: "#1A2624",
  agaveMedium: "#243533",
  terracotta: "#8C4723",
  gold: "#C29B38",
  goldLight: "#E0C068",
  goldMuted: "#EEDDB5",
  platinum: "#7A8288",
  platinumLight: "#E5E7EB",
  emerald: "#059669",
  emeraldBg: "#ECFDF5",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  blue: "#2563EB",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  rose: "#E11D48",
  sand: "#FBF9F5",
  cardBg: "#FFFFFF",
  borderLight: "#E7E5E4",
};

const EXP_CONFIG = {
  oro: {
    key: "oro",
    name: "Recorrido Oro",
    price: 550,
    color: BRAND.gold,
    accentBg: "bg-amber-500/10 text-amber-900 border-amber-500/30",
    badgeColor: "#C29B38",
  },
  platino: {
    key: "platino",
    name: "Recorrido Platino",
    price: 750,
    color: BRAND.platinum,
    accentBg: "bg-slate-500/10 text-slate-800 border-slate-400/30",
    badgeColor: "#7A8288",
  },
  diamante: {
    key: "diamante",
    name: "Recorrido Diamante",
    price: 1500,
    color: BRAND.agaveDark,
    accentBg: "bg-stone-900/10 text-stone-900 border-stone-800/30",
    badgeColor: "#1A2624",
  },
};

// Helper to normalize any date into YYYY-MM-DD
function normalizeDateStr(dateVal) {
  if (!dateVal) return null;
  if (typeof dateVal === "string") {
    const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
  }
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    const y = dateVal.getFullYear();
    const m = String(dateVal.getMonth() + 1).padStart(2, "0");
    const day = String(dateVal.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return null;
}

// Format currency in Mexican Pesos
function formatMXN(amount) {
  return `$${Number(amount || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} MXN`;
}

// Generate smooth cubic bezier SVG path from points array
function getSplinePath(points, height) {
  if (!points || points.length === 0) return { linePath: "", areaPath: "" };
  if (points.length === 1) {
    const p = points[0];
    return {
      linePath: `M ${p.x} ${p.y} L ${p.x + 1} ${p.y}`,
      areaPath: `M ${p.x} ${height} L ${p.x} ${p.y} L ${p.x + 1} ${p.y} L ${p.x + 1} ${height} Z`,
    };
  }

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cpX = (current.x + next.x) / 2;
    linePath += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last.x} ${height} L ${first.x} ${height} Z`;

  return { linePath, areaPath };
}

export default function ExecutiveAnalyticsDashboard({
  bookingsLog = [],
  restaurantBookings = [],
  maquilaLeadsList = [],
  subscribersList = [],
  user,
  setActiveTab,
  setShowManualForm,
  setProfileSubTab,
  setProfileStatusMsg,
  setShowProfileModal,
  profileAvatarColor = "#C29B38",
  maxCapacityLimit = 50,
  onRefreshData,
}) {
  // Preset filter range
  const [datePreset, setDatePreset] = useState("last30"); // today | last7 | last30 | thisMonth | lastMonth | thisYear | all | custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Timeline chart metric selector
  const [timelineMetric, setTimelineMetric] = useState("revenue"); // revenue | pax | bookings
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Donut view metric selector
  const [donutMetric, setDonutMetric] = useState("revenue"); // revenue | pax

  // Lower Table Tab Selector
  const [activeTableTab, setActiveTableTab] = useState("tours"); // tours | newsletter | restaurant | maquila
  const [tableSearch, setTableSearch] = useState("");
  const [tableExpFilter, setTableExpFilter] = useState("all");
  const [tableStatusFilter, setTableStatusFilter] = useState("all");
  const [tablePage, setTablePage] = useState(1);
  const TABLE_PAGE_SIZE = 7;

  // Notification / download toast feedback
  const [exportNotice, setExportNotice] = useState(null);

  // Compute effective date range [effectiveStart, effectiveEnd]
  const { effectiveStart, effectiveEnd, prevStart, prevEnd, rangeLabel } = useMemo(() => {
    const today = new Date();
    const todayStr = normalizeDateStr(today);

    const formatDateOffset = (daysOffset) => {
      const d = new Date();
      d.setDate(d.getDate() + daysOffset);
      return normalizeDateStr(d);
    };

    let start = null;
    let end = todayStr;
    let label = "";

    if (datePreset === "today") {
      start = todayStr;
      end = todayStr;
      label = "Hoy";
    } else if (datePreset === "last7") {
      start = formatDateOffset(-6);
      end = todayStr;
      label = "Últimos 7 días";
    } else if (datePreset === "last30") {
      start = formatDateOffset(-29);
      end = todayStr;
      label = "Últimos 30 días";
    } else if (datePreset === "thisMonth") {
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      start = `${y}-${m}-01`;
      const lastDay = new Date(y, today.getMonth() + 1, 0).getDate();
      end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
      label = "Este mes";
    } else if (datePreset === "lastMonth") {
      const y = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      const prevM = today.getMonth() === 0 ? 12 : today.getMonth();
      const mStr = String(prevM).padStart(2, "0");
      start = `${y}-${mStr}-01`;
      const lastDay = new Date(y, prevM, 0).getDate();
      end = `${y}-${mStr}-${String(lastDay).padStart(2, "0")}`;
      label = "Mes anterior";
    } else if (datePreset === "thisYear") {
      const y = today.getFullYear();
      start = `${y}-01-01`;
      end = `${y}-12-31`;
      label = `Año ${y}`;
    } else if (datePreset === "all") {
      start = null;
      end = null;
      label = "Historial Completo";
    } else if (datePreset === "custom") {
      start = customStartDate || null;
      end = customEndDate || null;
      label = start && end ? `${start} al ${end}` : "Rango Personalizado";
    }

    // Previous comparison period calculation
    let pStart = null;
    let pEnd = null;
    if (start && end) {
      const sDate = new Date(start);
      const eDate = new Date(end);
      const diffDays = Math.max(1, Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const pEndDate = new Date(sDate);
      pEndDate.setDate(pEndDate.getDate() - 1);
      const pStartDate = new Date(pEndDate);
      pStartDate.setDate(pStartDate.getDate() - diffDays + 1);

      pStart = normalizeDateStr(pStartDate);
      pEnd = normalizeDateStr(pEndDate);
    }

    return {
      effectiveStart: start,
      effectiveEnd: end,
      prevStart: pStart,
      prevEnd: pEnd,
      rangeLabel: label,
    };
  }, [datePreset, customStartDate, customEndDate]);

  // Filter helper
  const isDateInRange = (dateStr, start, end) => {
    if (!start && !end) return true;
    const normalized = normalizeDateStr(dateStr);
    if (!normalized) return false;
    if (start && normalized < start) return false;
    if (end && normalized > end) return false;
    return true;
  };

  // Helper to determine booking revenue
  const getBookingRevenue = (b) => {
    if (b.amount !== undefined && b.amount !== null && !isNaN(Number(b.amount))) {
      return Number(b.amount);
    }
    if (b.total !== undefined && b.total !== null && !isNaN(Number(b.total))) {
      return Number(b.total);
    }
    const t = String(b.tour_type || b.tour_id || b.experience_id || "oro").toLowerCase();
    const guests = parseInt(b.guests) || 1;
    if (t.includes("diamante")) return guests * 1500;
    if (t.includes("platino")) return guests * 750;
    return guests * 550;
  };

  // Helper to classify tour type
  const getTourTypeKey = (b) => {
    const t = String(b.tour_type || b.tour_id || b.experience_id || b.packageName || "oro").toLowerCase();
    if (t.includes("diamante")) return "diamante";
    if (t.includes("platino")) return "platino";
    return "oro";
  };

  // Helper to check if confirmed/paid
  const isBookingConfirmed = (b) => {
    const s = String(b.status || "").toLowerCase();
    return s === "confirmada" || s === "completada" || s === "confirmed" || s === "paid" || b.paid === true;
  };

  const isBookingAbandoned = (b) => {
    const s = String(b.status || "").toLowerCase();
    return s.includes("abandonado") || s.includes("intento") || s.includes("draft") || s.includes("pendiente");
  };

  // Filter datasets by effective date range
  const filteredTourBookings = useMemo(() => {
    return bookingsLog.filter((b) => isDateInRange(b.date || b.timestamp, effectiveStart, effectiveEnd));
  }, [bookingsLog, effectiveStart, effectiveEnd]);

  const filteredRestBookings = useMemo(() => {
    return restaurantBookings.filter((r) => isDateInRange(r.date_str || r.date || r.created_at, effectiveStart, effectiveEnd));
  }, [restaurantBookings, effectiveStart, effectiveEnd]);

  const filteredMaquilaLeads = useMemo(() => {
    return maquilaLeadsList.filter((m) => isDateInRange(m.created_at || m.date, effectiveStart, effectiveEnd));
  }, [maquilaLeadsList, effectiveStart, effectiveEnd]);

  // Newsletter Subscribers in effective date range
  const filteredSubscribers = useMemo(() => {
    return subscribersList.filter((s) => isDateInRange(s.created_at, effectiveStart, effectiveEnd));
  }, [subscribersList, effectiveStart, effectiveEnd]);

  // Previous period bookings for percentage comparison
  const prevTourBookings = useMemo(() => {
    if (!prevStart || !prevEnd) return [];
    return bookingsLog.filter((b) => isDateInRange(b.date || b.timestamp, prevStart, prevEnd));
  }, [bookingsLog, prevStart, prevEnd]);

  const prevSubscribers = useMemo(() => {
    if (!prevStart || !prevEnd) return [];
    return subscribersList.filter((s) => isDateInRange(s.created_at, prevStart, prevEnd));
  }, [subscribersList, prevStart, prevEnd]);

  // --- ANALYTICAL CALCULATIONS (CURRENT PERIOD) ---
  const confirmedTours = useMemo(() => {
    return filteredTourBookings.filter(isBookingConfirmed);
  }, [filteredTourBookings]);

  const totalRevenue = useMemo(() => {
    return confirmedTours.reduce((sum, b) => sum + getBookingRevenue(b), 0);
  }, [confirmedTours]);

  const totalTourPax = useMemo(() => {
    return confirmedTours.reduce((sum, b) => sum + (parseInt(b.guests) || 1), 0);
  }, [confirmedTours]);

  const totalRestPax = useMemo(() => {
    return filteredRestBookings.reduce((sum, r) => sum + (parseInt(r.guests) || 0), 0);
  }, [filteredRestBookings]);

  const totalCombinedPax = totalTourPax + totalRestPax;

  const totalConfirmedCount = confirmedTours.length;
  const abandonedCount = filteredTourBookings.filter(isBookingAbandoned).length;
  const totalAttempts = filteredTourBookings.length;
  const conversionRate = totalAttempts > 0 ? Math.round((totalConfirmedCount / totalAttempts) * 100) : 100;

  const avgTicket = totalConfirmedCount > 0 ? Math.round(totalRevenue / totalConfirmedCount) : 0;
  const avgRevPerPax = totalTourPax > 0 ? Math.round(totalRevenue / totalTourPax) : 0;

  // Newsletter Metrics
  const totalNewSubscribers = filteredSubscribers.length;
  const activeSubscribersCount = filteredSubscribers.filter((s) => s.status === "active" || !s.status).length;
  const retentionRate = totalNewSubscribers > 0 ? Math.round((activeSubscribersCount / totalNewSubscribers) * 100) : 100;

  // Newsletter Sources Breakdown
  const subscriberSources = useMemo(() => {
    const counts = {};
    filteredSubscribers.forEach((s) => {
      const src = (s.source_page || "sitio_web").toLowerCase();
      let label = "Web General";
      if (src.includes("popup")) label = "Popup Promocional";
      else if (src.includes("footer")) label = "Footer";
      else if (src.includes("blog")) label = "Blog & Notas";
      else if (src.includes("home")) label = "Página Principal";
      else if (src.includes("tour") || src.includes("experienc")) label = "Tours & Experiencias";
      else if (src.includes("maquila")) label = "Maquila B2B";
      else if (src.includes("nativo")) label = "Restaurante Nativo";
      counts[label] = (counts[label] || 0) + 1;
    });

    const list = Object.entries(counts).map(([source, count]) => ({
      source,
      count,
      pct: totalNewSubscribers > 0 ? Math.round((count / totalNewSubscribers) * 100) : 0,
    }));
    list.sort((a, b) => b.count - a.count);
    return list;
  }, [filteredSubscribers, totalNewSubscribers]);

  // Invoicing SAT CFDI 4.0
  const requestedInvoices = useMemo(() => {
    return confirmedTours.filter((b) => b.cfdi_requested || b.requires_invoice || b.invoice_status === "issued" || b.rfc).length;
  }, [confirmedTours]);

  const issuedInvoices = useMemo(() => {
    return confirmedTours.filter((b) => b.invoice_status === "issued" || b.factura_emitida || b.invoice_sent).length;
  }, [confirmedTours]);

  const satEfficiency = requestedInvoices > 0 ? Math.round((issuedInvoices / requestedInvoices) * 100) : 100;

  // --- PREVIOUS PERIOD METRICS FOR GROWTH COMPARISON ---
  const prevMetrics = useMemo(() => {
    const prevConfirmed = prevTourBookings.filter(isBookingConfirmed);
    const pRev = prevConfirmed.reduce((sum, b) => sum + getBookingRevenue(b), 0);
    const pPax = prevConfirmed.reduce((sum, b) => sum + (parseInt(b.guests) || 1), 0);
    const pCount = prevConfirmed.length;
    const pSubs = prevSubscribers.length;

    const calcGrowth = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      const sign = diff >= 0 ? "+" : "";
      return `${sign}${diff.toFixed(1)}%`;
    };

    return {
      revGrowth: calcGrowth(totalRevenue, pRev),
      paxGrowth: calcGrowth(totalTourPax, pPax),
      countGrowth: calcGrowth(totalConfirmedCount, pCount),
      subsGrowth: calcGrowth(totalNewSubscribers, pSubs),
      hasPrevData: prevConfirmed.length > 0,
    };
  }, [prevTourBookings, prevSubscribers, totalRevenue, totalTourPax, totalConfirmedCount, totalNewSubscribers]);

  // --- EXPERIENCES BREAKDOWN ---
  const expBreakdown = useMemo(() => {
    const data = {
      oro: { ...EXP_CONFIG.oro, count: 0, pax: 0, revenue: 0 },
      platino: { ...EXP_CONFIG.platino, count: 0, pax: 0, revenue: 0 },
      diamante: { ...EXP_CONFIG.diamante, count: 0, pax: 0, revenue: 0 },
    };

    confirmedTours.forEach((b) => {
      const k = getTourTypeKey(b);
      const guests = parseInt(b.guests) || 1;
      const rev = getBookingRevenue(b);
      data[k].count += 1;
      data[k].pax += guests;
      data[k].revenue += rev;
    });

    const sumPax = totalTourPax || 1;
    const sumRev = totalRevenue || 1;

    Object.keys(data).forEach((k) => {
      data[k].paxPct = Math.round((data[k].pax / sumPax) * 100);
      data[k].revPct = Math.round((data[k].revenue / sumRev) * 100);
    });

    return data;
  }, [confirmedTours, totalTourPax, totalRevenue]);

  // --- TOUR MÁS VENDIDO (TOP SELLING TOUR) ---
  const topTour = useMemo(() => {
    const list = [
      { key: "diamante", ...expBreakdown.diamante },
      { key: "platino", ...expBreakdown.platino },
      { key: "oro", ...expBreakdown.oro },
    ];
    // Sort by revenue primarily, then by pax
    list.sort((a, b) => (b.revenue !== a.revenue ? b.revenue - a.revenue : b.pax - a.pax));
    const winner = list[0];
    const hasSales = (winner?.revenue || 0) > 0 || (winner?.pax || 0) > 0;
    return {
      name: hasSales ? winner.name : "Recorrido Diamante",
      key: hasSales ? winner.key : "diamante",
      price: hasSales ? winner.price : 1500,
      revenue: hasSales ? winner.revenue : 0,
      pax: hasSales ? winner.pax : 0,
      count: hasSales ? winner.count : 0,
      revPct: hasSales ? winner.revPct : 0,
      paxPct: hasSales ? winner.paxPct : 0,
      color: hasSales ? winner.color : BRAND.agaveDark,
      hasSales,
    };
  }, [expBreakdown]);

  // --- TIMELINE TREND DATA (DAILY / AGGREGATED BUCKETS) ---
  const timelineData = useMemo(() => {
    const buckets = {};

    const sorted = [...confirmedTours].sort((a, b) => {
      const da = normalizeDateStr(a.date || a.timestamp) || "";
      const db = normalizeDateStr(b.date || b.timestamp) || "";
      return da.localeCompare(db);
    });

    let datesList = [];
    if (effectiveStart && effectiveEnd) {
      const cur = new Date(effectiveStart);
      const endD = new Date(effectiveEnd);
      while (cur <= endD && datesList.length <= 90) {
        datesList.push(normalizeDateStr(cur));
        cur.setDate(cur.getDate() + 1);
      }
    } else {
      const uniq = Array.from(new Set(sorted.map((b) => normalizeDateStr(b.date || b.timestamp)).filter(Boolean)));
      datesList = uniq.slice(-30);
    }

    datesList.forEach((d) => {
      buckets[d] = {
        dateStr: d,
        revenue: 0,
        pax: 0,
        bookings: 0,
        tours: [],
      };
    });

    sorted.forEach((b) => {
      const d = normalizeDateStr(b.date || b.timestamp);
      if (d && buckets[d]) {
        buckets[d].revenue += getBookingRevenue(b);
        buckets[d].pax += parseInt(b.guests) || 1;
        buckets[d].bookings += 1;
        buckets[d].tours.push(b);
      }
    });

    return Object.values(buckets);
  }, [confirmedTours, effectiveStart, effectiveEnd]);

  // Max value for timeline scaling
  const timelineMax = useMemo(() => {
    if (timelineData.length === 0) return 100;
    const maxVal = Math.max(...timelineData.map((d) => d[timelineMetric] || 0));
    return maxVal > 0 ? maxVal * 1.15 : 100;
  }, [timelineData, timelineMetric]);

  // --- DAY OF WEEK & HOURLY DISTRIBUTION ---
  const dayOfWeekStats = useMemo(() => {
    const days = [
      { name: "Dom", fullName: "Domingo", pax: 0, revenue: 0, count: 0 },
      { name: "Lun", fullName: "Lunes", pax: 0, revenue: 0, count: 0 },
      { name: "Mar", fullName: "Martes", pax: 0, revenue: 0, count: 0 },
      { name: "Mié", fullName: "Miércoles", pax: 0, revenue: 0, count: 0 },
      { name: "Jue", fullName: "Jueves", pax: 0, revenue: 0, count: 0 },
      { name: "Vie", fullName: "Viernes", pax: 0, revenue: 0, count: 0 },
      { name: "Sáb", fullName: "Sábado", pax: 0, revenue: 0, count: 0 },
    ];

    confirmedTours.forEach((b) => {
      const dStr = normalizeDateStr(b.date || b.timestamp);
      if (dStr) {
        const dObj = new Date(`${dStr}T12:00:00`);
        const dayIdx = dObj.getDay();
        if (days[dayIdx]) {
          days[dayIdx].pax += parseInt(b.guests) || 1;
          days[dayIdx].revenue += getBookingRevenue(b);
          days[dayIdx].count += 1;
        }
      }
    });

    const maxDayPax = Math.max(1, ...days.map((d) => d.pax));
    const peakDay = days.reduce((best, cur) => (cur.pax > best.pax ? cur : best), days[0]);

    return { days, maxDayPax, peakDayName: peakDay.fullName, peakDayPax: peakDay.pax };
  }, [confirmedTours]);

  // Popular Tour Slots
  const timeSlotStats = useMemo(() => {
    const slotMap = {};
    confirmedTours.forEach((b) => {
      const rawTime = (b.time || "11:00 AM").trim();
      slotMap[rawTime] = (slotMap[rawTime] || 0) + (parseInt(b.guests) || 1);
    });

    const list = Object.entries(slotMap).map(([time, pax]) => ({ time, pax }));
    list.sort((a, b) => b.pax - a.pax);
    const maxPax = Math.max(1, ...list.map((s) => s.pax));
    const peakSlot = list.length > 0 ? list[0].time : "11:00 AM";
    const peakSlotPax = list.length > 0 ? list[0].pax : 0;
    return { slots: list, maxPax, peakSlot, peakSlotPax };
  }, [confirmedTours]);

  // --- EXPORT TO EXCEL (.XLSX) MULTI-SHEET ---
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const dateTag = `${effectiveStart || "Inicio"}_a_${effectiveEnd || "Actual"}`;

      // 1. EXECUTIVE SUMMARY SHEET
      const summaryAOA = [
        ["CASA LOY TEQUILERA - REPORTE EJECUTIVO DE RENDIMIENTO"],
        ["Destilería y Operaciones Turísticas | Altos de Jalisco, México"],
        ["Período de Análisis:", rangeLabel],
        ["Fecha de Emisión:", new Date().toLocaleString("es-MX")],
        ["Usuario Generador:", user?.name || "Administrador"],
        [],
        ["--- INDICADORES CLAVE DE DESEMPEÑO (KPIS) ---"],
        ["Métrica", "Valor", "Unidad / Detalle"],
        ["Inscritos al Newsletter", totalNewSubscribers, "Registrados en el período"],
        ["Suscriptores Newsletter Activos", activeSubscribersCount, `${retentionRate}% de retención`],
        ["Leads Maquilas B2B", filteredMaquilaLeads.length, "Prospectos de marca privada"],
        ["Mesas Reservas en Nativo", filteredRestBookings.length, "Reservas gastronómicas"],
        ["Comensales 1937 Nativo", totalRestPax, "Personas atendidas"],
        ["Ingresos en Tours", totalRevenue, "MXN (Reservas Confirmadas)"],
        ["Visitantes a Tours (#)", totalTourPax, "Asistentes a recorridos"],
        ["Tour Más Vendido", topTour.name, `${topTour.pax} pax - $${topTour.revenue.toLocaleString("es-MX")} MXN (${topTour.revPct}%)`],
        ["Horario de Mayor Afluencia", timeSlotStats.peakSlot, `${timeSlotStats.peakSlotPax} asistentes`],
        ["Día de Mayor Afluencia", dayOfWeekStats.peakDayName, `${dayOfWeekStats.peakDayPax} asistentes`],
        ["Ticket Promedio por Reserva (AOV)", avgTicket, "MXN por compra"],
        ["Ingreso Medio por Asistente (RevPAX)", avgRevPerPax, "MXN por visitante"],
        ["Tasa de Concreción de Reservas", `${conversionRate}%`, "Confirmadas vs Intentos"],
        ["Carritos Abandonados", abandonedCount, "Oportunidad de recuperación"],
        ["Facturas SAT CFDI 4.0 Emitidas", issuedInvoices, `De ${requestedInvoices} solicitadas (${satEfficiency}%)`],
        [],
        ["--- DESGLOSE POR EXPERIENCIA TEQUILERA ---"],
        ["Experiencia", "Precio Unitario", "Reservaciones", "Visitantes (Pax)", "Ingresos Totales ($ MXN)", "% Participación Pax", "% Participación Ingresos"],
        ["Recorrido Oro", EXP_CONFIG.oro.price, expBreakdown.oro.count, expBreakdown.oro.pax, expBreakdown.oro.revenue, `${expBreakdown.oro.paxPct}%`, `${expBreakdown.oro.revPct}%`],
        ["Recorrido Platino", EXP_CONFIG.platino.price, expBreakdown.platino.count, expBreakdown.platino.pax, expBreakdown.platino.revenue, `${expBreakdown.platino.paxPct}%`, `${expBreakdown.platino.revPct}%`],
        ["Recorrido Diamante", EXP_CONFIG.diamante.price, expBreakdown.diamante.count, expBreakdown.diamante.pax, expBreakdown.diamante.revenue, `${expBreakdown.diamante.paxPct}%`, `${expBreakdown.diamante.revPct}%`],
      ];

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryAOA);
      wsSummary["!cols"] = [{ wch: 38 }, { wch: 22 }, { wch: 32 }, { wch: 18 }, { wch: 24 }, { wch: 20 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen_Ejecutivo");

      // 2. TOURS DETAILED SHEET
      const toursRows = filteredTourBookings.map((b) => ({
        "Código Reserva": b.code || b.ticket_code || "",
        "Fecha Visita": b.date || "",
        "Horario": b.time || "",
        "Titular": b.name || b.customer_name || "",
        "Email": b.email || "",
        "Teléfono": b.phone || "",
        "Experiencia": b.packageName || b.experience_name || b.tour_type || "Oro",
        "Asistentes (Pax)": parseInt(b.guests) || 1,
        "Importe ($ MXN)": getBookingRevenue(b),
        "Estatus": b.status || (isBookingConfirmed(b) ? "Confirmada" : "Pendiente"),
        "Método de Pago": b.method || "Stripe / Online",
        "Solicita Factura": b.requires_invoice || b.cfdi_requested ? "SÍ" : "NO",
        "RFC SAT": b.rfc || "",
        "Razón Social": b.razon_social || "",
        "Régimen Fiscal": b.regimen_fiscal || "",
        "C.P. Fiscal": b.postal_code || "",
        "Uso CFDI": b.cfdi_use || "",
        "Fecha Registro": b.timestamp || "",
      }));
      const wsTours = XLSX.utils.json_to_sheet(toursRows);
      XLSX.utils.book_append_sheet(wb, wsTours, "Reservas_Tours");

      // 3. NEWSLETTER SUBSCRIBERS SHEET
      const subsRows = filteredSubscribers.map((s, idx) => ({
        "Folio": s.id || `#${idx + 1}`,
        "Correo Electrónico": s.email || "",
        "Origen / Página": s.source_page || "General",
        "Estatus": s.status === "active" || !s.status ? "Activo" : "Desuscrito",
        "Boletín Mensual": s.monthly_newsletter ? "SÍ" : "NO",
        "Email Bienvenida": s.welcome_email_sent ? "Entregado" : "Pendiente",
        "Fecha Registro": s.created_at || "",
      }));
      const wsSubs = XLSX.utils.json_to_sheet(subsRows);
      XLSX.utils.book_append_sheet(wb, wsSubs, "Inscritos_Newsletter");

      // 4. RESTAURANT 1937 NATIVO SHEET
      const restRows = filteredRestBookings.map((r) => ({
        "Código Mesa": r.code || "",
        "Fecha": r.date_str || r.date || "",
        "Hora": r.time_str || r.time || "",
        "Titular": r.customer_name || r.name || "",
        "Teléfono": r.customer_phone || r.phone || "",
        "Comensales": parseInt(r.guests) || 1,
        "Celebración / Motivo": r.reason || r.celebration || "",
        "Estatus": r.status || "Confirmada",
        "Notas": r.notes || r.comments || "",
        "Fecha Registro": r.created_at || "",
      }));
      const wsRest = XLSX.utils.json_to_sheet(restRows);
      XLSX.utils.book_append_sheet(wb, wsRest, "Mesas_Nativo_1937");

      // 5. MAQUILA LEADS SHEET
      const maquilaRows = filteredMaquilaLeads.map((m) => ({
        "Folio": m.id || "",
        "Nombre Contacto": m.name || "",
        "Empresa": m.company || "",
        "Email": m.email || "",
        "Teléfono": `${m.lada || ""} ${m.phone || ""}`.trim(),
        "Solución Solicitada": m.solution || "",
        "Objetivo": m.objective || "",
        "Etapa / Estatus": m.stage || m.status || "Nuevo",
        "Comentarios / Notas": m.comments || "",
        "Fecha Creación": m.created_at || "",
      }));
      const wsMaquila = XLSX.utils.json_to_sheet(maquilaRows);
      XLSX.utils.book_append_sheet(wb, wsMaquila, "Leads_Maquila_B2B");

      const filename = `Casa_Loy_Dashboard_Reporte_${dateTag}.xlsx`;
      XLSX.writeFile(wb, filename);

      setExportNotice({
        type: "success",
        msg: `¡Archivo Excel multi-hoja generado con éxito! (${filename})`,
      });
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setExportNotice({
        type: "error",
        msg: `Error al generar Excel: ${err.message}`,
      });
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  // --- EXPORT TO CSV (GENERAL OR SPECIFIC TAB) ---
  const handleExportCSV = (type = activeTableTab) => {
    try {
      const dateTag = `${effectiveStart || "Inicio"}_a_${effectiveEnd || "Actual"}`;
      let csvContent = "";
      let filename = "";

      if (type === "newsletter") {
        const headers = ["Folio", "Email", "Origen_Pagina", "Estatus", "Boletin_Mensual", "Fecha_Registro"];
        const rows = filteredSubscribers.map((s, idx) => [
          `"${s.id || idx + 1}"`,
          `"${s.email || ""}"`,
          `"${s.source_page || "General"}"`,
          `"${s.status === "active" || !s.status ? "Activo" : "Desuscrito"}"`,
          `"${s.monthly_newsletter ? "SI" : "NO"}"`,
          `"${s.created_at || ""}"`,
        ]);
        csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        filename = `Casa_Loy_Inscritos_Newsletter_${dateTag}.csv`;
      } else if (type === "restaurant") {
        const headers = ["Codigo_Mesa", "Titular", "Telefono", "Comensales", "Fecha", "Hora", "Motivo", "Estatus"];
        const rows = filteredRestBookings.map((r, idx) => [
          `"${r.code || idx + 1}"`,
          `"${(r.customer_name || r.name || "").replace(/"/g, '""')}"`,
          `"${r.customer_phone || r.phone || ""}"`,
          r.guests || 1,
          `"${r.date_str || r.date || ""}"`,
          `"${r.time_str || r.time || ""}"`,
          `"${(r.reason || "").replace(/"/g, '""')}"`,
          `"${r.status || "Confirmada"}"`,
        ]);
        csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        filename = `Casa_Loy_Mesas_Nativo_${dateTag}.csv`;
      } else if (type === "maquila") {
        const headers = ["Folio", "Contacto", "Empresa", "Email", "Telefono", "Solucion", "Estatus", "Fecha_Registro"];
        const rows = filteredMaquilaLeads.map((m, idx) => [
          `"${m.id || idx + 1}"`,
          `"${(m.name || "").replace(/"/g, '""')}"`,
          `"${(m.company || "").replace(/"/g, '""')}"`,
          `"${m.email || ""}"`,
          `"${m.phone || ""}"`,
          `"${m.solution || ""}"`,
          `"${m.stage || m.status || "Nuevo"}"`,
          `"${m.created_at || ""}"`,
        ]);
        csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        filename = `Casa_Loy_Leads_Maquila_${dateTag}.csv`;
      } else {
        const headers = [
          "Codigo_Reserva",
          "Fecha_Visita",
          "Horario",
          "Titular",
          "Email",
          "Telefono",
          "Experiencia",
          "Pax",
          "Importe_MXN",
          "Estatus",
          "Metodo_Pago",
          "Solicita_Factura",
          "RFC",
          "Razon_Social",
        ];

        const rows = filteredTourBookings.map((b) => [
          `"${b.code || b.ticket_code || ""}"`,
          `"${b.date || ""}"`,
          `"${b.time || ""}"`,
          `"${(b.name || b.customer_name || "").replace(/"/g, '""')}"`,
          `"${b.email || ""}"`,
          `"${b.phone || ""}"`,
          `"${(b.packageName || b.tour_type || "Oro").replace(/"/g, '""')}"`,
          b.guests || 1,
          getBookingRevenue(b),
          `"${b.status || (isBookingConfirmed(b) ? "Confirmada" : "Pendiente")}"`,
          `"${b.method || "Online"}"`,
          b.requires_invoice || b.cfdi_requested ? "SI" : "NO",
          `"${b.rfc || ""}"`,
          `"${(b.razon_social || "").replace(/"/g, '""')}"`,
        ]);
        csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        filename = `Casa_Loy_Reservas_Tours_${dateTag}.csv`;
      }

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice({
        type: "success",
        msg: `¡Archivo CSV (${filename}) descargado con éxito!`,
      });
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error("CSV Export error:", err);
      setExportNotice({
        type: "error",
        msg: `Error al exportar CSV: ${err.message}`,
      });
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  // --- PRINT / PDF EXECUTIVE VIEW ---
  const handlePrintPDF = () => {
    window.print();
  };

  // Filtered rows for current active lower table
  const searchedData = useMemo(() => {
    const q = tableSearch.toLowerCase().trim();

    if (activeTableTab === "newsletter") {
      return filteredSubscribers.filter((s) => {
        const matchesQuery = !q || (s.email || "").toLowerCase().includes(q) || (s.source_page || "").toLowerCase().includes(q);
        const matchesStatus =
          tableStatusFilter === "all" ||
          (tableStatusFilter === "active" && (s.status === "active" || !s.status)) ||
          (tableStatusFilter === "unsubscribed" && s.status === "unsubscribed");
        return matchesQuery && matchesStatus;
      });
    }

    if (activeTableTab === "restaurant") {
      return filteredRestBookings.filter((r) => {
        const matchesQuery =
          !q ||
          (r.code || "").toLowerCase().includes(q) ||
          (r.customer_name || r.name || "").toLowerCase().includes(q) ||
          (r.customer_phone || r.phone || "").toLowerCase().includes(q);
        return matchesQuery;
      });
    }

    if (activeTableTab === "maquila") {
      return filteredMaquilaLeads.filter((m) => {
        const matchesQuery =
          !q ||
          (m.name || "").toLowerCase().includes(q) ||
          (m.company || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q);
        return matchesQuery;
      });
    }

    // Default: tours
    return filteredTourBookings.filter((b) => {
      const matchesSearch =
        !q ||
        (b.code || "").toLowerCase().includes(q) ||
        (b.name || b.customer_name || "").toLowerCase().includes(q) ||
        (b.email || "").toLowerCase().includes(q);

      const matchesExp = tableExpFilter === "all" || getTourTypeKey(b) === tableExpFilter;

      let matchesStatus = true;
      if (tableStatusFilter === "confirmed") matchesStatus = isBookingConfirmed(b);
      else if (tableStatusFilter === "abandoned") matchesStatus = isBookingAbandoned(b);
      else if (tableStatusFilter === "cancelled") matchesStatus = String(b.status || "").toLowerCase().includes("cancel");

      return matchesSearch && matchesExp && matchesStatus;
    });
  }, [
    activeTableTab,
    filteredTourBookings,
    filteredRestBookings,
    filteredMaquilaLeads,
    filteredSubscribers,
    tableSearch,
    tableExpFilter,
    tableStatusFilter,
  ]);

  const totalTablePages = Math.max(1, Math.ceil(searchedData.length / TABLE_PAGE_SIZE));
  const paginatedData = searchedData.slice((tablePage - 1) * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE);

  // SVG Chart Calculations for Timeline
  const chartHeight = 180;
  const chartWidth = 700;
  const chartPadding = { top: 20, right: 30, bottom: 30, left: 55 };
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const chartPoints = useMemo(() => {
    if (timelineData.length === 0) return [];
    const step = timelineData.length > 1 ? innerWidth / (timelineData.length - 1) : innerWidth / 2;

    return timelineData.map((d, idx) => {
      const val = d[timelineMetric] || 0;
      const x = chartPadding.left + (timelineData.length === 1 ? innerWidth / 2 : idx * step);
      const ratio = timelineMax > 0 ? val / timelineMax : 0;
      const y = chartPadding.top + innerHeight - ratio * innerHeight;
      return { x, y, val, data: d };
    });
  }, [timelineData, timelineMetric, timelineMax, innerWidth, innerHeight, chartPadding]);

  const { linePath, areaPath } = useMemo(() => {
    return getSplinePath(chartPoints, chartPadding.top + innerHeight);
  }, [chartPoints, chartPadding, innerHeight]);

  // Donut SVG parameters
  const donutRadius = 60;
  const donutStrokeWidth = 22;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const donutSlices = useMemo(() => {
    const totalVal = donutMetric === "revenue" ? totalRevenue || 1 : totalTourPax || 1;
    const slices = [];
    let accumulatedAngle = 0;

    ["oro", "platino", "diamante"].forEach((key) => {
      const item = expBreakdown[key];
      const val = donutMetric === "revenue" ? item.revenue : item.pax;
      const pct = val / totalVal;
      const strokeLength = pct * donutCircumference;
      const strokeOffset = donutCircumference - strokeLength;
      const rotation = accumulatedAngle * 360 - 90;

      slices.push({
        key,
        name: item.name,
        color: item.color,
        val,
        pct: Math.round(pct * 100),
        strokeLength,
        strokeOffset,
        rotation,
      });

      accumulatedAngle += pct;
    });

    return slices;
  }, [donutMetric, expBreakdown, totalRevenue, totalTourPax, donutCircumference]);

  return (
    <div className="space-y-8 text-left animate-fadeIn">
      {/* Toast Notice */}
      {exportNotice && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-3 transition-all transform duration-300 ${
            exportNotice.type === "success"
              ? "bg-[#1A2624] text-amber-200 border-[#C29B38]/50"
              : "bg-rose-900 text-rose-100 border-rose-500/50"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {exportNotice.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{exportNotice.msg}</span>
        </div>
      )}

      {/* =========================================================================
          1. HEADER BAR: GREETING & DATE CONTROLLER (POLARIS / EXECUTIVE PALETTE)
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A2624] via-[#243533] to-[#1A2624] p-6 sm:p-8 text-white shadow-xl border border-amber-900/40">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden lg:flex items-center pr-10">
          <span className="material-symbols-outlined text-[160px] text-[#C29B38]">analytics</span>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* Left: User Profile & Title */}
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold text-white shadow-lg shrink-0 border-2 border-white/20"
              style={{ backgroundColor: profileAvatarColor }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#C29B38]/20 text-[#E0C068] border border-[#C29B38]/40">
                  {user?.role?.split(",")[0] || "Administrador"}
                </span>
                <span className="text-xs text-stone-300">
                  • Período evaluado: <strong className="text-white font-semibold">{rangeLabel}</strong>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Tablero de Control Analítico
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                Métricas ejecutivas de alta precisión: inscritos al newsletter, leads de maquila, reservas en Nativo, ingresos,
                visitantes a tours, horarios pico y afluencia diaria en Destilería Casa Loy.
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Exports */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer border border-emerald-500/40"
              title="Descargar libro Excel multi-hoja con desglose completo"
            >
              <span className="material-symbols-outlined text-sm">table_view</span>
              <span>Exportar Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => handleExportCSV(activeTableTab)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/15 cursor-pointer shadow-xs"
              title="Descargar datos actuales en formato CSV UTF-8"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#8C4723] hover:bg-[#a35329] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              title="Imprimir o guardar como PDF este informe ejecutivo"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Imprimir / PDF</span>
            </button>

            {onRefreshData && (
              <button
                onClick={onRefreshData}
                className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors border border-white/15 cursor-pointer"
                title="Actualizar datos en tiempo real"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Filter Toolbar embedded in Header Banner */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Rango:</span>
            </span>

            {[
              { id: "today", label: "Hoy" },
              { id: "last7", label: "7 días" },
              { id: "last30", label: "30 días" },
              { id: "thisMonth", label: "Este mes" },
              { id: "lastMonth", label: "Mes anterior" },
              { id: "thisYear", label: "Año 2026" },
              { id: "all", label: "Todo" },
              { id: "custom", label: "Personalizado" },
            ].map((p) => {
              const isActive = datePreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setDatePreset(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#C29B38] text-stone-900 font-bold shadow-md shadow-amber-500/20 scale-102"
                      : "bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Pickers */}
          {datePreset === "custom" && (
            <div className="flex flex-wrap items-center gap-2 bg-stone-900/60 p-2 rounded-xl border border-white/15 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400">Desde:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-stone-800 text-white text-xs px-2.5 py-1 rounded-md border border-stone-700 focus:outline-none focus:border-[#C29B38]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400">Hasta:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-stone-800 text-white text-xs px-2.5 py-1 rounded-md border border-stone-700 focus:outline-none focus:border-[#C29B38]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. CORE EXECUTIVE SHOW-OFF KPIS (8 PRINCIPAL METRIC CARDS)
             Directly organized by user priority:
             1. Inscritos Newsletter  2. Leads Maquilas  3. Mesas Nativo  4. Ingresos Tours
             5. Visitantes a Tours    6. Tour Más Vendido 7. Horario Pico  8. Afluencia x Día
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C29B38]"></span>
            <span>Indicadores Clave de Operación & Negocio</span>
          </h3>
          <span className="text-[11px] text-stone-400 font-medium">
            Actualizado en tiempo real • {rangeLabel}
          </span>
        </div>

        {/* 8-Card Grid (4 cols on lg, 2 on sm) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARD 1: INSCRITOS A NEWSLETTER */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-purple-400/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Inscritos a Newsletter
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">mark_email_read</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {totalNewSubscribers.toLocaleString("es-MX")}{" "}
                <span className="text-xs font-sans font-semibold text-stone-400">nuevos</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full text-[11px]">
                  {prevMetrics.subsGrowth}
                </span>
                <span className="text-stone-500 font-medium text-[11px]">
                  {activeSubscribersCount} activos ({retentionRate}%)
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: LEADS MAQUILAS */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-stone-500/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Leads Maquilas B2B
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">business_center</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {filteredMaquilaLeads.length}{" "}
                <span className="text-xs font-sans font-semibold text-stone-400">prospectos</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                  Marca Privada
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {filteredMaquilaLeads.filter((m) => m.stage === "new" || !m.stage).length} nuevos por atender
                </span>
              </div>
            </div>
          </div>

          {/* CARD 3: MESAS RESERVAS EN NATIVO */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-amber-500/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Mesas Reservas Nativo
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">restaurant</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {filteredRestBookings.length}{" "}
                <span className="text-xs font-sans font-semibold text-stone-400">mesas</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                  1937 Nativo
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {totalRestPax} comensales atendidos
                </span>
              </div>
            </div>
          </div>

          {/* CARD 4: INGRESOS EN TOURS */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-[#C29B38]/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Ingresos en Tours
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C29B38] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {formatMXN(totalRevenue)}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                    prevMetrics.revGrowth.startsWith("+")
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {prevMetrics.revGrowth} vs ant.
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {totalConfirmedCount} reservas pagadas
                </span>
              </div>
            </div>
          </div>

          {/* CARD 5: VISITANTES A TOURS (#) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-[#8C4723]/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Visitantes a Tours (#)
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#8C4723]/10 text-[#8C4723] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">confirmation_number</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {totalTourPax.toLocaleString("es-MX")}{" "}
                <span className="text-xs font-sans font-semibold text-stone-400">asistentes</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-[#8C4723] font-bold bg-[#8C4723]/10 px-2 py-0.5 rounded-full text-[11px]">
                  Boletos Emitidos
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {prevMetrics.paxGrowth} vs anterior
                </span>
              </div>
            </div>
          </div>

          {/* CARD 6: TOUR MÁS VENDIDO (TOP WINNER) */}
          <div className="bg-white border-2 border-[#C29B38]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group relative overflow-hidden bg-gradient-to-br from-white via-amber-50/20 to-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C4723]">
                Tour Más Vendido
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#C29B38]/20 text-[#8C4723] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-serif text-stone-900 tracking-tight truncate">
                {topTour.name}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/50 text-xs">
                <span className="text-[#8C4723] font-bold bg-amber-100/70 px-2 py-0.5 rounded-full text-[11px]">
                  TOP #1 ({topTour.revPct}% ventas)
                </span>
                <span className="text-stone-700 font-semibold text-[11px]">
                  {topTour.pax} pax • {formatMXN(topTour.revenue)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 7: VISITANTES X HORARIO (TURNO PICO) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-emerald-500/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Horario Más Visitado
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {timeSlotStats.slots.length > 0 ? timeSlotStats.slots[0].time : "11:00 AM"}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  Turno Pico
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {timeSlotStats.slots.length > 0 ? timeSlotStats.slots[0].pax : 0} pax ({maxCapacityLimit} cap. máx)
                </span>
              </div>
            </div>
          </div>

          {/* CARD 8: AFLUENCIA X DÍA (DÍA PICO) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all hover:border-blue-500/60 group relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Día de Mayor Afluencia
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-lg">event_available</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {dayOfWeekStats.peakDayName}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                  Día Pico
                </span>
                <span className="text-stone-600 font-medium text-[11px]">
                  {dayOfWeekStats.peakDayPax} asistentes acumulados
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ETC SECONDARY METRICS BAR (Ticket Promedio, Conversión Checkout, Cumplimiento SAT) */}
        <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400 text-base">receipt_long</span>
              <span className="text-stone-500">Ticket Promedio (AOV):</span>
              <strong className="text-stone-900 font-bold">{formatMXN(avgTicket)}</strong>
              <span className="text-stone-400">({formatMXN(avgRevPerPax)} / pax)</span>
            </div>

            <div className="hidden sm:block text-stone-300">|</div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400 text-base">shopping_cart_checkout</span>
              <span className="text-stone-500">Conversión Web:</span>
              <strong className="text-stone-900 font-bold">{conversionRate}%</strong>
              {abandonedCount > 0 && (
                <span className="text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                  {abandonedCount} carritos pendientes
                </span>
              )}
            </div>

            <div className="hidden sm:block text-stone-300">|</div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400 text-base">verified</span>
              <span className="text-stone-500">Facturación SAT CFDI 4.0:</span>
              <strong className="text-emerald-700 font-bold">{satEfficiency}%</strong>
              <span className="text-stone-400">({issuedInvoices} de {requestedInvoices} timbradas)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400">Impacto Global Destilería:</span>
            <span className="bg-stone-200 text-stone-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
              {totalCombinedPax.toLocaleString("es-MX")} visitantes totales
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. SUITE DE GRÁFICOS VISUALES INTERACTIVOS (ROW 1: AFLUENCIA X DÍA & DONUT TOUR MÁS VENDIDO)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Afluencia x Día & Curva de Ingresos/Visitantes */}
        <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#C29B38]">trending_up</span>
                  <h3 className="text-base font-bold text-stone-900">
                    Afluencia x Día & Evolución Temporal
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tendencia histórica diaria de ingresos, visitantes y reservaciones en el período seleccionado
                </p>
              </div>

              <div className="flex items-center bg-stone-100 p-1 rounded-xl shrink-0">
                {[
                  { id: "revenue", label: "Ingresos ($)", icon: "payments" },
                  { id: "pax", label: "Visitantes", icon: "groups" },
                  { id: "bookings", label: "Reservas", icon: "confirmation_number" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTimelineMetric(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timelineMetric === m.id
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 relative w-full overflow-hidden select-none">
              {timelineData.length === 0 ? (
                <div className="h-52 flex flex-col items-center justify-center text-stone-400 text-xs">
                  <span className="material-symbols-outlined text-4xl mb-2 text-stone-300">timeline</span>
                  <p>No se encontraron datos de reservas en este rango de fechas.</p>
                </div>
              ) : (
                <div className="relative">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-56 overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="timelineGoldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C29B38" stopOpacity="0.45" />
                        <stop offset="60%" stopColor="#C29B38" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#C29B38" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C29B38" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {[0, 0.33, 0.66, 1].map((ratio, i) => {
                      const yPos = chartPadding.top + innerHeight - ratio * innerHeight;
                      const val = Math.round(ratio * timelineMax);
                      return (
                        <g key={i}>
                          <line
                            x1={chartPadding.left}
                            y1={yPos}
                            x2={chartWidth - chartPadding.right}
                            y2={yPos}
                            stroke="#E7E5E4"
                            strokeDasharray={i === 0 ? "none" : "3 3"}
                            strokeWidth="1"
                          />
                          <text
                            x={chartPadding.left - 8}
                            y={yPos + 4}
                            textAnchor="end"
                            fontSize="9"
                            fill="#78716C"
                            fontWeight="500"
                          >
                            {timelineMetric === "revenue" ? `$${val.toLocaleString("es-MX")}` : val}
                          </text>
                        </g>
                      );
                    })}

                    {areaPath && (
                      <path d={areaPath} fill="url(#timelineGoldGradient)" className="transition-all duration-300" />
                    )}

                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#C29B38"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#glowEffect)"
                        className="transition-all duration-300"
                      />
                    )}

                    {hoveredPointIndex !== null && chartPoints[hoveredPointIndex] && (
                      <g>
                        <line
                          x1={chartPoints[hoveredPointIndex].x}
                          y1={chartPadding.top}
                          x2={chartPoints[hoveredPointIndex].x}
                          y2={chartPadding.top + innerHeight}
                          stroke="#8C4723"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      </g>
                    )}

                    {chartPoints.map((pt, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      return (
                        <g key={idx} className="cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? "6" : "3.5"}
                            fill={isHovered ? "#8C4723" : "#C29B38"}
                            stroke="#FFFFFF"
                            strokeWidth={isHovered ? "2.5" : "1.5"}
                            className="transition-all duration-150"
                          />
                          <rect
                            x={pt.x - 14}
                            y={chartPadding.top}
                            width="28"
                            height={innerHeight}
                            fill="transparent"
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {hoveredPointIndex !== null && chartPoints[hoveredPointIndex] && (() => {
                    const pt = chartPoints[hoveredPointIndex];
                    const d = pt.data;
                    return (
                      <div
                        className="absolute z-20 pointer-events-none bg-[#1A2624]/95 text-white p-3 rounded-xl shadow-2xl border border-[#C29B38]/40 backdrop-blur-md text-xs transform -translate-x-1/2 -translate-y-full mb-3"
                        style={{
                          left: `${(pt.x / chartWidth) * 100}%`,
                          top: `${(pt.y / chartHeight) * 100}%`,
                        }}
                      >
                        <div className="font-bold text-[#E0C068] text-[11px] pb-1 border-b border-white/10">
                          {d.dateStr}
                        </div>
                        <div className="mt-1.5 space-y-0.5">
                          <div className="font-bold text-sm text-white">
                            {timelineMetric === "revenue"
                              ? formatMXN(d.revenue)
                              : timelineMetric === "pax"
                              ? `${d.pax} Asistentes`
                              : `${d.bookings} Reservas`}
                          </div>
                          <div className="text-[10px] text-stone-300">
                            Total generado: {formatMXN(d.revenue)} • {d.pax} pax
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Pills at Bottom of Timeline */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Días Evaluados</span>
              <strong className="text-stone-900 font-bold text-sm">{timelineData.length}</strong>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Promedio Diario</span>
              <strong className="text-stone-900 font-bold text-sm">
                {timelineData.length > 0
                  ? formatMXN(Math.round(totalRevenue / timelineData.length))
                  : "$0"}
              </strong>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Pax / Día Prom.</span>
              <strong className="text-stone-900 font-bold text-sm">
                {timelineData.length > 0
                  ? (totalTourPax / timelineData.length).toFixed(1)
                  : "0"}
              </strong>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Día Más Fuerte</span>
              <strong className="text-stone-900 font-bold text-sm">{dayOfWeekStats.peakDayName}</strong>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Tour Más Vendido & Mix de Experiencias */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Mix & Tour Más Vendido
                </h3>
                <p className="text-xs text-stone-500">Distribución de demanda por experiencia</p>
              </div>

              <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setDonutMetric("revenue")}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    donutMetric === "revenue" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                  }`}
                >
                  Ingresos
                </button>
                <button
                  onClick={() => setDonutMetric("pax")}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    donutMetric === "pax" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                  }`}
                >
                  Asistentes
                </button>
              </div>
            </div>

            {/* Donut Chart Visual */}
            <div className="mt-4 flex flex-col items-center justify-center relative">
              <svg width="170" height="170" viewBox="0 0 170 170" className="transform -rotate-90">
                <circle
                  cx="85"
                  cy="85"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#F5F5F4"
                  strokeWidth={donutStrokeWidth}
                />
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.key}
                    cx="85"
                    cy="85"
                    r={donutRadius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={donutStrokeWidth}
                    strokeDasharray={`${slice.strokeLength} ${donutCircumference}`}
                    strokeDashoffset={-slice.strokeOffset}
                    transform={`rotate(${slice.rotation} 85 85)`}
                    className="transition-all duration-500 hover:opacity-85 cursor-pointer"
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-stone-400">Total</span>
                <span className="text-base font-bold font-serif text-stone-900">
                  {donutMetric === "revenue" ? formatMXN(totalRevenue) : `${totalTourPax} pax`}
                </span>
                <span className="text-[10px] text-[#C29B38] font-bold">100%</span>
              </div>
            </div>

            {/* Breakdown Cards with Winner Highlight */}
            <div className="mt-5 space-y-2.5">
              {[
                { ...expBreakdown.diamante, badge: "Diamante $1,500" },
                { ...expBreakdown.platino, badge: "Platino $750" },
                { ...expBreakdown.oro, badge: "Oro $550" },
              ].map((item) => {
                const isWinner = item.key === topTour.key;
                return (
                  <div
                    key={item.key}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isWinner
                        ? "bg-amber-50/40 border-[#C29B38]/60 shadow-xs"
                        : "border-stone-100 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 block">{item.name}</span>
                          {isWinner && (
                            <span className="bg-[#C29B38] text-white font-bold text-[9px] uppercase px-1.5 py-0.2 rounded-full">
                              Top #1
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {item.pax} pax • {item.count} compras
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900 block">
                        {formatMXN(item.revenue)}
                      </span>
                      <span className="text-[10px] font-bold text-stone-500">
                        {donutMetric === "revenue" ? `${item.revPct}%` : `${item.paxPct}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <button
              onClick={() => {
                setActiveTableTab("tours");
                setTablePage(1);
              }}
              className="text-xs font-bold text-[#8C4723] hover:text-[#a35329] flex items-center justify-center gap-1 cursor-pointer w-full py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <span>Ver todas las reservas en la tabla inferior</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. SUITE DE GRÁFICOS VISUALES (ROW 2: AFLUENCIA X DÍA, VISITANTES X HORARIO & CAPTACIÓN)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Col 1 (4 cols): Afluencia x Día de la Semana */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-blue-600">calendar_today</span>
                  <span>Afluencia x Día de la Semana</span>
                </h3>
                <p className="text-xs text-stone-500">Distribución de visitantes en cada día de la semana</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {dayOfWeekStats.days.map((d, idx) => {
                const isPeak = d.fullName === dayOfWeekStats.peakDayName;
                const ratio = dayOfWeekStats.maxDayPax > 0 ? (d.pax / dayOfWeekStats.maxDayPax) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                        {d.fullName}
                        {isPeak && (
                          <span className="bg-[#C29B38]/20 text-[#8C4723] text-[9px] uppercase font-bold px-1.5 py-0.2 rounded">
                            Día Pico
                          </span>
                        )}
                      </span>
                      <span className="text-stone-900 font-bold">
                        {d.pax} pax <span className="text-stone-400 font-normal">({formatMXN(d.revenue)})</span>
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPeak ? "bg-[#C29B38]" : "bg-stone-400"
                        }`}
                        style={{ width: `${Math.max(5, ratio)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Día con mayor afluencia:</span>
            <strong className="text-stone-900 font-bold">{dayOfWeekStats.peakDayName} ({dayOfWeekStats.peakDayPax} pax)</strong>
          </div>
        </div>

        {/* Col 2 (4 cols): Visitantes x Horario de Tours */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-600">schedule</span>
                  <span>Visitantes x Horario de Tours</span>
                </h3>
                <p className="text-xs text-stone-500">Demanda por turno programado en la destilería</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              {timeSlotStats.slots.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  Sin registros de turnos en el período.
                </div>
              ) : (
                timeSlotStats.slots.map((s, idx) => {
                  const ratio = Math.round((s.pax / timeSlotStats.maxPax) * 100);
                  const isTopSlot = s.time === timeSlotStats.peakSlot;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-stone-400">alarm</span>
                          {s.time}
                          {isTopSlot && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded">
                              Turno Pico
                            </span>
                          )}
                        </span>
                        <span className="font-bold text-emerald-800">{s.pax} asistentes</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(8, ratio)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Aforo Máximo General:</span>
            <strong className="text-stone-900 font-bold">{maxCapacityLimit} pax / sesión</strong>
          </div>
        </div>

        {/* Col 3 (4 cols): Inscritos al Newsletter & Origen de Leads */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-purple-600">campaign</span>
                <span>Inscritos Newsletter & Canales</span>
              </h3>
              <p className="text-xs text-stone-500">Comportamiento de captura y retención de audiencia</p>
            </div>

            <div className="mt-4 space-y-3">
              {/* Newsletter Highlight */}
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Total Nuevos Inscritos</span>
                    <span className="text-[10px] text-stone-500">
                      {subscriberSources.length > 0 ? `Canal principal: ${subscriberSources[0].source}` : "En el período"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                    {totalNewSubscribers} suscriptores
                  </span>
                  <div className="text-[10px] text-stone-400 mt-0.5">{retentionRate}% activos</div>
                </div>
              </div>

              {/* Source breakdown bars */}
              {subscriberSources.slice(0, 3).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-medium">{item.source}</span>
                    <span className="text-stone-900 font-bold">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, item.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTableTab("newsletter");
                setTablePage(1);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">mark_email_read</span>
              <span>Ver Lista de Newsletter</span>
            </button>
            <button
              onClick={() => {
                setActiveTableTab("maquila");
                setTablePage(1);
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">business_center</span>
              <span>Leads B2B</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. TABLA MULTI-ENTIDAD (TOURS / NEWSLETTER / RESTAURANTE / MAQUILA)
         ========================================================================= */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Tab Selector Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "tours", label: "Reservas de Tours", count: filteredTourBookings.length, icon: "confirmation_number" },
              { id: "newsletter", label: "Inscritos al Newsletter", count: filteredSubscribers.length, icon: "mark_email_read" },
              { id: "restaurant", label: "Mesas Reservas Nativo", count: filteredRestBookings.length, icon: "restaurant" },
              { id: "maquila", label: "Leads Maquilas B2B", count: filteredMaquilaLeads.length, icon: "business_center" },
            ].map((tab) => {
              const isActive = activeTableTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTableTab(tab.id);
                    setTableSearch("");
                    setTablePage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1A2624] text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-[#C29B38] text-stone-950 font-bold" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder={
                  activeTableTab === "newsletter"
                    ? "Buscar correo o página..."
                    : activeTableTab === "maquila"
                    ? "Buscar empresa o contacto..."
                    : "Buscar código o cliente..."
                }
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setTablePage(1);
                }}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#C29B38] w-48 sm:w-56"
              />
            </div>

            {/* Tours Filters */}
            {activeTableTab === "tours" && (
              <>
                <select
                  value={tableExpFilter}
                  onChange={(e) => {
                    setTableExpFilter(e.target.value);
                    setTablePage(1);
                  }}
                  className="py-1.5 px-3 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none font-semibold text-stone-700 cursor-pointer"
                >
                  <option value="all">Todas las Experiencias</option>
                  <option value="oro">Recorrido Oro ($550)</option>
                  <option value="platino">Recorrido Platino ($750)</option>
                  <option value="diamante">Recorrido Diamante ($1,500)</option>
                </select>

                <select
                  value={tableStatusFilter}
                  onChange={(e) => {
                    setTableStatusFilter(e.target.value);
                    setTablePage(1);
                  }}
                  className="py-1.5 px-3 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none font-semibold text-stone-700 cursor-pointer"
                >
                  <option value="all">Todos los Estatus</option>
                  <option value="confirmed">Confirmadas / Pagadas</option>
                  <option value="abandoned">Carritos / Pendientes</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </>
            )}

            {/* Newsletter Filters */}
            {activeTableTab === "newsletter" && (
              <select
                value={tableStatusFilter}
                onChange={(e) => {
                  setTableStatusFilter(e.target.value);
                  setTablePage(1);
                }}
                className="py-1.5 px-3 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none font-semibold text-stone-700 cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="unsubscribed">Desuscritos</option>
              </select>
            )}

            {/* Quick CSV Export for Active Tab */}
            <button
              onClick={() => handleExportCSV(activeTableTab)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Descargar datos filtrados de esta pestaña en CSV"
            >
              <span className="material-symbols-outlined text-xs">download</span>
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Content */}
        {paginatedData.length === 0 ? (
          <div className="py-16 text-center text-stone-400 space-y-3">
            <span className="material-symbols-outlined text-4xl text-stone-300">search_off</span>
            <p className="text-xs">No se encontraron registros para los filtros seleccionados en este período.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* VIEW A: NEWSLETTER SUBSCRIBERS TABLE */}
            {activeTableTab === "newsletter" && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Folio</th>
                    <th className="py-3 px-4">Correo Electrónico</th>
                    <th className="py-3 px-4">Página / Origen de Registro</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                    <th className="py-3 px-4 text-center">Boletín Mensual</th>
                    <th className="py-3 px-4 text-center">Email Bienvenida</th>
                    <th className="py-3 px-4 text-right">Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedData.map((s, idx) => {
                    const isActive = s.status === "active" || !s.status;
                    return (
                      <tr key={s.id || idx} className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-500">
                          {s.id ? `#${String(s.id).slice(0, 8)}` : `#${idx + 1}`}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-purple-600">mail</span>
                            <span>{s.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            {s.source_page || "General Web"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-stone-100 text-stone-500 border border-stone-200"
                            }`}
                          >
                            {isActive ? "Activo" : "Desuscrito"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-stone-700">
                          {s.monthly_newsletter ? "SÍ" : "NO"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {s.welcome_email_sent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="material-symbols-outlined text-xs">done_all</span>
                              Enviado
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">Pendiente</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-stone-600 font-mono text-[11px]">
                          {s.created_at ? new Date(s.created_at).toLocaleString("es-MX") : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* VIEW B: TOURS RESERVATIONS TABLE */}
            {activeTableTab === "tours" && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Folio / Código</th>
                    <th className="py-3 px-4">Titular</th>
                    <th className="py-3 px-4">Experiencia</th>
                    <th className="py-3 px-4 text-center">Pax</th>
                    <th className="py-3 px-4">Fecha & Turno</th>
                    <th className="py-3 px-4 text-right">Importe</th>
                    <th className="py-3 px-4 text-center">Estatus Pago</th>
                    <th className="py-3 px-4 text-center">Factura SAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedData.map((b, idx) => {
                    const isConfirmed = isBookingConfirmed(b);
                    const isAbandoned = isBookingAbandoned(b);
                    const expKey = getTourTypeKey(b);
                    const expConf = EXP_CONFIG[expKey] || EXP_CONFIG.oro;
                    const hasSat = b.cfdi_requested || b.requires_invoice || b.invoice_status === "issued";

                    return (
                      <tr key={b.id || b.code || idx} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#8C4723]">
                          {b.code || b.ticket_code || `#${idx + 1}`}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {b.name || b.customer_name || "Cliente General"}
                          {b.email && (
                            <div className="text-[10px] font-normal text-stone-400">{b.email}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${expConf.accentBg}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: expConf.color }}
                            />
                            {b.packageName || expConf.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-stone-800">
                          {b.guests || 1}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          <div className="font-semibold">{b.date || "Fecha no esp."}</div>
                          <div className="text-[10px] text-stone-400">{b.time || "11:00 AM"}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-stone-900">
                          {formatMXN(getBookingRevenue(b))}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isConfirmed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isAbandoned
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-stone-100 text-stone-600 border border-stone-200"
                            }`}
                          >
                            {isConfirmed ? "Pagado" : isAbandoned ? "Carrito Abandonado" : b.status || "Pendiente"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {hasSat ? (
                            <span className="text-[10px] font-bold text-[#8C4723] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              CFDI 4.0
                            </span>
                          ) : (
                            <span className="text-stone-300 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* VIEW C: RESTAURANT BOOKINGS TABLE */}
            {activeTableTab === "restaurant" && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Código Mesa</th>
                    <th className="py-3 px-4">Titular</th>
                    <th className="py-3 px-4">Teléfono</th>
                    <th className="py-3 px-4 text-center">Comensales</th>
                    <th className="py-3 px-4">Fecha & Hora</th>
                    <th className="py-3 px-4">Motivo / Celebración</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedData.map((r, idx) => (
                    <tr key={r.id || r.code || idx} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {r.code || `#${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {r.customer_name || r.name || "Cliente"}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{r.customer_phone || r.phone || "—"}</td>
                      <td className="py-3 px-4 text-center font-bold text-stone-800">{r.guests || 1}</td>
                      <td className="py-3 px-4 text-stone-600">
                        <div className="font-semibold">{r.date_str || r.date || "Fecha no esp."}</div>
                        <div className="text-[10px] text-stone-400">{r.time_str || r.time || "—"}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{r.reason || r.celebration || "Comida general"}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                          {r.status || "Confirmada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* VIEW D: MAQUILA LEADS TABLE */}
            {activeTableTab === "maquila" && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Folio</th>
                    <th className="py-3 px-4">Contacto</th>
                    <th className="py-3 px-4">Empresa</th>
                    <th className="py-3 px-4">Email / Teléfono</th>
                    <th className="py-3 px-4">Solución</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                    <th className="py-3 px-4 text-right">Fecha Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedData.map((m, idx) => (
                    <tr key={m.id || idx} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-500">#{m.id || idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{m.name || "Sin nombre"}</td>
                      <td className="py-3 px-4 font-semibold text-stone-800">{m.company || "Particular"}</td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{m.email || "—"}</div>
                        <div className="text-[10px] text-stone-400">
                          {m.lada ? `(${m.lada}) ` : ""}
                          {m.phone || ""}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {m.solution || "Marca Privada"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-200">
                          {m.stage || m.status || "Nuevo"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-stone-500 font-mono text-[11px]">
                        {m.created_at ? normalizeDateStr(m.created_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Table Pagination */}
        {totalTablePages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Página {tablePage} de {totalTablePages} ({searchedData.length} registros en esta vista)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={tablePage === 1}
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                disabled={tablePage === totalTablePages}
                onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
