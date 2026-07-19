import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  monthlyTrendHandler,
  byCategoryHandler,
  categoryTransactionsHandler,
} from "../controllers/analytics.controller";

const router = Router();

router.use(requireAuth);

router.get("/monthly-trend", monthlyTrendHandler);
router.get("/by-category", byCategoryHandler);
router.get("/by-category/:categoryId/transactions", categoryTransactionsHandler);

export default router;
