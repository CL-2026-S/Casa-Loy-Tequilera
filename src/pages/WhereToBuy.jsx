import { useState } from "react";

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
      {/* Golden eagle emblem silhouette */}
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
      {/* 13 stripes */}
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
      {/* Blue canton */}
      <rect width="32" height="32.2" fill="#3C3B6E" />
      {/* Simplified white stars */}
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

export default function WhereToBuy({ lang }) {
  const [region, setRegion] = useState("mx"); // mx or usa
  const [activeStore, setActiveStore] = useState({
    name: "Sucursal Providencia",
    retailer: "La Playa",
    address: "Av. Providencia 2345, Guadalajara, Jalisco, MX",
    phone: "+52 (33) 3641 4590",
  });

  const localT = {
    es: {
      overtitle: "Dónde Comprar",
      title: "Puntos de Venta",
      buyOnline: "Compra en Línea",
      physicalStores: "Tiendas Físicas",
      searchPlaceholder: "Buscar por Código Postal",
      viewOnMaps: "VER EN MAPS",
      selected: "SELECCIONADO",
      allianceOvertitle: "Alianzas Comerciales",
      allianceTitle: "Vende nuestros productos",
      allianceDesc: "Conviértete en embajador de la herencia y el sabor de Casa Loy. Ofrecemos programas exclusivos para distribuidores y establecimientos de lujo.",
      allianceBtn: "Formulario de Contacto",
    },
    en: {
      overtitle: "Where to Buy",
      title: "Points of Sale",
      buyOnline: "Buy Online",
      physicalStores: "Physical Stores",
      searchPlaceholder: "Search by ZIP Code",
      viewOnMaps: "VIEW ON MAPS",
      selected: "SELECTED",
      allianceOvertitle: "Commercial Alliances",
      allianceTitle: "Sell our products",
      allianceDesc: "Become an ambassador for the heritage and flavor of Casa Loy. We offer exclusive programs for distributors and luxury establishments.",
      allianceBtn: "Contact Form",
    }
  };

  const activeT = localT[lang] || localT["es"];

  const physicalStores = [
    {
      retailer: "La Playa",
      name: "Sucursal Providencia",
      address: "Av. Providencia 2345, Guadalajara, Jalisco, MX",
      phone: "+52 (33) 3641 4590",
    },
    {
      retailer: "Vinos America",
      name: "Sucursal Landmark",
      address: "Paseo de los Virreyes 45, Zapopan, Jalisco, MX",
      phone: "+52 (33) 3648 1010",
    },
    {
      retailer: "El Palacio de Hierro",
      name: "Sucursal Polanco",
      address: "Moliere 222, Polanco, CDMX, MX",
      phone: "+52 (55) 5283 7200",
    },
  ];

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
            onClick={() => setRegion("mx")}
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
            onClick={() => setRegion("usa")}
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
            <a className="group relative w-full h-28 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm" href="#">
              <svg className="h-8 opacity-60 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="28" fontFamily="sans-serif" fontWeight="900" fontSize="22" fill="#2D3277">mercado</text>
                <text x="102" y="28" fontFamily="sans-serif" fontWeight="300" fontSize="22" fill="#2D3277">libre</text>
              </svg>
            </a>
            <a className="group relative w-full h-28 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm" href="#">
              <svg className="h-5 opacity-60 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="18" fontFamily="sans-serif" fontWeight="bold" fontSize="20" fill="#E2007A">Liverpool</text>
              </svg>
            </a>
            <a className="group relative w-full h-28 flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 overflow-hidden shadow-sm" href="#">
              <svg className="h-5 opacity-60 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="18" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="#111111">amazon</text>
              </svg>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center animate-fade-in">
            {["REMEDY LIQUOR", "HIPROOF", "OLD TOWN TEQUILA", "HIGH END LIQUOR"].map((usOpt) => (
              <a
                key={usOpt}
                className="group h-28 w-full flex items-center justify-center bg-white/50 border border-outline-variant/20 hover:bg-white hover:border-primary transition-all duration-500 shadow-sm"
                href="#"
              >
                <span className="font-label-caps text-navigation text-on-surface-variant group-hover:text-primary tracking-widest text-[11px] font-bold">
                  {usOpt}
                </span>
              </a>
            ))}
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
            <div className="relative mb-4 group">
              <input
                className="w-full bg-transparent border-b border-outline-variant/60 py-3 pr-12 focus:outline-none focus:border-primary transition-all duration-500 font-body-md placeholder:text-outline-variant/50"
                placeholder={activeT.searchPlaceholder}
                type="text"
              />
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer">
                my_location
              </span>
            </div>

            {/* Scroll list wrapper */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {physicalStores.map((store) => (
                <div
                  key={store.name}
                  onClick={() => setActiveStore(store)}
                  className={`p-5 border-l-4 transition-all duration-300 cursor-pointer text-left shadow-sm ${
                    activeStore.name === store.name
                      ? "border-l-primary bg-white shadow-md"
                      : "border-l-primary/10 bg-white/50 hover:border-l-primary/50 hover:bg-white"
                  }`}
                >
                  <h4 className="font-label-caps text-primary text-[10px] tracking-widest font-bold mb-1">
                    {store.retailer}
                  </h4>
                  <h3 className="font-headline-md text-[18px] font-semibold mb-1">{store.name}</h3>
                  <p className="text-on-surface-variant/80 text-xs font-light leading-snug mb-3">
                    {store.address}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-outline font-light tracking-wide">{store.phone}</span>
                    <button className="flex items-center gap-1.5 text-primary font-label-caps text-[10px] font-bold">
                      {activeT.viewOnMaps} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual Panel */}
          <div className="lg:w-2/3 h-[450px] lg:h-[580px] relative overflow-hidden bg-[#EDE7DE] group border border-outline-variant/20 shadow-md">
            <img
              alt="Interactive store locator map details"
              className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-102 transition-transform duration-10000"
              src="/Ayotlán.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f3]/0 via-transparent to-[#fcf9f3] pointer-events-none z-0"></div>
            
            {/* Animated Pin Location Info Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 select-none">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(125,63,15,0.6)]">
                <span className="material-symbols-outlined text-white">location_on</span>
              </div>
              <div className="mt-4 p-4 bg-white/90 border border-outline-variant/30 shadow-2xl min-w-[220px] text-center font-sans">
                <p className="font-label-caps text-primary text-[9px] tracking-widest font-bold mb-1">
                  {activeT.selected}
                </p>
                <p className="font-headline-md text-sm font-semibold text-on-surface">
                  {activeStore.retailer}
                </p>
                <p className="text-xs text-on-surface-variant font-light">{activeStore.name}</p>
              </div>
            </div>

            {/* Map zoom floating tools */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 text-on-surface">
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 text-on-surface">
                <span className="material-symbols-outlined font-bold">remove</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Distributer Inquiry Form Section */}
      <section className="max-w-container-max mx-auto px-margin-desktop mb-20 animate-fade-in">
        <div className="relative py-12 md:py-14 bg-[#EDE7DE]/40 overflow-hidden px-6 md:px-12 border border-outline-variant/20 shadow-sm">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#7d3f0f 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}></div>
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
