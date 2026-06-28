<script lang="ts">
	import type { BodyMeasurementCreateDTO } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { validateMeasurementCreate } from '$lib/utils/validators';
	import { _ } from 'svelte-i18n';

	interface Props {
		onSave: (dto: BodyMeasurementCreateDTO) => Promise<void>;
		onCancel: () => void;
		loading?: boolean;
	}

	let { onSave, onCancel, loading = false }: Props = $props();

	let heightCm = $state('');
	let weightKg = $state('');
	let waistCm = $state('');
	let hipCm = $state('');
	let measuredAt = $state(new Date().toISOString().slice(0, 16));
	let errors = $state<Record<string, string>>({});
	let globalError = $state('');

	async function handleSubmit() {
		errors = {};
		globalError = '';

		const data = {
			height_cm: heightCm !== '' ? Number(heightCm) : undefined,
			weight_kg: weightKg !== '' ? Number(weightKg) : undefined,
			waist_cm: waistCm !== '' ? Number(waistCm) : undefined,
			hip_cm: hipCm !== '' ? Number(hipCm) : undefined
		};

		const validation = validateMeasurementCreate(data as Record<string, unknown>);
		if (!validation.valid) {
			errors = validation.errors;
			return;
		}

		try {
			await onSave({
				...data,
				measured_at: measuredAt ? new Date(measuredAt).toISOString() : undefined
			});
		} catch (err) {
			globalError = err instanceof Error ? err.message : $_('measurements.toasts.saveFailed');
		}
	}
</script>

<div class="space-y-5 p-6">
	<p class="text-sm text-[#FDFBF7]/50">
		{$_('measurements.recordInstruction')}
	</p>

	{#if errors.general}
		<div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-300">
			{errors.general}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-4">
		<Input
			id="height_cm"
			label={$_('measurements.heightLabel')}
			type="number"
			bind:value={heightCm}
			placeholder="e.g. 165"
			hint={$_('form.optional')}
		/>
		<Input
			id="weight_kg"
			label={$_('measurements.weightLabel')}
			type="number"
			bind:value={weightKg}
			placeholder="e.g. 70.5"
			hint={$_('form.optional')}
		/>
		<Input
			id="waist_cm"
			label={$_('measurements.waistLabel')}
			type="number"
			bind:value={waistCm}
			placeholder="e.g. 85"
			hint={$_('form.optional')}
		/>
		<Input
			id="hip_cm"
			label={$_('measurements.hipLabel')}
			type="number"
			bind:value={hipCm}
			placeholder="e.g. 95"
			hint={$_('form.optional')}
		/>
		<Input
			id="measured_at"
			label={$_('measurements.measuredAtLabel')}
			type="datetime-local"
			bind:value={measuredAt}
			class="col-span-2"
		/>
	</div>

	{#if globalError}
		<p class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 whitespace-pre-wrap">
			{globalError}
		</p>
	{/if}

	<div class="flex items-center justify-end gap-3 pt-2">
		<Button variant="ghost" onclick={onCancel}>{$_('form.cancel')}</Button>
		<Button variant="primary" {loading} onclick={handleSubmit} type="button">
			{$_('measurements.recordMeasurement')}
		</Button>
	</div>
</div>
