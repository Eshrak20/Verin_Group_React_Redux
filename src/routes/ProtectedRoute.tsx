// import { useGetMyProfileQuery } from "@/redux/api";
import { useGetMyProfileQuery } from "@/redux/auth.api";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const location = useLocation();

  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    isLoading,
    isFetching,
    isError,
  } = useGetMyProfileQuery(undefined, {
    skip: !token || !isAuthenticated,
  });

  const currentPath = `${location.pathname}${location.search}`;

  // Redirect logged-out users immediately.
  if (!token || !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: currentPath }}
      />
    );
  }

  // Wait for the session check.
  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  // Redirect if the token is invalid or expired.
  if (isError) {
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
