import { useState } from "react";
import { Pencil, Plus, UserX, UserCheck } from "lucide-react";
import { useUsers, useUpdateUser, useDeactivateUser } from "@/hooks/useUsers";
import { UserFormModal } from "./UserFormModal";
import type { User } from "@/types";

export function UsersPanel() {
  const { data: users = [], isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();
  const [editing, setEditing] = useState<User | null | "new">(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Utilisateurs</h2>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus size={14} /> Nouvel utilisateur
        </button>
      </div>

      {isLoading && <p className="py-4 text-sm text-slate-500">Chargement...</p>}

      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {users.map((u) => (
          <li key={u.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2 font-medium">
                {u.name}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {u.role}
                </span>
                {!u.active && (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-500 dark:text-red-400">
                    Désactivé
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">@{u.login}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(u)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() =>
                  u.active
                    ? deactivateUser.mutate(u.id)
                    : updateUser.mutate({ id: u.id, active: true })
                }
                className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={u.active ? "Désactiver" : "Réactiver"}
              >
                {u.active ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing !== null && (
        <UserFormModal
          user={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
