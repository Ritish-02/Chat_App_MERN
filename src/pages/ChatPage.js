import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useChatState } from '../Context/chatProvider'; // Correct import
import SideDrawer from '../components/misc/SideDrawer';
import MyChats from '../components/MyChats'; // Uncomment if using
import ChatBox from '../components/ChatBox'; // Uncomment if using

const ChatPage = () => {
    const { user } = useChatState();
    const [fetchAgain,setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    );
};

export default ChatPage;
