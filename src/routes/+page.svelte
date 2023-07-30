<script>
	import { onMount } from 'svelte';
	import { connectToWebSocket, sendMessage, generateId } from './estimation/estimation.js';
	import { goto } from '$app/navigation';

	let roomId = '';
	let socket;
	const cardSets = [
		{ name: 'Fibonacci', values: [1, 2, 3, 5, 8, 13, 21, '?'], example: '(1, 2, 3, 5)' },
		{
			name: 'T-Shirt Sizing',
			values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
			example: '(XS, S, M, L)'
		},
		{ name: 'Powers of 2', values: [1, 2, 4, 8, 16, 32, '?'], example: '(1, 2, 4, 8)' },
		{ name: 'Sequential', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, '?'], example: '(1, 2, 3, 4)' }
	];

	let selectedCardSet = cardSets[0];

	function startARoom() {
		const roomId = generateId();
		sendMessage(socket, { roomId: roomId, type: 'create-room', cardSetName: selectedCardSet.name });
		goto(`/estimation/${roomId}`);
	}

	function joinRoom() {
		const match = roomId.match(/\/estimation\/(.+)/);
		if (match) {
			const roomId = match[1];
			goto(`/estimation/${roomId}`);
		}
	}

	function onMessageReceived(message) {}

	onMount(() => {
		socket = connectToWebSocket(null, onMessageReceived);

		setInterval(() => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type: 'ping' }));
			}
		}, 45000); // send a ping every 45 seconds
	});
</script>

<div class="container">
	<p>
		Simply choose a card set, start a room and share the URL to everyone else who needs to join the
		estimation session.
	</p>
	<div class="dropdown">
		<select on:change={(e) => (selectedCardSet = cardSets[e.target.selectedIndex])}>
			{#each cardSets as cardSet, i}
				<option value={i}>{cardSet.name} {cardSet.example}</option>
			{/each}
		</select>
	</div>
	<button class="button button-green" on:click={startARoom}>Start a room</button>
	<div class="join-room-container">
		<label for="room-id">Join a room:</label>
		<input type="text" id="room-id" placeholder="Paste a shared room link" bind:value={roomId} />
		<button class="button button-yellow" on:click={joinRoom}>Join</button>
	</div>
</div>

<style>
	.container {
		text-align: center;
	}

	.container p {
		margin-bottom: 20px;
	}

	.container button {
		display: block;
		margin: 0 auto;
	}

	.join-room-container {
		margin-top: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.join-room-container label {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.join-room-container input[type='text'] {
		font-size: 1.2rem;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
		margin-bottom: 0.5rem;
		width: 100%;
		max-width: 20rem;
	}

	.dropdown {
		display: inline-block;
		margin-bottom: 10px;
	}

	.dropdown select {
		appearance: none;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: none;
		color: #333;
		font-size: 14px;
		height: 34px;
		padding: 6px 12px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
		background-position: right 8px center;
		background-repeat: no-repeat;
		background-size: 16px 16px;
		padding-right: 24px;
	}

	.dropdown select:focus {
		border-color: #66afe9;
		box-shadow: none;
		outline: none;
	}

	.dropdown select::-ms-expand {
		display: none;
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

	.button-green {
		background-color: #2ea44f;
	}

	.button-green:hover {
		background-color: #2c974b;
	}

	.button-green:focus {
		box-shadow: rgba(46, 164, 79, 0.4) 0 0 0 3px;
		outline: none;
	}

	.button-green:disabled {
		background-color: #94d3a2;
	}

	.button-green:active {
		background-color: #298e46;
		box-shadow: rgba(20, 70, 32, 0.2) 0 1px 0 inset;
	}

	.button-black {
		background-color: #423e37;
	}

	.button-black:hover {
		background-color: #2e2b26;
	}

	.button-blue {
		background-color: #388697;
	}

	.button-blue:hover {
		background-color: #275d69;
	}

	.button-white {
		background-color: #ffffff;
		color: black;
	}

	.button-yellow {
		background-color: #eea236;
	}

	.button-yellow:hover {
		background-color: #d18f2e;
	}
</style>
