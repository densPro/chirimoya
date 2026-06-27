<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';

	let { children } = $props();

	let sidebarCollapsed = $state(false);

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
	<!-- Sidebar -->
	<Sidebar bind:collapsed={sidebarCollapsed} />

	<!-- Main content area -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- TopBar -->
		<TopBar title={pageTitle} />

		<!-- Page content -->
		<main class="flex-1 overflow-y-auto">
			<div class="mx-auto max-w-7xl p-6">
				{@render children()}
			</div>
		</main>
	</div>
</div>

<ToastContainer />
