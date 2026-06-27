<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, Users, HeartPulse, ChevronLeft, ChevronRight, Leaf, Stethoscope, Tags } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		collapsed?: boolean;
	}

	let { collapsed = $bindable(false) }: Props = $props();

	const navItems = [
		{ href: '/', key: 'dashboard', icon: LayoutDashboard },
		{ href: '/patients', key: 'patients', icon: Users },
		{ href: '/doctors', key: 'doctors', icon: Stethoscope },
		{ href: '/specialties', key: 'specialties', icon: Tags },
		{ href: '/health', key: 'health', icon: HeartPulse }
	];

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<aside
	class="glass flex h-full flex-col transition-all duration-300 {collapsed ? 'w-16' : 'w-60'}"
	style="border-right: 1px solid rgba(255,255,255,0.06);"
>
	<!-- Logo -->
	<div
		class="flex items-center gap-3 border-b border-white/[0.06] px-4 py-5 {collapsed
			? 'justify-center'
			: ''}"
	>
		<div
			class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#D4E79E]/15"
		>
			<Leaf size={20} color="#D4E79E" />
		</div>
		{#if !collapsed}
			<div>
				<p class="text-sm font-bold tracking-wide text-[#FDFBF7]">Chirimoya</p>
				<p class="text-[10px] text-[#FDFBF7]/40 uppercase tracking-widest">{$_('nav.clinical')}</p>
			</div>
		{/if}
	</div>

	<!-- Navigation -->
	<nav class="flex-1 space-y-1 px-2 py-4">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			{@const label = $_(`nav.${item.key}`)}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 {collapsed
					? 'justify-center'
					: ''} {active
					? 'bg-[#D4E79E]/10 text-[#D4E79E]'
					: 'text-[#FDFBF7]/50 hover:bg-white/5 hover:text-[#FDFBF7]'}"
				title={collapsed ? label : undefined}
			>
				<item.icon size={18} />
				{#if !collapsed}
					<span>{label}</span>
				{/if}
				{#if active && !collapsed}
					<span class="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4E79E]"></span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Collapse toggle -->
	<div class="border-t border-white/[0.06] p-3">
		<button
			onclick={() => (collapsed = !collapsed)}
			class="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-[#FDFBF7]/40 transition-all hover:bg-white/5 hover:text-[#FDFBF7]"
		>
			{#if collapsed}
				<ChevronRight size={16} />
			{:else}
				<ChevronLeft size={16} />
				<span>{$_('nav.collapse')}</span>
			{/if}
		</button>
	</div>
</aside>
