<script lang="ts">
	export let estimates: any;
	export let handleEstimateChange: any;
</script>

<div id="users-list">
	<h2>Users</h2>
	<ul>
		{#each estimates as user}
			<li>
				{user.name}
				<input
					type="number"
					value={user.estimate}
					on:input={(e) => handleEstimateChange(e, user)}
				/>
			</li>
		{/each}
	</ul>
</div>
