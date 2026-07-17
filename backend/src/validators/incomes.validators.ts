import { z } from "zod";

export const createIncomeSchema = z.object({
  label: z.string().min(1),
  amount: z.number().positive(),
  date: z.coerce.date(),
});

export const listIncomesQuerySchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
});
