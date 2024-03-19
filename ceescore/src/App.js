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
import SignOut from "./Pages/SignOut";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { UserContextProvider } from "./component/userContext/userContext";


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
      <NavBar name = {name} setName= {setName}/>    
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Favourite" element={<Favourite />} />
        <Route path="/Scores" element={<Scores />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Profiles" element={() => <Profiles name ={name}/>} />
        <Route path="/SignOut" element={<SignOut />} />
        </Routes>
      </Router>
      </UserContextProvider>
  );
}

export default App;
