import { writable } from 'svelte/store';

export interface Players {
  east: string;
  south: string;
  west: string;
  north: string;
}

const initialPlayers: Players = {
  east: '',
  south: '',
  west: '',
  north: '',
};

export const players = writable<Players>(initialPlayers);
