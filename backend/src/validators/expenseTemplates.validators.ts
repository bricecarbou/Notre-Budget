import { z } from "zod";

export const createExpenseTemplateSchema = z.object({
  label: z.string().min(1),
  amount: z.number().positive(),
  dayOfMonth: z.number().int().min(1).max(31),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().min(1).optional(),
});

export const updateExpenseTemplateSchema = createExpenseTemplateSchema.partial().extend({
  active: z.boolean().optional(),
});
