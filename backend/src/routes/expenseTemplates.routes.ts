import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  listHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/expenseTemplates.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", createHandler);
router.patch("/:id", updateHandler);
router.delete("/:id", deleteHandler);

export default router;
