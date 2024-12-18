export const prerender = true;

export const load = async (event) => {
	try {
		// Fetch the JSON file
		const response = await event.fetch('/data/filteredData.json');

		if (!response.ok) {
			throw new Error(`Failed to load file: ${response.statusText}`);
		}

		const rawdata = await response.json();

		// Return the data to your Svelte component
		return {
			props: {
				rawdata
			}
		};
	} catch (error) {
		console.error(`Error fetching or parsing file: ${error.message}`);
		return {
			props: {
				rawdata: null // Fallback to null or a safe default
			},
			error: 'Error fetching or parsing file' // Optionally include an error message for the component
		};
	}
};
