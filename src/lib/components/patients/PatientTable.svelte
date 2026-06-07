<script lang="ts">
	import type { PatientResponseDTO } from '$lib/types';
	import { formatDate, formatBMI, getInitials } from '$lib/utils/formatters';
	import PatientStatusBadge from './PatientStatusBadge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Eye, Pencil } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		patients: PatientResponseDTO[];
		onEdit: (patient: PatientResponseDTO) => void;
	}

	let { patients, onEdit }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-white/[0.06]">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-white/[0.06] bg-[#2C3531]/50">
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.mrn')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.name')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.demographics.dob')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.age')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.gender')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.medical.bloodType')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.status')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.measurements.bmi')}</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patients.columns.actions')}</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-white/[0.04] bg-[#35403B]">
			{#each patients as p (p.id)}
				<tr class="transition-colors hover:bg-white/[0.02]">
					<td class="px-4 py-3">
						<span class="clinical text-xs">{p.mrn}</span>
					</td>
					<td class="px-4 py-3">
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#D4E79E]/10 text-xs font-bold text-[#D4E79E]"
							>
								{getInitials(p.first_name, p.last_name)}
							</div>
							<div>
								<p class="font-medium text-[#FDFBF7]">{p.full_name}</p>
							</div>
						</div>
					</td>
					<td class="px-4 py-3 text-[#FDFBF7]/60">{formatDate(p.date_of_birth)}</td>
					<td class="px-4 py-3">
						{#if p.age != null}
							<span class="clinical text-xs">{p.age}</span>
						{:else}
							<span class="text-[#FDFBF7]/30">—</span>
						{/if}
					</td>
					<td class="px-4 py-3 capitalize text-[#FDFBF7]/60">
						{$_('form.genderOptions.' + p.gender, { default: p.gender })}
					</td>
					<td class="px-4 py-3">
						{#if p.blood_type && p.blood_type !== 'unknown'}
							<span
								class="inline-flex items-center rounded-full border border-[#D4E79E]/30 bg-[#D4E79E]/10 px-2 py-0.5 text-xs font-medium text-[#D4E79E]"
							>
								{p.blood_type}
							</span>
						{:else}
							<span class="text-[#FDFBF7]/30">—</span>
						{/if}
					</td>
					<td class="px-4 py-3">
						<PatientStatusBadge status={p.status} />
					</td>
					<td class="px-4 py-3">
						{#if p.latest_measurement?.bmi != null}
							<span class="clinical text-sm">{formatBMI(p.latest_measurement.bmi)}</span>
						{:else}
							<span class="text-[#FDFBF7]/30">—</span>
						{/if}
					</td>
					<td class="px-4 py-3">
						<div class="flex items-center gap-1">
							<a
								href="/patients/{p.id}"
								class="flex h-7 w-7 items-center justify-center rounded-lg text-[#FDFBF7]/40 transition-colors hover:bg-white/10 hover:text-[#D4E79E]"
								title={$_('patients.actions.view')}
							>
								<Eye size={14} />
							</a>
							<button
								onclick={() => onEdit(p)}
								class="flex h-7 w-7 items-center justify-center rounded-lg text-[#FDFBF7]/40 transition-colors hover:bg-white/10 hover:text-[#D4E79E]"
								title={$_('patients.actions.edit')}
							>
								<Pencil size={14} />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
