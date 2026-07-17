import { useState } from "react";
import { X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { CategoryGrid } from "./CategoryGrid";
import type { Category, Subcategory } from "@/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseQuickAdd({ onClose }: { onClose: () => void }) {
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const canSave = Number(amount) > 0 && category !== null;

  async function handleSave() {
    if (!canSave || !category) return;
    await createExpense.mutateAsync({
      amount: Number(amount),
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      date,
      label: note || undefined,
    });
    onClose();
  }

  function handleSelectCategory(c: Category) {
    setCategory(c);
    setSubcategory(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-slate-950 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nouvelle dépense</h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={22} />
          </button>
        </div>

        <input
          type="number"
          inputMode="decimal"
          autoFocus
          placeholder="0,00 €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-5 w-full rounded-xl bg-slate-900 p-4 text-center text-3xl font-bold outline-none"
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
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-slate-800 text-slate-300"
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
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
          />
          <input
            type="text"
            placeholder="Note (optionnel)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave || createExpense.isPending}
          className="mt-5 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
        >
          {createExpense.isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
