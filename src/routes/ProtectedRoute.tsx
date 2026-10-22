import { useGetMyProfileQuery } from "@/redux/auth.api";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const location = useLocation();

  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const hasToken = Boolean(token && isAuthenticated);

  const {
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetMyProfileQuery(undefined, {
    skip: !hasToken,
  });

  const currentPath = `${location.pathname}${location.search}`;

  if (!hasToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: currentPath }}
      />
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Profile verification failed:", error);

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: currentPath }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;