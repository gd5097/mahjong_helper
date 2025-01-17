<script lang="ts">
	import { players } from '../../stores/players';
	import { writable } from 'svelte/store';

	const initialScore = 25000;

	type Position = 'east' | 'south' | 'west' | 'north';
	type Scores = Record<Position, number>;

	let scores = writable<Scores>({
		east: initialScore,
		south: initialScore,
		west: initialScore,
		north: initialScore
	});

	const modalOpen = writable(false);
	let selectedPlayer: Position | null = null; // 화료한 사람
	let mode: '론' | '쯔모' | null = null; // 화료 방식
	let excludedPlayers: Position[] = []; // 방총자 선택 시 제외할 플레이어
	let ronScore = ''; // 론 방식 점수
	let parentScore = ''; // 쯔모 방식: 오야 점수
	let childScore = ''; // 쯔모 방식: 코 점수
	let selectedRonPlayer: Position | null = null; // 방총자 선택
	let selectedParent: Position | null = null; // 오야 선택

	function openModal(player: Position) {
		selectedPlayer = player;
		excludedPlayers = (Object.keys($scores) as Position[]).filter((p) => p !== player);
		modalOpen.set(true);
	}

	function closeModal() {
		modalOpen.set(false);
		selectedPlayer = null;
		mode = null;
		selectedRonPlayer = null;
		selectedParent = null;
	}

	function updateScores() {
		scores.update((currentScores) => {
			const ronPoints = Number(ronScore) || 0;
			const parentPoints = Number(parentScore) || 0;
			const childPoints = Number(childScore) || 0;

			if (mode === '론' && selectedRonPlayer && selectedPlayer) {
				// 론: 방총자 점수 차감, 화료한 사람 점수 증가
				currentScores[selectedRonPlayer] -= ronPoints;
				currentScores[selectedPlayer] += ronPoints;

				console.log(`방총자(${selectedRonPlayer}) 점수: ${currentScores[selectedRonPlayer]}`);
				console.log(`화료자(${selectedPlayer}) 점수: ${currentScores[selectedPlayer]}`);
				console.log(`론 점수: ${ronPoints}`);
			} else if (mode === '쯔모' && selectedPlayer) {
				if (selectedPlayer === selectedParent) {
					// 쯔모: 화료한 사람이 오야인 경우
					const totalPoints = parentPoints * 3;
					Object.keys(currentScores).forEach((key) => {
						const positionKey = key as Position;
						if (positionKey === selectedPlayer) {
							currentScores[positionKey] += totalPoints;
						} else {
							currentScores[positionKey] -= parentPoints;
						}
					});

					console.log(`쯔모(오야) 점수 업데이트 완료`);
				} else if (selectedParent) {
					// 쯔모: 오야가 화료한 사람이 아닌 경우
					Object.keys(currentScores).forEach((key) => {
						const positionKey = key as Position;
						if (positionKey === selectedParent) {
							currentScores[positionKey] -= parentPoints; // 오야 점수 차감
						} else if (positionKey === selectedPlayer) {
							currentScores[positionKey] += parentPoints + childPoints * 2; // 화료한 사람 점수 증가
						} else {
							currentScores[positionKey] -= childPoints; // 다른 사람 점수 차감
						}
					});

					console.log(`쯔모(비오야) 점수 업데이트 완료`);
				}
			}
			return currentScores;
		});
		closeModal();
	}

	$: playersList = $players;
	$: currentScores = $scores;
</script>

<main class="flex min-h-screen flex-col items-center bg-gray-100">
	<!-- 점수 표시 -->
	<div class="mb-8 grid grid-cols-2 gap-4">
		{#each Object.entries(playersList) as [position, name]}
			<div class="flex flex-col items-center">
				<span class="text-lg font-semibold">{name}</span>
				<span class="text-xl font-bold text-blue-500">{$scores[position as Position]}점</span>
			</div>
		{/each}
	</div>

	<!-- 화료 텍스트 -->
	<h2 class="mb-4 text-lg font-bold text-gray-800">화료</h2>

	<!-- 화료한 사람 버튼 -->
	<div class="flex space-x-4">
		{#each Object.keys($scores) as position}
			<button
				class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => openModal(position as Position)}
			>
				{playersList[position as Position]}
			</button>
		{/each}
	</div>

	<!-- 모달 -->
	{#if $modalOpen}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-4 text-lg font-bold">
					화료 정보 입력 {playersList[selectedPlayer!] || ''}
				</h2>

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
								{playersList[player]}
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
						{#each Object.keys($scores) as position}
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
						on:click={updateScores}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>
