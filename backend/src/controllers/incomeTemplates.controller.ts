import type { Request, Response } from "express";
import {
  createIncomeTemplateSchema,
  updateIncomeTemplateSchema,
} from "../validators/incomeTemplates.validators";
import * as service from "../services/incomeTemplates.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof service.IncomeTemplateError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(_req: Request, res: Response) {
  res.json(await service.listIncomeTemplates());
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createIncomeTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const template = await service.createIncomeTemplate({
    ...parsed.data,
    createdById: req.user!.id,
  });
  res.status(201).json(template);
}

export async function updateHandler(req: Request, res: Response) {
  const parsed = updateIncomeTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const template = await service.updateIncomeTemplate(req.params.id, parsed.data);
    res.json(template);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await service.deleteIncomeTemplate(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}
