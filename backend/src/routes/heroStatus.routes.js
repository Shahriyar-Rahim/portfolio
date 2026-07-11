import express from "express";
import heroStatusController from "../controllers/heroStatus.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.get("/", heroStatusController.getAllHeroStatus); // public
router.post("/", protectMiddleware.protect, heroStatusController.createHeroStatus);
router.patch("/:id", protectMiddleware.protect, heroStatusController.updateHeroStatus);
router.delete("/:id", protectMiddleware.protect, heroStatusController.deleteHeroStatus);

export default router;
