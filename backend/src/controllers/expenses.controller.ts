import type { Request, Response } from "express";
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesQuerySchema,
} from "../validators/expenses.validators";
import * as expensesService from "../services/expenses.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof expensesService.ExpenseError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(req: Request, res: Response) {
  const parsed = listExpensesQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const expenses = await expensesService.listExpenses(parsed.data.year, parsed.data.month);
  res.json(expenses);
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createExpenseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const expense = await expensesService.createExpense({
    ...parsed.data,
    createdById: req.user!.id,
  });
  res.status(201).json(expense);
}

export async function updateHandler(req: Request, res: Response) {
  const parsed = updateExpenseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const expense = await expensesService.updateExpense(req.params.id, parsed.data);
    res.json(expense);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await expensesService.deleteExpense(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}
