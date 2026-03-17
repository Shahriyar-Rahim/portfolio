import express from "express";
import inboxControlers from "../controllers/inbox.conroller.js";

const router = express.Router();

router.post("/", inboxControlers.makeInbox);
router.get("/", inboxControlers.getAllInbox);
router.get("/:id", inboxControlers.getInbox);
router.post("/:id/reply", inboxControlers.replyInbox);
router.patch("/:id", inboxControlers.updateInboxStatus);
router.delete("/:id", inboxControlers.deleteInbox);

export default router;