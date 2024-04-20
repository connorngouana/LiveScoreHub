import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Image, Text, Spinner, IconButton } from '@chakra-ui/react';
import { FaChevronLeft , FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const FootballNews = () => {
    const [footballNews, setFootballNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        fetchFootballNews();
        const interval = setInterval(() => {
            setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % footballNews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [footballNews]);

    const fetchFootballNews = async () => {
        try {
            const options = {
                method: 'GET',
                url: 'https://transfermarket.p.rapidapi.com/news/list-latest',
                params: { domain: 'com' },
                headers: {
                    'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
                    'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com'
                }
            };
        
            const response = await axios.request(options);
            setFootballNews(response.data.news); // Set footballNews to the actual news data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching football news:', error);
            setError('Error fetching football news. Please try again later.');
            setLoading(false);
        }
    };

    const handleNextNews = () => {
        setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % footballNews.length);
    };

    const handlePrevNews = () => {
        setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + footballNews.length) % footballNews.length);
    };

    return (
        <Box
            position="relative"
            p="4"
            boxShadow="md"
            bg="white"
            width="100%"
            maxW="800px"
            margin="0 auto"
        >
            <Box mb="4">
                <img src={footballNews[currentNewsIndex]?.newsSpotlightFirstImage} alt={footballNews[currentNewsIndex]?.newsHeadline} boxSize="100%" />
            </Box>
            
            <IconButton
                aria-label="Previous"
                icon={<FaChevronLeft />}
                onClick={handlePrevNews}
                position="absolute"
                top="50%"
                left="20px"
                transform="translateY(-50%)"
                colorScheme="blue"
                variant="outline"
                size="lg"
            />

            <IconButton
                aria-label="Next"
                icon={<FaChevronRight />}
                onClick={handleNextNews}
                position="absolute"
                top="50%"
                right="20px"
                transform="translateY(-50%)"
                colorScheme="blue"
                variant="outline"
                size="lg"
            />

            <Box px="4">
                <Text fontSize="2xl" fontWeight="bold" mb="2">
                    {footballNews[currentNewsIndex]?.newsHeadline}
                </Text>
                <Text fontSize="sm" color="gray.500" mb="2">
                    {footballNews[currentNewsIndex]?.newsDate} | {footballNews[currentNewsIndex]?.newsSource}
                </Text>
                <Text fontSize="lg" mb="4">
                    {footballNews[currentNewsIndex]?.newsTeaser}
                </Text>
                
                <Link to={`/news/${footballNews[currentNewsIndex]?.id}`} style={{ fontSize: 'sm', color: 'blue', fontWeight: 'bold' }}>
                    Read more
                </Link>
            </Box>

            {loading && (
                <Box textAlign="center" mt="4">
                    <Spinner size="xl" />
                    <Text mt="4">Loading football news...</Text>
                </Box>
            )}

            {error && (
                <Box textAlign="center" mt="4">
                    <Text color="red.500">{error}</Text>
                </Box>
            )}
        </Box>
    );
};

export default FootballNews;
