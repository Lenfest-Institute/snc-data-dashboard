// src/routes/data-revenue/+page.js

import * as d3 from 'd3';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function load() {
  // Determine the path to the CSV file
  const filePath = join(process.cwd(), 'src/static', 'data2023.csv');

  // Read the CSV file content as a string
  const fileContent = readFileSync(filePath, 'utf8');

  // Parse the CSV content into an array of objects using D3
  const data = d3.csvParse(fileContent);

  // Return the parsed data to the Svelte component
  return {
    props: {
      data
    }
  };
}
