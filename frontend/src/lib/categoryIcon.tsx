import {
  ShoppingCart, Home, Car, Bus, Fuel, Plane,
  Shield, CreditCard, Landmark, Wallet, PiggyBank, Receipt,
  Repeat, Wifi, Phone, Tv, Smartphone, Laptop,
  Music, Ticket, Gamepad2, Film, Camera, PartyPopper,
  HeartPulse, Stethoscope, Pill, Dumbbell,
  Utensils, Coffee, Pizza,
  Shirt, Scissors, Wrench, Zap, Droplet, Flame,
  Gift, Baby, Dog, GraduationCap, Briefcase, Palmtree,
  Tag, MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

// Import nommé (pas `import *`) pour que le bundle ne charge que ces icônes
// au lieu de l'intégralité de lucide-react (~1000 icônes autrement).
const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart, Home, Car, Bus, Fuel, Plane,
  Shield, CreditCard, Landmark, Wallet, PiggyBank, Receipt,
  Repeat, Wifi, Phone, Tv, Smartphone, Laptop,
  Music, Ticket, Gamepad2, Film, Camera, PartyPopper,
  HeartPulse, Stethoscope, Pill, Dumbbell,
  Utensils, Coffee, Pizza,
  Shirt, Scissors, Wrench, Zap, Droplet, Flame,
  Gift, Baby, Dog, GraduationCap, Briefcase, Palmtree,
  Tag, MoreHorizontal,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export const FALLBACK_CATEGORY_COLOR = "#64748b";

export function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Tag;
  return ICON_MAP[name] ?? Tag;
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
