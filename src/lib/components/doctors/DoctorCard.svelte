<script lang="ts">
	import type { DoctorResponseDTO } from '$lib/types';
	import DoctorStatusBadge from './DoctorStatusBadge.svelte';
	import { Stethoscope } from '@lucide/svelte';

	interface Props {
		doctor: DoctorResponseDTO;
		specialtyName?: string;
	}

	let { doctor, specialtyName }: Props = $props();

	const initials = $derived(
		`${doctor.first_name[0] ?? ''}${doctor.last_name[0] ?? ''}`.toUpperCase()
	);
</script>

<a
	href="/doctors/{doctor.id}"
	class="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#35403B]/60 p-3 transition-all duration-200 hover:border-[#D4E79E]/20 hover:bg-[#35403B]"
>
	<!-- Avatar -->
	<div
		class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D4E79E]/15 font-mono text-sm font-bold text-[#D4E79E]"
	>
		{initials}
	</div>

	<!-- Info -->
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate text-sm font-medium text-[#FDFBF7]">{doctor.full_name}</p>
			<DoctorStatusBadge status={doctor.status} />
		</div>
		<div class="mt-0.5 flex items-center gap-2">
			<span class="font-mono text-xs text-[#D4E79E]/60">{doctor.employee_id}</span>
			{#if specialtyName}
				<span class="text-xs text-[#FDFBF7]/30">·</span>
				<span class="flex items-center gap-1 text-xs text-[#FDFBF7]/40">
					<Stethoscope size={10} />
					{specialtyName}
				</span>
			{/if}
			{#if doctor.years_of_experience != null}
				<span class="text-xs text-[#FDFBF7]/30">· {doctor.years_of_experience} yrs exp.</span>
			{/if}
		</div>
	</div>
</a>
