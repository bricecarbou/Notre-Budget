import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { getSettingsHandler, updateSettingsHandler } from "../controllers/settings.controller";

const router = Router();

router.use(requireAuth);

// N'importe quel membre (admin inclus) peut consulter/calibrer le début de mois.
router.get("/", getSettingsHandler);
router.patch("/", updateSettingsHandler);

export default router;
