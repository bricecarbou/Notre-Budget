import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Category } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>("/categories");
      return data;
    },
  });
}
