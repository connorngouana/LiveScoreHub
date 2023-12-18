import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/SignUp", {
        email,
        password,
        username,
      })
      .then((res) => {
        if (res.data === "exist") {
          alert("User already exists")
        } else if(res.data === "not exist"){
         navigate("/Login", {state:{id:email}})
        }
      })

      .catch(e => {
        alert("wrong details, Try Again");
        console.error(e);
      });
      
  } catch (e) {
    console.log(e);
  }
}
  return (
    <div >
      <h1>Sign Up</h1>

      <form action="POST">
        <input
          type="text"
          onChange={(e) => {
            setusername(e.target.value);
          }}
          placeholder="username"
        />
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="email"
        />
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <input type="submit" onClick={submit}
          Sign up
        />
      </form>

      <br />

      <p>OR</p>
      <br />

      <Link to="/login">Login Page</Link>
    </div>
  );
}

export default SignUp;
