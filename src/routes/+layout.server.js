import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export const load = async () => {
  // Resolve the path to the JSON file
  const filePath = resolve('static/data/filteredData.json');

  // Check if the file exists
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return {
      props: {
        rawdata: null, // Fallback to null or a safe default
      },
      error: 'File not found', // Optionally include an error message for the component
    };
  }

  try {
    // Read and parse the JSON file
    const rawdata = JSON.parse(readFileSync(filePath, 'utf-8'));

    // Return the parsed data to the Svelte component
    return {
      props: {
        rawdata,
      },
    };
  } catch (error) {
    console.error(`Error reading or parsing file: ${error.message}`);
    return {
      props: {
        rawdata: null, // Fallback to null or a safe default
      },
      error: 'Error reading or parsing file', // Optionally include an error message for the component
    };
  }
};
