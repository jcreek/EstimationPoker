<script lang="ts">
	export let estimates: any;
	export let handleEstimateChange: any;
	export let currentUserIndex: number;
</script>

<div id="users-list">
	<h2>Users</h2>
	<ul>
		{#each estimates as user, index}
			<li>
				{user.name}
				<input
					type="number"
					value={user.estimate}
					on:input={(e) => handleEstimateChange(e, user)}
					disabled={currentUserIndex !== index ? true : null}
				/>
			</li>
		{/each}
	</ul>
</div>
