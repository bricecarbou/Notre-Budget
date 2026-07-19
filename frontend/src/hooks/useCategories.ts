import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, isNetworkError } from "@/api/client";
import { saveCategoriesCache, loadCategoriesCache } from "@/lib/categoryCache";
import type { Category, Subcategory } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Category[]>("/categories");
        saveCategoriesCache(data);
        return data;
      } catch (err) {
        if (isNetworkError(err)) {
          const cached = loadCategoriesCache();
          if (cached) return cached;
        }
        throw err;
      }
    },
  });
}

export interface CategoryInput {
  name: string;
  icon?: string;
  color?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const { data } = await apiClient.post<Category>("/categories", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: CategoryInput & { id: string }) => {
      const { data } = await apiClient.patch<Category>(`/categories/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, name }: { categoryId: string; name: string }) => {
      const { data } = await apiClient.post<Subcategory>(
        `/categories/${categoryId}/subcategories`,
        { name }
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await apiClient.patch<Subcategory>(`/subcategories/${id}`, { name });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/subcategories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
