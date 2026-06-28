// src/lib/utils/validators.ts
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

export interface ValidationResult {
	valid: boolean;
	errors: Record<string, string>;
}

function t(key: string, values?: Record<string, any>): string {
	const translate = get(_);
	return translate(key, { values });
}

function getLabel(label: string): string {
	const translate = get(_);
	return translate(label);
}

export function required(value: unknown, label = 'Field'): string | null {
	if (value === null || value === undefined || String(value).trim() === '') {
		const field = getLabel(label);
		return t('form.validation.requiredPattern', { field });
	}
	return null;
}

export function minLength(value: string, min: number, label = 'Field'): string | null {
	if (value.length < min) {
		const field = getLabel(label);
		return t('form.validation.minLengthPattern', { field, min });
	}
	return null;
}

export function maxLength(value: string, max: number, label = 'Field'): string | null {
	if (value.length > max) {
		const field = getLabel(label);
		return t('form.validation.maxLengthPattern', { field, max });
	}
	return null;
}

export function isDate(value: string, label = 'Date'): string | null {
	if (!value) return null;
	const d = new Date(value);
	if (isNaN(d.getTime())) {
		const field = getLabel(label);
		return t('form.validation.invalidDatePattern', { field });
	}
	return null;
}

export function isEmail(value: string, label = 'Email'): string | null {
	if (!value) return null;
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!re.test(value)) {
		const field = getLabel(label);
		return t('form.validation.invalidEmailPattern', { field });
	}
	return null;
}

export function isPhone(value: string, label = 'Phone'): string | null {
	if (!value) return null;
	const re = /^\+?[\d\s\-().]{7,20}$/;
	if (!re.test(value)) {
		const field = getLabel(label);
		return t('form.validation.invalidPhonePattern', { field });
	}
	return null;
}

export function isSsnLastFour(value: string): string | null {
	if (!value) return null;
	if (!/^\d{4}$/.test(value)) {
		return t('form.validation.ssnFormat');
	}
	return null;
}

export function isPositiveNumber(value: unknown, label = 'Value'): string | null {
	const n = Number(value);
	if (isNaN(n) || n <= 0) {
		const field = getLabel(label);
		return t('form.validation.positiveNumberPattern', { field });
	}
	return null;
}

/** Validate PatientCreateDTO required fields */
export function validatePatientCreate(data: Record<string, unknown>): ValidationResult {
	const errors: Record<string, string> = {};

	const firstNameErr = required(data.first_name, 'form.labels.firstName');
	if (firstNameErr) errors.first_name = firstNameErr;

	const lastNameErr = required(data.last_name, 'form.labels.lastName');
	if (lastNameErr) errors.last_name = lastNameErr;

	const dobErr = required(data.date_of_birth, 'form.labels.dob');
	if (dobErr) {
		errors.date_of_birth = dobErr;
	} else {
		const dateErr = isDate(String(data.date_of_birth), 'form.labels.dob');
		if (dateErr) errors.date_of_birth = dateErr;
	}

	const genderErr = required(data.gender, 'form.labels.gender');
	if (genderErr) errors.gender = genderErr;

	// contact_info.phone_number
	const ci = data.contact_info as Record<string, unknown> | undefined;
	const phoneErr = required(ci?.phone_number, 'form.labels.phone');
	if (phoneErr) {
		errors.phone_number = phoneErr;
	} else {
		const pErr = isPhone(String(ci?.phone_number ?? ''), 'form.labels.phone');
		if (pErr) errors.phone_number = pErr;
	}

	if (ci?.email) {
		const eErr = isEmail(String(ci.email), 'form.labels.email');
		if (eErr) errors.email = eErr;
	}

	return { valid: Object.keys(errors).length === 0, errors };
}

/** Validate BodyMeasurementCreateDTO: at least one measurement required */
export function validateMeasurementCreate(data: Record<string, unknown>): ValidationResult {
	const errors: Record<string, string> = {};
	const hasAny = ['height_cm', 'weight_kg', 'waist_cm', 'hip_cm'].some(
		(k) => data[k] != null && data[k] !== ''
	);
	if (!hasAny) {
		// Translation for this can also be parameterized if needed, but since it is a static general message,
		// we can translate it if the translation key exists or use a fallback.
		const translate = get(_);
		errors.general = translate('measurements.validation.atLeastOne', {
			default: 'At least one measurement (height, weight, waist, or hip) is required'
		});
	}
	return { valid: Object.keys(errors).length === 0, errors };
}
