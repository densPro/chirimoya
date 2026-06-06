// src/lib/stores/patients.svelte.ts
import type { PatientResponseDTO, PatientSearchParams, PatientStatus } from '$lib/types';
import { searchPatients } from '$lib/api';

export interface PatientsStoreState {
	items: PatientResponseDTO[];
	total: number;
	loading: boolean;
	error: string | null;
	params: PatientSearchParams;
}

let state = $state<PatientsStoreState>({
	items: [],
	total: 0,
	loading: false,
	error: null,
	params: {
		limit: 20,
		offset: 0
	}
});

export function getPatientsState() {
	return state;
}

export function setSearchParams(params: Partial<PatientSearchParams>): void {
	state.params = { ...state.params, ...params, offset: 0 };
}

export function setPage(offset: number): void {
	state.params = { ...state.params, offset };
}

export function setStatusFilter(status: PatientStatus | undefined): void {
	state.params = { ...state.params, status, offset: 0 };
}

export async function loadPatients(): Promise<void> {
	state.loading = true;
	state.error = null;
	try {
		const result = await searchPatients(state.params);
		state.items = result.items;
		state.total = result.total;
	} catch (err) {
		state.error = err instanceof Error ? err.message : 'Failed to load patients';
	} finally {
		state.loading = false;
	}
}

export function resetPatients(): void {
	state = {
		items: [],
		total: 0,
		loading: false,
		error: null,
		params: { limit: 20, offset: 0 }
	};
}
