// src/routes/data-revenue/+page.js

import * as d3 from 'd3';
import { readFileSync } from 'fs';
import { join } from 'path';

const ignoreColumns = [
  "NEON ID",
  "Org Name",
  "Primary Contact First name",
  "Last name",
  "Title",
  "Email",
  "Website",
  "Explain how you used AI Technology?",
  "Primary Focus Audience Group: Other/specify",
  "Zip Code",
  "V19B Desc_Audience",
  "V32D Republication_Terms",
  "VSQ2-2A Rev_OtherEarnText"
];

export async function load() {
  // Determine the path to the CSV file
  const filePath = join(process.cwd(), 'src/static', 'data2023.csv');

  // Read the CSV file content as a string
  const fileContent = readFileSync(filePath, 'utf8');

  // Parse the CSV content into an array of objects using D3
  const data = d3.csvParse(fileContent, d => {
    // Filter out keys that are in the ignoreColumns array
    const filteredData = {};
    for (const key in d) {
      if (!ignoreColumns.includes(key)) {
        filteredData[key] = d[key];
      }
    }
    return filteredData;
  });

  // Return the parsed data to the Svelte component
  return {
    props: {
      data
    }
  };
}
