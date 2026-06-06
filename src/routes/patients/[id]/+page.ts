import { getPatientById } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const patient = await getPatientById(params.id);
		return { patient };
	} catch (err: unknown) {
		const status = (err as { status?: number }).status ?? 500;
		const message = err instanceof Error ? err.message : 'Patient not found';
		throw error(status === 404 ? 404 : 500, message);
	}
};
