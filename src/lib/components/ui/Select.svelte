<script lang="ts">
	interface SelectOption {
		value: string;
		label: string;
	}

	interface Props {
		id?: string;
		label?: string;
		value?: string;
		options: SelectOption[];
		placeholder?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		label,
		value = $bindable(''),
		options,
		placeholder,
		error,
		disabled = false,
		required = false,
		class: cls = '',
		onchange
	}: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {cls}">
	{#if label}
		<label
			for={id}
			class="text-sm font-medium text-[#FDFBF7]/80 {required
				? 'after:ml-0.5 after:text-[#D4E79E] after:content-[\'*\']'
				: ''}"
		>
			{label}
		</label>
	{/if}
	<select
		{id}
		{disabled}
		{required}
		bind:value
		class="w-full rounded-lg border bg-[#2C3531] px-3 py-2 text-sm text-[#FDFBF7] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4E79E] disabled:cursor-not-allowed disabled:opacity-50 {error
			? 'border-red-500/60 focus:ring-red-400'
			: 'border-white/10 focus:border-[#D4E79E]/50'}"
		{onchange}
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>{placeholder}</option>
		{/if}
		{#each options as opt (opt.value)}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
	{#if error}
		<p class="text-xs text-red-400">{error}</p>
	{/if}
</div>
