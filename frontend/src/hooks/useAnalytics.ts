import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { CategoryBreakdown, MonthlyTrendPoint } from "@/types";

export function useMonthlyTrend(months: number) {
  return useQuery({
    queryKey: ["analytics", "monthly-trend", months],
    queryFn: async () => {
      const { data } = await apiClient.get<MonthlyTrendPoint[]>(
        "/analytics/monthly-trend",
        { params: { months } }
      );
      return data;
    },
  });
}

export function useByCategory(year: number, month: number) {
  return useQuery({
    queryKey: ["analytics", "by-category", year, month],
    queryFn: async () => {
      const { data } = await apiClient.get<CategoryBreakdown[]>(
        "/analytics/by-category",
        { params: { year, month } }
      );
      return data;
    },
  });
}
