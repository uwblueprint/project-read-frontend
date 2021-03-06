import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

function Login() {
  const isAuthenticated = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="username"
          value={userName}
          onChange={setUserName}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="password"
        />
        <button type="button">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
