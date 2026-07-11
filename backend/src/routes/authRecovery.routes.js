import express from "express";
import authRecoveryController from "../controllers/authRecovery.controller.js";

const router = express.Router();

router.post("/forgot-password", authRecoveryController.requestRecovery);
router.post("/verify-recovery", authRecoveryController.verifyRecoveryCode);
router.get("/magic-link", authRecoveryController.consumeMagicLink);

export default router;
