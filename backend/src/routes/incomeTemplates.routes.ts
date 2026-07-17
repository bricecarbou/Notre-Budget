import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireUser } from "../middlewares/requireUser";
import {
  listHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/incomeTemplates.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", requireUser, createHandler);
router.patch("/:id", requireUser, updateHandler);
router.delete("/:id", requireUser, deleteHandler);

export default router;
