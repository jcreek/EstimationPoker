<script lang="ts">
	export let users: any;
	export let showEstimates: boolean = false;
</script>

<div id="users-list">
	<h2>Users</h2>
	{#each users as user}
		<div class="name">{user.name}</div>
		<div
			class="user-card"
			class:user-card-null={user.estimate === null}
			class:user-card-green={user.estimate !== null}
		>
			{#if user.estimate !== null && showEstimates}
				<p class="estimate">{user.estimate}</p>
			{/if}
		</div>
	{/each}
</div>

<style>
	.user-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 80px;
		border: 1px solid #ccc;
		border-radius: 8px;
		margin: 10px;
		background-color: #fff;
		text-align: center;
	}

	.user-card-null {
		background-color: #ccc;
		color: #fff;
	}

	.user-card-green {
		background-color: #6bbf6b;
		color: #fff;
	}

	.estimate {
		font-size: 24px;
		font-weight: bold;
		margin: 0;
	}

	.name {
		font-size: 16px;
		margin-top: 10px;
	}
</style>
