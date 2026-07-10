import express from "express";
import inboxControlers from "../controllers/inbox.conroller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.post("/", inboxControlers.makeInbox); // public — the contact form
router.get("/", protectMiddleware.protect, inboxControlers.getAllInbox);
router.get("/:id", protectMiddleware.protect, inboxControlers.getInbox);
router.post("/:id/reply", protectMiddleware.protect, inboxControlers.replyInbox);
router.patch("/:id", protectMiddleware.protect, inboxControlers.updateInboxStatus);
router.delete("/:id", protectMiddleware.protect, inboxControlers.deleteInbox);

export default router;
