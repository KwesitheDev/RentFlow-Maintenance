import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://rentflow-maintenance-backend.onrender.com/api";

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosWithAuth = useMemo(() => axios.create({ baseURL: API_URL }), []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  useEffect(() => {
    const requestInterceptor = axiosWithAuth.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosWithAuth.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearStoredAuth();
          setUser(null);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosWithAuth.interceptors.request.eject(requestInterceptor);
      axiosWithAuth.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosWithAuth]);

  useEffect(() => {
    const hydrateAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        clearStoredAuth();
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const res = await axiosWithAuth.get("/auth/me");
        updateUser(res.data.user);
      } catch (err) {
        clearStoredAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, [axiosWithAuth, updateUser]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      updateUser,
      axiosWithAuth,
      isAdmin: user?.role === "admin",
      isAuthenticated: Boolean(user),
    }),
    [axiosWithAuth, loading, login, logout, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
