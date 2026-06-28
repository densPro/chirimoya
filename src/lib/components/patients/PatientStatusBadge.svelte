<script lang="ts">
	import type { PatientStatus } from '$lib/types';
	import { _ } from 'svelte-i18n';

	let { status }: { status: PatientStatus } = $props();

	const config: Record<PatientStatus, { classes: string }> = {
		active: {
			classes: 'bg-[#96C499]/20 text-[#96C499] border-[#96C499]/30'
		},
		inactive: {
			classes: 'bg-white/5 text-[#FDFBF7]/50 border-white/10'
		},
		deceased: {
			classes: 'bg-red-500/20 text-red-300 border-red-500/30'
		}
	};

	const c = $derived(config[status] ?? config.inactive);
</script>

<span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium {c.classes}">
	<span
		class="h-1.5 w-1.5 rounded-full {status === 'active'
			? 'bg-[#96C499]'
			: status === 'deceased'
				? 'bg-red-400'
				: 'bg-[#FDFBF7]/30'}"
	></span>
	{$_('status.' + status)}
</span>
