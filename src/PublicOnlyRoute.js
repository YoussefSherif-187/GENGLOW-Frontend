import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h2>Loading...</h2>;

  // If logged in → redirect away from signin/signup
  if (user) return <Navigate to="/home" replace />;

  return children;
};

export default PublicOnlyRoute;
