import express from "express";
import githubController from "../controllers/github.controller.js";

const router = express.Router();

router.get("/repos", githubController.getGitHubRepos);

export default router;
