import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  message,
  onLogin,
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 10,
            padding: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                marginBottom: 4,
              }}
            >
              Welcome Back
            </Typography>

            <form onSubmit={onLogin}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    paddingY: 1.4,
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Login
                </Button>

                {message && (
                  <Alert severity="error">
                    {message}
                  </Alert>
                )}

                <Typography align="center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register">
                    Register
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}