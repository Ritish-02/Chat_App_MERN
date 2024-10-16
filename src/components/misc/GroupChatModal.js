import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = useChatState();
  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return;
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to laod the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  }
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: 'Please Fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        '/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New Group Created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      // Ensure error response data is a string
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast({
        title: 'Failed to Create the Chat',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };
  
  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
      toast({
        title:"User already added",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers,userToAdd]);
  }
  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id));
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" d="flex" justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
              <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w='100%' display='flex' flexWrap='wrap' >
              
            {selectedUsers.map((u) => (
              <UserBadgeItem key={user._id} user = {u} handleFunction ={() => handleDelete(u)} />
            ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
