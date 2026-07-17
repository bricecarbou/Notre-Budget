import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { IncomeTemplate } from "@/types";

export function useIncomeTemplates() {
  return useQuery({
    queryKey: ["income-templates"],
    queryFn: async () => {
      const { data } = await apiClient.get<IncomeTemplate[]>("/income-templates");
      return data;
    },
  });
}

export interface IncomeTemplateInput {
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  endDate?: string | null;
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["income-templates"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreateIncomeTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: IncomeTemplateInput) => {
      const { data } = await apiClient.post<IncomeTemplate>("/income-templates", input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateIncomeTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<IncomeTemplateInput> & { id: string; active?: boolean }) => {
      const { data } = await apiClient.patch<IncomeTemplate>(`/income-templates/${id}`, input);
      return data;
    },
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteIncomeTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/income-templates/${id}`);
    },
    onSuccess: () => invalidate(queryClient),
  });
}
