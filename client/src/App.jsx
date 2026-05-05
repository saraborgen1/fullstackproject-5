import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import Posts from "./pages/Posts";
import Albums from "./pages/Albums";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/albums" element={<Albums />} />
      </Routes>
    </Router>
  );
}

export default App;