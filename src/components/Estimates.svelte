<script lang="ts">
	export let values: number[] = [1, 2, 3, 5, 8, 13, 21];
	export let onEstimateClick: (value: number) => void;
</script>

<div id="estimates-list">
	<div class="centered-container">
		{#each values as value}
			<button
				class="estimate-card"
				on:click={() => onEstimateClick(value)}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						onEstimateClick(value);
					}
				}}
				aria-label={`Estimate: ${value}`}
				tabindex="0"
			>
				<p class="value">{value}</p>
			</button>
		{/each}
	</div>
</div>

<style>
	.estimate-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 80px;
		border: 1px solid #ccc;
		border-radius: 8px;
		margin: 10px;
		background-color: #6bb0d5;
		color: #fff;
		text-align: center;
		cursor: pointer;
	}

	.value {
		font-size: 24px;
		font-weight: bold;
		margin: 0;
	}

	.centered-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
