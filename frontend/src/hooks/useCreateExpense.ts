import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, isNetworkError } from "@/api/client";
import { queueOfflineExpense } from "@/lib/offlineQueue";

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
      try {
        const { data } = await apiClient.post("/expenses", input);
        return data;
      } catch (err) {
        // Pas de réseau : on ne bloque pas la saisie, c'est une simple
        // création qui n'entre en conflit avec rien — elle sera rejouée
        // au retour de la connexion.
        if (isNetworkError(err)) {
          queueOfflineExpense(input);
          return { queued: true };
        }
        throw err;
      }
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
