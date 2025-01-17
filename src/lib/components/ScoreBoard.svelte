<script lang="ts">
  import { scores } from '../stores/scores';
  import type { Position } from '../stores/scores';

  export let playersList: Record<Position, string>;

  let editingPosition: Position | null = null; // 현재 수정 중인 플레이어
  let tempScore: string = ''; // 임시 점수 입력값

  function startEditing(position: Position) {
    editingPosition = position;
    tempScore = $scores[position].toString(); // 기존 점수를 입력 필드에 표시
  }

  function saveScore(position: Position) {
    const newScore = parseInt(tempScore);
    if (!isNaN(newScore)) {
      scores.update((currentScores) => {
        currentScores[position] = newScore; // 점수 업데이트
        return currentScores;
      });
    }
    cancelEditing();
  }

  function cancelEditing() {
    editingPosition = null;
    tempScore = '';
  }
</script>

<div class="grid grid-cols-2 gap-4">
  {#each Object.entries(playersList) as [position, name]}
    <div class="flex flex-col items-center">
      <span class="text-lg font-semibold">{name}</span>

      {#if editingPosition === position}
        <!-- 점수 입력 필드 -->
        <div class="flex flex-col items-center">
          <input
            type="number"
            class="mt-1 w-16 text-center text-blue-500 font-bold border-b border-gray-300 focus:outline-none"
            bind:value={tempScore}
          />
          <div class="flex mt-2 space-x-2">
            <button
              class="text-sm text-green-500 hover:underline"
              on:click={() => saveScore(position as Position)}
            >
              저장
            </button>
            <button
              class="text-sm text-red-500 hover:underline"
              on:click={cancelEditing}
            >
              취소
            </button>
          </div>
        </div>
      {:else}
        <!-- 점수 표시 (클릭 가능) -->
        <button
          class="text-xl text-blue-500 font-bold cursor-pointer bg-transparent border-none focus:outline-none"
          on:click={() => startEditing(position as Position)}
          on:keydown={(e) => e.key === 'Enter' && startEditing(position as Position)}
        >
          {$scores[position as Position]}점
        </button>
      {/if}
    </div>
  {/each}
</div>
