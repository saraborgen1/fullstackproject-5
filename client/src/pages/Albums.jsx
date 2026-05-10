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

    const [newAlbumTitle, setNewAlbumTitle] = useState(
        localStorage.getItem("albumsNewAlbumTitle") || ""
    );

    const [newPhotoTitle, setNewPhotoTitle] = useState(
        localStorage.getItem("albumsNewPhotoTitle") || ""
    );

    const [newPhotoUrl, setNewPhotoUrl] = useState(
        localStorage.getItem("albumsNewPhotoUrl") || ""
    );

    const [editingPhotoId, setEditingPhotoId] = useState(
        localStorage.getItem("albumsEditingPhotoId") || null
    );

    const [editingPhotoTitle, setEditingPhotoTitle] = useState(
        localStorage.getItem("albumsEditingPhotoTitle") || ""
    );

    const [editingPhotoUrl, setEditingPhotoUrl] = useState(
        localStorage.getItem("albumsEditingPhotoUrl") || ""
    );

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

        if (userId && userId.toString() !== currentUser.id?.toString()) {
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

    useEffect(() => {
        localStorage.setItem("albumsNewAlbumTitle", newAlbumTitle);
    }, [newAlbumTitle]);

    useEffect(() => {
        localStorage.setItem("albumsNewPhotoTitle", newPhotoTitle);
    }, [newPhotoTitle]);

    useEffect(() => {
        localStorage.setItem("albumsNewPhotoUrl", newPhotoUrl);
    }, [newPhotoUrl]);

    useEffect(() => {
        if (editingPhotoId) {
            localStorage.setItem("albumsEditingPhotoId", editingPhotoId);
        } else {
            localStorage.removeItem("albumsEditingPhotoId");
        }
    }, [editingPhotoId]);

    useEffect(() => {
        localStorage.setItem("albumsEditingPhotoTitle", editingPhotoTitle);
    }, [editingPhotoTitle]);

    useEffect(() => {
        localStorage.setItem("albumsEditingPhotoUrl", editingPhotoUrl);
    }, [editingPhotoUrl]);

    if (!currentUser) {
        return null;
    }

    if (userId && userId.toString() !== currentUser.id?.toString()) {
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
        localStorage.removeItem("albumsNewAlbumTitle");
    }

    async function handleSelectAlbum(album, fromRefresh = false, savedPage = 1) {
        if (!fromRefresh && selectedAlbum?.id === album.id) {
            setSelectedAlbum(null);
            setPhotos([]);
            setHasMorePhotos(false);
            navigate("/albums");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

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
        setTimeout(() => {
            document
                .getElementById("selected-album-section")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 0);
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
        localStorage.removeItem("albumsNewPhotoTitle");
        localStorage.removeItem("albumsNewPhotoUrl");
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
        localStorage.removeItem("albumsEditingPhotoId");
        localStorage.removeItem("albumsEditingPhotoTitle");
        localStorage.removeItem("albumsEditingPhotoUrl");
    }

    function handleCancelEditPhoto() {
        setEditingPhotoId(null);
        setEditingPhotoTitle("");
        setEditingPhotoUrl("");
        localStorage.removeItem("albumsEditingPhotoId");
        localStorage.removeItem("albumsEditingPhotoTitle");
        localStorage.removeItem("albumsEditingPhotoUrl");
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
                localStorage.removeItem("albumsNewAlbumTitle");
                localStorage.removeItem("albumsNewPhotoTitle");
                localStorage.removeItem("albumsNewPhotoUrl");
                localStorage.removeItem("albumsEditingPhotoId");
                localStorage.removeItem("albumsEditingPhotoTitle");
                localStorage.removeItem("albumsEditingPhotoUrl");
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