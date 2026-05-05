import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsers } from "../services/api";

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
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}

            <p>
                Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}