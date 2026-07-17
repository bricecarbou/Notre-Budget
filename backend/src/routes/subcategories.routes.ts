import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  updateSubcategoryHandler,
  deleteSubcategoryHandler,
} from "../controllers/categories.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.patch("/:id", updateSubcategoryHandler);
router.delete("/:id", deleteSubcategoryHandler);

export default router;
