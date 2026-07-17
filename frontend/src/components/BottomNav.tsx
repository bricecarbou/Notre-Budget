import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Repeat, Settings, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-xs ${
    isActive ? "text-blue-400" : "text-slate-400"
  }`;

export function BottomNav({ onAddClick }: { onAddClick: () => void }) {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800 bg-slate-950/95 px-2 py-2 backdrop-blur">
      <NavLink to="/" end className={linkClass}>
        <LayoutDashboard size={20} />
        Dashboard
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
