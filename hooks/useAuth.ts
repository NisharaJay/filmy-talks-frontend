import { useSelector } from "react-redux";
import type { RootState } from "../src/store";

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  const getFirstName = () => {
    if (!user?.fullName) return "";
    return user.fullName.split(" ")[0] || user.fullName;
  };

  return {
    user,
    isAuthenticated,
    loading,
    firstName: getFirstName(),
  };
};