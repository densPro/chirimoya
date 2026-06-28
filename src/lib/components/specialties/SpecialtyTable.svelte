<script lang="ts">
	import type { SpecialtyResponseDTO } from '$lib/types';
	import SpecialtyBadge from './SpecialtyBadge.svelte';
	import { Pencil, PowerOff, CheckCircle } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import { formatDate } from '$lib/utils/formatters';

	interface Props {
		specialties: SpecialtyResponseDTO[];
		onEdit: (s: SpecialtyResponseDTO) => void;
		onDeactivate: (s: SpecialtyResponseDTO) => void;
		onReactivate?: (s: SpecialtyResponseDTO) => void;
	}

	let { specialties, onEdit, onDeactivate, onReactivate }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-white/[0.06]">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-white/[0.06] bg-[#2C3531]/50">
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.code')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.name')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.category')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.status')}
				</th>
				<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.created')}
				</th>
				<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					{$_('specialties.columns.actions')}
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-white/[0.04] bg-[#35403B]">
			{#each specialties as s (s.id)}
				<tr class="transition-colors hover:bg-white/[0.02] {!s.is_active ? 'opacity-50' : ''}">
					<td class="px-4 py-3 font-mono text-xs text-[#D4E79E]">{s.code}</td>
					<td class="px-4 py-3 text-[#FDFBF7]">{s.name}</td>
					<td class="px-4 py-3">
						<SpecialtyBadge category={s.category} />
					</td>
					<td class="px-4 py-3">
						{#if s.is_active}
							<span class="inline-flex items-center gap-1 rounded-full border border-[#96C499]/30 bg-[#96C499]/10 px-2.5 py-0.5 text-xs font-medium text-[#96C499]">
								<span class="h-1.5 w-1.5 rounded-full bg-[#96C499]"></span>
								{$_('status.active')}
							</span>
						{:else}
							<span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-[#FDFBF7]/40">
								{$_('status.inactive')}
							</span>
						{/if}
					</td>
					<td class="px-4 py-3 text-xs text-[#FDFBF7]/40">{formatDate(s.created_at)}</td>
					<td class="px-4 py-3">
						<div class="flex items-center justify-end gap-2">
							<button
								onclick={() => onEdit(s)}
								class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-white/5 hover:text-[#D4E79E]"
								title="Edit"
							>
								<Pencil size={14} />
							</button>
							{#if s.is_active}
								<button
									onclick={() => onDeactivate(s)}
									class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
									title="Deactivate"
								>
									<PowerOff size={14} />
								</button>
							{:else if onReactivate}
								<button
									onclick={() => onReactivate?.(s)}
									class="rounded-lg p-1.5 text-[#FDFBF7]/40 transition-colors hover:bg-[#96C499]/10 hover:text-[#96C499]"
									title="Reactivate"
								>
									<CheckCircle size={14} />
								</button>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
