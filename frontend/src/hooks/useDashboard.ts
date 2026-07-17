import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Dashboard } from "@/types";

export function useDashboard(year: number, month: number) {
  return useQuery({
    queryKey: ["dashboard", year, month],
    queryFn: async () => {
      const { data } = await apiClient.get<Dashboard>(`/dashboard/${year}/${month}`);
      return data;
    },
  });
}
