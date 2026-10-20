import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Outlet />
    </div>
  );
};

export default AuthLayout;