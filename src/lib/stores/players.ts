import { writable } from 'svelte/store';

export interface Players {
  east: string;
  south: string;
  west: string;
  north: string;
}

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }
  return defaultValue;
}

const initialPlayers: Players = getStoredData('players', {
  east: '',
  south: '',
  west: '',
  north: '',
});

export const players = writable<Players>(initialPlayers);

players.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('players', JSON.stringify(value));
  }
});
