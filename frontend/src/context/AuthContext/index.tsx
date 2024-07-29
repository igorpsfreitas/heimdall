import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
};
