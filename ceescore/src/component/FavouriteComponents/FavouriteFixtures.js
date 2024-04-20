import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Image, Text, Spinner, Flex, Button, Center } from '@chakra-ui/react';
import PlayerStats from './FavouritePlayerStats';

const TeamStats = ({ teamId }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagueOptions = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
          params: { team: teamId },
          headers: {
            'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        };

        const leagueResponse = await axios.request(leagueOptions);
        const leagueId = leagueResponse.data.response[0].league.id;

        const teamStatsOptions = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
          params: {
            league: leagueId,
            season: "2023",
            team: teamId
          },
          headers: {
            'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        };

        setLoading(true);
        const response = await axios.request(teamStatsOptions);
        setStats(response.data.response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
        <Text mt="4">Loading team stats...</Text>
      </Box>
    );
  }

  if (!stats || !stats.team) {
    return null;
  }

  const { team, league, goals, fixtures, form, clean_sheet, failed_to_score, penalty } = stats;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p="4"
      marginBottom="4"
      boxShadow="md"
      backgroundColor="white"
      width="100%"
    >
      <Image src={league.logo} alt="League Logo" boxSize="50px" mb="2" />
      <Text fontSize="xl" fontWeight="semibold" mb="4">
        {league.name} - {league.season}
      </Text>
      <Image src={team.logo} alt="Team Logo" boxSize="50px" mb="2" />
      <Text fontSize="l" fontWeight="semibold" mb="4">
        {team.name}
      </Text>

      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold">Form:</Text>
        <Text>{form}</Text>
      </Box>

      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold">Goals:</Text>
        <Text>For - Home: {goals.for?.total.home}, Away: {goals.for?.total.away} , Total: {goals.for?.total.total}</Text>
        <Text>Against - Home: {goals.against?.total.home}, Away: {goals.against?.total.away} , Total: {goals.against?.total.total}</Text>
      </Box>

      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold">Wins and Losses:</Text>
        <Text>Wins: Home: {fixtures.wins?.home}, Away: {fixtures.wins?.away}, Total: {fixtures.wins?.total}</Text>
        <Text>Losses: Home: {fixtures.loses?.home}, Away: {fixtures.loses?.away}, Total: {fixtures.loses?.total}</Text>
      </Box>

      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold">Clean Sheets and Failed to Score:</Text>
        <Text>Clean Sheets: Home: {clean_sheet?.home}, Away: {clean_sheet?.away}, Total: {clean_sheet?.total}</Text>
        <Text>Failed to Score: Home: {failed_to_score?.home}, Away: {failed_to_score?.away}, Total: {failed_to_score?.total}</Text>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold">Penalties:</Text>
        <Text>Scored: {penalty?.scored?.total}, Percentage: {penalty?.scored?.percentage}</Text>
        <Text>Missed: {penalty?.missed?.total}, Percentage: {penalty?.missed?.percentage}</Text>
      </Box>
    </Box>
  );
};

const FavouriteFixtures = ({ teamId }) => {
  const [fixturesLive, setFixturesLive] = useState([]);
  const [fixturesToCome, setFixturesToCome] = useState([]);
  const [pastFixtures, setPastFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayType, setDisplayType] = useState('toCome');

  useEffect(() => {
    fetchFixtures();
    fetchFixturesToCome();
    fetchPastFixtures();
  }, [teamId]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: { live: 'all', season: '2023', team: teamId },
        headers: {
          'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      setFixturesLive(response.data.response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFixturesToCome = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: { season: '2023', next: '50', team: teamId },
        headers: {
          'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      setFixturesToCome(response.data.response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPastFixtures = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: { season: '2023', last: '50',  team: teamId },
        headers: {
          'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });
      setPastFixtures(response.data.response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
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
    <Flex>
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

      {/* TeamStats component */}
      <Box flex="3">
        <TeamStats teamId={teamId} />
      </Box>

      {/* PlayerStats component */}
      <Box flex="2">
        <PlayerStats teamId={teamId} />
      </Box>
    </Flex>
  );
};

export default FavouriteFixtures;
