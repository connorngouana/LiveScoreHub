import React, { useEffect, useState } from 'react';
import { ChatState } from '../userContext/ChatProvider';
import { Box, Flex, FormControl, IconButton, Input, Spacer, Spinner, Text, useToast } from '@chakra-ui/react';
import { getSender, getSenderFull } from '../../config/ChatLogic';
import ProfileModal from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import "./messages.css";
import ScrollableChats from './ScrollableChats'; // Check if it should be ScrollableChats
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../chatComponents/Animations/Typing.json'
const ENDPOINT = `http://localhost:5000`;
var socket, selectedChatCompare;

const SingleChat = ({ fetchChat, setFetchChat }) => {
    const { token, notification, setNotification, selectedChat, setSelectedChat, user } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();
    
    //USED TO DISPLAY THE LOADING ICON FROM LOTTIE I IMPORTED
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };



    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage.trim()) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    `http://localhost:5000/messages/sendmessage`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                
                socket.emit('new message' , data)
                
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected" ,() => setSocketConnected(true));
        socket.on("typing", ()=>setIsTyping(true));
        socket.on("stop typing", ()=>setIsTyping(false));
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`http://localhost:5000/messages/allmessages/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification([newMessageRecieved, ...notification]);
              
            }
          } else {
            setMessages([...messages, newMessageRecieved]);
          }
        });
      });
    
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 2000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
;


return (
    <>
        {selectedChat ? (
            <>
            <Flex
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            justifyContent="space-between"
            alignItems="center"
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
            />
            <Spacer />
            {!selectedChat.isGroupChat ? (
                <Flex flexGrow={1} justifyContent="center" alignItems="center">
                    <Text textAlign="center" flex="1">{getSender(user, selectedChat.users)}</Text>
                    <Spacer />
                    <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                        display="flex"
                    />
                </Flex>
            ) : (
                <Flex flexGrow={1} justifyContent="center" alignItems="center">
                    <Text textAlign="center" flex="1">{selectedChat.chatName.toUpperCase()}</Text>
                    <Spacer />
                    <UpdateGroupChatModal
                        fetchAgain={fetchChat}
                        setFetchAgain={setFetchChat}
                        fetchMessages={fetchMessages}
                    />
                </Flex>
            )}
            
        </Flex>
                <Box
                    d="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100vh"
                    position="relative"
                    overflowY="auto"
                >
                    {loading ? (
                        <Spinner
                            size="xl"
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                        />
                    ) : (
                        <div className="messages">
                            <ScrollableChats messages={messages} />
                        </div>
                    )}
                </Box>
                <Box
                    p={3}
                    bg="#E8E8E8"
                    width="100%"
                >
                    <FormControl id="message-form">
                        {isTyping ? <div><Lottie  options={defaultOptions}
                        // height={50}
                        width={100}
                        style={{ marginBottom: 15, marginLeft: 0 }} / ></div> : null}
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message.."
                            onKeyDown={sendMessage}
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
);

};

export default SingleChat;
