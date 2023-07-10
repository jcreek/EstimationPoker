<header class="topbar-container">
	<div class="topbar-items"><h1><a href="/">Estimation Poker</a></h1></div>
	<p id="install-app-btn-container" class="topbar-items">
		<button id="install-offline-app" class="button button-black">
			<span>Install the app (you can even use it offline!)</span>
		</button>
	</p>
</header>

<div id="main-container">
	<slot />
</div>

<footer class="footer-container">
	<hr />
	<span class="footer-items">Copyright &copy; 2023 Josh Creek</span>
	<span> | </span>
	<span class="footer-items"><a href="/privacy-policy.html">Privacy Policy</a></span>
</footer>

<style>
	#main-container {
		margin: 0 auto;
		max-width: 100%; /* Allow the element to grow wider than its parent */
		padding: 0 20px; /* Add some horizontal spacing */
	}

	@media (max-width: 767px) {
		#main-container {
			width: 100%; /* Fill the full width of the viewport */
		}
	}

	@media (min-width: 768px) {
		#main-container {
			width: 80%; /* Adjust the width as per your preference */
		}
	}

	.topbar-container {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: flex-start;
		align-content: flex-start;
		background-color: #8d6a9f;
		margin-bottom: 25px;
		gap: 5px;
	}

	.topbar-container h1 {
		color: white;
		font-family: 'Fuzzy Bubbles', cursive;
		font-weight: 700;
		margin-block-start: 0.2em;
		margin-block-end: 0.2em;
	}

	.topbar-container h1 a {
		color: white;
	}

	.topbar-container h1 a:link {
		text-decoration: none;
	}

	.topbar-container p {
		margin-block-start: 0.2em;
		margin-block-end: 0.2em;
	}

	.topbar-items:nth-child(1) {
		display: block;
		flex-grow: 0;
		flex-shrink: 1;
		flex-basis: auto;
		align-self: flex-start;
		order: 0;
	}

	.topbar-items:nth-child(2) {
		display: block;
		flex-grow: 0;
		flex-shrink: 1;
		flex-basis: 200px;
		align-self: center;
		order: 0;
	}

	#install-app-btn-container {
		display: none;
	}

	.footer-container {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		color: #423e37;
		padding-bottom: 10px;
		background-color: white;
	}

	.footer-container hr {
		max-width: 500px;
		border-top: 0.5px solid #423e37;
		margin-left: auto;
		margin-right: auto;
	}

	.footer-container a {
		color: #423e37;
	}

	.footer-container a:hover {
		color: #81796c;
	}

	/* .button {
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
	} */
</style>
