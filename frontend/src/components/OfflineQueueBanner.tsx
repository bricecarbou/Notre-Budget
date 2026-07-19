import { CloudOff } from "lucide-react";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";

export function OfflineQueueBanner() {
  const count = useOfflineQueueStore((s) => s.items.length);
  if (count === 0) return null;

  return (
    <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-sm text-orange-700 dark:text-orange-300">
      <CloudOff size={16} className="shrink-0" />
      <span>
        {count} {count > 1 ? "transactions en attente" : "transaction en attente"} de
        synchronisation — {count > 1 ? "seront envoyées" : "sera envoyée"} dès le retour du
        réseau.
      </span>
    </div>
  );
}
