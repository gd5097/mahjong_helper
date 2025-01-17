<script lang="ts">
    import { scores } from '../stores/scores';
    import type { Position } from '../stores/scores';
  
    export let playersList: Record<Position, string>;
    export let closeModal: () => void;
    let tenpaiPlayers: Position[] = [];
  
    function updateTenpaiScores() {
      scores.update((currentScores) => {
        const numTenpai = tenpaiPlayers.length;
  
        if (numTenpai === 0 || numTenpai === 4) return currentScores;
  
        const tenpaiPoints = numTenpai === 1 ? 3000 : numTenpai === 2 ? 1500 : 1000;
        const nonTenpaiPoints = numTenpai === 1 ? 1000 : numTenpai === 2 ? 1500 : 3000;
  
        Object.keys(currentScores).forEach((key) => {
          const positionKey = key as Position;
          if (tenpaiPlayers.includes(positionKey)) {
            currentScores[positionKey] += tenpaiPoints;
          } else {
            currentScores[positionKey] -= nonTenpaiPoints;
          }
        });
  
        return currentScores;
      });
      closeModal();
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h2 class="mb-4 text-lg font-bold">유국 정보 입력</h2>
      <h3 class="text-md mb-2 font-semibold">텐파이</h3>
      <div class="mb-4 flex space-x-4">
        {#each Object.keys(playersList) as position}
          <button
            class={`rounded-lg px-4 py-2 ${
              tenpaiPlayers.includes(position as Position)
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            on:click={() => {
              const pos = position as Position;
              if (tenpaiPlayers.includes(pos)) {
                tenpaiPlayers = tenpaiPlayers.filter((p) => p !== pos);
              } else {
                tenpaiPlayers = [...tenpaiPlayers, pos];
              }
            }}
          >
            {playersList[position as Position]}
          </button>
        {/each}
      </div>
      <div class="flex justify-end space-x-4">
        <button class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600" on:click={closeModal}>
          취소
        </button>
        <button class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600" on:click={updateTenpaiScores}>
          확인
        </button>
      </div>
    </div>
  </div>
  