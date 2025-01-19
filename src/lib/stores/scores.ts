import { writable } from 'svelte/store';

export const initialScore = 25000;

export type Position = 'east' | 'south' | 'west' | 'north';
export type Scores = Record<Position, number>;

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }
  return defaultValue;
}

export const scores = writable<Scores>(
  getStoredData('scores', {
    east: initialScore,
    south: initialScore,
    west: initialScore,
    north: initialScore,
  })
);

export const potScore = writable<number>(getStoredData('potScore', 0));

export const richPlayers = writable<Position[]>(
  getStoredData('richPlayers', [])
);

scores.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('scores', JSON.stringify(value));
  }
});

potScore.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('potScore', JSON.stringify(value));
  }
});

richPlayers.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('richPlayers', JSON.stringify(value));
  }
});
