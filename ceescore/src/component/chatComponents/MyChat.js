import React, { useEffect, useState } from 'react';
import { ChatState } from '../userContext/ChatProvider';
import { Box, Stack, Text, useToast, Button } from '@chakra-ui/react'; // Import ChakraProvider
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic';
import GroupChatModal from './GroupChatModal';

function MyChat({fetchAgain}) {
  const { selectedChat, setSelectedChat, setChats, chats, user,token } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      
      const { data } = await axios.get('http://localhost:5000/chat/fetchchat', config);
      setChats(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching chats:', error.message);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChat();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }} // Use 'display' instead of 'd'
      flexDirection="column" // Use 'flexDirection' instead of 'flexDir'
      alignItems="center"
      padding={3} // Use 'padding' instead of 'p'
      bg="white"
      width={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display="flex" // Use 'display' instead of 'd'
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
      
        My Chats
        <GroupChatModal>
          <Button
            display="flex" // Use 'display' instead of 'd'
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex" // Use 'display' instead of 'd'
        flexDirection="column"
        padding={3} // Use 'padding' instead of 'p'
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                marginBottom={2} // Add margin bottom for spacing between chat items
              >
              <Text>
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </Text>              
            </Box>
            ))}
          </Stack>
        ) : (
          // Render loading component if chats are not available
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
export default MyChat;
