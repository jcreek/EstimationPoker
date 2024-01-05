<script lang="ts">
	import EmojiPicker from './EmojiPicker.svelte';

	export let users: any;
	export let showEstimates: boolean = false;
	export let userId: string;
	export let handleEmojiTrigger: (cardId: string, emoji: string) => void;
	export let handleKickUser: (userId: string) => void;

	let customEmoji = '🧽'; // default emoji
	let shieldActive = false;

	const handleEmojiSelected = (event) => {
		customEmoji = event.detail.emoji;
	};

	function handleCardClick(cardId) {
		handleEmojiTrigger(cardId, customEmoji);
	}

	export function triggerEmoji(cardId, emoji) {
		// Get the user from the cardId
		let user = users.find((user) => `user-card-${user.userId}` === cardId);

		// If the user is Tristan and the selected emoji is poop, activate the shield
		if (user && user.name === 'Tristan' && emoji === '💩') {
			shieldActive = true;

			// After 2 seconds, remove the shield
			setTimeout(() => {
				shieldActive = false;
			}, 2000);

			return;
		}

		let times = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
		for (let i = 0; i < times; i++) {
			let timeout = Math.random() * 100 + 100 * i; // Random number between 100 and 200, multiplied by i to stagger the emojis
			setTimeout(() => addEmojiToElement(cardId, emoji), timeout);
		}
	}

	function addEmojiToElement(elementId, emoji) {
		let emojiElement = document.createElement('div');
		emojiElement.innerText = emoji;
		emojiElement.style.position = 'fixed';
		emojiElement.style.fontSize = '20px';
		emojiElement.style.zIndex = '10';

		// Location of the clicked card
		let targetElement = document.getElementById(elementId);
		let targetRect = targetElement.getBoundingClientRect();

		let startX = Math.random() < 0.5 ? -100 : window.innerWidth + 100;
		let startY = Math.random() * (window.innerHeight < 300 ? window.innerHeight : 300) * -1;

		let endX = startX < window.innerWidth / 2 ? targetRect.left - 20 : targetRect.right;
		let endY = (targetRect.top + targetRect.height / 2 + window.scrollY) * -1;

		// Create keyframes
		let endXOffset = startX < endX ? -Math.random() * 100 : Math.random() * 100; // Determine direction based on startX and endX

		let keyframes = [
			{
				transform: `translate(${startX}px, ${startY}px)`,
				opacity: '1'
			},
			{
				transform: `translate(${(startX + endX) / 2}px, ${(startY + endY) / 2 - 25}px)`, // Midway point, subtract less from Y to create a lower arc
				offset: 0.3
			},
			{
				transform: `translate(${endX}px, ${endY}px)`,
				offset: 0.6
			},
			{
				transform: `translate(${endX + endXOffset}px, ${endY + 100}px)`,
				opacity: '1',
				offset: 0.95
			},
			{
				transform: `translate(${endX + endXOffset}px, ${endY + 100}px)`,
				opacity: '0'
			}
		];

		// Animation options
		let options = {
			duration: 2000,
			easing: 'ease-in-out',
			fill: 'forwards'
		};

		// Start animation
		emojiElement.animate(keyframes, options);

		document.body.appendChild(emojiElement);

		// Cleanup after animation is done
		setTimeout(() => {
			document.body.removeChild(emojiElement);
		}, 2000);
	}

	let selectedUserId = '';

	export function kickUser() {
		if (selectedUserId) {
			let confirmed = confirm('Are you sure you want to kick this user?');

			if (confirmed) {
				console.log('confirmed');
				handleKickUser(selectedUserId);
			}
		}
	}
</script>

<div id="top-container">
	<EmojiPicker on:emojiSelected={handleEmojiSelected} />

	<div id="user-kicker">
		<select bind:value={selectedUserId}>
			<option value="">Select a user</option>
			{#each users as user (user.userId)}
				<option value={user.userId}>{user.name}</option>
			{/each}
		</select>

		<button class="emoji-button button button-red" on:click={kickUser}>Kick User</button>
	</div>
</div>

<div id="users-list">
	<div class="users-container">
		{#each users as user (user.userId)}
			<div class="user-wrapper">
				<div class="name">{user.name}</div>
				<div
					id={`user-card-${user.userId}`}
					class="user-card"
					class:user-card-null={user.estimate === null}
					class:user-card-green={user.estimate !== null}
					class:user-card-shield={user.name === 'Tristan' && shieldActive}
					on:click={() => handleCardClick(`user-card-${user.userId}`)}
				>
					{#if user.estimate !== null && (showEstimates || user.userId === userId)}
						<p class="estimate">{user.estimate}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	#top-container {
		display: flex;
		justify-content: space-between;
	}

	select {
		font-size: 0.8rem;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid gray;
		margin-bottom: 0.5rem;
	}

	#users-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-bottom: 30px;
	}

	.users-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.user-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 80px;
		border: 1px solid #ccc;
		border-radius: 8px;
		margin: 10px;
		background-color: #fff;
		text-align: center;
	}

	.user-card-null {
		background-color: #ccc;
		color: #fff;
	}

	.user-card-green {
		background-color: #6bbf6b;
		color: #fff;
	}

	.estimate {
		font-size: 24px;
		font-weight: bold;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.name {
		font-size: 16px;
		margin-bottom: 5px;
	}

	.emoji {
		width: 40px;
		height: 40px;
		position: absolute;
		opacity: 1;
		animation: fly 2s, fadeOut 0.5s 2s;
		animation-fill-mode: forwards;
	}

	@keyframes fly {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
		75% {
			transform: translateY(-20%);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.user-card-shield {
		box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.5);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.5);
		}
		50% {
			box-shadow: 0 0 20px 10px rgba(0, 0, 255, 0.75), 0 0 30px 10px rgba(0, 0, 255, 0.5);
		}
		100% {
			box-shadow: 0 0 10px 5px rgba(0, 0, 255, 0.5);
		}
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

    .button-red {
		background-color: #b60223;
	}

	.button-red:hover {
		background-color: #a2021f;
	}
</style>
