<script lang="ts">
	export let users: any;
	export let showEstimates: boolean = false;
	export let userId: string;
</script>

<div id="users-list">
	<div class="users-container">
		{#each users as user}
			<div class="user-wrapper">
				<div class="name">{user.name}</div>
				<div class="user-card"
					class:user-card-null={user.estimate === null}
					class:user-card-green={user.estimate !== null}
				>
					{#if user.estimate !== null && (showEstimates || user.userId === userId)}
						<p class="estimate">{user.estimate}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	#users-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-bottom: 30px;
	}

	.users-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.user-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

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
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.name {
		font-size: 16px;
		margin-bottom: 5px;
	}
</style>
