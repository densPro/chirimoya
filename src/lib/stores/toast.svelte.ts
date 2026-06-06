// src/lib/stores/toast.svelte.ts

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
}

let toasts = $state<Toast[]>([]);

export function getToasts() {
	return toasts;
}

export function addToast(
	message: string,
	type: ToastType = 'info',
	duration = 4000
): void {
	const id = crypto.randomUUID();
	toasts = [...toasts, { id, message, type, duration }];
	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}
}

export function removeToast(id: string): void {
	toasts = toasts.filter((t) => t.id !== id);
}
