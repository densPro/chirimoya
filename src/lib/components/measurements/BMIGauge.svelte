<script lang="ts">
	import { bmiColor } from '$lib/utils/formatters';

	interface Props {
		bmi?: number;
		category?: string;
	}

	let { bmi, category }: Props = $props();

	// SVG arc gauge parameters
	const cx = 120;
	const cy = 120;
	const r = 90;
	const minBMI = 15;
	const maxBMI = 40;
	const startAngle = -210; // degrees (bottom-left)
	const endAngle = 30;     // degrees (bottom-right)
	const totalAngle = endAngle - startAngle; // 240 degrees

	function toRad(deg: number) {
		return (deg * Math.PI) / 180;
	}

	function arcPoint(angle: number) {
		return {
			x: cx + r * Math.cos(toRad(angle)),
			y: cy + r * Math.sin(toRad(angle))
		};
	}

	function makeArc(start: number, end: number) {
		const s = arcPoint(start);
		const e = arcPoint(end);
		const large = end - start > 180 ? 1 : 0;
		return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
	}

	// Zones: Underweight (<18.5), Normal (<25), Overweight (<30), Obese (>=30)
	function bmiToAngle(v: number): number {
		const clamped = Math.max(minBMI, Math.min(maxBMI, v));
		return startAngle + ((clamped - minBMI) / (maxBMI - minBMI)) * totalAngle;
	}

	const zones = [
		{ start: minBMI, end: 18.5, color: '#60a5fa', label: 'Underweight' },
		{ start: 18.5, end: 25, color: '#96c499', label: 'Normal' },
		{ start: 25, end: 30, color: '#fbbf24', label: 'Overweight' },
		{ start: 30, end: maxBMI, color: '#f87171', label: 'Obese' }
	];

	const needleAngle = $derived(bmi != null ? bmiToAngle(bmi) : startAngle);
	const needleTip = $derived(arcPoint(needleAngle));
	const color = $derived(bmiColor(bmi));
	const displayCategory = $derived(category ?? (bmi == null ? 'No data' : undefined));
</script>

<div class="flex flex-col items-center gap-3">
	<svg viewBox="0 0 240 160" class="w-full max-w-[280px]" aria-label="BMI gauge">
		<!-- Background track -->
		<path
			d={makeArc(startAngle, endAngle)}
			fill="none"
			stroke="#2C3531"
			stroke-width="18"
			stroke-linecap="round"
		/>

		<!-- Zone arcs -->
		{#each zones as zone (zone.label)}
			{@const sa = bmiToAngle(zone.start)}
			{@const ea = bmiToAngle(zone.end)}
			<path
				d={makeArc(sa, ea)}
				fill="none"
				stroke={zone.color}
				stroke-width="14"
				stroke-linecap="round"
				opacity="0.7"
			/>
		{/each}

		<!-- Needle -->
		{#if bmi != null}
			<line
				x1={cx}
				y1={cy}
				x2={needleTip.x}
				y2={needleTip.y}
				stroke={color}
				stroke-width="3"
				stroke-linecap="round"
			/>
			<circle cx={cx} cy={cy} r="6" fill={color} />
			<circle cx={cx} cy={cy} r="3" fill="#35403B" />
		{/if}

		<!-- BMI Value -->
		<text x={cx} y={cy + 32} text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="22" fill={color} font-weight="500">
			{bmi != null ? bmi.toFixed(2) : '—'}
		</text>
		<text x={cx} y={cy + 47} text-anchor="middle" font-family="Quicksand, sans-serif" font-size="10" fill="#8fa49c" letter-spacing="1">
			{displayCategory?.toUpperCase() ?? ''}
		</text>

		<!-- Zone labels -->
		<text x={arcPoint(startAngle + 8).x - 4} y={arcPoint(startAngle + 8).y + 4} text-anchor="end" font-size="7" fill="#60a5fa" font-family="Quicksand, sans-serif">Under</text>
		<text x={arcPoint(endAngle - 8).x + 4} y={arcPoint(endAngle - 8).y + 4} text-anchor="start" font-size="7" fill="#f87171" font-family="Quicksand, sans-serif">Obese</text>
	</svg>

	<!-- Legend -->
	<div class="flex gap-4">
		{#each zones as zone (zone.label)}
			<div class="flex items-center gap-1">
				<span class="h-2 w-2 rounded-full" style="background-color: {zone.color};"></span>
				<span class="text-[10px] text-[#FDFBF7]/40">{zone.label}</span>
			</div>
		{/each}
	</div>
</div>
