<script lang="ts">
	import { onMount } from 'svelte';
	import type {
		DoctorResponseDTO,
		DoctorCreateDTO,
		DoctorUpdateDTO,
		DoctorSearchParams,
		DoctorStatus,
		SpecialtyResponseDTO
	} from '$lib/types';
	import {
		searchDoctors,
		createDoctor,
		updateDoctor,
		deactivateDoctor,
		listSpecialties
	} from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import DoctorTable from '$lib/components/doctors/DoctorTable.svelte';
	import DoctorForm from '$lib/components/doctors/DoctorForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { Plus } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	// ── State ────────────────────────────────────────────────────────────────
	let doctors     = $state<DoctorResponseDTO[]>([]);
	let total       = $state(0);
	let specialties = $state<SpecialtyResponseDTO[]>([]);
	let loading     = $state(true);
	let saving      = $state(false);

	let showModal  = $state(false);
	let editTarget = $state<DoctorResponseDTO | undefined>(undefined);

	// Filters
	let searchFirst   = $state('');
	let searchLast    = $state('');
	let filterStatus  = $state<DoctorStatus | ''>('');
	let filterSpec    = $state('');
	let limit         = $state(20);
	let offset        = $state(0);

	// Specialty lookup map
	const specialtyMap = $derived<Record<string, string>>(
		Object.fromEntries(specialties.map((s) => [s.id, s.name]))
	);

	const specialtyOptions = $derived([
		{ value: '', label: $_('doctors.allSpecialties') },
		...specialties.map((s) => ({ value: s.id, label: s.name }))
	]);

	const statusOptions = $derived([
		{ value: '',         label: $_('doctors.allStatuses') },
		{ value: 'active',   label: $_('status.active')        },
		{ value: 'inactive', label: $_('status.inactive')      },
		{ value: 'on_leave', label: $_('status.on_leave')      },
		{ value: 'retired',  label: $_('status.retired')        }
	]);

	// ── Data loading ──────────────────────────────────────────────────────────
	async function fetchDoctors() {
		loading = true;
		try {
			const params: DoctorSearchParams = {
				first_name:   searchFirst.trim()  || undefined,
				last_name:    searchLast.trim()   || undefined,
				specialty_id: filterSpec          || undefined,
				status:       (filterStatus as DoctorStatus) || undefined,
				limit,
				offset
			};
			const res = await searchDoctors(params);
			doctors = res.items;
			total   = res.total;
		} catch {
			addToast($_('doctors.toasts.loadFailed'), 'error');
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		[specialties] = await Promise.all([listSpecialties(), fetchDoctors()]);
	});

	// ── Search debounce ───────────────────────────────────────────────────────
	let debounceTimer: ReturnType<typeof setTimeout>;
	function onSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => { offset = 0; fetchDoctors(); }, 350);
	}

	// ── CRUD ─────────────────────────────────────────────────────────────────
	function openCreate() { editTarget = undefined; showModal = true; }
	function openEdit(d: DoctorResponseDTO) { editTarget = d; showModal = true; }

	async function handleSave(dto: DoctorCreateDTO | DoctorUpdateDTO) {
		saving = true;
		try {
			if (editTarget) {
				await updateDoctor(editTarget.id, dto as DoctorUpdateDTO);
				addToast($_('doctors.toasts.updateSuccess'), 'success');
			} else {
				await createDoctor(dto as DoctorCreateDTO);
				addToast($_('doctors.toasts.createSuccess'), 'success');
			}
			showModal = false;
			await fetchDoctors();
		} catch (e: unknown) {
			addToast(e instanceof Error ? e.message : 'Error', 'error');
		} finally {
			saving = false;
		}
	}

	async function handleDeactivate(d: DoctorResponseDTO) {
		if (!confirm(`¿Desactivar al Dr. ${d.full_name}? Se cambiará su estado a inactivo.`)) return;
		try {
			await deactivateDoctor(d.id);
			addToast($_('doctors.toasts.deactivateSuccess'), 'success');
			await fetchDoctors();
		} catch (e: unknown) {
			addToast(e instanceof Error ? e.message : 'Error', 'error');
		}
	}

	const modalTitle = $derived(editTarget ? $_('doctors.editTitle') : $_('doctors.createTitle'));
</script>

<svelte:head>
	<title>{$_('doctors.title')} · Chirimoya</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[#FDFBF7]">{$_('doctors.title')}</h2>
			<p class="mt-0.5 text-sm text-[#FDFBF7]/40">{$_('doctors.subtitle')}</p>
		</div>
		<Button onclick={openCreate} id="create-doctor-btn" class="w-full sm:w-auto justify-center">
			<Plus size={14} />
			{$_('doctors.new')}
		</Button>
	</div>

	<!-- Filters -->
	<div class="space-y-3 rounded-xl border border-white/[0.06] bg-[#35403B] p-4">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="relative">
				<input
					id="doc-search-first"
					type="text"
					bind:value={searchFirst}
					oninput={onSearchInput}
					placeholder={$_('form.labels.firstName') + '…'}
					class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
				/>
			</div>
			<input
				id="doc-search-last"
				type="text"
				bind:value={searchLast}
				oninput={onSearchInput}
				placeholder={$_('form.labels.lastName') + '…'}
				class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			/>
			<select
				id="doc-filter-status"
				bind:value={filterStatus}
				onchange={() => { offset = 0; fetchDoctors(); }}
				class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			>
				{#each statusOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
			<select
				id="doc-filter-specialty"
				bind:value={filterSpec}
				onchange={() => { offset = 0; fetchDoctors(); }}
				class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			>
				{#each specialtyOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-xs text-[#FDFBF7]/30">
				{#if !loading}{total} {$_('doctors.found')}{/if}
			</span>
			<button
				onclick={() => { searchFirst = ''; searchLast = ''; filterStatus = ''; filterSpec = ''; offset = 0; fetchDoctors(); }}
				class="text-xs text-[#FDFBF7]/30 transition-colors hover:text-[#FDFBF7]/60"
			>
				{$_('patients.clearFilters')}
			</button>
		</div>
	</div>


	<!-- Content -->
	{#if loading}
		<div class="flex justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if doctors.length === 0}
		<EmptyState
			icon="search"
			title={$_('doctors.emptyTitle')}
			message={$_('doctors.emptyMessage')}
		/>
		<div class="mt-4 flex justify-center">
			<Button onclick={openCreate}>{$_('doctors.new')}</Button>
		</div>
	{:else}
		<DoctorTable
			{doctors}
			{specialtyMap}
			onEdit={openEdit}
			onDeactivate={handleDeactivate}
		/>
		<Pagination
			{total}
			{limit}
			{offset}
			onChange={(o) => { offset = o; fetchDoctors(); }}
		/>
	{/if}
</div>

<!-- Modal -->
<Modal open={showModal} title={modalTitle} size="lg" onClose={() => (showModal = false)}>
	<DoctorForm
		doctor={editTarget}
		{specialties}
		onSave={handleSave}
		onCancel={() => (showModal = false)}
		loading={saving}
	/>
</Modal>
