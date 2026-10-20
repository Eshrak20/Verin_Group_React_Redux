import { removeAuthCookies } from "@/lib/authCookie";
import { useGetMyProfileQuery } from "@/redux/auth.api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, setUser } from "@/redux/slices/auth.slice";
import { useEffect } from "react";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isError } = useGetMyProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setUser(data.data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError && token) {
      removeAuthCookies();
      dispatch(logout());
    }
  }, [isError, token, dispatch]);

  return null;
};

export default AuthInitializer;