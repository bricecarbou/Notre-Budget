import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface CreateExpenseInput {
  amount: number;
  categoryId: string;
  subcategoryId?: string;
  date: string;
  label?: string;
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["analytics"] });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const { data } = await apiClient.post("/expenses", input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateExpenseInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/expenses/${id}`, input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/expenses/${id}`);
    },
    onSuccess: () => invalidate(queryClient),
  });
}
