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
  onLogout
}) {
  if (!isLoggedIn) {
    return (
      <div>
        <h1>No user logged in</h1>
        <button onClick={onGoLogin}>Go to Login</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome, {currentUser.name}</h1>

      <button onClick={onShowInfo}>Info</button>
      <button onClick={onGoTodos}>Todos</button>
      <button onClick={onGoPosts}>Posts</button>
      <button onClick={onGoAlbums}>Albums</button>
      <button onClick={onLogout}>Logout</button>

      {showInfo && (
        <div>
          <h2>User Info</h2>

          <p>ID: {currentUser.id}</p>
          <p>Name: {currentUser.name}</p>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Phone: {currentUser.phone}</p>
          <p>Website: {currentUser.website}</p>

          {currentUser.address && (
            <p>
              Address: {currentUser.address.city}, {currentUser.address.street}
            </p>
          )}

          <button onClick={onCloseInfo}>Close</button>
        </div>
      )}
    </div>
  );
}