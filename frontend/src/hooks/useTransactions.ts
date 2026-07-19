import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Transaction } from "@/types";

export function useTransactions(year: number, month: number, months = 1) {
  return useQuery({
    queryKey: ["transactions", year, month, months],
    queryFn: async () => {
      const { data } = await apiClient.get<Transaction[]>("/transactions", {
        params: { year, month, months },
      });
      return data;
    },
  });
}
