<script lang="ts">
	type Variant = 'status' | 'blood' | 'gender' | 'default';

	interface Props {
		variant?: Variant;
		value?: string;
		class?: string;
	}

	let { variant = 'default', value = '', class: cls = '' }: Props = $props();

	function getClasses(v: Variant, val: string): string {
		const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
		if (v === 'status') {
			if (val === 'active') return `${base} bg-[#96C499]/20 text-[#96C499] border-[#96C499]/30`;
			if (val === 'inactive') return `${base} bg-white/5 text-[#FDFBF7]/50 border-white/10`;
			if (val === 'deceased') return `${base} bg-red-500/20 text-red-300 border-red-500/30`;
		}
		if (v === 'blood') {
			return `${base} bg-[#D4E79E]/10 text-[#D4E79E] border-[#D4E79E]/30`;
		}
		return `${base} bg-white/5 text-[#FDFBF7]/70 border-white/10`;
	}
</script>

<span class="{getClasses(variant, value)} {cls}">
	{value}
</span>
