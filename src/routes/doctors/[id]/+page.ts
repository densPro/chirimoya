// src/routes/doctors/[id]/+page.ts
import type { PageLoad } from './$types';
import { getDoctorById } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const doctor = await getDoctorById(params.id);
	return { doctor };
};
