import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeView from "./HomeView";

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  if (!currentUser) {
    return (
      <div>
        <h1>No user logged in</h1>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <HomeView
      currentUser={currentUser}
      showInfo={showInfo}
      onShowInfo={() => setShowInfo(true)}
      onCloseInfo={() => setShowInfo(false)}
      onGoTodos={() => navigate("/todos")}
      onGoPosts={() => navigate("/posts")}
      onGoAlbums={() => navigate("/albums")}
      onLogout={handleLogout}
    />
  );
}