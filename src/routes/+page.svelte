<script>
	import { generateRoomId } from './estimation/estimation.js';
	import { goto } from '$app/navigation';

	function startARoom() {
		const roomId = generateRoomId();
		goto(`/estimation/${roomId}`);
	}
</script>

<h1>Estimation Poker</h1>

<button on:click={startARoom}>Start a room</button>
