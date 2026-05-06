import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser } from "../services/api";
import RegisterView from "./RegisterView";

export default function Register() {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleCheckUsername() {
    if (!username.trim() || !password.trim() || !passwordVerify.trim()) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== passwordVerify) {
      setMessage("Passwords do not match");
      return;
    }

    const users = await getUsers();
    const usernameExists = users.some((user) => user.username === username);

    if (usernameExists) {
      setMessage("Username already exists");
      return;
    }

    setWebsite(password);
    setMessage("");
    setStep(2);
  }

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !phone.trim() || !website.trim()) {
      setMessage("Please fill all user details");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      username,
      website,
      email,
      phone
    };

    const createdUser = await addUser(newUser);

    localStorage.setItem("currentUser", JSON.stringify(createdUser));
    navigate("/home");
  }

  return (
    <RegisterView
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      passwordVerify={passwordVerify}
      setPasswordVerify={setPasswordVerify}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      website={website}
      setWebsite={setWebsite}
      step={step}
      message={message}
      onCheckUsername={handleCheckUsername}
      onRegister={handleRegister}
    />
  );
}