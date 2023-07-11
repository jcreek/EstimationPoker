<script lang="ts">
	import EmojiPicker from './EmojiPicker.svelte';

	export let users: any;
	export let showEstimates: boolean = false;
	export let userId: string;

	let customEmoji = '🧽'; // default emoji
	let shieldActive = false;

	const handleEmojiSelected = (event) => {
        customEmoji = event.detail.emoji;
    };

	function handleCardClick(cardId) {
		// Get the user from the cardId
		let user = users.find((user) => `user-card-${user.userId}` === cardId);

		// If the user is Tristan, activate the shield
		if (user && user.name === 'Tristan') {
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
			setTimeout(() => addEmojiToElement(cardId, customEmoji), timeout);
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
</script>

<EmojiPicker on:emojiSelected="{handleEmojiSelected}" />

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
</style>
