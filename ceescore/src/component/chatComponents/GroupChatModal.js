import React, { useState } from 'react';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from '@chakra-ui/react';
import { ChatState } from '../userContext/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(''); 
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, token, chats, setChats } = ChatState();

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: 'Error Occurred!',
        description: 'Please provide a chat name and add users to the group.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
  
      const { data } = await axios.post('http://localhost:5000/chat/group', {
        name: groupChatName, 
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      }, config);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New Group Chat Created',
        description: `Group chat "${groupChatName}" created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      toast({
        title: 'Failed to Create the Chat!',
        description: error.response.data.error || 'An error occurred while creating the group chat.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User Already Added',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
          >
            <FormControl>
              <Input placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input placeholder='Add Users'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map(u => (
                <UserBadgeItem key={u._id} // Use u._id instead of token._id
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? <div>loading</div> : (
              searchResult?.slice(0, 4).map((u) => (
                <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal;
