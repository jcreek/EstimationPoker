<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let selectedEmoji = '🧽';
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
	<button bind:this={button} class="emoji-button button button-white" on:click={showEmojiPicker}>
		{selectedEmoji} Choose your emoji...
	</button>
</div>

<style>
	.emoji-button {
		cursor: pointer;
	}

    .button {
		appearance: none;
		border: 1px solid rgba(27, 31, 35, 0.15);
		border-radius: 6px;
		box-shadow: rgba(27, 31, 35, 0.1) 0 1px 0;
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		display: inline-block;
		font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji';
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		padding: 6px 16px;
		position: relative;
		text-align: center;
		text-decoration: none;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		vertical-align: middle;
		white-space: nowrap;
	}

	.button:focus:not(:focus-visible):not(.focus-visible) {
		box-shadow: none;
		outline: none;
	}

	.button:disabled {
		border-color: rgba(27, 31, 35, 0.1);
		color: rgba(255, 255, 255, 0.8);
		cursor: default;
	}

	.button:focus {
		outline: none;
	}

    .button-white {
		background-color: #ffffff;
		color: black;
	}

    .button-white:hover {
		background-color: #E6E6E6;
	}
</style>
