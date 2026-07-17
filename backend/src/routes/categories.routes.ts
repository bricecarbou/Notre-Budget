import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  listHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  createSubcategoryHandler,
} from "../controllers/categories.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", requireAdmin, createHandler);
router.patch("/:id", requireAdmin, updateHandler);
router.delete("/:id", requireAdmin, deleteHandler);
router.post("/:id/subcategories", requireAdmin, createSubcategoryHandler);

export default router;
