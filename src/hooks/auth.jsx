import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode"; 

const TOKEN_KEY = "@foodexplorer:token";
const USER_KEY = "@foodexplorer:user";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({});

  const setAuthHeader = (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearAuthHeader = () => {
    delete api.defaults.headers.common["Authorization"];
  };

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearAuthHeader();
    setData({});
  }

  function isUserAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (!token || !user) {
      return false;
    }

    try {
      const tokenExpiration = jwtDecode(token).exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenExpiration < currentTime) {
        signOut();
        return false;
      }

      return true;
    } catch (error) {
      signOut();
      return false;
    }
  }

  async function signIn({ email, password }) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { user, token } = response.data;

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);

      setAuthHeader(token);
      setData({ user, token });
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível entrar.");
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && user) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          signOut();
          return;
        }

        setAuthHeader(token);
        setData({
          token,
          user: JSON.parse(user),
        });
      } catch (error) {
        signOut();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isUserAuthenticated,
        user: data.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };