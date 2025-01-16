<script lang="ts">
  import { players } from '../../stores/players'; // 참가자 이름을 관리하는 store import
  import { goto } from '$app/navigation'; // 페이지 이동을 위한 SvelteKit 기능 import

  function handleNext() {
    console.log('입력된 값:', $players);
    goto('/log'); // /log 페이지로 이동
  }
</script>

<main class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-xl font-bold text-gray-800 mb-6 text-center">참가자 이름을 입력해주세요</h1>

    <form class="flex flex-col space-y-4">
      <label class="flex items-center">
        <span class="w-12 text-gray-700 text-right mr-4">동</span>
        <input
          class="flex-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="이름 입력"
          bind:value={$players.east}
        />
      </label>
      <label class="flex items-center">
        <span class="w-12 text-gray-700 text-right mr-4">남</span>
        <input
          class="flex-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="이름 입력"
          bind:value={$players.south}
        />
      </label>
      <label class="flex items-center">
        <span class="w-12 text-gray-700 text-right mr-4">서</span>
        <input
          class="flex-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="이름 입력"
          bind:value={$players.west}
        />
      </label>
      <label class="flex items-center">
        <span class="w-12 text-gray-700 text-right mr-4">북</span>
        <input
          class="flex-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="이름 입력"
          bind:value={$players.north}
        />
      </label>
    </form>

    <button
      class="mt-6 w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      on:click={handleNext}
    >
      다음
    </button>
  </div>
</main>
