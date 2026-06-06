<script lang="ts">
	interface Props {
		class?: string;
		style?: string;
		padding?: 'sm' | 'md' | 'lg' | 'none';
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let { class: cls = '', style = '', padding = 'md', children, ...rest }: Props = $props();

	const paddings = {
		none: '',
		sm: 'p-4',
		md: 'p-5',
		lg: 'p-6'
	};
</script>

<div
	class="rounded-xl border border-white/[0.06] bg-[#35403B] shadow-lg {paddings[padding]} {cls}"
	{style}
	{...rest}
>
	{@render children?.()}
</div>
