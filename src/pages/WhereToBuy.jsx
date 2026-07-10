import { useState, useEffect, useRef } from "react";
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

export default function WhereToBuy({ lang }) {
  const [region, setRegion] = useState("mx");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeStore, setActiveStore] = useState(null);

  // Geolocator and map states
  const [userLocation, setUserLocation] = useState(null);
  const [distanceSorted, setDistanceSorted] = useState(false);
  const [filterByMap, setFilterByMap] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const brandOptions = [
    { id: "casa-loy", name: "Casa Loy" },
    { id: "taddel", name: "TADDEL" },
    { id: "tierra-zafiro", name: "Tierra Zafiro" },
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
      filterBrands: "Filtrar por Marca",
      filterCategories: "Filtrar por Categoría",
      clearFilters: "Limpiar filtros",
      filterByMapLabel: "Filtrar por área visible del mapa",
      distanceLabel: "de distancia",
      selectedMarker: "Seleccionado",
      noMapAvailable: "Sin mapa disponible",
      noStoresFound: "No se encontraron sucursales.",
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
      filterBrands: "Filter by Brand",
      filterCategories: "Filter by Category",
      clearFilters: "Clear filters",
      filterByMapLabel: "Filter by visible map area",
      distanceLabel: "away",
      selectedMarker: "Selected",
      noMapAvailable: "No map link",
      noStoresFound: "No stores found.",
    },
  };

  const activeT = localT[lang] || localT["es"];

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/points-of-sale");
        if (!res.ok) throw new Error("Error loading stores");
        const data = await res.json();
        setStores(data);

        const initialStore = data.find((s) => s.region === "mx");
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
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20.6597, -103.3496], // Guadalajara center default
      zoom: 6,
      zoomControl: false,
    });

    mapRef.current = map;
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const updateBounds = () => {
      setMapBounds(map.getBounds());
    };

    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    // Initial bounds capture
    setTimeout(() => {
      updateBounds();
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    const firstInRegion = stores.find((s) => s.region === newRegion);
    if (firstInRegion) {
      setActiveStore(firstInRegion);
      if (mapRef.current && firstInRegion.latitude && firstInRegion.longitude) {
        mapRef.current.setView(
          [firstInRegion.latitude, firstInRegion.longitude],
          12
        );
      }
    } else {
      setActiveStore(null);
    }
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId];

      const newAvailable =
        next.length === 0
          ? Array.from(new Set(Object.values(brandCategories).flat()))
          : Array.from(new Set(next.flatMap((b) => brandCategories[b] || [])));

      setSelectedCategories((cats) =>
        cats.filter((c) => newAvailable.includes(c))
      );
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setDistanceSorted(true);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 12);
        }
      },
      (err) => {
        console.error("Error geolocating:", err);
        alert(
          lang === "es"
            ? "No se pudo obtener tu ubicación. Por favor concede permisos de geolocalización."
            : "Could not fetch location. Please enable location permissions."
        );
      }
    );
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Filter criteria before viewport mapping
  const storesFilteredByCriteria = stores.filter((store) => {
    const matchesRegion = store.region === region;
    const matchesSearch = searchQuery
      ? store.postal_code?.includes(searchQuery) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.retailer.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesBrands =
      selectedBrands.length > 0
        ? store.brands && store.brands.some((b) => selectedBrands.includes(b))
        : true;

    const matchesCategories =
      selectedCategories.length > 0
        ? store.categories &&
          store.categories.some((c) => selectedCategories.includes(c))
        : true;

    return matchesRegion && matchesSearch && matchesBrands && matchesCategories;
  });

  // Inject straight-line distances in km
  const storesWithDistance = storesFilteredByCriteria.map((store) => {
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

  // Sort stores list
  const sortedStores = [...storesWithDistance];
  if (distanceSorted && userLocation) {
    sortedStores.sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
  }

  // Filter sidebar stores by viewport bounds if checked
  const finalSidebarStores = sortedStores.filter((store) => {
    if (filterByMap && mapBounds && store.latitude && store.longitude) {
      return mapBounds.contains([store.latitude, store.longitude]);
    }
    return true;
  });

  // Update map markers when criteria or user location changes
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds();
    let hasCoords = false;

    const primaryColor = "#7D3F0F";
    const storeIcon = L.divIcon({
      className: "custom-leaflet-icon",
      html: `<div style="background-color: ${primaryColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 14px;" class="material-symbols-outlined">location_on</span></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });

    const userIcon = L.divIcon({
      className: "custom-leaflet-user-icon",
      html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 14px;" class="material-symbols-outlined">person_pin_circle</span></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });

    // Plot stores
    storesFilteredByCriteria.forEach((store) => {
      if (store.latitude && store.longitude) {
        hasCoords = true;
        bounds.extend([store.latitude, store.longitude]);

        const marker = L.marker([store.latitude, store.longitude], {
          icon: storeIcon,
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
          distHtml = `<p style="margin: 0; font-size: 11px; font-weight: bold; color: ${primaryColor};">${d.toFixed(
            1
          )} km ${activeT.distanceLabel}</p>`;
        }

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; text-align: left; min-width: 160px;">
            <h4 style="margin: 0 0 2px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${primaryColor}; font-weight: bold;">${store.retailer}</h4>
            <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #1f2937;">${store.name}</h3>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #4b5563; line-height: 1.3;">${store.address}</p>
            ${distHtml}
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on("click", () => {
          setActiveStore(store);
          map.setView(
            [store.latitude, store.longitude],
            Math.max(map.getZoom(), 12)
          );
        });

        markersLayer.addLayer(marker);
      }
    });

    // Plot user
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      const userMarker = L.marker(
        [userLocation.latitude, userLocation.longitude],
        { icon: userIcon }
      )
        .bindPopup(
          `<strong style="font-family: sans-serif;">${
            lang === "es" ? "Tu ubicación" : "Your location"
          }</strong>`
        )
        .addTo(map);
      userMarkerRef.current = userMarker;
      bounds.extend([userLocation.latitude, userLocation.longitude]);
      hasCoords = true;
    }

    if (hasCoords && storesFilteredByCriteria.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [storesFilteredByCriteria, userLocation]);

  const handleStoreClick = (store) => {
    setActiveStore(store);
    if (mapRef.current && store.latitude && store.longitude) {
      mapRef.current.setView([store.latitude, store.longitude], 14);
    }
  };

  return (
    <div className="pt-16 bg-background text-on-surface text-left">
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
          <button
            onClick={() => handleRegionChange("mx")}
            className="flex flex-col items-center gap-2 group focus:outline-none transition-transform active:scale-95"
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

          <button
            onClick={() => handleRegionChange("usa")}
            className="flex flex-col items-center gap-2 group focus:outline-none transition-transform active:scale-95"
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
      <section className="max-w-container-max mx-auto px-margin-desktop mb-20">
        <h2 className="font-headline-md text-headline-md text-2xl md:text-3xl font-bold mb-6 text-center">
          {activeT.buyOnline}
        </h2>

        {region === "mx" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center animate-fade-in">
            <a
              className="group relative w-full h-44 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm px-6"
              href="https://www.mercadolibre.com.mx/tienda/casa-loy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Mercado_Libre_Logotipo.png"
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
                src="/Liverpool_Logotipo.png"
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
                src="/Amazon_Logotipo.png"
                alt="Amazon"
                className="w-[70%] max-h-[65%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
              />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center animate-fade-in">
            {["REMEDY LIQUOR", "HIPROOF", "OLD TOWN TEQUILA", "HIGH END LIQUOR"].map(
              (usOpt) => (
                <a
                  key={usOpt}
                  className="group h-44 w-full flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 shadow-sm"
                  href="#"
                >
                  <span className="font-label-caps text-navigation text-on-surface-variant group-hover:text-primary tracking-widest text-[11px] font-bold">
                    {usOpt}
                  </span>
                </a>
              )
            )}
          </div>
        )}
      </section>

      {/* Physical Store Locations & Map */}
      <section className="max-w-container-max mx-auto px-margin-desktop mb-20 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar list panel */}
          <div className="lg:w-1/3 flex flex-col h-[580px]">
            <h2 className="font-headline-md text-headline-md text-2xl md:text-3xl font-bold mb-4">
              {activeT.physicalStores}
            </h2>

            {/* Search filter bar */}
            <div className="relative mb-3 group">
              <input
                className="w-full bg-transparent border-b border-outline-variant/60 py-3 pr-16 focus:outline-none focus:border-primary transition-all duration-500 font-body-md placeholder:text-outline-variant/50"
                placeholder={activeT.searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <span
                  onClick={() => setSearchQuery("")}
                  className="material-symbols-outlined absolute right-10 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-[18px]"
                >
                  close
                </span>
              )}
              <span
                onClick={handleGeolocate}
                title={
                  lang === "es"
                    ? "Buscar tiendas cercanas"
                    : "Find nearby stores"
                }
                className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-[20px]"
              >
                my_location
              </span>
            </div>

            {/* Toggle Map Viewport Filtering */}
            <div className="flex items-center gap-2 mb-4 select-none">
              <input
                type="checkbox"
                id="filter-by-map-checkbox"
                checked={filterByMap}
                onChange={(e) => setFilterByMap(e.target.checked)}
                className="accent-primary w-3.5 h-3.5 border-outline-variant/50 rounded focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="filter-by-map-checkbox"
                className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70 cursor-pointer"
              >
                {activeT.filterByMapLabel}
              </label>
            </div>

            {/* Filter pills for Brands */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">
                  {activeT.filterBrands}
                </span>
                {(selectedBrands.length > 0 ||
                  selectedCategories.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                    }}
                    className="text-[10px] uppercase font-bold tracking-wider text-primary hover:underline"
                  >
                    {activeT.clearFilters}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {brandOptions.map((brand) => {
                  const isSelected = selectedBrands.includes(brand.id);
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandToggle(brand.id)}
                      className={`text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-all duration-300 font-bold ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-outline-variant/30 hover:border-primary/50 text-on-surface-variant/75"
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter pills for Categories */}
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 mb-2 block">
                {activeT.filterCategories}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`text-[9px] px-2.5 py-1 border transition-all duration-300 ${
                        isSelected
                          ? "bg-primary border-primary text-white font-bold"
                          : "border-outline-variant/20 hover:border-primary/30 text-on-surface-variant/65"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scroll list wrapper */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
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
                finalSidebarStores.map((store) => (
                  <div
                    key={store.id || store.name}
                    onClick={() => handleStoreClick(store)}
                    className={`p-5 border-l-4 transition-all duration-300 cursor-pointer text-left shadow-sm ${
                      activeStore?.id === store.id ||
                      activeStore?.name === store.name
                        ? "border-l-primary bg-white shadow-md"
                        : "border-l-primary/10 bg-white/50 hover:border-l-primary/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-label-caps text-primary text-[10px] tracking-widest font-bold mb-1">
                        {store.retailer}
                      </h4>
                      {store.distance !== undefined && (
                        <span className="text-[8px] bg-primary/15 text-primary px-1.5 py-0.5 font-bold uppercase tracking-wider">
                          {store.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-md text-[17px] font-semibold mb-1">
                      {store.name}
                    </h3>
                    <p className="text-on-surface-variant/80 text-sm font-normal leading-snug mb-2">
                      {store.address}
                    </p>

                    {/* Brand and Category Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {store.brands &&
                        store.brands.map((b) => (
                          <span
                            key={b}
                            className="text-[8px] uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 font-bold"
                          >
                            {brandOptions.find((o) => o.id === b)?.name || b}
                          </span>
                        ))}
                      {store.categories &&
                        store.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[8px] uppercase tracking-wider bg-on-surface-variant/5 text-on-surface-variant/80 px-1.5 py-0.5 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-outline font-light tracking-wide">
                        {store.fase}
                      </span>
                      {store.maps_url ? (
                        <a
                          href={store.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-primary font-label-caps text-[10px] font-bold hover:underline"
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
                ))
              )}
            </div>
          </div>

          {/* Interactive Map Visual Panel */}
          <div className="lg:w-2/3 h-[450px] lg:h-[580px] relative overflow-hidden bg-[#EDE7DE] border border-outline-variant/20 shadow-md">
            {/* Map container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Overlay Info Card (React overlay on map) */}
            {activeStore && (
              <div className="absolute bottom-6 left-6 right-6 lg:right-auto z-[1000] p-5 bg-white/95 backdrop-blur-md border border-outline-variant/30 shadow-2xl min-w-[280px] lg:max-w-md text-left font-sans transition-all duration-300">
                <p className="font-label-caps text-primary text-[9px] tracking-widest font-bold mb-1">
                  {activeT.selected}
                </p>
                <p className="font-headline-md text-sm font-semibold text-on-surface">
                  {activeStore.retailer}
                </p>
                <p className="text-sm text-on-surface-variant font-normal mb-1">
                  {activeStore.name}
                </p>
                <p className="text-xs text-on-surface-variant/85 font-normal mb-3 leading-snug">
                  {activeStore.address}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {activeStore.brands &&
                    activeStore.brands.map((b) => (
                      <span
                        key={b}
                        className="text-[8px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 font-bold"
                      >
                        {brandOptions.find((o) => o.id === b)?.name || b}
                      </span>
                    ))}
                  {activeStore.categories &&
                    activeStore.categories.map((c) => (
                      <span
                        key={c}
                        className="text-[8px] uppercase tracking-wider bg-on-surface-variant/5 text-on-surface-variant/80 px-1.5 py-0.5 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-outline font-light tracking-wide">
                    {activeStore.fase}
                  </span>
                  {activeStore.maps_url && (
                    <a
                      href={activeStore.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary font-label-caps text-[9px] font-bold hover:underline"
                    >
                      {activeT.viewOnMaps}{" "}
                      <span className="material-symbols-outlined text-[12px]">
                        arrow_forward
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

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
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 text-on-surface cursor-pointer"
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
              <button className="bg-primary text-white font-navigation text-[11px] px-8 py-4 uppercase tracking-widest hover:bg-secondary transition-all shadow-lg hover:shadow-primary/20 active:scale-95 duration-200">
                {activeT.allianceBtn}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
