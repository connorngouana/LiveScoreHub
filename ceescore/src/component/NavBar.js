import React, {  useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/main.css";
import { NavLink } from "react-router-dom"; // Update import here
import { ChatState } from "./userContext/ChatProvider";
import {  ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar,  Button, Menu, MenuButton, MenuList,MenuItem,  Text, Flex, Spacer, MenuDivider } from '@chakra-ui/react';
import ProfileModel from "./chatComponents/ProfileModel";
import axios from 'axios';

function NavBar(props) {
  const navRef = useRef();
  const { user } = ChatState();

  
    const handleLogout = async () => {
      try {
        const response = await axios.post("http://localhost:5000/auth/Logout", {}, {
          withCredentials: true 
        });
  
        if (response.status === 200) {
          window.location = "/"; 
        } else {
          console.error("Failed to logout");
        }
      } catch (error) {
        console.error("Error occurred during logout:", error);
      }
    };
  
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
        <NavLink to="/Quiz">Quiz</NavLink>
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
      <NavLink to="/Quiz">Quiz</NavLink>
      <Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon color={'white'} />} bg="transparent" border="none" >
    <Flex alignItems="center">
      <Spacer /> 
      <Avatar src={user.picture} boxSize="40px" />
      <Text color='white' ml={2} fontSize="large">{user.name}</Text>
    </Flex>
  </MenuButton>

  <MenuList bg="white" color="black">
  <ProfileModel user= {user}>
  <MenuItem>My Profile</MenuItem>{" "}
  </ProfileModel>
  <MenuDivider/>
  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
  </MenuList>
</Menu>

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
