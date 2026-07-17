import type { Request, Response } from "express";
import {
  createExpenseTemplateSchema,
  updateExpenseTemplateSchema,
} from "../validators/expenseTemplates.validators";
import * as service from "../services/expenseTemplates.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof service.ExpenseTemplateError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(_req: Request, res: Response) {
  res.json(await service.listExpenseTemplates());
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createExpenseTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const template = await service.createExpenseTemplate({
    ...parsed.data,
    createdById: req.user!.id,
  });
  res.status(201).json(template);
}

export async function updateHandler(req: Request, res: Response) {
  const parsed = updateExpenseTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const template = await service.updateExpenseTemplate(req.params.id, parsed.data);
    res.json(template);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await service.deleteExpenseTemplate(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}
