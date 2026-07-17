import * as LucideIcons from "lucide-react";
import { Tag, type LucideIcon } from "lucide-react";
import type { Category } from "@/types";

const FALLBACK_COLOR = "#64748b";

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Tag;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Tag;
}

function withAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
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
        const color = category.color ?? FALLBACK_COLOR;
        const selected = category.id === selectedId;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            style={{
              backgroundColor: withAlpha(color, selected ? 0.22 : 0.12),
              borderColor: withAlpha(color, selected ? 1 : 0.3),
            }}
            className="flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-colors"
          >
            <span
              style={{ backgroundColor: color }}
              className="flex h-9 w-9 items-center justify-center rounded-full"
            >
              <Icon size={18} className="text-white" strokeWidth={2.25} />
            </span>
            <span className="line-clamp-1 text-center text-[13px] font-semibold tracking-tight text-slate-100">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
