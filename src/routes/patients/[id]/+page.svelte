<script lang="ts">
	import { goto } from '$app/navigation';
	import { updatePatient } from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import type { PatientResponseDTO, PatientUpdateDTO, PatientStatus } from '$lib/types';
	import { formatDate, formatGender, formatMaritalStatus, getInitials } from '$lib/utils/formatters';
	import PatientStatusBadge from '$lib/components/patients/PatientStatusBadge.svelte';
	import PatientForm from '$lib/components/patients/PatientForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import BMIGauge from '$lib/components/measurements/BMIGauge.svelte';
	import { ArrowLeft, Pencil, X } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		data: { patient: PatientResponseDTO };
	}

	let { data }: Props = $props();
	let patient = $state(data.patient);

	const tabs = ['overview', 'medical', 'emergency', 'measurements'] as const;
	let activeTab = $state(0);
	let editModalOpen = $state(false);
	let editLoading = $state(false);
	let statusLoading = $state(false);

	const initials = $derived(getInitials(patient.first_name, patient.last_name));

	async function handleEditSave(dto: PatientUpdateDTO) {
		editLoading = true;
		try {
			patient = await updatePatient(patient.id, dto);
			addToast($_('patients.toasts.updateSuccess'), 'success');
			editModalOpen = false;
		} catch (err) {
			addToast(err instanceof Error ? err.message : $_('patients.toasts.updateFailed'), 'error');
			throw err;
		} finally {
			editLoading = false;
		}
	}

	async function handleStatusChange(newStatus: PatientStatus) {
		statusLoading = true;
		try {
			patient = await updatePatient(patient.id, { status: newStatus });
			addToast($_('patients.toasts.statusSuccess', { values: { status: newStatus } }), 'success');
		} catch (err) {
			addToast(err instanceof Error ? err.message : $_('patients.toasts.statusFailed'), 'error');
		} finally {
			statusLoading = false;
		}
	}
</script>

<div class="space-y-5">
	<!-- Back -->
	<div class="flex items-center gap-3">
		<a
			href="/patients"
			class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#FDFBF7]/50 transition-colors hover:border-white/20 hover:text-[#FDFBF7]"
		>
			<ArrowLeft size={16} />
		</a>
		<p class="text-sm text-[#FDFBF7]/40">{$_('patient.back')}</p>
	</div>

	<!-- Patient Header -->
	<Card>
		<div class="flex items-start justify-between gap-4">
			<div class="flex items-center gap-4">
				<!-- Avatar -->
				<div
					class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#D4E79E]/15 text-xl font-bold text-[#D4E79E]"
				>
					{initials}
				</div>
				<!-- Name + meta -->
				<div>
					<h2 class="text-xl font-bold text-[#FDFBF7]">{patient.full_name}</h2>
					<div class="mt-1 flex flex-wrap items-center gap-2">
						<span class="font-mono text-xs text-[#FDFBF7]/40">MRN: {patient.mrn}</span>
						<PatientStatusBadge status={patient.status} />
						{#if patient.blood_type && patient.blood_type !== 'unknown'}
							<span class="rounded-full border border-[#D4E79E]/30 bg-[#D4E79E]/10 px-2.5 py-0.5 text-xs font-medium text-[#D4E79E]">
								{patient.blood_type}
							</span>
						{/if}
						{#if patient.age != null}
							<span class="text-xs text-[#FDFBF7]/50">{$_('patient.age', { values: { age: patient.age } })}</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-2">
				<!-- Status quick-change -->
				<div class="flex items-center gap-1 rounded-lg border border-white/10 p-1">
					{#each (['active', 'inactive', 'deceased'] as PatientStatus[]) as s (s)}
						<button
							onclick={() => handleStatusChange(s)}
							disabled={statusLoading || patient.status === s}
							class="rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors {patient.status === s
								? s === 'active'
									? 'bg-[#96C499]/20 text-[#96C499]'
									: s === 'deceased'
										? 'bg-red-500/20 text-red-300'
										: 'bg-white/10 text-[#FDFBF7]/60'
								: 'text-[#FDFBF7]/30 hover:text-[#FDFBF7]/60'}"
						>
							{$_('status.' + s)}
						</button>
					{/each}
				</div>
				<Button variant="secondary" onclick={() => (editModalOpen = true)}>
					<Pencil size={14} />
					{$_('patient.edit')}
				</Button>
			</div>
		</div>
	</Card>

	<!-- Tabs -->
	<div class="flex border-b border-white/[0.06]">
		{#each tabs as tab, i (tab)}
			<button
				onclick={() => (activeTab = i)}
				class="relative px-4 py-2.5 text-sm font-medium transition-colors {activeTab === i
					? 'text-[#D4E79E]'
					: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
			>
				{$_(`patient.tabs.${tab}`)}
				{#if activeTab === i}
					<span class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-[#D4E79E]"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	{#if activeTab === 0}
		<!-- Overview -->
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.demographics.title')}</h3>
				<dl class="space-y-3">
					<div class="flex justify-between">
						<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.dob')}</dt>
						<dd class="text-sm font-medium text-[#FDFBF7]">{formatDate(patient.date_of_birth)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.gender')}</dt>
						<dd class="text-sm font-medium capitalize text-[#FDFBF7]">
							{$_('form.genderOptions.' + patient.gender, { default: formatGender(patient.gender) })}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.maritalStatus')}</dt>
						<dd class="text-sm font-medium capitalize text-[#FDFBF7]">
							{$_('form.maritalOptions.' + patient.marital_status, { default: formatMaritalStatus(patient.marital_status) })}
						</dd>
					</div>
					{#if patient.ssn_last_four}
						<div class="flex justify-between">
							<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.ssn')}</dt>
							<dd class="clinical text-sm">•••• {patient.ssn_last_four}</dd>
						</div>
					{/if}
					{#if patient.national_id}
						<div class="flex justify-between">
							<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.nationalId')}</dt>
							<dd class="clinical text-sm">{patient.national_id}</dd>
						</div>
					{/if}
					<div class="flex justify-between">
						<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.demographics.registered')}</dt>
						<dd class="text-sm text-[#FDFBF7]/60">{formatDate(patient.created_at)}</dd>
					</div>
				</dl>
			</Card>

			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.contact.title')}</h3>
				{#if patient.contact_info}
					<dl class="space-y-3">
						<div class="flex justify-between">
							<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.contact.phone')}</dt>
							<dd class="clinical text-sm">{patient.contact_info.phone_number}</dd>
						</div>
						{#if patient.contact_info.email}
							<div class="flex justify-between">
								<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.contact.email')}</dt>
								<dd class="text-sm text-[#FDFBF7]">{patient.contact_info.email}</dd>
							</div>
						{/if}
						{#if patient.contact_info.secondary_phone}
							<div class="flex justify-between">
								<dt class="text-sm text-[#FDFBF7]/50">{$_('patient.contact.secondaryPhone')}</dt>
								<dd class="clinical text-sm">{patient.contact_info.secondary_phone}</dd>
							</div>
						{/if}
					</dl>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.contact.noInfo')}</p>
				{/if}

				{#if patient.address}
					<div class="mt-4 border-t border-white/[0.06] pt-4">
						<h4 class="mb-2 text-xs font-medium text-[#FDFBF7]/40">{$_('patient.contact.address')}</h4>
						<p class="text-sm text-[#FDFBF7]/70">
							{patient.address.street_line_1}
							{#if patient.address.street_line_2}<br />{patient.address.street_line_2}{/if}<br />
							{patient.address.city}, {patient.address.state} {patient.address.postal_code}<br />
							{patient.address.country}
						</p>
					</div>
				{/if}
			</Card>

			<!-- Latest BMI -->
			{#if patient.latest_measurement?.bmi != null}
				<Card>
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.measurements.latestBmi')}</h3>
					<BMIGauge bmi={patient.latest_measurement.bmi} category={patient.latest_measurement.bmi_category} />
				</Card>
			{/if}
		</div>

	{:else if activeTab === 1}
		<!-- Medical -->
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.medical.bloodType')}</h3>
				{#if patient.blood_type && patient.blood_type !== 'unknown'}
					<span class="clinical text-4xl">{patient.blood_type}</span>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.medical.unknown')}</p>
				{/if}
			</Card>

			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.medical.allergies')}</h3>
				{#if patient.allergies.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each patient.allergies as a (a)}
							<span class="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-300">{a}</span>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.medical.noAllergies')}</p>
				{/if}
			</Card>

			<Card class="lg:col-span-2">
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.medical.chronicConditions')}</h3>
				{#if patient.chronic_conditions.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each patient.chronic_conditions as c (c)}
							<span class="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-300">{c}</span>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.medical.noChronic')}</p>
				{/if}
			</Card>

			{#if patient.notes}
				<Card class="lg:col-span-2">
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.medical.clinicalNotes')}</h3>
					<p class="whitespace-pre-wrap text-sm text-[#FDFBF7]/70">{patient.notes}</p>
				</Card>
			{/if}
		</div>

	{:else if activeTab === 2}
		<!-- Emergency & Insurance -->
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.emergency.title')}</h3>
				{#if patient.emergency_contact}
					{@const ec = patient.emergency_contact}
					<dl class="space-y-3">
						<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.emergency.name')}</dt><dd class="text-sm font-medium text-[#FDFBF7]">{ec.full_name}</dd></div>
						<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.emergency.relationship')}</dt><dd class="text-sm text-[#FDFBF7]">{ec.relationship}</dd></div>
						<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.emergency.phone')}</dt><dd class="clinical text-sm">{ec.phone_number}</dd></div>
						{#if ec.email}<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.emergency.email')}</dt><dd class="text-sm text-[#FDFBF7]">{ec.email}</dd></div>{/if}
					</dl>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.emergency.noContact')}</p>
				{/if}
			</Card>

			<Card>
				<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.insurance.title')}</h3>
				{#if patient.insurance_info}
					{@const ins = patient.insurance_info}
					<dl class="space-y-3">
						<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.provider')}</dt><dd class="text-sm font-medium text-[#FDFBF7]">{ins.provider_name}</dd></div>
						<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.policy')}</dt><dd class="clinical text-sm">{ins.policy_number}</dd></div>
						{#if ins.group_number}<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.group')}</dt><dd class="clinical text-sm">{ins.group_number}</dd></div>{/if}
						{#if ins.subscriber_name}<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.subscriber')}</dt><dd class="text-sm text-[#FDFBF7]">{ins.subscriber_name}</dd></div>{/if}
						{#if ins.effective_date}<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.effective')}</dt><dd class="text-sm text-[#FDFBF7]">{formatDate(ins.effective_date)}</dd></div>{/if}
						{#if ins.expiration_date}<div class="flex justify-between"><dt class="text-sm text-[#FDFBF7]/50">{$_('patient.insurance.expires')}</dt><dd class="text-sm text-[#FDFBF7]">{formatDate(ins.expiration_date)}</dd></div>{/if}
					</dl>
				{:else}
					<p class="text-sm text-[#FDFBF7]/30">{$_('patient.insurance.noInsurance')}</p>
				{/if}
			</Card>
		</div>

	{:else if activeTab === 3}
		<!-- Measurements -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-[#FDFBF7]/70">{$_('patient.measurements.title')}</h3>
			<a
				href="/patients/{patient.id}/measurements"
				class="text-sm font-medium text-[#D4E79E] transition-colors hover:text-[#D4E79E]/80"
			>
				{$_('patient.measurements.fullHistory')}
			</a>
		</div>
		{#if patient.latest_measurement}
			<div class="rounded-xl border border-white/[0.06] bg-[#35403B] p-4">
				<p class="mb-3 text-xs font-medium uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.measurements.latestMeasurements')}</p>
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
					{#if patient.latest_measurement.height_cm != null}<div class="text-center"><p class="clinical text-base">{patient.latest_measurement.height_cm.toFixed(1)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">cm</p></div>{/if}
					{#if patient.latest_measurement.weight_kg != null}<div class="text-center"><p class="clinical text-base">{patient.latest_measurement.weight_kg.toFixed(2)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">kg</p></div>{/if}
					{#if patient.latest_measurement.bmi != null}<div class="text-center"><p class="clinical text-base">{patient.latest_measurement.bmi.toFixed(2)}</p><p class="text-[10px] uppercase tracking-wide text-[#FDFBF7]/40">BMI</p></div>{/if}
				</div>
			</div>
		{:else}
			<p class="text-sm text-[#FDFBF7]/30">{$_('patient.measurements.noMeasurements')}</p>
		{/if}
		<div class="mt-3">
			<a href="/patients/{patient.id}/measurements" class="inline-flex items-center gap-2 rounded-lg border border-[#D4E79E]/20 bg-[#D4E79E]/5 px-4 py-2.5 text-sm font-medium text-[#D4E79E] transition-all hover:bg-[#D4E79E]/10">
				{$_('patient.measurements.recordNew')}
			</a>
		</div>
	{/if}
</div>

<!-- Edit Modal -->
<Modal bind:open={editModalOpen} title={$_('patients.editPatient')} size="xl" onClose={() => (editModalOpen = false)}>
	<PatientForm
		{patient}
		onSave={handleEditSave}
		onCancel={() => (editModalOpen = false)}
		loading={editLoading}
	/>
</Modal>
