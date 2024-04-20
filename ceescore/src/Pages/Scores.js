import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Text, Image, Center } from '@chakra-ui/react';

const Scores = () => {
  const [fixturesLive, setFixturesLive] = useState([]);
  const [fixturesToCome, setFixturesToCome] = useState([]);
  const [pastFixtures, setPastFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayType, setDisplayType] = useState('live');

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
        params: { season: '2023', last: '50', status: 'finished' }
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
        return pastFixtures.filter(fixture => fixture.fixture.status?.short === 'FT');
      default:
        return [];
    }
  };

  return (
    <Center>
      <Box p={4} maxW="800px">
        <Center mb={4}>
          <Button onClick={() => handleDisplayTypeChange('past')} mr={2}>Past</Button>
          <Button onClick={() => handleDisplayTypeChange('live')} mr={2}>Live</Button>
          <Button onClick={() => handleDisplayTypeChange('toCome')}>To Come</Button>
        </Center>
        <Center>
          <Text textAlign="center" fontSize="xl" fontWeight="bold" mb={4}>Fixtures {displayType === 'live' ? 'Live' : displayType === 'toCome' ? 'To Come' : 'Past'}</Text>
        </Center>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red">{error}</Text>
        ) : (
          <Box>
            {filteredFixtures().map((fixture, index) => (
              <Box key={index} border="1px" borderRadius="md" p={4} mb={4}>
                <Center>
                  <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={2}>
                    {fixture.league.name} {fixture.league.season}
                    </Text>
                   
                  </Center>
                <Center>
                <img src={fixture.league.logo} ml={2} width="50" height="50" style={{ display: 'block', margin: 'auto', textAlign: 'center' }} />
                </Center>
                <Text textAlign="center">Country: {fixture.league.country}</Text>
                <Text textAlign="center">Date: {fixture.fixture.date}</Text>
                <Text textAlign="center">Status: {fixture.fixture.status?.long}</Text>
                <Text textAlign="center">Score: {fixture.goals.home} : {fixture.goals.away}</Text>
                <Text textAlign="center">Home Team: {fixture.teams.home.name}</Text>
                <Image src={fixture.teams.home.logo} alt={fixture.teams.home.name} boxSize="50px" mx="auto" my={2} />
                <Text textAlign="center">Away Team: {fixture.teams.away.name}</Text>
                <Image src={fixture.teams.away.logo} alt={fixture.teams.away.name} boxSize="50px" mx="auto" my={2} />
                <Text textAlign="center">Venue: {fixture.fixture.venue.name}, {fixture.fixture.venue.city}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default Scores;
