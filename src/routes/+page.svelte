<script lang="ts">
	import { onMount } from 'svelte';
	import { searchPatients, getHealth } from '$lib/api';
	import type { PatientResponseDTO, HealthResponseDTO } from '$lib/types';
	import PatientCard from '$lib/components/patients/PatientCard.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { Users, UserCheck, UserX, Skull, Activity } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';

	interface KPI {
		key: string;
		value: number | null;
		icon: typeof Users;
		color: string;
		status?: string;
	}

	let kpis = $state<{ key: string; value: number | null; icon: typeof Users; color: string }[]>([
		{ key: 'totalPatients', value: null, icon: Users, color: '#D4E79E' },
		{ key: 'active', value: null, icon: UserCheck, color: '#96c499' },
		{ key: 'inactive', value: null, icon: UserX, color: '#8fa49c' },
		{ key: 'deceased', value: null, icon: Skull, color: '#f87171' }
	]);

	let recentPatients = $state<PatientResponseDTO[]>([]);
	let loadingKpis = $state(true);
	let loadingRecent = $state(true);
	let health = $state<HealthResponseDTO | null>(null);
	let healthOk = $state<boolean | null>(null);

	onMount(async () => {
		// Load KPIs in parallel
		try {
			const [total, active, inactive, deceased] = await Promise.all([
				searchPatients({ limit: 1 }),
				searchPatients({ status: 'active', limit: 1 }),
				searchPatients({ status: 'inactive', limit: 1 }),
				searchPatients({ status: 'deceased', limit: 1 })
			]);
			kpis[0].value = total.total;
			kpis[1].value = active.total;
			kpis[2].value = inactive.total;
			kpis[3].value = deceased.total;
		} catch {
			// silent
		} finally {
			loadingKpis = false;
		}

		// Load recent patients
		try {
			const res = await searchPatients({ limit: 5 });
			recentPatients = res.items;
		} catch {
			// silent
		} finally {
			loadingRecent = false;
		}

		// Health ping
		try {
			health = await getHealth();
			healthOk = health.status === 'healthy' || health.status === 'ok';
		} catch {
			healthOk = false;
		}
	});
</script>

<div class="space-y-6">
	<div class="mb-3 flex items-center justify-between">
		<h2 class="text-sm font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('dashboard.recentPatients')}</h2>
	</div>

	<!-- KPI Cards -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each kpis as kpi, i (kpi.key)}
			<Card class="fade-in" style="animation-delay: {i * 60}ms">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-xs font-medium uppercase tracking-wider text-[#FDFBF7]/40">{$_(`dashboard.${kpi.key}`)}</p>
						{#if loadingKpis}
							<div class="skeleton mt-2 h-8 w-16 rounded"></div>
						{:else}
							<p class="clinical mt-1 text-3xl" style="color: {kpi.color};">
								{kpi.value ?? '—'}
							</p>
						{/if}
					</div>
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
						<kpi.icon size={20} style="color: {kpi.color};" />
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Bottom Row -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Recent Patients -->
		<div class="lg:col-span-2">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('dashboard.recentPatients')}</h2>
				<a href="/patients" class="text-xs text-[#D4E79E]/70 transition-colors hover:text-[#D4E79E]">
					{$_('dashboard.viewAll')}
				</a>
			</div>
			{#if loadingRecent}
				<div class="space-y-3">
					{#each [0, 1, 2] as i (i)}
						<div class="skeleton h-16 rounded-xl"></div>
					{/each}
				</div>
			{:else if recentPatients.length === 0}
				<Card>
					<p class="text-center text-sm text-[#FDFBF7]/40 py-8">{$_('dashboard.noPatients')} <a href="/patients/new" class="text-[#D4E79E] hover:underline">{$_('dashboard.addFirst')}</a></p>
				</Card>
			{:else}
				<div class="space-y-2">
					{#each recentPatients as patient (patient.id)}
						<PatientCard {patient} />
					{/each}
				</div>
			{/if}
		</div>

		<!-- Health + Quick Actions -->
		<div class="space-y-4">
			<!-- API Health -->
			<Card>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Activity size={16} class="text-[#FDFBF7]/50" />
						<span class="text-sm font-medium text-[#FDFBF7]/70">{$_('dashboard.apiStatus')}</span>
					</div>
					{#if healthOk === null}
						<Spinner size="sm" />
					{:else}
						<div class="flex items-center gap-1.5">
							<span
								class="h-2 w-2 rounded-full {healthOk ? 'bg-[#96c499]' : 'bg-red-400'}"
								class:animate-pulse={healthOk}
							></span>
							<span class="text-xs {healthOk ? 'text-[#96c499]' : 'text-red-400'}">
								{healthOk ? $_('dashboard.online') : $_('dashboard.offline')}
							</span>
						</div>
					{/if}
				</div>
				{#if health}
					<p class="mt-2 font-mono text-xs text-[#FDFBF7]/30">{health.service ?? 'patient-service'}</p>
				{/if}
			</Card>

			<!-- Quick Actions -->
			<Card>
				<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('dashboard.quickActions')}</h3>
				<div class="space-y-2">
					<a
						href="/patients/new"
						class="flex items-center gap-3 rounded-lg border border-[#D4E79E]/20 bg-[#D4E79E]/5 px-3 py-2.5 text-sm font-medium text-[#D4E79E] transition-all hover:bg-[#D4E79E]/10"
					>
						<span class="text-base">+</span>
						{$_('dashboard.newPatient')}
					</a>
					<a
						href="/patients"
						class="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-[#FDFBF7]/60 transition-all hover:border-white/20 hover:text-[#FDFBF7]"
					>
						<span class="text-base">🔍</span>
						{$_('dashboard.searchPatients')}
					</a>
					<a
						href="/health"
						class="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-[#FDFBF7]/60 transition-all hover:border-white/20 hover:text-[#FDFBF7]"
					>
						<span class="text-base">💚</span>
						{$_('dashboard.healthStatus')}
					</a>
				</div>
			</Card>
		</div>
	</div>
</div>
