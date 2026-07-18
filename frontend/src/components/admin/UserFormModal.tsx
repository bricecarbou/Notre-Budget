import { useState } from "react";
import { X } from "lucide-react";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import type { Role, User } from "@/types";

export function UserFormModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const isEdit = user !== null;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [login, setLogin] = useState(user?.login ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "USER");
  const [password, setPassword] = useState("");

  const pending = createUser.isPending || updateUser.isPending;
  const error = createUser.error || updateUser.error;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateUser.mutateAsync({
          id: user.id,
          name,
          role,
          password: password || undefined,
        });
      } else {
        await createUser.mutateAsync({ login, name, password, role });
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
            {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={isEdit}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none disabled:opacity-50 dark:bg-slate-900"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          <input
            type="password"
            placeholder={isEdit ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
            required={!isEdit}
            minLength={4}
          />

          {error && (
            <p className="text-sm text-red-500">
              Impossible d'enregistrer cet utilisateur.
            </p>
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
