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
  Stack,
  Paper,
  Alert,
  Chip,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";

export default function PostsView({
  posts,
  selectedPost,
  comments,
  searchBy,
  setSearchBy,
  searchValue,
  setSearchValue,

  showOnlyMyPosts,
  setShowOnlyMyPosts,

  newPostTitle,
  setNewPostTitle,
  newPostBody,
  setNewPostBody,

  editingPostId,
  editingPostTitle,
  setEditingPostTitle,
  editingPostBody,
  setEditingPostBody,

  newCommentBody,
  setNewCommentBody,
  editingCommentId,
  editingCommentBody,
  setEditingCommentBody,

  onBackHome,
  onAddPost,
  onDeletePost,
  onSelectPost,
  onStartEditPost,
  onSaveEditPost,
  onCancelEditPost,

  onShowComments,
  onAddComment,
  onDeleteComment,
  onStartEditComment,
  onSaveEditComment,
  onCancelEditComment,
  onClosePost,

  isLoggedIn,
  onGoLogin,
  currentUser,
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
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Posts
          </Typography>

          <Typography variant="h6" sx={{ marginTop: 1 }}>
            Manage posts and comments easily.
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "4fr 2fr",
            },
            gap: 3,
            marginBottom: 4,
            alignItems: "stretch",
          }}
        >
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Add new post
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Post title"
                  fullWidth
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />

                <TextField
                  label="Post body"
                  multiline
                  rows={4}
                  fullWidth
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddPost}
                  sx={{
                    borderRadius: 3,
                    alignSelf: "flex-start",
                  }}
                >
                  Add Post
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Search posts
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Search by</InputLabel>

                  <Select
                    value={searchBy}
                    label="Search by"
                    onChange={(e) => setSearchBy(e.target.value)}
                  >
                    <MenuItem value="id">Search by ID</MenuItem>
                    <MenuItem value="title">Search by Title</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Search"
                  fullWidth
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlyMyPosts}
                      onChange={(e) => setShowOnlyMyPosts(e.target.checked)}
                    />
                  }
                  label="Show only my posts"
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Stack spacing={2}>
          {posts.length === 0 ? (
            <Alert severity="info">No posts found.</Alert>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  borderRadius: 4,
                  border:
                    selectedPost?.id === post.id
                      ? "2px solid #7c3aed"
                      : "1px solid #e2e8f0",
                }}
              >
                <CardContent>
                  {editingPostId === post.id ? (
                    <Stack spacing={2}>
                      <TextField
                        label="Post title"
                        fullWidth
                        value={editingPostTitle}
                        onChange={(e) =>
                          setEditingPostTitle(e.target.value)
                        }
                      />

                      <TextField
                        label="Post body"
                        multiline
                        rows={4}
                        fullWidth
                        value={editingPostBody}
                        onChange={(e) =>
                          setEditingPostBody(e.target.value)
                        }
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={() => onSaveEditPost(post)}
                        >
                          Save
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={onCancelEditPost}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 2,
                        }}
                      >
                        <Chip
                          label={`ID: ${post.id}`}
                          color="primary"
                          size="small"
                        />

                        {post.userId?.toString() ===
                          currentUser.id?.toString() && (
                            <Box>
                              <IconButton
                                color="primary"
                                onClick={() => onStartEditPost(post)}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() => onDeletePost(post.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                      </Stack>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {post.title}
                      </Typography>

                      <Typography color="text.secondary">
                        {post.body}
                      </Typography>

                      <Button
                        variant="contained"
                        sx={{ marginTop: 3 }}
                        onClick={() => onSelectPost(post)}
                      >
                        Select Post
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Stack>

        {selectedPost && (
          <Card
            sx={{
              borderRadius: 4,
              marginTop: 5,
              border: "2px solid #7c3aed",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Selected Post
                </Typography>

                <Button
                  color="error"
                  variant="outlined"
                  onClick={onClosePost}
                >
                  Close Post
                </Button>
              </Stack>

              <Typography variant="h6" gutterBottom>
                {selectedPost.title}
              </Typography>

              <Typography color="text.secondary" sx={{ marginBottom: 3 }}>
                {selectedPost.body}
              </Typography>

              <Button
                variant="contained"
                startIcon={<CommentIcon />}
                onClick={onShowComments}
                sx={{ marginBottom: 3 }}
              >
                {comments.length > 0
                  ? "Hide Comments"
                  : "Show Comments"}
              </Button>

              <Divider sx={{ marginBottom: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Add Comment
              </Typography>

              <Stack spacing={2} sx={{ marginBottom: 4 }}>
                <TextField
                  label="Add comment"
                  multiline
                  rows={3}
                  fullWidth
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                />

                <Button
                  variant="contained"
                  onClick={onAddComment}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add Comment
                </Button>
              </Stack>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Comments
              </Typography>

              {comments.length === 0 ? (
                <Alert severity="info">
                  Click "Show Comments" to load comments.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <Card
                      key={comment.id}
                      sx={{
                        borderRadius: 3,
                        background: "#f8fafc",
                      }}
                    >
                      <CardContent>
                        {editingCommentId === comment.id ? (
                          <Stack spacing={2}>
                            <TextField
                              multiline
                              rows={3}
                              fullWidth
                              value={editingCommentBody}
                              onChange={(e) =>
                                setEditingCommentBody(e.target.value)
                              }
                            />

                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  onSaveEditComment(comment)
                                }
                              >
                                Save
                              </Button>

                              <Button
                                variant="outlined"
                                color="error"
                                onClick={onCancelEditComment}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Stack>
                        ) : (
                          <>
                            <Typography sx={{ marginBottom: 2 }}>
                              {comment.body}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              By: {comment.name} | {comment.email}
                            </Typography>

                            {comment.userId === currentUser.id && (
                              <Box marginTop={2}>
                                <Button
                                  size="small"
                                  startIcon={<EditIcon />}
                                  onClick={() =>
                                    onStartEditComment(comment)
                                  }
                                >
                                  Edit
                                </Button>

                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() =>
                                    onDeleteComment(comment.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}