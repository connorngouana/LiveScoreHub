import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('english'); // Default to English league

  useEffect(() => {
    fetchStandings(selectedLeague);
  }, [selectedLeague]);

  const fetchStandings = async (league) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/table/${league}standing`);
      setStandings(response.data.response[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
  };

  return (
    <div>
      <label htmlFor="league-select">Select a League: </label>
      <select id="league-select" value={selectedLeague} onChange={handleLeagueChange}>
        <option value="english">English Premier League</option>
        <option value="spanish">Spanish La Liga</option>
        <option value="german">German Bundesliga</option>
        <option value="italian">Italian Serie A</option>
        <option value="french">French Ligue 1</option>
        {/* Add more options for other leagues if needed */}
      </select>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h1 dangerouslySetInnerHTML={{ __html: standings?.league?.name + " " + standings?.league?.season }} />
          <div>
            {standings?.league?.standings?.[0]?.map((standing, index) => (
              <div key={index} style={{ margin: 5 }}>
                <h5>{standing.rank}</h5>
                <img src={standing.team.logo} alt={standing.team.name} style={{ width: 50, height: 50 }} />
                <p>{standing.team.name}</p>
                <p>Points: {standing.points}</p>
                <p>Goal Difference: {standing.goalsDiff}</p>
                <p>Form: {standing.form}</p>
                {/* Render other standing information here */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Standings;
