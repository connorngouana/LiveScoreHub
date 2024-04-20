import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      console.log('User Login Complete:', response.data);

      // Save the token in cookies
      document.cookie = `jwt=${response.data.token};`;
      
      navigate('/');
      window.location.reload();
      
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box
        p={4}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        width="300px"
        margin="auto"
        marginTop="50px" // Adjust this value to move the box higher
      >
        <Text fontSize="2xl" mb={4}>
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mt={4} isRequired>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {error && (
            <Text mt={4} color="red.500">
              {error}
            </Text>
          )}
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            width="100%"
          >
            Login
          </Button>
        </form>
        <Box mt={4}>
          <Button
            colorScheme="green"
            variant="outline"
            onClick={() => {
              setEmail('guest@example.com');
              setPassword('123456');
            }}
            width="100%"
          >
            Guest User
          </Button>
        </Box>
        <Flex mt={4} align="center">
          <Box flex="1" borderBottom="1px" borderColor="gray.300" />
          <Text px={2} color="gray.500">OR</Text>
          <Box flex="1" borderBottom="1px" borderColor="gray.300" />
        </Flex>
        <Button
          as={Link}
          to="/SignUp"
          mt={4}
          colorScheme="blue"
          variant="solid"
          width="100%"
        >
          Sign Up
        </Button>
      </Box>
    </Flex>
  );
}

export default Login;
