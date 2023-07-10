<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import { onMount } from 'svelte';
	import UsersList from '../../../components/UsersList.svelte';
	import EstimateGroupsList from '../../../components/EstimateGroupsList.svelte';
	import AverageEstimate from '../../../components/AverageEstimate.svelte';
	import Modal from '../../../components/Modal.svelte';
	import Estimates from '../../../components/Estimates.svelte';

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
		estimate: number;

		constructor(roomId: string, userId: string, estimate: number) {
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
	const userId = generateId();
	let users: Array<User> = [];
	let average: number;
	let estimateGroups: { [key: number]: string[] } = {};
	let showRestartButton = false;
	let showEstimates = false;

	function closeModal() {
		showModal = false;
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

	function handleEstimateClick(estimate: number) {
		sendMessage(socket, new SelectEstimateMessage(data.roomId, userId, estimate));
	}

	function restartEstimation() {
		sendMessage(socket, { roomId: data.roomId, type: 'restart-estimation' });
	}

	function onMessageReceived(message) {
		console.log(message);

		if (message.type === 'user-joined') {
			sendMessage(socket, { type: 'get-user-estimates' });
		} else if (message.type === 'user-estimates') {
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
			average = message.average;
			estimateGroups = message.groupedEstimates;
			showRestartButton = true;
			showEstimates = true;
		} else if (message.type === 'estimation-restarted') {
			estimateGroups = {};
			showRestartButton = false;
			showEstimates = false;
			sendMessage(socket, { type: 'get-user-estimates' });
		}
	}

	onMount(() => {
		socket = connectToWebSocket(data.roomId, onMessageReceived);
	});
</script>

<h1>Estimation Page</h1>

{#if showModal}
	<Modal {closeModal} {joinRoom} />
{/if}

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

<UsersList {users} {showEstimates} {userId} />

<Estimates onEstimateClick={handleEstimateClick} />

{#if Object.keys(estimateGroups).length > 0}
	<EstimateGroupsList {estimateGroups} />
	<AverageEstimate {average} />
{/if}

<style>
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
