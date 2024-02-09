<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  type Rocket = {
    id: number;
    x: string;
    y: string;
    colour: string;
  }
  const rockets = writable<Rocket[]>([]);
  let rocketIntervalId;
  let rocketCount: number = 0;

  function randomLocation(): { x: string; y: string;} {
    return {
      x: `${Math.random() * window.innerWidth - window.innerWidth / 2}px`,
      y: `${Math.random() * window.innerHeight - window.innerHeight / 2}px`,
    };
  }

  function randomColour(): string {
    return `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;
  }

  function randomTimer(): number {
    return Math.floor(Math.random() * (150 - 30 + 1)) + 30;
  }

  function setupRocket(): Rocket {
    const colour = randomColour();
    const { x, y } = randomLocation();
    const newRocket: Rocket = { id: rocketCount++, x, y, colour };
    return newRocket;
  }

  function launchRockets() {
    const newRocket = setupRocket();
    rockets.update((currentRockets) => {
      if (currentRockets.length > 25) {
        // only keep 100 rockets
        currentRockets.shift();
      }
      return [...currentRockets, newRocket]
    });
  }

  onMount(() => {
    rocketIntervalId = setInterval(launchRockets, randomTimer());
    setTimeout(()=>{ clearInterval(rocketIntervalId) }, 13000)
	});

  onDestroy(() => {
    clearInterval(rocketIntervalId);
  });
</script>

<style>

  .rocket {
    --x: 0;
    --y: 0;
    background-color: rebeccapurple;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 5px;
    width: 5px;
    z-index: -1;
  }

  .rocket.move {
    animation: move 1000ms linear forwards;
  }

  @keyframes move {
    to {
      transform: translate(var(--x), var(--y));
    }

    95% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
</style>

<div class="launch-pad">
  {#each $rockets as rocket (rocket.id)}
    <span
      class="rocket move"
      style="
        --x: {rocket.x};
        --y: {rocket.y};
        background: {rocket.colour};
      "
    ></span>
  {/each}
</div>