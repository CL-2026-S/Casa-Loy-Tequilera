import { supabase } from './_utils/clients.js';

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
      retailer: "La Playa",
      name: "Sucursal Providencia",
      address: "Av. Providencia 2345, Guadalajara, Jalisco, MX",
      phone: "+52 (33) 3641 4590",
      region: "mx",
      postal_code: "44630",
      latitude: 20.6908,
      longitude: -103.3815,
      maps_url: "https://maps.google.com/?q=Av.+Providencia+2345,+Guadalajara,+Jalisco",
      kam: "Juan Pérez",
      brands: ["casa-loy", "taddel"],
      categories: ["Blanco", "Reposado", "Añejo"]
    },
    {
      id: "mock-2",
      retailer: "Vinos America",
      name: "Sucursal Landmark",
      address: "Paseo de los Virreyes 45, Zapopan, Jalisco, MX",
      phone: "+52 (33) 3648 1010",
      region: "mx",
      postal_code: "45116",
      latitude: 20.7015,
      longitude: -103.4147,
      maps_url: "https://maps.google.com/?q=Paseo+de+los+Virreyes+45,+Zapopan,+Jalisco",
      kam: "María López",
      brands: ["casa-loy", "tierra-zafiro"],
      categories: ["Blanco", "Reposado", "Cristalino"]
    },
    {
      id: "mock-3",
      retailer: "El Palacio de Hierro",
      name: "Sucursal Polanco",
      address: "Moliere 222, Polanco, CDMX, MX",
      phone: "+52 (55) 5283 7200",
      region: "mx",
      postal_code: "11550",
      latitude: 19.4352,
      longitude: -99.2036,
      maps_url: "https://maps.google.com/?q=Moliere+222,+Polanco,+CDMX",
      kam: "Juan Pérez",
      brands: ["casa-loy", "taddel", "tierra-zafiro"],
      categories: ["Blanco", "Reposado", "Añejo", "Extra Añejo"]
    },
    {
      id: "mock-4",
      retailer: "Remedy Liquor",
      name: "Glendale",
      address: "820 S Glendale Ave, Glendale, CA 91205, USA",
      phone: "+1 (818) 244-9999",
      region: "usa",
      postal_code: "91205",
      latitude: 34.1352,
      longitude: -118.2435,
      maps_url: "https://maps.google.com/?q=820+S+Glendale+Ave,+Glendale,+CA+91205",
      kam: "John Doe",
      brands: ["taddel"],
      categories: ["Blanco", "Añejo"]
    },
    {
      id: "mock-5",
      retailer: "Old Town Tequila",
      name: "San Diego",
      address: "2304 San Diego Ave, San Diego, CA 92110, USA",
      phone: "+1 (619) 291-4888",
      region: "usa",
      postal_code: "92110",
      latitude: 32.7533,
      longitude: -117.1952,
      maps_url: "https://maps.google.com/?q=2304+San+Diego+Ave,+San+Diego,+CA+92110",
      kam: "John Doe",
      brands: ["casa-loy", "tierra-zafiro"],
      categories: ["Reposado", "Extra Añejo"]
    }
  ];

  if (!supabase) {
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      console.warn("Supabase client is not initialized. Using fallback mock response in local development.");
      return res.status(200).json(mockStores);
    }
    console.error("Supabase client is not initialized.");
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  try {
    const { data, error } = await supabase
      .from('points_of_sale')
      .select('*')
      .eq('is_active', true)
      .order('retailer', { ascending: true });

    if (error) {
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching points of sale:", error);
    // If database query fails, try returning mock data in dev so the app is robust
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      return res.status(200).json(mockStores);
    }
    return res.status(500).json({ error: 'Failed to fetch points of sale.' });
  }
}
