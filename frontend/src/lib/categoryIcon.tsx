import * as LucideIcons from "lucide-react";
import { Tag, type LucideIcon } from "lucide-react";

export const FALLBACK_CATEGORY_COLOR = "#64748b";

export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Tag;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Tag;
}

export function withAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export function CategoryIcon({
  icon,
  color,
  size = 16,
}: {
  icon?: string | null;
  color?: string | null;
  size?: number;
}) {
  const Icon = resolveIcon(icon);
  const badgeSize = Math.round(size * 1.8);

  return (
    <span
      style={{
        width: badgeSize,
        height: badgeSize,
        backgroundColor: color ?? FALLBACK_CATEGORY_COLOR,
      }}
      className="flex shrink-0 items-center justify-center rounded-full"
    >
      <Icon size={size} className="text-white" strokeWidth={2.25} />
    </span>
  );
}
