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
	import { _ } from 'svelte-i18n';

	interface Props {
		patient?: PatientResponseDTO;
		onSave: (dto: PatientCreateDTO | PatientUpdateDTO) => Promise<void>;
		onCancel: () => void;
		loading?: boolean;
	}

	let { patient, onSave, onCancel, loading = false }: Props = $props();

	// ── Tabs ──────────────────────────────────────────────────────────────────
	const tabs = ['demographics', 'medical', 'contactAddress', 'emergencyInsurance'] as const;
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
	const genderOptions = $derived([
		{ value: 'male', label: $_('form.genderOptions.male') },
		{ value: 'female', label: $_('form.genderOptions.female') },
		{ value: 'non_binary', label: $_('form.genderOptions.non_binary', { default: 'Non-binary' }) },
		{ value: 'other', label: $_('form.genderOptions.other') },
		{ value: 'prefer_not_to_say', label: $_('form.genderOptions.prefer_not_to_say', { default: 'Prefer not to say' }) },
		{ value: 'unknown', label: $_('form.genderOptions.unknown') }
	]);

	const maritalOptions = $derived([
		{ value: 'single', label: $_('form.maritalOptions.single') },
		{ value: 'married', label: $_('form.maritalOptions.married') },
		{ value: 'divorced', label: $_('form.maritalOptions.divorced') },
		{ value: 'widowed', label: $_('form.maritalOptions.widowed') },
		{ value: 'separated', label: $_('form.maritalOptions.separated') },
		{ value: 'domestic_partner', label: $_('form.maritalOptions.domestic_partnership', { default: 'Domestic Partner' }) },
		{ value: 'unknown', label: $_('form.maritalOptions.unknown') }
	]);

	const bloodTypeOptions = $derived([
		{ value: 'A+', label: 'A+' },
		{ value: 'A-', label: 'A-' },
		{ value: 'B+', label: 'B+' },
		{ value: 'B-', label: 'B-' },
		{ value: 'AB+', label: 'AB+' },
		{ value: 'AB-', label: 'AB-' },
		{ value: 'O+', label: 'O+' },
		{ value: 'O-', label: 'O-' },
		{ value: 'unknown', label: $_('patient.medical.unknown') }
	]);

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
	<div class="flex border-b border-white/[0.06] px-6 pt-2 overflow-x-auto scrollbar-none whitespace-nowrap">
		{#each tabs as tab, i (tab)}
			<button
				onclick={() => (activeTab = i)}
				class="relative mr-1 px-3 py-2.5 text-sm font-medium transition-colors {activeTab === i
					? 'text-[#D4E79E]'
					: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
			>
				{$_('form.tabs.' + tab)}
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
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input id="first_name" label={$_('form.labels.firstName')} bind:value={firstName} required error={errors.first_name} />
				<Input id="last_name" label={$_('form.labels.lastName')} bind:value={lastName} required error={errors.last_name} />
				<Input id="dob" label={$_('form.labels.dob')} type="date" bind:value={dob} required error={errors.date_of_birth} />
				<Select id="gender" label={$_('form.labels.gender')} bind:value={gender} options={genderOptions} placeholder={$_('form.placeholders.selectGender')} required error={errors.gender} />
				<Select id="marital_status" label={$_('form.labels.maritalStatus')} bind:value={maritalStatus} options={maritalOptions} placeholder={$_('form.placeholders.selectMarital')} />
				<Input id="ssn" label={$_('form.labels.ssn')} bind:value={ssnLast4} placeholder="1234" maxlength="4" hint={$_('form.optional')} />
				<Input id="national_id" label={$_('form.labels.nationalId')} bind:value={nationalId} hint={$_('form.optional')} class="col-span-1 sm:col-span-2" />
			</div>
		{/if}

		<!-- Tab 1: Medical -->
		{#if activeTab === 1}
			<div class="space-y-4">
				<Select id="blood_type" label={$_('form.labels.bloodType')} bind:value={bloodType} options={bloodTypeOptions} placeholder={$_('form.placeholders.selectBloodType')} />

				<!-- Allergies tag input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-[#FDFBF7]/80">{$_('patient.medical.allergies')}</label>
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
						placeholder={$_('form.placeholders.allergy')}
						class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
					/>
				</div>

				<!-- Chronic conditions tag input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-[#FDFBF7]/80">{$_('patient.medical.chronicConditions')}</label>
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
						placeholder={$_('form.placeholders.condition')}
						class="h-9 w-full rounded-lg border border-white/10 bg-[#2C3531] px-3 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/30 outline-none focus:border-[#D4E79E]/40 focus:ring-1 focus:ring-[#D4E79E]/30"
					/>
				</div>

				<Textarea id="notes" label={$_('form.labels.clinicalNotes')} bind:value={notes} rows={4} placeholder={$_('form.placeholders.notes')} />
			</div>
		{/if}

		<!-- Tab 2: Contact & Address -->
		{#if activeTab === 2}
			<div class="space-y-5">
				<div>
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.contact.title')}</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input id="phone" label={$_('form.labels.phone')} type="tel" bind:value={phone} required error={errors.phone_number} />
						<Input id="email" label={$_('form.labels.email')} type="email" bind:value={email} error={errors.email} hint={$_('form.optional')} />
						<Input id="secondary_phone" label={$_('form.labels.secondaryPhone')} type="tel" bind:value={secondaryPhone} hint={$_('form.optional')} />
					</div>
				</div>
				<div class="border-t border-white/[0.06] pt-4">
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.contact.address')} ({$_('form.optional')})</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input id="street1" label={$_('form.labels.street1')} bind:value={street1} class="col-span-1 sm:col-span-2" />
						<Input id="street2" label={$_('form.labels.street2')} bind:value={street2} class="col-span-1 sm:col-span-2" hint={$_('form.placeholders.street2')} />
						<Input id="city" label={$_('form.labels.city')} bind:value={city} />
						<Input id="state" label={$_('form.labels.state')} bind:value={state_} />
						<Input id="postal" label={$_('form.labels.postal')} bind:value={postalCode} />
						<Input id="country" label={$_('form.labels.country')} bind:value={country} />
					</div>
				</div>
			</div>
		{/if}

		<!-- Tab 3: Emergency & Insurance -->
		{#if activeTab === 3}
			<div class="space-y-5">
				<div>
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.emergency.title')} ({$_('form.optional')})</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input id="ec_name" label={$_('form.labels.ecName')} bind:value={ecName} class="col-span-1 sm:col-span-2" />
						<Input id="ec_relation" label={$_('form.labels.ecRelation')} bind:value={ecRelation} />
						<Input id="ec_phone" label={$_('form.labels.ecPhone')} type="tel" bind:value={ecPhone} />
						<Input id="ec_email" label={$_('form.labels.ecEmail')} type="email" bind:value={ecEmail} hint={$_('form.optional')} />
					</div>
				</div>
				<div class="border-t border-white/[0.06] pt-4">
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">{$_('patient.insurance.title')} ({$_('form.optional')})</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input id="ins_provider" label={$_('form.labels.insProvider')} bind:value={insProvider} class="col-span-1 sm:col-span-2" />
						<Input id="ins_policy" label={$_('form.labels.insPolicy')} bind:value={insPolicy} />
						<Input id="ins_group" label={$_('form.labels.insGroup')} bind:value={insGroup} hint={$_('form.optional')} />
						<Input id="ins_subscriber" label={$_('form.labels.insSubscriber')} bind:value={insSubscriber} hint={$_('form.optional')} />
						<Input id="ins_sub_rel" label={$_('form.labels.insSubRelation')} bind:value={insSubRelation} hint={$_('form.optional')} />
						<Input id="ins_effective" label={$_('form.labels.insEffective')} type="date" bind:value={insEffective} hint={$_('form.optional')} />
						<Input id="ins_expiration" label={$_('form.labels.insExpiration')} type="date" bind:value={insExpiration} hint={$_('form.optional')} />
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
				<Button variant="ghost" onclick={() => activeTab--}>← {$_('form.previous')}</Button>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			<Button variant="ghost" onclick={onCancel}>{$_('form.cancel')}</Button>
			{#if activeTab < tabs.length - 1}
				<Button variant="secondary" onclick={() => activeTab++}>{$_('form.next')} →</Button>
			{:else}
				<Button variant="primary" {loading} onclick={handleSubmit} type="button">
					{patient ? $_('form.saveChanges') : $_('form.createPatient')}
				</Button>
			{/if}
		</div>
	</div>
</div>
