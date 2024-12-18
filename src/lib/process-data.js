// node-revenue-script.js

import * as d3 from 'd3';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ignoreColumns = [
	'NEON ID',
	'Org Name',
	'Primary Contact First name',
	'Last name',
	'Title',
	'Email',
	'Website',
	'Explain how you used AI Technology?',
	'Primary Focus Audience Group: Other/specify',
	'Zip Code',
	'Country',
	'State',
	'Province',
	'Postal Code',
	'City',
	'V19B Desc_Audience',
	'V32D Republication_Terms',
	'VSQ2-2A Rev_OtherEarnText'
];

// Function to load and process CSV data
async function load() {
	// Determine the path to the CSV file
	const filePath = join(process.cwd(), 'src/static', 'data2023.csv');

	// Read the CSV file content as a string
	const fileContent = readFileSync(filePath, 'utf8');

	// Parse the CSV content into an array of objects using D3
	const data = d3.csvParse(fileContent, (d) => {
		// Filter out keys that are in the ignoreColumns array
		const filteredData = {};
		for (const key in d) {
			if (!ignoreColumns.includes(key)) {
				if (typeof d[key] === 'string') {
					if (d[key].trim().substring(0, 2) === '$ ') {
						if (d[key].trim() === '$ -') {
							filteredData[key] = '';
						} else {
							filteredData[key] = parseFloat(d[key].replace(/[$,]/g, ''));
						}
					} else {
						filteredData[key] = d[key].trim();
					}
				} else {
					filteredData[key] = d[key];
				}
			}
		}
		return filteredData;
	});

	// Write the filtered data to a JSON file
	const outputFilePath = join(process.cwd(), 'static/data', 'filteredData.json');
	writeFileSync(outputFilePath, JSON.stringify(data, null, 2));

	console.log(`Filtered data has been written to ${outputFilePath}`);
}

// Execute the load function
load().catch((err) => {
	console.error('Error processing CSV:', err);
});
