// contexts/SessionContext.js
"use client"
import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwt_decode(token);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const SessionProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper to refresh session from localStorage
  function refreshSession() {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      if (isTokenValid(t)) {
        setToken(t);
        try {
          const decoded = jwt_decode(t);
          setAdmin(decoded.admin || 0);
        } catch (e) {
          setAdmin(0);
        }
      } else {
        setToken(null);
        setAdmin(0);
        localStorage.removeItem("token");
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSession();
    // Listen for token changes in other tabs
    function handleStorage(e) {
      if (e.key === "token") {
        refreshSession();
    }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (loading) return null; // or a spinner

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken,
        admin,
        checkTokenValidity: () => isTokenValid(token),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};