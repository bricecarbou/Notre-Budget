import { useQuery } from "@tanstack/react-query";
import { apiClient, isNetworkError } from "@/api/client";
import { saveToCache, loadFromCache } from "@/lib/offlineCache";
import type { Transaction } from "@/types";

export function useTransactions(year: number, month: number, months = 1) {
  const cacheKey = `notre-budget-transactions-cache-${year}-${month}-${months}`;

  return useQuery({
    queryKey: ["transactions", year, month, months],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Transaction[]>("/transactions", {
          params: { year, month, months },
        });
        saveToCache(cacheKey, data);
        return data;
      } catch (err) {
        if (isNetworkError(err)) {
          const cached = loadFromCache<Transaction[]>(cacheKey);
          if (cached) return cached.data;
        }
        throw err;
      }
    },
  });
}
