<script lang="ts">
	import type { BodyMeasurementResponseDTO } from '$lib/types';
	import { formatDate, formatBMI, formatWeight, formatHeight, formatCalories } from '$lib/utils/formatters';
	import Card from '$lib/components/ui/Card.svelte';
	import { _ } from 'svelte-i18n';

	let { measurement }: { measurement: BodyMeasurementResponseDTO } = $props();
</script>

<Card class="fade-in">
	<div class="mb-3 flex items-center justify-between">
		<p class="text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
			{formatDate(measurement.measured_at, 'MMM d, yyyy HH:mm')}
		</p>
		{#if measurement.bmi_category}
			<span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-[#FDFBF7]/60">
				{measurement.bmi_category}
			</span>
		{/if}
	</div>

	<div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
		{#if measurement.height_cm != null}
			<div class="text-center">
				<p class="clinical text-lg">{measurement.height_cm.toFixed(1)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">cm</p>
			</div>
		{/if}
		{#if measurement.weight_kg != null}
			<div class="text-center">
				<p class="clinical text-lg">{measurement.weight_kg.toFixed(2)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">kg</p>
			</div>
		{/if}
		{#if measurement.bmi != null}
			<div class="text-center">
				<p class="clinical text-lg">{formatBMI(measurement.bmi)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmi')}</p>
			</div>
		{/if}
		{#if measurement.waist_cm != null}
			<div class="text-center">
				<p class="clinical text-lg">{measurement.waist_cm.toFixed(1)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.waist')}</p>
			</div>
		{/if}
		{#if measurement.hip_cm != null}
			<div class="text-center">
				<p class="clinical text-lg">{measurement.hip_cm.toFixed(1)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.hip')}</p>
			</div>
		{/if}
		{#if measurement.bmr_harris_benedict != null}
			<div class="text-center">
				<p class="clinical text-lg">{measurement.bmr_harris_benedict.toFixed(0)}</p>
				<p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmrKcal')}</p>
			</div>
		{/if}
	</div>
</Card>
