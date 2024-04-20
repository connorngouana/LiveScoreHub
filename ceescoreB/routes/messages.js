import express from "express";
import User from "../models/user.js";
import { connectMongoDB } from "../lib/mongo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CollectionUser from "../models/user.js";
import authMiddleware from "../authMiddleware/authMiddleware.js";
import Messagedb from "../models/message.js";
import Chatdb from "../models/chat.js";

const router = express.Router();

router.post('/sendmessage', authMiddleware, async (req, res) => {
    const {content, chatId} = req.body
    
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    
    try {
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        let message = await Messagedb.create(newMessage);

        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await CollectionUser.populate(message, {
            path: 'chat.users',
            select: "name picture email",
        });
        
        await Chatdb.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch(error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/allmessages/:chatId', authMiddleware, async (req, res) => {
    try {
        const messages = await Messagedb.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

export default router;
