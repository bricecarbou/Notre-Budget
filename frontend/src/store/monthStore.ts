import { create } from "zustand";

interface MonthState {
  year: number;
  month: number; // 1-12
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

const now = new Date();

export const useMonthStore = create<MonthState>((set) => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  goToPreviousMonth: () =>
    set((state) => {
      const month = state.month === 1 ? 12 : state.month - 1;
      const year = state.month === 1 ? state.year - 1 : state.year;
      return { year, month };
    }),
  goToNextMonth: () =>
    set((state) => {
      const month = state.month === 12 ? 1 : state.month + 1;
      const year = state.month === 12 ? state.year + 1 : state.year;
      return { year, month };
    }),
  goToCurrentMonth: () =>
    set({ year: now.getFullYear(), month: now.getMonth() + 1 }),
}));
