import * as dotenv from 'dotenv' ;
dotenv.config() ;
import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import conversationRoutes from "./routes/ConversationBox.js";
import messageRoutes from "./routes/messages.js";
const app = express();
import { Server } from "socket.io";

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../Frontend/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const upload = multer({ storage: storage });
  
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});
  
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`) ;
});

//SOCKET SETUP
const io = new Server(server, {
  cors:{
    origin: "*"
  }
});

let users = [];

const addUser = (userID, socketID) => {
  !users.some((user) => user.userID === userID) &&
    users.push({ userID, socketID });

console.log({"addUser":users});
};

const removeUser = (socketID) => {
  users = users.filter((user) => user.socketID !== socketID);

  console.log({"removeUsers":users});
};

const getUser = (userID) => {
  console.log({"getUser":users});
  return users.find((user) => user.userID === userID);
};


io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  //socket.id created here
  console.log(socket.id);
  //take userId and socketId from user
  socket.on("addUser", (userID) => {
    addUser(parseInt(userID), socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderID, receiverID, msg }) => {
    const user = getUser(receiverID);
    
    console.log(receiverID)

    io.to(user?.socketID).emit("getMessage", {
      senderID,
      msg,
    });
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });


  //send and get notifications
  socket.on("sendNotification", ({senderName, receiverID, type }) => {
    const user = getUser(receiverID);
    
    console.log(receiverID)

    io.to(user?.socketID).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });


  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
