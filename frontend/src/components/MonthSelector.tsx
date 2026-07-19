import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthStore } from "@/store/monthStore";
import { useSettings } from "@/hooks/useSettings";
import { getDisplayPeriod } from "@/lib/periodLabel";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function MonthSelector() {
  const { year, month, goToPreviousMonth, goToNextMonth } = useMonthStore();
  const { data: settings } = useSettings();
  const display = getDisplayPeriod(year, month, settings?.monthStartDay ?? 1);

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <button
        onClick={goToPreviousMonth}
        className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
        aria-label="Mois précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="min-w-[10rem] text-center font-medium">
        {MONTH_LABELS[display.month - 1]} {display.year}
      </span>
      <button
        onClick={goToNextMonth}
        className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
        aria-label="Mois suivant"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
