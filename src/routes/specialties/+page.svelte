<script lang="ts">
	import { onMount } from 'svelte';
	import type { SpecialtyResponseDTO, SpecialtyCreateDTO, SpecialtyUpdateDTO } from '$lib/types';
	import {
		listSpecialties,
		createSpecialty,
		updateSpecialty,
		deactivateSpecialty
	} from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import SpecialtyTable from '$lib/components/specialties/SpecialtyTable.svelte';
	import SpecialtyForm from '$lib/components/specialties/SpecialtyForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { Plus } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	let specialties = $state<SpecialtyResponseDTO[]>([]);
	let loading = $state(true);
	let saving = $state(false);

	let showModal = $state(false);
	let editTarget = $state<SpecialtyResponseDTO | undefined>(undefined);
	let activeOnly = $state(false);

	async function fetchSpecialties() {
		loading = true;
		try {
			specialties = await listSpecialties(activeOnly);
		} catch {
			addToast($_('specialties.toasts.loadFailed'), 'error');
		} finally {
			loading = false;
		}
	}

	onMount(fetchSpecialties);

	function openCreate() {
		editTarget = undefined;
		showModal = true;
	}

	function openEdit(s: SpecialtyResponseDTO) {
		editTarget = s;
		showModal = true;
	}

	async function handleSave(dto: SpecialtyCreateDTO | SpecialtyUpdateDTO) {
		saving = true;
		try {
			if (editTarget) {
				await updateSpecialty(editTarget.id, dto as SpecialtyUpdateDTO);
				addToast($_('specialties.toasts.updateSuccess'), 'success');
			} else {
				await createSpecialty(dto as SpecialtyCreateDTO);
				addToast($_('specialties.toasts.createSuccess'), 'success');
			}
			showModal = false;
			await fetchSpecialties();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Error';
			addToast(msg, 'error');
		} finally {
			saving = false;
		}
	}

	async function handleDeactivate(s: SpecialtyResponseDTO) {
		if (!confirm(`Deactivate specialty "${s.name}"? Existing doctor links will be preserved.`)) return;
		try {
			await deactivateSpecialty(s.id);
			addToast($_('specialties.toasts.deactivateSuccess'), 'success');
			await fetchSpecialties();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Error';
			addToast(msg, 'error');
		}
	}

	const modalTitle = $derived(editTarget ? $_('specialties.editTitle') : $_('specialties.createTitle'));
	const filtered = $derived(activeOnly ? specialties.filter((s) => s.is_active) : specialties);
</script>

<svelte:head>
	<title>{$_('specialties.title')} · Chirimoya</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[#FDFBF7]">{$_('specialties.title')}</h2>
			<p class="mt-0.5 text-sm text-[#FDFBF7]/40">{$_('specialties.subtitle')}</p>
		</div>
		<Button onclick={openCreate} id="create-specialty-btn">
			<Plus size={14} />
			{$_('specialties.new')}
		</Button>
	</div>

	<!-- Filter card — same style as patients page -->
	<div class="rounded-xl border border-white/[0.06] bg-[#35403B] p-4">
		<div class="flex items-center justify-between">
			<label class="flex cursor-pointer items-center gap-2 text-xs text-[#FDFBF7]/50">
				<input
					type="checkbox"
					bind:checked={activeOnly}
					onchange={fetchSpecialties}
					class="accent-[#D4E79E]"
				/>
				{$_('specialties.activeOnly')}
			</label>
			<span class="text-xs text-[#FDFBF7]/30">
				{#if !loading}{filtered.length} {$_('specialties.count')}{/if}
			</span>
		</div>
	</div>

	<!-- Content -->
	{#if loading}
		<div class="flex justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			icon="default"
			title={$_('specialties.emptyTitle')}
			message={$_('specialties.emptyMessage')}
		/>
		<div class="mt-4 flex justify-center">
			<Button onclick={openCreate}>{$_('specialties.new')}</Button>
		</div>
	{:else}
		<SpecialtyTable
			specialties={filtered}
			onEdit={openEdit}
			onDeactivate={handleDeactivate}
		/>
	{/if}

</div>

<!-- Modal -->
<Modal open={showModal} title={modalTitle} size="md" onClose={() => (showModal = false)}>
	<SpecialtyForm
		specialty={editTarget}
		onSave={handleSave}
		onCancel={() => (showModal = false)}
		loading={saving}
	/>
</Modal>
