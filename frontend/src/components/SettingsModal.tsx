import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { useChangePassword } from "@/hooks/useAuth";

function dayToDateString(day: number) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${month}-${dd}`;
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [date, setDate] = useState(() => dayToDateString(1));

  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    if (settings) setDate(dayToDateString(settings.monthStartDay));
  }, [settings]);

  async function handleSaveMonthStart() {
    const day = Number(date.split("-")[2]);
    if (!day || day < 1 || day > 31) return;
    await updateSettings.mutateAsync(day);
    onClose();
  }

  async function handleChangePassword() {
    setPasswordSaved(false);
    await changePassword.mutateAsync({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setPasswordSaved(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Réglages</h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <label className="mb-1 block text-sm text-slate-500 dark:text-slate-400">
          Début du mois budgétaire
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
        />
        <p className="mt-2 text-xs text-slate-500">
          Seul le jour compte (ex: 27) — le mois budgétaire ira du 27 au 26 du
          mois suivant, pour tout le monde, jusqu'à ce que tu recalibres ici.
        </p>

        <button
          onClick={handleSaveMonthStart}
          disabled={updateSettings.isPending}
          className="mt-4 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
        >
          {updateSettings.isPending ? "Enregistrement..." : "Valider"}
        </button>

        <hr className="my-5 border-slate-200 dark:border-slate-800" />

        <label className="mb-1 block text-sm text-slate-500 dark:text-slate-400">
          Mon mot de passe
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={4}
            className="w-full rounded-xl bg-slate-100 p-3 text-base outline-none dark:bg-slate-900"
          />
        </div>

        {changePassword.isError && (
          <p className="mt-2 text-sm text-red-500">
            Mot de passe actuel incorrect.
          </p>
        )}
        {passwordSaved && (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
            Mot de passe mis à jour.
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={
            changePassword.isPending || !currentPassword || newPassword.length < 4
          }
          className="mt-4 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-40"
        >
          {changePassword.isPending ? "Enregistrement..." : "Changer le mot de passe"}
        </button>
      </div>
    </div>
  );
}
