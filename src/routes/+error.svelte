<script lang="ts">
	import { page } from '$app/stores';

	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'An unexpected error occurred');
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
		<span class="font-mono text-3xl font-bold text-red-400">{status}</span>
	</div>
	<h1 class="mb-2 text-2xl font-bold text-[#FDFBF7]">
		{status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
	</h1>
	<p class="mb-6 max-w-md text-sm text-[#FDFBF7]/50">{message}</p>
	<a
		href="/"
		class="rounded-xl bg-[#D4E79E]/10 px-5 py-2.5 text-sm font-medium text-[#D4E79E] transition-colors hover:bg-[#D4E79E]/20"
	>
		← Back to Dashboard
	</a>
</div>
