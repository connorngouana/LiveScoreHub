import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Select, Text, Spinner, Flex } from '@chakra-ui/react';
import FootballNews from '../component/NewsFolder/NewsFolder';
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
    <Flex>
      <Box p="4" bg="gray.100" flex="1" flexDirection="column" borderRadius="md">
        <Text fontSize="xl" mb="4">Select a League:</Text>
        <Select id="league-select" value={selectedLeague} onChange={handleLeagueChange} mb="4">
          <option value="english">English Premier League</option>
          <option value="spanish">Spanish La Liga</option>
          <option value="german">German Bundesliga</option>
          <option value="italian">Italian Serie A</option>
          <option value="french">French Ligue 1</option>
          {/* Add more options for other leagues if needed */}
        </Select>
        {loading ? (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : (
          <>
            <Text fontSize="xl" mb="4" textAlign="center" dangerouslySetInnerHTML={{ __html: standings?.league?.name + " " + standings?.league?.season }} />
            <Box overflowX="auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th style={{ paddingRight: '20px' }}>Team</th>
                    <th style={{ paddingRight: '20px' }}>Played</th>
                    <th style={{ paddingRight: '20px' }}>GD</th>
                    <th style={{ paddingRight: '20px' }}>Form</th>
                    <th style={{ paddingRight: '20px' }}>Points</th>
                   
                   
                  </tr>
                </thead>
                <tbody>
                  {standings?.league?.standings?.[0]?.map((standing, index) => (
                    <tr key={index}>
                      <td>{standing.rank}</td>
                      <td style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={standing.team.logo} alt={standing.team.name} style={{ width:50, height: 50 }} />
                        <Text fontSize="xl">{standing.team.name}</Text>
                      </td>
                      <td style={{ paddingRight: '20px' }}>{standing.all.played}</td>
                      <td style={{ paddingRight: '20px' }}>{standing.goalsDiff}</td>
                      <td style={{ paddingRight: '20px' }}>{standing.form}</td>
                      <td style={{ paddingRight: '20px' }}>{standing.points}</td>
                      
                     
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </>
        )}
      </Box>
      <Box p="4" flex="2">
      <FootballNews/>
      </Box>
    </Flex>
  );
};

export default Standings;
