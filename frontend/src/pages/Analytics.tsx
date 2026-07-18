import { useState } from "react";
import { useMonthStore } from "@/store/monthStore";
import { useMonthlyTrend, useByCategory } from "@/hooks/useAnalytics";
import { MonthSelector } from "@/components/MonthSelector";
import { ExpensesTrendChart } from "@/components/analytics/ExpensesTrendChart";
import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { CategoryBreakdownTable } from "@/components/analytics/CategoryBreakdownTable";

const RANGES = [
  { label: "Mois", months: 1 },
  { label: "3 mois", months: 3 },
  { label: "6 mois", months: 6 },
  { label: "1 an", months: 12 },
] as const;

export function Analytics() {
  const [months, setMonths] = useState<(typeof RANGES)[number]["months"]>(1);
  const { year, month } = useMonthStore();

  const { data: breakdown = [], isLoading: breakdownLoading } = useByCategory(year, month, months);
  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(months, year, month);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Analyses</h1>

      <MonthSelector />

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setMonths(r.months)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium ${
              months === r.months ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Répartition par catégorie
          {months > 1 && <span> · {RANGES.find((r) => r.months === months)?.label}</span>}
        </h2>

        {breakdownLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
        {!breakdownLoading && (
          <>
            <CategoryBreakdownChart breakdown={breakdown} />
            <CategoryBreakdownTable breakdown={breakdown} />
          </>
        )}
      </section>

      {months > 1 && (
        <section className="mt-6 rounded-2xl bg-white p-4 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Évolution des dépenses
          </h2>
          {trendLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
          {trend && <ExpensesTrendChart data={trend} />}
        </section>
      )}
    </div>
  );
}
