import express from "express";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  getCommunityByUserId,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  sendCommunityMessage,
  getCommunityMessages,
  getChatId,
  getUserCommunities,
  getCommunityMembers,
  getUserCreatedCommunities,
} from "../controllers/communityController.js";
import upload, { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("media"), uploadToCloudinary, createCommunity);
router.get("/", getAllCommunities);
router.get("/:communityId", getCommunityById);
router.get("/user/:userId", getCommunityByUserId);
router.put(
  "/:communityId",
  upload.single("media"),
  uploadToCloudinary,
  updateCommunity
);
router.delete("/:communityId", deleteCommunity);
router.post("/join", joinCommunity);
router.post("/leave", leaveCommunity);
router.post("/messages", sendCommunityMessage);
router.get("/:communityId/messages", getCommunityMessages);
router.get("/:communityId/chatId", getChatId);
router.get("/user", getUserCommunities);
router.get("/:communityId/members", getCommunityMembers);
router.get("/user/created", getUserCreatedCommunities);

export default router;
