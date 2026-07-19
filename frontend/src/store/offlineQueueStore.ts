import { create } from "zustand";

interface OfflineQueueState {
  count: number;
  setCount: (count: number) => void;
}

export const useOfflineQueueStore = create<OfflineQueueState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));
