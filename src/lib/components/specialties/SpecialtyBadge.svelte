<script lang="ts">
	import type { SpecialtyCategory } from '$lib/types';

	interface Props {
		category: SpecialtyCategory;
		size?: 'sm' | 'md';
	}

	let { category, size = 'sm' }: Props = $props();

	const config: Record<SpecialtyCategory, { label: string; color: string; bg: string; border: string }> = {
		primary_care:  { label: 'Primary Care',   color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.25)' },
		surgical:      { label: 'Surgical',        color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
		diagnostic:    { label: 'Diagnostic',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
		therapeutic:   { label: 'Therapeutic',     color: '#D4E79E', bg: 'rgba(212,231,158,0.12)', border: 'rgba(212,231,158,0.25)' },
		mental_health: { label: 'Mental Health',   color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.25)' },
		emergency:     { label: 'Emergency',       color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)'  },
		other:         { label: 'Other',           color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)' }
	};

	const cfg = $derived(config[category] ?? config.other);
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
