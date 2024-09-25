import { readFileSync } from 'fs';
import { resolve } from 'path';

export const load = async () => {
  // Resolve the path to the JSON file
  const filePath = resolve('data/filteredData.json');

  // Read and parse the JSON file
  const rawdata = JSON.parse(readFileSync(filePath, 'utf-8'));

  // Return the parsed data to the Svelte component
  return {
    props: {
      rawdata
    }
  };
}
