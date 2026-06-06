<script lang="ts">
	import type { TotalCaloriesResponseDTO, StressCaloriesDTO } from '$lib/types';

	interface Props {
		calories: TotalCaloriesResponseDTO;
		formula: 'harris_benedict' | 'mifflin_st_jeor';
	}

	let { calories, formula }: Props = $props();

	const conditions: { key: keyof TotalCaloriesResponseDTO; label: string }[] = [
		{ key: 'major_surgery', label: 'Major Surgery' },
		{ key: 'minor_surgery', label: 'Minor Surgery' },
		{ key: 'mild_infection', label: 'Mild Infection' },
		{ key: 'moderate_infection', label: 'Moderate Infection' },
		{ key: 'severe_infection', label: 'Severe Infection' },
		{ key: 'trauma_with_impaired_consciousness', label: 'Trauma w/ Impaired Consciousness' },
		{ key: 'burns_40_tbsa', label: 'Burns 40% TBSA' },
		{ key: 'burns_100_tbsa', label: 'Burns 100% TBSA' },
		{ key: 'cancer', label: 'Cancer' },
		{ key: 'malnutrition', label: 'Malnutrition' },
		{ key: 'traumatic_brain_injury', label: 'Traumatic Brain Injury' }
	];

	const activityLevels: { key: keyof StressCaloriesDTO; label: string }[] = [
		{ key: 'sedentary', label: 'Sedentary' },
		{ key: 'lightly_active', label: 'Lightly Active' },
		{ key: 'moderately_active', label: 'Moderately Active' },
		{ key: 'very_active', label: 'Very Active' }
	];

	function kcal(v?: number): string {
		if (v == null) return '—';
		return `${v.toFixed(0)}`;
	}
</script>

<div class="overflow-x-auto rounded-xl border border-white/[0.06]">
	<table class="w-full text-xs">
		<thead>
			<tr class="border-b border-white/[0.06] bg-[#2C3531]/50">
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					Condition
				</th>
				{#each activityLevels as al (al.key)}
					<th class="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						{al.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-white/[0.04] bg-[#35403B]">
			{#each conditions as cond (cond.key)}
				{@const row = calories[cond.key]}
				<tr class="transition-colors hover:bg-white/[0.02]">
					<td class="px-4 py-2.5 font-medium text-[#FDFBF7]/80">{cond.label}</td>
					{#each activityLevels as al (al.key)}
						<td class="px-3 py-2.5 text-center">
							<span class="clinical text-xs">{kcal(row?.[al.key])}</span>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<p class="mt-2 text-right text-[10px] text-[#FDFBF7]/30">
	Formula: {formula === 'harris_benedict' ? 'Harris-Benedict' : 'Mifflin-St Jeor'} · Values in kcal/day
</p>
