import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { flushOfflineQueue, initOfflineQueue } from "@/lib/offlineQueue";

const RETRY_INTERVAL_MS = 20_000;

// Rejoue la file d'ajouts en attente : au montage, au retour de connexion,
// et en filet de sécurité toutes les 20s (l'évènement "online" du navigateur
// n'est pas toujours fiable pour détecter un vrai retour d'accès internet).
export function useOfflineSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    initOfflineQueue();

    async function attemptFlush() {
      const { synced } = await flushOfflineQueue();
      if (synced > 0) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    }

    attemptFlush();
    window.addEventListener("online", attemptFlush);
    const interval = setInterval(attemptFlush, RETRY_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", attemptFlush);
      clearInterval(interval);
    };
  }, [queryClient]);
}
