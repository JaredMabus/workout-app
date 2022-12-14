import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { AccountStateType } from "../Redux/slices/accountSlice";

/**
 * Hook for token functionality
 * @func [getTokenFromCookie] Reads and decodes token from cookie.
 */
const useToken = () => {
  const getTokenFromCookie = () => {
    const cookie = Cookies.get("token");
    if (cookie) {
      const tokenPayload: AccountStateType | null = jwt_decode(cookie);
      return tokenPayload;
    }
    return null;
  };

  return { getTokenFromCookie };
};

export default useToken;
