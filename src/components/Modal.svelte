<script>
	export let showModal = false;
	export let heading = '';
	export let body = '';

	function handleOverlayClick(event) {
		if (event.target.id === 'modal-overlay') {
			showModal = false;
		}
	}
</script>

<div class="modal-container" on:click={handleOverlayClick} on:keydown={handleOverlayKeydown}>
	<div id="modal-overlay" aria-modal="true">
		<div class="modal">
			<h2>{heading}e</h2>
			<p>{body}</p>
		</div>
	</div>
</div>

<style scoped>
	.modal-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	#modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background-color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.input-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	input[type='text'] {
		font-size: 1.2rem;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid gray;
		margin-bottom: 0.5rem;
		width: 100%;
		max-width: 20rem;
	}

	label {
		font-size: 1rem;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	button {
		font-size: 1.2rem;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		background-color: #007acc;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		width: 100%;
		max-width: 20rem;
	}

	button:hover {
		background-color: #005f8a;
	}

	p {
		font-size: 1rem;
		font-style: italic;
		color: gray;
		margin-top: 0.5rem;
	}

	h2 {
		margin-bottom: 0px;
	}

	.modal {
		color: #333;
	}
</style>
