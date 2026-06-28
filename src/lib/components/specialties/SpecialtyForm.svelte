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

	const categoryOptions: { value: SpecialtyCategory; label: string }[] = [
		{ value: 'atencion_primaria',  label: 'Atención Primaria'  },
		{ value: 'quirurgica',         label: 'Quirúrgica'          },
		{ value: 'diagnostica',       label: 'Diagnóstica'         },
		{ value: 'terapeutica',        label: 'Terapéutica'         },
		{ value: 'salud_mental',       label: 'Salud Mental'        },
		{ value: 'emergencia',         label: 'Emergencia'          },
		{ value: 'otra',               label: 'Otra'                }
	];

	function validate(): boolean {
		errors = {};
		if (!isEdit && !code.trim()) errors.code = 'Code is required';
		if (!isEdit && !/^[A-Z0-9_]+$/.test(code.trim())) errors.code = 'Code must be uppercase letters, digits or underscores';
		if (!name.trim()) errors.name = 'Name is required';
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

<form onsubmit={handleSubmit} class="space-y-4">
	{#if !isEdit}
		<div>
			<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">
				Code <span class="text-red-400">*</span>
			</label>
			<Input
				id="specialty-code"
				bind:value={code}
				placeholder="e.g. CARDIO"
				error={errors.code}
				disabled={loading}
			/>
			<p class="mt-1 text-xs text-[#FDFBF7]/30">Uppercase letters, digits and underscores only. Cannot be changed later.</p>
		</div>
	{/if}

	<div>
		<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">
			Name <span class="text-red-400">*</span>
		</label>
		<Input
			id="specialty-name"
			bind:value={name}
			placeholder="e.g. Cardiology"
			error={errors.name}
			disabled={loading}
		/>
	</div>

	<div>
		<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">Category</label>
		<Select
			id="specialty-category"
			bind:value={category}
			options={categoryOptions}
			disabled={loading}
		/>
	</div>

	<div>
		<label class="block text-xs font-medium text-[#FDFBF7]/60 mb-1.5">
			Description <span class="text-[#FDFBF7]/30 text-xs font-normal">(optional)</span>
		</label>
		<Textarea
			id="specialty-description"
			bind:value={description}
			placeholder="Brief description of this specialty…"
			rows={3}
			disabled={loading}
		/>
	</div>

	<div class="flex justify-end gap-3 pt-2">
		<Button variant="ghost" type="button" onclick={onCancel} disabled={loading}>
			{$_('form.cancel')}
		</Button>
		<Button type="submit" {loading}>
			{isEdit ? $_('form.saveChanges') : $_('specialties.create')}
		</Button>
	</div>
</form>
