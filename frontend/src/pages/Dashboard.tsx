import { useState } from "react";
import { Plus } from "lucide-react";
import { useMonthStore } from "@/store/monthStore";
import { useDashboard } from "@/hooks/useDashboard";
import { MonthSelector } from "@/components/MonthSelector";
import { BudgetSummaryCard } from "@/components/BudgetSummaryCard";
import { TransactionsList } from "@/components/TransactionsList";
import { IncomeAdd } from "@/components/IncomeAdd";

export function Dashboard() {
  const { year, month } = useMonthStore();
  const { data: dashboard, isLoading, isError } = useDashboard(year, month);
  const [showIncomeAdd, setShowIncomeAdd] = useState(false);

  return (
    <div>
      <MonthSelector />

      {isLoading && <p className="py-8 text-center text-slate-500">Chargement...</p>}
      {isError && (
        <p className="py-8 text-center text-red-500">Impossible de charger le dashboard.</p>
      )}

      {dashboard && (
        <>
          <BudgetSummaryCard dashboard={dashboard} />

          <button
            onClick={() => setShowIncomeAdd(true)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-700 py-2 text-sm text-slate-400"
          >
            <Plus size={16} /> Ajouter un revenu
          </button>

          <h2 className="mb-2 mt-6 text-sm font-medium text-slate-400">
            Dernières transactions
          </h2>
          <TransactionsList transactions={dashboard.transactionsRecentes} />
        </>
      )}

      {showIncomeAdd && <IncomeAdd onClose={() => setShowIncomeAdd(false)} />}
    </div>
  );
}
