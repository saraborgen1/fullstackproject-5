import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAlbumsByUser,
    addAlbum,
    getPhotosByAlbumPaged,
    addPhoto,
    deletePhoto,
    updatePhoto
} from "../services/api";
import AlbumsView from "./AlbumsView";

const PHOTO_LIMIT = 5;

export default function Albums() {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [photoPage, setPhotoPage] = useState(1);

    const [searchBy, setSearchBy] = useState("title");
    const [searchValue, setSearchValue] = useState("");

    const [newAlbumTitle, setNewAlbumTitle] = useState("");

    const [newPhotoTitle, setNewPhotoTitle] = useState("");
    const [newPhotoUrl, setNewPhotoUrl] = useState("");

    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const [editingPhotoTitle, setEditingPhotoTitle] = useState("");
    const [editingPhotoUrl, setEditingPhotoUrl] = useState("");

    const [photoStart, setPhotoStart] = useState(0);
    const [hasMorePhotos, setHasMorePhotos] = useState(false);

    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (currentUser) {
            loadAlbums();
        }
    }, []);

    async function loadAlbums() {
        const data = await getAlbumsByUser(currentUser.id);
        setAlbums(data);
    }

    function getDisplayedAlbums() {
        let result = [...albums];

        if (searchValue.trim()) {
            result = result.filter((album) => {
                if (searchBy === "id") {
                    return album.id.toString().includes(searchValue);
                }

                if (searchBy === "title") {
                    return album.title.toLowerCase().includes(searchValue.toLowerCase());
                }

                return true;
            });
        }

        return result;
    }

    async function handleAddAlbum() {
        if (!newAlbumTitle.trim()) return;

        const numericIds = albums
            .map((album) => Number(album.id))
            .filter((id) => !isNaN(id));

        const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

        const newAlbum = {
            id: maxId + 1,
            userId: currentUser.id,
            title: newAlbumTitle
        };

        const created = await addAlbum(newAlbum);

        setAlbums([...albums, created]);
        setNewAlbumTitle("");
    }

    async function handleSelectAlbum(album) {
        setSelectedAlbum(album);
        setPhotos([]);
        setPhotoPage(1);

        const firstPhotos = await getPhotosByAlbumPaged(album.id, 1, PHOTO_LIMIT);

        setPhotos(firstPhotos);
        setHasMorePhotos(firstPhotos.length === PHOTO_LIMIT);
    }

    async function handleLoadMorePhotos() {
        if (!selectedAlbum) return;

        const nextPage = photoPage + 1;

        const nextPhotos = await getPhotosByAlbumPaged(
            selectedAlbum.id,
            nextPage,
            PHOTO_LIMIT
        );

        setPhotos([...photos, ...nextPhotos]);
        setPhotoPage(nextPage);
        setHasMorePhotos(nextPhotos.length === PHOTO_LIMIT);
    }

    async function handleAddPhoto() {
        if (!selectedAlbum || !newPhotoTitle.trim() || !newPhotoUrl.trim()) return;

        const numericIds = photos
            .map((photo) => Number(photo.id))
            .filter((id) => !isNaN(id));

        const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

        const newPhoto = {
            id: maxId + 1,
            albumId: selectedAlbum.id,
            title: newPhotoTitle,
            url: newPhotoUrl,
            thumbnailUrl: newPhotoUrl
        };

        const created = await addPhoto(newPhoto);

        setPhotos([...photos, created]);
        setNewPhotoTitle("");
        setNewPhotoUrl("");
    }

    async function handleDeletePhoto(id) {
        await deletePhoto(id);
        setPhotos(photos.filter((photo) => photo.id !== id));
    }

    function handleStartEditPhoto(photo) {
        setEditingPhotoId(photo.id);
        setEditingPhotoTitle(photo.title);
        setEditingPhotoUrl(photo.url);
    }

    async function handleSaveEditPhoto(photo) {
        if (!editingPhotoTitle.trim() || !editingPhotoUrl.trim()) return;

        const updatedPhoto = {
            ...photo,
            title: editingPhotoTitle,
            url: editingPhotoUrl,
            thumbnailUrl: editingPhotoUrl
        };

        const updated = await updatePhoto(photo.id, updatedPhoto);

        setPhotos(photos.map((p) => (p.id === photo.id ? updated : p)));

        setEditingPhotoId(null);
        setEditingPhotoTitle("");
        setEditingPhotoUrl("");
    }

    function handleCancelEditPhoto() {
        setEditingPhotoId(null);
        setEditingPhotoTitle("");
        setEditingPhotoUrl("");
    }

    if (!currentUser) {
        return (
            <div>
                <h1>Please login first</h1>
                <button onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    return (
        <AlbumsView
            albums={getDisplayedAlbums()}
            selectedAlbum={selectedAlbum}
            photos={photos}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            newAlbumTitle={newAlbumTitle}
            setNewAlbumTitle={setNewAlbumTitle}
            newPhotoTitle={newPhotoTitle}
            setNewPhotoTitle={setNewPhotoTitle}
            newPhotoUrl={newPhotoUrl}
            setNewPhotoUrl={setNewPhotoUrl}
            editingPhotoId={editingPhotoId}
            editingPhotoTitle={editingPhotoTitle}
            setEditingPhotoTitle={setEditingPhotoTitle}
            editingPhotoUrl={editingPhotoUrl}
            setEditingPhotoUrl={setEditingPhotoUrl}
            hasMorePhotos={hasMorePhotos}
            onBackHome={() => navigate("/home")}
            onSelectAlbum={handleSelectAlbum}
            onAddAlbum={handleAddAlbum}
            onLoadMorePhotos={handleLoadMorePhotos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onStartEditPhoto={handleStartEditPhoto}
            onSaveEditPhoto={handleSaveEditPhoto}
            onCancelEditPhoto={handleCancelEditPhoto}
        />
    );
}