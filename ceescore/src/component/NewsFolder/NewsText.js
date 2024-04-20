import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Image, Center, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const ReadMe = () => {
    const { id } = useParams();
    const [newsDetail, setNewsDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            const options = {
                method: 'GET',
                url: 'https://transfermarket.p.rapidapi.com/news/detail',
                params: { id },
                headers: {
                    'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
                    'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                setNewsDetail(response.data.news);
                console.log(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error fetching news detail. Please try again later.');
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    return (
        <Center>
            <Box maxW="xl" width="200%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md">
                {loading && (
                    <Center>
                        <Spinner />
                    </Center>
                )}
                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                {newsDetail && (
                    <>
                        <Heading as="h2" size="lg" mb={4}>
                            {newsDetail.headline}
                        </Heading>
                        {newsDetail.heroImage && (
                            <Image src={newsDetail.heroImage} alt="Hero Image" borderRadius="md" mb={4} />
                        )}
                        {newsDetail.text && Object.values(newsDetail.text).map((item, index) => (
                            <Text key={index} mb={2} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </>
                )}
            </Box>
        </Center>
    );
};

export default ReadMe;
