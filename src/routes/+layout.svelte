<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	let sidebarCollapsed = $state(false);
	let mobileMenuOpen = $state(false);

	afterNavigate(() => {
		mobileMenuOpen = false;
	});

	// Derive page title from route
	const pageTitle = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/') return $_('nav.dashboard');
		if (path.startsWith('/patients/new')) return $_('dashboard.newPatient');
		if (path.match(/\/patients\/[^/]+\/measurements/)) return $_('patient.measurements.title');
		if (path.match(/\/patients\/[^/]+/)) return $_('patient.profile');
		if (path === '/patients') return $_('patients.title');
		if (path.match(/\/doctors\/[^/]+/)) return $_('doctors.profileTitle');
		if (path === '/doctors') return $_('doctors.title');
		if (path === '/specialties') return $_('specialties.title');
		if (path === '/health') return $_('nav.health');
		return 'Chirimoya';
	});

</script>

<svelte:head>
	<title>{pageTitle} · Chirimoya</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#2C3531]">
	<!-- Sidebar (Desktop only) -->
	<div class="hidden lg:flex h-full flex-shrink-0">
		<Sidebar bind:collapsed={sidebarCollapsed} />
	</div>

	<!-- Mobile Sidebar Drawer -->
	{#if mobileMenuOpen}
		<div class="fixed inset-0 z-50 flex lg:hidden">
			<!-- Backdrop -->
			<button
				class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
				onclick={() => (mobileMenuOpen = false)}
				aria-label="Close sidebar"
			></button>

			<!-- Drawer Panel -->
			<div class="relative z-10 flex h-full w-60 flex-col bg-[#2C3531] shadow-2xl">
				<Sidebar collapsed={false} />
			</div>
		</div>
	{/if}

	<!-- Main content area -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- TopBar -->
		<TopBar title={pageTitle} onMenuToggle={() => (mobileMenuOpen = !mobileMenuOpen)} />

		<!-- Page content -->
		<main class="flex-1 overflow-y-auto">
			<div class="mx-auto max-w-7xl p-4 sm:p-6">
				{@render children()}
			</div>
		</main>
	</div>
</div>

<ToastContainer />
