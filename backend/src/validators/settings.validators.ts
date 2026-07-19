import { z } from "zod";

export const updateSettingsSchema = z.object({
  monthStartDay: z.number().int().min(1).max(31),
});
