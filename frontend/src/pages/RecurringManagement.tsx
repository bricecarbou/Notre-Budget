import { useState } from "react";
import { IncomeTemplatesList } from "@/components/recurring/IncomeTemplatesList";
import { ExpenseTemplatesList } from "@/components/recurring/ExpenseTemplatesList";

type Tab = "incomes" | "expenses";

export function RecurringManagement() {
  const [tab, setTab] = useState<Tab>("expenses");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Récurrents</h1>

      <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        <button
          onClick={() => setTab("expenses")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            tab === "expenses" ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Dépenses
        </button>
        <button
          onClick={() => setTab("incomes")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            tab === "incomes" ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Revenus
        </button>
      </div>

      {tab === "expenses" ? <ExpenseTemplatesList /> : <IncomeTemplatesList />}
    </div>
  );
}
