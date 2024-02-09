<script lang="ts">
	const changesLog = [
		{ timestamp: '2024-01-05T00:00:00', message: 'Added the ability to kick a user' },
		{ timestamp: '2024-01-05T00:00:00', message: 'Added update notes' }
	];

	let newChanges = [];

	function checkForNewChanges() {
		// Check if we're in a browser environment
		if (typeof window !== 'undefined') {
			// Get the user's last visit timestamp from localStorage
			let lastVisitTimestamp = localStorage.getItem('lastVisitTimestamp');

			// If lastVisitTimestamp is null or undefined, set it to 0
			lastVisitTimestamp = lastVisitTimestamp ? lastVisitTimestamp : '0';

			// Filter changes made after the user's last visit
			newChanges = changesLog.filter((change) => change.timestamp > lastVisitTimestamp);

			// Update the user's last visit timestamp to the current time
			localStorage.setItem('lastVisitTimestamp', new Date().toISOString());
		}
	}

	// Call the function when the page loads
	checkForNewChanges();

	/** @type {import('./$types').PageData} */
	export let data;

	let usersList;

	import { onMount } from 'svelte';
	import UsersList from '../../../components/UsersList.svelte';
	import EstimateGroupsList from '../../../components/EstimateGroupsList.svelte';
	import Modal from '../../../components/Modal.svelte';
	import Estimates from '../../../components/Estimates.svelte';
	import FireworkShow from '../../../components/FireworkShow.svelte';

	import { connectToWebSocket, sendMessage, generateId } from '../estimation.js';

	class JoinRoomMessage {
		type: string;
		roomId: string;
		userId: string;
		name: string;

		constructor(roomId: string, userId: string, name: string) {
			this.type = 'join-room';
			this.roomId = roomId;
			this.userId = userId;
			this.name = name;
		}
	}

	class SelectEstimateMessage {
		type: string;
		roomId: string;
		userId: string;
		estimate: number | string;

		constructor(roomId: string, userId: string, estimate: number | string) {
			this.type = 'select-estimate';
			this.roomId = roomId;
			this.userId = userId;
			this.estimate = estimate;
		}
	}

	class User {
		userId: string;
		name: string;
		estimate: number | null;

		constructor(userId: string, name: string, estimate: number | null = null) {
			this.userId = userId;
			this.name = name;
			this.estimate = estimate;
		}
	}

	let socket;
	let showModal = true;
	let showTooltip = false;
	const userId = generateId();
	let users: Array<User> = [];
	let estimateGroups: { [key: number | string]: string[] } = {};
	let showRestartButton = false;
	let showEstimates = false;
	let disableEstimates: boolean = false;
	let audioElement;
	let fireworks;
	let selectedCardSet;
	let showFireworks = false;

	function closeModal() {
		showModal = false;
		showTooltip = true;
	}

	function toggleTooltip() {
		showTooltip = !showTooltip;
	}

	function joinRoom(name: string) {
		sendMessage(socket, new JoinRoomMessage(data.roomId, userId, name));
	}

	function updateUser(userId: string, name: string, estimate: number | null) {
		const existingUser = users.find((user) => user.userId === userId);

		if (existingUser) {
			// User exists, update the estimate
			existingUser.estimate = estimate;
		} else {
			// User doesn't exist, add a new User object
			const newUser = new User(userId, name, estimate);
			users.push(newUser);
			users = [...users];
		}
	}

	function handleEstimateClick(estimate: number | string) {
		sendMessage(socket, new SelectEstimateMessage(data.roomId, userId, estimate));
	}

	function handleEmojiTrigger(cardId: string, emoji: string) {
		sendMessage(socket, {
			type: 'trigger-emoji',
			cardId,
			emoji
		});
	}

	function handleKickUser(userId: string) {
		console.log('sending kick-user message');
		sendMessage(socket, {
			type: 'kick-user',
			userId
		});
	}

	function restartEstimation() {
		sendMessage(socket, { roomId: data.roomId, type: 'restart-estimation' });
	}

	function areEstimatesSame(estimateGroups: { [key: number | string]: string[] }): boolean {
		const estimates = Object.keys(estimateGroups);
		const users = Object.values(estimateGroups);
		const allUsers = users.flat();

		if (allUsers.length > 2 && estimates.length === 1) {
			return true;
		}
	}

	function onMessageReceived(message) {
		if (message.type === 'user-joined') {
			sendMessage(socket, { type: 'get-user-estimates' });
		} else if (message.type === 'user-estimates') {
			selectedCardSet = message.selectedCardSet.values;

			message.users.forEach((user) => {
				let updatedUser = users.find((u) => u.userId === user.userId);
				if (updatedUser === undefined) {
					const newUser = new User(user.userId, user.name, user.estimate);
					users.push(newUser);
				} else {
					updatedUser.estimate = user.estimate;
				}
			});

			users = [...users];
		} else if (message.type === 'estimate-selected') {
			updateUser(message.userId, message.name, message.estimate);
			users = [...users];
		} else if (message.type === 'user-left') {
			users = users.filter((user) => user.userId !== message.userId);
		} else if (message.type === 'estimation-closed') {
			estimateGroups = message.groupedEstimates;
			showFireworks = areEstimatesSame(estimateGroups);
			if (showFireworks) {
				fireworks.play();
			}
			showRestartButton = true;
			showEstimates = true;
			disableEstimates = true;
		} else if (message.type === 'estimation-restarted') {
			showFireworks = false;
			fireworks.pause();
			fireworks.currentTime = 0;
			estimateGroups = {};
			showRestartButton = false;
			showEstimates = false;
			disableEstimates = false;
			sendMessage(socket, { type: 'get-user-estimates' });
		} else if (message.type === 'trigger-emoji') {
			if (usersList && typeof usersList.triggerEmoji === 'function') {
				usersList.triggerEmoji(message.cardId, message.emoji);
			}
		} else if (message.type === 'nudge') {
			audioElement.play();
		}
	}

	onMount(() => {
		socket = connectToWebSocket(data.roomId, onMessageReceived);

		setInterval(() => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type: 'ping' }));
			}
		}, 45000); // send a ping every 45 seconds
	});

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('Room link copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}
</script>

{#if showModal}
	<Modal {closeModal} {joinRoom} />
{/if}

<UsersList
	bind:this={usersList}
	{users}
	{showEstimates}
	{userId}
	{handleEmojiTrigger}
	{handleKickUser}
/>

<div class="button-container">
	{#if showRestartButton}
		<button
			class="button button-red"
			on:click={() => restartEstimation()}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					restartEstimation();
				}
			}}
			aria-label={'restart estimation'}
			tabindex="0">Restart estimation</button
		>
	{/if}
</div>

<button id="copy-link-btn" class="button button-white" on:click={copyToClipboard}
	>Share Room Link</button
>

<Estimates values={selectedCardSet} {disableEstimates} onEstimateClick={handleEstimateClick} />

{#if Object.keys(estimateGroups).length > 0}
	<EstimateGroupsList {estimateGroups} />
{/if}

{#if showFireworks}
	<FireworkShow />
{/if}

<audio src="/call-to-attention-50-percent-volume.mp3" bind:this={audioElement} />
<audio src="/fireworks.mp3" bind:this={fireworks} />

{#if showTooltip && newChanges.length > 0}
	<div id="tooltip-container" on:click={toggleTooltip}>
		<h3>Latest Updates</h3>
		<ul>
			{#each newChanges as change (change.timestamp)}
				<li>{new Date(change.timestamp).toLocaleDateString()}: {change.message}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.button-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1em;
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

	.button-white {
		background-color: #ffffff;
		color: black;
	}

	.button-white:hover {
		background-color: #e6e6e6;
	}

	#copy-link-btn {
		position: fixed;
		top: 10px;
		right: 10px;
	}

	#tooltip-container {
		position: fixed;
		bottom: 50px;
		right: 30px;
		padding: 10px 20px;
		background-color: #8d6a9f;
		color: #fff;
		border-radius: 5px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	#tooltip-container h3 {
		margin-top: 5px;
	}

	#tooltip-container ul {
		list-style-position: inside;
		padding-left: 0;
		margin-bottom: 0;
	}

	#tooltip-container ul li {
		text-indent: -10px;
	}
</style>
