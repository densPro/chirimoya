<script lang="ts">
	import type { DoctorStatus } from '$lib/types';

	interface Props {
		status: DoctorStatus;
		size?: 'sm' | 'md';
	}

	let { status, size = 'sm' }: Props = $props();

	const config: Record<DoctorStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
		active:   { label: 'Active',    color: '#96C499', bg: 'rgba(150,196,153,0.15)', border: 'rgba(150,196,153,0.30)', dot: '#96C499' },
		inactive: { label: 'Inactive',  color: '#FDFBF7', bg: 'rgba(253,251,247,0.06)', border: 'rgba(253,251,247,0.12)', dot: '#FDFBF7' },
		on_leave: { label: 'On Leave',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  dot: '#fbbf24' },
		retired:  { label: 'Retired',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', dot: '#94a3b8' }
	};

	const cfg = $derived(config[status] ?? config.inactive);
	const px = $derived(size === 'sm' ? '0.5rem 0.625rem' : '0.375rem 0.75rem');
	const fs = $derived(size === 'sm' ? '0.7rem' : '0.75rem');
</script>

<span
	style="
		display: inline-flex; align-items: center; gap: 0.3rem;
		padding: {px}; border-radius: 9999px;
		font-size: {fs}; font-weight: 500;
		color: {cfg.color}; background: {cfg.bg}; border: 1px solid {cfg.border};
		white-space: nowrap;
	"
>
	<span style="width: 5px; height: 5px; border-radius: 50%; background: {cfg.dot};"></span>
	{cfg.label}
</span>
