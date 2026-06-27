// src/lib/stores/specialties.svelte.ts
import type { SpecialtyResponseDTO } from '$lib/types';
import { listSpecialties } from '$lib/api';

let specialties = $state<SpecialtyResponseDTO[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);
let loaded = $state(false);

export async function loadSpecialties(activeOnly = false, force = false): Promise<void> {
	if (loaded && !force) return;
	loading = true;
	error = null;
	try {
		specialties = await listSpecialties(activeOnly);
		loaded = true;
	} catch (e) {
		error = e instanceof Error ? e.message : 'Failed to load specialties';
	} finally {
		loading = false;
	}
}

export function getSpecialtiesStore() {
	return {
		get specialties() {
			return specialties;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get loaded() {
			return loaded;
		},
		reload: (activeOnly = false) => loadSpecialties(activeOnly, true),
		findById: (id: string) => specialties.find((s) => s.id === id)
	};
}
