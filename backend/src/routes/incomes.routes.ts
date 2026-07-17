import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  listHandler,
  createHandler,
  deleteHandler,
} from "../controllers/incomes.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", createHandler);
router.delete("/:id", deleteHandler);

export default router;
