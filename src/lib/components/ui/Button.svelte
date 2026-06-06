<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		loading?: boolean;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: () => void;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		loading = false,
		disabled = false,
		class: cls = '',
		children,
		onclick,
		...rest
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2C3531]';

	const variants = {
		primary:
			'bg-[#D4E79E] text-[#2C3531] hover:bg-[#c5dc8a] focus:ring-[#D4E79E] active:scale-95',
		secondary:
			'bg-[#35403B] text-[#FDFBF7] border border-white/10 hover:bg-[#3d4d45] hover:border-white/20 focus:ring-[#D4E79E]',
		ghost: 'text-[#FDFBF7]/70 hover:text-[#FDFBF7] hover:bg-white/5 focus:ring-[#D4E79E]',
		danger:
			'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-400'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button
	{type}
	disabled={disabled || loading}
	class="{baseClasses} {variants[variant]} {sizes[size]} {cls}"
	{onclick}
	{...rest}
>
	{#if loading}
		<span
			class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
		></span>
	{/if}
	{@render children?.()}
</button>
