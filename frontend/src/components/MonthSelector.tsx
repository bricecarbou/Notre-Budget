import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthStore } from "@/store/monthStore";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function MonthSelector() {
  const { year, month, goToPreviousMonth, goToNextMonth } = useMonthStore();

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <button
        onClick={goToPreviousMonth}
        className="rounded-full p-2 hover:bg-slate-800"
        aria-label="Mois précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="min-w-[10rem] text-center font-medium">
        {MONTH_LABELS[month - 1]} {year}
      </span>
      <button
        onClick={goToNextMonth}
        className="rounded-full p-2 hover:bg-slate-800"
        aria-label="Mois suivant"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
