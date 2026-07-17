import { z } from "zod";

export const createUserSchema = z.object({
  login: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(4),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(4).optional(),
});
