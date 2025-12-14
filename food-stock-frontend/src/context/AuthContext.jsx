// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("foodstock_token") || null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("foodstock_user");
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ when you log in: caller must pass userData WITH avatarUrl inside it
 // AuthContext.jsx
const login = (newToken, userData) => {
  setToken(newToken);

  // ✅ ensure avatarUrl stays inside the user object
  const normalizedUser = {
    userId: userData.userId,
    fullname: userData.fullname,
    email: userData.email,
    role: userData.role,
    avatarUrl: userData.avatarUrl || "",
  };

  setUser(normalizedUser);

  localStorage.setItem("foodstock_token", newToken);
  localStorage.setItem("foodstock_user", JSON.stringify(normalizedUser));
};



  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("foodstock_token");
    localStorage.removeItem("foodstock_user");
  };

  // used by ProfilePage after updating fullname / avatarUrl
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem("foodstock_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
