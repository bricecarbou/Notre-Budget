import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useIncomeTemplates,
  useUpdateIncomeTemplate,
  useDeleteIncomeTemplate,
} from "@/hooks/useIncomeTemplates";
import { IncomeTemplateFormModal } from "./IncomeTemplateFormModal";
import type { IncomeTemplate } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function IncomeTemplatesList() {
  const { data: templates = [], isLoading } = useIncomeTemplates();
  const updateTemplate = useUpdateIncomeTemplate();
  const deleteTemplate = useDeleteIncomeTemplate();
  const [editing, setEditing] = useState<IncomeTemplate | null | "new">(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-400">Revenus récurrents</h2>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {isLoading && <p className="py-4 text-sm text-slate-500">Chargement...</p>}
      {!isLoading && templates.length === 0 && (
        <p className="py-4 text-sm text-slate-500">Aucun revenu récurrent.</p>
      )}

      <ul className="divide-y divide-slate-800">
        {templates.map((t) => (
          <li key={t.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2 font-medium">
                {t.label}
                {!t.active && (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    Inactif
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {formatEuros(t.amount)} · le {t.dayOfMonth} du mois
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateTemplate.mutate({ id: t.id, active: !t.active })}
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                  t.active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                {t.active ? "Actif" : "Inactif"}
              </button>
              <button
                onClick={() => setEditing(t)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800"
                aria-label="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => deleteTemplate.mutate(t.id)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing !== null && (
        <IncomeTemplateFormModal
          template={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
