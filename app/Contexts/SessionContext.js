// contexts/SessionContext.js
"use client"
import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken,
        checkTokenValidity: () => !!token, // Replace with your actual validation logic
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};