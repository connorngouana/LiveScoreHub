import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Image, Text, Spinner } from '@chakra-ui/react';

const TeamStats = ({ teamId }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
          params: {
            league: "39",
            season: "2023",
            team: teamId
          },
          headers: {
            'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        };

        setLoading(true); // Set loading to true before making the API call

        const response = await axios.request(options);
        setStats(response.data.response); // Set the stats data
        console.log(stats); // Log the response data structure

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after API call is completed
      }
    };

    fetchClubData();
  }, [teamId]); // Run useEffect whenever the teamId changes

  return (
    <Box
      display={{ base: "flex", md: "flex" }}
      alignItems="center"
      flexDirection="column" 
      padding={3}
      backgroundColor="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
    
      {loading ? ( // Render loading indicator if loading is true
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt="4">Loading team stats...</Text>
        </Box>
      ) : (
        stats.length > 0 && stats.map((stat, index) => (
          <Box
            key={index} 
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            marginBottom="4"
            boxShadow="md"
          >
            <Text fontSize="xl" fontWeight="semibold" mb="2">
              {stat.league.name} {stat.league.season}
            </Text>
            <Image src={stat.league.logo} alt="League Logo" boxSize="50px" mb="2" />
            <Text>
              <strong>League:</strong> {stat.league.name}
            </Text>
            <Text>
              <strong>Team:</strong> {stat.team.name}
            </Text>
            <Text>
              <strong>Form:</strong> {stat.form}
            </Text>
            {/* Other stats */}
          </Box>
        ))
      )}
    </Box>
  );
};

export default TeamStats;
