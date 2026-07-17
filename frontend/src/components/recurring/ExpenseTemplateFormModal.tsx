import { useState } from "react";
import { X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateExpenseTemplate,
  useUpdateExpenseTemplate,
} from "@/hooks/useExpenseTemplates";
import type { ExpenseTemplate } from "@/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseTemplateFormModal({
  template,
  onClose,
}: {
  template: ExpenseTemplate | null;
  onClose: () => void;
}) {
  const isEdit = template !== null;
  const { data: categories = [] } = useCategories();
  const createTemplate = useCreateExpenseTemplate();
  const updateTemplate = useUpdateExpenseTemplate();

  const [label, setLabel] = useState(template?.label ?? "");
  const [amount, setAmount] = useState(template ? String(template.amount) : "");
  const [dayOfMonth, setDayOfMonth] = useState(template ? String(template.dayOfMonth) : "1");
  const [startDate, setStartDate] = useState(template?.startDate.slice(0, 10) ?? todayISO());
  const [endDate, setEndDate] = useState(template?.endDate?.slice(0, 10) ?? "");
  const [categoryId, setCategoryId] = useState(template?.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = useState(template?.subcategoryId ?? "");

  const pending = createTemplate.isPending || updateTemplate.isPending;
  const error = createTemplate.error || updateTemplate.error;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) return;
    const input = {
      label,
      amount: Number(amount),
      dayOfMonth: Number(dayOfMonth),
      startDate,
      endDate: endDate || null,
      categoryId,
      subcategoryId: subcategoryId || undefined,
    };
    try {
      if (isEdit) {
        await updateTemplate.mutateAsync({ id: template.id, ...input });
      } else {
        await createTemplate.mutateAsync(input);
      }
      onClose();
    } catch {
      // affiché via error
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-slate-950 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Modifier la dépense récurrente" : "Nouvelle dépense récurrente"}
          </h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Libellé (ex: Assurance Maison)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            required
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            required
          />

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            required
          >
            <option value="" disabled>
              Choisir une catégorie
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {selectedCategory && selectedCategory.subcategories.length > 0 && (
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            >
              <option value="">Sans sous-catégorie</option>
              {selectedCategory.subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <label className="text-xs text-slate-500">Jour du mois</label>
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            required
          />
          <label className="text-xs text-slate-500">Date de début</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
            required
          />
          <label className="text-xs text-slate-500">Date de fin (optionnel)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl bg-slate-900 p-3 text-base outline-none"
          />

          {error && <p className="text-sm text-red-500">Impossible d'enregistrer.</p>}

          <button
            type="submit"
            disabled={pending || !categoryId}
            className="mt-2 rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
