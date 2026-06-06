<script lang="ts">
	import type { PatientResponseDTO } from '$lib/types';
	import { formatDate, formatBMI, getInitials } from '$lib/utils/formatters';
	import PatientStatusBadge from './PatientStatusBadge.svelte';
	import { User, Calendar, Droplets } from '@lucide/svelte';

	let { patient }: { patient: PatientResponseDTO } = $props();

	const initials = $derived(getInitials(patient.first_name, patient.last_name));
	const bmi = $derived(patient.latest_measurement?.bmi);
</script>

<a
	href="/patients/{patient.id}"
	class="fade-in group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#35403B] p-4 transition-all duration-200 hover:border-[#D4E79E]/20 hover:bg-[#3d4d45]"
>
	<!-- Avatar -->
	<div
		class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#D4E79E]/10 text-sm font-bold text-[#D4E79E] transition-colors group-hover:bg-[#D4E79E]/20"
	>
		{initials}
	</div>

	<!-- Info -->
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate text-sm font-semibold text-[#FDFBF7]">{patient.full_name}</p>
			<PatientStatusBadge status={patient.status} />
		</div>
		<p class="mt-0.5 text-xs text-[#FDFBF7]/40">MRN: {patient.mrn}</p>
	</div>

	<!-- Meta -->
	<div class="flex flex-col items-end gap-1 text-right">
		{#if bmi != null}
			<span class="clinical text-sm">{formatBMI(bmi)}</span>
			<span class="text-[10px] text-[#FDFBF7]/30 uppercase tracking-wide">BMI</span>
		{:else}
			<span class="text-xs text-[#FDFBF7]/20">No data</span>
		{/if}
	</div>
</a>
