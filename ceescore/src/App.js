import "./App.css";
import React from "react";
import NavBar from "./component/NavBar";
import Favourite from "./Pages/Favourite";
import Home from "./Pages/Home";
import Scores from "./Pages/Scores";
import Login from "./Pages/Login";
import About from "./Pages/About";
import SignUp from "./Pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

function App() {
  return (
    <Router>
      <NavBar />  
      <Scores />   
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Favourite" element={<Favourite />} />
        <Route path="/Scores" element={<Scores />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/About" element={<About />} />
        <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </Router>
  );
}

export default App;
