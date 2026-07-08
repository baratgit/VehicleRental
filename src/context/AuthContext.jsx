import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "./mockApi";

const AuthContext = createContext(undefined);

// Create dedicated axios instance with proper base URL and interceptors
export const api = axios.create({
  baseURL: "",
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    token: localStorage.getItem("vr_token"),
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("vr_token");
      if (storedToken) {
        try {
          // Fetch real profile from backend
          const response = await axios.get("/api/profile/", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setState({
            user: response.data,
            token: storedToken,
            loading: false,
          });
        } catch (error) {
          console.error("Failed to fetch initial profile", error);
          // Token is invalid/expired
          localStorage.removeItem("vr_token");
          setState({
            user: null,
            token: null,
            loading: false,
          });
        }
      } else {
        setState({
          user: null,
          token: null,
          loading: false,
        });
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/login/", { username, password });
      const { access, user } = response.data;
      
      localStorage.setItem("vr_token", access);
      setState({
        user,
        token: access,
        loading: false,
      });
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/register/", userData);
      const { access, user } = response.data;

      localStorage.setItem("vr_token", access);
      setState({
        user,
        token: access,
        loading: false,
      });
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("vr_token");
    setState({
      user: null,
      token: null,
      loading: false,
    });
  };

  const refreshProfile = async () => {
    const storedToken = localStorage.getItem("vr_token");
    if (!storedToken) return null;
    try {
      const response = await api.get("/api/profile/");
      setState((prev) => ({ ...prev, user: response.data }));
      return response.data;
    } catch (err) {
      logout();
      return null;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const currentUserId = state.user?.id;
      if (!currentUserId) throw new Error("Not logged in");

      // Update backend
      const response = await api.put(`/api/admin/users/${currentUserId}`, userData);
      setState((prev) => ({ ...prev, user: response.data }));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const changePassword = async (passwords) => {
    try {
      await api.post("/api/change-password/", passwords);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loading: state.loading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
