import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const PublicOnlyRoute = () => {
  const location = useLocation();

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const from = (
    location.state as { from?: string } | null
  )?.from;

  const redirectTo =
    from?.startsWith("/") && !from.startsWith("//")
      ? from
      : "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;