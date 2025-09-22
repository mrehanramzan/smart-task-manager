import React, { createContext, useContext, useState, useEffect } from "react";
import { login_user, register_user, verify_token } from "../apis/auth";
import { getToken, storeToken } from "../utils/store";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await verify_token();
        if (userData.error) throw userData.error;
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login_user(credentials);
      if (data.error) throw data.error;
      setUser(data);
      if (data.access_token) storeToken(data.access_token);

      return data;
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register_user(userData);
      if (data.error) throw data.error;
      return data;
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
