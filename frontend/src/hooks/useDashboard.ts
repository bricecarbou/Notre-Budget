import { useQuery } from "@tanstack/react-query";
import { apiClient, isNetworkError } from "@/api/client";
import { saveToCache, loadFromCache } from "@/lib/offlineCache";
import type { Dashboard } from "@/types";

export interface DashboardResult extends Dashboard {
  // Présent uniquement quand la donnée vient du cache hors ligne, pas d'un
  // appel réseau réussi.
  cachedAt?: string;
}

export function useDashboard(year: number, month: number) {
  const cacheKey = `notre-budget-dashboard-cache-${year}-${month}`;

  return useQuery({
    queryKey: ["dashboard", year, month],
    queryFn: async (): Promise<DashboardResult> => {
      try {
        const { data } = await apiClient.get<Dashboard>(`/dashboard/${year}/${month}`);
        saveToCache(cacheKey, data);
        return data;
      } catch (err) {
        if (isNetworkError(err)) {
          const cached = loadFromCache<Dashboard>(cacheKey);
          if (cached) return { ...cached.data, cachedAt: cached.cachedAt };
        }
        throw err;
      }
    },
  });
}
