import "./App.css";
import React, {useEffect, useState} from "react";
import NavBar from "./component/NavBar";
import Favourite from "./Pages/Favourite";
import Home from "./Pages/Home";
import Scores from "./Pages/Scores";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";
import SignUp from "./Pages/SignUp";
import Profiles from "./Pages/Profiles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { UserContextProvider } from "./component/userContext/userContext";
import ChatProvider from "./component/userContext/ChatProvider";
import { ChakraProvider } from '@chakra-ui/react';
import Quiz from "./Pages/Quiz";
import Play from "./component/QuizComponents/Play";
import QuizSummary from "./component/QuizComponents/QuizSummary";
import ReadMe from "./component/NewsFolder/NewsText";

function App() {
  const [name, setName] = useState('');

  useEffect(() => {
    (
     async () => {
        const response = await fetch('http://localhost:5000/auth/profiles', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const content = await response.json(); //content is the user
        setName(content.name);

      }
    )();
    });

  return (
    
    <UserContextProvider >
    <Router>
    <ChakraProvider>
    <ChatProvider >
      <NavBar name = {name} setName= {setName}/>    
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Favourite" element={<Favourite />} />
        <Route path="/Scores" element={<Scores />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Profiles" element={<Profiles name ={name} setName= {setName}/>} />
        <Route path="/Quiz" element={<Quiz name ={name} setName= {setName}/>} />
        <Route path="/Play" element={<Play />} />
        <Route path="/QuizSummary" element={<QuizSummary />} />
        <Route path="/news/:id" element={<ReadMe />} />
        </Routes>
        </ChatProvider>
        </ChakraProvider>
      </Router>
      </UserContextProvider>
      
  );
}

export default App;
