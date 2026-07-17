import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface CreateExpenseInput {
  amount: number;
  categoryId: string;
  subcategoryId?: string;
  date: string;
  label?: string;
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const { data } = await apiClient.post("/expenses", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
