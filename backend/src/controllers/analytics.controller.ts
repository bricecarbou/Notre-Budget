import type { Request, Response } from "express";
import { getMonthlyTrend, getByCategory } from "../services/analytics.service";

export async function monthlyTrendHandler(req: Request, res: Response) {
  const months = req.query.months ? Number(req.query.months) : 6;
  if (!Number.isInteger(months) || months < 1 || months > 24) {
    return res.status(400).json({ error: "Paramètre months invalide" });
  }
  res.json(await getMonthlyTrend(months));
}

export async function byCategoryHandler(req: Request, res: Response) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Paramètres year/month invalides" });
  }
  res.json(await getByCategory(year, month));
}
