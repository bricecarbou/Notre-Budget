import type { Request, Response } from "express";
import { getTransactions } from "../services/transactions.service";

export async function listTransactionsHandler(req: Request, res: Response) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  const months = req.query.months ? Number(req.query.months) : 1;

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Paramètres year/month invalides" });
  }
  if (!Number.isInteger(months) || months < 1 || months > 24) {
    return res.status(400).json({ error: "Paramètre months invalide" });
  }

  res.json(await getTransactions(year, month, months));
}
