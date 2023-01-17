import express from "express";
import { getUserbyuserID, getUserbyUsername, searchUsers, getSuggestions} from "../controllers/users.js";

const router = express.Router()

router.get("/:username", getUserbyUsername)
router.get("/userID/:userID", getUserbyuserID)
router.get("/searchUser/:term", searchUsers)
router.post("/suggestions/:userID", getSuggestions)

export default router