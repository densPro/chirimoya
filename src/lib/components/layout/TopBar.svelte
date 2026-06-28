<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search } from '@lucide/svelte';
	import { locale, _ } from 'svelte-i18n';

	interface Props {
		title?: string;
		onMenuToggle?: () => void;
	}

	let { title = 'Chirimoya', onMenuToggle }: Props = $props();

	let searchQuery = $state('');

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchQuery.trim()) {
			goto(`/patients?mrn=${encodeURIComponent(searchQuery.trim())}`);
			searchQuery = '';
		}
	}

	function changeLocale(lang: string) {
		locale.set(lang);
		localStorage.setItem('locale', lang);
	}
</script>

<header
	class="glass flex h-14 items-center justify-between border-b border-white/[0.06] px-4 lg:px-6 flex-shrink-0"
>
	<div class="flex items-center gap-3">
		<!-- Hamburger Menu Toggle (Mobile) -->
		<button
			type="button"
			class="flex h-9 w-9 items-center justify-center rounded-xl text-[#FDFBF7]/50 transition hover:bg-white/5 hover:text-[#FDFBF7] lg:hidden"
			onclick={onMenuToggle}
			aria-label="Toggle menu"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="3" y1="12" x2="21" y2="12"></line>
				<line x1="3" y1="6" x2="21" y2="6"></line>
				<line x1="3" y1="18" x2="21" y2="18"></line>
			</svg>
		</button>

		<!-- Breadcrumb / Page Title -->
		<h1 class="text-sm font-semibold text-[#FDFBF7]/80 line-clamp-1">{title}</h1>
	</div>

	<!-- Quick Search & Settings -->
	<div class="flex items-center gap-3 sm:gap-4">
		<div class="relative hidden sm:block">
			<Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDFBF7]/30" />
			<input
				type="search"
				bind:value={searchQuery}
				onkeydown={handleSearch}
				placeholder={$_('topbar.searchPlaceholder')}
				class="h-8 w-36 md:w-52 rounded-lg border border-white/10 bg-[#2C3531]/60 pl-8 pr-3 text-xs text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none transition focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			/>
		</div>

		<!-- Language Switcher -->
		<div class="flex items-center rounded-lg border border-white/10 bg-[#2C3531]/60 p-0.5">
			<button
				onclick={() => changeLocale('en')}
				class="rounded px-2 py-1 text-[10px] font-bold tracking-wider transition-all {$locale?.startsWith('en') ? 'bg-[#D4E79E]/20 text-[#D4E79E]' : 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/75'}"
			>
				EN
			</button>
			<button
				onclick={() => changeLocale('es')}
				class="rounded px-2 py-1 text-[10px] font-bold tracking-wider transition-all {$locale?.startsWith('es') ? 'bg-[#D4E79E]/20 text-[#D4E79E]' : 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/75'}"
			>
				ES
			</button>
		</div>

		<!-- User Avatar -->
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4E79E]/20 text-xs font-bold text-[#D4E79E]"
		>
			DR
		</div>
	</div>
</header>
