<script lang="ts">
	import { players } from '../../stores/players';
	import { writable } from 'svelte/store';

	const modalOpen = writable(false);
	let selectedPlayer: string | null = null; // 화료한 사람
	let mode: '론' | '쯔모' | null = null; // 화료 방식
	let excludedPlayers: string[] = []; // 방총자 선택 시 제외할 플레이어
	let ronScore = ''; // 론 방식 점수
	let parentScore = ''; // 쯔모 방식: 오야 점수
	let childScore = ''; // 쯔모 방식: 코 점수
	let selectedRonPlayer: string | null = null; // 방총자 선택
	let selectedParent: string | null = null; // 오야 선택

	function openModal(player: string) {
		selectedPlayer = player;
		excludedPlayers = Object.values($players).filter((p) => p !== player);
		modalOpen.set(true);
	}

	function closeModal() {
		modalOpen.set(false);
		selectedPlayer = null;
		mode = null;
		selectedRonPlayer = null;
		selectedParent = null;
	}

	function saveData() {
		console.log('저장된 데이터:', {
			화료한사람: selectedPlayer,
			화료방식: mode,
			점수: { ronScore, parentScore, childScore }
		});
		closeModal();
	}

	$: playersList = $players;
</script>

<main class="flex min-h-screen flex-col items-center bg-gray-100">
	<h1 class="mb-6 text-center text-xl font-bold text-gray-800">화료한 사람</h1>

	<!-- 화료한 사람 버튼 -->
	<div class="flex space-x-4">
		{#each Object.values(playersList) as name}
			<button
				class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => openModal(name)}
			>
				{name}
			</button>
		{/each}
	</div>

	<!-- 모달 -->
	{#if $modalOpen}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-4 text-lg font-bold">화료 정보 입력 ({selectedPlayer})</h2>

				<!-- 화료 방식 -->
				<div class="mb-4 flex space-x-4">
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

				<!-- 론 방식 -->
				{#if mode === '론'}
					<h3 class="text-md mb-2 font-semibold">방총자</h3>
					<div class="mb-4 flex space-x-4">
						{#each excludedPlayers as player}
							<button
								class={`rounded-lg px-4 py-2 ${
									selectedRonPlayer === player
										? 'bg-green-500 text-white'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								}`}
								on:click={() => (selectedRonPlayer = player)}
							>
								{player}
							</button>
						{/each}
					</div>
					<label class="mb-4 block">
						<span class="text-gray-700">점수</span>
						<input
							type="number"
							class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							bind:value={ronScore}
						/>
					</label>
				{/if}

				<!-- 쯔모 방식 -->
				{#if mode === '쯔모'}
					<h3 class="text-md mb-2 font-semibold">오야 선택</h3>
					<div class="mb-4 flex space-x-4">
						{#each Object.values(playersList) as player}
							<button
								class={`rounded-lg px-4 py-2 ${
									selectedParent === player
										? 'bg-green-500 text-white'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								}`}
								on:click={() => (selectedParent = player)}
							>
								{player}
							</button>
						{/each}
					</div>
					<!-- 분기 처리 -->
					{#if selectedPlayer === selectedParent}
						<label class="mb-4 block">
							<span class="text-gray-700">점수 (올)</span>
							<input
								type="number"
								class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								bind:value={parentScore}
							/>
						</label>
					{:else}
						<label class="mb-4 block">
							<span class="text-gray-700">점수 (오야)</span>
							<input
								type="number"
								class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								bind:value={parentScore}
							/>
						</label>
						<label class="mb-4 block">
							<span class="text-gray-700">점수 (코)</span>
							<input
								type="number"
								class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								bind:value={childScore}
							/>
						</label>
					{/if}
				{/if}

				<!-- 확인 버튼 -->
				<div class="flex justify-end space-x-4">
					<button
						class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
						on:click={closeModal}
					>
						취소
					</button>
					<button
						class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						on:click={saveData}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>
