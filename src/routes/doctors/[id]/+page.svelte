<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type {
		DoctorResponseDTO,
		DoctorUpdateDTO,
		SpecialtyResponseDTO
	} from '$lib/types';
	import { updateDoctor, deactivateDoctor, listSpecialties, getDoctorById } from '$lib/api';
	import { addToast } from '$lib/stores/toast.svelte';
	import DoctorStatusBadge from '$lib/components/doctors/DoctorStatusBadge.svelte';
	import DoctorForm from '$lib/components/doctors/DoctorForm.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import SpecialtyBadge from '$lib/components/specialties/SpecialtyBadge.svelte';
	import { ChevronLeft, Pencil, PowerOff, Stethoscope, Phone, Mail, MapPin, Award, BookOpen } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import { formatDate } from '$lib/utils/formatters';
	import { goto } from '$app/navigation';

	interface Props { data: PageData; }
	let { data }: Props = $props();

	let doctor     = $state<DoctorResponseDTO>(data.doctor);
	let specialties = $state<SpecialtyResponseDTO[]>([]);
	let specialty   = $derived(specialties.find((s) => s.id === doctor.specialty_id));

	let activeTab = $state<'overview' | 'professional' | 'contact'>('overview');
	let showEdit  = $state(false);
	let saving    = $state(false);

	const initials = $derived(`${doctor.first_name[0] ?? ''}${doctor.last_name[0] ?? ''}`.toUpperCase());

	onMount(async () => {
		specialties = await listSpecialties();
	});

	async function handleSave(dto: DoctorUpdateDTO) {
		saving = true;
		try {
			doctor = await updateDoctor(doctor.id, dto);
			addToast($_('doctors.toasts.updateSuccess'), 'success');
			showEdit = false;
		} catch (e: unknown) {
			addToast(e instanceof Error ? e.message : 'Error', 'error');
		} finally {
			saving = false;
		}
	}

	async function handleDeactivate() {
		if (!confirm(`¿Desactivar al Dr. ${doctor.full_name}?`)) return;
		try {
			doctor = await deactivateDoctor(doctor.id);
			addToast($_('doctors.toasts.deactivateSuccess'), 'success');
		} catch (e: unknown) {
			addToast(e instanceof Error ? e.message : 'Error', 'error');
		}
	}

	const tabs = [
		{ key: 'overview',     label: 'Overview'     },
		{ key: 'professional', label: 'Professional'  },
		{ key: 'contact',      label: 'Contact'       }
	] as const;
</script>

<svelte:head>
	<title>Dr. {doctor.full_name} · Chirimoya</title>
</svelte:head>

<div class="space-y-6">
	<!-- Back link -->
	<a href="/doctors" class="inline-flex items-center gap-1.5 text-xs text-[#FDFBF7]/40 transition-colors hover:text-[#D4E79E]">
		<ChevronLeft size={14} />
		{$_('doctors.title')}
	</a>

	<!-- Hero card -->
	<Card>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div class="flex items-center gap-4">
				<!-- Avatar -->
				<div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#D4E79E]/15 font-mono text-2xl font-bold text-[#D4E79E]">
					{initials}
				</div>
				<div>
					<h1 class="text-xl font-bold text-[#FDFBF7]">Dr. {doctor.full_name}</h1>
					<div class="mt-1 flex flex-wrap items-center gap-2">
						<span class="font-mono text-xs text-[#D4E79E]/60">{doctor.employee_id}</span>
						<DoctorStatusBadge status={doctor.status} />
						{#if specialty}
							<SpecialtyBadge category={specialty.category} />
						{/if}
						{#if doctor.age != null}
							<span class="text-xs text-[#FDFBF7]/30">{doctor.age} yrs</span>
						{/if}
					</div>
					{#if specialty}
						<p class="mt-1 flex items-center gap-1 text-sm text-[#FDFBF7]/50">
							<Stethoscope size={12} />
							{specialty.name}
						</p>
					{/if}
				</div>
			</div>
			<div class="flex gap-2">
				<Button variant="ghost" onclick={() => (showEdit = true)} id="edit-doctor-btn">
					<Pencil size={14} />
					{$_('patient.edit')}
				</Button>
				{#if doctor.status === 'active'}
					<Button variant="danger" onclick={handleDeactivate} id="deactivate-doctor-btn">
						<PowerOff size={14} />
						{$_('common.deactivate')}
					</Button>
				{/if}
			</div>
		</div>
	</Card>
 
	<!-- Tabs -->
	<div class="flex gap-1 rounded-xl bg-black/20 p-1">
		{#each tabs as tab}
			<button
				onclick={() => (activeTab = tab.key)}
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
					{activeTab === tab.key
						? 'bg-[#D4E79E]/10 text-[#D4E79E]'
						: 'text-[#FDFBF7]/40 hover:text-[#FDFBF7]/70'}"
			>
				{$_('form.tabs.' + tab.key)}
			</button>
		{/each}
	</div>

	<!-- Tab content -->
	{#if activeTab === 'overview'}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card>
				<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Demographics</h3>
				<dl class="space-y-2.5">
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Date of Birth</dt>
						<dd class="text-sm text-[#FDFBF7]">{doctor.date_of_birth ? formatDate(doctor.date_of_birth) : '—'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Gender</dt>
						<dd class="text-sm capitalize text-[#FDFBF7]">{doctor.gender.replace('_', ' ')}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Registered</dt>
						<dd class="text-sm text-[#FDFBF7]">{formatDate(doctor.created_at)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Last updated</dt>
						<dd class="text-sm text-[#FDFBF7]">{formatDate(doctor.updated_at)}</dd>
					</div>
				</dl>
			</Card>

			{#if doctor.bio}
				<Card>
					<h3 class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						<BookOpen size={12} /> Bio
					</h3>
					<p class="text-sm leading-relaxed text-[#FDFBF7]/70">{doctor.bio}</p>
				</Card>
			{/if}
		</div>

	{:else if activeTab === 'professional'}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card>
				<h3 class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
					<Stethoscope size={12} /> Specialty
				</h3>
				<dl class="space-y-2.5">
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Specialty</dt>
						<dd class="text-sm text-[#FDFBF7]">{specialty?.name ?? '—'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Code</dt>
						<dd class="font-mono text-xs text-[#D4E79E]">{specialty?.code ?? '—'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-xs text-[#FDFBF7]/40">Experience</dt>
						<dd class="font-mono text-sm text-[#D4E79E]">
							{doctor.years_of_experience != null ? `${doctor.years_of_experience} yrs` : '—'}
						</dd>
					</div>
				</dl>
			</Card>

			{#if doctor.license_info}
				<Card>
					<h3 class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						<Award size={12} /> License
					</h3>
					<dl class="space-y-2.5">
						<div class="flex justify-between">
							<dt class="text-xs text-[#FDFBF7]/40">License #</dt>
							<dd class="font-mono text-xs text-[#D4E79E]">{doctor.license_info.license_number}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-xs text-[#FDFBF7]/40">Issuing Body</dt>
							<dd class="text-sm text-[#FDFBF7]">{doctor.license_info.issuing_body}</dd>
						</div>
						{#if doctor.license_info.state}
							<div class="flex justify-between">
								<dt class="text-xs text-[#FDFBF7]/40">State</dt>
								<dd class="text-sm text-[#FDFBF7]">{doctor.license_info.state}</dd>
							</div>
						{/if}
						{#if doctor.license_info.issue_date}
							<div class="flex justify-between">
								<dt class="text-xs text-[#FDFBF7]/40">Issued</dt>
								<dd class="text-sm text-[#FDFBF7]">{formatDate(doctor.license_info.issue_date)}</dd>
							</div>
						{/if}
						{#if doctor.license_info.expiration_date}
							<div class="flex justify-between">
								<dt class="text-xs text-[#FDFBF7]/40">Expires</dt>
								<dd class="text-sm text-[#FDFBF7]">{formatDate(doctor.license_info.expiration_date)}</dd>
							</div>
						{/if}
					</dl>
				</Card>
			{/if}
		</div>

	{:else if activeTab === 'contact'}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#if doctor.contact_info}
				<Card>
					<h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">Contact</h3>
					<dl class="space-y-2.5">
						{#if doctor.contact_info.phone_number}
							<div class="flex items-center gap-2">
								<Phone size={12} class="text-[#FDFBF7]/30" />
								<span class="text-sm text-[#FDFBF7]">{doctor.contact_info.phone_number}</span>
							</div>
						{/if}
						{#if doctor.contact_info.email}
							<div class="flex items-center gap-2">
								<Mail size={12} class="text-[#FDFBF7]/30" />
								<a href="mailto:{doctor.contact_info.email}" class="text-sm text-[#D4E79E] hover:underline">
									{doctor.contact_info.email}
								</a>
							</div>
						{/if}
					</dl>
				</Card>
			{:else}
				<Card>
					<p class="text-sm text-[#FDFBF7]/30">No contact info on file.</p>
				</Card>
			{/if}

			{#if doctor.address}
				<Card>
					<h3 class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7]/40">
						<MapPin size={12} /> Address
					</h3>
					<address class="not-italic text-sm leading-relaxed text-[#FDFBF7]/70">
						{#if doctor.address.street_line_1}<div>{doctor.address.street_line_1}</div>{/if}
						{#if doctor.address.street_line_2}<div>{doctor.address.street_line_2}</div>{/if}
						{#if doctor.address.city || doctor.address.state || doctor.address.postal_code}
							<div>
								{[doctor.address.city, doctor.address.state, doctor.address.postal_code].filter(Boolean).join(', ')}
							</div>
						{/if}
						{#if doctor.address.country}<div>{doctor.address.country}</div>{/if}
					</address>
				</Card>
			{/if}
		</div>
	{/if}
</div>

<!-- Edit modal -->
<Modal open={showEdit} title={$_('doctors.editTitle')} size="lg" onClose={() => (showEdit = false)}>
	<DoctorForm
		doctor={doctor}
		{specialties}
		onSave={handleSave as (dto: import('$lib/types').DoctorCreateDTO | DoctorUpdateDTO) => Promise<void>}
		onCancel={() => (showEdit = false)}
		loading={saving}
	/>
</Modal>
