<script lang="ts">
	import type { SpecialtyCreateDTO, SpecialtyUpdateDTO, SpecialtyResponseDTO, SpecialtyCategory } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		specialty?: SpecialtyResponseDTO;
		onSave: (dto: SpecialtyCreateDTO | SpecialtyUpdateDTO) => Promise<void>;
		onCancel: () => void;
		loading: boolean;
	}

	let { specialty, onSave, onCancel, loading }: Props = $props();

	const isEdit = $derived(!!specialty);

	let code = $state(specialty?.code ?? '');
	let name = $state(specialty?.name ?? '');
	let category = $state<SpecialtyCategory>(specialty?.category ?? 'terapeutica');
	let description = $state(specialty?.description ?? '');

	let errors = $state<Record<string, string>>({});

	const categoryOptions = $derived<Array<{ value: SpecialtyCategory; label: string }>>([
		{ value: 'atencion_primaria', label: $_('form.specialtyCategories.atencion_primaria', { default: 'Atención Primaria' }) },
		{ value: 'quirurgica',        label: $_('form.specialtyCategories.quirurgica', { default: 'Quirúrgica' }) },
		{ value: 'diagnostica',      label: $_('form.specialtyCategories.diagnostica', { default: 'Diagnóstica' }) },
		{ value: 'terapeutica',       label: $_('form.specialtyCategories.terapeutica', { default: 'Terapéutica' }) },
		{ value: 'salud_mental',      label: $_('form.specialtyCategories.salud_mental', { default: 'Salud Mental' }) },
		{ value: 'emergencia',        label: $_('form.specialtyCategories.emergencia', { default: 'Emergencia' }) },
		{ value: 'otra',              label: $_('form.specialtyCategories.otra', { default: 'Otra' }) }
	]);

	function validate(): boolean {
		errors = {};
		if (!isEdit && !code.trim()) errors.code = $_('form.validation.codeRequired');
		if (!isEdit && !/^[A-Z0-9_]+$/.test(code.trim())) errors.code = $_('form.validation.codeFormat');
		if (!name.trim()) errors.name = $_('form.validation.nameRequired');
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;

		if (isEdit) {
			const dto: SpecialtyUpdateDTO = {
				name: name.trim(),
				category,
				description: description.trim() || undefined
			};
			await onSave(dto);
		} else {
			const dto: SpecialtyCreateDTO = {
				code: code.trim().toUpperCase(),
				name: name.trim(),
				category,
				description: description.trim() || undefined
			};
			await onSave(dto);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col">
	<!-- Content -->
	<div class="flex-1 overflow-y-auto p-6 space-y-4">
		{#if !isEdit}
			<Input
				id="specialty-code"
				label={$_('form.labels.code')}
				bind:value={code}
				placeholder="e.g. CARDIO"
				required
				error={errors.code}
				hint={$_('specialties.codeHint', { default: 'Uppercase letters, digits and underscores only. Cannot be changed later.' })}
				disabled={loading}
			/>
		{/if}

		<Input
			id="specialty-name"
			label={$_('form.labels.name')}
			bind:value={name}
			placeholder="e.g. Cardiology"
			required
			error={errors.name}
			disabled={loading}
		/>

		<Select
			id="specialty-category"
			label={$_('form.labels.category')}
			bind:value={category}
			options={categoryOptions}
			disabled={loading}
		/>

		<Textarea
			id="specialty-description"
			label={$_('form.labels.description')}
			bind:value={description}
			placeholder={$_('form.placeholders.specialtyDescription')}
			rows={3}
			disabled={loading}
		/>
	</div>

	<!-- Footer actions -->
	<div class="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
		<Button variant="ghost" type="button" onclick={onCancel} disabled={loading}>
			{$_('form.cancel')}
		</Button>
		<Button variant="primary" type="submit" {loading}>
			{isEdit ? $_('form.saveChanges') : $_('specialties.create')}
		</Button>
	</div>
</form>
