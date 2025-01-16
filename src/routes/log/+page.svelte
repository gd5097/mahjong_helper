<script lang="ts">
    import { players } from '../../stores/players'; // Store import
    import { writable } from 'svelte/store'; // 상태 관리를 위한 store
  
    // 모달 상태 및 데이터 관리
    const modalOpen = writable(false);
    let selectedPlayer: string | null = null; // 화료한 사람
    let mode: '론' | '쯔모' | null = null; // 화료 방식
    let excludedPlayers: string[] = []; // 방총자 선택 시 제외할 플레이어
    let ronScore = ''; // 론 방식 점수
    let parentScore = ''; // 쯔모 방식: 오야 점수
    let childScore = ''; // 쯔모 방식: 자 점수
  
    // 모달 열기
    function openModal(player: string) {
      selectedPlayer = player;
      excludedPlayers = Object.values($players).filter((p) => p !== player); // 화료한 사람 제외
      modalOpen.set(true);
    }
  
    // 모달 닫기
    function closeModal() {
      modalOpen.set(false);
      selectedPlayer = null;
      mode = null;
    }
  
    // 데이터 저장
    function saveData() {
      console.log('저장된 데이터:', {
        화료한사람: selectedPlayer,
        화료방식: mode,
        점수: { ronScore, parentScore, childScore },
      });
      closeModal();
    }
  
    // Store 값 구독 (Svelte의 $store 구문 사용)
    $: playersList = $players;
  </script>
  
  <main class="flex flex-col items-center min-h-screen bg-gray-100">
    <h1 class="text-xl font-bold text-gray-800 mb-6 text-center">로그 페이지</h1>
  
    <!-- 화료한 사람 버튼 -->
    <div class="flex space-x-4">
      {#each Object.entries(playersList) as [position, name]}
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          on:click={() => openModal(name)}
        >
          {name} ({position})
        </button>
      {/each}
    </div>
  
    <!-- 모달 -->
    {#if $modalOpen}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h2 class="text-lg font-bold mb-4">화료 정보 입력 ({selectedPlayer})</h2>
  
          <!-- 화료 방식 -->
          <div class="flex space-x-4 mb-4">
            <button
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              on:click={() => (mode = '론')}
            >
              론
            </button>
            <button
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              on:click={() => (mode = '쯔모')}
            >
              쯔모
            </button>
          </div>
  
          <!-- 론 방식 -->
          {#if mode === '론'}
            <h3 class="text-md font-semibold mb-2">방총자</h3>
            <div class="flex space-x-4 mb-4">
              {#each excludedPlayers as player}
                <button
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  on:click={() => (ronScore = player)}
                >
                  {player}
                </button>
              {/each}
            </div>
            <label class="block mb-4">
              <span class="text-gray-700">점수</span>
              <input
                type="number"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                bind:value={ronScore}
              />
            </label>
          {/if}
  
          <!-- 쯔모 방식 -->
          {#if mode === '쯔모'}
            <h3 class="text-md font-semibold mb-2">오야 선택</h3>
            <div class="flex space-x-4 mb-4">
              {#each Object.values(playersList) as player}
                <button
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  on:click={() => (parentScore = player)}
                >
                  {player}
                </button>
              {/each}
            </div>
            <label class="block mb-4">
              <span class="text-gray-700">점수 (올)</span>
              <input
                type="number"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                bind:value={parentScore}
              />
            </label>
          {/if}
  
          <!-- 확인 버튼 -->
          <div class="flex justify-end space-x-4">
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              on:click={closeModal}
            >
              취소
            </button>
            <button
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              on:click={saveData}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    {/if}
  </main>
  