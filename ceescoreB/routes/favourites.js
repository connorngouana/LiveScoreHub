import express from "express";
import favoritedb from "../models/favourite.js";
import authMiddleware from "../authMiddleware/authMiddleware.js";
import CollectionUser from "../models/user.js";
import axios from 'axios';

const router = express.Router();
   

router.post('/addFavoriteTeam', authMiddleware, async (req, res) => {
    const { userId, teamId, clubName} = req.body;
  
    if (!userId || !teamId || !clubName) {
      console.log("User Id, Team Id, or Club Name not sent with request");
      return res.status(400).send("User Id, Team Id, or Club Name not sent with request");
    }
  
    try {
      const favoriteTeam = new favoritedb({ users: userId, clubId: teamId, clubName: clubName });
      await favoriteTeam.save();
      res.status(200).send('Favorite team added successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding favorite team');
    }
  });

  router.get('/fetchclub',authMiddleware,  async (req, res) => {
    try {
        const results = await favoritedb.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("clubId")
           
        res.status(200).send(results);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
  });


  router.delete('/removeFavoriteTeam/:clubId', authMiddleware, async (req, res) => {
    const { clubId } = req.params;
    const userId = req.user._id;

    try {
        const favorite = await favoritedb.findOne({ clubId, users: userId });
        if (!favorite) {
            return res.status(404).json({ error: 'Club not found in favorites' });
        }

        await favoritedb.deleteOne({ _id: favorite._id });

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
  
});

export default router;
