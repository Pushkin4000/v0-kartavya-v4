
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from './types';
import { mockUsers } from './mock-data';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('kartavya_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to validate credentials
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - find user by username
      // In real implementation, this would check password hash against DB
      const foundUser = mockUsers.find(u => u.username === username);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('kartavya_user', JSON.stringify(foundUser));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kartavya_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would create a new user in the database
      // For demo, we'll pretend to create a new user
      const existingUser = mockUsers.find(u => u.username === userData.username || u.email === userData.email);
      
      if (existingUser) {
        toast({
          title: "Registration Failed",
          description: "Username or email already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create a new user (in a real app, this would be saved to DB)
      const newUser: User = {
        id: `mock-${Date.now()}`, // Generate a string ID instead of a number
        username: userData.username!,
        name: userData.name!,
        email: userData.email!,
        phone: userData.phone,
        address: userData.address,
        userType: userData.userType as UserType,
        registrationNumber: userData.registrationNumber,
        peopleServed: userData.peopleServed,
        providerType: userData.providerType,
        createdAt: new Date(),
      };
      
      // In a real app, we would save to DB here
      // For our mock example, we just set the current user
      setUser(newUser);
      localStorage.setItem('kartavya_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Kartavya, ${newUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
