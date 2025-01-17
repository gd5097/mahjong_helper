<script lang="ts">
	import { players } from '../../lib/stores/players';
	import { scores, potScore, richPlayers } from '../../lib/stores/scores';
	import ScoreBoard from '../../lib/components/ScoreBoard.svelte';
	import WinModal from '../../lib/components/WinModal.svelte';
	import RichModal from '../../lib/components/RichModal.svelte';
	import TenpaiModal from '$lib/components/TenpaiModal.svelte';
	import type { Position } from '../../lib/stores/scores';
  
	let winModalOpen = false;
	let richModalOpen = false;
	let tenpaiModalOpen = false;
	let selectedPlayer: Position | null = null;
  
	// 모달에서 필요한 상태 값
	let mode: '론' | '쯔모' | null = null;
	let ronScore = '';
	let parentScore = '';
	let childScore = '';
	let selectedRonPlayer: Position | null = null;
	let selectedParent: Position | null = null;
  
	function openWinModal(player: Position) {
	  selectedPlayer = player;
	  winModalOpen = true;
	}
  
	function closeWinModal() {
	  winModalOpen = false;
	  selectedPlayer = null;
  
	  // 모달 상태 초기화
	  mode = null;
	  ronScore = '';
	  parentScore = '';
	  childScore = '';
	  selectedRonPlayer = null;
	  selectedParent = null;
	}
  
	function openRichModal() {
	  richModalOpen = true;
	}
  
	function closeRichModal() {
	  richModalOpen = false;
	}

	function openTenpaiModal() {
	  tenpaiModalOpen = true;
	}

	function closeTenpaiModal() {
	  tenpaiModalOpen = false;
	}
  </script>
  
  <main class="flex flex-col items-center min-h-screen bg-gray-100">
	<h1 class="mb-6 text-xl font-bold">로그 페이지</h1>
  
	<!-- 점수판 컴포넌트 -->
	<ScoreBoard playersList={$players} />
  
	<!-- 공탁 및 리치 정보 -->
	<div class="mt-6 mb-4 flex flex-col items-center">
	  <p class="text-lg font-semibold">공탁: {$potScore}점</p>
	  <p class="text-lg font-semibold">
		리치:
		{#each $richPlayers as player}
		  <span class="text-blue-500 font-bold">{$players[player]}</span>
		{/each}
	  </p>
	</div>
  
	
  
	<!-- 화료 버튼 -->
	<h2 class="mt-6 mb-4 text-lg font-bold">화료</h2>
	<div class="flex space-x-4">
	  {#each Object.keys($players) as position}
		<button
		  class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		  on:click={() => openWinModal(position as Position)}
		>
		  {$players[position as Position]}
		</button>
	  {/each}
	</div>
  
	<!-- 화료 모달 -->
	{#if winModalOpen}
	  <WinModal
		playersList={$players}
		selectedPlayer={selectedPlayer}
		closeModal={closeWinModal}
		mode={mode}
		ronScore={ronScore}
		parentScore={parentScore}
		childScore={childScore}
		selectedRonPlayer={selectedRonPlayer}
		selectedParent={selectedParent}
	  />
	{/if}
  
	<!-- 유국 버튼 -->
	<div class="mt-4">
		<button
		  class="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
		  on:click={openTenpaiModal}
		>
		  유국
		</button>
	  </div>

	<!-- 유국 모달 -->
	{#if tenpaiModalOpen}
	  <TenpaiModal playersList={$players} closeModal={closeTenpaiModal} />
	{/if}
  </main>
  