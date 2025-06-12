import { useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from 'react-hot-toast';

// Mock users data - in a real app, this would come from an API
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'voyageur@example.com',
    name: 'Ahmed Bouhadjar',
    role: 'voyageur',
    phone: '+213 555 123 456',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    email: 'agent@example.com',
    name: 'Fatima Benali',
    role: 'agent',
    phone: '+213 555 987 654',
    createdAt: '2024-01-05T10:30:00Z',
  },
  {
    id: '3',
    email: 'mohamed.saidi@example.com',
    name: 'Mohamed Saidi',
    role: 'voyageur',
    phone: '+213 555 456 789',
    createdAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '4',
    email: 'amina.khelifi@example.com',
    name: 'Amina Khelifi',
    role: 'agent',
    phone: '+213 555 321 654',
    createdAt: '2024-01-08T09:15:00Z',
  },
  {
    id: '5',
    email: 'yacine.benaissa@example.com',
    name: 'Yacine Benaissa',
    role: 'voyageur',
    phone: '+213 555 789 123',
    createdAt: '2024-01-15T16:45:00Z',
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 1000);
  }, []);

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, ...userData } : user
      )
    );
  };

  const deleteUser = async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getUsersByRole = (role: 'voyageur' | 'agent') => {
    return users.filter(user => user.role === role);
  };

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
  };
}