<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search } from '@lucide/svelte';

	interface Props {
		title?: string;
	}

	let { title = 'Chirimoya' }: Props = $props();

	let searchQuery = $state('');

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchQuery.trim()) {
			goto(`/patients?mrn=${encodeURIComponent(searchQuery.trim())}`);
			searchQuery = '';
		}
	}
</script>

<header
	class="glass flex h-14 items-center justify-between border-b border-white/[0.06] px-6 flex-shrink-0"
>
	<!-- Breadcrumb / Page Title -->
	<h1 class="text-sm font-semibold text-[#FDFBF7]/80">{title}</h1>

	<!-- Quick Search -->
	<div class="flex items-center gap-3">
		<div class="relative">
			<Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDFBF7]/30" />
			<input
				type="search"
				bind:value={searchQuery}
				onkeydown={handleSearch}
				placeholder="Search by MRN or name…"
				class="h-8 w-52 rounded-lg border border-white/10 bg-[#2C3531]/60 pl-8 pr-3 text-xs text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none transition focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			/>
		</div>

		<!-- User Avatar -->
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4E79E]/20 text-xs font-bold text-[#D4E79E]"
		>
			DR
		</div>
	</div>
</header>
