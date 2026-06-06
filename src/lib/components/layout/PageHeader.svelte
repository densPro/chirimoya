<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		children?: import('svelte').Snippet;
	}

	let { title, subtitle, children }: Props = $props();
</script>

<div class="mb-6 flex items-start justify-between">
	<div>
		<h2 class="text-2xl font-bold text-[#FDFBF7]">{title}</h2>
		{#if subtitle}
			<p class="mt-0.5 text-sm text-[#FDFBF7]/50">{subtitle}</p>
		{/if}
	</div>
	{#if children}
		<div class="flex items-center gap-2">
			{@render children()}
		</div>
	{/if}
</div>
