import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface CreateIncomeInput {
  label: string;
  amount: number;
  date: string;
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateIncomeInput) => {
      const { data } = await apiClient.post("/incomes", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  });
}
