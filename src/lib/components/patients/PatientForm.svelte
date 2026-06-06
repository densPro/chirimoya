<script lang="ts">
	import type {
		PatientResponseDTO,
		PatientCreateDTO,
		PatientUpdateDTO,
		Gender,
		MaritalStatus,
		BloodType
	} from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { validatePatientCreate } from '$lib/utils/validators';
	import { X } from '@lucide/svelte';

	interface Props {
		patient?: PatientResponseDTO;
		onSave: (dto: PatientCreateDTO | PatientUpdateDTO) => Promise<void>;
		onCancel: () => void;
		loading?: boolean;
	}

	let { patient, onSave, onCancel, loading = false }: Props = $props();

	// ── Tabs ──────────────────────────────────────────────────────────────────
	const tabs = ['Demographics', 'Medical', 'Contact & Address', 'Emergency & Insurance'] as const;
	let activeTab = $state(0);

	// ── Form State ────────────────────────────────────────────────────────────
	let firstName = $state(patient?.first_name ?? '');
	let lastName = $state(patient?.last_name ?? '');
	let dob = $state(patient?.date_of_birth ?? '');
	let gender = $state<string>(patient?.gender ?? '');
	let maritalStatus = $state<string>(patient?.marital_status ?? '');
	let ssnLast4 = $state(patient?.ssn_last_four ?? '');
	let nationalId = $state(patient?.national_id ?? '');

	// Medical
	let bloodType = $state<string>(patient?.blood_type ?? '');
	let allergiesInput = $state('');
	let allergies = $state<string[]>(patient?.allergies ?? []);
	let conditionsInput = $state('');
	let conditions = $state<string[]>(patient?.chronic_conditions ?? []);
	let notes = $state(patient?.notes ?? '');

	// Contact
	let phone = $state(patient?.contact_info?.phone_number ?? '');
	let email = $state(patient?.contact_info?.email ?? '');
	let secondaryPhone = $state(patient?.contact_info?.secondary_phone ?? '');

	// Address
	let street1 = $state(patient?.address?.street_line_1 ?? '');
	let street2 = $state(patient?.address?.street_line_2 ?? '');
	let city = $state(patient?.address?.city ?? '');
	let state_ = $state(patient?.address?.state ?? '');
	let postalCode = $state(patient?.address?.postal_code ?? '');
	let country = $state(patient?.address?.country ?? 'US');

	// Emergency contact
	let ecName = $state(patient?.emergency_contact?.full_name ?? '');
	let ecRelation = $state(patient?.emergency_contact?.relationship ?? '');
	let ecPhone = $state(patient?.emergency_contact?.phone_number ?? '');
	let ecEmail = $state(patient?.emergency_contact?.email ?? '');

	// Insurance
	let insProvider = $state(patient?.insurance_info?.provider_name ?? '');
	let insPolicy = $state(patient?.insurance_info?.policy_number ?? '');
	let insGroup = $state(patient?.insurance_info?.group_number ?? '');
	let insSubscriber = $state(patient?.insurance_info?.subscriber_name ?? '');
	let insSubRelation = $state(patient?.insurance_info?.subscriber_relationship ?? '');
	let insEffective = $state(patient?.insurance_info?.effective_date ?? '');
	let insExpiration = $state(patient?.insurance_info?.expiration_date ?? '');

	let errors = $state<Record<string, string>>({});
	let globalError = $state('');

	// ── Tag input helpers ─────────────────────────────────────────────────────
	function addTag(input: string, list: string[]): [string, string[]] {
		const tag = input.trim();
		if (tag && !list.includes(tag)) return ['', [...list, tag]];
		return ['', list];
	}

	function handleAllergyKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			[allergiesInput, allergies] = addTag(allergiesInput, allergies);
		}
	}

	function handleConditionKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			[conditionsInput, conditions] = addTag(conditionsInput, conditions);
		}
	}

	// ── Select options ────────────────────────────────────────────────────────
	const genderOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'non_binary', label: 'Non-binary' },
		{ value: 'other', label: 'Other' },
		{ value: 'prefer_not_to_say', label: 'Prefer not to say' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const maritalOptions = [
		{ value: 'single', label: 'Single' },
		{ value: 'married', label: 'Married' },
		{ value: 'divorced', label: 'Divorced' },
		{ value: 'widowed', label: 'Widowed' },
		{ value: 'separated', label: 'Separated' },
		{ value: 'domestic_partner', label: 'Domestic Partner' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const bloodTypeOptions = [
		{ value: 'A+', label: 'A+' },
		{ value: 'A-', label: 'A-' },
		{ value: 'B+', label: 'B+' },
		{ value: 'B-', label: 'B-' },
		{ value: 'AB+', label: 'AB+' },
		{ value: 'AB-', label: 'AB-' },
		{ value: 'O+', label: 'O+' },
		{ value: 'O-', label: 'O-' },
		{ value: 'unknown', label: 'Unknown' }
	];

	// ── Submit ─────────────────────────────────────────────────────────────────
	async function handleSubmit() {
		globalError = '';
		errors = {};

		const contactInfo = { phone_number: phone, email: email || undefined, secondary_phone: secondaryPhone || undefined };
		const validation = validatePatientCreate({
			first_name: firstName,
			last_name: lastName,
			date_of_birth: dob,
			gender,
			contact_info: contactInfo
		});

		if (!validation.valid) {
			errors = validation.errors;
			// Jump to first error tab
			if (errors.first_name || errors.last_name || errors.date_of_birth || errors.gender) {
				activeTab = 0;
			} else if (errors.phone_number || errors.email) {
				activeTab = 2;
			}
			return;
		}

		const dto: PatientCreateDTO | PatientUpdateDTO = {
			first_name: firstName,
			last_name: lastName,
			date_of_birth: dob,
			gender: gender as Gender,
			marital_status: maritalStatus ? (maritalStatus as MaritalStatus) : undefined,
			ssn_last_four: ssnLast4 || undefined,
			national_id: nationalId || undefined,
			blood_type: bloodType ? (bloodType as BloodType) : undefined,
			allergies,
			chronic_conditions: conditions,
			notes: notes || undefined,
			contact_info: contactInfo,
			address:
				street1
					? { street_line_1: street1, street_line_2: street2 || undefined, city, state: state_, postal_code: postalCode, country: country || 'US' }
					: undefined,
			emergency_contact:
				ecName
					? { full_name: ecName, relationship: ecRelation, phone_number: ecPhone, email: ecEmail || undefined }
					: undefined,
			insurance_info:
				insProvider
					? {
							provider_name: insProvider,
							policy_number: insPolicy,
							group_number: insGroup || undefined,
							subscriber_name: insSubscriber || undefined,
							subscriber_relationship: insSubRelation || undefined,
							effective_date: insEffective || undefined,
							expiration_date: insExpiration || undefined
					  }
					: undefined
		};

		try {
			await onSave(dto);
		} catch (err) {
			globalError = err instanceof Error ? err.message : 'An error occurred';
		}
	}
</script>

<div class="flex flex-col">
	<!-- Tab Bar -->
	<div class="flex border-b border-white/[0.06] px-6 pt-2">
		{#each tabs as tab, i (tab)}
			<button
				onclick={() => (activeTab = i)}
				class="relative mr-1 px-3 py-2.5 text-sm font-medium transition-colors {activeTab === i
					? 'text-[#D4E79E]'
					: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
			>
				{tab}
				{#if activeTab === i}
					<span class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-[#D4E79E]"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-y-auto p-6">
		<!-- Tab 0: Demographics -->
		{#if activeTab === 0}
			<div class="grid grid-cols-2 gap-4">
				<Input id="first_name" label="First Name" bind:value={firstName} required error={errors.first_name} />
				<Input id="last_name" label="Last Name" bind:value={lastName} required error={errors.last_name} />
				<Input id="dob" label="Date of Birth" type="date" bind:value={dob} required error={errors.date_of_birth} />
				<Select id="gender" label="Gender" bind:value={gender} options={genderOptions} placeholder="Select gender" required error={errors.gender} />
				<Select id="marital_status" label="Marital Status" bind:value={maritalStatus} options={maritalOptions} placeholder="Select status" />
				<Input id="ssn" label="SSN Last 4 Digits" bind:value={ssnLast4} placeholder="1234" maxlength="4" hint="Optional" />
				<Input id="national_id" label="National ID" bind:value={nationalId} hint="Optional" class="col-span-2" />
			</div>
		{/if}

		<!-- Tab 1: Medical -->
		{#if activeTab === 1}
			<div class="space-y-4">
				<Select id="blood_type" label="Blood Type" bind:value={bloodType} options={bloodTypeOptions} placeholder="Select blood type" />

				<!-- Allergies tag input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-[#FDFBF7]/80">Allergies</label>
					{#if allergies.length > 0}
						<div class="flex flex-wrap gap-1.5">
							{#each allergies as a (a)}
								<span class="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs text-red-300">
									{a}
									<button onclick={() => (allergies = allergies.filter((x) => x !== a))} class="hover:text-red-200">
										<X size={10} />
									</button>
								</span>
							{/each}
						</div>
					{/if}
					<input
						type="text"
						bind:value={allergiesInput}
						onkeydown={handleAllergyKey}
						placeholder="Type allergy and press Enter"
						class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
					/>
				</div>

				<!-- Chronic conditions tag input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-[#FDFBF7]/80">Chronic Conditions</label>
					{#if conditions.length > 0}
						<div class="flex flex-wrap gap-1.5">
							{#each conditions as c (c)}
								<span class="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-300">
									{c}
									<button onclick={() => (conditions = conditions.filter((x) => x !== c))} class="hover:text-yellow-200">
										<X size={10} />
									</button>
								</span>
							{/each}
						</div>
					{/if}
					<input
						type="text"
						bind:value={conditionsInput}
						onkeydown={handleConditionKey}
						placeholder="Type condition and press Enter"
						class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
					/>
				</div>

				<Textarea id="notes" label="Clinical Notes" bind:value={notes} rows={4} placeholder="Optional notes…" />
			</div>
		{/if}

		<!-- Tab 2: Contact & Address -->
		{#if activeTab === 2}
			<div class="space-y-5">
				<div>
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Contact Information</h3>
					<div class="grid grid-cols-2 gap-4">
						<Input id="phone" label="Phone Number" type="tel" bind:value={phone} required error={errors.phone_number} />
						<Input id="email" label="Email Address" type="email" bind:value={email} error={errors.email} hint="Optional" />
						<Input id="secondary_phone" label="Secondary Phone" type="tel" bind:value={secondaryPhone} hint="Optional" />
					</div>
				</div>
				<div class="border-t border-white/[0.06] pt-4">
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Address (Optional)</h3>
					<div class="grid grid-cols-2 gap-4">
						<Input id="street1" label="Street Line 1" bind:value={street1} class="col-span-2" />
						<Input id="street2" label="Street Line 2" bind:value={street2} class="col-span-2" hint="Apartment, suite, etc." />
						<Input id="city" label="City" bind:value={city} />
						<Input id="state" label="State / Province" bind:value={state_} />
						<Input id="postal" label="Postal Code" bind:value={postalCode} />
						<Input id="country" label="Country" bind:value={country} />
					</div>
				</div>
			</div>
		{/if}

		<!-- Tab 3: Emergency & Insurance -->
		{#if activeTab === 3}
			<div class="space-y-5">
				<div>
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Emergency Contact (Optional)</h3>
					<div class="grid grid-cols-2 gap-4">
						<Input id="ec_name" label="Full Name" bind:value={ecName} class="col-span-2" />
						<Input id="ec_relation" label="Relationship" bind:value={ecRelation} />
						<Input id="ec_phone" label="Phone Number" type="tel" bind:value={ecPhone} />
						<Input id="ec_email" label="Email" type="email" bind:value={ecEmail} hint="Optional" />
					</div>
				</div>
				<div class="border-t border-white/[0.06] pt-4">
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Insurance Information (Optional)</h3>
					<div class="grid grid-cols-2 gap-4">
						<Input id="ins_provider" label="Provider Name" bind:value={insProvider} class="col-span-2" />
						<Input id="ins_policy" label="Policy Number" bind:value={insPolicy} />
						<Input id="ins_group" label="Group Number" bind:value={insGroup} hint="Optional" />
						<Input id="ins_subscriber" label="Subscriber Name" bind:value={insSubscriber} hint="Optional" />
						<Input id="ins_sub_rel" label="Subscriber Relationship" bind:value={insSubRelation} hint="Optional" />
						<Input id="ins_effective" label="Effective Date" type="date" bind:value={insEffective} hint="Optional" />
						<Input id="ins_expiration" label="Expiration Date" type="date" bind:value={insExpiration} hint="Optional" />
					</div>
				</div>
			</div>
		{/if}

		{#if globalError}
			<p class="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
				{globalError}
			</p>
		{/if}
	</div>

	<!-- Footer actions -->
	<div class="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
		<div class="flex gap-2">
			{#if activeTab > 0}
				<Button variant="ghost" onclick={() => activeTab--}>← Previous</Button>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			<Button variant="ghost" onclick={onCancel}>Cancel</Button>
			{#if activeTab < tabs.length - 1}
				<Button variant="secondary" onclick={() => activeTab++}>Next →</Button>
			{:else}
				<Button variant="primary" {loading} onclick={handleSubmit} type="button">
					{patient ? 'Save Changes' : 'Create Patient'}
				</Button>
			{/if}
		</div>
	</div>
</div>
