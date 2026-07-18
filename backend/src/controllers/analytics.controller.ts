import type { Request, Response } from "express";
import { getMonthlyTrend, getByCategory } from "../services/analytics.service";

export async function monthlyTrendHandler(req: Request, res: Response) {
  const months = req.query.months ? Number(req.query.months) : 6;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const month = req.query.month ? Number(req.query.month) : undefined;
  if (!Number.isInteger(months) || months < 1 || months > 24) {
    return res.status(400).json({ error: "Paramètre months invalide" });
  }
  if (
    (year !== undefined && !Number.isInteger(year)) ||
    (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12))
  ) {
    return res.status(400).json({ error: "Paramètres year/month invalides" });
  }
  res.json(await getMonthlyTrend(months, year, month));
}

export async function byCategoryHandler(req: Request, res: Response) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  const months = req.query.months ? Number(req.query.months) : 1;
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Paramètres year/month invalides" });
  }
  if (!Number.isInteger(months) || months < 1 || months > 24) {
    return res.status(400).json({ error: "Paramètre months invalide" });
  }
  res.json(await getByCategory(year, month, months));
}
