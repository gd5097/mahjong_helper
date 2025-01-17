import { writable } from 'svelte/store';

export const initialScore = 25000;

export type Position = 'east' | 'south' | 'west' | 'north';
export type Scores = Record<Position, number>;

export const scores = writable<Scores>({
  east: initialScore,
  south: initialScore,
  west: initialScore,
  north: initialScore,
});

export const potScore = writable(0); // 공탁 점수
export const richPlayers = writable<Position[]>([]); // 리치 체크된 플레이어 목록
