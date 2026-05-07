import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

    const [searchBy, setSearchBy] = useState(
        localStorage.getItem("albumsSearchBy") || "title"
    );

    const [searchValue, setSearchValue] = useState(
        localStorage.getItem("albumsSearchValue") || ""
    );

    const [newAlbumTitle, setNewAlbumTitle] = useState("");

    const [newPhotoTitle, setNewPhotoTitle] = useState("");
    const [newPhotoUrl, setNewPhotoUrl] = useState("");

    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const [editingPhotoTitle, setEditingPhotoTitle] = useState("");
    const [editingPhotoUrl, setEditingPhotoUrl] = useState("");

    const [photoStart, setPhotoStart] = useState(0);
    const [hasMorePhotos, setHasMorePhotos] = useState(false);

    const navigate = useNavigate();
    const { userId, albumId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [albumsLoaded, setAlbumsLoaded] = useState(false);

    useEffect(() => {
    if (!currentUser) {
        navigate("/login");
        return;
    }

    if (userId && Number(userId) !== Number(currentUser.id)) {
        navigate("/home");
    }
}, [userId, currentUser, navigate]);

useEffect(() => {
    if (currentUser) {
        loadAlbums();
    }
}, []);

    useEffect(() => {
        localStorage.setItem("albumsSearchBy", searchBy);
    }, [searchBy]);

    useEffect(() => {
        localStorage.setItem("albumsSearchValue", searchValue);
    }, [searchValue]);

    useEffect(() => {
        if (!albumsLoaded) return;

        if (selectedAlbum) {
            localStorage.setItem("selectedAlbumId", selectedAlbum.id);
        } else {
            localStorage.removeItem("selectedAlbumId");
        }
    }, [selectedAlbum, albumsLoaded]);

    useEffect(() => {
        if (selectedAlbum) {
            localStorage.setItem("albumsPhotoPage", photoPage);
        }
    }, [photoPage, selectedAlbum]);

    if (!currentUser) {
    return null;
}

if (userId && Number(userId) !== Number(currentUser.id)) {
    return null;
}

    async function loadAlbums() {
        const data = await getAlbumsByUser(currentUser.id);
        setAlbums(data);

        const savedAlbumId = albumId || localStorage.getItem("selectedAlbumId");

        if (savedAlbumId) {
            const savedAlbum = data.find(
                (album) => album.id.toString() === savedAlbumId.toString()
            );

            if (savedAlbum) {
                const savedPage = Number(localStorage.getItem("albumsPhotoPage")) || 1;

                await handleSelectAlbum(savedAlbum, true, savedPage);
            }
        }

        setAlbumsLoaded(true);
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

        const newAlbum = {
            id: Date.now(),
            userId: currentUser.id,
            title: newAlbumTitle
        };

        const created = await addAlbum(newAlbum);

        setAlbums([...albums, created]);
        setNewAlbumTitle("");
    }

    async function handleSelectAlbum(album, fromRefresh = false, savedPage = 1) {
        if (!fromRefresh && selectedAlbum?.id === album.id) {
            setSelectedAlbum(null);
            setPhotos([]);
            setHasMorePhotos(false);
            navigate("/albums");
            return;
        }

        setSelectedAlbum(album);
        navigate(`/users/${currentUser.id}/albums/${album.id}/photos`);
        setPhotos([]);

        let allPhotos = [];

        for (let page = 1; page <= savedPage; page++) {
            const pagePhotos = await getPhotosByAlbumPaged(
                album.id,
                page,
                PHOTO_LIMIT
            );

            allPhotos = [...allPhotos, ...pagePhotos];
        }

        setPhotos(allPhotos);
        setPhotoPage(savedPage);
        setHasMorePhotos(allPhotos.length % PHOTO_LIMIT === 0);
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

        const newPhoto = {
            id: Date.now(),
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
            onBackHome={() => {
                localStorage.removeItem("albumsSearchBy");
                localStorage.removeItem("albumsSearchValue");
                localStorage.removeItem("selectedAlbumId");
                localStorage.removeItem("albumsPhotoPage");
                navigate("/home");
            }}
            onSelectAlbum={handleSelectAlbum}
            onAddAlbum={handleAddAlbum}
            onLoadMorePhotos={handleLoadMorePhotos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onStartEditPhoto={handleStartEditPhoto}
            onSaveEditPhoto={handleSaveEditPhoto}
            onCancelEditPhoto={handleCancelEditPhoto}
            isLoggedIn={!!currentUser}
            onGoLogin={() => navigate("/login")}
        />
    );
}