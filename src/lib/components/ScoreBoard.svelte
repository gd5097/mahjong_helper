<script lang="ts">
    import { scores } from '../stores/scores';
    import type { Position } from '../stores/scores';
  
    export let playersList: Record<Position, string>;
  </script>
  
  <div class="grid grid-cols-2 gap-4">
    {#each Object.entries(playersList) as [position, name]}
      <div class="flex flex-col items-center">
        <span class="text-lg font-semibold">{name}</span>
        <span class="text-xl text-blue-500 font-bold">{$scores[position as Position]}점</span>
      </div>
    {/each}
  </div>
  