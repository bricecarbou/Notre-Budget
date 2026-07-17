import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const createSubcategorySchema = z.object({
  name: z.string().min(1),
});

export const updateSubcategorySchema = z.object({
  name: z.string().min(1),
});
