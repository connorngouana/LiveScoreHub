import { Spinner, useDisclosure } from '@chakra-ui/react'; // Change import statement
import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, FormControl, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../userContext/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => { 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, token,chats,user } = ChatState();
    
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();
    const handleAdminRemove = async(user1) => { 
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Check if the current user is the group admin
            if (selectedChat.groupAdmin._id !== user._id) {
                toast({
                    title: "Only admins can remove someone!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                return;
            }
    
            const { data } = await axios.put(
                `http://localhost:5000/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            if (user1._id === user._id) {
                setSelectedChat(); // Leave the group if the user removes themselves
            } else {
                setSelectedChat(data);
            }
      
            setLoading(false);
            fetchMessages();
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    
    const handleLeaveGroup = async () => { 
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            const { data } = await axios.put(
                `http://localhost:5000/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user._id, // User removes themselves
                },
                config
            );
            
            setSelectedChat(); // Leave the group
            setLoading(false);
            fetchMessages();
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    
    
    const handleRename = async () => {
        if (!groupChatName || !selectedChat._id) return;
    
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            };
    
            const response = await axios.put(
                'http://localhost:5000/chat/grouprename',
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            
            // Check if response.data is defined before accessing it
            if (response.data) {
                setSelectedChat(response.data);
                console.log(chats);
                setGroupChatName("");
                setRenameLoading(false);
            } else {
                throw new Error("Response data is undefined");
            }
        } catch (error) {
            console.error("Error renaming group chat:", error);
            toast({
                title: "Error Occurred!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        console.log(selectedChat.groupAdmin._id);
        console.log(user._id);
    
        if (selectedChat.groupAdmin._id !== user._id) {
          toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
      
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setSelectedChat(data);
          console.log(chats);
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };
    
    
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.get(`http://localhost:5000/auth/allUser?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" d="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton color={'white'}/>
                    <ModalBody>
                        <Flex w="100%" flexWrap="wrap" justifyContent="flex-start">
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleAdminRemove(u)} />
                            ))}
                        </Flex>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)} // Fix onChange event handler
                            />
                        </FormControl>
                            
            {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult?.map((token) => (
                  <UserListItem
                    key={token._id}
                    user={token}
                    handleFunction={() => handleAddUser(token)}
                  />
                ))
              )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleLeaveGroup(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default UpdateGroupChatModal;
