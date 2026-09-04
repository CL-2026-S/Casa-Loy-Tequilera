import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MexicoFlag = ({ active }) => (
  <svg
    viewBox="0 0 60 60"
    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-500 cursor-pointer ${
      active
        ? "border-primary scale-105 shadow-[0_4px_12px_rgba(125,63,15,0.25)] opacity-100 grayscale-0"
        : "border-outline-variant/30 opacity-50 grayscale hover:opacity-85 hover:grayscale-[30%] hover:scale-[1.02]"
    }`}
  >
    <g>
      <rect width="20" height="60" fill="#006847" />
      <rect x="20" width="20" height="60" fill="#FFFFFF" />
      <rect x="40" width="20" height="60" fill="#D21034" />
      {/* Eagle silhouette */}
      <circle cx="30" cy="30" r="4.5" fill="#B08D3E" />
      <path d="M30,24 C28.5,26.5 28.5,31.5 30,34 C31.5,31.5 31.5,26.5 30,24 Z" fill="#7D3F0F" opacity="0.85" />
    </g>
  </svg>
);

const USAFlag = ({ active }) => (
  <svg
    viewBox="0 0 60 60"
    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-500 cursor-pointer ${
      active
        ? "border-primary scale-105 shadow-[0_4px_12px_rgba(125,63,15,0.25)] opacity-100 grayscale-0"
        : "border-outline-variant/30 opacity-50 grayscale hover:opacity-85 hover:grayscale-[30%] hover:scale-[1.02]"
    }`}
  >
    <g>
      <rect width="60" height="4.6" fill="#B22234" />
      <rect y="4.6" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="9.2" width="60" height="4.6" fill="#B22234" />
      <rect y="13.8" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="18.4" width="60" height="4.6" fill="#B22234" />
      <rect y="23" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="27.6" width="60" height="4.6" fill="#B22234" />
      <rect y="32.2" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="36.8" width="60" height="4.6" fill="#B22234" />
      <rect y="41.4" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="46" width="60" height="4.6" fill="#B22234" />
      <rect y="50.6" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="55.2" width="60" height="4.8" fill="#B22234" />
      <rect width="32" height="32.2" fill="#3C3B6E" />
      <circle cx="6" cy="6" r="1.2" fill="#FFFFFF" />
      <circle cx="16" cy="6" r="1.2" fill="#FFFFFF" />
      <circle cx="26" cy="6" r="1.2" fill="#FFFFFF" />
      <circle cx="11" cy="12" r="1.2" fill="#FFFFFF" />
      <circle cx="21" cy="12" r="1.2" fill="#FFFFFF" />
      <circle cx="6" cy="18" r="1.2" fill="#FFFFFF" />
      <circle cx="16" cy="18" r="1.2" fill="#FFFFFF" />
      <circle cx="26" cy="18" r="1.2" fill="#FFFFFF" />
      <circle cx="11" cy="24" r="1.2" fill="#FFFFFF" />
      <circle cx="21" cy="24" r="1.2" fill="#FFFFFF" />
    </g>
  </svg>
);

// Distance calculation using Haversine formula
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function WhereToBuy({ lang, country }) {
  const [region, setRegion] = useState(() => (country === "usa" ? "usa" : "mx"));
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  
  // Dynamic collapsable filters visibility
  const [showFilters, setShowFilters] = useState(false);

  // Geolocator and map states
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef([]);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceSorted, setDistanceSorted] = useState(false);
  const [filterByMap, setFilterByMap] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);

  // Alliances Form states
  const [isAlliancesFormOpen, setIsAlliancesFormOpen] = useState(false);
  const [alliancesForm, setAlliancesForm] = useState({
    name: "",
    company: "",
    email: "",
    lada: "52",
    phone: "",
    market: "",
    message: ""
  });
  const [alliancesStatus, setAlliancesStatus] = useState("idle"); // idle | loading | success | error
  const [alliancesError, setAlliancesError] = useState("");

  const handleAlliancesSubmit = async (e) => {
    e.preventDefault();
    const { name, company, email, lada, phone, market } = alliancesForm;

    if (!name || !company || !email || !lada || !phone || !market) {
      setAlliancesError(lang === "es" ? "Por favor completa todos los campos obligatorios." : "Please fill out all required fields.");
      return;
    }

    setAlliancesStatus("loading");
    setAlliancesError("");

    try {
      const response = await fetch("/api/alliances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alliancesForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlliancesStatus("success");
      } else {
        setAlliancesStatus("error");
        setAlliancesError(data.error || (lang === "es" ? "Hubo un error del servidor. Inténtalo más tarde." : "Server error. Please try again later."));
      }
    } catch (err) {
      console.error("Error submitting alliances form:", err);
      setAlliancesStatus("error");
      setAlliancesError(lang === "es" ? "Error de conexión. Verifica tu internet." : "Connection error. Please check your internet.");
    }
  };

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const userMarkerRef = useRef(null);

  const typeOptions = [
    { id: "pdv", name: lang === "es" ? "Punto de Venta" : "Retail Store" },
    { id: "cdc", name: lang === "es" ? "Centro de Consumo" : "Restaurant / Bar" },
  ];

  const brandOptions = [
    { id: "casa-loy", code: "CL", name: "Casa Loy" },
    { id: "taddel", code: "TD", name: "TADDEL" },
    { id: "tierra-zafiro", code: "TZ", name: "Tierra Zafiro" },
  ];

  const brandCategories = {
    "casa-loy": [
      "Blanco",
      "Reposado",
      "Cristalino",
      "Añejo",
      "Piedra y Agave Blanco",
      "Piedra y Agave Reposado",
    ],
    "taddel": ["Plata", "Reposado", "Cristalino"],
    "tierra-zafiro": ["Blanco", "Reposado", "Cristalino"],
  };

  const getAvailableCategories = () => {
    if (selectedBrands.length === 0) {
      const all = new Set();
      Object.values(brandCategories).forEach((cats) =>
        cats.forEach((c) => all.add(c))
      );
      return Array.from(all);
    }
    const available = new Set();
    selectedBrands.forEach((b) => {
      const cats = brandCategories[b] || [];
      cats.forEach((c) => available.add(c));
    });
    return Array.from(available);
  };

  const availableCategories = getAvailableCategories();

  const localT = {
    es: {
      overtitle: "Dónde Comprar",
      title: "Puntos de Venta",
      buyOnline: "Compra en Línea",
      physicalStores: "Tiendas Físicas",
      searchPlaceholder: "Buscar por CP o Ciudad",
      viewOnMaps: "VER EN MAPS",
      selected: "SELECCIONADO",
      allianceOvertitle: "Alianzas Comerciales",
      allianceTitle: "Vende nuestros productos",
      allianceDesc:
        "Conviértete en embajador de la herencia y el sabor de Casa Loy. Ofrecemos programas exclusivos para distribuidores y establecimientos de lujo.",
      allianceBtn: "Formulario de Contacto",
      filterTypes: "Tipo de Establecimiento",
      filterBrands: "Filtrar por Marca",
      filterCategories: "Filtrar por Categoría",
      clearFilters: "Limpiar filtros",
      filterByMapLabel: "Filtrar por área visible del mapa",
      distanceLabel: "de distancia",
      selectedMarker: "Seleccionado",
      noMapAvailable: "Sin mapa disponible",
      noStoresFound: "No se encontraron sucursales.",
      alliancesForm: {
        title: "Propuesta de Alianza Comercial",
        desc: "Completa el formulario para que nuestro equipo comercial se ponga en contacto contigo y evaluemos la distribución en tu establecimiento o zona.",
        name: "Nombre Completo",
        company: "Empresa o Establecimiento",
        email: "Correo Electrónico",
        lada: "Lada",
        phone: "Teléfono",
        market: "Mercado / País de Interés",
        marketSelect: "Selecciona el mercado...",
        marketMX: "México",
        marketUSA: "Estados Unidos (USA)",
        marketHK: "Hong Kong",
        marketCO: "Colombia",
        marketGT: "Guatemala",
        marketOther: "Otro / Internacional",
        message: "Mensaje / Descripción del Negocio",
        submit: "ENVIAR SOLICITUD",
        submitting: "ENVIANDO...",
        success: "¡Solicitud Recibida!",
        successDesc: "Muchas gracias por tu interés en Casa Loy. Nuestro equipo comercial revisará tus datos y se comunicará contigo a la brevedad.",
        close: "Cerrar",
        required: "Este campo es requerido.",
        errorTitle: "Hubo un problema al enviar tu solicitud.",
        disclaimer: "Al enviar este formulario aceptas el tratamiento de tus datos conforme a nuestro ",
        privacyLink: "Aviso de Privacidad",
      }
    },
    en: {
      overtitle: "Where to Buy",
      title: "Points of Sale",
      buyOnline: "Buy Online",
      physicalStores: "Physical Stores",
      searchPlaceholder: "Search by ZIP or City",
      viewOnMaps: "VIEW ON MAPS",
      selected: "SELECTED",
      allianceOvertitle: "Commercial Alliances",
      allianceTitle: "Sell our products",
      allianceDesc:
        "Become an ambassador for the heritage and flavor of Casa Loy. We offer exclusive programs for distributors and luxury establishments.",
      allianceBtn: "Contact Form",
      filterTypes: "Establishment Type",
      filterBrands: "Filter by Brand",
      filterCategories: "Filter by Category",
      clearFilters: "Clear filters",
      filterByMapLabel: "Filter by visible map area",
      distanceLabel: "away",
      selectedMarker: "Selected",
      noMapAvailable: "No map link",
      noStoresFound: "No stores found.",
      alliancesForm: {
        title: "Commercial Alliance Proposal",
        desc: "Complete the form for our commercial team to get in touch and evaluate distribution in your establishment or area.",
        name: "Full Name",
        company: "Company or Establishment",
        email: "Email Address",
        lada: "Area Code",
        phone: "Phone Number",
        market: "Target Market / Country",
        marketSelect: "Select target market...",
        marketMX: "Mexico",
        marketUSA: "United States (USA)",
        marketHK: "Hong Kong",
        marketCO: "Colombia",
        marketGT: "Guatemala",
        marketOther: "Other / International",
        message: "Message / Business Description",
        submit: "SEND REQUEST",
        submitting: "SENDING...",
        success: "Request Received!",
        successDesc: "Thank you for your interest in Casa Loy. Our sales team will review your information and get back to you shortly.",
        close: "Close",
        required: "This field is required.",
        errorTitle: "There was a problem sending your request.",
        disclaimer: "By submitting this form you agree to the processing of your data according to our ",
        privacyLink: "Privacy Policy",
      }
    },
  };

  const activeT = localT[lang] || localT["es"];

  // Set mapLoaded to true on mount
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/points-of-sale");
        if (!res.ok) throw new Error("Error loading stores");
        const data = await res.json();
        const parsed = data.map((s, index) => {
          const brands = Array.isArray(s.brands) ? [...s.brands] : [];
          if (s.cl && !brands.includes("casa-loy")) brands.push("casa-loy");
          if (s.td && !brands.includes("taddel")) brands.push("taddel");
          if (s.tz && !brands.includes("tierra-zafiro")) brands.push("tierra-zafiro");
          return {
            ...s,
            id: s.id && s.id.trim() !== "" ? s.id : `pos-${index}-${s.name ? s.name.replace(/\s+/g, '-').toLowerCase() : 'store'}`,
            latitude: s.latitude ? parseFloat(s.latitude) : null,
            longitude: s.longitude ? parseFloat(s.longitude) : null,
            brands,
            categories: s.region === "usa" ? [] : (s.categories || [])
          };
        });
        setStores(parsed);

        const initialStore = parsed.find((s) => region === "all" ? true : s.region === region);
        if (initialStore) {
          setActiveStore(initialStore);
        }
      } catch (err) {
        console.error("Error fetching points of sale:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const initialCenter = region === "usa"
      ? { lat: 37.0902, lng: -95.7129 }
      : (region === "mx" ? { lat: 20.6597, lng: -103.3496 } : { lat: 28.0, lng: -98.0 });
    const initialZoom = region === "usa" ? 4 : (region === "mx" ? 6 : 4);

    const map = L.map(mapContainerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    // OpenStreetMap standard tiles - 100% free, no API key required, highly reliable
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    const updateBounds = () => {
      try {
        if (mapRef.current) {
          const bounds = mapRef.current.getBounds();
          if (bounds) {
            setMapBounds(bounds);
          }
        }
      } catch (err) {}
    };

    map.on("moveend", updateBounds);

    const timer = setTimeout(() => {
      updateBounds();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.off("moveend", updateBounds);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded]);

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setUserLocation(null); // Clear geolocation focus to zoom out to the new region
    setDistanceSorted(false);
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    const firstInRegion = stores.find((s) => newRegion === "all" ? true : s.region === newRegion);
    if (firstInRegion) {
      setActiveStore(firstInRegion);
    } else {
      setActiveStore(null);
    }
  };

  const handleTypeToggle = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId];

      if (region === "mx") {
        const newAvailable =
          next.length === 0
            ? Array.from(new Set(Object.values(brandCategories).flat()))
            : Array.from(new Set(next.flatMap((b) => brandCategories[b] || [])));

        setSelectedCategories((cats) =>
          cats.filter((c) => newAvailable.includes(c))
        );
      } else {
        setSelectedCategories([]);
      }
      return next;
    });
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const [geolocating, setGeolocating] = useState(false);

  // Geolocator button click
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert(
        lang === "es"
          ? "La geolocalización no está soportada por tu navegador."
          : "Geolocation is not supported by your browser."
      );
      return;
    }

    setGeolocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setDistanceSorted(true);

        // Auto-switch region if user is in Mexico or USA
        const inMexico = latitude >= 14 && latitude <= 33 && longitude >= -118 && longitude <= -86;
        const targetRegion = inMexico ? "mx" : "usa";
        if (region !== targetRegion && region !== "all") {
          setRegion(targetRegion);
        }

        // Find closest store in target region
        const candidateStores = stores.filter((s) => (targetRegion === "all" ? true : s.region === targetRegion));
        let closestStore = null;
        let minDistance = Infinity;

        candidateStores.forEach((s) => {
          if (s.latitude && s.longitude) {
            const d = getHaversineDistance(latitude, longitude, s.latitude, s.longitude);
            if (d < minDistance) {
              minDistance = d;
              closestStore = s;
            }
          }
        });

        if (mapRef.current) {
          const map = mapRef.current;
          if (closestStore && closestStore.latitude && closestStore.longitude) {
            setActiveStore(closestStore);
            const fit = L.latLngBounds([
              [latitude, longitude],
              [closestStore.latitude, closestStore.longitude]
            ]);
            map.fitBounds(fit, { padding: [60, 60], maxZoom: 14 });
          } else {
            map.setView([latitude, longitude], 13);
          }
        }

        // Scroll sidebar to top so the nearest store is visible
        const listEl = document.getElementById("stores-scroll-list");
        if (listEl) {
          listEl.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      (err) => {
        setGeolocating(false);
        console.error("Error geolocating:", err);
        alert(
          lang === "es"
            ? "No se pudo obtener tu ubicación. Por favor verifica que tu navegador tenga los permisos de ubicación permitidos."
            : "Could not fetch location. Please ensure location permissions are enabled in your browser."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const zoom = mapRef.current.getZoom();
      if (zoom !== undefined) {
        mapRef.current.setZoom(zoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const zoom = mapRef.current.getZoom();
      if (zoom !== undefined) {
        mapRef.current.setZoom(zoom - 1);
      }
    }
  };

  // Filter criteria before viewport mapping - MEMOIZED to prevent map scroll bounce loops!
  const storesFilteredByCriteria = useMemo(() => {
    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const q = normalize(searchQuery);

    return stores.filter((store) => {
      const matchesRegion = region === "all" ? true : store.region === region;
      if (!matchesRegion) return false;

      const matchesTypes =
        selectedTypes.length > 0
          ? (selectedTypes.includes("pdv") && store.pdv) ||
            (selectedTypes.includes("cdc") && store.cdc)
          : true;
      if (!matchesTypes) return false;

      // Brand filter: check both direct brand flags and brand array
      const matchesBrands =
        selectedBrands.length > 0
          ? selectedBrands.some((brandId) => {
              if (brandId === "casa-loy") return Boolean(store.cl || store.brands?.includes("casa-loy"));
              if (brandId === "taddel") return Boolean(store.td || store.brands?.includes("taddel"));
              if (brandId === "tierra-zafiro") return Boolean(store.tz || store.brands?.includes("tierra-zafiro"));
              return false;
            })
          : true;
      if (!matchesBrands) return false;

      // In USA, categories do not apply (search/filtering is purely by brand).
      // Categories apply only to MX.
      const matchesCategories =
        region === "usa" || store.region === "usa" || selectedCategories.length === 0
          ? true
          : store.categories &&
            store.categories.some((c) => selectedCategories.includes(c));
      if (!matchesCategories) return false;

      // Search input matching store name, retailer, address, city, postal code, brand
      if (q) {
        const storeName = normalize(store.name);
        const storeRetailer = normalize(store.retailer);
        const storeAddress = normalize(store.address);
        const storePostal = normalize(store.postal_code);

        const isBrandMatch =
          (q === "cl" && (store.cl || store.brands?.includes("casa-loy"))) ||
          (q === "td" && (store.td || store.brands?.includes("taddel"))) ||
          (q === "tz" && (store.tz || store.brands?.includes("tierra-zafiro"))) ||
          (q.includes("casa loy") && (store.cl || store.brands?.includes("casa-loy"))) ||
          (q.includes("taddel") && (store.td || store.brands?.includes("taddel"))) ||
          (q.includes("tierra zafiro") && (store.tz || store.brands?.includes("tierra-zafiro")));

        const isTextMatch =
          storeName.includes(q) ||
          storeRetailer.includes(q) ||
          storeAddress.includes(q) ||
          storePostal.includes(q);

        if (!isTextMatch && !isBrandMatch) return false;
      }

      return true;
    });
  }, [stores, region, selectedTypes, searchQuery, selectedBrands, selectedCategories]);

  // Inject straight-line distances in km
  const storesWithDistance = useMemo(() => {
    return storesFilteredByCriteria.map((store) => {
      if (userLocation && store.latitude && store.longitude) {
        const distance = getHaversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        );
        return { ...store, distance };
      }
      return store;
    });
  }, [storesFilteredByCriteria, userLocation]);

  // Sort stores list
  const sortedStores = useMemo(() => {
    const sorted = [...storesWithDistance];
    if (distanceSorted && userLocation) {
      sorted.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }
    return sorted;
  }, [storesWithDistance, distanceSorted, userLocation]);

  // Filter sidebar stores by viewport bounds if checked
  const finalSidebarStores = useMemo(() => {
    return sortedStores.filter((store) => {
      if (filterByMap && mapBounds && store.latitude && store.longitude) {
        return mapBounds.contains({ lat: store.latitude, lng: store.longitude });
      }
      return true;
    });
  }, [sortedStores, filterByMap, mapBounds]);

  // Scroll active store card into view in the sidebar
  useEffect(() => {
    if (activeStore?.id) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`store-card-${activeStore.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeStore]);

  // Update map markers when criteria or user location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);
    let hasCoords = false;

    // Quiet luxury copper color for points of sale (PDV)
    const copperColor = "#C58B58";
    // Elegant dark forest green/slate for centers of consumption (CDC)
    const cdcColor = "#2F403E";

    // Plot stores
    storesFilteredByCriteria.forEach((store) => {
      if (store.latitude && store.longitude) {
        hasCoords = true;
        const position = [store.latitude, store.longitude];
        bounds.extend(position);

        const isTequilera = store.retailer === "Tequilera Casa Loy";
        const isCDC = store.cdc;
        
        const markerColor = isTequilera 
          ? "#7D3F0F" 
          : (isCDC ? cdcColor : copperColor);
          
        let symbolSvg = "";
        
        if (isTequilera) {
          // Stylized Agave plant icon centered in the upper teardrop circle (centered around 12, 9)
          symbolSvg = `
            <g fill="#FFFFFF">
              <!-- Central leaf -->
              <path d="M12 4.5 c-0.3 2 -0.3 5 0 6.5 c0.3 -1.5 0.3 -4.5 0 -6.5z" />
              <!-- Inner left leaf -->
              <path d="M12 11 c-1.2 -1.2 -1.8 -3 -1.8 -4.5 c0.4 1.5 1.2 3 1.8 4.5z" />
              <!-- Outer left leaf -->
              <path d="M12 11 c-1.8 -0.2 -2.8 -1.2 -3.2 -2.5 c1 1 2 1.8 3.2 2.5z" />
              <!-- Inner right leaf -->
              <path d="M12 11 c1.2 -1.2 1.8 -3 1.8 -4.5 c-0.4 1.5 -1.2 3 -1.8 4.5z" />
              <!-- Outer right leaf -->
              <path d="M12 11 c1.8 -0.2 2.8 -1.2 3.2 -2.5 c-1 1 -2 1.8 -3.2 2.5z" />
            </g>
          `;
        } else if (isCDC) {
          // Shot glass (vaso tequilero) symbol centered at (12, 8.5)
          symbolSvg = `
            <path d="M9.5 5.5 h5 l-1 6.5 a1 1 0 0 1 -1 0.8 h-1 a1 1 0 0 1 -1 -0.8 z" fill="#FFFFFF" />
            <line x1="10.5" y1="7.2" x2="11.5" y2="11" stroke="${markerColor}" stroke-width="0.8" />
          `;
        } else {
          // Storefront (tienda) symbol centered at (12, 9.5)
          symbolSvg = `
            <path d="M16 9.5 L12 5.5 L8 9.5 V13.5 H16 V9.5 Z M13 13.5 H11 V10.5 H13 V13.5 Z" fill="#FFFFFF" />
          `;
        }
        
        // Teardrop custom SVG pin in Leaflet
        const iconHtml = `
          <svg viewBox="0 0 24 24" width="30" height="30" style="display: block;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                  fill="${markerColor}" 
                  stroke="#FFFFFF" 
                  stroke-width="1.5" />
            ${symbolSvg}
          </svg>
        `;

        const pinIcon = L.divIcon({
          html: iconHtml,
          className: "custom-store-pin",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        // Compute distance label if user is geolocated
        let distHtml = "";
        if (userLocation) {
          const d = getHaversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            store.latitude,
            store.longitude
          );
          distHtml = `<p style="margin: 0; font-size: 11px; font-weight: bold; color: ${copperColor};">${d.toFixed(
            1
          )} km ${activeT.distanceLabel}</p>`;
        }

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; text-align: left; min-width: 160px;">
            <h4 style="margin: 0 0 2px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${markerColor}; font-weight: bold;">${store.retailer}</h4>
            <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #1f2937;">${store.name}</h3>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #4b5563; line-height: 1.3;">${store.address}</p>
            ${distHtml}
          </div>
        `;

        const marker = L.marker(position, {
          icon: pinIcon,
          title: store.retailer
        }).addTo(map);

        marker.bindPopup(popupContent, {
          className: "custom-leaflet-popup",
          closeButton: false
        });

        marker.on("click", () => {
          setActiveStore(store);
          map.setView(position, 11);
        });

        markersRef.current.push(marker);
      }
    });

    // Plot user
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      const userPosition = [userLocation.latitude, userLocation.longitude];
      
      const userIconHtml = `
        <div style="
          width: 14px; 
          height: 14px; 
          background-color: #3b82f6; 
          border: 2px solid #FFFFFF; 
          border-radius: 50%; 
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        "></div>
      `;

      const userIcon = L.divIcon({
        html: userIconHtml,
        className: "custom-user-pin",
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const userMarker = L.marker(userPosition, {
        icon: userIcon,
        title: lang === "es" ? "Tu ubicación" : "Your location"
      }).addTo(map);

      const userPopupContent = `<strong style="font-family: sans-serif;">${
        lang === "es" ? "Tu ubicación" : "Your location"
      }</strong>`;

      userMarker.bindPopup(userPopupContent, {
        className: "custom-leaflet-popup",
        closeButton: false
      });

      userMarkerRef.current = userMarker;
      bounds.extend(userPosition);
      hasCoords = true;
    }

    if (hasCoords && storesFilteredByCriteria.length > 0) {
      if (!distanceSorted) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    }
  }, [storesFilteredByCriteria, userLocation]);

  // Attempt automatic geolocation on mount once stores are loaded
  useEffect(() => {
    if (stores.length === 0) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setDistanceSorted(true);
        },
        (err) => {
          console.log("Auto-geolocation declined or failed on load:", err);
        }
      );
    }
  }, [stores]);

  const handleStoreClick = (store) => {
    setActiveStore(store);
    if (mapRef.current && store.latitude && store.longitude) {
      const position = [store.latitude, store.longitude];
      mapRef.current.setView(position, 12);

      // Find the corresponding marker and open its popup
      const marker = markersRef.current.find(
        (m) =>
          Math.abs(m.getLatLng().lat - store.latitude) < 0.0001 &&
          Math.abs(m.getLatLng().lng - store.longitude) < 0.0001
      );
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const pulseStyle = `
    .leaflet-container {
      background-color: #EDE7DE !important;
      font-family: inherit;
    }
    .custom-leaflet-popup .leaflet-popup-content-wrapper {
      border-radius: 0px !important;
      padding: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
      background: #ffffff !important;
      border: 1px solid rgba(140, 71, 35, 0.15);
    }
    .custom-leaflet-popup .leaflet-popup-content {
      margin: 0 !important;
      min-width: 160px;
    }
    .custom-leaflet-popup .leaflet-popup-tip {
      background: #ffffff !important;
      box-shadow: none !important;
    }
    .custom-leaflet-popup .leaflet-popup-close-button {
      display: none !important;
    }
  `;

  return (
    <div className="pt-16 bg-background text-on-surface text-left">
      <style>{pulseStyle}</style>

      {/* Hero Section */}
      <header className="max-w-container-max mx-auto px-margin-desktop text-center py-10 md:py-12 animate-fade-in">
        <span className="font-label-caps text-[10px] text-secondary mb-3 block uppercase tracking-[0.3em]">
          {activeT.overtitle}
        </span>
        <h1 className="font-display-hero text-headline-lg-mobile md:text-[64px] md:leading-[72px] text-on-surface mb-6">
          {activeT.title}
        </h1>

        {/* Region Toggle Tab */}
        <div className="flex justify-center items-center gap-8 w-fit mx-auto select-none pb-2">
          {/* Todos / All */}
          <button
            type="button"
            onClick={() => handleRegionChange("all")}
            className="flex flex-col items-center gap-2 group focus:outline-none transition-transform active:scale-95 cursor-pointer"
            aria-label={lang === "es" ? "Todos" : "All"}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
              region === "all"
                ? "bg-primary border-primary text-white shadow-sm"
                : "border-outline-variant/30 group-hover:border-primary/50 text-on-surface-variant/40 group-hover:text-primary bg-white"
            }`}>
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <span
              className={`font-navigation text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                region === "all"
                  ? "text-primary font-bold"
                  : "text-on-surface-variant/40 group-hover:text-primary"
              }`}
            >
              {lang === "es" ? "Todos" : "All"}
            </span>
          </button>

          <div className="h-10 w-[0.5px] bg-outline-variant/30 self-start mt-1"></div>

          {/* México */}
          <button
            type="button"
            onClick={() => handleRegionChange("mx")}
            className="flex flex-col items-center gap-2 group focus:outline-none transition-transform active:scale-95 cursor-pointer"
            aria-label="México"
          >
            <MexicoFlag active={region === "mx"} />
            <span
              className={`font-navigation text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                region === "mx"
                  ? "text-primary font-bold"
                  : "text-on-surface-variant/40 group-hover:text-primary"
              }`}
            >
              México
            </span>
          </button>

          <div className="h-10 w-[0.5px] bg-outline-variant/30 self-start mt-1"></div>

          {/* USA */}
          <button
            type="button"
            onClick={() => handleRegionChange("usa")}
            className="flex flex-col items-center gap-2 group focus:outline-none transition-transform active:scale-95 cursor-pointer"
            aria-label="USA"
          >
            <USAFlag active={region === "usa"} />
            <span
              className={`font-navigation text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                region === "usa"
                  ? "text-primary font-bold"
                  : "text-on-surface-variant/40 group-hover:text-primary"
              }`}
            >
              USA
            </span>
          </button>
        </div>
      </header>

      {/* Online Retailers */}
      {(region === "mx" || region === "all") && (

        <section className="max-w-container-max mx-auto px-margin-desktop mb-20 animate-fade-in">
          <h2 className="font-headline-md text-headline-md text-2xl md:text-3xl font-bold mb-6 text-center">
            {activeT.buyOnline}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center">
            <a
              className="group relative w-full h-44 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm px-6"
              href="https://www.mercadolibre.com.mx/tienda/casa-loy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Mercado_Libre_Logotipo.webp"
                alt="Mercado Libre"
                className="w-[70%] max-h-[65%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
              />
            </a>
            <a
              className="group relative w-full h-44 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm px-6"
              href="https://www.liverpool.com.mx/tienda/sp/casa-loy-tequilera"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Liverpool_Logotipo.webp"
                alt="Liverpool"
                className="w-[70%] max-h-[65%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
              />
            </a>
            <a
              className="group relative w-full h-44 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm px-6"
              href="https://www.amazon.com.mx/s?me=A3UB51BZY3LWTE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Amazon_Logotipo.webp"
                alt="Amazon"
                className="w-[70%] max-h-[65%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
              />
            </a>
          </div>
        </section>
      )}

      {/* Physical Store Locations & Map */}
      <section className="max-w-container-max mx-auto px-margin-desktop mb-20 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar list panel */}
          <div className="lg:w-1/3 flex flex-col h-[580px]">
            <div className="flex justify-between items-end mb-3">
              <h2 className="font-headline-md text-headline-md text-2xl font-bold">
                {activeT.physicalStores}
              </h2>
              <span className="text-[10px] text-on-surface-variant/60 font-semibold">
                {finalSidebarStores.length} {lang === "es" ? "tiendas" : "stores"}
              </span>
            </div>

            {/* Dedicated Search Input: allows typing store name, retailer, city or postal code */}
            <div className="relative mb-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[18px]">
                search
              </span>
              <input
                className="w-full bg-white border border-outline-variant/30 pl-10 pr-9 py-2.5 text-xs focus:outline-none focus:border-primary transition-all duration-300 shadow-sm placeholder:text-on-surface-variant/45 font-sans"
                placeholder={
                  lang === "es"
                    ? (region === "usa" ? "Buscar por nombre de tienda, cadena, ciudad o ZIP..." : "Buscar por nombre de tienda, cadena, ciudad o CP...")
                    : (region === "usa" ? "Search by store name, chain, city or ZIP..." : "Search by store name, chain, city or postal code...")
                }
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer text-[16px]"
                  title={lang === "es" ? "Limpiar búsqueda" : "Clear search"}
                >
                  close
                </button>
              )}
            </div>

            {/* Actions: Geolocator & Filters Toggle */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={geolocating}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#C58B58] text-white hover:bg-[#A66C3E] disabled:opacity-75 font-label-caps text-[9px] tracking-widest font-bold py-2.5 px-3 shadow-sm transition-all active:scale-98 duration-300 cursor-pointer"
                title={lang === "es" ? "Buscar tiendas cercanas a tu ubicación actual" : "Find stores near your current location"}
              >
                <span className={`material-symbols-outlined text-[15px] ${geolocating ? "animate-spin" : ""}`}>
                  {geolocating ? "progress_activity" : "my_location"}
                </span>
                <span>
                  {geolocating 
                    ? (lang === "es" ? "LOCALIZANDO..." : "LOCATING...") 
                    : (lang === "es" ? "CERCA DE MÍ" : "NEAR ME")}
                </span>
              </button>

              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 border transition-all duration-300 font-label-caps text-[9px] tracking-widest font-bold select-none cursor-pointer shadow-sm ${
                  showFilters || selectedTypes.length > 0 || selectedBrands.length > 0 || selectedCategories.length > 0
                    ? "bg-stone-100 border-primary/50 text-primary"
                    : "bg-white border-outline-variant/30 hover:border-primary/50 text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>{lang === "es" ? "FILTROS" : "FILTERS"}</span>
                {(selectedTypes.length > 0 || selectedBrands.length > 0 || selectedCategories.length > 0) && (
                  <span className="bg-primary text-white text-[8px] px-1.5 py-0.2 rounded-full font-bold">
                    {selectedTypes.length + selectedBrands.length + selectedCategories.length}
                  </span>
                )}
                <span 
                  className="material-symbols-outlined text-[15px] transition-transform duration-300"
                  style={{ transform: showFilters ? 'rotate(180deg)' : 'none' }}
                >
                  keyboard_arrow_down
                </span>
              </button>
            </div>

            {/* Toggle Map Viewport Filtering */}
            <div className="flex items-center gap-2 mb-2.5 select-none">
              <input
                type="checkbox"
                id="filter-by-map-checkbox"
                checked={filterByMap}
                onChange={(e) => setFilterByMap(e.target.checked)}
                className="accent-primary w-3.5 h-3.5 border-outline-variant/50 rounded focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="filter-by-map-checkbox"
                className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant/60 cursor-pointer"
              >
                {activeT.filterByMapLabel}
              </label>
            </div>

            {/* Dynamic Filter Panel */}
            {showFilters && (
              <div className="bg-white/90 border border-outline-variant/20 p-3.5 mb-3 space-y-3.5 animate-fade-in shadow-sm">
                
                {/* Filter pills for Establishment Types */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant/50">
                      {activeT.filterTypes}
                    </span>
                    {(selectedTypes.length > 0 ||
                      selectedBrands.length > 0 ||
                      selectedCategories.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTypes([]);
                          setSelectedBrands([]);
                          setSelectedCategories([]);
                        }}
                        className="text-[9px] uppercase font-bold tracking-wider text-primary hover:underline cursor-pointer"
                      >
                        {activeT.clearFilters}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {typeOptions.map((type) => {
                      const isSelected = selectedTypes.includes(type.id);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleTypeToggle(type.id)}
                          className={`text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-all duration-300 font-bold cursor-pointer ${
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : "border-outline-variant/30 hover:border-primary/50 text-on-surface-variant/75 bg-white"
                          }`}
                        >
                          {type.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter pills for Brands (Casa Loy, TADDEL, Tierra Zafiro) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant/60 block">
                      {region === "usa" ? (lang === "es" ? "Búsqueda por Marca (USA)" : "Search by Brand (USA)") : activeT.filterBrands}
                    </span>
                    {region === "usa" && (
                      <span className="text-[8px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        Solo Marcas
                      </span>
                    )}
                  </div>

                  {region === "usa" && (
                    <p className="text-[10px] text-on-surface-variant/70 mb-2 leading-tight">
                      {lang === "es"
                        ? "En EE. UU. los puntos de venta se consultan por marca. Selecciona una marca para ver sus tiendas:"
                        : "In USA points of sale are searched by brand. Select a brand to view stores:"}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {brandOptions.map((brand) => {
                      const isSelected = selectedBrands.includes(brand.id);
                      return (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => handleBrandToggle(brand.id)}
                          className={`text-[9px] uppercase tracking-widest px-2.5 py-1.5 border transition-all duration-300 font-bold cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "border-outline-variant/30 hover:border-primary/50 text-on-surface-variant/85 bg-white"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'}`}>
                            {brand.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter pills for Categories (ONLY FOR MEXICO - strictly hidden in USA) */}
                {region === "mx" && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant/60 block">
                        {activeT.filterCategories}
                      </span>
                      {selectedCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedCategories([])}
                          className="text-[8px] text-primary hover:underline cursor-pointer uppercase font-bold"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {availableCategories.map((category) => {
                        const isSelected = selectedCategories.includes(category);
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryToggle(category)}
                            className={`text-[9px] px-2 py-1 border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "bg-primary border-primary text-white font-bold"
                                : "border-outline-variant/20 hover:border-primary/30 text-on-surface-variant/70 bg-white"
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Scroll list wrapper */}
            <div id="stores-scroll-list" className="flex-1 overflow-y-auto pr-2 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant/60">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="text-sm font-light">
                    Cargando puntos de venta...
                  </span>
                </div>
              ) : finalSidebarStores.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant/50 text-sm font-light italic">
                  {activeT.noStoresFound}
                </div>
              ) : (
                finalSidebarStores.map((store) => {
                  const isSelected = activeStore && activeStore.id === store.id;
                  
                  if (!isSelected) {
                    // Collapsed minimalist list row
                    return (
                      <div
                        key={store.id || store.name}
                        id={`store-card-${store.id}`}
                        onClick={() => handleStoreClick(store)}
                        className="p-3 border-l-4 border-l-primary/10 bg-white/50 hover:border-l-primary/50 hover:bg-white transition-all duration-300 cursor-pointer flex justify-between items-center text-left shadow-sm"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <span className="font-label-caps text-primary text-[9px] tracking-widest font-bold mr-2">
                            {store.retailer}
                          </span>
                          <span className="text-[11px] font-semibold text-on-surface block sm:inline">
                            {store.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStoreClick(store);
                          }}
                          className="flex-shrink-0 text-[8px] font-label-caps tracking-widest text-[#C58B58] border border-[#C58B58]/20 px-2 py-0.5 hover:bg-[#C58B58] hover:text-white transition-all duration-300 font-bold cursor-pointer"
                        >
                          {lang === "es" ? "VER" : "VIEW"}
                        </button>
                      </div>
                    );
                  }
                  
                  // Expanded details card when selected
                  return (
                    <div
                      key={store.id || store.name}
                      id={`store-card-${store.id}`}
                      onClick={() => handleStoreClick(store)}
                      className="p-5 border-l-4 border-l-primary bg-white shadow-md transition-all duration-300 text-left"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant/50 border border-outline-variant/20 px-1.5 py-0.5 bg-white">
                          {store.pdv 
                            ? (lang === "es" ? "Punto de Venta" : "Retail Store") 
                            : (lang === "es" ? "Centro de Consumo" : "Restaurant/Bar")}
                        </span>
                        {store.distance !== undefined && (
                          <span className="text-[8px] bg-[#C58B58]/15 text-[#C58B58] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                            {store.distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-label-caps text-primary text-[10px] tracking-widest font-bold mb-0.5">
                        {store.retailer}
                      </h4>
                      <h3 className="font-headline-md text-[17px] font-semibold mb-1">
                        {store.name}
                      </h3>
                      <p className="text-on-surface-variant/80 text-xs font-normal leading-snug mb-3">
                        {store.address}
                      </p>

                      {/* Quiet Luxury clean lists for Brands and Categories instead of cluttered pills */}
                      <div className="text-[10px] text-on-surface-variant/80 space-y-1 mb-4 leading-relaxed font-sans border-t border-outline-variant/10 pt-3">
                        {store.brands && store.brands.length > 0 && (
                          <div>
                            <span className="font-semibold text-primary">{lang === "es" ? "Marcas: " : "Brands: "}</span>
                            <span>{store.brands.map(b => brandOptions.find(o => o.id === b)?.name || b).join(", ")}</span>
                          </div>
                        )}
                        {store.region === "mx" && store.categories && store.categories.length > 0 && (
                          <div>
                            <span className="font-semibold text-primary">{lang === "es" ? "Categorías: " : "Categories: "}</span>
                            <span>{store.categories.join(", ")}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end items-center text-xs">
                        {store.maps_url ? (
                          <a
                            href={store.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[#C58B58] font-label-caps text-[10px] font-bold hover:underline"
                          >
                            {activeT.viewOnMaps}{" "}
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_forward
                            </span>
                          </a>
                        ) : (
                          <span className="text-outline-variant text-[10px] italic">
                            {activeT.noMapAvailable}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Map Visual Panel */}
          <div className="lg:w-2/3 h-[450px] lg:h-[580px] relative overflow-hidden bg-[#EDE7DE] border border-outline-variant/20 shadow-md">
            {/* Map container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Viewport filter indicator */}
            {filterByMap && mapBounds && (
              <div className="absolute top-4 left-4 z-[1000] px-2.5 py-1 bg-white/90 backdrop-blur-md border border-outline-variant/30 shadow-md text-[8px] uppercase tracking-widest font-bold text-on-surface-variant/80 flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>
                  {lang === "es" ? "Área de mapa activa" : "Map bounds active"}
                </span>
              </div>
            )}

            {/* Custom map zoom controls */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-[1000]">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-[#C58B58] hover:text-white transition-all shadow-md active:scale-95 text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-[#C58B58] hover:text-white transition-all shadow-md active:scale-95 text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold">
                  remove
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Alliances */}
      <section className="max-w-container-max mx-auto px-margin-desktop mb-20 animate-fade-in">
        <div className="relative py-12 md:py-14 bg-[#EDE7DE]/40 overflow-hidden px-6 md:px-12 border border-outline-variant/20 shadow-sm">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#7d3f0f 0.5px, transparent 0.5px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl text-left space-y-3">
              <span className="font-label-caps text-primary tracking-[0.3em] uppercase block text-xs">
                {activeT.allianceOvertitle}
              </span>
              <h2 className="font-display-hero text-3xl md:text-[48px] leading-tight font-medium">
                {activeT.allianceTitle}
              </h2>
              <p className="text-body-md text-on-surface-variant font-light leading-relaxed">
                {activeT.allianceDesc}
              </p>
            </div>
            <div className="flex-shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setIsAlliancesFormOpen(true);
                  setAlliancesStatus("idle");
                  setAlliancesError("");
                }}
                className="bg-primary text-white font-navigation text-[11px] px-8 py-4 uppercase tracking-widest hover:bg-secondary transition-all shadow-lg hover:shadow-primary/20 active:scale-95 duration-200 cursor-pointer"
              >
                {activeT.allianceBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alliances Form Modal */}
      {isAlliancesFormOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in transition-opacity duration-300">
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={() => {
              setIsAlliancesFormOpen(false);
              setAlliancesStatus("idle");
              setAlliancesError("");
            }} 
          />
          
          <div className="relative w-full max-w-2xl bg-[#FCF9F3] text-[#1C1C18] border border-[#8C4723]/15 shadow-2xl p-6 md:p-10 overflow-y-auto max-h-[90vh] rounded-none z-10 flex flex-col justify-between">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsAlliancesFormOpen(false);
                setAlliancesStatus("idle");
                setAlliancesError("");
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#1C1C18]/40 hover:text-[#8C4723] transition-colors duration-300 hover:rotate-90 select-none cursor-pointer focus:outline-none"
              aria-label={activeT.alliancesForm.close}
            >
              <span className="material-symbols-outlined font-light text-xl">close</span>
            </button>

            {alliancesStatus !== "success" ? (
              <form onSubmit={handleAlliancesSubmit} className="space-y-6 pt-2 text-left">
                <div className="space-y-2">
                  <span className="font-label-caps text-primary tracking-[0.25em] uppercase text-[10px] block font-bold">
                    {activeT.allianceOvertitle}
                  </span>
                  <h3 className="font-serif text-[24px] md:text-[28px] font-bold text-[#2F403E] leading-tight tracking-wide">
                    {activeT.alliancesForm.title}
                  </h3>
                  <p className="font-navigation text-[12.5px] text-[#53443a] leading-relaxed font-normal">
                    {activeT.alliancesForm.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                      {activeT.alliancesForm.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={alliancesForm.name}
                      onChange={(e) => setAlliancesForm({ ...alliancesForm, name: e.target.value })}
                      className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1">
                    <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                      {activeT.alliancesForm.company} *
                    </label>
                    <input
                      type="text"
                      required
                      value={alliancesForm.company}
                      onChange={(e) => setAlliancesForm({ ...alliancesForm, company: e.target.value })}
                      className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                      {activeT.alliancesForm.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={alliancesForm.email}
                      onChange={(e) => setAlliancesForm({ ...alliancesForm, email: e.target.value })}
                      className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                      {activeT.alliancesForm.phone} *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-20">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-navigation text-[13px] text-[#1c1c18]/50">+</span>
                        <input
                          type="text"
                          required
                          value={alliancesForm.lada}
                          onChange={(e) => setAlliancesForm({ ...alliancesForm, lada: e.target.value.replace(/[^0-9]/g, "") })}
                          className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none pl-5 pr-2 py-2.5 transition-all duration-300 rounded-none text-center"
                          placeholder="52"
                        />
                      </div>
                      <input
                        type="tel"
                        required
                        value={alliancesForm.phone}
                        onChange={(e) => setAlliancesForm({ ...alliancesForm, phone: e.target.value.replace(/[^0-9]/g, "") })}
                        className="flex-1 bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  {/* Market (Country Select) */}
                  <div className="space-y-1">
                    <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                      {activeT.alliancesForm.market} *
                    </label>
                    <select
                      required
                      value={alliancesForm.market}
                      onChange={(e) => setAlliancesForm({ ...alliancesForm, market: e.target.value })}
                      className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none cursor-pointer"
                    >
                      <option value="" disabled>{activeT.alliancesForm.marketSelect}</option>
                      <option value="mx">{activeT.alliancesForm.marketMX}</option>
                      <option value="usa">{activeT.alliancesForm.marketUSA}</option>
                      <option value="hk">{activeT.alliancesForm.marketHK}</option>
                      <option value="co">{activeT.alliancesForm.marketCO}</option>
                      <option value="gt">{activeT.alliancesForm.marketGT}</option>
                      <option value="other">{activeT.alliancesForm.marketOther}</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block font-navigation text-[10px] uppercase tracking-wider text-[#53443a] font-bold">
                    {activeT.alliancesForm.message}
                  </label>
                  <textarea
                    rows="3"
                    value={alliancesForm.message}
                    onChange={(e) => setAlliancesForm({ ...alliancesForm, message: e.target.value })}
                    className="w-full bg-white border border-[#1A1615]/15 focus:border-[#8C4723] focus:ring-1 focus:ring-[#8C4723] font-navigation text-[13px] text-[#1C1C18] focus:outline-none px-3.5 py-2.5 transition-all duration-300 rounded-none resize-none"
                  />
                </div>

                {alliancesError && (
                  <p className="text-[12px] font-navigation text-red-700 font-medium bg-red-50 p-3 border border-red-200">
                    {alliancesError}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={alliancesStatus === "loading"}
                  className="w-full bg-primary hover:bg-[#8C4723] text-white disabled:bg-primary/60 font-navigation text-[11px] font-bold uppercase tracking-[0.2em] py-4 transition-all duration-300 focus:outline-none cursor-pointer active:scale-[0.99]"
                >
                  {alliancesStatus === "loading" ? activeT.alliancesForm.submitting : activeT.alliancesForm.submit}
                </button>

                {/* Privacy Disclaimer */}
                <p className="text-[10px] font-navigation text-[#1C1C18]/50 leading-relaxed font-normal text-center">
                  {activeT.alliancesForm.disclaimer}
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAlliancesFormOpen(false);
                      window.location.hash = "privacy";
                    }}
                    className="text-primary hover:text-[#2F403E] transition-colors duration-300 underline underline-offset-2 font-semibold"
                  >
                    {activeT.alliancesForm.privacyLink}
                  </a>
                  .
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="py-12 text-center space-y-5 animate-[fade-in-slide_0.5s_ease-out_forwards]">
                <div className="w-14 h-14 bg-[#2F403E]/10 rounded-full flex items-center justify-center mx-auto text-[#2F403E] mb-2">
                  <span className="material-symbols-outlined text-3xl font-light">done</span>
                </div>
                <h3 className="font-serif text-[28px] font-bold text-[#2F403E] tracking-wide">
                  {activeT.alliancesForm.success}
                </h3>
                <p className="font-navigation text-[14px] text-[#53443a] leading-relaxed max-w-md mx-auto">
                  {activeT.alliancesForm.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsAlliancesFormOpen(false);
                    setAlliancesStatus("idle");
                    setAlliancesForm({
                      name: "",
                      company: "",
                      email: "",
                      lada: "52",
                      phone: "",
                      market: "",
                      message: ""
                    });
                  }}
                  className="bg-primary hover:bg-[#8C4723] text-white font-navigation text-[11px] px-8 py-3.5 uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                  {activeT.alliancesForm.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
