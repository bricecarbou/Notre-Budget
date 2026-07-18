import type { Dashboard } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function resteAVivreColor(resteActuel: number, totalRevenus: number) {
  if (resteActuel < 0) return "text-red-500";
  if (totalRevenus > 0 && resteActuel < totalRevenus * 0.2) return "text-orange-400";
  return "text-emerald-400";
}

export function BudgetSummaryCard({ dashboard }: { dashboard: Dashboard }) {
  const {
    totalRevenus,
    totalDepensesRecurrentes,
    resteAVivreInitial,
    resteAVivreActuel,
  } = dashboard;

  const progressPct =
    resteAVivreInitial > 0
      ? Math.max(0, Math.min(100, (resteAVivreActuel / resteAVivreInitial) * 100))
      : 0;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div>
          <div>Revenus du mois</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatEuros(totalRevenus)}
          </div>
        </div>
        <div>
          <div>Dépenses récurrentes</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatEuros(totalDepensesRecurrentes)}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-slate-500 dark:text-slate-400">Reste à vivre</div>
        <div
          className={`text-4xl font-bold ${resteAVivreColor(resteAVivreActuel, totalRevenus)}`}
        >
          {formatEuros(resteAVivreActuel)}
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatEuros(resteAVivreActuel)} actuel</span>
          <span>{formatEuros(resteAVivreInitial)} initial</span>
        </div>
      </div>
    </div>
  );
}
