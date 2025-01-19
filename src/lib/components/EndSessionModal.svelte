<script lang="ts">
    import { players } from '../stores/players';
    import { scores, potScore, richPlayers } from '../stores/scores';
    import { history } from '../stores/history';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // 페이지 이동을 위한 함수
  
    export let closeModal: () => void;
  
    let playersList = $players;
    let scoresList = $scores;
  
    // LocalStorage 초기화 함수
    function resetData() {
      players.set({
        east: '',
        south: '',
        west: '',
        north: '',
      });
  
      scores.set({
        east: 25000,
        south: 25000,
        west: 25000,
        north: 25000,
      });
  
      potScore.set(0);
      richPlayers.set([]);
      history.set([]);
    }
  
    // History 데이터를 .txt 파일로 다운로드
    function downloadHistory() {
      const now = new Date();
      const filename = `mahjong-log_${now.toISOString().replace(/[:.]/g, '-')}.txt`;
  
      const historyData = $history.map(
        (entry) =>
          `${new Date(entry.timestamp).toLocaleString()} - [${entry.type}] ${entry.message}`
      );
  
      const content = `
      기록 종료 시각: ${now.toLocaleString()}
      동: ${playersList.east} - ${scoresList.east}점
      남: ${playersList.south} - ${scoresList.south}점
      서: ${playersList.west} - ${scoresList.west}점
      북: ${playersList.north} - ${scoresList.north}점
  
      기록 내용:
      ${historyData.join('\n')}
      `.trim();
  
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  
    function confirmEndSession() {
      downloadHistory();
      resetData();
      closeModal();

      goto('/'); // '/' 경로를 메인 페이지 경로로 지정
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
      <h2 class="text-lg font-bold mb-4">정말로 기록을 종료하시겠습니까?</h2>
      <div class="mb-6">
        <p>종료 후 모든 기록이 초기화됩니다.</p>
        <p>기존 데이터를 다운로드하시겠습니까?</p>
      </div>
  
      <div class="flex justify-end space-x-4">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          on:click={closeModal}
        >
          취소
        </button>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          on:click={confirmEndSession}
        >
          확인
        </button>
      </div>
    </div>
  </div>
  