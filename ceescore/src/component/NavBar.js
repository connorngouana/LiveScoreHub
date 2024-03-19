import React, { useContext, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/main.css";
import { UserContext } from "./userContext/userContext";
import { NavLink } from "react-router-dom"; // Update import here
import { Nav, NavDropdown } from "react-bootstrap";
import SignOut from "../Pages/SignOut";

function NavBar(props) {
  const navRef = useRef();
  const { isLoggedIn } = useContext(UserContext);

  const showNavBar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  function handleClick() {
    window.location = "/";
  }

  let menu;

  if (!props.name) {
    menu = (
      <nav ref={navRef}>
        <NavLink to="/Scores">Scores</NavLink>
        <NavLink to="/Favourite">Favourites</NavLink>
        <NavLink to="/Chat">Chat</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/SignUp">SignUp/Login</NavLink>
      <button className="nav-btn nav-close-btn" onClick={showNavBar}>
      <FaTimes />
    </button>

      </nav>
    )
  } else {
    menu = (
      <nav ref={navRef}>
      <NavLink to="/Scores">Scores</NavLink>
      <NavLink to="/Favourite">Favourites</NavLink>
      <NavLink to="/Chat">Chat</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/SignOut" onClick={<SignOut />}>
        SignOut
      </NavLink>
    <button className="nav-btn nav-close-btn" onClick={showNavBar}>
    <FaTimes />
  </button>
   </nav>
    );
  }

  return (
    <header>
      <button className="HomeButton" onClick={handleClick}>
        CeeScoresLive
      </button>
      {menu}
      <button className="nav-btn" onClick={showNavBar}>
      <FaBars />
    </button>
    </header>
  );
}

export default NavBar;
