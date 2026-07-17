import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { ExpenseTemplate } from "@/types";

export function useExpenseTemplates() {
  return useQuery({
    queryKey: ["expense-templates"],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpenseTemplate[]>("/expense-templates");
      return data;
    },
  });
}

export interface ExpenseTemplateInput {
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  endDate?: string | null;
  categoryId: string;
  subcategoryId?: string;
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["expense-templates"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreateExpenseTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExpenseTemplateInput) => {
      const { data } = await apiClient.post<ExpenseTemplate>("/expense-templates", input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateExpenseTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<ExpenseTemplateInput> & { id: string; active?: boolean }) => {
      const { data } = await apiClient.patch<ExpenseTemplate>(`/expense-templates/${id}`, input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteExpenseTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/expense-templates/${id}`);
    },
    onSuccess: () => invalidate(queryClient),
  });
}
