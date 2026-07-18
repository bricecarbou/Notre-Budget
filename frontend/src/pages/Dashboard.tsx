import { useState } from "react";
import { Plus } from "lucide-react";
import { useMonthStore } from "@/store/monthStore";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { MonthSelector } from "@/components/MonthSelector";
import { BudgetSummaryCard } from "@/components/BudgetSummaryCard";
import { TransactionsList } from "@/components/TransactionsList";
import { IncomeAdd, type EditableIncome } from "@/components/IncomeAdd";
import { ExpenseQuickAdd, type EditableExpense } from "@/components/ExpenseQuickAdd";
import type { Transaction } from "@/types";

export function Dashboard() {
  const { year, month } = useMonthStore();
  const { data: dashboard, isLoading, isError } = useDashboard(year, month);
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const [showIncomeAdd, setShowIncomeAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState<EditableExpense | null>(null);
  const [editingIncome, setEditingIncome] = useState<EditableIncome | null>(null);

  function handleSelectTransaction(t: Transaction) {
    if (t.type === "expense" && t.category) {
      setEditingExpense({
        id: t.id,
        amount: t.amount,
        date: t.date,
        label: t.label,
        categoryId: t.category.id,
        subcategoryId: t.subcategory?.id ?? null,
      });
    } else if (t.type === "income") {
      setEditingIncome({ id: t.id, label: t.label ?? "", amount: t.amount, date: t.date });
    }
  }

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

          {!isAdmin && (
            <button
              onClick={() => setShowIncomeAdd(true)}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 py-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              <Plus size={16} /> Ajouter un revenu
            </button>
          )}

          <h2 className="mb-2 mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            Dernières transactions
          </h2>
          <p className="mb-2 text-xs text-slate-500">
            Touchez une transaction pour la modifier ou la supprimer.
          </p>
          <TransactionsList
            transactions={dashboard.transactionsRecentes}
            onSelectTransaction={handleSelectTransaction}
          />
        </>
      )}

      {showIncomeAdd && <IncomeAdd onClose={() => setShowIncomeAdd(false)} />}
      {editingExpense && (
        <ExpenseQuickAdd expense={editingExpense} onClose={() => setEditingExpense(null)} />
      )}
      {editingIncome && (
        <IncomeAdd income={editingIncome} onClose={() => setEditingIncome(null)} />
      )}
    </div>
  );
}
