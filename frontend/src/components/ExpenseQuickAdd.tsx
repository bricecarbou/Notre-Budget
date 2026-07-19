import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/useCreateExpense";
import { CategoryGrid } from "./CategoryGrid";
import type { Category, Subcategory } from "@/types";

export interface EditableExpense {
  id: string;
  amount: number;
  date: string;
  label: string | null;
  categoryId: string;
  subcategoryId: string | null;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseQuickAdd({
  onClose,
  expense = null,
}: {
  onClose: () => void;
  expense?: EditableExpense | null;
}) {
  const isEdit = expense !== null;
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [date, setDate] = useState(expense?.date.slice(0, 10) ?? todayISO());
  const [label, setLabel] = useState(expense?.label ?? "");
  const [prefilled, setPrefilled] = useState(!isEdit);

  useEffect(() => {
    if (prefilled || !expense || categories.length === 0) return;
    const cat = categories.find((c) => c.id === expense.categoryId) ?? null;
    setCategory(cat);
    setSubcategory(cat?.subcategories.find((s) => s.id === expense.subcategoryId) ?? null);
    setPrefilled(true);
  }, [prefilled, expense, categories]);

  const pending = createExpense.isPending || updateExpense.isPending || deleteExpense.isPending;
  const canSave = Number(amount) > 0 && category !== null;

  async function handleSave() {
    if (!canSave || !category) return;
    const input = {
      amount: Number(amount),
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      date,
      label: label || undefined,
    };
    if (isEdit) {
      await updateExpense.mutateAsync({ id: expense.id, ...input });
    } else {
      await createExpense.mutateAsync(input);
    }
    onClose();
  }

  async function handleDelete() {
    if (!expense) return;
    if (!window.confirm("Supprimer cette dépense ?")) return;
    await deleteExpense.mutateAsync(expense.id);
    onClose();
  }

  function handleSelectCategory(c: Category) {
    setCategory(c);
    setSubcategory(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Modifier la dépense" : "Nouvelle dépense"}
          </h2>
          <div className="flex items-center gap-3">
            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={pending}
                aria-label="Supprimer"
                className="text-red-400 disabled:opacity-40"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} aria-label="Fermer">
              <X size={22} />
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Libellé (ex: Pain, Restaurant, Péage...)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mb-3 w-full rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
        />

        <input
          type="number"
          inputMode="decimal"
          autoFocus={!isEdit}
          placeholder="0,00 €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-5 w-full rounded-xl bg-slate-100 p-4 text-center text-3xl font-bold outline-none dark:bg-slate-900"
        />

        <CategoryGrid
          categories={categories}
          selectedId={category?.id ?? null}
          onSelect={handleSelectCategory}
        />

        {category && category.subcategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubcategory(sub)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  subcategory?.id === sub.id
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300"
                    : "border-slate-300 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave || pending}
          className="mt-5 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
