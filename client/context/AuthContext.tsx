import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@shared/types";
import { seedUsers } from "@shared/seeds";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
  getAvailableUsers: () => User[];
  setUserRole: (role: UserRole) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("commutex_user");
    const savedRole = localStorage.getItem("commutex_role");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Use saved role or fall back to user's role
        const role = (savedRole as UserRole) || parsedUser.role || "PASSENGER";
        setUserRole(role);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("commutex_user");
        localStorage.removeItem("commutex_role");
      }
    }
  }, []);

  const login = (selectedUser: User) => {
    const role = selectedUser.role || "PASSENGER";
    setUser(selectedUser);
    setUserRole(role);
    localStorage.setItem("commutex_user", JSON.stringify(selectedUser));
    localStorage.setItem("commutex_role", role);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("commutex_user");
    localStorage.removeItem("commutex_role");
  };

  const getAvailableUsers = () => seedUsers;

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem("commutex_role", role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("commutex_user", JSON.stringify(updatedUser));
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    if (typeof roles === "string") return userRole === roles;
    return roles.includes(userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole,
        login,
        logout,
        getAvailableUsers,
        setUserRole: updateUserRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
