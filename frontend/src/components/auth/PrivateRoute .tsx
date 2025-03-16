import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const currentUser  = useSelector((state: RootState) => state.auth.user);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(currentUser.role) ? <Outlet /> : <Navigate to={`/${currentUser.role}`} />;
};

export default PrivateRoute;