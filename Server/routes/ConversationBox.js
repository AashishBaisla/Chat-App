import express from "express";
import { convList, deleteConversation, newConv } from "../controllers/ConversationBox.js";

const router = express.Router()

router.delete("/:conversation_id", deleteConversation)
router.post("/", newConv)
router.get("/convList/:userID", convList)


export default router