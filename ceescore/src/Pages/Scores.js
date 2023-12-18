//import React from 'react'
import axios from 'axios';
async function Scores()  
{
    
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    method: 'GET',
    params: {date: '2021-01-29'},
    headers: {
      'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(Scores);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
export default Scores