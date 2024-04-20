import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BellIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, effect, useDisclosure } from '@chakra-ui/react';
import { ChatState } from '../userContext/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender, getSenderFull } from '../../config/ChatLogic';
import { Badge } from '@chakra-ui/react'

function ChatsSideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { token, setSelectedChat, user,chats,notification, setNotification, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Use the entire user object containing the JWT token
        },
        withCredentials: true, // Allow sending cookies with the request
      };

      const response = await axios.get(`http://localhost:5000/auth/allUser?search=${search}`, config);
      setSearchResult(response.data); 
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
  try{
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // Use the entire user object containing the JWT token
      },
      withCredentials: true, // Allow sending cookies with the request
    };
      
      const {data} = await axios.post(`http://localhost:5000/chat/accesschat`, {userId}, config);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

  }catch (error) {
    toast({
      title: "Error Occurred!",
      description: "Failed to Create the Chat",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });  
  }
  };

  return (
    <>
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
        <Tooltip  label="Search Users to chat" hasArrow placement="bottom-end">
          <Button fontSize="xl" variant="ghost" onClick={onOpen} leftIcon={<FaSearch  /> } px={2}>
            <Text  display={{ base: 'none', md: 'inline-block' }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Work Sans" fontWeight="bold">
          CeeTalksScores
        </Text>
        <Menu>
          <MenuButton p={1} >
          <Badge fontSize="2xl" colorScheme="black" variant="solid">
          {notification.length}
        </Badge>
        <BellIcon fontSize="3xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
          {!notification.length && "No New Messages"}
          {notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}
            >
              {notif.chat.isGroupChat
                ? `New Message in ${notif.chat.chatName}`
                : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}
        </MenuList>

        </Menu>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent >
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder=" Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
              {loadingChat && <Spinner ml="auto" d="flex" />}

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ChatsSideDrawer;
