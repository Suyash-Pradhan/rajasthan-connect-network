
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, UserProfile, UserRole } from "../types/user";
import { mockUsers } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate with a backend API
    // For demo purposes, we'll use mock data
    try {
      const user = mockUsers.find((u) => u.email === email);
      
      if (user) {
        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "This email is already registered",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser: UserProfile = {
        id: `user${mockUsers.length + 1}`,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, we would send this to a backend API
      // For demo, we'll just simulate success
      
      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateUserProfile = async (updatedProfile: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast({
          title: "Update failed",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return false;
      }
      
      const updatedUser = {
        ...authState.user,
        ...updatedProfile,
      };
      
      // In a real app, we would send this to a backend API
      // For demo, we'll just update local storage
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
