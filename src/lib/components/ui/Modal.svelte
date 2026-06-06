<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onClose: () => void;
		children?: import('svelte').Snippet;
	}

	let { open = $bindable(false), title, size = 'md', onClose, children }: Props = $props();

	const widths = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	let dialogEl: HTMLDialogElement;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	onMount(() => {
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="presentation"
		onclick={handleBackdrop}
	>
		<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

		<!-- Dialog -->
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			class="modal-enter relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#35403B] shadow-2xl {widths[size]}"
		>
			<!-- Header -->
			{#if title}
				<div
					class="flex items-center justify-between border-b border-white/10 px-6 py-4 flex-shrink-0"
				>
					<h2 id="modal-title" class="text-lg font-semibold text-[#FDFBF7]">{title}</h2>
					<button
						onclick={onClose}
						class="flex h-8 w-8 items-center justify-center rounded-lg text-[#FDFBF7]/50 transition-colors hover:bg-white/10 hover:text-[#FDFBF7]"
						aria-label="Close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Content -->
			<div class="flex-1 overflow-y-auto">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
