<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getHealth, getReadiness } from '$lib/api';
	import type { HealthResponseDTO } from '$lib/types';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { _ } from 'svelte-i18n';

	let health = $state<HealthResponseDTO | null>(null);
	let readiness = $state<HealthResponseDTO | null>(null);
	let healthError = $state(false);
	let readinessError = $state(false);
	let lastChecked = $state<Date | null>(null);
	let loading = $state(true);

	async function checkHealth() {
		try {
			health = await getHealth();
			healthError = health.status !== 'healthy';
		} catch {
			healthError = true;
			health = null;
		}

		try {
			readiness = await getReadiness();
			readinessError = readiness.status !== 'ready';
		} catch {
			readinessError = true;
			readiness = null;
		}

		lastChecked = new Date();
		loading = false;
	}

	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		checkHealth();
		interval = setInterval(checkHealth, 10000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[#FDFBF7]">{$_('healthPage.title')}</h2>
			{#if lastChecked}
				<p class="mt-0.5 text-xs text-[#FDFBF7]/30">{$_('healthPage.lastChecked', { values: { time: lastChecked.toLocaleTimeString() } })}</p>
			{/if}
		</div>
		{#if loading}
			<Spinner size="sm" />
		{:else}
			<div class="flex items-center gap-2">
				<span
					class="h-2.5 w-2.5 rounded-full {!healthError && !readinessError
						? 'bg-[#96c499] animate-pulse'
						: 'bg-red-400'}"
				></span>
				<span class="text-sm font-medium {!healthError && !readinessError ? 'text-[#96c499]' : 'text-red-400'}">
					{!healthError && !readinessError ? $_('healthPage.operational') : $_('healthPage.degraded')}
				</span>
			</div>
		{/if}
	</div>

	<!-- Status cards -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<!-- Liveness -->
		<div class="rounded-xl border bg-[#35403B] p-5 font-mono {healthError ? 'border-red-500/30' : 'border-[#96c499]/20'}">
			<div class="mb-4 flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-widest text-[#FDFBF7]/50">{$_('healthPage.liveness')}</span>
				<span
					class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium {healthError
						? 'bg-red-500/20 text-red-300'
						: 'bg-[#96c499]/20 text-[#96c499]'}"
				>
					<span class="h-1.5 w-1.5 rounded-full {healthError ? 'bg-red-400' : 'bg-[#96c499] animate-pulse'}"></span>
					{healthError ? 'FAIL' : 'PASS'}
				</span>
			</div>

			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-[#FDFBF7]/40">{$_('healthPage.endpoint')}</span>
					<span class="text-[#D4E79E]">GET /health</span>
				</div>
				{#if health}
					<div class="flex justify-between">
						<span class="text-[#FDFBF7]/40">{$_('healthPage.status')}</span>
						<span class="text-[#FDFBF7]">{health.status}</span>
					</div>
					{#if health.service}
						<div class="flex justify-between">
							<span class="text-[#FDFBF7]/40">{$_('healthPage.service')}</span>
							<span class="text-[#FDFBF7]">{health.service}</span>
						</div>
					{/if}
				{:else if healthError}
					<div class="flex justify-between">
						<span class="text-[#FDFBF7]/40">{$_('healthPage.status')}</span>
						<span class="text-red-400">{$_('healthPage.unreachable')}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Readiness -->
		<div class="rounded-xl border bg-[#35403B] p-5 font-mono {readinessError ? 'border-red-500/30' : 'border-[#96c499]/20'}">
			<div class="mb-4 flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-widest text-[#FDFBF7]/50">{$_('healthPage.readiness')}</span>
				<span
					class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium {readinessError
						? 'bg-red-500/20 text-red-300'
						: 'bg-[#96c499]/20 text-[#96c499]'}"
				>
					<span class="h-1.5 w-1.5 rounded-full {readinessError ? 'bg-red-400' : 'bg-[#96c499] animate-pulse'}"></span>
					{readinessError ? 'FAIL' : 'PASS'}
				</span>
			</div>

			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-[#FDFBF7]/40">{$_('healthPage.endpoint')}</span>
					<span class="text-[#D4E79E]">GET /ready</span>
				</div>
				{#if readiness}
					<div class="flex justify-between">
						<span class="text-[#FDFBF7]/40">{$_('healthPage.status')}</span>
						<span class="text-[#FDFBF7]">{readiness.status}</span>
					</div>
					{#if readiness.database}
						<div class="flex justify-between">
							<span class="text-[#FDFBF7]/40">{$_('healthPage.database')}</span>
							<span class="{readiness.database === 'connected' ? 'text-[#96c499]' : 'text-red-400'}">{readiness.database}</span>
						</div>
					{/if}
				{:else if readinessError}
					<div class="flex justify-between">
						<span class="text-[#FDFBF7]/40">{$_('healthPage.status')}</span>
						<span class="text-red-400">{$_('healthPage.unreachable')}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Terminal-style info box -->
	<div class="rounded-xl border border-white/[0.06] bg-[#1e2a26] p-5 font-mono text-sm">
		<div class="mb-3 flex items-center gap-2">
			<div class="flex gap-1.5">
				<span class="h-3 w-3 rounded-full bg-red-500/60"></span>
				<span class="h-3 w-3 rounded-full bg-yellow-500/60"></span>
				<span class="h-3 w-3 rounded-full bg-[#96c499]/60"></span>
			</div>
			<span class="text-xs text-[#FDFBF7]/30">chirimoya-patient-service</span>
		</div>
		<div class="space-y-1 text-xs">
			<p><span class="text-[#D4E79E]">$</span> <span class="text-[#FDFBF7]/60">curl {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/health</span></p>
			{#if health}
				<p class="text-[#96c499]">{JSON.stringify(health, null, 2)}</p>
			{:else}
				<p class="text-red-400">{$_('healthPage.connectionFailed')}</p>
			{/if}
		</div>
	</div>
</div>
