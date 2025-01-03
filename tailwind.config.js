import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { lenfestTheme } from './tailwind-theme-lenfest';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				custom: [lenfestTheme]
			}
		}) // Skeleton must come last in this list.
	]
};
