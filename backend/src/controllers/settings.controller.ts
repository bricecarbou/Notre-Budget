import type { Request, Response } from "express";
import { updateSettingsSchema } from "../validators/settings.validators";
import { getAppSettings, updateAppSettings } from "../services/settings.service";

export async function getSettingsHandler(_req: Request, res: Response) {
  res.json(await getAppSettings());
}

export async function updateSettingsHandler(req: Request, res: Response) {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json(await updateAppSettings(parsed.data));
}
