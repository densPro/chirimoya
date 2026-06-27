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
	const genderOptions: { value: Gender; label: string }[] = [
		{ value: 'male',              label: 'Male'            },
		{ value: 'female',            label: 'Female'          },
		{ value: 'non_binary',        label: 'Non-Binary'      },
		{ value: 'other',             label: 'Other'           },
		{ value: 'prefer_not_to_say', label: 'Prefer not say'  },
		{ value: 'unknown',           label: 'Unknown'         }
	];

	const statusOptions: { value: DoctorStatus; label: string }[] = [
		{ value: 'active',   label: 'Active'   },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'on_leave', label: 'On Leave' },
		{ value: 'retired',  label: 'Retired'  }
	];

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
		if (!firstName.trim()) errors.firstName = 'First name is required';
		if (!lastName.trim())  errors.lastName  = 'Last name is required';
		if (!specialtyId)      errors.specialty  = 'Specialty is required';
		if (yearsExp && (isNaN(Number(yearsExp)) || Number(yearsExp) < 0))
			errors.yearsExp = 'Must be a non-negative number';
		return Object.keys(errors).length === 0;
	}

	// ── Submit ────────────────────────────────────────────────────────────────
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) { activeTab = 'demographics'; return; }

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

<!-- Tabs -->
<div class="mb-5 flex gap-1 rounded-xl bg-black/20 p-1">
	{#each tabs as tab}
		<button
			type="button"
			onclick={() => (activeTab = tab.key)}
			class="flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200
				{activeTab === tab.key
					? 'bg-[#D4E79E]/10 text-[#D4E79E]'
					: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
		>
			{tab.label}
		</button>
	{/each}
</div>

<form onsubmit={handleSubmit} class="space-y-4">
	<!-- Demographics -->
	{#if activeTab === 'demographics'}
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">First Name *</label>
				<Input id="doc-first-name" bind:value={firstName} error={errors.firstName} disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Last Name *</label>
				<Input id="doc-last-name" bind:value={lastName} error={errors.lastName} disabled={loading} />
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Date of Birth</label>
				<Input id="doc-dob" type="date" bind:value={dateOfBirth} disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Gender</label>
				<Select id="doc-gender" bind:value={gender} options={genderOptions} disabled={loading} />
			</div>
		</div>
		{#if isEdit}
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Status</label>
				<Select id="doc-status" bind:value={statusField} options={statusOptions} disabled={loading} />
			</div>
		{/if}
	{/if}

	<!-- Professional -->
	{#if activeTab === 'professional'}
		<div>
			<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Specialty *</label>
			<Select id="doc-specialty" bind:value={specialtyId} options={specialtyOptions} error={errors.specialty} disabled={loading} />
		</div>
		<div>
			<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Years of Experience</label>
			<Input id="doc-exp" type="number" bind:value={yearsExp} error={errors.yearsExp} placeholder="0" disabled={loading} />
		</div>
		<p class="text-xs font-semibold text-[#FDFBF7]/30 uppercase tracking-wider mt-4 mb-2">License Info</p>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">License Number</label>
				<Input id="doc-lic-num" bind:value={licenseNumber} disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Issuing Body</label>
				<Input id="doc-lic-body" bind:value={issuingBody} disabled={loading} />
			</div>
		</div>
		<div class="grid grid-cols-3 gap-4">
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Issue Date</label>
				<Input id="doc-lic-issue" type="date" bind:value={licenseIssue} disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Expiry Date</label>
				<Input id="doc-lic-expiry" type="date" bind:value={licenseExpiry} disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">State</label>
				<Input id="doc-lic-state" bind:value={licenseState} placeholder="FL" disabled={loading} />
			</div>
		</div>
		<div>
			<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Bio</label>
			<Textarea id="doc-bio" bind:value={bio} rows={3} placeholder="Professional biography…" disabled={loading} />
		</div>
	{/if}

	<!-- Contact & Address -->
	{#if activeTab === 'contact'}
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Phone</label>
				<Input id="doc-phone" bind:value={phone} placeholder="+1 (555) 000-0000" disabled={loading} />
			</div>
			<div>
				<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Email</label>
				<Input id="doc-email" type="email" bind:value={email} disabled={loading} />
			</div>
		</div>
		<p class="text-xs font-semibold text-[#FDFBF7]/30 uppercase tracking-wider mt-4 mb-2">Address</p>
		<Input id="doc-street1" bind:value={street1} placeholder="Street line 1" disabled={loading} />
		<Input id="doc-street2" bind:value={street2} placeholder="Apartment, suite…" disabled={loading} />
		<div class="grid grid-cols-2 gap-4">
			<Input id="doc-city" bind:value={city} placeholder="City" disabled={loading} />
			<Input id="doc-addr-state" bind:value={addrState} placeholder="State / Province" disabled={loading} />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<Input id="doc-postal" bind:value={postal} placeholder="Postal Code" disabled={loading} />
			<Input id="doc-country" bind:value={country} placeholder="Country" disabled={loading} />
		</div>
	{/if}

	<!-- Actions -->
	<div class="flex justify-between pt-2">
		<div class="flex gap-2">
			{#if activeTab !== 'demographics'}
				<Button variant="ghost" type="button" onclick={() => {
					if (activeTab === 'professional') activeTab = 'demographics';
					else if (activeTab === 'contact') activeTab = 'professional';
				}} disabled={loading}>← Back</Button>
			{/if}
		</div>
		<div class="flex gap-3">
			<Button variant="ghost" type="button" onclick={onCancel} disabled={loading}>
				{$_('form.cancel')}
			</Button>
			{#if activeTab !== 'contact'}
				<Button type="button" onclick={() => {
					if (activeTab === 'demographics') activeTab = 'professional';
					else if (activeTab === 'professional') activeTab = 'contact';
				}} disabled={loading}>Next →</Button>
			{:else}
				<Button type="submit" {loading}>
					{isEdit ? $_('form.saveChanges') : $_('doctors.create')}
				</Button>
			{/if}
		</div>
	</div>
</form>
