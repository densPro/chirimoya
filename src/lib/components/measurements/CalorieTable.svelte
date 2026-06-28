<script lang="ts">
	import type { TotalCaloriesResponseDTO, StressCaloriesDTO } from '$lib/types';
	import { _ } from 'svelte-i18n';

	interface Props {
		calories: TotalCaloriesResponseDTO;
		formula: 'harris_benedict' | 'mifflin_st_jeor';
	}

	let { calories, formula }: Props = $props();

	const conditions: (keyof TotalCaloriesResponseDTO)[] = [
		'major_surgery',
		'minor_surgery',
		'mild_infection',
		'moderate_infection',
		'severe_infection',
		'trauma_with_impaired_consciousness',
		'burns_40_tbsa',
		'burns_100_tbsa',
		'cancer',
		'malnutrition',
		'traumatic_brain_injury'
	];

	const activityLevels: (keyof StressCaloriesDTO)[] = [
		'sedentary',
		'lightly_active',
		'moderately_active',
		'very_active'
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
					{$_('measurements.condition')}
				</th>
				{#each activityLevels as al}
					<th class="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						{$_('measurements.activity.' + al)}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-white/[0.04] bg-[#35403B]">
			{#each conditions as cond}
				{@const row = calories[cond]}
				<tr class="transition-colors hover:bg-white/[0.02]">
					<td class="px-4 py-2.5 font-medium text-[#FDFBF7]/80">{$_('measurements.conditions.' + cond)}</td>
					{#each activityLevels as al}
						<td class="px-3 py-2.5 text-center">
							<span class="clinical text-xs">{kcal(row?.[al])}</span>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<p class="mt-2 text-right text-[10px] text-[#FDFBF7]/30">
	{$_('measurements.formula')}: {formula === 'harris_benedict' ? 'Harris-Benedict' : 'Mifflin-St Jeor'} · {$_('measurements.valuesKcalDay')}
</p>
