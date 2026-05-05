import { Link } from "react-router-dom";

export default function RegisterView({
  username,
  setUsername,
  password,
  setPassword,
  passwordVerify,
  setPasswordVerify,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  website,
  setWebsite,
  step,
  message,
  onCheckUsername,
  onRegister
}) {
  return (
    <div>
      <h1>Register</h1>

      {step === 1 && (
        <>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            placeholder="Verify password"
            type="password"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          />

          <button onClick={onCheckUsername}>Continue</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Website / password field"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <button onClick={onRegister}>Register</button>
        </>
      )}

      {message && <p>{message}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}