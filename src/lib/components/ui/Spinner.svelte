<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { size = 'md', class: cls = '' }: Props = $props();

	const sizes = {
		sm: 'h-4 w-4 border-2',
		md: 'h-6 w-6 border-2',
		lg: 'h-10 w-10 border-3'
	};
</script>

<span
	class="inline-block animate-spin rounded-full border-[#D4E79E]/30 border-t-[#D4E79E] {sizes[size]} {cls}"
></span>
