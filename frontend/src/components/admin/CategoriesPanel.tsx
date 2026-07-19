import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  useCategories,
  useDeleteCategory,
  useCreateSubcategory,
  useDeleteSubcategory,
} from "@/hooks/useCategories";
import { CategoryFormModal } from "./CategoryFormModal";
import { CategoryIcon } from "@/lib/categoryIcon";
import type { Category } from "@/types";

function SubcategoryAddRow({ categoryId }: { categoryId: string }) {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const createSubcategory = useCreateSubcategory();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createSubcategory.mutateAsync({ categoryId, name: name.trim() });
    setName("");
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400"
      >
        <Plus size={12} /> Ajouter une sous-catégorie
      </button>
    );
  }

  return (
    <form onSubmit={handleAdd} className="flex items-center gap-2">
      <input
        autoFocus
        type="text"
        placeholder="Nom de la sous-catégorie"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg bg-slate-100 p-2 text-base outline-none dark:bg-slate-900"
      />
      <button type="submit" className="text-xs font-semibold text-blue-400">
        Ajouter
      </button>
      <button
        type="button"
        onClick={() => setShowForm(false)}
        aria-label="Annuler"
        className="text-slate-500"
      >
        <X size={14} />
      </button>
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const deleteCategory = useDeleteCategory();
  const deleteSubcategory = useDeleteSubcategory();

  function handleDeleteCategory() {
    if (
      window.confirm(
        `Supprimer "${category.name}" ? Les dépenses existantes seront réaffectées à "Autres".`
      )
    ) {
      deleteCategory.mutate(category.id);
    }
  }

  return (
    <li className="py-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-left"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <CategoryIcon icon={category.icon} color={category.color} size={14} />
          <span className="font-medium">{category.name}</span>
          {category.isDefault && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              protégée
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Modifier"
          >
            <Pencil size={16} />
          </button>
          {!category.isDefault && (
            <button
              onClick={handleDeleteCategory}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="ml-6 mt-2 flex flex-col gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
          {category.subcategories.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">{sub.name}</span>
              <button
                onClick={() => {
                  if (window.confirm(`Supprimer la sous-catégorie "${sub.name}" ?`)) {
                    deleteSubcategory.mutate(sub.id);
                  }
                }}
                className="text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Supprimer la sous-catégorie"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <SubcategoryAddRow categoryId={category.id} />
        </div>
      )}

      {editing && <CategoryFormModal category={category} onClose={() => setEditing(false)} />}
    </li>
  );
}

export function CategoriesPanel() {
  const { data: categories = [], isLoading } = useCategories();
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Catégories</h2>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus size={14} /> Nouvelle catégorie
        </button>
      </div>

      {isLoading && <p className="py-4 text-sm text-slate-500">Chargement...</p>}

      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </ul>

      {creating && <CategoryFormModal category={null} onClose={() => setCreating(false)} />}
    </div>
  );
}
