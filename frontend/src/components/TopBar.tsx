import { LogOut, Moon, Sun } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  async function handleLogout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // stateless JWT : on déconnecte localement même si l'appel échoue
    }
    logout();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] dark:border-slate-800 dark:bg-slate-950">
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Notre Budget
        </div>
        {user && <div className="text-xs text-slate-500">{user.name}</div>}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={handleLogout}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Se déconnecter"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
