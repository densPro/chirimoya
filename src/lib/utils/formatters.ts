// src/lib/utils/formatters.ts
import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateStr?: string | null, fmt = 'MMM d, yyyy'): string {
	if (!dateStr) return '—';
	try {
		const date = parseISO(dateStr);
		return isValid(date) ? format(date, fmt) : '—';
	} catch {
		return '—';
	}
}

export function formatDateTime(dateStr?: string | null): string {
	return formatDate(dateStr, 'MMM d, yyyy HH:mm');
}

export function formatBMI(bmi?: number | null): string {
	if (bmi == null) return '—';
	return bmi.toFixed(2);
}

export function formatWeight(kg?: number | null): string {
	if (kg == null) return '—';
	return `${kg.toFixed(2)} kg`;
}

export function formatHeight(cm?: number | null): string {
	if (cm == null) return '—';
	return `${cm.toFixed(1)} cm`;
}

export function formatCalories(kcal?: number | null): string {
	if (kcal == null) return '—';
	return `${kcal.toFixed(0)} kcal`;
}

export function formatCaloriesDecimal(kcal?: number | null): string {
	if (kcal == null) return '—';
	return `${kcal.toFixed(2)} kcal`;
}

export function getInitials(firstName?: string, lastName?: string): string {
	const f = (firstName ?? '').trim()[0] ?? '';
	const l = (lastName ?? '').trim()[0] ?? '';
	return `${f}${l}`.toUpperCase() || '??';
}

export function formatGender(gender?: string | null): string {
	if (!gender) return '—';
	return gender
		.split('_')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

export function formatMaritalStatus(status?: string | null): string {
	if (!status) return '—';
	return status
		.split('_')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

export function bmiCategory(bmi?: number | null): string {
	if (bmi == null) return 'Unknown';
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal';
	if (bmi < 30) return 'Overweight';
	return 'Obese';
}

export function bmiColor(bmi?: number | null): string {
	if (bmi == null) return '#8fa49c';
	if (bmi < 18.5) return '#60a5fa'; // blue
	if (bmi < 25) return '#96c499'; // sage green
	if (bmi < 30) return '#fbbf24'; // yellow
	return '#f87171'; // red
}
