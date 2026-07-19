import { useState } from "react";
import { X } from "lucide-react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { IconPicker } from "./IconPicker";
import type { Category } from "@/types";

export function CategoryFormModal({
  category,
  onClose,
}: {
  category: Category | null;
  onClose: () => void;
}) {
  const isEdit = category !== null;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");
  const [color, setColor] = useState(category?.color ?? "#3b82f6");

  const pending = createCategory.isPending || updateCategory.isPending;
  const error = createCategory.error || updateCategory.error;
  const locked = isEdit && category.isDefault;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateCategory.mutateAsync({
          id: category.id,
          name: locked ? category.name : name,
          icon: icon || undefined,
          color: color || undefined,
        });
      } else {
        await createCategory.mutateAsync({ name, icon: icon || undefined, color });
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
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={locked}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none disabled:opacity-50 dark:bg-slate-900"
            required
          />
          <label className="-mb-1 text-sm text-slate-500 dark:text-slate-400">Icône</label>
          <IconPicker value={icon} onChange={setIcon} />
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500 dark:text-slate-400">Couleur</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-16 rounded-lg bg-slate-100 dark:bg-slate-900"
            />
          </div>

          {locked && (
            <p className="text-xs text-slate-500">
              La catégorie "Autres" ne peut pas être renommée.
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">Impossible d'enregistrer cette catégorie.</p>
          )}

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
