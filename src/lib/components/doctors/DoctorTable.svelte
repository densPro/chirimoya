<script lang="ts">
	import type { DoctorResponseDTO } from '$lib/types';
	import DoctorStatusBadge from './DoctorStatusBadge.svelte';
	import { Eye, Pencil, PowerOff } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import { formatDate } from '$lib/utils/formatters';

	interface Props {
		doctors: DoctorResponseDTO[];
		specialtyMap: Record<string, string>; // specialty_id → name
		onEdit: (d: DoctorResponseDTO) => void;
		onDeactivate: (d: DoctorResponseDTO) => void;
	}

	let { doctors, specialtyMap, onEdit, onDeactivate }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-white/[0.06]">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-white/[0.06] bg-[#2C3531]/50">
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.employeeId')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.name')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.specialty')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.status')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.experience')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.joined')}
				</th>
				<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('doctors.columns.actions')}
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-white/[0.04] bg-[#35403B]">
			{#each doctors as d (d.id)}
				<tr class="transition-colors hover:bg-white/[0.02] {d.status !== 'active' ? 'opacity-60' : ''}">
					<td class="px-4 py-3 font-mono text-xs text-[#D4E79E]">{d.employee_id}</td>
					<td class="px-4 py-3">
						<div class="flex items-center gap-2">
							<div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#D4E79E]/10 font-mono text-[10px] font-bold text-[#D4E79E]">
								{d.first_name[0]}{d.last_name[0]}
							</div>
							<span class="text-[#FDFBF7]">{d.full_name}</span>
						</div>
					</td>
					<td class="px-4 py-3 text-xs text-[#FDFBF7]/60">
						{specialtyMap[d.specialty_id] ?? '—'}
					</td>
					<td class="px-4 py-3">
						<DoctorStatusBadge status={d.status} />
					</td>
					<td class="px-4 py-3 text-xs text-[#FDFBF7]/40">
						{d.years_of_experience != null ? `${d.years_of_experience} yrs` : '—'}
					</td>
					<td class="px-4 py-3 text-xs text-[#FDFBF7]/40">{formatDate(d.created_at)}</td>
					<td class="px-4 py-3">
						<div class="flex items-center justify-end gap-1">
							<a
								href="/doctors/{d.id}"
								class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-white/5 hover:text-[#D4E79E]"
								title="View"
							>
								<Eye size={14} />
							</a>
							<button
								onclick={() => onEdit(d)}
								class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-white/5 hover:text-[#D4E79E]"
								title="Edit"
							>
								<Pencil size={14} />
							</button>
							{#if d.status === 'active'}
								<button
									onclick={() => onDeactivate(d)}
									class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
									title="Deactivate"
								>
									<PowerOff size={14} />
								</button>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
