import React, { useState, useEffect } from 'react';
import { Button, Box, Heading, Flex, Text, useToast } from '@chakra-ui/react';
import { FaClock, FaDice, FaLightbulb } from 'react-icons/fa';
import questions from "../QuizComponents/Questions.json"; 
import { useNavigate } from 'react-router';

const Play = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [score, setScore] = useState(0);
    const [numberOfAnsweredQuestions, setNumberOfAnsweredQuestions] = useState(0);
    const [hints, setHints] = useState(5);
    const [fiftyfifty, setFiftyFifty] = useState(2);
    const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
    const [time, setTime] = useState({});
    const [previousButtonDenied, setPreviousButtonDenied] = useState(true);
    const [nextButtonDenied, setNextButtonDenied] = useState(false);
    const [timerInterval, setTimerInterval] = useState(null); // Store interval reference

    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        selectQuestions();
        const interval = startTimer(); // Start the timer when component mounts
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        if (selectedQuestions.length > 0) {
            displayQuestion();
        }
    }, [currentQuestionIndex, selectedQuestions]);

    useEffect(() => {
        // Handle disable button logic when currentQuestionIndex changes
        handleDisableButton();
    }, [currentQuestionIndex]);

    const selectQuestions = () => {
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        const selected = shuffledQuestions.slice(0, 15);
        setSelectedQuestions(selected);
    };

    const displayQuestion = () => {
        setCurrentQuestion(selectedQuestions[currentQuestionIndex]);
        showOptions();
    };
    
    const handleNextButtonClick = () => {
        if (currentQuestionIndex === selectedQuestions.length - 1) {
            // Show toast error when trying to go next on the last question
            toast({
                title: "Error",
                description: "You have reached the last question.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            if (selectedQuestions[currentQuestionIndex].answered) {
                setNumberOfAnsweredQuestions(numberOfAnsweredQuestions + 1);
            }
            setUsedFiftyFifty(false); // Reset the usedFiftyFifty state
        }
    };
    
    const handlePreviousButtonClick = () => {
        if (currentQuestionIndex === 0) {
            // Show toast error when trying to go previous on the first question
            toast({
                title: "Error",
                description: "You are on the first question.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    
    const handleDisableButton = () => {
        setPreviousButtonDenied(currentQuestionIndex === 0);
        setNextButtonDenied(currentQuestionIndex === selectedQuestions.length - 1);
    };
    

    const handleQuit = () => {
        if (window.confirm('Are you sure you want to quit')) {
            navigate('/');
        }
    };

    const handleClick = (e) => {
        const selectedAnswer = e.target.innerHTML;
        if (selectedAnswer === currentQuestion.answer) {
            correctAnswer();
        } else {
            wrongAnswer();
        }
    };

    const showOptions = () => {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    };

    const handleHints = () => {
        if (hints > 0) {
            const options = document.querySelectorAll('.option');
            const correctOption = currentQuestion.answer;
            const incorrectOptions = Array.from(options).filter(option => option.innerHTML !== correctOption && option.style.visibility !== 'hidden');
            if (incorrectOptions.length > 0) {
                const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
                incorrectOptions[randomIndex].style.visibility = 'hidden';
                setHints(hints - 1);
            } else {
                toast({
                    title: "No More Incorrect Options to Hide!",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "No Hints Left!",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleFiftyFifty = () => {
        if (fiftyfifty > 0 && !usedFiftyFifty) {
            const options = document.querySelectorAll('.option');
            const correctOption = currentQuestion.answer;

            let indexofAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === correctOption.toLowerCase()) {
                    indexofAnswer = index;
                }
            });
            let randomIndexes = [];
            while (randomIndexes.length < 2) {
                const randomNumber = Math.floor(Math.random() * 4);
                if (randomNumber !== indexofAnswer && !randomIndexes.includes(randomNumber)) {
                    randomIndexes.push(randomNumber);
                }
            }
            randomIndexes.forEach(index => {
                options[index].style.visibility = 'hidden';
            });
            setFiftyFifty(fiftyfifty - 1);
            setUsedFiftyFifty(true);

            toast({
                title: "50/50 Hint Used!",
                description: "Two incorrect options have been hidden.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "No 50/50 Hints Left!",
                description: "You have used all available 50/50 hints.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    
    const startTimer = () => {
        let countdownTime = Date.now() + 300000;
        const interval = setInterval(() => {
            const now = Date.now();
            const distance = countdownTime - now;
    
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            if (distance < 0) {
                clearInterval(interval);
                setTime({ minutes: 0, seconds: 0 });
               endGame();
            } else {
                setTime({ minutes, seconds });
            }
        }, 1000);
        setTimerInterval(interval); // Store the interval reference
        return interval; // Return interval reference for cleanup
    };
    
    const correctAnswer = () => {
        toast({
            title: "Correct Answer!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        setScore(score + 1);
        setNumberOfAnsweredQuestions(numberOfAnsweredQuestions + 1);
        if (currentQuestionIndex === selectedQuestions.length - 1) {
            endGame(); 
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            displayQuestion();
        }
    };
    
    const wrongAnswer = () => {
        toast({
            title: "Wrong Answer!",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        setNumberOfAnsweredQuestions(numberOfAnsweredQuestions + 1);
        if (currentQuestionIndex === selectedQuestions.length - 1) {
            endGame();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            displayQuestion();
        }
    };

    const endGame = () => {
        const playerStats = {
            score: score,
            numberOfQuestions: selectedQuestions.length,
            numberOfAnsweredQuestions: numberOfAnsweredQuestions,
            correctAnswers: score,
            wrongAnswers: numberOfAnsweredQuestions - score,
            usedFiftyFifty: usedFiftyFifty,
            hintsUsed: hints < 5 ? 5 - hints : 0
        };
        clearInterval(timerInterval); // Clear the timer interval
        setTimeout(() => {
            alert('Quiz is over! Well Done')
            navigate('/QuizSummary',  { state: { playerStats } }); // Pass playerStats as a prop
        }, 1000);
    };
    
    return (
        <Box p={6}>
            <Heading as="h1" mb={6} textAlign="center">
                Quiz Page
            </Heading>
            <Flex justifyContent="space-between" mb={6}>
                <Box>
                    <Flex alignItems="center">
                        <FaDice onClick={handleFiftyFifty} />
                        <Text ml={2}>{fiftyfifty}</Text>
                    </Flex>
                </Box>
                <Box>
                    <Flex alignItems="center">
                        <FaLightbulb onClick={handleHints} />
                        <Text ml={2}>{hints}</Text>
                    </Flex>
                </Box>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Text>
                    <span>{`${currentQuestionIndex + 1} of ${selectedQuestions.length}`}</span>
                </Text>
                <Text>
                    <FaClock /> {time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}
                </Text>
            </Flex>
            <Box mb={6}>
                <Flex justifyContent="center" mb={4}>
                    <Heading as="h5">{currentQuestion.question}</Heading>
                </Flex>
                <Flex flexDirection="column">
                    <Button onClick={handleClick} className="option" variant="outline" mb={2}>{currentQuestion.optionA}</Button>
                    <Button onClick={handleClick} className="option" variant="outline" mb={2}>{currentQuestion.optionB}</Button>
                    <Button onClick={handleClick} className="option" variant="outline" mb={2}>{currentQuestion.optionC}</Button>
                    <Button onClick={handleClick} className="option" variant="outline" mb={2}>{currentQuestion.optionD}</Button>
                </Flex>
            </Box>
            <Flex justifyContent="space-between">
                <Button variant="outline" onClick={handlePreviousButtonClick} disabled={previousButtonDenied}>Previous</Button>
                <Button onClick={handleNextButtonClick} disabled={nextButtonDenied}>Next</Button>
                <Button onClick={handleQuit} variant="outline">Quit</Button>
            </Flex>
        </Box>
    );
};

export default Play;

