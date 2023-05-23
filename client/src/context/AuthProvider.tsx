import { createContext, useState } from "react";
import { AuthContextType } from "../types/context";

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<any>({});
  const persistedValue = localStorage.getItem("persist");
  const [persist, setPersist] = useState<boolean>(
    persistedValue ? JSON.parse(persistedValue) : false
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
