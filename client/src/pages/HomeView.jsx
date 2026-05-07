import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArticleIcon from "@mui/icons-material/Article";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import LogoutIcon from "@mui/icons-material/Logout";

export default function HomeView({
  currentUser,
  showInfo,
  onShowInfo,
  onCloseInfo,
  onGoTodos,
  onGoPosts,
  onGoAlbums,
  isLoggedIn,
  onGoLogin,
  onLogout,
}) {
  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <Card sx={{ padding: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom>
            No user logged in
          </Typography>

          <Button variant="contained" onClick={onGoLogin}>
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      <AppBar position="static" elevation={1}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Dashboard
          </Typography>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: 4,
            marginBottom: 5,
            background:
              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Welcome, {currentUser.name}
          </Typography>

          <Typography variant="h6" sx={{ marginTop: 1 }}>
            Manage your todos, posts and albums easily.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: 4,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
              onClick={onShowInfo}
            >
              <CardContent sx={{ textAlign: "center", padding: 4 }}>
                <InfoIcon sx={{ fontSize: 50, marginBottom: 2 }} />

                <Typography variant="h5" fontWeight="bold">
                  Info
                </Typography>

                <Typography color="text.secondary">
                  View personal information
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: 4,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
              onClick={onGoTodos}
            >
              <CardContent sx={{ textAlign: "center", padding: 4 }}>
                <CheckCircleIcon
                  sx={{ fontSize: 50, marginBottom: 2 }}
                />

                <Typography variant="h5" fontWeight="bold">
                  Todos
                </Typography>

                <Typography color="text.secondary">
                  Manage your tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: 4,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
              onClick={onGoPosts}
            >
              <CardContent sx={{ textAlign: "center", padding: 4 }}>
                <ArticleIcon sx={{ fontSize: 50, marginBottom: 2 }} />

                <Typography variant="h5" fontWeight="bold">
                  Posts
                </Typography>

                <Typography color="text.secondary">
                  View and manage posts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: 4,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
              onClick={onGoAlbums}
            >
              <CardContent sx={{ textAlign: "center", padding: 4 }}>
                <PhotoAlbumIcon
                  sx={{ fontSize: 50, marginBottom: 2 }}
                />

                <Typography variant="h5" fontWeight="bold">
                  Albums
                </Typography>

                <Typography color="text.secondary">
                  Browse your photos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={showInfo} onClose={onCloseInfo} maxWidth="sm" fullWidth>
        <DialogTitle>User Information</DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>ID:</strong> {currentUser.id}
          </Typography>

          <Typography gutterBottom>
            <strong>Name:</strong> {currentUser.name}
          </Typography>

          <Typography gutterBottom>
            <strong>Username:</strong> {currentUser.username}
          </Typography>

          <Typography gutterBottom>
            <strong>Email:</strong> {currentUser.email}
          </Typography>

          <Typography gutterBottom>
            <strong>Phone:</strong> {currentUser.phone}
          </Typography>

          <Typography gutterBottom>
            <strong>Website:</strong> {currentUser.website}
          </Typography>

          {currentUser.address && (
            <Typography gutterBottom>
              <strong>Address:</strong>{" "}
              {currentUser.address.city},{" "}
              {currentUser.address.street}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseInfo} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}