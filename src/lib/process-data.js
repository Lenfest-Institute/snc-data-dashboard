import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as d3 from 'd3-dsv';

const ignoreColumns = [
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
async function load(filePath) {
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

// Get the filePath from command-line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
	console.error('Please provide the path to the CSV file as an argument.');
	process.exit(1);
}

const filePath = args[0];

// Call the load function with the provided filePath
load(filePath)
	.then((data) => {
		console.log('Data loaded successfully:', data);
	})
	.catch((error) => {
		console.error('Error loading data:', error);
	});
