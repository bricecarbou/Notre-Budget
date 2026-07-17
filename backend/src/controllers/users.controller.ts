import type { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "../validators/users.validators";
import * as usersService from "../services/users.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof usersService.UserError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(_req: Request, res: Response) {
  res.json(await usersService.listUsers());
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const user = await usersService.createUser(parsed.data);
    res.status(201).json(user);
  } catch (err) {
    handleError(err, res);
  }
}

export async function updateHandler(req: Request, res: Response) {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const user = await usersService.updateUser(req.params.id, parsed.data);
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deactivateHandler(req: Request, res: Response) {
  try {
    const user = await usersService.deactivateUser(req.params.id);
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
}
