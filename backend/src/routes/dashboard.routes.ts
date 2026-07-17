import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { getDashboardHandler } from "../controllers/dashboard.controller";

const router = Router();

router.use(requireAuth);

router.get("/:year/:month", getDashboardHandler);

export default router;
