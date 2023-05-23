import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);
  const refresh = useRefreshToken();
  const { auth, setAuth, persist } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const handleBeforeUnload = useCallback(() => {
    // Función para borrar el estado global y la cookie del refresh token solo si no hay persistencia
    if (!persist) {
      setAuth({});
      localStorage.removeItem("persist");
    }
  }, []);

  useEffect(() => {
    const thereIsAccessToken = auth?.accessToken;
    const signOut = async () => {
      await logout();
      navigate("/login");
    };
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (effectRan.current === true || import.meta.env.PROD) {
      if (persist) {
        // Persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !thereIsAccessToken ? verifyRefreshToken() : setIsLoading(false);
      } else {
        if (!thereIsAccessToken) {
          signOut();
        }
      }
    }
    // Agregar el evento beforeunload cuando el componente se monta
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      effectRan.current = true;
      // Eliminar el evento beforeunload cuando el componente se desmonta
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // First the elements in the DOM of this component are painted and if these elements include an outlet, all internal elements of the outlet will be painted. Subsequently, the useEffect of the main component that contains the outlet will be executed and then the following useEffect of the internal components of the outlet.
  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
