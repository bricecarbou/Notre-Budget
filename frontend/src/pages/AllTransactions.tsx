import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMonthStore } from "@/store/monthStore";
import { useTransactions } from "@/hooks/useTransactions";
import { usePaginatedFilter } from "@/hooks/usePaginatedFilter";
import { MonthSelector } from "@/components/MonthSelector";
import { TransactionsList } from "@/components/TransactionsList";
import { PaginationControls } from "@/components/PaginationControls";
import { IncomeAdd, type EditableIncome } from "@/components/IncomeAdd";
import { ExpenseQuickAdd, type EditableExpense } from "@/components/ExpenseQuickAdd";
import type { Transaction } from "@/types";

const RANGES = [
  { label: "Mois", months: 1 },
  { label: "3 mois", months: 3 },
  { label: "6 mois", months: 6 },
  { label: "1 an", months: 12 },
] as const;

type TypeFilter = "all" | "expense" | "income";

export function AllTransactions() {
  const { year, month } = useMonthStore();
  const [months, setMonths] = useState<(typeof RANGES)[number]["months"]>(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [editingExpense, setEditingExpense] = useState<EditableExpense | null>(null);
  const [editingIncome, setEditingIncome] = useState<EditableIncome | null>(null);

  const { data: transactions = [], isLoading } = useTransactions(year, month, months);

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const t of transactions) {
      if (t.category) seen.set(t.category.id, t.category.name);
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (categoryFilter && t.category?.id !== categoryFilter) return false;
      return true;
    });
  }, [transactions, typeFilter, categoryFilter]);

  const { search, setSearch, pageSize, setPageSize, page, setPage, totalPages, totalResults, paginated } =
    usePaginatedFilter({
      items: filtered,
      searchFields: (t) => [t.label ?? "", t.category?.name ?? ""],
    });

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
      <h1 className="mb-4 text-xl font-semibold">Toutes les transactions</h1>

      <MonthSelector />

      <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
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

      <div className="mb-3 flex flex-col gap-2">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher (libellé, catégorie)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-3 text-base outline-none dark:bg-slate-900"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TypeFilter);
              setPage(1);
            }}
            className="flex-1 rounded-xl bg-slate-100 p-2 text-sm outline-none dark:bg-slate-900"
          >
            <option value="all">Dépenses et revenus</option>
            <option value="expense">Dépenses seulement</option>
            <option value="income">Revenus seulement</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-xl bg-slate-100 p-2 text-sm outline-none dark:bg-slate-900"
          >
            <option value="">Toutes les catégories</option>
            {categoryOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>}
      {!isLoading && totalResults === 0 && (
        <p className="py-8 text-center text-sm text-slate-500">
          Aucune transaction pour ces critères.
        </p>
      )}

      <TransactionsList transactions={paginated} onSelectTransaction={handleSelectTransaction} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {editingExpense && (
        <ExpenseQuickAdd expense={editingExpense} onClose={() => setEditingExpense(null)} />
      )}
      {editingIncome && (
        <IncomeAdd income={editingIncome} onClose={() => setEditingIncome(null)} />
      )}
    </div>
  );
}
