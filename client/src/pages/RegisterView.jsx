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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

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
  onRegister,
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
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
              sx={{ fontWeight: "bold", marginBottom: 3 }}
            >
              Create Account
            </Typography>

            <Stepper activeStep={step - 1} sx={{ marginBottom: 4 }}>
              <Step>
                <StepLabel>Account</StepLabel>
              </Step>
              <Step>
                <StepLabel>Details</StepLabel>
              </Step>
            </Stepper>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {step === 1 && (
                <>
                  <TextField
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <TextField
                    label="Verify password"
                    type="password"
                    fullWidth
                    value={passwordVerify}
                    onChange={(e) => setPasswordVerify(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={onCheckUsername}
                    sx={{
                      borderRadius: 3,
                      paddingY: 1.4,
                      fontWeight: "bold",
                    }}
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <TextField
                    label="Full name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <TextField
                    label="Phone"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <TextField
                    label="Website / password field"
                    fullWidth
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={onRegister}
                    sx={{
                      borderRadius: 3,
                      paddingY: 1.4,
                      fontWeight: "bold",
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {message && <Alert severity="error">{message}</Alert>}

              <Typography align="center">
                Already have an account? <Link to="/login">Login</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}