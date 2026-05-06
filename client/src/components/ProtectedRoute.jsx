import { Navigate, useParams } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { userId } = useParams();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userId && userId.toString() !== currentUser.id?.toString()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}