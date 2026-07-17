import type { Request, Response } from "express";
import {
  createIncomeSchema,
  listIncomesQuerySchema,
} from "../validators/incomes.validators";
import * as incomesService from "../services/incomes.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof incomesService.IncomeError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(req: Request, res: Response) {
  const parsed = listIncomesQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const incomes = await incomesService.listIncomes(parsed.data.year, parsed.data.month);
  res.json(incomes);
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createIncomeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const income = await incomesService.createIncome({
    ...parsed.data,
    createdById: req.user!.id,
  });
  res.status(201).json(income);
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await incomesService.deleteIncome(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}
