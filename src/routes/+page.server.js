import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(
		307,
		process.env.NODE_ENV === 'production' ? '/snc-data-dashboard/audience' : '/audience'
	);
}
