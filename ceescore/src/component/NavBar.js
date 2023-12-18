
import { useRef } from "react";
import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/main.css";
import {NavLink} from "react-router-dom"

function NavBar() {
  const navRef = useRef();
  const loginRef = useRef();


  const showNavBar = () => {
    navRef.current.classList.toggle("responsive_nav");
    loginRef.current.classList.toggle("responsive_nav");
  
  };

  function handleClick() {
    window.location = "/";
  }
  
  function LoginClick() {
    window.location = "/Login";
  }

  return (
    <header>
      <button className="HomeButton" onClick={handleClick}>
        CeeScoresLive
      </button>
      <nav ref={navRef}>

        <NavLink to="/Scores">Scores</NavLink>
        <NavLink to="/Favourite">Favourites</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <button className="nav-btn nav-close-btn" onClick={showNavBar}>
          <FaTimes />
        </button>
      </nav>
    
      <button ref={loginRef} onClick={LoginClick}className="login">Login/Sign Up</button>
      
      <button className="nav-btn" onClick={showNavBar}>
        <FaBars />
      </button>
    </header>
  );
}

export default NavBar;