<script lang="ts">
	import { getToasts } from '$lib/stores/toast.svelte';
	import Toast from './Toast.svelte';

	const toasts = $derived(getToasts());
</script>

<div
	class="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2"
	aria-live="polite"
	aria-label="Notifications"
>
	{#each toasts as toast (toast.id)}
		<div class="pointer-events-auto w-80">
			<Toast {toast} />
		</div>
	{/each}
</div>
