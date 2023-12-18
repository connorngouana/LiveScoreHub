import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/Login", {
          email,
          password,
        })

        .then((res) => {
          if (res.data === "exist") {
            navigate("/", { state: { id: email } });
          } else if (res.data === "not exist") {
            alert("No account with this email/password");
          }
        })

        .catch((e) => {
          alert("wrong details, Try Again");
          console.error(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="loginPage">
      <h1>Login</h1>

      <form action="POST">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <input type="submit" onClick={submit} Login />
      </form>

      <br />

      <p>OR</p>
      <br />

      <Link to="/SignUp">Sign Up Page</Link>
    </div>
  );
}

export default Login;
