<script>
	import { generateId } from './estimation/estimation.js';
	import { goto } from '$app/navigation';

	function startARoom() {
		const roomId = generateId();
		goto(`/estimation/${roomId}`);
	}
</script>

<div class="container">
	<p>
		Simply start a room and share the URL to everyone else who needs to join the estimation session.
	</p>
	<button class="button button-green" on:click={startARoom}>Start a room</button>
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
</style>
