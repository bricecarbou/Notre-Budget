import { LogOut } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/authStore";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // stateless JWT : on déconnecte localement même si l'appel échoue
    }
    logout();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <div>
        <div className="text-sm font-semibold">Notre Budget</div>
        {user && <div className="text-xs text-slate-500">{user.name}</div>}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        aria-label="Se déconnecter"
      >
        <LogOut size={18} />
      </button>
    </header>
  );
}
