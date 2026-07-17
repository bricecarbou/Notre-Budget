import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireUser } from "../middlewares/requireUser";
import {
  listHandler,
  createHandler,
  deleteHandler,
} from "../controllers/incomes.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", requireUser, createHandler);
router.delete("/:id", requireUser, deleteHandler);

export default router;
