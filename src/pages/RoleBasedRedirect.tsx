import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole === "owner") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/trainer-dashboard" replace />;
};

export default RoleBasedRedirect; 