import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireUser } from "../middlewares/requireUser";
import {
  listHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/expenses.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listHandler);
router.post("/", requireUser, createHandler);
// Modifier/supprimer reste ouvert à l'admin, pour corriger une erreur de saisie.
router.patch("/:id", updateHandler);
router.delete("/:id", deleteHandler);

export default router;
