<script lang="ts">
  import { scores, potScore, richPlayers } from '../stores/scores';
  import { history } from '../stores/history';
  import type { Position } from '../stores/scores';

  export let playersList: Record<Position, string>;
  export let selectedPlayer: Position | null;
  export let closeModal: () => void;

  export let mode: '론' | '쯔모' | null;
  export let ronScore: string;
  export let parentScore: string;
  export let childScore: string;
  export let selectedRonPlayer: Position | null;
  export let selectedParent: Position | null;

  function updateScores() {
    scores.update((currentScores) => {
      const ronPoints = Number(ronScore) || 0;
      const parentPoints = Number(parentScore) || 0;
      const childPoints = Number(childScore) || 0;

      if (mode === '론' && selectedRonPlayer && selectedPlayer) {
        // 론 기록 추가
        history.update((currentHistory) => [
          {
            type: '론',
            message: `${playersList[selectedPlayer]}이(가) ${playersList[selectedRonPlayer!]}을(를) ${ronPoints}점으로 쏨.`,
            timestamp: Date.now(),
          },
          ...currentHistory,
        ]);

        currentScores[selectedRonPlayer] -= ronPoints;
        currentScores[selectedPlayer] += ronPoints + $potScore;

        // 공탁 점수 초기화
        potScore.set(0);
        richPlayers.set([]);
      } else if (mode === '쯔모' && selectedPlayer) {
        if (selectedPlayer === selectedParent) {
          const totalPoints = parentPoints * 3;
          // 쯔모 (본인이 오야)
          history.update((currentHistory) => [
            {
              type: '쯔모',
              message: `${playersList[selectedPlayer]}이(가) 쯔모로 ${totalPoints}(올)`,
              timestamp: Date.now(),
            },
            ...currentHistory,
          ]);

          Object.keys(currentScores).forEach((key) => {
            const positionKey = key as Position;
            if (positionKey === selectedPlayer) {
              currentScores[positionKey] += totalPoints + $potScore;
            } else {
              currentScores[positionKey] -= parentPoints;
            }
          });

          // 공탁 점수 초기화
          potScore.set(0);
          richPlayers.set([]);
        } else if (selectedParent) {
          history.update((currentHistory) => [
            {
              type: '쯔모',
              message: `${playersList[selectedPlayer]}이(가) 쯔모로 오야에게 ${parentPoints}, 코에게 ${childPoints}`,
              timestamp: Date.now(),
            },
            ...currentHistory,
          ]);

          Object.keys(currentScores).forEach((key) => {
            const positionKey = key as Position;
            if (positionKey === selectedParent) {
              currentScores[positionKey] -= parentPoints;
            } else if (positionKey === selectedPlayer) {
              currentScores[positionKey] += parentPoints + childPoints * 2 + $potScore;
            } else {
              currentScores[positionKey] -= childPoints;
            }
          });

          // 공탁 점수 초기화
          potScore.set(0);
          richPlayers.set([]);
        }
      }
      return currentScores;
    });

    closeModal();
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
    <h2 class="mb-4 text-lg font-bold">
      화료 정보 입력 ({selectedPlayer && playersList[selectedPlayer]})
    </h2>

    <!-- 화료 방식 -->
    <div class="mb-4">
      <p class="block text-gray-700 font-semibold">화료 방식</p>
      <div class="flex space-x-4">
        <button
          class={`rounded-lg px-4 py-2 ${
            mode === '론' ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          on:click={() => (mode = '론')}
        >
          론
        </button>
        <button
          class={`rounded-lg px-4 py-2 ${
            mode === '쯔모' ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          on:click={() => (mode = '쯔모')}
        >
          쯔모
        </button>
      </div>
    </div>

    <!-- 론 방식 -->
    {#if mode === '론'}
      <div class="mb-4">
        <p class="block text-gray-700 font-semibold">방총자</p>
        <div class="flex space-x-4">
          {#each Object.keys(playersList) as position}
            {#if position !== selectedPlayer}
              <button
                class={`rounded-lg px-4 py-2 ${
                  selectedRonPlayer === position
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                on:click={() => (selectedRonPlayer = position as Position)}
              >
                {playersList[position as Position]}
              </button>
            {/if}
          {/each}
        </div>
      </div>
      <div class="mb-4">
        <label for="ronScore" class="block text-gray-700 font-semibold">점수</label>
        <input
          id="ronScore"
          type="number"
          class="mt-1 w-full px-4 py-2 border rounded-md"
          bind:value={ronScore}
        />
      </div>
    {/if}

    <!-- 쯔모 방식 -->
    {#if mode === '쯔모'}
      {#if selectedPlayer === selectedParent}
        <!-- 점수(올) -->
        <div class="mb-4">
          <label for="parentScore" class="block text-gray-700 font-semibold">점수 (올)</label>
          <input
            id="parentScore"
            type="number"
            class="mt-1 w-full px-4 py-2 border rounded-md"
            bind:value={parentScore}
          />
        </div>
      {:else}
        <!-- 점수(오야)와 점수(코) -->
        <div class="mb-4">
          <label for="parentScore" class="block text-gray-700 font-semibold">점수 (오야)</label>
          <input
            id="parentScore"
            type="number"
            class="mt-1 w-full px-4 py-2 border rounded-md"
            bind:value={parentScore}
          />
        </div>
        <div class="mb-4">
          <label for="childScore" class="block text-gray-700 font-semibold">점수 (코)</label>
          <input
            id="childScore"
            type="number"
            class="mt-1 w-full px-4 py-2 border rounded-md"
            bind:value={childScore}
          />
        </div>
      {/if}
      <div class="mb-4">
        <p class="block text-gray-700 font-semibold">오야 선택</p>
        <div class="flex space-x-4">
          {#each Object.keys(playersList) as position}
            <button
              class={`rounded-lg px-4 py-2 ${
                selectedParent === position
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              on:click={() => (selectedParent = position as Position)}
            >
              {playersList[position as Position]}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 확인 및 취소 버튼 -->
    <div class="flex justify-end space-x-4">
      <button
        class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        on:click={closeModal}
      >
        취소
      </button>
      <button
        class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        on:click={updateScores}
      >
        확인
      </button>
    </div>
  </div>
</div>
