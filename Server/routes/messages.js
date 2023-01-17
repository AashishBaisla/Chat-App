import express from "express";
import { addMessage, getMessages } from "../controllers/messages.js";

const router = express.Router()

router.post("/", addMessage)
router.get("/:conversation_id", getMessages)

export default router