import { z } from "zod";

export const createIncomeTemplateSchema = z.object({
  label: z.string().min(1),
  amount: z.number().positive(),
  dayOfMonth: z.number().int().min(1).max(31),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
});

export const updateIncomeTemplateSchema = createIncomeTemplateSchema.partial().extend({
  active: z.boolean().optional(),
});
