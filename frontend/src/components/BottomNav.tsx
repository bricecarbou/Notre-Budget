import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Repeat, Settings, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-xs ${
    isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
  }`;

export function BottomNav({ onAddClick }: { onAddClick: () => void }) {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <NavLink to="/" end className={linkClass}>
        <LayoutDashboard size={20} />
        Tableau de bord
      </NavLink>
      <NavLink to="/analytics" className={linkClass}>
        <BarChart3 size={20} />
        Analyses
      </NavLink>

      {!isAdmin && (
        <button
          onClick={onAddClick}
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30"
          aria-label="Ajouter une dépense"
        >
          <Plus size={28} />
        </button>
      )}

      <NavLink to="/recurring" className={linkClass}>
        <Repeat size={20} />
        Récurrents
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={linkClass}>
          <Settings size={20} />
          Admin
        </NavLink>
      )}
    </nav>
  );
}
