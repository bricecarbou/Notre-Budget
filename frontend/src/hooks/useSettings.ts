import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, isNetworkError } from "@/api/client";
import { saveToCache, loadFromCache } from "@/lib/offlineCache";
import type { AppSettings } from "@/types";

const SETTINGS_CACHE_KEY = "notre-budget-settings-cache";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<AppSettings>("/settings");
        saveToCache(SETTINGS_CACHE_KEY, data);
        return data;
      } catch (err) {
        if (isNetworkError(err)) {
          const cached = loadFromCache<AppSettings>(SETTINGS_CACHE_KEY);
          // Sans ce secours, monthStartDay retomberait silencieusement à 1
          // hors ligne (via `settings?.monthStartDay ?? 1`), ce qui décale
          // le libellé du mois affiché sans que les données changent.
          if (cached) return cached.data;
        }
        throw err;
      }
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (monthStartDay: number) => {
      const { data } = await apiClient.patch<AppSettings>("/settings", { monthStartDay });
      return data;
    },
    onSuccess: () => {
      // Le début de mois affecte dashboard, récurrents et analyses.
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
