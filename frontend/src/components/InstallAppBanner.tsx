import { useState } from "react";
import { Download, X } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

const DISMISS_KEY = "notre-budget-install-banner-dismissed";

export function InstallAppBanner() {
  const { isInstalled, canPromptInstall, isIOS, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");

  const showable = !isInstalled && !dismissed && (canPromptInstall || isIOS);
  if (!showable) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm">
      <Download size={18} className="mt-0.5 shrink-0 text-blue-400" />
      <div className="flex-1">
        {isIOS ? (
          <p className="text-slate-200">
            Installe l'app sur ton téléphone : appuie sur{" "}
            <span className="font-semibold">Partager</span>, puis{" "}
            <span className="font-semibold">"Sur l'écran d'accueil"</span>.
          </p>
        ) : (
          <>
            <p className="mb-2 text-slate-200">
              Installe l'app sur ton téléphone pour un accès plus rapide.
            </p>
            <button
              onClick={promptInstall}
              className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Installer l'application
            </button>
          </>
        )}
      </div>
      <button onClick={dismiss} aria-label="Fermer" className="shrink-0 text-slate-400">
        <X size={16} />
      </button>
    </div>
  );
}
