import { useState } from "react";
import { useMonthStore } from "@/store/monthStore";
import { useMonthlyTrend, useByCategory } from "@/hooks/useAnalytics";
import { MonthSelector } from "@/components/MonthSelector";
import { ResteAVivreTrendChart } from "@/components/analytics/ResteAVivreTrendChart";
import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { CategoryBreakdownTable } from "@/components/analytics/CategoryBreakdownTable";

const RANGES = [3, 6, 12] as const;

export function Analytics() {
  const [months, setMonths] = useState<(typeof RANGES)[number]>(6);
  const { year, month } = useMonthStore();

  const { data: trend, isLoading: trendLoading } = useMonthlyTrend(months);
  const { data: breakdown = [], isLoading: breakdownLoading } = useByCategory(year, month);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Analyses</h1>

      <section className="rounded-2xl bg-white p-4 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Évolution du reste à vivre
          </h2>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setMonths(r)}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  months === r ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {r}m
              </button>
            ))}
          </div>
        </div>

        {trendLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
        {trend && <ResteAVivreTrendChart data={trend} />}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Répartition par catégorie
        </h2>
        <MonthSelector />

        {breakdownLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
        {!breakdownLoading && (
          <>
            <CategoryBreakdownChart breakdown={breakdown} />
            <CategoryBreakdownTable breakdown={breakdown} />
          </>
        )}
      </section>
    </div>
  );
}
