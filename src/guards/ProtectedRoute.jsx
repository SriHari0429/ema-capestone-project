import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login and save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
