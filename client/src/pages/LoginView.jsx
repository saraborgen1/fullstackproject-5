import { Link } from "react-router-dom";

export default function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  message,
  onLogin
}) {
  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={onLogin}>
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