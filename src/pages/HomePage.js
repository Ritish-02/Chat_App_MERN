import React from 'react'
import { Container, Box, Text, Tab, Tabs, TabPanels, TabPanel, TabList } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import { useHistory} from 'react-router-dom';
import { useEffect } from 'react';

const HomePage = () => {
  const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user){
            history.push("/chats");
        }
    },[history]);
  return <Container maxW='xl' centerContent>
    <Box
      d='flex'
      justifyContent={'center'}
      p={3}
      bg={"white"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius="1g"
      borderWidth="1px"
    >
      <Text fontSize="4xl" fontFamily="work sans">CHATTER BOX</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px" color="black">
      <Tabs variant='soft-rounded'>
        <TabList mb="1em">
          <Tab width="50%">Login</Tab>
          <Tab width="50%">SignUp</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
          <TabPanel>
            <SignUp/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container>
}

export default HomePage
