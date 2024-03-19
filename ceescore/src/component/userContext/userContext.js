import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const [userprofiles, setuserprofiles] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!userprofiles && isLoggedIn) {
            axios.get('http://localhost:5000/auth/profiles').then(({data}) => {
                setuserprofiles(data);
            }).catch(error => {
                console.error('Error fetching user profiles:', error);
              });
        }
    }, [userprofiles, isLoggedIn]);

    return (
        <UserContext.Provider value={{ userprofiles, setuserprofiles, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
}
