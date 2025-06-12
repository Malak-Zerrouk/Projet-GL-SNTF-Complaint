import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { toast } from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'voyageur@example.com',
    name: 'Ahmed Bouhadjar',
    role: 'voyageur' as const,
    phone: '+213 555 123 456',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'agent@example.com',
    name: 'Fatima Benali',
    role: 'agent' as const,
    phone: '+213 555 987 654',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sntf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'voyageur' | 'agent') => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('sntf_user', JSON.stringify(foundUser));
      toast.success(`Bienvenue, ${foundUser.name}!`);
    } else {
      toast.error('Email, mot de passe ou rôle incorrect');
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('sntf_user', JSON.stringify(newUser));
    toast.success('Compte créé avec succès!');
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sntf_user');
    toast.success('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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