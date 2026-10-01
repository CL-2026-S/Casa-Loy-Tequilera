import React, { useState, useRef } from "react";

const PAGE_OPTIONS = [
  { id: "home", label: "Home / Portada Principal", icon: "home", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "tours", label: "Tours & Experiencias", icon: "explore", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "about", label: "Nosotros / Historia", icon: "history_edu", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "maquilas", label: "Maquilas & Marcas Privadas", icon: "factory", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "nativo", label: "Restaurante 1937 Nativo", icon: "restaurant", color: "bg-stone-200 text-stone-800 border-stone-400" },
  { id: "brands", label: "Nuestras Marcas", icon: "liquor", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

const PREDEFINED_LINKS = [
  { value: "home", label: "Inicio (Home)" },
  { value: "turismo", label: "Tours & Experiencias (General)" },
  { value: "tours#packages", label: "Paquetes de Tours (Reserva directa)" },
  { value: "about", label: "Nosotros / Historia de la Casa" },
  { value: "maquilas", label: "Maquilas y Desarrollo de Marca" },
  { value: "maquilas#contact", label: "Asesoría de Maquilas (Contacto)" },
  { value: "nativo", label: "Restaurante 1937 Nativo" },
  { value: "nativo#reservations", label: "Reservar Mesa en Nativo" },
  { value: "nativo#menu", label: "Ver Menú de Restaurante Nativo" },
  { value: "brands", label: "Nuestras Marcas de Tequila" },
  { value: "where-to-buy", label: "Dónde Comprar / Puntos de Venta" },
  { value: "careers", label: "Bolsa de Trabajo" },
  { value: "custom", label: "🔗 Enlace personalizado o externo..." },
];

export default function BannerManager({ bannersList = [], token, onRefresh, userRole }) {
  const [selectedPageFilter, setSelectedPageFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // Filtered banners
  const filteredBanners = bannersList.filter((b) => {
    const matchesPage = selectedPageFilter === "all" || b.page === selectedPageFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (b.title_es || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.title_en || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subtitle_es || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.link_url || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPage && matchesSearch;
  });

  const handleOpenNew = () => {
    setEditingBanner({
      page: selectedPageFilter !== "all" ? selectedPageFilter : "home",
      type: "main",
      order_index: (bannersList.length || 0) + 1,
      is_active: true,
      title_es: "",
      title_en: "",
      subtitle_es: "",
      subtitle_en: "",
      button_text_es: "DESCUBRIR MÁS",
      button_text_en: "DISCOVER MORE",
      link_url: "turismo",
      image_desktop_es: "",
      image_mobile_es: "",
      image_desktop_en: "",
      image_mobile_en: "",
      // Files staged for upload
      _desktopEsFile: null,
      _mobileEsFile: null,
      _desktopEnFile: null,
      _mobileEnFile: null,
      _desktopEsPreview: "",
      _mobileEsPreview: "",
      _desktopEnPreview: "",
      _mobileEnPreview: "",
    });
    setSaveMessage({ type: "", text: "" });
  };

  const handleEdit = (banner) => {
    setEditingBanner({
      ...banner,
      _desktopEsFile: null,
      _mobileEsFile: null,
      _desktopEnFile: null,
      _mobileEnFile: null,
      _desktopEsPreview: banner.image_desktop_es || banner.image_url || "",
      _mobileEsPreview: banner.image_mobile_es || "",
      _desktopEnPreview: banner.image_desktop_en || "",
      _mobileEnPreview: banner.image_mobile_en || "",
    });
    setSaveMessage({ type: "", text: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este banner permanentemente?")) return;
    try {
      const res = await fetch("/api/cms?action=delete_banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        onRefresh();
      } else {
        alert("Error al eliminar banner.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión al eliminar banner.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8C4723] text-2xl">view_carousel</span>
              <h5 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                Banners y Portadas (Hero & Secciones)
              </h5>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Sube banners adaptados para escritorio y celular en Español e Inglés. Si sólo subes una imagen, se mostrará automáticamente en ambos dispositivos.
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center justify-center gap-2 bg-[#8C4723] hover:bg-[#a6562b] text-white px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>+ Nuevo Banner o Portada</span>
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3 border-t border-stone-100">
          {/* Page Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedPageFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedPageFilter === "all"
                  ? "bg-[#2F403E] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todas ({bannersList.length})
            </button>
            {PAGE_OPTIONS.map((opt) => {
              const count = bannersList.filter((b) => b.page === opt.id).length;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPageFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedPageFilter === opt.id
                      ? "bg-[#8C4723] text-white shadow-2xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{opt.icon}</span>
                  <span>{opt.label.split("/")[0].trim()}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por título, texto o enlace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8C4723]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Banners */}
      {filteredBanners.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-stone-300">image_not_supported</span>
          <p className="text-sm font-medium text-stone-700">No se encontraron banners en esta sección.</p>
          <p className="text-xs text-stone-400">
            Puedes agregar un banner nuevo con el botón superior para personalizar esta página.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => handleEdit(banner)}
              onDelete={() => handleDelete(banner.id)}
            />
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingBanner && (
        <BannerEditorModal
          banner={editingBanner}
          token={token}
          onClose={() => setEditingBanner(null)}
          onSaved={() => {
            setEditingBanner(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Banner Card with Live Dual Device Preview
function BannerCard({ banner, onEdit, onDelete }) {
  const [viewLang, setViewLang] = useState("es"); // es | en
  const [previewDevice, setPreviewDevice] = useState("desktop"); // desktop | mobile

  const pageMeta = PAGE_OPTIONS.find((p) => p.id === banner.page) || {
    label: banner.page,
    color: "bg-stone-100 text-stone-800",
  };

  // Image fallback resolution
  const deskImg =
    viewLang === "en"
      ? banner.image_desktop_en || banner.image_desktop_es || banner.image_url
      : banner.image_desktop_es || banner.image_url;

  const mobImg =
    viewLang === "en"
      ? banner.image_mobile_en || banner.image_desktop_en || banner.image_mobile_es || banner.image_desktop_es || banner.image_url
      : banner.image_mobile_es || banner.image_desktop_es || banner.image_url;

  const currentDisplayImg = previewDevice === "mobile" ? mobImg : deskImg;
  const isUsingFallbackMobile = previewDevice === "mobile" && !banner.image_mobile_es && !banner.image_mobile_en;

  const title = viewLang === "en" ? banner.title_en || banner.title_es : banner.title_es;
  const subtitle = viewLang === "en" ? banner.subtitle_en || banner.subtitle_es : banner.subtitle_es;
  const btnText = viewLang === "en" ? banner.button_text_en || banner.button_text_es : banner.button_text_es;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-2 bg-stone-50/70">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${pageMeta.color}`}>
            {pageMeta.label}
          </span>
          <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono font-semibold">
            #{banner.order_index || 0}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              banner.is_active !== false ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {banner.is_active !== false ? "● Activo" : "○ Inactivo"}
          </span>
        </div>

        {/* Language & Device Toggle for Preview */}
        <div className="flex items-center gap-1.5">
          {/* Lang toggle */}
          <div className="inline-flex bg-stone-200 p-0.5 rounded text-[10px] font-bold">
            <button
              onClick={() => setViewLang("es")}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                viewLang === "es" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setViewLang("en")}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                viewLang === "en" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
              }`}
            >
              EN
            </button>
          </div>

          {/* Device toggle */}
          <div className="inline-flex bg-stone-200 p-0.5 rounded text-[10px]">
            <button
              onClick={() => setPreviewDevice("desktop")}
              title="Vista de Escritorio (16:9)"
              className={`p-1 rounded cursor-pointer ${
                previewDevice === "desktop" ? "bg-white text-[#8C4723] shadow-2xs" : "text-stone-500"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] block">desktop_windows</span>
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              title="Vista de Celular (Vertical)"
              className={`p-1 rounded cursor-pointer ${
                previewDevice === "mobile" ? "bg-white text-[#8C4723] shadow-2xs" : "text-stone-500"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] block">smartphone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Live Preview Area */}
      <div className="relative bg-zinc-950 overflow-hidden flex items-center justify-center p-3 select-none">
        {previewDevice === "desktop" ? (
          // Desktop 16:9 preview container
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-white/10 shadow-inner group">
            {currentDisplayImg ? (
              <img
                src={currentDisplayImg}
                alt="Banner Desktop Preview"
                className="w-full h-full object-cover brightness-[0.82] transition-transform duration-700 group-hover:scale-102"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500 text-xs gap-1">
                <span className="material-symbols-outlined text-2xl">broken_image</span>
                <span>Sin imagen de escritorio</span>
              </div>
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"></div>

            {/* Typography Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <span className="text-[9px] uppercase tracking-widest text-amber-300 font-semibold mb-1">
                {subtitle || "CASA LOY"}
              </span>
              <h6
                className="font-serif text-sm md:text-base font-light leading-snug line-clamp-2"
                dangerouslySetInnerHTML={{ __html: title || "Sin título definido" }}
              />
              {btnText && (
                <div className="mt-2">
                  <span className="inline-block bg-[#8C4723] text-white text-[9px] font-semibold tracking-wider px-2 py-0.5 uppercase">
                    {btnText}
                  </span>
                </div>
              )}
            </div>

            {/* Device indicator pill */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded font-mono">
              🖥️ Escritorio
            </div>
          </div>
        ) : (
          // Mobile Mockup Preview
          <div className="relative w-[180px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-xl group bg-black">
            {currentDisplayImg ? (
              <img
                src={currentDisplayImg}
                alt="Banner Mobile Preview"
                className="w-full h-full object-cover brightness-[0.82]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500 text-xs gap-1">
                <span className="material-symbols-outlined text-2xl">broken_image</span>
                <span>Sin imagen</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>

            {/* Mobile Typography */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-white text-center">
              <span className="text-[7px] uppercase tracking-widest text-amber-300 font-semibold mb-0.5">
                {subtitle || "CASA LOY"}
              </span>
              <h6
                className="font-serif text-[11px] font-light leading-tight line-clamp-3 mb-2"
                dangerouslySetInnerHTML={{ __html: title || "Sin título" }}
              />
              {btnText && (
                <span className="inline-block bg-[#8C4723] text-white text-[8px] font-semibold tracking-wider px-2 py-1 uppercase rounded-xs">
                  {btnText}
                </span>
              )}
            </div>

            {/* Device indicator pill */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs text-white text-[8px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span>📱 Móvil</span>
            </div>

            {isUsingFallbackMobile && (
              <div className="absolute bottom-1 left-1 right-1 bg-amber-950/90 text-amber-200 text-[7px] py-0.5 px-1 rounded text-center leading-tight">
                🔄 Fallback de escritorio
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details & Link info */}
      <div className="p-4 space-y-3 bg-white border-t border-stone-100 text-xs">
        <div className="grid grid-cols-2 gap-3 text-stone-600">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Enlace de Destino</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-stone-800 truncate" title={banner.link_url}>
              <span className="material-symbols-outlined text-[13px] text-[#8C4723]">link</span>
              <span>/{banner.link_url || "home"}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Fotos Cargadas</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span title="Escritorio ES">🖥️ {banner.image_desktop_es ? "✓" : "—"}</span>
              <span title="Móvil ES">📱 {banner.image_mobile_es ? "✓" : "🔄 Auto"}</span>
              <span title="Inglés (EN)" className="text-stone-400">
                EN: {banner.image_desktop_en ? "✓" : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-[10px] text-stone-400 font-mono">
            ID: {String(banner.id).substring(0, 8)}...
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 bg-[#2F403E] hover:bg-[#8C4723] text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>Editar & Fotos</span>
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors"
              title="Eliminar este banner"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Banner Editor Modal
function BannerEditorModal({ banner, token, onClose, onSaved }) {
  const [formPage, setFormPage] = useState(banner.page || "home");
  const [formType, setFormType] = useState(banner.type || "main");
  const [formOrder, setFormOrder] = useState(banner.order_index || 1);
  const [formActive, setFormActive] = useState(banner.is_active !== false);

  // Link setup
  const [linkPreset, setLinkPreset] = useState(() => {
    const found = PREDEFINED_LINKS.find((l) => l.value === banner.link_url);
    return found ? banner.link_url : "custom";
  });
  const [customLinkUrl, setCustomLinkUrl] = useState(banner.link_url || "");

  // Text fields
  const [textLangTab, setTextLangTab] = useState("es"); // es | en
  const [titleEs, setTitleEs] = useState(banner.title_es || "");
  const [titleEn, setTitleEn] = useState(banner.title_en || "");
  const [subtitleEs, setSubtitleEs] = useState(banner.subtitle_es || "");
  const [subtitleEn, setSubtitleEn] = useState(banner.subtitle_en || "");
  const [btnTextEs, setBtnTextEs] = useState(banner.button_text_es || "DESCUBRIR MÁS");
  const [btnTextEn, setBtnTextEn] = useState(banner.button_text_en || "DISCOVER MORE");

  // Image tab: 'es' | 'en'
  const [imageLangTab, setImageLangTab] = useState("es");

  // Image states
  const [desktopEsPreview, setDesktopEsPreview] = useState(banner.image_desktop_es || banner.image_url || "");
  const [desktopEsBase64, setDesktopEsBase64] = useState("");
  const [desktopEsName, setDesktopEsName] = useState("");

  const [mobileEsPreview, setMobileEsPreview] = useState(banner.image_mobile_es || "");
  const [mobileEsBase64, setMobileEsBase64] = useState("");
  const [mobileEsName, setMobileEsName] = useState("");

  const [desktopEnPreview, setDesktopEnPreview] = useState(banner.image_desktop_en || "");
  const [desktopEnBase64, setDesktopEnBase64] = useState("");
  const [desktopEnName, setDesktopEnName] = useState("");

  const [mobileEnPreview, setMobileEnPreview] = useState(banner.image_mobile_en || "");
  const [mobileEnBase64, setMobileEnBase64] = useState("");
  const [mobileEnName, setMobileEnName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e, target) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64Only = dataUrl.split(",")[1];

      if (target === "desk_es") {
        setDesktopEsPreview(dataUrl);
        setDesktopEsBase64(base64Only);
        setDesktopEsName(file.name);
      } else if (target === "mob_es") {
        setMobileEsPreview(dataUrl);
        setMobileEsBase64(base64Only);
        setMobileEsName(file.name);
      } else if (target === "desk_en") {
        setDesktopEnPreview(dataUrl);
        setDesktopEnBase64(base64Only);
        setDesktopEnName(file.name);
      } else if (target === "mob_en") {
        setMobileEnPreview(dataUrl);
        setMobileEnBase64(base64Only);
        setMobileEnName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64Only = dataUrl.split(",")[1];

        if (target === "desk_es") {
          setDesktopEsPreview(dataUrl);
          setDesktopEsBase64(base64Only);
          setDesktopEsName(file.name);
        } else if (target === "mob_es") {
          setMobileEsPreview(dataUrl);
          setMobileEsBase64(base64Only);
          setMobileEsName(file.name);
        } else if (target === "desk_en") {
          setDesktopEnPreview(dataUrl);
          setDesktopEnBase64(base64Only);
          setDesktopEnName(file.name);
        } else if (target === "mob_en") {
          setMobileEnPreview(dataUrl);
          setMobileEnBase64(base64Only);
          setMobileEnName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const targetLinkUrl = linkPreset === "custom" ? customLinkUrl.trim() : linkPreset;

    const payload = {
      id: banner.id,
      page: formPage,
      type: formType,
      order_index: parseInt(formOrder || "1", 10),
      is_active: formActive,
      title_es: titleEs,
      title_en: titleEn || titleEs,
      subtitle_es: subtitleEs,
      subtitle_en: subtitleEn || subtitleEs,
      button_text_es: btnTextEs,
      button_text_en: btnTextEn || btnTextEs,
      link_url: targetLinkUrl,

      // Existing or plain URLs if not uploaded via new base64
      image_desktop_es: desktopEsBase64 ? undefined : desktopEsPreview,
      image_mobile_es: mobileEsBase64 ? undefined : mobileEsPreview,
      image_desktop_en: desktopEnBase64 ? undefined : desktopEnPreview,
      image_mobile_en: mobileEnBase64 ? undefined : mobileEnPreview,

      // Base64 new uploads
      image_desktop_es_base64: desktopEsBase64 || undefined,
      image_desktop_es_name: desktopEsName || undefined,

      image_mobile_es_base64: mobileEsBase64 || undefined,
      image_mobile_es_name: mobileEsName || undefined,

      image_desktop_en_base64: desktopEnBase64 || undefined,
      image_desktop_en_name: desktopEnName || undefined,

      image_mobile_en_base64: mobileEnBase64 || undefined,
      image_mobile_en_name: mobileEnName || undefined,
    };

    try {
      const res = await fetch("/api/cms?action=update_banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onSaved();
      } else {
        setErrorMessage(data.error || "Error al guardar el banner.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al guardar el banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
              {banner.id ? "Editar Banner o Portada" : "Registrar Nuevo Banner"}
            </h4>
            <p className="text-xs text-stone-500">
              Personaliza imágenes por dispositivo, títulos, botones de enlace y orden de aparición.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SECCIÓN: UBICACIÓN Y ORDEN */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-3">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#8C4723] block">
              1. Ubicación y Propósito
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Página Destino *
                </label>
                <select
                  value={formPage}
                  onChange={(e) => setFormPage(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-[#8C4723]"
                >
                  {PAGE_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  Tipo de Banner *
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-[#8C4723]"
                >
                  <option value="main">Principal (Hero / Portada completa)</option>
                  <option value="secondary">Secundario (Parallax o Franja)</option>
                  <option value="promo">Promocional / Especial</option>
                  <option value="gallery">Galería</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Orden (#)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Estado
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormActive(!formActive)}
                    className={`w-full p-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      formActive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-stone-200 text-stone-600 border border-stone-300"
                    }`}
                  >
                    {formActive ? "Activo" : "Inactivo"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECCIÓN: ENLACE DE LA PÁGINA (LINK) & BOTÓN */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-3">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#8C4723] block">
              2. Enlace y Llamado a la Acción (CTA)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                  ¿A qué página o sección enlaza el banner?
                </label>
                <select
                  value={linkPreset}
                  onChange={(e) => {
                    setLinkPreset(e.target.value);
                    if (e.target.value !== "custom") {
                      setCustomLinkUrl(e.target.value);
                    }
                  }}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-[#8C4723]"
                >
                  {PREDEFINED_LINKS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>

                {linkPreset === "custom" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Ej. https://ejemplo.com o nombre-de-ruta"
                      value={customLinkUrl}
                      onChange={(e) => setCustomLinkUrl(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Texto Botón (ES)
                  </label>
                  <input
                    type="text"
                    placeholder="DESCUBRIR MÁS"
                    value={btnTextEs}
                    onChange={(e) => setBtnTextEs(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Texto Botón (EN)
                  </label>
                  <input
                    type="text"
                    placeholder="DISCOVER MORE"
                    value={btnTextEn}
                    onChange={(e) => setBtnTextEn(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SECCIÓN: TÍTULOS Y SUBTÍTULOS */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#8C4723]">
                3. Títulos y Textos del Banner
              </span>
              <div className="inline-flex bg-stone-200 p-0.5 rounded text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTextLangTab("es")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    textLangTab === "es" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
                  }`}
                >
                  🇲🇽 Español
                </button>
                <button
                  type="button"
                  onClick={() => setTextLangTab("en")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    textLangTab === "en" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
                  }`}
                >
                  🇺🇸 Inglés
                </button>
              </div>
            </div>

            {textLangTab === "es" ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Título Principal (Español)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. VIVE LA TRADICIÓN EN CADA RINCÓN"
                    value={titleEs}
                    onChange={(e) => setTitleEs(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Subtítulo / Descripción Breve (Español)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Ej. Recorre nuestra destilería, descubre la magia del agave y sumérgete en el sabor de Los Altos."
                    value={subtitleEs}
                    onChange={(e) => setSubtitleEs(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs resize-none"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Título Principal (Inglés)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. LIVE THE TRADITION IN EVERY CORNER"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Subtítulo / Descripción Breve (Inglés)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Ej. Tour our distillery, discover the magic of agave, and immerse yourself in the flavors of Jalisco."
                    value={subtitleEn}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs resize-none"
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* 4. SECCIÓN: CARGA DE IMÁGENES (ESCRITORIO & MÓVIL) */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#8C4723] block">
                  4. Imágenes por Dispositivo e Idioma
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Lógica responsive: Si solo subes la imagen de escritorio, se usará automáticamente también en celulares.
                </p>
              </div>

              {/* Lang switcher for images */}
              <div className="inline-flex bg-stone-200 p-0.5 rounded text-[10px] font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setImageLangTab("es")}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    imageLangTab === "es" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
                  }`}
                >
                  🇲🇽 Fotos en Español (Principal)
                </button>
                <button
                  type="button"
                  onClick={() => setImageLangTab("en")}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    imageLangTab === "en" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500"
                  }`}
                >
                  🇺🇸 Fotos en Inglés (Opcional)
                </button>
              </div>
            </div>

            {/* TAB ESPAÑOL */}
            {imageLangTab === "es" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desktop Upload ES */}
                <ImageDropZone
                  title="Banner Escritorio (Desktop 16:9)"
                  subtitle="Recomendado: 1920 × 1080 px (.webp, .jpg, .png)"
                  previewUrl={desktopEsPreview}
                  onFileSelect={(e) => handleFileChange(e, "desk_es")}
                  onDrop={(e) => handleDrop(e, "desk_es")}
                  onClear={() => {
                    setDesktopEsPreview("");
                    setDesktopEsBase64("");
                    setDesktopEsName("");
                  }}
                  isPrimary={true}
                  badge="Principal"
                />

                {/* Mobile Upload ES */}
                <ImageDropZone
                  title="Banner Celular (Móvil Vertical 9:16)"
                  subtitle="Recomendado: 1080 × 1920 px (Opcional)"
                  previewUrl={mobileEsPreview}
                  fallbackPreviewUrl={desktopEsPreview}
                  onFileSelect={(e) => handleFileChange(e, "mob_es")}
                  onDrop={(e) => handleDrop(e, "mob_es")}
                  onClear={() => {
                    setMobileEsPreview("");
                    setMobileEsBase64("");
                    setMobileEsName("");
                  }}
                  badge={mobileEsPreview ? "Móvil dedicado" : "Usa escritorio"}
                  isMobileAspect={true}
                />
              </div>
            )}

            {/* TAB INGLÉS */}
            {imageLangTab === "en" && (
              <div className="space-y-3">
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-lg">
                  ℹ️ <strong>Opcional:</strong> Si dejas estas imágenes vacías, el sistema utilizará automáticamente las imágenes subidas en la pestaña de Español para los usuarios en inglés.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Upload EN */}
                  <ImageDropZone
                    title="Banner Escritorio (Inglés)"
                    subtitle="Recomendado: 1920 × 1080 px"
                    previewUrl={desktopEnPreview}
                    fallbackPreviewUrl={desktopEsPreview}
                    onFileSelect={(e) => handleFileChange(e, "desk_en")}
                    onDrop={(e) => handleDrop(e, "desk_en")}
                    onClear={() => {
                      setDesktopEnPreview("");
                      setDesktopEnBase64("");
                      setDesktopEnName("");
                    }}
                    badge={desktopEnPreview ? "Inglés dedicado" : "Usa español"}
                  />

                  {/* Mobile Upload EN */}
                  <ImageDropZone
                    title="Banner Celular (Inglés)"
                    subtitle="Recomendado: 1080 × 1920 px"
                    previewUrl={mobileEnPreview}
                    fallbackPreviewUrl={mobileEsPreview || desktopEnPreview || desktopEsPreview}
                    onFileSelect={(e) => handleFileChange(e, "mob_en")}
                    onDrop={(e) => handleDrop(e, "mob_en")}
                    onClear={() => {
                      setMobileEnPreview("");
                      setMobileEnBase64("");
                      setMobileEnName("");
                    }}
                    badge={mobileEnPreview ? "Móvil inglés dedicado" : "Usa fallback"}
                    isMobileAspect={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-semibold bg-[#8C4723] hover:bg-[#a6562b] text-white rounded-lg shadow-xs cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Guardar Banner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Image Drop Zone with File Upload & Preview
function ImageDropZone({
  title,
  subtitle,
  previewUrl,
  fallbackPreviewUrl,
  onFileSelect,
  onDrop,
  onClear,
  badge,
  isPrimary = false,
  isMobileAspect = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const displayUrl = previewUrl || fallbackPreviewUrl;
  const isFallback = !previewUrl && !!fallbackPreviewUrl;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e);
      }}
      className={`relative bg-white border-2 rounded-xl p-3 flex flex-col justify-between transition-all ${
        isDragOver
          ? "border-[#8C4723] bg-orange-50/30 scale-[1.01]"
          : previewUrl
          ? "border-emerald-300"
          : "border-dashed border-stone-300 hover:border-stone-400"
      }`}
    >
      {/* Header of zone */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div>
          <span className="font-semibold text-stone-800 text-[11px] block">{title}</span>
          <span className="text-[10px] text-stone-400 block">{subtitle}</span>
        </div>
        {badge && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
              previewUrl
                ? "bg-emerald-100 text-emerald-800"
                : isPrimary
                ? "bg-amber-100 text-amber-800"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Visual Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-lg overflow-hidden cursor-pointer group flex items-center justify-center bg-stone-900 ${
          isMobileAspect ? "aspect-[9/10] max-h-[180px]" : "aspect-[16/9]"
        }`}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Preview"
              className={`w-full h-full object-cover transition-opacity ${
                isFallback ? "opacity-45" : "opacity-90 group-hover:opacity-75"
              }`}
            />
            {/* Fallback label if using fallback */}
            {isFallback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/40">
                <span className="material-symbols-outlined text-amber-300 text-xl mb-1">sync</span>
                <span className="text-[10px] text-amber-100 font-medium">
                  Usará la imagen de escritorio como fallback
                </span>
                <span className="text-[9px] text-white/70 mt-1">Clic o arrastra aquí para subir imagen propia de celular</span>
              </div>
            )}
            {/* Hover overlay */}
            {!isFallback && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs gap-1.5 font-medium">
                <span className="material-symbols-outlined text-lg">upload</span>
                <span>Cambiar archivo</span>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-stone-400 group-hover:text-stone-300 transition-colors space-y-1">
            <span className="material-symbols-outlined text-2xl text-stone-500 group-hover:scale-110 transition-transform">
              add_photo_alternate
            </span>
            <p className="text-[11px] font-medium text-stone-300">Arrastra una imagen o haz clic aquí</p>
            <p className="text-[9px] text-stone-500">Seleccionar desde tu computadora</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />

      {/* Action Buttons below preview */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[10px] text-[#8C4723] hover:underline font-bold uppercase flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[12px]">folder_open</span>
          <span>{previewUrl ? "Reemplazar archivo" : "Seleccionar archivo"}</span>
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
}
