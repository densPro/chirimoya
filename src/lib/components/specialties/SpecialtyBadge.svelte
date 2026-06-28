<script lang="ts">
	import type { SpecialtyCategory } from '$lib/types';

	interface Props {
		category: SpecialtyCategory;
		size?: 'sm' | 'md';
	}

	let { category, size = 'sm' }: Props = $props();

	const config: Record<SpecialtyCategory, { label: string; color: string; bg: string; border: string }> = {
		atencion_primaria: { label: 'Atención Primaria', color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.25)' },
		quirurgica:        { label: 'Quirúrgica',         color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
		diagnostica:       { label: 'Diagnóstica',       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
		terapeutica:       { label: 'Terapéutica',        color: '#D4E79E', bg: 'rgba(212,231,158,0.12)', border: 'rgba(212,231,158,0.25)' },
		salud_mental:      { label: 'Salud Mental',       color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.25)' },
		emergencia:        { label: 'Emergencia',         color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)'  },
		otra:              { label: 'Otra',               color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)' }
	};

	const cfg = $derived(config[category] ?? config.otra);
	const px = $derived(size === 'sm' ? '0.5rem 0.625rem' : '0.375rem 0.75rem');
	const fs = $derived(size === 'sm' ? '0.7rem' : '0.75rem');
</script>

<span
	style="
		display: inline-flex; align-items: center;
		padding: {px}; border-radius: 9999px;
		font-size: {fs}; font-weight: 500; letter-spacing: 0.02em;
		color: {cfg.color}; background: {cfg.bg}; border: 1px solid {cfg.border};
		white-space: nowrap;
	"
>
	{cfg.label}
</span>
