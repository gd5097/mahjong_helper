<script lang="ts">
    import { history } from '../stores/history';
  
    // History를 가져옴
    $: historyList = $history;
  </script>
  
  <div class="mt-8 w-full max-w-lg overflow-hidden border rounded-lg shadow-md">
    <h3 class="bg-gray-200 text-center font-bold py-2">History</h3>
    <div class="max-h-60 overflow-y-auto">
      {#each historyList.slice(0).reverse() as entry, index}
        <div class="p-4 border-b last:border-none">
          <p class="text-sm text-gray-700">{entry.message}</p>
          <p class="text-xs text-gray-400 text-right">{new Date(entry.timestamp).toLocaleString()}</p>
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .max-h-60 {
      max-height: 15rem;
    }
  </style>
  