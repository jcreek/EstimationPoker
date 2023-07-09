<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import { onMount, afterUpdate } from 'svelte';
	import UsersList from '../../../components/UsersList.svelte';
	import EstimateGroupsList from '../../../components/EstimateGroupsList.svelte';
	import AverageEstimate from '../../../components/AverageEstimate.svelte';
	import Modal from '../../../components/Modal.svelte';

	import { connectToWebSocket, sendMessage, generateId } from '../estimation.js';
	import { User } from '../../../server/classes/user';
	import { Room } from '../../../server/classes/room';
	import { ChangeEstimateMessage } from '../../../server/classes/messages/ChangeEstimateMessage';
	import { JoinRoomMessage } from '../../../server/classes/messages/JoinRoomMessage';
	import { SelectEstimateMessage } from '../../../server/classes/messages/SelectEstimateMessage';

	let socket;
	let showModal = true;
	let currentUserIndex = -1;
	let userEstimateFields: HTMLInputElement[] = [];

	function closeModal() {
		showModal = false;
	}

	afterUpdate(() => {
		// Disable all estimate fields
		userEstimateFields.forEach((field) => (field.disabled = true));

		// Enable the estimate field for the current user
		if (currentUserIndex !== -1) {
			userEstimateFields[currentUserIndex].disabled = false;
		}
	});

	function onMessageReceived(message) {
		console.log(message);
	};

	onMount(() => {
		// Connect to WebSocket server with the room ID
		socket = connectToWebSocket(data.roomId, onMessageReceived);

		// // Initialize the userEstimateFields array
		// userEstimateFields = Array.from(
		// 	document.querySelectorAll('.estimate-field')
		// ) as HTMLInputElement[];

		// groupEstimates();
	});

	function joinRoom(name: string) {
		sendMessage(socket, new JoinRoomMessage(data.roomId, generateId(), name));
	}

	let estimates = [];
	// let estimates = [
	// 	{ name: 'User 1', estimate: 8 },
	// 	{ name: 'User 2', estimate: 8 },
	// 	{ name: 'User 3', estimate: 13 },
	// 	{ name: 'User 4', estimate: 13 },
	// 	{ name: 'User 5', estimate: 13 },
	// 	{ name: 'User 6', estimate: 21 },
	// 	{ name: 'User 7', estimate: 21 },
	// 	{ name: 'User 8', estimate: 21 },
	// 	{ name: 'User 9', estimate: 34 },
	// 	{ name: 'User 10', estimate: 34 },
	// 	{ name: 'User 11', estimate: 34 },
	// 	{ name: 'User 12', estimate: 34 },
	// 	{ name: 'User 13', estimate: 55 },
	// 	{ name: 'User 14', estimate: 55 },
	// 	{ name: 'User 15', estimate: 55 }
	// ];

	// Group users by their estimates
	let estimateGroups: { [key: number]: string[] } = {};

	function groupEstimates() {
		estimateGroups = {};
		estimates.forEach((estimate) => {
			if (estimate.estimate !== null) {
				if (estimateGroups[estimate.estimate]) {
					estimateGroups[estimate.estimate].push(estimate.name);
				} else {
					estimateGroups[estimate.estimate] = [estimate.name];
				}
			}
		});
	}

	// function calculateAverageEstimate() {
	// 	let total = 0;
	// 	estimates.forEach((estimate) => {
	// 		if (estimate.estimate !== null) {
	// 			total += estimate.estimate;
	// 		}
	// 	});
	// 	return total / estimates.length;
	// }

	// let average = calculateAverageEstimate();

	// function handleEstimateChange(event: any, user: any) {
	// 	const { value } = event.target;
	// 	user.estimate = value !== '' ? Number(value) : null;
	// 	groupEstimates();
	// 	average = calculateAverageEstimate();
	// }
</script>

<h1>Estimation Page</h1>

{#if showModal}
	<Modal {closeModal} {joinRoom} />
{/if}

<!-- <UsersList {estimates} {handleEstimateChange} bind:this={userEstimateFields} />

{#if Object.keys(estimateGroups).length > 0}
	<EstimateGroupsList {estimateGroups} />
	<AverageEstimate {average} />
{/if} -->

<style>
	/* CSS styles */
	/* ... */
</style>
