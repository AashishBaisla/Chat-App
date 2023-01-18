import express from "express";
import { roomsList, deleteRoom, newRoom, joinRoom, leaveRoom, addMessages, getRoomMessages, roomJoined, roomInfo } from "../controllers/rooms.js";

const router = express.Router()

router.get("/roomsList/", roomsList)
router.delete("/:room_id", deleteRoom)
router.post("/", newRoom)
router.post("/joinroom", joinRoom)
router.post("/leaveroom", leaveRoom)
router.post("/messages", addMessages)
router.get("/roomMessages/:room_id", getRoomMessages)
router.get("/roomsJoined/:user_id", roomJoined)
router.get("/roominfo/:room_id", roomInfo)


export default router