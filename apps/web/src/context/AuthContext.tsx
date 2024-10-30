import React, { createContext, useContext, useState, ReactNode } from "react";

// Define AuthContext state
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  authenticateUser: (userData: any) => void;
  logout: () => void;
}

// Default values for the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Function to authenticat user in and update state
  const authenticateUser = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to log the user out and reset state
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  // Context value to be provided to consumers
  const value = { isAuthenticated, user, authenticateUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
