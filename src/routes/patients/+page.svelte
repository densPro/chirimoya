<script lang="ts">
	import { onMount } from 'svelte';
	import { searchPatients, updatePatient } from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import type { PatientResponseDTO, PatientUpdateDTO, PatientStatus } from '$lib/types';
	import PatientTable from '$lib/components/patients/PatientTable.svelte';
	import PatientSearchBar from '$lib/components/patients/PatientSearchBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import PatientForm from '$lib/components/patients/PatientForm.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Plus } from '@lucide/svelte';

	const LIMIT = 20;

	let patients = $state<PatientResponseDTO[]>([]);
	let total = $state(0);
	let offset = $state(0);
	let loading = $state(true);
	let searchParams = $state<Record<string, string | undefined>>({});

	// Edit modal
	let editingPatient = $state<PatientResponseDTO | undefined>(undefined);
	let editModalOpen = $state(false);
	let editLoading = $state(false);

	async function load() {
		loading = true;
		try {
			const res = await searchPatients({ ...searchParams as any, limit: LIMIT, offset });
			patients = res.items;
			total = res.total;
		} catch (err) {
			addToast(err instanceof Error ? err.message : 'Failed to load patients', 'error');
		} finally {
			loading = false;
		}
	}

	function handleSearch(params: Record<string, string | undefined>) {
		searchParams = params;
		offset = 0;
		load();
	}

	function handlePageChange(newOffset: number) {
		offset = newOffset;
		load();
	}

	function openEdit(patient: PatientResponseDTO) {
		editingPatient = patient;
		editModalOpen = true;
	}

	async function handleEditSave(dto: PatientUpdateDTO) {
		if (!editingPatient) return;
		editLoading = true;
		try {
			await updatePatient(editingPatient.id, dto);
			addToast('Patient updated successfully', 'success');
			editModalOpen = false;
			editingPatient = undefined;
			await load();
		} catch (err) {
			addToast(err instanceof Error ? err.message : 'Failed to update patient', 'error');
			throw err;
		} finally {
			editLoading = false;
		}
	}

	onMount(() => load());
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[#FDFBF7]">Patients</h2>
			{#if !loading}
				<p class="mt-0.5 text-sm text-[#FDFBF7]/40">{total} patient{total !== 1 ? 's' : ''} found</p>
			{/if}
		</div>
		<Button variant="primary" onclick={() => (window.location.href = '/patients/new')}>
			<Plus size={16} />
			New Patient
		</Button>
	</div>

	<PatientSearchBar onSearch={handleSearch} />

	{#if loading}
		<div class="space-y-3">
			{#each [0, 1, 2, 3, 4] as i (i)}
				<div class="skeleton h-14 rounded-xl"></div>
			{/each}
		</div>
	{:else if patients.length === 0}
		<EmptyState
			title="No patients found"
			message="Try adjusting your search filters or add a new patient."
			icon="search"
		/>
	{:else}
		<PatientTable {patients} onEdit={openEdit} />
		<Pagination {total} limit={LIMIT} {offset} onChange={handlePageChange} />
	{/if}
</div>

<!-- Edit Modal -->
<Modal bind:open={editModalOpen} title="Edit Patient" size="xl" onClose={() => (editModalOpen = false)}>
	{#if editingPatient}
		<PatientForm
			patient={editingPatient}
			onSave={handleEditSave}
			onCancel={() => (editModalOpen = false)}
			loading={editLoading}
		/>
	{/if}
</Modal>
