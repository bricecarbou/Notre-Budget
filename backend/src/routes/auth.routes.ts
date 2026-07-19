import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  loginHandler,
  refreshHandler,
  logoutHandler,
  changePasswordHandler,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.patch("/password", requireAuth, changePasswordHandler);

export default router;
