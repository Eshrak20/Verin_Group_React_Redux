const TOKEN_COOKIE = "access_token";
const TOKEN_TYPE_COOKIE = "token_type";

const cookieOptions = [
  "Path=/",
  "SameSite=Lax",
  `Max-Age=${60 * 60 * 24 * 7}`,
  ...(window.location.protocol === "https:" ? ["Secure"] : []),
].join("; ");

export const setAuthCookies = (
  token: string,
  tokenType: string,
) => {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; ${cookieOptions}`;
  document.cookie = `${TOKEN_TYPE_COOKIE}=${encodeURIComponent(tokenType)}; ${cookieOptions}`;
};

export const getAuthToken = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${TOKEN_COOKIE}=`));

  return cookie
    ? decodeURIComponent(cookie.substring(TOKEN_COOKIE.length + 1))
    : null;
};

export const getAuthTokenType = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${TOKEN_TYPE_COOKIE}=`));

  return cookie
    ? decodeURIComponent(cookie.substring(TOKEN_TYPE_COOKIE.length + 1))
    : null;
};

export const removeAuthCookies = () => {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${TOKEN_TYPE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};
