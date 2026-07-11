import express from "express";
import authRecoveryController from "../controllers/authRecovery.controller.js";

const router = express.Router();

router.post("/forgot-password", authRecoveryController.requestRecovery);
router.post("/reset-password", authRecoveryController.resetPasswordWithMagicLink);

export default router;
