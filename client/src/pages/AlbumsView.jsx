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
    Grid,
    IconButton,
    Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";

export default function AlbumsView({
    albums,
    selectedAlbum,
    photos,
    searchBy,
    setSearchBy,
    searchValue,
    setSearchValue,

    newAlbumTitle,
    setNewAlbumTitle,

    newPhotoTitle,
    setNewPhotoTitle,
    newPhotoUrl,
    setNewPhotoUrl,

    editingPhotoId,
    editingPhotoTitle,
    setEditingPhotoTitle,
    editingPhotoUrl,
    setEditingPhotoUrl,

    hasMorePhotos,

    onBackHome,
    onSelectAlbum,
    onAddAlbum,
    onLoadMorePhotos,
    onAddPhoto,
    onDeletePhoto,
    onStartEditPhoto,
    onSaveEditPhoto,
    onCancelEditPhoto,

    isLoggedIn,
    onGoLogin,
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
            <Container maxWidth="xl">
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
                        background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
                        color: "white",
                    }}
                >
                    <Typography variant="h3" fontWeight="bold">
                        Albums
                    </Typography>

                    <Typography variant="h6" sx={{ marginTop: 1 }}>
                        Browse and manage your albums and photos.
                    </Typography>
                </Paper>

<Box
    sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        marginBottom: 4,
    }}
>
    <Card sx={{ borderRadius: 4 }}>
        <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Add new album
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Album title"
                    fullWidth
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddAlbum}
                    sx={{ borderRadius: 3, minWidth: 160 }}
                >
                    Add Album
                </Button>
            </Stack>
        </CardContent>
    </Card>

    <Card sx={{ borderRadius: 4 }}>
        <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Search albums
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
            </Stack>
        </CardContent>
    </Card>
</Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ marginBottom: 3 }}
                >
                    Albums list
                </Typography>

                {albums.length === 0 ? (
                    <Alert severity="info">No albums found.</Alert>
                ) : (
                    <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 3,
  }}
>
  {albums.map((album) => (
    <Box key={album.id}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        border:
                                            selectedAlbum?.id === album.id
                                                ? "2px solid #0f766e"
                                                : "1px solid #e2e8f0",

                                        height: 160,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",

                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                        },
                                    }}
                                    onClick={() => onSelectAlbum(album)}
                                >
                
                                    <CardContent sx={{ textAlign: "center", padding: 4 }}>
                                        <PhotoAlbumIcon
                                            sx={{
                                                fontSize: 60,
                                                color: "#0f766e",
                                                marginBottom: 2,
                                            }}
                                        />

                                        <Chip
                                            label={`ID: ${album.id}`}
                                            color="primary"
                                            size="small"
                                            sx={{ marginBottom: 2 }}
                                        />

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                minHeight: 64,
                                            }}
                                        >
                                            {album.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                               </Box>
  ))}
</Box>
                )}

                {selectedAlbum && (
                    <Box sx={{ marginTop: 6 }}>
                  <Box
    sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        marginBottom: 4,
    }}
>
    <Card sx={{ borderRadius: 4 }}>
        <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Selected Album
            </Typography>

            <Typography variant="h6">
                ID: {selectedAlbum.id} | {selectedAlbum.title}
            </Typography>
        </CardContent>
    </Card>

    <Card sx={{ borderRadius: 4 }}>
        <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Add new photo
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Photo title"
                    fullWidth
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                />

                <TextField
                    label="Photo URL"
                    fullWidth
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddPhoto}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Add Photo
                </Button>
            </Stack>
        </CardContent>
    </Card>
</Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ marginBottom: 3 }}
                        >
                            Photos
                        </Typography>

                        {photos.length === 0 ? (
                            <Alert severity="info">No photos loaded.</Alert>
                        ) : (
                            <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 3,
  }}
>
  {photos.map((photo) => (
    <Box key={photo.id}>
                                        <Card
  sx={{
    borderRadius: 4,
    overflow: "hidden",
    height: 260,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
                                            {editingPhotoId === photo.id ? (
                                                <CardContent>
                                                    <Stack spacing={2}>
                                                        <TextField
                                                            label="Photo title"
                                                            fullWidth
                                                            value={editingPhotoTitle}
                                                            onChange={(e) =>
                                                                setEditingPhotoTitle(e.target.value)
                                                            }
                                                        />

                                                        <TextField
                                                            label="Photo URL"
                                                            fullWidth
                                                            value={editingPhotoUrl}
                                                            onChange={(e) =>
                                                                setEditingPhotoUrl(e.target.value)
                                                            }
                                                        />

                                                        <Stack direction="row" spacing={1}>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<SaveIcon />}
                                                                onClick={() => onSaveEditPhoto(photo)}
                                                            >
                                                                Save
                                                            </Button>

                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<CloseIcon />}
                                                                onClick={onCancelEditPhoto}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            ) : (
                                                <>
                                                    <Box
                                                        component="img"
                                                        src={photo.thumbnailUrl || photo.url}
                                                        alt={photo.title}
                                                        sx={{
                                                            width: "100%",
                                                            height: 100,
                                                            objectFit: "cover",
                                                            borderBottom: "1px solid #e2e8f0",
                                                        }}
                                                    />

                                                    <CardContent>
                                                        <Chip
                                                            label={`ID: ${photo.id}`}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ marginBottom: 2 }}
                                                        />

                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="bold"
                                                            gutterBottom
                                                        >
                                                            {photo.title}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() =>
                                                                    onStartEditPhoto(photo)
                                                                }
                                                            >
                                                                <EditIcon />
                                                            </IconButton>

                                                            <IconButton
                                                                color="error"
                                                                onClick={() =>
                                                                    onDeletePhoto(photo.id)
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </CardContent>
                                                </>
                                            )}
                                        </Card>
                                        </Box>
  ))}
</Box>
                        )}

                        {hasMorePhotos && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 4,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={onLoadMorePhotos}
                                    sx={{
                                        borderRadius: 3,
                                        paddingX: 4,
                                    }}
                                >
                                    Load More Photos
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    );
}