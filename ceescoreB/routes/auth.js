import express, { request } from "express";
import  User  from "../models/user.js";
import { connectMongoDB } from "../lib/mongo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CollectionUser from "../models/user.js";
import authMiddleware from "../authMiddleware/authMiddleware.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, picture} = req.body;
        await connectMongoDB();

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await CollectionUser.create({ name, email, password: hashedPassword, picture }); 
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}).get("/allUser",authMiddleware, async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i"}},
            { email: { $regex: req.query.search, $options: "i"}},
        ],
    }  
    : {};

    const users = await CollectionUser.find(keyword);
    res.json(users);
});


router.post('/userCheck', async (req, res) => {
    try {
        await connectMongoDB();
        const { email } = req.body;
        
        const user = await CollectionUser.findOne({ email }).select("_id");

        console.log("User has been checked...user: ", user);

        res.status(201).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
)

router.post('/login', async (req, res) => {
    try {
        await connectMongoDB();
        const { email, password } = req.body;

        const user = await CollectionUser.findOne({ email }).select("password");
        
        if (!user) {
        return res.status(401).json({ error: 'Login failed, User not found' });
        }

        console.log("User has been checked...user: ", user);
        
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid Credentials' });
        }
        
        console.log("User password has been checked...password: ", passwordMatch);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie('jwt', token, {
            httpOnly:true,
            maxAge: 24*60*60*1000 
        
        })      
        res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
});


router.get('/profiles', authMiddleware, async (req, res) => {
    try {

        const user = req.user;

        const userProfile = await CollectionUser.findById(user._id);

        if (!userProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Send user profile
        res.send(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/Logout', async (req, res) => {
    
try{ 
    res.clearCookie('jwt');
    res.status(200).json({ message: 'cleared cookies' });


}catch(error) {
    console.error(error);
    res.status(401).json({ error: 'Internal Server Error' });
}

   
});



export default router;