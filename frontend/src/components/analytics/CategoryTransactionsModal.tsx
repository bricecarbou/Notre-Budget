import { useState } from "react";
import { X } from "lucide-react";
import { useCategoryTransactions } from "@/hooks/useAnalytics";
import { useSettings } from "@/hooks/useSettings";
import { CategoryIcon } from "@/lib/categoryIcon";
import { getDisplayPeriod } from "@/lib/periodLabel";
import { ExpenseQuickAdd, type EditableExpense } from "@/components/ExpenseQuickAdd";
import type { CategoryBreakdown } from "@/types";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function CategoryTransactionsModal({
  category,
  year,
  month,
  months,
  onClose,
}: {
  category: CategoryBreakdown;
  year: number;
  month: number;
  months: number;
  onClose: () => void;
}) {
  const { data, isLoading } = useCategoryTransactions(category.categoryId, year, month, months);
  const { data: settings } = useSettings();
  const startDay = settings?.monthStartDay ?? 1;
  const [editingExpense, setEditingExpense] = useState<EditableExpense | null>(null);

  const isEmpty =
    data && data.expenses.length === 0 && data.recurringOccurrences.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryIcon icon={category.icon} color={category.color} />
            <h2 className="text-lg font-semibold">{category.categoryName}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer">
            <X size={22} />
          </button>
        </div>

        {isLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
        {isEmpty && (
          <p className="py-8 text-center text-sm text-slate-500">
            Aucune transaction sur cette période.
          </p>
        )}

        {data && data.expenses.length > 0 && (
          <>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dépenses ponctuelles
            </h3>
            <ul className="mb-4 divide-y divide-slate-200 dark:divide-slate-800">
              {data.expenses.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() =>
                      setEditingExpense({
                        id: e.id,
                        amount: e.amount,
                        date: e.date,
                        label: e.label,
                        categoryId: category.categoryId,
                        subcategoryId: e.subcategoryId,
                      })
                    }
                    className="flex w-full items-center justify-between py-2.5 text-left"
                  >
                    <div>
                      <div className="text-sm font-medium">{e.label || category.categoryName}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(e.date).toLocaleDateString("fr-FR")} · {e.createdBy.name}
                        {e.subcategoryName ? ` · ${e.subcategoryName}` : ""}
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatEuros(e.amount)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {data && data.recurringOccurrences.length > 0 && (
          <>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Récurrentes · modifiables depuis l'écran Récurrents
            </h3>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.recurringOccurrences.map((o) => {
                const display = getDisplayPeriod(o.year, o.month, startDay);
                return (
                  <li
                    key={`${o.templateId}-${o.year}-${o.month}`}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div>
                      <div className="text-sm font-medium">{o.label}</div>
                      <div className="text-xs text-slate-500">
                        {MONTH_LABELS[display.month - 1]} {display.year} · le {o.dayOfMonth} du
                        mois
                        {o.subcategoryName ? ` · ${o.subcategoryName}` : ""}
                      </div>
                    </div>
                    <div className="font-semibold text-slate-500">{formatEuros(o.amount)}</div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {editingExpense && (
        <ExpenseQuickAdd expense={editingExpense} onClose={() => setEditingExpense(null)} />
      )}
    </div>
  );
}
