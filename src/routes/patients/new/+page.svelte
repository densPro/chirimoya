<script lang="ts">
	import { goto } from '$app/navigation';
	import { createPatient } from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import type { PatientCreateDTO, PatientUpdateDTO } from '$lib/types';
	import PatientForm from '$lib/components/patients/PatientForm.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	let loading = $state(false);

	async function handleSave(dto: PatientCreateDTO | PatientUpdateDTO) {
		loading = true;
		try {
			const patient = await createPatient(dto as PatientCreateDTO);
			addToast($_('patients.toasts.createSuccess', { values: { name: patient.full_name } }), 'success');
			await goto(`/patients/${patient.id}`);
		} catch (err) {
			addToast(err instanceof Error ? err.message : $_('patients.toasts.createFailed'), 'error');
			throw err;
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/patients');
	}
</script>

<div class="space-y-5">
	<div class="flex items-center gap-3">
		<a
			href="/patients"
			class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#FDFBF7]/50 transition-colors hover:border-white/20 hover:text-[#FDFBF7]"
		>
			<ArrowLeft size={16} />
		</a>
		<div>
			<h2 class="text-2xl font-bold text-[#FDFBF7]">{$_('patients.newPatient')}</h2>
			<p class="text-sm text-[#FDFBF7]/40">{$_('patients.registerDescription')}</p>
		</div>
	</div>

	<div class="rounded-xl border border-white/[0.06] bg-[#35403B] overflow-hidden">
		<PatientForm onSave={handleSave} onCancel={handleCancel} {loading} />
	</div>
</div>
