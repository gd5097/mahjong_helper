<script lang="ts">
    import { scores, richPlayers } from '../stores/scores';
    import { history } from '../stores/history';
    import type { Position } from '../stores/scores';
  
    export let playersList: Record<Position, string>;
    export let closeModal: () => void;
    let tenpaiPlayers: Position[] = [];
  
    function updateTenpaiScores() {
      scores.update((currentScores) => {
        const numTenpai = tenpaiPlayers.length;
  
        if (numTenpai === 0 || numTenpai === 4) {
          history.update((currentHistory) => [
            {
              type: '유국',
              message: `${numTenpai === 0 ? '텐파이 없음' : '4명 텐파이'}로 유국됨.`,
              timestamp: Date.now(),
            },
            ...currentHistory,
          ]);
          return currentScores;
        }
  
        const tenpaiPoints = numTenpai === 1 ? 3000 : numTenpai === 2 ? 1500 : 1000;
        const nonTenpaiPoints = numTenpai === 1 ? 1000 : numTenpai === 2 ? 1500 : 3000;
  
        Object.keys(currentScores).forEach((key) => {
          const positionKey = key as Position;
          if (tenpaiPlayers.includes(positionKey)) {
            // 텐파이 점수 증가
            currentScores[positionKey] += tenpaiPoints;
          } else {
            // 비텐파이 점수 감소
            currentScores[positionKey] -= nonTenpaiPoints;
          }
        });

        // 유국 기록 추가
        history.update((currentHistory) => [
          {
            type: '유국',
            message: `${tenpaiPlayers.map((pos) => playersList[pos]).join(', ')}으로 총 ${numTenpai}명 텐파이`,
            timestamp: Date.now(),
          },
          ...currentHistory,
        ]);
  
        return currentScores;
      });
  
      // 유국 시 리치 상태 초기화, 공탁 점수는 그대로 유지
      richPlayers.set([]);
  
      closeModal();
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h2 class="mb-4 text-lg font-bold">유국 정보 입력</h2>
  
      <!-- 텐파이 선택 -->
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
                // 텐파이 해제
                tenpaiPlayers = tenpaiPlayers.filter((p) => p !== pos);
              } else {
                // 텐파이 추가
                tenpaiPlayers = [...tenpaiPlayers, pos];
              }
            }}
          >
            {playersList[position as Position]}
          </button>
        {/each}
      </div>
  
      <!-- 취소 및 확인 버튼 -->
      <div class="flex justify-end space-x-4">
        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          on:click={closeModal}
        >
          취소
        </button>
        <button
          class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          on:click={updateTenpaiScores}
        >
          확인
        </button>
      </div>
    </div>
  </div>
  