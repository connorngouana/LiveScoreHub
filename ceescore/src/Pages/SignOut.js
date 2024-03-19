import React from "react";
import axios from 'axios';

function SignOut() {
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/Logout", {}, {
        withCredentials: true // Include credentials (cookies) in the request
      });

      if (response.status === 200) {
        // Redirect or perform any actions after successful logout
        window.location = "/"; 
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

export default SignOut;
