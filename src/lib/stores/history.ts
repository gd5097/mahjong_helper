import { writable } from 'svelte/store';

// History 항목의 타입
export type HistoryEntry = {
  type: '론' | '쯔모' | '유국';
  message: string;
  timestamp: number;
};

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }
  return defaultValue;
}

// History store
export const history = writable<HistoryEntry[]>(
  getStoredData('history', [])
);

history.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('history', JSON.stringify(value));
  }
});
