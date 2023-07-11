<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let selectedEmoji = '🧻';
	let picker, button;

	const showEmojiPicker = () => {
		picker.pickerVisible ? picker.hidePicker() : picker.showPicker(button);
	};

	if (browser) {
		onMount(async () => {
			const { EmojiButton } = await import('@joeattardi/emoji-button');
			picker = new EmojiButton();
			picker.on('emoji', (selection) => {
				selectedEmoji = selection.emoji;
				dispatch('emojiSelected', { emoji: selection.emoji });
			});
		});
	}

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div style="position: relative;">
	<button bind:this={button} class="emoji-button" on:click={showEmojiPicker}>
		{selectedEmoji} Choose your emoji...
	</button>
</div>

<style>
	.emoji-button {
		cursor: pointer;
	}
</style>
