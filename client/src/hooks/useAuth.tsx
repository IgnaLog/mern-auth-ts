import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";
import { AuthContextType } from "../types/context";

const useAuth = (): AuthContextType => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out")); // It does not affect the functionality of the app itself. It simply provides additional information for debugging in React development tools, such as the React Developer Tools extension.
  return useContext(AuthContext);
};

export default useAuth;
