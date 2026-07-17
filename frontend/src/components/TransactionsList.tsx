import type { Transaction } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
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
        <li key={`${t.type}-${t.id}`} className="flex items-center justify-between py-3">
          <div>
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
        </li>
      ))}
    </ul>
  );
}
