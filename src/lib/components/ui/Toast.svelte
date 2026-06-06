<script lang="ts">
	import { removeToast } from '$lib/stores/toast.svelte';
	import type { Toast } from '$lib/stores/toast.svelte';

	let { toast }: { toast: Toast } = $props();

	const icons = {
		success: '✓',
		error: '✕',
		info: 'ℹ',
		warning: '⚠'
	};

	const styles = {
		success: 'border-[#96C499]/40 bg-[#96C499]/10 text-[#96C499]',
		error: 'border-red-500/40 bg-red-500/10 text-red-300',
		info: 'border-[#D4E79E]/30 bg-[#D4E79E]/10 text-[#D4E79E]',
		warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
	};
</script>

<div
	class="fade-in flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl {styles[toast.type]}"
	role="alert"
>
	<span class="mt-0.5 text-base font-bold">{icons[toast.type]}</span>
	<p class="flex-1 text-sm font-medium text-[#FDFBF7]">{toast.message}</p>
	<button
		onclick={() => removeToast(toast.id)}
		class="text-[#FDFBF7]/40 transition-colors hover:text-[#FDFBF7]"
		aria-label="Dismiss"
	>
		×
	</button>
</div>
