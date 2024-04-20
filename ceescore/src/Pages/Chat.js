import React, { useState } from 'react';
import { ChatState } from '../component/userContext/ChatProvider';
import ChatsSideDrawer from '../component/chatComponents/ChatsSideDrawer';
import ChatsBox from '../component/chatComponents/ChatsBox';
import MyChat from '../component/chatComponents/MyChat';
import { Box, Text, Button, Center, Heading} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

function Chat() {
  const { token } = ChatState();
  const [fetchAgain, setFetchAagain] = useState(false);
  
  return (
    <div style={{ height: '100vh' }}> {/* Set the height of the container to the full height of the viewport */}
      {token ? (
        <>
          <ChatsSideDrawer />
          <Box display="flex" justifyContent="space-between" width="100%" height="80vh" padding="10px"> {/* Adjust the height here */}
            <MyChat fetchAgain={fetchAgain} /> 
            <ChatsBox fetchAgain={fetchAgain} setFetchAagain={setFetchAagain} />
          </Box>
        </>
      ) : (
        
        <Center h="100vh">
        
        <Box textAlign="center" mb="8">
        <Heading as="h1" mb="8" textAlign="center" fontSize="4xl">Chat</Heading> 
        <Text mb="4" fontSize="2xl">Hi User, do you want to use the chat? Make sure to Login/SignUp to chat</Text>
          <NavLink to="/Login">
            <Button colorScheme="blue" mr="2" size="lg">Login</Button>
          </NavLink>
          <NavLink to="/Signup">
            <Button colorScheme="blue" size="lg">SignUp</Button>
          </NavLink>
        </Box>
        </Center>
      )}
    </div>
  );
}

export default Chat;
