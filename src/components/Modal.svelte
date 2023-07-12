<script>
	export let closeModal;
	export let joinRoom;

	let userName = '';

	function handleNameChange(event) {
		userName = event.target.value;
	}

	function handleSubmit() {
		if (userName.trim() !== '') {
			joinRoom(userName);
			closeModal();
		}
	}
</script>

<div class="modal-overlay">
	<div class="modal">
		<h2>Enter Your Name</h2>
		<p>Try clicking on someone's card...</p>
		<input
			type="text"
			placeholder="Your name"
			bind:value={userName}
			on:input={handleNameChange}
			on:keydown={(event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
					handleSubmit();
				}
			}}
		/>
		<button on:click={handleSubmit}>Save</button>
	</div>
</div>

<style>
	p {
		font-size: 12px;
		font-style: italic;
		color: gray;
	}

	/* Styles for the modal overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Styles for the modal content */
	.modal {
		background-color: #fff;
		padding: 20px;
		max-width: 400px;
		border-radius: 4px;
	}
</style>
