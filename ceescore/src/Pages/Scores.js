import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Scores = () => {
  const [fixturesLive, setFixturesLive] = useState([]);
  const [fixturesToCome, setFixturesToCome] = useState([]);
  const [pastFixtures, setPastFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayType, setDisplayType] = useState('live'); // State to track which type of fixtures to display

  useEffect(() => {
    fetchFixtures();
    fetchFixturesToCome();
    fetchPastFixtures();
  }, []);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/fixtures/scores', {
        params: { live: 'all', season: '2023' }
      });
      setFixturesLive(response.data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchFixturesToCome = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/fixtures/scorestocome', {
        params: { season: '2023', next: '50' }
      });
      setFixturesToCome(response.data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchPastFixtures = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/fixtures/pastscores', {
        params: { season: '2023', last: '50' }
      });
      setPastFixtures(response.data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const handleDisplayTypeChange = (type) => {
    setDisplayType(type);
  };

  const filteredFixtures = () => {
    switch (displayType) {
      case 'live':
        return fixturesLive;
      case 'toCome':
        return fixturesToCome;
      case 'past':
        return pastFixtures;
      default:
        return [];
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleDisplayTypeChange('past')}>Past</button>
        <button onClick={() => handleDisplayTypeChange('live')}>Live</button>
        <button onClick={() => handleDisplayTypeChange('toCome')}>To Come</button>        
      </div>
      <h2>Fixtures {displayType === 'live' ? 'Live' : displayType === 'toCome' ? 'To Come' : 'Past'}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {filteredFixtures().map((fixture, index) => (
            <div key={index}>
              <h1>
                {fixture.league.name} {fixture.league.season}
                <img src={fixture.league.logo} style={{ width: 38, height: 38 }} />
              </h1>
              <p>Country: {fixture.league.country}</p>
              <p>Date: {fixture.fixture.date}</p>
              <p>Status: {fixture.fixture.status?.long}</p>
              <p>Score: {fixture.goals.home} : {fixture.goals.away}</p>
              <p>Home Team: {fixture.teams.home.name}</p>
              <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: 50, height: 50 }} />
              <p>Away Team: {fixture.teams.away.name}</p>
              <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: 50, height: 50 }} />
              <p>Venue: {fixture.fixture.venue.name}, {fixture.fixture.venue.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scores;
