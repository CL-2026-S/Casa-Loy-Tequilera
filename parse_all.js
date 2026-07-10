import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const dirPath = './sucursales_extracted/Sucursales';
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.xlsx'));

// We want to extract:
// - retailer (Nombre Comercial)
// - name (Sucursal)
// - address (Dirección)
// - region (mx or usa)
// - postal_code
// - latitude
// - longitude
// - maps_url (Maps)
// - is_active (true)
// - fase (KAM)
// and product booleans:
// - casa_loy_blanco
// - casa_loy_reposado
// - casa_loy_cristalino
// - casa_loy_anejo
// - casa_loy_piedra_y_agave_blanco
// - taddel_plata
// - taddel_reposado
// - taddel_cristalino
// - tierra_zafiro_blanco
// - tierra_zafiro_blanco_100_pure
// - tierra_zafiro_reposado
// - tierra_zafiro_cristalino

const allStores = [];

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const workbook = XLSX.readFile(filePath);
  
  workbook.SheetNames.forEach(sheetName => {
    if (sheetName === 'PDV y CDC') {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      // Data starts at row 3 (0-indexed index 3)
      for (let i = 3; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || !row[0]) continue; // skip empty rows
        
        const retailer = (row[0] || '').toString().trim();
        const state = (row[1] || '').toString().trim();
        const name = (row[2] || '').toString().trim() || 'Matriz';
        const address = (row[3] || '').toString().trim();
        const horarío = (row[4] || '').toString().trim();
        const maps_url = (row[5] || '').toString().trim();
        const kam = (row[6] || '').toString().trim();
        
        // Extract postal code from address
        let postal_code = null;
        const cpMatch = address.match(/CP\s*(\d{5})/i) || address.match(/C\.P\s*(\d{5})/i) || address.match(/\b(\d{5})\b/);
        if (cpMatch) {
          postal_code = cpMatch[1];
        }
        
        // Determine region
        const isUSA = address.toLowerCase().includes('usa') || address.toLowerCase().includes('united states') || state.toLowerCase() === 'ca' || state.toLowerCase() === 'california';
        const region = isUSA ? 'usa' : 'mx';
        
        // Helper to check if checkmark is present
        const isChecked = (val) => {
          if (!val) return false;
          const s = val.toString().trim().toLowerCase();
          return s === 'x' || s === 'true' || s === 'si' || s === 'sí' || s === '1';
        };
        
        // Map product columns (based on our column index mapping)
        const casa_loy_blanco = isChecked(row[11]);
        const casa_loy_reposado = isChecked(row[12]);
        const casa_loy_cristalino = isChecked(row[13]);
        const casa_loy_anejo = isChecked(row[14]);
        const casa_loy_piedra_y_agave_blanco = isChecked(row[15]);
        
        const taddel_plata = isChecked(row[17]) || isChecked(row[18]);
        const taddel_reposado = isChecked(row[19]) || isChecked(row[20]);
        const taddel_cristalino = isChecked(row[21]);
        
        const tierra_zafiro_blanco = isChecked(row[23]) || isChecked(row[24]);
        const tierra_zafiro_blanco_100_pure = isChecked(row[25]);
        const tierra_zafiro_reposado = isChecked(row[26]) || isChecked(row[27]);
        const tierra_zafiro_cristalino = isChecked(row[28]);
        
        allStores.push({
          file,
          retailer,
          name,
          address,
          region,
          postal_code,
          latitude: null,
          longitude: null,
          maps_url,
          is_active: true,
          fase: kam,
          casa_loy_blanco,
          casa_loy_reposado,
          casa_loy_cristalino,
          casa_loy_anejo,
          casa_loy_piedra_y_agave_blanco,
          taddel_plata,
          taddel_reposado,
          taddel_cristalino,
          tierra_zafiro_blanco,
          tierra_zafiro_blanco_100_pure,
          tierra_zafiro_reposado,
          tierra_zafiro_cristalino
        });
      }
    } else if (sheetName === 'Dirección') {
      // For Isaac Gomez which only has address list
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || !row[1]) continue;
        
        const client = (row[0] || '').toString().trim();
        const retailer = (row[1] || '').toString().trim();
        const municipio = (row[2] || '').toString().trim();
        const state = (row[3] || '').toString().trim();
        const name = (row[4] || '').toString().trim() || 'Matriz';
        const address = (row[5] || '').toString().trim();
        
        let postal_code = null;
        const cpMatch = address.match(/CP\s*(\d{5})/i) || address.match(/C\.P\s*(\d{5})/i) || address.match(/\b(\d{5})\b/);
        if (cpMatch) {
          postal_code = cpMatch[1];
        }
        
        const isUSA = address.toLowerCase().includes('usa') || address.toLowerCase().includes('united states') || state.toLowerCase() === 'ca' || state.toLowerCase() === 'california';
        const region = isUSA ? 'usa' : 'mx';
        
        allStores.push({
          file,
          retailer,
          name,
          address: address || `${retailer}, ${municipio}, ${state}`,
          region,
          postal_code,
          latitude: null,
          longitude: null,
          maps_url: null,
          is_active: true,
          fase: 'Isaac Gomez',
          casa_loy_blanco: false,
          casa_loy_reposado: false,
          casa_loy_cristalino: false,
          casa_loy_anejo: false,
          casa_loy_piedra_y_agave_blanco: false,
          taddel_plata: false,
          taddel_reposado: false,
          taddel_cristalino: false,
          tierra_zafiro_blanco: false,
          tierra_zafiro_blanco_100_pure: false,
          tierra_zafiro_reposado: false,
          tierra_zafiro_cristalino: false
        });
      }
    }
  });
});

console.log(`Total stores parsed: ${allStores.length}`);
console.log(`Unique files processed: ${Array.from(new Set(allStores.map(s => s.file)))}`);

// Print sample
console.log(`\nSample parsed store:`, allStores[0]);
console.log(`\nSample parsed store 50:`, allStores[50]);
