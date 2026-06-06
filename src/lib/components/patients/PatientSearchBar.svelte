<script lang="ts">
	import type { PatientStatus } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import { Search } from '@lucide/svelte';

	interface Props {
		onSearch: (params: {
			first_name?: string;
			last_name?: string;
			mrn?: string;
			date_of_birth?: string;
			status?: PatientStatus;
		}) => void;
	}

	let { onSearch }: Props = $props();

	let firstName = $state('');
	let lastName = $state('');
	let mrn = $state('');
	let dob = $state('');
	let activeStatus = $state<PatientStatus | undefined>(undefined);

	const statusOptions: { value: PatientStatus | ''; label: string }[] = [
		{ value: '', label: 'All' },
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'deceased', label: 'Deceased' }
	];

	let debounceTimer: ReturnType<typeof setTimeout>;

	function triggerSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearch({
				first_name: firstName || undefined,
				last_name: lastName || undefined,
				mrn: mrn || undefined,
				date_of_birth: dob || undefined,
				status: activeStatus
			});
		}, 350);
	}

	function setStatus(s: PatientStatus | undefined) {
		activeStatus = s;
		triggerSearch();
	}

	function handleReset() {
		firstName = '';
		lastName = '';
		mrn = '';
		dob = '';
		activeStatus = undefined;
		onSearch({});
	}
</script>

<div class="space-y-4 rounded-xl border border-white/[0.06] bg-[#35403B] p-4">
	<!-- Text filters -->
	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="relative">
			<Search size={13} class="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDFBF7]/30" />
			<input
				type="text"
				bind:value={firstName}
				oninput={triggerSearch}
				placeholder="First name"
				class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] pl-8 pr-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
			/>
		</div>
		<input
			type="text"
			bind:value={lastName}
			oninput={triggerSearch}
			placeholder="Last name"
			class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
		/>
		<input
			type="text"
			bind:value={mrn}
			oninput={triggerSearch}
			placeholder="MRN"
			class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30 font-mono"
		/>
		<input
			type="date"
			bind:value={dob}
			oninput={triggerSearch}
			class="h-9 rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
		/>
	</div>

	<!-- Status chips + reset -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-xs text-[#FDFBF7]/40">Status:</span>
			{#each statusOptions as opt (opt.value)}
				<button
					onclick={() => setStatus(opt.value === '' ? undefined : (opt.value as PatientStatus))}
					class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 {(activeStatus === undefined && opt.value === '') || activeStatus === opt.value
						? 'border-[#D4E79E]/40 bg-[#D4E79E]/10 text-[#D4E79E]'
						: 'border-white/10 text-[#FDFBF7]/50 hover:border-white/20 hover:text-[#FDFBF7]'}"
				>
					{opt.label}
				</button>
			{/each}
		</div>
		<button
			onclick={handleReset}
			class="text-xs text-[#FDFBF7]/30 transition-colors hover:text-[#FDFBF7]/60"
		>
			Reset filters
		</button>
	</div>
</div>
