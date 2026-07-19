import { create } from "zustand";

interface MonthState {
  year: number;
  month: number; // 1-12
  initialized: boolean;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: (startDay?: number) => void;
  // À appeler une fois le réglage "début de mois" chargé, pour que le mois
  // affiché par défaut corresponde à la vraie période en cours (ex: le
  // 19 juillet avec un début de mois au 27 est encore dans la période
  // "27 juin → 26 juillet"), pas juste le mois calendaire réel.
  initializeFromStartDay: (startDay: number) => void;
}

function computeCurrentPeriod(startDay: number) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (now.getDate() < startDay) {
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return { year, month };
}

export const useMonthStore = create<MonthState>((set, get) => ({
  ...computeCurrentPeriod(1),
  initialized: false,
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
  goToCurrentMonth: (startDay = 1) => set(computeCurrentPeriod(startDay)),
  initializeFromStartDay: (startDay) => {
    if (get().initialized) return;
    set({ ...computeCurrentPeriod(startDay), initialized: true });
  },
}));
