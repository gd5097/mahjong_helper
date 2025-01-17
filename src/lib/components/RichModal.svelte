<script lang="ts">
    import { scores, potScore, richPlayers } from '../stores/scores';
    import type { Position } from '../stores/scores';
  
    export let playersList: Record<Position, string>;
    export let closeModal: () => void;
  
    function toggleRichPlayer(player: Position) {
      scores.update((currentScores) => {
        potScore.update((currentPot) => {
          richPlayers.update((currentRichPlayers) => {
            if (currentRichPlayers.includes(player)) {
              // 리치 해제
              currentScores[player] += 1000;
              currentPot -= 1000;
              return currentRichPlayers.filter((p) => p !== player);
            } else {
              // 리치 체크
              currentScores[player] -= 1000;
              currentPot += 1000;
              return [...currentRichPlayers, player];
            }
          });
          return currentPot;
        });
        return currentScores;
      });
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h2 class="mb-4 text-lg font-bold">리치</h2>
  
      <div class="flex space-x-4 mb-4">
        {#each Object.keys(playersList) as position}
          <button
            class={`rounded-lg px-4 py-2 ${
              $richPlayers.includes(position as Position)
                ? 'bg-red-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            on:click={() => toggleRichPlayer(position as Position)}
          >
            {playersList[position as Position]}
          </button>
        {/each}
      </div>
  
      <div class="flex justify-end space-x-4">
        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          on:click={closeModal}
        >
          닫기
        </button>
      </div>
    </div>
  </div>
  