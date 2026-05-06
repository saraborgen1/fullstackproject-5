import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/api";
import LoginView from "./LoginView";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const users = await getUsers();

      const foundUser = users.find(
        (user) => user.username === username && user.website === password
      );

      if (!foundUser) {
        setMessage("Username or password is incorrect");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      navigate("/home");
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  }

  return (
    <LoginView
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      message={message}
      onLogin={handleLogin}
    />
  );
}