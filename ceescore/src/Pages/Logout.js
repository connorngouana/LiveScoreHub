import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./userContext/userContext";

function Logout() {
  const { setIsLoggedIn } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });

      if (response.ok) {
        setIsLoggedIn(false); 
        history.push("/"); 
      } else {
        console.error("Failed to logout");
      
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
 
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
