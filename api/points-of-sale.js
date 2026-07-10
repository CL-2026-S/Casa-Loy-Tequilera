import { supabase } from './_utils/clients.js';

// Helper to map DB row (or mock data) to include brands and categories arrays for frontend compatibility
function mapStoreForFrontend(store) {
  const brands = [];
  if (
    store.casa_loy_blanco ||
    store.casa_loy_reposado ||
    store.casa_loy_cristalino ||
    store.casa_loy_anejo ||
    store.casa_loy_piedra_y_agave_blanco ||
    store.casa_loy_piedra_y_agave_reposado
  ) {
    brands.push('casa-loy');
  }
  if (store.taddel_plata || store.taddel_reposado || store.taddel_cristalino) {
    brands.push('taddel');
  }
  if (
    store.tierra_zafiro_blanco ||
    store.tierra_zafiro_blanco_100_pure ||
    store.tierra_zafiro_reposado ||
    store.tierra_zafiro_cristalino
  ) {
    brands.push('tierra-zafiro');
  }

  const categories = [];
  // Casa Loy categories
  if (store.casa_loy_blanco) {
    if (!categories.includes('Blanco')) categories.push('Blanco');
  }
  if (store.casa_loy_reposado) {
    if (!categories.includes('Reposado')) categories.push('Reposado');
  }
  if (store.casa_loy_cristalino) {
    if (!categories.includes('Cristalino')) categories.push('Cristalino');
  }
  if (store.casa_loy_anejo) {
    if (!categories.includes('Añejo')) categories.push('Añejo');
  }
  if (store.casa_loy_piedra_y_agave_blanco) {
    categories.push('Piedra y Agave Blanco');
  }
  if (store.casa_loy_piedra_y_agave_reposado) {
    categories.push('Piedra y Agave Reposado');
  }

  // Taddel categories
  if (store.taddel_plata) {
    categories.push('Plata');
  }
  if (store.taddel_reposado) {
    if (!categories.includes('Reposado')) categories.push('Reposado');
  }
  if (store.taddel_cristalino) {
    if (!categories.includes('Cristalino')) categories.push('Cristalino');
  }

  // Tierra Zafiro categories
  if (store.tierra_zafiro_blanco || store.tierra_zafiro_blanco_100_pure) {
    if (!categories.includes('Blanco')) categories.push('Blanco');
  }
  if (store.tierra_zafiro_reposado) {
    if (!categories.includes('Reposado')) categories.push('Reposado');
  }
  if (store.tierra_zafiro_cristalino) {
    if (!categories.includes('Cristalino')) categories.push('Cristalino');
  }

  return {
    ...store,
    brands,
    categories,
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  // Fallback mock data for local development if Supabase is not configured
  const mockStores = [
    {
      id: "mock-1",
      retailer: "La Cava",
      name: "Sucursal Providencia",
      address: "Av. Providencia 2345, Guadalajara, Jalisco, MX",
      region: "mx",
      postal_code: "44630",
      latitude: 20.6908,
      longitude: -103.3815,
      maps_url: "https://maps.google.com/?q=Av.+Providencia+2345,+Guadalajara,+Jalisco",
      fase: "Juan Pérez",
      pdv: true,
      cdc: false,
      casa_loy_blanco: true,
      casa_loy_reposado: true,
      casa_loy_cristalino: false,
      casa_loy_anejo: true,
      casa_loy_piedra_y_agave_blanco: false,
      casa_loy_piedra_y_agave_reposado: false,
      taddel_plata: true,
      taddel_reposado: true,
      taddel_cristalino: false,
      tierra_zafiro_blanco: false,
      tierra_zafiro_blanco_100_pure: false,
      tierra_zafiro_reposado: false,
      tierra_zafiro_cristalino: false
    },
    {
      id: "mock-2",
      retailer: "Vinos America",
      name: "Sucursal Landmark",
      address: "Paseo de los Virreyes 45, Zapopan, Jalisco, MX",
      region: "mx",
      postal_code: "45116",
      latitude: 20.7015,
      longitude: -103.4147,
      maps_url: "https://maps.google.com/?q=Paseo+de+los+Virreyes+45,+Zapopan,+Jalisco",
      fase: "María López",
      pdv: true,
      cdc: false,
      casa_loy_blanco: true,
      casa_loy_reposado: true,
      casa_loy_cristalino: false,
      casa_loy_anejo: false,
      casa_loy_piedra_y_agave_blanco: false,
      casa_loy_piedra_y_agave_reposado: false,
      taddel_plata: false,
      taddel_reposado: false,
      taddel_cristalino: false,
      tierra_zafiro_blanco: true,
      tierra_zafiro_blanco_100_pure: true,
      tierra_zafiro_reposado: true,
      tierra_zafiro_cristalino: true
    }
  ];

  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock response in local development.");
      return res.status(200).json(mockStores.map(mapStoreForFrontend));
    }
    console.error("Supabase client is not initialized.");
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  try {
    const { data, error } = await supabase
      .from('points_of_sale')
      .select('*')
      .eq('is_active', true)
      .order('creado_en', { ascending: true });

    if (error) {
      throw error;
    }

    const mappedData = data.map(mapStoreForFrontend);
    return res.status(200).json(mappedData);
  } catch (error) {
    console.error("Error fetching points of sale:", error);
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      return res.status(200).json(mockStores.map(mapStoreForFrontend));
    }
    return res.status(500).json({ error: 'Failed to fetch points of sale.' });
  }
}

