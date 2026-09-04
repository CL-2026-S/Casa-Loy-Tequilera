import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const csvContent = fs.readFileSync('points_of_sale_import.csv', 'utf-8');
const lines = csvContent.split(/\r?\n/).filter(l => l.trim() !== '');

console.log(`Processing ${lines.length - 1} records...`);

const records = [];

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const retailer = cols[0]?.trim() || '';
  if (!retailer) {
    console.warn(`Line ${i+1}: empty retailer, skipping`);
    continue;
  }

  let name = cols[1]?.trim() || '';
  if (!name) {
    name = retailer;
  }

  let address = cols[2]?.trim() || '';
  if (!address) {
    address = `${retailer} - Dirección por confirmar`;
  }

  let region = (cols[3] || '').toLowerCase().trim();
  if (region !== 'mx' && region !== 'usa') {
    if (address.includes('EE. UU.') || address.includes('CO ') || address.includes('CA ') || address.includes('TX ')) {
      region = 'usa';
    } else {
      region = 'mx';
    }
  }

  const postal_code = cols[4]?.trim() || '';
  const latRaw = parseFloat(cols[5]);
  const latitude = !isNaN(latRaw) ? latRaw : null;
  const lngRaw = parseFloat(cols[6]);
  const longitude = !isNaN(lngRaw) ? lngRaw : null;
  const maps_url = cols[7]?.trim() || '';
  const is_active = cols[8]?.toLowerCase() !== 'false';
  const fase = cols[9]?.trim() || '';

  // Extract products
  const casa_loy_blanco = cols[10] === 'true';
  const casa_loy_reposado = cols[11] === 'true';
  const casa_loy_cristalino = cols[12] === 'true';
  const casa_loy_anejo = cols[13] === 'true';
  const casa_loy_piedra_y_agave_blanco = cols[14] === 'true';

  const taddel_plata = cols[15] === 'true';
  const taddel_reposado = cols[16] === 'true';
  const taddel_cristalino = cols[17] === 'true';

  const tierra_zafiro_blanco = cols[18] === 'true';
  const tierra_zafiro_blanco_100_pure = cols[19] === 'true';
  const tierra_zafiro_reposado = cols[20] === 'true';
  const tierra_zafiro_cristalino = cols[21] === 'true';

  // Handle variations for trailing columns
  let casa_loy_piedra_y_agave_reposado = false;
  let pdv = false;
  let cdc = false;
  let cl = false;
  let td = false;
  let tz = false;

  if (cols.length === 29) {
    casa_loy_piedra_y_agave_reposado = cols[23] === 'true';
    pdv = cols[24] === 'true';
    cdc = cols[25] === 'true';
    cl = cols[26] === 'true';
    td = cols[27] === 'true';
    tz = cols[28] === 'true';
  } else if (cols.length === 30) {
    if (cols[24] === 'false') {
      // Pattern A
      casa_loy_piedra_y_agave_reposado = false;
      pdv = cols[25] === 'true';
      cdc = cols[26] === 'true';
      cl = cols[27] === 'true';
      td = cols[28] === 'true';
      tz = cols[29] === 'true';
    } else {
      // Pattern B
      casa_loy_piedra_y_agave_reposado = false;
      pdv = cols[25] === 'true';
      cdc = cols[26] === 'true';
      cl = cols[27] === 'true';
      td = cols[28] === 'true';
      tz = cols[29] === 'true';
    }
  } else if (cols.length === 28) {
    casa_loy_piedra_y_agave_reposado = cols[23] === 'true';
    pdv = cols[24] === 'true';
    cdc = cols[25] === 'true';
    cl = cols[26] === 'true';
    td = cols[27] === 'true';
    tz = false;
  }

  // Derive brand flags if not explicitly set
  const hasCasaLoyProd = Boolean(
    casa_loy_blanco ||
    casa_loy_reposado ||
    casa_loy_cristalino ||
    casa_loy_anejo ||
    casa_loy_piedra_y_agave_blanco ||
    casa_loy_piedra_y_agave_reposado
  );
  const hasTaddelProd = Boolean(
    taddel_plata ||
    taddel_reposado ||
    taddel_cristalino
  );
  const hasTierraZafiroProd = Boolean(
    tierra_zafiro_blanco ||
    tierra_zafiro_blanco_100_pure ||
    tierra_zafiro_reposado ||
    tierra_zafiro_cristalino
  );

  const finalCL = cl || hasCasaLoyProd;
  const finalTD = td || hasTaddelProd;
  const finalTZ = tz || hasTierraZafiroProd;

  records.push({
    retailer,
    name,
    address,
    region,
    postal_code,
    latitude,
    longitude,
    maps_url,
    is_active,
    fase,
    casa_loy_blanco,
    casa_loy_reposado,
    casa_loy_cristalino,
    casa_loy_anejo,
    casa_loy_piedra_y_agave_blanco,
    casa_loy_piedra_y_agave_reposado,
    taddel_plata,
    taddel_reposado,
    taddel_cristalino,
    tierra_zafiro_blanco,
    tierra_zafiro_blanco_100_pure,
    tierra_zafiro_reposado,
    tierra_zafiro_cristalino,
    pdv,
    cdc,
    cl: finalCL,
    td: finalTD,
    tz: finalTZ,
  });
}

console.log(`Total valid records to import: ${records.length}`);

// Step 1: Ensure table is empty
console.log('Ensuring table points_of_sale is purged...');
const { error: deleteError } = await supabase.from('points_of_sale').delete().neq('id', '00000000-0000-0000-0000-000000000000');
if (deleteError) {
  console.error('Error clearing points_of_sale:', deleteError);
  process.exit(1);
}
console.log('Table cleared.');

// Step 2: Batch insert
const BATCH_SIZE = 50;
let insertedCount = 0;

for (let i = 0; i < records.length; i += BATCH_SIZE) {
  const batch = records.slice(i, i + BATCH_SIZE);
  const { error: insertError } = await supabase.from('points_of_sale').insert(batch);
  if (insertError) {
    console.error(`Error inserting batch ${i} - ${i + batch.length}:`, insertError);
    process.exit(1);
  }
  insertedCount += batch.length;
  console.log(`Inserted ${insertedCount} / ${records.length} records...`);
}

console.log('Successfully imported all points of sale!');

// Step 3: Verification query
const { count, error: countError } = await supabase
  .from('points_of_sale')
  .select('*', { count: 'exact', head: true });

if (countError) {
  console.error('Error fetching count:', countError);
} else {
  console.log(`Total rows in points_of_sale: ${count}`);
}

const { data: regionData, error: regError } = await supabase
  .from('points_of_sale')
  .select('region, cl, td, tz');

if (!regError) {
  const stats = { mx: 0, usa: 0, cl: 0, td: 0, tz: 0 };
  regionData.forEach(r => {
    if (r.region === 'mx') stats.mx++;
    if (r.region === 'usa') stats.usa++;
    if (r.cl) stats.cl++;
    if (r.td) stats.td++;
    if (r.tz) stats.tz++;
  });
  console.log('Import Statistics:', stats);
}
