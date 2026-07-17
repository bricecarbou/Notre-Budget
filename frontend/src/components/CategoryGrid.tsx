import * as LucideIcons from "lucide-react";
import { Tag, type LucideIcon } from "lucide-react";
import type { Category } from "@/types";

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Tag;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Tag;
}

export function CategoryGrid({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: string | null;
  onSelect: (category: Category) => void;
}) {
  const sorted = [
    ...categories.filter((c) => !c.isDefault),
    ...categories.filter((c) => c.isDefault),
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {sorted.map((category) => {
        const Icon = resolveIcon(category.icon);
        const selected = category.id === selectedId;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs ${
              selected
                ? "border-blue-500 bg-blue-500/10 text-blue-300"
                : "border-slate-800 bg-slate-900 text-slate-300"
            }`}
          >
            <Icon size={20} style={category.color ? { color: category.color } : undefined} />
            <span className="line-clamp-1 text-center">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
