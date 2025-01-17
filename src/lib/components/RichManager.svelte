<script lang="ts">
  import { players } from '../stores/players';
  import { scores, potScore, richPlayers } from '../stores/scores';
  import type { Position } from '../stores/scores';

  // 리치 체크/해제 로직
  function toggleRich(player: Position) {
    richPlayers.update((currentRichPlayers) => {
      const isAlreadyRich = currentRichPlayers.includes(player);
      scores.update((currentScores) => {
        if (isAlreadyRich) {
          // 체크 해제: 점수 복구
          currentScores[player] += 1000;
          potScore.update((pot) => pot - 1000); // 공탁 감소
        } else {
          // 체크: 점수 차감
          currentScores[player] -= 1000;
          potScore.update((pot) => pot + 1000); // 공탁 증가
        }
        return currentScores;
      });

      // 리치 상태 업데이트
      if (isAlreadyRich) {
        return currentRichPlayers.filter((p) => p !== player);
      } else {
        return [...currentRichPlayers, player];
      }
    });
  }
</script>

<div class="flex flex-col items-center">
  <div class="mt-4 flex space-x-4">
    {#each Object.keys($players) as position}
      <button
        class={`rounded-lg px-4 py-2 ${
          $richPlayers.includes(position as Position)
            ? 'bg-green-500 text-white'
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        on:click={() => toggleRich(position as Position)}
      >
        {$players[position as Position]}
      </button>
    {/each}
  </div>
</div>
