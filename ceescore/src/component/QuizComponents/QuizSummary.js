import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaTrophy } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button, Heading, Box, Text, Flex, Grid, GridItem } from '@chakra-ui/react';

const QuizSummary = () => {
    const location = useLocation();
    const playerStats = location.state.playerStats;
    const [scorePercentage, setScorePercentage] = useState(0);

    useEffect(() => {
        // Calculate score percentage
        if (playerStats) {
            const scorePercentageValue = (playerStats.score / playerStats.numberOfQuestions) * 100;
            setScorePercentage(scorePercentageValue);
        }
    }, [playerStats]);
    console.log(playerStats)
    let stats, message;
    if (playerStats) {
        if (scorePercentage < 30) {
            message = "You have no ball knowledge.";
        } else if (scorePercentage >= 30 && scorePercentage < 50) {
            message = "You need to watch more ball.";
        } else if (scorePercentage >= 50 && scorePercentage < 70) {
            message = "You know ball okayyy.";
        } else {
            message = "Congratulations! You have Elite Ball Knowledge.";
        }

        stats = (
            <Flex direction="column" align="center" mt="2rem">
                <Box mb="4" fontSize="7xl">
                    <FaTrophy color="gold" />
                </Box>
                <Heading as="h1" mb="4">Quiz has Ended</Heading>
               
                <Box p="4" borderWidth="2px" borderRadius="lg" maxW="600px" textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" mb="2">{message}</Text>
                    <Heading as="h2" textAlign="center" fontSize="3xl" fontWeight="bold" mb="4" color={scorePercentage >= 70 ? "green.500" : "inherit"}>Your Score: {scorePercentage.toFixed(2)}%</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb="4">

                        <GridItem textAlign="left">
                            <Text fontSize="xl">Number of Questions:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.numberOfQuestions}</Text>
                        </GridItem>
                        <GridItem textAlign="left">
                            <Text fontSize="xl">Number of Answered Questions:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.numberOfAnsweredQuestions}</Text>
                        </GridItem>
                        <GridItem textAlign="left">
                            <Text fontSize="xl">Correct Answers:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.correctAnswers}</Text>
                        </GridItem>
                        <GridItem textAlign="left">
                            <Text fontSize="xl">Wrong Answers:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.wrongAnswers}</Text>
                        </GridItem>
                        <GridItem textAlign="left">
                            <Text fontSize="xl">Used Fifty Fifty:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.usedFiftyFifty ? "Yes" : "No"}</Text>
                        </GridItem>
                        <GridItem textAlign="left">
                            <Text fontSize="xl">Hints Used:</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text fontSize="xl">{playerStats.hintsUsed}</Text>
                        </GridItem>
                    </Grid>
                    <Flex mt="4" justifyContent="center">
                        <NavLink to="/Quiz">
                            <Button colorScheme="blue" size="lg" mr="2">Play Again</Button>
                        </NavLink>
                        <NavLink to="/">
                            <Button colorScheme="blue" size="lg">Back to Home</Button>
                        </NavLink>
                    </Flex>
                </Box>
            </Flex>
        );
    } else {
        stats = (
            <Flex direction="column" align="center">
                <Heading as="h1" mb="4">No statistics</Heading>
                <NavLink to="/Quiz">
                    <Button colorScheme="blue" size="lg" mb="2">Take a Quiz</Button>
                </NavLink>
                <NavLink to="/">
                    <Button colorScheme="blue" size="lg">Back to Home</Button>
                </NavLink>
            </Flex>
        );
    }

    return (
        <Flex justify="center" align="flex-start" height="100vh">
            {stats}
        </Flex>
    );
};

export default QuizSummary;
