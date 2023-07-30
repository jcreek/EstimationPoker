<script>
	export let closeModal;
	export let joinRoom;
  
	let userName = '';
	let rememberName = false;
  
	function handleNameChange(event) {
	  userName = event.target.value;
	}
  
	function handleSubmit() {
	  if (userName.trim() !== '') {
		joinRoom(userName);
		if (rememberName && typeof localStorage !== 'undefined') {
		  localStorage.setItem('userName', userName);
		  localStorage.setItem('rememberName', true);
		} else if (typeof localStorage !== 'undefined') {
		  localStorage.removeItem('userName');
		  localStorage.removeItem('rememberName');
		}
		closeModal();
	  }
	}
  
	function handleRememberChange(event) {
	  rememberName = event.target.checked;
	}
  
	$: userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') || '' : '';
	$: rememberName = typeof localStorage !== 'undefined' ? localStorage.getItem('rememberName') === 'true' : false;
  </script>

<div class="modal-container">
	<div class="modal-overlay">
		<div class="modal">
			<h2>Enter Your Name</h2>
			<p>Try clicking on someone's card...</p>
			<div class="input-container">
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
				<label class="rememberme">
					<input type="checkbox" bind:checked={rememberName} on:change={handleRememberChange} />
					Remember my name
				</label>
			</div>
			<div class="button-container">
				<button on:click={handleSubmit}>Save</button>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.modal-overlay {
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
