import type { Request, Response } from "express";
import { loginSchema, refreshSchema } from "../validators/auth.validators";
import * as authService from "../services/auth.service";

export async function loginHandler(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await authService.login(
      parsed.data.email,
      parsed.data.password
    );
    return res.json(result);
  } catch (err) {
    if (err instanceof authService.AuthError) {
      return res.status(401).json({ error: err.message });
    }
    throw err;
  }
}

export async function refreshHandler(req: Request, res: Response) {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await authService.refresh(parsed.data.refreshToken);
    return res.json(result);
  } catch (err) {
    if (err instanceof authService.AuthError) {
      return res.status(401).json({ error: err.message });
    }
    throw err;
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  // Stateless JWT : le client supprime ses tokens localement.
  return res.status(204).send();
}
