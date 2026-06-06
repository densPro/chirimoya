<script lang="ts">
	interface Props {
		id?: string;
		label?: string;
		value?: string;
		placeholder?: string;
		rows?: number;
		error?: string;
		disabled?: boolean;
		class?: string;
	}

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = '',
		rows = 3,
		error,
		disabled = false,
		class: cls = ''
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {cls}">
	{#if label}
		<label for={id} class="text-sm font-medium text-[#FDFBF7]/80">{label}</label>
	{/if}
	<textarea
		{id}
		{placeholder}
		{disabled}
		{rows}
		bind:value
		class="w-full resize-none rounded-lg border bg-[#2C3531] px-3 py-2 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4E79E] disabled:cursor-not-allowed disabled:opacity-50 {error
			? 'border-red-500/60 focus:ring-red-400'
			: 'border-white/10 focus:border-[#D4E79E]/50'}"
	></textarea>
	{#if error}
		<p class="text-xs text-red-400">{error}</p>
	{/if}
</div>
