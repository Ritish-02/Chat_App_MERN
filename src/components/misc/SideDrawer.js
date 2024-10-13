import {
  Tooltip, Box, Button, Text, Menu, MenuButton, MenuList,
  Avatar, MenuItem, MenuDivider, Drawer, useDisclosure,
  DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  Input, useToast,
  Spinner
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState } from 'react';
import { useChatState } from '../../Context/chatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats, notification=[], setNotification } = useChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }

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
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
      console.log("Search Results:", data); // Debug: Check the search results
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred",
        description: "Failed to load the Search Results",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error fetching the chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent="space-between"
        alignItems="center"
        bg='white'
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" d='flex' alignItems='center' onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: 'none', md: 'flex' }} px="4" alignItems='center'>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="work sans">
          Chatter Box
        </Text>

        <Box display='flex' alignItems='center'>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
              <BellIcon fontSize='2xl' margin='1' />
            </MenuButton>
            {/* Add MenuList for notifications if needed */}
            <MenuList pl={2}>
              {!notification.length &&
                "No new messages"}
                {notification.map((note) => (
                  <MenuItem
                    key={note._id}
                    onClick={() => {
                      setSelectedChat(note.chat);
                      setNotification(notification.filter((n) => n !== note));
                    }}
                  >
                    {note.chat.isGroupChat
                      ? `New Message in ${note.chat.chatName}`
                      : `New Message from ${getSender(user, note.chat.users)}`}
                  </MenuItem>
                ))
              }
            </MenuList>

          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size='sm'
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderRadius="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ?
              <ChatLoading /> :
              (
                searchResults.length > 0 ?
                  searchResults.map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                  )) :
                  <Text>No users found</Text> // Show message when no results are found
              )
            }
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
