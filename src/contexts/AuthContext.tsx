
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, ROLES } from "@/lib/constants";
import { User } from "@/types";

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@ttu.edu.gh",
    phone: "+233201234567",
    role: ROLES.SUPER_ADMIN,
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Main Rep",
    email: "rep@ttu.edu.gh",
    phone: "+233201234568",
    role: ROLES.MAIN_REP,
    createdAt: new Date("2023-01-02"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    name: "Assistant Rep",
    email: "assistant@ttu.edu.gh",
    phone: "+233201234569",
    role: ROLES.ASSISTANT_REP,
    createdAt: new Date("2023-01-03"),
    lastLogin: new Date(),
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Mock authentication for now
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (foundUser && password === "password") {
        // This is a mock password check - in real app this would be a proper auth flow
        // Update last login
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date(),
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
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
