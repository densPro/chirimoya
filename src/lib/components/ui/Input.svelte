<script lang="ts">
	interface Props {
		id?: string;
		label?: string;
		type?: string;
		placeholder?: string;
		value?: string | number;
		error?: string;
		hint?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		[key: string]: unknown;
	}

	let {
		id,
		label,
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		error,
		hint,
		disabled = false,
		required = false,
		class: cls = '',
		oninput,
		onchange,
		...rest
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {cls}">
	{#if label}
		<label
			for={id}
			class="text-sm font-medium text-[#FDFBF7]/80 {required ? 'after:ml-0.5 after:text-[#D4E79E] after:content-[\'*\']' : ''}"
		>
			{label}
		</label>
	{/if}
	<input
		{id}
		{type}
		{placeholder}
		{disabled}
		{required}
		bind:value
		class="w-full rounded-lg border bg-[#2C3531] px-3 py-2 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4E79E] disabled:cursor-not-allowed disabled:opacity-50 {error
			? 'border-red-500/60 focus:ring-red-400'
			: 'border-white/10 focus:border-[#D4E79E]/50'}"
		{oninput}
		{onchange}
		{...rest}
	/>
	{#if error}
		<p class="text-xs text-red-400">{error}</p>
	{:else if hint}
		<p class="text-xs text-[#FDFBF7]/40">{hint}</p>
	{/if}
</div>
