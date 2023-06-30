<script lang="ts">
	export let estimateGroups: any;
</script>

<div id="estimate-groups-list">
	<h2>Estimate Groups</h2>
	<ul>
		{#each Object.keys(estimateGroups) as estimate}
			<li>
				Estimate: {estimate}
				<ul>
					{#if estimateGroups[estimate].length >= 5}
						<li>5+ people</li>
					{:else}
						{#each estimateGroups[estimate] as user}
							<li>{user}</li>
						{/each}
					{/if}
				</ul>
			</li>
		{/each}
	</ul>
</div>
