import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoutes = ({ allowedRoles }: ProtectedRouteProps) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(currentUser.role) ? (
    <Outlet />
  ) : (
    <Navigate to={`/${currentUser.role}`} />
  );
};

export default ProtectedRoutes;
