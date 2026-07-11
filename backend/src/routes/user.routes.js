import express from "express";
import userControlers from "../controllers/user.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.post("/register", userControlers.register);
router.post("/login", userControlers.login);
router.post("/logout", userControlers.logout);
router.get("/me", protectMiddleware.protect, userControlers.me);
router.patch(
  "/account",
  protectMiddleware.protect,
  userControlers.updateAccount,
);

export default router;
