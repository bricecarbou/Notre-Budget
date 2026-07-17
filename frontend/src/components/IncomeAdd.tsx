import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useCreateIncome, useUpdateIncome, useDeleteIncome } from "@/hooks/useIncomes";
import { useCreateIncomeTemplate } from "@/hooks/useIncomeTemplates";

export interface EditableIncome {
  id: string;
  label: string;
  amount: number;
  date: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function IncomeAdd({
  onClose,
  income = null,
}: {
  onClose: () => void;
  income?: EditableIncome | null;
}) {
  const isEdit = income !== null;
  const [recurring, setRecurring] = useState(false);
  const [label, setLabel] = useState(income?.label ?? "");
  const [amount, setAmount] = useState(income ? String(income.amount) : "");
  const [date, setDate] = useState(income?.date.slice(0, 10) ?? todayISO());
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState("");

  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const deleteIncome = useDeleteIncome();
  const createIncomeTemplate = useCreateIncomeTemplate();

  const pending =
    createIncome.isPending ||
    updateIncome.isPending ||
    deleteIncome.isPending ||
    createIncomeTemplate.isPending;
  const error = createIncome.error || updateIncome.error || createIncomeTemplate.error;
  const canSave = label.trim().length > 0 && Number(amount) > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    try {
      if (isEdit) {
        await updateIncome.mutateAsync({ id: income.id, label, amount: Number(amount), date });
      } else if (recurring) {
        await createIncomeTemplate.mutateAsync({
          label,
          amount: Number(amount),
          dayOfMonth: Number(dayOfMonth),
          startDate,
          endDate: endDate || null,
        });
      } else {
        await createIncome.mutateAsync({ label, amount: Number(amount), date });
      }
      onClose();
    } catch {
      // affiché via error
    }
  }

  async function handleDelete() {
    if (!income) return;
    await deleteIncome.mutateAsync(income.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-slate-950 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Modifier le revenu" : "Nouveau revenu"}
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

        {!isEdit && (
          <div className="mb-4 flex gap-2 rounded-xl bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setRecurring(false)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                !recurring ? "bg-blue-500 text-white" : "text-slate-400"
              }`}
            >
              Ponctuel
            </button>
            <button
              type="button"
              onClick={() => setRecurring(true)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                recurring ? "bg-blue-500 text-white" : "text-slate-400"
              }`}
            >
              Récurrent mensuel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Libellé (ex: Salaire)"
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

          {!isEdit && recurring ? (
            <>
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
            </>
          ) : (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-slate-900 p-3 text-base outline-none"
              required
            />
          )}

          {error && (
            <p className="text-sm text-red-500">Impossible d'enregistrer ce revenu.</p>
          )}

          <button
            type="submit"
            disabled={!canSave || pending}
            className="mt-2 rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
