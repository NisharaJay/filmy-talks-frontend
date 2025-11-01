// hooks/useUserData.ts
import { useSelector } from "react-redux";
import type { RootState } from "../src/store";

export const useUserData = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const getFirstName = () => {
    if (!user?.fullName) return "";
    return user.fullName.split(" ")[0] || user.fullName;
  };

  return {
    user,
    isAuthenticated,
    firstName: getFirstName(),
    fullName: user?.fullName || "",
    email: user?.email || "",
  };
};