import { PiggyBank } from "lucide-react";
import { CategoryIcon } from "@/lib/categoryIcon";
import type { Transaction } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function TransactionsList({
  transactions,
  onSelectTransaction,
}: {
  transactions: Transaction[];
  onSelectTransaction?: (t: Transaction) => void;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Aucune transaction ce mois-ci.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-800">
      {transactions.map((t) => (
        <li key={`${t.type}-${t.id}`}>
          <button
            onClick={() => onSelectTransaction?.(t)}
            className="flex w-full items-center gap-3 py-3 text-left"
          >
            {t.type === "income" ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <PiggyBank size={18} className="text-white" strokeWidth={2.25} />
              </span>
            ) : (
              <CategoryIcon icon={t.category?.icon} color={t.category?.color} />
            )}

            <div className="flex-1">
              <div className="font-medium">
                {t.label || t.category?.name || "Transaction"}
              </div>
              <div className="text-xs text-slate-500">
                {new Date(t.date).toLocaleDateString("fr-FR")} · {t.createdBy.name}
                {t.category ? ` · ${t.category.name}` : ""}
              </div>
            </div>
            <div
              className={`font-semibold ${
                t.type === "income" ? "text-emerald-400" : "text-slate-100"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatEuros(t.amount)}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
