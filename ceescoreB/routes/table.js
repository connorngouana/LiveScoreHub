import express from "express";
import axios from "axios";

const router = express.Router();
router.get("/englishstanding", async (req, res) => {

  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
      params: {
        season: '2023',
        league: '39'
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

router.get("/spanishstanding", async (req, res) => {

  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
      params: {
        season: '2023',
        league: '140'
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

router.get("/germanstanding", async (req, res) => {

  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
      params: {
        season: '2023',
        league: '78'
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

router.get("/italianstanding", async (req, res) => {

  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
      params: {
        season: '2023',
        league: '135'
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

router.get("/frenchstanding", async (req, res) => {

  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
      params: {
        season: '2023',
        league: '61'
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
