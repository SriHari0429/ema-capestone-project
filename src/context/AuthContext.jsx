import React, { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ema_token");
    if (token) setUser({ email: "user@gov.in" });
  }, []);

  function login({ email, password }) {
    // TODO: integrate Firebase or your backend
    if (email && password) {
      localStorage.setItem("ema_token", "demo-token");
      setUser({ email });
    }
  }

  function logout() {
    localStorage.removeItem("ema_token");
    setUser(null);
  }

  function signup({ email, password }) {
    // TODO: call backend for actual signup
    localStorage.setItem("ema_token", "demo-token");
    setUser({ email });
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthCtx.Provider>
  );
}
