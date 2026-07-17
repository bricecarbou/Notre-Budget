import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface CreateIncomeInput {
  label: string;
  amount: number;
  date: string;
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["analytics"] });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateIncomeInput) => {
      const { data } = await apiClient.post("/incomes", input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateIncomeInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/incomes/${id}`, input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/incomes/${id}`);
    },
    onSuccess: () => invalidate(queryClient),
  });
}
