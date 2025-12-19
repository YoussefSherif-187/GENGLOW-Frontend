import { useContext, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";

const PrivateRoutes = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Store last valid render
  const lastChildrenRef = useRef(null);

  // Update only when NOT loading
  if (!loading) {
    lastChildrenRef.current = children;
  }

  // While loading, render the last valid page
  if (loading && lastChildrenRef.current) {
    return lastChildrenRef.current;
  }

  // After loading finishes, enforce auth
  if (!loading && !user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    !loading &&
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoutes;
