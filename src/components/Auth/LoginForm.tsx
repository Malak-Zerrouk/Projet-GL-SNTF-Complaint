import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Train, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'voyageur' as 'voyageur' | 'agent',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, formData.role);
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Train className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion SNTF
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre compte pour gérer vos réclamations
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="voyageur"
                    checked={formData.role === 'voyageur'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'voyageur' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Voyageur</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={formData.role === 'agent'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'agent' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Agent</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Pas encore de compte ? S'inscrire
              </button>
            </div>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-2">Comptes de démonstration :</p>
          <p>Voyageur: voyageur@example.com / password123</p>
          <p>Agent: agent@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}