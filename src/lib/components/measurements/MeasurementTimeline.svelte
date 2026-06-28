<script lang="ts">
	import type { BodyMeasurementResponseDTO } from '$lib/types';
	import { onMount } from 'svelte';
	import { formatDate, formatBMI, formatCalories } from '$lib/utils/formatters';
	import { _ } from 'svelte-i18n';
	import MeasurementCard from './MeasurementCard.svelte';
	import { Bar } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend
	} from 'chart.js';
	import type { TooltipItem } from 'chart.js';
	import { ChevronDown, ChevronUp } from '@lucide/svelte';

	ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

	interface Props {
		measurements: BodyMeasurementResponseDTO[];
		showChart?: boolean;
	}

	let { measurements, showChart = true }: Props = $props();

	let expandedId = $state<string | null>(null);
	let activeView = $state<'list' | 'chart'>('list');

	// TDEE bar chart for latest measurement
	const latest = $derived(measurements[0]);

	const tdeeChartData = $derived({
		labels: [
			$_('measurements.activity.sedentary'),
			$_('measurements.activity.lightly_active'),
			$_('measurements.activity.moderately_active'),
			$_('measurements.activity.very_active')
		],
		datasets: [
			{
				label: 'Harris-Benedict',
				data: [
					latest?.tdee_harris_benedict?.sedentary ?? 0,
					latest?.tdee_harris_benedict?.lightly_active ?? 0,
					latest?.tdee_harris_benedict?.moderately_active ?? 0,
					latest?.tdee_harris_benedict?.very_active ?? 0
				],
				backgroundColor: 'rgba(212, 231, 158, 0.6)',
				borderColor: '#D4E79E',
				borderWidth: 1,
				borderRadius: 4
			},
			{
				label: 'Mifflin-St Jeor',
				data: [
					latest?.tdee_mifflin_st_jeor?.sedentary ?? 0,
					latest?.tdee_mifflin_st_jeor?.lightly_active ?? 0,
					latest?.tdee_mifflin_st_jeor?.moderately_active ?? 0,
					latest?.tdee_mifflin_st_jeor?.very_active ?? 0
				],
				backgroundColor: 'rgba(150, 196, 153, 0.6)',
				borderColor: '#96c499',
				borderWidth: 1,
				borderRadius: 4
			}
		]
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: { color: '#FDFBF7', font: { family: 'Macondo, serif', size: 11 } }
			},
			tooltip: {
				callbacks: {
					label: (ctx: TooltipItem<'bar'>) =>
						`${ctx.dataset.label ?? ''}: ${(ctx.raw as number).toFixed(0)} kcal`
				}
			}
		},
		scales: {
			x: {
				ticks: { color: '#8fa49c', font: { family: 'Macondo, serif', size: 10 } },
				grid: { color: 'rgba(255,255,255,0.04)' }
			},
			y: {
				ticks: { color: '#8fa49c', font: { family: 'Macondo, serif', size: 10 } },
				grid: { color: 'rgba(255,255,255,0.04)' }
			}
		}
	};
</script>

<div class="space-y-4">
	{#if showChart && latest?.tdee_harris_benedict}
		<!-- View toggle -->
		<div class="flex items-center gap-2">
			<button
				onclick={() => (activeView = 'list')}
				class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors {activeView === 'list'
					? 'border-[#D4E79E]/40 bg-[#D4E79E]/10 text-[#D4E79E]'
					: 'border-white/10 text-[#FDFBF7]/50 hover:text-[#FDFBF7]'}"
			>
				{$_('measurements.timelineTab')}
			</button>
			<button
				onclick={() => (activeView = 'chart')}
				class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors {activeView === 'chart'
					? 'border-[#D4E79E]/40 bg-[#D4E79E]/10 text-[#D4E79E]'
					: 'border-white/10 text-[#FDFBF7]/50 hover:text-[#FDFBF7]'}"
			>
				{$_('measurements.tdeeChartTab')}
			</button>
		</div>
	{/if}

	{#if activeView === 'chart' && latest?.tdee_harris_benedict}
		<div class="rounded-xl border border-white/[0.06] bg-[#35403B] p-4">
			<h3 class="mb-4 text-sm font-semibold text-[#FDFBF7]/70">{$_('measurements.tdeeComparison')}</h3>
			<div style="height: 220px;">
				<Bar data={tdeeChartData} options={chartOptions} />
			</div>
		</div>
	{:else}
		<!-- Timeline list -->
		<div class="space-y-3">
			{#each measurements as m (m.id)}
				<div class="rounded-xl border border-white/[0.06] bg-[#35403B] overflow-hidden">
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
						onclick={() => (expandedId = expandedId === m.id ? null : m.id)}
					>
						<div class="flex items-center gap-4">
							<div>
								<p class="text-sm font-medium text-[#FDFBF7]">{formatDate(m.measured_at, 'MMM d, yyyy HH:mm')}</p>
								<div class="mt-0.5 flex items-center gap-3">
									{#if m.bmi != null}
										<span class="text-xs text-[#FDFBF7]/50">{$_('patient.measurements.bmi')}: <span class="clinical">{formatBMI(m.bmi)}</span></span>
									{/if}
									{#if m.weight_kg != null}
										<span class="text-xs text-[#FDFBF7]/50">{$_('patient.measurements.weight')}: <span class="clinical">{m.weight_kg.toFixed(2)} kg</span></span>
									{/if}
									{#if m.bmi_category}
										<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#FDFBF7]/50">{m.bmi_category}</span>
									{/if}
								</div>
							</div>
						</div>
						{#if expandedId === m.id}
							<ChevronUp size={16} class="text-[#FDFBF7]/40" />
						{:else}
							<ChevronDown size={16} class="text-[#FDFBF7]/40" />
						{/if}
					</button>

					{#if expandedId === m.id}
						<div class="border-t border-white/[0.06] p-4">
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
								{#if m.height_cm != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.height_cm.toFixed(1)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.height')}</p></div>{/if}
								{#if m.weight_kg != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.weight_kg.toFixed(2)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.weight')}</p></div>{/if}
								{#if m.bmi != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{formatBMI(m.bmi)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmi')}</p></div>{/if}
								{#if m.waist_cm != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.waist_cm.toFixed(1)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.waist')}</p></div>{/if}
								{#if m.hip_cm != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.hip_cm.toFixed(1)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.hip')}</p></div>{/if}
								{#if m.bmr_harris_benedict != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.bmr_harris_benedict.toFixed(0)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmrHb')}</p></div>{/if}
								{#if m.bmr_mifflin_st_jeor != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.bmr_mifflin_st_jeor.toFixed(0)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.bmrMsj')}</p></div>{/if}
								{#if m.healthy_weight != null}<div class="rounded-lg bg-[#2C3531]/60 p-3 text-center"><p class="clinical text-base">{m.healthy_weight.toFixed(1)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">{$_('measurements.healthyWeight')}</p></div>{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
