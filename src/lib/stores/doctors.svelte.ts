// src/lib/stores/doctors.svelte.ts
import type { DoctorResponseDTO, DoctorSearchParams } from '$lib/types';
import { searchDoctors } from '$lib/api';

let items = $state<DoctorResponseDTO[]>([]);
let total = $state(0);
let loading = $state(false);
let error = $state<string | null>(null);
let params = $state<DoctorSearchParams>({ limit: 20, offset: 0 });

export async function loadDoctors(newParams?: DoctorSearchParams): Promise<void> {
	if (newParams) params = { ...params, ...newParams, offset: newParams.offset ?? 0 };
	loading = true;
	error = null;
	try {
		const res = await searchDoctors(params);
		items = res.items;
		total = res.total;
	} catch (e) {
		error = e instanceof Error ? e.message : 'Failed to load doctors';
	} finally {
		loading = false;
	}
}

export function getDoctorsStore() {
	return {
		get items() {
			return items;
		},
		get total() {
			return total;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get params() {
			return params;
		},
		load: loadDoctors
	};
}
