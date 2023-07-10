<script lang="ts">
	export let estimateGroups: any;
</script>

<div id="estimate-groups-list">
	<h2>Estimate Groups</h2>
	<ul>
		{#each Object.keys(estimateGroups) as estimate}
			<li>
				<h4>{estimate}</h4>
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

<style>
	#estimate-groups-list {
		margin-bottom: 30px;
		text-align: center;
	}

	#estimate-groups-list h2 {
		font-size: 24px;
		margin-bottom: 10px;
	}

	#estimate-groups-list ul {
		list-style-type: none;
		padding-left: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	#estimate-groups-list li {
		background-color: #f4f4f4;
		padding: 10px;
		margin: 10px;
		text-align: center;
	}

	#estimate-groups-list h4 {
		font-size: 18px;
		margin-bottom: 5px;
	}

	#estimate-groups-list ul ul {
		margin-top: 5px;
		text-align: left;
	}

	#estimate-groups-list ul ul li {
		font-size: 14px;
		color: #888;
	}

	#estimate-groups-list ul ul li::before {
		content: '- ';
		color: #ccc;
		display: inline;
		margin-right: 5px;
	}
</style>
