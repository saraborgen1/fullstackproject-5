import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Stack,
  Alert,
  Paper,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function TodosView({
  newTitle,
  setNewTitle,
  sortBy,
  setSortBy,
  searchBy,
  setSearchBy,
  searchValue,
  setSearchValue,
  displayedTodos,
  editingId,
  editingTitle,
  setEditingTitle,
  onAdd,
  onDelete,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isLoggedIn,
  onGoLogin,
  onBackHome,
}) {
  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Card sx={{ padding: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom>
            Please login first
          </Typography>

          <Button variant="contained" onClick={onGoLogin}>
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f1f5f9", paddingY: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBackHome}
          sx={{ marginBottom: 3 }}
        >
          Back to Home
        </Button>

        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: 4,
            marginBottom: 4,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Todos
          </Typography>

          <Typography variant="h6" sx={{ marginTop: 1 }}>
            Add, search, sort and manage your tasks.
          </Typography>
        </Paper>

        <Card sx={{ borderRadius: 4, marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Add new todo
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="New todo title"
                fullWidth
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                sx={{ borderRadius: 3, minWidth: 120 }}
              >
                Add
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4, marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Filters
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Sort todos</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort todos"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="id">Sort by ID</MenuItem>
                  <MenuItem value="title">Sort by Title</MenuItem>
                  <MenuItem value="completed">Sort by Completed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Search by</InputLabel>
                <Select
                  value={searchBy}
                  label="Search by"
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <MenuItem value="id">Search by ID</MenuItem>
                  <MenuItem value="title">Search by Title</MenuItem>
                  <MenuItem value="completed">Search by Completed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Search"
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Todos list
            </Typography>

            {displayedTodos.length === 0 ? (
              <Alert severity="info">No todos found.</Alert>
            ) : (
              <List>
                {displayedTodos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    sx={{
                      marginBottom: 1.5,
                      borderRadius: 3,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                    secondaryAction={
                      editingId === todo.id ? (
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => onSaveEdit(todo)}
                          >
                            <SaveIcon />
                          </IconButton>

                          <IconButton color="error" onClick={onCancelEdit}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => onStartEdit(todo)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => onDelete(todo.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => onToggle(todo)}
                    />

                    {editingId === todo.id ? (
                      <TextField
                        fullWidth
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                      />
                    ) : (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                              fontWeight: 600,
                            }}
                          >
                            {todo.title}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                            <Chip label={`ID: ${todo.id}`} size="small" />
                            <Chip
                              label={
                                todo.completed ? "Completed" : "Not completed"
                              }
                              size="small"
                              color={todo.completed ? "success" : "default"}
                            />
                          </Stack>
                        }
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}