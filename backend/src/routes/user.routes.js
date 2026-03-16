import express from "express";
import userControlers from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", userControlers.register);
router.post("/login", userControlers.login);

export default router;