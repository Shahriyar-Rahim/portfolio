import express from "express";
import serviceController from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getService);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

export default router;