import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Image, Text, Spinner, Flex, Button } from '@chakra-ui/react';

const PlayerStats = ({ teamId }) => {
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPlayerStats = async (page) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {
                    team: teamId,
                    season: '2023',
                    page: page
                },
                headers: {
                    'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            return response.data.response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const loadPlayerStats = async (page) => {
        setLoading(true);
        try {
            const data = await fetchPlayerStats(page);
            setPlayerStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlayerStats(currentPage);
    }, [teamId, currentPage]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <Box>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                marginBottom="4"
                boxShadow="md"
                backgroundColor="white"
                width="100%"
            >
                {playerStats.map((player, index) => (
                    <Box key={index} mb="4">
                        <Text fontSize="xl" fontWeight="semibold" mb="2">
                            {player.player.name}
                        </Text>
                        <Image src={player.player.photo} alt={player.player.name} boxSize="50px" mb="2" />
                        <Text>
                            <strong>Position:</strong> {player.statistics[0]?.games.position}
                        </Text>
                        <Text>
                        <strong>Appearences:</strong> {player.statistics[0]?.games.appearences}
                        </Text>
                        <Text>
                            <strong>Goals:</strong> {player.statistics[0]?.goals.total}
                        </Text>
                        <Text>
                            <strong>Assists:</strong> {player.statistics[0]?.goals.assists}
                        </Text>
                        <Text>
                            <strong>Yellow Cards:</strong> {player.statistics[0]?.cards.yellow}
                        </Text>
                        <Text>
                            <strong>Red Cards:</strong> {player.statistics[0]?.cards.red}
                        </Text>
                    </Box>
                ))}
                <Flex justifyContent="flex-end">
                    {currentPage > 1 && (
                        <Button onClick={prevPage} mr="2">
                            Previous Page
                        </Button>
                    )}
                    <Button onClick={nextPage}>Next Page</Button>
                </Flex>
            </Box>
            {loading && (
                <Box textAlign="center">
                    <Spinner size="xl" />
                    <Text mt="4">Loading player stats...</Text>
                </Box>
            )}
        </Box>
    );
};

export default PlayerStats;
