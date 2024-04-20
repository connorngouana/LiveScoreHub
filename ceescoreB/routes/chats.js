import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CollectionUser from "../models/user.js";
import Chatdb from "../models/chat.js";
import authMiddleware from "../authMiddleware/authMiddleware.js";

const router = express.Router();

router.post('/accesschat', authMiddleware, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User Id param not sent with request");
        return res.status(400).send("User Id param not sent with request");
    }

    try {
        let isChat = await Chatdb.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "-password").populate("latestMessage");

        isChat = await CollectionUser.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name picture email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await Chatdb.create(chatData);

            const fullChat = await Chatdb.findOne({ _id: createdChat.id }).populate("users", "-password");
            res.status(200).send(fullChat);
        }
    } catch (error) {
        console.error("Error accessing chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.get('/fetchchat',authMiddleware,  async (req, res) => {
    try {
        const results = await Chatdb.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await CollectionUser.populate(results, {
            path: "latestMessage.sender",
            select: "name picture email"
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.post('/group', authMiddleware, async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to form a group chat");
        }

        users.push(req.user);

        const groupChat = await Chatdb.create({
            chatName: req.body.name, 
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chatdb.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).send(fullGroupChat);
    } catch (error) {
        console.error("Error creating group chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.put('/grouprename', authMiddleware, async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chatdb.findByIdAndUpdate(
            chatId,
            { chatName: chatName },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404).send("Chat not found");
        } else {
            res.json(updatedChat); // Return the updated chat object
        }
    } catch (error) {
        console.error("Error renaming group chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.put('/groupremove', authMiddleware, async (req, res) => {
    const { chatId, userId } = req.body;
    
    try {
        const removed = await Chatdb.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!removed) {
            res.status(404).send("Chat not found");
        } else {
            res.json(removed);
        }
    } catch (error) {
        console.error("Error removing user from group chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.put('/groupadd', authMiddleware, async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const added = await Chatdb.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!added) {
            res.status(404).send("Chat not found");
        } else {
            res.json(added);
        }
    } catch (error) {
        console.error("Error adding user to group chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export default router;
