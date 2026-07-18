import { useState } from "react";
import { X } from "lucide-react";
import { useCreateIncomeTemplate, useUpdateIncomeTemplate } from "@/hooks/useIncomeTemplates";
import type { IncomeTemplate } from "@/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function IncomeTemplateFormModal({
  template,
  onClose,
}: {
  template: IncomeTemplate | null;
  onClose: () => void;
}) {
  const isEdit = template !== null;
  const createTemplate = useCreateIncomeTemplate();
  const updateTemplate = useUpdateIncomeTemplate();

  const [label, setLabel] = useState(template?.label ?? "");
  const [amount, setAmount] = useState(template ? String(template.amount) : "");
  const [dayOfMonth, setDayOfMonth] = useState(template ? String(template.dayOfMonth) : "1");
  const [startDate, setStartDate] = useState(template?.startDate.slice(0, 10) ?? todayISO());
  const [endDate, setEndDate] = useState(template?.endDate?.slice(0, 10) ?? "");

  const pending = createTemplate.isPending || updateTemplate.isPending;
  const error = createTemplate.error || updateTemplate.error;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = {
      label,
      amount: Number(amount),
      dayOfMonth: Number(dayOfMonth),
      startDate,
      endDate: endDate || null,
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
        className="w-full max-w-sm rounded-2xl bg-white p-5 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Modifier le revenu récurrent" : "Nouveau revenu récurrent"}
          </h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Libellé"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required
          />
          <label className="text-xs text-slate-500">Jour du mois</label>
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required
          />
          <label className="text-xs text-slate-500">Date de début</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required
          />
          <label className="text-xs text-slate-500">Date de fin (optionnel)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
          />

          {error && <p className="text-sm text-red-500">Impossible d'enregistrer.</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
