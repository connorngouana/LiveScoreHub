import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [favoritedTeams, setFavoritedTeams] = useState([]);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('jwt');
                const response = await fetch('http://localhost:5000/auth/profiles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,               
                 });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const content = await response.json();
                setToken(token);
                setUser(content)
                
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        fetchUserProfile();

    }, []); // Add navigate to dependency array to avoid useEffect warning

    return (
        <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,token, setToken, notification, setNotification,favoritedTeams, setFavoritedTeams}}>
            {children}
        </chatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(chatContext);
};

export default ChatProvider;
