import { create } from "zustand";
import type { QueuedItem } from "@/lib/offlineQueue";

interface OfflineQueueState {
  items: QueuedItem[];
  setItems: (items: QueuedItem[]) => void;
}

export const useOfflineQueueStore = create<OfflineQueueState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
