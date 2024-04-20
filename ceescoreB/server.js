import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http"; // Import createServer from http module
import { Server as SocketIOServer } from "socket.io"; // Import Server from socket.io

import cookieParser from "cookie-parser";

import { connectMongoDB } from "./lib/mongo.js";
import authRouter from "./routes/auth.js";
import tableRouter from "./routes/table.js";
import fixtureRouter from "./routes/fixtures.js";
import chatRouter from "./routes/chats.js";
import messageRouter from "./routes/messages.js";
import favouritesRouter from "./routes/favourites.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectMongoDB();
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello this is the CeeScores server");
});

const httpServer = createServer(app); // Create HTTP server
const io = new SocketIOServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => { 
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat" , (room) => {
    socket.join(room);
    console.log("User joined the room" + room)
  });

  socket.on('typing' , (room) => socket.in(room).emit("typing"));
  socket.on('stop typing' , (room) => socket.in(room).emit("stop typing"));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if(!chat.users) return console("chat.users not defined");

    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })



  })
  
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

app.use("/auth", authRouter);
app.use("/table", tableRouter);
app.use("/fixtures", fixtureRouter);
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);
app.use("/favourites", favouritesRouter);

httpServer.listen(PORT, () => { 
  console.log(`Server is running on port http://localhost:${PORT}`);
});
