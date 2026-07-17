import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  listHandler,
  createHandler,
  updateHandler,
  deactivateHandler,
} from "../controllers/users.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", listHandler);
router.post("/", createHandler);
router.patch("/:id", updateHandler);
router.delete("/:id", deactivateHandler);

export default router;
