import express from "express";
import {
  getOrCreateConversation,
  getConversations,
  getConversationById,
} from "../controllers/conversationController.js";
import {
  getMessagesByConversation,
  sendMessage,
} from "../controllers/messageController.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:userId", getConversations);
router.get("/conversations/:conversationId", getConversationById);

// Rutas de mensajes
router.get("/:conversationId", getMessagesByConversation);
router.post("/", sendMessage);

router.get("/users/:userId", getAllUsers);

export default router;
