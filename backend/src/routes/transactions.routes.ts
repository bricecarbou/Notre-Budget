import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { listTransactionsHandler } from "../controllers/transactions.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listTransactionsHandler);

export default router;
