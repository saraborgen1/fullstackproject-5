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
    onCancelEditPhoto
}) {
    return (
        <div>
            <button onClick={onBackHome}>Back to Home</button>

            <h1>Albums</h1>

            <h3>Add new album</h3>
            <input
                placeholder="Album title"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
            />
            <button onClick={onAddAlbum}>Add Album</button>

            <h3>Search albums</h3>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="id">Search by ID</option>
                <option value="title">Search by Title</option>
            </select>

            <input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            <h3>Albums list</h3>

            {albums.length === 0 ? (
                <p>No albums found.</p>
            ) : (
                <ul>
                    {albums.map((album) => (
                        <li key={album.id}>
                            <button onClick={() => onSelectAlbum(album)}>
                                ID: {album.id} | {album.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedAlbum && (
                <div>
                    <h2>Selected Album</h2>
                    <h3>
                        ID: {selectedAlbum.id} | {selectedAlbum.title}
                    </h3>

                    <h3>Add new photo</h3>
                    <input
                        placeholder="Photo title"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                    />
                    <input
                        placeholder="Photo URL"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                    />
                    <button onClick={onAddPhoto}>Add Photo</button>

                    <h3>Photos</h3>

                    {photos.length === 0 ? (
                        <p>No photos loaded.</p>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    style={{
                                        border: "1px solid gray",
                                        padding: "8px",
                                        width: "180px"
                                    }}
                                >
                                    {editingPhotoId === photo.id ? (
                                        <>
                                            <input
                                                value={editingPhotoTitle}
                                                onChange={(e) => setEditingPhotoTitle(e.target.value)}
                                            />

                                            <input
                                                value={editingPhotoUrl}
                                                onChange={(e) => setEditingPhotoUrl(e.target.value)}
                                            />

                                            <button onClick={() => onSaveEditPhoto(photo)}>
                                                Save
                                            </button>
                                            <button onClick={onCancelEditPhoto}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src={photo.thumbnailUrl || photo.url}
                                                alt={photo.title}
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                            <p>ID: {photo.id}</p>
                                            <p>{photo.title}</p>

                                            <button onClick={() => onStartEditPhoto(photo)}>
                                                Edit
                                            </button>
                                            <button onClick={() => onDeletePhoto(photo.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMorePhotos && (
                        <button onClick={onLoadMorePhotos}>Load More Photos</button>
                    )}
                </div>
            )}
        </div>
    );
}