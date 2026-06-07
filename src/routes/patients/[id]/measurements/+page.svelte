<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { listMeasurements, getPatientById, addMeasurement } from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import type { BodyMeasurementResponseDTO, PatientResponseDTO, BodyMeasurementCreateDTO } from '$lib/types';
	import BMIGauge from '$lib/components/measurements/BMIGauge.svelte';
	import MeasurementTimeline from '$lib/components/measurements/MeasurementTimeline.svelte';
	import MeasurementForm from '$lib/components/measurements/MeasurementForm.svelte';
	import CalorieTable from '$lib/components/measurements/CalorieTable.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { ArrowLeft, Plus } from '@lucide/svelte';
	import { formatBMI, formatWeight, formatHeight, formatCalories } from '$lib/utils/formatters';
	import { _ } from 'svelte-i18n';

	const patientId = $derived($page.params.id ?? '');

	let patient = $state<PatientResponseDTO | null>(null);
	let measurements = $state<BodyMeasurementResponseDTO[]>([]);
	let total = $state(0);
	let offset = $state(0);
	const LIMIT = 20;

	let loading = $state(true);
	let addModalOpen = $state(false);
	let addLoading = $state(false);

	const latest = $derived(measurements[0] ?? null);

	async function load() {
		loading = true;
		try {
			const [p, mRes] = await Promise.all([
				getPatientById(patientId),
				listMeasurements(patientId, LIMIT, offset)
			]);
			patient = p;
			measurements = mRes.items;
			total = mRes.total;
		} catch (err) {
			addToast(err instanceof Error ? err.message : $_('measurements.toasts.loadFailed'), 'error');
		} finally {
			loading = false;
		}
	}

	async function handleAddMeasurement(dto: BodyMeasurementCreateDTO) {
		addLoading = true;
		try {
			await addMeasurement(patientId, dto);
			addToast($_('measurements.toasts.saveSuccess'), 'success');
			addModalOpen = false;
			offset = 0;
			await load();
		} catch (err) {
			addToast(err instanceof Error ? err.message : $_('measurements.toasts.saveFailed'), 'error');
			throw err;
		} finally {
			addLoading = false;
		}
	}

	onMount(() => load());
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a
				href="/patients/{patientId}"
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#FDFBF7]/50 transition-colors hover:border-white/20 hover:text-[#FDFBF7]"
			>
				<ArrowLeft size={16} />
			</a>
			<div>
				<h2 class="text-2xl font-bold text-[#FDFBF7]">
					{patient ? $_('measurements.title', { values: { name: patient.full_name } }) : $_('measurements.defaultTitle')}
				</h2>
				<p class="text-sm text-[#FDFBF7]/40">{$_('measurements.recordsCount', { values: { total } })}</p>
			</div>
		</div>
		<Button variant="primary" onclick={() => (addModalOpen = true)}>
			<Plus size={16} />
			{$_('measurements.recordMeasurement')}
		</Button>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<Spinner size="lg" />
		</div>
	{:else}
		<!-- Top row: BMI Gauge + metric summary -->
		{#if latest}
			<div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<!-- BMI Gauge -->
				<Card>
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('measurements.latestBmi')}</h3>
					<BMIGauge bmi={latest.bmi} category={latest.bmi_category} />
				</Card>

				<!-- Metrics -->
				<Card class="lg:col-span-2">
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('measurements.latestMeasurements')}</h3>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{#if latest.height_cm != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.height_cm.toFixed(1)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.height')}</p>
							</div>
						{/if}
						{#if latest.weight_kg != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.weight_kg.toFixed(2)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.weight')}</p>
							</div>
						{/if}
						{#if latest.waist_cm != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.waist_cm.toFixed(1)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.waist')}</p>
							</div>
						{/if}
						{#if latest.hip_cm != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.hip_cm.toFixed(1)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.hip')}</p>
							</div>
						{/if}
						{#if latest.bmr_harris_benedict != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.bmr_harris_benedict.toFixed(0)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmrHb')}</p>
							</div>
						{/if}
						{#if latest.bmr_mifflin_st_jeor != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.bmr_mifflin_st_jeor.toFixed(0)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmrMsj')}</p>
							</div>
						{/if}
						{#if latest.healthy_weight != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.healthy_weight.toFixed(1)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.healthyWeight')}</p>
							</div>
						{/if}
						{#if latest.bmi != null}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-xl">{latest.bmi.toFixed(2)}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmi')}</p>
							</div>
						{/if}
					</div>
				</Card>
			</div>

			<!-- TDEE Breakdown -->
			{#if latest.tdee_harris_benedict}
				<Card>
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('measurements.tdee')}</h3>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{#each [
							{ key: 'sedentary', label: 'Sedentary' },
							{ key: 'lightly_active', label: 'Lightly Active' },
							{ key: 'moderately_active', label: 'Moderately Active' },
							{ key: 'very_active', label: 'Very Active' }
						] as act (act.key)}
							<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center">
								<p class="clinical text-lg">{(latest.tdee_harris_benedict as any)[act.key]?.toFixed(0) ?? '—'}</p>
								<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.activity.' + act.key)}</p>
							</div>
						{/each}
					</div>
				</Card>
			{/if}

			<!-- Clinical Calorie Table -->
			{#if latest.total_calories_harris_benedict}
				<Card>
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						{$_('measurements.calorieRequirements')}
					</h3>
					<CalorieTable calories={latest.total_calories_harris_benedict} formula="harris_benedict" />
				</Card>
			{/if}
		{/if}

		<!-- Timeline -->
		<div>
			<h3 class="mb-4 text-sm font-semibold text-[#FDFBF7]/70">{$_('measurements.timeline')}</h3>
			{#if measurements.length === 0}
				<div class="rounded-xl border border-white/[0.06] bg-[#35403B] p-8 text-center">
					<p class="text-sm text-[#FDFBF7]/30">{$_('measurements.noMeasurements')}</p>
					<button
						onclick={() => (addModalOpen = true)}
						class="mt-3 text-sm font-medium text-[#D4E79E] hover:underline"
					>
						{$_('measurements.recordFirst')}
					</button>
				</div>
			{:else}
				<MeasurementTimeline {measurements} />
				<div class="mt-4">
					<Pagination
						{total}
						limit={LIMIT}
						{offset}
						onChange={(o) => { offset = o; load(); }}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Add Measurement Modal -->
<Modal bind:open={addModalOpen} title={$_('measurements.recordMeasurement')} size="md" onClose={() => (addModalOpen = false)}>
	<MeasurementForm
		onSave={handleAddMeasurement}
		onCancel={() => (addModalOpen = false)}
		loading={addLoading}
	/>
</Modal>
