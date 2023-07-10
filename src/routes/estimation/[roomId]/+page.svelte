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

<UsersList {users} {showEstimates} />

<Estimates onEstimateClick={handleEstimateClick} />

{#if Object.keys(estimateGroups).length > 0}
	<EstimateGroupsList {estimateGroups} />
	<AverageEstimate {average} />
{/if}

<style>
	/* CSS styles */
	/* ... */
</style>
