import React, { useEffect, useState } from 'react';
import { FaHeart, FaSearch, FaTimes } from 'react-icons/fa';
import { Badge, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useToast, Center, Heading } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from '../component/chatComponents/ChatLoading';
import TeamListItem from '../component/UserAvatar/TeamListItem';
import FavouriteFixtures from '../component/FavouriteComponents/FavouriteFixtures';
import TeamStats from '../component/FavouriteComponents/TeamStats';
import { ChatState } from '../component/userContext/ChatProvider';
import { NavLink } from 'react-router-dom';

function Favourite() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user, favoritedTeams, setFavoritedTeams } = ChatState();
  const toast = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filteredTeamId, setFilteredTeamId] = useState(null);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/teams', {
        params: { search: search },
        headers: {
          'X-RapidAPI-Key': 'c7618f6f8dmshc50da69e38166b4p1e4c8ajsna8d3028a598f',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          Authorization: `Bearer ${token}`
        }
      });
      setSearchResult(response.data.response || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to search favorites. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleFavorite = async (teamId, clubName) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      
      await axios.post('http://localhost:5000/favourites/addFavoriteTeam', { userId: user._id, teamId, clubName }, config);
      toast({
        title: "Success",
        description: `${clubName} added to favorites!`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      handleGetClub();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add club to favorites.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleRemoveFavorite = async (clubId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:5000/favourites/removeFavoriteTeam/${clubId}`, config);
      toast({
        title: "Success",
        description: "Favorite team removed successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      handleGetClub();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite team.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleFavoriteClick = async (teamId, clubName) => {
    try {
      setFilteredTeamId(teamId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetClub();
  }, [token]);

  const handleGetClub = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.get(`http://localhost:5000/favourites/fetchclub`, config);
      setFavoritedTeams(data);
      toast({
        title: "Success",
        description: "Fetched the clubs successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
     
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      {!token ? (
        <Center>
          <div textAlign="center" mb="8">
          <Heading as="h1" mb="8" textAlign="center" fontSize="4xl">Favorite</Heading>
            <Text mb="4" fontSize="2xl">Hi User, do you want to view your favorite clubs? Make sure to Login/SignUp to view</Text>
            <Center>
              <NavLink to="/Login">
                <Button colorScheme="blue" mr="2" size="lg">Login</Button>
              </NavLink>
              <NavLink to="/Signup">
                <Button colorScheme="blue" size="lg">SignUp</Button>
              </NavLink>
            </Center>
          </div>
        </Center>
      ) : (
        <Box flex="2">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="rgb(0, 234, 255)"
            w="100%"
            p="10px"
            borderWidth="2px"
            borderRadius="md"
            boxShadow="md"
          >
            <Tooltip label="Search Clubs to favorite" hasArrow placement="bottom-end">
              <Button fontSize="xl" variant="ghost" leftIcon={<FaSearch />} px={2} onClick={() => setIsDrawerOpen(true)}>
                <Text display={{ base: 'none', md: 'inline-block' }}>Search Club</Text>
              </Button>
            </Tooltip>
            <Text fontSize="3xl" fontFamily="Work Sans" fontWeight="bold">
              CeeFavouriteClubs
            </Text>
            <Menu>
              <Box display="flex" alignItems="center" >
                <MenuButton p={1}>
                  <FaHeart fontSize="4xl" m={1} />
                </MenuButton>
                <Badge fontSize="2xl" colorScheme="black" variant="solid" ml={1}>
                  {favoritedTeams.length}
                </Badge>
              </Box>
              <MenuList pl={2}>
                {favoritedTeams.map((team) => (
                  <MenuItem key={team.clubId} display="flex" justifyContent="space-between" onClick={() => handleFavoriteClick(team.clubId, team.clubName)}>
                    <Text>{team.clubName}</Text>
                    <FaTimes height="16px" width="16px" onClick={() => handleRemoveFavorite(team.clubId)} />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        
          <Drawer placement='left' onClose={() => setIsDrawerOpen(false)} isOpen={isDrawerOpen}>
            <DrawerOverlay />
            <DrawerContent maxW="30vw">
              <DrawerHeader borderBottomWidth="1px">Search Clubs</DrawerHeader>
              <DrawerBody>
                <Box d="flex" flexDir="column" pb={2}>
                  <Input
                    placeholder=" Search by club name"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult.map((team, index) => (
                    <TeamListItem
                      key={index}
                      team={team}
                      handleFunction={() => handleFavorite(team.team.id, team.team.name)}
                    />
                  ))
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        
          <Box >
            <FavouriteFixtures teamId={filteredTeamId} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Favourite;
