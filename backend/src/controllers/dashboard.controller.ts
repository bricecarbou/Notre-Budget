import type { Request, Response } from "express";
import { getDashboard } from "../services/dashboard.service";

export async function getDashboardHandler(req: Request, res: Response) {
  const year = Number(req.params.year);
  const month = Number(req.params.month);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Paramètres year/month invalides" });
  }

  const dashboard = await getDashboard(year, month);
  res.json(dashboard);
}
