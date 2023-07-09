<script>
	import { generateId } from './estimation/estimation.js';
	import { goto } from '$app/navigation';

	function startARoom() {
		const roomId = generateId();
		goto(`/estimation/${roomId}`);
	}
</script>

<h1>Estimation Poker</h1>

<button on:click={startARoom}>Start a room</button>
