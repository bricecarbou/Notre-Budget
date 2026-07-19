import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  useExpenseTemplates,
  useUpdateExpenseTemplate,
  useDeleteExpenseTemplate,
} from "@/hooks/useExpenseTemplates";
import { usePaginatedFilter } from "@/hooks/usePaginatedFilter";
import { useAuthStore } from "@/store/authStore";
import { CategoryIcon } from "@/lib/categoryIcon";
import { PaginationControls } from "@/components/PaginationControls";
import { ExpenseTemplateFormModal } from "./ExpenseTemplateFormModal";
import type { ExpenseTemplate } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

type ActiveFilter = "all" | "active" | "inactive";

export function ExpenseTemplatesList() {
  const { data: templates = [], isLoading } = useExpenseTemplates();
  const updateTemplate = useUpdateExpenseTemplate();
  const deleteTemplate = useDeleteExpenseTemplate();
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const [editing, setEditing] = useState<ExpenseTemplate | null | "new">(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const t of templates) {
      if (t.category) seen.set(t.category.id, t.category.name);
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [templates]);

  const filteredByDropdowns = useMemo(() => {
    return templates.filter((t) => {
      if (categoryFilter && t.categoryId !== categoryFilter) return false;
      if (activeFilter === "active" && !t.active) return false;
      if (activeFilter === "inactive" && t.active) return false;
      return true;
    });
  }, [templates, categoryFilter, activeFilter]);

  const {
    search,
    setSearch,
    pageSize,
    setPageSize,
    page,
    setPage,
    totalPages,
    totalResults,
    paginated,
  } = usePaginatedFilter({
    items: filteredByDropdowns,
    searchFields: (t) => [t.label, t.category?.name ?? ""],
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Dépenses récurrentes</h2>
        {!isAdmin && (
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Plus size={14} /> Ajouter
          </button>
        )}
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
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value as ActiveFilter);
              setPage(1);
            }}
            className="flex-1 rounded-xl bg-slate-100 p-2 text-sm outline-none dark:bg-slate-900"
          >
            <option value="all">Actifs et inactifs</option>
            <option value="active">Actifs seulement</option>
            <option value="inactive">Inactifs seulement</option>
          </select>
        </div>
      </div>

      {isLoading && <p className="py-4 text-sm text-slate-500">Chargement...</p>}
      {!isLoading && templates.length === 0 && (
        <p className="py-4 text-sm text-slate-500">Aucune dépense récurrente.</p>
      )}
      {!isLoading && templates.length > 0 && totalResults === 0 && (
        <p className="py-4 text-sm text-slate-500">Aucun résultat pour ces critères.</p>
      )}

      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {paginated.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <CategoryIcon icon={t.category?.icon} color={t.category?.color} />
            <div className="flex-1">
              <div className="flex items-center gap-2 font-medium">
                {t.label}
                {!t.active && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Inactif
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {formatEuros(t.amount)} · le {t.dayOfMonth} du mois
                {t.category ? ` · ${t.category.name}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    t.active
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {t.active ? "Actif" : "Inactif"}
                </span>
              ) : (
                <>
                  <button
                    onClick={() => updateTemplate.mutate({ id: t.id, active: !t.active })}
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                      t.active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {t.active ? "Actif" : "Inactif"}
                  </button>
                  <button
                    onClick={() => setEditing(t)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer "${t.label}" ?`)) deleteTemplate.mutate(t.id);
                    }}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {editing !== null && (
        <ExpenseTemplateFormModal
          template={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
