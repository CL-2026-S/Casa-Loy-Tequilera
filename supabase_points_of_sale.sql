-- SQL Migration for Casa Loy Points of Sale (Dónde Comprar)

-- Create points_of_sale table
CREATE TABLE IF NOT EXISTS points_of_sale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    region TEXT NOT NULL CHECK (region IN ('mx', 'usa')),
    postal_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    maps_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_points_of_sale_region ON points_of_sale(region);
CREATE INDEX IF NOT EXISTS idx_points_of_sale_active ON points_of_sale(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE points_of_sale ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access to points_of_sale" 
    ON points_of_sale FOR SELECT 
    USING (true);

-- Insert seed data (Avoid duplicate inserts if executed multiple times)
INSERT INTO points_of_sale (retailer, name, address, phone, region, postal_code, latitude, longitude, maps_url)
SELECT 'La Playa', 'Sucursal Providencia', 'Av. Providencia 2345, Guadalajara, Jalisco, MX', '+52 (33) 3641 4590', 'mx', '44630', 20.6908, -103.3815, 'https://maps.google.com/?q=Av.+Providencia+2345,+Guadalajara,+Jalisco'
WHERE NOT EXISTS (SELECT 1 FROM points_of_sale WHERE name = 'Sucursal Providencia');

INSERT INTO points_of_sale (retailer, name, address, phone, region, postal_code, latitude, longitude, maps_url)
SELECT 'Vinos America', 'Sucursal Landmark', 'Paseo de los Virreyes 45, Zapopan, Jalisco, MX', '+52 (33) 3648 1010', 'mx', '45116', 20.7015, -103.4147, 'https://maps.google.com/?q=Paseo+de+los+Virreyes+45,+Zapopan,+Jalisco'
WHERE NOT EXISTS (SELECT 1 FROM points_of_sale WHERE name = 'Sucursal Landmark');

INSERT INTO points_of_sale (retailer, name, address, phone, region, postal_code, latitude, longitude, maps_url)
SELECT 'El Palacio de Hierro', 'Sucursal Polanco', 'Moliere 222, Polanco, CDMX, MX', '+52 (55) 5283 7200', 'mx', '11550', 19.4352, -99.2036, 'https://maps.google.com/?q=Moliere+222,+Polanco,+CDMX'
WHERE NOT EXISTS (SELECT 1 FROM points_of_sale WHERE name = 'Sucursal Polanco');

INSERT INTO points_of_sale (retailer, name, address, phone, region, postal_code, latitude, longitude, maps_url)
SELECT 'Remedy Liquor', 'Glendale', '820 S Glendale Ave, Glendale, CA 91205, USA', '+1 (818) 244-9999', 'usa', '91205', 34.1352, -118.2435, 'https://maps.google.com/?q=820+S+Glendale+Ave,+Glendale,+CA+91205'
WHERE NOT EXISTS (SELECT 1 FROM points_of_sale WHERE name = 'Glendale');

INSERT INTO points_of_sale (retailer, name, address, phone, region, postal_code, latitude, longitude, maps_url)
SELECT 'Old Town Tequila', 'San Diego', '2304 San Diego Ave, San Diego, CA 92110, USA', '+1 (619) 291-4888', 'usa', '92110', 32.7533, -117.1952, 'https://maps.google.com/?q=2304+San+Diego+Ave,+San+Diego,+CA+92110'
WHERE NOT EXISTS (SELECT 1 FROM points_of_sale WHERE name = 'San Diego');
