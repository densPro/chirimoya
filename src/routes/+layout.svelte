<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let sidebarCollapsed = $state(false);

	// Derive page title from route
	const pageTitle = $derived.by(() => {
		const path = $page.url.pathname;
		if (path === '/') return 'Dashboard';
		if (path.startsWith('/patients/new')) return 'New Patient';
		if (path.match(/\/patients\/[^/]+\/measurements/)) return 'Measurement History';
		if (path.match(/\/patients\/[^/]+/)) return 'Patient Profile';
		if (path === '/patients') return 'Patients';
		if (path === '/health') return 'API Health';
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
