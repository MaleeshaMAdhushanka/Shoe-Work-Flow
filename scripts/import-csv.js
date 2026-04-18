import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import Papa from 'papaparse';

async function importCSV() {
  try {
    console.log('Starting CSV import...');
    console.log('Database URL:', process.env.POSTGRES_URL ? 'Connected ✓' : 'Not found ✗');
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'sample_data.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (results.errors.length > 0) {
      console.error('CSV Parse errors:', results.errors);
      return;
    }

    const records = results.data;
    console.log(`Found ${records.length} records to import`);

    // Insert records in batches
    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      for (const record of batch) {
        try {
          await sql`
            INSERT INTO items (id, name, image, price, size, qty, status)
            VALUES (
              ${record.id},
              ${record.name},
              ${record.image},
              ${parseFloat(record.price)},
              ${record.size},
              ${parseInt(record.qty)},
              ${record.status}
            )
            ON CONFLICT (id) DO NOTHING
          `;
        } catch (error) {
          console.error(`Error inserting record ${record.id}:`, error.message);
        }
      }

      console.log(`Imported ${Math.min(i + batchSize, records.length)} / ${records.length} records`);
    }

    console.log('✅ CSV import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importCSV();
