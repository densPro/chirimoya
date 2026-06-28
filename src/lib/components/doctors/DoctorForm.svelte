<script lang="ts">
	import type {
		DoctorCreateDTO,
		DoctorUpdateDTO,
		DoctorResponseDTO,
		DoctorStatus,
		Gender,
		SpecialtyResponseDTO
	} from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		doctor?: DoctorResponseDTO;
		specialties: SpecialtyResponseDTO[];
		onSave: (dto: DoctorCreateDTO | DoctorUpdateDTO) => Promise<void>;
		onCancel: () => void;
		loading: boolean;
	}

	let { doctor, specialties, onSave, onCancel, loading }: Props = $props();

	const isEdit = $derived(!!doctor);

	// ── form fields ──────────────────────────────────────────────────────────
	let activeTab = $state<'demographics' | 'professional' | 'contact'>('demographics');

	let firstName      = $state(doctor?.first_name ?? '');
	let lastName       = $state(doctor?.last_name ?? '');
	let dateOfBirth    = $state(doctor?.date_of_birth ?? '');
	let gender         = $state<Gender>(doctor?.gender ?? 'unknown');
	let specialtyId    = $state(doctor?.specialty_id ?? '');
	let yearsExp       = $state(doctor?.years_of_experience?.toString() ?? '');
	let bio            = $state(doctor?.bio ?? '');
	let statusField    = $state<DoctorStatus>(doctor?.status ?? 'active');

	// license
	let licenseNumber  = $state(doctor?.license_info?.license_number ?? '');
	let issuingBody    = $state(doctor?.license_info?.issuing_body ?? '');
	let licenseIssue   = $state(doctor?.license_info?.issue_date ?? '');
	let licenseExpiry  = $state(doctor?.license_info?.expiration_date ?? '');
	let licenseState   = $state(doctor?.license_info?.state ?? '');

	// contact
	let phone  = $state(doctor?.contact_info?.phone_number ?? '');
	let email  = $state(doctor?.contact_info?.email ?? '');

	// address
	let street1    = $state(doctor?.address?.street_line_1 ?? '');
	let street2    = $state(doctor?.address?.street_line_2 ?? '');
	let city       = $state(doctor?.address?.city ?? '');
	let addrState  = $state(doctor?.address?.state ?? '');
	let postal     = $state(doctor?.address?.postal_code ?? '');
	let country    = $state(doctor?.address?.country ?? '');

	let errors = $state<Record<string, string>>({});

	// ── Options ───────────────────────────────────────────────────────────────
	const genderOptions = $derived([
		{ value: 'male' as Gender,              label: $_('form.genderOptions.male') },
		{ value: 'female' as Gender,            label: $_('form.genderOptions.female') },
		{ value: 'non_binary' as Gender,        label: $_('form.genderOptions.non_binary', { default: 'Non-Binary' }) },
		{ value: 'other' as Gender,             label: $_('form.genderOptions.other') },
		{ value: 'prefer_not_to_say' as Gender, label: $_('form.genderOptions.prefer_not_to_say', { default: 'Prefer not to say' }) },
		{ value: 'unknown' as Gender,           label: $_('form.genderOptions.unknown') }
	]);

	const statusOptions = $derived([
		{ value: 'active' as DoctorStatus,   label: $_('status.active')   },
		{ value: 'inactive' as DoctorStatus, label: $_('status.inactive') },
		{ value: 'on_leave' as DoctorStatus, label: $_('status.on_leave') },
		{ value: 'retired' as DoctorStatus,  label: $_('status.retired')  }
	]);

	const specialtyOptions = $derived(
		specialties.filter(s => s.is_active || s.id === doctor?.specialty_id)
			.map(s => ({ value: s.id, label: `${s.code} — ${s.name}` }))
	);

	const tabs = [
		{ key: 'demographics',  label: 'Demographics'  },
		{ key: 'professional',  label: 'Professional'  },
		{ key: 'contact',       label: 'Contact'        }
	] as const;

	// ── Validation ────────────────────────────────────────────────────────────
	function validate(): boolean {
		errors = {};
		if (!firstName.trim()) errors.firstName = $_('form.validation.firstNameRequired');
		if (!lastName.trim())  errors.lastName  = $_('form.validation.lastNameRequired');
		if (!specialtyId)      errors.specialty  = $_('form.validation.specialtyRequired');
		if (yearsExp && (isNaN(Number(yearsExp)) || Number(yearsExp) < 0))
			errors.yearsExp = $_('form.validation.yearsExpNonNegative');
		return Object.keys(errors).length === 0;
	}

	// ── Submit ────────────────────────────────────────────────────────────────
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) {
			if (errors.firstName || errors.lastName) {
				activeTab = 'demographics';
			} else if (errors.specialty || errors.yearsExp) {
				activeTab = 'professional';
			}
			return;
		}

		const licenseInfo =
			licenseNumber.trim() && issuingBody.trim()
				? {
					license_number: licenseNumber.trim(),
					issuing_body:   issuingBody.trim(),
					issue_date:     licenseIssue  || undefined,
					expiration_date: licenseExpiry || undefined,
					state:          licenseState   || undefined
				  }
				: undefined;

		const contactInfo =
			phone.trim() || email.trim()
				? { phone_number: phone.trim() || undefined, email: email.trim() || undefined }
				: undefined;

		const address =
			street1.trim()
				? {
					street_line_1: street1.trim(),
					street_line_2: street2.trim() || undefined,
					city:  city.trim()      || undefined,
					state: addrState.trim() || undefined,
					postal_code: postal.trim() || undefined,
					country: country.trim() || undefined
				  }
				: undefined;

		const base = {
			first_name: firstName.trim(),
			last_name:  lastName.trim(),
			date_of_birth: dateOfBirth || undefined,
			gender,
			specialty_id: specialtyId,
			years_of_experience: yearsExp ? Number(yearsExp) : undefined,
			bio: bio.trim() || undefined,
			license_info: licenseInfo,
			contact_info: contactInfo,
			address
		};

		if (isEdit) {
			await onSave({ ...base, status: statusField } as DoctorUpdateDTO);
		} else {
			await onSave(base as DoctorCreateDTO);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col">
	<!-- Tab Bar -->
	<div class="flex border-b border-white/[0.06] px-6 pt-2">
		{#each tabs as tab}
			<button
				type="button"
				onclick={() => (activeTab = tab.key)}
				class="relative mr-1 px-3 py-2.5 text-sm font-medium transition-colors {activeTab === tab.key
					? 'text-[#D4E79E]'
					: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
			>
				{$_('form.tabs.' + tab.key)}
				{#if activeTab === tab.key}
					<span class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-[#D4E79E]"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-y-auto p-6 space-y-4">
		<!-- Demographics -->
		{#if activeTab === 'demographics'}
			<div class="grid grid-cols-2 gap-4">
				<Input id="doc-first-name" label={$_('form.labels.firstName')} bind:value={firstName} required error={errors.firstName} disabled={loading} />
				<Input id="doc-last-name" label={$_('form.labels.lastName')} bind:value={lastName} required error={errors.lastName} disabled={loading} />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<Input id="doc-dob" label={$_('form.labels.dob')} type="date" bind:value={dateOfBirth} disabled={loading} />
				<Select id="doc-gender" label={$_('form.labels.gender')} bind:value={gender} options={genderOptions} disabled={loading} />
			</div>
			{#if isEdit}
				<Select id="doc-status" label={$_('form.labels.status')} bind:value={statusField} options={statusOptions} disabled={loading} />
			{/if}
		{/if}

		<!-- Professional -->
		{#if activeTab === 'professional'}
			<Select id="doc-specialty" label={$_('form.labels.specialty')} bind:value={specialtyId} options={specialtyOptions} placeholder={$_('form.placeholders.selectSpecialty')} required error={errors.specialty} disabled={loading} />
			<Input id="doc-exp" label={$_('form.labels.yearsOfExperience')} type="number" bind:value={yearsExp} error={errors.yearsExp} placeholder="0" disabled={loading} />
			
			<div class="border-t border-white/[0.06] pt-4">
				<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('form.labels.licenseInfo')} ({$_('form.optional')})</h3>
				<div class="grid grid-cols-2 gap-4">
					<Input id="doc-lic-num" label={$_('form.labels.licenseNumber')} bind:value={licenseNumber} disabled={loading} />
					<Input id="doc-lic-body" label={$_('form.labels.issuingBody')} bind:value={issuingBody} disabled={loading} />
				</div>
			</div>
			<div class="grid grid-cols-3 gap-4">
				<Input id="doc-lic-issue" label={$_('form.labels.licenseIssue')} type="date" bind:value={licenseIssue} disabled={loading} />
				<Input id="doc-lic-expiry" label={$_('form.labels.licenseExpiry')} type="date" bind:value={licenseExpiry} disabled={loading} />
				<Input id="doc-lic-state" label={$_('form.labels.licenseState')} bind:value={licenseState} placeholder="FL" disabled={loading} />
			</div>
			<Textarea id="doc-bio" label={$_('form.labels.bio')} bind:value={bio} rows={3} placeholder={$_('form.placeholders.bio')} disabled={loading} />
		{/if}

		<!-- Contact & Address -->
		{#if activeTab === 'contact'}
			<div class="grid grid-cols-2 gap-4">
				<Input id="doc-phone" label={$_('form.labels.phone')} bind:value={phone} placeholder="+1 (555) 000-0000" disabled={loading} />
				<Input id="doc-email" label={$_('form.labels.email')} type="email" bind:value={email} disabled={loading} />
			</div>
			<div class="border-t border-white/[0.06] pt-4">
				<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('form.labels.address')} ({$_('form.optional')})</h3>
				<div class="grid grid-cols-2 gap-4">
					<Input id="doc-street1" label={$_('form.labels.street1')} bind:value={street1} class="col-span-2" disabled={loading} />
					<Input id="doc-street2" label={$_('form.labels.street2')} bind:value={street2} class="col-span-2" hint={$_('form.placeholders.street2')} disabled={loading} />
					<Input id="doc-city" label={$_('form.labels.city')} bind:value={city} disabled={loading} />
					<Input id="doc-addr-state" label={$_('form.labels.state')} bind:value={addrState} disabled={loading} />
					<Input id="doc-postal" label={$_('form.labels.postal')} bind:value={postal} disabled={loading} />
					<Input id="doc-country" label={$_('form.labels.country')} bind:value={country} disabled={loading} />
				</div>
			</div>
		{/if}
	</div>

	<!-- Footer actions -->
	<div class="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
		<div class="flex gap-2">
			{#if activeTab !== 'demographics'}
				<Button variant="ghost" type="button" onclick={() => {
					if (activeTab === 'professional') activeTab = 'demographics';
					else if (activeTab === 'contact') activeTab = 'professional';
				}} disabled={loading}>← {$_('form.previous')}</Button>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			<Button variant="ghost" type="button" onclick={onCancel} disabled={loading}>
				{$_('form.cancel')}
			</Button>
			{#if activeTab !== 'contact'}
				<Button variant="secondary" type="button" onclick={() => {
					if (activeTab === 'demographics') activeTab = 'professional';
					else if (activeTab === 'professional') activeTab = 'contact';
				}} disabled={loading}>{$_('form.next')} →</Button>
			{:else}
				<Button variant="primary" type="submit" {loading}>
					{isEdit ? $_('form.saveChanges') : $_('doctors.create')}
				</Button>
			{/if}
		</div>
	</div>
</form>
