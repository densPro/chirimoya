<script lang="ts">
	interface Props {
		total: number;
		limit: number;
		offset: number;
		onChange: (offset: number) => void;
	}

	let { total, limit, offset, onChange }: Props = $props();

	const totalPages = $derived(Math.ceil(total / limit));
	const currentPage = $derived(Math.floor(offset / limit) + 1);

	function pages(): number[] {
		const arr: number[] = [];
		const start = Math.max(1, currentPage - 2);
		const end = Math.min(totalPages, currentPage + 2);
		for (let i = start; i <= end; i++) arr.push(i);
		return arr;
	}

	function goTo(page: number) {
		onChange((page - 1) * limit);
	}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-between gap-2 py-3">
		<p class="text-sm text-[#FDFBF7]/40">
			Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
		</p>
		<div class="flex items-center gap-1">
			<button
				onclick={() => goTo(currentPage - 1)}
				disabled={currentPage === 1}
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-[#FDFBF7]/60 transition-colors hover:border-[#D4E79E]/30 hover:text-[#D4E79E] disabled:cursor-not-allowed disabled:opacity-30"
			>
				‹
			</button>

			{#if pages()[0] > 1}
				<button
					onclick={() => goTo(1)}
					class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-[#FDFBF7]/60 transition-colors hover:border-[#D4E79E]/30 hover:text-[#D4E79E]"
				>
					1
				</button>
				{#if pages()[0] > 2}
					<span class="px-1 text-[#FDFBF7]/30">…</span>
				{/if}
			{/if}

			{#each pages() as page (page)}
				<button
					onclick={() => goTo(page)}
					class="flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors {page === currentPage
						? 'border-[#D4E79E]/40 bg-[#D4E79E]/10 text-[#D4E79E]'
						: 'border-white/10 text-[#FDFBF7]/60 hover:border-[#D4E79E]/30 hover:text-[#D4E79E]'}"
				>
					{page}
				</button>
			{/each}

			{#if pages()[pages().length - 1] < totalPages}
				{#if pages()[pages().length - 1] < totalPages - 1}
					<span class="px-1 text-[#FDFBF7]/30">…</span>
				{/if}
				<button
					onclick={() => goTo(totalPages)}
					class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-[#FDFBF7]/60 transition-colors hover:border-[#D4E79E]/30 hover:text-[#D4E79E]"
				>
					{totalPages}
				</button>
			{/if}

			<button
				onclick={() => goTo(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-sm text-[#FDFBF7]/60 transition-colors hover:border-[#D4E79E]/30 hover:text-[#D4E79E] disabled:cursor-not-allowed disabled:opacity-30"
			>
				›
			</button>
		</div>
	</div>
{/if}
