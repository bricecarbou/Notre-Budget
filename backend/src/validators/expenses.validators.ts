import { z } from "zod";

export const createExpenseSchema = z.object({
  label: z.string().optional(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().min(1).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const listExpensesQuerySchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
});
