import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/scores", async (req, res) => {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: 
        {
            live: 'all',
            season: '2023'
        },
      headers: {
        'X-RapidAPI-Key': '0321acaac4msha24cf180ce6daa4p147f4ejsn9ad04cfe7ee4',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



router.get("/scorestocome", async (req, res) => {

    try {
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: 
          {
              season: '2023',
              next: '50'
          },
        headers: {
          'X-RapidAPI-Key': '0321acaac4msha24cf180ce6daa4p147f4ejsn9ad04cfe7ee4',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  
  });
  

  router.get("/pastscores", async (req, res) => {

    try {
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: 
          {
              season: '2023',
              last: '50'
          },
        headers: {
          'X-RapidAPI-Key': '0321acaac4msha24cf180ce6daa4p147f4ejsn9ad04cfe7ee4',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  
  });
  
export default router;
