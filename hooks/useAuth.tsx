import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/mocks/data';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'tenant' | 'landlord') => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => void;
  loginWithApple: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = mockUsers.find(u => u.email === email);
    if (mockUser) {
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: 'tenant' | 'landlord') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      twoFactorEnabled: false,
      createdAt: new Date(),
    };
    setUser(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  }, []);

  const switchRole = useCallback(() => {
    if (user) {
      const newRole: 'tenant' | 'landlord' = user.role === 'tenant' ? 'landlord' : 'tenant';
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const loginWithApple = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const appleDemo = mockUsers.find(u => u.role === 'tenant') ?? mockUsers[0];
    setUser(appleDemo);
    await AsyncStorage.setItem('user', JSON.stringify(appleDemo));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const googleDemo = mockUsers.find(u => u.role === 'tenant') ?? mockUsers[0];
    setUser(googleDemo);
    await AsyncStorage.setItem('user', JSON.stringify(googleDemo));
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    switchRole,
    loginWithApple,
    loginWithGoogle,
  }), [user, isLoading, login, signup, logout, switchRole, loginWithApple, loginWithGoogle]);
});