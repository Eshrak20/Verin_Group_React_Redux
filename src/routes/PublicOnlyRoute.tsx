import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;