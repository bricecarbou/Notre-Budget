import { Clock, PiggyBank } from "lucide-react";
import { CategoryIcon } from "@/lib/categoryIcon";
import type { Transaction } from "@/types";
import type { PendingTransaction } from "@/hooks/usePendingTransactions";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function isPending(t: Transaction | PendingTransaction): t is PendingTransaction {
  return "pending" in t && t.pending === true;
}

export function TransactionsList({
  transactions,
  onSelectTransaction,
  interactiveOnlyPending = false,
}: {
  transactions: (Transaction | PendingTransaction)[];
  onSelectTransaction?: (t: Transaction) => void;
  // Quand hors ligne : seules les transactions pas encore synchronisées
  // peuvent être touchées (une transaction déjà connue du serveur ne peut
  // pas être modifiée/supprimée sans réseau, pour éviter tout conflit).
  interactiveOnlyPending?: boolean;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Aucune transaction ce mois-ci.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {transactions.map((t) => {
        const pending = isPending(t);
        const clickable = !!onSelectTransaction && (!interactiveOnlyPending || pending);

        const content = (
          <>
            {t.type === "income" ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <PiggyBank size={18} className="text-white" strokeWidth={2.25} />
              </span>
            ) : (
              <CategoryIcon icon={t.category?.icon} color={t.category?.color} />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-medium">
                {t.label || t.category?.name || "Transaction"}
                {pending && (
                  <span className="flex items-center gap-0.5 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-normal text-orange-600 dark:text-orange-400">
                    <Clock size={10} /> En attente
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {new Date(t.date).toLocaleDateString("fr-FR")} · {t.createdBy.name}
                {t.category ? ` · ${t.category.name}` : ""}
              </div>
            </div>
            <div
              className={`font-semibold ${
                t.type === "income"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-900 dark:text-slate-100"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatEuros(t.amount)}
            </div>
          </>
        );

        return (
          <li key={`${t.type}-${t.id}`}>
            {clickable ? (
              <button
                onClick={() => onSelectTransaction?.(t)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                {content}
              </button>
            ) : (
              <div className="flex items-center gap-3 py-3 opacity-60">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
