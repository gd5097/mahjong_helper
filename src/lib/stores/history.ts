import { writable } from 'svelte/store';

// History 항목의 타입
export type HistoryEntry = {
  type: '론' | '쯔모' | '유국';
  message: string; // 기록 메시지
  timestamp: number; // 기록 시간
};

// History store
export const history = writable<HistoryEntry[]>([]);
