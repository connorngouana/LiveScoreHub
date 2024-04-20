import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useToast, Box, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react"

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [picture, setPicture] = useState(null); // Change initial state of picture to null
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const preset_key = "CeeScoresLive";

  const handleFile = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", preset_key);
    formData.append("cloud_name", ''); // Add your cloud name here
    axios.post('https://api.cloudinary.com/v1_1/dpyjgwmcg/image/upload', formData)
      .then(response => {
        setPicture(response.data.url);
      })
      .catch(err => {
        console.error("Cloudinary upload error:", err.response.data);
      });
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        name,
        email,
        password,
        picture: picture // Send picture URL in the request body
      });
      console.log('User registered:', response.data);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      width="300px"
      margin="auto"
      marginTop="50px" // Adjust this value to move the box higher
    >
      <Text fontSize="2xl" mb={4}>Sign Up</Text>
      <form onSubmit={handleSignUp}>
        <FormControl id="name" isRequired>
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="email" mt={4} isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="password" mt={4} isRequired>
          <FormLabel>Password:</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        
          <FormLabel>Picture:</FormLabel>
          <Input
            type="file"
            onChange={handleFile}
            accept="image/jpeg, image/png"
          />
        {error && <Text mt={4} color="red.500">{error}</Text>}
        <Button mt={4} colorScheme="blue" type="submit" width="100%" isLoading={loading}>Sign Up</Button>
      </form>

      <Box mt={4}>
        <Button
          colorScheme="green"
          onClick={() => {
            setName("Guest")
            setEmail("guest@example.com");
            setPassword("123456");
          }}
          width="100%"
        >
          Guest User
        </Button>
      </Box>

      <Text mt={4}>
      Already have an account? <Link to="/login" textDecoration="underline" color="blue.500">Login</Link>
    </Text>
    </Box>
  );
}

export default SignUp;
