import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChatState } from '../component/userContext/ChatProvider';
import { Heading, Text, Button, Center } from '@chakra-ui/react';

const Quiz = () => {
  const { user, token } = ChatState();

  return (
    <Center h="100vh">
      <div>
        <Heading as="h1" mb="8" textAlign="center" fontSize="4xl">Quiz</Heading>
        {!token ? (
          <div textAlign="center" mb="8">
            <Text mb="4" fontSize="xl">Hi User, do you want to play a quiz? Make sure to Login/SignUp to play</Text>
            <Center>
              <NavLink to="/Login">
                <Button colorScheme="blue" mr="2" size="lg">Login</Button>
              </NavLink>
              <NavLink to="/Signup">
                <Button colorScheme="blue" size="lg">SignUp</Button>
              </NavLink>
            </Center>
          </div>
        ) : (
          <div textAlign="center" mb="8">
            <Text mb="4" fontSize="xl">Hi {user.name}, do you want to play a quiz? To test your ball knowledge</Text>
            <Center>
              <NavLink to="/Play">
                <Button colorScheme="blue" size="lg">Play</Button>
              </NavLink>
            </Center>
          </div>
        )}
      </div>
    </Center>
  );
};

export default Quiz;
