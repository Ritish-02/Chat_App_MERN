import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const [notifcation,setNotification] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            history.push('/');
        }
    }, [history]);

    return (
        <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notifcation,setNotification }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
